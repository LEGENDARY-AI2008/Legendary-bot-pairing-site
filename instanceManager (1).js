const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DB_FILE = path.join(__dirname, 'instances', 'instances.json');
const INSTANCES_DIR = path.join(__dirname, 'instances');

// No cap — unlimited concurrent instances.
const MAX_CONCURRENT_INSTANCES = Infinity;

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

    // Write this instance's own config.env
    const envLines = [
        `SESSION_ID=${sessionId}`,
        `OWNER_NUMBER=${botConfig.ownerNumber}`,
        `OWNER_NAME=${botConfig.ownerName}`,
        `BOT_NAME=${botConfig.botName || 'LËGĒNDÃRY BØT'}`,
        `PREFIX=${botConfig.prefix || '.'}`,
        `WORKTYPE=${botConfig.workType || 'private'}`
    ];
    fs.writeFileSync(path.join(instanceDir, 'config.env'), envLines.join('\n'));

    // spawn: false — used by server.js (Render) now that actual bot
    // processes run on Pterodactyl via multibot.js. Render still needs
    // this function to register the instance (config.env + a db entry
    // for multibot.js's GitHub poll to pick up) without ever running the
    // bot itself — Render running it too is exactly the double-deploy
    // this flag exists to prevent.
    if (!shouldSpawn) {
        db[sessionId] = {
            sessionId,
            status: 'pending', // NOT 'running' — this host isn't running it; deliberately lets a real host's deployInstance() proceed instead of skipping via the guard above
            registeredAt: new Date().toISOString(),
            botConfig,
            intentionalStop: false,
            crashCount: db[sessionId]?.crashCount || 0
        };
        saveDB(db);
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
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false
    });

    const logPath = path.join(instanceDir, 'output.log');
    const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB cap

    // If the existing log is already oversized (e.g. left over from a
    // crash loop before this fix), truncate it before appending more —
    // otherwise every restart just keeps piling onto an already-huge file.
    try {
        if (fs.existsSync(logPath) && fs.statSync(logPath).size > MAX_LOG_SIZE) {
            fs.writeFileSync(logPath, `[log truncated — exceeded ${MAX_LOG_SIZE / 1024 / 1024}MB]\n`);
        }
    } catch (_) {}

    const logFile = fs.createWriteStream(logPath, { flags: 'a' });
    const logPrefix = `[bot:${sessionId.slice(0, 20)}]`;

    // Also cap mid-write: if a single crash-loop burst blows past the
    // limit between deploys, stop writing instead of growing forever.
    let loggedBytes = 0;
    const cappedWrite = (chunk) => {
        loggedBytes += chunk.length;
        if (loggedBytes > MAX_LOG_SIZE) return;
        logFile.write(chunk);
    };
    child.stdout.on('data', cappedWrite);
    child.stderr.on('data', cappedWrite);
    child.stdout.on('data', d => process.stdout.write(`${logPrefix} ${d}`));
    child.stderr.on('data', d => process.stderr.write(`${logPrefix} ${d}`));

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
 * files — no session ID lookup, no remote fetch, no separate step for the
 * user. Copies the real creds into the new instance's session folder
 * BEFORE deployInstance runs, so bot.js (fixed to check for local creds
 * first) skips the remote-fetch path entirely and just starts working.
 * @param {object} opts { instanceId, authDir, botConfig }
 *   instanceId: any unique folder-safe string (not a real lookup key)
 *   authDir: local folder containing creds.json etc. from the pairing socket
 */
function deployInstanceFromPairing({ instanceId, authDir, botConfig, spawn: shouldSpawn = true }) {
    const instanceDir = path.join(INSTANCES_DIR, instanceId);
    const instanceSessionDir = path.join(instanceDir, 'session');

    if (!fs.existsSync(instanceSessionDir)) fs.mkdirSync(instanceSessionDir, { recursive: true });

    for (const file of fs.readdirSync(authDir)) {
        fs.copyFileSync(path.join(authDir, file), path.join(instanceSessionDir, file));
    }

    // deployInstance no longer copies anything into instanceDir besides
    // config.env, so the session/ folder placed above is left untouched.
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
function restoreInstances() {
    const db = loadDB();
    const toRestore = Object.values(db).filter(i => i.status === 'running' && !i.intentionalStop);

    if (!toRestore.length) {
        console.log('♻️  No instances to restore.');
        return;
    }

    console.log(`♻️  Restoring ${toRestore.length} instance(s) from before restart...`);

    toRestore.forEach((instance, index) => {
        setTimeout(() => {
            try {
                const fresh = loadDB();
                if (fresh[instance.sessionId]) {
                    fresh[instance.sessionId].status = 'stopped';
                    saveDB(fresh);
                }
                console.log(`♻️  Restoring ${instance.sessionId} (${index + 1}/${toRestore.length})...`);
                const result = deployInstance({ sessionId: instance.sessionId, botConfig: instance.botConfig });
                if (!result.success) {
                    console.log(`⚠️  Failed to restore ${instance.sessionId}: ${result.message}`);
                }
            } catch (e) {
                // One bad instance (corrupted session, missing files, etc.)
                // shouldn't stop the rest of the queue from restoring.
                console.log(`❌ Failed to restore ${instance.sessionId} (threw): ${e.message}`);
            }
        }, index * 3000); // staggered so the server isn't spawning everything at once
    });
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

    const instanceDir = path.join(INSTANCES_DIR, sessionId);
    try {
        if (fs.existsSync(instanceDir)) {
            fs.rmSync(instanceDir, { recursive: true, force: true });
            console.log(`🗑️  removeInstance: deleted ${sessionId} (logged out) — folder + DB record removed.`);
        }
    } catch (e) {
        console.log(`⚠️  removeInstance: couldn't delete folder for ${sessionId}: ${e.message}`);
    }

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
    const logPath = path.join(INSTANCES_DIR, sessionId, 'output.log');
    if (!fs.existsSync(logPath)) return '';
    const content = fs.readFileSync(logPath, 'utf-8');
    return content.split('\n').slice(-lines).join('\n');
}

module.exports = {
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
