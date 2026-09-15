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
// WHAT NEVER GOES HERE: WhatsApp session/auth folders (creds.json
// etc). Those are full account access to a real person's WhatsApp —
// pushing them to a repo, private or not, means anyone with repo
// access could hijack any paired user's account. If Render restarts
// unexpectedly, paired sessions are lost and users re-pair; that's
// the accepted tradeoff of skipping persistent paid storage. Do not
// add session directories to SYNC_FILES below to "fix" that — it
// trades a real inconvenience for a real security hole.
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

async function backupToGitHub() {
    if (!enabled()) return;
    for (const repoPath of SYNC_FILES) {
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
 * Starts the periodic backup loop. Call once at boot, after
 * restoreFromGitHub(). Also backs up immediately on SIGTERM (Render
 * sends this before stopping/redeploying an instance) so the most
 * recent state is saved on the way out, not just every N minutes.
 */
function startAutoSync(intervalMs = 5 * 60 * 1000) {
    if (!enabled()) return;
    setInterval(() => { backupToGitHub().catch(() => {}); }, intervalMs);

    let shuttingDown = false;
    const flushAndExit = async (signal) => {
        if (shuttingDown) return;
        shuttingDown = true;
        console.log(`🛑 githubSync: ${signal} received — flushing final backup before exit...`);
        try { await backupToGitHub(); } catch {}
        process.exit(0);
    };
    process.on('SIGTERM', () => flushAndExit('SIGTERM'));
    process.on('SIGINT', () => flushAndExit('SIGINT'));
}

module.exports = { restoreFromGitHub, backupToGitHub, startAutoSync, SYNC_FILES, enabled };
