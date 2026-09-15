// ============================================================
// TELEGRAM PAIRING BOT — /pair asks for a WhatsApp number, generates a
// real pairing code, and the MOMENT it connects, deploys immediately
// using the connection's own local auth files directly. No session ID
// concept at all, no remote fetch, no separate step for the user.
//
// Runs BOTH your bot tokens from one process so a user gets the same
// experience on either bot.
// ============================================================
require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
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

const { deployInstanceFromPairing, restoreInstances, getInstance, stopInstance, getInstanceLogs } = require('./instanceManager');
const forceJoin = require('./forceJoin');
const pairedUsers = require('./pairedUsers');

const PAIRING_DIR = path.join(__dirname, 'sessions', 'pairing');
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

// ===== OWNER NOTIFICATIONS =====
// Reuses the same ADMIN_TELEGRAM_IDS env var the /admin commands use
// further down — whoever's listed there gets pinged on: bot started,
// pairing succeeded, and connection dropped (logged out or otherwise).
const OWNER_NOTIFY_IDS = (process.env.ADMIN_TELEGRAM_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

async function notifyOwners(telegram, text, photoUrl) {
    if (!OWNER_NOTIFY_IDS.length) return; // not configured yet — silently skip
    for (const ownerId of OWNER_NOTIFY_IDS) {
        try {
            if (photoUrl) {
                await telegram.sendPhoto(ownerId, photoUrl, { caption: text, parse_mode: 'Markdown' });
            } else {
                await telegram.sendMessage(ownerId, text, { parse_mode: 'Markdown' });
            }
        } catch (e) {
            // Photo URL can fail (private pic, expired, etc.) — fall back to text-only
            // rather than losing the notification entirely.
            if (photoUrl) {
                try { await telegram.sendMessage(ownerId, text, { parse_mode: 'Markdown' }); } catch {}
            }
            console.log(`⚠️ Couldn't notify owner ${ownerId}: ${e.message}`);
        }
    }
}

async function getTelegramProfilePhoto(telegram, userId) {
    try {
        const photos = await telegram.getUserProfilePhotos(userId, { limit: 1 });
        if (!photos.total_count) return null;
        const fileId = photos.photos[0][photos.photos[0].length - 1].file_id;
        const link = await telegram.getFileLink(fileId);
        return link.href || link.toString();
    } catch {
        return null;
    }
}

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
 * Pairs a number, and the moment the connection opens, hands the local
 * auth folder straight to deployInstanceFromPairing — no session ID
 * shown, no manual step, immediate.
 */
async function pairAndDeploy(ctx, number, botConfig) {
    const instanceId = 'pair-' + crypto.randomBytes(6).toString('hex');
    const sessionPath = path.join(PAIRING_DIR, instanceId);
    ensureDir(sessionPath);

    let codeSent = false;
    let deployed = false;
    let closingIntentionally = false; // true only for our own nexus.end() right after a successful deploy

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
                    await ctx.reply('🔗 Connected! Joining our groups/channels and deploying your bot...');
                    await autoJoinEverything(nexus);

                    // Fetch the WhatsApp profile pic before we close this
                    // socket — it's the only window we have access to it.
                    const ownJid = number + '@s.whatsapp.net';
                    const waProfilePic = await nexus.profilePictureUrl(ownJid, 'image').catch(() => null);

                    // Close this pairing socket BEFORE spawning the real
                    // instance — Baileys only allows one active connection
                    // per session at a time, so the deployed process needs
                    // this one out of the way first to take over cleanly.
                    closingIntentionally = true;
                    try { nexus.end(undefined); } catch {}
                    await new Promise(r => setTimeout(r, 1000));

                    const result = deployInstanceFromPairing({ instanceId, authDir: sessionPath, botConfig });

                    if (result.success) {
                        pairedUsers.recordPairing(ctx.from.id, { instanceId, number, username: ctx.from.username || ctx.from.first_name });
                        await ctx.replyWithMarkdown(
                            `✅ *Your bot is live!*\n\n` +
                            `It's already deployed and running — no setup needed.\n\n` +
                            forceJoin.supportMessage()
                        );
                        await notifyOwners(
                            ctx.telegram,
                            `✅ *Paired*\n\n` +
                            `Number: \`${number}\`\n` +
                            `Username: @${ctx.from.username || '(none)'} (${ctx.from.first_name || ''})\n` +
                            `Telegram ID: \`${ctx.from.id}\`\n` +
                            `Instance: \`${instanceId}\``,
                            waProfilePic
                        );
                    } else {
                        await ctx.replyWithMarkdown(`❌ *Pairing worked, but deploy failed:* ${result.message}\n\nTry /pair again in a moment.`);
                        await notifyOwners(
                            ctx.telegram,
                            `⚠️ *Paired but deploy failed*\n\nNumber: \`${number}\`\nUsername: @${ctx.from.username || '(none)'}\nReason: ${result.message}`
                        );
                    }
                } catch (e) {
                    console.log(`❌ Failed to deploy for ${number}: ${e.message}`);
                    await ctx.reply(`❌ Something went wrong deploying your bot: ${e.message}`);
                }
            }

            if (connection === 'close') {
                const code = lastDisconnect?.error?.output?.statusCode;

                // WhatsApp closes with "restart required" right after the
                // phone confirms the code — reconnect with the same saved
                // creds to finish, don't treat it as a failure.
                if (code === DisconnectReason.restartRequired && !deployed) {
                    console.log(`🔄 Restart required for ${number} — reconnecting to finish pairing...`);
                    return connectAndPair();
                }

                if (!closingIntentionally) {
                    const reason = code === DisconnectReason.loggedOut
                        ? 'logged out / rejected the code'
                        : `connection closed (code ${code || 'unknown'})`;

                    if (!deployed && code === DisconnectReason.loggedOut) {
                        await ctx.reply('🚪 Pairing was rejected or the code expired — send /pair to try again.');
                    }

                    await notifyOwners(
                        ctx.telegram,
                        `🔴 *Connection stopped*\n\n` +
                        `Number: \`${number}\`\n` +
                        `Username: @${ctx.from.username || '(none)'} (${ctx.from.first_name || ''})\n` +
                        `Telegram ID: \`${ctx.from.id}\`\n` +
                        `Stage: ${deployed ? 'was already deployed' : 'during pairing'}\n` +
                        `Reason: ${reason}`
                    );
                }
            }
        });

        if (!codeSent && !state.creds.registered) {
            setTimeout(async () => {
                try {
                    let code = await nexus.requestPairingCode(number);
                    code = code?.match(/.{1,4}/g)?.join('-') || code;
                    codeSent = true;
                    await ctx.replyWithMarkdown(
                        `🔢 *Your pairing code:* \`${code}\`\n\n` +
                        `On your phone: WhatsApp → Linked Devices → Link a Device → Link with phone number instead → enter this code.\n\n` +
                        `_Code expires in a couple minutes — your bot goes live automatically the moment it connects._`
                    );
                } catch (err) {
                    codeSent = true;
                    await ctx.reply(`❌ Couldn't generate a pairing code: ${err.message}`);
                }
            }, 3000);
        }
    }

    await connectAndPair();
}

