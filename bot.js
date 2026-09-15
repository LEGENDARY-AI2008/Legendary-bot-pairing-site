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

const API_BASE_URL = process.env.API_BASE_URL || 'https://legendarybot.dpdns.org';
const SESSION_DIR = path.join(__dirname, 'session');
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

    console.log(chalk.yellow('🔄 Fetching your session...'));
    let response;
    try {
        response = await axios.get(`${API_BASE_URL}/api/session/${config.sessionId}`);
    } catch (e) {
        console.log(chalk.red(`❌ Could not fetch session: ${e.response?.data?.error || e.message}`));
        process.exit(1);
    }

    const { files } = response.data;
    if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });
    for (const [filename, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(SESSION_DIR, filename), content, 'utf-8');
    }
    console.log(chalk.green('✅ Session restored locally.'));
}

async function sendWelcomeMessage(sock) {
    if (sock.welcomeSent) return;
    sock.welcomeSent = true;

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

printBanner();
startBot().catch((e) => {
    console.log(chalk.red(`❌ Failed to start bot: ${e.message}`));
    process.exit(1);
});
