// ============================================================
// compactAuth.js — Baileys auth state that lives in MEMORY and is
// saved as ONE tiny string (never a folder, never hundreds of files).
//
// useMultiFileAuthState writes creds.json + ~800 pre-key files +
// a file per contact/group = 200-550KB and a whole folder per user.
// This replaces it:
//   • runtime  : everything stays in RAM, bot behaves exactly the same
//   • snapshot : creds + essential keys, brotli-compressed, base64,
//                HARD-CAPPED (default 45,000 chars, always < 50KB)
//   • persist  : handed to onPersist(blob) — caller decides where it
//                goes (IPC -> parent -> GitHub). No disk writes here.
// ============================================================
const zlib = require('zlib');
const v8 = require('v8');
const crypto = require('crypto');
const { initAuthCreds, BufferJSON, proto } = require('@boruto_vk7/baileys');

const PREFIX = 'L2.';      // full/legacy format (keys included) — only used in RAM or for old data
const TINY = 'L3.';        // ~1KB: creds only, public keys derived, binary packed
const MAX_STORED = parseInt(process.env.SESSION_MAX_BYTES || '45000', 10);
const MAX_PREKEYS = parseInt(process.env.SESSION_MAX_PREKEYS || '24', 10);
const DROP_TYPES = new Set(['app-state-sync-version']); // big + rebuilt by WhatsApp on demand
const MANDATORY = new Set(['app-state-sync-key']);      // never dropped

const KNOWN_TYPES = [
    'app-state-sync-version', 'app-state-sync-key', 'sender-key-memory', 'sender-key',
    'identity-key', 'lid-mapping', 'device-list', 'pre-key', 'session', 'tctoken'
].sort((a, b) => b.length - a.length);

// ── L3: the ~1KB format. Only what WhatsApp needs to log the device back in. ──
// Pre-keys / Signal sessions / sender-keys are NOT saved: Baileys makes new pre-keys and
// WhatsApp re-negotiates sessions by itself (contacts just retry their first message once).
const X25519_PKCS8 = Buffer.from('302e020100300506032b656e04220420', 'hex');
function derivePub(priv) {
    const k = crypto.createPrivateKey({ key: Buffer.concat([X25519_PKCS8, Buffer.from(priv)]), format: 'der', type: 'pkcs8' });
    return crypto.createPublicKey(k).export({ format: 'der', type: 'spki' }).subarray(-32);
}
const packKP = (kp) => {
    const priv = Buffer.from(kp.private), pub = Buffer.from(kp.public);
    let same = false;
    try { same = derivePub(priv).equals(pub); } catch (_) {}
    return same ? { p: priv } : { p: priv, u: pub }; // fall back to storing the public key if derivation ever disagrees
};
const unpackKP = (o) => ({ private: o.p, public: o.u || Buffer.from(derivePub(o.p)) });

function encodeTiny(c, meta) {
    const slim = {
        n: packKP(c.noiseKey),
        i: packKP(c.signedIdentityKey),
        k: packKP(c.signedPreKey.keyPair),
        g: Buffer.from(c.signedPreKey.signature),
        d: c.signedPreKey.keyId,
        r: c.registrationId,
        a: Buffer.from(c.advSecretKey, 'base64'),
        m: c.me,
        c: c.account,
        s: c.signalIdentities,
        f: c.platform,
        o: c.routingInfo,
        x: c.nextPreKeyId,
        y: c.firstUnuploadedPreKeyId,
        z: c.accountSyncCounter,
        t: meta
    };
    for (const k of Object.keys(slim)) if (slim[k] === undefined) delete slim[k];
    const buf = zlib.brotliCompressSync(v8.serialize(slim), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } });
    return TINY + buf.toString('base64');
}

function decodeTiny(blob) {
    const o = v8.deserialize(zlib.brotliDecompressSync(Buffer.from(blob.slice(TINY.length), 'base64')));
    const base = initAuthCreds(); // fresh defaults for everything we deliberately didn't save
    const b = (x) => (Buffer.isBuffer(x) ? x : Buffer.from(x));
    Object.assign(base, {
        noiseKey: unpackKP(o.n),
        signedIdentityKey: unpackKP(o.i),
        signedPreKey: { keyPair: unpackKP(o.k), signature: b(o.g), keyId: o.d },
        registrationId: o.r,
        advSecretKey: b(o.a).toString('base64'),
        me: o.m, account: o.c, signalIdentities: o.s, platform: o.f, routingInfo: o.o,
        nextPreKeyId: o.x, firstUnuploadedPreKeyId: o.y, accountSyncCounter: o.z,
        registered: true
    });
    for (const k of Object.keys(base)) if (base[k] === undefined) delete base[k];
    return { c: base, k: {}, m: o.t || {} };
}

function encode(creds, keys, meta, quality = 9) {
    const json = JSON.stringify({ v: 2, c: creds, k: keys, m: meta }, BufferJSON.replacer);
    const buf = zlib.brotliCompressSync(Buffer.from(json), {
        params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: quality,
            [zlib.constants.BROTLI_PARAM_SIZE_HINT]: json.length
        }
    });
    return PREFIX + buf.toString('base64');
}

function decode(blob) {
    if (blob.startsWith(TINY)) return decodeTiny(blob);
    const raw = zlib.brotliDecompressSync(Buffer.from(blob.slice(PREFIX.length), 'base64')).toString('utf8');
    return JSON.parse(raw, BufferJSON.reviver);
}

function isCompact(blob) {
    return typeof blob === 'string' && (blob.startsWith(PREFIX) || blob.startsWith(TINY));
}

