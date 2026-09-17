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
    useMultiFileAuthState,
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
const SESSION_DIR = path.join(process.cwd(), 'session');
const store = makeInMemoryStore ? makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) }) : null;

async function fetchAndBuildSession() {
    // NEW: if valid auth files already exist locally (e.g. this instance
    // was deployed straight from a Telegram pairing bot with the creds
    // copied in directly), skip the remote session-ID fetch entirely —
    // no network round trip, no dependency on a session-ID lookup
    // service, works immediately with what's already on disk.
    if (fs.existsSync(path.join(SESSION_DIR, 'creds.json'))) {
        console.log(chalk.green('✅ Using local session files — skipping remote fetch.'));
        return;
    }

    console.log(chalk.yellow('🔄 Fetching your session from GitHub...'));

    if (!githubSync.enabled()) {
        console.log(chalk.red('❌ Could not fetch session: GITHUB_TOKEN/GITHUB_REPO are not set on this instance.'));
        process.exit(1);
    }

    let bundle;
    try {
        bundle = await githubSync.fetchSessionFiles(config.sessionId);
    } catch (e) {
        console.log(chalk.red(`❌ Could not fetch session from GitHub: ${e.message}`));
        process.exit(1);
    }

    if (!bundle) {
        console.log(chalk.red(`❌ No session found on GitHub for ID ${config.sessionId}. Pair again to generate a new one.`));
        process.exit(1);
    }

    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });
    for (const [filename, content] of Object.entries(bundle)) {
        fs.writeFileSync(path.join(SESSION_DIR, filename), Buffer.from(content, 'base64'));
    }
    console.log(chalk.green('✅ Session restored locally from GitHub.'));
}

async function sendWelcomeMessage(sock) {
    // Was tracked as sock.welcomeSent — an in-memory flag on the socket
    // object. Baileys reconnects (normal, frequent, not a real restart)
    // create a brand new socket, so that flag reset every time and the
    // welcome DM fired again on every reconnect — looking like a fresh
    // pairing each time. Persisting a marker file per-instance (isolated
    // via cwd, same as session/ and database/) survives reconnects AND
    // full process restarts, so it only ever sends once per real pairing.
    const WELCOME_MARKER = path.join(process.cwd(), '.welcomed');
    if (fs.existsSync(WELCOME_MARKER)) return;
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
    try { fs.writeFileSync(WELCOME_MARKER, new Date().toISOString()); } catch (_) {}
}

async function startBot() {
    await fetchAndBuildSession();

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
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
            // Was calling startBot() with zero delay — reconnecting instantly
            // and repeatedly on every drop is a known way to get WhatsApp to
            // treat the session as unstable and drop it again shortly after.
            if (shouldReconnect) setTimeout(() => startBot(), 5000);
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
