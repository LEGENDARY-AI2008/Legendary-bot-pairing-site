const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const githubSync = require('./githubSync');
const sessionStore = require('./sessionStore');

const DB_FILE = path.join(__dirname, 'instances', 'instances.json');
const INSTANCES_DIR = path.join(__dirname, 'instances');

// No cap — unlimited concurrent instances.
// Render RAM is limited (~100-150MB per bot process). Set MAX_INSTANCES in Render env to protect the box.
const MAX_CONCURRENT_INSTANCES = parseInt(process.env.MAX_INSTANCES || '0', 10) || Infinity;

// Last log lines per instance kept IN MEMORY (no output.log file eating disk)
const logBuffers = new Map();
function pushLog(id, chunk) {
    let buf = logBuffers.get(id);
    if (!buf) { buf = []; logBuffers.set(id, buf); }
    String(chunk).split('\n').forEach(l => { if (l.trim()) buf.push(l); });
    if (buf.length > 200) buf.splice(0, buf.length - 200);
}

function ensureDB() {
    if (!fs.existsSync(INSTANCES_DIR)) fs.mkdirSync(INSTANCES_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
}

function loadDB() {
    ensureDB();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const runningProcesses = new Map(); // sessionId -> child process object (in-memory only)

function countRunning() {
    const db = loadDB();
    return Object.values(db).filter(i => i.status === 'running').length;
}

function getInstance(sessionId) {
    const db = loadDB();
    return db[sessionId] || null;
}

/**
 * Messages coming up from a bot child process.
 *  - session       : its latest tiny session blob -> memory + GitHub
 *  - deploy-paired : someone paired a NEW number via the .pair command inside a bot
 */
function handleChildMessage(sessionId, msg) {
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'session' && msg.blob) {
        sessionStore.set(sessionId, msg.blob);
    } else if (msg.type === 'deploy-paired' && msg.instanceId && msg.blob) {
        deployInstanceFromPairing({
            instanceId: msg.instanceId, blob: msg.blob, fullBlob: msg.fullBlob,
            botConfig: msg.botConfig
        });
    }
}

/**
 * Deploys a bot instance for the given session — one per session ID, enforced.
 * @param {object} opts { sessionId, botConfig: { ownerNumber, ownerName, botName, prefix, workType } }
 * @returns {object} { success, message }
 */
function deployInstance({ sessionId, botConfig, spawn: shouldSpawn = true }) {
    const db = loadDB();

    if (db[sessionId] && db[sessionId].status === 'running') {
        return { success: false, message: 'You already have a bot deployed. Stop it first to redeploy.' };
    }

    if (countRunning() >= MAX_CONCURRENT_INSTANCES) {
        return { success: false, message: 'Server is at capacity right now. Please try again later.' };
    }

    const instanceDir = path.join(INSTANCES_DIR, sessionId);
    if (!fs.existsSync(instanceDir)) fs.mkdirSync(instanceDir, { recursive: true });

    // Config goes in through the child's environment — no config.env file.
    const childEnv = {
        ...process.env,
        SESSION_ID: sessionId,
        OWNER_NUMBER: String(botConfig.ownerNumber),
        OWNER_NAME: botConfig.ownerName || 'Owner',
        BOT_NAME: botConfig.botName || 'LËGĒNDÃRY BØT',
        PREFIX: botConfig.prefix || '.',
        WORKTYPE: botConfig.workType || 'private'
    };

    const bootBlob = sessionStore.takeBootBlob(sessionId);
    if (!bootBlob && shouldSpawn) {
        return { success: false, message: 'No saved session for this bot. Pair again.' };
    }

    // spawn: false — used by server.js (Render) now that actual bot
    // processes run on Pterodactyl via multibot.js. Render still needs
    // this function to register the instance (config.env + a db entry
    // for multibot.js's GitHub poll to pick up) without ever running the
    // bot itself — Render running it too is exactly the double-deploy
    // this flag exists to prevent.
    if (!shouldSpawn) {
        const entry = {
            sessionId,
            status: 'pending', // NOT 'running' — this host isn't running it; deliberately lets a real host's deployInstance() proceed instead of skipping via the guard above
            registeredAt: new Date().toISOString(),
            botConfig,
            intentionalStop: false,
            crashCount: db[sessionId]?.crashCount || 0
        };
        db[sessionId] = entry;
        saveDB(db);
        // Merge just this one entry into GitHub — never a bulk overwrite
        // of instances.json from this host. See pushInstanceEntry's own
        // comment in githubSync.js for why that distinction matters.
        githubSync.pushInstanceEntry(sessionId, entry).catch(() => {});
        return { success: true, message: 'Instance registered (not spawned on this host).' };
    }

    // NOTE: used to copy the entire codebase (cases/, allfunc/, media/,
    // setting/, node_modules resolution, etc.) into every instance's own
    // folder — that's what was filling up disk (N instances = N full
    // copies of the same code). Every instance now runs the ONE shared
    // bot.js/case.js straight from this project root, with `cwd` pointed
    // at its own instanceDir below. bot.js, case.js, and Settings.js all
    // resolve their per-user data (session/, config.env, database/) via
    // process.cwd() rather than __dirname, so this still isolates each
    // instance's creds/settings/economy/etc — only the CODE is now shared.
    const child = spawn('node', [path.join(__dirname, 'bot.js')], {
        cwd: instanceDir,
        env: childEnv,
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        detached: false
    });

    // Hand the session straight to the child over IPC (instant, no disk, no GitHub round trip).
    child.send({ type: 'init', blob: bootBlob });
    // The child sends back its updated (size-capped) session; we keep it + save it to GitHub.
    child.on('message', (msg) => handleChildMessage(sessionId, msg));

    const logPrefix = `[bot:${sessionId.slice(0, 20)}]`;
    child.stdout.on('data', d => { pushLog(sessionId, d); process.stdout.write(`${logPrefix} ${d}`); });
    child.stderr.on('data', d => { pushLog(sessionId, d); process.stderr.write(`${logPrefix} ${d}`); });

    runningProcesses.set(sessionId, child);

    db[sessionId] = {
        sessionId,
        pid: child.pid,
        status: 'running',
        deployedAt: new Date().toISOString(),
        botConfig,
        intentionalStop: false,
        crashCount: db[sessionId]?.crashCount || 0
    };
    saveDB(db);
    githubSync.pushInstanceEntry(sessionId, db[sessionId]).catch(() => {});

    // If it stays up for 60s, treat it as healthy and clear the crash counter
    // so a bot that had trouble earlier isn't permanently capped.
    setTimeout(() => {
        const check = loadDB();
        if (check[sessionId] && check[sessionId].status === 'running') {
            check[sessionId].crashCount = 0;
            saveDB(check);
        }
    }, 60000);

    child.on('exit', (code) => {
        const current = loadDB();
        if (!current[sessionId]) {
            runningProcesses.delete(sessionId);
            return;
        }

        // Exit code 75 is bot.js's own signal for "this WhatsApp session
        // logged out permanently" (DisconnectReason.loggedOut) — see
        // bot.js's connection.update handler. That's not a crash and a
        // respawn can never fix it (the creds are dead), so this fully
        // removes the instance — local folder, DB entry, and its GitHub
        // backups — instead of leaving a dead folder taking up space
        // forever, which is what was happening before.
        if (code === 75) {
            runningProcesses.delete(sessionId);
            console.log(`👋 ${sessionId} logged out — removing instance.`);
            removeInstance(sessionId);
            return;
        }

        current[sessionId].status = 'stopped';
        current[sessionId].exitCode = code;

        const wasIntentional = current[sessionId].intentionalStop;
        runningProcesses.delete(sessionId);

        if (wasIntentional) {
            saveDB(current);
            return;
        }

        // Unexpected exit (crash, or a self-restart like .update calling
        // process.exit(0)) — auto-respawn instead of leaving the bot dead.
        // Capped to avoid an infinite respawn loop if something is
        // fundamentally broken (bad session, missing file, etc.).
        current[sessionId].crashCount = (current[sessionId].crashCount || 0) + 1;
        saveDB(current);

        if (current[sessionId].crashCount > 5) {
            console.log(`⚠️ ${sessionId} exited ${current[sessionId].crashCount} times in a row — not auto-respawning. Manual redeploy required.`);
            return;
        }

        console.log(`🔄 ${sessionId} exited unexpectedly (code ${code}) — auto-respawning in 3s...`);
        setTimeout(() => {
            const latest = loadDB();
            if (!latest[sessionId] || latest[sessionId].intentionalStop) return; // stopped in the meantime
            deployInstance({ sessionId, botConfig: latest[sessionId].botConfig });
        }, 3000);
    });

    return { success: true, message: 'Bot deployed successfully.' };
}

/**
 * Deploys straight from a freshly-paired WhatsApp connection's local auth
 * files — no session ID lookup, no separate step for the user. Copies the
 * real creds into the new instance's session folder, AND pushes the same
 * bundle to GitHub as sessions/<instanceId>.json — the actual bot process
 * usually runs on a different host now (multibot.js on Pterodactyl), which
 * only ever fetches sessions from GitHub, never from this host's local
 * disk. Skipping this push is exactly what left Telegram-paired bots
 * stuck respawning with "No session found on GitHub" — the website's own
 * pairing flow separately called sessionManager.createSession() to do
 * this, but nothing else that calls this function did, so it's done here
 * now instead, once, for every caller.
 * @param {object} opts { instanceId, authDir, botConfig }
 *   instanceId: any unique folder-safe string (not a real lookup key)
 *   authDir: local folder containing creds.json etc. from the pairing socket
 */
function deployInstanceFromPairing({ instanceId, blob, fullBlob, botConfig, spawn: shouldSpawn = true }) {
    // No session folder, no file copies: the session is just a small string.
    sessionStore.set(instanceId, blob);          // memory + GitHub (one file)
    sessionStore.pushNow(instanceId).catch(() => {});  // save to GitHub right away
    sessionStore.setFullOnce(instanceId, fullBlob || blob); // child boots with the uncapped keys once
    return deployInstance({ sessionId: instanceId, botConfig, spawn: shouldSpawn });
}

/**
 * Called once on process startup. Every entry in instances.json still
 * marked "running" from before this restart is actually dead now — the
 * real child processes don't survive a restart, only their DB record
 * does. Without this, deployInstance would also just refuse to redeploy
 * any of them ("You already have a bot deployed") since it trusts that
 * same stale flag. Resets each one to 'stopped' first, then redeploys
 * through the normal, proven deployInstance path — same codebase copy,
 * same crash-respawn wiring, nothing new to trust here.
 */
async function restoreInstances() {
    const db = loadDB();
    // 'pending' = registered earlier by the old Render->panel flow, never started. Start them now.
    const toRestore = Object.values(db).filter(i =>
        (i.status === 'running' || i.status === 'pending' || i.status === 'stopped') && !i.intentionalStop && (i.crashCount || 0) <= 5);

    if (!toRestore.length) {
        console.log('♻️  No instances to restore.');
        return;
    }

    console.log(`♻️  Restoring ${toRestore.length} instance(s)...`);

    let started = 0;
    for (const instance of toRestore) {
        try {
            const blob = await sessionStore.ensure(instance.sessionId);
            if (!blob) { console.log(`⚠️  ${instance.sessionId}: no session on GitHub — skipped.`); continue; }
            sessionStore.setFullOnce(instance.sessionId, blob);
            const fresh = loadDB();
            if (fresh[instance.sessionId]) { fresh[instance.sessionId].status = 'stopped'; saveDB(fresh); }
            const result = deployInstance({ sessionId: instance.sessionId, botConfig: instance.botConfig });
            if (result.success) started++;
            else console.log(`⚠️  Failed to restore ${instance.sessionId}: ${result.message}`);
        } catch (e) {
            console.log(`❌ Failed to restore ${instance.sessionId} (threw): ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 2500)); // stagger so WhatsApp + RAM aren't hit at once
    }
    console.log(`♻️  Restore done — ${started} bot(s) started.`);
}

/**
 * Fully removes an instance — kills the process if still running, deletes
 * its DB record, and (crucially) deletes its on-disk folder, including the
 * full duplicated codebase copy and its own session/ auth files. Call this
 * when a WhatsApp session logs out / disconnects permanently — e.g. from
 * bot.js's connection.update handler on DisconnectReason.loggedOut — NOT
 * on a normal reconnect-able drop, since those should keep their session
 * and just reconnect.
 */
function removeInstance(sessionId) {
    const db = loadDB();
    if (!db[sessionId]) {
        return { success: false, message: 'No such instance.' };
    }

    const child = runningProcesses.get(sessionId);
    if (child) {
        child.kill();
        runningProcesses.delete(sessionId);
    }

    delete db[sessionId];
    saveDB(db);
    sessionStore.remove(sessionId);
    logBuffers.delete(sessionId);

    const instanceDir = path.join(INSTANCES_DIR, sessionId);
    try {
        if (fs.existsSync(instanceDir)) {
            fs.rmSync(instanceDir, { recursive: true, force: true });
            console.log(`🗑️  removeInstance: deleted ${sessionId} (logged out) — folder + DB record removed.`);
        }
    } catch (e) {
        console.log(`⚠️  removeInstance: couldn't delete folder for ${sessionId}: ${e.message}`);
    }

    // Also stop backing this dead session up forever — fire-and-forget,
    // never blocks the local cleanup above even if GitHub is unreachable.
    // This is the piece that was missing: local folders were being
    // deleted (when this ran at all) but the GitHub copies never were,
    // so sessions/<id>.json and its instances.json entry just piled up.
    githubSync.deleteSessionFiles(sessionId).catch(() => {});
    githubSync.deleteInstanceEntry(sessionId).catch(() => {});

    return { success: true, message: 'Instance removed.' };
}

/**
 * Sweeps instances/ for folders that have no matching DB entry (orphans
 * left behind by crashes, manual edits, or older code before removeInstance
 * existed) and deletes them. Safe to call on boot alongside restoreInstances().
 */
function cleanupOrphanedInstances() {
    const db = loadDB();
    if (!fs.existsSync(INSTANCES_DIR)) return;

    let removed = 0;
    for (const entry of fs.readdirSync(INSTANCES_DIR)) {
        const entryPath = path.join(INSTANCES_DIR, entry);
        if (entry === 'instances.json') continue;
        if (!fs.statSync(entryPath).isDirectory()) continue;
        if (db[entry]) continue; // still a tracked instance — leave it

        try {
            fs.rmSync(entryPath, { recursive: true, force: true });
            removed++;
        } catch (e) {
            console.log(`⚠️  cleanupOrphanedInstances: couldn't delete ${entry}: ${e.message}`);
        }
    }
    if (removed) console.log(`🗑️  cleanupOrphanedInstances: removed ${removed} orphaned instance folder(s).`);
}

/**
 * Restarts a single running instance in place, redeploying it with its
 * existing botConfig so it picks up any code changes on disk (e.g. after
 * `.update` rewrote the shared bot.js/case.js). Marks it as an intentional
 * stop first so the crash-auto-respawn logic in deployInstance's exit
 * handler doesn't treat this as a crash — that path increments a crash
 * counter capped at 5, and repeated `.update`-triggered restarts would
 * otherwise burn through that cap for reasons that have nothing to do with
 * the instance actually being unstable. We redeploy explicitly instead.
 */
function restartInstance(sessionId) {
    const db = loadDB();
    const instance = db[sessionId];
    if (!instance || instance.status !== 'running') {
        return { success: false, message: 'No running instance found for this session.' };
    }

    db[sessionId].intentionalStop = true;
    saveDB(db);

    const child = runningProcesses.get(sessionId);
    if (child) child.kill();
    runningProcesses.delete(sessionId);

    setTimeout(() => {
        deployInstance({ sessionId, botConfig: instance.botConfig });
    }, 1000);

    return { success: true, message: 'Restarting...' };
}

/**
 * Restarts every currently-running instance, staggered 3s apart so the
 * server isn't killing + respawning all of them in the same instant.
 * Call this after `.update` rewrites the shared code — already-running
 * instances still have the OLD code loaded in memory and won't pick up
 * the change until they restart some other way otherwise.
 */
function restartAllInstances() {
    const db = loadDB();
    const running = Object.values(db).filter(i => i.status === 'running');

    if (!running.length) {
        console.log('♻️  restartAllInstances: no running instances to restart.');
        return { success: true, restarted: 0 };
    }

    console.log(`♻️  restartAllInstances: restarting ${running.length} instance(s) to pick up updated code...`);
    running.forEach((instance, index) => {
        setTimeout(() => restartInstance(instance.sessionId), index * 3000);
    });

    return { success: true, restarted: running.length };
}

/**
 * Stops a running instance for the given session.
 */
function stopInstance(sessionId) {
    const db = loadDB();
    if (!db[sessionId] || db[sessionId].status !== 'running') {
        return { success: false, message: 'No running bot found for this session.' };
    }

    const child = runningProcesses.get(sessionId);
    if (child) {
        child.kill();
    }

    db[sessionId].status = 'stopped';
    db[sessionId].intentionalStop = true;
    saveDB(db);
    runningProcesses.delete(sessionId);

    return { success: true, message: 'Bot stopped.' };
}

/**
 * Gets the last N lines of an instance's log output — useful for a basic status view.
 */
function getInstanceLogs(sessionId, lines = 50) {
    return (logBuffers.get(sessionId) || []).slice(-lines).join('\n');
}

/** Graceful shutdown (Render SIGTERM): stop bots so they flush sessions, then save everything. */
async function shutdownAll() {
    for (const child of runningProcesses.values()) { try { child.kill('SIGTERM'); } catch (_) {} }
    await new Promise(r => setTimeout(r, 2000)); // let children send their final session over IPC
    await sessionStore.flushAll();
}

module.exports = {
    shutdownAll,
    deployInstance,
    deployInstanceFromPairing,
    restoreInstances,
    stopInstance,
    removeInstance,
    restartInstance,
    restartAllInstances,
    cleanupOrphanedInstances,
    getInstance,
    getInstanceLogs,
    countRunning,
    MAX_CONCURRENT_INSTANCES
};
