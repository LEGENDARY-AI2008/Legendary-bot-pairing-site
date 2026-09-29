// ============================================================
// githubSync.js — backs the bot's lightweight JSON data up to a
// private GitHub repo, and restores it on boot. This runs on
// Render itself (real internet access), never from a local tool.
//
// WHY: Render's free-tier filesystem is ephemeral — any local file
// changes are lost on redeploy/restart/spin-down. Since users are
// growing and a paid persistent disk costs extra, we treat GitHub
// as the durable copy of the *data*, restored on every boot.
//
// SESSIONS: WhatsApp session/auth files (creds.json etc.) are now
// ALSO pushed to GitHub, as sessions/<sessionId>.json — one file per
// paired user, per an explicit decision to accept the tradeoff.
// SECURITY NOTE (read this before touching the repo's access list):
// that file IS full account access to whoever paired — anyone with
// read access to GITHUB_REPO can hijack that WhatsApp account. Keep
// the repo private and GITHUB_TOKEN scoped to only this repo.
//
// Needs two env vars set in Render's dashboard (not committed):
//   GITHUB_TOKEN  - a fine-grained PAT with "Contents: read and write"
//                   on this one repo only
//   GITHUB_REPO   - "owner/repo", e.g. "LEGENDARY-AI2008/Legendary-bot-pairing-site"
// ============================================================
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // "owner/repo"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const API_ROOT = 'https://api.github.com';

// Only these are backed up. Add new lightweight data files here as
// they're introduced — never a sessions/auth/creds path.
const SYNC_FILES = [
    'pairedUsers.json',
    'instances/instances.json',
    'allfunc/owner.json',
    'allfunc/premium.json',
];

function enabled() {
    return Boolean(GITHUB_TOKEN && GITHUB_REPO);
}

function ghHeaders() {
    return {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'legendary-bot-sync',
        'X-GitHub-Api-Version': '2022-11-28',
    };
}

async function getRemoteFile(repoPath) {
    const url = `${API_ROOT}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(repoPath)}?ref=${GITHUB_BRANCH}`;
    const res = await fetch(url, { headers: ghHeaders() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub GET ${repoPath} failed: ${res.status} ${await res.text()}`);
    return res.json(); // { content (base64), sha, ... }
}

async function putRemoteFile(repoPath, content, sha) {
    const url = `${API_ROOT}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(repoPath)}`;
    const body = {
        message: `sync: update ${repoPath} — ${new Date().toISOString()}`,
        content: Buffer.from(content).toString('base64'),
        branch: GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;

    const res = await fetch(url, {
        method: 'PUT',
        headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GitHub PUT ${repoPath} failed: ${res.status} ${await res.text()}`);
    return res.json();
}

/**
 * Pull every file in SYNC_FILES down from GitHub into the local
 * filesystem. Call this once, early, before the bot starts reading
 * its local JSON files — so a fresh Render boot restores prior state
 * instead of starting empty.
 */
async function restoreFromGitHub() {
    if (!enabled()) {
        console.log('ℹ️  githubSync: GITHUB_TOKEN/GITHUB_REPO not set — skipping restore, starting with local files only.');
        return;
    }
    for (const repoPath of SYNC_FILES) {
        try {
            const remote = await getRemoteFile(repoPath);
            if (!remote || !remote.content) {
                console.log(`ℹ️  githubSync: no backup found yet for ${repoPath} — will create one on first push.`);
                continue;
            }
            const localPath = path.join(__dirname, repoPath);
            fs.mkdirSync(path.dirname(localPath), { recursive: true });
            fs.writeFileSync(localPath, Buffer.from(remote.content, 'base64'));
            console.log(`✅ githubSync: restored ${repoPath} from GitHub`);
        } catch (e) {
            console.log(`⚠️  githubSync: couldn't restore ${repoPath}: ${e.message}`);
        }
    }
}

/**
 * Push every file in SYNC_FILES that exists locally up to GitHub.
 * Safe to call often — skips the API call for files whose content
 * hasn't changed since the last push.
 */
const lastPushedHash = {};
function hash(buf) {
    // Cheap content fingerprint — good enough to skip no-op pushes,
    // not used for anything security-sensitive.
    let h = 0;
    for (let i = 0; i < buf.length; i++) h = (h * 31 + buf[i]) | 0;
    return h;
}

