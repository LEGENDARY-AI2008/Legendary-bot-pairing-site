// ============================================================
// LËGĒNDÃRY BØT — Core Runner
// ============================================================
// This file is fetched and run automatically by the bootstrap
// index.js — you shouldn't need to edit this directly.
// ============================================================

require('dotenv').config({ path: './config.env' });

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    Browsers,
    DisconnectReason,
    jidDecode
} = require('@boruto_vk7/baileys');
const { Boom } = require('@hapi/boom');
const chalk = require('chalk');
const pino = require('pino');
const { smsg } = require('./storage');
const githubSync = require('./githubSync');
const { createCompactAuth, isCompact, fromLegacyBundle } = require('./compactAuth');

const config = {
    sessionId: process.env.SESSION_ID,
    ownerNumber: process.env.OWNER_NUMBER,
    workType: (process.env.WORKTYPE || 'private').toLowerCase(), // 'private' | 'public'
    prefix: process.env.PREFIX || '.',
    timezone: process.env.TIMEZONE || 'Africa/Lagos',
    ownerName: process.env.OWNER_NAME || 'Owner',
    botName: process.env.BOT_NAME || 'LËGĒNDÃRY BØT',
    sudoNumbers: (process.env.SUDO_NUMBERS || '').split(',').map(n => n.trim()).filter(Boolean)
};

// Consecutive reconnect attempts since the last successful 'open' — reset
// to 0 there, incremented on every reconnect-able 'close'. Once it hits
// MAX_RECONNECT_ATTEMPTS without ever reaching 'open' again, the instance
// is wiped instead of retried forever (see connection.update below).
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 2;

function printBanner() {
    console.log(chalk.hex('#e8b54d')(`
  ██╗     ██╗   ██╗    ██████╗  ██████╗ ████████╗
  ██║     ██║   ██║    ██╔══██╗██╔═══██╗╚══██╔══╝
  ██║     ██║   ██║    ██████╔╝██║   ██║   ██║
  ██║     ╚██╗ ██╔╝    ██╔══██╗██║   ██║   ██║
  ███████╗ ╚████╔╝     ██████╔╝╚██████╔╝   ██║
  ╚══════╝  ╚═══╝      ╚═════╝  ╚═════╝    ╚═╝
`));
    console.log(chalk.hex('#39ff9e')('   LËGĒNDÃRY BØT — by LËGĒNDÃRY LAB™ Studio'));
    console.log(chalk.gray(`   Bot: ${config.botName}  •  Owner: ${config.ownerName}  •  Mode: ${config.workType}\n`));
}

function validateConfig(cfg) {
    const problems = [];
    if (!cfg.sessionId) problems.push('SESSION_ID is missing in config.env.');
    if (!cfg.ownerNumber) problems.push('OWNER_NUMBER is missing in config.env.');
    if (!cfg.prefix || cfg.prefix.includes(' ')) problems.push('PREFIX looks invalid — use a short symbol like "." with no spaces.');
    if (!['private', 'public'].includes(cfg.workType)) problems.push('WORKTYPE should be "private" or "public".');
    return problems;
}

const problems = validateConfig(config);
if (problems.length) {
    console.log(chalk.red(`❌ Found ${problems.length} problem(s) in config.env:\n`));
    problems.forEach((p, i) => console.log(chalk.yellow(`  ${i + 1}. ${p}`)));
    process.exit(1);
}

const API_BASE_URL = process.env.API_BASE_URL || 'https://legendarybot.dpdns.org'; // only used for the optional welcome image now — falls back to text if unreachable
// process.cwd(), not __dirname: bot.js now runs from ONE shared codebase
// location for every instance, spawned with cwd set to that instance's own
// folder (see instanceManager.js). __dirname would point at the shared
// code and make every instance share one session — process.cwd() keeps
// each instance's WhatsApp creds isolated in its own folder.
const store = makeInMemoryStore ? makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) }) : null;

// ── Session: ONE small string, kept in memory. No session/ folder, no files. ──
// Parent (Render) sends it over IPC at boot and receives every update back.
// If this file is ever run standalone, it falls back to GitHub directly.
let auth = null;

function waitForInitBlob() {
    return new Promise((resolve) => {
        if (!process.send) return resolve(null);
        const t = setTimeout(() => resolve(null), 8000);
        process.once('message', (m) => {
            if (m && m.type === 'init') { clearTimeout(t); resolve(m.blob || null); }
        });
    });
}

