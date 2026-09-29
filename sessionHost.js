// ============================================================
// sessionHost.js — runs MANY WhatsApp bot sessions inside ONE Node
// process (instead of one 100–150 MB process per session).
//
// How it keeps sessions apart without touching case.js / bot.js:
//   • Every project .js file (bot.js, case.js, cases/*.js, ...) is
//     loaded ONCE PER SESSION through our own loader, so module-level
//     state (menu state, economy, antispam...) is private to a session.
//     node_modules packages (baileys, sharp, axios...) are loaded once
//     and SHARED — that is where the memory saving comes from.
//   • Each session gets its own `process` facade (env, cwd, exit, send,
//     on/once), its own `global` object, its own console + timers.
//     process.exit() therefore stops ONE session, not the server.
//   • './tmp' and './database' string paths are rewritten at load time
//     to <session dir>/tmp and <session dir>/database.
//   • Every WhatsApp socket a session opens is tracked and closed when
//     the session stops, and all its timers are cleared (no leaks).
//
// API mirrors a child_process: startSession() returns an EventEmitter
// with .kill(), .send(), and an 'exit' event carrying the exit code.
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const util = require('util');
const Module = require('module');
const { EventEmitter } = require('events');

const ROOT = __dirname;

// Files that must stay ONE real instance in the main process.
const SHARED_FILES = new Set(['instanceManager.js', 'sessionStore.js', 'sessionHost.js', 'server.js', 'telegramPairBot.js']);

// ── never let one session take the whole server down ─────────────────
if (!global.__sessionHostGuards) {
    global.__sessionHostGuards = true;
    process.on('uncaughtException', (e) => console.error('[host] uncaughtException:', (e && e.stack) || e));
    process.on('unhandledRejection', (e) => console.error('[host] unhandledRejection:', (e && e.message) || e));
}

// ── logger handed to baileys (its default 'info' level is very noisy) ─
let baseLogger = null;
function getBaseLogger() {
    if (baseLogger) return baseLogger;
    try {
        const pino = require('pino');
        baseLogger = pino({ level: process.env.BAILEYS_LOG_LEVEL || 'error' });
    } catch (_) {
        const noop = () => {};
        baseLogger = { level: 'silent', child: () => baseLogger, trace: noop, debug: noop, info: noop, warn: noop, error: noop, fatal: noop };
    }
    return baseLogger;
}

// ── source rewrite: relative data paths -> per-session absolute paths ─
function rewriteSource(src) {
    return src
        // 'x' style:   './tmp/a.mp3'  ->  process.cwd()+'/tmp/a.mp3'
        .replace(/(?<!require\(\s*)'\.\/(tmp|database)(?=[\/'])/g, "process.cwd()+'/$1")
        // `x` style:   `./tmp/${n}`   ->  `${process.cwd()}/tmp/${n}`
        .replace(/(?<!require\(\s*)`\.\/(tmp|database)(?=[\/`])/g, '`${process.cwd()}/$1');
}

function resolveFile(p) {
    const tries = [p, p + '.js', p + '.json', path.join(p, 'index.js')];
    for (const t of tries) {
        try { if (fs.statSync(t).isFile()) return t; } catch (_) {}
    }
    return null;
}

