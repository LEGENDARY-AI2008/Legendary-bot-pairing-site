require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// One bad exception used to be able to take the entire server down —
// no crash protection existed anywhere in this codebase. This doesn't
// fix the underlying cause of any given error, but stops one bad
// exception from silently killing every deployed bot instance with it.
process.on('uncaughtException', (err) => {
    console.error('❌ [UNCAUGHT EXCEPTION] Server stayed up, but this needs fixing:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('❌ [UNHANDLED REJECTION] Server stayed up, but this needs fixing:', reason);
});

const path = require('path');
const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    Browsers,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require('@boruto_vk7/baileys');
const pino = require('pino');
const axios = require('axios');
const qrcode = require('qrcode');
const { startPairing } = require('./pairCore');
const pluginManager = require('./pluginManager');
const suggestionManager = require('./suggestionManager');
const instanceManager = require('./instanceManager');
// Auto-join, on the code-pairing (/pair) path only — QR is untouched for now.
const { autoJoinEverything } = require('./autoJoin');

const app = express();
const PORT = process.env.PORT || 3059;

app.use(cors());
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
});
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Serve index.html at root
app.get('/', (req, res) => res.sendFile(path.join(process.cwd(), 'index.html')));

// ─── Ping route for UptimeRobot ───────────────────────────
app.get('/ping', (req, res) => res.status(200).json({ status: 'ok', bot: 'LËGĚNDÃRY BØT', uptime: process.uptime() }));

app.use(express.static(__dirname));

const activePairings = new Map(); // number -> { cancel }
const pairedNumbers = new Set();  // numbers paired since this process started (for /status)

const DEFAULT_BOT_CONFIG = (number) => ({
    ownerNumber: number,
    ownerName: 'WhatsApp User',
    botName: 'LËGĒNDÃRY BØT',
    prefix: '.',
    workType: 'private'
});

// One handler for "someone finished pairing" — website code, website QR.
// Starts the bot on THIS server immediately. The bot itself sends the normal welcome message.
function onPaired({ instanceId, number, blob, fullBlob }) {
    pairedNumbers.add(number);
    const result = instanceManager.deployInstanceFromPairing({
        instanceId, blob, fullBlob, botConfig: DEFAULT_BOT_CONFIG(number)
    });
    if (result.success) console.log(`🚀 Bot started for ${number} (session ${(blob.length / 1024).toFixed(1)} KB)`);
    else console.log(`❌ Deploy failed for ${number}: ${result.message}`);
    return result;
}

// ─── Generate Pairing Code ────────────────────────────────────────────────────
app.post('/pair', (req, res) => {
    let { number } = req.body || {};
    if (!number) return res.status(400).json({ error: 'Phone number is required' });

    number = String(number).replace(/[^0-9]/g, '');
    if (!number || number.length < 7) return res.status(400).json({ error: 'Invalid phone number' });

    try { activePairings.get(number)?.cancel(); } catch {}
    activePairings.delete(number);

    let responded = false;
    const respond = (fn) => { if (!responded && !res.headersSent) { responded = true; fn(); } };

    const handle = startPairing({
        number,
        onCode: (code) => respond(() => res.json({ success: true, code })),
        onLinked: (info) => { activePairings.delete(number); onPaired(info); },
        onFail: (err) => {
            activePairings.delete(number);
            console.log(`🚪 Pairing for ${number} ended: ${err.message}`);
            respond(() => res.status(500).json({ error: err.message || 'Failed to generate pairing code' }));
        }
    });
    activePairings.set(number, handle);
});

// ─── Generate QR Code for pairing ─────────────────────────────────────────────
let qrSession = null; // single active QR session at a time

app.get('/qr', (req, res) => {
    try { qrSession?.handle?.cancel(); } catch {}

    const session = { linked: false, handle: null };
    qrSession = session;

    let responded = false;
    const respond = (fn) => { if (!responded && !res.headersSent) { responded = true; fn(); } };
    const timeout = setTimeout(() => respond(() => res.status(500).json({ error: 'QR generation timeout' })), 20000);

    session.handle = startPairing({
        qr: true,
        onQR: async (qrString) => {
            try {
                const qrDataUrl = await qrcode.toDataURL(qrString);
                clearTimeout(timeout);
                respond(() => res.json({ success: true, qr: qrDataUrl }));
            } catch {
                respond(() => res.status(500).json({ error: 'Failed to render QR code' }));
            }
        },
        onLinked: (info) => { session.linked = true; onPaired(info); },
        onFail: (err) => {
            clearTimeout(timeout);
            console.log(`QR pairing ended: ${err.message}`);
            respond(() => res.status(500).json({ error: err.message || 'Failed to generate QR code' }));
        }
    });
});