function persistBlob(blob) {
    if (process.send) { try { process.send({ type: 'session', blob }); } catch (_) {} return; }
    if (githubSync.enabled()) githubSync.pushSessionText(config.sessionId, blob).catch(() => {});
}

async function loadAuth() {
    if (auth) return auth; // reconnects reuse the live in-memory session
    let blob = await waitForInitBlob();

    if (!blob && githubSync.enabled()) {
        console.log(chalk.yellow('🔄 Fetching your session from GitHub...'));
        try {
            const text = await githubSync.fetchSessionText(config.sessionId);
            if (text) blob = isCompact(text) ? text : fromLegacyBundle(JSON.parse(text));
        } catch (e) {
            console.log(chalk.red(`❌ Could not fetch session: ${e.message}`));
        }
    }
    if (!blob) {
        console.log(chalk.red(`❌ No session found for ${config.sessionId}. Pair again.`));
        process.exit(1);
    }
    auth = createCompactAuth({ blob, onPersist: persistBlob });
    console.log(chalk.green('✅ Session loaded (in memory).'));
    return auth;
}

// Save the session one last time when Render stops/restarts us.
process.on('SIGTERM', () => {
    try { if (auth) auth.flush(true); } catch (_) {}
    setTimeout(() => process.exit(0), 400);
});

async function sendWelcomeMessage(sock) {
    // Was tracked as sock.welcomeSent — an in-memory flag on the socket
    // object. Baileys reconnects (normal, frequent, not a real restart)
    // create a brand new socket, so that flag reset every time and the
    // welcome DM fired again on every reconnect — looking like a fresh
    // pairing each time. Persisting a marker file per-instance (isolated
    // via cwd, same as session/ and database/) survives reconnects AND
    // full process restarts, so it only ever sends once per real pairing.
    if (auth.meta.welcomed) return;
    if (sock._welcomeInFlight) return; // guard against two 'open' events firing close together
    sock._welcomeInFlight = true;

    const ownerJid = config.ownerNumber.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    const caption =
`🔥 *${config.botName} is now LIVE!*

Welcome aboard, ${config.ownerName} 👋

Your bot is connected and ready to work. Here's what to do next:

▸ Type *${config.prefix}menu* to see all available commands
▸ Type *${config.prefix}chatbot on* to enable the AI chatbot
▸ Type *${config.prefix}plugin list* to see installed plugins

Mode: *${config.workType}*
Prefix: *${config.prefix}*

_Powered by LËGĒNDÃRY LAB™ Studio_`;

    try {
        const { data } = await axios.get(`${API_BASE_URL}/assets/welcome.jpg`, { responseType: 'arraybuffer' });
        await sock.sendMessage(ownerJid, { image: Buffer.from(data), caption });
    } catch (e) {
        // Fall back to text-only if the image can't be fetched, so the welcome still lands
        await sock.sendMessage(ownerJid, { text: caption });
    }

    // Only mark as sent once it actually landed — a failed send above would
    // have thrown before reaching here, so a genuine failure still retries
    // on the next connection rather than silently marking itself done.
    auth.setMeta('welcomed', 1);
    auth.flush(true);
}

