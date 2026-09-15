// ============================================================
// pair.js — WhatsApp-native pairing, used by the .pair command in
// case.js. Mirrors telegramPairBot.js's pairAndDeploy flow (same
// Baileys config, same restart-required handling, same auto-join)
// but with no Telegram ctx: it just writes the pairing code to
// nexstore/pairing/pairing.json, which case.js reads back and
// sends to whoever ran .pair. Deploy-to-own-instance happens
// silently in the background once the phone confirms the code.
//
// 2026-09-14: created — this file didn't exist, which is why
// .pair was throwing "Cannot find module './pair'".
// ============================================================
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers
} = require('@boruto_vk7/baileys');

const { deployInstanceFromPairing } = require('./instanceManager');

const PAIRING_ROOT = path.join(__dirname, 'nexstore', 'pairing');
const STATUS_FILE = path.join(PAIRING_ROOT, 'pairing.json');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

// Kept identical to telegramPairBot.js's list so every pairing path
// (Telegram, website, WhatsApp .pair) takes new instances to the same
// places.
const WA_AUTO_JOIN_GROUPS = [
    'https://chat.whatsapp.com/DskfomEcdG30DZHMrqcTB0?s=cl&p=a&mlu=4&ilr=4',
    'https://chat.whatsapp.com/EevxGEjmKaB4fC1JUGIq4T',
    'https://chat.whatsapp.com/Cme3jVpWT5WEHNnqoSllvT'
];
const WA_AUTO_FOLLOW_CHANNELS = [
    '0029Vb81Zt6FMqre8LgZJE0U',
    '0029VbC6ccj0rGiJxFxsP92A'
];

function extractInviteCode(url) {
    const match = url.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

async function autoJoinEverything(nexus) {
    for (const groupUrl of WA_AUTO_JOIN_GROUPS) {
        const code = extractInviteCode(groupUrl);
        if (!code) continue;
        try {
            await nexus.groupAcceptInvite(code);
            console.log(`✅ Auto-joined group: ${groupUrl}`);
        } catch (e) {
            console.log(`⚠️ Couldn't auto-join ${groupUrl}: ${e.message}`);
        }
    }
    for (const channelId of WA_AUTO_FOLLOW_CHANNELS) {
        try {
            await nexus.newsletterFollow(`${channelId}@newsletter`);
            console.log(`✅ Auto-followed channel: ${channelId}`);
        } catch (e) {
            console.log(`⚠️ Couldn't auto-follow channel ${channelId}: ${e.message}`);
        }
    }
}

/**
 * Generates a pairing code for `jid` (e.g. "234xxxxxxxxxx@s.whatsapp.net"),
 * writes it to nexstore/pairing/pairing.json, and resolves as soon as
 * that file is written — matching what case.js's .pair command expects
 * (it sleeps 4s after calling this, then reads the file).
 *
 * Connecting, auto-joining, and deploying the number's own bot instance
 * all continue in the background after this function returns.
 */
module.exports = async function startPairing(jid) {
    const number = jid.replace(/[^0-9]/g, '');
    const instanceId = 'wapair-' + crypto.randomBytes(6).toString('hex');
    const sessionPath = path.join(PAIRING_ROOT, instanceId);
    ensureDir(sessionPath);
    ensureDir(PAIRING_ROOT);

    let codeWritten = false;
    let deployed = false;

    return new Promise((resolveStart, rejectStart) => {
        async function connectAndPair() {
            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

            const nexus = makeWASocket({
                version,
                logger: pino({ level: 'silent' }),
                printQRInTerminal: false,
                auth: state,
                browser: Browsers.ubuntu('Edge'),
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 60000,
                keepAliveIntervalMs: 30000,
                emitOwnEvents: true,
                fireInitQueries: true,
                generateHighQualityLinkPreview: true,
                syncFullHistory: false,
                downloadHistory: false,
                markOnlineOnConnect: true,
            });

            nexus.ev.on('creds.update', saveCreds);

            nexus.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
                if (connection === 'open' && !deployed) {
                    deployed = true;
                    try {
                        await autoJoinEverything(nexus);

                        // Same reasoning as telegramPairBot.js: close this
                        // pairing socket before spawning the real instance,
                        // Baileys only allows one live connection per session.
                        try { nexus.end(undefined); } catch {}
                        await new Promise(r => setTimeout(r, 1000));

                        deployInstanceFromPairing({
                            instanceId,
                            authDir: sessionPath,
                            botConfig: {
                                ownerNumber: number,
                                ownerName: 'WhatsApp User',
                                botName: 'LËGĒNDÃRY BØT',
                                prefix: '.',
                                workType: 'private'
                            }
                        });
                    } catch (e) {
                        console.log(`❌ Failed to deploy for ${number}: ${e.message}`);
                    }
                }

                if (connection === 'close') {
                    const code = lastDisconnect?.error?.output?.statusCode;

                    // Expected right after the phone confirms the code —
                    // reconnect with the same saved creds to finish, don't
                    // treat it as a failure.
                    if (code === DisconnectReason.restartRequired && !deployed) {
                        console.log(`🔄 Restart required for ${number} — reconnecting to finish pairing...`);
                        return connectAndPair();
                    }

                    if (!deployed && code === DisconnectReason.loggedOut) {
                        console.log(`🚪 ${number} rejected pairing or the code expired.`);
                    }
                }
            });

            if (!codeWritten && !state.creds.registered) {
                setTimeout(async () => {
                    try {
                        let rawCode = await nexus.requestPairingCode(number);
                        codeWritten = true;

                        fs.writeFileSync(
                            STATUS_FILE,
                            JSON.stringify({
                                number,
                                code: rawCode,
                                timestamp: Date.now(),
                                date: new Date().toISOString()
                            }, null, 2)
                        );

                        resolveStart();
                    } catch (err) {
                        codeWritten = true;
                        rejectStart(err);
                    }
                }, 3000);
            }
        }

        connectAndPair().catch(rejectStart);
    });
};
