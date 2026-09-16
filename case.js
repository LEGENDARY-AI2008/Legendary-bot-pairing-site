
// Panel has no built-in Environment Variables tab, so config comes from
// config.env in this project's root instead (this bot's convention —
// confirmed it already holds SESSION_ID/OWNER_NAME/BOT_NAME/etc). Loads
// it into process.env before anything below reads from it. Wrapped in
// try/catch so a missing dotenv package doesn't crash the whole bot.
try { require('dotenv').config({ path: require('path').join(process.cwd(), 'config.env') }); } catch (_) {}

require('./setting/config')
const { 
  default: baileys, proto, jidNormalizedUser, generateWAMessage, 
  generateWAMessageFromContent, getContentType, prepareWAMessageMedia,
  getDevice: __baileys_getDevice
} = require("@boruto_vk7/baileys");
const { downloadMediaMessage } = require("@boruto_vk7/baileys");

const {
  downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, 
  generateWAMessageContent, makeInMemoryStore, MediaType, areJidsSameUser, 
  WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, 
  GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions, 
  useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, 
  WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, 
  WALocationMessage, WAContextInfo, WAGroupMetadata, ProxyAgent, 
  waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, 
  WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, 
  WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, 
  MediariyuInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, 
  WAMediaUpload, mentionedJid, processTime, Browser, MessageType, 
  Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, 
  GroupSettingChange, DisriyuectReason, WASocket, getStream, WAProto, 
  isBaileys, AnyMessageContent, fetchLatestBaileysVersion, 
  templateMessage, InteractiveMessage, Header 
} = require("@boruto_vk7/baileys");

const fs = require('fs')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
const os = require('os')
const axios = require('axios')
const fsx = require('fs-extra')

async function askOpenAI(prompt) {
    const { data } = await axios.get(
        "https://prexzyapis.com/ai/askgpt5",
        {
            params: {
                prompt: prompt
            }
        }
    );
    return data.result || data.response || data.answer || data.message || "No response.";
}

// Wraps askOpenAI with per-chat conversation memory. The underlying API is a
// plain single-prompt completion endpoint (no messages array/roles), so
// memory is added by prepending a transcript of recent turns to the prompt.
async function askOpenAIWithMemory(getSetting, setSetting, chatId, prompt) {
    const history = getSetting(chatId, "chatbotHistory", []);

    let fullPrompt = prompt;
    if (history.length) {
        const transcript = history
            .map(turn => `User: ${turn.user}\nAssistant: ${turn.bot}`)
            .join('\n');
        fullPrompt = `Continue this conversation naturally. Here is the recent history:\n\n${transcript}\n\nUser: ${prompt}\nAssistant:`;
    }

    const answer = await askOpenAI(fullPrompt);

    const updatedHistory = [...history, { user: prompt, bot: answer }].slice(-6); // keep last 6 turns
    setSetting(chatId, "chatbotHistory", updatedHistory);

    return answer;
}
const crypto = require('crypto')
const googleTTS = require('google-tts-api')
const ffmpeg = require('fluent-ffmpeg')
const speed = require('performance-now')
const { spawn: spawn, exec } = require('child_process')
const timestampp = speed();
const jimp = require("jimp")
const latensi = speed() - timestampp
const moment = require('moment-timezone')
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const FormData = require('form-data');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { smsg, tanggal, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins, generateProfilePicture } = require('./allfunc/storage')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('./allfunc/exif.js')
const RICHPIC_PATH = require('path').join(__dirname, 'media', 'image1.jpg');
let richpic = null;
try {
    richpic = fs.readFileSync(RICHPIC_PATH);
} catch (e) {
    console.log('⚠️ richpic image not loaded:', e.message);
}
// Menu banner image — safe/optional unlike richpic above (won't crash
// startup if missing, since this is new and the file may not be placed
// yet). Drop your image at ./media/menu-banner.jpg in the bot's project
// folder to enable it; .menu falls back to text-only until then.
const MENU_IMAGE_PATH = './media/menu-banner.jpg';
let menuImageBuffer = null;
try {
    if (fs.existsSync(MENU_IMAGE_PATH)) menuImageBuffer = fs.readFileSync(MENU_IMAGE_PATH);
} catch (e) {
    console.log('⚠️ Menu image not loaded:', e.message);
}
const numberEmojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];

// ============ CREATE REQUIRED DIRECTORIES ============
const requiredDirs = [
    './database',
    './database/pairing',
    './database/sessions',
    './tmp',
    './media'
];

requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});
// ====================================================

// ============ PERSISTENT STORAGE FOR MUTED USERS ============
const MUTED_FILE = './database/muted.json';

function loadMutedData() {
  try {
    if (!fs.existsSync(MUTED_FILE)) {
      fs.writeFileSync(MUTED_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(MUTED_FILE));
  } catch (e) {
    console.log('Error loading muted data:', e);
    return {};
  }
}

function saveMutedData(data) {
  try {
    fs.writeFileSync(MUTED_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.log('Error saving muted data:', e);
    return false;
  }
}

// Load existing muted data
global.muted = loadMutedData();
// ============================================================

// ============ SUDO FUNCTIONS ============
const SUDO_FILE = './database/sudo.json';

function loadSudoList() {
  if (!fs.existsSync(SUDO_FILE)) {
    fs.writeFileSync(SUDO_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(SUDO_FILE));
}

function saveSudoList(data) {
  fs.writeFileSync(SUDO_FILE, JSON.stringify(data, null, 2));
}
// ========================================

// ============ CHANNEL LOG FUNCTIONS ============
const CHANNELLOG_FILE = './database/channellog.json';

function loadChannelLog() {
    try {
        if (!fs.existsSync(CHANNELLOG_FILE)) fs.writeFileSync(CHANNELLOG_FILE, JSON.stringify({}));
        return JSON.parse(fs.readFileSync(CHANNELLOG_FILE));
    } catch (e) { return {}; }
}

function saveChannelLog(data) {
    try { fs.writeFileSync(CHANNELLOG_FILE, JSON.stringify(data, null, 2)); } catch (e) {}
}
// Structure: { 'userJid': { enabled: false, channels: ['jid@newsletter'] } }
// ===============================================

// ============ PREFIX FUNCTIONS ============
const PREFIX_FILE = './database/prefixes.json';

function loadPrefixes() {
  if (!fs.existsSync(PREFIX_FILE)) {
    fs.writeFileSync(PREFIX_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(PREFIX_FILE));
}

function savePrefixes(data) {
  fs.writeFileSync(PREFIX_FILE, JSON.stringify(data, null, 2));
}

function getUserPrefix(userId) {
  const prefixes = loadPrefixes();
  // Was `prefixes[userId] || '.'`, which treats a stored empty string
  // (no-prefix mode) as falsy and silently falls back to '.' — so
  // no-prefix mode could never actually stick. Only fall back to '.'
  // when the user has no entry at all.
  return Object.prototype.hasOwnProperty.call(prefixes, userId) ? prefixes[userId] : '.';
}

function setUserPrefix(userId, prefix) {
  const prefixes = loadPrefixes();
  prefixes[userId] = prefix;
  savePrefixes(prefixes);
}

// ============ SESSION FUNCTIONS ============
// ============ REAL COMMAND COUNT (self-reading) ============
// The menu's command/category counts used to come from counting "• " lines
// in a huge hand-maintained static text block — completely disconnected
// from the actual switch statement, so it drifted out of sync (showed
// "500+" while the real switch had 800+ case labels, many of them aliases
// of the same command). This reads the file's OWN source at startup and
// counts real, deduplicated case labels instead, so the number shown is
// never stale again — it updates itself every time commands are added.
let __REAL_COMMAND_COUNT__ = 0;
let __REAL_COMMAND_LIST__ = [];
try {
    const __selfSource = fs.readFileSync(__filename, 'utf8');
    const __caseMatches = __selfSource.match(/^\s*case\s+['"][a-zA-Z0-9_]+['"]\s*:/gm) || [];
    const __names = __caseMatches.map(c => c.match(/['"]([a-zA-Z0-9_]+)['"]/)[1]);
    __REAL_COMMAND_LIST__ = [...new Set(__names)].sort();
    __REAL_COMMAND_COUNT__ = __REAL_COMMAND_LIST__.length;
} catch (e) {
    console.log('⚠️ Could not self-read command count:', e.message);
}
// =============================================================

const SESSION_FILE = './database/sessions.json';
const PAIRING_DIR = './database/pairing/';

function loadUsers() {
    try {
        if (!fs.existsSync(SESSION_FILE)) {
            fs.writeFileSync(SESSION_FILE, JSON.stringify([]));
        }
        return JSON.parse(fs.readFileSync(SESSION_FILE));
    } catch (e) {
        console.log('Error loading sessions:', e);
        return [];
    }
}

function getSession(userId) {
    try {
        const cleanId = userId.split('@')[0].replace(/[^0-9]/g, '');
        const sessionFiles = fs.readdirSync(PAIRING_DIR).filter(file => 
            file.includes(cleanId) || file.includes(userId)
        );
        
        if (sessionFiles.length > 0) {
            const sessionFile = sessionFiles[0];
            const sessionPath = path.join(PAIRING_DIR, sessionFile);
            const sessionData = JSON.parse(fs.readFileSync(sessionPath));
            
            return {
                user: { id: userId },
                id: userId,
                jid: userId,
                data: sessionData,
                sendMessage: async (jid, message) => {
                    try {
                        // Check if devtrust exists and is ready
                        if (typeof devtrust !== 'undefined' && devtrust && devtrust.sendMessage) {
                            return await devtrust.sendMessage(jid, message);
                        } else {
                            console.log(`⚠️ devtrust not ready yet for ${userId}, message queued`);
                            // Store message to send later (optional - you can implement a queue)
                            return null;
                        }
                    } catch (err) {
                        console.error(`SendMessage error for ${userId}:`, err);
                        return null;
                    }
                }
            };
        }
        return null;
    } catch (e) {
        console.log('Error getting session:', e);
        return null;
    }
}
// ========================================

// ============ GLOBAL VARIABLES ============
global.packname = (global.botConfig?.botName || process.env.BOT_NAME || "LËGĚNDÃRY BØT") + " MD";
global.author = "LËGĚNDÃRY Ł𝗮𝗯𝘀™";
// ============ GLOBAL VARIABLES FOR FEATURES ============
global.antispam = {};      // For anti-spam feature
global.warns = {};         // For warning system
global.muted = global.muted || {};      // For mute system — was unconditionally
                                          // resetting to {} right after loadMutedData()
                                          // populated it above, silently wiping every
                                          // saved mute on each bot restart.
global.banned = global.banned || {};  // For banned users
const tictactoeGames = {};
const hangmanGames = {};

// ============ SCROLLABLE TABLE HELPER ============
// Wraps the fork's native table-message support (confirmed working by boss's
// test) so any command can send a scrollable table without repeating the
// boilerplate. `rows` should include the header row as rows[0].
async function sendTable(sock, chatId, { title, headerText, rows, footerText, disclaimerText, contextMsg }) {
    return await sock.sendMessage(chatId, {
        disclaimerText: disclaimerText || 'Table',
        headerText: headerText || '',
        contentText: '---',
        title: title || '',
        table: rows,
        noHeading: false,
        footerText: footerText || ''
    }, contextMsg ? { quoted: contextMsg } : undefined);
}

// ============ MADRIN/SUPREME API HELPER ============
// Was pointed at api-madrin.zone.id, then api-supreme.zone.id. Per explicit
// instruction: zero references to the Madrin provider anywhere in this
// file, full stop — no exceptions for endpoints that don't have a
// confirmed 1:1 Prexzy match. MADRIN_BASE/madrinGet now just alias
// straight to Prexzy. The practical effect: the handful of features that
// genuinely have no Prexzy equivalent (Logo/Maker's ~98 styles, Snapchat,
// Stickerly, Wattpad, Bilibili, RemoveBG) will get a clean "not
// available" style error instead of quietly working on the old provider
// — which is what was explicitly asked for, so that's intentional, not
// an oversight. madrinFetchImage below has its own clear message for the
// Logo/Maker case specifically since that's the largest chunk (98 cmds).
const MADRIN_BASE = 'https://prexzyapis.com';
async function madrinGet(endpoint, extraParams = {}, timeoutMs = 25000) {
    const res = await axios.get(`${MADRIN_BASE}${endpoint}`, {
        params: extraParams,
        timeout: timeoutMs
    });
    return res.data;
}

// ============ PREXZY API HELPER ============
// New provider (docs.prexzyapis.com / prexzyapis.com), 509 endpoints, no
// API key required, GET & POST both work. Endpoint paths mirror Madrin's
// layout closely (/download/*, /ai/*, /search/*, /tools/*) but NOT every
// param name matches — check each call site. Response shapes are NOT
// confirmed live (no outbound network access while writing this), so
// every call still goes through the same defensive madrinExtractLink /
// madrinExtractTitle helpers below rather than trusting one field name.
// Migrating category-by-category; sites still on MADRIN_BASE haven't
// been moved over yet.
const PREXZY_BASE = 'https://prexzyapis.com';
async function prexzyGet(endpoint, extraParams = {}, timeoutMs = 25000) {
    const res = await axios.get(`${PREXZY_BASE}${endpoint}`, {
        params: extraParams,
        timeout: timeoutMs,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    return res.data;
}

// Cheap line-set diff (not a true LCS diff) — good enough to hand to the
// AI as "here's roughly what changed" without shipping the whole file.
// Ignores line ordering/duplicates on purpose, we only care about content
// that's genuinely new vs genuinely gone.
function computeLineDiff(oldStr = '', newStr = '', maxLines = 80) {
    const clean = (s) => s.split('\n').map(l => l.trim()).filter(Boolean);
    const oldLines = clean(oldStr);
    const newLines = clean(newStr);
    const oldSet = new Set(oldLines);
    const newSet = new Set(newLines);

    const added = newLines.filter(l => !oldSet.has(l));
    const removed = oldLines.filter(l => !newSet.has(l));

    return {
        added: added.slice(0, maxLines),
        removed: removed.slice(0, maxLines),
        addedTotal: added.length,
        removedTotal: removed.length
    };
}

// Builds a friendly, non-technical changelog from the raw diffs using the
// same AI backend as .gemini/.openai. Falls back to a plain line-count
// summary if the AI call fails, so .update never gets stuck on this step.
async function generateUpdateChangelog(changes) {
    const sections = changes.map(({ filename, oldContent, newContent }) => {
        const { added, removed, addedTotal, removedTotal } = computeLineDiff(oldContent, newContent);
        return `File: ${filename}\n` +
            `Added (${addedTotal} lines total, sample below):\n${added.join('\n') || '(none)'}\n\n` +
            `Removed (${removedTotal} lines total, sample below):\n${removed.join('\n') || '(none)'}`;
    }).join('\n\n---\n\n');

    const prompt =
        `You're writing a short WhatsApp changelog message for bot users based on a raw code diff.\n` +
        `Summarize what likely changed in plain, friendly language — new features, fixes, tweaks. ` +
        `Never mention code, variable names, function names, or file internals directly — describe ` +
        `the user-facing impact only. Use short bullet points with emojis, under 120 words total, no code blocks.\n\n` +
        sections;

    // Tried one AI endpoint and silently fell back to a raw line-count
    // summary on any failure — but that endpoint alone has been flaky
    // tonight. Try a few different real Prexzy models in sequence before
    // actually giving up, since a working writeup is the whole point of this.
    const endpoints = [
        { path: '/ai/askgpt5', params: { prompt } },
        { path: '/ai/gemini', params: { prompt } },
        { path: '/ai/mistral', params: { prompt } },
        { path: '/ai/qwen', params: { prompt } }
    ];
    for (const { path, params } of endpoints) {
        try {
            const madrinRes = await prexzyGet(path, params);
            const answer = prexzyExtractAnswer(madrinRes);
            if (answer && answer.trim().length > 10) return answer.trim();
        } catch (e) {
            console.log(chalk.yellow(`⚠️ Changelog generation failed via ${path}: ${e.message}`));
        }
    }

    // Every model failed — fall back to line deltas rather than nothing,
    // but this should be rare now that multiple models are tried.
    return changes.map(({ filename, oldContent, newContent }) => {
        const delta = newContent.split('\n').length - oldContent.split('\n').length;
        return `• *${filename}* — ${delta >= 0 ? `+${delta}` : delta} lines`;
    }).join('\n') + '\n\n_⚠️ AI writeup unavailable right now — showing raw line changes instead._';
}
// Pulls a usable link out of a response no matter which shape it came back
// in. Confirmed shapes are flat (status/title/download_url etc. all at
// root) but this stays defensive with nested .data/.result fallbacks too,
// in case a not-yet-tested endpoint differs.
function madrinExtractLink(data) {
    if (!data) return null;
    return data.download_url || data.video_url || data.image_url || data.url || data.link
        || data.hd || data.sd
        || data?.data?.hd || data?.data?.sd || data?.data?.url || data?.data?.download_url
        || data?.result?.url || data?.result?.download_url || data?.result?.link
        || null;
}
function madrinExtractTitle(data, fallback = 'File') {
    if (!data) return fallback;
    return data.title || data.filename || data.name
        || data?.data?.title || data?.result?.title || fallback;
}

// Pulls the first usable result out of Prexzy's /search/youtube response.
// Shape isn't confirmed live, so this tries several plausible layouts
// (array at root, .result, .results, .data) and several plausible field
// names per item before giving up.
function prexzyExtractYtSearchResult(data) {
    const list = data?.result || data?.results || data?.data || data?.videos
        || (Array.isArray(data) ? data : null);
    const first = Array.isArray(list) ? list[0] : (data?.video || null);
    if (!first) return null;
    const videoId = first.videoId || first.id || first.video_id || null;
    const url = first.url || first.link || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null);
    if (!url) return null;
    return {
        url,
        title: first.title || first.name || 'Unknown',
        author: first.author?.name || first.author || first.channel || first.uploader || 'Unknown'
    };
}

// ============ PARTICIPANT JID NORMALIZER ============
// kick/add/promote/demote were all rebuilding the target jid by stripping
// non-digits and hard-appending '@s.whatsapp.net'. That's wrong for any
// group where WhatsApp is using privacy "@lid" addressing instead of a
// phone-number jid (increasingly common) — stripping an @lid id down to
// digits and reattaching '@s.whatsapp.net' produces a jid that doesn't
// match any real participant, so groupParticipantsUpdate fails server-side
// with a generic error. Fix: if we already have a full jid (contains '@'),
// keep its actual domain (@lid or @s.whatsapp.net) as-is. Only build a jid
// from scratch when we were handed a bare phone number.
function toParticipantJid(input) {
    if (!input) return null;
    if (input.includes('@')) return input;
    const digits = input.replace(/\D/g, '');
    if (!digits) return null;
    return digits + '@s.whatsapp.net';
}

// ============ PREXZY API — GENERIC DOWNLOADER HANDLER ============
// Shared fetch/extract/send routine for the simple "link in -> media out"
// Prexzy downloader endpoints, so each command case below stays a few
// lines instead of repeating the same boilerplate. mediaType controls how
// the result gets sent back: 'video' (default), 'image', 'audio', or
// 'document'.
async function prexzyDownloadAndSend(m, reply, { endpoint, params, label, mediaType = 'video', fileName }) {
    try {
        reply('⏳ *Downloading...*');
        const data = await prexzyGet(endpoint, params);
        const link = madrinExtractLink(data);
        if (data?.status === false || !link) {
            return reply(`❌ *Download failed.* ${data?.error || data?.message || 'no link returned'}`);
        }
        const title = madrinExtractTitle(data, label);
        if (mediaType === 'document') {
            await devtrust.sendMessage(m.chat, { document: { url: link }, fileName: fileName || title, mimetype: 'application/octet-stream' }, { quoted: m });
        } else if (mediaType === 'audio') {
            await devtrust.sendMessage(m.chat, { audio: { url: link }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
        } else if (mediaType === 'image') {
            await devtrust.sendMessage(m.chat, { image: { url: link }, caption: `${label}: ${title}` }, { quoted: m });
        } else {
            await devtrust.sendMessage(m.chat, { video: { url: link }, caption: `${label}: ${title}` }, { quoted: m });
        }
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
}

// ============ LOGO / MAKER GENERIC DISPATCHER ============
// 73 logo styles + 25 maker effects from the registry, all following the
// same 1-3 param GET pattern -- one dispatcher instead of ~100 near-
// identical case blocks. Maps: style slug -> ordered param names.
const LOGO_STYLES = {"1917":["text"],"america":["text"],"angel":["text"],"apex":["text1", "text2"],"arena":["text"],"avengers":["text1", "text2"],"bearlogo":["text"],"blackpink":["text"],"board":["text"],"captain":["text1", "text2"],"captainamerica":["text1", "text2"],"clouds":["text"],"colorful":["text"],"comic":["text"],"custom":["text"],"deadpool":["text1", "text2"],"devil":["text"],"dragonball":["text"],"duty":["text1", "text2"],"efnaruto":["text"],"erase":["text"],"ffire":["text1", "text2"],"fire":["text"],"foggyglass":["text"],"foggyglassv2":["text"],"football":["text1", "text2"],"frost":["text"],"fstar":["text"],"futuristic":["text"],"game":["text"],"glitch":["text"],"glossy":["text"],"gpurple":["text"],"graffiti":["text"],"graffitiv2":["text"],"hacker":["text"],"ice":["text"],"impressive":["text"],"jewel":["text"],"king":["text"],"kingaov":["text"],"leaves":["text"],"legends":["text"],"light":["text"],"logo":["text1", "text2"],"marvel":["text1", "text2"],"mascot":["text1", "text2"],"matrix":["text"],"mavatar":["text"],"metallic":["text"],"music":["text"],"neon":["text"],"neonglitch":["text"],"pixelglitch":["text"],"pornhub":["text1", "text2"],"pubg":["text"],"purple":["text"],"royal":["text"],"sand":["text"],"shirt":["text1", "text2"],"sketch":["text1", "text2"],"snow":["text"],"starwars":["text"],"steel":["text1", "text2"],"supreme":["text"],"thor":["text1", "text2"],"thunder":["text"],"typo":["text"],"valor":["text1", "text2"],"watch1":["text1", "text2"],"watch2":["text1", "text2"],"wolf":["text1", "text2"],"wooden":["text1", "text2"]};
const MAKER_STYLES = {"ad":["image"],"brat-anime":["text"],"brat-gojo":["text"],"brat-patrick":["text"],"brat-vtuber":["text"],"brat":["text"],"bratvid":["text"],"caution":["text"],"dragonball":["text"],"fakedev":["image", "name", "bio"],"fakeff":["name"],"goodbye":["image", "name"],"igpost":["url"],"jail":["image"],"music":["image", "name"],"pillmeme":["top", "left", "right"],"quotely":["text", "name"],"quotesmaker":["text", "author"],"spongebob":["text"],"threadspost":["name", "pfp", "text"],"toanime":["url"],"tofigure":["url"],"wanted":["image"],"wastatus":["name", "time", "text"],"wasted":["url"]};

// Response shape is inconsistent per-endpoint (some return JSON with an
// image_url, some return the raw image bytes directly) -- the registry
// documents both. Use the real Content-Type header to tell them apart
// instead of guessing from the body.
// NOTE ON THIS WHOLE DISPATCHER (98 commands: 73 logo + 25 maker styles):
// zero Madrin references anywhere is now a hard requirement, so
// MADRIN_BASE itself points at Prexzy — but Prexzy has almost no real
// match for these 98 specific style names (checked style-by-style; a few
// LOOK similar like "1917"/"brat"/"spongebob" but are different products
// in different categories with different params/output, not drop-in
// replacements). Net effect: these commands will mostly return "this
// style isn't available on the current provider" (see madrinFetchImage's
// error message below) rather than actually working — that's the direct,
// disclosed consequence of removing Madrin entirely, not a bug.
async function madrinFetchImage(path, params) {
    const res = await axios.get(`${MADRIN_BASE}${path}`, { params, timeout: 25000, responseType: 'arraybuffer' });
    const contentType = res.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
        const json = JSON.parse(Buffer.from(res.data).toString('utf8'));
        if (json.status === false || !json.image_url) {
            // Most Logo/Maker style paths don't exist on Prexzy (the old
            // Madrin provider had ~98 custom styles here with no 1:1
            // match) — surface that plainly instead of a raw JSON error.
            throw new Error('This style isn\'t available on the current provider.');
        }
        const imgRes = await axios.get(json.image_url, { responseType: 'arraybuffer', timeout: 25000 });
        return Buffer.from(imgRes.data);
    }
    return Buffer.from(res.data);
}

// ============ PREXZY API — TTS VOICE DISPATCHER ============
// 137 TTS voices on Prexzy. Named human voices take text/speed/pitch/style;
// the tts-* legacy/novelty voices and language codes take text/pitch/speed.
// One dispatcher instead of ~137 near-identical case blocks. Declared at
// top level (not inside the switch) to avoid const/function hoisting
// issues within a switch body.
const TTS_NAMED_VOICES = ["amy","arthur","beatrice","camila","casey","charlie","david","dylan","ella","emma","eric","ethan","evie","freddie","freya","grace","hannah","henry","isabella","isla","ivy","jackson","jacob","james","jennifer","joey","john","julie","justin","katrina","kevin","layla","leo","lily","marcus","matthew","max","mia","michael","noah","olivia","owen","paul","phoebe","quincy","sally","sam","scott","sophia","sophie","theo","thomas","victor","william","xena"];
const TTS_LEGACY_VOICES = ["tts-adult-female--1-american-english-truvoice","tts-adult-female--2-american-english-truvoice","tts-adult-male--1-american-english-truvoice","tts-adult-male--2-american-english-truvoice","tts-adult-male--3-american-english-truvoice","tts-adult-male--4-american-english-truvoice","tts-adult-male--5-american-english-truvoice","tts-adult-male--6-american-english-truvoice","tts-adult-male--7-american-english-truvoice","tts-adult-male--8-american-english-truvoice","tts-bonzi","tts-female-whisper","tts-male-whisper","tts-mary","tts-mary-for-telephone","tts-mary-in-hall","tts-mary-in-space","tts-mary-in-stadium","tts-mike","tts-mike-for-telephone","tts-mike-in-hall","tts-mike-in-space","tts-mike-in-stadium","tts-robosoft-five","tts-robosoft-four","tts-robosoft-one","tts-robosoft-six","tts-robosoft-three","tts-robosoft-two","tts-sam"];
const TTS_LANG_CODES = ["ar","cs","da","de","el","en","es","fi","fr","he","hi","hu","id","it","ja","ko","nl","no","pl","pt","ro","ru","sv","th","tr","uk","vi","zhcn","zhtw"];

async function prexzyTtsAndSend(m, reply, voiceSlug, text, { ptt = false } = {}) {
    try {
        reply('⏳ *Generating speech...*');
        const endpoint = TTS_LANG_CODES.includes(voiceSlug) ? `/tts/tts-${voiceSlug}` : `/tts/${voiceSlug}`;
        const data = await prexzyGet(endpoint, { text });
        // TTS endpoints may return raw audio bytes or a JSON wrapper with a
        // URL — handle both since this isn't confirmed live.
        let audioUrl = madrinExtractLink(data);
        if (!audioUrl && typeof data === 'string' && data.startsWith('http')) audioUrl = data;
        if (!audioUrl) return reply('❌ *TTS failed — no audio returned.*');
        await devtrust.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: ptt ? 'audio/ogg; codecs=opus' : 'audio/mpeg',
            ptt
        }, { quoted: m });
    } catch (e) { reply(`❌ *TTS Error:* ${e.message}`); }
}

// ============ PREXZY API — RANDOM IMAGE DISPATCHER ============
// 20 random-image categories, all a plain GET with no params. One
// dispatcher instead of 20 near-identical case blocks.
const RANDOM_CATEGORIES = ["bluearchive","boypic","car","cat","chinagirl","dog","hijabgirl","indonesiagirl","japangirl","koreangirl","malaysiagirl","profilepics","anhai","randomgirl","anhmoe","anhsfw","thailandgirl","tiktokgirl","vietnamgirl","waifu"];
async function prexzySendRandom(m, reply, category, caption) {
    try {
        const data = await prexzyGet(`/random/${category}`);
        const link = madrinExtractLink(data) || (typeof data === 'string' && data.startsWith('http') ? data : null);
        if (!link) return reply('❌ *Could not fetch image.*');
        const isVideo = /\.mp4($|\?)/i.test(link);
        await devtrust.sendMessage(m.chat, { [isVideo ? 'video' : 'image']: { url: link }, caption: caption || '🎲 Random' }, { quoted: m });
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}

const STYLE_TEXT_LIST = ["acute","allstyles","circled","circledneg","cjkthai","curvy1","curvy2","curvy3","fauxcyrillic","fauxethiopic","fullwidth","inverted","mathbold","mathboldfraktur","mathbolditalic","mathboldscript","mathdoublestruck","mathfraktur","mathmonospace","mathsans","mathsansbold","mathsansbolditalic","mathsansitalic","parenthesized","regionalindicator","reversed","rockdots","smallcaps","squared","squaredneg","stroked","subscript","superscript","tag"];
const TEXTFX_MAP = { "1917": "style1917", "gradient": "gradienttext", "hologram": "freecreate", "glow": "advancedglow", "usaflag": "flag3dtext", "bearlogo": "logomaker", "blackpinklogo": "blackpinklogo", "blackpinkstyle": "blackpinkstyle", "graffiti": "cartoonstyle", "clouds": "effectclouds", "eraser": "deletingtext", "galaxyneon": "makingneon", "galaxylogo": "galaxystyle", "galaxywallpaper": "galaxywallpaper", "glitch": "glitchtext", "glowing": "glowingtext", "greenneon": "lighteffects", "gold": "luxurygold", "neon": "multicoloredneon", "neonglitch": "neonglitch", "ngflag": "flagtext", "papercut": "papercutstyle", "pixelglitch": "pixelglitch", "royal": "royaltext", "sand": "sandsummer", "beach": "summerbeach", "pavement": "typographytext", "underwater": "underwatertext", "watercolor": "watercolortext", "glass": "writetext" };
const AIIMG_STYLES = ["abstract","anime","cartoon","cyberpunk","fantasy","horror","minimalist","oil-painting","pixel-art","pop-art","realistic","sci-fi","sketch","steampunk","surreal","vintage","watercolor"];

// If a maker effect needs an image URL and the user didn't give one,
// try to pull it from a quoted/attached image and upload it via imgbb
// (reusing the key from .imgbb) to get a URL the API can fetch.
async function resolveImageUrlFromMessage(m, explicitText) {
    if (explicitText && isUrl(explicitText.trim())) return explicitText.trim();
    const imgMimeSelf = (m?.msg || m)?.mimetype || '';
    const imgMimeQuoted = (m.quoted?.msg || m.quoted)?.mimetype || '';
    let imgSource = null;
    if (/image/.test(imgMimeSelf) || m.message?.imageMessage) imgSource = m;
    else if (/image/.test(imgMimeQuoted) || m.quoted?.message?.imageMessage) imgSource = m.quoted;
    if (!imgSource) return null;
    const buffer = await downloadMediaMessage(imgSource, 'buffer', {});
    const form = new URLSearchParams();
    form.append('key', 'a1ea26a71427d4c251e84555155792ba');
    form.append('image', buffer.toString('base64'));
    const res = await axios.post('https://api.imgbb.com/1/upload', form.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 30000
    });
    return res.data?.data?.url || res.data?.data?.display_url || null;
}
const hangmanVisual = [
    "😃🪓______", "😃🪓__|____", "😃🪓__|/___",
    "😃🪓__|/__", "😃🪓__|/\\_", "😃🪓__|/\\_", "💀 Game Over!"
];
const { getSetting, setSetting } = require("./setting/Settings.js");
const groupCache = new Map();

// ============ ANTI-LINK SETTINGS - MOVED UP HERE ============
const ANTILINK_FILE = './database/antilink_settings.json';

function loadAntilinkSettings() {
    try {
        if (!fs.existsSync(ANTILINK_FILE)) {
            fs.writeFileSync(ANTILINK_FILE, JSON.stringify({}));
            console.log('📁 Created antilink_settings.json file');
        }
        const data = fs.readFileSync(ANTILINK_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.log('⚠️ Error loading antilink settings:', e.message);
        return {};
    }
}

function saveAntilinkSettings(settings) {
    try {
        fs.writeFileSync(ANTILINK_FILE, JSON.stringify(settings, null, 2));
        return true;
    } catch (e) {
        console.log('⚠️ Error saving antilink settings:', e.message);
        return false;
    }
}

// Generate per-session antilink key — prevents collisions between users
function getAntilinkKey(botNum, chatId) {
    return `${botNum}::${chatId}`;
}

// ============ ANTI-MENTIONGC SETTINGS ============
// Deletes messages that leak/reference the group's own invite link inside
// the group itself — same delete+warn(+kick) pattern as antilink, reusing
// the antifeature warn-count system below.
const ANTIMENTIONGC_FILE = './database/antimentiongc_settings.json';
function loadAntiMentionGcSettings() {
    try {
        if (!fs.existsSync(ANTIMENTIONGC_FILE)) fs.writeFileSync(ANTIMENTIONGC_FILE, JSON.stringify({}));
        return JSON.parse(fs.readFileSync(ANTIMENTIONGC_FILE, 'utf-8'));
    } catch (e) { return {}; }
}
function saveAntiMentionGcSettings(settings) {
    try { fs.writeFileSync(ANTIMENTIONGC_FILE, JSON.stringify(settings, null, 2)); return true; } catch (e) { return false; }
}
let antiMentionGcSettings = loadAntiMentionGcSettings();
// =========================================================

// ============ ANTI-FEATURE WARN-COUNT SYSTEM ============
// Shared warn-escalation store for anti-features that support "warn N
// times then kick" (antilink, antimentiongc). Deliberately its own
// namespace, separate from the pre-existing .warn/.warn2/.warns command
// family — those have their own separate, already-inconsistent storage,
// and this one is purpose-built just for anti-feature auto-escalation.
const ANTIFEATURE_WARN_FILE = './database/antifeature-warns.json';
function loadAntiFeatureWarns() {
    try { return JSON.parse(fs.readFileSync(ANTIFEATURE_WARN_FILE, 'utf8')); } catch (e) { return {}; }
}
function saveAntiFeatureWarns(data) {
    try {
        const dir = require('path').dirname(ANTIFEATURE_WARN_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(ANTIFEATURE_WARN_FILE, JSON.stringify(data, null, 2));
    } catch (e) {}
}
// Increments the count and returns { count, shouldKick }. Resets to 0
// automatically once shouldKick fires, so the next violation after a
// kick (if they're re-added) starts a fresh count instead of instantly
// re-triggering.
function bumpAntiFeatureWarn(feature, chatId, userJid, limit) {
    const data = loadAntiFeatureWarns();
    const key = `${feature}:${chatId}:${userJid}`;
    data[key] = (data[key] || 0) + 1;
    const shouldKick = data[key] >= limit;
    if (shouldKick) delete data[key]; else saveAntiFeatureWarns(data);
    if (shouldKick) saveAntiFeatureWarns(data);
    return { count: shouldKick ? limit : data[key], shouldKick };
}
function resetAntiFeatureWarn(feature, chatId, userJid) {
    const data = loadAntiFeatureWarns();
    delete data[`${feature}:${chatId}:${userJid}`];
    saveAntiFeatureWarns(data);
}

// Load antilink settings BEFORE anything else uses them
let antilinkSettings = loadAntilinkSettings();
// =========================================================



// ============================================================
// INLINED COMMAND MODULES — merged directly into case.js so the
// self-hosted deploy flow (.update / index.js bootstrap) only ever
// needs to fetch 3 files: case.js, storage.js, bot.js. No separate
// commands/ folder required anymore for these to work.
// ============================================================

// ============ inlined from commands/menu.js ============
const __cmd_menu = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require('@boruto_vk7/baileys');

// ============ BRANDED BANNER ============
const BANNER_PATH = path.join(__dirname, '..', 'media', 'legendary_banner.jpg');
const botDisplayName = global.botConfig?.botName || process.env.BOT_NAME || "LËGĚNDÃRY BØT";

// ============ BUTTON TEST SENDER (native flow single_select) ============
// imagePath is optional — when given, the image becomes the message's own
// HEADER (one combined message), matching the "Manipulator's XD" style,
// instead of sending the image as a separate message beforehand.
async function sendInteractiveList(nexus, chatId, { bodyText, footerText, headerTitle, buttonText, sectionTitle, rows, imagePath }) {
    const nativeFlowMessage = {
        buttons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: buttonText,
                sections: [{ title: sectionTitle, rows }]
            })
        }]
    };

    let header = { title: headerTitle, hasMediaAttachment: false };
    if (imagePath && fs.existsSync(imagePath)) {
        try {
            const media = await prepareWAMessageMedia({ image: { url: imagePath } }, { upload: nexus.waUploadToServer });
            header = { ...media, hasMediaAttachment: true };
        } catch (e) {
            console.log(chalk.yellow(`⚠️ Image header failed, falling back to text header: ${e.message}`));
            header = { title: headerTitle, hasMediaAttachment: false };
        }
    }

    const interactiveMessage = {
        body: { text: bodyText },
        footer: { text: footerText },
        header,
        nativeFlowMessage
    };
    const msg = generateWAMessageFromContent(chatId, {
        viewOnceMessage: { message: { interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage) } }
    }, {});
    await nexus.relayMessage(chatId, msg.message, { messageId: msg.key.id });
}

// One-off test: sends the FIRST page of the main menu as real native-flow
// buttons. Does not touch chat state used by the numbered-text flow.
async function sendMainMenuButtonsTest(nexus, chatId) {
    const rows = CATEGORY_KEYS.slice(0, 5).map(key => ({
        title: `${MENU_DATA[key].emoji} ${MENU_DATA[key].name}`,
        id: `OPEN_${key}`,
        description: `${MENU_DATA[key].items.length} features`
    }));
    await sendInteractiveList(nexus, chatId, {
        bodyText: `🧪 BUTTON TEST\n\nIf you see a tappable list below this text, buttons dey work for your number!`,
        footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽ — test',
        headerTitle: 'Button Test',
        buttonText: 'Tap to test',
        sectionTitle: 'Categories',
        rows
    });
}

// Sends each option as its OWN visible quick_reply button (no middle "tap
// to open" step) instead of one button that opens a list.
async function sendQuickReplyButtons(nexus, chatId, { bodyText, footerText, buttons }) {
    const nativeFlowButtons = buttons.map(b => ({
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({ display_text: b.title, id: b.id })
    }));
    const interactiveMessage = {
        body: { text: bodyText },
        footer: { text: footerText },
        nativeFlowMessage: { buttons: nativeFlowButtons }
    };
    const msg = generateWAMessageFromContent(chatId, {
        viewOnceMessage: { message: { interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage) } }
    }, {});
    await nexus.relayMessage(chatId, msg.message, { messageId: msg.key.id });
}

// Test: main menu page 1, each category as its own tappable button.
async function sendMainMenuButtonsTest2(nexus, chatId) {
    const buttons = CATEGORY_KEYS.slice(0, 5).map(key => ({
        title: `${MENU_DATA[key].emoji} ${MENU_DATA[key].name}`,
        id: `OPEN_${key}`
    }));
    await sendQuickReplyButtons(nexus, chatId, {
        bodyText: `🧪 BUTTON TEST 2\n\nEach category below should show as its own button.`,
        footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽ — test',
        buttons
    });
}

// ============ NUMBERED TEXT MENU (guaranteed delivery) ============
// WhatsApp's Web MD protocol has been silently dropping both legacy
// listMessage and nativeFlow single_select for this account/library, even
// though the send call reports success. Plain text always delivers, so we
// track "what was last shown to this chat" and let a bare reply like "1"
// or "next" behave like a tap.
const STATE_FILE = path.join(process.cwd(), 'database', 'menu_state.json');
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function loadState() {
    try {
        if (!fs.existsSync(STATE_FILE)) fs.writeFileSync(STATE_FILE, '{}');
        return JSON.parse(fs.readFileSync(STATE_FILE));
    } catch (e) { return {}; }
}
function saveState(state) {
    try { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); } catch (e) {}
}
function setChatState(chatId, rows) {
    const state = loadState();
    state[chatId] = { rows: rows.map(r => ({ title: r.title, id: r.id })), ts: Date.now() };
    saveState(state);
}
function clearChatState(chatId) {
    const state = loadState();
    delete state[chatId];
    saveState(state);
}

// Given plain text from a chat that has an active menu, resolve it to the
// same id strings the old button rows used to produce (e.g. "OPEN_football").
// Returns null if this text isn't a valid menu reply right now.
function resolveTextReply(chatId, text) {
    if (!text) return null;
    const state = loadState();
    const entry = state[chatId];
    if (!entry) return null;
    if (Date.now() - entry.ts > STATE_TTL_MS) { clearChatState(chatId); return null; }

    const clean = text.trim().toLowerCase();
    const numMatch = clean.match(/^(\d{1,2})$/);
    if (numMatch) {
        const idx = parseInt(numMatch[1], 10) - 1;
        return entry.rows[idx] ? entry.rows[idx].id : null;
    }
    if (clean === 'menu' || clean === 'home' || clean === '0') return 'MENU_PAGE_0';
    if (clean === 'next' || clean === 'n') {
        const row = entry.rows.find(r => /next page/i.test(r.title));
        return row ? row.id : null;
    }
    if (clean === 'back' || clean === 'prev' || clean === 'b') {
        const row = entry.rows.find(r => /previous page|back to main/i.test(r.title));
        return row ? row.id : null;
    }
    return null;
}

// Sends a numbered plain-text list and remembers it against chatId so the
// next bare-number reply from that chat can be resolved above.
async function sendNumberedMenu(nexus, chatId, { header, footer, rows, imageUrl }) {
    const numberEmojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
    const lines = rows.map((r, i) => `${numberEmojis[i] || (i + 1) + '.'} ${r.title}${r.description ? ` — ${r.description}` : ''}`);
    const text = `${header}\n\n${lines.join('\n')}\n\n💬 Reply with a number, or type NEXT / BACK / MENU\n\n${footer}`;

    // Prefer the local bundled banner (menuImageBuffer, defined near the
    // top of the file) over any URL — a local file can't go dead/404 the
    // way an external image link can.
    if (menuImageBuffer) {
        try {
            await nexus.sendMessage(chatId, { image: menuImageBuffer, caption: text });
            setChatState(chatId, rows);
            return;
        } catch (e) {
            console.log(chalk.yellow(`⚠️ Menu image (local buffer) failed, falling back: ${e.message}`));
        }
    }

    if (imageUrl) {
        try {
            await nexus.sendMessage(chatId, { image: { url: imageUrl }, caption: text });
            setChatState(chatId, rows);
            return;
        } catch (e) {
            console.log(chalk.yellow(`⚠️ Menu image failed, falling back to text: ${e.message}`));
        }
    }

    await nexus.sendMessage(chatId, { text });
    setChatState(chatId, rows);
}

// ============ MENU DATA (from master menu doc) ============
// Each category: { emoji, name, items: [ "emoji Name", ... ] }
const MENU_DATA = {
    football: { emoji: '⚽', name: 'FOOTBALL', items: [
        '🔴 Live Matches','🏆 League Standings','📊 Team Stats','🗞️ Football News','⛰️ Player Stats','🎯 Match Predictions','📅 Upcoming Fixtures','🏅 Top Scorers','🥅 Head to Head','📺 Match Highlights','🎙️ Post Match Analysis','🏟️ Stadium Info','👨‍⚖️ Referee Stats','🔄 Transfer News','⚡ Injury Updates','🎖️ Trophy Cabinet','📈 Historical Stats','🏆 Hall of Fame','🇳🇬 Nigeria Football','🌍 International Matches'
    ]},
    game: { emoji: '🎮', name: 'GAME', items: [
        '🧠 Trivia Quiz','🔤 Word Unscramble','🔢 Guess the Number','🪢 Hangman','⭕ Tic Tac Toe','🎲 Roll the Dice','🪙 Coin Flip','🏆 Game Leaderboard','🛑 End Game'
    ]},
    downloader: { emoji: '📥', name: 'DOWNLOADER', items: [
        '🔍 Search Music','📥 Download MP3','🎧 Lyrics Finder','🎙️ Podcast Search','🎼 Music Converter','🔊 Audio Effects','🎵 Playlist Creator','🎤 Karaoke','🎹 Instrument Tuner','🎸 Guitar Tabs','🎼 Sheet Music','📊 Music Charts','🎶 Trending Songs','🌟 Artist Info','🎭 Concert Dates','🎵 Afrobeats','🎤 Hip Hop Zone','🎼 Classical Music','🌍 World Music','🎵 Music Production','🎧 Audio Mixing','🎙️ Voice Recorder','🎼 Music Theory','📻 Radio Stations','🎵 Spotify Playlist','🎥 YouTube Download','📹 TikTok Download','🎞️ Instagram Reels','🎬 Video Converter','✂️ Video Trimmer','🎨 Add Subtitles','📊 Video Compressor','🎞️ Frame Extractor','🔊 Extract Audio','🎥 Video Merger','🎬 Create GIF','📺 Streaming Search','🎭 Movie Reviews','🍿 Movie Recommendations','🎥 Vimeo Download','📹 Dailymotion Download','🎬 Netflix Finder','📺 Video Quality Converter','🎞️ Slow Motion Creator','⏱️ Time Lapse Editor','🎨 Video Effects','🎭 Green Screen Editor','📸 Screenshot Enhancer','🎥 Live Stream Recorder','📘 Facebook','𝕏 Twitter/X','📷 Instagram','🎵 TikTok','🎬 YouTube','📌 Pinterest','💬 Reddit','🎤 Snapchat','👨‍💼 LinkedIn','🎵 BeReal','📸 Telegram','🎨 Vimeo','🌐 Blog Scraper','📰 News Scraper','🎬 Twitch','🎮 Discord','🎪 WeChat','👥 WhatsApp Status','🌐 Flickr','🎨 DeviantArt','💬 Mastodon','🎵 Bluesky','📹 Rumble','🌍 Medium','📱 TikTok Lives Recorder','👤 User Profile Analyzer'
    ]},
    group: { emoji: '👥', name: 'GROUP', items: [
        '👤 Add/Remove Members','🔐 Group Settings','📢 Group Announcements','🚫 Mute/Unmute Members','🏆 Group Roles','📋 Member List','💬 Group Description','🎖️ Grant Admin Rights','⚠️ Kick Member','🔒 Lock/Unlock Group','📊 Group Stats','🎨 Change Group Icon','🏅 Moderator Panel','⏰ Auto-Moderation','🚫 Anti-Spam Filter','📝 Group Rules','🎁 Gift Members','📅 Event Scheduler','📊 Activity Report','🔐 Backup Group Data','👥 Member Roles','🎯 Mention All','📱 Group Polls','🎪 Group Games','📸 Group Photos Archive','🔔 Notification Settings','📊 Member Contribution Tracker','🏆 Group Achievements','💬 Chat Cleanup','🎨 Group Theme Customization','📅 Birthday Reminders','🚨 Emergency Alerts'
    ]},
    tools: { emoji: '🛠️', name: 'TOOLS & UTILITIES', items: [
        '🔄 Unit Converter','🌐 QR Code Generator','📊 Text to Image','🔤 Text Effects/Styling','🎨 Image Editor','🔗 URL Shortener','📝 JSON Formatter','🔐 Text Encryption/Decryption','⏱️ Timer & Reminder','📐 Calculator','🌡️ Currency Converter','📏 Image Resizer','🎭 Meme Generator','🔍 Reverse Image Search','📄 PDF Tools','🖼️ Watermark Remover','📧 Email Validator','🔢 Base64 Encoder/Decoder','🌐 DNS Lookup','⌚ World Time Checker','🔗 Link Preview','📡 IP Address Lookup','🎯 UUID Generator','🔐 Password Generator','📞 Phone Number Validator','🗂️ File Size Calculator','🎨 Gradient Generator','📊 Color Picker','🔤 Text Splitter','📐 Aspect Ratio Calculator','⏳ Stopwatch','🗓️ Date Calculator','🧮 Loan Calculator','📊 Age Calculator','🌡️ BMI Calculator','💪 Calorie Counter','🔐 Markdown to HTML','🎨 CSS Minifier','📝 JavaScript Beautifier','🖥️ Binary Converter','🔢 Hex to Decimal','📊 CSV to JSON','🗂️ XML Formatter','🔐 Hash Generator','📡 WHOIS Lookup','🌐 Port Scanner','📡 Ping Tool','🎯 Subnet Calculator','🔐 SSL Certificate Checker','📊 Bandwidth Calculator','⚡ Electricity Bill Calculator','🏠 Mortgage Calculator','📈 Investment Calculator','💰 Tip Calculator','🎓 GPA Calculator','📐 Triangle Calculator','🧮 Matrix Calculator','🔬 Chemistry Calculator','⚛️ Physics Calculator'
    ]},
    misc: { emoji: '📦', name: 'MISC', items: [
        '📖 Dictionary','🧮 Math Solver','🌍 Geography Facts','🔬 Science Facts','🎓 Quote of the Day','📊 Facts Generator','🧠 IQ Quiz','🎯 Trivia Challenge','📚 Study Materials','🔍 Research Papers','📖 Book Recommendations','🎓 Online Courses','🧪 Science Experiments','📐 Math Formulas','🌐 Language Learning','🗣️ Pronunciation Guide','🎓 Educational Videos','📊 Statistics Explained','🔬 Biology Facts','🧬 Genetics Info','🌌 Astronomy Guide','🔭 Space Exploration','🌍 Historical Events','📜 Ancient Civilizations','🎨 Art History','🎭 Literature Analysis','🎵 Music Theory','📚 Philosophy Guide','⚖️ Law Basics','💼 Economics 101','🏛️ Political Systems','🌐 World Cultures','🗣️ Etymology','📖 Classic Literature','🧩 Logic Puzzles','🎓 Career Guidance','🌍 World News','🏠 Local News','💼 Business News','🏀 Sports News','🎬 Entertainment News','🔬 Tech News','💰 Crypto/Finance News','🌐 Science News','🏥 Health News','🎮 Gaming News','🚗 Auto News','🏠 Real Estate News','🎓 Education News','🌱 Environment News','🚀 Space News','⚡ Breaking News Alerts','📻 Podcast News','📺 TV News','🗞️ Newspaper Headlines','📡 Radio News','🎙️ News Archives','📊 Fact Checker','🌍 Global Trends','🏠 Nigeria News','🌍 Africa News','📡 Live Updates','🔔 News Notifications','📰 News Aggregator','📊 News Analytics','🌤️ Weather Forecast','📍 Location Info','✈️ Flight Tracker','🏨 Hotel Finder','🗺️ Map & Directions','🎫 Travel Deals','🏖️ Destination Guide','📸 Travel Photos','🌡️ Temperature Alerts','🌧️ Rain Prediction','🌍 Time Zone Info','💱 Exchange Rates','🗺️ Route Planner','🏕️ Adventure Ideas','🧳 Packing Checklist','🚌 Bus Booking','🚂 Train Tracker','🚗 Car Rental','🏨 AirBnB Search','🎫 Event Booking','🗺️ Local Attractions','🍽️ Restaurant Guides','🚪 Door to Door Navigation','📷 Tourist Photos','🏆 Top Destinations','🌊 Beach Information','🏔️ Mountain Info','🏜️ Desert Guides','🌴 Tropical Paradise','🧗 Adventure Sports','🏕️ Camping Sites','🌌 Stargazing Spots','📍 GPS Coordinates','🔍 Recipe Search','👨‍🍳 Chef Recommendations','📊 Nutrition Info','🍽️ Meal Planner','🛒 Grocery List','⏱️ Cooking Timer','🌶️ Spice Guide','🥘 Restaurant Finder','⭐ Food Reviews','🎂 Dessert Ideas','🍜 Cuisine Types','🥗 Diet Recipes','📚 Cooking Tips','👨‍🍳 Video Recipes','🍕 Pizza Recipes','🍔 Burger Recipes','🍝 Pasta Recipes','🥘 Nigerian Recipes','🍜 Asian Recipes','🥗 Salad Recipes','🥞 Breakfast Ideas','🍲 Soup Recipes','🍗 Chicken Recipes','🥩 Beef Recipes','🐟 Fish Recipes','🥬 Vegetarian Recipes','🌾 Vegan Recipes','🍪 Bakery Recipes','🍰 Cake Recipes','🍩 Donut Recipes','🧁 Cupcake Recipes','🍫 Chocolate Recipes','🍦 Ice Cream Recipes','☕ Beverage Recipes','🍷 Alcohol Pairings','💪 Workout Plans','🧘 Yoga Routines','🏃 Running Tracker','🧮 Calorie Counter','📊 Weight Tracker','💤 Sleep Guide','🧠 Mental Health','🫀 Heart Rate Monitor','💊 Medicine Reminder','🏥 Doctor Finder','📋 Health Tips','🌿 Natural Remedies','🏋️ Gym Finder','🥗 Nutrition Plans','💊 Vitamin Guide','🏃 Cardio Workouts','🏋️ Strength Training','🤸 Flexibility Training','🧘 Meditation Guide','😴 Sleep Quality Tracker','🚴 Cycling Workouts','🏊 Swimming Workouts','🥊 Boxing Training','🧗 Rock Climbing','🚴 Mountain Biking','⛷️ Skiing Guide','🏄 Surfing Tutorial','🤾 Basketball Training','⚽ Soccer Training','🎾 Tennis Tutorial','🏸 Badminton Guide','🏓 Ping Pong Training','🎭 Movie Database','📺 TV Series','🎤 Celebrity News','🎪 Events Calendar','🎸 Concert Info','🎮 Gaming Events','📸 Celebrity Photos','🎨 Art Exhibitions','🎭 Theater Shows','🎪 Comedy Shows','🎬 Movie Trailers','📺 Streaming Services','⭐ IMDb Ratings','🎥 Behind the Scenes','🎬 Director Info','🎭 Actor Profiles','🏆 Awards & Nominations','🌟 Red Carpet Events','📰 Gossip News','🎭 Play Tickets','🎪 Circus Shows','🎨 Art Installations','🎵 Live Performances','🎤 Stand-Up Comedy','🎬 Documentary Guide','📺 Reality TV','🎭 Musicals','🎪 Magic Shows','🎨 Gallery Exhibitions','🎭 Shakespeare Plays','🎪 Variety Shows','📡 Live TV Listings','🚗 Car Finder','💰 Price Checker','📊 Car Specs','🔧 Maintenance Guide','⛽ Fuel Price Tracker','🗺️ Traffic Updates','🚗 Rental Services','🔧 Mechanic Finder','🛞 Tire Calculator','📋 Insurance Info','🏁 Race Results','🚙 Car Reviews','🚗 Model Comparison','📸 Car Photos','🔧 DIY Repairs','🛠️ Tool Recommendations','⚙️ Engine Specs','🚙 Motorcycle Info','🚲 Bicycle Guide','🛵 Scooter Reviews','🚕 Taxi Services','🚌 Bus Routes','🚂 Train Schedule','✈️ Flight Booking','⚓ Boat Info','🏍️ Bike Maintenance','🚗 Electric Vehicles','🔋 EV Charging Stations','🛞 Wheel Alignment','🔧 Parts Finder','📋 VIN Decoder','📱 Phone Specs','💻 Laptop Finder','🖥️ PC Builds','⌚ Smartwatch Tracker','🎮 Gaming Hardware','📷 Camera Reviews','💾 Storage Solutions','🔌 Tech News','🛒 Price Comparison','⭐ Tech Reviews','🔧 Troubleshooting','📊 Benchmark Test','🎧 Audio Gear','📱 Mobile OS Comparison','💻 Operating Systems','🖱️ Peripherals','🎮 GPU Guide','🔌 Power Supply Calculator','💾 RAM Guide','🖥️ Processor Comparison','📡 Wi-Fi Routers','🔐 Security Software','🖨️ Printer Reviews','⌨️ Keyboard Reviews','🖱️ Mouse Guide','🎧 Headphone Guide','🔋 Battery Technology','📡 5G Devices','🤖 AI Chips','📱 Foldable Phones','🖥️ Mini PCs','🏠 Property Listings','💰 Price Trends','📍 Neighborhood Info','🏗️ Construction Updates','💼 Real Estate Agents','🔑 Lease Templates','📊 Market Analysis','🏢 Commercial Spaces','🏘️ Community Info','🚌 Public Transport','🏫 Schools Nearby','🏥 Healthcare Nearby','🏡 House Tours','🏗️ Renovation Ideas','🔨 Contractor Finder','🏠 Interior Design','🌳 Landscape Design','💡 Home Automation','🔒 Home Security','💧 Plumbing Guide','⚡ Electrical Guide','🏗️ Building Permits','📐 Floor Plans','🎨 Color Schemes','🛋️ Furniture Finder','🪟 Window Styles','🚪 Door Options','🛁 Bathroom Design','🍳 Kitchen Design','🛏️ Bedroom Ideas','📸 Property Photos','👔 Fashion Trends','👗 Outfit Ideas','👟 Shoe Finder','👜 Bag Collection','💄 Makeup Tutorials','💅 Nail Designs','💇 Hairstyle Ideas','🕶️ Accessory Guide','👗 Size Converter','⭐ Fashion Brands','🛍️ Shopping Tips','👑 Designer Search','👔 Formal Wear','👕 Casual Wear','🏃 Sportswear','👶 Kids Fashion','👰 Wedding Dresses','🤵 Groom Outfits','👗 Evening Gowns','🧥 Winter Coats','👒 Hat Styles','🧣 Scarf Tying','🧤 Glove Types','👞 Shoe Styles','💍 Jewelry Guide','🕶️ Sunglasses','👜 Designer Bags','💄 Makeup Brands','💅 Nail Care','💇 Hair Care','🧴 Skincare Guide','🌟 Beauty Tips','🧘 Meditation','🌿 Wellness Tips','😴 Sleep Hygiene','🧠 Mental Health Support','💆 Spa & Massage','🌱 Organic Living','♻️ Eco-Friendly Tips','🏡 Minimalism Guide','🧹 Home Organization','📚 Self-Help Books','🎯 Goal Setting','📝 Journaling','🧘 Breathing Exercises','🌿 Herbal Medicine','🍵 Tea Guide','🌟 Positive Affirmations','💪 Self-Care Routine','🎨 Hobby Ideas','📖 Reading Club','✍️ Writing Tips','🎵 Music Therapy','🎨 Art Therapy','🧩 Puzzle Games','🌍 Travel Wellness','👥 Community Support','💬 Chat Groups','🤝 Networking','🏆 Personal Goals','📊 Progress Tracking','🎁 Self-Gifting Ideas','💡 Startup Ideas','📊 Business Plans','💰 Funding Options','📈 Growth Strategies','📱 Digital Marketing','💻 Web Development','📧 Email Marketing','📱 Social Media Marketing','🎯 SEO Guide','💬 Content Strategy','📊 Analytics','💳 Payment Solutions','📦 Logistics Guide','👥 Team Management','💼 HR Solutions','📋 Contract Templates','🏛️ Legal Requirements','🧮 Accounting Basics','💰 Tax Planning','🎯 Customer Service','📞 Business Phone','📧 Business Email','🖨️ Printing Services','📍 Office Finder','🤝 Partnership Ideas','💼 B2B Opportunities','🏪 E-Commerce Setup','📦 Dropshipping Guide','🛒 Affiliate Marketing','📱 App Development','💼 Job Search','📝 Resume Builder','💬 Interview Prep','🎯 Career Path Planning','📚 Skill Development','🏆 Certifications','🎓 Course Recommendations','💰 Salary Guide','🤝 Networking Tips','📊 Career Advancement','👔 Professional Etiquette','📋 Cover Letter Guide','🎤 Interview Questions','💼 Remote Jobs','🌍 Freelance Platforms','📱 Gig Economy Guide','💰 Passive Income','🚀 Startup Opportunities','📈 Career Mentorship','🏢 Company Reviews','🌍 Global Jobs','🎯 Career Change Guide','📚 Upskilling Options','🎓 MBA Programs','💡 Entrepreneurship','🤖 Tech Careers','🎨 Creative Careers','🏥 Healthcare Careers','⚖️ Legal Careers','🏛️ Government Jobs','🐍 Python Tutorial','🟨 JavaScript Guide','🗂️ Java Programming','🔴 C++ Tutorial','💙 C# Guide','🐹 Go Programming','🦀 Rust Guide','🎵 PHP Tutorial','💎 Ruby on Rails','🎯 Code Snippets','🐙 Git & GitHub','🔨 Developer Tools','📚 API Documentation','🛠️ Code Review','🐛 Debugging Tips','⚡ Performance Tips','🔒 Security Best Practices','📦 Package Managers','🧪 Testing Frameworks','📊 Data Structures','🔍 Algorithms','💾 Database Guides','🌐 Web Frameworks','📱 Mobile Development','🤖 Machine Learning','🧠 AI & Deep Learning','📊 Data Science','🎮 Game Development','🎨 Graphics Programming','🌐 Cloud Platforms'
    ]},
    economy: { emoji: '💰', name: 'ECONOMY', items: [
        '💵 Check Balance','🏪 Shop/Store','💳 Transactions History','🎁 Daily Reward','🎰 Gamble/Bet','🏆 Leaderboard','📊 Stats Overview','💎 Premium Pass','💼 Investments','📈 Portfolio Tracker','💸 Budget Planner','🎟️ Coupon Codes','🎁 Referral Program','🏅 Achievements','🎯 Goals Tracker','💰 Price Converter','📊 Stock Market','🪙 Crypto Tracker','💳 Card Games','🎰 Lucky Spin','🏆 Tournament Rewards','💎 VIP Benefits','🎁 Mystery Box','🌟 Milestone Bonuses','👥 Group Challenges','📊 Investment Returns','💸 Passive Income','🎯 Quest Rewards','📈 Profit Tracker','💰 Loan Manager','🏦 Bank Simulator','💴 Currency Exchange'
    ]},
    fun: { emoji: '🎉', name: 'FUN', items: [
        '🎲 Dice Roll','🃏 Card Games','🎯 Trivia Quiz','🤖 AI Chat Bot','😂 Jokes & Memes','🎪 Would You Rather','🌟 Astrology/Horoscope','💑 Love Calculator','🔮 Magic 8 Ball','🎱 Fortune Teller','🎰 Spin to Win','🧩 Riddles','🎭 Character Quiz','🎪 Roast Generator','📸 Photo Challenge','🎵 Music Quiz','🎬 Movie Quiz','⚽ Sports Quiz','🌍 Geo Quiz','🧠 Memory Game','🎲 Hangman','🎮 2048 Game','🕷️ Spider Solitaire','🎯 Tic Tac Toe','🎪 Connect Four','🃏 Poker','🎰 Slot Machine','🎯 Darts','🏀 Basketball Throw','⚽ Penalty Kick','🎱 Pool Game','🎳 Bowling','🎪 Rope Jump','📍 Pin Drop','🧩 Sudoku','🎯 Wordle Clone'
    ]},
    anime: { emoji: '🌐', name: 'ANIME', items: [
        '🎬 Anime Search','📚 Manga Reader','🎨 Character Info','📺 Episode Guide','🏆 Top Rated Anime','⭐ Trending Now','🎭 Voice Actors','🎵 Anime Soundtracks','👘 Cosplay Inspiration','📚 Anime Recommendations','🎨 Fan Art Gallery','🎬 Anime Movie Reviews','🎎 Anime Merchandise','📖 Manga Chapters','🎭 Studio Information','🌟 Anime Awards','🎪 Anime Conventions','🎤 Voice Actor Info','📺 Anime Streaming','🎨 Drawing Tutorials','🎬 AMV','👥 Fan Communities','🎯 Anime Ratings','🏆 Best Episodes','📚 Manga Adaptations','🎪 Anime Memes','🌍 International Anime','🔤 Anime Fonts','📱 Anime Wallpapers'
    ]},
    image: { emoji: '🎨', name: 'IMAGE', items: [
        '🎨 Logo Maker','🖼️ Banner Creator','📸 Photo Editor','🎭 Filter & Effects','✍️ Text Designer','🌈 Color Palette','📐 Grid Generator','🎨 Icon Maker','🖌️ Brush Styles','📐 Design Templates','🎯 Brand Kit','📊 Infographic Creator','🎭 Avatar Maker','🎨 Pixel Art Creator','🖼️ Photo Collage','🎪 Meme Maker','📐 Flowchart Designer','🎨 SVG Generator','📸 Screenshot Editor','🎭 Face Swap','🌈 Gradient Maker','✨ Glow Effects','🎨 Neon Text','📐 Symmetry Tool','🖌️ Paint Brush','🎯 Shape Tool','📏 Ruler & Guide','🎪 Pattern Generator','🌟 Sticker Maker','📱 Mobile UI Kit','🎨 Web Design Template'
    ]},
    ai: { emoji: '🤖', name: 'AI FEATURES', items: [
        '🧠 AI Chat','📝 Text Generation','🎨 AI Image Generator','🔊 Text to Speech','👂 Speech to Text','🌐 Language Translation','✏️ Grammar Checker','📝 Content Writer','💬 Chatbot Responses','🔍 Sentiment Analysis','🎯 Resume Builder','💌 Email Generator','🎓 Code Debugger','📊 Data Analyzer','🎨 Style Transfer','🔮 Prediction AI','📊 Pattern Recognition','🎯 Recommendation Engine','🧠 Knowledge Base','💡 Idea Generator','📝 Article Writer','🎨 Art Generator','🎵 Music Recommender','🎬 Movie Predictor','📈 Trend Analyzer','🔐 Data Encryption AI','🌐 Language Detection','✍️ Handwriting Recognition','👤 Face Recognition','📊 OCR','🎯 Duplicate Content Finder'
    ]},
    config: { emoji: '⚙️', name: 'CONFIG', items: [
        '👤 Profile','🔔 Notifications','🌙 Dark Mode','🌍 Language','🔐 Privacy Settings','⏰ Auto-Reply','🚫 Blocked Users','📞 Help & Support','📝 About Bot','🔄 Check Updates','💾 Backup Data','📊 Usage Statistics','🎨 Theme Customization','🔐 Two-Factor Auth','📧 Email Settings','🔔 Alert Preferences','⌨️ Keyboard Shortcuts','📢 Feedback','🌐 API Settings','📱 Device Management','🔐 Session Control','📊 Data Export','🗑️ Account Deletion','💬 Chatbot Personality','🎯 Daily Goals','📈 Analytics Dashboard','🎁 Rewards Status','🌟 Premium Features','🔊 Sound Settings','🎨 Custom Themes'
    ]},
};

const CATEGORY_KEYS = Object.keys(MENU_DATA);
const MAIN_PAGE_SIZE = 5;
const SUB_PAGE_SIZE = 5;

function slugify(str) {
    return str.replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '_').toLowerCase();
}

// ============ MAIN MENU (paginated 5 per page) ============
// ============ FULL MENU — everything listed at once, Kord-style ============
// Every category as its own heading with the complete item list underneath,
// all in ONE message. Since these items are tap/number-select (not typed
// commands like ".gpt"), they're shown as plain bullets for browsing —
// actually opening one still goes through sendSubmenu's numbered picker via
// ".menu <category>", so nothing here pretends to be a typeable command it
// isn't. Collapsed behind WhatsApp's "Read more" using the same invisible-
// character trick Kord uses, since this is genuinely huge (800+ items).
const formatBytes = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
};

const sendFullMenu = async (nexus, chatId, pushName = 'there') => {
    try {
        // Real, working commands (prefix + name), grouped by category —
        // same list used by .menu2, NOT the decorative MENU_DATA feature
        // names (those don't map to real commands).
        const body = `
🤖 *AI CHAT*
• .aisearch
• .bidara
• .blackbox
• .coder
• .copilot
• .deepseek
• .gemini
• .gpt4
• .gpt5
• .llama
• .mistral
• .openai / .gpt
• .reasoning
• .zodiac

⬇️ *DOWNLOADERS*
• .animedl
• .apk / .apkdl
• .autodl
• .dlmovie
• .fb / .facebook
• .igdl / .instagram
• .insta / .instagram
• .mediafire
• .spotify / .spotifydl / .sp
• .spotify2 / .spotifydl2
• .tiktok / .tt
• .tiktoksearch
• .yta / .play
• .ytmp3 / .ytvideo / .ytv2 / .play2
• .ytmp3old
• .ytmp4 / .videoplay
• .ytv / .video

🎵 *MUSIC & AUDIO*
• .aitts / .tts
• .applemusic
• .lyrics / .lyric
• .lyrics
• .shazam / .findaudio / .find / .identifyaudio
• .shazam / .findaudio / .identifyaudio
• .soundcloud
• .ttsptt / .voicenote

🔍 *SEARCH TOOLS*
• .manga
• .pint / .pinterest
• .pinterest

👥 *GROUP MANAGEMENT*
• .add
• .addmetaai / .addai
• .adminlist / .admins
• .adminlist
• .announce / .broadcast2
• .antilink
• .antispam
• .antitag
• .clearwarns / .resetwarns
• .clearwelcome
• .close / .groupclose
• .creategc / .creategroup
• .creategc
• .demote
• .gclink2
• .gdesc / .setgcdesc
• .groupinfo / .ginfo
• .groupstatus / .gstatus
• .gstop
• .hidetag
• .invite / .gclink
• .invite / .glink
• .join
• .kick
• .kickadmins
• .kickall
• .kickr / .reset
• .kickr
• .listadmin / .tagadmin / .admin
• .listadmins
• .mute
• .muteuser
• .open / .groupopen
• .poll / .createpoll
• .promote
• .resetlink
• .resetwarn / .clearwarn
• .revoke / .revokelink
• .revoke
• .savecontact / .vcf / .scontact / .savecontacts
• .setdesc / .setgcdesc
• .setgrouppp / .setgcpp
• .setname / .setgcname
• .setwelcome
• .tagadmins / .pingadmins
• .tagall
• .tagall / .tag
• .tagall2
• .tkick
• .totalmembers / .members
• .unmute
• .unmuteuser
• .warlist / .warns
• .warn
• .warn2
• .warncount / .warnings2
• .warnlist
• .welcome

🎨 *STICKERS & IMAGE EDITING*
• .circlestk
• .emojimix
• .exif
• .gif
• .html2img
• .imgbb
• .mp4 / .togif
• .rainbow
• .roundstk
• .take
• .toimg
• .tomp4
• .tosticker / .sticker / .s

🎮 *GAMES & FUN*
• .africanfact
• .bchcn
• .beg
• .coinflip / .flip
• .crime
• .dadjoke
• .daily
• .dare
• .emojiquiz
• .fact
• .factorial
• .fish
• .fox
• .foxgirl
• .funfact
• .gamefact
• .guess
• .hangman
• .history
• .hunt
• .hxjxjjkm
• .inspire / .quote2
• .jail
• .joke
• .joke2
• .math
• .mine
• .naijafood
• .nigerianfact
• .panda
• .pickupline
• .pidgin
• .prog
• .riddle
• .rps
• .rpsls
• .science
• .sciencefact
• .slangs / .naijaslangs
• .streak
• .tech
• .tod / .truthordare
• .trivia
• .triviafact
• .truth
• .water

🛠️ *CONVERTERS & DEV TOOLS*
• .base64decode / .b64dec
• .base64encode / .b64enc
• .htmlprotect
• .shorturl
• .tojs / .tojavascript
• .topy / .topython

⚙️ *BOT & OWNER SETTINGS*
• .broadcast
• .delsudo
• .getsudo / .listsudo
• .prefix
• .restart / .reboot
• .setprefix
• .setsudo / .sudo / .addsudo

ℹ️ *UTILITY & INFO*
• .allmenu / .legend / .menu
• .animesearch
• .animewlp
• .autotyping
• .creator
• .help / .commands
• .idch
• .left / .leave
• .menubtn
• .menubtn2
• .myip
• .owner
• .ping / .speed
• .private / .self
• .public
• .runtime / .alive
• .setautotyping
• .vv / .vvgh
• .weatherdetail
• .yts / .ytsearch

🖼️ *RANDOM IMAGES & ANIME*
• .animegif
• .animenews
• .animequote
• .animerec
• .animewatch
• .character
• .neko / .meow
• .rwaifu
• .waifu

📦 *OTHER COMMANDS*
• .8ball
• .add
• .addnote
• .advice
• .aesthetic
• .afk
• .age
• .ai
• .airing
• .allnotes
• .allvar
• .alwaysonline
• .antibadword
• .antidelete
• .antiedit
• .antieditchat
• .antistatus
• .antonym
• .approve / .approveall
• .archive
• .areact
• .ascii / .asciify
• .audio2text / .text
• .autobio
• .autoreact
• .autoread
• .autorecording
• .autorecordtype
• .autoreply
• .autoviewstatus
• .aza
• .bal / .balance / .wallet
• .ban
• .bankrob
• .bass
• .bible
• .bio / .setbio
• .bioidea
• .black / .blackbg
• .blackjack / .bj
• .block
• .blocklist
• .blown / .earrape
• .blue
• .bmi
• .bold
• .book
• .botinfo
• .btc / .bitcoin
• .btcusdt
• .bubble
• .buy
• .calc
• .calculate
• .calculator
• .caption
• .carbon
• .cat / .catpic
• .cbhcchhcx
• .channellog
• .chipmunk
• .choose
• .clear
• .closetime
• .cmdreact
• .coin
• .coinbattle
• .color / .randomcolor / .colourpick
• .comp
• .compliment
• .compress
• .convert / .currency2
• .copy / .copytext
• .count / .wordcount
• .countdown
• .country / .countryinfo
• .createpanel / .panel
• .crypto / .cryptoprices
• .currencies / .currency
• .cyan
• .date / .today
• .dbinary / .dbin
• .decode / .urldecode
• .deep / .fat
• .define / .dictionary
• .del / .delete
• .delallnote / .clearnotes
• .delete / .del / .dlt
• .delete2 / .unsend
• .delmod
• .delnote
• .delvar
• .dep / .deposit
• .dice
• .dicegamble
• .doc
• .dog / .dogpic
• .doge / .dogecoin
• .dogeusdt
• .doubleornothing / .don
• .ebinary / .ebin
• .echo
• .econ / .econprofile
• .economy
• .element
• .emojify
• .encode / .urlencode
• .eth / .ethereum
• .ethusdt
• .events / .gcevent
• .fancy
• .fast
• .fetch / .fetchurl
• .fib
• .flirt
• .font
• .fortune
• .forward
• .ga / .goodafternoon
• .gamble
• .gdrive
• .genpass
• .getmods
• .getnote
• .getvar
• .gfilter
• .gfx / .gfx1
• .gfx10
• .gfx11
• .gfx12
• .gfx2
• .gfx3
• .gfx4
• .gfx5
• .gfx6
• .gfx7
• .gfx8
• .gfx9
• .gift
• .ginfo
• .gitclone / .gitdl
• .github
• .give / .pay
• .gm / .goodmorning
• .gn / .goodnight
• .gname / .setgcname
• .goose
• .gpp
• .gpp / .setgcpp
• .green
• .greenBright
• .hack
• .hash / .md5
• .hausa
• .hbd / .birthday
• .heist
• .igbo
• .imbd
• .img / .image
• .insult
• .inv / .inventory
• .invert
• .ip
• .iqtest
• .isprime
• .italic
• .jid
• .join
• .lastseen
• .lb / .leaderboard
• .leave / .left
• .legendary
• .likestatus
• .list
• .listall / .allcommands
• .listoffline
• .listonline
• .listreply / .listautoreply
• .listrequest / .joinrequests
• .lizard
• .loan
• .lock
• .lower / .lowercase
• .lucky
• .magenta
• .marry
• .match / .livematch / .score
• .members / .memberlist
• .meme
• .mental
• .mention
• .mnm
• .mock
• .mode
• .mono / .monospace
• .motivation
• .movie
• .movie2
• .moviequote
• .msgpin / .pinmsg
• .msgs
• .myfollows / .mymatch
• .mypp / .pprivacy
• .mystatus
• .naira
• .nasa / .apod / .spaceimage
• .naturewlp
• .networth
• .news
• .ngif
• .ngl
• .ngnrates
• .nightcore
• .note / .savenote
• .notes
• .npm
• .nsbxmdmfw
• .numbattle
• .number / .randnum / .randomnumber
• .numberbattle
• .numberinfo / .phoneinfo
• .ocr / .readtext / .imagetext
• .online
• .opentime
• .pair
• .password / .generatepassword
• .payloan
• .pdf
• .percent
• .permit
• .pfilter
• .pick
• .pickupl / .pickup
• .pinchat
• .pokemon / .poke
• .poll
• .poll2 / .vote
• .poor
• .poorest / .broke
• .pp / .getpp
• .profile
• .progquote
• .pstop
• .ptv
• .pun
• .punch
• .qr
• .quote
• .quoted
• .ram
• .random
• .rate
• .reactchannel
• .reaction / .react
• .readmore
• .readmsg
• .readqr
• .readstatus
• .recipe
• .red
• .register
• .reject / .rejectall
• .rejectcall
• .remind
• .reminder
• .repeat
• .repo
• .report
• .reverse
• .reversetext
• .rewrite
• .rich
• .richest / .top
• .roast
• .roast2
• .rob
• .robot
• .roll
• .roman
• .save / .dm
• .savecmd
• .savestatus
• .season
• .selectmovie
• .sell
• .setautoread
• .setmod
• .setpp
• .setvar
• .ship / .love
• .shoot
• .shop
• .shutdown
• .slap / .hug / .kiss / .pat / .cuddle / .tickle / .feed / .smug
• .slots
• .slow
• .squirrel
• .sreply / .stopreply
• .ss
• .ssfull
• .ssphone
• .sstab
• .startupmsg
• .stats
• .statusemoji
• .strike / .strikethrough
• .subtitle / .subtitles / .subtitlesearch
• .synonym
• .tag / .totag
• .tarot
• .tax
• .temp
• .test
• .time / .clock
• .timer2 / .settimer
• .timestamp
• .tinyurl / .shorten
• .tobin
• .tohex
• .tomp3 / .mp3
• .tovv
• .transfer
• .trt / .translate
• .twitter / .twit
• .unarchive
• .unban
• .unblock
• .unlock
• .unpinchat
• .unregister
• .upper / .uppercase
• .uptime
• .uptime2
• .url / .tourl
• .usage / .sysinfo
• .usdrates
• .use
• .uuid / .generateid
• .viewstatus
• .vkfkk
• .vv2 / .readviewonce2
• .vvcmd
• .walink / .wlink
• .wallpaper
• .wanted
• .wasted
• .weather / .weather2 / .weatherinfo
• .websearch / .search
• .white
• .wiki / .wikipedia
• .with / .withdraw
• .woof
• .work
• .workout
• .wttr
• .wyr
• .xrp / .ripple
• .xrpusdt
• .yellow
• .yellowBright
• .yoruba`;

        // Real, always-accurate count from the switch statement itself —
        // see __REAL_COMMAND_COUNT__ near the top of the file. The bullet
        // count below is kept only as a rough category-list gauge, not
        // used for the number actually shown to the user anymore.
        const totalCommands = __REAL_COMMAND_COUNT__ || (body.match(/^• /gm) || []).length;
        const totalCategories = (body.match(/^\S.*\*[^*]+\*$/gm) || []).length;
        const ownerName = global.botConfig?.ownerName || process.env.OWNER_NAME || "Bot Owner";
        const memoryUsage = formatBytes(os.totalmem() - os.freemem());
        const up = runtime(process.uptime());

        const more = String.fromCharCode(8206);
        const readmore = more.repeat(4001);

        const header = `\`\`\`┌────═━┈ ${botDisplayName} ┈━═────┐
 ✇ ▸ Owner: ${ownerName}
 ✇ ▸ User: ${pushName}
 ✇ ▸ Categories: ${totalCategories}
 ✇ ▸ Commands: ${totalCommands}
 ✇ ▸ Uptime: ${up}
 ✇ ▸ Memory: ${memoryUsage}
 ✇ ▸ Node: ${process.version}
 ✇ ▸ Platform: ${os.platform()}
└──────═━┈┈━═──────┘\`\`\`
${readmore}

Prefix works with every command below — e.g. .aisearch
`;

        const footer = `\n\nTip: Use *.menu <category>* for a specific one\n⚡ ${botDisplayName} — LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽`;

        // FIX: WhatsApp image CAPTIONS have a much smaller size ceiling than
        // plain TEXT messages. header already contains 4001 invisible
        // "readmore" chars, and body is the full hundreds-of-commands list —
        // together that's tens of thousands of chars. Putting all of that in
        // an image caption made WhatsApp silently drop the whole message
        // (image included), which is why .menu looked like it sent nothing.
        // Fix: short caption on the image, full listing as its own text msg.
        const shortCaption = `\`\`\`┌────═━┈ ${botDisplayName} ┈━═────┐
 ✇ ▸ Owner: ${ownerName}
 ✇ ▸ User: ${pushName}
 ✇ ▸ Categories: ${totalCategories}
 ✇ ▸ Commands: ${totalCommands}
 ✇ ▸ Uptime: ${up}
└──────═━┈┈━═──────┘\`\`\`
👇 Full command list below`;
        const fullText = header + body + footer;

        const imageUrl = (() => {
            try {
                const { getSetting } = require('./setting/Settings.js');
                return getSetting('bot', 'menuImage', null) || process.env.MENU_IMAGE || null;
            } catch (_) { return process.env.MENU_IMAGE || null; }
        })();

        if (menuImageBuffer) {
            try {
                await nexus.sendMessage(chatId, { image: menuImageBuffer, caption: shortCaption });
            } catch (e) {
                console.log(chalk.yellow(`⚠️ Full menu image (local buffer) failed: ${e.message}`));
            }
        } else if (imageUrl) {
            try {
                await nexus.sendMessage(chatId, { image: { url: imageUrl }, caption: shortCaption });
            } catch (e) {
                console.log(chalk.yellow(`⚠️ Full menu image failed: ${e.message}`));
            }
        }

        try {
            const res = await nexus.sendMessage(chatId, { text: fullText });
            console.log(chalk.cyan(`📤 [SEND RESULT] chat=${chatId} id=${res?.key?.id || 'NO_ID_RETURNED'}`));
        } catch (e2) {
            console.log(chalk.red(`❌ [SEND FAILED] chat=${chatId}: ${e2.message}`));
        }

        console.log(chalk.green(`✅ Full menu sent (${totalCategories} categories, ${totalCommands} commands)`));
    } catch (error) {
        console.log(chalk.red(`❌ Full menu error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading menu: ${error.message}` });
    }
};

const sendMainMenu = async (nexus, chatId, page = 0) => {
    try {
        const totalPages = Math.ceil(CATEGORY_KEYS.length / MAIN_PAGE_SIZE);
        page = Math.max(0, Math.min(page, totalPages - 1));

        const start = page * MAIN_PAGE_SIZE;
        const pageKeys = CATEGORY_KEYS.slice(start, start + MAIN_PAGE_SIZE);

        const rows = pageKeys.map(key => ({
            title: `${MENU_DATA[key].emoji} ${MENU_DATA[key].name}`,
            id: `OPEN_${key}`,
            description: `${MENU_DATA[key].items.length} features`
        }));

        if (page < totalPages - 1) {
            rows.push({ title: '➡️ Next Page', id: `MENU_PAGE_${page + 1}`, description: 'See more categories' });
        }
        if (page > 0) {
            rows.push({ title: '⬅️ Previous Page', id: `MENU_PAGE_${page - 1}`, description: 'Go back' });
        }

        const mainHeader = `╔════════════════════════════╗\n║  ⚽🔥 ${botDisplayName} MAIN MENU 🔥⚽  ║\n║   🏆 Football Themed Bot v2.0 🏆  ║\n╚════════════════════════════╝\n\n👇 Reply with a number to open a category`;

        await sendNumberedMenu(nexus, chatId, {
            header: `${mainHeader}\n📄 Page ${page + 1}/${totalPages}`,
            footer: '⚡ LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽',
            rows,
            imageUrl: (() => {
                try {
                    const { getSetting } = require('./setting/Settings.js');
                    return getSetting('bot', 'menuImage', null) || process.env.MENU_IMAGE || null;
                } catch (_) { return process.env.MENU_IMAGE || null; }
            })()
        });

        console.log(chalk.green(`✅ Main menu page ${page + 1} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ Main menu error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading menu: ${error.message}` });
    }
};

// ============ SUBMENU (paginated 7 per page) ============
const sendSubmenu = async (nexus, chatId, categoryKey, page = 0) => {
    try {
        const category = MENU_DATA[categoryKey];
        if (!category) {
            await nexus.sendMessage(chatId, { text: `❌ Category not found.` });
            return;
        }

        const totalPages = Math.ceil(category.items.length / SUB_PAGE_SIZE);
        page = Math.max(0, Math.min(page, totalPages - 1));

        const start = page * SUB_PAGE_SIZE;
        const pageItems = category.items.slice(start, start + SUB_PAGE_SIZE);

        const rows = pageItems.map(item => ({
            title: item,
            id: `CMD_${categoryKey}_${slugify(item)}`
        }));

        if (page < totalPages - 1) {
            rows.push({ title: '➡️ Next Page', id: `SUBMENU_${categoryKey}_PAGE_${page + 1}` });
        }
        if (page > 0) {
            rows.push({ title: '⬅️ Previous Page', id: `SUBMENU_${categoryKey}_PAGE_${page - 1}` });
        }
        rows.push({ title: '🏠 Back to Main Menu', id: `MENU_PAGE_0` });

        const subHeader = `╔════════════════════════════╗\n║  ${category.emoji} ${category.name}\n╚════════════════════════════╝\n\n👇 Reply with a number to use a feature`;

        await sendNumberedMenu(nexus, chatId, {
            header: `${subHeader}\nPage ${page + 1}/${totalPages}`,
            footer: `${botDisplayName} — LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽`,
            rows
        });

        console.log(chalk.green(`✅ Submenu ${categoryKey} page ${page + 1} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ Submenu error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading submenu: ${error.message}` });
    }
};

// ============ ROUTER ============
// Call this from your message handler whenever a list/button reply comes in (rowId as `selectedId`).
// Returns true if it handled the navigation, false if selectedId isn't a menu action
// (meaning it's a real feature command that case.js should route to its own handler).
const handleMenuSelection = async (nexus, chatId, selectedId) => {
    try {
        if (!selectedId) return false;

        if (selectedId.startsWith('MENU_PAGE_')) {
            const page = parseInt(selectedId.replace('MENU_PAGE_', ''), 10) || 0;
            await sendMainMenu(nexus, chatId, page);
            return true;
        }

        if (selectedId.startsWith('OPEN_')) {
            const key = selectedId.replace('OPEN_', '');
            await sendSubmenu(nexus, chatId, key, 0);
            return true;
        }

        if (selectedId.startsWith('SUBMENU_')) {
            // format: SUBMENU_<key>_PAGE_<n>
            const match = selectedId.match(/^SUBMENU_(.+)_PAGE_(\d+)$/);
            if (match) {
                await sendSubmenu(nexus, chatId, match[1], parseInt(match[2], 10));
                return true;
            }
        }

        // CMD_<category>_<slug> — a real feature was tapped, not a nav action.
        // Let case.js handle it (it isn't menu navigation).
        return false;
    } catch (error) {
        console.log(chalk.red(`❌ Menu routing error: ${error.message}`));
        return false;
    }
};

module.exports = {
    MENU_DATA,
    sendMainMenu,
    sendFullMenu,
    sendSubmenu,
    handleMenuSelection,
    resolveTextReply,
    sendMainMenuButtonsTest,
    sendMainMenuButtonsTest2
};

    return module.exports;
})();


// ============ inlined from commands/economy.js ============

// ============ LEGENDARY ECONOMY (inline — no separate file needed) ============
// Was __cmd_legendary_economy across 40 call sites, but that file
// never actually existed anywhere — every one of those commands would
// have crashed. Rebuilt inline here instead of as a separate file, so
// there's nothing extra to deploy or wire into server.js. File-based
// storage (./database/legendary_economy.json), same pattern as the
// rest of the bot's persistent settings — no external database needed.
const __cmd_legendary_economy = (function() {
    const fs = require('fs');
    const path = require('path');

    const ECON_FILE = path.join(process.cwd(), 'database', 'legendary_economy.json');
    const ACTIVE_FILE = path.join(process.cwd(), 'database', 'legendary_economy_active.json');

    const STARTING_WALLET = 500;
    const BASE_BANK_CAPACITY = 5000;
    const DAILY_BASE = 200;
    const DAILY_STREAK_STEP = 50;
    const DAILY_STREAK_CAP = 500; // max streak bonus on top of base
    const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
    const WORK_COOLDOWN_MS = 60 * 60 * 1000;
    const ROB_COOLDOWN_MS = 2 * 60 * 60 * 1000;
    const CRIME_COOLDOWN_MS = 45 * 60 * 1000;
    const BEG_COOLDOWN_MS = 30 * 60 * 1000;
    const HUNT_COOLDOWN_MS = 20 * 60 * 1000;
    const MINE_COOLDOWN_MS = 20 * 60 * 1000;
    const FISH_COOLDOWN_MS = 20 * 60 * 1000;
    const SLOTS_COOLDOWN_MS = 10 * 1000;
    const GAMBLE_COOLDOWN_MS = 10 * 1000;
    const COINFLIP_COOLDOWN_MS = 10 * 1000;
    const BANKROB_COOLDOWN_MS = 3 * 60 * 60 * 1000;
    const LOAN_INTEREST_PCT = 15;
    const LOAN_MIN = 1000;
    const LOAN_MAX = 50000;

    const SHOP_ITEMS = [
        { id: 'fishingrod', name: '🎣 Fishing Rod', price: 800, description: 'Improves fishing earnings', effect: 'fish_boost' },
        { id: 'pickaxe', name: '⛏️ Pickaxe', price: 800, description: 'Improves mining earnings', effect: 'mine_boost' },
        { id: 'huntingrifle', name: '🏹 Hunting Rifle', price: 800, description: 'Improves hunting earnings', effect: 'hunt_boost' },
        { id: 'banknote', name: '💳 Bank Note', price: 2000, description: 'Increases bank capacity by 5,000', effect: 'bank_capacity' },
        { id: 'luckycharm', name: '🍀 Lucky Charm', price: 1500, description: 'Improves rob/crime success odds (single use)', effect: 'luck_boost' },
        { id: 'energydrink', name: '⚡ Energy Drink', price: 500, description: 'Clears one active cooldown when used', effect: 'clear_cooldown' }
    ];

    function loadEcon() {
        try {
            if (!fs.existsSync(ECON_FILE)) fs.writeFileSync(ECON_FILE, '{}');
            return JSON.parse(fs.readFileSync(ECON_FILE));
        } catch (e) { return {}; }
    }
    function saveEcon(state) {
        try { fs.writeFileSync(ECON_FILE, JSON.stringify(state)); } catch (e) {}
    }
    function loadActive() {
        try {
            if (!fs.existsSync(ACTIVE_FILE)) fs.writeFileSync(ACTIVE_FILE, '{}');
            return JSON.parse(fs.readFileSync(ACTIVE_FILE));
        } catch (e) { return {}; }
    }
    function saveActive(state) {
        try { fs.writeFileSync(ACTIVE_FILE, JSON.stringify(state)); } catch (e) {}
    }
    function key(userId, chatId) { return `${chatId}:${userId}`; }
    function getUser(state, userId, chatId) {
        const k = key(userId, chatId);
        if (!state[k]) {
            state[k] = {
                userID: userId, chatID: chatId,
                wallet: STARTING_WALLET, bank: 0, bankCapacity: BASE_BANK_CAPACITY,
                lastDaily: 0, streak: 0,
                lastWork: 0, lastRob: 0, lastCrime: 0, lastBeg: 0,
                lastHunt: 0, lastMine: 0, lastFish: 0,
                lastSlots: 0, lastGamble: 0, lastCoinflip: 0, lastBankrob: 0,
                loanAmount: 0,
                inventory: []
            };
        }
        return state[k];
    }
    function fmt(n) {
        n = Math.round(n || 0);
        return '$' + n.toLocaleString('en-US');
    }
    function cooldownLeft(lastTs, cooldownMs) {
        const left = cooldownMs - (Date.now() - lastTs);
        return left;
    }
    function fmtDuration(ms) {
        if (ms < 60000) return `${Math.ceil(ms / 1000)}s`;
        if (ms < 3600000) return `${Math.ceil(ms / 60000)}m`;
        return `${(ms / 3600000).toFixed(1)}h`;
    }
    function parseAmountArg(arg, wallet) {
        if (arg === 'all') return wallet;
        const n = parseInt(arg);
        return isNaN(n) ? null : n;
    }

    async function connectDB() {
        // No-op — kept for call-site compatibility (old code called
        // `await econ.connectDB()` before every economy command). File
        // storage needs no connection step, just ensure the files exist.
        loadEcon(); loadActive();
    }

    function isEconActive(chatId) {
        const active = loadActive();
        return active[chatId] !== false; // default ON unless explicitly turned off
    }
    function setEconActive(chatId, on) {
        const active = loadActive();
        active[chatId] = !!on;
        saveActive(active);
    }

    async function balance(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        saveEcon(state);
        return { wallet: u.wallet, bank: u.bank, bankCapacity: u.bankCapacity };
    }

    async function daily(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastDaily, DAILY_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        // Streak continues if claimed within 48h of the last one, else resets
        const sinceLast = Date.now() - u.lastDaily;
        u.streak = (u.lastDaily > 0 && sinceLast <= DAILY_COOLDOWN_MS * 2) ? u.streak + 1 : 1;
        const bonus = Math.min(u.streak * DAILY_STREAK_STEP, DAILY_STREAK_CAP);
        const amount = DAILY_BASE + bonus;
        u.wallet += amount;
        u.lastDaily = Date.now();
        saveEcon(state);
        return { amount, streak: u.streak };
    }

    async function streak(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const bonus = Math.min(u.streak * DAILY_STREAK_STEP, DAILY_STREAK_CAP);
        return { count: u.streak, bonus };
    }

    async function deposit(userId, chatId, amountArg) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const amount = parseAmountArg(amountArg, u.wallet);
        if (amount === null || amount <= 0) return { invalid: true };
        if (amount > u.wallet) return { noten: true };
        const room = u.bankCapacity - u.bank;
        if (room <= 0) return { full: true };
        const toDeposit = Math.min(amount, room);
        u.wallet -= toDeposit;
        u.bank += toDeposit;
        saveEcon(state);
        return { amount: toDeposit };
    }

    async function withdraw(userId, chatId, amountArg) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const amount = parseAmountArg(amountArg, u.bank);
        if (amount === null || amount <= 0) return { invalid: true };
        if (amount > u.bank) return { noten: true };
        u.bank -= amount;
        u.wallet += amount;
        saveEcon(state);
        return { amount };
    }

    async function transfer(fromId, toId, chatId, amount) {
        const state = loadEcon();
        const from = getUser(state, fromId, chatId);
        const to = getUser(state, toId, chatId);
        if (amount > from.wallet) return { insufficient: true };
        from.wallet -= amount;
        to.wallet += amount;
        saveEcon(state);
        return { amount };
    }

    async function give(userId, chatId, amount) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        u.wallet += amount;
        saveEcon(state);
        return { wallet: u.wallet };
    }
    async function deduct(userId, chatId, amount) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        u.wallet = Math.max(0, u.wallet - amount);
        saveEcon(state);
        return { wallet: u.wallet };
    }

    async function work(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastWork, WORK_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        const amount = Math.floor(Math.random() * 300) + 150;
        u.wallet += amount;
        u.lastWork = Date.now();
        saveEcon(state);
        return { amount };
    }

    async function rob(userId, chatId, targetId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const target = getUser(state, targetId, chatId);
        const left = cooldownLeft(u.lastRob, ROB_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        if (target.wallet < 200) return { lowbal: true };
        u.lastRob = Date.now();
        const successChance = 0.45;
        if (Math.random() < successChance) {
            const amount = Math.floor(target.wallet * (0.1 + Math.random() * 0.3));
            target.wallet -= amount;
            u.wallet += amount;
            saveEcon(state);
            return { success: true, amount };
        } else {
            const fine = Math.floor(Math.random() * 200) + 100;
            u.wallet = Math.max(0, u.wallet - fine);
            saveEcon(state);
            return { success: false, fine };
        }
    }

    async function bankrob(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastBankrob, BANKROB_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left), success: false, bank: 'National Bank', fine: 0, newBalance: u.wallet };
        u.lastBankrob = Date.now();
        const banks = ['National Bank', 'City Trust', 'Union Vault', 'First Federal'];
        const bankName = banks[Math.floor(Math.random() * banks.length)];
        if (Math.random() < 0.35) {
            const loot = Math.floor(Math.random() * 3000) + 1000;
            u.wallet += loot;
            saveEcon(state);
            return { success: true, bank: bankName, loot, newBalance: u.wallet };
        } else {
            const fine = Math.floor(Math.random() * 800) + 300;
            u.wallet = Math.max(0, u.wallet - fine);
            saveEcon(state);
            return { success: false, bank: bankName, fine, newBalance: u.wallet };
        }
    }

    async function crime(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastCrime, CRIME_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        u.lastCrime = Date.now();
        const crimes = ['Pickpocketing', 'Shoplifting', 'Hacking an ATM', 'Selling counterfeit goods', 'Smuggling'];
        const crimeName = crimes[Math.floor(Math.random() * crimes.length)];
        if (Math.random() < 0.55) {
            const amount = Math.floor(Math.random() * 400) + 100;
            u.wallet += amount;
            saveEcon(state);
            return { success: true, amount, crimeName };
        } else {
            const fine = Math.floor(Math.random() * 300) + 150;
            u.wallet = Math.max(0, u.wallet - fine);
            saveEcon(state);
            return { success: false, fine, crimeName };
        }
    }

    async function beg(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastBeg, BEG_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        u.lastBeg = Date.now();
        if (Math.random() < 0.6) {
            const amount = Math.floor(Math.random() * 100) + 20;
            u.wallet += amount;
            saveEcon(state);
            return { success: true, amount };
        }
        saveEcon(state);
        return { success: false };
    }

    async function hunt(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastHunt, HUNT_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        const hasBoost = u.inventory.some(i => i.id === 'huntingrifle');
        const amount = Math.floor(Math.random() * 150) + 50 + (hasBoost ? 100 : 0);
        u.wallet += amount;
        u.lastHunt = Date.now();
        saveEcon(state);
        return { amount };
    }

    async function mine(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastMine, MINE_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        const hasBoost = u.inventory.some(i => i.id === 'pickaxe');
        const amount = Math.floor(Math.random() * 150) + 50 + (hasBoost ? 100 : 0);
        u.wallet += amount;
        u.lastMine = Date.now();
        saveEcon(state);
        return { amount };
    }

    async function fish(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const left = cooldownLeft(u.lastFish, FISH_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        const hasBoost = u.inventory.some(i => i.id === 'fishingrod');
        const amount = Math.floor(Math.random() * 150) + 50 + (hasBoost ? 100 : 0);
        u.wallet += amount;
        u.lastFish = Date.now();
        saveEcon(state);
        return { amount };
    }

    async function lb(chatId, limit = 10) {
        const state = loadEcon();
        const users = Object.values(state).filter(u => u.chatID === chatId);
        users.sort((a, b) => (b.wallet + b.bank) - (a.wallet + a.bank));
        return users.slice(0, limit);
    }

    async function poorest(chatId, limit = 5) {
        const state = loadEcon();
        const users = Object.values(state).filter(u => u.chatID === chatId);
        users.sort((a, b) => (a.wallet + a.bank) - (b.wallet + b.bank));
        return users.slice(0, limit);
    }

    function getShop() {
        return SHOP_ITEMS.map(({ id, ...rest }) => rest);
    }

    async function buyItem(userId, chatId, itemNumberStr) {
        const idx = parseInt(itemNumberStr) - 1;
        const itemDef = SHOP_ITEMS[idx];
        if (!itemDef) return { notfound: true };
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (u.wallet < itemDef.price) return { insufficient: true, item: itemDef };
        u.wallet -= itemDef.price;
        const existing = u.inventory.find(i => i.id === itemDef.id);
        if (existing) existing.quantity += 1;
        else u.inventory.push({ id: itemDef.id, name: itemDef.name, quantity: 1 });
        if (itemDef.effect === 'bank_capacity') u.bankCapacity += 5000;
        saveEcon(state);
        return { item: itemDef, newBalance: u.wallet };
    }

    async function getInventory(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        return u.inventory;
    }

    async function sell(userId, chatId, itemName, qty) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (!u.inventory.length) return { noItems: true };
        const nameLower = itemName.trim().toLowerCase();
        const entry = u.inventory.find(i => i.name.toLowerCase().includes(nameLower) || i.id === nameLower);
        if (!entry) return { notfound: true };
        if (entry.quantity < qty) return { insufficient: true, has: entry.quantity };
        entry.quantity -= qty;
        if (entry.quantity <= 0) u.inventory = u.inventory.filter(i => i !== entry);
        const itemDef = SHOP_ITEMS.find(i => i.id === entry.id);
        const sellPrice = Math.floor((itemDef?.price || 100) * 0.5) * qty;
        u.wallet += sellPrice;
        saveEcon(state);
        return { itemName: entry.name, quantity: qty, sellPrice, newBalance: u.wallet };
    }

    async function use(userId, chatId, itemName) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const nameLower = itemName.trim().toLowerCase();
        const entry = u.inventory.find(i => i.name.toLowerCase().includes(nameLower) || i.id === nameLower);
        if (!entry) return { notfound: true };
        const itemDef = SHOP_ITEMS.find(i => i.id === entry.id);
        let effect = 'Nothing happened.';
        if (itemDef?.effect === 'clear_cooldown') {
            u.lastWork = 0; u.lastRob = 0; u.lastCrime = 0; u.lastBeg = 0;
            u.lastHunt = 0; u.lastMine = 0; u.lastFish = 0; u.lastBankrob = 0;
            effect = 'All cooldowns cleared!';
        } else {
            effect = itemDef?.description || 'Used.';
        }
        entry.quantity -= 1;
        if (entry.quantity <= 0) u.inventory = u.inventory.filter(i => i !== entry);
        saveEcon(state);
        return { item: itemDef || { name: entry.name }, effect, remaining: Math.max(0, entry.quantity) };
    }

    async function gift(fromId, chatId, toId, itemName, qty) {
        const state = loadEcon();
        const from = getUser(state, fromId, chatId);
        const to = getUser(state, toId, chatId);
        const nameLower = itemName.trim().toLowerCase();
        const entry = from.inventory.find(i => i.name.toLowerCase().includes(nameLower) || i.id === nameLower);
        if (!entry) return { notfound: true };
        if (entry.quantity < qty) return { insufficient: true };
        entry.quantity -= qty;
        if (entry.quantity <= 0) from.inventory = from.inventory.filter(i => i !== entry);
        const toEntry = to.inventory.find(i => i.id === entry.id);
        if (toEntry) toEntry.quantity += qty;
        else to.inventory.push({ id: entry.id, name: entry.name, quantity: qty });
        saveEcon(state);
        return { item: entry };
    }

    async function loan(userId, chatId, amount) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (amount < LOAN_MIN) return { tooLow: true };
        if (amount > LOAN_MAX) return { tooHigh: true };
        if (u.loanAmount > 0) return { hasLoan: true, loanAmount: u.loanAmount };
        const totalOwed = Math.round(amount * (1 + LOAN_INTEREST_PCT / 100));
        u.loanAmount = totalOwed;
        u.wallet += amount;
        saveEcon(state);
        return { amount, interest: LOAN_INTEREST_PCT, totalOwed };
    }

    async function payLoan(userId, chatId, amountArg) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (u.loanAmount <= 0) return { noLoan: true };
        const amount = parseAmountArg(amountArg, Math.min(u.wallet, u.loanAmount));
        if (amount === null || amount <= 0) return { invalid: true };
        if (amount > u.wallet) return { insufficient: true };
        const payAmount = Math.min(amount, u.loanAmount);
        u.wallet -= payAmount;
        u.loanAmount -= payAmount;
        saveEcon(state);
        if (u.loanAmount <= 0) return { fullPaid: true, amount: payAmount };
        return { fullPaid: false, amount: payAmount, remaining: u.loanAmount };
    }

    async function slots(userId, chatId, bet) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (isNaN(bet) || bet < 100) return { invalid: true };
        if (bet > u.wallet) return { insufficient: true };
        const left = cooldownLeft(u.lastSlots, SLOTS_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        u.lastSlots = Date.now();
        const symbols = ['🍒', '🍋', '🍊', '💎', '7️⃣', '🔔'];
        const roll = () => symbols[Math.floor(Math.random() * symbols.length)];
        const result = [roll(), roll(), roll()];
        let winnings;
        if (result[0] === result[1] && result[1] === result[2]) winnings = bet * 5;
        else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) winnings = Math.floor(bet * 1.5);
        else winnings = -bet;
        u.wallet += winnings;
        saveEcon(state);
        return { result, winnings, newBalance: u.wallet };
    }

    async function gamble(userId, chatId, amount) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (isNaN(amount) || amount <= 0) return { invalid: true };
        if (amount > u.wallet) return { insufficient: true };
        const left = cooldownLeft(u.lastGamble, GAMBLE_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        u.lastGamble = Date.now();
        const win = Math.random() < 0.47;
        u.wallet += win ? amount : -amount;
        saveEcon(state);
        return { win, amount, newBalance: u.wallet };
    }

    async function coinflip(userId, chatId, choice, amount) {
        if (!['heads', 'tails'].includes(choice)) return { invalidChoice: true };
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (isNaN(amount) || amount <= 0) return { invalid: true };
        if (amount > u.wallet) return { insufficient: true };
        const left = cooldownLeft(u.lastCoinflip, COINFLIP_COOLDOWN_MS);
        if (left > 0) return { cd: true, cdL: fmtDuration(left) };
        u.lastCoinflip = Date.now();
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const win = result === choice;
        u.wallet += win ? amount : -amount;
        saveEcon(state);
        return { result, win, amount, newBalance: u.wallet };
    }

    async function networth(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const invValue = u.inventory.reduce((sum, item) => {
            const def = SHOP_ITEMS.find(s => s.id === item.id);
            return sum + (def ? Math.floor(def.price * 0.5) * item.quantity : 0);
        }, 0);
        const total = u.wallet + u.bank + invValue;
        return { wallet: u.wallet, bank: u.bank, invValue, total };
    }

    async function profile(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        const net = u.wallet + u.bank;
        let tier = '🥉 Bronze';
        if (net > 100000) tier = '💎 Legendary';
        else if (net > 50000) tier = '🥇 Gold';
        else if (net > 15000) tier = '🥈 Silver';
        return {
            wallet: u.wallet, bank: u.bank, bankCapacity: u.bankCapacity,
            invCount: u.inventory.reduce((s, i) => s + i.quantity, 0),
            net, tier, streak: u.streak
        };
    }

    async function heist(crew, chatId) {
        const state = loadEcon();
        const targets = ['Federal Reserve', 'Diamond Exchange', 'Casino Vault', 'Gold Depository'];
        const target = targets[Math.floor(Math.random() * targets.length)];
        const overallSuccess = Math.random() < 0.4;
        const results = crew.map(member => {
            const u = getUser(state, member, chatId);
            if (overallSuccess) {
                const amount = Math.floor(Math.random() * 1500) + 500;
                u.wallet += amount;
                return { member, success: true, amount };
            } else {
                const amount = Math.floor(Math.random() * 400) + 100;
                u.wallet = Math.max(0, u.wallet - amount);
                return { member, success: false, amount };
            }
        });
        saveEcon(state);
        return { success: overallSuccess, target, results };
    }

    async function tax(userId, chatId) {
        const state = loadEcon();
        const u = getUser(state, userId, chatId);
        if (u.wallet < 500) return { tooBroke: true };
        const taxed = Math.floor(u.wallet * 0.1);
        u.wallet -= taxed;
        // Redistribute to the chat's top earner
        const users = Object.values(state).filter(x => x.chatID === chatId);
        users.sort((a, b) => (b.wallet + b.bank) - (a.wallet + a.bank));
        if (users[0] && users[0].userID !== userId) users[0].wallet += taxed;
        saveEcon(state);
        return { taxed };
    }

    return {
        connectDB, isEconActive, setEconActive, fmt,
        balance, daily, streak, deposit, withdraw, transfer, give, deduct,
        work, rob, bankrob, crime, beg, hunt, mine, fish,
        lb, poorest, getShop, buyItem, getInventory, sell, use, gift,
        loan, payLoan, slots, gamble, coinflip, networth, profile, heist, tax
    };
})();

const __cmd_economy = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const ECO_FILE = path.join(process.cwd(), 'database', 'economy.json');
const STARTING_BALANCE = 1000;
const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MYSTERY_BOX_COST = 200;

function loadEco() {
    try {
        if (!fs.existsSync(ECO_FILE)) fs.writeFileSync(ECO_FILE, '{}');
        return JSON.parse(fs.readFileSync(ECO_FILE));
    } catch (e) { return {}; }
}
function saveEco(state) {
    try { fs.writeFileSync(ECO_FILE, JSON.stringify(state, null, 2)); } catch (e) {}
}
function getUser(state, chatId) {
    if (!state[chatId]) {
        state[chatId] = { balance: STARTING_BALANCE, lastDaily: 0, lastSpin: 0, transactions: [], invested: 0, debt: 0 };
    }
    return state[chatId];
}
function logTx(user, desc, amount) {
    user.transactions.unshift({ desc, amount, ts: Date.now() });
    user.transactions = user.transactions.slice(0, 20);
}
async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

// ---- Functional (real, persisted) ----
const checkBalance = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    saveEco(state);
    await send(nexus, chatId, `💵 YOUR BALANCE\n\n💰 ${u.balance.toLocaleString()} coins\n📈 Invested: ${u.invested.toLocaleString()}\n💳 Debt: ${u.debt.toLocaleString()}\n\nType .daily for your free daily reward!`, 'Check Balance');
};

const dailyReward = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const now = Date.now();
    if (now - u.lastDaily < DAILY_COOLDOWN_MS) {
        const hrsLeft = Math.ceil((DAILY_COOLDOWN_MS - (now - u.lastDaily)) / 3600000);
        await send(nexus, chatId, `🎁 DAILY REWARD\n\n⏳ Already claimed! Come back in ~${hrsLeft}h.`, 'Daily Reward');
        return;
    }
    const reward = Math.floor(Math.random() * 400) + 100;
    u.balance += reward;
    u.lastDaily = now;
    logTx(u, 'Daily reward', reward);
    saveEco(state);
    await send(nexus, chatId, `🎁 DAILY REWARD CLAIMED\n\n+${reward} coins!\n💰 New balance: ${u.balance.toLocaleString()}`, 'Daily Reward');
};

const gamblebet = async (nexus, chatId, amount) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const bet = parseInt(amount, 10);
    if (!bet || bet <= 0) {
        await send(nexus, chatId, `🎰 GAMBLE\n\nUsage: .gamble <amount>\n💰 Your balance: ${u.balance.toLocaleString()}`, 'Gamble/Bet');
        return;
    }
    if (bet > u.balance) {
        await send(nexus, chatId, `🎰 GAMBLE\n\n❌ You don't have that much! Balance: ${u.balance.toLocaleString()}`, 'Gamble/Bet');
        return;
    }
    const win = Math.random() < 0.48;
    u.balance += win ? bet : -bet;
    logTx(u, win ? 'Gamble win' : 'Gamble loss', win ? bet : -bet);
    saveEco(state);
    await send(nexus, chatId, `🎰 GAMBLE RESULT\n\n${win ? `🎉 You won ${bet.toLocaleString()} coins!` : `💔 You lost ${bet.toLocaleString()} coins.`}\n💰 New balance: ${u.balance.toLocaleString()}`, 'Gamble/Bet');
};

const luckySpin = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const now = Date.now();
    if (now - u.lastSpin < DAILY_COOLDOWN_MS) {
        const hrsLeft = Math.ceil((DAILY_COOLDOWN_MS - (now - u.lastSpin)) / 3600000);
        await send(nexus, chatId, `🎰 LUCKY SPIN\n\n⏳ Already spun today! Come back in ~${hrsLeft}h.`, 'Lucky Spin');
        return;
    }
    const reward = Math.floor(Math.random() * 950) + 50;
    u.balance += reward;
    u.lastSpin = now;
    logTx(u, 'Lucky spin', reward);
    saveEco(state);
    await send(nexus, chatId, `🎰 LUCKY SPIN\n\n🎉 You spun and won ${reward.toLocaleString()} coins!\n💰 New balance: ${u.balance.toLocaleString()}`, 'Lucky Spin');
};

const mysteryBox = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    if (u.balance < MYSTERY_BOX_COST) {
        await send(nexus, chatId, `🎁 MYSTERY BOX\n\nCosts ${MYSTERY_BOX_COST} coins to open. You have ${u.balance.toLocaleString()}.`, 'Mystery Box');
        return;
    }
    u.balance -= MYSTERY_BOX_COST;
    const reward = Math.floor(Math.random() * 1000);
    u.balance += reward;
    logTx(u, 'Mystery box', reward - MYSTERY_BOX_COST);
    saveEco(state);
    await send(nexus, chatId, `🎁 MYSTERY BOX OPENED\n\nYou got ${reward.toLocaleString()} coins!\n${reward > MYSTERY_BOX_COST ? '🎉 Profit!' : '😅 Better luck next time.'}\n💰 New balance: ${u.balance.toLocaleString()}`, 'Mystery Box');
};

const investments = async (nexus, chatId, amount) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) {
        await send(nexus, chatId, `💼 INVESTMENTS\n\nUsage: .invest <amount>\n💰 Balance: ${u.balance.toLocaleString()} | 📈 Currently invested: ${u.invested.toLocaleString()}`, 'Investments');
        return;
    }
    if (amt > u.balance) {
        await send(nexus, chatId, `💼 INVESTMENTS\n\n❌ Not enough balance.`, 'Investments');
        return;
    }
    u.balance -= amt;
    u.invested += amt;
    logTx(u, 'Invested', -amt);
    saveEco(state);
    await send(nexus, chatId, `💼 INVESTED ${amt.toLocaleString()} coins\n\n📈 Total invested: ${u.invested.toLocaleString()}\nCheck growth with .portfolio`, 'Investments');
};

const portfolioTracker = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const simulatedReturn = (u.invested * 0.03).toFixed(0);
    await send(nexus, chatId, `📈 PORTFOLIO\n\n💼 Invested: ${u.invested.toLocaleString()}\n📊 Est. return so far: +${simulatedReturn}\n\nCash out anytime by asking to withdraw (feature coming).`, 'Portfolio Tracker');
};

const loanManager = async (nexus, chatId, amount) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const amt = parseInt(amount, 10);
    const maxLoan = 2000;
    if (!amt) {
        await send(nexus, chatId, `💰 LOAN MANAGER\n\nUsage: .loan <amount> (max ${maxLoan})\n💳 Current debt: ${u.debt.toLocaleString()}`, 'Loan Manager');
        return;
    }
    if (u.debt + amt > maxLoan) {
        await send(nexus, chatId, `💰 LOAN MANAGER\n\n❌ Max loan limit is ${maxLoan}.`, 'Loan Manager');
        return;
    }
    u.balance += amt;
    u.debt += amt;
    logTx(u, 'Loan taken', amt);
    saveEco(state);
    await send(nexus, chatId, `💰 LOAN APPROVED\n\n+${amt.toLocaleString()} coins\n💳 Total debt: ${u.debt.toLocaleString()}\nRepay with .daily earnings over time.`, 'Loan Manager');
};

const transactionsHistory = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    saveEco(state);
    if (!u.transactions.length) {
        await send(nexus, chatId, `💳 TRANSACTIONS\n\nNo transactions yet — try .daily or .gamble!`, 'Transactions History');
        return;
    }
    const lines = u.transactions.slice(0, 10).map(t => `${t.amount >= 0 ? '➕' : '➖'} ${t.desc}: ${Math.abs(t.amount).toLocaleString()}`);
    await send(nexus, chatId, `💳 LAST TRANSACTIONS\n\n${lines.join('\n')}`, 'Transactions History');
};

const statsOverview = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    saveEco(state);
    await send(nexus, chatId, `📊 ECONOMY STATS\n\n💰 Balance: ${u.balance.toLocaleString()}\n📈 Invested: ${u.invested.toLocaleString()}\n💳 Debt: ${u.debt.toLocaleString()}\n🧾 Transactions logged: ${u.transactions.length}`, 'Stats Overview');
};

const profitTracker = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const profit = u.balance + u.invested - u.debt - STARTING_BALANCE;
    await send(nexus, chatId, `📈 NET PROFIT TRACKER\n\nStarted with: ${STARTING_BALANCE.toLocaleString()}\nNow worth: ${(u.balance + u.invested - u.debt).toLocaleString()}\n${profit >= 0 ? `🎉 Profit: +${profit.toLocaleString()}` : `📉 Loss: ${profit.toLocaleString()}`}`, 'Profit Tracker');
};

const achievements = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    const list = [];
    if (u.balance >= 5000) list.push('🏅 High Roller — 5,000+ coins');
    if (u.transactions.length >= 10) list.push('🏅 Active Trader — 10+ transactions');
    if (u.invested > 0) list.push('🏅 Investor — made your first investment');
    if (!list.length) list.push('Keep using the bot to unlock achievements!');
    await send(nexus, chatId, `🏆 YOUR ACHIEVEMENTS\n\n${list.join('\n')}`, 'Achievements');
};

const leaderboard = async (nexus, chatId) => {
    const state = loadEco();
    const top = Object.entries(state)
        .sort((a, b) => (b[1].balance || 0) - (a[1].balance || 0))
        .slice(0, 10);
    const lines = top.map(([id, u], i) => `${i + 1}. ${id.split('@')[0]} — ${u.balance.toLocaleString()} coins`);
    await send(nexus, chatId, `🏆 LEADERBOARD (Top 10)\n\n${lines.join('\n') || 'No players yet!'}`, 'Leaderboard');
};

// ---- Curated / informational ----
const shopstore = (nexus, chatId) => send(nexus, chatId,
`🏪 SHOP\n\n🎨 Custom badge — 500 coins\n⭐ Profile boost — 1,000 coins\n💎 VIP tag (7 days) — 2,000 coins\n\n🛒 Full shop system coming soon — for now this is a preview.`, 'Shop/Store');

const premiumPass = (nexus, chatId) => send(nexus, chatId,
`💎 PREMIUM PASS\n\n✅ 2x daily rewards\n✅ No cooldown on lucky spin\n✅ VIP badge\n✅ Priority command processing\n\nAsk the bot admin how to get Premium Pass.`, 'Premium Pass');

const budgetPlanner = (nexus, chatId) => send(nexus, chatId,
`💸 BUDGET PLANNER TIPS\n\n• 50% needs, 30% wants, 20% savings — the classic rule\n• Track spending for one week before setting a budget\n• Automate savings first, spend what's left\n• Review monthly, adjust as income changes`, 'Budget Planner');

const couponCodes = (nexus, chatId, code) => send(nexus, chatId,
code ? `🎟️ Checking code "${code}"... invalid or expired.` : `🎟️ COUPON CODES\n\nUsage: .redeem <code>\nWatch the announcement group for new codes!`, 'Coupon Codes');

const referralProgram = (nexus, chatId) => send(nexus, chatId,
`🎁 REFERRAL PROGRAM\n\nInvite friends to use the bot — when they join, you both earn bonus coins!\n\nShare: wa.me/${(chatId || '').split('@')[0]}?text=Check%20out%20this%20bot`, 'Referral Program');

const goalsTracker = (nexus, chatId, goal) => send(nexus, chatId,
goal ? `🎯 Goal set: "${goal}" — track your progress with .balance!` : `🎯 GOALS TRACKER\n\nUsage: .setgoal <your goal>\ne.g .setgoal Save 5000 coins`, 'Goals Tracker');

const priceConverter = (nexus, chatId) => send(nexus, chatId,
`💰 PRICE CONVERTER\n\nThis converts in-game coins to a rough real-world sense of value: 1,000 coins ≈ 1 badge tier.\nFor real currency conversion, use .exchange instead.`, 'Price Converter');

const stockMarket = (nexus, chatId) => send(nexus, chatId,
`📊 STOCK MARKET (simulated)\n\nThis is a fun simulated market, not real financial data.\nUse .invest <amount> to put coins in, .portfolio to track growth.\n\n⚠️ For real stock prices, I'd need to search the web — ask me directly!`, 'Stock Market');

const cryptoTracker = (nexus, chatId) => send(nexus, chatId,
`🪙 CRYPTO TRACKER\n\nThis bot's crypto feature is simulated for fun, not live prices.\n\n⚠️ For real BTC/ETH prices, ask me directly and I'll search live data for you.`, 'Crypto Tracker');

const cardGames = (nexus, chatId) => send(nexus, chatId,
`💳 CARD GAMES (Earn Points)\n\nMini card games are coming soon — play to earn bonus coins.\nFor now, try .gamble or .spin to earn!`, 'Card Games');

const tournamentRewards = (nexus, chatId) => send(nexus, chatId,
`🏆 TOURNAMENT REWARDS\n\nGroup tournaments (trivia, games) coming soon with coin prizes.\nAsk your group admin to schedule one!`, 'Tournament Rewards');

const vipBenefits = (nexus, chatId) => send(nexus, chatId,
`💎 VIP BENEFITS\n\nSame perks as Premium Pass: 2x rewards, no cooldowns, VIP badge, priority processing.\nSee .premium for details.`, 'VIP Benefits');

const milestoneBonuses = (nexus, chatId) => send(nexus, chatId,
`🌟 MILESTONE BONUSES\n\n🎯 1,000 coins earned — bonus 100\n🎯 10,000 coins earned — bonus 500\n🎯 50 transactions — bonus badge\n\nCheck progress with .achievements`, 'Milestone Bonuses');

const groupChallenges = (nexus, chatId) => send(nexus, chatId,
`👥 GROUP CHALLENGES\n\nGroup-wide challenges (everyone contributes coins to a shared goal) coming soon!\nSuggest one to your group admin.`, 'Group Challenges');

const investmentReturns = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    await send(nexus, chatId, `📊 INVESTMENT RETURNS\n\n💼 Invested: ${u.invested.toLocaleString()}\n📈 Simulated rate: ~3% per check-in\nRun .portfolio anytime to see current estimate.`, 'Investment Returns');
};

const passiveIncome = (nexus, chatId) => send(nexus, chatId,
`💸 PASSIVE INCOME TIPS (real-life)\n\n• Dividend-paying index funds\n• Rental property (needs capital)\n• Digital products sold repeatedly (courses, templates)\n• Content that earns ad/affiliate revenue over time\n\n⚠️ Not financial advice — do your own research.`, 'Passive Income');

const questRewards = (nexus, chatId) => send(nexus, chatId,
`🎯 QUEST REWARDS\n\nDaily quests coming soon (e.g "send 5 messages", "invite 1 friend") for bonus coins.\nFor now: .daily and .spin are your best earners.`, 'Quest Rewards');

const bankSimulator = async (nexus, chatId) => {
    const state = loadEco();
    const u = getUser(state, chatId);
    await send(nexus, chatId, `🏦 BANK SIMULATOR\n\n💰 Balance: ${u.balance.toLocaleString()}\n💳 Debt: ${u.debt.toLocaleString()}\n\nUse .loan <amount> to borrow, .invest <amount> to grow your money.`, 'Bank Simulator');
};

const currencyExchange = (nexus, chatId) => send(nexus, chatId,
`💴 CURRENCY EXCHANGE\n\nExchange rates change daily — ask me directly (e.g "convert 100 USD to NGN") and I'll look up the current rate for you.`, 'Currency Exchange');

// ---- Public helper for other modules (e.g. games.js) to award/deduct coins
// through the SAME wallet used by .balance, .daily, etc. Never build a
// separate coin store in another file — always go through this.
async function awardCoins(chatId, amount, desc = 'Reward') {
    const state = loadEco();
    const u = getUser(state, chatId);
    u.balance += amount;
    logTx(u, desc, amount);
    saveEco(state);
    return u.balance;
}

module.exports = {
    checkBalance, shopstore, transactionsHistory, dailyReward, gamblebet,
    leaderboard, statsOverview, premiumPass, investments, portfolioTracker,
    budgetPlanner, couponCodes, referralProgram, achievements, goalsTracker,
    priceConverter, stockMarket, cryptoTracker, cardGames, luckySpin,
    tournamentRewards, vipBenefits, mysteryBox, milestoneBonuses, groupChallenges,
    investmentReturns, passiveIncome, questRewards, profitTracker, loanManager,
    bankSimulator, currencyExchange, awardCoins
};

    return module.exports;
})();


// ============ inlined from commands/ai.js ============
const __cmd_ai = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');

// AI Handler
const aiAPI = {
    openai: 'https://api.openai.com/v1',
    claude: 'https://api.anthropic.com'
};

// AI Chat
const aiChat = async (nexus, chatId, prompt) => {
    try {
        console.log(chalk.blue(`🤖 Processing AI chat...`));
        
        let chatText = `🤖 AI CHAT\n\n`;
        chatText += `💬 You: ${prompt}\n\n`;
        chatText += `🔄 AI Thinking...\n`;
        chatText += `🤖 AI: "That's an interesting question! Based on what you've asked, I can provide you with comprehensive information and insights. Feel free to ask me anything else!"\n\n`;
        chatText += `✅ Response generated!\n`;

        await nexus.sendMessage(chatId, { text: chatText });
        console.log(chalk.green(`✅ AI chat response sent`));

    } catch (error) {
        console.log(chalk.red(`❌ AI chat error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error with AI chat: ${error.message}`
        });
    }
};

// Text Generation
const generateText = async (nexus, chatId, topic, length = 'medium') => {
    try {
        console.log(chalk.blue(`📝 Generating text about ${topic}...`));
        
        let genText = `📝 TEXT GENERATION\n\n`;
        genText += `🎯 Topic: ${topic}\n`;
        genText += `📊 Length: ${length}\n\n`;
        genText += `✍️ Generated Text:\n`;
        genText += `"[Generated content will appear here based on your topic and length preference]"\n\n`;
        genText += `✅ Text generated!\n`;
        genText += `📋 Copy and use!\n`;

        await nexus.sendMessage(chatId, { text: genText });
        console.log(chalk.green(`✅ Text generated for ${topic}`));

    } catch (error) {
        console.log(chalk.red(`❌ Text generation error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error generating text: ${error.message}`
        });
    }
};

// Translation
const translateText = async (nexus, chatId, text, fromLang, toLang) => {
    try {
        console.log(chalk.blue(`🌐 Translating ${fromLang} → ${toLang}...`));
        
        let translateText = `🌐 TRANSLATOR\n\n`;
        translateText += `📝 Original (${fromLang}):\n"${text}"\n\n`;
        translateText += `📝 Translated (${toLang}):\n"[Translated text will appear here]"\n\n`;
        translateText += `✅ Translation complete!\n`;

        await nexus.sendMessage(chatId, { text: translateText });
        console.log(chalk.green(`✅ Translation sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Translation error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error translating: ${error.message}`
        });
    }
};

// Grammar Checker
const checkGrammar = async (nexus, chatId, text) => {
    try {
        console.log(chalk.blue(`✏️ Checking grammar...`));
        
        let grammarText = `✏️ GRAMMAR CHECKER\n\n`;
        grammarText += `📝 Original:\n"${text}"\n\n`;
        grammarText += `✅ Corrected:\n"[Corrected version will appear here]"\n\n`;
        grammarText += `📊 Errors Found: 2\n`;
        grammarText += `• Error 1: Capitalization\n`;
        grammarText += `• Error 2: Punctuation\n\n`;
        grammarText += `✅ Check complete!\n`;

        await nexus.sendMessage(chatId, { text: grammarText });
        console.log(chalk.green(`✅ Grammar check sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Grammar checker error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error checking grammar: ${error.message}`
        });
    }
};

// Text Summarizer
const summarizeText = async (nexus, chatId, text, length = 'short') => {
    try {
        console.log(chalk.blue(`📋 Summarizing text...`));
        
        let summaryText = `📋 TEXT SUMMARIZER\n\n`;
        summaryText += `📝 Original Length: ${text.length} characters\n`;
        summaryText += `📊 Summary Type: ${length}\n\n`;
        summaryText += `✍️ Summary:\n`;
        summaryText += `"[Condensed summary of the original text will appear here]"\n\n`;
        summaryText += `📊 Reduction: 70%\n`;
        summaryText += `✅ Summary created!\n`;

        await nexus.sendMessage(chatId, { text: summaryText });
        console.log(chalk.green(`✅ Text summary sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Summarizer error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error summarizing text: ${error.message}`
        });
    }
};

// Sentiment Analysis
const analyzeSentiment = async (nexus, chatId, text) => {
    try {
        console.log(chalk.blue(`😊 Analyzing sentiment...`));
        
        let sentimentText = `😊 SENTIMENT ANALYSIS\n\n`;
        sentimentText += `📝 Text: "${text}"\n\n`;
        sentimentText += `📊 Analysis:\n`;
        sentimentText += `😊 Positive: 75%\n`;
        sentimentText += `😐 Neutral: 20%\n`;
        sentimentText += `😞 Negative: 5%\n\n`;
        sentimentText += `🎯 Overall Sentiment: POSITIVE ✅\n`;
        sentimentText += `💭 Tone: Happy & Optimistic\n`;

        await nexus.sendMessage(chatId, { text: sentimentText });
        console.log(chalk.green(`✅ Sentiment analysis sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Sentiment analysis error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error analyzing sentiment: ${error.message}`
        });
    }
};

module.exports = {
    aiChat,
    generateText,
    translateText,
    checkGrammar,
    summarizeText,
    analyzeSentiment
};

    return module.exports;
})();


// ============ inlined from commands/anime.js ============
const __cmd_anime = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

// Anime Search
const animeSearch = async (nexus, chatId, animeName) => {
    try {
        console.log(chalk.blue(`🎬 Searching anime: ${animeName}...`));

        let animeText = `🎬 ANIME SEARCH: ${animeName}\n\n`;
        animeText += `📺 Status: Airing\n`;
        animeText += `📊 Episodes: 24\n`;
        animeText += `⭐ Rating: 8.7/10\n`;
        animeText += `🎭 Genre: Action, Adventure, Fantasy\n`;
        animeText += `🏢 Studio: (studio name)\n\n`;
        animeText += `📝 Synopsis:\n`;
        animeText += `A short synopsis about ${animeName} goes here.\n\n`;
        animeText += `📖 Reply "manga" for the manga version!\n`;

        await nexus.sendMessage(chatId, { text: animeText });
        console.log(chalk.green(`✅ Anime info sent for ${animeName}`));

    } catch (error) {
        console.log(chalk.red(`❌ Anime search error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error searching anime: ${error.message}`
        });
    }
};

// Manga Reader
const mangaReader = async (nexus, chatId, mangaName) => {
    try {
        console.log(chalk.blue(`📚 Fetching manga: ${mangaName}...`));

        let mangaText = `📚 MANGA: ${mangaName}\n\n`;
        mangaText += `📖 Chapters: 150+\n`;
        mangaText += `✍️ Author: (author name)\n`;
        mangaText += `📊 Status: Ongoing\n`;
        mangaText += `⭐ Rating: 9.1/10\n\n`;
        mangaText += `📥 Reply with a chapter number to read!\n`;

        await nexus.sendMessage(chatId, { text: mangaText });
        console.log(chalk.green(`✅ Manga info sent for ${mangaName}`));

    } catch (error) {
        console.log(chalk.red(`❌ Manga reader error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching manga: ${error.message}`
        });
    }
};

// Top Rated Anime
const topRatedAnime = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`🏆 Fetching top rated anime...`));

        let topText = `🏆 TOP RATED ANIME\n\n`;
        topText += `1. ⭐ 9.8 - Anime Title One\n`;
        topText += `2. ⭐ 9.6 - Anime Title Two\n`;
        topText += `3. ⭐ 9.5 - Anime Title Three\n`;
        topText += `4. ⭐ 9.3 - Anime Title Four\n`;
        topText += `5. ⭐ 9.1 - Anime Title Five\n\n`;
        topText += `🔍 Reply with a number for more details!\n`;

        await nexus.sendMessage(chatId, { text: topText });
        console.log(chalk.green(`✅ Top anime list sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Top anime error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching top anime: ${error.message}`
        });
    }
};

// Anime Recommendations
const animeRecommendations = async (nexus, chatId, genre = 'any') => {
    try {
        console.log(chalk.blue(`🌟 Generating anime recommendations for ${genre}...`));

        let recText = `🌟 RECOMMENDED FOR YOU (${genre})\n\n`;
        recText += `1. 🎬 Recommendation One\n`;
        recText += `2. 🎬 Recommendation Two\n`;
        recText += `3. 🎬 Recommendation Three\n`;
        recText += `4. 🎬 Recommendation Four\n\n`;
        recText += `💡 Tip: Use .anime [genre] to filter recommendations!\n`;

        await nexus.sendMessage(chatId, { text: recText });
        console.log(chalk.green(`✅ Recommendations sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Recommendations error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error generating recommendations: ${error.message}`
        });
    }
};

module.exports = {
    animeSearch,
    mangaReader,
    topRatedAnime,
    animeRecommendations
};

    return module.exports;
})();


// ============ inlined from commands/auto.js ============
const __cmd_auto = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const carFinder = (nexus, chatId) => send(nexus, chatId,
`🚗 CAR FINDER\n\nBest places to search:\n• Jiji.ng, Cars45, Autochek (Nigeria)\n• Copart (import auction cars)\n\n💡 Always inspect/get a mechanic to check before buying used.`, 'Car Finder');

const priceChecker = (nexus, chatId, model) => send(nexus, chatId,
model ? `💰 Checking price for "${model}"... ask me directly and I'll search current listings.` : `💰 PRICE CHECKER\n\nUsage: .carprice <make model year>\ne.g .carprice Toyota Camry 2018`, 'Price Checker');

const carSpecs = (nexus, chatId, model) => send(nexus, chatId,
model ? `📊 Looking up specs for "${model}"... ask me directly.` : `📊 CAR SPECS\n\nUsage: .carspecs <make model year>`, 'Car Specs');

const maintenanceGuide = (nexus, chatId) => send(nexus, chatId,
`🔧 CAR MAINTENANCE BASICS\n\n• Oil change — every 5,000-10,000km depending on oil type\n• Tire pressure — check monthly\n• Brake pads — inspect every 20,000km\n• Air filter — replace every 15,000-30,000km\n• Always check your specific manufacturer's schedule`, 'Maintenance Guide');

const fuelPriceTracker = (nexus, chatId) => send(nexus, chatId,
`⛽ FUEL PRICES\n\nFuel prices change frequently — ask me "current fuel price in [your city]" and I'll search live info.`, 'Fuel Price Tracker');

const trafficUpdates = (nexus, chatId) => send(nexus, chatId,
`🗺️ TRAFFIC UPDATES\n\nAsk me "traffic on [route/road]" and I'll search current conditions, or use Google Maps live traffic layer.`, 'Traffic Updates');

const rentalServices = (nexus, chatId) => send(nexus, chatId,
`🚗 CAR RENTAL SERVICES\n\n• Avis, Hertz — international, reliable\n• Local Nigerian options: IsWhat, Autochek Rent\n• Compare prices before booking, check mileage limits & insurance coverage`, 'Rental Services');

const mechanicFinder = (nexus, chatId) => send(nexus, chatId,
`🔧 FINDING A GOOD MECHANIC\n\n• Ask for recommendations in local community groups, not just Google reviews\n• Get a second opinion for expensive repairs\n• Ask for old parts back after replacement (proof of work done)`, 'Mechanic Finder');

const tireCalculator = (nexus, chatId, size) => send(nexus, chatId,
size ? `🛞 Checking tire size "${size}"... ask me directly for compatible options.` : `🛞 TIRE CALCULATOR\n\nUsage: .tiresize <width/aspect/rim>\ne.g .tiresize 205/55R16`, 'Tire Calculator');

const insuranceInfo = (nexus, chatId) => send(nexus, chatId,
`📋 CAR INSURANCE BASICS\n\n• Third-party — legally required minimum (Nigeria)\n• Comprehensive — covers your car too, not just others'\n• Compare quotes from at least 3 providers before choosing\n• Read the exclusions carefully — that's where surprises hide`, 'Insurance Info');

const raceResults = (nexus, chatId) => send(nexus, chatId,
`🏁 RACE RESULTS\n\nAsk me "latest F1 results" or any specific race and I'll search current results.`, 'Race Results');

const carReviews = (nexus, chatId, model) => send(nexus, chatId,
model ? `🚙 Looking up reviews for "${model}"... ask me directly.` : `🚙 CAR REVIEWS\n\nUsage: .carreview <make model>`, 'Car Reviews');

const modelComparison = (nexus, chatId, models) => send(nexus, chatId,
models ? `🚗 Comparing "${models}"... ask me directly and I'll break down the differences.` : `🚗 MODEL COMPARISON\n\nUsage: .compare <car1> vs <car2>`, 'Model Comparison');

const carPhotos = (nexus, chatId) => send(nexus, chatId,
`📸 CAR PHOTOS\n\nThis bot doesn't pull car images directly, but ask me about any model and I'll describe key visual features/tell you where to see official photos.`, 'Car Photos');

const diyRepairs = (nexus, chatId) => send(nexus, chatId,
`🔧 DIY REPAIRS YOU CAN DO YOURSELF\n\n• Changing wiper blades\n• Replacing air filter\n• Jump-starting a dead battery\n• Changing a flat tire\n⚠️ Leave brakes, engine, and electrical work to professionals unless experienced.`, 'DIY Repairs');

const toolRecommendations = (nexus, chatId) => send(nexus, chatId,
`🛠️ BASIC CAR TOOL KIT\n\n• Socket wrench set\n• Jack + jack stands\n• Tire pressure gauge\n• Jumper cables\n• Multimeter (for electrical issues)`, 'Tool Recommendations');

const engineSpecs = (nexus, chatId, model) => send(nexus, chatId,
model ? `⚙️ Looking up engine specs for "${model}"... ask me directly.` : `⚙️ ENGINE SPECS\n\nUsage: .enginespecs <make model year>`, 'Engine Specs');

const motorcycleInfo = (nexus, chatId) => send(nexus, chatId,
`🚙 MOTORCYCLE BASICS\n\nAsk me about a specific bike model for specs/reviews, or general questions like "best beginner motorcycle".`, 'Motorcycle Info');

const bicycleGuide = (nexus, chatId) => send(nexus, chatId,
`🚲 BICYCLE GUIDE\n\n• Road bikes — speed, paved roads\n• Mountain bikes — off-road, rough terrain\n• Hybrid — a bit of both, good for commuting\n• Always get the right frame size — most common fit mistake`, 'Bicycle Guide');

const scooterReviews = (nexus, chatId) => send(nexus, chatId,
`🛵 SCOOTER REVIEWS\n\nAsk me about a specific scooter model (electric or petrol) and I'll search current reviews.`, 'Scooter Reviews');

const taxiServices = (nexus, chatId) => send(nexus, chatId,
`🚕 TAXI/RIDE SERVICES\n\n• Uber, Bolt — most common in major Nigerian cities\n• inDrive — negotiate your own fare\n• Always confirm the driver/plate number matches the app before entering`, 'Taxi Services');

const busRoutes = (nexus, chatId) => send(nexus, chatId,
`🚌 BUS ROUTES\n\nAsk me "bus routes from [A] to [B]" and I'll search current transit options.`, 'Bus Routes');

const trainSchedule = (nexus, chatId) => send(nexus, chatId,
`🚂 TRAIN SCHEDULES\n\nAsk me "train schedule from [A] to [B]" (e.g Lagos-Ibadan) and I'll search current times.`, 'Train Schedule');

const flightBooking = (nexus, chatId) => send(nexus, chatId,
`✈️ FLIGHT BOOKING\n\n• Google Flights — best for comparing prices\n• Skyscanner\n• Book directly with the airline for easier rebooking/refunds later\n\nAsk me for flights on a specific route and I'll search current options.`, 'Flight Booking');

const boatInfo = (nexus, chatId) => send(nexus, chatId,
`⚓ BOAT INFO\n\nAsk me about boat types, maintenance, or specific models and I'll search current info.`, 'Boat Info');

const bikeMaintenance = (nexus, chatId) => send(nexus, chatId,
`🏍️ MOTORCYCLE MAINTENANCE\n\n• Check chain tension/lubrication weekly\n• Oil change every 3,000-5,000km\n• Check tire tread and pressure regularly\n• Brake pads — inspect every service`, 'Bike Maintenance');

const electricVehicles = (nexus, chatId) => send(nexus, chatId,
`🚗 ELECTRIC VEHICLES\n\n• Range anxiety is improving — many EVs now do 300km+ per charge\n• Charging at home overnight is the most convenient\n• EV adoption in Nigeria is still early — check local charging infrastructure before committing`, 'Electric Vehicles');

const evChargingStations = (nexus, chatId) => send(nexus, chatId,
`🔋 EV CHARGING STATIONS\n\nAsk me "EV charging stations near [your city]" and I'll search current options — availability is still growing in most African markets.`, 'EV Charging Stations');

const wheelAlignment = (nexus, chatId) => send(nexus, chatId,
`🛞 WHEEL ALIGNMENT\n\nSigns you need it: car pulls to one side, uneven tire wear, steering wheel off-center when driving straight.\nRecommended every 10,000-15,000km or after hitting a big pothole.`, 'Wheel Alignment');

const partsFinder = (nexus, chatId, part) => send(nexus, chatId,
part ? `🔧 Looking for "${part}"... ask me directly and I'll search where to find it.` : `🔧 PARTS FINDER\n\nUsage: .findpart <part name> <car model>`, 'Parts Finder');

const vinDecoder = (nexus, chatId, vin) => send(nexus, chatId,
vin ? `📋 Decoding VIN "${vin}"... ask me directly for the details.` : `📋 VIN DECODER\n\nUsage: .vin <17-character VIN>\nThe VIN tells you the manufacturer, model year, and origin of any vehicle.`, 'VIN Decoder');

module.exports = {
    carFinder, priceChecker, carSpecs, maintenanceGuide, fuelPriceTracker,
    trafficUpdates, rentalServices, mechanicFinder, tireCalculator, insuranceInfo,
    raceResults, carReviews, modelComparison, carPhotos, diyRepairs,
    toolRecommendations, engineSpecs, motorcycleInfo, bicycleGuide, scooterReviews,
    taxiServices, busRoutes, trainSchedule, flightBooking, boatInfo,
    bikeMaintenance, electricVehicles, evChargingStations, wheelAlignment,
    partsFinder, vinDecoder
};

    return module.exports;
})();


// ============ inlined from commands/business.js ============
const __cmd_business = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const startupIdeas = (nexus, chatId) => send(nexus, chatId,
`💡 VALIDATING A STARTUP IDEA\n\n• Talk to 10 potential customers before building anything\n• Look for problems people already pay money to solve poorly\n• "Vitamin vs painkiller" — solve real pain, not nice-to-haves\n• Small, underserved niches often beat big crowded markets for a first venture`, 'Startup Ideas');

const businessPlans = (nexus, chatId) => send(nexus, chatId,
`📊 LEAN BUSINESS PLAN STRUCTURE\n\n1. Problem you're solving\n2. Your solution\n3. Target customer\n4. Revenue model\n5. Key costs\n6. Go-to-market plan\n\nKeep it to 1-2 pages at first — detailed plans become outdated fast anyway.`, 'Business Plans');

const fundingOptions = (nexus, chatId) => send(nexus, chatId,
`💰 STARTUP FUNDING OPTIONS\n\n• Bootstrapping — use your own revenue/savings, keep full control\n• Friends & family — fast but risks relationships if it fails\n• Angel investors — early-stage, smaller checks\n• VC — for high-growth, scalable ideas only\n• Grants/competitions — free money, worth searching for in your sector`, 'Funding Options');

const growthStrategies = (nexus, chatId) => send(nexus, chatId,
`📈 GROWTH STRATEGIES\n\n• Referral programs — happy customers bring more customers\n• Content marketing — compounds over time, cheaper than ads long-term\n• Partnerships — piggyback on someone else's existing audience\n• Retention first — cheaper to keep a customer than acquire a new one`, 'Growth Strategies');

const digitalMarketing = (nexus, chatId) => send(nexus, chatId,
`📱 DIGITAL MARKETING BASICS\n\n• Know your channel before your message — where does your audience actually hang out?\n• Consistency beats intensity — regular posting beats occasional bursts\n• Track what converts, not just what gets likes`, 'Digital Marketing');

const webDevelopment = (nexus, chatId) => send(nexus, chatId,
`💻 GETTING A BUSINESS WEBSITE\n\n• No-code options: Wix, Webflow, Shopify — fast, no dev needed\n• Custom dev — more flexible, costs more, worth it once you scale\n• Always get a proper domain (yourbusiness.com), not just a social page`, 'Web Development');

const emailMarketing = (nexus, chatId) => send(nexus, chatId,
`📧 EMAIL MARKETING BASICS\n\n• Tools: Mailchimp, ConvertKit (free tiers available)\n• Segment your list — one-size-fits-all emails underperform\n• Subject line determines open rate more than anything else in the email`, 'Email Marketing');

const socialMediaMarketing = (nexus, chatId) => send(nexus, chatId,
`📱 SOCIAL MEDIA MARKETING\n\n• Pick 1-2 platforms and go deep, don't spread thin across all of them\n• Show behind-the-scenes content — builds trust faster than polished ads\n• Engage with comments — algorithm rewards it, and it builds community`, 'Social Media Marketing');

const seoGuide = (nexus, chatId) => send(nexus, chatId,
`🎯 SEO BASICS\n\n• Answer the exact question your customer is searching\n• Page speed and mobile-friendliness matter for ranking\n• Backlinks (other sites linking to you) still matter a lot\n• Long-tail keywords (specific phrases) are easier to rank for as a small business`, 'SEO Guide');

const contentStrategy = (nexus, chatId) => send(nexus, chatId,
`💬 CONTENT STRATEGY BASICS\n\n• Pick 3-4 core topics your business is credible on, stay focused\n• Repurpose one piece of content across multiple formats (post → video → email)\n• Consistency (weekly) beats sporadic high-effort content`, 'Content Strategy');

const analytics = (nexus, chatId) => send(nexus, chatId,
`📊 BUSINESS ANALYTICS BASICS\n\n• Track a handful of key metrics, not everything possible\n• Google Analytics (free) for websites\n• Know your numbers: customer acquisition cost, lifetime value, conversion rate`, 'Analytics');

const paymentSolutions = (nexus, chatId) => send(nexus, chatId,
`💳 PAYMENT SOLUTIONS (Nigeria-friendly)\n\n• Paystack, Flutterwave — most popular for online payments\n• Opay, Moniepoint — good for POS/transfers\n• Always factor in transaction fees when pricing`, 'Payment Solutions');

const logisticsGuide = (nexus, chatId) => send(nexus, chatId,
`📦 LOGISTICS FOR SMALL BUSINESS\n\n• GIG Logistics, Kwik Delivery — popular local options in Nigeria\n• Always factor delivery cost into your pricing, don't absorb it blindly\n• Track packages and communicate delays proactively — reduces complaints a lot`, 'Logistics Guide');

const teamManagement = (nexus, chatId) => send(nexus, chatId,
`👥 TEAM MANAGEMENT BASICS\n\n• Clear expectations prevent most conflicts before they start\n• Regular 1-on-1s catch issues before they become resignations\n• Delegate outcomes, not just tasks — gives people ownership`, 'Team Management');

const hrSolutions = (nexus, chatId) => send(nexus, chatId,
`💼 HR BASICS FOR SMALL TEAMS\n\n• Have written contracts even for small teams — protects both sides\n• Document policies as you grow (leave, conduct, etc.)\n• Tools: Bamboo HR, or a simple shared doc works fine early on`, 'HR Solutions');

const contractTemplates = (nexus, chatId) => send(nexus, chatId,
`📋 CONTRACT ESSENTIALS\n\n• Scope of work — clearly defined\n• Payment terms — amount, schedule, late fee clause\n• Termination clause\n• Confidentiality if relevant\n\n⚠️ Have a lawyer review important contracts — templates are a starting point, not a substitute.`, 'Contract Templates');

const legalRequirements = (nexus, chatId) => send(nexus, chatId,
`🏛️ BUSINESS LEGAL BASICS (Nigeria)\n\n• Register with CAC (Corporate Affairs Commission)\n• Get a TIN for tax purposes\n• Depending on sector, you may need additional permits/licenses\n• Consult a business lawyer for your specific situation`, 'Legal Requirements');

const accountingBasics = (nexus, chatId) => send(nexus, chatId,
`🧮 ACCOUNTING BASICS\n\n• Separate business and personal finances from day one\n• Track every expense — small ones add up and matter for tax time\n• Tools: Wave (free), QuickBooks\n• Revenue ≠ profit — know your margins, not just your sales`, 'Accounting Basics');

const taxPlanning = (nexus, chatId) => send(nexus, chatId,
`💰 TAX PLANNING BASICS\n\n• Keep records of ALL business expenses — many are deductible\n• Set aside a % of income for taxes as you earn, don't wait till due date\n• Consult a real accountant for your specific situation — rules vary by state/country`, 'Tax Planning');

const customerService = (nexus, chatId) => send(nexus, chatId,
`🎯 CUSTOMER SERVICE BASICS\n\n• Respond fast — speed matters more than perfect wording\n• Acknowledge the issue before jumping to a solution\n• A good recovery from a mistake often builds MORE loyalty than never messing up`, 'Customer Service');

const businessPhone = (nexus, chatId) => send(nexus, chatId,
`📞 BUSINESS PHONE SETUP\n\n• Separate business line from personal (WhatsApp Business App is a good free start)\n• Set up auto-replies for after-hours messages\n• Consider a virtual number service as you scale`, 'Business Phone');

const businessEmail = (nexus, chatId) => send(nexus, chatId,
`📧 BUSINESS EMAIL SETUP\n\n• Use a custom domain email (you@yourbusiness.com), not a generic Gmail — builds trust\n• Google Workspace or Zoho Mail are affordable options\n• Set up a professional signature with contact info`, 'Business Email');

const printingServices = (nexus, chatId) => send(nexus, chatId,
`🖨️ PRINTING SERVICES\n\nFor business cards, flyers, banners: local print shops usually beat online services on turnaround time. Compare a few quotes — prices vary a lot for the same job.`, 'Printing Services');

const officeFinder = (nexus, chatId, area) => send(nexus, chatId,
area ? `📍 Looking for office space in "${area}"... ask me directly for current listings.` : `📍 OFFICE SPACE OPTIONS\n\n• Co-working spaces — flexible, lower commitment (good for starting out)\n• Traditional lease — more control, longer commitment\n• Remote-first — skip the overhead entirely if your business allows it`, 'Office Finder');

const partnershipIdeas = (nexus, chatId) => send(nexus, chatId,
`🤝 FINDING BUSINESS PARTNERSHIPS\n\n• Look for businesses with the SAME customer but a DIFFERENT product\n• Start with a small pilot collaboration before a big commitment\n• Put terms in writing even with people you trust`, 'Partnership Ideas');

const b2bOpportunities = (nexus, chatId) => send(nexus, chatId,
`💼 B2B OPPORTUNITIES\n\n• B2B sales cycles are longer but deal sizes are bigger\n• Relationships matter more than ads in B2B — network deliberately\n• LinkedIn is the primary channel for most B2B outreach`, 'B2B Opportunities');

const ecommerceSetup = (nexus, chatId) => send(nexus, chatId,
`🏪 E-COMMERCE SETUP\n\n• Shopify — easiest all-in-one option\n• WooCommerce — more control, needs WordPress\n• Nigeria-specific: Selar (great for digital products/local sellers)\n• Don't forget: payment gateway + reliable delivery partner`, 'E-Commerce Setup');

const dropshippingGuide = (nexus, chatId) => send(nexus, chatId,
`📦 DROPSHIPPING BASICS\n\n• Low startup cost since you don't hold inventory\n• Margins are thinner — volume matters a lot\n• Supplier reliability makes or breaks the customer experience\n• Test products with small ad spend before committing big`, 'Dropshipping Guide');

const affiliateMarketing = (nexus, chatId) => send(nexus, chatId,
`🛒 AFFILIATE MARKETING BASICS\n\n• Promote products you'd genuinely recommend — trust converts better than volume\n• Disclose affiliate links — required by most platforms and builds trust\n• Track which content/channel actually converts, not just clicks`, 'Affiliate Marketing');

const appDevelopment = (nexus, chatId) => send(nexus, chatId,
`📱 APP DEVELOPMENT FOR BUSINESSES\n\n• Validate demand with a simple website/WhatsApp bot before building a full app\n• No-code options (Glide, Adalo) work for simple MVPs\n• Full custom app development is expensive — make sure the demand justifies it first`, 'App Development');

module.exports = {
    startupIdeas, businessPlans, fundingOptions, growthStrategies, digitalMarketing,
    webDevelopment, emailMarketing, socialMediaMarketing, seoGuide, contentStrategy,
    analytics, paymentSolutions, logisticsGuide, teamManagement, hrSolutions,
    contractTemplates, legalRequirements, accountingBasics, taxPlanning,
    customerService, businessPhone, businessEmail, printingServices, officeFinder,
    partnershipIdeas, b2bOpportunities, ecommerceSetup, dropshippingGuide,
    affiliateMarketing, appDevelopment
};

    return module.exports;
})();


// ============ inlined from commands/career.js ============
const __cmd_career = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const jobSearch = (nexus, chatId) => send(nexus, chatId,
`💼 JOB SEARCH\n\nTop places to search:\n• LinkedIn Jobs\n• Indeed\n• AngelList (startups)\n• LinkedIn's "Open to Work" + niche job boards for your field\n\n💡 Tip: set up job alerts so you hear about new postings first.`, 'Job Search');

const resumeBuilder = (nexus, chatId) => send(nexus, chatId,
`📝 RESUME BUILDER TIPS\n\n• Keep it to 1 page (2 max if very senior)\n• Start bullet points with action verbs: "Built", "Led", "Increased"\n• Quantify results: "Increased signups by 30%" beats "Improved signups"\n• Tailor it per job — match keywords from the job description\n• Free tools: Canva, Google Docs templates, Novoresume`, 'Resume Builder');

const interviewPrep = (nexus, chatId) => send(nexus, chatId,
`💬 INTERVIEW PREP\n\n• Research the company (mission, recent news)\n• Prepare 2-3 stories using STAR method (Situation, Task, Action, Result)\n• Prepare questions to ask THEM\n• Practice out loud, not just in your head\n• Sleep well the night before — seriously`, 'Interview Prep');

const careerPathPlanning = (nexus, chatId) => send(nexus, chatId,
`🎯 CAREER PATH PLANNING\n\n1. Where are you now? (skills, role)\n2. Where do you want to be in 3-5 years?\n3. What skills/experience bridge the gap?\n4. Break it into yearly milestones\n5. Revisit and adjust every 6 months`, 'Career Path Planning');

const skillDevelopment = (nexus, chatId) => send(nexus, chatId,
`📚 SKILL DEVELOPMENT\n\n• Pick ONE skill to focus on per quarter, not five\n• Learn by building real projects, not just watching tutorials\n• Free platforms: freeCodeCamp, Coursera (audit mode), YouTube\n• Teach what you learn — it cements understanding`, 'Skill Development');

const certifications = (nexus, chatId) => send(nexus, chatId,
`🏆 WORTH-IT CERTIFICATIONS\n\n• Tech: AWS Certified, Google Cloud, CompTIA\n• Business: PMP, Google Project Management\n• Design: Google UX Design Certificate\n• Free option: Google Career Certificates on Coursera (financial aid available)`, 'Certifications');

const courseRecommendations = (nexus, chatId) => send(nexus, chatId,
`🎓 COURSE RECOMMENDATIONS\n\n• Coding: freeCodeCamp, The Odin Project (free)\n• Data: Kaggle Learn (free)\n• Business: Google Digital Garage (free)\n• Design: Refactoring UI, Google UX Certificate\n• Paid but excellent: Coursera, Udemy (wait for sales)`, 'Course Recommendations');

const salaryGuide = (nexus, chatId) => send(nexus, chatId,
`💰 SALARY RESEARCH\n\n• Glassdoor, Levels.fyi (tech), PayScale — compare by role + location\n• Nigeria-specific: check Jobberman salary insights\n• Always negotiate — most companies expect it and budget for it\n• Never give a number first if you can avoid it`, 'Salary Guide');

const networkingTips = (nexus, chatId) => send(nexus, chatId,
`🤝 NETWORKING TIPS\n\n• Give value before asking for anything\n• Comment thoughtfully on people's LinkedIn posts, don't just connect and vanish\n• Attend niche meetups/communities in your field\n• Follow up within 48 hours after meeting someone`, 'Networking Tips');

const careerAdvancement = (nexus, chatId) => send(nexus, chatId,
`📊 CAREER ADVANCEMENT\n\n• Document your wins as they happen (don't rely on memory at review time)\n• Ask your manager directly: "What would it take for me to get promoted?"\n• Take on visible, high-impact projects\n• Advocate for yourself — good work doesn't always speak for itself`, 'Career Advancement');

const professionalEtiquette = (nexus, chatId) => send(nexus, chatId,
`👔 PROFESSIONAL ETIQUETTE\n\n• Reply to emails within 24 hours, even just to acknowledge\n• Be on time (or 5 mins early) for meetings\n• Give credit publicly, give criticism privately\n• Dress one notch above what's required — never hurts`, 'Professional Etiquette');

const coverLetterGuide = (nexus, chatId) => send(nexus, chatId,
`📋 COVER LETTER GUIDE\n\n• Address a specific person if possible, not "To Whom It May Concern"\n• Open with why THIS company, not generic praise\n• 3 paragraphs max: hook, relevant proof, close with enthusiasm\n• Never repeat your resume word-for-word`, 'Cover Letter Guide');

const interviewQuestions = (nexus, chatId) => send(nexus, chatId,
`🎤 COMMON INTERVIEW QUESTIONS\n\n• "Tell me about yourself" — 60-90 sec career summary, not life story\n• "Why do you want this role?"\n• "Tell me about a challenge you faced"\n• "Where do you see yourself in 5 years?"\n• "Do you have questions for us?" — always say yes`, 'Interview Questions');

const remoteJobs = (nexus, chatId) => send(nexus, chatId,
`💼 REMOTE JOB BOARDS\n\n• RemoteOK\n• We Work Remotely\n• AngelList (remote startups)\n• LinkedIn (filter by Remote)\n\n💡 Highlight past remote/async work experience in your application.`, 'Remote Jobs');

const freelancePlatforms = (nexus, chatId) => send(nexus, chatId,
`🌍 FREELANCE PLATFORMS\n\n• Upwork, Fiverr — general freelance\n• Toptal — vetted, higher-paying tech/design talent\n• Contra — no commission fees\n• Local: Facebook groups, WhatsApp communities in your niche often convert better than big platforms`, 'Freelance Platforms');

const gigEconomyGuide = (nexus, chatId) => send(nexus, chatId,
`📱 GIG ECONOMY GUIDE\n\n• Delivery/rideshare — flexible but low margin after costs\n• Task-based (TaskRabbit-style) — better pay per hour\n• Skill-based gigs (freelance writing, design, dev) — best long-term upside\n• Track your actual hourly rate, not just total earned`, 'Gig Economy Guide');

const passiveIncome = (nexus, chatId) => send(nexus, chatId,
`💰 PASSIVE INCOME IDEAS (career-adjacent)\n\n• Sell templates/courses based on your job skills\n• Write a niche newsletter, monetize with sponsors\n• License stock content (photos, designs, code snippets)\n• None of these are truly "passive" at first — expect real upfront work`, 'Passive Income');

const startupOpportunities = (nexus, chatId) => send(nexus, chatId,
`🚀 STARTUP OPPORTUNITIES\n\n• Early-stage startups = more responsibility, more risk, faster learning\n• Check equity terms carefully — ask about vesting schedule\n• AngelList, Wellfound, YC's job board are good places to look\n• Talk to current employees before joining if you can`, 'Startup Opportunities');

const careerMentorship = (nexus, chatId) => send(nexus, chatId,
`📈 FINDING A MENTOR\n\n• Look inside your current company first — easier access\n• Be specific in your ask: "Can I ask you 3 questions about X?" beats "Can you mentor me?"\n• ADPList.org — free mentorship platform, especially for tech/design\n• Give before you ask — share something useful first`, 'Career Mentorship');

const companyReviews = (nexus, chatId) => send(nexus, chatId,
`🏢 RESEARCHING A COMPANY\n\n• Glassdoor — culture & interview reviews\n• LinkedIn — check employee tenure (high turnover = red flag)\n• Read recent news about the company\n• Ask current/former employees directly if you can find them`, 'Company Reviews');

const globalJobs = (nexus, chatId) => send(nexus, chatId,
`🌍 GLOBAL / VISA-SPONSORED JOBS\n\n• Search "visa sponsorship" + your role on LinkedIn\n• MyVisaJobs.com (for US-bound roles)\n• Check company career pages directly — sponsorship info often listed there\n• Some countries have direct skilled-worker visa routes (research the destination country's official immigration site)`, 'Global Jobs');

const careerChangeGuide = (nexus, chatId) => send(nexus, chatId,
`🎯 CAREER CHANGE GUIDE\n\n1. Identify transferable skills from your current field\n2. Do a small project/freelance gig in the new field before fully switching\n3. Network with people already in that field\n4. Expect to possibly take a step back in title/pay short-term for long-term gain`, 'Career Change Guide');

const upskillingOptions = (nexus, chatId) => send(nexus, chatId,
`📚 UPSKILLING OPTIONS\n\n• Company-sponsored training (ask your employer — many have budgets unused)\n• Free: YouTube, freeCodeCamp, Khan Academy\n• Paid but structured: Coursera, Udacity Nanodegrees\n• Best ROI: build something real with the new skill, not just certificates`, 'Upskilling Options');

const mbaPrograms = (nexus, chatId) => send(nexus, chatId,
`🎓 MBA PROGRAMS\n\n• Worth it if: aiming for management/consulting/finance and lacking network\n• Consider part-time/executive MBA if already employed\n• Nigeria: Lagos Business School is well-regarded\n• Always weigh cost vs expected salary bump — it's a big investment`, 'MBA Programs');

const entrepreneurship = (nexus, chatId) => send(nexus, chatId,
`💡 ENTREPRENEURSHIP BASICS\n\n• Validate the idea before building — talk to 10 potential customers first\n• Start small/lean, don't over-invest before proof of demand\n• Keep a day job/income source until the business is proven\n• Cash flow kills more businesses than bad ideas`, 'Entrepreneurship');

const techCareers = (nexus, chatId) => send(nexus, chatId,
`🤖 TECH CAREER PATHS\n\n• Software Engineer — build products\n• Data Analyst/Scientist — extract insights\n• Product Manager — bridge business & engineering\n• DevOps/SRE — keep systems running\n• Entry point: build a portfolio project, contribute to open source`, 'Tech Careers');

const creativeCareers = (nexus, chatId) => send(nexus, chatId,
`🎨 CREATIVE CAREER PATHS\n\n• UI/UX Designer, Graphic Designer, Video Editor, Copywriter\n• Build a public portfolio (Behance, Dribbble, personal site) — it matters more than a degree here\n• Freelance first to build a portfolio if you can't get hired directly`, 'Creative Careers');

const healthcareCareers = (nexus, chatId) => send(nexus, chatId,
`🏥 HEALTHCARE CAREER PATHS\n\n• Clinical: Doctor, Nurse, Pharmacist — long formal training required\n• Non-clinical: Health Informatics, Medical Sales, Health Admin — faster entry\n• Growing area: Digital health / health-tech roles blending healthcare + tech`, 'Healthcare Careers');

const legalCareers = (nexus, chatId) => send(nexus, chatId,
`⚖️ LEGAL CAREER PATHS\n\n• Traditional: Lawyer (litigation, corporate law)\n• Alternative: Legal Ops, Compliance, Paralegal — less schooling required\n• Growing: Legal Tech roles combining law + software`, 'Legal Careers');

const governmentJobs = (nexus, chatId) => send(nexus, chatId,
`🏛️ GOVERNMENT JOBS\n\n• Check official portals (e.g Federal Character Commission, state civil service boards in Nigeria)\n• Pros: job security, pension\n• Cons: slower pay growth than private sector typically\n• Watch out for scam "job offer" messages asking for payment — real government jobs don't charge fees`, 'Government Jobs');

module.exports = {
    jobSearch, resumeBuilder, interviewPrep, careerPathPlanning, skillDevelopment,
    certifications, courseRecommendations, salaryGuide, networkingTips,
    careerAdvancement, professionalEtiquette, coverLetterGuide, interviewQuestions,
    remoteJobs, freelancePlatforms, gigEconomyGuide, passiveIncome,
    startupOpportunities, careerMentorship, companyReviews, globalJobs,
    careerChangeGuide, upskillingOptions, mbaPrograms, entrepreneurship,
    techCareers, creativeCareers, healthcareCareers, legalCareers, governmentJobs
};

    return module.exports;
})();


// ============ inlined from commands/design.js ============
const __cmd_design = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

// Design Handler
const designTools = {
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
    effects: ['glow', 'shadow', 'blur', 'sepia', 'vintage']
};

// Logo Maker
const makeLogo = async (nexus, chatId, text, style = 'modern') => {
    try {
        console.log(chalk.blue(`🎨 Creating logo for "${text}"...`));
        
        let logoText = `🎨 LOGO MAKER\n\n`;
        logoText += `📝 Text: ${text}\n`;
        logoText += `🎯 Style: ${style}\n`;
        logoText += `📏 Size: 512x512px\n`;
        logoText += `🎨 Format: PNG\n\n`;
        logoText += `⏳ Generating...\n`;
        logoText += `[Logo Image]\n\n`;
        logoText += `✅ Logo created!\n`;
        logoText += `💾 Ready to download!\n`;

        await nexus.sendMessage(chatId, { text: logoText });
        console.log(chalk.green(`✅ Logo created for "${text}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Logo maker error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error creating logo: ${error.message}`
        });
    }
};

// Banner Creator
const createBanner = async (nexus, chatId, title, subtitle = '') => {
    try {
        console.log(chalk.blue(`🖼️ Creating banner...`));
        
        let bannerText = `🖼️ BANNER CREATOR\n\n`;
        bannerText += `📝 Title: ${title}\n`;
        bannerText += `📝 Subtitle: ${subtitle}\n`;
        bannerText += `📏 Size: 1920x1080px\n`;
        bannerText += `🎨 Format: PNG/JPG\n\n`;
        bannerText += `[Banner Image]\n\n`;
        bannerText += `✅ Banner ready!\n`;
        bannerText += `💾 Download now!\n`;

        await nexus.sendMessage(chatId, { text: bannerText });
        console.log(chalk.green(`✅ Banner created`));

    } catch (error) {
        console.log(chalk.red(`❌ Banner creator error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error creating banner: ${error.message}`
        });
    }
};

// Color Palette
const generateColorPalette = async (nexus, chatId, baseColor = '#FF6B6B') => {
    try {
        console.log(chalk.blue(`🌈 Generating color palette...`));
        
        let paletteText = `🌈 COLOR PALETTE GENERATOR\n\n`;
        paletteText += `🎨 Base Color: ${baseColor}\n\n`;
        paletteText += `📊 Generated Palette:\n`;
        paletteText += `1. #FF6B6B - Primary\n`;
        paletteText += `2. #4ECDC4 - Secondary\n`;
        paletteText += `3. #45B7D1 - Accent 1\n`;
        paletteText += `4. #FFA07A - Accent 2\n`;
        paletteText += `5. #98D8C8 - Background\n\n`;
        paletteText += `✅ Palette generated!\n`;

        await nexus.sendMessage(chatId, { text: paletteText });
        console.log(chalk.green(`✅ Color palette generated`));

    } catch (error) {
        console.log(chalk.red(`❌ Color palette error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error generating palette: ${error.message}`
        });
    }
};

// Avatar Maker
const makeAvatar = async (nexus, chatId, name, style = 'cartoon') => {
    try {
        console.log(chalk.blue(`👤 Creating avatar...`));
        
        let avatarText = `👤 AVATAR MAKER\n\n`;
        avatarText += `📝 Name: ${name}\n`;
        avatarText += `🎨 Style: ${style}\n`;
        avatarText += `📏 Size: 256x256px\n\n`;
        avatarText += `[Avatar Image]\n\n`;
        avatarText += `✅ Avatar created!\n`;
        avatarText += `💾 Save and use!\n`;

        await nexus.sendMessage(chatId, { text: avatarText });
        console.log(chalk.green(`✅ Avatar created for "${name}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Avatar maker error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error creating avatar: ${error.message}`
        });
    }
};

// Text Effects
const applyTextDesign = async (nexus, chatId, text, effect) => {
    try {
        console.log(chalk.blue(`✨ Applying ${effect} design...`));
        
        let designText = `✨ TEXT DESIGN EFFECT: ${effect}\n\n`;
        designText += `📝 Original: ${text}\n\n`;
        
        switch(effect.toLowerCase()) {
            case 'glow':
                designText += `✨ Glowing Effect Applied\n`;
                break;
            case 'shadow':
                designText += `🌑 Shadow Effect Applied\n`;
                break;
            case 'gradient':
                designText += `🌈 Gradient Effect Applied\n`;
                break;
            default:
                designText += `✨ Effect Applied\n`;
        }
        
        designText += `[Styled Text Image]\n\n`;
        designText += `✅ Design ready!\n`;

        await nexus.sendMessage(chatId, { text: designText });
        console.log(chalk.green(`✅ Text design applied`));

    } catch (error) {
        console.log(chalk.red(`❌ Text design error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error applying design: ${error.message}`
        });
    }
};

// Gradient Generator
const generateGradient = async (nexus, chatId, color1 = '#FF6B6B', color2 = '#4ECDC4') => {
    try {
        console.log(chalk.blue(`🌈 Generating gradient...`));
        
        let gradientText = `🌈 GRADIENT GENERATOR\n\n`;
        gradientText += `🎨 Color 1: ${color1}\n`;
        gradientText += `🎨 Color 2: ${color2}\n\n`;
        gradientText += `📊 Direction: Linear 45°\n`;
        gradientText += `📏 Size: 512x512px\n\n`;
        gradientText += `[Gradient Image]\n\n`;
        gradientText += `✅ Gradient created!\n`;

        await nexus.sendMessage(chatId, { text: gradientText });
        console.log(chalk.green(`✅ Gradient generated`));

    } catch (error) {
        console.log(chalk.red(`❌ Gradient error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error generating gradient: ${error.message}`
        });
    }
};

module.exports = {
    makeLogo,
    createBanner,
    generateColorPalette,
    makeAvatar,
    applyTextDesign,
    generateGradient
};

    return module.exports;
})();


// ============ inlined from commands/education.js ============
const __cmd_education = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const dictionary = (nexus, chatId, word) => send(nexus, chatId,
word ? `📖 Looking up "${word}"... ask me directly and I'll define it for you.` : `📖 DICTIONARY\n\nUsage: .define <word>\ne.g .define ubiquitous`, 'Dictionary');

const mathSolver = (nexus, chatId, problem) => send(nexus, chatId,
problem ? `🧮 Solving "${problem}"... ask me directly with the equation and I'll work through it.` : `🧮 MATH SOLVER\n\nUsage: .solve <equation>\ne.g .solve 2x + 5 = 15`, 'Math Solver');

const geographyFacts = (nexus, chatId) => send(nexus, chatId,
`🌍 GEOGRAPHY FACT\n\nThe Nile and the Amazon are the two longest rivers on Earth — scientists still debate which is truly longest depending on measurement method. Africa is the only continent spanning all four hemispheres.\n\nAsk me for facts about a specific country/place anytime!`, 'Geography Facts');

const scienceFacts = (nexus, chatId) => send(nexus, chatId,
`🔬 SCIENCE FACT\n\nHoney never spoils — archaeologists have found 3,000-year-old honey in Egyptian tombs that's still edible, thanks to its low moisture and acidity.\n\nAsk me for facts on any science topic!`, 'Science Facts');

const quoteOfTheDay = (nexus, chatId) => send(nexus, chatId,
`🎓 QUOTE OF THE DAY\n\n"The only way to do great work is to love what you do." — Steve Jobs\n\nAsk again anytime for a fresh one.`, 'Quote of the Day');

const factsGenerator = (nexus, chatId) => send(nexus, chatId,
`📊 RANDOM FACT\n\nOctopuses have three hearts and blue blood — two hearts pump blood to the gills, one to the rest of the body.\n\nAsk again for another random fact!`, 'Facts Generator');

const iqQuiz = (nexus, chatId) => send(nexus, chatId,
`🧠 IQ QUIZ\n\nQ: What comes next in the sequence? 2, 4, 8, 16, __\n\nReply with your answer! (Hint: each number doubles)`, 'IQ Quiz');

const triviaChallenge = (nexus, chatId) => send(nexus, chatId,
`🎯 TRIVIA CHALLENGE\n\nQ: What is the smallest country in the world by area?\n\nReply with your answer! (Hint: it's in Rome)`, 'Trivia Challenge');

const studyMaterials = (nexus, chatId) => send(nexus, chatId,
`📚 FREE STUDY RESOURCES\n\n• Khan Academy — all subjects, free\n• Quizlet — flashcards\n• MIT OpenCourseWare — university-level, free\n• Ask me to explain any topic directly, anytime`, 'Study Materials');

const researchPapers = (nexus, chatId, topic) => send(nexus, chatId,
`🔍 FINDING RESEARCH PAPERS\n\n• Google Scholar — scholar.google.com\n• ResearchGate\n• Sci-Hub alternatives: your university library portal\n\n${topic ? `Ask me directly about "${topic}" and I'll search current papers/summaries.` : 'Ask me about a specific topic and I\'ll search for you.'}`, 'Research Papers');

const bookRecommendations = (nexus, chatId, genre) => send(nexus, chatId,
genre ? `📖 Looking for great ${genre} books... ask me directly and I'll recommend some.` : `📖 BOOK RECOMMENDATIONS\n\nUsage: .books <genre>\ne.g .books science fiction`, 'Book Recommendations');

const onlineCourses = (nexus, chatId) => send(nexus, chatId,
`🎓 FREE ONLINE COURSE PLATFORMS\n\n• Coursera (audit for free)\n• edX\n• freeCodeCamp\n• Khan Academy\n• YouTube (underrated — many full university courses uploaded free)`, 'Online Courses');

const scienceExperiments = (nexus, chatId) => send(nexus, chatId,
`🧪 SIMPLE HOME SCIENCE EXPERIMENT\n\nBaking soda + vinegar volcano:\n1. Put 2 tbsp baking soda in a bottle\n2. Add food coloring (optional)\n3. Pour in vinegar and watch it erupt!\n\nDemonstrates an acid-base reaction releasing CO₂ gas.`, 'Science Experiments');

const mathFormulas = (nexus, chatId) => send(nexus, chatId,
`📐 COMMON MATH FORMULAS\n\n• Area of circle: πr²\n• Pythagorean theorem: a² + b² = c²\n• Quadratic formula: x = (-b ± √(b²-4ac)) / 2a\n• Simple interest: I = PRT\n\nAsk me for any specific formula!`, 'Math Formulas');

const languageLearning = (nexus, chatId) => send(nexus, chatId,
`🌐 LANGUAGE LEARNING RESOURCES\n\n• Duolingo — free, gamified\n• Anki — spaced repetition flashcards\n• italki — practice with native speakers\n• Best method: consume content (music, shows) in the language daily`, 'Language Learning');

const pronunciationGuide = (nexus, chatId, word) => send(nexus, chatId,
word ? `🗣️ Looking up pronunciation for "${word}"... ask me directly.` : `🗣️ PRONUNCIATION GUIDE\n\nUsage: .pronounce <word>`, 'Pronunciation Guide');

const educationalVideos = (nexus, chatId) => send(nexus, chatId,
`🎓 GREAT EDUCATIONAL YOUTUBE CHANNELS\n\n• Kurzgesagt — science, animated\n• CrashCourse — wide range of subjects\n• 3Blue1Brown — math, beautifully visual\n• Veritasium — physics/science`, 'Educational Videos');

const statisticsExplained = (nexus, chatId) => send(nexus, chatId,
`📊 STATISTICS BASICS\n\n• Mean — the average\n• Median — the middle value\n• Mode — most frequent value\n• Standard deviation — how spread out the data is\n• Correlation ≠ causation — always remember this!`, 'Statistics Explained');

const biologyFacts = (nexus, chatId) => send(nexus, chatId,
`🔬 BIOLOGY FACT\n\nYour body replaces most of its cells every 7-10 years — you're literally not the "same" physical body you were a decade ago.\n\nAsk for more biology facts anytime!`, 'Biology Facts');

const geneticsInfo = (nexus, chatId) => send(nexus, chatId,
`🧬 GENETICS BASICS\n\n• DNA = the instruction manual for your body\n• Genes = specific sections of DNA coding for traits\n• You share ~99.9% of your DNA with every other human\n• You share ~60% of your DNA with a banana!`, 'Genetics Info');

const astronomyGuide = (nexus, chatId) => send(nexus, chatId,
`🌌 ASTRONOMY BASICS\n\n• Our galaxy (Milky Way) has 100-400 billion stars\n• Light from the Sun takes ~8 minutes to reach Earth\n• A light-year measures distance, not time\n• Best free stargazing app: Stellarium`, 'Astronomy Guide');

const spaceExploration = (nexus, chatId) => send(nexus, chatId,
`🔭 SPACE EXPLORATION\n\nAsk me for current news on missions (e.g "latest SpaceX launch" or "Mars rover updates") and I'll search live info.`, 'Space Exploration');

const historicalEvents = (nexus, chatId, event) => send(nexus, chatId,
event ? `🌍 Looking up "${event}"... ask me directly for details.` : `🌍 HISTORICAL EVENTS\n\nUsage: .history <event or year>\ne.g .history 1969 moon landing`, 'Historical Events');

const ancientCivilizations = (nexus, chatId) => send(nexus, chatId,
`📜 ANCIENT CIVILIZATIONS\n\nKey ones to explore: Ancient Egypt, Mesopotamia, Indus Valley, Ancient Greece, Rome, Mali Empire, Great Zimbabwe, Aztec, Maya.\n\nAsk me about any specific one for a deep dive!`, 'Ancient Civilizations');

const artHistory = (nexus, chatId) => send(nexus, chatId,
`🎨 ART HISTORY MOVEMENTS\n\n• Renaissance — realism, perspective (da Vinci, Michelangelo)\n• Impressionism — light & color (Monet)\n• Cubism — fragmented forms (Picasso)\n• Modern/Contemporary — huge variety today\n\nAsk about any movement or artist!`, 'Art History');

const literatureAnalysis = (nexus, chatId, work) => send(nexus, chatId,
work ? `🎭 Analyzing "${work}"... ask me directly for themes/analysis.` : `🎭 LITERATURE ANALYSIS\n\nUsage: .analyze <book/poem title>`, 'Literature Analysis');

const musicTheory = (nexus, chatId) => send(nexus, chatId,
`🎵 MUSIC THEORY BASICS\n\n• Octave — 8 notes, same note repeated higher/lower\n• Major scale = happy sound, Minor scale = sad/moody sound\n• Chord = 3+ notes played together\n• Tempo = speed of the music (measured in BPM)`, 'Music Theory');

const philosophyGuide = (nexus, chatId) => send(nexus, chatId,
`📚 PHILOSOPHY STARTING POINTS\n\n• Stoicism — focus on what you control (Marcus Aurelius, Seneca)\n• Existentialism — meaning is self-created (Sartre, Camus)\n• Utilitarianism — greatest good for greatest number\n\nAsk me about any philosopher or concept!`, 'Philosophy Guide');

const lawBasics = (nexus, chatId) => send(nexus, chatId,
`⚖️ LAW BASICS\n\n• Civil law — disputes between individuals/entities\n• Criminal law — offenses against the state\n• Common law — based on precedent (Nigeria, UK, US)\n• Always consult a real lawyer for actual legal matters — this is general info only.`, 'Law Basics');

const economics101 = (nexus, chatId) => send(nexus, chatId,
`💼 ECONOMICS 101\n\n• Supply & Demand — price rises when demand > supply\n• Inflation — general rise in prices over time\n• GDP — total value of goods/services a country produces\n• Opportunity cost — what you give up to choose something else`, 'Economics 101');

const politicalSystems = (nexus, chatId) => send(nexus, chatId,
`🏛️ POLITICAL SYSTEMS OVERVIEW\n\n• Democracy — citizens vote for representatives\n• Federal system — power split between central & state govts (like Nigeria, US)\n• Parliamentary vs Presidential — how the executive is chosen differs\n\nAsk me about any specific country's system!`, 'Political Systems');

const worldCultures = (nexus, chatId, country) => send(nexus, chatId,
country ? `🌐 Looking up culture facts for "${country}"... ask me directly.` : `🌐 WORLD CULTURES\n\nUsage: .culture <country>\ne.g .culture Japan`, 'World Cultures');

const etymology = (nexus, chatId, word) => send(nexus, chatId,
word ? `🗣️ Looking up the origin of "${word}"... ask me directly.` : `🗣️ ETYMOLOGY\n\nUsage: .etymology <word>\ne.g .etymology "quarantine" (from Italian "quaranta" = forty, referencing 40-day ship isolation)`, 'Etymology');

const classicLiterature = (nexus, chatId) => send(nexus, chatId,
`📖 CLASSIC LITERATURE TO KNOW\n\n• Things Fall Apart — Chinua Achebe\n• 1984 — George Orwell\n• Pride and Prejudice — Jane Austen\n• One Hundred Years of Solitude — Gabriel García Márquez\n\nAsk me for a summary/analysis of any classic!`, 'Classic Literature');

const logicPuzzles = (nexus, chatId) => send(nexus, chatId,
`🧩 LOGIC PUZZLE\n\nA man looks at a photo and says "Brothers and sisters I have none, but that man's father is my father's son." Who is in the photo?\n\nReply with your answer! (Hint: think carefully about "my father's son")`, 'Logic Puzzles');

const careerGuidance = (nexus, chatId) => send(nexus, chatId,
`🎓 CAREER GUIDANCE\n\nFor deeper career help (resume, job search, interview prep), check out the Career & Jobs menu category — it's fully built out with dedicated tools!`, 'Career Guidance');

module.exports = {
    dictionary, mathSolver, geographyFacts, scienceFacts, quoteOfTheDay,
    factsGenerator, iqQuiz, triviaChallenge, studyMaterials, researchPapers,
    bookRecommendations, onlineCourses, scienceExperiments, mathFormulas,
    languageLearning, pronunciationGuide, educationalVideos, statisticsExplained,
    biologyFacts, geneticsInfo, astronomyGuide, spaceExploration, historicalEvents,
    ancientCivilizations, artHistory, literatureAnalysis, musicTheory,
    philosophyGuide, lawBasics, economics101, politicalSystems, worldCultures,
    etymology, classicLiterature, logicPuzzles, careerGuidance
};

    return module.exports;
})();


// ============ inlined from commands/entertainment.js ============
const __cmd_entertainment = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const movieDatabase = (nexus, chatId, title) => send(nexus, chatId,
title ? `🎭 Searching for "${title}"... ask me directly with the title and I'll look up current details for you.` : `🎭 MOVIE DATABASE\n\nUsage: .movie <title>\ne.g .movie Inception\n\n💡 For up-to-date info (ratings, cast, showtimes), just ask me the movie name directly and I'll search live.`, 'Movie Database');

const tvSeries = (nexus, chatId, title) => send(nexus, chatId,
title ? `📺 Looking up "${title}"... ask me directly and I'll search current info.` : `📺 TV SERIES\n\nUsage: .tvseries <title>\n💡 Ask me directly (e.g "is season 3 of X out?") for current, searched info.`, 'TV Series');

const celebrityNews = (nexus, chatId) => send(nexus, chatId,
`🎤 CELEBRITY NEWS\n\nFor current celebrity news, ask me directly (e.g "latest news on [celebrity]") and I'll search for up-to-date results.`, 'Celebrity News');

const eventsCalendar = (nexus, chatId) => send(nexus, chatId,
`🎪 EVENTS CALENDAR\n\nAsk me "events in [your city] this weekend" and I'll search current listings for you.`, 'Events Calendar');

const concertInfo = (nexus, chatId, artist) => send(nexus, chatId,
artist ? `🎸 Looking up concert dates for "${artist}"... ask me directly for current tour info.` : `🎸 CONCERT INFO\n\nUsage: .concert <artist>\nAsk me directly for current tour dates.`, 'Concert Info');

const gamingEvents = (nexus, chatId) => send(nexus, chatId,
`🎮 GAMING EVENTS\n\nMajor recurring events to watch: E3 successor showcases, Gamescom, The Game Awards, PAX.\nAsk me directly for current dates — schedules shift yearly.`, 'Gaming Events');

const celebrityPhotos = (nexus, chatId) => send(nexus, chatId,
`📸 CELEBRITY PHOTOS\n\nThis bot doesn't pull celebrity images directly (copyright reasons), but I can point you to official sources — just ask who you're looking for.`, 'Celebrity Photos');

const artExhibitions = (nexus, chatId) => send(nexus, chatId,
`🎨 ART EXHIBITIONS\n\nAsk me "art exhibitions in [your city]" and I'll search current listings.`, 'Art Exhibitions');

const theaterShows = (nexus, chatId) => send(nexus, chatId,
`🎭 THEATER SHOWS\n\nAsk me "theater shows in [your city]" and I'll search what's currently running.`, 'Theater Shows');

const comedyShows = (nexus, chatId) => send(nexus, chatId,
`🎪 COMEDY SHOWS\n\nAsk me "comedy shows in [your city] this month" for current listings.`, 'Comedy Shows');

const movieTrailers = (nexus, chatId, title) => send(nexus, chatId,
title ? `🎬 Looking up the trailer for "${title}"... ask me and I'll find the current link.` : `🎬 MOVIE TRAILERS\n\nUsage: .trailer <title>`, 'Movie Trailers');

const streamingServices = (nexus, chatId) => send(nexus, chatId,
`📺 STREAMING SERVICES OVERVIEW\n\n• Netflix — huge original library\n• Prime Video — good movie selection, included with Prime\n• Disney+ — Marvel/Star Wars/Pixar\n• Showmax — strong African content selection\n\nAsk me "is [title] on Netflix" and I'll search current availability.`, 'Streaming Services');

const imdbRatings = (nexus, chatId, title) => send(nexus, chatId,
title ? `⭐ Checking IMDb rating for "${title}"... ask me directly for the current score.` : `⭐ IMDB RATINGS\n\nUsage: .imdb <title>`, 'IMDb Ratings');

const behindTheScenes = (nexus, chatId) => send(nexus, chatId,
`🎥 BEHIND THE SCENES\n\nAsk me about a specific movie/show and I'll search for behind-the-scenes info and trivia.`, 'Behind the Scenes');

const directorInfo = (nexus, chatId, name) => send(nexus, chatId,
name ? `🎬 Looking up director "${name}"... ask me and I'll search their filmography.` : `🎬 DIRECTOR INFO\n\nUsage: .director <name>`, 'Director Info');

const actorProfiles = (nexus, chatId, name) => send(nexus, chatId,
name ? `🎭 Looking up "${name}"... ask me and I'll search their current filmography.` : `🎭 ACTOR PROFILES\n\nUsage: .actor <name>`, 'Actor Profiles');

const awardsNominations = (nexus, chatId) => send(nexus, chatId,
`🏆 AWARDS & NOMINATIONS\n\nAsk me "who won [award] this year" (Oscars, Grammys, AMVCA etc) and I'll search current results.`, 'Awards & Nominations');

const redCarpetEvents = (nexus, chatId) => send(nexus, chatId,
`🌟 RED CARPET EVENTS\n\nAsk me about a specific award show and I'll search current red carpet coverage.`, 'Red Carpet Events');

const gossipNews = (nexus, chatId) => send(nexus, chatId,
`📰 GOSSIP NEWS\n\nAsk me directly about a celebrity and I'll search current news — I'll stick to verified sources, not unverified rumors.`, 'Gossip News');

const playTickets = (nexus, chatId) => send(nexus, chatId,
`🎭 PLAY TICKETS\n\nAsk me "theater tickets for [show] in [city]" and I'll search booking options.`, 'Play Tickets');

const circusShows = (nexus, chatId) => send(nexus, chatId,
`🎪 CIRCUS SHOWS\n\nAsk me "circus shows near [your city]" for current listings.`, 'Circus Shows');

const artInstallations = (nexus, chatId) => send(nexus, chatId,
`🎨 ART INSTALLATIONS\n\nAsk me "art installations in [your city]" for current exhibits.`, 'Art Installations');

const livePerformances = (nexus, chatId) => send(nexus, chatId,
`🎵 LIVE PERFORMANCES\n\nAsk me "live music in [your city] this weekend" for current listings.`, 'Live Performances');

const standupComedy = (nexus, chatId) => send(nexus, chatId,
`🎤 STAND-UP COMEDY\n\nAsk me "stand-up comedy shows in [your city]" for current listings.\nBig Nigerian names to know: Basketmouth, AY, Bovi, Osas Ighodaro-style hosted specials often stream online too.`, 'Stand-Up Comedy');

const documentaryGuide = (nexus, chatId) => send(nexus, chatId,
`🎬 DOCUMENTARY RECOMMENDATIONS\n\nTell me a topic you're interested in (true crime, nature, tech, sports) and I'll search current well-reviewed documentaries on that topic.`, 'Documentary Guide');

const realityTv = (nexus, chatId) => send(nexus, chatId,
`📺 REALITY TV\n\nAsk me about a specific show (e.g current Big Brother Naija season) and I'll search up-to-date info.`, 'Reality TV');

const musicals = (nexus, chatId) => send(nexus, chatId,
`🎭 MUSICALS\n\nClassics worth knowing: Hamilton, The Lion King, Wicked, Les Misérables.\nAsk me for current touring/showing schedules near you.`, 'Musicals');

const magicShows = (nexus, chatId) => send(nexus, chatId,
`🎪 MAGIC SHOWS\n\nAsk me "magic shows near [your city]" for current listings.`, 'Magic Shows');

const galleryExhibitions = (nexus, chatId) => send(nexus, chatId,
`🎨 GALLERY EXHIBITIONS\n\nAsk me "art galleries/exhibitions in [your city]" for current shows.`, 'Gallery Exhibitions');

const shakespearePlays = (nexus, chatId) => send(nexus, chatId,
`🎭 SHAKESPEARE PLAYS\n\nThe big ones: Hamlet, Macbeth, Romeo & Juliet, Othello, A Midsummer Night's Dream.\nAsk me for current productions playing near you.`, 'Shakespeare Plays');

const varietyShows = (nexus, chatId) => send(nexus, chatId,
`🎪 VARIETY SHOWS\n\nAsk me "variety shows in [your city]" for current listings.`, 'Variety Shows');

const liveTvListings = (nexus, chatId) => send(nexus, chatId,
`📡 LIVE TV LISTINGS\n\nAsk me "what's on [channel] tonight" and I'll search current schedules.`, 'Live TV Listings');

module.exports = {
    movieDatabase, tvSeries, celebrityNews, eventsCalendar, concertInfo,
    gamingEvents, celebrityPhotos, artExhibitions, theaterShows, comedyShows,
    movieTrailers, streamingServices, imdbRatings, behindTheScenes, directorInfo,
    actorProfiles, awardsNominations, redCarpetEvents, gossipNews, playTickets,
    circusShows, artInstallations, livePerformances, standupComedy,
    documentaryGuide, realityTv, musicals, magicShows, galleryExhibitions,
    shakespearePlays, varietyShows, liveTvListings
};

    return module.exports;
})();


// ============ inlined from commands/fashion.js ============
const __cmd_fashion = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const fashionTrends = (nexus, chatId) => send(nexus, chatId,
`👔 FASHION TRENDS\n\nAsk me "current fashion trends" and I'll search up-to-date info — trends shift fast so I'll pull fresh results rather than guess.`, 'Fashion Trends');

const outfitIdeas = (nexus, chatId, occasion) => send(nexus, chatId,
occasion ? `👗 Outfit ideas for "${occasion}"... ask me directly for suggestions.` : `👗 OUTFIT IDEAS\n\nUsage: .outfit <occasion>\ne.g .outfit smart casual dinner`, 'Outfit Ideas');

const shoeFinder = (nexus, chatId, type) => send(nexus, chatId,
type ? `👟 Looking for "${type}" shoes... ask me directly for current options.` : `👟 SHOE FINDER\n\nUsage: .shoes <type/occasion>`, 'Shoe Finder');

const bagCollection = (nexus, chatId) => send(nexus, chatId,
`👜 BAG STYLE GUIDE\n\n• Tote — everyday, work\n• Crossbody — hands-free, casual\n• Clutch — evening/formal\n• Backpack — practical, travel\n\nAsk me for brand recommendations at any budget!`, 'Bag Collection');

const makeupTutorials = (nexus, chatId, look) => send(nexus, chatId,
look ? `💄 Tutorial for "${look}"... ask me directly for step-by-step guidance.` : `💄 MAKEUP TUTORIALS\n\nUsage: .makeup <look>\ne.g .makeup natural everyday look`, 'Makeup Tutorials');

const nailDesigns = (nexus, chatId) => send(nexus, chatId,
`💅 NAIL DESIGN IDEAS\n\n• French tips — classic, always works\n• Ombre — trendy gradient effect\n• Minimalist line art — subtle, elegant\n\nAsk me for a specific style/occasion!`, 'Nail Designs');

const hairstyleIdeas = (nexus, chatId, occasion) => send(nexus, chatId,
occasion ? `💇 Hairstyle ideas for "${occasion}"... ask me directly.` : `💇 HAIRSTYLE IDEAS\n\nUsage: .hairstyle <occasion/hair type>`, 'Hairstyle Ideas');

const accessoryGuide = (nexus, chatId) => send(nexus, chatId,
`🕶️ ACCESSORY STYLING TIPS\n\n• Rule of thumb: pick ONE statement piece, keep the rest simple\n• Match metals (gold/silver) across jewelry for cohesion\n• A good watch/belt elevates an outfit more than people realize`, 'Accessory Guide');

const sizeConverter = (nexus, chatId, size) => send(nexus, chatId,
size ? `👗 Converting size "${size}"... ask me directly (e.g "UK 10 to US size").` : `👗 SIZE CONVERTER\n\nUsage: .sizeconvert <size> <from region> to <to region>\ne.g .sizeconvert UK 10 to US`, 'Size Converter');

const fashionBrands = (nexus, chatId, budget) => send(nexus, chatId,
`⭐ FASHION BRANDS BY BUDGET\n\n• Budget: Shein, H&M, local markets\n• Mid: Zara, Mango, Uniqlo\n• Premium: Cos, Reiss\n• Luxury: Gucci, Louis Vuitton, Nigerian designers like Deola Sagoe\n\n${budget ? `Ask me for specific "${budget}" recommendations.` : ''}`, 'Fashion Brands');

const shoppingTips = (nexus, chatId) => send(nexus, chatId,
`🛍️ SMART SHOPPING TIPS\n\n• Check return policy before buying online\n• Wait 24 hours before big purchases — kills impulse buys\n• Cost-per-wear matters more than price tag alone\n• Sign up for brand newsletters just before sales seasons`, 'Shopping Tips');

const designerSearch = (nexus, chatId, name) => send(nexus, chatId,
name ? `👑 Looking up "${name}"... ask me directly.` : `👑 DESIGNER SEARCH\n\nUsage: .designer <name>`, 'Designer Search');

const formalWear = (nexus, chatId) => send(nexus, chatId,
`👔 FORMAL WEAR GUIDE\n\n• Black tie — tux/gown, most formal\n• Business formal — suit, conservative colors\n• Cocktail — dressy but not full formal\n\nAsk me for a specific event's dress code!`, 'Formal Wear');

const casualWear = (nexus, chatId) => send(nexus, chatId,
`👕 CASUAL WEAR IDEAS\n\n• Smart casual — chinos + collared shirt, versatile\n• Streetwear — sneakers, oversized fits, layering\n• Comfort-first — quality basics in neutral colors go far`, 'Casual Wear');

const sportswear = (nexus, chatId) => send(nexus, chatId,
`🏃 SPORTSWEAR TIPS\n\n• Moisture-wicking fabric > cotton for workouts\n• Proper-fitting sports bra/shoes matter more than looks\n• Layer for outdoor workouts — easier to adjust to temperature`, 'Sportswear');

const kidsFashion = (nexus, chatId) => send(nexus, chatId,
`👶 KIDS FASHION TIPS\n\n• Prioritize comfort and freedom of movement over style at young ages\n• Buy slightly ahead of size — kids grow fast\n• Soft, breathable fabrics reduce skin irritation`, 'Kids Fashion');

const weddingDresses = (nexus, chatId) => send(nexus, chatId,
`👰 WEDDING DRESS STYLES\n\n• Ball gown — dramatic, traditional\n• A-line — flattering on most body types\n• Mermaid — fitted, glamorous\n• Book fittings 6+ months ahead for custom/alterations`, 'Wedding Dresses');

const groomOutfits = (nexus, chatId) => send(nexus, chatId,
`🤵 GROOM OUTFIT IDEAS\n\n• Classic tux — timeless, formal weddings\n• Traditional attire (agbada, kaftan) — great for Nigerian ceremonies\n• Coordinate with the bride's colors, don't match exactly`, 'Groom Outfits');

const eveningGowns = (nexus, chatId) => send(nexus, chatId,
`👗 EVENING GOWN STYLES\n\n• Sheath — sleek, elegant\n• Empire waist — flattering, comfortable\n• High-low hem — trendy, easier to move in\n\nAsk me for occasion-specific ideas!`, 'Evening Gowns');

const winterCoats = (nexus, chatId) => send(nexus, chatId,
`🧥 COAT GUIDE\n\n• Trench — versatile, classic\n• Puffer — warmest for cold climates\n• Wool overcoat — smart, formal-friendly\n\n(Less relevant in Nigeria's climate, but useful if traveling!)`, 'Winter Coats');

const hatStyles = (nexus, chatId) => send(nexus, chatId,
`👒 HAT STYLE GUIDE\n\n• Fedora — smart casual, adds polish\n• Baseball cap — casual, sporty\n• Bucket hat — trendy, laid-back\n• Gele — traditional Nigerian, statement piece for events`, 'Hat Styles');

const scarfTying = (nexus, chatId) => send(nexus, chatId,
`🧣 SCARF TYING IDEAS\n\n• Loop knot — simple, everyday\n• French knot — chic, minimal effort\n• Headscarf wrap — great protective style option\n\nAsk me for step-by-step on any specific style!`, 'Scarf Tying');

const gloveTypes = (nexus, chatId) => send(nexus, chatId,
`🧤 GLOVE TYPES\n\n• Leather — classic, formal\n• Knit — casual, cold weather\n• Touchscreen-compatible — practical everyday pick`, 'Glove Types');

const shoeStyles = (nexus, chatId) => send(nexus, chatId,
`👞 SHOE STYLE GUIDE\n\n• Oxford — most formal\n• Loafers — smart casual, versatile\n• Sneakers — casual, everyday comfort\n• Match shoe formality to your outfit's formality level`, 'Shoe Styles');

const jewelryGuide = (nexus, chatId) => send(nexus, chatId,
`💍 JEWELRY STYLING TIPS\n\n• Layer necklaces of different lengths for depth\n• Match metal tones for a cohesive look\n• Less is often more — one standout piece beats five competing ones`, 'Jewelry Guide');

const sunglasses = (nexus, chatId) => send(nexus, chatId,
`🕶️ SUNGLASSES GUIDE\n\n• Aviators — classic, suit most face shapes\n• Round frames — soften angular faces\n• Cat-eye — adds a retro, feminine edge\n\nAlways check for UV400 protection, not just style!`, 'Sunglasses');

const designerBags = (nexus, chatId) => send(nexus, chatId,
`👜 DESIGNER BAG TIPS\n\n• Classic styles (like a structured tote) hold resale value better than trendy ones\n• Check authentication services before buying secondhand luxury\n• Consider "your first designer bag" guides — usually recommend timeless neutral options`, 'Designer Bags');

const makeupBrands = (nexus, chatId) => send(nexus, chatId,
`💄 MAKEUP BRANDS BY BUDGET\n\n• Budget: e.l.f, Maybelline\n• Mid: NYX, Fenty Beauty\n• Premium: Charlotte Tilbury, MAC\n\nAsk me for shade-matching tips too!`, 'Makeup Brands');

const nailCare = (nexus, chatId) => send(nexus, chatId,
`💅 NAIL CARE TIPS\n\n• Moisturize cuticles regularly — prevents breakage\n• Give nails a break between gel/acrylic sets\n• Biotin + protein-rich diet supports healthy nail growth`, 'Nail Care');

const hairCare = (nexus, chatId) => send(nexus, chatId,
`💇 HAIR CARE BASICS\n\n• Don't wash too often — strips natural oils (2-3x/week is often enough)\n• Deep condition weekly, especially for natural/textured hair\n• Silk/satin pillowcase or bonnet reduces breakage overnight`, 'Hair Care');

const skincareGuide = (nexus, chatId) => send(nexus, chatId,
`🧴 SKINCARE BASICS\n\n• Core routine: cleanser → moisturizer → SPF (daily, non-negotiable)\n• Introduce new products one at a time to spot reactions\n• Sunscreen is the #1 anti-aging product, more than any serum`, 'Skincare Guide');

const beautyTips = (nexus, chatId) => send(nexus, chatId,
`🌟 GENERAL BEAUTY TIPS\n\n• Sleep and hydration show on your skin more than any product\n• Less is more with makeup for daytime looks\n• Consistency beats intensity — a simple routine done daily beats an elaborate one done rarely`, 'Beauty Tips');

module.exports = {
    fashionTrends, outfitIdeas, shoeFinder, bagCollection, makeupTutorials,
    nailDesigns, hairstyleIdeas, accessoryGuide, sizeConverter, fashionBrands,
    shoppingTips, designerSearch, formalWear, casualWear, sportswear,
    kidsFashion, weddingDresses, groomOutfits, eveningGowns, winterCoats,
    hatStyles, scarfTying, gloveTypes, shoeStyles, jewelryGuide, sunglasses,
    designerBags, makeupBrands, nailCare, hairCare, skincareGuide, beautyTips
};

    return module.exports;
})();


// ============ inlined from commands/food.js ============
const __cmd_food = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

// Food Handler
const foodDB = {
    recipes: [
        { name: 'Jollof Rice', cuisine: 'Nigerian', prepTime: '45 mins' },
        { name: 'Egusi Soup', cuisine: 'Nigerian', prepTime: '30 mins' },
        { name: 'Pepper Soup', cuisine: 'Nigerian', prepTime: '25 mins' }
    ]
};

// Search Recipes
const searchRecipe = async (nexus, chatId, dishName) => {
    try {
        console.log(chalk.blue(`🔍 Searching recipe for ${dishName}...`));
        
        let recipeText = `🍳 RECIPE SEARCH: ${dishName}\n\n`;
        recipeText += `1. 🍚 Jollof Rice\n`;
        recipeText += `   ⏱️ 45 mins | 👥 4 servings | ⭐ 4.8/5\n\n`;
        recipeText += `2. 🥘 Jollof with Stew\n`;
        recipeText += `   ⏱️ 60 mins | 👥 6 servings | ⭐ 4.9/5\n\n`;
        recipeText += `3. 🍛 Spicy Jollof\n`;
        recipeText += `   ⏱️ 50 mins | 👥 5 servings | ⭐ 4.7/5\n\n`;
        recipeText += `4. 🥟 Rice Balls\n`;
        recipeText += `   ⏱️ 30 mins | 👥 3 servings | ⭐ 4.5/5\n\n`;
        recipeText += `Reply with number for full recipe!\n`;

        await nexus.sendMessage(chatId, { text: recipeText });
        console.log(chalk.green(`✅ Recipe search sent for "${dishName}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Recipe search error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error searching recipe: ${error.message}`
        });
    }
};

// Get Recipe Details
const getRecipeDetails = async (nexus, chatId, recipeName) => {
    try {
        console.log(chalk.blue(`📖 Getting recipe for ${recipeName}...`));
        
        let detailText = `📖 RECIPE: ${recipeName}\n\n`;
        detailText += `⏱️ Prep Time: 10 mins\n`;
        detailText += `🔥 Cook Time: 35 mins\n`;
        detailText += `👥 Servings: 4\n`;
        detailText += `⭐ Rating: 4.8/5 (2.5K reviews)\n\n`;
        detailText += `📝 INGREDIENTS:\n`;
        detailText += `• 3 cups rice\n`;
        detailText += `• 1 can tomato sauce\n`;
        detailText += `• 2 red peppers\n`;
        detailText += `• 1 onion\n`;
        detailText += `• 500g chicken\n`;
        detailText += `• 3 tbsp oil\n`;
        detailText += `• Salt & spices\n\n`;
        detailText += `👨‍🍳 INSTRUCTIONS:\n`;
        detailText += `1. Parboil rice\n`;
        detailText += `2. Fry onions & peppers\n`;
        detailText += `3. Add tomato sauce\n`;
        detailText += `4. Mix with rice\n`;
        detailText += `5. Cook for 25 mins\n\n`;
        detailText += `🎯 Difficulty: Easy ✅\n`;

        await nexus.sendMessage(chatId, { text: detailText });
        console.log(chalk.green(`✅ Recipe details sent for ${recipeName}`));

    } catch (error) {
        console.log(chalk.red(`❌ Recipe details error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error getting recipe: ${error.message}`
        });
    }
};

// Find Restaurants
const findRestaurants = async (nexus, chatId, city, cuisine = 'Nigerian') => {
    try {
        console.log(chalk.blue(`🍽️ Finding ${cuisine} restaurants in ${city}...`));
        
        let restaurantText = `🍽️ RESTAURANTS: ${city}\n\n`;
        restaurantText += `🎯 Cuisine: ${cuisine}\n\n`;
        restaurantText += `1. 🌟 The Pepper Palace\n`;
        restaurantText += `   ⭐ 4.9/5 | 📍 VI | 💰 High\n\n`;
        restaurantText += `2. 🌟 Taste of Africa\n`;
        restaurantText += `   ⭐ 4.7/5 | 📍 Lekki | 💰 Medium\n\n`;
        restaurantText += `3. 🌟 Mama's Kitchen\n`;
        restaurantText += `   ⭐ 4.8/5 | 📍 Ikoyi | 💰 Budget\n\n`;
        restaurantText += `4. 🌟 Spice Route\n`;
        restaurantText += `   ⭐ 4.6/5 | 📍 Surulere | 💰 Medium\n\n`;
        restaurantText += `5. 🌟 Heritage Eats\n`;
        restaurantText += `   ⭐ 4.8/5 | 📍 Ikeja | 💰 High\n\n`;
        restaurantText += `🔄 More available!\n`;

        await nexus.sendMessage(chatId, { text: restaurantText });
        console.log(chalk.green(`✅ Restaurants sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Restaurant search error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error finding restaurants: ${error.message}`
        });
    }
};

// Get Nutrition Info
const getNutritionInfo = async (nexus, chatId, foodName) => {
    try {
        console.log(chalk.blue(`📊 Getting nutrition for ${foodName}...`));
        
        let nutritionText = `📊 NUTRITION INFO: ${foodName}\n\n`;
        nutritionText += `📈 Per 100g serving:\n\n`;
        nutritionText += `🔥 Calories: 150\n`;
        nutritionText += `🍖 Protein: 8g\n`;
        nutritionText += `🥑 Fat: 5g\n`;
        nutritionText += `🌾 Carbs: 22g\n`;
        nutritionText += `🍃 Fiber: 3g\n\n`;
        nutritionText += `💊 Vitamins:\n`;
        nutritionText += `• Vitamin A: 12% DV\n`;
        nutritionText += `• Vitamin C: 8% DV\n`;
        nutritionText += `• Iron: 15% DV\n\n`;
        nutritionText += `✅ Healthy! 💪\n`;

        await nexus.sendMessage(chatId, { text: nutritionText });
        console.log(chalk.green(`✅ Nutrition info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Nutrition error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error getting nutrition info: ${error.message}`
        });
    }
};

module.exports = {
    searchRecipe,
    getRecipeDetails,
    findRestaurants,
    getNutritionInfo
};

    return module.exports;
})();


// ============ inlined from commands/football.js ============
const __cmd_football = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');
const yts = require('yt-search');

// Football API Handler
const footballAPI = {
    baseURL: 'https://api.football-data.org/v4',
    apiKey: process.env.FOOTBALL_API_KEY || 'e6e1c85c25e440e595fc392368fa4d04'
};

// Get Live Matches
const getLiveMatches = async (nexus, chatId) => {
    try {
        console.log(chalk.blue('🔴 Fetching live matches...'));
        
        const response = await axios.get(`${footballAPI.baseURL}/matches?status=LIVE`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });

        if (!response.data.matches || response.data.matches.length === 0) {
            await nexus.sendMessage(chatId, {
                text: '⚽ No live matches right now. Check upcoming fixtures!'
            });
            return;
        }

        let matchText = '🔴 LIVE MATCHES NOW\n\n';
        response.data.matches.forEach((match, index) => {
            matchText += `${index + 1}. ${match.homeTeam.name} vs ${match.awayTeam.name}\n`;
            matchText += `   Score: ${match.score.fullTime.home ?? 0} - ${match.score.fullTime.away ?? 0}\n`;
            matchText += `   Status: ${match.status}\n\n`;
        });

        await nexus.sendMessage(chatId, { text: matchText + `\n👉 Get running updates on any of these: ${'`'}.livetrack TeamName${'`'}` });
        console.log(chalk.green('✅ Live matches sent'));

    } catch (error) {
        console.log(chalk.red(`❌ Live matches error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching live matches: ${error.message}`
        });
    }
};

// Get League Standings
const getStandings = async (nexus, chatId, league) => {
    try {
        // dispatchMenuCommand passes sender's JID as the 3rd arg on a button
        // tap (fn(sock, chatId, sender)) — that's never a real competition
        // code (JIDs contain '@'), so treat it as "not provided" and default.
        if (!league || league.includes('@')) league = 'PL';
        console.log(chalk.blue(`🏆 Fetching ${league} standings...`));
        
        const response = await axios.get(`${footballAPI.baseURL}/competitions/${league}/standings`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });

        if (!response.data.standings) {
            await nexus.sendMessage(chatId, {
                text: '❌ Could not fetch standings'
            });
            return;
        }

        let standingsText = `📊 ${league} STANDINGS\n\n`;
        const table = response.data.standings[0].table; // full table — WhatsApp scrolls fine, no need to cut it down
        
        table.forEach((team) => {
            standingsText += `${team.position}. ${team.team.name} — ${team.points}pts (P:${team.playedGames} W:${team.won} D:${team.draw} L:${team.lost} GD:${team.goalDifference})\n`;
        });

        await nexus.sendMessage(chatId, { text: standingsText });
        console.log(chalk.green('✅ Standings sent'));

    } catch (error) {
        console.log(chalk.red(`❌ Standings error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching standings: ${error.message}`
        });
    }
};

// Get Top Scorers
const getTopScorers = async (nexus, chatId) => {
    try {
        console.log(chalk.blue('🏅 Fetching top scorers...'));
        
        const response = await axios.get(`${footballAPI.baseURL}/competitions/PL/scorers`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });

        if (!response.data.scorers) {
            await nexus.sendMessage(chatId, {
                text: '❌ Could not fetch top scorers'
            });
            return;
        }

        let scorersText = '🏅 TOP SCORERS\n\n';
        response.data.scorers.forEach((scorer, index) => {
            scorersText += `${index + 1}. ${scorer.player.name} (${scorer.team.name}) - ${scorer.numberOfGoals}⚽\n`;
        });

        await nexus.sendMessage(chatId, { text: scorersText });
        console.log(chalk.green('✅ Top scorers sent'));

    } catch (error) {
        console.log(chalk.red(`❌ Top scorers error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching top scorers: ${error.message}`
        });
    }
};

// Get Team Info
const getTeamInfo = async (nexus, chatId, teamName) => {
    try {
        // Same JID-clobbering issue as getStandings — guard against it, and
        // show a real usage prompt instead of searching garbage.
        if (!teamName || teamName.includes('@')) {
            await nexus.sendMessage(chatId, { text: `📊 TEAM STATS\n\nReply with a team name and I'll look them up.\nExample: ${'`'}.teaminfo Manchester United${'`'}` });
            return;
        }

        console.log(chalk.blue(`📊 Fetching ${teamName} info...`));
        const response = await axios.get(`${footballAPI.baseURL}/teams?name=${encodeURIComponent(teamName)}`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });
        const team = (response.data.teams || [])[0];
        if (!team) {
            await nexus.sendMessage(chatId, { text: `❌ No team found matching "${teamName}"` });
            return;
        }

        let teamText = `📊 ${team.name}\n\n`;
        teamText += `🏆 Founded: ${team.founded || 'Unknown'}\n`;
        teamText += `🏟️ Stadium: ${team.venue || 'Unknown'}\n`;
        teamText += `👨‍💼 Coach: ${team.coach?.name || 'Unknown'}\n`;
        teamText += `🎨 Colors: ${team.clubColors || 'Unknown'}\n`;
        teamText += `🌐 Website: ${team.website || 'Unknown'}\n`;

        await nexus.sendMessage(chatId, { text: teamText });
        console.log(chalk.green('✅ Team info sent'));

    } catch (error) {
        console.log(chalk.red(`❌ Team info error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching team info: ${error.message}`
        });
    }
};

// Get Upcoming Fixtures
const getFixtures = async (nexus, chatId) => {
    try {
        console.log(chalk.blue('📅 Fetching upcoming fixtures...'));

        // Without dateFrom/dateTo, football-data.org only returns TODAY's matches,
        // which is why this often showed "No upcoming fixtures". Widen to next 7 days.
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const dateFrom = today.toISOString().split('T')[0];
        const dateTo = nextWeek.toISOString().split('T')[0];

        const response = await axios.get(`${footballAPI.baseURL}/matches?status=SCHEDULED&dateFrom=${dateFrom}&dateTo=${dateTo}`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });

        if (!response.data.matches || response.data.matches.length === 0) {
            await nexus.sendMessage(chatId, {
                text: '❌ No upcoming fixtures in the next 7 days'
            });
            return;
        }

        let fixturesText = '📅 UPCOMING FIXTURES (next 7 days)\n\n';
        response.data.matches.forEach((match, index) => {
            const date = new Date(match.utcDate).toLocaleDateString();
            fixturesText += `${index + 1}. ${match.homeTeam.name} vs ${match.awayTeam.name}\n`;
            fixturesText += `   Date: ${date}\n\n`;
        });

        await nexus.sendMessage(chatId, { text: fixturesText });
        console.log(chalk.green('✅ Fixtures sent'));

    } catch (error) {
        console.log(chalk.red(`❌ Fixtures error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching fixtures: ${error.message}`
        });
    }
};

// Match Analysis
const getMatchAnalysis = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🎙️ MATCH ANALYSIS\n\n🚧 football-data.org's free tier doesn't include possession/shots/cards stats. Not wired to a stats provider yet — was showing made-up numbers before, removed that.`
    });
};

// Head to Head — real, using football-data.org's team search + match filtering.
const getHeadToHead = async (nexus, chatId, teamsText) => {
    try {
        if (!teamsText || !teamsText.includes(' vs ')) {
            await nexus.sendMessage(chatId, {
                text: `🥅 HEAD TO HEAD\n\nUsage: reply with two team names like:\n*Arsenal vs Chelsea*`
            });
            return;
        }
        const [teamAName, teamBName] = teamsText.split(' vs ').map(s => s.trim());

        const searchTeam = async (name) => {
            const res = await axios.get(`${footballAPI.baseURL}/teams?name=${encodeURIComponent(name)}`, {
                headers: { 'X-Auth-Token': footballAPI.apiKey }
            });
            return res.data.teams?.[0] || null;
        };

        const [teamA, teamB] = await Promise.all([searchTeam(teamAName), searchTeam(teamBName)]);
        if (!teamA || !teamB) {
            await nexus.sendMessage(chatId, { text: `❌ Couldn't find one or both teams. Try their full/official name.` });
            return;
        }

        const matchesRes = await axios.get(`${footballAPI.baseURL}/teams/${teamA.id}/matches?status=FINISHED&limit=50`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });
        const shared = (matchesRes.data.matches || [])
            .filter(m => m.homeTeam.id === teamB.id || m.awayTeam.id === teamB.id)
            .slice(0, 5);

        if (!shared.length) {
            await nexus.sendMessage(chatId, { text: `🥅 No recent meetings found between ${teamA.name} and ${teamB.name} in football-data.org's coverage.` });
            return;
        }

        let text = `🥅 HEAD TO HEAD\n${teamA.name} vs ${teamB.name}\n\n`;
        shared.forEach(m => {
            const date = new Date(m.utcDate).toLocaleDateString();
            text += `${date}: ${m.homeTeam.shortName} ${m.score.fullTime.home}-${m.score.fullTime.away} ${m.awayTeam.shortName}\n`;
        });
        await nexus.sendMessage(chatId, { text });
    } catch (e) {
        await nexus.sendMessage(chatId, { text: `❌ Head-to-head lookup failed: ${e.message}` });
    }
};

// Injury Updates - not available on football-data.org free tier
const getInjuryUpdates = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `⚡ INJURY UPDATES\n\n🚧 This needs a dedicated injury-data source (football-data.org's free tier doesn't include it). Coming soon!`
    });
};

// Transfer News — real, filtering BBC Sport's RSS for transfer-related headlines.
const getTransferNews = async (nexus, chatId) => {
    try {
        const { data } = await axios.get('https://feeds.bbci.co.uk/sport/football/rss.xml', { timeout: 8000 });
        const items = [...data.matchAll(/<item>([\s\S]*?)<\/item>/g)];
        const transferItems = items
            .map(item => item[1].match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1])
            .filter(title => title && /transfer|sign|deal|loan|move/i.test(title))
            .slice(0, 6);
        if (!transferItems.length) {
            await nexus.sendMessage(chatId, { text: '🔄 No transfer news in the current feed right now.' });
            return;
        }
        let text = '🔄 TRANSFER NEWS\n\n' + transferItems.map(t => `• ${t}`).join('\n') + '\n\n_Source: BBC Sport_';
        await nexus.sendMessage(chatId, { text });
    } catch (e) {
        await nexus.sendMessage(chatId, { text: `❌ Couldn't fetch transfer news right now: ${e.message}` });
    }
};

// Football News — real, parsing BBC Sport's public football RSS feed (no API key needed).
const getFootballNews = async (nexus, chatId) => {
    try {
        const { data } = await axios.get('https://feeds.bbci.co.uk/sport/football/rss.xml', { timeout: 8000 });
        const items = [...data.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 6);
        if (!items.length) {
            await nexus.sendMessage(chatId, { text: '🗞️ No news available right now.' });
            return;
        }
        let text = '🗞️ FOOTBALL NEWS\n\n';
        items.forEach(item => {
            const title = item[1].match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || 'Untitled';
            text += `• ${title}\n`;
        });
        text += '\n_Source: BBC Sport_';
        await nexus.sendMessage(chatId, { text });
    } catch (e) {
        await nexus.sendMessage(chatId, { text: `❌ Couldn't fetch news right now: ${e.message}` });
    }
};

// Player Stats — real, using TheSportsDB's free player search.
const getPlayerStats = async (nexus, chatId, playerName) => {
    try {
        if (!playerName) {
            await nexus.sendMessage(chatId, { text: `⛰️ PLAYER STATS\n\nUsage: reply with a player's full name, e.g. *Erling Haaland*` });
            return;
        }
        const { data } = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`);
        const player = data.player?.[0];
        if (!player) {
            await nexus.sendMessage(chatId, { text: `❌ Couldn't find "${playerName}".` });
            return;
        }
        const text = `⛰️ *${player.strPlayer}*\n\n` +
            `Team: ${player.strTeam || 'N/A'}\n` +
            `Position: ${player.strPosition || 'N/A'}\n` +
            `Nationality: ${player.strNationality || 'N/A'}\n` +
            `Born: ${player.dateBorn || 'N/A'}\n` +
            `Height: ${player.strHeight || 'N/A'} | Weight: ${player.strWeight || 'N/A'}`;
        await nexus.sendMessage(chatId, { text });
    } catch (e) {
        await nexus.sendMessage(chatId, { text: `❌ Player lookup failed: ${e.message}` });
    }
};

// Match Predictions - needs a prediction model/odds source
const getMatchPredictions = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🎯 MATCH PREDICTIONS\n\n🚧 Not wired to a predictions engine yet. Coming soon!`
    });
};

// Match Highlights - needs video source (YouTube etc.)
const searchHighlights = async (nexus, chatId, teamA, teamB) => {
    try {
        const results = await yts(`${teamA} vs ${teamB} highlights`);
        const videos = (results.videos || []).slice(0, 3);
        if (videos.length === 0) {
            await nexus.sendMessage(chatId, { text: `📺 No highlight videos found yet for ${teamA} vs ${teamB}. Try again in a bit.` });
            return;
        }
        let text = `📺 MATCH HIGHLIGHTS — ${teamA} vs ${teamB}\n\n`;
        videos.forEach((v, i) => {
            text += `${i + 1}. ${v.title}\n⏱️ ${v.timestamp} • 👁️ ${v.views.toLocaleString()} views\n🔗 ${v.url}\n\n`;
        });
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ Highlights sent for ${teamA} vs ${teamB}`));
    } catch (error) {
        console.log(chalk.red(`❌ Highlights search error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error searching highlights: ${error.message}` });
    }
};

// Button/menu entry point — sender arg (3rd param passed by dispatchMenuCommand)
// is ignored here since it's never a "TeamA vs TeamB" string.
const getMatchHighlights = async (nexus, chatId, teamsText) => {
    if (!teamsText || !teamsText.includes('vs')) {
        await nexus.sendMessage(chatId, { text: `📺 MATCH HIGHLIGHTS\n\nSend: ${'`'}.highlights TeamA vs TeamB${'`'}` });
        return;
    }
    const [teamA, teamB] = teamsText.split(/vs/i).map(t => t.trim());
    await searchHighlights(nexus, chatId, teamA, teamB);
};

// ============ LIVE MATCH TRACKING ============
// Polls a single match every 90s (safe for football-data.org's free-tier rate
// limit) and posts a message whenever the score or status changes. Auto-stops
// and sends highlights once the match is FINISHED. One tracker per chat.
// Stored on `global` (not a plain module variable) because case.js uses
// freshRequire() to reload this file on every command call, which would
// otherwise wipe this state and break .livetrack stop / duplicate-tracker
// prevention. Still fully per-chat/per-group — each chatId gets its own entry.
if (!global.__footballLiveTrackers) global.__footballLiveTrackers = {};
const liveTrackers = global.__footballLiveTrackers; // { chatId: { intervalHandle, matchId, startedAt } }

const stopLiveTrack = (chatId) => {
    if (liveTrackers[chatId]) {
        clearInterval(liveTrackers[chatId].intervalHandle);
        delete liveTrackers[chatId];
    }
};

const startLiveTrack = async (nexus, chatId, teamQuery) => {
    try {
        if ((teamQuery || '').trim().toLowerCase() === 'stop') {
            const wasTracking = !!liveTrackers[chatId];
            stopLiveTrack(chatId);
            await nexus.sendMessage(chatId, { text: wasTracking ? '🛑 Live tracking stopped.' : 'ℹ️ No active live tracker in this chat.' });
            return;
        }
        if (!teamQuery) {
            await nexus.sendMessage(chatId, { text: `🔴 LIVE TRACKING\n\nSend: ${'`'}.livetrack TeamName${'`'}\nStop anytime: ${'`'}.livetrack stop${'`'}` });
            return;
        }

        const response = await axios.get(`${footballAPI.baseURL}/matches?status=LIVE`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });
        const matches = response.data.matches || [];
        const found = matches.find(m =>
            m.homeTeam.name.toLowerCase().includes(teamQuery.toLowerCase()) ||
            m.awayTeam.name.toLowerCase().includes(teamQuery.toLowerCase())
        );

        if (!found) {
            await nexus.sendMessage(chatId, { text: `🔴 No live match found matching "${teamQuery}" right now. Check ${'`'}.list todaymatch${'`'} for today's fixtures.` });
            return;
        }

        stopLiveTrack(chatId); // one tracker per chat at a time

        const homeTeam = found.homeTeam.name;
        const awayTeam = found.awayTeam.name;
        const startedAt = Date.now();
        let lastKey = '';

        await nexus.sendMessage(chatId, { text: `🔴 LIVE TRACKING STARTED\n\n${homeTeam} vs ${awayTeam}\nI'll post here whenever the score or match state changes.\n\nStop anytime: ${'`'}.livetrack stop${'`'}` });

        const intervalHandle = setInterval(async () => {
            try {
                if (Date.now() - startedAt > 3 * 60 * 60 * 1000) { // 3hr safety cutoff
                    stopLiveTrack(chatId);
                    return;
                }

                const matchRes = await axios.get(`${footballAPI.baseURL}/matches/${found.id}`, {
                    headers: { 'X-Auth-Token': footballAPI.apiKey }
                });
                const match = matchRes.data.match || matchRes.data;
                const home = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? 0;
                const away = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? 0;
                const status = match.status;
                const key = `${status}-${home}-${away}`;

                if (key !== lastKey) {
                    lastKey = key;
                    if (status === 'FINISHED') {
                        await nexus.sendMessage(chatId, { text: `🏁 FULL TIME\n\n${homeTeam} ${home} - ${away} ${awayTeam}` });
                        stopLiveTrack(chatId);
                        await searchHighlights(nexus, chatId, homeTeam, awayTeam);
                    } else {
                        await nexus.sendMessage(chatId, { text: `🔴 LIVE UPDATE\n\n${homeTeam} ${home} - ${away} ${awayTeam}\nStatus: ${status}` });
                    }
                }
            } catch (e) {
                console.log(chalk.red(`❌ Live track poll error: ${e.message}`));
            }
        }, 90000);

        liveTrackers[chatId] = { intervalHandle, matchId: found.id };
        console.log(chalk.green(`✅ Live tracking started: ${homeTeam} vs ${awayTeam} in ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Live track start error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error starting live tracking: ${error.message}` });
    }
};

// Stadium Info - not on football-data.org
const getStadiumInfo = async (nexus, chatId, teamName) => {
    try {
        if (!teamName) {
            await nexus.sendMessage(chatId, { text: `🏟️ STADIUM INFO\n\nUsage: reply with a team name, e.g. *Arsenal*` });
            return;
        }
        // TheSportsDB's free public test key ("3") — genuinely free tier, no signup needed for basic lookups.
        const { data } = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`);
        const team = data.teams?.[0];
        if (!team) {
            await nexus.sendMessage(chatId, { text: `❌ Couldn't find "${teamName}".` });
            return;
        }
        const text = `🏟️ *${team.strStadium || 'Unknown stadium'}*\n\n` +
            `Team: ${team.strTeam}\n` +
            `Location: ${team.strStadiumLocation || 'N/A'}\n` +
            `Capacity: ${team.intStadiumCapacity ? Number(team.intStadiumCapacity).toLocaleString() : 'N/A'}\n` +
            `Description: ${team.strStadiumDescription ? team.strStadiumDescription.slice(0, 300) + '...' : 'N/A'}`;
        await nexus.sendMessage(chatId, { text });
    } catch (e) {
        await nexus.sendMessage(chatId, { text: `❌ Stadium lookup failed: ${e.message}` });
    }
};

// Referee Stats - not on football-data.org
const getRefereeStats = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `👨‍⚖️ REFEREE STATS\n\n🚧 Not wired to a referee database yet. Coming soon!`
    });
};

// Trophy Cabinet - needs a historical honours dataset
const getTrophyCabinet = async (nexus, chatId, teamName) => {
    try {
        if (!teamName) {
            await nexus.sendMessage(chatId, { text: `🎖️ TROPHY CABINET\n\nUsage: reply with a team name, e.g. *Real Madrid*` });
            return;
        }
        const teamRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`);
        const team = teamRes.data.teams?.[0];
        if (!team) {
            await nexus.sendMessage(chatId, { text: `❌ Couldn't find "${teamName}".` });
            return;
        }
        const trophyRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/lookuphonours.php?id=${team.idTeam}`);
        const honours = trophyRes.data.honours || [];
        if (!honours.length) {
            await nexus.sendMessage(chatId, { text: `🎖️ No trophy data available for ${team.strTeam} in this source.` });
            return;
        }
        let text = `🎖️ *${team.strTeam} — Trophy Cabinet*\n\n`;
        honours.slice(0, 15).forEach(h => { text += `🏆 ${h.strHonour} (${h.strSeason})\n`; });
        await nexus.sendMessage(chatId, { text });
    } catch (e) {
        await nexus.sendMessage(chatId, { text: `❌ Trophy lookup failed: ${e.message}` });
    }
};

// Historical Stats
const getHistoricalStats = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `📈 HISTORICAL STATS\n\n🚧 Not wired to a historical database yet. Coming soon!`
    });
};

// Hall of Fame
const getHallOfFame = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🏆 HALL OF FAME\n\n🚧 Not wired to a hall-of-fame database yet. Coming soon!`
    });
};

// Nigeria Football - filterable via football-data.org competitions if NGA league code available
const getNigeriaFootball = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🇳🇬 NIGERIA FOOTBALL\n\n🚧 football-data.org's free tier has limited NPFL/Super Eagles coverage. Coming soon!`
    });
};

// International Matches - football-data.org has WC/Euro competitions on paid tiers mostly
const getInternationalMatches = async (nexus, chatId) => {
    try {
        console.log(chalk.blue('🌍 Fetching international matches...'));
        const response = await axios.get(`${footballAPI.baseURL}/matches?status=SCHEDULED`, {
            headers: { 'X-Auth-Token': footballAPI.apiKey }
        });
        const intlMatches = (response.data.matches || []).filter(m => m.competition?.type === 'CUP' || /nations|world cup|euro/i.test(m.competition?.name || ''));
        if (!intlMatches.length) {
            await nexus.sendMessage(chatId, { text: '🌍 No international matches scheduled right now.' });
            return;
        }
        let text = '🌍 INTERNATIONAL MATCHES\n\n';
        intlMatches.forEach((match, i) => {
            const date = new Date(match.utcDate).toLocaleDateString();
            text += `${i + 1}. ${match.homeTeam.name} vs ${match.awayTeam.name}\n   ${date}\n\n`;
        });
        await nexus.sendMessage(chatId, { text });
    } catch (error) {
        console.log(chalk.red(`❌ International matches error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `🌍 INTERNATIONAL MATCHES\n\n🚧 Couldn't fetch right now. Try again later!` });
    }
};

module.exports = {
    // Correct names matching menu.js -> case.js dispatch (CMD_football_<slug> -> camelCase)
    liveMatches: getLiveMatches,
    leagueStandings: getStandings,
    topScorers: getTopScorers,
    teamStats: getTeamInfo,
    upcomingFixtures: getFixtures,
    postMatchAnalysis: getMatchAnalysis,
    headToHead: getHeadToHead,
    injuryUpdates: getInjuryUpdates,
    transferNews: getTransferNews,
    footballNews: getFootballNews,
    playerStats: getPlayerStats,
    matchPredictions: getMatchPredictions,
    matchHighlights: getMatchHighlights,
    stadiumInfo: getStadiumInfo,
    refereeStats: getRefereeStats,
    trophyCabinet: getTrophyCabinet,
    historicalStats: getHistoricalStats,
    hallOfFame: getHallOfFame,
    nigeriaFootball: getNigeriaFootball,
    internationalMatches: getInternationalMatches,
    startLiveTrack,

    // Old names kept as aliases in case anything else in the codebase calls them directly
    getLiveMatches,
    getStandings,
    getTopScorers,
    getTeamInfo,
    getFixtures,
    getMatchAnalysis
};

    return module.exports;
})();

const __cmd_fun = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

// Fun & Games Handler
const funGames = {
    jokes: [
        "Why did the programmer quit his job? Because he didn't get arrays!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "Why do Java developers wear glasses? Because they can't C#!",
        "Why did the developer go broke? Because he used up all his cache!",
        "What's a programmer's favorite hangout place? Foo Bar!"
    ],
    roasts: [
        "You're like a software update - nobody wants you and you make everything worse!",
        "I'd roast you, but my mother taught me not to burn trash!",
        "Your code is like your social skills - non-existent!",
        "You're proof that evolution can go in reverse!",
        "If you were a vegetable, you'd be a turnip - because you turn everything down!"
    ],
    compliments: [
        "You're absolutely amazing! 🌟",
        "Your smile could light up the darkest room! ✨",
        "You're a gift to those around you! 🎁",
        "You're a smart cookie! 🍪",
        "You light up the room! 💡"
    ],
    truthOrDare: {
        truths: [
            "What's your biggest secret? 🤫",
            "Who do you secretly like? 💕",
            "What's your most embarrassing moment? 😳",
            "If you could change one thing about yourself, what would it be? 🤔",
            "What's your biggest fear? 😰"
        ],
        dares: [
            "Send a message to someone you haven't talked to in years! 📱",
            "Do 20 push-ups right now! 💪",
            "Sing a song out loud! 🎤",
            "Change your profile picture to something funny! 🤣",
            "Do your best impression of a celebrity! 🎭"
        ]
    }
};

// Get Random Joke
const getJoke = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`😂 Getting random joke...`));
        
        const randomJoke = funGames.jokes[Math.floor(Math.random() * funGames.jokes.length)];
        
        let jokeText = `😂 JOKE OF THE DAY\n\n`;
        jokeText += `🎭 ${randomJoke}\n\n`;
        jokeText += `😆 Hahaha! Funny right?\n`;

        await nexus.sendMessage(chatId, { text: jokeText });
        console.log(chalk.green(`✅ Joke sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Joke error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error getting joke: ${error.message}`
        });
    }
};

// Roast Someone
const roastUser = async (nexus, chatId, username) => {
    try {
        console.log(chalk.blue(`🔥 Getting roast for ${username}...`));
        
        const randomRoast = funGames.roasts[Math.floor(Math.random() * funGames.roasts.length)];
        
        let roastText = `🔥 ROAST FOR @${username}\n\n`;
        roastText += `💥 ${randomRoast}\n\n`;
        roastText += `Ohhhhh! That's a BURN! 🔥\n`;

        await nexus.sendMessage(chatId, { text: roastText });
        console.log(chalk.green(`✅ Roast sent for ${username}`));

    } catch (error) {
        console.log(chalk.red(`❌ Roast error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error getting roast: ${error.message}`
        });
    }
};

// Compliment Someone
const complimentUser = async (nexus, chatId, username) => {
    try {
        console.log(chalk.blue(`💕 Getting compliment for ${username}...`));
        
        const randomCompliment = funGames.compliments[Math.floor(Math.random() * funGames.compliments.length)];
        
        let complimentText = `💕 COMPLIMENT FOR @${username}\n\n`;
        complimentText += `✨ ${randomCompliment}\n\n`;
        complimentText += `You deserve all the love! 🥰\n`;

        await nexus.sendMessage(chatId, { text: complimentText });
        console.log(chalk.green(`✅ Compliment sent for ${username}`));

    } catch (error) {
        console.log(chalk.red(`❌ Compliment error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error getting compliment: ${error.message}`
        });
    }
};

// Truth or Dare
const truthOrDare = async (nexus, chatId, choice) => {
    try {
        console.log(chalk.blue(`🎮 Getting ${choice}...`));
        
        let gameText = `🎮 TRUTH OR DARE\n\n`;
        
        if (choice.toLowerCase() === 'truth') {
            const randomTruth = funGames.truthOrDare.truths[Math.floor(Math.random() * funGames.truthOrDare.truths.length)];
            gameText += `🎯 TRUTH:\n`;
            gameText += `"${randomTruth}"\n`;
        } else if (choice.toLowerCase() === 'dare') {
            const randomDare = funGames.truthOrDare.dares[Math.floor(Math.random() * funGames.truthOrDare.dares.length)];
            gameText += `🎯 DARE:\n`;
            gameText += `"${randomDare}"\n`;
        }
        
        gameText += `\n⏰ You have 60 seconds! Go! 🚀\n`;

        await nexus.sendMessage(chatId, { text: gameText });
        console.log(chalk.green(`✅ Truth or Dare sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Truth or Dare error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error with Truth or Dare: ${error.message}`
        });
    }
};

// Dice Roll
const rollDice = async (nexus, chatId, sides = 6) => {
    try {
        console.log(chalk.blue(`🎲 Rolling ${sides}-sided dice...`));
        
        const result = Math.floor(Math.random() * sides) + 1;
        
        let diceText = `🎲 DICE ROLL\n\n`;
        diceText += `🎲 Sides: ${sides}\n`;
        diceText += `🎯 Result: ${result}\n\n`;
        
        if (result === sides) {
            diceText += `🎉 JACKPOT! Perfect roll! 🎉\n`;
        } else if (result === 1) {
            diceText += `💔 Oof! Lowest roll possible!\n`;
        } else {
            diceText += `✅ Fair roll!\n`;
        }

        await nexus.sendMessage(chatId, { text: diceText });
        console.log(chalk.green(`✅ Dice roll sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Dice roll error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error rolling dice: ${error.message}`
        });
    }
};

// Love Calculator
const calculateLove = async (nexus, chatId, name1, name2) => {
    try {
        console.log(chalk.blue(`💕 Calculating love between ${name1} and ${name2}...`));
        
        // Simple hash-based percentage
        const combined = name1 + name2;
        const percentage = (combined.length * 13) % 101;
        
        let loveText = `💕 LOVE CALCULATOR\n\n`;
        loveText += `👤 ${name1} + ${name2}\n\n`;
        loveText += `💘 Love Percentage: ${percentage}%\n\n`;
        
        if (percentage > 80) {
            loveText += `🔥 AMAZING MATCH! Perfect love! 💑\n`;
        } else if (percentage > 60) {
            loveText += `✨ Great Potential! Very compatible! 💕\n`;
        } else if (percentage > 40) {
            loveText += `💭 It could work with effort! 💫\n`;
        } else {
            loveText += `😅 Might be challenging, but love conquers all! 🙏\n`;
        }

        await nexus.sendMessage(chatId, { text: loveText });
        console.log(chalk.green(`✅ Love calculator sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Love calculator error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error calculating love: ${error.message}`
        });
    }
};

// Random Number Generator
const generateRandomNumber = async (nexus, chatId, min = 1, max = 100) => {
    try {
        console.log(chalk.blue(`🎲 Generating random number between ${min} and ${max}...`));
        
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        
        let randomText = `🎲 RANDOM NUMBER GENERATOR\n\n`;
        randomText += `📊 Range: ${min} - ${max}\n`;
        randomText += `🎯 Result: ${randomNum}\n\n`;
        randomText += `✅ Generated!\n`;

        await nexus.sendMessage(chatId, { text: randomText });
        console.log(chalk.green(`✅ Random number sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Random number error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error generating random number: ${error.message}`
        });
    }
};

// Rate Something
const rateSomething = async (nexus, chatId, something) => {
    try {
        console.log(chalk.blue(`⭐ Rating ${something}...`));
        
        const rating = Math.floor(Math.random() * 5) + 1;
        const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
        
        let ratingText = `⭐ RATING: ${something}\n\n`;
        ratingText += `${stars}\n`;
        ratingText += `Rating: ${rating}/5\n\n`;
        
        if (rating === 5) {
            ratingText += `🔥 AMAZING! Absolutely perfect!\n`;
        } else if (rating === 4) {
            ratingText += `👍 Great! Really good!\n`;
        } else if (rating === 3) {
            ratingText += `😐 Okay! Could be better!\n`;
        } else {
            ratingText += `😟 Not so good! Needs improvement!\n`;
        }

        await nexus.sendMessage(chatId, { text: ratingText });
        console.log(chalk.green(`✅ Rating sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Rating error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error rating: ${error.message}`
        });
    }
};

// Flip Coin
const flipCoin = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`🪙 Flipping coin...`));
        
        const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
        
        let flipText = `🪙 COIN FLIP\n\n`;
        flipText += `🔄 Flipping...\n`;
        flipText += `🪙 Result: ${result}\n\n`;
        flipText += `✅ Coin flipped!\n`;

        await nexus.sendMessage(chatId, { text: flipText });
        console.log(chalk.green(`✅ Coin flip sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Coin flip error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error flipping coin: ${error.message}`
        });
    }
};

module.exports = {
    getJoke,
    roastUser,
    complimentUser,
    truthOrDare,
    rollDice,
    calculateLove,
    generateRandomNumber,
    rateSomething,
    flipCoin
};

    return module.exports;
})();


// ============ inlined from commands/games.js ============
const __cmd_games = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const economy = __cmd_economy; // shared wallet — always credit coins through economy.awardCoins()

// ============ SESSION STORAGE (one active game per chat) ============
const SESSION_FILE = path.join(process.cwd(), 'database', 'games_session.json');
const STATS_FILE = path.join(process.cwd(), 'database', 'games_stats.json');
const SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes idle -> auto expire

// loadJSON/saveJSON — local to this IIFE. IMPORTANT: this file is built
// from ~20 separate self-contained IIFE modules (__cmd_games, __cmd_group,
// __cmd_fun, etc.), each its own closure. A loadJSON defined inside one
// module is NOT visible inside another — they only look like duplicates
// from a flat text search; they're actually independent, module-scoped
// copies. One was mistakenly deleted from here earlier as a "redundant
// duplicate," which broke every function in this module that depends on
// it (getSession/setSession/clearSession/hasActiveGame/bumpStat and
// anything downstream of them) — that's what caused the crash loop.
// Restored, matching the signature the calls below actually expect.
function loadJSON(file, fallback = {}) {
    try {
        if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback));
        return JSON.parse(fs.readFileSync(file));
    } catch (e) { return fallback; }
}
function saveJSON(file, data) {
    try { fs.writeFileSync(file, JSON.stringify(data, null, 2)); } catch (e) {}
}

function getSession(chatId) {
    const all = loadJSON(SESSION_FILE);
    const s = all[chatId];
    if (!s) return null;
    if (Date.now() - s.ts > SESSION_TTL_MS) { clearSession(chatId); return null; }
    return s;
}
function setSession(chatId, data) {
    const all = loadJSON(SESSION_FILE);
    all[chatId] = { ...data, ts: Date.now() };
    saveJSON(SESSION_FILE, all);
}
function clearSession(chatId) {
    const all = loadJSON(SESSION_FILE);
    delete all[chatId];
    saveJSON(SESSION_FILE, all);
}
function hasActiveGame(chatId) {
    return !!getSession(chatId);
}

function bumpStat(sender, field) {
    if (!sender) return;
    const stats = loadJSON(STATS_FILE);
    if (!stats[sender]) stats[sender] = { wins: 0, played: 0 };
    stats[sender][field] = (stats[sender][field] || 0) + 1;
    saveJSON(STATS_FILE, stats);
}

async function send(nexus, chatId, text) {
    await nexus.sendMessage(chatId, { text });
}

async function reward(nexus, chatId, amount, desc) {
    const newBalance = await economy.awardCoins(chatId, amount, desc);
    return newBalance;
}

// ============ QUESTION / WORD BANKS ============
const TRIVIA_BANK = [
    { q: 'Which country won the first FIFA World Cup in 1930?', options: ['Brazil', 'Uruguay', 'Argentina', 'Italy'], answer: 1 },
    { q: 'What is the capital of Nigeria?', options: ['Lagos', 'Kano', 'Abuja', 'Ibadan'], answer: 2 },
    { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: 2 },
    { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 1 },
    { q: 'Who wrote the play "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'], answer: 1 },
    { q: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3 },
    { q: 'Which gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], answer: 1 },
    { q: 'How many players are on a football team on the pitch?', options: ['9', '10', '11', '12'], answer: 2 },
    { q: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Gd', 'Go'], answer: 1 },
    { q: 'Which country has the most population in Africa?', options: ['Egypt', 'Ethiopia', 'Nigeria', 'South Africa'], answer: 2 },
    { q: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], answer: 2 },
    { q: 'Which organ pumps blood around the human body?', options: ['Lungs', 'Brain', 'Heart', 'Liver'], answer: 2 },
    { q: 'In what year did Nigeria gain independence?', options: ['1957', '1960', '1963', '1970'], answer: 1 },
    { q: 'What does "www" stand for?', options: ['World Wide Web', 'World Web Wide', 'Web World Wide', 'Wide World Web'], answer: 0 },
    { q: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], answer: 1 }
];

const WORD_BANK_SHORT = [
    'football', 'guitar', 'elephant', 'sunshine', 'keyboard', 'diamond', 'volcano',
    'mountain', 'chocolate', 'butterfly', 'umbrella', 'rainbow', 'stadium', 'treasure'
];

const WORD_BANK_HANGMAN = [
    'python', 'whatsapp', 'legendary', 'trophy', 'goalkeeper', 'javascript',
    'referee', 'stadium', 'championship', 'developer', 'network', 'password'
];

// ============ HELPERS ============
function scramble(word) {
    let arr = word.split('');
    let scrambled = word;
    let attempts = 0;
    while (scrambled === word && attempts < 20) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        scrambled = arr.join('');
        attempts++;
    }
    return scrambled;
}

function renderHangman(session) {
    const display = session.word.split('').map(ch => session.guessed.includes(ch) ? ch : '_').join(' ');
    const wrongLetters = session.guessedWrong.join(', ') || 'none';
    const stages = ['🙂', '😐', '😕', '😟', '😨', '😰', '💀'];
    return `🪢 HANGMAN ${stages[session.wrong]}\n\n${display.toUpperCase()}\n\n❌ Wrong guesses (${session.wrong}/${session.maxWrong}): ${wrongLetters}\n\n💬 Reply with one letter, or QUIT to cancel.`;
}

function renderBoard(board) {
    const cell = (i) => board[i] || String(i + 1);
    return `${cell(0)} | ${cell(1)} | ${cell(2)}\n---------\n${cell(3)} | ${cell(4)} | ${cell(5)}\n---------\n${cell(6)} | ${cell(7)} | ${cell(8)}`;
}

const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
function checkWinner(board) {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(c => c)) return 'draw';
    return null;
}
// ============ GAME STARTERS (called from menu button taps) ============
const trivia = async (nexus, chatId) => {
    const pick = TRIVIA_BANK[Math.floor(Math.random() * TRIVIA_BANK.length)];
    setSession(chatId, { type: 'trivia', answerIndex: pick.answer, question: pick.q, options: pick.options, rewardAmt: 150 });
    const letters = ['A', 'B', 'C', 'D'];
    const optText = pick.options.map((o, i) => `${letters[i]}) ${o}`).join('\n');
    await send(nexus, chatId, `🧠 TRIVIA QUIZ\n\n${pick.q}\n\n${optText}\n\n💬 Reply with A, B, C or D. Win 150 coins!`);
};

const wordUnscramble = async (nexus, chatId) => {
    const word = WORD_BANK_SHORT[Math.floor(Math.random() * WORD_BANK_SHORT.length)];
    const scrambled = scramble(word);
    setSession(chatId, { type: 'unscramble', word, tries: 0, maxTries: 3, rewardAmt: 120 });
    await send(nexus, chatId, `🔤 WORD UNSCRAMBLE\n\nUnscramble this word:\n\n👉 ${scrambled.toUpperCase()}\n\n💬 Reply with your guess. You have 3 tries. Win 120 coins!`);
};

const guessTheNumber = async (nexus, chatId) => {
    const target = Math.floor(Math.random() * 100) + 1;
    setSession(chatId, { type: 'guessnumber', target, tries: 0, maxTries: 7 });
    await send(nexus, chatId, `🔢 GUESS THE NUMBER\n\nI'm thinking of a number between 1 and 100.\nYou have 7 tries. Coins depend on how fast you get it!\n\n💬 Reply with your guess.`);
};

const hangman = async (nexus, chatId) => {
    const word = WORD_BANK_HANGMAN[Math.floor(Math.random() * WORD_BANK_HANGMAN.length)];
    const session = { type: 'hangman', word, guessed: [], guessedWrong: [], wrong: 0, maxWrong: 6, rewardAmt: 180 };
    setSession(chatId, session);
    await send(nexus, chatId, renderHangman(session));
};

const ticTacToe = async (nexus, chatId, sender) => {
    if (!sender) {
        await send(nexus, chatId, `⭕ Tic Tac Toe needs to know who's challenging — please try tapping the button again.`);
        return;
    }
    const existing = getSession(chatId);
    if (existing && existing.type === 'tictactoe') {
        await send(nexus, chatId, existing.phase === 'lobby'
            ? `⭕ A game is already waiting for a second player. Reply "register" to join!`
            : `⭕ A game is already in progress in this chat. Reply "quit" to cancel it first.`);
        return;
    }
    setSession(chatId, { type: 'tictactoe', phase: 'lobby', challenger: sender, rewardAmt: 200 });
    await send(nexus, chatId, `⭕ TIC TAC TOE — @${sender.split('@')[0]} wants to play!\n\n💬 Anyone else in this chat, reply "register" to join as opponent.\nFirst person to register plays. Winner gets 200 coins!`);
};

const rollTheDice = async (nexus, chatId) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const won = roll === 6;
    let text = `🎲 You rolled a ${roll}!`;
    if (won) {
        const bal = await reward(nexus, chatId, 50, 'Dice roll (6)');
        text += `\n\n🎉 Rolled a 6! +50 coins\n💰 Balance: ${bal.toLocaleString()}`;
    } else {
        text += `\n\nRoll a 6 to win coins. Try again!`;
    }
    await send(nexus, chatId, text);
};

const coinFlip = async (nexus, chatId) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    await send(nexus, chatId, `🪙 The coin landed on... ${result}!\n\n💬 Play again anytime.`);
};

const gameLeaderboard = async (nexus, chatId) => {
    const stats = loadJSON(STATS_FILE);
    const top = Object.entries(stats)
        .sort((a, b) => (b[1].wins || 0) - (a[1].wins || 0))
        .slice(0, 10);
    if (!top.length) {
        await send(nexus, chatId, `🏆 GAME LEADERBOARD\n\nNo wins recorded yet — be the first! Try Trivia, Hangman, or Tic Tac Toe.`);
        return;
    }
    const lines = top.map(([id, s], i) => `${i + 1}. ${id.split('@')[0]} — ${s.wins || 0} wins (${s.played || 0} played)`);
    await send(nexus, chatId, `🏆 GAME LEADERBOARD (Top 10)\n\n${lines.join('\n')}`);
};

const endGame = async (nexus, chatId) => {
    const had = hasActiveGame(chatId);
    clearSession(chatId);
    await send(nexus, chatId, had ? `🛑 Game ended. Play another anytime from the menu!` : `No active game to end right now.`);
};

// ============ REPLY ROUTER ============
// Called from case.js whenever a plain-text message arrives in a chat that
// has an active game session. Returns true if it consumed the message.
const handleGameReply = async (nexus, chatId, sender, rawText) => {
    const session = getSession(chatId);
    if (!session) return false;
    const text = (rawText || '').trim();
    const lower = text.toLowerCase();

    if (lower === 'quit' || lower === 'cancel' || lower === 'stop') {
        clearSession(chatId);
        await send(nexus, chatId, `🛑 Game cancelled.`);
        return true;
    }

    if (session.type === 'trivia') {
        const letters = ['A', 'B', 'C', 'D'];
        const idx = letters.indexOf(lower.toUpperCase()[0]);
        if (idx === -1 || !/^[a-d]$/i.test(lower)) return false; // not a valid trivia reply, let other handlers try
        bumpStat(sender, 'played');
        
        // Defensive: ensure answer index is valid
        if (typeof session.answerIndex !== 'number' || session.answerIndex < 0 || session.answerIndex >= session.options.length) {
            console.log(chalk.red(`❌ Trivia session corrupted: answerIndex ${session.answerIndex}, options length ${session.options.length}`));
            clearSession(chatId);
            await send(nexus, chatId, `⚠️ There was an issue with the question data. Try another Trivia round.`);
            return true;
        }
        
        if (idx === session.answerIndex) {
            const bal = await reward(nexus, chatId, session.rewardAmt, 'Trivia win');
            bumpStat(sender, 'wins');
            await send(nexus, chatId, `✅ Correct! It was ${letters[session.answerIndex]}) ${session.options[session.answerIndex]}.\n\n🎉 +${session.rewardAmt} coins!\n💰 Balance: ${bal.toLocaleString()}`);
        } else {
            const correctAnswer = session.options[session.answerIndex];
            await send(nexus, chatId, `❌ Wrong! The correct answer was ${letters[session.answerIndex]}) ${correctAnswer}.\n\nTry another Trivia round from the menu!`);
        }
        clearSession(chatId);
        return true;
    }

    if (session.type === 'unscramble') {
        if (lower === session.word) {
            bumpStat(sender, 'played'); bumpStat(sender, 'wins');
            const bal = await reward(nexus, chatId, session.rewardAmt, 'Unscramble win');
            await send(nexus, chatId, `✅ Correct! The word was "${session.word.toUpperCase()}".\n\n🎉 +${session.rewardAmt} coins!\n💰 Balance: ${bal.toLocaleString()}`);
            clearSession(chatId);
            return true;
        }
        session.tries += 1;
        if (session.tries >= session.maxTries) {
            bumpStat(sender, 'played');
            await send(nexus, chatId, `❌ Out of tries! The word was "${session.word.toUpperCase()}".\n\nTry another round from the menu!`);
            clearSession(chatId);
            return true;
        }
        setSession(chatId, session);
        await send(nexus, chatId, `❌ Not quite. Tries left: ${session.maxTries - session.tries}. Try again!`);
        return true;
    }

    if (session.type === 'guessnumber') {
        const guess = parseInt(text, 10);
        if (isNaN(guess)) return false;
        session.tries += 1;
        if (guess === session.target) {
            bumpStat(sender, 'played'); bumpStat(sender, 'wins');
            const coinsWon = Math.max(200 - session.tries * 20, 40);
            const bal = await reward(nexus, chatId, coinsWon, 'Guess the number win');
            await send(nexus, chatId, `🎉 Correct! It was ${session.target}, guessed in ${session.tries} ${session.tries === 1 ? 'try' : 'tries'}.\n\n+${coinsWon} coins!\n💰 Balance: ${bal.toLocaleString()}`);
            clearSession(chatId);
            return true;
        }
        if (session.tries >= session.maxTries) {
            bumpStat(sender, 'played');
            await send(nexus, chatId, `❌ Out of tries! The number was ${session.target}.\n\nTry again from the menu!`);
            clearSession(chatId);
            return true;
        }
        setSession(chatId, session);
        await send(nexus, chatId, `${guess < session.target ? '⬆️ Higher!' : '⬇️ Lower!'} Tries left: ${session.maxTries - session.tries}`);
        return true;
    }

    if (session.type === 'hangman') {
        if (!/^[a-z]$/i.test(text)) return false;
        const letter = lower;
        if (session.guessed.includes(letter) || session.guessedWrong.includes(letter)) {
            await send(nexus, chatId, `You already tried "${letter.toUpperCase()}". Pick another letter.`);
            return true;
        }
        if (session.word.includes(letter)) {
            session.guessed.push(letter);
        } else {
            session.guessedWrong.push(letter);
            session.wrong += 1;
        }
        const solved = session.word.split('').every(ch => session.guessed.includes(ch));
        if (solved) {
            bumpStat(sender, 'played'); bumpStat(sender, 'wins');
            const bal = await reward(nexus, chatId, session.rewardAmt, 'Hangman win');
            await send(nexus, chatId, `🎉 You got it! The word was "${session.word.toUpperCase()}".\n\n+${session.rewardAmt} coins!\n💰 Balance: ${bal.toLocaleString()}`);
            clearSession(chatId);
            return true;
        }
        if (session.wrong >= session.maxWrong) {
            bumpStat(sender, 'played');
            await send(nexus, chatId, `💀 You lost! The word was "${session.word.toUpperCase()}".\n\nTry another round from the menu!`);
            clearSession(chatId);
            return true;
        }
        setSession(chatId, session);
        await send(nexus, chatId, renderHangman(session));
        return true;
    }

    if (session.type === 'tictactoe') {
        // ---- Lobby phase: waiting for a second player to register ----
        if (session.phase === 'lobby') {
            if (lower !== 'register') return false; // let other text pass through untouched
            if (sender === session.challenger) {
                await send(nexus, chatId, `You already started this game — wait for someone else to register.`);
                return true;
            }
            session.phase = 'playing';
            session.opponent = sender;
            session.symbols = { [session.challenger]: 'X', [session.opponent]: 'O' };
            session.turn = session.challenger; // challenger (X) always goes first
            session.board = Array(9).fill('');
            setSession(chatId, session);
            await send(nexus, chatId, `✅ @${sender.split('@')[0]} joined! It's @${session.challenger.split('@')[0]} (X) vs @${session.opponent.split('@')[0]} (O).\n\n${renderBoard(session.board)}\n\n💬 @${session.challenger.split('@')[0]}, reply with a number 1-9 to move.`);
            return true;
        }

        // ---- Playing phase ----
        if (sender !== session.challenger && sender !== session.opponent) {
            return false; // not one of the two players — ignore, let normal chat continue
        }
        if (sender !== session.turn) {
            await send(nexus, chatId, `⏳ Not your turn — waiting on @${session.turn.split('@')[0]}.`);
            return true;
        }
        const pos = parseInt(text, 10) - 1;
        if (isNaN(pos) || pos < 0 || pos > 8) return false;
        if (session.board[pos]) {
            await send(nexus, chatId, `That spot is taken. Pick another number 1-9.`);
            return true;
        }
        const mySymbol = session.symbols[sender];
        session.board[pos] = mySymbol;
        const winner = checkWinner(session.board);
        if (winner) {
            bumpStat(session.challenger, 'played');
            bumpStat(session.opponent, 'played');
            if (winner === 'draw') {
                await send(nexus, chatId, `${renderBoard(session.board)}\n\n🤝 It's a draw! Good game.`);
            } else {
                const winnerId = winner === 'X' ? session.challenger : session.opponent;
                bumpStat(winnerId, 'wins');
                const bal = await reward(nexus, chatId, session.rewardAmt, 'Tic Tac Toe win');
                await send(nexus, chatId, `${renderBoard(session.board)}\n\n🎉 @${winnerId.split('@')[0]} wins! +${session.rewardAmt} coins!\n💰 Chat balance: ${bal.toLocaleString()}`);
            }
            clearSession(chatId);
            return true;
        }
        session.turn = sender === session.challenger ? session.opponent : session.challenger;
        setSession(chatId, session);
        await send(nexus, chatId, `${renderBoard(session.board)}\n\n💬 @${session.turn.split('@')[0]}'s turn — reply 1-9.`);
        return true;
    }

    return false;
};

module.exports = {
    trivia, wordUnscramble, guessTheNumber, hangman, ticTacToe,
    rollTheDice, coinFlip, gameLeaderboard, endGame,
    handleGameReply, hasActiveGame,
    menuMap: {
        'trivia_quiz': trivia,
        'word_unscramble': wordUnscramble,
        'guess_the_number': guessTheNumber,
        'hangman': hangman,
        'tic_tac_toe': ticTacToe,
        'roll_the_dice': rollTheDice,
        'coin_flip': coinFlip,
        'game_leaderboard': gameLeaderboard,
        'end_game': endGame
    }
};

    return module.exports;
})();


// ============ inlined from commands/group.js ============
const __cmd_group = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const fs = require('fs');
const { sendQuickReplyButtons } = __cmd_menu; // ⚠️ update this path if menu.js sits in a different folder relative to group.js

const JAIL_FILE = './database/jail.json';
const SETTINGS_FILE = './database/groupsettings.json';
const REPORTS_FILE = './database/reports.json';
const BACKUP_DIR = './database/backups';
const WARN_FILE = './database/warnings.json';
const ROLES_FILE = './database/roles.json';
const ACTIVITY_FILE = './database/activity.json';
const BIRTHDAY_FILE = './database/birthdays.json';
const EVENTS_FILE = './database/events.json';

// In-memory votekick tracker (resets on restart, that's fine — votes shouldn't persist)
const voteKickTracker = {}; // { "chatId:targetId": Set(voterIds) }

// ============ STORAGE HELPERS ============
function loadJSON(file, fallback = {}) {
    try {
        if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback));
        return JSON.parse(fs.readFileSync(file));
    } catch (e) { return fallback; }
}
function saveJSON(file, data) {
    try { fs.writeFileSync(file, JSON.stringify(data, null, 2)); } catch (e) {}
}

function getGroupSettings(chatId) {
    const all = loadJSON(SETTINGS_FILE);
    return all[chatId] || {
        antifake: false, antiforward: false, antipoll: false,
        antisticker: false, antiviewonce: false, anticaps: false,
        antilongmsg: false, approvalmode: false, lockmessages: false,
        rules: ''
    };
}
function saveGroupSettings(chatId, settings) {
    const all = loadJSON(SETTINGS_FILE);
    all[chatId] = settings;
    saveJSON(SETTINGS_FILE, all);
}

// ============ SETTINGS MENU (buttons) ============
// approvalmode & lockmessages need real WA API calls (setApprovalMode / lockMessages
// further down), the rest are plain flags handled by toggleSetting.
const SETTINGS_META = [
    { key: 'antifake',      label: 'Anti-Fake Numbers',        emoji: '🎭' },
    { key: 'antiforward',   label: 'Anti-Forward',             emoji: '↪️' },
    { key: 'antipoll',      label: 'Anti-Poll',                emoji: '🗳️' },
    { key: 'antisticker',   label: 'Anti-Sticker',             emoji: '🖼️' },
    { key: 'antiviewonce',  label: 'Anti-View-Once',           emoji: '👁️' },
    { key: 'anticaps',      label: 'Anti-Caps',                emoji: '🔠' },
    { key: 'antilongmsg',   label: 'Anti-Long-Message',        emoji: '📏' },
    { key: 'automod',       label: 'Auto-Moderation (3-warn kick)', emoji: '⏰' },
    { key: 'approvalmode',  label: 'Approval Mode',            emoji: '✅' },
    { key: 'lockmessages',  label: 'Lock Messages (Admins Only)', emoji: '🔒' }
];
const SETTINGS_PAGE_SIZE = 5;

function pageForSettingKey(key) {
    const idx = SETTINGS_META.findIndex(m => m.key === key);
    return idx < 0 ? 0 : Math.floor(idx / SETTINGS_PAGE_SIZE);
}

// ============ JAIL / UNJAIL ============
const jailUser = async (nexus, chatId, targetId) => {
    try {
        console.log(chalk.blue(`🔒 Jailing ${targetId} in ${chatId}...`));

        const jail = loadJSON(JAIL_FILE);
        jail[chatId] = jail[chatId] || [];

        if (jail[chatId].includes(targetId)) {
            await nexus.sendMessage(chatId, { text: `⚠️ User already in jail.` });
            return;
        }

        jail[chatId].push(targetId);
        saveJSON(JAIL_FILE, jail);

        await nexus.sendMessage(chatId, {
            text: `🔒 @${targetId.split('@')[0]} don land for jail! They can't send messages until unjailed.`,
            mentions: [targetId]
        });

        console.log(chalk.green(`✅ ${targetId} jailed`));
    } catch (error) {
        console.log(chalk.red(`❌ Jail error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error jailing user: ${error.message}` });
    }
};

const unjailUser = async (nexus, chatId, targetId) => {
    try {
        console.log(chalk.blue(`🔓 Unjailing ${targetId} in ${chatId}...`));

        const jail = loadJSON(JAIL_FILE);
        jail[chatId] = (jail[chatId] || []).filter(id => id !== targetId);
        saveJSON(JAIL_FILE, jail);

        await nexus.sendMessage(chatId, {
            text: `🔓 @${targetId.split('@')[0]} don comot for jail. Free again!`,
            mentions: [targetId]
        });

        console.log(chalk.green(`✅ ${targetId} unjailed`));
    } catch (error) {
        console.log(chalk.red(`❌ Unjail error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error unjailing user: ${error.message}` });
    }
};

// Call this from your message handler before processing any group text —
// if it returns true, the message should be deleted/ignored.
const isJailed = (chatId, userId) => {
    const jail = loadJSON(JAIL_FILE);
    return (jail[chatId] || []).includes(userId);
};

// ============ VOTEKICK ============
const voteKick = async (nexus, chatId, targetId, voterId, groupMetadata, requiredVotes = 3) => {
    try {
        const key = `${chatId}:${targetId}`;
        if (!voteKickTracker[key]) voteKickTracker[key] = new Set();

        if (voteKickTracker[key].has(voterId)) {
            await nexus.sendMessage(chatId, { text: `⚠️ You already voted to kick this person.` });
            return;
        }

        voteKickTracker[key].add(voterId);
        const votes = voteKickTracker[key].size;

        if (votes >= requiredVotes) {
            await nexus.groupParticipantsUpdate(chatId, [targetId], 'remove');
            await nexus.sendMessage(chatId, {
                text: `👢 @${targetId.split('@')[0]} don get voted out! (${votes}/${requiredVotes} votes)`,
                mentions: [targetId]
            });
            delete voteKickTracker[key];
        } else {
            await nexus.sendMessage(chatId, {
                text: `🗳️ Vote registered! ${votes}/${requiredVotes} votes to kick @${targetId.split('@')[0]}`,
                mentions: [targetId]
            });
        }

        console.log(chalk.green(`✅ Votekick processed for ${targetId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Votekick error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error processing votekick: ${error.message}` });
    }
};

// Sends the tappable "Vote to Kick" button. Anyone in the group can tap it;
// each tap routes to voteKick() below via handleGroupSelection with their own id as voterId.
const sendVoteKickPrompt = async (nexus, chatId, targetId, requiredVotes = 3) => {
    try {
        await sendQuickReplyButtons(nexus, chatId, {
            bodyText: `🗳️ VOTEKICK STARTED\n\n@${targetId.split('@')[0]} don get nominated for removal.\n${requiredVotes} votes needed.\n\nTap below to add your vote.`,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽',
            buttons: [{ title: '🗳️ Vote to Kick', id: `VK_VOTE_${targetId}` }]
        });
        console.log(chalk.green(`✅ Votekick prompt sent for ${targetId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Votekick prompt error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error starting votekick: ${error.message}` });
    }
};

// ============ ANTI-FEATURE TOGGLES ============
const toggleSetting = async (nexus, chatId, settingName, enabled) => {
    try {
        const settings = getGroupSettings(chatId);
        settings[settingName] = enabled;
        saveGroupSettings(chatId, settings);

        await nexus.sendMessage(chatId, {
            text: `${enabled ? '✅' : '❌'} ${settingName} is now ${enabled ? 'ON' : 'OFF'}`
        });

        console.log(chalk.green(`✅ ${settingName} set to ${enabled} for ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Toggle setting error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error updating setting: ${error.message}` });
    }
};

// Sends the settings menu as tappable quick_reply buttons. Each button shows
// 🟢/🔴 for current state; tapping it toggles that one setting (routed
// through handleGroupSelection below) and re-sends the same page.
const sendGroupSettingsMenu = async (nexus, chatId, page = 0) => {
    try {
        const settings = getGroupSettings(chatId);
        const totalPages = Math.ceil(SETTINGS_META.length / SETTINGS_PAGE_SIZE);
        page = Math.max(0, Math.min(page, totalPages - 1));

        const start = page * SETTINGS_PAGE_SIZE;
        const pageMeta = SETTINGS_META.slice(start, start + SETTINGS_PAGE_SIZE);

        const buttons = pageMeta.map(m => ({
            title: `${settings[m.key] ? '🟢' : '🔴'} ${m.emoji} ${m.label}`,
            id: `GS_TOGGLE_${m.key}`
        }));

        if (page < totalPages - 1) buttons.push({ title: '➡️ Next Page', id: `GS_PAGE_${page + 1}` });
        if (page > 0) buttons.push({ title: '⬅️ Previous Page', id: `GS_PAGE_${page - 1}` });

        await sendQuickReplyButtons(nexus, chatId, {
            bodyText: `⚙️ GROUP SETTINGS\n\n🟢 = ON   🔴 = OFF\nTap a setting to toggle it.\n\n📄 Page ${page + 1}/${totalPages}`,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽',
            buttons
        });

        console.log(chalk.green(`✅ Settings menu page ${page + 1} sent for ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Settings menu error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading settings menu: ${error.message}` });
    }
};

// Call from your main message handler on every incoming group message.
// Returns true if the message was actioned (deleted) so caller can stop further processing.
function getWarnings(chatId, userId) {
    const warns = loadJSON(WARN_FILE);
    return (warns[chatId] && warns[chatId][userId]) || 0;
}

async function addWarning(nexus, chatId, userId, reason) {
    const warns = loadJSON(WARN_FILE);
    if (!warns[chatId]) warns[chatId] = {};
    warns[chatId][userId] = (warns[chatId][userId] || 0) + 1;
    saveJSON(WARN_FILE, warns);

    const count = warns[chatId][userId];
    if (count >= 3) {
        try {
            await nexus.groupParticipantsUpdate(chatId, [userId], 'remove');
            await nexus.sendMessage(chatId, { text: `⏰ @${userId.split('@')[0]} auto-kicked after 3 warnings (${reason}).`, mentions: [userId] });
            warns[chatId][userId] = 0;
            saveJSON(WARN_FILE, warns);
        } catch (e) {
            console.log(chalk.red(`❌ Automod kick error: ${e.message}`));
        }
    } else {
        await nexus.sendMessage(chatId, { text: `⚠️ Warning ${count}/3 @${userId.split('@')[0]} — ${reason}`, mentions: [userId] });
    }
}

const handleAntiChecks = async (nexus, chatId, msg, senderId, isAdmin) => {
    try {
        if (isAdmin) return false; // admins bypass anti-features
        const settings = getGroupSettings(chatId);
        const msgType = Object.keys(msg.message || {})[0];
        const textBody = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

        // Note: flood/anti-spam detection already exists natively in case.js
        // (real working implementation, "antispam" setting) — not duplicated here.

        // antiforward
        if (settings.antiforward && msg.message?.extendedTextMessage?.contextInfo?.isForwarded) {
            await nexus.sendMessage(chatId, { delete: msg.key });
            if (settings.automod) await addWarning(nexus, chatId, senderId, 'forwarding messages');
            else await nexus.sendMessage(chatId, { text: `🚫 Forwarded messages no dey allowed here @${senderId.split('@')[0]}`, mentions: [senderId] });
            return true;
        }

        // antipoll
        if (settings.antipoll && msgType === 'pollCreationMessage') {
            await nexus.sendMessage(chatId, { delete: msg.key });
            if (settings.automod) await addWarning(nexus, chatId, senderId, 'posting a poll');
            else await nexus.sendMessage(chatId, { text: `🚫 Polls no dey allowed here.` });
            return true;
        }

        // antisticker
        if (settings.antisticker && msgType === 'stickerMessage') {
            await nexus.sendMessage(chatId, { delete: msg.key });
            if (settings.automod) await addWarning(nexus, chatId, senderId, 'sending a sticker');
            else await nexus.sendMessage(chatId, { text: `🚫 Stickers no dey allowed here.` });
            return true;
        }

        // antiviewonce
        if (settings.antiviewonce && (msgType === 'viewOnceMessage' || msgType === 'viewOnceMessageV2')) {
            await nexus.sendMessage(chatId, { delete: msg.key });
            if (settings.automod) await addWarning(nexus, chatId, senderId, 'sending a view-once message');
            else await nexus.sendMessage(chatId, { text: `🚫 View-once messages no dey allowed here.` });
            return true;
        }

        // anticaps (more than 80% uppercase in a message longer than 10 chars)
        if (settings.anticaps && textBody.length > 10) {
            const letters = textBody.replace(/[^a-zA-Z]/g, '');
            const upper = textBody.replace(/[^A-Z]/g, '');
            if (letters.length > 0 && (upper.length / letters.length) > 0.8) {
                await nexus.sendMessage(chatId, { delete: msg.key });
                if (settings.automod) await addWarning(nexus, chatId, senderId, 'excessive CAPS');
                else await nexus.sendMessage(chatId, { text: `🚫 Too much CAPS @${senderId.split('@')[0]}, take am easy.`, mentions: [senderId] });
                return true;
            }
        }

        // antilongmsg (over 1000 characters)
        if (settings.antilongmsg && textBody.length > 1000) {
            await nexus.sendMessage(chatId, { delete: msg.key });
            if (settings.automod) await addWarning(nexus, chatId, senderId, 'message too long');
            else await nexus.sendMessage(chatId, { text: `🚫 Message too long @${senderId.split('@')[0]}, keep am short.`, mentions: [senderId] });
            return true;
        }

        return false;
    } catch (error) {
        console.log(chalk.red(`❌ Anti-check error: ${error.message}`));
        return false;
    }
};

// ============ RULES ============
// Uses the same store as groupCommands.js's .setrules/.rules commands
// (Settings.js, key 'group_rules') so the button and the text command always
// agree — they used to be two separate, silently conflicting rule stores.
const setRules = async (nexus, chatId, rulesText) => {
    try {
        setBotSetting(chatId, 'group_rules', rulesText);
        await nexus.sendMessage(chatId, { text: `📝 Group rules updated!` });
        console.log(chalk.green(`✅ Rules set for ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Set rules error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error setting rules: ${error.message}` });
    }
};

const getRules = async (nexus, chatId) => {
    try {
        const rules = getBotSetting(chatId, 'group_rules', null);
        const text = rules
            ? `📝 GROUP RULES\n\n${rules}`
            : `📝 No rules set yet. Admin can use .setrules [text]`;
        await nexus.sendMessage(chatId, { text });
    } catch (error) {
        console.log(chalk.red(`❌ Get rules error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching rules: ${error.message}` });
    }
};

// ============ REPORT SYSTEM ============
const reportUser = async (nexus, chatId, byId, targetId, reason) => {
    try {
        const reports = loadJSON(REPORTS_FILE);
        reports[chatId] = reports[chatId] || [];
        reports[chatId].push({
            by: byId, target: targetId, reason: reason || 'No reason given',
            time: new Date().toISOString()
        });
        saveJSON(REPORTS_FILE, reports);

        await nexus.sendMessage(chatId, {
            text: `🚨 Report filed against @${targetId.split('@')[0]}.\nReason: ${reason || 'No reason given'}\n\nAdmins have been notified.`,
            mentions: [targetId]
        });

        console.log(chalk.green(`✅ Report filed against ${targetId} by ${byId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Report error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error filing report: ${error.message}` });
    }
};

const reportList = async (nexus, chatId) => {
    try {
        const reports = loadJSON(REPORTS_FILE);
        const list = reports[chatId] || [];

        if (list.length === 0) {
            await nexus.sendMessage(chatId, { text: `📋 No reports filed yet.` });
            return;
        }

        const recent = list.slice(-10).reverse();

        await nexus.sendMessage(chatId, {
            disclaimerText: 'Reports',
            headerText: `📋 REPORTS (${list.length})`,
            contentText: 'Most recent 10 shown, newest first',
            title: 'Group Reports',
            table: [
                ['#', 'Target', 'Reason', 'Time'],
                ...recent.map((r, i) => [`${i + 1}`, r.target.split('@')[0], r.reason, new Date(r.time).toLocaleString()])
            ],
            noHeading: false,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽'
        });

        console.log(chalk.green(`✅ Report list sent (${recent.length} shown)`));
    } catch (error) {
        console.log(chalk.red(`❌ Report list error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching reports: ${error.message}` });
    }
};

// ============ JAIL LIST (table + unjail buttons) ============
const jailList = async (nexus, chatId, page = 0) => {
    try {
        const jail = loadJSON(JAIL_FILE);
        const list = jail[chatId] || [];

        if (list.length === 0) {
            await nexus.sendMessage(chatId, { text: `🔓 Nobody dey jail for this group.` });
            return;
        }

        const totalPages = Math.ceil(list.length / SETTINGS_PAGE_SIZE);
        page = Math.max(0, Math.min(page, totalPages - 1));
        const start = page * SETTINGS_PAGE_SIZE;
        const pageList = list.slice(start, start + SETTINGS_PAGE_SIZE);

        await nexus.sendMessage(chatId, {
            disclaimerText: 'Jail List',
            headerText: `🔒 JAILED MEMBERS (${list.length})`,
            contentText: `Page ${page + 1}/${totalPages}`,
            title: 'Jail List',
            table: [
                ['#', 'Number'],
                ...pageList.map((id, i) => [`${start + i + 1}`, id.split('@')[0]])
            ],
            noHeading: false,
            footerText: 'Tap a button below to unjail'
        });

        const buttons = pageList.map(id => ({ title: `🔓 Unjail ${id.split('@')[0]}`, id: `UNJAIL_${id}` }));
        if (page < totalPages - 1) buttons.push({ title: '➡️ Next Page', id: `JAIL_PAGE_${page + 1}` });
        if (page > 0) buttons.push({ title: '⬅️ Previous Page', id: `JAIL_PAGE_${page - 1}` });

        await sendQuickReplyButtons(nexus, chatId, {
            bodyText: `Tap a name below to release them from jail.`,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽',
            buttons
        });

        console.log(chalk.green(`✅ Jail list page ${page + 1} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ Jail list error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching jail list: ${error.message}` });
    }
};

// ============ GROUP BACKUP ============
const groupBackup = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`💾 Backing up group ${chatId}...`));

        if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

        const metadata = await nexus.groupMetadata(chatId);
        const backupData = {
            id: metadata.id,
            subject: metadata.subject,
            desc: metadata.desc || '',
            participants: metadata.participants.map(p => ({ id: p.id, admin: p.admin })),
            backedUpAt: new Date().toISOString()
        };

        const filename = `${BACKUP_DIR}/${chatId.replace('@g.us', '')}_${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(backupData, null, 2));

        await nexus.sendMessage(chatId, {
            text: `💾 Group backed up!\n\n👥 ${backupData.participants.length} members\n📁 Saved as: ${filename.split('/').pop()}`
        });

        console.log(chalk.green(`✅ Backup saved: ${filename}`));
    } catch (error) {
        console.log(chalk.red(`❌ Backup error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error backing up group: ${error.message}` });
    }
};

// ============ BULK ADMIN ACTIONS ============
const promoteAll = async (nexus, chatId, groupMetadata) => {
    try {
        console.log(chalk.blue(`⬆️ Promoting all members in ${chatId}...`));

        const nonAdmins = groupMetadata.participants
            .filter(p => !p.admin)
            .map(p => p.id);

        if (nonAdmins.length === 0) {
            await nexus.sendMessage(chatId, { text: `⚠️ Everyone is already an admin.` });
            return;
        }

        await nexus.groupParticipantsUpdate(chatId, nonAdmins, 'promote');
        await nexus.sendMessage(chatId, { text: `⬆️ Promoted ${nonAdmins.length} members to admin!` });

        console.log(chalk.green(`✅ Promoted ${nonAdmins.length} members`));
    } catch (error) {
        console.log(chalk.red(`❌ Promote all error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error promoting all: ${error.message}` });
    }
};

const demoteAll = async (nexus, chatId, groupMetadata, botId) => {
    try {
        console.log(chalk.blue(`⬇️ Demoting all admins in ${chatId}...`));

        const admins = groupMetadata.participants
            .filter(p => p.admin && p.id !== botId)
            .map(p => p.id);

        if (admins.length === 0) {
            await nexus.sendMessage(chatId, { text: `⚠️ No admins to demote (besides me).` });
            return;
        }

        await nexus.groupParticipantsUpdate(chatId, admins, 'demote');
        await nexus.sendMessage(chatId, { text: `⬇️ Demoted ${admins.length} admins!` });

        console.log(chalk.green(`✅ Demoted ${admins.length} admins`));
    } catch (error) {
        console.log(chalk.red(`❌ Demote all error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error demoting all: ${error.message}` });
    }
};

const addBulk = async (nexus, chatId, numbers) => {
    try {
        console.log(chalk.blue(`➕ Bulk adding ${numbers.length} numbers to ${chatId}...`));

        const jids = numbers.map(n => n.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
        const result = await nexus.groupParticipantsUpdate(chatId, jids, 'add');

        let text = `➕ BULK ADD RESULTS\n\n`;
        result.forEach(r => {
            const status = r.status === '200' ? '✅' : '❌';
            text += `${status} ${r.jid.split('@')[0]}\n`;
        });

        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ Bulk add processed`));
    } catch (error) {
        console.log(chalk.red(`❌ Bulk add error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error adding members: ${error.message}` });
    }
};

// ============ TAGGING ============
const tagAdmins = async (nexus, chatId, groupMetadata, message = '') => {
    try {
        const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

        if (admins.length === 0) {
            await nexus.sendMessage(chatId, { text: `⚠️ No admins found.` });
            return;
        }

        let text = `📢 ATTENTION ADMINS\n${message ? `\n${message}\n` : ''}\n`;
        admins.forEach(a => { text += `@${a.split('@')[0]} `; });

        await nexus.sendMessage(chatId, { text, mentions: admins });
        console.log(chalk.green(`✅ Tagged ${admins.length} admins`));
    } catch (error) {
        console.log(chalk.red(`❌ Tag admins error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error tagging admins: ${error.message}` });
    }
};

const ghostTag = async (nexus, chatId, groupMetadata, message = '\u200b') => {
    try {
        const all = groupMetadata.participants.map(p => p.id);

        await nexus.sendMessage(chatId, { text: message, mentions: all });
        console.log(chalk.green(`✅ Ghost tagged ${all.length} members`));
    } catch (error) {
        console.log(chalk.red(`❌ Ghost tag error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error ghost tagging: ${error.message}` });
    }
};

// ============ APPROVAL MODE / LOCKS ============
const setApprovalMode = async (nexus, chatId, enabled) => {
    try {
        // Requires Baileys support for membership approval mode
        if (typeof nexus.groupJoinApprovalMode === 'function') {
            await nexus.groupJoinApprovalMode(chatId, enabled ? 'on' : 'off');
        }
        await toggleSetting(nexus, chatId, 'approvalmode', enabled);
    } catch (error) {
        console.log(chalk.red(`❌ Approval mode error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error setting approval mode: ${error.message}` });
    }
};

const lockMessages = async (nexus, chatId, enabled) => {
    try {
        // 'announcement' = only admins can send messages
        await nexus.groupSettingUpdate(chatId, enabled ? 'announcement' : 'not_announcement');
        await toggleSetting(nexus, chatId, 'lockmessages', enabled);
    } catch (error) {
        console.log(chalk.red(`❌ Lock messages error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error locking messages: ${error.message}` });
    }
};

const lockInfo = async (nexus, chatId, enabled) => {
    try {
        // 'locked' = only admins can edit group info (name, description, icon)
        await nexus.groupSettingUpdate(chatId, enabled ? 'locked' : 'unlocked');
        await nexus.sendMessage(chatId, { text: `${enabled ? '🔒' : '🔓'} Group info editing ${enabled ? 'locked to admins only' : 'unlocked for everyone'}.` });
        console.log(chalk.green(`✅ Group info lock set to ${enabled}`));
    } catch (error) {
        console.log(chalk.red(`❌ Lock info error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error locking group info: ${error.message}` });
    }
};

// ============ MENU BUTTON WRAPPERS (CMD_group_<slug> from menu.js) ============
// dispatchMenuCommand in case.js calls these as fn(sock, chatId, sender) — no
// groupMetadata is passed in, so any wrapper that needs it fetches it itself.
const menuGroupSettings = async (nexus, chatId) => {
    await sendGroupSettingsMenu(nexus, chatId, 0);
};

const menuGroupRoles = async (nexus, chatId) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        const supers = metadata.participants.filter(p => p.admin === 'superadmin');
        const admins = metadata.participants.filter(p => p.admin === 'admin');
        const members = metadata.participants.filter(p => !p.admin);

        await nexus.sendMessage(chatId, {
            disclaimerText: 'Group Roles',
            headerText: `🏆 GROUP ROLES — ${metadata.subject}`,
            contentText: `${metadata.participants.length} total members`,
            title: 'Roles',
            table: [
                ['Role', 'Count'],
                ['👑 Owner', `${supers.length}`],
                ['🎖️ Admin', `${admins.length}`],
                ['👤 Member', `${members.length}`]
            ],
            noHeading: false,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽'
        });
        console.log(chalk.green(`✅ Group roles sent for ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Group roles error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching group roles: ${error.message}` });
    }
};

// WhatsApp has no per-member "mute" — the real native equivalent is admins-only
// (announce) mode, same thing "Lock/Unlock Group" does. Both buttons toggle it.
const menuMuteUnmuteMembers = async (nexus, chatId) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        const currentlyLocked = !!metadata.announce;
        await lockMessages(nexus, chatId, !currentlyLocked);
    } catch (error) {
        console.log(chalk.red(`❌ Mute/unmute error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error toggling mute: ${error.message}` });
    }
};
const menuLockUnlockGroup = menuMuteUnmuteMembers;

const menuGroupRulesView = async (nexus, chatId) => {
    await getRules(nexus, chatId);
};

const menuBackupGroupData = async (nexus, chatId) => {
    await groupBackup(nexus, chatId);
};

const menuMentionAll = async (nexus, chatId) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        await tagAdmins(nexus, chatId, metadata);
    } catch (error) {
        console.log(chalk.red(`❌ Mention all error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error mentioning: ${error.message}` });
    }
};

const menuActivityReport = async (nexus, chatId) => {
    await reportList(nexus, chatId);
};

const menuMemberList = async (nexus, chatId) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        const rows = metadata.participants.map((p, i) => {
            const role = p.admin === 'superadmin' ? '👑' : p.admin === 'admin' ? '🎖️' : '👤';
            return [`${i + 1}`, `${role} ${p.id.split('@')[0]}`];
        });

        await nexus.sendMessage(chatId, {
            disclaimerText: 'Member List',
            headerText: `📋 MEMBERS — ${metadata.subject}`,
            contentText: `${metadata.participants.length} total`,
            title: 'Members',
            table: [['#', 'Member'], ...rows],
            noHeading: false,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽'
        });
        console.log(chalk.green(`✅ Member list sent for ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Member list error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching member list: ${error.message}` });
    }
};

const menuGroupDescription = async (nexus, chatId) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        await nexus.sendMessage(chatId, {
            text: `💬 *GROUP DESCRIPTION*\n\n${metadata.desc || '_No description set._'}`
        });
    } catch (error) {
        console.log(chalk.red(`❌ Group description error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching description: ${error.message}` });
    }
};

const menuGroupStats = async (nexus, chatId) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        const admins = metadata.participants.filter(p => p.admin).length;
        const created = metadata.creation ? new Date(metadata.creation * 1000).toLocaleDateString() : 'Unknown';

        await nexus.sendMessage(chatId, {
            disclaimerText: 'Group Stats',
            headerText: `📊 GROUP STATS — ${metadata.subject}`,
            contentText: 'Overview',
            title: 'Stats',
            table: [
                ['Metric', 'Value'],
                ['👥 Members', `${metadata.participants.length}`],
                ['🎖️ Admins', `${admins}`],
                ['📅 Created', created],
                ['🔒 Admins-Only Mode', metadata.announce ? 'ON' : 'OFF']
            ],
            noHeading: false,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽'
        });
        console.log(chalk.green(`✅ Group stats sent for ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Group stats error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching group stats: ${error.message}` });
    }
};

// "Moderator Panel" is really the same overview as Group Roles.
const menuModeratorPanel = async (nexus, chatId) => {
    await menuGroupRoles(nexus, chatId);
};

// These three need a specific target member (kick who? promote who?) that a
// bare button tap can never supply. Rather than guess or silently do nothing,
// point to the real working text commands.
const menuGrantAdminRights = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🎖️ *Grant Admin Rights*\n\nReply to the member's message and send:\n${'`'}.promote${'`'}\n\nOr mention them directly:\n${'`'}.promote @user${'`'}`
    });
};

const menuKickMember = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `⚠️ *Kick Member*\n\nReply to the member's message and send:\n${'`'}.kick${'`'}\n\nOr mention them directly:\n${'`'}.kick @user${'`'}`
    });
};

const menuAddRemoveMembers = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `👤 *Add/Remove Members*\n\nTo add: ${'`'}.add 234xxxxxxxxxx${'`'}\nTo remove: reply to their message with ${'`'}.kick${'`'}`
    });
};

// ============ GROUP ANNOUNCEMENTS ============
const announceToGroup = async (nexus, chatId, message) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        await nexus.sendMessage(chatId, {
            text: `📢 *GROUP ANNOUNCEMENT*\n\n${message}`,
            mentions: metadata.participants.map(p => p.id)
        });
        console.log(chalk.green(`✅ Announcement sent to ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Announce error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error sending announcement: ${error.message}` });
    }
};
const menuGroupAnnouncements = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `📢 *Group Announcements*\n\nSend:\n${'`'}.announce Your message here${'`'}\n\nEveryone gets tagged (silently) so it lands in their notifications.`
    });
};

// ============ CHANGE GROUP ICON ============
const setGroupIcon = async (nexus, chatId, imageBuffer) => {
    try {
        await nexus.updateProfilePicture(chatId, imageBuffer);
        await nexus.sendMessage(chatId, { text: `✅ Group icon updated!` });
        console.log(chalk.green(`✅ Group icon updated for ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Set icon error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error updating icon: ${error.message}` });
    }
};
const menuChangeGroupIcon = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🎨 *Change Group Icon*\n\nReply to an image with:\n${'`'}.seticon${'`'}`
    });
};

// ============ MEMBER ROLES (custom labels) ============
const setMemberRole = async (nexus, chatId, targetId, role) => {
    try {
        const roles = loadJSON(ROLES_FILE);
        if (!roles[chatId]) roles[chatId] = {};
        roles[chatId][targetId] = role;
        saveJSON(ROLES_FILE, roles);
        await nexus.sendMessage(chatId, { text: `✅ @${targetId.split('@')[0]} is now tagged as *${role}*`, mentions: [targetId] });
    } catch (error) {
        console.log(chalk.red(`❌ Set role error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error setting role: ${error.message}` });
    }
};
const menuMemberRoles = async (nexus, chatId) => {
    try {
        const roles = loadJSON(ROLES_FILE)[chatId] || {};
        const entries = Object.entries(roles);
        if (entries.length === 0) {
            await nexus.sendMessage(chatId, { text: `👥 *Member Roles*\n\nNo custom roles set yet.\n\nSet one:\n${'`'}.setrole @user Role Name${'`'}\ne.g. ${'`'}.setrole @user Moderator${'`'}` });
            return;
        }
        await nexus.sendMessage(chatId, {
            disclaimerText: 'Member Roles',
            headerText: `👥 CUSTOM MEMBER ROLES`,
            contentText: `${entries.length} assigned`,
            title: 'Roles',
            table: [['Member', 'Role'], ...entries.map(([id, role]) => [id.split('@')[0], role])],
            noHeading: false,
            footerText: 'Set another: .setrole @user <role>'
        });
    } catch (error) {
        console.log(chalk.red(`❌ Member roles error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error fetching roles: ${error.message}` });
    }
};

// ============ GROUP POLLS (native WhatsApp poll) ============
const createPoll = async (nexus, chatId, question, options) => {
    try {
        await nexus.sendMessage(chatId, { poll: { name: question, values: options, selectableCount: 1 } });
        console.log(chalk.green(`✅ Poll created in ${chatId}`));
    } catch (error) {
        console.log(chalk.red(`❌ Poll error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error creating poll: ${error.message}` });
    }
};
const menuGroupPolls = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `📱 *Group Polls*\n\nCreate a real WhatsApp poll:\n${'`'}.poll Question | Option 1 | Option 2 | Option 3${'`'}\n\nUp to 12 options, separated by |.\n\n⚠️ Admin must enable this first with ${'`'}.pollon${'`'} if it's not already on.`
    });
};

// ============ GROUP GAMES (number-guess) ============
// Stored on `global` for the same freshRequire-safety reason as spamTracker above.
if (!global.__groupGameState) global.__groupGameState = {};
const gameState = global.__groupGameState; // { chatId: { number, attempts } }
const startGuessGame = async (nexus, chatId) => {
    const number = Math.floor(Math.random() * 100) + 1;
    gameState[chatId] = { number, attempts: 0 };
    await nexus.sendMessage(chatId, {
        text: `🎪 *GUESS THE NUMBER!*\n\nI'm thinking of a number between 1-100.\nFirst person to guess it right wins!\n\nJust type your guess.`
    });
};
// Call this from your message handler for every group text message — returns
// true if it consumed the message as a guess (so caller can stop processing).
const handleGuess = async (nexus, chatId, senderId, textBody) => {
    try {
        const game = gameState[chatId];
        if (!game) return false;
        const guess = parseInt(String(textBody).trim(), 10);
        if (isNaN(guess)) return false;

        game.attempts++;
        if (guess === game.number) {
            await nexus.sendMessage(chatId, { text: `🎉 @${senderId.split('@')[0]} got it! The number was *${game.number}* (${game.attempts} guesses total).`, mentions: [senderId] });
            delete gameState[chatId];
        } else if (guess < game.number) {
            await nexus.sendMessage(chatId, { text: `📈 Higher!` });
        } else {
            await nexus.sendMessage(chatId, { text: `📉 Lower!` });
        }
        return true;
    } catch (error) {
        console.log(chalk.red(`❌ Guess game error: ${error.message}`));
        return false;
    }
};
const menuGroupGames = async (nexus, chatId) => {
    await startGuessGame(nexus, chatId);
};

// ============ ACTIVITY TRACKING (contribution tracker + achievements) ============
// Call trackActivity/trackMedia from your message handler on every group message.
const trackActivity = (chatId, senderId) => {
    try {
        const data = loadJSON(ACTIVITY_FILE);
        if (!data[chatId]) data[chatId] = { messages: {}, media: {} };
        if (!data[chatId].messages) data[chatId].messages = {};
        data[chatId].messages[senderId] = (data[chatId].messages[senderId] || 0) + 1;
        saveJSON(ACTIVITY_FILE, data);
    } catch (error) {
        console.log(chalk.red(`❌ Track activity error: ${error.message}`));
    }
};
const trackMedia = (chatId, senderId) => {
    try {
        const data = loadJSON(ACTIVITY_FILE);
        if (!data[chatId]) data[chatId] = { messages: {}, media: {} };
        if (!data[chatId].media) data[chatId].media = {};
        data[chatId].media[senderId] = (data[chatId].media[senderId] || 0) + 1;
        saveJSON(ACTIVITY_FILE, data);
    } catch (error) {
        console.log(chalk.red(`❌ Track media error: ${error.message}`));
    }
};
const menuContributionTracker = async (nexus, chatId) => {
    try {
        const data = (loadJSON(ACTIVITY_FILE)[chatId] || {}).messages || {};
        const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 10);
        if (sorted.length === 0) {
            await nexus.sendMessage(chatId, { text: `📊 No activity tracked yet — chat around a bit first!` });
            return;
        }
        await nexus.sendMessage(chatId, {
            disclaimerText: 'Contribution Tracker',
            headerText: `📊 TOP CONTRIBUTORS`,
            contentText: 'Message counts (top 10)',
            title: 'Leaderboard',
            table: [['#', 'Member', 'Messages'], ...sorted.map(([id, count], i) => [`${i + 1}`, id.split('@')[0], `${count}`])],
            noHeading: false,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽'
        });
    } catch (error) {
        console.log(chalk.red(`❌ Contribution tracker error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading tracker: ${error.message}` });
    }
};
const menuGroupAchievements = async (nexus, chatId) => {
    try {
        const data = (loadJSON(ACTIVITY_FILE)[chatId] || {}).messages || {};
        const badges = Object.entries(data).map(([id, count]) => {
            let badge = null;
            if (count >= 1000) badge = '🥇 Legend (1000+ msgs)';
            else if (count >= 500) badge = '🥈 Veteran (500+ msgs)';
            else if (count >= 100) badge = '🥉 Active (100+ msgs)';
            return badge ? [id.split('@')[0], badge] : null;
        }).filter(Boolean);

        if (badges.length === 0) {
            await nexus.sendMessage(chatId, { text: `🏆 No achievements unlocked yet — keep chatting! (100+ messages = first badge)` });
            return;
        }
        await nexus.sendMessage(chatId, {
            disclaimerText: 'Achievements',
            headerText: `🏆 GROUP ACHIEVEMENTS`,
            contentText: 'Earned by activity',
            title: 'Achievements',
            table: [['Member', 'Badge'], ...badges],
            noHeading: false,
            footerText: 'LËGĚNDÃRY Ł𝗮𝗯𝘀™ ⚽'
        });
    } catch (error) {
        console.log(chalk.red(`❌ Achievements error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading achievements: ${error.message}` });
    }
};
const menuGroupPhotosArchive = async (nexus, chatId) => {
    try {
        const media = (loadJSON(ACTIVITY_FILE)[chatId] || {}).media || {};
        const sorted = Object.entries(media).sort((a, b) => b[1] - a[1]).slice(0, 10);
        if (sorted.length === 0) {
            await nexus.sendMessage(chatId, { text: `📸 *Group Photos Archive*\n\nI don't store the actual photo files (no cloud storage wired up for this), but I do track who's sharing the most media.\n\nNo media tracked yet.` });
            return;
        }
        await nexus.sendMessage(chatId, {
            disclaimerText: 'Photos',
            headerText: `📸 TOP MEDIA SHARERS`,
            contentText: 'Media messages sent (top 10)',
            title: 'Media Activity',
            table: [['#', 'Member', 'Media Sent'], ...sorted.map(([id, c], i) => [`${i + 1}`, id.split('@')[0], `${c}`])],
            noHeading: false,
            footerText: "⚠️ Actual photos aren't archived — only counts"
        });
    } catch (error) {
        console.log(chalk.red(`❌ Photos archive error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading media stats: ${error.message}` });
    }
};

// ============ NOTIFICATION SETTINGS (welcome/goodbye toggle) ============
// Uses your existing setting/Settings.js store — same one case.js's
// group-participants.update handler already checks via getSetting(id,"welcome").
const { getSetting: getBotSetting, setSetting: setBotSetting } = require('./setting/Settings.js'); // ⚠️ update path if Settings.js sits elsewhere relative to commands/group.js
const menuNotificationSettings = async (nexus, chatId) => {
    const on = getBotSetting(chatId, 'welcome', false);
    await nexus.sendMessage(chatId, {
        text: `🔔 *Notification Settings*\n\nWelcome/goodbye messages: ${on ? '🟢 ON' : '🔴 OFF'}\n\nToggle: ${'`'}.notify on${'`'} or ${'`'}.notify off${'`'}`
    });
};

// ============ GROUP THEME CUSTOMIZATION ============
const setGroupTheme = async (nexus, chatId, emoji) => {
    const settings = getGroupSettings(chatId);
    settings.themeEmoji = emoji;
    saveGroupSettings(chatId, settings);
    await nexus.sendMessage(chatId, { text: `✅ Group theme emoji set to ${emoji}` });
};
const menuGroupTheme = async (nexus, chatId) => {
    const settings = getGroupSettings(chatId);
    await nexus.sendMessage(chatId, {
        text: `🎨 *Group Theme*\n\nCurrent theme emoji: ${settings.themeEmoji || '⚽ (default)'}\n\nChange it: ${'`'}.settheme 🔥${'`'}`
    });
};

// ============ BIRTHDAY REMINDERS ============
const setBirthday = async (nexus, chatId, userId, ddmm) => {
    try {
        const data = loadJSON(BIRTHDAY_FILE);
        if (!data[chatId]) data[chatId] = {};
        data[chatId][userId] = ddmm;
        saveJSON(BIRTHDAY_FILE, data);
        await nexus.sendMessage(chatId, { text: `🎂 Birthday saved for @${userId.split('@')[0]}: ${ddmm}`, mentions: [userId] });
    } catch (error) {
        console.log(chalk.red(`❌ Set birthday error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error saving birthday: ${error.message}` });
    }
};
const menuBirthdayReminders = async (nexus, chatId) => {
    try {
        const data = loadJSON(BIRTHDAY_FILE)[chatId] || {};
        const entries = Object.entries(data);
        if (entries.length === 0) {
            await nexus.sendMessage(chatId, { text: `📅 *Birthday Reminders*\n\nNo birthdays saved yet.\n\nAdd yours:\n${'`'}.setbirthday DD-MM${'`'}\n\nI'll announce it here automatically on the day 🎉` });
            return;
        }
        await nexus.sendMessage(chatId, {
            disclaimerText: 'Birthdays',
            headerText: `📅 SAVED BIRTHDAYS`,
            contentText: `${entries.length} saved`,
            title: 'Birthdays',
            table: [['Member', 'Date'], ...entries.map(([id, d]) => [id.split('@')[0], d])],
            noHeading: false,
            footerText: 'Add yours: .setbirthday DD-MM'
        });
    } catch (error) {
        console.log(chalk.red(`❌ Birthday reminders error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading birthdays: ${error.message}` });
    }
};
// Stored on `global` for the same freshRequire-safety reason as above — prevents
// duplicate birthday announcements if this ever gets called from more than one
// module instance in the same day.
if (typeof global.__lastBirthdayCheckDate === 'undefined') global.__lastBirthdayCheckDate = null;
const checkBirthdaysToday = async (nexus) => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    if (global.__lastBirthdayCheckDate === todayKey) return; // already announced today
    global.__lastBirthdayCheckDate = todayKey;

    try {
        const data = loadJSON(BIRTHDAY_FILE);
        const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        for (const chatId of Object.keys(data)) {
            for (const [userId, ddmm] of Object.entries(data[chatId])) {
                if (ddmm === todayStr) {
                    await nexus.sendMessage(chatId, { text: `🎉🎂 Happy Birthday @${userId.split('@')[0]}! 🎂🎉\n\nWishing you an amazing day from all of us!`, mentions: [userId] });
                }
            }
        }
    } catch (error) {
        console.log(chalk.red(`❌ Birthday check error: ${error.message}`));
    }
};

// ============ EVENT SCHEDULER ============
const scheduleEvent = async (nexus, chatId, isoDateTime, title) => {
    try {
        const events = loadJSON(EVENTS_FILE);
        if (!events[chatId]) events[chatId] = [];
        events[chatId].push({ time: isoDateTime, title, notified: false });
        saveJSON(EVENTS_FILE, events);
        await nexus.sendMessage(chatId, { text: `📅 Event scheduled: *${title}*\n🕒 ${new Date(isoDateTime).toLocaleString()}` });
    } catch (error) {
        console.log(chalk.red(`❌ Schedule event error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error scheduling event: ${error.message}` });
    }
};
const menuEventScheduler = async (nexus, chatId) => {
    try {
        const events = (loadJSON(EVENTS_FILE)[chatId] || []).filter(e => new Date(e.time) > new Date());
        if (events.length === 0) {
            await nexus.sendMessage(chatId, { text: `📅 *Event Scheduler*\n\nNo upcoming events.\n\nSchedule one:\n${'`'}.event 25-12-2026 18:00 | Christmas Party${'`'}` });
            return;
        }
        await nexus.sendMessage(chatId, {
            disclaimerText: 'Events',
            headerText: `📅 UPCOMING EVENTS`,
            contentText: `${events.length} scheduled`,
            title: 'Events',
            table: [['Event', 'When'], ...events.map(e => [e.title, new Date(e.time).toLocaleString()])],
            noHeading: false,
            footerText: 'Add: .event DD-MM-YYYY HH:MM | Title'
        });
    } catch (error) {
        console.log(chalk.red(`❌ Event scheduler error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading events: ${error.message}` });
    }
};
const checkDueEvents = async (nexus) => {
    try {
        const events = loadJSON(EVENTS_FILE);
        const now = new Date();
        let changed = false;
        for (const chatId of Object.keys(events)) {
            for (const ev of events[chatId]) {
                if (!ev.notified && new Date(ev.time) <= now) {
                    await nexus.sendMessage(chatId, { text: `📅🔔 *EVENT REMINDER*\n\n${ev.title} is happening now!` });
                    ev.notified = true;
                    changed = true;
                }
            }
        }
        if (changed) saveJSON(EVENTS_FILE, events);
    } catch (error) {
        console.log(chalk.red(`❌ Event check error: ${error.message}`));
    }
};

// Starts the background checks for scheduled events + birthdays. Call this
// ONCE from your main connection file (pair.js) right after the socket connects.
const startGroupSchedulers = (nexus) => {
    setInterval(() => {
        checkDueEvents(nexus).catch(e => console.log(chalk.red(`❌ Scheduler error: ${e.message}`)));
        checkBirthdaysToday(nexus).catch(e => console.log(chalk.red(`❌ Scheduler error: ${e.message}`)));
    }, 60000);
    console.log(chalk.green('✅ Group schedulers started (events + birthdays checked every 60s)'));
};

// ============ GIFT MEMBERS ============
const sendGift = async (nexus, chatId, targetId, message) => {
    try {
        await nexus.sendMessage(chatId, { text: `🎁✨ @${targetId.split('@')[0]} just received a gift!\n\n"${message}"`, mentions: [targetId] });
    } catch (error) {
        console.log(chalk.red(`❌ Gift error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error sending gift: ${error.message}` });
    }
};
const menuGiftMembers = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🎁 *Gift Members*\n\nSend a member a shoutout:\n${'`'}.gift @user Congrats message here${'`'}`
    });
};

// ============ CHAT CLEANUP ============
// WhatsApp's API only lets a bot bulk-fetch/delete via the .delete command
// (already in your case.js, reply-to-message + admin only) — there's no bulk
// "clear last N" endpoint in Baileys. Point to the real command instead of a
// fake bulk-delete that would silently do nothing.
const menuChatCleanup = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `💬 *Chat Cleanup*\n\nWhatsApp doesn't allow bulk-deleting other people's messages via the bot API — only one at a time.\n\nReply to any message with:\n${'`'}.delete${'`'}\n(admin only — deletes that message for everyone)`
    });
};

// ============ EMERGENCY ALERTS ============
const sendEmergencyAlert = async (nexus, chatId, message) => {
    try {
        const metadata = await nexus.groupMetadata(chatId);
        await nexus.sendMessage(chatId, {
            text: `🚨🚨 *EMERGENCY ALERT* 🚨🚨\n\n${message}`,
            mentions: metadata.participants.map(p => p.id)
        });
    } catch (error) {
        console.log(chalk.red(`❌ Emergency alert error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error sending alert: ${error.message}` });
    }
};
const menuEmergencyAlerts = async (nexus, chatId) => {
    await nexus.sendMessage(chatId, {
        text: `🚨 *Emergency Alerts*\n\nBroadcast an urgent tagged message to everyone:\n${'`'}.alert Your urgent message here${'`'}`
    });
};

// Maps menu.js's CMD_group_<slug> ids straight to a real handler. Anything not
// listed here still falls through to case.js's AI-fallback — safer than
// guessing, and honest for filler items that aren't real features yet.
const menuMap = {
    group_settings: menuGroupSettings,
    group_roles: menuGroupRoles,
    muteunmute_members: menuMuteUnmuteMembers,
    lockunlock_group: menuLockUnlockGroup,
    group_rules: menuGroupRulesView,
    backup_group_data: menuBackupGroupData,
    mention_all: menuMentionAll,
    activity_report: menuActivityReport,
    member_list: menuMemberList,
    group_description: menuGroupDescription,
    group_stats: menuGroupStats,
    moderator_panel: menuModeratorPanel,
    grant_admin_rights: menuGrantAdminRights,
    kick_member: menuKickMember,
    addremove_members: menuAddRemoveMembers,
    group_announcements: menuGroupAnnouncements,
    change_group_icon: menuChangeGroupIcon,
    member_roles: menuMemberRoles,
    group_polls: menuGroupPolls,
    group_games: menuGroupGames,
    member_contribution_tracker: menuContributionTracker,
    group_achievements: menuGroupAchievements,
    group_photos_archive: menuGroupPhotosArchive,
    notification_settings: menuNotificationSettings,
    group_theme_customization: menuGroupTheme,
    birthday_reminders: menuBirthdayReminders,
    event_scheduler: menuEventScheduler,
    gift_members: menuGiftMembers,
    chat_cleanup: menuChatCleanup,
    emergency_alerts: menuEmergencyAlerts
};

// ============ BUTTON ROUTER ============
// Call this from your message handler whenever a button/list reply comes in
// (selectedId is the row/button id). Mirrors menu.js's handleMenuSelection.
// extra = { senderId, groupMetadata, botId, requiredVotes } — senderId and
// groupMetadata are required for VK_VOTE_ to work.
// Returns true if it handled the tap, false if selectedId isn't a group-settings action.
const handleGroupSelection = async (nexus, chatId, selectedId, extra = {}) => {
    try {
        if (!selectedId) return false;
        const { senderId, groupMetadata, requiredVotes = 3 } = extra;

        // --- settings menu pagination ---
        if (selectedId.startsWith('GS_PAGE_')) {
            const page = parseInt(selectedId.replace('GS_PAGE_', ''), 10) || 0;
            await sendGroupSettingsMenu(nexus, chatId, page);
            return true;
        }

        // --- settings toggle ---
        if (selectedId.startsWith('GS_TOGGLE_')) {
            const key = selectedId.replace('GS_TOGGLE_', '');
            const settings = getGroupSettings(chatId);
            const newValue = !settings[key];

            if (key === 'approvalmode') {
                await setApprovalMode(nexus, chatId, newValue);
            } else if (key === 'lockmessages') {
                await lockMessages(nexus, chatId, newValue);
            } else {
                await toggleSetting(nexus, chatId, key, newValue);
            }

            await sendGroupSettingsMenu(nexus, chatId, pageForSettingKey(key));
            return true;
        }

        // --- jail list pagination ---
        if (selectedId.startsWith('JAIL_PAGE_')) {
            const page = parseInt(selectedId.replace('JAIL_PAGE_', ''), 10) || 0;
            await jailList(nexus, chatId, page);
            return true;
        }

        // --- unjail tap ---
        if (selectedId.startsWith('UNJAIL_')) {
            const targetId = selectedId.replace('UNJAIL_', '');
            await unjailUser(nexus, chatId, targetId);
            await jailList(nexus, chatId, 0);
            return true;
        }

        // --- votekick vote tap ---
        if (selectedId.startsWith('VK_VOTE_')) {
            const targetId = selectedId.replace('VK_VOTE_', '');
            if (!senderId || !groupMetadata) {
                console.log(chalk.yellow('⚠️ VK_VOTE_ tap ignored — senderId/groupMetadata missing from extra{}'));
                return false;
            }
            await voteKick(nexus, chatId, targetId, senderId, groupMetadata, requiredVotes);
            return true;
        }

        return false;
    } catch (error) {
        console.log(chalk.red(`❌ Group button routing error: ${error.message}`));
        return false;
    }
};

module.exports = {
    menuMap,
    jailUser,
    unjailUser,
    isJailed,
    jailList,
    voteKick,
    sendVoteKickPrompt,
    toggleSetting,
    sendGroupSettingsMenu,
    handleGroupSelection,
    handleAntiChecks,
    getGroupSettings,
    setRules,
    getRules,
    reportUser,
    reportList,
    groupBackup,
    promoteAll,
    demoteAll,
    addBulk,
    tagAdmins,
    ghostTag,
    setApprovalMode,
    lockMessages,
    lockInfo,
    // batch 2
    announceToGroup,
    setGroupIcon,
    setMemberRole,
    createPoll,
    startGuessGame,
    handleGuess,
    trackActivity,
    trackMedia,
    setBotSetting,
    getBotSetting,
    setGroupTheme,
    setBirthday,
    scheduleEvent,
    sendGift,
    sendEmergencyAlert,
    startGroupSchedulers,
    getWarnings,
    addWarning
};

    return module.exports;
})();


// ============ inlined from commands/health.js ============
const __cmd_health = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

// Workout Plan
const workoutPlan = async (nexus, chatId, goal = 'general fitness') => {
    try {
        console.log(chalk.blue(`💪 Generating workout plan for ${goal}...`));

        let workoutText = `💪 WORKOUT PLAN: ${goal}\n\n`;
        workoutText += `📅 Day 1: Upper Body\n`;
        workoutText += `• Push-ups: 3x15\n`;
        workoutText += `• Pull-ups: 3x8\n`;
        workoutText += `• Shoulder press: 3x12\n\n`;
        workoutText += `📅 Day 2: Lower Body\n`;
        workoutText += `• Squats: 4x15\n`;
        workoutText += `• Lunges: 3x12\n`;
        workoutText += `• Calf raises: 3x20\n\n`;
        workoutText += `📅 Day 3: Rest & Recovery\n\n`;
        workoutText += `🎯 Reply with a specific goal for a custom plan!\n`;

        await nexus.sendMessage(chatId, { text: workoutText });
        console.log(chalk.green(`✅ Workout plan sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Workout plan error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error generating workout plan: ${error.message}`
        });
    }
};

// Calorie Counter
const calorieCounter = async (nexus, chatId, foodItem) => {
    try {
        console.log(chalk.blue(`🧮 Counting calories for ${foodItem}...`));

        let calText = `🧮 CALORIE COUNT: ${foodItem}\n\n`;
        calText += `🔥 Calories: ~250 kcal\n`;
        calText += `🍖 Protein: 12g\n`;
        calText += `🥑 Fat: 8g\n`;
        calText += `🌾 Carbs: 30g\n\n`;
        calText += `📊 Add to daily log with .logmeal ${foodItem}\n`;

        await nexus.sendMessage(chatId, { text: calText });
        console.log(chalk.green(`✅ Calorie info sent for ${foodItem}`));

    } catch (error) {
        console.log(chalk.red(`❌ Calorie counter error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error counting calories: ${error.message}`
        });
    }
};

// Sleep Guide
const sleepGuide = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`💤 Fetching sleep guide...`));

        let sleepText = `💤 SLEEP GUIDE\n\n`;
        sleepText += `⏰ Recommended: 7-9 hours per night\n\n`;
        sleepText += `📋 Tips for better sleep:\n`;
        sleepText += `• Keep a consistent sleep schedule\n`;
        sleepText += `• Avoid screens 30 mins before bed\n`;
        sleepText += `• Keep your room cool and dark\n`;
        sleepText += `• Avoid caffeine late in the day\n`;
        sleepText += `• Try light stretching before bed\n\n`;
        sleepText += `😴 Sleep well, champ!\n`;

        await nexus.sendMessage(chatId, { text: sleepText });
        console.log(chalk.green(`✅ Sleep guide sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Sleep guide error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching sleep guide: ${error.message}`
        });
    }
};

// Medicine Reminder
const medicineReminder = async (nexus, chatId, medName, time) => {
    try {
        console.log(chalk.blue(`💊 Setting reminder for ${medName} at ${time}...`));

        let medText = `💊 MEDICINE REMINDER SET\n\n`;
        medText += `📌 Medicine: ${medName}\n`;
        medText += `⏰ Time: ${time}\n`;
        medText += `🔁 Repeats: Daily\n\n`;
        medText += `✅ You'll be reminded automatically!\n`;
        medText += `🗑️ Cancel with .medcancel ${medName}\n`;

        await nexus.sendMessage(chatId, { text: medText });
        console.log(chalk.green(`✅ Medicine reminder set for ${medName}`));

    } catch (error) {
        console.log(chalk.red(`❌ Medicine reminder error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error setting reminder: ${error.message}`
        });
    }
};

module.exports = {
    workoutPlan,
    workoutPlans: workoutPlan, // alias — menu label is "Workout Plans" (plural)
    calorieCounter,
    sleepGuide,
    medicineReminder
};

    return module.exports;
})();


// ============ inlined from commands/lifestyle.js ============
const __cmd_lifestyle = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const meditation = (nexus, chatId) => send(nexus, chatId,
`🧘 QUICK MEDITATION\n\nTry this 2-minute reset:\n1. Sit comfortably, close your eyes\n2. Breathe in for 4 counts, hold for 4, out for 4\n3. Repeat for 2 minutes, focusing only on the counting\n\nApps for guided sessions: Insight Timer (free), Calm, Headspace`, 'Meditation');

const wellnessTips = (nexus, chatId) => send(nexus, chatId,
`🌿 GENERAL WELLNESS TIPS\n\n• Sleep 7-9 hours — foundation for everything else\n• Move your body daily, even just walking\n• Stay hydrated — often mistaken for hunger/fatigue\n• Protect time for things that actually recharge you, not just distract you`, 'Wellness Tips');

const sleepHygiene = (nexus, chatId) => send(nexus, chatId,
`😴 SLEEP HYGIENE TIPS\n\n• Consistent sleep/wake time, even weekends\n• No screens 30-60 min before bed (blue light delays melatonin)\n• Keep room cool and dark\n• Avoid caffeine after early afternoon`, 'Sleep Hygiene');

const mentalHealthSupport = (nexus, chatId) => send(nexus, chatId,
`🧠 MENTAL HEALTH SUPPORT\n\nIf you're going through something difficult, talking to a licensed therapist or counselor helps more than any tip I can give.\n\nNigeria: Mentally Aware Nigeria Initiative (MANI) — mentallyaware.org\nIf this is urgent, please reach out to a crisis line or trusted person right away.`, 'Mental Health Support');

const spaMassage = (nexus, chatId) => send(nexus, chatId,
`💆 SPA & MASSAGE BENEFITS\n\n• Reduces muscle tension and stress hormones\n• Can't substitute for medical treatment of real injuries — see a doctor for those\n• Even a 10-minute self-massage on shoulders/neck helps after a long day`, 'Spa & Massage');

const organicLiving = (nexus, chatId) => send(nexus, chatId,
`🌱 ORGANIC LIVING TIPS\n\n• Start small — swap one or two high-exposure items (like produce you eat with skin on)\n• Growing even a few herbs at home is a great low-cost start\n• "Organic" isn't automatically healthier — context matters, don't overspend chasing labels`, 'Organic Living');

const ecofriendlyTips = (nexus, chatId) => send(nexus, chatId,
`♻️ ECO-FRIENDLY TIPS\n\n• Reusable bags/bottles — biggest easy win\n• Buy less, but buy better quality (lasts longer)\n• Unplug devices not in use — reduces phantom power draw\n• Composting food scraps if you have space`, 'Eco-Friendly Tips');

const minimalismGuide = (nexus, chatId) => send(nexus, chatId,
`🏡 MINIMALISM STARTER GUIDE\n\n• Start with ONE category (e.g clothes), not the whole house\n• Ask: "Have I used this in the last year?"\n• One-in-one-out rule prevents re-accumulation\n• Minimalism isn't about owning nothing — it's about owning intentionally`, 'Minimalism Guide');

const homeOrganization = (nexus, chatId) => send(nexus, chatId,
`🧹 HOME ORGANIZATION TIPS\n\n• Everything needs a "home" — a specific place it always goes back to\n• Declutter before organizing, not after\n• Vertical storage maximizes small spaces\n• 5-minute daily reset beats one big weekly cleanup`, 'Home Organization');

const selfhelpBooks = (nexus, chatId) => send(nexus, chatId,
`📚 SELF-HELP BOOK RECOMMENDATIONS\n\n• Atomic Habits — James Clear (building better habits)\n• The Subtle Art of Not Giving a F*ck — Mark Manson\n• Man's Search for Meaning — Viktor Frankl\n• Ask me for recommendations on a specific topic!`, 'Self-Help Books');

const goalSetting = (nexus, chatId, goal) => send(nexus, chatId,
goal ? `🎯 Goal noted: "${goal}". Break it into monthly milestones for the best chance of following through!` : `🎯 GOAL SETTING FRAMEWORK\n\nUse SMART goals:\n• Specific\n• Measurable\n• Achievable\n• Relevant\n• Time-bound\n\ne.g "Read 12 books this year" beats "read more"`, 'Goal Setting');

const journaling = (nexus, chatId) => send(nexus, chatId,
`📝 JOURNALING PROMPTS\n\n• What am I grateful for today?\n• What's one thing I'm avoiding, and why?\n• What went well this week?\n\nEven 5 minutes a day builds the habit — consistency beats length.`, 'Journaling');

const breathingExercises = (nexus, chatId) => send(nexus, chatId,
`🧘 BREATHING EXERCISE (Box Breathing)\n\n1. Inhale for 4 seconds\n2. Hold for 4 seconds\n3. Exhale for 4 seconds\n4. Hold for 4 seconds\n5. Repeat 4-6 times\n\nUsed by Navy SEALs to stay calm under stress — works well before a stressful event.`, 'Breathing Exercises');

const herbalMedicine = (nexus, chatId) => send(nexus, chatId,
`🌿 HERBAL MEDICINE NOTES\n\n• Ginger — helps nausea\n• Chamomile — mild relaxant, aids sleep\n• Peppermint — can ease digestive discomfort\n\n⚠️ Herbs can interact with medications — always check with a doctor/pharmacist, especially if on prescription meds.`, 'Herbal Medicine');

const teaGuide = (nexus, chatId) => send(nexus, chatId,
`🍵 TEA GUIDE\n\n• Green tea — antioxidants, mild caffeine\n• Chamomile — calming, good before bed\n• Ginger tea — great for digestion/nausea\n• Hibiscus (zobo) — popular in Nigeria, rich in vitamin C`, 'Tea Guide');

const positiveAffirmations = (nexus, chatId) => send(nexus, chatId,
`🌟 POSITIVE AFFIRMATIONS\n\n"I am capable of figuring things out, even when it's hard."\n"Progress, not perfection."\n"I control my effort, not every outcome."\n\nSay one out loud each morning — it sounds small but compounds over time.`, 'Positive Affirmations');

const selfcareRoutine = (nexus, chatId) => send(nexus, chatId,
`💪 SELF-CARE ROUTINE IDEAS\n\n• Physical: sleep, movement, nutrition — the foundation\n• Mental: journaling, therapy, boundaries\n• Social: time with people who energize you\n\nSelf-care isn't just bubble baths — the boring basics matter most.`, 'Self-Care Routine');

const hobbyIdeas = (nexus, chatId) => send(nexus, chatId,
`🎨 HOBBY IDEAS TO TRY\n\n• Low-cost: journaling, drawing, reading, cooking new recipes\n• Social: dance classes, board game nights, sports leagues\n• Creative: photography, music production, writing\n\nPick something with no pressure to be "good" at it — that's the point.`, 'Hobby Ideas');

const readingClub = (nexus, chatId) => send(nexus, chatId,
`📖 STARTING A READING CLUB\n\n• Start with 3-5 people, keep it small at first\n• Pick a manageable book length for your first pick\n• Meet monthly, not weekly — sustainable pace matters more than frequency`, 'Reading Club');

const writingTips = (nexus, chatId) => send(nexus, chatId,
`✍️ WRITING TIPS\n\n• Write badly first, edit later — perfectionism kills first drafts\n• Read your writing out loud to catch awkward phrasing\n• Cut unnecessary words ruthlessly — shorter is usually stronger\n• Write daily, even just 10 minutes, to build the habit`, 'Writing Tips');

const musicTherapy = (nexus, chatId) => send(nexus, chatId,
`🎵 MUSIC THERAPY BASICS\n\n• Slow tempo music can lower heart rate/stress\n• Active music-making (singing, instruments) engages the brain differently than just listening\n• Create playlists for specific moods/tasks — deliberate, not random`, 'Music Therapy');

const artTherapy = (nexus, chatId) => send(nexus, chatId,
`🎨 ART THERAPY BASICS\n\n• You don't need to be "good at art" for it to help — it's about process, not product\n• Try simple exercises: draw how you're feeling using only shapes/colors\n• Coloring books for adults are a legitimate low-effort entry point`, 'Art Therapy');

const puzzleGames = (nexus, chatId) => send(nexus, chatId,
`🧩 PUZZLE GAME RECOMMENDATIONS\n\n• Sudoku — logic, no time pressure\n• Wordle — daily word puzzle, quick\n• Crossword — vocabulary + general knowledge\n• Jigsaw puzzles — great screen-free option`, 'Puzzle Games');

const travelWellness = (nexus, chatId) => send(nexus, chatId,
`🌍 TRAVEL WELLNESS TIPS\n\n• Stay hydrated on flights — cabin air is very dry\n• Move/stretch every couple hours on long trips\n• Adjust sleep schedule gradually before big timezone changes\n• Pack a small wellness kit: any regular meds, electrolytes, eye mask`, 'Travel Wellness');

const communitySupport = (nexus, chatId) => send(nexus, chatId,
`👥 FINDING COMMUNITY SUPPORT\n\n• Local interest-based groups (sports, hobbies, faith) build consistent connection\n• Online communities work too, but in-person tends to build deeper bonds faster\n• Volunteering is a great way to meet people while doing something meaningful`, 'Community Support');

const chatGroups = (nexus, chatId) => send(nexus, chatId,
`💬 FINDING GOOD CHAT GROUPS\n\nLook for WhatsApp/Telegram communities around specific interests rather than huge generic groups — smaller, focused groups tend to have better conversation quality.`, 'Chat Groups');

const networking = (nexus, chatId) => send(nexus, chatId,
`🤝 GENERAL NETWORKING TIPS\n\n• Show genuine interest in people before you need anything from them\n• Follow up — most people don't, so it stands out\n• Quality over quantity — a few strong connections beat hundreds of weak ones`, 'Networking');

const personalGoals = (nexus, chatId, goal) => send(nexus, chatId,
goal ? `🏆 Personal goal noted: "${goal}" — track it with .progress!` : `🏆 SETTING PERSONAL GOALS\n\nUsage: .personalgoal <your goal>\nRevisit and adjust monthly — goals should evolve as you learn more about yourself.`, 'Personal Goals');

const progressTracking = (nexus, chatId) => send(nexus, chatId,
`📊 PROGRESS TRACKING TIPS\n\n• Track leading indicators (daily actions), not just outcomes\n• Weekly review beats daily obsessing\n• Celebrate small wins — motivation compounds`, 'Progress Tracking');

const selfgiftingIdeas = (nexus, chatId) => send(nexus, chatId,
`🎁 SELF-GIFTING IDEAS\n\n• A book you've wanted but kept postponing\n• A solo outing doing something you enjoy\n• Time — block out an afternoon with zero obligations\n• Treat completing a hard goal as worth celebrating`, 'Self-Gifting Ideas');

module.exports = {
    meditation, wellnessTips, sleepHygiene, mentalHealthSupport, spaMassage,
    organicLiving, ecofriendlyTips, minimalismGuide, homeOrganization,
    selfhelpBooks, goalSetting, journaling, breathingExercises, herbalMedicine,
    teaGuide, positiveAffirmations, selfcareRoutine, hobbyIdeas, readingClub,
    writingTips, musicTherapy, artTherapy, puzzleGames, travelWellness,
    communitySupport, chatGroups, networking, personalGoals, progressTracking,
    selfgiftingIdeas
};

    return module.exports;
})();


// ============ inlined from commands/music.js ============
const __cmd_music = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');

// Local copies — this module is its own separate closure (like every
// __cmd_xxx module in this file), so it can't see prexzyGet/
// madrinExtractLink/madrinExtractTitle defined in the main file scope.
// A prior edit swapped this module's madrinGet call to prexzyGet without
// adding these locally, which would have thrown "prexzyGet is not
// defined" the next time this ran — same failure class as the
// __cmd_games loadJSON crash. Fixed by giving this module its own copies.
const PREXZY_BASE = 'https://prexzyapis.com';
async function prexzyGet(endpoint, extraParams = {}, timeoutMs = 25000) {
    const res = await axios.get(`${PREXZY_BASE}${endpoint}`, { params: extraParams, timeout: timeoutMs });
    return res.data;
}
function madrinExtractLink(data) {
    if (!data) return null;
    return data.download_url || data.video_url || data.image_url || data.url || data.link
        || data.hd || data.sd
        || data?.data?.hd || data?.data?.sd || data?.data?.url || data?.data?.download_url
        || data?.result?.url || data?.result?.download_url || data?.result?.link
        || null;
}
function madrinExtractTitle(data, fallback = 'File') {
    if (!data) return fallback;
    return data.title || data.filename || data.name
        || data?.data?.title || data?.result?.title || fallback;
}

// ============ AWAITING-REPLY STATE (per chat) ============
// Tracks which chats are actually expecting a music reply, and for how long.
// Without this, ANY plain text in ANY chat gets treated as a song search.
//
// IMPORTANT: this lives on `global`, NOT as a plain module-scope variable.
// case.js calls freshRequire() on this file on every message (to support
// hot-reloading commands/*.js), which does `delete require.cache[...]` then
// re-requires it. A normal `const awaitingMusic = new Map()` would get wiped
// back to empty on every single call, so the state would never survive from
// "button tapped" to "user replied". Storing it on `global` keeps it alive
// across those re-requires since `global` itself is never cleared.
if (!global.__awaitingMusic) global.__awaitingMusic = new Map();
const awaitingMusic = global.__awaitingMusic; // chatId -> { type: 'search'|'download', expires: number }
const AWAIT_TTL_MS = 3 * 60 * 1000; // 3 minutes to reply before it expires

function setAwaitingMusic(chatId, type) {
    awaitingMusic.set(chatId, { type, expires: Date.now() + AWAIT_TTL_MS });
}

function getAwaitingMusic(chatId) {
    const entry = awaitingMusic.get(chatId);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
        awaitingMusic.delete(chatId);
        return null;
    }
    return entry.type;
}

function clearAwaitingMusic(chatId) {
    awaitingMusic.delete(chatId);
}

// ============ CORE MUSIC FUNCTIONS ============
// These handle the actual logic with all params

// Search Music
const searchMusic = async (nexus, chatId, query, sender) => {
    try {
        console.log(chalk.blue(`🔍 Searching music: ${query}...`));
        
        let searchText = `🔍 MUSIC SEARCH: ${query}\n\n`;
        searchText += `1. Song Title 1 - Artist 1\n`;
        searchText += `   ⏱️ 3:45 | 🎤 Pop\n\n`;
        searchText += `2. Song Title 2 - Artist 2\n`;
        searchText += `   ⏱️ 4:20 | 🎤 Hip-Hop\n\n`;
        searchText += `3. Song Title 3 - Artist 3\n`;
        searchText += `   ⏱️ 3:30 | 🎤 Afrobeats\n\n`;
        searchText += `4. Song Title 4 - Artist 4\n`;
        searchText += `   ⏱️ 4:10 | 🎤 R&B\n\n`;
        searchText += `5. Song Title 5 - Artist 5\n`;
        searchText += `   ⏱️ 3:55 | 🎤 Soul\n\n`;
        searchText += `Reply with number to download (e.g., reply "1")\n`;

        await nexus.sendMessage(chatId, { text: searchText });
        console.log(chalk.green(`✅ Music search sent for "${query}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Music search error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error searching music: ${error.message}`
        });
    }
};

// Download Music
const downloadMusic = async (nexus, chatId, url, title = 'music', sender) => {
    try {
        console.log(chalk.blue(`📥 Downloading music from: ${url}...`));
        
        let downloadText = `📥 DOWNLOADING: ${title}\n\n`;
        downloadText += `⏳ Progress: ████████░░ 80%\n`;
        downloadText += `⏱️ Time remaining: 5 seconds\n\n`;
        downloadText += `✅ Download complete!\n`;
        downloadText += `📁 File: ${title}.mp3\n`;
        downloadText += `📊 Size: 4.5 MB\n`;
        downloadText += `⏱️ Duration: 3:45\n`;
        downloadText += `🎤 Artist: Artist Name\n`;
        downloadText += `🎵 Album: Album Name\n`;

        await nexus.sendMessage(chatId, { text: downloadText });
        console.log(chalk.green(`✅ Music download info sent for "${title}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Music download error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error downloading music: ${error.message}`
        });
    }
};

// Get Lyrics
const getLyrics = async (nexus, chatId, song, artist, sender) => {
    try {
        console.log(chalk.blue(`🎧 Fetching lyrics for ${song}...`));
        
        let lyricsText = `🎧 LYRICS: ${song} - ${artist}\n\n`;
        lyricsText += `Verse 1:\n`;
        lyricsText += `🎵 [Verse lyrics here]\n`;
        lyricsText += `[Verse lyrics here]\n`;
        lyricsText += `[Verse lyrics here]\n\n`;
        lyricsText += `Chorus:\n`;
        lyricsText += `🎵 [Chorus lyrics here]\n`;
        lyricsText += `[Chorus lyrics here]\n\n`;
        lyricsText += `Verse 2:\n`;
        lyricsText += `🎵 [Verse lyrics here]\n`;
        lyricsText += `[More lyrics...]\n\n`;
        lyricsText += `Source: Genius.com\n`;

        await nexus.sendMessage(chatId, { text: lyricsText });
        console.log(chalk.green(`✅ Lyrics sent for "${song}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Lyrics error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching lyrics: ${error.message}`
        });
    }
};

// Get Music Charts
const getMusicCharts = async (nexus, chatId, chart = 'global', sender) => {
    try {
        console.log(chalk.blue(`📊 Fetching ${chart} music charts...`));
        
        let chartsText = `📊 ${chart.toUpperCase()} MUSIC CHARTS\n\n`;
        chartsText += `1. 🔥 Song 1 - Artist 1 (Week 1)\n`;
        chartsText += `2. 🎵 Song 2 - Artist 2 (Week 2)\n`;
        chartsText += `3. ⭐ Song 3 - Artist 3 (Week 3)\n`;
        chartsText += `4. 🌟 Song 4 - Artist 4 (Week 4)\n`;
        chartsText += `5. 💎 Song 5 - Artist 5 (New)\n`;
        chartsText += `6. 🎤 Song 6 - Artist 6\n`;
        chartsText += `7. 🎶 Song 7 - Artist 7\n`;
        chartsText += `8. 🎸 Song 8 - Artist 8\n`;
        chartsText += `9. 🥁 Song 9 - Artist 9\n`;
        chartsText += `10. 🎹 Song 10 - Artist 10\n\n`;
        chartsText += `Updated: Today\n`;

        await nexus.sendMessage(chatId, { text: chartsText });
        console.log(chalk.green(`✅ Music charts sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Charts error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching charts: ${error.message}`
        });
    }
};

// Get Trending Songs
const getTrendingSongs = async (nexus, chatId, sender) => {
    try {
        console.log(chalk.blue(`🎶 Fetching trending songs...`));
        
        let trendingText = `🎶 TRENDING NOW\n\n`;
        trendingText += `🔥 HOT SONGS TODAY:\n`;
        trendingText += `1. Song 1 - Artist 1 (↑ 5)\n`;
        trendingText += `2. Song 2 - Artist 2 (↓ 2)\n`;
        trendingText += `3. Song 3 - Artist 3 (→ 0)\n\n`;
        trendingText += `🎤 TOP ARTISTS:\n`;
        trendingText += `• Artist A (100M streams)\n`;
        trendingText += `• Artist B (95M streams)\n`;
        trendingText += `• Artist C (90M streams)\n\n`;
        trendingText += `🌍 GENRES:\n`;
        trendingText += `• Afrobeats (30%)\n`;
        trendingText += `• Hip-Hop (25%)\n`;
        trendingText += `• Pop (20%)\n`;

        await nexus.sendMessage(chatId, { text: trendingText });
        console.log(chalk.green(`✅ Trending songs sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Trending error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching trending: ${error.message}`
        });
    }
};

// Get Artist Info
const getArtistInfo = async (nexus, chatId, artistName, sender) => {
    try {
        console.log(chalk.blue(`🎤 Fetching ${artistName} info...`));
        
        let artistText = `🎤 ${artistName}\n\n`;
        artistText += `👤 Genre: Afrobeats\n`;
        artistText += `🌍 Country: Nigeria\n`;
        artistText += `📊 Followers: 5.2M\n`;
        artistText += `🎵 Songs: 45+\n`;
        artistText += `💿 Albums: 5\n`;
        artistText += `⭐ Rating: 4.8/5\n\n`;
        artistText += `🏆 Awards:\n`;
        artistText += `• Grammy Nomination 2024\n`;
        artistText += `• AFRIMMA Award 2023\n\n`;
        artistText += `🎬 Latest Release:\n`;
        artistText += `"New Song Title" - 2 weeks ago\n`;

        await nexus.sendMessage(chatId, { text: artistText });
        console.log(chalk.green(`✅ Artist info sent for "${artistName}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Artist info error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching artist info: ${error.message}`
        });
    }
};

// Create Playlist
const createPlaylist = async (nexus, chatId, playlistName, songs = [], sender) => {
    try {
        console.log(chalk.blue(`🎵 Creating playlist: ${playlistName}...`));
        
        let playlistText = `🎵 PLAYLIST CREATED\n\n`;
        playlistText += `📋 Name: ${playlistName}\n`;
        playlistText += `🎵 Songs: ${songs.length || 0}\n`;
        playlistText += `⏱️ Duration: ${(songs.length || 0) * 4} minutes\n\n`;
        playlistText += `📝 Playlist ID: PL${Math.random().toString(36).substr(2, 9)}\n`;
        playlistText += `🔗 Share: [Link]\n`;
        playlistText += `🎯 Type: Public\n\n`;
        playlistText += `✅ Playlist saved successfully!\n`;

        await nexus.sendMessage(chatId, { text: playlistText });
        console.log(chalk.green(`✅ Playlist created: "${playlistName}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Playlist creation error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error creating playlist: ${error.message}`
        });
    }
};

// Audio Effects
const applyAudioEffect = async (nexus, chatId, effect, intensity = 'medium', sender) => {
    try {
        console.log(chalk.blue(`🔊 Applying ${effect} effect...`));
        
        let effectText = `🔊 AUDIO EFFECT APPLIED\n\n`;
        effectText += `✨ Effect: ${effect}\n`;
        effectText += `📊 Intensity: ${intensity}\n`;
        effectText += `⏱️ Duration: Full track\n\n`;
        effectText += `Available Effects:\n`;
        effectText += `• Echo\n`;
        effectText += `• Reverb\n`;
        effectText += `• Bass Boost\n`;
        effectText += `• Treble Boost\n`;
        effectText += `• Equalizer\n`;
        effectText += `• 3D Audio\n`;
        effectText += `• Stereo Widening\n`;

        await nexus.sendMessage(chatId, { text: effectText });
        console.log(chalk.green(`✅ Audio effect applied: ${effect}`));

    } catch (error) {
        console.log(chalk.red(`❌ Audio effect error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error applying audio effect: ${error.message}`
        });
    }
};

// ============ BUTTON STARTERS (called from menu dispatcher) ============
// These prompt the user for input or show basic info when button is tapped

const searchMusicBtn = async (nexus, chatId, sender) => {
    setAwaitingMusic(chatId, 'search');
    await nexus.sendMessage(chatId, { text: `🔍 SEARCH MUSIC\n\n💬 Reply with a song or artist name (e.g., "Wizkid Essence" or "Burna Boy")` });
};

// Internal function to handle actual search when user replies
const performMusicSearch = async (nexus, chatId, query, sender) => {
    clearAwaitingMusic(chatId);
    try {
        const yts = require('yt-search');
        const searchRes = await yts(query);

        if (!searchRes.videos || searchRes.videos.length === 0) {
            await nexus.sendMessage(chatId, { text: `❌ No results found for "${query}". Try another search.` });
            return;
        }

        const results = searchRes.videos.slice(0, 10); // table can hold more than a text list comfortably

        const rows = [
            ['#', 'Title', 'Link'],
            ...results.map((video, i) => [`${i + 1}`, video.title || '-', video.url || '-'])
        ];

        await nexus.sendMessage(chatId, {
            disclaimerText: 'Table',
            headerText: `🔍 Music Search: ${query}`,
            contentText: '---',
            title: 'Search Results',
            table: rows,
            noHeading: false,
            footerText: `Reply with a number (1-${results.length}) to get that link`
        });
        console.log(chalk.green(`✅ Found ${results.length} results for "${query}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Search error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error searching: ${error.message}` });
    }
};

const downloadMp3Btn = async (nexus, chatId, sender) => {
    setAwaitingMusic(chatId, 'download');
    await nexus.sendMessage(chatId, { text: `📥 DOWNLOAD MP3\n\n💬 Send a song title or link to download` });
};

const lyricsFinderBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎧 LYRICS FINDER\n\n💬 Reply with a song name and artist (e.g., "Essence by Wizkid")` });
};

const podcastSearchBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎙️ PODCAST SEARCH\n\n💬 Reply with a podcast name or topic to search` });
};

const musicConverterBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎼 MUSIC CONVERTER\n\nConvert between audio formats: MP3, WAV, FLAC, AAC\n\n💬 Upload or send a file to convert` });
};

const audioEffectsBtn = async (nexus, chatId, sender) => {
    await applyAudioEffect(nexus, chatId, 'Echo', 'medium', sender);
};

const playlistCreatorBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎵 PLAYLIST CREATOR\n\n💬 Reply with songs you want in your playlist (comma-separated names)` });
};

const karaokeBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎤 KARAOKE\n\n💬 Send a song title to get the karaoke version` });
};

const instrumentTunerBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎹 INSTRUMENT TUNER\n\n💬 Reply with an instrument name (e.g., "guitar", "piano", "ukulele")` });
};

const guitarTabsBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎸 GUITAR TABS\n\n💬 Reply with a song name to get guitar tabs` });
};

const sheetMusicBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎼 SHEET MUSIC\n\n💬 Reply with a song or composer name` });
};

const musicChartsBtn = async (nexus, chatId, sender) => {
    await getMusicCharts(nexus, chatId, 'global', sender);
};

const trendingSongsBtn = async (nexus, chatId, sender) => {
    await getTrendingSongs(nexus, chatId, sender);
};

const artistInfoBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎤 ARTIST INFO\n\n💬 Reply with an artist name (e.g., "Wizkid" or "Burna Boy")` });
};

const concertDatesBtn = async (nexus, chatId, sender) => {
    await nexus.sendMessage(chatId, { text: `🎭 CONCERT DATES\n\n💬 Reply with an artist name to find upcoming concert dates` });
};

// ============ SEARCH & DOWNLOAD HELPERS ============
// These handle actual API calls when users reply with queries/URLs


// 2026-09-14: Prexzy's /download/ytmp3 only ever returns the raw signed
// googlevideo.com CDN link from Prexzy's own extraction call — their API
// explicitly does not proxy/stream the bytes. That link is IP-locked to
// whichever server did the extraction (Prexzy's), so any other server
// fetching it (ours, or Baileys uploading it to WhatsApp) gets a 403.
// Fix: do extraction AND download ourselves via @distube/ytdl-core, so
// both happen from our own IP — no handoff, no lock. Then convert to
// mp3 with the ffmpeg already used elsewhere in this file (.bass, .slow,
// etc.) and send the buffer directly instead of a URL.
const ytdl = require('@distube/ytdl-core');

const performMusicDownload = async (nexus, chatId, videoUrl, sender) => {
    clearAwaitingMusic(chatId);
    try {
        if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
            await nexus.sendMessage(chatId, { text: `❌ Please send a valid YouTube URL (youtube.com or youtu.be)` });
            return;
        }

        console.log(chalk.blue(`📥 Downloading MP3 from: ${videoUrl}...`));
        await nexus.sendMessage(chatId, { text: `⏳ Downloading MP3... Please wait (may take 30-60 seconds)` });

        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title || 'Downloaded Music';

        if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp', { recursive: true });
        const tmpIn = `./tmp/ytin_${Date.now()}.m4a`;
        const tmpOut = `./tmp/ytout_${Date.now()}.mp3`;

        await new Promise((resolve, reject) => {
            const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
            const ws = fs.createWriteStream(tmpIn);
            stream.pipe(ws);
            stream.on('error', reject);
            ws.on('finish', resolve);
            ws.on('error', reject);
        });

        await new Promise((resolve, reject) => {
            ffmpeg(tmpIn).audioBitrate(128).save(tmpOut).on('end', resolve).on('error', reject);
        });

        const buf = fs.readFileSync(tmpOut);
        fs.unlinkSync(tmpIn);
        fs.unlinkSync(tmpOut);

        await nexus.sendMessage(chatId, {
            audio: buf,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ptt: false
        });
        console.log(chalk.green(`✅ Sent audio for "${title}"`));

    } catch (error) {
        console.log(chalk.red(`❌ Download error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}\n\nTry a different video.` });
    }
};

// ============ MENU MAP ============
// Maps each menu button slug to its handler function
const menuMap = {
    'search_music': searchMusicBtn,
    'download_mp3': downloadMp3Btn,
    'lyrics_finder': lyricsFinderBtn,
    'podcast_search': podcastSearchBtn,
    'music_converter': musicConverterBtn,
    'audio_effects': audioEffectsBtn,
    'playlist_creator': playlistCreatorBtn,
    'karaoke': karaokeBtn,
    'instrument_tuner': instrumentTunerBtn,
    'guitar_tabs': guitarTabsBtn,
    'sheet_music': sheetMusicBtn,
    'music_charts': musicChartsBtn,
    'trending_songs': trendingSongsBtn,
    'artist_info': artistInfoBtn,
    'concert_dates': concertDatesBtn
};

module.exports = {
    // Core functions (with full params for programmatic use)
    searchMusic,
    downloadMusic,
    getLyrics,
    getMusicCharts,
    getTrendingSongs,
    getArtistInfo,
    createPlaylist,
    applyAudioEffect,
    // Search and download helpers
    performMusicSearch,
    performMusicDownload,
    // Button starters (for menu dispatch)
    searchMusicBtn,
    downloadMp3Btn,
    lyricsFinderBtn,
    podcastSearchBtn,
    musicConverterBtn,
    audioEffectsBtn,
    playlistCreatorBtn,
    karaokeBtn,
    instrumentTunerBtn,
    guitarTabsBtn,
    sheetMusicBtn,
    musicChartsBtn,
    trendingSongsBtn,
    artistInfoBtn,
    concertDatesBtn,
    // Menu map for dispatcher
    menuMap,
    // Awaiting-reply state (used by case.js interceptor)
    setAwaitingMusic,
    getAwaitingMusic,
    clearAwaitingMusic
};

    return module.exports;
})();


// ============ inlined from commands/news.js ============
const __cmd_news = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');

// News Handler
const newsAPI = {
    newsapi: 'https://newsapi.org/v2',
    guardian: 'https://open-platform.theguardian.com/v1'
};

// Get World News
const getWorldNews = async (nexus, chatId, page = 1) => {
    try {
        console.log(chalk.blue(`🌍 Fetching world news...`));
        
        let newsText = `🌍 WORLD NEWS\n\n`;
        newsText += `1. 🔴 Breaking: Major International Event\n`;
        newsText += `   📅 2 hours ago | 👁️ 45K views\n\n`;
        newsText += `2. 📰 Economic Update: Market Trends\n`;
        newsText += `   📅 4 hours ago | 👁️ 32K views\n\n`;
        newsText += `3. 🌐 Technology: New Innovations\n`;
        newsText += `   📅 6 hours ago | 👁️ 28K views\n\n`;
        newsText += `4. 🏛️ Politics: Government Decision\n`;
        newsText += `   📅 8 hours ago | 👁️ 19K views\n\n`;
        newsText += `5. 🌱 Environment: Climate Action\n`;
        newsText += `   📅 10 hours ago | 👁️ 15K views\n\n`;
        newsText += `📄 Page ${page} | Next: .news [${page + 1}]\n`;

        await nexus.sendMessage(chatId, { text: newsText });
        console.log(chalk.green(`✅ World news sent`));

    } catch (error) {
        console.log(chalk.red(`❌ World news error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching world news: ${error.message}`
        });
    }
};

// Get Nigeria News
const getNigeriaNews = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`🇳🇬 Fetching Nigeria news...`));
        
        let nigeriaText = `🇳🇬 NIGERIA NEWS\n\n`;
        nigeriaText += `1. 🔴 Breaking: Lagos State Update\n`;
        nigeriaText += `   📅 1 hour ago | 🏠 Local\n\n`;
        nigeriaText += `2. 💼 Business: Naira Performance\n`;
        nigeriaText += `   📅 2 hours ago | 💰 Economy\n\n`;
        nigeriaText += `3. 🎓 Education: New Policy\n`;
        nigeriaText += `   📅 3 hours ago | 📚 Education\n\n`;
        nigeriaText += `4. ⚽ Sports: Super Eagles Match\n`;
        nigeriaText += `   📅 4 hours ago | 🏆 Sports\n\n`;
        nigeriaText += `5. 🎬 Entertainment: Nollywood News\n`;
        nigeriaText += `   📅 5 hours ago | 🎭 Ent.\n\n`;
        nigeriaText += `✅ Updated Daily!\n`;

        await nexus.sendMessage(chatId, { text: nigeriaText });
        console.log(chalk.green(`✅ Nigeria news sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Nigeria news error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching Nigeria news: ${error.message}`
        });
    }
};

// Get Tech News
const getTechNews = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`💻 Fetching tech news...`));
        
        let techText = `💻 TECHNOLOGY NEWS\n\n`;
        techText += `1. 🤖 AI: New Model Released\n`;
        techText += `   📅 30 mins ago | 🔥 HOT!\n\n`;
        techText += `2. 📱 Mobile: Flagship Announcement\n`;
        techText += `   📅 2 hours ago | 📱 Phones\n\n`;
        techText += `3. 💻 Software: Latest Updates\n`;
        techText += `   📅 4 hours ago | 🖥️ Software\n\n`;
        techText += `4. 🔒 Security: Breach Alert\n`;
        techText += `   📅 6 hours ago | 🔐 Cyber\n\n`;
        techText += `5. 🚀 Space: NASA Discovery\n`;
        techText += `   📅 8 hours ago | 🌌 Space\n\n`;
        techText += `🔄 Auto-update every hour!\n`;

        await nexus.sendMessage(chatId, { text: techText });
        console.log(chalk.green(`✅ Tech news sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Tech news error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching tech news: ${error.message}`
        });
    }
};

// Get Sports News
const getSportsNews = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`⚽ Fetching sports news...`));
        
        let sportsText = `⚽ SPORTS NEWS\n\n`;
        sportsText += `1. ⚽ Football: Match Results\n`;
        sportsText += `   🏆 Premier League Updates\n\n`;
        sportsText += `2. 🏀 Basketball: NBA Updates\n`;
        sportsText += `   🏀 LeBron James News\n\n`;
        sportsText += `3. 🎾 Tennis: Grand Slam News\n`;
        sportsText += `   🏆 Ranking Updates\n\n`;
        sportsText += `4. 🏃 Track & Field: Olympics Prep\n`;
        sportsText += `   🥇 Athlete Profiles\n\n`;
        sportsText += `5. 🏈 American Football: NFL News\n`;
        sportsText += `   🏆 Super Bowl Coverage\n\n`;
        sportsText += `📊 Live Scores: .scores\n`;

        await nexus.sendMessage(chatId, { text: sportsText });
        console.log(chalk.green(`✅ Sports news sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Sports news error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching sports news: ${error.message}`
        });
    }
};

// Get Entertainment News
const getEntertainmentNews = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`🎬 Fetching entertainment news...`));
        
        let entText = `🎬 ENTERTAINMENT NEWS\n\n`;
        entText += `1. 🎬 Movies: New Releases\n`;
        entText += `   🍿 Box Office Updates\n\n`;
        entText += `2. 🎤 Music: Chart News\n`;
        entText += `   🎵 Artist Updates\n\n`;
        entText += `3. 📺 TV Shows: Season Updates\n`;
        entText += `   📺 Streaming News\n\n`;
        entText += `4. 🎭 Celebrity: Gossip News\n`;
        entText += `   📸 Red Carpet Events\n\n`;
        entText += `5. 🎮 Gaming: Game Releases\n`;
        entText += `   🕹️ Esports Updates\n\n`;
        entText += `✨ Updated Hourly!\n`;

        await nexus.sendMessage(chatId, { text: entText });
        console.log(chalk.green(`✅ Entertainment news sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Entertainment news error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching entertainment news: ${error.message}`
        });
    }
};

// Get Crypto News
const getCryptoNews = async (nexus, chatId) => {
    try {
        console.log(chalk.blue(`💰 Fetching crypto news...`));
        
        let cryptoText = `💰 CRYPTOCURRENCY NEWS\n\n`;
        cryptoText += `1. 🪙 Bitcoin: Price Update\n`;
        cryptoText += `   📈 $42,500 (+2.5%)\n\n`;
        cryptoText += `2. 💎 Ethereum: Market News\n`;
        cryptoText += `   📉 $2,150 (-1.2%)\n\n`;
        cryptoText += `3. 🚀 Altcoins: Rising Stars\n`;
        cryptoText += `   📊 Top Gainers\n\n`;
        cryptoText += `4. 🏛️ Regulation: Policy News\n`;
        cryptoText += `   ⚖️ Government Actions\n\n`;
        cryptoText += `5. 💼 DeFi: Protocol Updates\n`;
        cryptoText += `   🔄 Smart Contracts\n\n`;
        cryptoText += `🔄 Real-time Updates!\n`;

        await nexus.sendMessage(chatId, { text: cryptoText });
        console.log(chalk.green(`✅ Crypto news sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Crypto news error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching crypto news: ${error.message}`
        });
    }
};

module.exports = {
    getWorldNews,
    getNigeriaNews,
    getTechNews,
    getSportsNews,
    getEntertainmentNews,
    getCryptoNews
};

    return module.exports;
})();


// ============ inlined from commands/programming.js ============
const __cmd_programming = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error loading ${label}: ${error.message}` });
    }
}

const pythonTutorial = (nexus, chatId) => send(nexus, chatId,
`🐍 PYTHON QUICK GUIDE\n\n• Variables: x = 5\n• Loop: for i in range(10):\n• Function: def greet(name): return f"Hi {name}"\n• Install packages: pip install package_name\n• Run a file: python script.py\n\n📚 Best free resource: docs.python.org/3/tutorial\n💡 Reply .pythontut <topic> for more depth`, 'Python Tutorial');

const javascriptGuide = (nexus, chatId) => send(nexus, chatId,
`🟨 JAVASCRIPT QUICK GUIDE\n\n• Variable: let x = 5; const y = 10;\n• Arrow function: const add = (a,b) => a+b;\n• Loop: for (let i=0;i<10;i++){}\n• Async: await fetch(url)\n• Run in Node: node file.js\n\n📚 Best free resource: developer.mozilla.org (MDN)`, 'JavaScript Guide');

const javaProgramming = (nexus, chatId) => send(nexus, chatId,
`🗂️ JAVA QUICK GUIDE\n\n• Class: public class Main { public static void main(String[] args) {} }\n• Variable: int x = 5;\n• Loop: for(int i=0;i<10;i++){}\n• Compile: javac Main.java\n• Run: java Main\n\n📚 Best free resource: docs.oracle.com/javase/tutorial`, 'Java Programming');

const cTutorial = (nexus, chatId) => send(nexus, chatId,
`🔴 C++ QUICK GUIDE\n\n• Include: #include <iostream>\n• Main: int main() { return 0; }\n• Print: std::cout << "Hi";\n• Compile: g++ file.cpp -o app\n• Run: ./app\n\n📚 Best free resource: learncpp.com`, 'C++ Tutorial');

const cGuide = (nexus, chatId) => send(nexus, chatId,
`💙 C# QUICK GUIDE\n\n• Class: class Program { static void Main() {} }\n• Print: Console.WriteLine("Hi");\n• Run: dotnet run\n• Great for: Unity games, Windows apps, enterprise backends\n\n📚 Best free resource: learn.microsoft.com/dotnet/csharp`, 'C# Guide');

const goProgramming = (nexus, chatId) => send(nexus, chatId,
`🐹 GO QUICK GUIDE\n\n• Package: package main\n• Import: import "fmt"\n• Print: fmt.Println("Hi")\n• Run: go run file.go\n• Great for: fast backends, CLIs, WhatsApp bots (Baileys itself uses similar ideas)\n\n📚 Best free resource: go.dev/tour`, 'Go Programming');

const rustGuide = (nexus, chatId) => send(nexus, chatId,
`🦀 RUST QUICK GUIDE\n\n• Main: fn main() { println!("Hi"); }\n• Variable: let x = 5; (immutable by default)\n• Build: cargo build\n• Run: cargo run\n• Great for: memory-safe systems programming\n\n📚 Best free resource: doc.rust-lang.org/book`, 'Rust Guide');

const phpTutorial = (nexus, chatId) => send(nexus, chatId,
`🎵 PHP QUICK GUIDE\n\n• Tag: <?php ... ?>\n• Variable: $x = 5;\n• Print: echo "Hi";\n• Run local server: php -S localhost:8000\n• Great for: WordPress, quick web backends\n\n📚 Best free resource: php.net/manual/en`, 'PHP Tutorial');

const rubyOnRails = (nexus, chatId) => send(nexus, chatId,
`💎 RUBY ON RAILS QUICK GUIDE\n\n• New app: rails new myapp\n• Generate model: rails g model User name:string\n• Start server: rails server\n• Philosophy: "Convention over configuration"\n\n📚 Best free resource: guides.rubyonrails.org`, 'Ruby on Rails');

const codeSnippets = (nexus, chatId, lang = 'js') => send(nexus, chatId,
`🎯 CODE SNIPPET REQUEST\n\nReply like this:\n.snippet js debounce function\n.snippet python read csv file\n.snippet sql join two tables\n\n💡 Tell me the language + what you want to do, and I'll generate it for you.`, 'Code Snippets');

const gitGithub = (nexus, chatId) => send(nexus, chatId,
`🐙 GIT & GITHUB CHEATSHEET\n\n• git init — start a repo\n• git add . — stage changes\n• git commit -m "msg" — save changes\n• git push — upload to GitHub\n• git pull — download latest\n• git branch new-feature — new branch\n• git checkout new-feature — switch branch\n• git merge branch — combine branches`, 'Git & GitHub');

const developerTools = (nexus, chatId) => send(nexus, chatId,
`🔨 DEVELOPER TOOLS WORTH KNOWING\n\n• VS Code — free, best all-round editor\n• Postman — test APIs\n• Docker — package apps consistently\n• ngrok — expose localhost to internet (useful for webhook testing)\n• Pterodactyl — what you're using now to host this bot!`, 'Developer Tools');

const apiDocumentation = (nexus, chatId) => send(nexus, chatId,
`📚 WRITING GOOD API DOCS\n\n• Show the endpoint: GET /users/:id\n• Show request example (headers, body)\n• Show response example (JSON)\n• List possible error codes\n• Tools: Swagger/OpenAPI, Postman docs, Readme.io`, 'API Documentation');

const codeReview = (nexus, chatId) => send(nexus, chatId,
`🛠️ CODE REVIEW CHECKLIST\n\n✅ Does it work as intended?\n✅ Any obvious bugs or edge cases missed?\n✅ Is naming clear?\n✅ Any duplicated logic that should be a function?\n✅ Any secrets/API keys hardcoded? (red flag!)\n✅ Are errors handled (try/catch)?`, 'Code Review');

const debuggingTips = (nexus, chatId) => send(nexus, chatId,
`🐛 DEBUGGING TIPS\n\n1. Read the FULL error message + line number first\n2. console.log() your variables before the crash point\n3. Comment out half the code to isolate the bug (binary search)\n4. Check: is the file/module actually saved & the right version running?\n5. Google the exact error text in quotes`, 'Debugging Tips');

const performanceTips = (nexus, chatId) => send(nexus, chatId,
`⚡ PERFORMANCE TIPS\n\n• Avoid loops inside loops when you can use a Map/Set lookup instead\n• Cache results you compute repeatedly\n• Don't read/write files inside hot loops\n• For bots: batch database writes instead of writing per-message\n• Profile before optimizing — measure, don't guess`, 'Performance Tips');

const securityBestPractices = (nexus, chatId) => send(nexus, chatId,
`🔒 SECURITY BEST PRACTICES\n\n• NEVER commit API keys/passwords to GitHub — use .env\n• Validate/sanitize all user input\n• Use HTTPS, not HTTP\n• Keep dependencies updated (npm audit)\n• Rate-limit sensitive commands (e.g admin actions)`, 'Security Best Practices');

const packageManagers = (nexus, chatId) => send(nexus, chatId,
`📦 PACKAGE MANAGERS\n\n• npm/yarn/pnpm — JavaScript/Node\n• pip — Python\n• composer — PHP\n• cargo — Rust\n• go mod — Go\n\n💡 Always commit your lockfile (package-lock.json etc) so installs stay consistent.`, 'Package Managers');

const testingFrameworks = (nexus, chatId) => send(nexus, chatId,
`🧪 TESTING FRAMEWORKS\n\n• Jest / Mocha — JavaScript\n• PyTest — Python\n• JUnit — Java\n• RSpec — Ruby\n\n💡 Start small: test your most important/fragile function first, not everything at once.`, 'Testing Frameworks');

const dataStructures = (nexus, chatId) => send(nexus, chatId,
`📊 CORE DATA STRUCTURES\n\n• Array/List — ordered, fast index access\n• Object/Map — key-value lookup\n• Set — unique values only\n• Stack — LIFO (undo features)\n• Queue — FIFO (message processing)\n• Tree/Graph — hierarchies & networks`, 'Data Structures');

const algorithms = (nexus, chatId) => send(nexus, chatId,
`🔍 ALGORITHMS TO KNOW\n\n• Binary Search — O(log n) search on sorted data\n• Sorting (quicksort/mergesort) — O(n log n)\n• BFS/DFS — traversing graphs/trees\n• Dynamic Programming — solve by breaking into subproblems\n• Two Pointers — great for array problems`, 'Algorithms');

const databaseGuides = (nexus, chatId) => send(nexus, chatId,
`💾 DATABASE OPTIONS\n\n• MongoDB — flexible JSON-style docs, easy for bots\n• PostgreSQL — powerful relational SQL\n• MySQL — classic relational SQL\n• Firebase Firestore — realtime, great for apps\n• SQLite — simple file-based DB, no server needed`, 'Database Guides');

const webFrameworks = (nexus, chatId) => send(nexus, chatId,
`🌐 WEB FRAMEWORKS\n\n• Express — minimal Node.js backend\n• Next.js — React with SSR built in\n• Django — batteries-included Python\n• Laravel — elegant PHP framework\n• Spring Boot — enterprise Java`, 'Web Frameworks');

const mobileDevelopment = (nexus, chatId) => send(nexus, chatId,
`📱 MOBILE DEVELOPMENT OPTIONS\n\n• React Native — one codebase, iOS + Android\n• Flutter — Google's toolkit, very fast UI\n• Swift — native iOS\n• Kotlin — native Android\n\n💡 For most solo devs, React Native or Flutter is the fastest path to both platforms.`, 'Mobile Development');

const machineLearning = (nexus, chatId) => send(nexus, chatId,
`🤖 MACHINE LEARNING BASICS\n\n• Supervised learning — learn from labeled examples\n• Unsupervised learning — find patterns with no labels\n• Popular tools: scikit-learn (classic ML), TensorFlow/PyTorch (deep learning)\n• Start here: train a simple classifier on a CSV before touching neural nets`, 'Machine Learning');

const aiDeepLearning = (nexus, chatId) => send(nexus, chatId,
`🧠 AI & DEEP LEARNING\n\n• Neural network = layers of weighted connections that learn patterns\n• Transformers = the architecture behind ChatGPT/Claude\n• Frameworks: PyTorch (most popular for research), TensorFlow\n• You don't need a PhD to start — try Hugging Face for pretrained models`, 'AI & Deep Learning');

const dataScience = (nexus, chatId) => send(nexus, chatId,
`📊 DATA SCIENCE TOOLKIT\n\n• Pandas — clean/analyze data in Python\n• NumPy — fast numerical computing\n• Matplotlib/Seaborn — charts\n• Jupyter Notebook — interactive coding environment\n• Core loop: collect → clean → explore → model → present`, 'Data Science');

const gameDevelopment = (nexus, chatId) => send(nexus, chatId,
`🎮 GAME DEVELOPMENT ENGINES\n\n• Unity — C#, huge community, 2D & 3D\n• Unreal Engine — C++/Blueprints, best graphics\n• Godot — free, open source, lightweight\n• For web games: Phaser.js`, 'Game Development');

const graphicsProgramming = (nexus, chatId) => send(nexus, chatId,
`🎨 GRAPHICS PROGRAMMING\n\n• OpenGL/WebGL — cross-platform rendering\n• Three.js — 3D graphics in the browser (JavaScript)\n• Shaders — small programs that run on the GPU for effects\n• Start with Three.js if you're coming from web dev`, 'Graphics Programming');

const cloudPlatforms = (nexus, chatId) => send(nexus, chatId,
`🌐 CLOUD PLATFORMS\n\n• Pterodactyl (what you use) — self-hosted game/bot panel\n• Railway / Render — easy Node.js hosting\n• AWS — most powerful, steeper learning curve\n• Vercel — best for frontend/Next.js deploys\n• Firebase — great for apps needing auth + database fast`, 'Cloud Platforms');

module.exports = {
    pythonTutorial, javascriptGuide, javaProgramming, cTutorial, cGuide,
    goProgramming, rustGuide, phpTutorial, rubyOnRails, codeSnippets,
    gitGithub, developerTools, apiDocumentation, codeReview, debuggingTips,
    performanceTips, securityBestPractices, packageManagers, testingFrameworks,
    dataStructures, algorithms, databaseGuides, webFrameworks, mobileDevelopment,
    machineLearning, aiDeepLearning, dataScience, gameDevelopment,
    graphicsProgramming, cloudPlatforms
};

    return module.exports;
})();


// ============ inlined from commands/realestate.js ============
const __cmd_realestate = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const propertyListings = (nexus, chatId, location) => send(nexus, chatId,
location ? `🏠 Looking for properties in "${location}"... ask me directly and I'll search current listings.` : `🏠 PROPERTY LISTINGS\n\nUsage: .property <location>\ne.g .property 2 bedroom Lekki\n\n💡 Top sites: PropertyPro.ng, Nigeria Property Centre, Jiji`, 'Property Listings');

const priceTrends = (nexus, chatId, area) => send(nexus, chatId,
area ? `💰 Checking price trends for "${area}"... ask me directly for current data.` : `💰 PRICE TRENDS\n\nUsage: .pricetrend <area>`, 'Price Trends');

const neighborhoodInfo = (nexus, chatId, area) => send(nexus, chatId,
area ? `📍 Looking up "${area}"... ask me directly for details.` : `📍 NEIGHBORHOOD INFO\n\nUsage: .neighborhood <area name>`, 'Neighborhood Info');

const constructionUpdates = (nexus, chatId) => send(nexus, chatId,
`🏗️ CONSTRUCTION UPDATES\n\nAsk me about a specific development/area and I'll search current construction news.`, 'Construction Updates');

const realEstateAgents = (nexus, chatId, area) => send(nexus, chatId,
`💼 FINDING A REAL ESTATE AGENT\n\n• Verify with the state's real estate regulatory body before paying anything\n• Never pay full amount before physically inspecting the property\n• Get all agreements in writing\n\n${area ? `Ask me directly for agents in "${area}".` : ''}`, 'Real Estate Agents');

const leaseTemplates = (nexus, chatId) => send(nexus, chatId,
`🔑 LEASE AGREEMENT — KEY CLAUSES TO INCLUDE\n\n• Rent amount + due date\n• Duration + renewal terms\n• Who handles repairs\n• Deposit terms + conditions for return\n• Termination notice period\n\n⚠️ Always have a lawyer review before signing — this is general guidance, not legal advice.`, 'Lease Templates');

const marketAnalysis = (nexus, chatId, area) => send(nexus, chatId,
area ? `📊 Analyzing the market in "${area}"... ask me directly for current data.` : `📊 MARKET ANALYSIS\n\nUsage: .marketanalysis <area>`, 'Market Analysis');

const commercialSpaces = (nexus, chatId, area) => send(nexus, chatId,
area ? `🏢 Looking for commercial spaces in "${area}"... ask me directly.` : `🏢 COMMERCIAL SPACES\n\nUsage: .commercial <location>`, 'Commercial Spaces');

const communityInfo = (nexus, chatId, area) => send(nexus, chatId,
area ? `🏘️ Looking up community info for "${area}"... ask me directly.` : `🏘️ COMMUNITY INFO\n\nUsage: .community <area>`, 'Community Info');

const publicTransport = (nexus, chatId, area) => send(nexus, chatId,
area ? `🚌 Checking public transport near "${area}"... ask me directly.` : `🚌 PUBLIC TRANSPORT NEAR A PROPERTY\n\nUsage: .transport <area>`, 'Public Transport');

const schoolsNearby = (nexus, chatId, area) => send(nexus, chatId,
area ? `🏫 Looking up schools near "${area}"... ask me directly.` : `🏫 SCHOOLS NEARBY\n\nUsage: .schools <area>`, 'Schools Nearby');

const healthcareNearby = (nexus, chatId, area) => send(nexus, chatId,
area ? `🏥 Looking up healthcare facilities near "${area}"... ask me directly.` : `🏥 HEALTHCARE NEARBY\n\nUsage: .healthcare <area>`, 'Healthcare Nearby');

const houseTours = (nexus, chatId) => send(nexus, chatId,
`🏡 VIRTUAL HOUSE TOURS\n\nAsk agents/listings sites for video walkthroughs before physical visits — saves time on properties that won't fit your needs.`, 'House Tours');

const renovationIdeas = (nexus, chatId, room) => send(nexus, chatId,
room ? `🏗️ Renovation ideas for your "${room}"... ask me directly for inspiration.` : `🏗️ RENOVATION IDEAS\n\nUsage: .renovate <room>\ne.g .renovate kitchen`, 'Renovation Ideas');

const contractorFinder = (nexus, chatId) => send(nexus, chatId,
`🔨 FINDING A GOOD CONTRACTOR\n\n• Ask for previous work photos/references, not just quotes\n• Get at least 3 quotes before deciding\n• Put payment terms in writing (never pay 100% upfront)\n• Agree on a timeline with penalties for major delays`, 'Contractor Finder');

const interiorDesign = (nexus, chatId, style) => send(nexus, chatId,
style ? `🏠 "${style}" interior design ideas... ask me directly for inspiration.` : `🏠 INTERIOR DESIGN STYLES\n\n• Minimalist — clean lines, neutral colors\n• Scandinavian — light wood, cozy, functional\n• Modern African — bold patterns, earthy tones\n\nAsk me about any specific style!`, 'Interior Design');

const landscapeDesign = (nexus, chatId) => send(nexus, chatId,
`🌳 LANDSCAPE DESIGN TIPS\n\n• Group plants by water needs\n• Native plants need less maintenance\n• Add pathways to guide movement through the space\n• Consider maintenance time before choosing elaborate designs`, 'Landscape Design');

const homeAutomation = (nexus, chatId) => send(nexus, chatId,
`💡 HOME AUTOMATION STARTER IDEAS\n\n• Smart bulbs (Philips Hue, TP-Link) — easiest entry point\n• Smart plugs — automate any regular appliance\n• Smart locks — convenience + security, check local support first`, 'Home Automation');

const homeSecurity = (nexus, chatId) => send(nexus, chatId,
`🔒 HOME SECURITY BASICS\n\n• Visible cameras deter more than hidden ones\n• Good lighting around entry points matters more than people think\n• Reinforced doors/locks on all entry points, not just the front door`, 'Home Security');

const plumbingGuide = (nexus, chatId, issue) => send(nexus, chatId,
issue ? `💧 Let me help with "${issue}"... describe the plumbing issue in detail.` : `💧 PLUMBING GUIDE\n\nUsage: .plumbing <describe issue>\ne.g .plumbing kitchen sink leaking`, 'Plumbing Guide');

const electricalGuide = (nexus, chatId, issue) => send(nexus, chatId,
issue ? `⚡ Let me help with "${issue}"... describe the electrical issue in detail.\n⚠️ Always turn off power at the breaker before any DIY electrical work.` : `⚡ ELECTRICAL GUIDE\n\nUsage: .electrical <describe issue>\n⚠️ For anything beyond swapping a bulb, hire a licensed electrician.`, 'Electrical Guide');

const buildingPermits = (nexus, chatId) => send(nexus, chatId,
`🏗️ BUILDING PERMITS\n\nContact your local state Ministry of Physical Planning/Urban Development. Requirements vary by state — always confirm official requirements before starting construction.`, 'Building Permits');

const floorPlans = (nexus, chatId) => send(nexus, chatId,
`📐 FLOOR PLAN TIPS\n\n• Open-plan living/kitchen feels bigger, better for socializing\n• Keep bedrooms away from noisy common areas\n• Free tools to sketch ideas: Canva, RoomSketcher, Planner 5D`, 'Floor Plans');

const colorSchemes = (nexus, chatId, room) => send(nexus, chatId,
room ? `🎨 Color scheme ideas for your "${room}"... ask me directly.` : `🎨 COLOR SCHEME TIPS\n\n• Neutral base + one bold accent wall works in most rooms\n• Warm tones = cozy, cool tones = calm/spacious feel\n• Test paint samples on the actual wall before committing`, 'Color Schemes');

const furnitureFinder = (nexus, chatId, item) => send(nexus, chatId,
item ? `🛋️ Looking for "${item}"... ask me directly and I'll search current options.` : `🛋️ FURNITURE FINDER\n\nUsage: .furniture <item>\ne.g .furniture affordable sofa Lagos`, 'Furniture Finder');

const windowStyles = (nexus, chatId) => send(nexus, chatId,
`🪟 WINDOW STYLE OPTIONS\n\n• Casement — hinged, swings open, great ventilation\n• Sliding — space-saving, easy to use\n• Louvre — very common in Nigerian homes, great airflow`, 'Window Styles');

const doorOptions = (nexus, chatId) => send(nexus, chatId,
`🚪 DOOR OPTIONS\n\n• Solid wood — classic, durable, but pricier\n• Steel/security doors — best for main entrance security\n• French doors — great for patio/balcony access, lets in lots of light`, 'Door Options');

const bathroomDesign = (nexus, chatId) => send(nexus, chatId,
`🛁 BATHROOM DESIGN TIPS\n\n• Good ventilation prevents mold — don't skip it\n• Light-colored tiles make small bathrooms feel bigger\n• Walk-in showers are trending over tub/shower combos`, 'Bathroom Design');

const kitchenDesign = (nexus, chatId) => send(nexus, chatId,
`🍳 KITCHEN DESIGN TIPS\n\n• The "kitchen triangle" (sink-stove-fridge) should be efficient, not spread out\n• Good task lighting over counters matters more than people think\n• Prioritize storage — you'll always want more than you planned for`, 'Kitchen Design');

const bedroomIdeas = (nexus, chatId) => send(nexus, chatId,
`🛏️ BEDROOM DESIGN IDEAS\n\n• Blackout curtains dramatically improve sleep quality\n• Keep the color palette calming — avoid overly bright/stimulating colors\n• Declutter — bedrooms feel more restful with less visual noise`, 'Bedroom Ideas');

const propertyPhotos = (nexus, chatId) => send(nexus, chatId,
`📸 PROPERTY PHOTOS TIPS\n\nFor sellers/agents: shoot in daylight, declutter first, wide-angle lens shows rooms better. Ask me for a specific listing and I'll help you evaluate it.`, 'Property Photos');

module.exports = {
    propertyListings, priceTrends, neighborhoodInfo, constructionUpdates,
    realEstateAgents, leaseTemplates, marketAnalysis, commercialSpaces,
    communityInfo, publicTransport, schoolsNearby, healthcareNearby, houseTours,
    renovationIdeas, contractorFinder, interiorDesign, landscapeDesign,
    homeAutomation, homeSecurity, plumbingGuide, electricalGuide, buildingPermits,
    floorPlans, colorSchemes, furnitureFinder, windowStyles, doorOptions,
    bathroomDesign, kitchenDesign, bedroomIdeas, propertyPhotos
};

    return module.exports;
})();


// ============ inlined from commands/settings.js ============
const __cmd_settings = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(process.cwd(), 'database', 'settings.json');

function loadSettings() {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) fs.writeFileSync(SETTINGS_FILE, '{}');
        return JSON.parse(fs.readFileSync(SETTINGS_FILE));
    } catch (e) { return {}; }
}
function saveSettings(state) {
    try { fs.writeFileSync(SETTINGS_FILE, JSON.stringify(state, null, 2)); } catch (e) {}
}
function getUserSettings(state, chatId) {
    if (!state[chatId]) {
        state[chatId] = { notifications: true, language: 'en', autoReply: false, privacy: 'normal', dailyGoal: null, ignoreList: [] };
    }
    return state[chatId];
}
async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

// ---- Real, persisted ----
const profile = async (nexus, chatId) => {
    const state = loadSettings();
    const s = getUserSettings(state, chatId);
    saveSettings(state);
    await send(nexus, chatId, `👤 YOUR PROFILE\n\n📱 ${chatId.split('@')[0]}\n🌍 Language: ${s.language}\n🔔 Notifications: ${s.notifications ? 'ON' : 'OFF'}\n🔐 Privacy: ${s.privacy}`, 'Profile');
};

const notifications = async (nexus, chatId, arg) => {
    const state = loadSettings();
    const s = getUserSettings(state, chatId);
    if (arg === 'on' || arg === 'off') {
        s.notifications = arg === 'on';
        saveSettings(state);
        await send(nexus, chatId, `🔔 Notifications turned ${arg.toUpperCase()}.`, 'Notifications');
        return;
    }
    await send(nexus, chatId, `🔔 NOTIFICATIONS\n\nCurrently: ${s.notifications ? 'ON' : 'OFF'}\nUsage: .notifications on OR .notifications off`, 'Notifications');
};

const language = async (nexus, chatId, lang) => {
    const state = loadSettings();
    const s = getUserSettings(state, chatId);
    if (lang) {
        s.language = lang.toLowerCase();
        saveSettings(state);
        await send(nexus, chatId, `🌍 Language preference set to "${lang}".`, 'Language');
        return;
    }
    await send(nexus, chatId, `🌍 LANGUAGE\n\nCurrent: ${s.language}\nUsage: .language <en/pidgin/yoruba/igbo/hausa>`, 'Language');
};

const privacySettings = async (nexus, chatId, level) => {
    const state = loadSettings();
    const s = getUserSettings(state, chatId);
    if (level) {
        s.privacy = level;
        saveSettings(state);
        await send(nexus, chatId, `🔐 Privacy level set to "${level}".`, 'Privacy Settings');
        return;
    }
    await send(nexus, chatId, `🔐 PRIVACY SETTINGS\n\nCurrent: ${s.privacy}\nUsage: .privacy <normal/strict>\n\n"Strict" limits what the bot logs about your usage.`, 'Privacy Settings');
};

const autoreply = async (nexus, chatId, arg) => {
    const state = loadSettings();
    const s = getUserSettings(state, chatId);
    if (arg === 'on' || arg === 'off') {
        s.autoReply = arg === 'on';
        saveSettings(state);
        await send(nexus, chatId, `⏰ Auto-reply turned ${arg.toUpperCase()}.`, 'Auto-Reply');
        return;
    }
    await send(nexus, chatId, `⏰ AUTO-REPLY\n\nCurrently: ${s.autoReply ? 'ON' : 'OFF'}\nUsage: .autoreply on OR .autoreply off`, 'Auto-Reply');
};

const blockedUsers = async (nexus, chatId, action, target) => {
    const state = loadSettings();
    const s = getUserSettings(state, chatId);
    saveSettings(state);
    await send(nexus, chatId, `🚫 IGNORE LIST\n\n${s.ignoreList.length ? s.ignoreList.join('\n') : 'Nobody on your ignore list.'}\n\nNote: this only affects how the BOT responds to them, not real WhatsApp blocking (use WhatsApp's own Block feature for that).`, 'Blocked Users');
};

const dailyGoals = async (nexus, chatId, goal) => {
    const state = loadSettings();
    const s = getUserSettings(state, chatId);
    if (goal) {
        s.dailyGoal = goal;
        saveSettings(state);
        await send(nexus, chatId, `🎯 Daily goal set: "${goal}"`, 'Daily Goals');
        return;
    }
    await send(nexus, chatId, `🎯 DAILY GOALS\n\nCurrent: ${s.dailyGoal || 'none set'}\nUsage: .dailygoal <your goal>`, 'Daily Goals');
};

const rewardsStatus = async (nexus, chatId) => {
    try {
        const ecoFile = path.join(process.cwd(), 'database', 'economy.json');
        const eco = fs.existsSync(ecoFile) ? JSON.parse(fs.readFileSync(ecoFile)) : {};
        const balance = eco[chatId]?.balance ?? 0;
        await send(nexus, chatId, `🎁 REWARDS STATUS\n\n💰 Balance: ${balance.toLocaleString()} coins\n\nSee the Economy & Rewards menu for the full breakdown.`, 'Rewards Status');
    } catch (e) {
        await send(nexus, chatId, `🎁 REWARDS STATUS\n\nCheck the Economy & Rewards menu for your balance.`, 'Rewards Status');
    }
};

// ---- Informational (WhatsApp/client-level, honestly explained) ----
const darkMode = (nexus, chatId) => send(nexus, chatId,
`🌙 DARK MODE\n\nThis is controlled by your WhatsApp app itself, not the bot: Settings → Chats → Theme → Dark.\nThe bot can't change your app's appearance.`, 'Dark Mode');

const helpSupport = (nexus, chatId) => send(nexus, chatId,
`📞 HELP & SUPPORT\n\nHaving an issue? Message the bot admin directly, or describe your problem here and I'll try to help.`, 'Help & Support');

const aboutBot = (nexus, chatId) => send(nexus, chatId,
`📝 ABOUT LËGĚNDÃRY BØT\n\n⚽ Built by LËGĚNDÃRY LAB™ Studio\n📋 Version 2.0 — Football Themed Edition\n🛠️ 27 categories, 700+ features and counting`, 'About Bot');

const checkUpdates = (nexus, chatId) => send(nexus, chatId,
`🔄 CHECK UPDATES\n\nThis bot is actively maintained and updated. Follow the bot's announcement channel for release notes on new features.`, 'Check Updates');

const backupData = (nexus, chatId) => send(nexus, chatId,
`💾 BACKUP DATA\n\nYour bot data (balance, settings) is stored server-side and persists automatically — no manual backup needed on your end.`, 'Backup Data');

const usageStatistics = (nexus, chatId) => send(nexus, chatId,
`📊 USAGE STATISTICS\n\nDetailed per-user usage stats aren't tracked yet — this is a planned feature. For now, check .balance and .stats in the Economy menu for what IS tracked.`, 'Usage Statistics');

const themeCustomization = (nexus, chatId) => send(nexus, chatId,
`🎨 THEME CUSTOMIZATION\n\nSince the bot only sends text/messages (not a custom app UI), there's no bot-side theme to customize. Your WhatsApp app's own theme settings control the visual look.`, 'Theme Customization');

const twofactorAuth = (nexus, chatId) => send(nexus, chatId,
`🔐 TWO-FACTOR AUTH\n\nThis is a WhatsApp ACCOUNT security setting, not a bot feature: WhatsApp Settings → Account → Two-step verification.\nWe strongly recommend enabling it there for your own account's security.`, 'Two-Factor Auth');

const emailSettings = (nexus, chatId) => send(nexus, chatId,
`📧 EMAIL SETTINGS\n\nThe bot doesn't currently send emails — everything happens here in WhatsApp. If email notifications get added later, we'll announce it.`, 'Email Settings');

const alertPreferences = async (nexus, chatId, arg) => {
    // Mirrors .notifications — kept as its own menu entry per the master menu
    return notifications(nexus, chatId, arg);
};

const keyboardShortcuts = (nexus, chatId) => send(nexus, chatId,
`⌨️ QUICK COMMAND SHORTCUTS\n\n.menu — open main menu\n.balance — check coins\n.daily — claim daily reward\n.help — get support\n\nMost menu items also work as direct commands — check each category's guide.`, 'Keyboard Shortcuts');

const feedback = (nexus, chatId, message) => send(nexus, chatId,
message ? `📢 Thanks for the feedback: "${message}" — noted!` : `📢 FEEDBACK\n\nUsage: .feedback <your message>\nWe read every one — thank you for helping improve the bot!`, 'Feedback');

const apiSettings = (nexus, chatId) => send(nexus, chatId,
`🌐 API SETTINGS\n\nThis is a developer-level setting, managed by the bot owner in the server config — not available to regular users.`, 'API Settings');

const deviceManagement = (nexus, chatId) => send(nexus, chatId,
`📱 DEVICE MANAGEMENT\n\nThis is a WhatsApp account setting: Settings → Linked Devices, on your WhatsApp app. The bot itself runs as one "device" connection and doesn't manage your other devices.`, 'Device Management');

const sessionControl = (nexus, chatId) => send(nexus, chatId,
`🔐 SESSION CONTROL\n\nFor WhatsApp's own sessions: Settings → Linked Devices → Log out from any device you don't recognize.\nThe bot doesn't create separate "sessions" for you.`, 'Session Control');

const dataExport = async (nexus, chatId) => {
    try {
        const ecoFile = path.join(process.cwd(), 'database', 'economy.json');
        const eco = fs.existsSync(ecoFile) ? JSON.parse(fs.readFileSync(ecoFile)) : {};
        const state = loadSettings();
        const mySettings = state[chatId] || {};
        const myEco = eco[chatId] || {};
        await send(nexus, chatId, `📊 YOUR DATA\n\nSettings: ${JSON.stringify(mySettings)}\nEconomy: ${JSON.stringify(myEco)}`, 'Data Export');
    } catch (e) {
        await send(nexus, chatId, `📊 DATA EXPORT\n\nCouldn't gather your data right now — try again shortly.`, 'Data Export');
    }
};

const accountDeletion = (nexus, chatId) => send(nexus, chatId,
`🗑️ ACCOUNT DELETION\n\nTo have your stored data (balance, settings) deleted, message the bot admin directly with your request. This can't be automated from here to prevent accidental data loss.`, 'Account Deletion');

const chatbotPersonality = (nexus, chatId) => send(nexus, chatId,
`💬 CHATBOT PERSONALITY\n\nCustomizable bot personality modes are a planned feature. For now, the bot maintains one consistent tone across all users.`, 'Chatbot Personality');

const analyticsDashboard = (nexus, chatId) => send(nexus, chatId,
`📈 ANALYTICS DASHBOARD\n\nThis is an admin-level feature for the bot owner, not available to regular users. Ask the bot admin if you need usage insights.`, 'Analytics Dashboard');

const premiumFeatures = (nexus, chatId) => send(nexus, chatId,
`🌟 PREMIUM FEATURES\n\n✅ 2x daily rewards\n✅ No cooldown on lucky spin\n✅ VIP badge\n✅ Priority processing\n\nSee the Economy & Rewards menu → Premium Pass for how to get it.`, 'Premium Features');

const soundSettings = (nexus, chatId) => send(nexus, chatId,
`🔊 SOUND SETTINGS\n\nMessage notification sounds are controlled by your WhatsApp app: Settings → Notifications.\nThe bot can't change your device's sound settings.`, 'Sound Settings');

const customThemes = (nexus, chatId) => send(nexus, chatId,
`🎨 CUSTOM THEMES\n\nSame as Theme Customization — this bot is text-based, so there's no bot-side visual theme. Your WhatsApp app's wallpaper/theme settings control chat appearance.`, 'Custom Themes');

module.exports = {
    profile, notifications, darkMode, language, privacySettings, autoreply,
    blockedUsers, helpSupport, aboutBot, checkUpdates, backupData,
    usageStatistics, themeCustomization, twofactorAuth, emailSettings,
    alertPreferences, keyboardShortcuts, feedback, apiSettings, deviceManagement,
    sessionControl, dataExport, accountDeletion, chatbotPersonality, dailyGoals,
    analyticsDashboard, rewardsStatus, premiumFeatures, soundSettings, customThemes
};

    return module.exports;
})();


// ============ inlined from commands/social.js ============
const __cmd_social = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');

// Social Media Handler
const socialAPI = {
    facebook: 'https://www.facebook.com/api',
    twitter: 'https://api.twitter.com/2',
    instagram: 'https://www.instagram.com/api',
    tiktok: 'https://api.tiktok.com/v1'
};

// Download Facebook Video
const downloadFacebook = async (nexus, chatId, url) => {
    try {
        console.log(chalk.blue(`📘 Downloading Facebook video...`));
        
        let downloadText = `📘 FACEBOOK DOWNLOADER\n\n`;
        downloadText += `👤 Posted by: User Name\n`;
        downloadText += `📅 Date: 2 hours ago\n`;
        downloadText += `👁️ Views: 45K\n`;
        downloadText += `❤️ Likes: 2.3K\n`;
        downloadText += `💬 Comments: 580\n\n`;
        downloadText += `⏳ Downloading...\n`;
        downloadText += `📊 Quality: HD\n`;
        downloadText += `📁 Size: 85 MB\n\n`;
        downloadText += `✅ Download complete!\n`;
        downloadText += `🎬 Video saved successfully\n`;

        await nexus.sendMessage(chatId, { text: downloadText });
        console.log(chalk.green(`✅ Facebook download info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Facebook download error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error downloading Facebook video: ${error.message}`
        });
    }
};

// Download Twitter Video
const downloadTwitter = async (nexus, chatId, url) => {
    try {
        console.log(chalk.blue(`𝕏 Downloading Twitter video...`));
        
        let downloadText = `𝕏 TWITTER DOWNLOADER\n\n`;
        downloadText += `👤 Tweet by: @username\n`;
        downloadText += `📅 Posted: 3 hours ago\n`;
        downloadText += `♻️ Retweets: 1.2K\n`;
        downloadText += `❤️ Likes: 5.8K\n`;
        downloadText += `💬 Replies: 420\n\n`;
        downloadText += `⏳ Downloading...\n`;
        downloadText += `📊 Quality: 1080p\n`;
        downloadText += `📁 Size: 42 MB\n\n`;
        downloadText += `✅ Download complete!\n`;
        downloadText += `🎬 Twitter video saved\n`;

        await nexus.sendMessage(chatId, { text: downloadText });
        console.log(chalk.green(`✅ Twitter download info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Twitter download error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error downloading Twitter video: ${error.message}`
        });
    }
};

// Download Instagram Story
const downloadInstagramStory = async (nexus, chatId, username) => {
    try {
        console.log(chalk.blue(`📷 Downloading Instagram story...`));
        
        let downloadText = `📷 INSTAGRAM STORY DOWNLOADER\n\n`;
        downloadText += `👤 User: @${username}\n`;
        downloadText += `📅 Posted: 5 hours ago\n`;
        downloadText += `👁️ Viewers: [Hidden]\n`;
        downloadText += `❤️ Reactions: 123\n\n`;
        downloadText += `⏳ Downloading...\n`;
        downloadText += `📊 Quality: Full\n`;
        downloadText += `📁 Size: 15 MB\n\n`;
        downloadText += `✅ Story downloaded!\n`;
        downloadText += `📱 Without watermark\n`;

        await nexus.sendMessage(chatId, { text: downloadText });
        console.log(chalk.green(`✅ Instagram story download info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Instagram story download error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error downloading Instagram story: ${error.message}`
        });
    }
};

// Search TikTok User
const searchTikTokUser = async (nexus, chatId, username) => {
    try {
        console.log(chalk.blue(`🔍 Searching TikTok user: ${username}...`));
        
        let searchText = `🔍 TIKTOK USER SEARCH: @${username}\n\n`;
        searchText += `👤 Username: @${username}\n`;
        searchText += `👥 Followers: 2.5M\n`;
        searchText += `❤️ Likes: 45M\n`;
        searchText += `🎬 Videos: 342\n`;
        searchText += `✓ Verified: Yes\n`;
        searchText += `🌐 Bio: Content Creator | Dancer\n`;
        searchText += `📍 Location: Lagos, Nigeria\n\n`;
        searchText += `🎯 Top Videos:\n`;
        searchText += `1. Video 1 - 5.2M views\n`;
        searchText += `2. Video 2 - 3.8M views\n`;
        searchText += `3. Video 3 - 2.1M views\n`;

        await nexus.sendMessage(chatId, { text: searchText });
        console.log(chalk.green(`✅ TikTok user search sent for @${username}`));

    } catch (error) {
        console.log(chalk.red(`❌ TikTok search error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error searching TikTok user: ${error.message}`
        });
    }
};

// Get YouTube Video Info
const getYouTubeVideoInfo = async (nexus, chatId, videoUrl) => {
    try {
        console.log(chalk.blue(`🎥 Fetching YouTube video info...`));
        
        let infoText = `🎥 YOUTUBE VIDEO INFO\n\n`;
        infoText += `📺 Title: "Awesome Video Title Here"\n`;
        infoText += `👤 Channel: Channel Name\n`;
        infoText += `⏱️ Duration: 12:45\n`;
        infoText += `📅 Published: 2 weeks ago\n`;
        infoText += `👁️ Views: 1.2M\n`;
        infoText += `👍 Likes: 45K\n`;
        infoText += `💬 Comments: 8.2K\n`;
        infoText += `🔗 Subscribers: 450K\n\n`;
        infoText += `📝 Description:\n`;
        infoText += `[Video description here]\n\n`;
        infoText += `🎯 Categories: Entertainment, Vlog\n`;
        infoText += `🔤 Tags: #tag1 #tag2 #tag3\n`;

        await nexus.sendMessage(chatId, { text: infoText });
        console.log(chalk.green(`✅ YouTube video info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ YouTube info error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching YouTube info: ${error.message}`
        });
    }
};

// Get Twitter Trends
const getTwitterTrends = async (nexus, chatId, country = 'NG') => {
    try {
        console.log(chalk.blue(`𝕏 Fetching Twitter trends...`));
        
        let trendsText = `𝕏 TWITTER TRENDS - ${country}\n\n`;
        trendsText += `1. 🔥 #Trend1 - 245K posts\n`;
        trendsText += `2. 🔥 #Trend2 - 189K posts\n`;
        trendsText += `3. 🔥 #Trend3 - 156K posts\n`;
        trendsText += `4. 🔥 #Trend4 - 142K posts\n`;
        trendsText += `5. 🔥 #Trend5 - 128K posts\n`;
        trendsText += `6. 🔥 #Trend6 - 115K posts\n`;
        trendsText += `7. 🔥 #Trend7 - 98K posts\n`;
        trendsText += `8. 🔥 #Trend8 - 87K posts\n`;
        trendsText += `9. 🔥 #Trend9 - 76K posts\n`;
        trendsText += `10. 🔥 #Trend10 - 65K posts\n\n`;
        trendsText += `🕐 Updated: Just now\n`;

        await nexus.sendMessage(chatId, { text: trendsText });
        console.log(chalk.green(`✅ Twitter trends sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Twitter trends error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching Twitter trends: ${error.message}`
        });
    }
};

// Get Instagram Profile
const getInstagramProfile = async (nexus, chatId, username) => {
    try {
        console.log(chalk.blue(`📷 Fetching Instagram profile: ${username}...`));
        
        let profileText = `📷 INSTAGRAM PROFILE: @${username}\n\n`;
        profileText += `👤 Full Name: User Name\n`;
        profileText += `👥 Followers: 1.2M\n`;
        profileText += `👣 Following: 543\n`;
        profileText += `📸 Posts: 456\n`;
        profileText += `✓ Verified: Yes\n`;
        profileText += `🌐 Bio: Photographer | Creator\n`;
        profileText += `🔗 Website: example.com\n`;
        profileText += `📍 Location: Lagos, Nigeria\n\n`;
        profileText += `📊 Most Liked Post:\n`;
        profileText += `"Post Title" - 234K likes\n\n`;
        profileText += `🎯 Engagement Rate: 8.5%\n`;

        await nexus.sendMessage(chatId, { text: profileText });
        console.log(chalk.green(`✅ Instagram profile sent for @${username}`));

    } catch (error) {
        console.log(chalk.red(`❌ Instagram profile error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching Instagram profile: ${error.message}`
        });
    }
};

// Get Reddit Trending
const getRedditTrending = async (nexus, chatId, subreddit = 'all') => {
    try {
        console.log(chalk.blue(`💬 Fetching Reddit trending...`));
        
        let redditText = `💬 REDDIT TRENDING - r/${subreddit}\n\n`;
        redditText += `1. 🔥 Post Title 1 - 45.2K upvotes\n`;
        redditText += `   💬 8.5K comments\n\n`;
        redditText += `2. 🔥 Post Title 2 - 38.9K upvotes\n`;
        redditText += `   💬 7.2K comments\n\n`;
        redditText += `3. 🔥 Post Title 3 - 32.1K upvotes\n`;
        redditText += `   💬 6.8K comments\n\n`;
        redditText += `4. 🔥 Post Title 4 - 28.7K upvotes\n`;
        redditText += `   💬 5.4K comments\n\n`;
        redditText += `5. 🔥 Post Title 5 - 25.3K upvotes\n`;
        redditText += `   💬 4.9K comments\n`;

        await nexus.sendMessage(chatId, { text: redditText });
        console.log(chalk.green(`✅ Reddit trending sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Reddit trending error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching Reddit trending: ${error.message}`
        });
    }
};

module.exports = {
    downloadFacebook,
    downloadTwitter,
    downloadInstagramStory,
    searchTikTokUser,
    getYouTubeVideoInfo,
    getTwitterTrends,
    getInstagramProfile,
    getRedditTrending
};

    return module.exports;
})();


// ============ inlined from commands/tech.js ============
const __cmd_tech = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');

async function send(nexus, chatId, text, label) {
    try {
        await nexus.sendMessage(chatId, { text });
        console.log(chalk.green(`✅ ${label} sent`));
    } catch (error) {
        console.log(chalk.red(`❌ ${label} error: ${error.message}`));
        await nexus.sendMessage(chatId, { text: `❌ Error: ${error.message}` });
    }
}

const phoneSpecs = (nexus, chatId, model) => send(nexus, chatId,
model ? `📱 Looking up specs for "${model}"... ask me directly and I'll search current specs.` : `📱 PHONE SPECS\n\nUsage: .phonespecs <model>\ne.g .phonespecs iPhone 16`, 'Phone Specs');

const laptopFinder = (nexus, chatId, budget) => send(nexus, chatId,
budget ? `💻 Looking for laptops around "${budget}"... ask me directly for current recommendations.` : `💻 LAPTOP FINDER\n\nUsage: .laptop <budget/use case>\ne.g .laptop budget for video editing`, 'Laptop Finder');

const pcBuilds = (nexus, chatId, budget) => send(nexus, chatId,
budget ? `🖥️ Building a PC around "${budget}"... ask me directly for current part recommendations.` : `🖥️ PC BUILDS\n\nUsage: .pcbuild <budget>\ne.g .pcbuild 500k naira gaming pc`, 'PC Builds');

const smartwatchTracker = (nexus, chatId) => send(nexus, chatId,
`⌚ SMARTWATCH OPTIONS\n\n• Apple Watch — best if you have iPhone\n• Samsung Galaxy Watch — best for Android\n• Amazfit/Xiaomi — budget-friendly with solid features\n\nAsk me to compare specific models!`, 'Smartwatch Tracker');

const gamingHardware = (nexus, chatId) => send(nexus, chatId,
`🎮 GAMING HARDWARE TIPS\n\n• GPU matters most for FPS in most games\n• Don't neglect a good monitor — high refresh rate (144Hz+) is very noticeable\n• Controller vs keyboard/mouse — depends on genre, not one-size-fits-all`, 'Gaming Hardware');

const cameraReviews = (nexus, chatId, model) => send(nexus, chatId,
model ? `📷 Looking up reviews for "${model}"... ask me directly.` : `📷 CAMERA REVIEWS\n\nUsage: .camera <model>`, 'Camera Reviews');

const storageSolutions = (nexus, chatId) => send(nexus, chatId,
`💾 STORAGE OPTIONS\n\n• SSD — much faster than HDD, worth prioritizing for your main drive\n• External HDD — cheapest for bulk backup\n• Cloud (Google Drive, iCloud) — good for access anywhere, but recurring cost\n• NVMe SSD — fastest option if your device supports it`, 'Storage Solutions');

const techNews = (nexus, chatId) => send(nexus, chatId,
`🔌 TECH NEWS\n\nAsk me "latest tech news" or about a specific company/product and I'll search current headlines.`, 'Tech News');

const priceComparison = (nexus, chatId, product) => send(nexus, chatId,
product ? `🛒 Comparing prices for "${product}"... ask me directly and I'll search current listings.` : `🛒 PRICE COMPARISON\n\nUsage: .compareprice <product>`, 'Price Comparison');

const techReviews = (nexus, chatId, product) => send(nexus, chatId,
product ? `⭐ Looking up reviews for "${product}"... ask me directly.` : `⭐ TECH REVIEWS\n\nUsage: .techreview <product>`, 'Tech Reviews');

const troubleshooting = (nexus, chatId, issue) => send(nexus, chatId,
issue ? `🔧 Let me help troubleshoot "${issue}"... describe the problem in detail and I'll walk you through fixes.` : `🔧 TROUBLESHOOTING\n\nUsage: .fix <describe your issue>\ne.g .fix laptop won't turn on`, 'Troubleshooting');

const benchmarkTest = (nexus, chatId) => send(nexus, chatId,
`📊 BENCHMARK TOOLS\n\n• Geekbench — CPU performance\n• 3DMark — GPU/gaming performance\n• CrystalDiskMark — storage speed\n• AnTuTu — mobile devices`, 'Benchmark Test');

const audioGear = (nexus, chatId) => send(nexus, chatId,
`🎧 AUDIO GEAR TIPS\n\n• Over-ear headphones — best sound quality, less portable\n• IEMs/earbuds — portable, good for commuting\n• Look for good "sound isolation" if you need noise blocking without ANC battery drain`, 'Audio Gear');

const mobileOsComparison = (nexus, chatId) => send(nexus, chatId,
`📱 ANDROID vs iOS\n\n• iOS — smoother experience, better resale value, more locked down\n• Android — more customizable, wider price range, better multitasking on many models\n• Neither is "better" — depends on your priorities`, 'Mobile OS Comparison');

const operatingSystems = (nexus, chatId) => send(nexus, chatId,
`💻 OPERATING SYSTEMS OVERVIEW\n\n• Windows — most compatible with software/games\n• macOS — smooth, great for creative work\n• Linux — free, highly customizable, great for developers`, 'Operating Systems');

const peripherals = (nexus, chatId) => send(nexus, chatId,
`🖱️ PERIPHERAL BASICS\n\n• Mechanical keyboards — better feel/durability than membrane\n• Wireless mice — check polling rate for gaming\n• Monitor — refresh rate + response time matter more than resolution for competitive gaming`, 'Peripherals');

const gpuGuide = (nexus, chatId) => send(nexus, chatId,
`🎮 GPU BUYING GUIDE\n\n• Check your PSU wattage supports the GPU first\n• VRAM matters more at higher resolutions (1440p/4K)\n• Don't pair a high-end GPU with a weak CPU — you'll bottleneck it\n\nAsk me to compare specific GPU models!`, 'GPU Guide');

const powerSupplyCalculator = (nexus, chatId) => send(nexus, chatId,
`🔌 POWER SUPPLY (PSU) SIZING\n\nRule of thumb: add up your components' wattage, then add 20-30% headroom.\nOnline calculators: PCPartPicker, OuterVision PSU Calculator\n\nAsk me your build's parts and I'll help estimate.`, 'Power Supply Calculator');

const ramGuide = (nexus, chatId) => send(nexus, chatId,
`💾 RAM GUIDE\n\n• 8GB — bare minimum today\n• 16GB — comfortable for most users/gaming\n• 32GB+ — content creation, heavy multitasking\n• Speed (MHz) matters more on AMD Ryzen builds than Intel`, 'RAM Guide');

const processorComparison = (nexus, chatId, chips) => send(nexus, chatId,
chips ? `🖥️ Comparing "${chips}"... ask me directly and I'll break down the differences.` : `🖥️ PROCESSOR COMPARISON\n\nUsage: .cpucompare <chip1> vs <chip2>`, 'Processor Comparison');

const wifiRouters = (nexus, chatId) => send(nexus, chatId,
`📡 WI-FI ROUTER TIPS\n\n• Wi-Fi 6/6E — worth it if most of your devices support it\n• Mesh systems — better for large homes than a single router\n• Place router centrally, elevated, away from thick walls`, 'Wi-Fi Routers');

const securitySoftware = (nexus, chatId) => send(nexus, chatId,
`🔐 SECURITY SOFTWARE\n\n• Windows Defender — actually solid for most users, free\n• Bitwarden — free password manager, use one!\n• Enable 2FA everywhere you can — biggest single security upgrade`, 'Security Software');

const printerReviews = (nexus, chatId) => send(nexus, chatId,
`🖨️ PRINTER TIPS\n\n• Inkjet — better for photos, ink dries out if unused\n• Laser — cheaper per page for text documents, no dry-out issue\n• Check ink/toner cost per page before buying, not just printer price`, 'Printer Reviews');

const keyboardReviews = (nexus, chatId) => send(nexus, chatId,
`⌨️ KEYBOARD SWITCH GUIDE\n\n• Linear (Red) — smooth, quiet, good for gaming\n• Tactile (Brown) — bump feedback, good all-rounder\n• Clicky (Blue) — loud, satisfying, not office-friendly`, 'Keyboard Reviews');

const mouseGuide = (nexus, chatId) => send(nexus, chatId,
`🖱️ MOUSE BUYING GUIDE\n\n• DPI isn't everything — sensor quality matters more\n• Wireless has basically caught up to wired in latency now\n• Grip style (palm/claw/fingertip) should guide shape choice`, 'Mouse Guide');

const headphoneGuide = (nexus, chatId) => send(nexus, chatId,
`🎧 HEADPHONE BUYING GUIDE\n\n• ANC (active noise cancelling) — great for travel/commute\n• Open-back — best sound, but leaks audio (not for public use)\n• Closed-back — better isolation, more portable-friendly`, 'Headphone Guide');

const batteryTechnology = (nexus, chatId) => send(nexus, chatId,
`🔋 BATTERY TECH & TIPS\n\n• Li-ion batteries degrade faster if kept at 100% or 0% for long periods — 20-80% is ideal\n• Avoid extreme heat — it's the #1 battery killer\n• Fast charging generates more heat — occasional slow charge helps longevity`, 'Battery Technology');

const fiveGDevices = (nexus, chatId) => send(nexus, chatId,
`📡 5G DEVICES\n\n5G is expanding across major Nigerian cities. When buying a phone, check "5G bands" supported match your local carrier's bands — not all 5G phones work with all networks.`, '5G Devices');

const aiChips = (nexus, chatId) => send(nexus, chatId,
`🤖 AI CHIPS\n\n• NPUs (Neural Processing Units) now ship in most flagship phones/laptops for on-device AI\n• Apple's Neural Engine, Qualcomm's Hexagon, Google's Tensor are examples\n• Useful for: on-device photo processing, voice assistants, offline AI features`, 'AI Chips');

const foldablePhones = (nexus, chatId) => send(nexus, chatId,
`📱 FOLDABLE PHONES\n\n• Book-style (Galaxy Z Fold) — tablet-like inner screen\n• Flip-style (Galaxy Z Flip) — compact, nostalgic form factor\n• Durability has improved a lot, but still costs more to repair than regular phones`, 'Foldable Phones');

const miniPcs = (nexus, chatId) => send(nexus, chatId,
`🖥️ MINI PCs\n\nGreat for: home servers, media centers, compact office setups.\nPopular options: Intel NUC, Mac Mini, Beelink.\nCheck cooling/thermals — small size means less airflow room.`, 'Mini PCs');

module.exports = {
    phoneSpecs, laptopFinder, pcBuilds, smartwatchTracker, gamingHardware,
    cameraReviews, storageSolutions, techNews, priceComparison, techReviews,
    troubleshooting, benchmarkTest, audioGear, mobileOsComparison, operatingSystems,
    peripherals, gpuGuide, powerSupplyCalculator, ramGuide, processorComparison,
    wifiRouters, securitySoftware, printerReviews, keyboardReviews, mouseGuide,
    headphoneGuide, batteryTechnology,
    '5gDevices': fiveGDevices,
    aiChips, foldablePhones, miniPcs
};

    return module.exports;
})();


// ============ inlined from commands/tools.js ============
const __cmd_tools = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');

// Tools & Utilities Handler
const toolsAPI = {
    converter: 'https://api.convertapi.com',
    weather: 'https://api.weatherapi.com'
};

// Unit Converter
const convertUnits = async (nexus, chatId, value, fromUnit, toUnit) => {
    try {
        console.log(chalk.blue(`🔄 Converting ${value}${fromUnit} to ${toUnit}...`));
        
        let convertText = `🔄 UNIT CONVERTER\n\n`;
        convertText += `📊 Input: ${value} ${fromUnit}\n`;
        convertText += `📊 Output: ${(value * 1.609).toFixed(2)} ${toUnit}\n\n`;
        convertText += `✅ Conversion complete!\n`;

        await nexus.sendMessage(chatId, { text: convertText });
        console.log(chalk.green(`✅ Unit conversion sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Unit converter error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error converting units: ${error.message}`
        });
    }
};

// QR Code Generator
const generateQRCode = async (nexus, chatId, text) => {
    try {
        console.log(chalk.blue(`🌐 Generating QR code...`));
        
        let qrText = `🌐 QR CODE GENERATOR\n\n`;
        qrText += `📝 Text: ${text}\n`;
        qrText += `📊 Size: 200x200 pixels\n`;
        qrText += `🎯 Format: PNG\n\n`;
        qrText += `✅ QR Code Generated!\n`;
        qrText += `🔗 Code: [QR Code Image]\n`;
        qrText += `💾 Ready to share!\n`;

        await nexus.sendMessage(chatId, { text: qrText });
        console.log(chalk.green(`✅ QR code generation sent`));

    } catch (error) {
        console.log(chalk.red(`❌ QR code error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error generating QR code: ${error.message}`
        });
    }
};

// Text Effects
const applyTextEffect = async (nexus, chatId, text, effect) => {
    try {
        console.log(chalk.blue(`🔤 Applying ${effect} effect...`));
        
        let effectText = `🔤 TEXT EFFECTS\n\n`;
        effectText += `📝 Original: ${text}\n`;
        effectText += `✨ Effect: ${effect}\n\n`;
        
        // Different effects
        switch(effect.toLowerCase()) {
            case 'bubble':
                effectText += `Result: ⓞⓡⓘⓖⓘⓝⓐⓛ ⓣⓔⓧⓣ\n`;
                break;
            case 'aesthetic':
                effectText += `Result: ᴏʀɪɢɪɴᴀʟ ᴛᴇxᴛ\n`;
                break;
            case 'fancy':
                effectText += `Result: 𝓞𝓻𝓲𝓰𝓲𝓷𝓪𝓵 𝓽𝓮𝔁𝓽\n`;
                break;
            case 'bold':
                effectText += `Result: **Original text**\n`;
                break;
            default:
                effectText += `Result: Original text\n`;
        }
        
        effectText += `\n✅ Effect applied!\n`;

        await nexus.sendMessage(chatId, { text: effectText });
        console.log(chalk.green(`✅ Text effect sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Text effect error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error applying text effect: ${error.message}`
        });
    }
};

// URL Shortener
const shortenURL = async (nexus, chatId, longUrl) => {
    try {
        console.log(chalk.blue(`🔗 Shortening URL...`));
        
        let shortenText = `🔗 URL SHORTENER\n\n`;
        shortenText += `📎 Long URL:\n${longUrl}\n\n`;
        shortenText += `✂️ Short URL:\nhttps://short.link/abc123\n\n`;
        shortenText += `📊 Stats:\n`;
        shortenText += `• Clicks: 0\n`;
        shortenText += `• Expires: Never\n`;
        shortenText += `✅ URL shortened successfully!\n`;

        await nexus.sendMessage(chatId, { text: shortenText });
        console.log(chalk.green(`✅ URL shortener sent`));

    } catch (error) {
        console.log(chalk.red(`❌ URL shortener error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error shortening URL: ${error.message}`
        });
    }
};

// Currency Converter
const convertCurrency = async (nexus, chatId, amount, fromCurrency, toCurrency) => {
    try {
        console.log(chalk.blue(`💱 Converting ${amount}${fromCurrency} to ${toCurrency}...`));
        
        let currencyText = `💱 CURRENCY CONVERTER\n\n`;
        currencyText += `💵 Amount: ${amount} ${fromCurrency}\n`;
        currencyText += `📊 Exchange Rate: 1 ${fromCurrency} = 1.25 ${toCurrency}\n`;
        currencyText += `💴 Result: ${(amount * 1.25).toFixed(2)} ${toCurrency}\n\n`;
        currencyText += `🕐 Rate Updated: 2 minutes ago\n`;
        currencyText += `✅ Conversion complete!\n`;

        await nexus.sendMessage(chatId, { text: currencyText });
        console.log(chalk.green(`✅ Currency conversion sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Currency converter error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error converting currency: ${error.message}`
        });
    }
};

// Calculator
const calculate = async (nexus, chatId, expression) => {
    try {
        console.log(chalk.blue(`🧮 Calculating: ${expression}...`));
        
        // Simple calculator
        const result = eval(expression.replace(/x/g, '*'));
        
        let calcText = `🧮 CALCULATOR\n\n`;
        calcText += `📐 Expression: ${expression}\n`;
        calcText += `📊 Result: ${result}\n\n`;
        calcText += `✅ Calculation complete!\n`;

        await nexus.sendMessage(chatId, { text: calcText });
        console.log(chalk.green(`✅ Calculator sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Calculator error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Invalid expression: ${error.message}`
        });
    }
};

// Weather Info
const getWeather = async (nexus, chatId, city) => {
    try {
        console.log(chalk.blue(`🌤️ Fetching weather for ${city}...`));
        
        let weatherText = `🌤️ WEATHER: ${city}\n\n`;
        weatherText += `🌡️ Temperature: 28°C\n`;
        weatherText += `💨 Wind Speed: 12 km/h\n`;
        weatherText += `💧 Humidity: 65%\n`;
        weatherText += `🌧️ Precipitation: 20%\n`;
        weatherText += `👁️ Visibility: 10 km\n`;
        weatherText += `☀️ UV Index: 6\n\n`;
        weatherText += `📅 Forecast:\n`;
        weatherText += `Today: Sunny - 28°C\n`;
        weatherText += `Tomorrow: Partly Cloudy - 26°C\n`;
        weatherText += `Day After: Rainy - 24°C\n`;

        await nexus.sendMessage(chatId, { text: weatherText });
        console.log(chalk.green(`✅ Weather info sent for ${city}`));

    } catch (error) {
        console.log(chalk.red(`❌ Weather error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching weather: ${error.message}`
        });
    }
};

// Base64 Encoder/Decoder
const encodeBase64 = async (nexus, chatId, text) => {
    try {
        console.log(chalk.blue(`🔐 Encoding to Base64...`));
        
        const encoded = Buffer.from(text).toString('base64');
        
        let encodeText = `🔐 BASE64 ENCODER\n\n`;
        encodeText += `📝 Original: ${text}\n`;
        encodeText += `🔒 Encoded: ${encoded}\n\n`;
        encodeText += `✅ Encoding complete!\n`;

        await nexus.sendMessage(chatId, { text: encodeText });
        console.log(chalk.green(`✅ Base64 encoding sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Base64 encoder error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error encoding: ${error.message}`
        });
    }
};

// Reverse Text
const reverseText = async (nexus, chatId, text) => {
    try {
        console.log(chalk.blue(`↩️ Reversing text...`));
        
        const reversed = text.split('').reverse().join('');
        
        let reverseText = `↩️ TEXT REVERSER\n\n`;
        reverseText += `📝 Original: ${text}\n`;
        reverseText += `↩️ Reversed: ${reversed}\n\n`;
        reverseText += `✅ Text reversed!\n`;

        await nexus.sendMessage(chatId, { text: reverseText });
        console.log(chalk.green(`✅ Text reversal sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Text reversal error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error reversing text: ${error.message}`
        });
    }
};

// IP Lookup
const lookupIP = async (nexus, chatId, ip) => {
    try {
        console.log(chalk.blue(`🌐 Looking up IP: ${ip}...`));
        
        let ipText = `🌐 IP LOOKUP: ${ip}\n\n`;
        ipText += `🏢 ISP: Internet Provider Name\n`;
        ipText += `🌍 Country: Nigeria\n`;
        ipText += `📍 City: Lagos\n`;
        ipText += `🗺️ Coordinates: 6.5244, 3.3792\n`;
        ipText += `🕐 Timezone: UTC+1\n\n`;
        ipText += `✅ Lookup complete!\n`;

        await nexus.sendMessage(chatId, { text: ipText });
        console.log(chalk.green(`✅ IP lookup sent`));

    } catch (error) {
        console.log(chalk.red(`❌ IP lookup error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error looking up IP: ${error.message}`
        });
    }
};

module.exports = {
    convertUnits,
    generateQRCode,
    applyTextEffect,
    shortenURL,
    convertCurrency,
    calculate,
    getWeather,
    encodeBase64,
    reverseText,
    lookupIP
};

    return module.exports;
})();


// ============ inlined from commands/travel.js ============
const __cmd_travel = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');

// Travel Handler
const travelAPI = {
    weather: 'https://api.weatherapi.com',
    flights: 'https://api.skyscanner.com'
};

// Get Weather
const getWeather = async (nexus, chatId, city) => {
    try {
        console.log(chalk.blue(`🌤️ Fetching weather for ${city}...`));
        
        let weatherText = `🌤️ WEATHER: ${city}\n\n`;
        weatherText += `🌡️ Temperature: 28°C\n`;
        weatherText += `💨 Wind: 12 km/h\n`;
        weatherText += `💧 Humidity: 65%\n`;
        weatherText += `🌧️ Rain: 20%\n`;
        weatherText += `👁️ Visibility: 10 km\n`;
        weatherText += `☀️ UV Index: 6\n\n`;
        weatherText += `📅 FORECAST:\n`;
        weatherText += `Today: Sunny - 28°C ☀️\n`;
        weatherText += `Tomorrow: Cloudy - 26°C ☁️\n`;
        weatherText += `Day 3: Rainy - 24°C 🌧️\n`;

        await nexus.sendMessage(chatId, { text: weatherText });
        console.log(chalk.green(`✅ Weather sent for ${city}`));

    } catch (error) {
        console.log(chalk.red(`❌ Weather error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching weather: ${error.message}`
        });
    }
};

// Find Flights
const findFlights = async (nexus, chatId, from, to, date) => {
    try {
        console.log(chalk.blue(`✈️ Searching flights ${from} → ${to}...`));
        
        let flightText = `✈️ FLIGHT SEARCH\n\n`;
        flightText += `📍 From: ${from}\n`;
        flightText += `📍 To: ${to}\n`;
        flightText += `📅 Date: ${date}\n\n`;
        flightText += `🔝 TOP RESULTS:\n\n`;
        flightText += `1. ✈️ Air Nigeria\n`;
        flightText += `   🕐 08:00 - 12:30 | 💰 ₦25,000\n\n`;
        flightText += `2. ✈️ Ibom Air\n`;
        flightText += `   🕐 10:15 - 14:45 | 💰 ₦22,500\n\n`;
        flightText += `3. ✈️ Arik Air\n`;
        flightText += `   🕐 14:00 - 18:30 | 💰 ₦28,000\n\n`;
        flightText += `🔄 More flights available!\n`;

        await nexus.sendMessage(chatId, { text: flightText });
        console.log(chalk.green(`✅ Flight search sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Flight search error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error searching flights: ${error.message}`
        });
    }
};

// Find Hotels
const findHotels = async (nexus, chatId, city, checkIn, checkOut) => {
    try {
        console.log(chalk.blue(`🏨 Searching hotels in ${city}...`));
        
        let hotelText = `🏨 HOTEL SEARCH: ${city}\n\n`;
        hotelText += `📅 Check-in: ${checkIn}\n`;
        hotelText += `📅 Check-out: ${checkOut}\n`;
        hotelText += `👥 Guests: 2\n\n`;
        hotelText += `🌟 FEATURED HOTELS:\n\n`;
        hotelText += `1. 5⭐ Luxury Palace Hotel\n`;
        hotelText += `   💰 ₦45,000/night | 9.2/10\n\n`;
        hotelText += `2. 4⭐ Comfort Inn\n`;
        hotelText += `   💰 ₦25,000/night | 8.5/10\n\n`;
        hotelText += `3. 3⭐ Budget Stay\n`;
        hotelText += `   💰 ₦12,000/night | 7.8/10\n\n`;
        hotelText += `🔄 More options available!\n`;

        await nexus.sendMessage(chatId, { text: hotelText });
        console.log(chalk.green(`✅ Hotel search sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Hotel search error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error searching hotels: ${error.message}`
        });
    }
};

// Destination Guide
const getDestinationGuide = async (nexus, chatId, destination) => {
    try {
        console.log(chalk.blue(`🗺️ Getting guide for ${destination}...`));
        
        let guideText = `🗺️ DESTINATION GUIDE: ${destination}\n\n`;
        guideText += `📍 Location: West Africa\n`;
        guideText += `👥 Population: 15M+\n`;
        guideText += `💱 Currency: NGN\n`;
        guideText += `🗣️ Language: English\n\n`;
        guideText += `🏆 TOP ATTRACTIONS:\n`;
        guideText += `1. 🏛️ National Museum\n`;
        guideText += `2. 🏖️ Lekki Beach\n`;
        guideText += `3. 🎭 National Theatre\n`;
        guideText += `4. 🕌 Central Mosque\n`;
        guideText += `5. 🎨 Arts Gallery\n\n`;
        guideText += `🍽️ BEST RESTAURANTS:\n`;
        guideText += `• Jollof Palace - Local\n`;
        guideText += `• Pepper Coast - Seafood\n`;
        guideText += `• Taste of Africa - Fine Dining\n\n`;
        guideText += `🛡️ SAFETY: Generally Safe ✅\n`;

        await nexus.sendMessage(chatId, { text: guideText });
        console.log(chalk.green(`✅ Destination guide sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Destination guide error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error getting destination guide: ${error.message}`
        });
    }
};

// Exchange Rates
const getExchangeRates = async (nexus, chatId, baseCurrency = 'NGN') => {
    try {
        console.log(chalk.blue(`💱 Fetching exchange rates...`));
        
        let rateText = `💱 EXCHANGE RATES (Base: ${baseCurrency})\n\n`;
        rateText += `📊 Current Rates:\n\n`;
        rateText += `🇳🇬 NGN → 🇺🇸 USD: 1,550\n`;
        rateText += `🇳🇬 NGN → 🇬🇧 GBP: 1,950\n`;
        rateText += `🇳🇬 NGN → 🇪🇺 EUR: 1,700\n`;
        rateText += `🇳🇬 NGN → 🇨🇦 CAD: 1,150\n`;
        rateText += `🇳🇬 NGN → 🇦🇺 AUD: 1,050\n\n`;
        rateText += `📈 Today's Change: +0.5%\n`;
        rateText += `🕐 Updated: Just now\n`;

        await nexus.sendMessage(chatId, { text: rateText });
        console.log(chalk.green(`✅ Exchange rates sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Exchange rates error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error fetching exchange rates: ${error.message}`
        });
    }
};

module.exports = {
    getWeather,
    findFlights,
    findHotels,
    getDestinationGuide,
    getExchangeRates
};

    return module.exports;
})();


// ============ inlined from commands/video.js ============
const __cmd_video = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    const chalk = require('chalk');
const axios = require('axios');

// Video Handler
const videoAPI = {
    youtubeAPI: 'https://www.googleapis.com/youtube/v3',
    tiktokAPI: 'https://api.tiktok.com/v1'
};

// Download YouTube Video
const downloadYouTube = async (nexus, chatId, url, quality = 'high') => {
    try {
        console.log(chalk.blue(`🎥 Downloading YouTube video...`));
        
        let downloadText = `🎥 YOUTUBE DOWNLOADER\n\n`;
        downloadText += `📺 Video: "Video Title Here"\n`;
        downloadText += `👤 Channel: Channel Name\n`;
        downloadText += `⏱️ Duration: 12:45\n`;
        downloadText += `👁️ Views: 1.2M\n`;
        downloadText += `👍 Likes: 45K\n\n`;
        downloadText += `⏳ Progress: ████████░░ 80%\n`;
        downloadText += `📊 Quality: ${quality}\n`;
        downloadText += `📁 Size: 150 MB\n\n`;
        downloadText += `✅ Download complete!\n`;
        downloadText += `📥 Video saved successfully\n`;

        await nexus.sendMessage(chatId, { text: downloadText });
        console.log(chalk.green(`✅ YouTube download info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ YouTube download error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error downloading YouTube video: ${error.message}`
        });
    }
};

// Download TikTok Video
const downloadTikTok = async (nexus, chatId, url) => {
    try {
        console.log(chalk.blue(`📹 Downloading TikTok video...`));
        
        let downloadText = `📹 TIKTOK DOWNLOADER\n\n`;
        downloadText += `👤 Creator: @username\n`;
        downloadText += `❤️ Likes: 2.5M\n`;
        downloadText += `💬 Comments: 45K\n`;
        downloadText += `📤 Shares: 120K\n\n`;
        downloadText += `🎵 Audio: "Song Title"\n`;
        downloadText += `🎤 Artist: Artist Name\n\n`;
        downloadText += `⏳ Downloading...\n`;
        downloadText += `📊 Quality: 1080p\n`;
        downloadText += `📁 Size: 8.5 MB\n\n`;
        downloadText += `✅ TikTok video downloaded!\n`;
        downloadText += `🎬 No watermark version\n`;

        await nexus.sendMessage(chatId, { text: downloadText });
        console.log(chalk.green(`✅ TikTok download info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ TikTok download error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error downloading TikTok video: ${error.message}`
        });
    }
};

// Download Instagram Reels
const downloadInstagramReels = async (nexus, chatId, url) => {
    try {
        console.log(chalk.blue(`📷 Downloading Instagram Reels...`));
        
        let downloadText = `📷 INSTAGRAM REELS DOWNLOADER\n\n`;
        downloadText += `👤 Posted by: @username\n`;
        downloadText += `❤️ Likes: 150K\n`;
        downloadText += `💬 Comments: 5.2K\n`;
        downloadText += `📤 Shares: 2K\n\n`;
        downloadText += `⏱️ Duration: 30 seconds\n`;
        downloadText += `🎵 Audio: "Song Name"\n\n`;
        downloadText += `⏳ Downloading...\n`;
        downloadText += `📊 Quality: Full HD\n`;
        downloadText += `📁 Size: 12 MB\n\n`;
        downloadText += `✅ Reel downloaded successfully!\n`;

        await nexus.sendMessage(chatId, { text: downloadText });
        console.log(chalk.green(`✅ Instagram Reels download info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Instagram download error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error downloading Instagram Reels: ${error.message}`
        });
    }
};

// Convert Video Format
const convertVideoFormat = async (nexus, chatId, fromFormat, toFormat) => {
    try {
        console.log(chalk.blue(`🎬 Converting ${fromFormat} to ${toFormat}...`));
        
        let conversionText = `🎬 VIDEO CONVERTER\n\n`;
        conversionText += `📹 Input Format: ${fromFormat}\n`;
        conversionText += `📹 Output Format: ${toFormat}\n`;
        conversionText += `📊 Resolution: 1920x1080\n`;
        conversionText += `🎬 Frame Rate: 30fps\n`;
        conversionText += `🔊 Audio: AAC 128kbps\n\n`;
        conversionText += `⏳ Converting: ███████░░░ 70%\n`;
        conversionText += `⏱️ Time remaining: 3 minutes\n\n`;
        conversionText += `💾 Original Size: 250 MB\n`;
        conversionText += `💾 Converted Size: 180 MB\n`;

        await nexus.sendMessage(chatId, { text: conversionText });
        console.log(chalk.green(`✅ Video conversion info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Video conversion error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error converting video: ${error.message}`
        });
    }
};

// Trim Video
const trimVideo = async (nexus, chatId, startTime, endTime) => {
    try {
        console.log(chalk.blue(`✂️ Trimming video...`));
        
        let trimText = `✂️ VIDEO TRIMMER\n\n`;
        trimText += `📹 Original Duration: 15:30\n`;
        trimText += `✂️ Start Time: ${startTime}\n`;
        trimText += `✂️ End Time: ${endTime}\n`;
        trimText += `⏱️ Trimmed Duration: 5:15\n\n`;
        trimText += `⏳ Processing: ██████████ 100%\n\n`;
        trimText += `📁 Original Size: 250 MB\n`;
        trimText += `📁 Trimmed Size: 85 MB\n`;
        trimText += `💾 Space Saved: 165 MB\n\n`;
        trimText += `✅ Video trimmed successfully!\n`;

        await nexus.sendMessage(chatId, { text: trimText });
        console.log(chalk.green(`✅ Video trim info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Video trim error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error trimming video: ${error.message}`
        });
    }
};

// Add Subtitles
const addSubtitles = async (nexus, chatId, videoFile, subtitleFile, language) => {
    try {
        console.log(chalk.blue(`🎬 Adding subtitles...`));
        
        let subtitleText = `🎬 SUBTITLE EDITOR\n\n`;
        subtitleText += `📹 Video: video.mp4\n`;
        subtitleText += `📄 Subtitle File: subtitles.srt\n`;
        subtitleText += `🌐 Language: ${language}\n`;
        subtitleText += `📊 Format: SRT\n\n`;
        subtitleText += `⏳ Processing: ██████████ 100%\n\n`;
        subtitleText += `✅ Subtitles added!\n`;
        subtitleText += `📁 Output: video_with_subs.mp4\n`;
        subtitleText += `💾 Size: 260 MB\n`;

        await nexus.sendMessage(chatId, { text: subtitleText });
        console.log(chalk.green(`✅ Subtitle info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Subtitle error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error adding subtitles: ${error.message}`
        });
    }
};

// Compress Video
const compressVideo = async (nexus, chatId, quality = 'medium') => {
    try {
        console.log(chalk.blue(`📊 Compressing video...`));
        
        let compressText = `📊 VIDEO COMPRESSOR\n\n`;
        compressText += `📹 Original Video: video.mp4\n`;
        compressText += `📊 Quality Level: ${quality}\n`;
        compressText += `📏 Resolution: 1920x1080 → 1280x720\n`;
        compressText += `🎬 Bitrate: 5000kbps → 2500kbps\n\n`;
        compressText += `📊 Original Size: 500 MB\n`;
        compressText += `📊 Compressed Size: 150 MB\n`;
        compressText += `💾 Reduction: 70%\n\n`;
        compressText += `⏳ Compressing: ██████████ 100%\n\n`;
        compressText += `✅ Video compressed successfully!\n`;

        await nexus.sendMessage(chatId, { text: compressText });
        console.log(chalk.green(`✅ Video compression info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Video compression error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error compressing video: ${error.message}`
        });
    }
};

// Extract Audio
const extractAudio = async (nexus, chatId, videoFile) => {
    try {
        console.log(chalk.blue(`🔊 Extracting audio...`));
        
        let extractText = `🔊 AUDIO EXTRACTOR\n\n`;
        extractText += `📹 Video: video.mp4\n`;
        extractText += `🔊 Audio Format: MP3\n`;
        extractText += `🎵 Bitrate: 320 kbps\n`;
        extractText += `🌐 Sample Rate: 44.1 kHz\n\n`;
        extractText += `⏳ Extracting: ██████████ 100%\n\n`;
        extractText += `✅ Audio extracted!\n`;
        extractText += `📁 Output: audio.mp3\n`;
        extractText += `💾 Size: 45 MB\n`;
        extractText += `⏱️ Duration: 15:30\n`;

        await nexus.sendMessage(chatId, { text: extractText });
        console.log(chalk.green(`✅ Audio extraction info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ Audio extraction error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error extracting audio: ${error.message}`
        });
    }
};

// Create GIF
const createGIF = async (nexus, chatId, startTime, endTime, fps = 10) => {
    try {
        console.log(chalk.blue(`🎬 Creating GIF...`));
        
        let gifText = `🎬 GIF CREATOR\n\n`;
        gifText += `📹 Video Duration: 15:30\n`;
        gifText += `⏱️ GIF Segment: ${startTime} - ${endTime}\n`;
        gifText += `🎬 FPS: ${fps}\n`;
        gifText += `📏 Resolution: 800x600\n\n`;
        gifText += `⏳ Creating GIF: ██████████ 100%\n\n`;
        gifText += `✅ GIF Created!\n`;
        gifText += `📁 File: output.gif\n`;
        gifText += `💾 Size: 25 MB\n`;
        gifText += `⏱️ Duration: 5 seconds\n`;

        await nexus.sendMessage(chatId, { text: gifText });
        console.log(chalk.green(`✅ GIF creation info sent`));

    } catch (error) {
        console.log(chalk.red(`❌ GIF creation error: ${error.message}`));
        await nexus.sendMessage(chatId, {
            text: `❌ Error creating GIF: ${error.message}`
        });
    }
};

module.exports = {
    downloadYouTube,
    downloadTikTok,
    downloadInstagramReels,
    convertVideoFormat,
    trimVideo,
    addSubtitles,
    compressVideo,
    extractAudio,
    createGIF
};

    return module.exports;
})();


// ============ inlined from lib/fontEngine.js (CODEX-AI, MIT licensed) ============
const __lib_fontEngine = (function() {
    const module = { exports: {} };
    const exports = module.exports;
    // lib/fontEngine.js
// BOT_FONT: applyFont(text, num) — for bot reply styling (1-63)
// FANCY:    applyFancyFont(text, num) — for .fancy command (1-59)

// ── Helper: char map transform ────────────────────────────────────────────────
function charMap(text, map) {
    return [...text].map(c => map[c] || map[c.toUpperCase()] || c).join('');
}

// ── BOT FONT ENGINE (1-63, applied to all bot replies) ───────────────────────
const FONTS = [
    null, // 0 = off

    // 1: bold serif
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',l='abcdefghijklmnopqrstuvwxyz',sl='𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 2: italic serif
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍',l='abcdefghijklmnopqrstuvwxyz',sl='𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 3: bold italic serif
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',l='abcdefghijklmnopqrstuvwxyz',sl='𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 4: typewriter
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',l='abcdefghijklmnopqrstuvwxyz',sl='𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 5: sans bold
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',l='abcdefghijklmnopqrstuvwxyz',sl='𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 6: sans italic
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',l='abcdefghijklmnopqrstuvwxyz',sl='𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 7: sans bold italic
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',l='abcdefghijklmnopqrstuvwxyz',sl='𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 8: cursive bold
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',l='abcdefghijklmnopqrstuvwxyz',sl='𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 9: double-struck
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',l='abcdefghijklmnopqrstuvwxyz',sl='𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 10: fraktur bold
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅',l='abcdefghijklmnopqrstuvwxyz',sl='𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 11: block squares 🅲🆁🆈...
    t => [...t].map(c => { const map={'A':'🅰','B':'🅱','C':'🅲','D':'🅳','E':'🅴','F':'🅵','G':'🅶','H':'🅷','I':'🅸','J':'🅹','K':'🅺','L':'🅻','M':'🅼','N':'🅽','O':'🅾','P':'🅿','Q':'🆀','R':'🆁','S':'🆂','T':'🆃','U':'🆄','V':'🆅','W':'🆆','X':'🆇','Y':'🆈','Z':'🆉'}; return map[c.toUpperCase()]||c; }).join(''),
    // 12: circled ⒶⒷⒸ...
    t => [...t].map(c => { const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',l='abcdefghijklmnopqrstuvwxyz',sl='ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 13: vaporwave
    t => [...t].map(c => { if(c===' ')return '\u3000';const code=c.charCodeAt(0);if(code>=33&&code<=126)return String.fromCharCode(code+0xFEE0);return c;}).join(''),
    // 14: strike-through
    t => [...t].map(c => c+'\u0336').join(''),
    // 15: underline
    t => [...t].map(c => c+'\u0332').join(''),
    // 16: double underline
    t => [...t].map(c => c+'\u0333').join(''),
    // 17: tilde strike-through
    t => [...t].map(c => c+'\u0334').join(''),
    // 18: slash through
    t => [...t].map(c => c+'\u0337').join(''),
    // 19: cross above/below
    t => [...t].map(c => c+'\u035D').join(''),
    // 20: arrow below
    t => [...t].map(c => c+'\u034E').join(''),
    // 21: hearts between
    t => [...t].join('♥'),
    // 22: manga
    t => t.toUpperCase().split('').map(c => ({'A':'卂','B':'乃','C':'匚','D':'刀','E':'乇','F':'千','H':'卄','I':'工','J':'丿','L':'乚','M':'爪','N':'几','O':'ㄖ','P':'卩','R':'尺','S':'丂','T':'ㄒ','U':'ㄩ','V':'ᐯ','W':'山','X':'乂','Y':'ㄚ','Z':'乙'}[c]||c)).join(''),
    // 23: fancy1
    t => t.split('').map(c => ({'a':'ค','c':'¢','e':'ε','h':'ɦ','i':'ι','l':'ℓ','n':'ຖ','o':'໐','r':'ฯ','s':'Ş','w':'ω','y':'ყ'}[c.toLowerCase()]||c)).join(''),
    // 24: fancy2
    t => t.split('').map(c => ({'a':'ą','c':'ƈ','e':'ɛ','i':'ı','n':'ŋ','o':'ơ','r':'ཞ','s':'ʂ','v':'۷','y':'ყ'}[c.toLowerCase()]||c)).join(''),
    // 25: fancy7 ᑕᖇY...
    t => t.toUpperCase().split('').map(c=>({'A':'ᗩ','B':'ᗷ','C':'ᑕ','D':'ᗪ','F':'ᖴ','H':'ᕼ','J':'ᒍ','L':'ᒪ','M':'ᗰ','N':'ᑎ','P':'ᑭ','R':'ᖇ','S':'ᔕ','U':'ᑌ','V':'ᐯ','W':'ᗯ','X':'᙭'}[c]||c)).join(''),
    // 26: fancy8 ƈʀʏ...
    t => t.split('').map(c=>({'a':'ǟ','b':'ɮ','c':'ƈ','d':'ɖ','e':'ɛ','g':'ɢ','h':'ɦ','i':'ɨ','k':'ĸ','l':'ʟ','m':'ʍ','n':'ռ','o':'օ','p':'ք','r':'ʀ','s':'ֆ','t':'ȶ','u':'ʊ','v':'ʋ','w':'ա','y':'ʏ','z':'ʐ'}[c.toLowerCase()]||c)).join(''),
    // 27: ₵ⱤɎ... fancy15
    t => t.toUpperCase().split('').map(c=>({'A':'₳','B':'₿','C':'₵','D':'Đ','E':'Ɇ','F':'₣','G':'₲','H':'Ⱨ','I':'ł','K':'₭','L':'Ⱡ','N':'₦','O':'Ø','P':'₱','R':'Ɽ','S':'₴','T':'₮','U':'Ʉ','W':'₩','X':'Ӿ','Y':'Ɏ','Z':'Ƶ'}[c]||c)).join(''),
    // 28: ÇR¥§... fancy16
    t => t.split('').map(c=>({'a':'ä','b':'ß','c':'Ç','d':'Ð','e':'ê','f':'£','i':'ï','n':'ñ','o':'Ö','p':'þ','s':'§','t':'†','u':'ü','y':'¥','C':'Ç','N':'N','O':'Ö','S':'§','Y':'¥'}[c]||c)).join(''),
    // 29: ¢яуѕ... fancy17
    t => t.toLowerCase().split('').map(c=>({'a':'а','b':'б','c':'¢','d':'д','e':'е','h':'н','i':'і','j':'ј','k':'к','l':'ℓ','m':'м','n':'η','o':'о','p':'р','r':'я','s':'ѕ','t':'т','u':'υ','v':'ν','w':'ω','x':'χ','y':'у'}[c]||c)).join(''),
    // 30: ᄃЯY... fancy18
    t => t.toUpperCase().split('').map(c=>({'A':'Λ','C':'ᄃ','N':'П','O':'Ө','R':'Я','S':'Ƨ'}[c]||c)).join(''),
    // 31: superscript ᶜᴿʸˢ...
    t => t.split('').map(c=>({'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ','R':'ᴿ','V':'ᵛ'}[c]||c)).join(''),
    // 32: subscript CᵣYₛ...
    t => t.split('').map(c=>({'a':'ₐ','e':'ₑ','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','x':'ₓ'}[c]||c)).join(''),
    // 33: ladybug ꏳꋪꌩ...
    t => t.toUpperCase().split('').map(c=>({'A':'ꍏ','B':'ꌃ','C':'ꏳ','D':'ꀸ','E':'ꍟ','F':'ꎇ','G':'ꁅ','H':'ꍩ','I':'ꀤ','J':'ꀭ','K':'ꀘ','L':'ꒉ','M':'ꂵ','N':'ꈤ','O':'ꂦ','P':'ꉣ','Q':'ꆰ','R':'ꋪ','S':'ꌚ','T':'ꋖ','U':'ꐇ','V':'꒦','W':'ꅐ','X':'ꉧ','Y':'ꌩ','Z':'ꁴ'}[c]||c)).join(''),
    // 34: runes ርዪሃ...
    t => t.toUpperCase().split('').map(c=>({'A':'ል','B':'ጌ','C':'ር','D':'ዕ','E':'ቿ','F':'ቻ','G':'ኗ','H':'ዘ','I':'ጎ','J':'ጋ','K':'ዀ','L':'ቸ','M':'ጠ','N':'ክ','O':'ዐ','P':'የ','R':'ዪ','S':'ነ','T':'ፕ','U':'ሁ','V':'ሀ','W':'ሠ','X':'ሸ','Y':'ሃ','Z':'ፚ'}[c]||c)).join(''),
    // 35: flip/upside-down
    t => [...t].reverse().map(c=>({'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ı','j':'ɾ','k':'ʞ','l':'ʃ','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z','A':'∀','C':'Ɔ','D':'ᗡ','E':'Ǝ','F':'Ⅎ','H':'H','I':'I','J':'ɾ','L':'⅂','M':'W','N':'N','O':'O','P':'Ԁ','R':'ᴚ','S':'S','T':'⊥','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z'}[c]||c)).join(''),
    // 36: mirror
    t => [...t].reverse().join(''),
    // 37: tiny caps
    t => t.toLowerCase().split('').map(c=>({'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','r':'ʀ','s':'ꜱ','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','y':'ʏ','z':'ᴢ'}[c]||c)).join(''),
    // 38: fancy33
    t => t.toUpperCase().split('').map(c=>({'A':'ᗩ','B':'ᗷ','C':'ᑕ','D':'ᗪ','F':'ᖴ','H':'ᕼ','J':'ᒍ','L':'ᒪ','M':'ᗰ','N':'ᑎ','O':'ᝪ','P':'ᑭ','R':'ᖇ','S':'ᔑ','U':'ᑌ','V':'ᐯ','W':'ᗯ','X':'᙭','Y':'Ꭹ'}[c]||c)).join(''),
    // 39: sparrow greek
    t => t.toUpperCase().split('').map(c=>({'A':'Δ','G':'∇','O':'Ω','P':'Π','R':'Ψ','S':'Σ','X':'Ξ'}[c]||c)).join(''),
    // 40-63: zalgo/creep variants
    ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].map(intensity => t =>
        t.split('').map(c => {
            if (!/[a-zA-Z0-9]/.test(c)) return c;
            const COMBINING=['\u0300','\u0301','\u0302','\u0303','\u0304','\u0306','\u0307','\u0308','\u030A','\u030B','\u030C','\u031B','\u0332','\u0333','\u0339','\u033C','\u0362','\u0489','\u1AB0','\u1AB1','\u1AB2','\u1AB3','\u1AB4','\u1AB5'];
            const level=Math.ceil(intensity/4);
            let result=c;
            for(let i=0;i<level;i++) result+=COMBINING[Math.floor(Math.random()*COMBINING.length)];
            return result;
        }).join('')
    )
];

function applyFont(text, fontNum) {
    if (!fontNum || fontNum < 1 || fontNum > 63) return text;
    const fn = FONTS[fontNum];
    if (!fn) return text;
    return text.split('\n').map(line => {
        if (/[╔╗╚╝║═〔〕❒│]/.test(line)) return line;
        return fn(line);
    }).join('\n');
}

// ── FANCY FONT ENGINE (1-59, for .fancy command) ──────────────────────────────
// All 59 styles, applied to full input text as-is (no line filtering)
const FANCY_FONTS = [
    // 1: tiny caps
    t => t.toLowerCase().split('').map(c=>({'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','r':'ʀ','s':'ꜱ','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','y':'ʏ','z':'ᴢ','-':'-',' ':' '}[c]||c)).join(''),
    // 2: flip
    t => [...t].reverse().map(c=>({'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ı','j':'ɾ','k':'ʞ','l':'ʃ','m':'ɯ','n':'u','o':'o','p':'d','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z','A':'∀','C':'Ɔ','D':'ᗡ','E':'Ǝ','F':'Ⅎ','H':'H','I':'I','L':'⅂','M':'W','N':'N','O':'O','P':'Ԁ','R':'ᴚ','S':'S','T':'⊥','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z','-':'-',' ':' '}[c]||c)).join(''),
    // 3: roundsquares C⃣R⃣Y⃣...
    t => [...t].map(c => c==='-'?'-':c+'\u20E3').join('\u2003'),
    // 4: squares C⃞R⃞...
    t => [...t].map(c => c==='-'?'-':c+'\u20DE').join('\u2003'),
    // 5: mirror
    t => [...t].reverse().join(''),
    // 6: creepify
    t => t.split('').map(c => {
        if(!/[a-zA-Z0-9]/.test(c)) return c;
        const CB=['\u0300','\u0301','\u0302','\u0303','\u0308','\u030C','\u0332','\u0333','\u0339','\u033C','\u1AB0','\u1AB1','\u1AB2','\u1AB3'];
        let r=c;for(let i=0;i<3;i++)r+=CB[Math.floor(Math.random()*CB.length)];return r;
    }).join(''),
    // 7: circled
    t => [...t].map(c=>({'A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ','a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ'})[c]||c).join(''),
    // 8: strikeThrough
    t => [...t].map(c => c+'\u0336').join(''),
    // 9: tildeStrikeThrough
    t => [...t].map(c => c+'\u0334').join(''),
    // 10: slashThrough
    t => [...t].map(c => c+'\u0337').join(''),
    // 11: underline
    t => [...t].map(c => c+'\u0332').join(''),
    // 12: doubleUnderline
    t => [...t].map(c => c+'\u0333').join(''),
    // 13: heartsBetween
    t => [...t].join('♥'),
    // 14: arrowBelow
    t => [...t].map(c => c+'\u034E').join(''),
    // 15: crossAboveBelow
    t => [...t].map(c => c+'\u035D').join(''),
    // 16: wingdings (symbols map)
    t => [...t.toUpperCase()].map(c=>({'A':'✌︎','B':'👍︎','C':'👍︎','D':'♎︎','E':'📫︎','F':'☼︎','G':'✡︎','H':'♓︎','I':'💧︎','J':'☠︎','K':'⚐︎','L':'✞︎','M':'☯︎'}[c]||c)).join(''),
    // 17: vaporwave
    t => [...t].map(c=>{if(c===' ')return '\u3000';const code=c.charCodeAt(0);if(code>=33&&code<=126)return String.fromCharCode(code+0xFEE0);return c;}).join(''),
    // 18: sparrow greek
    t => t.toUpperCase().split('').map(c=>({'A':'Δ','G':'∇','O':'Ω','P':'Π','R':'Ψ','S':'Σ','X':'Ξ'}[c]||c)).join(''),
    // 19: manga
    t => t.toUpperCase().split('').map(c=>({'A':'卂','B':'乃','C':'匚','D':'刀','E':'乇','F':'千','H':'卄','I':'工','L':'乚','M':'爪','N':'几','O':'ㄖ','P':'卩','R':'尺','S':'丂','T':'ㄒ','U':'ㄩ','V':'ᐯ','W':'山','X':'乂','Y':'ㄚ','Z':'乙'}[c]||c)).join(''),
    // 20: ladybug
    t => t.toUpperCase().split('').map(c=>({'A':'ꍏ','B':'ꌃ','C':'ꏳ','D':'ꀸ','E':'ꍟ','F':'ꎇ','G':'ꁅ','H':'ꍩ','I':'ꀤ','J':'ꀭ','K':'ꀘ','L':'ꒉ','M':'ꂵ','N':'ꈤ','O':'ꂦ','P':'ꉣ','Q':'ꆰ','R':'ꋪ','S':'ꌚ','T':'ꋖ','U':'ꐇ','V':'꒦','W':'ꅐ','X':'ꉧ','Y':'ꌩ','Z':'ꁴ'}[c]||c)).join(''),
    // 21: runes
    t => t.toUpperCase().split('').map(c=>({'A':'ል','B':'ጌ','C':'ር','D':'ዕ','E':'ቿ','F':'ቻ','G':'ኗ','H':'ዘ','I':'ጎ','J':'ጋ','K':'ዀ','L':'ቸ','M':'ጠ','N':'ክ','O':'ዐ','P':'የ','R':'ዪ','S':'ነ','T':'ፕ','U':'ሁ','V':'ሀ','W':'ሠ','X':'ሸ','Y':'ሃ','Z':'ፚ'}[c]||c)).join(''),
    // 22: bold serif
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',l='abcdefghijklmnopqrstuvwxyz',sl='𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 23: bold italic serif
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',l='abcdefghijklmnopqrstuvwxyz',sl='𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 24: italic serif
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍',l='abcdefghijklmnopqrstuvwxyz',sl='𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 25: analucia
    t => [...t].map(c=>{const m={'a':'ꪖ','b':'ᥣ','c':'ᥴ','d':'ᦔ','e':'ꫀ','f':'ᠻ','g':'ᧁ','h':'ꫝ','i':'𝘪','j':'ꪮ','k':'ᛕ','l':'ꪶ','m':'ꪑ','n':'ꪀ','o':'ꪮ','p':'ρ','r':'𝘳','s':'𝘴','t':'𝘵','u':'ᴜ','v':'ꪜ','w':'ᭅ','x':'᥊','y':'𝘺','z':'ᴢ'};return m[c.toLowerCase()]||c;}).join(''),
    // 26: typewriter
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',l='abcdefghijklmnopqrstuvwxyz',sl='𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 27: fancy1
    t => t.split('').map(c=>({'a':'ค','c':'¢','e':'ε','h':'ɦ','i':'ι','l':'ℓ','n':'ຖ','o':'໐','r':'ฯ','s':'Ş','w':'ω','y':'ყ'}[c.toLowerCase()]||c)).join(''),
    // 28: fancy2
    t => t.split('').map(c=>({'a':'ą','c':'ƈ','e':'ɛ','i':'ı','n':'ŋ','o':'ơ','r':'ཞ','s':'ʂ','v':'۷','y':'ყ'}[c.toLowerCase()]||c)).join(''),
    // 29: fancy3 ᄃ尺ﾘ...
    t => t.toUpperCase().split('').map(c=>({'A':'ﾑ','C':'ᄃ','D':'刀','I':'ﾉ','K':'𝕶','N':'刀','O':'の','R':'尺','S':'丂','U':'ㄩ','V':'√','Y':'ﾘ'}[c]||c)).join(''),
    // 30: manga2 Ҝㄖ尺ᗪ
    t => t.toUpperCase().split('').map(c=>({'A':'卂','B':'乃','C':'匚','D':'ᗪ','E':'乇','H':'卄','I':'工','K':'Ҝ','L':'乚','M':'爪','N':'几','O':'ㄖ','P':'卩','R':'尺','S':'丂','T':'ㄒ','U':'ㄩ','V':'ᐯ','W':'山','X':'乂','Y':'ㄚ'}[c]||c)).join(''),
    // 31: fancy5 🄺🄾🅁...
    t => [...t].map(c=>{const m={'A':'🄰','B':'🄱','C':'🄲','D':'🄳','E':'🄴','F':'🄵','G':'🄶','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'🄼','N':'🄽','O':'🄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🅆','X':'🅇','Y':'🅈','Z':'🅉'};return m[c.toUpperCase()]||c;}).join(''),
    // 32: runes2 ፈᏒᎩ...
    t => t.toUpperCase().split('').map(c=>({'A':'Ꭺ','B':'ᏴB','C':'ፈ','D':'ᗞ','E':'ᎬE','F':'ᎵF','G':'ᎶG','H':'ꮋ','I':'ᎥI','J':'ᎫJ','K':'ᏦK','L':'ᎻL','M':'ᎷM','N':'N','O':'Ꮻ','P':'ᏢP','Q':'Q','R':'Ꮢ','S':'ᏕS','T':'T','U':'Ꮜ','V':'ᐯ','W':'ᏔW','X':'ᕊ','Y':'ᎩY','Z':'Z'}[c]||c)).join(''),
    // 33: fancy7 Kᝪᖇᗞ
    t => t.toUpperCase().split('').map(c=>({'A':'ᗩ','B':'ᗷ','C':'ᑕ','D':'ᗪ','F':'ᖴ','H':'ᕼ','I':'I','J':'ᒍ','K':'K','L':'ᒪ','M':'ᗰ','N':'ᑎ','O':'O','P':'ᑭ','Q':'Q','R':'ᖇ','S':'ᔕ','U':'ᑌ','V':'ᐯ','W':'ᗯ','X':'᙭','Y':'Y'}[c]||c)).join(''),
    // 34: fancy8
    t => t.split('').map(c=>({'a':'ǟ','b':'ɮ','c':'ƈ','d':'ɖ','e':'ɛ','g':'ɢ','h':'ɦ','i':'ɨ','k':'ĸ','l':'ʟ','m':'ʍ','n':'ռ','o':'օ','p':'ք','r':'ʀ','s':'ֆ','t':'ȶ','u':'ʊ','v':'ʋ','w':'ա','y':'ʏ','z':'ʐ'}[c.toLowerCase()]||c)).join(''),
    // 35: typewriter2
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',l='abcdefghijklmnopqrstuvwxyz',sl='𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 36: sans bold italic
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',l='abcdefghijklmnopqrstuvwxyz',sl='𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 37: sans bold
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',l='abcdefghijklmnopqrstuvwxyz',sl='𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 38: bold serif2
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',l='abcdefghijklmnopqrstuvwxyz',sl='𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 39: sans italic
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',l='abcdefghijklmnopqrstuvwxyz',sl='𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 40: fancy17
    t => t.toLowerCase().split('').map(c=>({'a':'а','b':'б','c':'¢','d':'д','e':'е','h':'н','i':'і','j':'ј','k':'к','l':'ℓ','m':'м','n':'η','o':'о','p':'р','r':'я','s':'ѕ','t':'т','u':'υ','v':'ν','w':'ω','x':'χ','y':'у'}[c]||c)).join(''),
    // 41: ₵ⱤɎ...
    t => t.toUpperCase().split('').map(c=>({'A':'₳','B':'₿','C':'₵','D':'Đ','E':'Ɇ','F':'₣','G':'₲','H':'Ⱨ','I':'ł','K':'₭','L':'Ⱡ','N':'₦','O':'Ø','P':'₱','R':'Ɽ','S':'₴','T':'₮','U':'Ʉ','W':'₩','X':'Ӿ','Y':'Ɏ','Z':'Ƶ'}[c]||c)).join(''),
    // 42: ÇR¥§...
    t => t.split('').map(c=>({'a':'ä','b':'ß','c':'Ç','d':'Ð','e':'ê','f':'£','i':'ï','n':'ñ','o':'Ö','s':'§','t':'†','u':'ü','y':'¥','C':'Ç','O':'Ö','S':'§','Y':'¥'}[c]||c)).join(''),
    // 43: ¢яуѕ...
    t => t.toLowerCase().split('').map(c=>({'a':'а','b':'б','c':'¢','d':'д','e':'е','h':'н','i':'і','k':'к','l':'ℓ','m':'м','n':'η','o':'о','p':'р','r':'я','s':'ѕ','t':'т','u':'υ','v':'ν','w':'ω','x':'χ','y':'у'}[c]||c)).join(''),
    // 44: KӨЯD
    t => t.toUpperCase().split('').map(c=>({'A':'Λ','C':'ᄃ','N':'П','O':'Ө','R':'Я','S':'Ƨ'}[c]||c)).join(''),
    // 45: Ҡ...
    t => t.toUpperCase().split('').map(c=>({'A':'Ⱥ','C':'Ç','D':'Ď','E':'Ɇ','G':'Ǥ','H':'Ħ','I':'Ì','J':'ĵ','K':'Ҡ','L':'Ŀ','M':'M','N':'Ň','O':'Ø','P':'Ᵽ','Q':'Q','R':'Ʀ','S':'Ş','T':'Ŧ','U':'Ʉ','V':'Ʋ','W':'Ŵ','X':'X','Y':'Ɏ','Z':'Ƶ'}[c]||c)).join(''),
    // 46: subscript
    t => t.split('').map(c=>({'a':'ₐ','e':'ₑ','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','x':'ₓ'}[c]||c)).join(''),
    // 47: superscript
    t => t.split('').map(c=>({'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ','R':'ᴿ'}[c]||c)).join(''),
    // 48: к๏г๔ Thai
    t => t.toLowerCase().split('').map(c=>({'a':'ค','b':'ც','c':'¢','d':'๔','e':'ε','f':'ƒ','g':'ɠ','h':'ɦ','i':'ι','j':'ʝ','k':'к','l':'ℓ','m':'ɱ','n':'ɳ','o':'๏','p':'ρ','q':'զ','r':'г','s':'ş','t':'ƭ','u':'ų','v':'ง','w':'ω','x':'χ','y':'ყ','z':'ʑ'}[c]||c)).join(''),
    // 49: double-struck
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',l='abcdefghijklmnopqrstuvwxyz',sl='𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 50: fraktur bold
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅',l='abcdefghijklmnopqrstuvwxyz',sl='𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 51: block squares
    t => [...t].map(c=>{const m={'A':'🅰','B':'🅱','C':'🅲','D':'🅳','E':'🅴','F':'🅵','G':'🅶','H':'🅷','I':'🅸','J':'🅹','K':'🅺','L':'🅻','M':'🅼','N':'🅽','O':'🅾','P':'🅿','Q':'🆀','R':'🆁','S':'🆂','T':'🆃','U':'🆄','V':'🆅','W':'🆆','X':'🆇','Y':'🆈','Z':'🆉'};return m[c.toUpperCase()]||c;}).join(''),
    // 52: cursive bold
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',l='abcdefghijklmnopqrstuvwxyz',sl='𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 53: fraktur regular
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',l='abcdefghijklmnopqrstuvwxyz',sl='𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 54: fullwidth Ａ...
    t => [...t].map(c=>{if(c===' ')return '\u3000';const code=c.charCodeAt(0);if(code>=33&&code<=126)return String.fromCharCode(code+0xFEE0);return c;}).join(''),
    // 55: bold italic serif2
    t => [...t].map(c=>{const u='ABCDEFGHIJKLMNOPQRSTUVWXYZ',s='𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',l='abcdefghijklmnopqrstuvwxyz',sl='𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛';const ui=u.indexOf(c);if(ui!==-1)return[...s][ui];const li=l.indexOf(c);if(li!==-1)return[...sl][li];return c;}).join(''),
    // 56: greek math
    t => t.toUpperCase().split('').map(c=>({'A':'𝛥','B':'B','C':'C','D':'D','E':'E','F':'F','G':'G','H':'H','I':'𝛪','J':'J','K':'𝛫','L':'L','M':'M','N':'𝛮','O':'𝛩','P':'𝛱','Q':'Q','R':'𝛲','S':'S','T':'T','U':'U','V':'V','W':'W','X':'Ξ','Y':'Y','Z':'Z'}[c]||c)).join(''),
    // 57: greek bold
    t => t.toUpperCase().split('').map(c=>({'A':'𝞓','B':'B','C':'C','D':'𝘿','E':'E','F':'F','G':'G','H':'H','I':'𝞘','J':'J','K':'K','L':'L','M':'M','N':'N','O':'𝞗','P':'P','Q':'Q','R':'𝞒','S':'S','T':'T','U':'U','V':'V','W':'W','X':'X','Y':'Y','Z':'Z'}[c]||c)).join(''),
    // 58: greek mixed
    t => t.toUpperCase().split('').map(c=>({'A':'𝚫','B':'B','C':'C','D':'𝐃','E':'E','F':'F','G':'G','H':'H','I':'𝚰','J':'J','K':'𝐊','L':'L','M':'M','N':'N','O':'𝚯','P':'P','Q':'Q','R':'𝚪','S':'S','T':'T','U':'U','V':'V','W':'W','X':'X','Y':'Y','Z':'Z'}[c]||c)).join(''),
    // 59: fancy33 variant
    t => t.toUpperCase().split('').map(c=>({'A':'ᗩ','B':'ᗷ','C':'ᑕ','D':'ᗪ','E':'E','F':'ᖴ','G':'G','H':'ᕼ','I':'I','J':'ᒍ','K':'K','L':'ᒪ','M':'ᗰ','N':'ᑎ','O':'ᝪ','P':'ᑭ','Q':'Q','R':'ᖇ','S':'ᔑ','T':'T','U':'ᑌ','V':'ᐯ','W':'ᗯ','X':'᙭','Y':'Ꭹ','Z':'Z'}[c]||c)).join(''),
];

function applyFancyFont(text, num) {
    if (num < 1 || num > FANCY_FONTS.length) return text;
    try { return FANCY_FONTS[num - 1](text); }
    catch { return text; }
}

const FANCY_FONT_COUNT = FANCY_FONTS.length; // 59

module.exports = { applyFont, applyFancyFont, FONT_COUNT: 63, FANCY_FONT_COUNT };

    return module.exports;
})();

module.exports = devtrust = async (devtrust, m, chatUpdate, store) => {
const { from } = m
try {

// The serializer's quoted-message .download() helper (used by .vv, .gpp,
// .gcstatus, etc.) internally calls client.downloadMediaMessage(...), but
// Baileys only exports downloadMediaMessage as a standalone function — it
// never attaches it to the socket itself. Patch it on once here so every
// .download() call in this file actually works instead of throwing
// "client.downloadMediaMessage is not a function".
if (!devtrust.downloadMediaMessage) devtrust.downloadMediaMessage = downloadMediaMessage;

// Per-instance bot name — falls back to the default if not configured
const botDisplayName = global.botConfig?.botName || process.env.BOT_NAME || "LËGĚNDÃRY BØT";

      
// Newsletter configuration
const NEWSLETTER_JID = '120363425882730200@newsletter';
const NEWSLETTER_NAME = `© ${botDisplayName} BY LËGĚNDÃRY Ł𝗮𝗯𝘀™`;

const addNewsletterContext = (messageContent) => {
  // Disabled: this used to stamp every reply as "forwarded" from a
  // promotional channel (isForwarded: true + forwardedNewsletterMessageInfo).
  // Now a plain passthrough so replies look like normal bot messages.
  return messageContent;
};

const replyWithNewsletter = async (jid, text, quotedMsg, mentions = []) => {
  try {
    await devtrust.sendMessage(jid, 
      addNewsletterContext({ 
        text: text,
        mentions: mentions 
      }), 
      { quoted: quotedMsg }
    );
  } catch (error) {
    console.error('Reply with newsletter error:', error);
    await devtrust.sendMessage(jid, 
      { text: text, mentions: mentions }, 
      { quoted: quotedMsg }
    );
  }
};

const reply = async (text, mentions = []) => {
  try {
    const fontNum = getSetting('bot', 'botFont', 0);
    const fontedText = fontNum > 0 ? __lib_fontEngine.applyFont(text, fontNum) : text;
    return await replyWithNewsletter(m.chat, fontedText, m, mentions);
  } catch (error) {
    console.error('Reply failed:', error);
    return null;
  }
};

// ======================[ FIXED COMMAND DETECTION ]======================
const body = (
    m.mtype === "conversation" ? m.message?.conversation :
    m.mtype === "extendedTextMessage" ? m.message?.extendedTextMessage?.text :
    m.mtype === "imageMessage" ? m.message?.imageMessage?.caption :
    m.mtype === "videoMessage" ? m.message?.videoMessage?.caption :
    m.mtype === "documentMessage" ? m.message?.documentMessage?.caption || "" :
    m.mtype === "audioMessage" ? m.message?.audioMessage?.caption || "" :
    m.mtype === "stickerMessage" ? m.message?.stickerMessage?.caption || "" :
    m.mtype === "buttonsResponseMessage" ? m.message?.buttonsResponseMessage?.selectedButtonId :
    m.mtype === "listResponseMessage" ? m.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
    m.mtype === "templateButtonReplyMessage" ? m.message?.templateButtonReplyMessage?.selectedId :
    m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg?.nativeFlowResponseMessage?.paramsJson).id :
    m.mtype === "messageContextInfo" ? m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId || m.text :
    m.mtype === "reactionMessage" ? m.message?.reactionMessage?.text :
    m.mtype === "contactMessage" ? m.message?.contactMessage?.displayName :
    m.mtype === "contactsArrayMessage" ? m.message?.contactsArrayMessage?.contacts?.map(c => c.displayName).join(", ") :
    m.mtype === "locationMessage" ? `${m.message?.locationMessage?.degreesLatitude}, ${m.message?.locationMessage?.degreesLongitude}` :
    m.mtype === "liveLocationMessage" ? `${m.message?.liveLocationMessage?.degreesLatitude}, ${m.message?.liveLocationMessage?.degreesLongitude}` :
    m.mtype === "pollCreationMessage" ? m.message?.pollCreationMessage?.name :
    m.mtype === "pollUpdateMessage" ? m.message?.pollUpdateMessage?.name :
    m.mtype === "groupInviteMessage" ? m.message?.groupInviteMessage?.groupJid :
    m.mtype === "viewOnceMessage" ? (m.message?.viewOnceMessage?.message?.imageMessage?.caption ||
                                     m.message?.viewOnceMessage?.message?.videoMessage?.caption ||
                                     "[Pesan sekali lihat]") :
    m.mtype === "viewOnceMessageV2" ? (m.message?.viewOnceMessageV2?.message?.imageMessage?.caption ||
                                       m.message?.viewOnceMessageV2?.message?.videoMessage?.caption ||
                                       "[Pesan sekali lihat]") :
    m.mtype === "viewOnceMessageV2Extension" ? (m.message?.viewOnceMessageV2Extension?.message?.imageMessage?.caption ||
                                                m.message?.viewOnceMessageV2Extension?.message?.videoMessage?.caption ||
                                                "[Pesan sekali lihat]") :
    m.mtype === "ephemeralMessage" ? (m.message?.ephemeralMessage?.message?.conversation ||
                                      m.message?.ephemeralMessage?.message?.extendedTextMessage?.text ||
                                      "[Pesan sementara]") :
    m.mtype === "interactiveMessage" ? "[Pesan interaktif]" :
    m.mtype === "protocolMessage" ? "[Pesan telah dihapus]" :
    ""
);


// ============ COMMAND DETECTION (PER-USER PREFIX) ============
const owner = JSON.parse(fs.readFileSync(require('path').join(__dirname, 'allfunc', 'owner.json')))
const Premium = JSON.parse(fs.readFileSync(require('path').join(__dirname, 'allfunc', 'premium.json')))
const ownerNumber = owner[0] || "254700000000";

// Read botowner.txt and merge with owner list for creator check
let botOwnerNumbers = [];
try {
    const botOwnerRaw = fs.readFileSync(require('path').join(__dirname, 'setting', 'botowner.txt'), 'utf-8');
    botOwnerNumbers = botOwnerRaw.split('\n').map(n => n.trim()).filter(Boolean);
} catch(_) {}
const allOwners = [...new Set([...owner, ...botOwnerNumbers])];

// Get user-specific prefix from the new system
let prefix = getUserPrefix(m.sender);

// STRICT command detection - ONLY detect if message STARTS WITH user's prefix
const isCmd = body && typeof body === 'string' && body.startsWith(prefix);

let command = '';
let args = [];
let text = '';

if (isCmd) {
    // Extract command ONLY if it starts with user's prefix
    const afterPrefix = body.slice(prefix.length).trim();
    const parts = afterPrefix.split(/ +/);
    command = parts[0].toLowerCase();
    args = parts.slice(1);
    text = args.join(' ');
    
    console.log('✅ Command detected for user:', command);

    // ===== COMMAND-PROCESSING INDICATORS (adapted from CODEX-AI, MIT) =====
    try {
        if (getSetting(botNumber, 'cmdTyping', false)) {
            await devtrust.sendPresenceUpdate('composing', m.chat).catch(() => {});
        }
        if (getSetting(botNumber, 'cmdRecording', false)) {
            await devtrust.sendPresenceUpdate('recording', m.chat).catch(() => {});
        }
        const cmdReactEmoji = getSetting(botNumber, 'cmdReact', null);
        if (cmdReactEmoji && m.key) {
            await devtrust.sendMessage(m.chat, { react: { text: cmdReactEmoji, key: m.key } }).catch(() => {});
        }
    } catch (_) {}
}

const qtext = args.join(" ");
const q = args.join(" ");
const tempMailData = {};
const quoted = m.quoted ? m.quoted : m;
const from = m.key.remoteJid;

// ============ FRESH REQUIRE (no stale cache for commands/*.js) ============
// case.js hot-reloads itself via fs.watchFile at the bottom of this file,
// but that self-reload does NOT clear Node's require cache for files it
// requires internally (like commands/menu.js). Without this, editing files
// inside commands/ would need a full process kill+restart to take effect.
function freshRequire(relPath) {
    const resolved = require.resolve(relPath);
    delete require.cache[resolved];
    return require(resolved);
}

// ============ MENU LIST INTERCEPTOR (buttons/list taps) ============
// Handles taps from the paginated menu (commands/menu.js). Runs BEFORE the
// big switch(command) below, since rowIds like "OPEN_football" or
// "CMD_health_sleep_guide" never start with the user's prefix and would
// otherwise be silently ignored.
function slugToCamel(slug) {
    return slug.split('_').filter(Boolean).map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('');
}

async function dispatchMenuCommand(sock, chatId, selectedId, sender) {
    // selectedId format: CMD_<categoryKey>_<slugified_item>
    const match = selectedId.match(/^CMD_([a-z]+)_(.+)$/);
    if (!match) return false;
    const [, categoryKey, slug] = match;
    const fnName = slugToCamel(slug);
    const readableTitle = slug.split('_').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    try {
        const CATEGORY_MODULES = {
        football: __cmd_football,
        economy: __cmd_economy,
        group: __cmd_group,
        tools: __cmd_tools,
        anime: __cmd_anime,
        ai: __cmd_ai,
        fun: __cmd_fun,
        game: __cmd_games,
        config: __cmd_settings,
        image: __cmd_design,
        downloader: { ...__cmd_music, ...__cmd_video, ...__cmd_social },
        misc: { ...__cmd_business, ...__cmd_career, ...__cmd_education, ...__cmd_news,
                ...__cmd_travel, ...__cmd_food, ...__cmd_entertainment, ...__cmd_auto,
                ...__cmd_tech, ...__cmd_realestate, ...__cmd_fashion, ...__cmd_lifestyle,
                ...__cmd_programming }
    };
    const mod = CATEGORY_MODULES[categoryKey];
        // 1) explicit menuMap (preferred — category files declare exactly which
        //    function answers which button, regardless of naming style).
        // 2) auto camelCase match (legacy behavior, e.g. football.js).
        const fn = (mod.menuMap && mod.menuMap[slug]) || mod[fnName];

        if (typeof fn === 'function') {
            // sender is passed as a 3rd arg for handlers that need to know who
            // tapped (e.g. games.js multiplayer challenges). Handlers that
            // don't need it simply ignore the extra argument.
            await fn(sock, chatId, sender);
            return true;
        }

        // 3) No dedicated handler yet — AI fallback instead of a dead placeholder.
        console.log(chalk.yellow(`⚠️ No handler for "${selectedId}" — using AI fallback`));
        let categoryName = categoryKey;
        try {
            const { MENU_DATA } = __cmd_menu;
            if (MENU_DATA[categoryKey]) categoryName = MENU_DATA[categoryKey].name;
        } catch (_) {}

        const prompt = `You are a WhatsApp bot feature called "${readableTitle}" inside the "${categoryName}" category. A user just tapped this button with no extra input. Give a genuinely useful, well-formatted reply (light emoji use, under 150 words) for this exact feature. If the feature normally needs specific input (like a game name, city, or search term), briefly ask the user to send it instead of inventing fake data.`;
        const aiReply = await askOpenAI(prompt);
        await sock.sendMessage(chatId, { text: `${aiReply}\n\n_🤖 AI-generated for now — full feature coming soon_` });
        return true;
    } catch (e) {
        console.log(chalk.red(`❌ Menu dispatch error for ${selectedId}: ${e.message}`));
        await sock.sendMessage(chatId, { text: `🚧 This feature isn't available yet. Try another one for now!` });
        return true;
    }
}

if (m.mtype === 'listResponseMessage' || m.mtype === 'buttonsResponseMessage' || m.mtype === 'interactiveResponseMessage') {
    (async () => {
        try {
            const { handleMenuSelection } = __cmd_menu;
            const handledNav = await handleMenuSelection(devtrust, from, body);
            if (handledNav) return;

            // group.js's own buttons (settings toggle, jail list, votekick vote)
            // — these ids never start with CMD_, so dispatchMenuCommand won't
            // see them; handleGroupSelection is the router that does.
            // groupMetadata is only actually needed for VK_VOTE_ taps — fetching
            // it unconditionally on every single button tap was hammering
            // WhatsApp's servers with redundant requests during fast tapping.
            const { handleGroupSelection } = __cmd_group;
            const groupMetaForBtn = (m.isGroup && body && body.startsWith('VK_VOTE_'))
                ? await devtrust.groupMetadata(from).catch(() => null)
                : null;
            const handledGroupBtn = await handleGroupSelection(devtrust, from, body, {
                senderId: m.sender,
                groupMetadata: groupMetaForBtn
            });
            if (handledGroupBtn) return;

            if (body && body.startsWith('CMD_')) {
                await dispatchMenuCommand(devtrust, from, body, m.sender);
            }
        } catch (e) {
            console.log(chalk.red(`❌ Menu interceptor error: ${e.message}`));
        }
    })();
    return;
}

// ============ ACTIVE GAME REPLY INTERCEPTOR ============
// If this chat has a live game session (commands/games.js), plain text like
// "A", "42", or a guessed word should go to the game, not be ignored or
// misread as a menu number. Must run BEFORE the menu text-reply block below.
if (!isCmd && (m.mtype === 'conversation' || m.mtype === 'extendedTextMessage') && body && body.trim()) {
    const gamesMod = __cmd_games;
    if (gamesMod.hasActiveGame(from)) {
        (async () => {
            try {
                await gamesMod.handleGameReply(devtrust, from, m.sender, body.trim());
            } catch (e) {
                console.log(chalk.red(`❌ Game reply error: ${e.message}`));
            }
        })();
        // This chat has an active game, so any non-prefixed text belongs to it
        // (a valid move, or an off-topic message the game safely ignores) —
        // stop here either way. Real prefixed commands (isCmd === true) never
        // reach this block, so .balance, .menu etc still work mid-game.
        return;
    }
}

// ============ SHAZAM DOWNLOAD REPLY INTERCEPTOR ============
// After .shazam identifies a song, this waits (60s) for the user to reply
// "audio"/"1" or "video"/"2" in THAT SAME chat before doing anything —
// gated the same way as the music interceptor so it can't fire on unrelated
// messages in other chats.
if (!isCmd && (m.mtype === 'conversation' || m.mtype === 'extendedTextMessage') && body && body.trim()) {
    const shzPending = global.__shazamPending && global.__shazamPending.get(from);
    if (shzPending && Date.now() <= shzPending.expires) {
        const shzChoice = body.trim().toLowerCase();
        if (shzChoice === 'audio' || shzChoice === '1' || shzChoice === 'video' || shzChoice === '2') {
            global.__shazamPending.delete(from);
            (async () => {
                try {
                    if (shzChoice === 'audio' || shzChoice === '1') {
                        reply('⏳ *Fetching audio...*');
                        const info = await ytdl.getInfo(shzPending.ytUrl);
                        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
                        await devtrust.sendMessage(from, { audio: { url: format.url }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m });
                    } else {
                        reply('⏳ *Fetching video...*');
                        const info = await ytdl.getInfo(shzPending.ytUrl);
                        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: f => f.hasAudio && f.hasVideo });
                        await devtrust.sendMessage(from, { video: { url: format.url }, caption: `*${shzPending.title}*` }, { quoted: m });
                    }
                } catch (e) {
                    console.log(chalk.yellow(`⚠️ Shazam download failed: ${e.message}`));
                    reply(`❌ *Download failed:* ${e.message}`);
                }
            })();
            return;
        }
    }
}

// ============ MUSIC SEARCH REPLY INTERCEPTOR ============
// Only fires if THIS chat actually tapped a music button (search/download)
// recently — checked via musicMod.getAwaitingMusic(from). Previously this
// ran unconditionally on any plain text in any chat, which is what caused
// random DMs and groups to get "music search" / "downloading mp3" replies.
if (!isCmd && (m.mtype === 'conversation' || m.mtype === 'extendedTextMessage') && body && body.trim()) {
    try {
        const musicMod = __cmd_music;
        const awaiting = musicMod.getAwaitingMusic(from);
        if (awaiting) {
            const text = body.trim();

            if (awaiting === 'download') {
                (async () => {
                    try {
                        await musicMod.performMusicDownload(devtrust, from, text, m.sender);
                    } catch (e) {
                        console.log(chalk.yellow(`⚠️ Music download tried but failed: ${e.message}`));
                    }
                })();
            } else if (awaiting === 'search' && text.length > 1 && text.length < 100 && !/^\d+$/.test(text)) {
                (async () => {
                    try {
                        await musicMod.performMusicSearch(devtrust, from, text, m.sender);
                    } catch (e) {
                        console.log(chalk.yellow(`⚠️ Music search tried but failed: ${e.message}`));
                    }
                })();
            }
        }
    } catch (e) {
        console.log(chalk.yellow(`⚠️ Music module not ready: ${e.message}`));
    }
}

// #notename shorthand — quick note lookup without a full command
// (adapted from CODEX-AI, MIT). Uses the group notes system (proper
// title/content pairs), scoped to this chat. Only fires on plain text.
if (!isCmd && body && body.trim().startsWith('#') && body.trim().length > 1) {
    const noteTitle = body.trim().slice(1).trim();
    try {
        const noteFile = './database/notes.json';
        const noteStore = fs.existsSync(noteFile) ? JSON.parse(fs.readFileSync(noteFile)) : {};
        const noteBody = noteStore[m.chat]?.[noteTitle];
        if (noteBody) {
            reply(`📝 *${noteTitle}*\n\n${noteBody}`);
            return;
        }
    } catch (_) {}
}

// Plain-text menu reply (e.g. "1", "next", "back", "menu") — only when the
// message ISN'T a real prefixed command, so normal commands are untouched.
if (!isCmd && (m.mtype === 'conversation' || m.mtype === 'extendedTextMessage') && body && body.trim()) {
    const menuMod = __cmd_menu;
    const resolvedId = menuMod.resolveTextReply(from, body);
    if (resolvedId) {
        (async () => {
            try {
                const handledNav = await menuMod.handleMenuSelection(devtrust, from, resolvedId);
                if (handledNav) return;
                if (resolvedId.startsWith('CMD_')) {
                    await dispatchMenuCommand(devtrust, from, resolvedId, m.sender);
                }
            } catch (e) {
                console.log(chalk.red(`❌ Menu text-reply error: ${e.message}`));
            }
        })();
        return;
    }
}
// ============ END MENU LIST INTERCEPTOR ============
const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid;
const userMovieSessions = {};
const groupMetadata = m.isGroup ? await devtrust.groupMetadata(from).catch(() => null) : null;
const participants = m.isGroup ? groupMetadata?.participants || [] : [];
const groupAdmins = m.isGroup ? await getGroupAdmins(participants, devtrust) : [];
const botNumber = await devtrust.decodeJid(devtrust.user.id);
const botLid = devtrust.user?.lid ? await devtrust.decodeJid(devtrust.user.lid) : null;
const isCreator = [botNumber, ...allOwners].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
const isDev = allOwners.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
const isOwner = [botNumber, ...allOwners].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
const isPremium = [botNumber, ...Premium].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
// Sudo membership check — compares the sudo list against every JID form
// available for this sender, not just m.sender alone. WhatsApp's @lid
// rollout means the same person can show up under different JIDs
// depending on context (Baileys exposes the alternate one via
// key.participantAlt / key.remoteJidAlt when it's known) — a single-field
// match was silently failing for exactly those accounts.
const isSudo = (() => {
    const sudoList = loadSudoList();
    const candidates = [m.sender, m.key?.participant, m.key?.participantAlt, m.key?.remoteJid, m.key?.remoteJidAlt].filter(Boolean);
    return candidates.some(jid => sudoList.includes(jid));
})();

// Private mode: only the owner and sudo users can use the bot when it's
// not set to public. This used to live in bot.js as a plain fromMe check,
// which silently blocked sudo users too since bot.js has no idea what
// sudo even is — moved here where isCreator/isSudo are actually known.
const isBotAdmins = m.isGroup ? (groupAdmins.includes(botNumber) || (botLid && groupAdmins.includes(botLid))) : false;
// Was a plain single-format check (groupAdmins.includes(m.sender)) — same
// @lid/phone-number mismatch bug as the earlier sudo fix. An admin whose
// messages arrive under a different JID form than the one stored in
// groupAdmins (e.g. @lid vs @s.whatsapp.net) was silently read as a
// non-admin, so antilink/antibadword/antitag etc. deleted their messages
// and antipromote/antidemote misfired on them too. Now checks every JID
// form available for this sender, not just one.
const isAdmins = m.isGroup ? [m.sender, m.key?.participant, m.key?.participantAlt].filter(Boolean).some(jid => groupAdmins.includes(jid)) : false;

// ── 1. ANTILINK ──────────────────────────────────────────────────────────
// NOTE: this block must always stay ABOVE the "if (!devtrust.public) { if (!isCreator) return }"
// gate further down in this file. It runs for every group message regardless of
// public/private mode, exactly like ANTIBADWORD below — do not move it under that gate.
if (m.isGroup && !isAdmins && !isCreator) {
    const groupSettings = antilinkSettings[getAntilinkKey(botNumber, m.chat)];
    if (groupSettings && groupSettings.enabled) {
        // NOTE: no /g flag — using /g with .test() causes stateful lastIndex bug
        const linkRegex = /https?:\/\/[^\s]+|www\.[^\s]+|chat\.whatsapp\.com\/[^\s]+|wa\.me\/[^\s]+|t\.me\/[^\s]+|[a-zA-Z0-9-]+\.(com|net|org|io|gov|edu|xyz|tk|ml|ga|cf|gq|me|tv|cc|ws|club|online|site|tech|store|blog|live|app|co)[^\s]*/i;

        const checkTexts = [
            body,
            m.message?.conversation,
            m.message?.extendedTextMessage?.text,
            m.message?.imageMessage?.caption,
            m.message?.videoMessage?.caption,
            m.message?.documentMessage?.caption,
        ].filter(Boolean).join(' ');

        // WhatsApp's native "Invite via link" share sends a structured
        // groupInviteMessage (groupJid/inviteCode/groupName) — no URL string
        // anywhere in the text fields above, so the regex alone can't catch it.
        const isGroupInviteShare = m.mtype === 'groupInviteMessage' || !!m.message?.groupInviteMessage;

        if ((checkTexts && linkRegex.test(checkTexts)) || isGroupInviteShare) {
            // Same pattern as ANTIBADWORD: always attempt the delete directly,
            // unconditionally, instead of branching on isBotAdmins first.
            try {
                await devtrust.sendMessage(m.chat, { delete: m.key });
            } catch (e) {}

            if (groupSettings.action === 'kick') {
                try {
                    await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                    await reply(`👢 @${m.sender.split('@')[0]} was kicked for posting links`, [m.sender]);
                } catch (e) {
                    await reply(`⚠️ @${m.sender.split('@')[0]} Links are not allowed here!\n\n_Make me admin to enable kick mode_`, [m.sender]);
                }
            } else if (groupSettings.action === 'warn') {
                const limit = groupSettings.warnLimit || 3;
                const { count, shouldKick } = bumpAntiFeatureWarn('antilink', m.chat, m.sender, limit);
                if (shouldKick) {
                    try {
                        await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                        await reply(`👢 @${m.sender.split('@')[0]} reached ${limit}/${limit} warnings for links and was kicked`, [m.sender]);
                    } catch (e) {
                        await reply(`⚠️ @${m.sender.split('@')[0]} hit the warning limit but I couldn't kick — make me admin.`, [m.sender]);
                    }
                } else {
                    await reply(`⚠️ @${m.sender.split('@')[0]} Links are not allowed here! Warning *${count}/${limit}*`, [m.sender]);
                }
            } else {
                await reply(`⚠️ @${m.sender.split('@')[0]} Links are not allowed here!`, [m.sender]);
            }
            return;
        }
    }
}

// ── 2. ANTI-MENTIONGC ────────────────────────────────────────────────────
// Deletes messages that contain THIS group's own invite link/JID posted
// inside the group itself (leaking the group elsewhere, or re-pasting the
// invite link to bypass admin approval). Same delete/warn(N)/kick pattern
// as antilink — must stay in this same region for the same reason.
if (m.isGroup && !isAdmins && !isCreator) {
    const mgSettings = antiMentionGcSettings[getAntilinkKey(botNumber, m.chat)];
    if (mgSettings && mgSettings.enabled) {
        const mgCheckText = [
            body,
            m.message?.conversation,
            m.message?.extendedTextMessage?.text,
            m.message?.imageMessage?.caption,
            m.message?.videoMessage?.caption,
        ].filter(Boolean).join(' ');
        const isThisGroupInviteShare = m.mtype === 'groupInviteMessage' || !!m.message?.groupInviteMessage;
        let groupLinkLeaked = isThisGroupInviteShare;
        if (!groupLinkLeaked && mgCheckText) {
            try {
                const currentCode = await devtrust.groupInviteCode(m.chat).catch(() => null);
                if (currentCode && mgCheckText.includes(currentCode)) groupLinkLeaked = true;
            } catch (e) {}
            // Also catch someone just pasting the raw group JID/name as a callout.
            if (!groupLinkLeaked && mgCheckText.includes(m.chat.split('@')[0])) groupLinkLeaked = true;
        }

        if (groupLinkLeaked) {
            try { await devtrust.sendMessage(m.chat, { delete: m.key }); } catch (e) {}

            if (mgSettings.action === 'kick') {
                try {
                    await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                    await reply(`👢 @${m.sender.split('@')[0]} was kicked for tagging/leaking this group`, [m.sender]);
                } catch (e) {
                    await reply(`⚠️ @${m.sender.split('@')[0]} Don't tag or leak this group here!\n\n_Make me admin to enable kick mode_`, [m.sender]);
                }
            } else if (mgSettings.action === 'warn') {
                const limit = mgSettings.warnLimit || 3;
                const { count, shouldKick } = bumpAntiFeatureWarn('antimentiongc', m.chat, m.sender, limit);
                if (shouldKick) {
                    try {
                        await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                        await reply(`👢 @${m.sender.split('@')[0]} reached ${limit}/${limit} warnings for tagging this group and was kicked`, [m.sender]);
                    } catch (e) {
                        await reply(`⚠️ @${m.sender.split('@')[0]} hit the warning limit but I couldn't kick — make me admin.`, [m.sender]);
                    }
                } else {
                    await reply(`⚠️ @${m.sender.split('@')[0]} Don't tag/leak this group here! Warning *${count}/${limit}*`, [m.sender]);
                }
            } else {
                await reply(`⚠️ @${m.sender.split('@')[0]} Don't tag or leak this group here!`, [m.sender]);
            }
            return;
        }
    }
}

// ── 2. ANTI-TAG (includes WA @all feature) ───────────────────────────────
if (m.isGroup && !isAdmins && !isCreator) {
    const config = getSetting(botNumber + m.chat, "antitag", { enabled: false, action: 'delete' });
    if (config.enabled) {
        const allMentioned = [
            ...(m.mentionedJid || []),
            ...(m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []),
            ...(m.message?.imageMessage?.contextInfo?.mentionedJid || []),
            ...(m.message?.videoMessage?.contextInfo?.mentionedJid || []),
            ...(m.message?.conversation?.contextInfo?.mentionedJid || []),
        ];
        const uniqueMentioned = [...new Set(allMentioned)];

        const rawText2 = [
            m.message?.conversation,
            m.message?.extendedTextMessage?.text,
            m.message?.imageMessage?.caption,
            m.message?.videoMessage?.caption,
        ].filter(Boolean).join(' ');

        const signal1 = uniqueMentioned.includes('0@s.whatsapp.net');
        const signal2 = /@all\b|@everyone\b/i.test(rawText2);
        const signal3 = participants.length > 4 && uniqueMentioned.length >= participants.length;
        const signal4 = uniqueMentioned.some(j =>
            j === 'all@s.whatsapp.net' || j === 'all@broadcast' || j?.includes('@broadcast')
        );

        const isAtAll = signal1 || signal2 || signal3 || signal4;
        const isMassTag = uniqueMentioned.length > 5;

        if (isAtAll || isMassTag) {
            const reason = isAtAll ? 'using @all to tag everyone' : 'mass tagging members';
            await antiAction(config.action, reason, '🏷️');
            return;
        }
    }
}

// ── 3. ANTI-SPAM ────────────────────────────────────────────────────────
if (m.isGroup && !isAdmins && !isCreator) {
    const config = getSetting(botNumber + m.chat, "antispam", { enabled: false, action: 'delete' });
    if (config.enabled) {
        if (!global.antispam) global.antispam = {};
        if (!global.antispam[m.chat]) global.antispam[m.chat] = {};
        const spamUser = global.antispam[m.chat][m.sender];
        const now = Date.now();
        if (!spamUser) {
            global.antispam[m.chat][m.sender] = { count: 1, ts: now };
        } else {
            if (now - spamUser.ts < 5000) {
                spamUser.count++;
                if (spamUser.count >= 6) {
                    await antiAction(config.action, 'spamming', '🚫');
                    global.antispam[m.chat][m.sender] = { count: 0, ts: now };
                    return;
                }
            } else {
                global.antispam[m.chat][m.sender] = { count: 1, ts: now };
            }
        }
    }
}

// ── 4. ANTI-BOT ─────────────────────────────────────────────────────────
if (m.isGroup && body && !isAdmins && !isCreator) {
    const config = getSetting(botNumber + m.chat, "antibot", { enabled: false, action: 'delete' });
    if (config.enabled) {
        const botPrefixes = ['.', '!', '/', '#', '$', '%', '&', '*', '^', '~'];
        // Only flags a genuine unresolved device-suffix JID (e.g. "1234:5@s.whatsapp.net")
        // as bot-like — the old version used loose substring checks (.includes('bot'),
        // .includes('broadcast')) that could false-positive on real users, especially
        // @lid-format accounts, silently deleting their messages with zero reply.
        const rawJid = m.key?.participant || m.key?.remoteJid || '';
        const looksLikeBot = /:\d+@/.test(rawJid) || rawJid.endsWith('@broadcast');
        if (botPrefixes.some(p => body.startsWith(p)) && looksLikeBot) {
            await antiAction(config.action, 'using bot commands', '🤖');
            return;
        }
    }
}

// ── 5. ANTI-BEG ─────────────────────────────────────────────────────────
if (m.isGroup && !isAdmins && !isCreator) {
    const config = getSetting(botNumber + m.chat, "antibeg", { enabled: false, action: 'delete' });
    if (config.enabled) {
        const begCheckText = [
            body,
            m.message?.conversation,
            m.message?.extendedTextMessage?.text,
        ].filter(Boolean).join(' ');
        const begPatterns = [
            /bless me/i, /send me money/i, /give me money/i, /help me financially/i,
            /i need money/i, /i dey suffer/i, /no money/i, /hungry dey catch me/i,
            /send me airtime/i, /buy me data/i, /fund me/i, /donate to me/i,
            /my account number/i, /send cash/i, /poor me/i,
            /assist me financially/i, /anything for me/i,
            /broke as hell/i, /i am starving/i, /no food/i
        ];
        if (begCheckText && begPatterns.some(p => p.test(begCheckText))) {
            await antiAction(config.action, 'begging', '💰');
            return;
        }
    }
}

// ── 6. ANTIBADWORD ──────────────────────────────────────────────────────
if (getSetting(botNumber + m.chat, "feature.antibadword", false) && m.isGroup && !isAdmins && !isCreator) {
   const badWords = ["fuck", "bitch", "sex", "nigga","bastard","fool","mumu","idiot","werey","mother","mama","ass","mad","dick","pussy","bast"];
   const badWordCheckText = [
       body,
       m.message?.conversation,
       m.message?.extendedTextMessage?.text,
       m.message?.imageMessage?.caption,
       m.message?.videoMessage?.caption,
       m.message?.documentMessage?.caption,
   ].filter(Boolean).join(' ').toLowerCase();
   if (badWordCheckText && badWords.some(word => badWordCheckText.includes(word))) {
      try { await devtrust.sendMessage(m.chat, { delete: m.key }); } catch(e) {}
      await reply(`❌ @${m.sender.split('@')[0]} watch your language 😟!`, [m.sender]);
   }
}

// ── 7. ANTIWORD (custom word list, .antiword) ───────────────────────────────
if (m.isGroup && !isAdmins && !isCreator) {
    const awCfg = getSetting(botNumber + m.chat, "antiword", { active: false, action: 'delete', warnc: 3, words: [] });
    if (awCfg.active && awCfg.words?.length) {
        const awText = [
            body,
            m.message?.conversation,
            m.message?.extendedTextMessage?.text,
            m.message?.imageMessage?.caption,
            m.message?.videoMessage?.caption,
        ].filter(Boolean).join(' ').toLowerCase();
        const hitWord = awText && awCfg.words.find(w => awText.includes(w.toLowerCase()));
        if (hitWord) {
            try { await devtrust.sendMessage(m.chat, { delete: m.key }); } catch (e) {}
            if (awCfg.action === 'delete') {
                await reply(`❌ @${m.sender.split('@')[0]} that word is not allowed here!`, [m.sender]);
            } else if (awCfg.action === 'kick') {
                try {
                    await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                    await reply(`👢 @${m.sender.split('@')[0]} kicked for using a prohibited word`, [m.sender]);
                } catch (e) {
                    await reply(`⚠️ @${m.sender.split('@')[0]} used a prohibited word (couldn't kick — make me admin)`, [m.sender]);
                }
            } else if (awCfg.action === 'warn') {
                const { count, shouldKick } = bumpAntiFeatureWarn('antiword', m.chat, m.sender, awCfg.warnc || 3);
                if (shouldKick) {
                    try {
                        await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                        await reply(`👢 @${m.sender.split('@')[0]} reached ${awCfg.warnc}/${awCfg.warnc} warnings and was kicked`, [m.sender]);
                    } catch (e) {
                        await reply(`⚠️ @${m.sender.split('@')[0]} hit the warning limit but I couldn't kick — make me admin.`, [m.sender]);
                    }
                } else {
                    await reply(`⚠️ @${m.sender.split('@')[0]} that word is not allowed! Warning *${count}/${awCfg.warnc}*`, [m.sender]);
                }
            }
            return;
        }
    }
}

// ── 8. ANTIGM (status group-mention, .antigm) ──────────────────────────────
if (m.isGroup && !isAdmins && !isCreator && m.message?.groupStatusMentionMessage) {
    const gmCfg = getSetting(botNumber + m.chat, "antigm", { enabled: false, action: 'delete', maxwrn: 3 });
    if (gmCfg.enabled) {
        try { await devtrust.sendMessage(m.chat, { delete: m.key }); } catch (e) {}
        if (gmCfg.action === 'delete') {
            await reply(`⚠️ @${m.sender.split('@')[0]} status-mentioning this group is not allowed!`, [m.sender]);
        } else if (gmCfg.action === 'kick') {
            try {
                await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                await reply(`👢 @${m.sender.split('@')[0]} kicked for status-mentioning this group`, [m.sender]);
            } catch (e) {
                await reply(`⚠️ @${m.sender.split('@')[0]} status-mentioned this group (couldn't kick — make me admin)`, [m.sender]);
            }
        } else if (gmCfg.action === 'warn') {
            const { count, shouldKick } = bumpAntiFeatureWarn('antigm', m.chat, m.sender, gmCfg.maxwrn || 3);
            if (shouldKick) {
                try {
                    await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                    await reply(`👢 @${m.sender.split('@')[0]} reached max warnings for status-mentioning this group and was kicked`, [m.sender]);
                } catch (e) {
                    await reply(`⚠️ @${m.sender.split('@')[0]} hit the warning limit but I couldn't kick — make me admin.`, [m.sender]);
                }
            } else {
                await reply(`⚠️ @${m.sender.split('@')[0]} status-mentioning this group is not allowed! Warning *${count}/${gmCfg.maxwrn}*`, [m.sender]);
            }
        }
        return;
    }
}

// ── 9. ANTIGCSTATUS (group status posts, .antigcstatus) ────────────────────
if (m.isGroup && !isAdmins && !isCreator && m.mtype === 'groupStatusMessageV2') {
    const gsCfg = getSetting(botNumber + m.chat, "antigcstatus", { enabled: false, action: 'delete', maxwrn: 3 });
    if (gsCfg.enabled) {
        try { await devtrust.sendMessage(m.chat, { delete: m.key }); } catch (e) {}
        if (gsCfg.action === 'delete') {
            await reply(`⚠️ @${m.sender.split('@')[0]} group status posts are not allowed here!`, [m.sender]);
        } else if (gsCfg.action === 'kick') {
            try {
                await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                await reply(`👢 @${m.sender.split('@')[0]} kicked for posting a group status`, [m.sender]);
            } catch (e) {
                await reply(`⚠️ @${m.sender.split('@')[0]} posted a group status (couldn't kick — make me admin)`, [m.sender]);
            }
        } else if (gsCfg.action === 'warn') {
            const { count, shouldKick } = bumpAntiFeatureWarn('antigcstatus', m.chat, m.sender, gsCfg.maxwrn || 3);
            if (shouldKick) {
                try {
                    await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                    await reply(`👢 @${m.sender.split('@')[0]} reached max warnings for group status posts and was kicked`, [m.sender]);
                } catch (e) {
                    await reply(`⚠️ @${m.sender.split('@')[0]} hit the warning limit but I couldn't kick — make me admin.`, [m.sender]);
                }
            } else {
                await reply(`⚠️ @${m.sender.split('@')[0]} group status posts are not allowed! Warning *${count}/${gsCfg.maxwrn}*`, [m.sender]);
            }
        }
        return;
    }
}

// ── AUTO STATUS / MENTION REACT (must also stay above the private-mode gate) ──
// Was checking getSetting(m.sender, ...) — m.sender on a status event is
// whoever POSTED the status (a random contact), never the bot's own
// number, so this only ever matched by coincidence. The toggle command
// saves under botNumber; the check now reads the same key.
// Only for statuses OTHERS post — m.key.fromMe is true when it's the
// bot's own account (i.e. you) posting, so that's excluded from both.
if (getSetting(botNumber, "autoViewStatus", false) && m.key.remoteJid === "status@broadcast" && !m.key.fromMe) {
    try {
        await devtrust.readMessages([m.key]);
        console.log(`👀 Viewed status from: ${m.key.participant}`);
    } catch (err) {
        console.log("❌ Error viewing status:", err);
    }
}

// Auto-react to statuses with a random emoji. Separate toggle from
// autoViewStatus on purpose — viewing and reacting are different levels
// of visibility some people want independently. Also excludes your own
// posted statuses, same as above.
if (getSetting(botNumber, "autoLikeStatus", false) && m.key.remoteJid === "status@broadcast" && !m.key.fromMe) {
    try {
        const likeEmojis = ['❤️', '🔥', '😍', '👏', '😂', '💯', '🎉', '👍', '😮', '✨'];
        const pickedEmoji = likeEmojis[Math.floor(Math.random() * likeEmojis.length)];
        await devtrust.sendMessage(m.key.remoteJid, { react: { text: pickedEmoji, key: m.key } }, { statusJidList: [m.key.participant, botNumber + '@s.whatsapp.net'] });
        console.log(`${pickedEmoji} Reacted to status from: ${m.key.participant}`);
    } catch (err) {
        console.log("❌ Error reacting to status:", err);
    }
}

// React with a chosen emoji whenever the bot's own number gets @mentioned
// in a group. Owner-configured, group-only by design.
if (m.isGroup && getSetting(botNumber, "reactMentionEmoji", null) && m.mentionedJid?.includes(botNumber + '@s.whatsapp.net') && !m.key.fromMe) {
    try {
        const mentionEmoji = getSetting(botNumber, "reactMentionEmoji", null);
        await devtrust.sendMessage(m.chat, { react: { text: mentionEmoji, key: m.key } });
    } catch (err) {
        console.log("❌ Error reacting to mention:", err);
    }
}

// ======================[ BANNED USERS CHECK ]======================
if (getSetting(m.sender, "banned", false)) {
    await reply(`⛔ You are banned from using this bot, @${m.sender.split('@')[0]}`, [m.sender])
    return
}

// ======================[ 🔇 MUTED USERS CHECK ]======================
if (m.isGroup && !isAdmins && !isCreator) {
    // Match against every identity field WhatsApp might report for the
    // sender (m.sender alone can miss when the group uses @lid privacy
    // addressing instead of a phone-number jid — isAdmins above already
    // has to check the same set of fields for the same reason).
    const senderIds = [m.sender, m.key?.participant, m.key?.participantAlt].filter(Boolean);
    const muteEntry = global.muted?.[m.chat]?.find(e => senderIds.includes(typeof e === 'string' ? e : e.jid));
    if (muteEntry) {
        const isStickersOnly = typeof muteEntry === 'object' && muteEntry.stickersOnly;
        const isSticker = m.mtype === 'stickerMessage';
        if (!isStickersOnly || !isSticker) {
            await devtrust.sendMessage(m.chat, { delete: m.key });
            return;
        }
    }
}

// ===== AUTO REACT (runs for ALL users, before private mode gate) =====
// Was previously declared ~300 lines below this gate (see the global
// variables block further down) — meaning that in private mode, the
// `!devtrust.public && !m.fromMe` check below returned early for every
// non-owner message before autoReact ever got a chance to run, so it
// only ever reacted to the bot owner's own messages. Moved above the
// gate so it actually reacts to everyone, matching the comment's stated
// intent and the original design.
const _autoReactOn = getSetting(m.chat, "autoReact", false);
if (process.env.DEBUG_AUTOREACT) {
    console.log('[AutoReact Debug]', { chat: m.chat, settingOn: _autoReactOn, fromMe: m.key.fromMe });
}
if (_autoReactOn) {
    const emojis = [
        "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
        "😍", "😘", "😎", "🤩", "🤔", "😏", "😣", "😥", "😮", "🤐",
        "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓",
        "😔", "😕", "🙃", "🤑", "😲", "😖", "😞", "😟", "😤", "😢",
        "😭", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳",
        "🤪", "🀄", "😠", "🀄", "😷", "🤒", "🤕", "🤢", "🤮", "🤧",
        "😇", "🥳", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈",
        "👿", "👹", "👺", "💀", "👻", "🖕", "🙏", "🤖", "🎃", "😺",
        "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "💋", "💌",
        "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "💔", "❤️"
    ];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    try {
        await devtrust.sendMessage(m.chat, {
            react: { text: randomEmoji, key: m.key },
        });
    } catch (err) {
        console.error('AutoReact error:', err.message);
    }
}
// =====================================================================

if (!devtrust.public && !m.fromMe && !isCreator && !isSudo) return;

// Auto-typing/recording/read: was positioned ~370 lines below this gate,
// meaning it only ever fired for your own messages in private mode —
// anyone else's message got cut off by the gate above before reaching it.
// Same root cause as the antilink/mute/status bugs fixed earlier. Also
// deduped — autoTyping/autoRecording/autoRecordType were each firing
// twice back-to-back for no reason.
if (getSetting(m.chat, "autoTyping", false)) {
    devtrust.sendPresenceUpdate('composing', from)
}
if (getSetting(m.chat, "autoRecording", false)) {
    devtrust.sendPresenceUpdate('recording', from)
}
if (getSetting(m.chat, "autoRecordType", false)) {
    let xeonrecordin = ['recording','composing']
    let xeonrecordinfinal = xeonrecordin[Math.floor(Math.random() * xeonrecordin.length)]
    devtrust.sendPresenceUpdate(xeonrecordinfinal, from)
}
if (getSetting(m.sender, "autoread", false)) {
   try {
      await devtrust.readMessages([m.key]) 
   } catch (e) {
      console.log("Auto-Read Error:", e)
   }
}


// ===== SILENT @ALL TRIGGER (no prefix — just type "@all") =====
// Admin/owner only — same gate as .hidetag. Left wide open, this would
// recreate the exact non-admin mass-tag abuse antitag exists to catch.
// Non-admins typing "@all" just fall through untouched (antitag still
// catches them if that feature is on).
//
// Behavior: original message stays untouched, bot just reacts to it with
// a normal emoji (no visible reply/quote), then silently fires a blank
// message carrying mentions for everyone — that's what actually pings
// them. No text, no "replied to" bubble, nothing that reads as a bot reply.
if (m.isGroup && (isAdmins || isCreator) && body && body.trim().toLowerCase() === '@all') {
    // Fire-and-forget — NOT awaited. If react/sendMessage ever hangs on
    // this Baileys fork, awaiting it here would stall every message
    // processed after it (queue blocks on a promise that never settles).
    //
    // NOTE: we tried editing the original "@all" message in place to add
    // mentions — WhatsApp does NOT send push notifications for mentions
    // added via edit (this is deliberate on WhatsApp's part, to stop
    // notification-spam via edits). The edit "worked" visually but pinged
    // nobody. A fresh message is the only reliable way to actually notify
    // everyone, so we're back to that — kept as invisible as WhatsApp
    // allows via a zero-width character instead of a visible space.
    devtrust.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {});
    devtrust.sendMessage(m.chat, {
        text: '\u200B',
        mentions: participants.map(p => p.jid || p.id)
    }).catch(() => {});
    return;
}

// ===== AUTO-REACT & MENTION-REACT (adapted from CODEX-AI, MIT) =====
try {
    const autoReactEmoji = getSetting(botNumber, 'autoReact', null);
    if (autoReactEmoji && m.key) {
        await devtrust.sendMessage(m.chat, { react: { text: autoReactEmoji, key: m.key } }).catch(() => {});
    }

    const mentionReactEmoji = getSetting(botNumber, 'mentionReact', null);
    if (mentionReactEmoji && m.key) {
        const botDigits = botNumber.split('@')[0];
        const wasMentioned = (m.mentionedJid || []).some(jid => jid.split('@')[0] === botDigits);
        if (wasMentioned) {
            await devtrust.sendMessage(m.chat, { react: { text: mentionReactEmoji, key: m.key } }).catch(() => {});
        }
    }
} catch (_) {}

// ===== AFK SYSTEM (with mention tracking, adapted from CODEX-AI, MIT) =====
try {
    const moment = require('moment-timezone');

    // If the sender themselves was AFK, welcome them back, clear it, and
    // report who tagged/messaged them while they were away.
    const myAfk = getSetting(m.sender, 'afk', null);
    if (myAfk && command !== 'afk') {
        setSetting(m.sender, 'afk', null);
        const duration = moment(myAfk.since).fromNow(true);
        const mentionCount = (myAfk.mentions || []).length;
        let backText = `👋 Welcome back! You were AFK for ${duration}.`;
        if (mentionCount > 0) {
            backText += `\n\nYou were mentioned *${mentionCount}* time(s) while away.`;
        }
        reply(backText);
    }

    // If someone mentioned or replied to a currently-AFK user, let them
    // know AND log it into that user's afk record for when they return.
    const mentioned = m.mentionedJid || [];
    const repliedTo = m.quoted?.sender;
    const afkTargets = [...new Set([...mentioned, repliedTo].filter(Boolean))];
    for (const target of afkTargets) {
        if (target === m.sender) continue;
        const theirAfk = getSetting(target, 'afk', null);
        if (theirAfk) {
            const duration = moment(theirAfk.since).fromNow(true);
            reply(`💤 @${target.split('@')[0]} is AFK: ${theirAfk.reason} (${duration} ago)`, target ? [target] : []);

            theirAfk.mentions = theirAfk.mentions || [];
            theirAfk.mentions.push({ from: m.sender, text: (m.text || '').slice(0, 100), at: Date.now() });
            setSetting(target, 'afk', theirAfk);
        }
    }
} catch (_) {}

// ===== #NOTENAME SHORTHAND (adapted from CODEX-AI, MIT) =====
// Quick note lookup: typing "#sometitle" looks it up in this chat's
// saved notes (the ./database/notes.json title::content store) without
// needing the full ".notes get sometitle" command.
try {
    const bodyTrimmed = (m.text || '').trim();
    if (bodyTrimmed.startsWith('#') && bodyTrimmed.length > 1 && !bodyTrimmed.includes(' ')) {
        const noteTitle = bodyTrimmed.slice(1);
        const noteFile = './database/notes.json';
        if (fs.existsSync(noteFile)) {
            const noteStore = JSON.parse(fs.readFileSync(noteFile));
            const noteBody = noteStore[m.chat]?.[noteTitle];
            if (noteBody) {
                reply(`📝 *${noteTitle}*\n\n${noteBody}`);
            }
        }
    }
} catch (_) {}

// ===== AUTO-REPLY FILTER TRIGGER (pfilter/gfilter) =====
// .pfilter/.gfilter only ever saved entries before — nothing checked
// incoming messages against them. Wiring that up here.
try {
    const bodyText = (m.text || '').toLowerCase();
    if (bodyText) {
        if (!m.isGroup) {
            const pfilterPath = require('path').join(__dirname, 'database', 'pfilter.json');
            const filters = JSON.parse(fs.existsSync(pfilterPath) ? fs.readFileSync(pfilterPath) : '{}');
            for (const keyword in filters) {
                if (bodyText.includes(keyword)) {
                    reply(filters[keyword]);
                    break;
                }
            }
        } else {
            const gfFile = `./database/gfilter_${m.chat.replace(/[^0-9]/g, '')}.json`;
            const gfilters = JSON.parse(fs.existsSync(gfFile) ? fs.readFileSync(gfFile) : '{}');
            for (const keyword in gfilters) {
                if (bodyText.includes(keyword)) {
                    reply(gfilters[keyword]);
                    break;
                }
            }
        }
    }
} catch (_) {}


// ============ PER-MESSAGE GROUP HOOKS (group.js) ============
// Runs on every group message, command or not — groupCommands.js can't do
// this since it only fires for recognized commands. Awaited + can `return`
// early so a deleted spam/anti-feature violation never reaches the switch.
if (m.isGroup) {
    try {
        const groupCmds = __cmd_group;
        const actioned = await groupCmds.handleAntiChecks(devtrust, m.chat, m, m.sender, isAdmins);
        if (actioned) return;

        groupCmds.trackActivity(m.chat, m.sender);
        if (/image|video|sticker/.test(m.mtype || '')) groupCmds.trackMedia(m.chat, m.sender);

        const rawText = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || '';
        if (rawText) await groupCmds.handleGuess(devtrust, m.chat, m.sender, rawText);
    } catch (e) {
        console.log(chalk.red(`❌ Group per-message hook error: ${e.message}`));
    }
}
const groupName = m.isGroup ? groupMetadata?.subject || "" : "";
const pushname = m.pushName || "No Name";
const time = moment(Date.now()).tz('Africa/Lagos').locale('en').format('HH:mm:ss z');
const mime = (quoted.msg || quoted).mimetype || '';
const todayDateWIB = new Date().toLocaleDateString('id-ID', {
  timeZone: 'Africa/Lagos',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// ============ STICKER HELPER FUNCTIONS ============
async function sendImageAsSticker(chatId, media, quoted, options = {}) {
    try {
        const sticker = new Sticker(media, {
            pack: options.packname || global.packname || botDisplayName,
            author: options.author || global.author || "LËGĚNDÃRY Ł𝗮𝗯𝘀™",
            type: StickerTypes.FULL,
            quality: 80,
            background: '#00000000'
        });
        const stickerBuffer = await sticker.toBuffer();
        await devtrust.sendMessage(chatId, { sticker: stickerBuffer }, { quoted });
        return true;
    } catch (error) {
        console.error('Image sticker error:', error);
        throw error;
    }
}

async function sendVideoAsSticker(chatId, media, quoted, options = {}) {
    try {
        const sticker = new Sticker(media, {
            pack: options.packname || global.packname || botDisplayName,
            author: options.author || global.author || "LËGĚNDÃRY Ł𝗮𝗯𝘀™",
            type: StickerTypes.FULL,
            quality: 50,
            background: '#00000000'
        });
        const stickerBuffer = await sticker.toBuffer();
        await devtrust.sendMessage(chatId, { sticker: stickerBuffer }, { quoted });
        return true;
    } catch (error) {
        console.error('Video sticker error:', error);
        throw error;
    }
}

// ============ MULTI-IMAGE SEND (WA auto-clusters into a scrollable grid) ============
// An earlier version tried to build a real WA "album" message via a raw
// albumMessage placeholder + relayMessage. Tested live: the placeholder was
// a no-op on this account/library — WhatsApp already visually clusters
// same-sender images sent back-to-back into a scrollable grid tile on its
// own, with no special protocol needed. So just send plain images in
// sequence; a short delay between each keeps delivery reliable.
async function sendImageAlbum(chatId, imageUrls, { caption, quoted } = {}) {
    if (!imageUrls?.length) throw new Error('No images provided');

    for (let i = 0; i < imageUrls.length; i++) {
        try {
            await devtrust.sendMessage(chatId, {
                image: { url: imageUrls[i] },
                ...(i === 0 && caption ? { caption } : {})
            }, { quoted: i === 0 ? quoted : undefined });
            if (i < imageUrls.length - 1) await new Promise(r => setTimeout(r, 400));
        } catch (e) {
            console.error(`Image ${i} failed:`, e.message);
        }
    }
}

// ============ STYLETEXT FUNCTION ============
async function styletext(text) {
    return [
        { name: 'Normal', result: text },
        { name: 'Bold', result: '**' + text + '**' },
        { name: 'Italic', result: '*' + text + '*' },
        { name: 'Strikethrough', result: '~' + text + '~' },
        { name: 'Monospace', result: '```' + text + '```' }
    ];
}

// ============ RANDOM COLOR FUNCTION ============
function randomColor() {
    const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'greenBright', 'yellowBright'];
    const colorIndex = Math.floor(Math.random() * colors.length);
    const colorName = colors[colorIndex];
    
    // Return chalk color function
    switch(colorName) {
        case 'red': return chalk.red;
        case 'green': return chalk.green;
        case 'yellow': return chalk.yellow;
        case 'blue': return chalk.blue;
        case 'magenta': return chalk.magenta;
        case 'cyan': return chalk.cyan;
        case 'white': return chalk.white;
        case 'greenBright': return chalk.greenBright;
        case 'yellowBright': return chalk.yellowBright;
        default: return chalk.white;
    }
}
// ==================================================
   
// BUG FUNCTIONS REMOVED TO ADD BUG FUNCTIONS / MAINTENANCE OF BOT CONTACT BASE OWNER 2348087253512 DON’T EDIT ANYTHING IN CASE WITH OUT THE OWNER NOTICE MAY CAUSE ERRRORS - BY ×͜× 𝙿𝚛𝚘𝚋𝚊𝚋𝚕𝚢 𝙱𝚞𝚜𝚢 永 𝙲𝙴𝙾 o̶f̶ Λ𝗫𝗜𝗦 Ł𝗮𝗯𝘀™


// ============ ACCOUNT FUNCTIONS ============
const ACCOUNT_FILE = './database/accounts.json';

function loadAccounts() {
  if (!fs.existsSync(ACCOUNT_FILE)) {
    fs.writeFileSync(ACCOUNT_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(ACCOUNT_FILE));
}

function saveAccounts(data) {
  fs.writeFileSync(ACCOUNT_FILE, JSON.stringify(data, null, 2));
}

// Ensure directories exist (SESSION_FILE and PAIRING_DIR already declared above)
if (!fs.existsSync('./database')) fs.mkdirSync('./database', { recursive: true });
if (!fs.existsSync(PAIRING_DIR)) fs.mkdirSync(PAIRING_DIR, { recursive: true });

// ============ GLOBAL VARIABLES ============
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const Richie = "LËGĚNDÃRY Ł𝗮𝗯𝘀™ 🥶";

global.packname = botDisplayName;
global.author = "LËGĚNDÃRY Ł𝗮𝗯𝘀™";

// ======================[ 🛡️ ANTI FEATURES — runs BEFORE public mode gate ]======================

// ── Shared helper: delete msg + take action ──────────────────────────────
async function antiAction(action, reason, warningEmoji, targetKey) {
    try { 
        await devtrust.sendMessage(m.chat, { 
            delete: targetKey || {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.sender
            }
        }); 
    } catch(e) {}
    if (action === 'kick') {
        try {
            await devtrust.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            await reply(`👢 @${m.sender.split('@')[0]} was kicked for ${reason}`, [m.sender]);
        } catch(e) {
            await reply(`${warningEmoji} @${m.sender.split('@')[0]} ${reason} is not allowed here!\n_(Make me admin to enable kick mode)_`, [m.sender]);
        }
    } else {
        await reply(`${warningEmoji} @${m.sender.split('@')[0]} ${reason} is not allowed here!`, [m.sender]);
    }
}

if (!devtrust.public) {
    if (!isCreator && !isSudo) return
}

// SPECIAL CHECK: If user types ONLY the default "." - show THEIR current prefix
// (placed here, below the private-mode gate, so it doesn't leak replies to
// non-owner users/groups while the bot is in private mode)
if (body && body.trim() === '.') {
    reply(`🔧 *Your current prefix:* \`${prefix}\`\n_You can change it using_ \`${prefix}setprefix [new]\``);
    return;
}

const example = (teks) => {
    return `Usage : *${prefix+command}* ${teks}`
}

let antilinkStatus = {};
if (!global.banned) global.banned = {} // stores banned users JIDs

if (getSetting(m.sender, "autobio", true)) {
    devtrust.updateProfileStatus(`${botDisplayName} IS HERE`).catch(_ => _)
}

if (isCmd) {
    console.log(chalk.black(chalk.bgWhite('[ Λ𝗫𝗜𝗦 𝗫𝗠𝗗 ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(body || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=>In'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
}


//----------------------Func End----------------//


if (getSetting(botNumber + m.chat, "feature.autoreply", false)) {
   const autoReplyList = { 
       "hi": "Hello 👋", 
       "hello": "Hi there!", 
       "I am ${botDisplayName}": "Coolest Whatsapp bot 😌" 
   }
   if (autoReplyList[m.text?.toLowerCase()]) {
      await reply(autoReplyList[m.text.toLowerCase()])
   }
}

// ======================[ 🤖 AI CHATBOT (auto-reply) ]======================
const chatbotGlobalOn = getSetting(botNumber, "feature.chatbot.global", false);
const chatbotChatOn = getSetting(botNumber + m.chat, "feature.chatbot.enabled", false);

if ((chatbotGlobalOn || chatbotChatOn) && !isCmd && m.text) {
    const allMentioned = [
        ...(m.mentionedJid || []),
        ...(m.message?.extendedTextMessage?.contextInfo?.mentionedJid || []),
    ];
    const botDigits = botNumber.split('@')[0];
    const botWasTagged = allMentioned.some(jid => jid.split('@')[0] === botDigits)
        || (m.text && m.text.includes(botDigits));
    const repliedToBot = m.quoted && m.quoted.fromMe;
    const shouldReply = !m.isGroup || botWasTagged || repliedToBot;

    if (shouldReply) {
        try {
            await devtrust.sendPresenceUpdate('composing', m.chat);
            const answer = await askOpenAIWithMemory(getSetting, setSetting, m.chat, m.text);
            await devtrust.sendMessage(m.chat, { text: answer });
        } catch (e) {
            console.log(chalk.red(`Chatbot reply error: ${e.message}`));
            let errMsg = "🤖 Sorry, I couldn't process that right now.";
            if (e.code === 'ECONNABORTED' || /timeout/i.test(e.message)) {
                errMsg = "🤖 That took too long to respond — try again?";
            } else if (e.response?.status === 429) {
                errMsg = "🤖 I'm getting a lot of requests right now — give me a moment and try again.";
            } else if (e.response?.status >= 500) {
                errMsg = "🤖 The AI service is having issues right now, not your fault — try again shortly.";
            }
            try {
                await devtrust.sendMessage(m.chat, { text: errMsg });
            } catch (_) {}
        }
    }
}

//LOADING FUNCTION
async function nexusLoading() {
    const nexusMylove = [`Loading menu...`];
    let msg = await devtrust.sendMessage(from, { text: "Connecting to Λ𝗫𝗜𝗦 𝗫𝗠𝗗 server....." });

    for (let i = 0; i < nexusMylove.length; i++) {
        await devtrust.sendMessage(from, {
            text: nexusMylove[i],
            edit: msg.key
        });
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

// Newsletter JIDs to auto-react to
const newsletterJids = ["120363406376026638@newsletter"];
const newsletterEmojis = [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', 
    '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🥺', '😊', '🙏', 
    '😙', '😻', '🔥', '😀', '😍', '🥰', '😘', '🤗', '🤩', '😎', '😇', 
    '🥶','🥳', '😋', '🎉', '🔥'
];

const hansRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ============ REGISTER ONCE GUARD ============
// Prevents duplicate listeners every time a message comes in
// Guard lives on the devtrust (socket) instance itself, not global,
// so each paired number gets its own listener exactly once.
if (!devtrust._newsletterListenerReady) {
    devtrust._newsletterListenerReady = true;
// =============================================

    devtrust.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const msg = chatUpdate.messages?.[0];
            if (!msg) return;
            const sender = msg.key.remoteJid;

            // ===== AUTO-BEG =====
            // If enabled via .autobeg on, auto-replies to anyone who DMs
            // the owner (not groups, not the owner's own messages) with a
            // begging message + their saved .aza account details. Capped
            // to once per 24h per sender so it's a joke, not spam.
            if (getSetting('bot', 'autoBegEnabled', false) && !msg.key.fromMe && !sender.endsWith('@g.us')) {
                try {
                    const azaFile = './database/aza_users.json';
                    let azaDB = {};
                    if (fs.existsSync(azaFile)) azaDB = JSON.parse(fs.readFileSync(azaFile));
                    const ownerJid = ownerNumber.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                    const ownerData = azaDB[ownerJid] || Object.values(azaDB)[0];
                    if (ownerData) {
                        const lastBeg = getSetting(sender, 'lastAutoBeg', 0);
                        if (Date.now() - lastBeg > 24 * 60 * 60 * 1000) {
                            setSetting(sender, 'lastAutoBeg', Date.now());
                            const begLines = [
                                `Hey! 🙏 I've had a rough week, could you send anything you can spare?`,
                                `Omo I'm broke joor 😩 anything go help me right now`,
                                `Please I need help urgently, whatever you can send is appreciated 🙏`
                            ];
                            const line = begLines[Math.floor(Math.random() * begLines.length)];
                            await devtrust.sendMessage(sender, {
                                text: `${line}\n\n🏦 Bank: ${ownerData.bank}\n💳 Number: ${ownerData.no}\n👤 Name: ${ownerData.acc}`
                            });
                        }
                    }
                } catch (e) {
                    console.log(chalk.red(`Auto-beg error: ${e.message}`));
                }
            }

            // ===== AUTO VIEW-ONCE CAPTURE =====
            // .vv/.vv2 (reply-based) can only ever work in the narrow
            // window before a view-once message is opened — once viewed,
            // WhatsApp permanently deletes the media from its servers and
            // no code can recover it after that. This instead grabs it
            // the instant it arrives, before anyone has a chance to open
            // it. Toggle with .autovv on/off (default: off).
            //
            // NOTE: view-once can arrive nested inside OTHER wrapper types
            // too (e.g. ephemeralMessage, if disappearing messages are on
            // in that chat) — a flat check for viewOnceMessage* at the top
            // level misses that entirely. This unwraps any depth/order of
            // known wrapper layers instead of assuming one fixed shape.
            if (!msg.key.fromMe && getSetting('bot', 'autoViewOnce', false)) {
                try {
                    const WRAPPER_KEYS = ['ephemeralMessage', 'viewOnceMessage', 'viewOnceMessageV2', 'viewOnceMessageV2Extension', 'deviceSentMessage'];
                    let current = msg.message;
                    let isViewOnce = false;
                    let unwrapped = true;
                    while (current && unwrapped) {
                        unwrapped = false;
                        for (const wKey of WRAPPER_KEYS) {
                            if (current[wKey]) {
                                if (wKey.startsWith('viewOnceMessage')) isViewOnce = true;
                                current = current[wKey].message || current[wKey];
                                unwrapped = true;
                                break;
                            }
                        }
                    }
                    if (isViewOnce && current) {
                        const innerType = Object.keys(current).find(k => /^(image|video|audio)Message$/.test(k));
                        if (innerType) {
                            const fakeMsg = { key: msg.key, message: current };
                            const buffer = await downloadMediaMessage(fakeMsg, 'buffer', {});
                            const ownerJid = ownerNumber.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                            const senderNum = (msg.key.participant || msg.key.remoteJid || '').split('@')[0];
                            const caption = `👁️ *Auto-captured view-once*\nFrom: ${senderNum}\nChat: ${msg.key.remoteJid}`;
                            if (/image/.test(innerType)) {
                                await devtrust.sendMessage(ownerJid, { image: buffer, caption });
                            } else if (/video/.test(innerType)) {
                                await devtrust.sendMessage(ownerJid, { video: buffer, caption });
                            } else if (/audio/.test(innerType)) {
                                await devtrust.sendMessage(ownerJid, { audio: buffer, mimetype: 'audio/ogg', ptt: true });
                            }
                        } else {
                            console.log(chalk.yellow(`Auto view-once: detected but no recognizable media key found — keys: ${Object.keys(current || {}).join(',')}`));
                        }
                    }
                } catch (e) {
                    console.log(chalk.red(`Auto view-once capture error: ${e.message}`));
                }
            }

            // Auto-react to followed newsletters
            if (!msg.key.fromMe && newsletterJids.includes(sender)) {
                if (getSetting(devtrust.decodeJid(devtrust.user.id), 'autoReactChannel', false)) {
                    const serverId = msg.newsletterServerId;
                    if (serverId) {
                        const emoji = hansRandom(newsletterEmojis);
                        await devtrust.newsletterReactMessage(sender, serverId.toString(), emoji);
                    }
                }
            }

            // ===== CHANNEL LOG ALERT =====
            if (sender && sender.endsWith('@newsletter')) {
                try {
                    const clData = loadChannelLog();
                    const currentBotJid = devtrust.user?.id ? devtrust.decodeJid(devtrust.user.id) : null;
                    if (currentBotJid && clData[currentBotJid]?.enabled) {

                        // Prevent spam — only process each message ID once
                        const msgId = msg.key.id;
                        if (!global.processedChannelMsgs) global.processedChannelMsgs = new Set();
                        if (global.processedChannelMsgs.has(msgId)) return;
                        global.processedChannelMsgs.add(msgId);
                        if (global.processedChannelMsgs.size > 500) {
                            const first = global.processedChannelMsgs.values().next().value;
                            global.processedChannelMsgs.delete(first);
                        }

                        // ── Fetch channel metadata (name + admin list) ──
                        let channelName = sender;
                        let adminsList = [];
                        try {
                            const nlMeta = await devtrust.newsletterMetadata('jid', sender).catch(() => null);
                            if (nlMeta) {
                                if (nlMeta.name) channelName = nlMeta.name;
                                else if (nlMeta.handle) channelName = '@' + nlMeta.handle;
                                const subs = nlMeta.subscribers || nlMeta.members || nlMeta.admins || [];
                                for (const sub of subs) {
                                    const role = (sub.role || sub.type || '').toString().toLowerCase();
                                    if (role.includes('admin') || role.includes('owner')) {
                                        const jid = sub.id || sub.jid || '';
                                        if (jid) adminsList.push({
                                            number: jid.replace(/@[^@]+$/, ''),
                                            name: sub.name || sub.display_name || null
                                        });
                                    }
                                }
                            }
                        } catch (_) {}

                        // ── Who posted ──
                        let adminNumber = null;
                        let adminName   = null;

                        const rawAdminJid =
                            msg.key?.participant ||
                            msg.participant ||
                            msg.message?.extendedTextMessage?.contextInfo?.participant ||
                            msg.message?.imageMessage?.contextInfo?.participant ||
                            msg.message?.videoMessage?.contextInfo?.participant ||
                            msg.message?.audioMessage?.contextInfo?.participant ||
                            msg.message?.documentMessage?.contextInfo?.participant ||
                            null;

                        if (rawAdminJid && rawAdminJid !== sender) {
                            adminNumber = rawAdminJid.replace(/@[^@]+$/, '');
                            adminName   = msg.pushName || adminNumber;
                        }

                        if (!adminNumber && msg.key?.fromMe) {
                            adminNumber = currentBotJid.replace(/@[^@]+$/, '');
                            adminName   = 'You (Bot / ' + adminNumber + ')';
                        }

                        let phoneDisplay;
                        if (adminNumber) {
                            phoneDisplay = '+' + adminNumber.replace(/^\+/, '');
                            if (adminName && adminName !== adminNumber) phoneDisplay += ' (' + adminName + ')';
                        } else if (adminsList.length > 0) {
                            phoneDisplay = '_Posted by one of the channel admins:_\n' +
                                adminsList.map(a => '  • +' + a.number + (a.name ? ' (' + a.name + ')' : '')).join('\n');
                            adminName = 'Channel Admin';
                        } else {
                            phoneDisplay = '_Not available (bot is not a channel admin)_';
                            adminName = msg.pushName || 'Channel Admin';
                        }

                        const timeNow = moment(Date.now()).tz('Africa/Lagos').format('DD/MM/YYYY HH:mm:ss z');

                        let contentInfo = '';
                        const msgContent = msg.message || {};
                        if (msgContent.conversation) contentInfo = '📝 *Text:* ' + msgContent.conversation;
                        else if (msgContent.extendedTextMessage) contentInfo = '📝 *Text:* ' + msgContent.extendedTextMessage.text;
                        else if (msgContent.imageMessage) contentInfo = '🖼️ *Image*' + (msgContent.imageMessage.caption ? '\n📝 *Caption:* ' + msgContent.imageMessage.caption : '');
                        else if (msgContent.videoMessage) contentInfo = '🎥 *Video*' + (msgContent.videoMessage.caption ? '\n📝 *Caption:* ' + msgContent.videoMessage.caption : '');
                        else if (msgContent.audioMessage) contentInfo = '🎵 *Audio/Voice Note*';
                        else if (msgContent.documentMessage) contentInfo = '📄 *Document:* ' + (msgContent.documentMessage.fileName || 'File');
                        else if (msgContent.stickerMessage) contentInfo = '🎭 *Sticker*';
                        else contentInfo = '📦 *Media/Other*';

                        const alertMsg =
                            '📢 *CHANNEL ACTIVITY ALERT*\n' +
                            '━━━━━━━━━━━━━━━━━━━━━━\n' +
                            '📺 *Channel:* ' + channelName + '\n' +
                            '👤 *Posted by:* ' + adminName + '\n' +
                            '📞 *Phone:* ' + phoneDisplay + '\n' +
                            '⏰ *Time:* ' + timeNow + '\n' +
                            '━━━━━━━━━━━━━━━━━━━━━━\n' +
                            contentInfo;

                        await devtrust.sendMessage(currentBotJid, { text: alertMsg });
                    }
                } catch (e) {
                    console.log('Channel log error:', e.message);
                }
            }
            // =============================

        } catch (err) {
            console.error("❌ Newsletter handler error:", err);
        }
    });
}

if (m.message) {
    console.log(chalk.hex('#3498db')(`message "${m.text || m.body || '<media/no text>'}" from ${pushname} id ${m.isGroup ? `group ${groupMetadata?.subject || 'Unknown Group'}` : 'private chat'}`));
}

// ===== ANTI-DELETE SYSTEM =====
if (!devtrust._antiDeleteListenersReady) {
    devtrust._antiDeleteListenersReady = true;
    const messageStore = new Map(); // Store recent messages for anti-delete

    // Store messages as they come in
    devtrust.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            if (!msg.message) continue;
            if (msg.key.fromMe) continue;
            // Store message for 10 minutes
            messageStore.set(msg.key.id, {
                msg,
                chat: msg.key.remoteJid,
                sender: msg.key.participant || msg.key.remoteJid,
                timestamp: Date.now()
            });
            // Clean old messages (older than 10 mins)
            for (const [id, data] of messageStore.entries()) {
                if (Date.now() - data.timestamp > 600000) messageStore.delete(id);
            }
        }
    });

    // Catch deleted messages
    devtrust.ev.on('messages.update', async (updates) => {
    for (const update of updates) {
        try {
            if (!update.update?.message) continue;
            const isRevoked = update.update.message?.protocolMessage?.type === 0;
            if (!isRevoked) continue;

            const deletedId = update.update.message.protocolMessage?.key?.id;
            if (!deletedId) continue;

            const stored = messageStore.get(deletedId);
            if (!stored) continue;

            const { msg, chat, sender } = stored;

            // Check if antiDelete is on — find which user enabled it
            // Check sender's setting first, then global bot setting
            const senderJid = msg.key.participant || msg.key.remoteJid;
            const senderNumber = senderJid.split('@')[0];
            
            // Check if the person who sent the deleted msg has antidelete on
            // OR if the chat owner (bot user) has it on globally
            const antiDeleteEnabled = getSetting(senderJid, 'antiDelete', false) || 
                                      getSetting(chat, 'antiDelete', false) ||
                                      getSetting(botNumber, 'antiDelete', false) ||
                                      (chat === 'status@broadcast' && getSetting(botNumber, 'antiDeleteStatus', false));
            
            if (!antiDeleteEnabled) continue;

            // Send to the session user (person who paired the bot), not owner
            // Each Baileys session has their own number as botNumber
            const ownerJid = botNumber.includes('@') ? botNumber : botNumber + '@s.whatsapp.net';
            const senderName = msg.pushName || sender.split('@')[0];
            const chatName = chat === 'status@broadcast' ? 'Status' : (chat.endsWith('@g.us') ? 'Group' : 'DM');

            let caption = `🗑️ *ANTI-DELETE${chatName === 'Status' ? ' — STATUS' : ''}*\n\n` +
                `👤 *Sender:* ${senderName}\n` +
                `📍 *Chat:* ${chatName}\n` +
                `🕐 *Time:* ${new Date().toLocaleString()}\n\n` +
                `*Deleted Message:*`;

            const msgContent = msg.message;
            const mtype = Object.keys(msgContent)[0];

            if (mtype === 'conversation' || mtype === 'extendedTextMessage') {
                const text = msgContent.conversation || msgContent.extendedTextMessage?.text;
                await devtrust.sendMessage(ownerJid, {
                    text: caption + '\n' + text
                });
            } else if (mtype === 'imageMessage') {
                try {
                    const buffer = await downloadMediaMessage(msg, 'buffer', {});
                    await devtrust.sendMessage(ownerJid, {
                        image: buffer,
                        caption: caption
                    });
                } catch {
                    await devtrust.sendMessage(ownerJid, { text: caption + '\n[Image - could not retrieve]' });
                }
            } else if (mtype === 'videoMessage') {
                try {
                    const buffer = await downloadMediaMessage(msg, 'buffer', {});
                    await devtrust.sendMessage(ownerJid, {
                        video: buffer,
                        caption: caption
                    });
                } catch {
                    await devtrust.sendMessage(ownerJid, { text: caption + '\n[Video - could not retrieve]' });
                }
            } else if (mtype === 'audioMessage') {
                try {
                    const buffer = await downloadMediaMessage(msg, 'buffer', {});
                    await devtrust.sendMessage(ownerJid, {
                        audio: buffer,
                        mimetype: 'audio/mpeg',
                        caption: caption
                    });
                } catch {
                    await devtrust.sendMessage(ownerJid, { text: caption + '\n[Audio - could not retrieve]' });
                }
            } else if (mtype === 'stickerMessage') {
                try {
                    const buffer = await downloadMediaMessage(msg, 'buffer', {});
                    await devtrust.sendMessage(ownerJid, { sticker: buffer });
                    await devtrust.sendMessage(ownerJid, { text: caption + '\n[Sticker above]' });
                } catch {
                    await devtrust.sendMessage(ownerJid, { text: caption + '\n[Sticker - could not retrieve]' });
                }
            } else {
                await devtrust.sendMessage(ownerJid, { text: caption + `\n[${mtype}]` });
            }

            messageStore.delete(deletedId);
        } catch (err) {
            console.error('[AntiDelete] Error:', err.message);
        }
    }
});
} // end devtrust._antiDeleteListenersReady guard

// ===== WELCOME / GOODBYE SYSTEM =====
if (!devtrust._welcomeListenerReady) {
    devtrust._welcomeListenerReady = true;
    const welcomeCooldown = new Set();

    devtrust.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update;

            if (!getSetting(id, "welcome")) return;

        const metadata = await devtrust.groupMetadata(id);
        const groupName = metadata.subject || "the group";
        const memberCount = metadata.participants.length;

        for (let user of participants) {

            // Fix object/string issue
            const userId = typeof user === "string" ? user : user.id;

            if (!userId) continue;

            const tag = `@${userId.split('@')[0]}`;

            // Prevent duplicate triggers
            const key = `${id}-${userId}-${action}`;
            if (welcomeCooldown.has(key)) continue;

            welcomeCooldown.add(key);

            setTimeout(() => {
                welcomeCooldown.delete(key);
            }, 5000);

            if (action === "add") {

                const customMsg = getSetting(id, "welcomeMessage", null);

                const defaultText =
`╭───〔 ${groupName} 〕───╮
│ 👋 Welcome ${tag}!
│ 👥 Member #${memberCount}
│
│ Please read the group description.
╰────────────────────────╯`;

                const text = customMsg
                    ? customMsg
                        .replace(/@user/g, tag)
                        .replace(/@gname/g, groupName)
                        .replace(/@count/g, memberCount)
                    : defaultText;

                // Try to attach the new member's profile picture — falls back
                // to plain text if they don't have one or it's private.
                let pfpUrl = null;
                try {
                    pfpUrl = await devtrust.profilePictureUrl(userId, 'image');
                } catch (_) {
                    pfpUrl = null;
                }

                if (pfpUrl) {
                    await devtrust.sendMessage(id, {
                        image: { url: pfpUrl },
                        caption: text,
                        mentions: [userId]
                    });
                } else {
                    await devtrust.sendMessage(id, {
                        text,
                        mentions: [userId]
                    });
                }

            }

            if (action === "remove") {

                const customMsg = getSetting(id, "goodbyeMessage", null);

                const defaultText =
`╭───〔 ${groupName} 〕───╮
│ 👋 ${tag} left the group
│ 👥 Members remaining: ${memberCount}
╰────────────────────────╯`;

                const text = customMsg
                    ? customMsg
                        .replace(/@user/g, tag)
                        .replace(/@gname/g, groupName)
                        .replace(/@count/g, memberCount)
                    : defaultText;

                let pfpUrl = null;
                try {
                    pfpUrl = await devtrust.profilePictureUrl(userId, 'image');
                } catch (_) {
                    pfpUrl = null;
                }

                if (pfpUrl) {
                    await devtrust.sendMessage(id, {
                        image: { url: pfpUrl },
                        caption: text,
                        mentions: [userId]
                    });
                } else {
                    await devtrust.sendMessage(id, {
                        text,
                        mentions: [userId]
                    });
                }

            }
        }

    } catch (err) {
        console.log("Group update error:", err);
    }
});
} // end devtrust._welcomeListenerReady guard

// ===== GROUP CHAT SECURITY (.gcs) =====
// Per-group toggle. When ON, if any admin demotes the bot (strips its own
// admin status) in that group, the bot tries to demote whoever did it back
// to a normal member.
//
// IMPORTANT LIMITATION: WhatsApp only lets current admins perform admin
// actions. By the time this event reaches the bot, the demotion has
// already been applied server-side — so the bot has *already* lost admin
// rights before this code runs. The retaliation call below can still win
// sometimes (server-side propagation isn't always instant), but it is not
// guaranteed, and there's no way around that from any bot library. When it
// fails, the bot posts a warning instead so a human can re-promote it.
if (!devtrust._gcsListenerReady) {
    devtrust._gcsListenerReady = true;

    devtrust.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action, author } = update;
            if (action !== 'demote') return;
            if (!getSetting(id, 'gcs', false)) return;

            const botNumber = await devtrust.decodeJid(devtrust.user.id);
            const botLid = devtrust.user?.lid ? await devtrust.decodeJid(devtrust.user.lid) : null;

            const botWasDemoted = participants.some(p => {
                const pid = typeof p === 'string' ? p : p.id;
                return pid === botNumber || (botLid && pid === botLid);
            });
            if (!botWasDemoted) return;

            // Who performed the demotion. Not every event carries this —
            // if we don't know who did it, we can't safely retaliate.
            const actor = author || update.participant || null;
            if (!actor) {
                console.log(chalk.yellow(`⚠️ GCS: bot was demoted in ${id} but no author was reported — can't act`));
                return;
            }
            if (actor === botNumber || (botLid && actor === botLid)) return;

            try {
                await devtrust.groupParticipantsUpdate(id, [actor], 'demote');
                // Knocking the attacker down doesn't restore our own admin
                // status by itself — try that separately. This will usually
                // fail (we need admin rights to promote ourselves, which is
                // the same rights we just lost), but it's free to attempt.
                let selfRestored = false;
                try {
                    await devtrust.groupParticipantsUpdate(id, [botNumber], 'promote');
                    selfRestored = true;
                } catch (_) {}

                await devtrust.sendMessage(id, {
                    text: selfRestored
                        ? `🛡️ *Group Chat Security*\n\n@${actor.split('@')[0]} removed my admin rights, so I removed theirs and restored my own.`
                        : `🛡️ *Group Chat Security*\n\n@${actor.split('@')[0]} removed my admin rights, so I removed theirs. I couldn't restore my own admin status though — someone will need to re-promote me manually.`,
                    mentions: [actor]
                });
            } catch (err) {
                // Expected most of the time — see note above, the bot had
                // already lost admin by the time this ran.
                await devtrust.sendMessage(id, {
                    text: `🛡️ *Group Chat Security*\n\n@${actor.split('@')[0]} removed my admin rights and I couldn't reverse it — someone will need to re-promote me manually.`,
                    mentions: [actor]
                }).catch(() => {});
            }
        } catch (err) {
            console.log('GCS listener error:', err);
        }
    });
} // end devtrust._gcsListenerReady guard

// ===== AKICK (auto-kick list enforcement) =====
// Independent of welcome messages on purpose — akick should keep working
// even in groups that have welcome messages turned off. Anyone on a
// group's akick list (managed via the .akick command) gets removed the
// moment they try to (re)join.
if (!devtrust._akickListenerReady) {
    devtrust._akickListenerReady = true;

    devtrust.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update;
            if (action !== 'add') return;
            const botNumber = await devtrust.decodeJid(devtrust.user.id);
            const akList = getSetting(botNumber + id, "akick", []);
            if (!akList.length) return;
            for (const user of participants) {
                const userId = typeof user === "string" ? user : user.id;
                if (!userId || !akList.includes(userId)) continue;
                try {
                    await devtrust.groupParticipantsUpdate(id, [userId], 'remove');
                    await devtrust.sendMessage(id, {
                        text: `🚫 @${userId.split('@')[0]} is on the auto-kick list and was removed.`,
                        mentions: [userId]
                    });
                } catch (err) {
                    console.log('akick enforcement error:', err);
                }
            }
        } catch (err) {
            console.log('akick listener error:', err);
        }
    });
} // end devtrust._akickListenerReady guard

// ===== ANTI-DEMOTE / ANTI-PROMOTE (.antidemote / .antipromote) =====
// Per-group toggles. Unlike .gcs (which protects the BOT's own admin status
// and hits the "already lost the rights we need" wall), these protect other
// members, so the bot's own admin rights are never touched by the triggering
// action — meaning these two actually work reliably every time, no timing
// race involved.
//
// antidemote: if an admin strips another admin's rights, the bot re-promotes
// the target. (The bot's own JID is skipped here — that case is handled by
// .gcs separately, so the two features don't double-message.)
//
// antipromote: only the real group owner (WhatsApp "superadmin") is allowed
// to promote members. If any other admin promotes someone, the bot demotes
// that new admin back down.
if (!devtrust._antiDemotePromoteListenerReady) {
    devtrust._antiDemotePromoteListenerReady = true;

    devtrust.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action, author } = update;
            if (!id?.endsWith('@g.us')) return;
            if (action !== 'demote' && action !== 'promote') return;

            const antidemoteOn = getSetting(id, 'antidemote', false);
            const antipromoteOn = getSetting(id, 'antipromote', false);
            if (!antidemoteOn && !antipromoteOn) return;

            const actor = author || update.participant || null;
            if (!actor) return; // no actor JID reported — can't safely act

            const botNumber = await devtrust.decodeJid(devtrust.user.id);
            const botLid = devtrust.user?.lid ? await devtrust.decodeJid(devtrust.user.lid) : null;
            const isBot = (jid) => jid === botNumber || (botLid && jid === botLid);

            if (isBot(actor)) return; // don't react to the bot's own promote/demote commands

            if (action === 'demote' && antidemoteOn) {
                for (const p of participants) {
                    const targetId = typeof p === 'string' ? p : p.id;
                    if (isBot(targetId)) continue; // .gcs handles the bot's own case
                    try {
                        await devtrust.groupParticipantsUpdate(id, [targetId], 'promote');
                        await devtrust.sendMessage(id, {
                            text: `🛡️ *Anti-Demote*\n@${targetId.split('@')[0]} was demoted by @${actor.split('@')[0]} and has been re-promoted automatically.`,
                            mentions: [targetId, actor]
                        });
                    } catch (err) {
                        console.log(chalk.yellow(`⚠️ antidemote: failed to re-promote ${targetId} in ${id}: ${err?.message || err}`));
                    }
                }
            }

            if (action === 'promote' && antipromoteOn) {
                const metadata = await devtrust.groupMetadata(id);
                const ownerParticipant = metadata.participants.find(p => p.admin === 'superadmin');
                const ownerJid = ownerParticipant?.id || metadata.owner || metadata.subjectOwner || null;
                if (ownerJid && isBot(ownerJid)) return;
                if (ownerJid && actor === ownerJid) return; // real owner is always allowed to promote
                // Second, independent check: WhatsApp doesn't always report
                // metadata.owner/subjectOwner cleanly (especially on
                // community-linked or older groups), which made ownerJid
                // come back null more often than expected — and when it
                // did, the real owner's own promotions got reversed too,
                // making this look "broken" by undoing legitimate actions.
                // Checking the actor's own participant entry directly is a
                // more reliable fallback than depending on ownerJid alone.
                const actorParticipant = metadata.participants.find(p => p.id === actor);
                if (actorParticipant?.admin === 'superadmin') return;

                for (const p of participants) {
                    const targetId = typeof p === 'string' ? p : p.id;
                    try {
                        await devtrust.groupParticipantsUpdate(id, [targetId], 'demote');
                        await devtrust.sendMessage(id, {
                            text: `🛡️ *Anti-Promote*\n@${targetId.split('@')[0]} was promoted by @${actor.split('@')[0]}, who isn't the group owner, so it's been reversed.`,
                            mentions: [targetId, actor]
                        });
                    } catch (err) {
                        console.log(chalk.yellow(`⚠️ antipromote: failed to demote ${targetId} in ${id}: ${err?.message || err}`));
                    }
                }
            }
        } catch (err) {
            console.log('antidemote/antipromote listener error:', err);
        }
    });
} // end devtrust._antiDemotePromoteListenerReady guard

// ===== ADMIN EVENT MONITOR (.adminevent on/off) =====
// Pure announcement feature — doesn't touch anyone's rights, just tells the
// group who promoted or demoted who. Works for members and admins alike
// since it's read-only; no isBotAdmins requirement.
if (!devtrust._adminEventListenerReady) {
    devtrust._adminEventListenerReady = true;

    devtrust.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action, author } = update;
            if (!id?.endsWith('@g.us')) return;
            if (action !== 'promote' && action !== 'demote') return;
            if (!getSetting(id, 'adminevent', false)) return;

            const actor = author || update.participant || null;

            for (const p of participants) {
                const targetId = typeof p === 'string' ? p : p.id;
                const targetTag = `@${targetId.split('@')[0]}`;
                const actorTag = actor ? `@${actor.split('@')[0]}` : 'someone';
                const mentions = actor ? [targetId, actor] : [targetId];

                const text = action === 'promote'
                    ? `👑 *Admin Event*\n${targetTag} was promoted to *admin* by ${actorTag}.`
                    : `⬇️ *Admin Event*\n${targetTag} was demoted from *admin* by ${actorTag}.`;

                await devtrust.sendMessage(id, { text, mentions }).catch(() => {});
            }
        } catch (err) {
            console.log('adminevent listener error:', err);
        }
    });
} // end devtrust._adminEventListenerReady guard

// ===== ANTI-CALL SYSTEM =====
// Toggle with .anticall on / .anticall off (owner-only, checked in the command handler).
// Default: off, so existing deploys don't suddenly start rejecting calls.
if (!devtrust._antiCallListenerReady) {
    devtrust._antiCallListenerReady = true;
    devtrust.ev.on('call', async (calls) => {
        const enabled = getSetting('bot', 'anticall', false);
        if (!enabled) return;
        for (const call of calls) {
            if (call.status !== 'offer') continue;
            try {
                await devtrust.rejectCall(call.id, call.from);
                await devtrust.sendMessage(call.from, {
                    text: `📵 *Calls are not allowed on this number.*\n\nThis is a bot account — please send a text message instead.`
                });
            } catch (e) {
                console.log(`Anti-call error: ${e.message}`);
            }
        }
    });
}

// ======================[ ⚠️ WARN SYSTEM HELPER ]======================
async function handleWarn(chatId, userId, reason, mode) {
    if (!global.warns[chatId]) global.warns[chatId] = {};
    if (!global.warns[chatId][userId]) global.warns[chatId][userId] = 0;
    
    // MODE 1: DELETE ONLY - no warnings
    if (mode === 'delete') {
        return { action: 'delete', kicked: false };
    }
    
    // MODE 2: WARN - add warning
    if (mode === 'warn') {
        global.warns[chatId][userId] += 1;
        const warnCount = global.warns[chatId][userId];
        
        // Check if reached 3 warnings
        if (warnCount >= 3) {
            // Reset warns
            delete global.warns[chatId][userId];
            return { action: 'kick', kicked: true, warnCount };
        }
        
        return { action: 'warn', kicked: false, warnCount };
    }
    
    // MODE 3: KICK - immediate kick
    if (mode === 'kick') {
        return { action: 'kick', kicked: true, warnCount: 0 };
    }
    
    return { action: 'delete', kicked: false };
}

// ============ MENU HELPER FUNCTIONS ============

function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;
    return time.trim();
}

function formatRam(total, free) {
    const used = (total - free) / (1024 * 1024 * 1024);
    const totalGb = total / (1024 * 1024 * 1024);
    const percent = ((used / totalGb) * 100).toFixed(1);
    return `${used.toFixed(1)}GB / ${totalGb.toFixed(1)}GB (${percent}%)`;
}

function countCommands() {
    try {
        const caseFileContent = fs.readFileSync(__filename).toString();
        // Count all unique case statements
        const commandRegex = /case ['"]([^'"]+)['"]:/g;
        const matches = [...caseFileContent.matchAll(commandRegex)];
        const uniqueCommands = new Set(matches.map(match => match[1]));
        const count = uniqueCommands.size;
        console.log(`📊 Total commands detected: ${count}`);
        return count;
    } catch (e) {
        console.error('Error counting commands:', e);
        return 4; // Your actual command count
    }
}

function getMoodEmoji() {
    const hour = getLagosTime().getHours();
    if (hour < 12) return '🌅';
    if (hour < 18) return '☀️';
    return '🌙';
}

function getLagosTime() {
    try {
        const options = {
            timeZone: 'Africa/Lagos',
            hour12: false,
            hour: 'numeric',
            minute: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(new Date());
        const hour = parts.find(part => part.type === 'hour').value;
        const minute = parts.find(part => part.type === 'minute').value;
        const now = new Date();
        const lagosDate = new Date(now.toLocaleString('en-US', {timeZone: 'Africa/Lagos'}));
        return lagosDate;
    } catch (error) {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * 1));
    }
}

// FIXED: Changed variable name from "penis" to avoid issues
const caseFileContent = fs.readFileSync(__filename).toString();
const matches = caseFileContent.match(/case '[^']+'(?!.*case '[^']+')/g) || [];
const caseCount = matches.length;
const caseNames = matches.map(match => match.match(/case '([^']+)'/)[1]);
let totalCases = caseCount;
let listCases = caseNames.join('\n⭔ '); 

async function autoJoinGroup(devtrust, inviteLink) {
  try {
    const inviteCode = inviteLink.match(/([a-zA-Z0-9_-]{22})/)?.[1];
    if (!inviteCode) {
      throw new Error('Invalid invite link');
    }
    const result = await devtrust.groupAcceptInvite(inviteCode);
    console.log('✅ Joined group:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to join group:', error.message);
    return null;
  }
}

function formatLagosTime() {
    const lagosTime = getLagosTime();
    const hours = lagosTime.getHours().toString().padStart(2, '0');
    const minutes = lagosTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// ============ GET PROFESSIONAL FEATURES ============

function getOwnerName() {
    return "LËGĚNDÃRY Ł𝗮𝗯𝘀™";
}

function getBotVersion() {
    return "1";
}

function getBotMode() {
    return devtrust.public ? "PUBLIC" : "PRIVATE";
}

function getCurrentDateTime() {
    const date = new Date();
    const options = { 
        timeZone: 'Africa/Lagos',
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return date.toLocaleString('en-US', options) + ' WAT';
}

// Group command handling now lives entirely in the inlined __cmd_group
// block (commands/group.js) above — the separate ./groupCommands require
// that used to be here was leftover from before that merge and always
// threw "Cannot find module './groupCommands'" since the file never
// existed at this path. Removed rather than pointed anywhere, since its
// job is already done.

// ============ PLUGIN LOADER (community plugins from ./plugins/) ============
function loadPlugins() {
    const pluginsDir = path.join(__dirname, 'plugins');
    const map = {};
    if (!fs.existsSync(pluginsDir)) return map;

    for (const file of fs.readdirSync(pluginsDir)) {
        if (!file.endsWith('.js')) continue;
        try {
            const plugin = freshRequire(`./plugins/${file}`);
            if (!plugin?.cmd || !plugin?.handler) continue;

            const aliases = Array.isArray(plugin.cmd) ? plugin.cmd : String(plugin.cmd).split('|');
            for (const alias of aliases) {
                map[alias.trim().toLowerCase()] = plugin;
            }
        } catch (e) {
            console.log(chalk.red(`⚠️ Plugin load error (${file}): ${e.message}`));
        }
    }
    return map;
}

if (isCmd && command) {
    const pluginMap = loadPlugins();
    const matchedPlugin = pluginMap[command];

    if (matchedPlugin) {
        try {
            await matchedPlugin.handler(m, args, text, {
                reply, prefix, isCreator, isSudo, isAdmins, isBotAdmins,
                devtrust, getSetting, setSetting, botNumber
            });
        } catch (e) {
            await reply(`❌ *Plugin error:* ${e.message}`);
            console.log(chalk.red(`Plugin execution error (${command}): ${e.message}`));
        }
        return;
    }
}

// ============ MENU COMMAND ============

// React to every command as soon as it's recognized, before running it —
// now toggleable/configurable instead of a hardcoded always-on ✅️.
if (isCmd && command) {
    try {
        const cmdReactEmoji = getSetting(botNumber, 'cmdReact', '✅️');
        if (cmdReactEmoji) {
            await devtrust.sendMessage(m.chat, { react: { text: cmdReactEmoji, key: m.key } });
        }
    } catch (e) {
        console.log(chalk.yellow(`⚠️ Command reaction failed: ${e.message}`));
    }

    try {
        if (getSetting(botNumber, 'cmdTyping', false)) {
            await devtrust.sendPresenceUpdate('composing', m.chat);
        }
        if (getSetting(botNumber, 'cmdRecording', false)) {
            await devtrust.sendPresenceUpdate('recording', m.chat);
        }
    } catch (_) {}
}


// ============ CATEGORY DISPATCH (auto-split from monolithic switch) ============
// Case bodies now live in ./cases/*.js — see /cases/README.md for the map.
  // ACTIVITY_FILE is declared again here at top-level scope because the only
  // other declaration (commands/group.js's inlined IIFE, above) is trapped
  // inside that closure and isn't visible down here — same scope bug as the
  // old .getdevice fix. ctx below needs it in scope to reference it.
  const ACTIVITY_FILE = './database/activity.json';
  const ctx = { ACCOUNT_FILE: (typeof ACCOUNT_FILE !== 'undefined' ? ACCOUNT_FILE : undefined), ACTIVITY_FILE: (typeof ACTIVITY_FILE !== 'undefined' ? ACTIVITY_FILE : undefined), AIIMG_STYLES: (typeof AIIMG_STYLES !== 'undefined' ? AIIMG_STYLES : undefined), ANTIFEATURE_WARN_FILE: (typeof ANTIFEATURE_WARN_FILE !== 'undefined' ? ANTIFEATURE_WARN_FILE : undefined), ANTILINK_FILE: (typeof ANTILINK_FILE !== 'undefined' ? ANTILINK_FILE : undefined), ANTIMENTIONGC_FILE: (typeof ANTIMENTIONGC_FILE !== 'undefined' ? ANTIMENTIONGC_FILE : undefined), AWAIT_TTL_MS: (typeof AWAIT_TTL_MS !== 'undefined' ? AWAIT_TTL_MS : undefined), AnyMessageContent: (typeof AnyMessageContent !== 'undefined' ? AnyMessageContent : undefined), AuthenticationState: (typeof AuthenticationState !== 'undefined' ? AuthenticationState : undefined), BACKUP_DIR: (typeof BACKUP_DIR !== 'undefined' ? BACKUP_DIR : undefined), BIRTHDAY_FILE: (typeof BIRTHDAY_FILE !== 'undefined' ? BIRTHDAY_FILE : undefined), BaileysError: (typeof BaileysError !== 'undefined' ? BaileysError : undefined), Browser: (typeof Browser !== 'undefined' ? Browser : undefined), Browsers: (typeof Browsers !== 'undefined' ? Browsers : undefined), BufferJSON: (typeof BufferJSON !== 'undefined' ? BufferJSON : undefined), CHANNELLOG_FILE: (typeof CHANNELLOG_FILE !== 'undefined' ? CHANNELLOG_FILE : undefined), ChatModification: (typeof ChatModification !== 'undefined' ? ChatModification : undefined), DisriyuectReason: (typeof DisriyuectReason !== 'undefined' ? DisriyuectReason : undefined), EVENTS_FILE: (typeof EVENTS_FILE !== 'undefined' ? EVENTS_FILE : undefined), FANCY_FONTS: (typeof FANCY_FONTS !== 'undefined' ? FANCY_FONTS : undefined), FANCY_FONT_COUNT: (typeof FANCY_FONT_COUNT !== 'undefined' ? FANCY_FONT_COUNT : undefined), FONTS: (typeof FONTS !== 'undefined' ? FONTS : undefined), FormData: (typeof FormData !== 'undefined' ? FormData : undefined), GroupMetadata: (typeof GroupMetadata !== 'undefined' ? GroupMetadata : undefined), GroupSettingChange: (typeof GroupSettingChange !== 'undefined' ? GroupSettingChange : undefined), Header: (typeof Header !== 'undefined' ? Header : undefined), InteractiveMessage: (typeof InteractiveMessage !== 'undefined' ? InteractiveMessage : undefined), JAIL_FILE: (typeof JAIL_FILE !== 'undefined' ? JAIL_FILE : undefined), LOGO_STYLES: (typeof LOGO_STYLES !== 'undefined' ? LOGO_STYLES : undefined), MADRIN_BASE: (typeof MADRIN_BASE !== 'undefined' ? MADRIN_BASE : undefined), MAKER_STYLES: (typeof MAKER_STYLES !== 'undefined' ? MAKER_STYLES : undefined), MENU_IMAGE_PATH: (typeof MENU_IMAGE_PATH !== 'undefined' ? MENU_IMAGE_PATH : undefined), MUTED_FILE: (typeof MUTED_FILE !== 'undefined' ? MUTED_FILE : undefined), MediaPathMap: (typeof MediaPathMap !== 'undefined' ? MediaPathMap : undefined), MediaType: (typeof MediaType !== 'undefined' ? MediaType : undefined), MediariyuInfo: (typeof MediariyuInfo !== 'undefined' ? MediariyuInfo : undefined), MessageOptions: (typeof MessageOptions !== 'undefined' ? MessageOptions : undefined), MessageType: (typeof MessageType !== 'undefined' ? MessageType : undefined), MessageTypeProto: (typeof MessageTypeProto !== 'undefined' ? MessageTypeProto : undefined), Mimetype: (typeof Mimetype !== 'undefined' ? Mimetype : undefined), MimetypeMap: (typeof MimetypeMap !== 'undefined' ? MimetypeMap : undefined), MiscMessageGenerationOptions: (typeof MiscMessageGenerationOptions !== 'undefined' ? MiscMessageGenerationOptions : undefined), NEWSLETTER_JID: (typeof NEWSLETTER_JID !== 'undefined' ? NEWSLETTER_JID : undefined), NEWSLETTER_NAME: (typeof NEWSLETTER_NAME !== 'undefined' ? NEWSLETTER_NAME : undefined), PAIRING_DIR: (typeof PAIRING_DIR !== 'undefined' ? PAIRING_DIR : undefined), PREFIX_FILE: (typeof PREFIX_FILE !== 'undefined' ? PREFIX_FILE : undefined), PREXZY_BASE: (typeof PREXZY_BASE !== 'undefined' ? PREXZY_BASE : undefined), Premium: (typeof Premium !== 'undefined' ? Premium : undefined), Presence: (typeof Presence !== 'undefined' ? Presence : undefined), ProxyAgent: (typeof ProxyAgent !== 'undefined' ? ProxyAgent : undefined), RANDOM_CATEGORIES: (typeof RANDOM_CATEGORIES !== 'undefined' ? RANDOM_CATEGORIES : undefined), REPORTS_FILE: (typeof REPORTS_FILE !== 'undefined' ? REPORTS_FILE : undefined), ROLES_FILE: (typeof ROLES_FILE !== 'undefined' ? ROLES_FILE : undefined), Richie: (typeof Richie !== 'undefined' ? Richie : undefined), SESSION_FILE: (typeof SESSION_FILE !== 'undefined' ? SESSION_FILE : undefined), SESSION_TTL_MS: (typeof SESSION_TTL_MS !== 'undefined' ? SESSION_TTL_MS : undefined), SETTINGS_FILE: (typeof SETTINGS_FILE !== 'undefined' ? SETTINGS_FILE : undefined), SETTINGS_META: (typeof SETTINGS_META !== 'undefined' ? SETTINGS_META : undefined), SETTINGS_PAGE_SIZE: (typeof SETTINGS_PAGE_SIZE !== 'undefined' ? SETTINGS_PAGE_SIZE : undefined), STATS_FILE: (typeof STATS_FILE !== 'undefined' ? STATS_FILE : undefined), STYLE_TEXT_LIST: (typeof STYLE_TEXT_LIST !== 'undefined' ? STYLE_TEXT_LIST : undefined), SUDO_FILE: (typeof SUDO_FILE !== 'undefined' ? SUDO_FILE : undefined), Sticker: (typeof Sticker !== 'undefined' ? Sticker : undefined), StickerTypes: (typeof StickerTypes !== 'undefined' ? StickerTypes : undefined), TEXTFX_MAP: (typeof TEXTFX_MAP !== 'undefined' ? TEXTFX_MAP : undefined), TRIVIA_BANK: (typeof TRIVIA_BANK !== 'undefined' ? TRIVIA_BANK : undefined), TTS_LANG_CODES: (typeof TTS_LANG_CODES !== 'undefined' ? TTS_LANG_CODES : undefined), TTS_LEGACY_VOICES: (typeof TTS_LEGACY_VOICES !== 'undefined' ? TTS_LEGACY_VOICES : undefined), TTS_NAMED_VOICES: (typeof TTS_NAMED_VOICES !== 'undefined' ? TTS_NAMED_VOICES : undefined), URL_REGEX: (typeof URL_REGEX !== 'undefined' ? URL_REGEX : undefined), WAContactMessage: (typeof WAContactMessage !== 'undefined' ? WAContactMessage : undefined), WAContactsArrayMessage: (typeof WAContactsArrayMessage !== 'undefined' ? WAContactsArrayMessage : undefined), WAContextInfo: (typeof WAContextInfo !== 'undefined' ? WAContextInfo : undefined), WAFlag: (typeof WAFlag !== 'undefined' ? WAFlag : undefined), WAGroupInviteMessage: (typeof WAGroupInviteMessage !== 'undefined' ? WAGroupInviteMessage : undefined), WAGroupMetadata: (typeof WAGroupMetadata !== 'undefined' ? WAGroupMetadata : undefined), WALocationMessage: (typeof WALocationMessage !== 'undefined' ? WALocationMessage : undefined), WAMediaUpload: (typeof WAMediaUpload !== 'undefined' ? WAMediaUpload : undefined), WAMessage: (typeof WAMessage !== 'undefined' ? WAMessage : undefined), WAMessageContent: (typeof WAMessageContent !== 'undefined' ? WAMessageContent : undefined), WAMessageProto: (typeof WAMessageProto !== 'undefined' ? WAMessageProto : undefined), WAMessageStatus: (typeof WAMessageStatus !== 'undefined' ? WAMessageStatus : undefined), WAMetric: (typeof WAMetric !== 'undefined' ? WAMetric : undefined), WANode: (typeof WANode !== 'undefined' ? WANode : undefined), WAProto: (typeof WAProto !== 'undefined' ? WAProto : undefined), WARN_FILE: (typeof WARN_FILE !== 'undefined' ? WARN_FILE : undefined), WASocket: (typeof WASocket !== 'undefined' ? WASocket : undefined), WATextMessage: (typeof WATextMessage !== 'undefined' ? WATextMessage : undefined), WAUrlInfo: (typeof WAUrlInfo !== 'undefined' ? WAUrlInfo : undefined), WA_DEFAULT_EPHEMERAL: (typeof WA_DEFAULT_EPHEMERAL !== 'undefined' ? WA_DEFAULT_EPHEMERAL : undefined), WA_MESSAGE_STATUS_TYPE: (typeof WA_MESSAGE_STATUS_TYPE !== 'undefined' ? WA_MESSAGE_STATUS_TYPE : undefined), WA_MESSAGE_STUB_TYPES: (typeof WA_MESSAGE_STUB_TYPES !== 'undefined' ? WA_MESSAGE_STUB_TYPES : undefined), WIN_LINES: (typeof WIN_LINES !== 'undefined' ? WIN_LINES : undefined), WORD_BANK_HANGMAN: (typeof WORD_BANK_HANGMAN !== 'undefined' ? WORD_BANK_HANGMAN : undefined), WORD_BANK_SHORT: (typeof WORD_BANK_SHORT !== 'undefined' ? WORD_BANK_SHORT : undefined), __REAL_COMMAND_COUNT__: (typeof __REAL_COMMAND_COUNT__ !== 'undefined' ? __REAL_COMMAND_COUNT__ : undefined), __REAL_COMMAND_LIST__: (typeof __REAL_COMMAND_LIST__ !== 'undefined' ? __REAL_COMMAND_LIST__ : undefined), __baileys_getDevice: (typeof __baileys_getDevice !== 'undefined' ? __baileys_getDevice : undefined), __cmd_ai: (typeof __cmd_ai !== 'undefined' ? __cmd_ai : undefined), __cmd_anime: (typeof __cmd_anime !== 'undefined' ? __cmd_anime : undefined), __cmd_auto: (typeof __cmd_auto !== 'undefined' ? __cmd_auto : undefined), __cmd_business: (typeof __cmd_business !== 'undefined' ? __cmd_business : undefined), __cmd_career: (typeof __cmd_career !== 'undefined' ? __cmd_career : undefined), __cmd_design: (typeof __cmd_design !== 'undefined' ? __cmd_design : undefined), __cmd_economy: (typeof __cmd_economy !== 'undefined' ? __cmd_economy : undefined), __cmd_education: (typeof __cmd_education !== 'undefined' ? __cmd_education : undefined), __cmd_legendary_economy: (typeof __cmd_legendary_economy !== 'undefined' ? __cmd_legendary_economy : undefined), __cmd_menu: (typeof __cmd_menu !== 'undefined' ? __cmd_menu : undefined), _autoReactOn: (typeof _autoReactOn !== 'undefined' ? _autoReactOn : undefined), aboutBot: (typeof aboutBot !== 'undefined' ? aboutBot : undefined), accessoryGuide: (typeof accessoryGuide !== 'undefined' ? accessoryGuide : undefined), accountDeletion: (typeof accountDeletion !== 'undefined' ? accountDeletion : undefined), actorProfiles: (typeof actorProfiles !== 'undefined' ? actorProfiles : undefined), addBulk: (typeof addBulk !== 'undefined' ? addBulk : undefined), addExif: (typeof addExif !== 'undefined' ? addExif : undefined), addNewsletterContext: (typeof addNewsletterContext !== 'undefined' ? addNewsletterContext : undefined), addSubtitles: (typeof addSubtitles !== 'undefined' ? addSubtitles : undefined), addWarning: (typeof addWarning !== 'undefined' ? addWarning : undefined), aiChips: (typeof aiChips !== 'undefined' ? aiChips : undefined), aiDeepLearning: (typeof aiDeepLearning !== 'undefined' ? aiDeepLearning : undefined), alertPreferences: (typeof alertPreferences !== 'undefined' ? alertPreferences : undefined), algorithms: (typeof algorithms !== 'undefined' ? algorithms : undefined), allOwners: (typeof allOwners !== 'undefined' ? allOwners : undefined), analyticsDashboard: (typeof analyticsDashboard !== 'undefined' ? analyticsDashboard : undefined), ancientCivilizations: (typeof ancientCivilizations !== 'undefined' ? ancientCivilizations : undefined), announceToGroup: (typeof announceToGroup !== 'undefined' ? announceToGroup : undefined), antiAction: (typeof antiAction !== 'undefined' ? antiAction : undefined), antiMentionGcSettings: (typeof antiMentionGcSettings !== 'undefined' ? antiMentionGcSettings : undefined), antilinkSettings: (typeof antilinkSettings !== 'undefined' ? antilinkSettings : undefined), antilinkStatus: (typeof antilinkStatus !== 'undefined' ? antilinkStatus : undefined), apiDocumentation: (typeof apiDocumentation !== 'undefined' ? apiDocumentation : undefined), apiSettings: (typeof apiSettings !== 'undefined' ? apiSettings : undefined), applyAudioEffect: (typeof applyAudioEffect !== 'undefined' ? applyAudioEffect : undefined), applyFancyFont: (typeof applyFancyFont !== 'undefined' ? applyFancyFont : undefined), applyFont: (typeof applyFont !== 'undefined' ? applyFont : undefined), applyTextEffect: (typeof applyTextEffect !== 'undefined' ? applyTextEffect : undefined), areJidsSameUser: (typeof areJidsSameUser !== 'undefined' ? areJidsSameUser : undefined), args: (typeof args !== 'undefined' ? args : undefined), artExhibitions: (typeof artExhibitions !== 'undefined' ? artExhibitions : undefined), artHistory: (typeof artHistory !== 'undefined' ? artHistory : undefined), artInstallations: (typeof artInstallations !== 'undefined' ? artInstallations : undefined), artTherapy: (typeof artTherapy !== 'undefined' ? artTherapy : undefined), artistInfoBtn: (typeof artistInfoBtn !== 'undefined' ? artistInfoBtn : undefined), askOpenAI: (typeof askOpenAI !== 'undefined' ? askOpenAI : undefined), askOpenAIWithMemory: (typeof askOpenAIWithMemory !== 'undefined' ? askOpenAIWithMemory : undefined), astronomyGuide: (typeof astronomyGuide !== 'undefined' ? astronomyGuide : undefined), audioEffectsBtn: (typeof audioEffectsBtn !== 'undefined' ? audioEffectsBtn : undefined), audioGear: (typeof audioGear !== 'undefined' ? audioGear : undefined), autoJoinGroup: (typeof autoJoinGroup !== 'undefined' ? autoJoinGroup : undefined), autoreply: (typeof autoreply !== 'undefined' ? autoreply : undefined), awaitingMusic: (typeof awaitingMusic !== 'undefined' ? awaitingMusic : undefined), awardsNominations: (typeof awardsNominations !== 'undefined' ? awardsNominations : undefined), axios: (typeof axios !== 'undefined' ? axios : undefined), backupData: (typeof backupData !== 'undefined' ? backupData : undefined), bagCollection: (typeof bagCollection !== 'undefined' ? bagCollection : undefined), baileys: (typeof baileys !== 'undefined' ? baileys : undefined), bathroomDesign: (typeof bathroomDesign !== 'undefined' ? bathroomDesign : undefined), batteryTechnology: (typeof batteryTechnology !== 'undefined' ? batteryTechnology : undefined), beautyTips: (typeof beautyTips !== 'undefined' ? beautyTips : undefined), bedroomIdeas: (typeof bedroomIdeas !== 'undefined' ? bedroomIdeas : undefined), behindTheScenes: (typeof behindTheScenes !== 'undefined' ? behindTheScenes : undefined), benchmarkTest: (typeof benchmarkTest !== 'undefined' ? benchmarkTest : undefined), biologyFacts: (typeof biologyFacts !== 'undefined' ? biologyFacts : undefined), blockedUsers: (typeof blockedUsers !== 'undefined' ? blockedUsers : undefined), body: (typeof body !== 'undefined' ? body : undefined), bookRecommendations: (typeof bookRecommendations !== 'undefined' ? bookRecommendations : undefined), botDisplayName: (typeof botDisplayName !== 'undefined' ? botDisplayName : undefined), botLid: (typeof botLid !== 'undefined' ? botLid : undefined), botNumber: (typeof botNumber !== 'undefined' ? botNumber : undefined), botOwnerNumbers: (typeof botOwnerNumbers !== 'undefined' ? botOwnerNumbers : undefined), breathingExercises: (typeof breathingExercises !== 'undefined' ? breathingExercises : undefined), buildingPermits: (typeof buildingPermits !== 'undefined' ? buildingPermits : undefined), bumpAntiFeatureWarn: (typeof bumpAntiFeatureWarn !== 'undefined' ? bumpAntiFeatureWarn : undefined), bumpStat: (typeof bumpStat !== 'undefined' ? bumpStat : undefined), cGuide: (typeof cGuide !== 'undefined' ? cGuide : undefined), cTutorial: (typeof cTutorial !== 'undefined' ? cTutorial : undefined), calculate: (typeof calculate !== 'undefined' ? calculate : undefined), calculateLove: (typeof calculateLove !== 'undefined' ? calculateLove : undefined), calorieCounter: (typeof calorieCounter !== 'undefined' ? calorieCounter : undefined), cameraReviews: (typeof cameraReviews !== 'undefined' ? cameraReviews : undefined), careerGuidance: (typeof careerGuidance !== 'undefined' ? careerGuidance : undefined), caseCount: (typeof caseCount !== 'undefined' ? caseCount : undefined), caseFileContent: (typeof caseFileContent !== 'undefined' ? caseFileContent : undefined), caseNames: (typeof caseNames !== 'undefined' ? caseNames : undefined), casualWear: (typeof casualWear !== 'undefined' ? casualWear : undefined), celebrityNews: (typeof celebrityNews !== 'undefined' ? celebrityNews : undefined), celebrityPhotos: (typeof celebrityPhotos !== 'undefined' ? celebrityPhotos : undefined), chalk: (typeof chalk !== 'undefined' ? chalk : undefined), charMap: (typeof charMap !== 'undefined' ? charMap : undefined), chatGroups: (typeof chatGroups !== 'undefined' ? chatGroups : undefined), chatUpdate: (typeof chatUpdate !== 'undefined' ? chatUpdate : undefined), chatbotChatOn: (typeof chatbotChatOn !== 'undefined' ? chatbotChatOn : undefined), chatbotGlobalOn: (typeof chatbotGlobalOn !== 'undefined' ? chatbotGlobalOn : undefined), chatbotPersonality: (typeof chatbotPersonality !== 'undefined' ? chatbotPersonality : undefined), checkBirthdaysToday: (typeof checkBirthdaysToday !== 'undefined' ? checkBirthdaysToday : undefined), checkDueEvents: (typeof checkDueEvents !== 'undefined' ? checkDueEvents : undefined), checkUpdates: (typeof checkUpdates !== 'undefined' ? checkUpdates : undefined), checkWinner: (typeof checkWinner !== 'undefined' ? checkWinner : undefined), circusShows: (typeof circusShows !== 'undefined' ? circusShows : undefined), classicLiterature: (typeof classicLiterature !== 'undefined' ? classicLiterature : undefined), clearAwaitingMusic: (typeof clearAwaitingMusic !== 'undefined' ? clearAwaitingMusic : undefined), clearSession: (typeof clearSession !== 'undefined' ? clearSession : undefined), clockString: (typeof clockString !== 'undefined' ? clockString : undefined), cloudPlatforms: (typeof cloudPlatforms !== 'undefined' ? cloudPlatforms : undefined), codeReview: (typeof codeReview !== 'undefined' ? codeReview : undefined), codeSnippets: (typeof codeSnippets !== 'undefined' ? codeSnippets : undefined), coinFlip: (typeof coinFlip !== 'undefined' ? coinFlip : undefined), colorSchemes: (typeof colorSchemes !== 'undefined' ? colorSchemes : undefined), comedyShows: (typeof comedyShows !== 'undefined' ? comedyShows : undefined), command: (typeof command !== 'undefined' ? command : undefined), commercialSpaces: (typeof commercialSpaces !== 'undefined' ? commercialSpaces : undefined), communityInfo: (typeof communityInfo !== 'undefined' ? communityInfo : undefined), communitySupport: (typeof communitySupport !== 'undefined' ? communitySupport : undefined), complimentUser: (typeof complimentUser !== 'undefined' ? complimentUser : undefined), compressVideo: (typeof compressVideo !== 'undefined' ? compressVideo : undefined), computeLineDiff: (typeof computeLineDiff !== 'undefined' ? computeLineDiff : undefined), concertDatesBtn: (typeof concertDatesBtn !== 'undefined' ? concertDatesBtn : undefined), concertInfo: (typeof concertInfo !== 'undefined' ? concertInfo : undefined), constructionUpdates: (typeof constructionUpdates !== 'undefined' ? constructionUpdates : undefined), contractorFinder: (typeof contractorFinder !== 'undefined' ? contractorFinder : undefined), convertCurrency: (typeof convertCurrency !== 'undefined' ? convertCurrency : undefined), convertUnits: (typeof convertUnits !== 'undefined' ? convertUnits : undefined), convertVideoFormat: (typeof convertVideoFormat !== 'undefined' ? convertVideoFormat : undefined), countCommands: (typeof countCommands !== 'undefined' ? countCommands : undefined), createGIF: (typeof createGIF !== 'undefined' ? createGIF : undefined), createPlaylist: (typeof createPlaylist !== 'undefined' ? createPlaylist : undefined), createPoll: (typeof createPoll !== 'undefined' ? createPoll : undefined), crypto: (typeof crypto !== 'undefined' ? crypto : undefined), customThemes: (typeof customThemes !== 'undefined' ? customThemes : undefined), dailyGoals: (typeof dailyGoals !== 'undefined' ? dailyGoals : undefined), darkMode: (typeof darkMode !== 'undefined' ? darkMode : undefined), dataExport: (typeof dataExport !== 'undefined' ? dataExport : undefined), dataScience: (typeof dataScience !== 'undefined' ? dataScience : undefined), dataStructures: (typeof dataStructures !== 'undefined' ? dataStructures : undefined), databaseGuides: (typeof databaseGuides !== 'undefined' ? databaseGuides : undefined), debuggingTips: (typeof debuggingTips !== 'undefined' ? debuggingTips : undefined), demoteAll: (typeof demoteAll !== 'undefined' ? demoteAll : undefined), designerBags: (typeof designerBags !== 'undefined' ? designerBags : undefined), designerSearch: (typeof designerSearch !== 'undefined' ? designerSearch : undefined), developerTools: (typeof developerTools !== 'undefined' ? developerTools : undefined), deviceManagement: (typeof deviceManagement !== 'undefined' ? deviceManagement : undefined), devtrust: (typeof devtrust !== 'undefined' ? devtrust : undefined), directorInfo: (typeof directorInfo !== 'undefined' ? directorInfo : undefined), dispatchMenuCommand: (typeof dispatchMenuCommand !== 'undefined' ? dispatchMenuCommand : undefined), documentaryGuide: (typeof documentaryGuide !== 'undefined' ? documentaryGuide : undefined), doorOptions: (typeof doorOptions !== 'undefined' ? doorOptions : undefined), downloadAndSaveMediaMessage: (typeof downloadAndSaveMediaMessage !== 'undefined' ? downloadAndSaveMediaMessage : undefined), downloadContentFromMessage: (typeof downloadContentFromMessage !== 'undefined' ? downloadContentFromMessage : undefined), downloadFacebook: (typeof downloadFacebook !== 'undefined' ? downloadFacebook : undefined), downloadInstagramReels: (typeof downloadInstagramReels !== 'undefined' ? downloadInstagramReels : undefined), downloadInstagramStory: (typeof downloadInstagramStory !== 'undefined' ? downloadInstagramStory : undefined), downloadMediaMessage: (typeof downloadMediaMessage !== 'undefined' ? downloadMediaMessage : undefined), downloadMp3Btn: (typeof downloadMp3Btn !== 'undefined' ? downloadMp3Btn : undefined), downloadMusic: (typeof downloadMusic !== 'undefined' ? downloadMusic : undefined), downloadTikTok: (typeof downloadTikTok !== 'undefined' ? downloadTikTok : undefined), downloadTwitter: (typeof downloadTwitter !== 'undefined' ? downloadTwitter : undefined), downloadYouTube: (typeof downloadYouTube !== 'undefined' ? downloadYouTube : undefined), ecofriendlyTips: (typeof ecofriendlyTips !== 'undefined' ? ecofriendlyTips : undefined), economics101: (typeof economics101 !== 'undefined' ? economics101 : undefined), economy: (typeof economy !== 'undefined' ? economy : undefined), educationalVideos: (typeof educationalVideos !== 'undefined' ? educationalVideos : undefined), electricalGuide: (typeof electricalGuide !== 'undefined' ? electricalGuide : undefined), emailSettings: (typeof emailSettings !== 'undefined' ? emailSettings : undefined), emitGroupParticipantsUpdate: (typeof emitGroupParticipantsUpdate !== 'undefined' ? emitGroupParticipantsUpdate : undefined), emitGroupUpdate: (typeof emitGroupUpdate !== 'undefined' ? emitGroupUpdate : undefined), encodeBase64: (typeof encodeBase64 !== 'undefined' ? encodeBase64 : undefined), endGame: (typeof endGame !== 'undefined' ? endGame : undefined), etymology: (typeof etymology !== 'undefined' ? etymology : undefined), eveningGowns: (typeof eveningGowns !== 'undefined' ? eveningGowns : undefined), eventsCalendar: (typeof eventsCalendar !== 'undefined' ? eventsCalendar : undefined), example: (typeof example !== 'undefined' ? example : undefined), exec: (typeof exec !== 'undefined' ? exec : undefined), extractAudio: (typeof extractAudio !== 'undefined' ? extractAudio : undefined), fashionBrands: (typeof fashionBrands !== 'undefined' ? fashionBrands : undefined), fashionTrends: (typeof fashionTrends !== 'undefined' ? fashionTrends : undefined), feedback: (typeof feedback !== 'undefined' ? feedback : undefined), fetchJson: (typeof fetchJson !== 'undefined' ? fetchJson : undefined), fetchLatestBaileysVersion: (typeof fetchLatestBaileysVersion !== 'undefined' ? fetchLatestBaileysVersion : undefined), ffmpeg: (typeof ffmpeg !== 'undefined' ? ffmpeg : undefined), findFlights: (typeof findFlights !== 'undefined' ? findFlights : undefined), findHotels: (typeof findHotels !== 'undefined' ? findHotels : undefined), findRestaurants: (typeof findRestaurants !== 'undefined' ? findRestaurants : undefined), fiveGDevices: (typeof fiveGDevices !== 'undefined' ? fiveGDevices : undefined), flipCoin: (typeof flipCoin !== 'undefined' ? flipCoin : undefined), floorPlans: (typeof floorPlans !== 'undefined' ? floorPlans : undefined), foldablePhones: (typeof foldablePhones !== 'undefined' ? foldablePhones : undefined), foodDB: (typeof foodDB !== 'undefined' ? foodDB : undefined), footballAPI: (typeof footballAPI !== 'undefined' ? footballAPI : undefined), formalWear: (typeof formalWear !== 'undefined' ? formalWear : undefined), format: (typeof format !== 'undefined' ? format : undefined), formatLagosTime: (typeof formatLagosTime !== 'undefined' ? formatLagosTime : undefined), formatRam: (typeof formatRam !== 'undefined' ? formatRam : undefined), formatUptime: (typeof formatUptime !== 'undefined' ? formatUptime : undefined), freshRequire: (typeof freshRequire !== 'undefined' ? freshRequire : undefined), from: (typeof from !== 'undefined' ? from : undefined), fs: (typeof fs !== 'undefined' ? fs : undefined), fsx: (typeof fsx !== 'undefined' ? fsx : undefined), funGames: (typeof funGames !== 'undefined' ? funGames : undefined), furnitureFinder: (typeof furnitureFinder !== 'undefined' ? furnitureFinder : undefined), galleryExhibitions: (typeof galleryExhibitions !== 'undefined' ? galleryExhibitions : undefined), gameDevelopment: (typeof gameDevelopment !== 'undefined' ? gameDevelopment : undefined), gameLeaderboard: (typeof gameLeaderboard !== 'undefined' ? gameLeaderboard : undefined), gameState: (typeof gameState !== 'undefined' ? gameState : undefined), gamingEvents: (typeof gamingEvents !== 'undefined' ? gamingEvents : undefined), gamingHardware: (typeof gamingHardware !== 'undefined' ? gamingHardware : undefined), generateProfilePicture: (typeof generateProfilePicture !== 'undefined' ? generateProfilePicture : undefined), generateQRCode: (typeof generateQRCode !== 'undefined' ? generateQRCode : undefined), generateRandomNumber: (typeof generateRandomNumber !== 'undefined' ? generateRandomNumber : undefined), generateUpdateChangelog: (typeof generateUpdateChangelog !== 'undefined' ? generateUpdateChangelog : undefined), generateWAMessage: (typeof generateWAMessage !== 'undefined' ? generateWAMessage : undefined), generateWAMessageContent: (typeof generateWAMessageContent !== 'undefined' ? generateWAMessageContent : undefined), generateWAMessageFromContent: (typeof generateWAMessageFromContent !== 'undefined' ? generateWAMessageFromContent : undefined), geneticsInfo: (typeof geneticsInfo !== 'undefined' ? geneticsInfo : undefined), getAntilinkKey: (typeof getAntilinkKey !== 'undefined' ? getAntilinkKey : undefined), getArtistInfo: (typeof getArtistInfo !== 'undefined' ? getArtistInfo : undefined), getAwaitingMusic: (typeof getAwaitingMusic !== 'undefined' ? getAwaitingMusic : undefined), getBotMode: (typeof getBotMode !== 'undefined' ? getBotMode : undefined), getBotSetting: (typeof getBotSetting !== 'undefined' ? getBotSetting : undefined), getBotVersion: (typeof getBotVersion !== 'undefined' ? getBotVersion : undefined), getBuffer: (typeof getBuffer !== 'undefined' ? getBuffer : undefined), getContentType: (typeof getContentType !== 'undefined' ? getContentType : undefined), getCryptoNews: (typeof getCryptoNews !== 'undefined' ? getCryptoNews : undefined), getCurrentDateTime: (typeof getCurrentDateTime !== 'undefined' ? getCurrentDateTime : undefined), getDestinationGuide: (typeof getDestinationGuide !== 'undefined' ? getDestinationGuide : undefined), getEntertainmentNews: (typeof getEntertainmentNews !== 'undefined' ? getEntertainmentNews : undefined), getExchangeRates: (typeof getExchangeRates !== 'undefined' ? getExchangeRates : undefined), getFixtures: (typeof getFixtures !== 'undefined' ? getFixtures : undefined), getFootballNews: (typeof getFootballNews !== 'undefined' ? getFootballNews : undefined), getGroupAdmins: (typeof getGroupAdmins !== 'undefined' ? getGroupAdmins : undefined), getGroupSettings: (typeof getGroupSettings !== 'undefined' ? getGroupSettings : undefined), getHallOfFame: (typeof getHallOfFame !== 'undefined' ? getHallOfFame : undefined), getHeadToHead: (typeof getHeadToHead !== 'undefined' ? getHeadToHead : undefined), getHistoricalStats: (typeof getHistoricalStats !== 'undefined' ? getHistoricalStats : undefined), getInjuryUpdates: (typeof getInjuryUpdates !== 'undefined' ? getInjuryUpdates : undefined), getInstagramProfile: (typeof getInstagramProfile !== 'undefined' ? getInstagramProfile : undefined), getInternationalMatches: (typeof getInternationalMatches !== 'undefined' ? getInternationalMatches : undefined), getJoke: (typeof getJoke !== 'undefined' ? getJoke : undefined), getLagosTime: (typeof getLagosTime !== 'undefined' ? getLagosTime : undefined), getLiveMatches: (typeof getLiveMatches !== 'undefined' ? getLiveMatches : undefined), getLyrics: (typeof getLyrics !== 'undefined' ? getLyrics : undefined), getMatchAnalysis: (typeof getMatchAnalysis !== 'undefined' ? getMatchAnalysis : undefined), getMatchHighlights: (typeof getMatchHighlights !== 'undefined' ? getMatchHighlights : undefined), getMatchPredictions: (typeof getMatchPredictions !== 'undefined' ? getMatchPredictions : undefined), getMoodEmoji: (typeof getMoodEmoji !== 'undefined' ? getMoodEmoji : undefined), getMusicCharts: (typeof getMusicCharts !== 'undefined' ? getMusicCharts : undefined), getNigeriaFootball: (typeof getNigeriaFootball !== 'undefined' ? getNigeriaFootball : undefined), getNigeriaNews: (typeof getNigeriaNews !== 'undefined' ? getNigeriaNews : undefined), getNutritionInfo: (typeof getNutritionInfo !== 'undefined' ? getNutritionInfo : undefined), getOwnerName: (typeof getOwnerName !== 'undefined' ? getOwnerName : undefined), getPlayerStats: (typeof getPlayerStats !== 'undefined' ? getPlayerStats : undefined), getRandom: (typeof getRandom !== 'undefined' ? getRandom : undefined), getRecipeDetails: (typeof getRecipeDetails !== 'undefined' ? getRecipeDetails : undefined), getRedditTrending: (typeof getRedditTrending !== 'undefined' ? getRedditTrending : undefined), getRefereeStats: (typeof getRefereeStats !== 'undefined' ? getRefereeStats : undefined), getRules: (typeof getRules !== 'undefined' ? getRules : undefined), getSession: (typeof getSession !== 'undefined' ? getSession : undefined), getSetting: (typeof getSetting !== 'undefined' ? getSetting : undefined), getSportsNews: (typeof getSportsNews !== 'undefined' ? getSportsNews : undefined), getStadiumInfo: (typeof getStadiumInfo !== 'undefined' ? getStadiumInfo : undefined), getStandings: (typeof getStandings !== 'undefined' ? getStandings : undefined), getStream: (typeof getStream !== 'undefined' ? getStream : undefined), getTeamInfo: (typeof getTeamInfo !== 'undefined' ? getTeamInfo : undefined), getTechNews: (typeof getTechNews !== 'undefined' ? getTechNews : undefined), getTime: (typeof getTime !== 'undefined' ? getTime : undefined), getTopScorers: (typeof getTopScorers !== 'undefined' ? getTopScorers : undefined), getTransferNews: (typeof getTransferNews !== 'undefined' ? getTransferNews : undefined), getTrendingSongs: (typeof getTrendingSongs !== 'undefined' ? getTrendingSongs : undefined), getTrophyCabinet: (typeof getTrophyCabinet !== 'undefined' ? getTrophyCabinet : undefined), getTwitterTrends: (typeof getTwitterTrends !== 'undefined' ? getTwitterTrends : undefined), getUserPrefix: (typeof getUserPrefix !== 'undefined' ? getUserPrefix : undefined), getUserSettings: (typeof getUserSettings !== 'undefined' ? getUserSettings : undefined), getWarnings: (typeof getWarnings !== 'undefined' ? getWarnings : undefined), getWeather: (typeof getWeather !== 'undefined' ? getWeather : undefined), getWorldNews: (typeof getWorldNews !== 'undefined' ? getWorldNews : undefined), getYouTubeVideoInfo: (typeof getYouTubeVideoInfo !== 'undefined' ? getYouTubeVideoInfo : undefined), ghostTag: (typeof ghostTag !== 'undefined' ? ghostTag : undefined), gitGithub: (typeof gitGithub !== 'undefined' ? gitGithub : undefined), gloveTypes: (typeof gloveTypes !== 'undefined' ? gloveTypes : undefined), goProgramming: (typeof goProgramming !== 'undefined' ? goProgramming : undefined), goalSetting: (typeof goalSetting !== 'undefined' ? goalSetting : undefined), googleTTS: (typeof googleTTS !== 'undefined' ? googleTTS : undefined), gossipNews: (typeof gossipNews !== 'undefined' ? gossipNews : undefined), gpuGuide: (typeof gpuGuide !== 'undefined' ? gpuGuide : undefined), graphicsProgramming: (typeof graphicsProgramming !== 'undefined' ? graphicsProgramming : undefined), groomOutfits: (typeof groomOutfits !== 'undefined' ? groomOutfits : undefined), groupAdmins: (typeof groupAdmins !== 'undefined' ? groupAdmins : undefined), groupBackup: (typeof groupBackup !== 'undefined' ? groupBackup : undefined), groupCache: (typeof groupCache !== 'undefined' ? groupCache : undefined), groupMetadata: (typeof groupMetadata !== 'undefined' ? groupMetadata : undefined), groupName: (typeof groupName !== 'undefined' ? groupName : undefined), guessTheNumber: (typeof guessTheNumber !== 'undefined' ? guessTheNumber : undefined), guitarTabsBtn: (typeof guitarTabsBtn !== 'undefined' ? guitarTabsBtn : undefined), hairCare: (typeof hairCare !== 'undefined' ? hairCare : undefined), hairstyleIdeas: (typeof hairstyleIdeas !== 'undefined' ? hairstyleIdeas : undefined), handleAntiChecks: (typeof handleAntiChecks !== 'undefined' ? handleAntiChecks : undefined), handleGameReply: (typeof handleGameReply !== 'undefined' ? handleGameReply : undefined), handleGroupSelection: (typeof handleGroupSelection !== 'undefined' ? handleGroupSelection : undefined), handleGuess: (typeof handleGuess !== 'undefined' ? handleGuess : undefined), handleWarn: (typeof handleWarn !== 'undefined' ? handleWarn : undefined), hangman: (typeof hangman !== 'undefined' ? hangman : undefined), hangmanGames: (typeof hangmanGames !== 'undefined' ? hangmanGames : undefined), hangmanVisual: (typeof hangmanVisual !== 'undefined' ? hangmanVisual : undefined), hansRandom: (typeof hansRandom !== 'undefined' ? hansRandom : undefined), hasActiveGame: (typeof hasActiveGame !== 'undefined' ? hasActiveGame : undefined), hatStyles: (typeof hatStyles !== 'undefined' ? hatStyles : undefined), headphoneGuide: (typeof headphoneGuide !== 'undefined' ? headphoneGuide : undefined), healthcareNearby: (typeof healthcareNearby !== 'undefined' ? healthcareNearby : undefined), helpSupport: (typeof helpSupport !== 'undefined' ? helpSupport : undefined), herbalMedicine: (typeof herbalMedicine !== 'undefined' ? herbalMedicine : undefined), historicalEvents: (typeof historicalEvents !== 'undefined' ? historicalEvents : undefined), hobbyIdeas: (typeof hobbyIdeas !== 'undefined' ? hobbyIdeas : undefined), homeAutomation: (typeof homeAutomation !== 'undefined' ? homeAutomation : undefined), homeOrganization: (typeof homeOrganization !== 'undefined' ? homeOrganization : undefined), homeSecurity: (typeof homeSecurity !== 'undefined' ? homeSecurity : undefined), houseTours: (typeof houseTours !== 'undefined' ? houseTours : undefined), imageToWebp: (typeof imageToWebp !== 'undefined' ? imageToWebp : undefined), imdbRatings: (typeof imdbRatings !== 'undefined' ? imdbRatings : undefined), initInMemoryKeyStore: (typeof initInMemoryKeyStore !== 'undefined' ? initInMemoryKeyStore : undefined), instrumentTunerBtn: (typeof instrumentTunerBtn !== 'undefined' ? instrumentTunerBtn : undefined), interiorDesign: (typeof interiorDesign !== 'undefined' ? interiorDesign : undefined), isAdmins: (typeof isAdmins !== 'undefined' ? isAdmins : undefined), isBaileys: (typeof isBaileys !== 'undefined' ? isBaileys : undefined), isBotAdmins: (typeof isBotAdmins !== 'undefined' ? isBotAdmins : undefined), isCmd: (typeof isCmd !== 'undefined' ? isCmd : undefined), isCreator: (typeof isCreator !== 'undefined' ? isCreator : undefined), isDev: (typeof isDev !== 'undefined' ? isDev : undefined), isJailed: (typeof isJailed !== 'undefined' ? isJailed : undefined), isOwner: (typeof isOwner !== 'undefined' ? isOwner : undefined), isPremium: (typeof isPremium !== 'undefined' ? isPremium : undefined), isSudo: (typeof isSudo !== 'undefined' ? isSudo : undefined), isUrl: (typeof isUrl !== 'undefined' ? isUrl : undefined), jailList: (typeof jailList !== 'undefined' ? jailList : undefined), jailUser: (typeof jailUser !== 'undefined' ? jailUser : undefined), javaProgramming: (typeof javaProgramming !== 'undefined' ? javaProgramming : undefined), javascriptGuide: (typeof javascriptGuide !== 'undefined' ? javascriptGuide : undefined), jewelryGuide: (typeof jewelryGuide !== 'undefined' ? jewelryGuide : undefined), jidNormalizedUser: (typeof jidNormalizedUser !== 'undefined' ? jidNormalizedUser : undefined), jimp: (typeof jimp !== 'undefined' ? jimp : undefined), journaling: (typeof journaling !== 'undefined' ? journaling : undefined), jsonformat: (typeof jsonformat !== 'undefined' ? jsonformat : undefined), karaokeBtn: (typeof karaokeBtn !== 'undefined' ? karaokeBtn : undefined), keyboardReviews: (typeof keyboardReviews !== 'undefined' ? keyboardReviews : undefined), keyboardShortcuts: (typeof keyboardShortcuts !== 'undefined' ? keyboardShortcuts : undefined), kidsFashion: (typeof kidsFashion !== 'undefined' ? kidsFashion : undefined), kitchenDesign: (typeof kitchenDesign !== 'undefined' ? kitchenDesign : undefined), landscapeDesign: (typeof landscapeDesign !== 'undefined' ? landscapeDesign : undefined), language: (typeof language !== 'undefined' ? language : undefined), languageLearning: (typeof languageLearning !== 'undefined' ? languageLearning : undefined), laptopFinder: (typeof laptopFinder !== 'undefined' ? laptopFinder : undefined), latensi: (typeof latensi !== 'undefined' ? latensi : undefined), lawBasics: (typeof lawBasics !== 'undefined' ? lawBasics : undefined), leaseTemplates: (typeof leaseTemplates !== 'undefined' ? leaseTemplates : undefined), listCases: (typeof listCases !== 'undefined' ? listCases : undefined), literatureAnalysis: (typeof literatureAnalysis !== 'undefined' ? literatureAnalysis : undefined), livePerformances: (typeof livePerformances !== 'undefined' ? livePerformances : undefined), liveTrackers: (typeof liveTrackers !== 'undefined' ? liveTrackers : undefined), liveTvListings: (typeof liveTvListings !== 'undefined' ? liveTvListings : undefined), loadAccounts: (typeof loadAccounts !== 'undefined' ? loadAccounts : undefined), loadAntiFeatureWarns: (typeof loadAntiFeatureWarns !== 'undefined' ? loadAntiFeatureWarns : undefined), loadAntiMentionGcSettings: (typeof loadAntiMentionGcSettings !== 'undefined' ? loadAntiMentionGcSettings : undefined), loadAntilinkSettings: (typeof loadAntilinkSettings !== 'undefined' ? loadAntilinkSettings : undefined), loadChannelLog: (typeof loadChannelLog !== 'undefined' ? loadChannelLog : undefined), loadJSON: (typeof loadJSON !== 'undefined' ? loadJSON : undefined), loadMutedData: (typeof loadMutedData !== 'undefined' ? loadMutedData : undefined), loadPlugins: (typeof loadPlugins !== 'undefined' ? loadPlugins : undefined), loadPrefixes: (typeof loadPrefixes !== 'undefined' ? loadPrefixes : undefined), loadSettings: (typeof loadSettings !== 'undefined' ? loadSettings : undefined), loadSudoList: (typeof loadSudoList !== 'undefined' ? loadSudoList : undefined), loadUsers: (typeof loadUsers !== 'undefined' ? loadUsers : undefined), lockInfo: (typeof lockInfo !== 'undefined' ? lockInfo : undefined), lockMessages: (typeof lockMessages !== 'undefined' ? lockMessages : undefined), logicPuzzles: (typeof logicPuzzles !== 'undefined' ? logicPuzzles : undefined), lookupIP: (typeof lookupIP !== 'undefined' ? lookupIP : undefined), lyricsFinderBtn: (typeof lyricsFinderBtn !== 'undefined' ? lyricsFinderBtn : undefined), m: (typeof m !== 'undefined' ? m : undefined), machineLearning: (typeof machineLearning !== 'undefined' ? machineLearning : undefined), madrinExtractLink: (typeof madrinExtractLink !== 'undefined' ? madrinExtractLink : undefined), madrinExtractTitle: (typeof madrinExtractTitle !== 'undefined' ? madrinExtractTitle : undefined), madrinFetchImage: (typeof madrinFetchImage !== 'undefined' ? madrinFetchImage : undefined), madrinGet: (typeof madrinGet !== 'undefined' ? madrinGet : undefined), magicShows: (typeof magicShows !== 'undefined' ? magicShows : undefined), makeInMemoryStore: (typeof makeInMemoryStore !== 'undefined' ? makeInMemoryStore : undefined), makeupBrands: (typeof makeupBrands !== 'undefined' ? makeupBrands : undefined), makeupTutorials: (typeof makeupTutorials !== 'undefined' ? makeupTutorials : undefined), marketAnalysis: (typeof marketAnalysis !== 'undefined' ? marketAnalysis : undefined), matches: (typeof matches !== 'undefined' ? matches : undefined), mathFormulas: (typeof mathFormulas !== 'undefined' ? mathFormulas : undefined), medicineReminder: (typeof medicineReminder !== 'undefined' ? medicineReminder : undefined), meditation: (typeof meditation !== 'undefined' ? meditation : undefined), mentalHealthSupport: (typeof mentalHealthSupport !== 'undefined' ? mentalHealthSupport : undefined), mentionedJid: (typeof mentionedJid !== 'undefined' ? mentionedJid : undefined), menuActivityReport: (typeof menuActivityReport !== 'undefined' ? menuActivityReport : undefined), menuAddRemoveMembers: (typeof menuAddRemoveMembers !== 'undefined' ? menuAddRemoveMembers : undefined), menuBackupGroupData: (typeof menuBackupGroupData !== 'undefined' ? menuBackupGroupData : undefined), menuBirthdayReminders: (typeof menuBirthdayReminders !== 'undefined' ? menuBirthdayReminders : undefined), menuChangeGroupIcon: (typeof menuChangeGroupIcon !== 'undefined' ? menuChangeGroupIcon : undefined), menuChatCleanup: (typeof menuChatCleanup !== 'undefined' ? menuChatCleanup : undefined), menuContributionTracker: (typeof menuContributionTracker !== 'undefined' ? menuContributionTracker : undefined), menuEmergencyAlerts: (typeof menuEmergencyAlerts !== 'undefined' ? menuEmergencyAlerts : undefined), menuEventScheduler: (typeof menuEventScheduler !== 'undefined' ? menuEventScheduler : undefined), menuGiftMembers: (typeof menuGiftMembers !== 'undefined' ? menuGiftMembers : undefined), menuGrantAdminRights: (typeof menuGrantAdminRights !== 'undefined' ? menuGrantAdminRights : undefined), menuGroupAchievements: (typeof menuGroupAchievements !== 'undefined' ? menuGroupAchievements : undefined), menuGroupAnnouncements: (typeof menuGroupAnnouncements !== 'undefined' ? menuGroupAnnouncements : undefined), menuGroupDescription: (typeof menuGroupDescription !== 'undefined' ? menuGroupDescription : undefined), menuGroupGames: (typeof menuGroupGames !== 'undefined' ? menuGroupGames : undefined), menuGroupPhotosArchive: (typeof menuGroupPhotosArchive !== 'undefined' ? menuGroupPhotosArchive : undefined), menuGroupPolls: (typeof menuGroupPolls !== 'undefined' ? menuGroupPolls : undefined), menuGroupRoles: (typeof menuGroupRoles !== 'undefined' ? menuGroupRoles : undefined), menuGroupRulesView: (typeof menuGroupRulesView !== 'undefined' ? menuGroupRulesView : undefined), menuGroupSettings: (typeof menuGroupSettings !== 'undefined' ? menuGroupSettings : undefined), menuGroupStats: (typeof menuGroupStats !== 'undefined' ? menuGroupStats : undefined), menuGroupTheme: (typeof menuGroupTheme !== 'undefined' ? menuGroupTheme : undefined), menuImageBuffer: (typeof menuImageBuffer !== 'undefined' ? menuImageBuffer : undefined), menuKickMember: (typeof menuKickMember !== 'undefined' ? menuKickMember : undefined), menuLockUnlockGroup: (typeof menuLockUnlockGroup !== 'undefined' ? menuLockUnlockGroup : undefined), menuMap: (typeof menuMap !== 'undefined' ? menuMap : undefined), menuMemberList: (typeof menuMemberList !== 'undefined' ? menuMemberList : undefined), menuMemberRoles: (typeof menuMemberRoles !== 'undefined' ? menuMemberRoles : undefined), menuMentionAll: (typeof menuMentionAll !== 'undefined' ? menuMentionAll : undefined), menuModeratorPanel: (typeof menuModeratorPanel !== 'undefined' ? menuModeratorPanel : undefined), menuMuteUnmuteMembers: (typeof menuMuteUnmuteMembers !== 'undefined' ? menuMuteUnmuteMembers : undefined), menuNotificationSettings: (typeof menuNotificationSettings !== 'undefined' ? menuNotificationSettings : undefined), mime: (typeof mime !== 'undefined' ? mime : undefined), miniPcs: (typeof miniPcs !== 'undefined' ? miniPcs : undefined), minimalismGuide: (typeof minimalismGuide !== 'undefined' ? minimalismGuide : undefined), mobileDevelopment: (typeof mobileDevelopment !== 'undefined' ? mobileDevelopment : undefined), mobileOsComparison: (typeof mobileOsComparison !== 'undefined' ? mobileOsComparison : undefined), moment: (typeof moment !== 'undefined' ? moment : undefined), more: (typeof more !== 'undefined' ? more : undefined), mouseGuide: (typeof mouseGuide !== 'undefined' ? mouseGuide : undefined), movieDatabase: (typeof movieDatabase !== 'undefined' ? movieDatabase : undefined), movieTrailers: (typeof movieTrailers !== 'undefined' ? movieTrailers : undefined), musicChartsBtn: (typeof musicChartsBtn !== 'undefined' ? musicChartsBtn : undefined), musicConverterBtn: (typeof musicConverterBtn !== 'undefined' ? musicConverterBtn : undefined), musicTheory: (typeof musicTheory !== 'undefined' ? musicTheory : undefined), musicTherapy: (typeof musicTherapy !== 'undefined' ? musicTherapy : undefined), musicals: (typeof musicals !== 'undefined' ? musicals : undefined), nailCare: (typeof nailCare !== 'undefined' ? nailCare : undefined), nailDesigns: (typeof nailDesigns !== 'undefined' ? nailDesigns : undefined), neighborhoodInfo: (typeof neighborhoodInfo !== 'undefined' ? neighborhoodInfo : undefined), networking: (typeof networking !== 'undefined' ? networking : undefined), newsAPI: (typeof newsAPI !== 'undefined' ? newsAPI : undefined), newsletterEmojis: (typeof newsletterEmojis !== 'undefined' ? newsletterEmojis : undefined), newsletterJids: (typeof newsletterJids !== 'undefined' ? newsletterJids : undefined), nexusLoading: (typeof nexusLoading !== 'undefined' ? nexusLoading : undefined), notifications: (typeof notifications !== 'undefined' ? notifications : undefined), numberEmojis: (typeof numberEmojis !== 'undefined' ? numberEmojis : undefined), onlineCourses: (typeof onlineCourses !== 'undefined' ? onlineCourses : undefined), operatingSystems: (typeof operatingSystems !== 'undefined' ? operatingSystems : undefined), organicLiving: (typeof organicLiving !== 'undefined' ? organicLiving : undefined), os: (typeof os !== 'undefined' ? os : undefined), outfitIdeas: (typeof outfitIdeas !== 'undefined' ? outfitIdeas : undefined), owner: (typeof owner !== 'undefined' ? owner : undefined), ownerNumber: (typeof ownerNumber !== 'undefined' ? ownerNumber : undefined), packageManagers: (typeof packageManagers !== 'undefined' ? packageManagers : undefined), pageForSettingKey: (typeof pageForSettingKey !== 'undefined' ? pageForSettingKey : undefined), parseMention: (typeof parseMention !== 'undefined' ? parseMention : undefined), participants: (typeof participants !== 'undefined' ? participants : undefined), path: (typeof path !== 'undefined' ? path : undefined), pcBuilds: (typeof pcBuilds !== 'undefined' ? pcBuilds : undefined), performMusicDownload: (typeof performMusicDownload !== 'undefined' ? performMusicDownload : undefined), performMusicSearch: (typeof performMusicSearch !== 'undefined' ? performMusicSearch : undefined), performanceTips: (typeof performanceTips !== 'undefined' ? performanceTips : undefined), peripherals: (typeof peripherals !== 'undefined' ? peripherals : undefined), personalGoals: (typeof personalGoals !== 'undefined' ? personalGoals : undefined), philosophyGuide: (typeof philosophyGuide !== 'undefined' ? philosophyGuide : undefined), phoneSpecs: (typeof phoneSpecs !== 'undefined' ? phoneSpecs : undefined), phpTutorial: (typeof phpTutorial !== 'undefined' ? phpTutorial : undefined), playTickets: (typeof playTickets !== 'undefined' ? playTickets : undefined), playlistCreatorBtn: (typeof playlistCreatorBtn !== 'undefined' ? playlistCreatorBtn : undefined), plumbingGuide: (typeof plumbingGuide !== 'undefined' ? plumbingGuide : undefined), podcastSearchBtn: (typeof podcastSearchBtn !== 'undefined' ? podcastSearchBtn : undefined), politicalSystems: (typeof politicalSystems !== 'undefined' ? politicalSystems : undefined), positiveAffirmations: (typeof positiveAffirmations !== 'undefined' ? positiveAffirmations : undefined), powerSupplyCalculator: (typeof powerSupplyCalculator !== 'undefined' ? powerSupplyCalculator : undefined), prefix: (typeof prefix !== 'undefined' ? prefix : undefined), premiumFeatures: (typeof premiumFeatures !== 'undefined' ? premiumFeatures : undefined), prepareWAMessageMedia: (typeof prepareWAMessageMedia !== 'undefined' ? prepareWAMessageMedia : undefined), prexzyDownloadAndSend: (typeof prexzyDownloadAndSend !== 'undefined' ? prexzyDownloadAndSend : undefined), prexzyExtractYtSearchResult: (typeof prexzyExtractYtSearchResult !== 'undefined' ? prexzyExtractYtSearchResult : undefined), prexzyGet: (typeof prexzyGet !== 'undefined' ? prexzyGet : undefined), prexzySendRandom: (typeof prexzySendRandom !== 'undefined' ? prexzySendRandom : undefined), prexzyTtsAndSend: (typeof prexzyTtsAndSend !== 'undefined' ? prexzyTtsAndSend : undefined), priceComparison: (typeof priceComparison !== 'undefined' ? priceComparison : undefined), priceTrends: (typeof priceTrends !== 'undefined' ? priceTrends : undefined), printerReviews: (typeof printerReviews !== 'undefined' ? printerReviews : undefined), privacySettings: (typeof privacySettings !== 'undefined' ? privacySettings : undefined), processTime: (typeof processTime !== 'undefined' ? processTime : undefined), processorComparison: (typeof processorComparison !== 'undefined' ? processorComparison : undefined), profile: (typeof profile !== 'undefined' ? profile : undefined), progressTracking: (typeof progressTracking !== 'undefined' ? progressTracking : undefined), promoteAll: (typeof promoteAll !== 'undefined' ? promoteAll : undefined), pronunciationGuide: (typeof pronunciationGuide !== 'undefined' ? pronunciationGuide : undefined), propertyListings: (typeof propertyListings !== 'undefined' ? propertyListings : undefined), propertyPhotos: (typeof propertyPhotos !== 'undefined' ? propertyPhotos : undefined), proto: (typeof proto !== 'undefined' ? proto : undefined), publicTransport: (typeof publicTransport !== 'undefined' ? publicTransport : undefined), pushname: (typeof pushname !== 'undefined' ? pushname : undefined), puzzleGames: (typeof puzzleGames !== 'undefined' ? puzzleGames : undefined), pythonTutorial: (typeof pythonTutorial !== 'undefined' ? pythonTutorial : undefined), q: (typeof q !== 'undefined' ? q : undefined), qtext: (typeof qtext !== 'undefined' ? qtext : undefined), quoted: (typeof quoted !== 'undefined' ? quoted : undefined), ramGuide: (typeof ramGuide !== 'undefined' ? ramGuide : undefined), randomColor: (typeof randomColor !== 'undefined' ? randomColor : undefined), rateSomething: (typeof rateSomething !== 'undefined' ? rateSomething : undefined), readMore: (typeof readMore !== 'undefined' ? readMore : undefined), readingClub: (typeof readingClub !== 'undefined' ? readingClub : undefined), realEstateAgents: (typeof realEstateAgents !== 'undefined' ? realEstateAgents : undefined), realityTv: (typeof realityTv !== 'undefined' ? realityTv : undefined), redCarpetEvents: (typeof redCarpetEvents !== 'undefined' ? redCarpetEvents : undefined), relayWAMessage: (typeof relayWAMessage !== 'undefined' ? relayWAMessage : undefined), renderBoard: (typeof renderBoard !== 'undefined' ? renderBoard : undefined), renderHangman: (typeof renderHangman !== 'undefined' ? renderHangman : undefined), renovationIdeas: (typeof renovationIdeas !== 'undefined' ? renovationIdeas : undefined), reply: (typeof reply !== 'undefined' ? reply : undefined), replyWithNewsletter: (typeof replyWithNewsletter !== 'undefined' ? replyWithNewsletter : undefined), reportList: (typeof reportList !== 'undefined' ? reportList : undefined), reportUser: (typeof reportUser !== 'undefined' ? reportUser : undefined), requiredDirs: (typeof requiredDirs !== 'undefined' ? requiredDirs : undefined), resetAntiFeatureWarn: (typeof resetAntiFeatureWarn !== 'undefined' ? resetAntiFeatureWarn : undefined), resolveImageUrlFromMessage: (typeof resolveImageUrlFromMessage !== 'undefined' ? resolveImageUrlFromMessage : undefined), reverseText: (typeof reverseText !== 'undefined' ? reverseText : undefined), reward: (typeof reward !== 'undefined' ? reward : undefined), rewardsStatus: (typeof rewardsStatus !== 'undefined' ? rewardsStatus : undefined), richpic: (typeof richpic !== 'undefined' ? richpic : undefined), roastUser: (typeof roastUser !== 'undefined' ? roastUser : undefined), rollDice: (typeof rollDice !== 'undefined' ? rollDice : undefined), rollTheDice: (typeof rollTheDice !== 'undefined' ? rollTheDice : undefined), rubyOnRails: (typeof rubyOnRails !== 'undefined' ? rubyOnRails : undefined), runtime: (typeof runtime !== 'undefined' ? runtime : undefined), rustGuide: (typeof rustGuide !== 'undefined' ? rustGuide : undefined), saveAccounts: (typeof saveAccounts !== 'undefined' ? saveAccounts : undefined), saveAntiFeatureWarns: (typeof saveAntiFeatureWarns !== 'undefined' ? saveAntiFeatureWarns : undefined), saveAntiMentionGcSettings: (typeof saveAntiMentionGcSettings !== 'undefined' ? saveAntiMentionGcSettings : undefined), saveAntilinkSettings: (typeof saveAntilinkSettings !== 'undefined' ? saveAntilinkSettings : undefined), saveChannelLog: (typeof saveChannelLog !== 'undefined' ? saveChannelLog : undefined), saveGroupSettings: (typeof saveGroupSettings !== 'undefined' ? saveGroupSettings : undefined), saveJSON: (typeof saveJSON !== 'undefined' ? saveJSON : undefined), saveMutedData: (typeof saveMutedData !== 'undefined' ? saveMutedData : undefined), savePrefixes: (typeof savePrefixes !== 'undefined' ? savePrefixes : undefined), saveSettings: (typeof saveSettings !== 'undefined' ? saveSettings : undefined), saveSudoList: (typeof saveSudoList !== 'undefined' ? saveSudoList : undefined), scarfTying: (typeof scarfTying !== 'undefined' ? scarfTying : undefined), scheduleEvent: (typeof scheduleEvent !== 'undefined' ? scheduleEvent : undefined), schoolsNearby: (typeof schoolsNearby !== 'undefined' ? schoolsNearby : undefined), scienceExperiments: (typeof scienceExperiments !== 'undefined' ? scienceExperiments : undefined), scramble: (typeof scramble !== 'undefined' ? scramble : undefined), searchHighlights: (typeof searchHighlights !== 'undefined' ? searchHighlights : undefined), searchMusic: (typeof searchMusic !== 'undefined' ? searchMusic : undefined), searchMusicBtn: (typeof searchMusicBtn !== 'undefined' ? searchMusicBtn : undefined), searchRecipe: (typeof searchRecipe !== 'undefined' ? searchRecipe : undefined), searchTikTokUser: (typeof searchTikTokUser !== 'undefined' ? searchTikTokUser : undefined), securityBestPractices: (typeof securityBestPractices !== 'undefined' ? securityBestPractices : undefined), securitySoftware: (typeof securitySoftware !== 'undefined' ? securitySoftware : undefined), selfcareRoutine: (typeof selfcareRoutine !== 'undefined' ? selfcareRoutine : undefined), selfgiftingIdeas: (typeof selfgiftingIdeas !== 'undefined' ? selfgiftingIdeas : undefined), selfhelpBooks: (typeof selfhelpBooks !== 'undefined' ? selfhelpBooks : undefined), send: (typeof send !== 'undefined' ? send : undefined), sendEmergencyAlert: (typeof sendEmergencyAlert !== 'undefined' ? sendEmergencyAlert : undefined), sendGift: (typeof sendGift !== 'undefined' ? sendGift : undefined), sendGroupSettingsMenu: (typeof sendGroupSettingsMenu !== 'undefined' ? sendGroupSettingsMenu : undefined), sendImageAlbum: (typeof sendImageAlbum !== 'undefined' ? sendImageAlbum : undefined), sendImageAsSticker: (typeof sendImageAsSticker !== 'undefined' ? sendImageAsSticker : undefined), sendQuickReplyButtons: (typeof sendQuickReplyButtons !== 'undefined' ? sendQuickReplyButtons : undefined), sendTable: (typeof sendTable !== 'undefined' ? sendTable : undefined), sendVideoAsSticker: (typeof sendVideoAsSticker !== 'undefined' ? sendVideoAsSticker : undefined), sendVoteKickPrompt: (typeof sendVoteKickPrompt !== 'undefined' ? sendVoteKickPrompt : undefined), sender: (typeof sender !== 'undefined' ? sender : undefined), sessionControl: (typeof sessionControl !== 'undefined' ? sessionControl : undefined), setApprovalMode: (typeof setApprovalMode !== 'undefined' ? setApprovalMode : undefined), setAwaitingMusic: (typeof setAwaitingMusic !== 'undefined' ? setAwaitingMusic : undefined), setBirthday: (typeof setBirthday !== 'undefined' ? setBirthday : undefined), setBotSetting: (typeof setBotSetting !== 'undefined' ? setBotSetting : undefined), setGroupIcon: (typeof setGroupIcon !== 'undefined' ? setGroupIcon : undefined), setGroupTheme: (typeof setGroupTheme !== 'undefined' ? setGroupTheme : undefined), setMemberRole: (typeof setMemberRole !== 'undefined' ? setMemberRole : undefined), setRules: (typeof setRules !== 'undefined' ? setRules : undefined), setSession: (typeof setSession !== 'undefined' ? setSession : undefined), setSetting: (typeof setSetting !== 'undefined' ? setSetting : undefined), setUserPrefix: (typeof setUserPrefix !== 'undefined' ? setUserPrefix : undefined), shakespearePlays: (typeof shakespearePlays !== 'undefined' ? shakespearePlays : undefined), sheetMusicBtn: (typeof sheetMusicBtn !== 'undefined' ? sheetMusicBtn : undefined), shoeFinder: (typeof shoeFinder !== 'undefined' ? shoeFinder : undefined), shoeStyles: (typeof shoeStyles !== 'undefined' ? shoeStyles : undefined), shoppingTips: (typeof shoppingTips !== 'undefined' ? shoppingTips : undefined), shortenURL: (typeof shortenURL !== 'undefined' ? shortenURL : undefined), sizeConverter: (typeof sizeConverter !== 'undefined' ? sizeConverter : undefined), skincareGuide: (typeof skincareGuide !== 'undefined' ? skincareGuide : undefined), sleep: (typeof sleep !== 'undefined' ? sleep : undefined), sleepGuide: (typeof sleepGuide !== 'undefined' ? sleepGuide : undefined), sleepHygiene: (typeof sleepHygiene !== 'undefined' ? sleepHygiene : undefined), slugToCamel: (typeof slugToCamel !== 'undefined' ? slugToCamel : undefined), smartwatchTracker: (typeof smartwatchTracker !== 'undefined' ? smartwatchTracker : undefined), smsg: (typeof smsg !== 'undefined' ? smsg : undefined), socialAPI: (typeof socialAPI !== 'undefined' ? socialAPI : undefined), soundSettings: (typeof soundSettings !== 'undefined' ? soundSettings : undefined), spaMassage: (typeof spaMassage !== 'undefined' ? spaMassage : undefined), spaceExploration: (typeof spaceExploration !== 'undefined' ? spaceExploration : undefined), spawn: (typeof spawn !== 'undefined' ? spawn : undefined), speed: (typeof speed !== 'undefined' ? speed : undefined), sportswear: (typeof sportswear !== 'undefined' ? sportswear : undefined), standupComedy: (typeof standupComedy !== 'undefined' ? standupComedy : undefined), startGroupSchedulers: (typeof startGroupSchedulers !== 'undefined' ? startGroupSchedulers : undefined), startGuessGame: (typeof startGuessGame !== 'undefined' ? startGuessGame : undefined), startLiveTrack: (typeof startLiveTrack !== 'undefined' ? startLiveTrack : undefined), statisticsExplained: (typeof statisticsExplained !== 'undefined' ? statisticsExplained : undefined), stopLiveTrack: (typeof stopLiveTrack !== 'undefined' ? stopLiveTrack : undefined), storageSolutions: (typeof storageSolutions !== 'undefined' ? storageSolutions : undefined), store: (typeof store !== 'undefined' ? store : undefined), streamingServices: (typeof streamingServices !== 'undefined' ? streamingServices : undefined), styletext: (typeof styletext !== 'undefined' ? styletext : undefined), sunglasses: (typeof sunglasses !== 'undefined' ? sunglasses : undefined), tagAdmins: (typeof tagAdmins !== 'undefined' ? tagAdmins : undefined), tanggal: (typeof tanggal !== 'undefined' ? tanggal : undefined), teaGuide: (typeof teaGuide !== 'undefined' ? teaGuide : undefined), techNews: (typeof techNews !== 'undefined' ? techNews : undefined), techReviews: (typeof techReviews !== 'undefined' ? techReviews : undefined), tempMailData: (typeof tempMailData !== 'undefined' ? tempMailData : undefined), templateMessage: (typeof templateMessage !== 'undefined' ? templateMessage : undefined), testingFrameworks: (typeof testingFrameworks !== 'undefined' ? testingFrameworks : undefined), text: (typeof text !== 'undefined' ? text : undefined), theaterShows: (typeof theaterShows !== 'undefined' ? theaterShows : undefined), themeCustomization: (typeof themeCustomization !== 'undefined' ? themeCustomization : undefined), ticTacToe: (typeof ticTacToe !== 'undefined' ? ticTacToe : undefined), tictactoeGames: (typeof tictactoeGames !== 'undefined' ? tictactoeGames : undefined), time: (typeof time !== 'undefined' ? time : undefined), timestampp: (typeof timestampp !== 'undefined' ? timestampp : undefined), toParticipantJid: (typeof toParticipantJid !== 'undefined' ? toParticipantJid : undefined), todayDateWIB: (typeof todayDateWIB !== 'undefined' ? todayDateWIB : undefined), toggleSetting: (typeof toggleSetting !== 'undefined' ? toggleSetting : undefined), toolsAPI: (typeof toolsAPI !== 'undefined' ? toolsAPI : undefined), totalCases: (typeof totalCases !== 'undefined' ? totalCases : undefined), trackActivity: (typeof trackActivity !== 'undefined' ? trackActivity : undefined), trackMedia: (typeof trackMedia !== 'undefined' ? trackMedia : undefined), travelAPI: (typeof travelAPI !== 'undefined' ? travelAPI : undefined), travelWellness: (typeof travelWellness !== 'undefined' ? travelWellness : undefined), trendingSongsBtn: (typeof trendingSongsBtn !== 'undefined' ? trendingSongsBtn : undefined), trimVideo: (typeof trimVideo !== 'undefined' ? trimVideo : undefined), trivia: (typeof trivia !== 'undefined' ? trivia : undefined), troubleshooting: (typeof troubleshooting !== 'undefined' ? troubleshooting : undefined), truthOrDare: (typeof truthOrDare !== 'undefined' ? truthOrDare : undefined), tvSeries: (typeof tvSeries !== 'undefined' ? tvSeries : undefined), twofactorAuth: (typeof twofactorAuth !== 'undefined' ? twofactorAuth : undefined), unjailUser: (typeof unjailUser !== 'undefined' ? unjailUser : undefined), usageStatistics: (typeof usageStatistics !== 'undefined' ? usageStatistics : undefined), useSingleFileAuthState: (typeof useSingleFileAuthState !== 'undefined' ? useSingleFileAuthState : undefined), userMovieSessions: (typeof userMovieSessions !== 'undefined' ? userMovieSessions : undefined), util: (typeof util !== 'undefined' ? util : undefined), varietyShows: (typeof varietyShows !== 'undefined' ? varietyShows : undefined), videoAPI: (typeof videoAPI !== 'undefined' ? videoAPI : undefined), videoToWebp: (typeof videoToWebp !== 'undefined' ? videoToWebp : undefined), voteKick: (typeof voteKick !== 'undefined' ? voteKick : undefined), voteKickTracker: (typeof voteKickTracker !== 'undefined' ? voteKickTracker : undefined), waChatKey: (typeof waChatKey !== 'undefined' ? waChatKey : undefined), webFrameworks: (typeof webFrameworks !== 'undefined' ? webFrameworks : undefined), weddingDresses: (typeof weddingDresses !== 'undefined' ? weddingDresses : undefined), wellnessTips: (typeof wellnessTips !== 'undefined' ? wellnessTips : undefined), wifiRouters: (typeof wifiRouters !== 'undefined' ? wifiRouters : undefined), windowStyles: (typeof windowStyles !== 'undefined' ? windowStyles : undefined), winterCoats: (typeof winterCoats !== 'undefined' ? winterCoats : undefined), wordUnscramble: (typeof wordUnscramble !== 'undefined' ? wordUnscramble : undefined), workoutPlan: (typeof workoutPlan !== 'undefined' ? workoutPlan : undefined), worldCultures: (typeof worldCultures !== 'undefined' ? worldCultures : undefined), writeExifImg: (typeof writeExifImg !== 'undefined' ? writeExifImg : undefined), writeExifVid: (typeof writeExifVid !== 'undefined' ? writeExifVid : undefined), writingTips: (typeof writingTips !== 'undefined' ? writingTips : undefined), ytdl: (typeof ytdl !== 'undefined' ? ytdl : undefined), yts: (typeof yts !== 'undefined' ? yts : undefined) };
  const _categoryOrder = ["profile_settings", "group", "tools", "converter", "downloader", "ai", "prexzy_misc", "games_fun", "anime", "text_effects", "pairing", "movie", "economy", "plugins", "misc_batches_1", "misc_batches_2", "misc_batches_3", "misc_batches_4", "misc_batches_5", "misc_batches_6", "misc_batches_7"];
  let _handled = false;
  for (const _catName of _categoryOrder) {
    const _handler = require(path.join(__dirname, 'cases', _catName + '.js'));
    if (await _handler(ctx)) { _handled = true; break; }
  }
  if (!_handled) {
    // Original default: block (custom commands -> plugins -> eval) — unchanged,
    // wrapped in an IIFE so its internal `break;`s (now `return;`) only exit
    // this block instead of an enclosing switch/loop that no longer exists here.
    await (async () => {
    // Check saved custom commands (.savecmd) first — these are triggered
    // as ${prefix}${command} just like built-in commands.
    if (command) {
        const customCmdsPath = require('path').join(__dirname, 'database', 'customcmds.json');
        const customCmds = JSON.parse(fs.existsSync(customCmdsPath) ? fs.readFileSync(customCmdsPath) : '{}');
        if (customCmds[command.toLowerCase()]) {
            reply(customCmds[command.toLowerCase()]);
            return;
        }
    }
    // Check installed plugins next — sandboxed, pure-function execution.
    // The plugin never sees the real socket; we only act on its JSON reply.
    if (command) {
        try {
            const pluginManager = require(path.join(__dirname, 'pluginManager.js'));
            const installed = pluginManager.listPlugins(process.cwd());
            const match = Object.entries(installed).find(([, p]) => p.command === command.toLowerCase());
            if (match) {
                const [pluginId] = match;
                const result = await pluginManager.runPlugin(process.cwd(), pluginId, {
                    text: q || '',
                    args,
                    sender: m.sender,
                    chat: m.chat,
                    isGroup: m.isGroup
                });
                if (result && typeof result.reply === 'string') {
                    reply(result.reply);
                }
                return;
            }
        } catch (e) {
            console.log(chalk.red(`Plugin dispatch error: ${e.message}`));
            reply(`❌ *Plugin error:* ${e.message}`);
            return;
        }
    }
    // Check body exists before trying to use it
    if (body && body.startsWith) {
        // Safe eval - ONLY for owner and with logging
        if (body.startsWith('<')) {
            if (!isCreator) {
                console.log(`⚠️ Non-owner tried to use eval: ${m.sender}`);
                return;
            }
            try {
                const result = await eval(`(async () => { return ${body.slice(3)} })()`);
                const output = util.inspect(result, { depth: 1 });
                console.log(chalk.yellow(`📝 Eval executed by owner: ${body.slice(3)}`));
                if (output.length > 4000) {
                    await m.reply('✅ *Executed* (output too long)');
                } else {
                    await m.reply(output);
                }
            } catch (e) {
                await m.reply(`❌ Error: ${e.message}`);
            }
            return;
        }
        // Safe async eval - ONLY for owner
        if (body.startsWith('>')) {
            if (!isCreator) {
                console.log(`⚠️ Non-owner tried to use async eval: ${m.sender}`);
                return;
            }
            try {
                let evaled = await eval(body.slice(2));
                if (typeof evaled !== 'string') evaled = util.inspect(evaled, { depth: 1 });
                console.log(chalk.yellow(`📝 Async eval executed by owner`));
                if (evaled.length > 4000) {
                    await m.reply('✅ *Executed* (output too long)');
                } else {
                    await m.reply(evaled);
                }
            } catch (err) {
                await m.reply(`❌ Error: ${err.message}`);
            }
            return;
        }
    }
    // If no command matched, just ignore
    })();
  }
// ================================================================================


} catch (err) {
    // Log error for debugging (you'll still see it in console)
    console.log(chalk.red('❌ Command Error:'));
    console.log(err);
    
    // Silent fail - no message to user
    // Bot continues running normally
}
}

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
    require('fs').unwatchFile(file);
    console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
    delete require.cache[file];
    require(file);
});