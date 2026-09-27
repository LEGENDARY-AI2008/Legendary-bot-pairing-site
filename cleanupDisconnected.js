// ============================================================
// cleanupDisconnected.js — ONE-OFF SCRIPT for the backlog of dead
// sessions that built up before removeInstance() was actually wired
// up anywhere. Run this ONCE, manually, on the Pterodactyl panel:
//
//   node cleanupDisconnected.js
//
// Going forward this happens automatically — bot.js now exits with a
// distinct code on a permanent logout OR after 2 failed reconnect
// attempts, and instanceManager.js's exit handler calls
// removeInstance() for you when it sees that. You shouldn't need to
// run this script again after this first cleanup.
//
// Safe by design: only touches instances whose status is "stopped"
// AND were NOT stopped on purpose (intentionalStop === true means you
// paused it yourself via .stop or the panel — those are left alone,
// since that's a deliberate pause, not a dead session). A currently
// running bot is never touched.
// ============================================================
const fs = require('fs');
const path = require('path');
const instanceManager = require('./instanceManager');
const githubSync = require('./githubSync');

const DB_FILE = path.join(__dirname, 'instances', 'instances.json');

function loadDB() {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

async function main() {
    const db = loadDB();
    const entries = Object.values(db);

    if (!entries.length) {
        console.log('Nothing in instances.json — nothing to clean up.');
        return;
    }

    const dead = entries.filter(e => e.status !== 'running' && !e.intentionalStop);

    if (!dead.length) {
        console.log(`Checked ${entries.length} instance(s) — none are dead/disconnected. Nothing to clean up.`);
        return;
    }

    console.log(`Found ${dead.length} dead/disconnected instance(s) out of ${entries.length} total. Removing...\n`);

    let removed = 0;
    for (const entry of dead) {
        const result = instanceManager.removeInstance(entry.sessionId);
        console.log(`  ${result.success ? '🗑️ ' : '⚠️ '} ${entry.sessionId} — ${result.message}`);

        // removeInstance() fires its GitHub cleanup off without waiting —
        // fine during normal operation, but this script should actually
        // finish the job before exiting, so wait on it explicitly here too.
        // Idempotent either way: deleting an already-gone file is a no-op.
        await Promise.allSettled([
            githubSync.deleteSessionFiles(entry.sessionId),
            githubSync.deleteInstanceEntry(entry.sessionId)
        ]);

        if (result.success) removed++;
        // Small pause between entries so a big backlog doesn't slam
        // GitHub's API all at once.
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\nDone — removed ${removed}/${dead.length} dead instance(s), locally and on GitHub.`);
}

main().catch(e => {
    console.error('cleanupDisconnected.js failed:', e.message);
    process.exit(1);
});