async function startBot() {
    await loadAuth();
    const { state, saveCreds } = auth;
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        browser: Browsers.macOS(config.botName),
        printQRInTerminal: false
    });

    // case.js and storage.js call this as a method on the socket —
    // normalizes device-suffixed JIDs (e.g. "1234:5@s.whatsapp.net")
    // down to the bare JID ("1234@s.whatsapp.net").
    sock.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/.test(jid)) {
            const decoded = jidDecode(jid) || {};
            return (decoded.user && decoded.server && `${decoded.user}@${decoded.server}`) || jid;
        }
        return jid;
    };

    global.botConfig = config;
    sock.public = config.workType === 'public';

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log(chalk.bgGreen.black(`✅ ${config.botName} connected successfully!`));
            reconnectAttempts = 0; // a successful connection clears any prior retry count
            sendWelcomeMessage(sock).catch(e =>
                console.log(chalk.red(`Welcome message error: ${e.message}`))
            );

            // Group scheduler — checks every minute for groups due to
            // auto-open/close based on .gcschedule settings saved via getSetting.
            if (!sock._schedulerReady) {
                sock._schedulerReady = true;
                setInterval(async () => {
                    try {
                        const { getSetting, setSetting } = require('./setting/Settings.js');
                        const now = new Date();
                        const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"
                        const groups = await sock.groupFetchAllParticipating().catch(() => ({}));
                        for (const gid of Object.keys(groups)) {
                            const schedule = getSetting(gid, 'gcschedule', null);
                            if (!schedule) continue;
                            if (schedule.openTime === hhmm && schedule.lastAction !== 'open-' + hhmm) {
                                await sock.groupSettingUpdate(gid, 'not_announcement').catch(() => {});
                                setSetting(gid, 'gcschedule', { ...schedule, lastAction: 'open-' + hhmm });
                            } else if (schedule.closeTime === hhmm && schedule.lastAction !== 'close-' + hhmm) {
                                await sock.groupSettingUpdate(gid, 'announcement').catch(() => {});
                                setSetting(gid, 'gcschedule', { ...schedule, lastAction: 'close-' + hhmm });
                            }
                        }
                    } catch (e) {
                        console.log(chalk.red(`Scheduler error: ${e.message}`));
                    }
                }, 60000);
            }
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red(`Connection closed. Reconnecting: ${shouldReconnect}`));
            if (shouldReconnect) {
                if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                    // Already retried twice and still can't get back in —
                    // a dead network/proxy issue would usually recover within
                    // that, so at this point it's almost certainly a genuinely
                    // broken session. Stop burning cycles retrying forever and
                    // wipe it the same way a permanent logout does.
                    console.log(chalk.red(`Gave up after ${reconnectAttempts} reconnect attempts — exiting for cleanup.`));
                    process.exit(75);
                    return;
                }
                reconnectAttempts++;
                // Was calling startBot() with zero delay — reconnecting instantly
                // and repeatedly on every drop is a known way to get WhatsApp to
                // treat the session as unstable and drop it again shortly after.
                console.log(chalk.yellow(`Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in 5s...`));
                setTimeout(() => startBot(), 5000);
            } else {
                // Logged out for good (unlinked from phone, banned, etc.) — there's
                // no session left to reconnect with. Exit with a distinct code so
                // instanceManager.js (the parent process that spawned this bot) can
                // tell this apart from a crash and fully remove this instance —
                // local folder, DB entry, and its GitHub backups — instead of
                // respawning a bot that can never reconnect, or leaving it behind
                // forever taking up space.
                console.log(chalk.red('Session logged out permanently — exiting for cleanup.'));
                process.exit(75);
            }
        }
    });

    if (store) store.bind(sock.ev);

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const nexusboijid = chatUpdate.messages[0];
            if (!nexusboijid.message || !Object.keys(nexusboijid.message).length) return;

            nexusboijid.message = (Object.keys(nexusboijid.message)[0] === 'ephemeralMessage')
                ? nexusboijid.message.ephemeralMessage.message
                : nexusboijid.message;

            if (nexusboijid.key.id.startsWith('BAE5') && nexusboijid.key.id.length === 16) return;

            const m = smsg(sock, nexusboijid, store);
            require('./case')(sock, m, chatUpdate, store);
        } catch (err) {
            console.log(chalk.red(`Message handler error: ${err.message}`));
        }
    });
}

// Safety net for leaked tmp/ files: several commands (stickers, audio
// converters, AI image tools) only delete their scratch file on the
// success path — an error midway leaves it behind forever, and nothing
// else ever swept it. This runs once per instance boot (cwd is this
// instance's own folder, never shared with anyone else) and clears
// anything older than 30 minutes, so leaked files can't accumulate
// past one boot cycle even if a specific command still leaks on error.
function sweepStaleTmpFiles() {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) return;
    const cutoff = Date.now() - 30 * 60 * 1000;
    let swept = 0;
    for (const name of fs.readdirSync(tmpDir)) {
        const filePath = path.join(tmpDir, name);
        try {
            if (fs.statSync(filePath).mtimeMs < cutoff) {
                fs.unlinkSync(filePath);
                swept++;
            }
        } catch (_) {}
    }
    if (swept) console.log(chalk.gray(`🧹 Cleared ${swept} leftover tmp file(s) from before this boot.`));
}

printBanner();
sweepStaleTmpFiles();
startBot().catch((e) => {
    console.log(chalk.red(`❌ Failed to start bot: ${e.message}`));
    process.exit(1);
});
