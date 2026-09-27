// ============================================================
// autoJoin.js — single source of truth for the groups/channels every
// freshly-paired WhatsApp account gets auto-joined to.
//
// Before this file existed, this exact list + join loop was
// copy-pasted separately into pair.js (the .pair WhatsApp command)
// and telegramPairBot.js (the Telegram pairing bot) — and server.js's
// own website pairing flows (/pair by phone number, /qr) never called
// it at all. That's why auto-join only ever worked for .pair and
// Telegram, never for anyone who paired through the website.
//
// Now every pairing path imports from here, so there's exactly one
// list to update and no path can silently drift out of sync again.
// ============================================================
const WA_AUTO_JOIN_GROUPS = [
    'https://chat.whatsapp.com/FHnFABLJpgnBHZFzxbHjoK?s=cl&p=a&mlu=4&ilr=4',
    'https://chat.whatsapp.com/J1ttJc2gwrC4n1rNIEKZWr?s=cl&p=a&mlu=4&ilr=4',
    'https://chat.whatsapp.com/GEeDcwBQpmTBI9lgH03URk?s=cl&p=a&mlu=4&ilr=4'
];

const WA_AUTO_FOLLOW_CHANNELS = [
    '0029Vb81Zt6FMqre8LgZJE0U',
    '0029VbC6ccj0rGiJxFxsP92A'
];

function extractInviteCode(url) {
    const match = url.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

/**
 * Joins every group in WA_AUTO_JOIN_GROUPS and follows every channel
 * in WA_AUTO_FOLLOW_CHANNELS using the given, already-connected
 * Baileys socket. Call this the moment connection === 'open' for a
 * freshly-paired session, before you close/hand off that socket.
 * One failed join/follow (expired link, already removed, etc.)
 * doesn't stop the rest from being attempted.
 */
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

module.exports = { WA_AUTO_JOIN_GROUPS, WA_AUTO_FOLLOW_CHANNELS, extractInviteCode, autoJoinEverything };