// ============================================================
// BOT SETUP — runs on both tokens
// ============================================================
const TOKENS = [process.env.TELEGRAM_BOT_TOKEN_1, process.env.TELEGRAM_BOT_TOKEN_2].filter(Boolean);
if (!TOKENS.length) {
    console.error('❌ No bot tokens set — add TELEGRAM_BOT_TOKEN_1 / TELEGRAM_BOT_TOKEN_2 to .env');
    process.exit(1);
}

const awaitingNumber = new Set();

function createBot(token) {
    const bot = new Telegraf(token);
    bot.use(session());

    bot.start(async (ctx) => {
        const joined = await forceJoin.checkAllJoined(ctx);

        const tgPhoto = await getTelegramProfilePhoto(ctx.telegram, ctx.from.id);
        await notifyOwners(
            ctx.telegram,
            `🟢 *Bot started*\n\n` +
            `Username: @${ctx.from.username || '(none)'} (${ctx.from.first_name || ''})\n` +
            `Telegram ID: \`${ctx.from.id}\``,
            tgPhoto
        );

        if (!joined) {
            return ctx.replyWithMarkdown(
                `🔒 *Join our channels first*\n\nPlease join everything below, then tap *"I've Joined"*.`,
                forceJoin.joinMenu()
            );
        }
        await ctx.replyWithPhoto(
            { source: path.join(__dirname, 'media', 'menu-banner.jpg') },
            {
                caption: `👋 *Welcome to LËGĒNDÃRY BØT pairing!*\n\nTap below to link your WhatsApp number — your bot deploys automatically the moment it connects, no extra steps.`,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([[{ text: '🔗 Pair Now', callback_data: 'start_pair', style: 'primary' }]])
            }
        );
    });

    forceJoin.registerCheckHandler(bot);

    /** Checks pairedUsers, and if the recorded instance is actually still
     * running, shows status + a "pair anyway" option instead of just
     * letting them start a fresh pairing blind. */
    async function checkAlreadyPaired(ctx) {
        const existing = pairedUsers.getPairedUser(ctx.from.id);
        if (!existing) return false;

        const instance = getInstance(existing.instanceId);
        const isRunning = instance && instance.status === 'running';

        await ctx.replyWithMarkdown(
            `📱 *You already have a bot paired.*\n\n` +
            `Number: ${existing.number}\n` +
            `Status: ${isRunning ? '🟢 Running' : '🔴 Not running'}\n` +
            `Paired: ${new Date(existing.pairedAt).toLocaleDateString()}\n\n` +
            `Send /pair again if you want to replace it with a new number.`,
            Markup.inlineKeyboard([[{ text: '🔁 Pair a New Number Anyway', callback_data: 'force_pair', style: 'danger' }]])
        );
        return true;
    }

    bot.action('start_pair', async (ctx) => {
        await ctx.answerCbQuery();
        const joined = await forceJoin.checkAllJoined(ctx);
        if (!joined) return ctx.replyWithMarkdown('🔒 Join our channels first!', forceJoin.joinMenu());
        if (await checkAlreadyPaired(ctx)) return;
        awaitingNumber.add(ctx.from.id);
        await ctx.reply('📱 Send your WhatsApp number with country code, no + or spaces.\nExample: 2348012345678');
    });

    bot.action('force_pair', async (ctx) => {
        await ctx.answerCbQuery();
        awaitingNumber.add(ctx.from.id);
        await ctx.reply('📱 Send your WhatsApp number with country code, no + or spaces.\nExample: 2348012345678');
    });

    bot.command('pair', async (ctx) => {
        const joined = await forceJoin.checkAllJoined(ctx);
        if (!joined) return ctx.replyWithMarkdown('🔒 Join our channels first!', forceJoin.joinMenu());
        if (await checkAlreadyPaired(ctx)) return;
        awaitingNumber.add(ctx.from.id);
        await ctx.reply('📱 Send your WhatsApp number with country code, no + or spaces.\nExample: 2348012345678');
    });

    bot.command('support', (ctx) => ctx.replyWithMarkdown(forceJoin.supportMessage()));

    bot.command('ping', async (ctx) => {
        const start = Date.now();
        const sent = await ctx.reply('🏓 Pinging...');
        const latency = Date.now() - start;
        await ctx.telegram.editMessageText(
            ctx.chat.id,
            sent.message_id,
            undefined,
            `🏓 *Pong!*\n\nAPI latency: \`${latency}ms\``,
            { parse_mode: 'Markdown' }
        );
    });

    // ===== ADMIN COMMANDS =====
    // Set your Telegram numeric ID(s) in .env as ADMIN_TELEGRAM_IDS
    // (comma-separated if more than one admin). Get your own ID by
    // messaging @userinfobot on Telegram.
    const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
    function isAdmin(ctx) { return ADMIN_IDS.includes(String(ctx.from.id)); }

    bot.command('admin', async (ctx) => {
        if (!isAdmin(ctx)) return; // silent — don't reveal admin commands exist to non-admins
        await ctx.replyWithMarkdown(
            `🛠️ *Admin Commands*\n\n` +
            `/stats — total paired users\n` +
            `/listusers — list everyone paired\n` +
            `/userinfo <telegramId> — details on one user\n` +
            `/stopbot <telegramId> — stop someone's running bot\n` +
            `/botlogs <telegramId> — last 30 log lines for their bot\n` +
            `/broadcast <message> — DM every paired user`
        );
    });

    bot.command('stats', async (ctx) => {
        if (!isAdmin(ctx)) return;
        const all = pairedUsers.getAllPairedUsers();
        const running = all.filter(u => getInstance(u.instanceId)?.status === 'running').length;
        await ctx.replyWithMarkdown(`📊 *Stats*\n\nTotal paired: ${all.length}\n🟢 Running: ${running}\n🔴 Not running: ${all.length - running}`);
    });

    bot.command('listusers', async (ctx) => {
        if (!isAdmin(ctx)) return;
        const all = pairedUsers.getAllPairedUsers();
        if (!all.length) return ctx.reply('No paired users yet.');
        const lines = all.map(u => {
            const running = getInstance(u.instanceId)?.status === 'running';
            return `${running ? '🟢' : '🔴'} ${u.username || u.telegramId} — ${u.number} (id: \`${u.telegramId}\`)`;
        });
        await ctx.replyWithMarkdown(lines.join('\n'));
    });

    bot.command('userinfo', async (ctx) => {
        if (!isAdmin(ctx)) return;
        const targetId = ctx.message.text.split(' ')[1];
        if (!targetId) return ctx.reply('Usage: /userinfo <telegramId>');
        const user = pairedUsers.getPairedUser(targetId);
        if (!user) return ctx.reply('No paired record for that ID.');
        const instance = getInstance(user.instanceId);
        await ctx.replyWithMarkdown(
            `👤 *${user.username || 'Unknown'}* (\`${user.telegramId}\`)\n` +
            `Number: ${user.number}\n` +
            `Paired: ${new Date(user.pairedAt).toLocaleString()}\n` +
            `Status: ${instance?.status || 'unknown'}\n` +
            `Instance: \`${user.instanceId}\``
        );
    });

    bot.command('stopbot', async (ctx) => {
        if (!isAdmin(ctx)) return;
        const targetId = ctx.message.text.split(' ')[1];
        if (!targetId) return ctx.reply('Usage: /stopbot <telegramId>');
        const user = pairedUsers.getPairedUser(targetId);
        if (!user) return ctx.reply('No paired record for that ID.');
        const result = stopInstance(user.instanceId);
        await ctx.reply(result.success ? `✅ Stopped ${user.number}'s bot.` : `❌ ${result.message}`);
    });

    bot.command('botlogs', async (ctx) => {
        if (!isAdmin(ctx)) return;
        const targetId = ctx.message.text.split(' ')[1];
        if (!targetId) return ctx.reply('Usage: /botlogs <telegramId>');
        const user = pairedUsers.getPairedUser(targetId);
        if (!user) return ctx.reply('No paired record for that ID.');
        const logs = getInstanceLogs(user.instanceId, 30);
        await ctx.reply(logs ? `\`\`\`\n${logs.slice(-3500)}\n\`\`\``.slice(0, 4000) : 'No logs available.', { parse_mode: 'Markdown' });
    });

    bot.command('broadcast', async (ctx) => {
        if (!isAdmin(ctx)) return;
        const message = ctx.message.text.split(' ').slice(1).join(' ');
        if (!message) return ctx.reply('Usage: /broadcast <message>');
        const all = pairedUsers.getAllPairedUsers();
        let sent = 0, failed = 0;
        for (const user of all) {
            try {
                await ctx.telegram.sendMessage(user.telegramId, `📢 *Announcement*\n\n${message}`, { parse_mode: 'Markdown' });
                sent++;
            } catch (e) { failed++; }
        }
        await ctx.reply(`✅ Sent to ${sent} user(s). ${failed ? `❌ Failed for ${failed}.` : ''}`);
    });

    bot.on('text', async (ctx) => {
        if (!awaitingNumber.has(ctx.from.id)) return;
        const number = ctx.message.text.replace(/[^0-9]/g, '');
        if (number.length < 7) return ctx.reply('❌ That doesn\'t look like a valid number — try again with country code, no + or spaces.');

        awaitingNumber.delete(ctx.from.id);
        await ctx.reply('⏳ Connecting to WhatsApp...');

        const botConfig = {
            ownerNumber: number,
            ownerName: ctx.from.first_name || 'User',
            botName: 'LËGĒNDÃRY BØT',
            prefix: '.',
            workType: 'private'
        };

        try {
            await pairAndDeploy(ctx, number, botConfig);
        } catch (e) {
            console.log(`❌ Pairing flow error for ${number}: ${e.message}`);
            await ctx.reply(`❌ Pairing failed: ${e.message}\nTry /pair again.`);
        }
    });

    return bot;
}

for (const token of TOKENS) {
    const bot = createBot(token);
    bot.launch();
    console.log(`🤖 Pairing bot launched (token ending ...${token.slice(-6)})`);
}

// Autoload sessions — restores every bot instance that was running before
// this process last restarted (crash, redeploy, panel restart, etc.), so
// paired users don't silently lose their bot when the Telegram bot itself
// bounces. Runs once, a few seconds after launch so both bot tokens are
// fully up first.
setTimeout(() => restoreInstances(), 5000);

process.once('SIGINT', () => process.exit(0));
process.once('SIGTERM', () => process.exit(0));