// ── per-session context ──────────────────────────────────────────────
function createContext({ sessionId, dir, env, onMessage, onLog, handle }) {
    const ctx = {
        sessionId, dir, handle,
        stopped: false,
        cache: new Map(),
        timers: new Set(),
        sockets: new Set(),
        listeners: { message: [], SIGTERM: [], SIGINT: [] },
        gStore: Object.create(null),
        env: Object.assign({}, process.env, env || {}),
        onMessage, onLog
    };
    ctx.logger = getBaseLogger().child({ session: String(sessionId).slice(0, 20) });

    // console -> prefixed session log (also kept in the panel's log buffer)
    const mk = (lvl) => (...a) => { if (!ctx.stopped) { try { onLog(util.format(...a) + '\n', lvl); } catch (_) {} } };
    ctx.console = Object.assign(Object.create(console), {
        log: mk('log'), info: mk('info'), debug: mk('debug'), warn: mk('warn'), error: mk('error'), trace: mk('trace')
    });

    // tracked timers (cleared on stop) whose callbacks can't crash the server
    const safe = (fn, args) => {
        try {
            const r = fn(...args);
            if (r && typeof r.catch === 'function') r.catch((e) => ctx.console.error('Timer error:', (e && e.message) || e));
        } catch (e) { ctx.console.error('Timer error:', (e && e.message) || e); }
    };
    const dead = () => ({ ref() { return this; }, unref() { return this; }, hasRef() { return false; }, refresh() { return this; }, [Symbol.toPrimitive]: () => 0 });
    ctx.setTimeout = (fn, ms, ...args) => {
        if (ctx.stopped || typeof fn !== 'function') return dead();
        const h = setTimeout(() => { ctx.timers.delete(h); safe(fn, args); }, ms);
        ctx.timers.add(h);
        return h;
    };
    ctx.setInterval = (fn, ms, ...args) => {
        if (ctx.stopped || typeof fn !== 'function') return dead();
        const h = setInterval(() => safe(fn, args), ms);
        ctx.timers.add(h);
        return h;
    };
    ctx.setImmediate = (fn, ...args) => {
        if (ctx.stopped || typeof fn !== 'function') return dead();
        const h = setImmediate(() => { ctx.timers.delete(h); safe(fn, args); });
        ctx.timers.add(h);
        return h;
    };
    ctx.clearTimeout = (h) => { if (h) { ctx.timers.delete(h); try { clearTimeout(h); } catch (_) {} } };
    ctx.clearInterval = (h) => { if (h) { ctx.timers.delete(h); try { clearInterval(h); } catch (_) {} } };
    ctx.clearImmediate = (h) => { if (h) { ctx.timers.delete(h); try { clearImmediate(h); } catch (_) {} } };
    ctx.setTimeout[util.promisify.custom] = (ms, v) => new Promise((r) => ctx.setTimeout(r, ms, v));

    // `global` facade: writes stay inside this session, reads fall through
    ctx.global = new Proxy(globalThis, {
        get(t, p) {
            if (p in ctx.gStore) return ctx.gStore[p];
            if (p === 'global' || p === 'globalThis') return ctx.global;
            return Reflect.get(t, p);
        },
        set(t, p, v) { ctx.gStore[p] = v; return true; },
        has(t, p) { return p in ctx.gStore || p in t; },
        deleteProperty(t, p) { delete ctx.gStore[p]; return true; }
    });

    // `process` facade: env/cwd/exit/send/on are per-session, the rest is real
    const own = {
        env: ctx.env,
        cwd: () => ctx.dir,
        chdir: () => {},
        exit: (code) => ctx.finish(code == null ? 0 : code),
        send: (msg) => { if (!ctx.stopped) { try { onMessage(msg); } catch (_) {} } return true; },
        connected: true
    };
    const lst = ctx.listeners;
    const facade = new Proxy(process, {
        get(t, p) {
            if (p in own) return own[p];
            if (p === 'on' || p === 'addListener') return (ev, fn) => { if (lst[ev]) lst[ev].push(fn); return facade; };
            if (p === 'once') return (ev, fn) => {
                if (!lst[ev]) return facade;
                const w = (...a) => { const i = lst[ev].indexOf(w); if (i >= 0) lst[ev].splice(i, 1); fn(...a); };
                lst[ev].push(w);
                return facade;
            };
            if (p === 'off' || p === 'removeListener') return (ev, fn) => { if (lst[ev]) lst[ev] = lst[ev].filter((x) => x !== fn); return facade; };
            if (p === 'removeAllListeners') return (ev) => { if (ev && lst[ev]) lst[ev] = []; return facade; };
            const v = Reflect.get(t, p, t);
            return typeof v === 'function' ? v.bind(t) : v;
        },
        set(t, p, v) { own[p] = v; return true; },
        has(t, p) { return p in own || p in t; }
    });
    ctx.process = facade;

    // stop everything this session owns; safe to call twice
    ctx.finish = (code) => {
        if (ctx.stopped) return;
        ctx.stopped = true;
        for (const h of ctx.timers) { try { clearTimeout(h); clearInterval(h); clearImmediate(h); } catch (_) {} }
        ctx.timers.clear();
        for (const s of ctx.sockets) {
            try { if (s.ev && s.ev.removeAllListeners) s.ev.removeAllListeners(); } catch (_) {}
            try { s.end(new Error('session stopped')); } catch (_) {}
            try { if (s.ws && s.ws.close) s.ws.close(); } catch (_) {}
        }
        ctx.sockets.clear();
        ctx.cache.clear();
        ctx.listeners.message = []; ctx.listeners.SIGTERM = []; ctx.listeners.SIGINT = [];
        for (const k of Object.keys(ctx.gStore)) delete ctx.gStore[k];
        setImmediate(() => handle.emit('exit', code));
    };

    return ctx;
}

