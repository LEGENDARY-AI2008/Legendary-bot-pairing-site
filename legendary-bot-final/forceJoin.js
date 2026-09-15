// ============================================================
// FORCEJOIN.JS — gate that requires users to join your channels/groups
// before using the bot. Drop this into either/both Telegram bots.
// ============================================================
const { Markup } = require('telegraf');

// Telegram channels/groups people must join. `chatId` is what the bot
// uses internally to check membership (needs an @username or numeric
// chat id the bot can see) — `url` is just what the button opens.
// `style` is a REAL Telegram button color, added in Bot API 9.4 (Feb 9,
// 2026) — only 3 values exist: primary (blue), success (green), danger
// (red). Replaces the earlier colored-circle-emoji workaround, which was
// needed before this existed but isn't anymore.
const REQUIRED_CHANNELS = [
    { label: '📢 Announcement Channel', url: 'https://t.me/legendbotch1', chatId: '@legendbotch1', style: 'primary' },
    { label: '💬 Discussion Group', url: 'https://t.me/legendbotchannel', chatId: '@legendbotchannel', style: 'success' },
    { label: '📣 Channel 2', url: 'https://t.me/legendbotch2', chatId: '@legendbotch2', style: 'primary' },
    { label: '⭐ Sponsor Channel', url: 'https://t.me/legendarylab001', chatId: '@legendarylab001', style: 'danger' }
];

// WhatsApp channels shown as extra buttons (Telegram can't verify
// WhatsApp follows, so these are shown as "please also follow" rather
// than gated/enforced).
const WHATSAPP_CHANNELS = [
    { label: '💚 LËGĒNDÃRY BØT — WhatsApp Channel', url: 'https://whatsapp.com/channel/0029Vb81Zt6FMqre8LgZJE0U', style: 'success' },
    { label: '💚 LËGĒNDÃRY LAB™ Studio — WhatsApp Channel', url: 'https://whatsapp.com/channel/0029VbC6ccj0rGiJxFxsP92A', style: 'success' }
];

function joinMenu(alreadyJoinedNote = false) {
    const buttons = [
        ...REQUIRED_CHANNELS.map(c => [{ text: c.label, url: c.url, style: c.style }]),
        ...WHATSAPP_CHANNELS.map(c => [{ text: c.label, url: c.url, style: c.style }]),
        [{ text: '✅ I\'ve Joined — Verify', callback_data: 'check_joined', style: 'success' }]
    ];
    return Markup.inlineKeyboard(buttons);
}

/** Checks whether a Telegram user is currently a member of every required channel/group. */
async function checkAllJoined(ctx) {
    for (const channel of REQUIRED_CHANNELS) {
        try {
            const member = await ctx.telegram.getChatMember(channel.chatId, ctx.from.id);
            if (['left', 'kicked'].includes(member.status)) return false;
        } catch (e) {
            // If the bot can't check (not an admin in that chat, wrong
            // chatId, etc.) fail open rather than permanently locking
            // everyone out over a config mistake — but log it so you
            // notice and fix the chatId/admin setup.
            console.log(`⚠️ Couldn't verify membership for ${channel.chatId}: ${e.message}`);
        }
    }
    return true;
}

/**
 * Telegraf middleware — call this once with bot.use(forceJoin.middleware)
 * to gate every command behind channel membership. /start still needs
 * its own handler for the welcome flow; this covers everything else.
 */
async function middleware(ctx, next) {
    // Don't gate the "check again" button itself, or nothing could ever
    // unblock a user.
    if (ctx.callbackQuery?.data === 'check_joined') return next();

    const joined = await checkAllJoined(ctx);
    if (!joined) {
        await ctx.replyWithMarkdown(
            `🔒 *Join our channels to continue*\n\n` +
            `Please join everything below, then tap *"I've Joined"*.`,
            joinMenu()
        );
        return; // block — don't call next()
    }
    return next();
}

/** Wire this to the 'check_joined' button. */
function registerCheckHandler(bot) {
    bot.action('check_joined', async (ctx) => {
        const joined = await checkAllJoined(ctx);
        await ctx.answerCbQuery(joined ? '✅ Verified!' : '❌ Still missing one or more — join them all first.');
        if (joined) {
            await ctx.editMessageText('✅ *Thanks for joining!* You can now use the bot — send /start.', { parse_mode: 'Markdown' });
        }
    });
}

function supportMessage() {
    return (
        `🛟 *Need help?*\n\n` +
        `For support, join our groups:\n` +
        REQUIRED_CHANNELS.map(c => `${c.label}: ${c.url}`).join('\n') + '\n\n' +
        `And follow us on WhatsApp:\n` +
        WHATSAPP_CHANNELS.map(c => `${c.label}: ${c.url}`).join('\n')
    );
}

module.exports = { REQUIRED_CHANNELS, WHATSAPP_CHANNELS, joinMenu, checkAllJoined, middleware, registerCheckHandler, supportMessage };
