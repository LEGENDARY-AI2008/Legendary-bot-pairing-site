// ============================================================
// multibot.js — the ONE thing you run on the Pterodactyl panel.
// Startup command stays: node multibot.js
//
// It does NOT run every paired user's bot logic itself — it just
// keeps instanceManager.js's existing spawn-per-session machinery
// fed with the latest paired-user list from GitHub. Every actual
// bot still runs as its own separate child process, in its own
// folder (instances/<sessionId>/), exactly like it already did on
// Render. That per-process separation is what keeps each person's
// session, settings, and tmp/ files from ever touching another's —
// nothing about that changes here, this file just starts it all up
// from one place and keeps it in sync with GitHub every 2 minutes.
// ============================================================
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const githubSync = require('./githubSync');
const instanceManager = require('./instanceManager');

const POLL_MS = 2 * 60 * 1000; // 2 minutes
const DB_FILE = path.join(__dirname, 'instances', 'instances.json');
const UPDATE_FLAG_FILE = path.join(__dirname, 'instances', 'update-flag.json');

let lastHandledUpdateAt = 0;

function readInstancesDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (_) {
        return {};
    }
}

/**
 * Deploys any paired user from instances.json that isn't already
 * running. deployInstance() already refuses (safely, no-op) if that
 * sessionId shows status 'running' in the DB, so calling this for
 * everyone every cycle is safe — only genuinely new pairings result
 * in an actual spawn.
 */
function pickUpNewInstances() {
    const db = readInstancesDB();
    for (const [sessionId, entry] of Object.entries(db)) {
        if (entry.intentionalStop) continue; // owner deliberately stopped this one — leave it alone
        const result = instanceManager.deployInstance({ sessionId, botConfig: entry.botConfig });
        if (result.success) {
            console.log(chalk.green(`🚀 multibot: picked up new session ${sessionId}`));
        }
        // result.success === false here just means "already running" —
        // expected on almost every cycle, not worth logging as an error.
    }
}

/**
 * .update (run from inside any one instance) can't restart the
 * others directly — it only ever sees itself, since each instance is
 * its own OS process. Instead it drops a timestamped flag file. This
 * process is the one that actually started every instance, so it's
 * the only place restartAllInstances() can work correctly. Checked
 * every poll cycle; only acts if the flag is newer than the last one
 * already handled, so it fires once per .update, not every 2 minutes.
 */
function checkUpdateFlag() {
    let flag;
    try {
        flag = JSON.parse(fs.readFileSync(UPDATE_FLAG_FILE, 'utf-8'));
    } catch (_) {
        return; // no flag file yet — nothing to do
    }
    if (!flag.requestedAt || flag.requestedAt <= lastHandledUpdateAt) return;

    lastHandledUpdateAt = flag.requestedAt;
    console.log(chalk.bgGreen.black(`🔄 multibot: update flag seen (from ${flag.requestedBy}) — restarting every instance`));
    instanceManager.restartAllInstances();
}

async function syncCycle() {
    await githubSync.restoreFromGitHub(); // pulls instances.json + other synced data down fresh from GitHub
    pickUpNewInstances();
    checkUpdateFlag();
}

(async () => {
    console.log(chalk.hex('#e8b54d')('🟢 multibot — one Pterodactyl process, every paired user isolated in their own.\n'));

    if (!githubSync.enabled()) {
        console.log(chalk.red('❌ GITHUB_TOKEN / GITHUB_REPO are not set — nothing to restore, nothing will run. Set them in the panel and restart.'));
        return;
    }

    await githubSync.restoreFromGitHub();
    instanceManager.restoreInstances(); // spins up everyone already known, staggered so they don't all hit WhatsApp at once
    githubSync.startAutoSync(POLL_MS);  // also pushes local changes (owner.json, premium.json, instances.json) back up every 2 min

    setInterval(() => {
        syncCycle().catch(e => console.log(chalk.red(`multibot: sync cycle failed — ${e.message}`)));
    }, POLL_MS);
})();