// ── baileys wrapper: track every socket + quiet default logger ───────
function wrapBaileys(ctx, mod) {
    const orig = mod.default || mod.makeWASocket;
    const wrapped = function makeWASocket(cfg) {
        if (ctx.stopped) throw new Error('session stopped');
        const conf = Object.assign({}, cfg || {});
        if (!conf.logger) conf.logger = ctx.logger;
        const sock = orig(conf);
        ctx.sockets.add(sock);
        return sock;
    };
    const out = {};
    for (const k of Object.keys(mod)) out[k] = mod[k];
    out.default = wrapped;
    out.makeWASocket = wrapped;
    return out;
}

// ── the per-session module loader ────────────────────────────────────
function makeRequire(ctx, fromFile) {
    const dir = path.dirname(fromFile);
    const real = Module.createRequire(fromFile);

    const req = function (id) {
        if (typeof id === 'string' && /baileys/i.test(id) && !id.startsWith('.')) {
            if (!ctx.baileys) ctx.baileys = wrapBaileys(ctx, real(id));
            return ctx.baileys;
        }
        if (typeof id === 'string' && (id.startsWith('./') || id.startsWith('../') || path.isAbsolute(id))) {
            const abs = resolveFile(path.resolve(dir, id));
            if (abs && abs.startsWith(ROOT + path.sep) && !abs.includes(path.sep + 'node_modules' + path.sep)
                && !SHARED_FILES.has(path.basename(abs))) {
                return loadFile(ctx, abs);
            }
            return real(id);
        }
        return real(id);
    };
    req.resolve = (id) => {
        if (typeof id === 'string' && (id.startsWith('./') || id.startsWith('../'))) {
            const abs = resolveFile(path.resolve(dir, id));
            if (abs) return abs;
        }
        return real.resolve(id);
    };
    // `delete require.cache[file]` (hot-reload of commands) clears THIS session's copy only
    req.cache = new Proxy({}, {
        deleteProperty(t, key) { ctx.cache.delete(String(key)); return true; },
        get() { return undefined; },
        has(t, key) { return ctx.cache.has(String(key)); },
        ownKeys() { return Array.from(ctx.cache.keys()); },
        getOwnPropertyDescriptor(t, key) { return ctx.cache.has(String(key)) ? { configurable: true, enumerable: true, value: ctx.cache.get(String(key)) } : undefined; }
    });
    req.main = undefined;
    return req;
}

