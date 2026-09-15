// ============================================================
// PAIREDUSERS.JS — tracks which Telegram users have already paired a
// bot, so /pair can check "do you already have one running" before
// starting a fresh pairing, and so admin commands can list/broadcast
// to everyone who's paired.
// ============================================================
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'pairedUsers.json');

function ensureDB() {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
}

function loadDB() {
    ensureDB();
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } catch (e) { return {}; }
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/** Returns the paired record for a Telegram user, or null if they've never paired. */
function getPairedUser(telegramId) {
    const db = loadDB();
    return db[String(telegramId)] || null;
}

function recordPairing(telegramId, { instanceId, number, username }) {
    const db = loadDB();
    db[String(telegramId)] = {
        telegramId: String(telegramId),
        instanceId,
        number,
        username: username || null,
        pairedAt: new Date().toISOString()
    };
    saveDB(db);
}

function removePairing(telegramId) {
    const db = loadDB();
    delete db[String(telegramId)];
    saveDB(db);
}

function getAllPairedUsers() {
    const db = loadDB();
    return Object.values(db);
}

function countPairedUsers() {
    return getAllPairedUsers().length;
}

module.exports = { getPairedUser, recordPairing, removePairing, getAllPairedUsers, countPairedUsers };
