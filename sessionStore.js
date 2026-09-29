// ============================================================
// sessionStore.js — lives in the MAIN (Render) process only.
// Holds each paired user's tiny session blob in memory, and saves
// it to GitHub (ephemeral Render disk can't be trusted) in ONE
// small file per user. Nothing is ever written to local disk.
// ============================================================
const githubSync = require('./githubSync');
const { isCompact, fromLegacyBundle, createCompactAuth } = require('./compactAuth');

const PUSH_MS = parseInt(process.env.SESSION_PUSH_MS || String(10 * 60 * 1000), 10);

const blobs = new Map();      // id -> latest compact blob (what's persisted)
const pushedBlob = new Map(); // id -> last blob confirmed on GitHub
const fullBlobs = new Map();  // id -> uncapped blob, used ONCE to boot the child fast
const timers = new Map();

function set(id, blob) {
    if (!blob) return;
    blobs.set(id, blob);
    schedulePush(id);
}

function setFullOnce(id, full) { if (full) fullBlobs.set(id, full); }

/** Blob to boot a child with: uncapped one if we still have it, else the saved one. */
function takeBootBlob(id) {
    const full = fullBlobs.get(id);
    if (full) { fullBlobs.delete(id); return full; }
    return blobs.get(id) || null;
}

function getSync(id) { return blobs.get(id) || null; }

function schedulePush(id, immediate = false) {
    if (timers.has(id) && !immediate) return;
    if (timers.has(id)) clearTimeout(timers.get(id));
    timers.set(id, setTimeout(() => { timers.delete(id); pushNow(id).catch(() => {}); }, immediate ? 0 : PUSH_MS));
}

async function pushNow(id) {
    const blob = blobs.get(id);
    if (!blob || pushedBlob.get(id) === blob) return;
    try {
        if (await githubSync.pushSessionText(id, blob)) {
            pushedBlob.set(id, blob);
            console.log(`💾 session ${id.slice(0, 14)} saved (${(blob.length / 1024).toFixed(1)} KB)`);
        }
    } catch (e) {
        console.log(`⚠️  session ${id.slice(0, 14)} GitHub save failed: ${e.message}`);
        schedulePush(id); // retry later
    }
}

/** Make sure the blob is in memory (fetch + shrink legacy bundles from GitHub if needed). */
async function ensure(id) {
    if (blobs.has(id)) return blobs.get(id);
    let text;
    try { text = await githubSync.fetchSessionText(id); } catch (e) {
        console.log(`⚠️  couldn't fetch session ${id}: ${e.message}`);
        return null;
    }
    if (!text) return null;

    if (isCompact(text)) {
        if (text.startsWith('L3.')) { blobs.set(id, text); pushedBlob.set(id, text); return text; }
        const small = createCompactAuth({ blob: text }).snapshot(); // older bigger format -> ~1KB
        blobs.set(id, small); schedulePush(id, true);
        return small;
    }
    // Old multi-file bundle -> shrink it once, save the small version back
    try {
        const small = fromLegacyBundle(JSON.parse(text));
        if (small) {
            console.log(`🗜️  session ${id.slice(0, 14)} shrunk ${(text.length / 1024).toFixed(0)}KB -> ${(small.length / 1024).toFixed(1)}KB`);
            blobs.set(id, small);
            schedulePush(id, true);
            return small;
        }
    } catch (e) {
        console.log(`⚠️  couldn't convert legacy session ${id}: ${e.message}`);
    }
    return null;
}

function remove(id) {
    blobs.delete(id); pushedBlob.delete(id); fullBlobs.delete(id);
    if (timers.has(id)) { clearTimeout(timers.get(id)); timers.delete(id); }
}

async function flushAll() {
    const ids = [...blobs.keys()];
    await Promise.allSettled(ids.map(id => pushNow(id)));
}

module.exports = { set, setFullOnce, takeBootBlob, getSync, ensure, remove, flushAll, pushNow };