app.get('/qr/status', (req, res) => {
    res.json({ linked: qrSession?.linked || false });
});

// ─── Frontend compatibility routes (matches index.html's actual calls) ────────
app.get('/plugins', (req, res) => {
    const plugins = pluginManager.listApproved().map(p => ({
        id: p.id, name: p.name, author: p.author, desc: p.description,
        date: p.submittedAt, cmd: `.plugin install ${p.id}`,
        url: `${req.protocol}://${req.get('host')}/api/plugins/${p.id}`, demo: false
    }));
    res.json({ plugins });
});

app.post('/plugins', express.json(), (req, res) => {
    const { name, author, desc, code, cmd } = req.body;
    if (!name || !author || !desc || !code) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const id = pluginManager.submitPlugin({ name, author, description: desc, code, category: 'misc' });
    res.json({ success: true, id, message: 'Submitted for review' });
});

app.post('/suggest', express.json(), (req, res) => {
    const { name, idea } = req.body;
    if (!idea) return res.status(400).json({ error: 'Missing suggestion text' });
    const id = suggestionManager.submitSuggestion({
        name: name || 'Anonymous', contact: null,
        topic: idea.slice(0, 60), language: 'English', description: idea
    });
    res.json({ success: true, id, message: 'Suggestion received — thank you!' });
});

// ─── Simple bot control (instance id acts as login) ───────────────────────────
app.get('/api/panel/login/:sessionId', (req, res) => {
    const instance = instanceManager.getInstance(req.params.sessionId);
    if (!instance) return res.status(404).json({ error: 'Invalid session ID' });
    res.json({ success: true, phoneNumber: instance.botConfig?.ownerNumber, instance });
});

// Restart with new settings (pairing already starts the bot by itself)
app.post('/api/panel/deploy', express.json(), (req, res) => {
    const { sessionId, ownerName, botName, prefix, workType } = req.body || {};
    const existing = instanceManager.getInstance(sessionId);
    if (!existing) return res.status(404).json({ error: 'Invalid session ID' });

    const botConfig = {
        ...existing.botConfig,
        ownerName: ownerName || existing.botConfig.ownerName,
        botName: botName || existing.botConfig.botName,
        prefix: prefix || existing.botConfig.prefix,
        workType: workType || existing.botConfig.workType
    };
    if (existing.status === 'running') instanceManager.stopInstance(sessionId);
    setTimeout(() => {
        const result = instanceManager.deployInstance({ sessionId, botConfig });
        res.status(result.success ? 200 : 400).json(result);
    }, 1500);
});

app.get('/api/panel/status/:sessionId', (req, res) => {
    const instance = instanceManager.getInstance(req.params.sessionId);
    if (!instance) return res.json({ deployed: false });
    res.json({ deployed: true, ...instance });
});

app.get('/api/panel/logs/:sessionId', (req, res) => {
    res.json({ logs: instanceManager.getInstanceLogs(req.params.sessionId) });
});

app.post('/api/panel/stop', express.json(), (req, res) => {
    const result = instanceManager.stopInstance((req.body || {}).sessionId);
    res.status(result.success ? 200 : 400).json(result);
});

// ─── Plugin submissions & moderation ──────────────────────────────────────────
const ADMIN_KEY = process.env.ADMIN_KEY; // set in .env — protects moderation actions