/**
 * Converts an OLD multi-file bundle ({ 'creds.json': base64, 'pre-key-1.json': base64, ... })
 * into a compact blob. Used to shrink sessions that were paired before this change.
 */
function fromLegacyBundle(bundle) {
    if (!bundle || !bundle['creds.json']) return null;
    const read = (b64) => JSON.parse(Buffer.from(b64, 'base64').toString('utf8'), BufferJSON.reviver);
    const creds = read(bundle['creds.json']);
    const auth = createCompactAuth({ creds });
    for (const [file, b64] of Object.entries(bundle)) {
        if (file === 'creds.json' || !file.endsWith('.json')) continue;
        const name = file.slice(0, -5);
        const type = KNOWN_TYPES.find(t => name.startsWith(t + '-'));
        if (!type) continue;
        const id = name.slice(type.length + 1).replace(/__/g, '/').replace(/--/g, '::');
        try { auth._put(type, id, read(b64)); } catch (_) {}
    }
    return auth.snapshot();
}

function createCompactAuth({ blob, creds, onPersist, debounceMs = 15000 } = {}) {
    let data = {};   // data[type][id] = value
    let meta = {};   // tiny free-form flags (e.g. welcomed)
    let seq = 0;
    const touched = new Map(); // "type\u0000id" -> recency counter
    let lastBlob = null;
    let dirty = false;
    let timer = null;

    let credsObj = creds || null;

    if (blob && isCompact(blob)) {
        const parsed = decode(blob);
        credsObj = parsed.c;
        data = parsed.k || {};
        meta = parsed.m || {};
        lastBlob = blob;
        for (const type of Object.keys(data)) for (const id of Object.keys(data[type])) touched.set(type + '\u0000' + id, ++seq);
    }
    if (!credsObj) credsObj = initAuthCreds();

    function touch(type, id) { touched.set(type + '\u0000' + id, ++seq); }

    function put(type, id, value) {
        (data[type] || (data[type] = {}))[id] = value;
        touch(type, id);
    }

    const keys = {
        get: async (type, ids) => {
            const out = {};
            const bucket = data[type];
            if (!bucket) return out;
            for (const id of ids) {
                let v = bucket[id];
                if (v === undefined) continue;
                if (type === 'app-state-sync-key' && v) v = proto.Message.AppStateSyncKeyData.fromObject(v);
                out[id] = v;
                touch(type, id);
            }
            return out;
        },
        set: async (input) => {
            for (const type of Object.keys(input)) {
                for (const id of Object.keys(input[type])) {
                    const v = input[type][id];
                    if (v === null || v === undefined) {
                        if (data[type]) delete data[type][id];
                        touched.delete(type + '\u0000' + id);
                    } else {
                        put(type, id, v);
                    }
                }
            }
            markDirty();
        }
    };

    /** Build the pruned key set that fits under MAX_STORED. */
    function buildSnapshot(full = false) {
        const mandatory = {};
        const candidates = [];
        for (const type of Object.keys(data)) {
            if (DROP_TYPES.has(type) && !full) continue;
            const ids = Object.keys(data[type]);
            if (MANDATORY.has(type)) {
                mandatory[type] = { ...data[type] };
                continue;
            }
            if (type === 'pre-key' && !full) {
                ids.sort((a, b) => Number(a) - Number(b)); // lowest ids are served first by WhatsApp
                ids.slice(0, MAX_PREKEYS).forEach(id => candidates.push({ type, id, rank: 1e12 }));
                continue;
            }
            ids.forEach(id => candidates.push({ type, id, rank: touched.get(type + '\u0000' + id) || 0 }));
        }
        // pre-keys first (rank 1e12), then everything else newest-first
        candidates.sort((a, b) => b.rank - a.rank);

        const build = (n) => {
            const k = {};
            for (const t of Object.keys(mandatory)) k[t] = { ...mandatory[t] };
            for (let i = 0; i < n; i++) {
                const c = candidates[i];
                (k[c.type] || (k[c.type] = {}))[c.id] = data[c.type][c.id];
            }
            return k;
        };

        if (full) return encode(credsObj, build(candidates.length), meta, 4);

        let best = encode(credsObj, build(candidates.length), meta);
        if (best.length <= MAX_STORED) return best;

        // Too big: binary-search how many candidates fit
        let lo = 0, hi = candidates.length;
        best = encode(credsObj, build(0), meta);
        while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            const trial = encode(credsObj, build(mid), meta);
            if (trial.length <= MAX_STORED) { lo = mid; best = trial; } else { hi = mid - 1; }
        }
        return best;
    }

    function markDirty() {
        dirty = true;
        if (!timer && onPersist) timer = setTimeout(() => flush(), debounceMs);
    }

    /** ~1KB blob (creds only) — this is what gets saved everywhere. */
    function snapshot() { return encodeTiny(credsObj, meta); }

    /** Everything in RAM, uncapped — only for handing to a process on this same host. */
    function fullSnapshot() { return buildSnapshot(true); }

    function flush(force = false) {
        if (timer) { clearTimeout(timer); timer = null; }
        if (!dirty && !force && lastBlob) return lastBlob;
        dirty = false;
        const b = snapshot();
        if (b !== lastBlob) {
            lastBlob = b;
            if (onPersist) { try { onPersist(b); } catch (_) {} }
        }
        return b;
    }

    return {
        state: { creds: credsObj, keys },
        saveCreds: async () => { markDirty(); },
        meta,
        setMeta(k, v) { meta[k] = v; markDirty(); },
        markDirty,
        snapshot,
        fullSnapshot,
        flush,
        _put: put
    };
}

module.exports = { createCompactAuth, fromLegacyBundle, isCompact, PREFIX, TINY, MAX_STORED };