async function backupToGitHub(files = SYNC_FILES) {
    if (!enabled()) return;
    for (const repoPath of files) {
        const localPath = path.join(__dirname, repoPath);
        if (!fs.existsSync(localPath)) continue;

        try {
            const content = fs.readFileSync(localPath);
            const h = hash(content);
            if (lastPushedHash[repoPath] === h) continue; // unchanged, skip the API call

            const remote = await getRemoteFile(repoPath);
            await putRemoteFile(repoPath, content, remote?.sha);
            lastPushedHash[repoPath] = h;
            console.log(`✅ githubSync: backed up ${repoPath} to GitHub`);
        } catch (e) {
            console.log(`⚠️  githubSync: couldn't back up ${repoPath}: ${e.message}`);
        }
    }
}

/**
 * Merge just ONE sessionId's entry into instances.json on GitHub,
 * without touching any other entry. Used by Render when it registers
 * a new pairing (spawn:false) — Render's own local view of "status"
 * is meaningless (it never actually runs bots anymore), so it must
 * NEVER push its whole local instances.json over GitHub's copy, only
 * ever add/update its own single new key. The authoritative status
 * for every entry (running/pid/crashCount) belongs to whichever host
 * actually spawned it — currently multibot.js on Pterodactyl, via its
 * own full-file backupToGitHub() in SYNC_FILES.
 *
 * Skipping this and instead relying on a full-file sync from two
 * different hosts is exactly what caused bots to silently double-spawn
 * after a few hours (each host's periodic push clobbering the other's
 * status), so don't change this back to a bulk push.
 */
async function pushInstanceEntry(sessionId, entry) {
    if (!enabled()) return;
    const repoPath = 'instances/instances.json';
    try {
        const remote = await getRemoteFile(repoPath);
        const current = remote?.content ? JSON.parse(Buffer.from(remote.content, 'base64').toString('utf-8')) : {};
        current[sessionId] = entry;
        await putRemoteFile(repoPath, JSON.stringify(current, null, 2), remote?.sha);
        console.log(`✅ githubSync: registered ${sessionId} in instances.json on GitHub`);
    } catch (e) {
        console.log(`⚠️  githubSync: couldn't register ${sessionId}: ${e.message}`);
    }
}

/**
 * Starts the periodic backup loop. Call once at boot, after
 * restoreFromGitHub(). Also backs up immediately on SIGTERM (Render
 * sends this before stopping/redeploying an instance) so the most
 * recent state is saved on the way out, not just every N minutes.
 *
 * files: which of SYNC_FILES to actually push periodically. Defaults
 * to all of them — but Render must pass a list that EXCLUDES
 * 'instances/instances.json' (see pushInstanceEntry above for why).
 * multibot.js, the one host that actually knows real running status,
 * keeps using the full default list.
 */
function startAutoSync(intervalMs = 5 * 60 * 1000, files = SYNC_FILES) {
    if (!enabled()) return;
    setInterval(() => { backupToGitHub(files).catch(() => {}); }, intervalMs);

    let shuttingDown = false;
    const flushAndExit = async (signal) => {
        if (shuttingDown) return;
        shuttingDown = true;
        console.log(`🛑 githubSync: ${signal} received — flushing final backup before exit...`);
        try { await backupToGitHub(files); } catch {}
        try { if (typeof global.__legendaryShutdown === 'function') await global.__legendaryShutdown(); } catch {}
        process.exit(0);
    };
    process.on('SIGTERM', () => flushAndExit('SIGTERM'));
    process.on('SIGINT', () => flushAndExit('SIGINT'));
}

/**
 * Push one paired user's session files (auth-state JSON files, as
 * produced by useMultiFileAuthState) to GitHub as a single bundled
 * file: sessions/<sessionId>.json — { filename: base64content, ... }.
 * Fire-and-forget from the caller's point of view; failures are
 * logged, never thrown into the pairing flow.
 */
async function pushSessionFiles(sessionId, filesBundle) {
    if (!enabled()) {
        console.log(`ℹ️  githubSync: GITHUB_TOKEN/GITHUB_REPO not set — session ${sessionId} was NOT backed up to GitHub.`);
        return;
    }
    const repoPath = `sessions/${sessionId}.json`;
    try {
        const remote = await getRemoteFile(repoPath);
        await putRemoteFile(repoPath, JSON.stringify(filesBundle), remote?.sha);
        console.log(`✅ githubSync: session ${sessionId} backed up to GitHub`);
    } catch (e) {
        console.log(`⚠️  githubSync: couldn't back up session ${sessionId}: ${e.message}`);
    }
}

