const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORE_DIR = path.join(__dirname, 'nexstore', 'panel-sessions');
const DB_FILE = path.join(STORE_DIR, 'sessions.json');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function loadDB() {
    ensureDir(STORE_DIR);
    if (!fs.existsSync(DB_FILE)) return {};
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); }
    catch { return {}; }
}

function saveDB(db) {
    ensureDir(STORE_DIR);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function createSession(phoneNumber, pairingAuthDir) {
    const sessionId = 'sess_' + crypto.randomBytes(10).toString('hex');
    const stableDir = path.join(STORE_DIR, sessionId);
    ensureDir(stableDir);

    for (const file of fs.readdirSync(pairingAuthDir)) {
        fs.copyFileSync(path.join(pairingAuthDir, file), path.join(stableDir, file));
    }

    const db = loadDB();
    db[sessionId] = {
        sessionId,
        phoneNumber,
        authDir: stableDir,
        createdAt: Date.now()
    };
    saveDB(db);
    return sessionId;
}

function getSession(sessionId) {
    const db = loadDB();
    return db[sessionId] || null;
}

function packageSessionFiles(sessionId) {
    const session = getSession(sessionId);
    if (!session || !fs.existsSync(session.authDir)) return null;

    const bundle = {};
    for (const file of fs.readdirSync(session.authDir)) {
        const filePath = path.join(session.authDir, file);
        if (fs.statSync(filePath).isFile()) {
            bundle[file] = fs.readFileSync(filePath).toString('base64');
        }
    }
    return bundle;
}

module.exports = { createSession, getSession, packageSessionFiles };