function requireAdmin(req, res, next) {
    const key = req.headers['x-admin-key'];
    if (!key || key !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Public — anyone can submit a plugin (goes into pending queue, not visible until approved)
app.post('/api/plugins/submit', express.json(), (req, res) => {
    const { name, author, description, code, category, contact, command } = req.body;
    if (!name || !author || !description || !code || !command) {
        return res.status(400).json({ error: 'Missing required fields: name, author, description, code, command' });
    }
    if (!/^[a-z0-9_-]+$/i.test(command)) {
        return res.status(400).json({ error: 'command must be a single word (letters, numbers, - or _ only) — this is what users type to trigger it' });
    }
    const id = pluginManager.submitPlugin({ name, author, description, code, category, contact, command });
    res.json({ success: true, id, message: 'Submitted for review' });
});

// Public — list approved plugins only (what the site/search shows)
app.get('/api/plugins', (req, res) => {
    const q = req.query.q;
    const plugins = q ? pluginManager.searchApproved(q) : pluginManager.listApproved();
    res.json({ plugins });
});

// Public — fetch a single approved plugin's code by ID (used by .plugin install)
app.get('/api/plugins/:id', (req, res) => {
    const plugin = pluginManager.getPlugin(req.params.id);
    if (!plugin || plugin.status !== 'approved') {
        return res.status(404).json({ error: 'Plugin not found or not approved' });
    }
    res.json({ id: plugin.id, name: plugin.name, author: plugin.author, command: plugin.command, code: plugin.code });
});

// Admin-only — see what's waiting for review
app.get('/api/plugins/pending', requireAdmin, (req, res) => {
    res.json({ plugins: pluginManager.listPending() });
});

// Admin-only — approve a plugin
app.post('/api/plugins/:id/approve', requireAdmin, express.json(), (req, res) => {
    const ok = pluginManager.approvePlugin(req.params.id, req.body?.note);
    if (!ok) return res.status(404).json({ error: 'Plugin not found' });
    res.json({ success: true });
});

// Admin-only — reject a plugin
app.post('/api/plugins/:id/reject', requireAdmin, express.json(), (req, res) => {
    const ok = pluginManager.rejectPlugin(req.params.id, req.body?.note);
    if (!ok) return res.status(404).json({ error: 'Plugin not found' });
    res.json({ success: true });
});

// ─── Feature suggestions ───────────────────────────────────────────────────────
// Public — anyone can submit a suggestion from the site form
app.post('/api/suggestions', express.json(), (req, res) => {
    const { name, contact, topic, language, description } = req.body;
    if (!name || !topic || !description) {
        return res.status(400).json({ error: 'Missing required fields: name, topic, description' });
    }
    const id = suggestionManager.submitSuggestion({ name, contact, topic, language, description });
    res.json({ success: true, id, message: 'Suggestion received — thank you!' });
});

// Admin-only — review suggestions
app.get('/api/suggestions', requireAdmin, (req, res) => {
    const onlyNew = req.query.new === 'true';
    res.json({ suggestions: onlyNew ? suggestionManager.listNew() : suggestionManager.listAll() });
});

// ─── Serve latest bot files from the private GitHub repo (for .update command) ──
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // set as an env var on Render, never hardcode
const GITHUB_REPO = process.env.GITHUB_REPO || 'LEGENDARY-AI2008/Legendary-bot-pairing-site'; // owner/repo
const ALLOWED_UPDATE_FILES = [
    'bot.js', 'case.js', 'storage.js', 'pair.js', 'pairCore.js', 'compactAuth.js', 'githubSync.js',
    'setting/config.js', 'setting/Settings.js', 'allfunc/storage.js', 'allfunc/exif.js',
    'cases/ai.js', 'cases/anime.js', 'cases/converter.js', 'cases/downloader.js',
    'cases/economy.js', 'cases/games_fun.js', 'cases/group.js',
    'cases/misc_batches_1.js', 'cases/misc_batches_2.js', 'cases/misc_batches_3.js',
    'cases/misc_batches_4.js', 'cases/misc_batches_5.js', 'cases/misc_batches_6.js',
    'cases/misc_batches_7.js', 'cases/movie.js', 'cases/pairing.js', 'cases/plugins.js',
    'cases/prexzy_misc.js', 'cases/profile_settings.js', 'cases/text_effects.js', 'cases/tools.js'
]; // whitelist — only these can be fetched

// NOTE: changed from '/api/update/:filename' to a wildcard route below,
// because Express's single :param segment does not match slashes — so
// nested paths like 'setting/config.js' would 404 before ever reaching
// the whitelist check.
app.get(/^\/api\/update\/(.+)$/, async (req, res) => {
    const filename = req.params[0];
    const { sessionId } = req.query;

    if (!ALLOWED_UPDATE_FILES.includes(filename)) {
        return res.status(403).json({ error: 'File not allowed for update' });
    }

    if (!sessionId || !instanceManager.getInstance(sessionId)) {
        return res.status(401).json({ error: 'Valid sessionId required — pair first' });
    }

    try {
        const ghRes = await axios.get(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${filename}`,
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.raw+json'
                }
            }
        );
        res.type('text/plain').send(ghRes.data);
    } catch (e) {
        res.status(500).json({ error: 'Could not fetch file from repo', detail: e.message });
    }
});

// ─── Check pairing status ─────────────────────────────────────────────────────
app.get('/status/:number', (req, res) => {
    const number = req.params.number.replace(/[^0-9]/g, '');
    res.json({ paired: pairedNumbers.has(number) });
});

// ─── Start server + Cloudflare Tunnel ─────────────────────────────────────────
const githubSync = require('./githubSync');

(async () => {
    // Restore the last GitHub-backed-up state BEFORE we start serving —
    // matters most right after a Render redeploy/restart, where local
    // files are wiped and would otherwise start empty. No-ops quietly
    // if GITHUB_TOKEN/GITHUB_REPO aren't set.
    await githubSync.restoreFromGitHub();

    app.listen(PORT, async () => {
    console.log(`✅ LËGĚNDÃRY BØT Pairing Server running on port ${PORT}`);

    // Render is the ONLY host now: bots run right here as child processes.
    // Data files (owner.json, premium.json, instances.json ...) sync to GitHub every 5 min;
    // sessions are saved separately by sessionStore (one tiny file per user).
    githubSync.startAutoSync(5 * 60 * 1000, githubSync.SYNC_FILES);
    if (githubSync.enabled()) {
        console.log('✅ githubSync: auto backup/restore active');
    }

    // On Render stop/redeploy (SIGTERM): let every bot save its session, push to GitHub, then exit.
    global.__legendaryShutdown = () => instanceManager.shutdownAll();

    // Bring every paired user's bot back up (also picks up old "pending" ones from the panel days)
    instanceManager.restoreInstances().catch(e => console.log(`❌ restoreInstances failed: ${e.message}`));

    // `.update` inside any bot drops instances/update-flag.json — this process is the one that
    // started every bot, so it does the real restart-all (replaces multibot.js's old poll).
    let lastUpdateFlag = 0;
    setInterval(() => {
        try {
            const flag = JSON.parse(fs.readFileSync(path.join(__dirname, 'instances', 'update-flag.json'), 'utf-8'));
            if (flag.requestedAt && flag.requestedAt > lastUpdateFlag) {
                if (lastUpdateFlag) instanceManager.restartAllInstances();
                lastUpdateFlag = flag.requestedAt;
            }
        } catch (_) {}
    }, 30 * 1000);

    // Telegram pairing bot runs in THIS process so both share the same instance manager
    if (process.env.TELEGRAM_BOT_TOKEN_1 || process.env.TELEGRAM_BOT_TOKEN_2) {
        try { require('./telegramPairBot'); } catch (e) { console.log(`❌ Telegram bot failed to start: ${e.message}`); }
    }


    try {
        const { spawn } = require('child_process');

        // ⚠️ Set your Cloudflare Tunnel token as an env var: TUNNEL_TOKEN
        const tunnelToken = process.env.TUNNEL_TOKEN;
        if (!tunnelToken) {
            console.log(`⚠️ No TUNNEL_TOKEN set in .env — skipping Cloudflare Tunnel.`);
            return;
        }

        const { bin: cloudflaredBin, install: installCloudflared } = require('cloudflared');

        // The postinstall step that normally downloads this binary can get
        // blocked by npm's install-scripts permission gate — this is the
        // package's own documented fallback: check, install on demand.
        if (!fs.existsSync(cloudflaredBin)) {
            console.log(`⬇️ cloudflared binary missing — downloading it now...`);
            await installCloudflared(cloudflaredBin);
            console.log(`✅ cloudflared binary installed.`);
        }

        const cloudflared = spawn(cloudflaredBin, ['tunnel', 'run', '--token', tunnelToken], {
            stdio: ['ignore', 'pipe', 'pipe']
        });

        // Without this, an unhandled 'error' event crashes the process AND
        // dumps the full spawnargs — including the tunnel token — to the
        // console in plaintext. This was happening before this fix.
        cloudflared.on('error', (err) => {
            console.log(`⚠️ Cloudflare Tunnel failed to start: ${err.code || err.message}`);
        });

        cloudflared.stdout.on('data', d => console.log(`[tunnel] ${d}`.trim()));
        cloudflared.stderr.on('data', d => console.log(`[tunnel] ${d}`.trim()));

        console.log(`\n🌐 ====================================`);
        console.log(`🌐 Cloudflare Tunnel starting...`);
        console.log(`🌐 Your custom domain will be live shortly (check Cloudflare DNS for the exact hostname).`);
        console.log(`🌐 ====================================\n`);

    } catch (e) {
        console.log(`⚠️ Cloudflare Tunnel failed: ${e.message}`);
    }
    });
})();