function loadFile(ctx, abs) {
    const hit = ctx.cache.get(abs);
    if (hit) return hit.exports;

    if (abs.endsWith('.json')) {
        const mod = { exports: JSON.parse(fs.readFileSync(abs, 'utf8')) };
        ctx.cache.set(abs, mod);
        return mod.exports;
    }

    const mod = { exports: {}, id: abs, filename: abs, loaded: false, children: [], paths: [] };
    ctx.cache.set(abs, mod); // set first so circular requires work
    let src = fs.readFileSync(abs, 'utf8');
    if (src.charCodeAt(0) === 0xFEFF) src = src.slice(1);
    if (src.startsWith('#!')) src = '//' + src;
    src = rewriteSource(src);

    const wrapper = '(function (exports, require, module, __filename, __dirname, process, global, globalThis, console, ' +
        'setTimeout, setInterval, setImmediate, clearTimeout, clearInterval, clearImmediate) {' + src + '\n})';
    try {
        const fn = new vm.Script(wrapper, { filename: abs }).runInThisContext();
        const req = makeRequire(ctx, abs);
        mod.require = req;
        fn.call(mod.exports, mod.exports, req, mod, abs, path.dirname(abs), ctx.process, ctx.global, ctx.global, ctx.console,
            ctx.setTimeout, ctx.setInterval, ctx.setImmediate, ctx.clearTimeout, ctx.clearInterval, ctx.clearImmediate);
        mod.loaded = true;
    } catch (e) {
        ctx.cache.delete(abs);
        throw e;
    }
    return mod.exports;
}

// ── public API ───────────────────────────────────────────────────────
const live = new Map(); // sessionId -> ctx

/**
 * @param {object} o
 * @param {string} o.sessionId
 * @param {string} o.dir        this session's own folder (cwd / tmp / database live here)
 * @param {object} o.env        SESSION_ID, OWNER_NUMBER, PREFIX ... (merged over process.env)
 * @param {function} o.onMessage  (msg) => void   what the bot sends up via process.send
 * @param {function} o.onLog      (text) => void
 * @returns EventEmitter with pid, kill(signal), send(msg); emits 'exit' (code)
 */
function startSession({ sessionId, dir, env, onMessage, onLog }) {
    const handle = new EventEmitter();
    handle.pid = process.pid;
    const ctx = createContext({ sessionId, dir, env, onMessage: onMessage || (() => {}), onLog: onLog || (() => {}), handle });
    live.set(sessionId, ctx);
    handle.on('exit', () => { if (live.get(sessionId) === ctx) live.delete(sessionId); });

    // Deliver a message to the bot's process.on/once('message') listeners (the 'init' blob)
    handle.send = (msg) => {
        if (ctx.stopped) return false;
        for (const fn of ctx.listeners.message.slice()) { try { fn(msg); } catch (e) { ctx.console.error('IPC error:', e.message); } }
        return true;
    };

    // Graceful stop: let bot.js flush its session (SIGTERM handler) then tear down.
    handle.kill = (signal = 'SIGTERM') => {
        if (ctx.stopped) return true;
        if (signal === 'SIGKILL') { ctx.finish(null); return true; }
        for (const fn of ctx.listeners.SIGTERM.slice()) { try { fn(signal); } catch (_) {} }
        const t = setTimeout(() => ctx.finish(0), 1000); // real timer: guarantees the stop
        if (t.unref) t.unref();
        return true;
    };

    try {
        fs.mkdirSync(dir, { recursive: true });
        loadFile(ctx, path.join(ROOT, 'bot.js'));
    } catch (e) {
        ctx.console.error(`❌ Failed to start session: ${e.stack || e.message}`);
        ctx.finish(1);
    }
    return handle;
}

function stats() {
    return { sessions: live.size, rssMB: Math.round(process.memoryUsage().rss / 1048576), heapMB: Math.round(process.memoryUsage().heapUsed / 1048576) };
}

/** Container memory limit in MB (cgroup v2 / v1), or null if unknown. */
function memoryLimitMB() {
    for (const f of ['/sys/fs/cgroup/memory.max', '/sys/fs/cgroup/memory/memory.limit_in_bytes']) {
        try {
            const raw = fs.readFileSync(f, 'utf8').trim();
            const n = Number(raw);
            if (Number.isFinite(n) && n > 0 && n < 1e15) return Math.round(n / 1048576);
        } catch (_) {}
    }
    return null;
}

module.exports = { startSession, stats, memoryLimitMB, _rewriteSource: rewriteSource };