/**
 * Fetch one session's bundle back down from GitHub. Returns the
 * { filename: base64content, ... } bundle, or null if no backup
 * exists yet for that sessionId. Throws on a real network/API error
 * so the caller (bot.js) can tell "not found" apart from "GitHub is
 * unreachable" and report the right thing.
 */
async function fetchSessionFiles(sessionId) {
    if (!enabled()) return null;
    const repoPath = `sessions/${sessionId}.json`;
    const remote = await getRemoteFile(repoPath);
    if (!remote || !remote.content) return null;
    return JSON.parse(Buffer.from(remote.content, 'base64').toString('utf-8'));
}

/**
 * Compact session storage: one small text blob per paired user,
 * sessions/<sessionId>.json (content is the "L2." blob, or an old
 * multi-file JSON bundle from before the compact format).
 */
async function pushSessionText(sessionId, text) {
    if (!enabled()) return false;
    const repoPath = `sessions/${sessionId}.json`;
    const remote = await getRemoteFile(repoPath);
    await putRemoteFile(repoPath, text, remote?.sha);
    return true;
}

async function fetchSessionText(sessionId) {
    if (!enabled()) return null;
    const remote = await getRemoteFile(`sessions/${sessionId}.json`);
    if (!remote || !remote.content) return null;
    return Buffer.from(remote.content, 'base64').toString('utf-8');
}

/**
 * Deletes one file from the repo outright (GitHub's DELETE contents API,
 * which requires the file's current sha). No-ops quietly if the file is
 * already gone — deleting something twice shouldn't be an error.
 */
async function deleteRemoteFile(repoPath) {
    const remote = await getRemoteFile(repoPath);
    if (!remote) return; // already gone — nothing to do
    const url = `${API_ROOT}/repos/${GITHUB_REPO}/contents/${encodeURIComponent(repoPath)}`;
    const body = {
        message: `sync: remove ${repoPath} — ${new Date().toISOString()}`,
        sha: remote.sha,
        branch: GITHUB_BRANCH,
    };
    const res = await fetch(url, {
        method: 'DELETE',
        headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GitHub DELETE ${repoPath} failed: ${res.status} ${await res.text()}`);
}

/**
 * Removes one sessionId's session bundle (sessions/<sessionId>.json) from
 * GitHub. Call this once a WhatsApp session has logged out for good — the
 * creds are dead, so there's nothing left worth backing up, and leaving it
 * behind just takes up space in the repo forever.
 */
async function deleteSessionFiles(sessionId) {
    if (!enabled()) return;
    try {
        await deleteRemoteFile(`sessions/${sessionId}.json`);
        console.log(`🗑️  githubSync: deleted session backup for ${sessionId} from GitHub`);
    } catch (e) {
        console.log(`⚠️  githubSync: couldn't delete session backup for ${sessionId}: ${e.message}`);
    }
}

/**
 * Removes just ONE sessionId's entry from instances.json on GitHub — same
 * careful read-modify-write pattern as pushInstanceEntry above, never a
 * bulk overwrite, so it can't clobber another host's entries for other
 * sessions while this one is being cleaned up.
 */
async function deleteInstanceEntry(sessionId) {
    if (!enabled()) return;
    const repoPath = 'instances/instances.json';
    try {
        const remote = await getRemoteFile(repoPath);
        if (!remote?.content) return;
        const current = JSON.parse(Buffer.from(remote.content, 'base64').toString('utf-8'));
        if (!(sessionId in current)) return;
        delete current[sessionId];
        await putRemoteFile(repoPath, JSON.stringify(current, null, 2), remote.sha);
        console.log(`🗑️  githubSync: removed ${sessionId} from instances.json on GitHub`);
    } catch (e) {
        console.log(`⚠️  githubSync: couldn't remove ${sessionId} from instances.json: ${e.message}`);
    }
}

module.exports = { restoreFromGitHub, backupToGitHub, startAutoSync, SYNC_FILES, enabled, pushSessionText, fetchSessionText, pushSessionFiles, fetchSessionFiles, pushInstanceEntry, deleteSessionFiles, deleteInstanceEntry };
