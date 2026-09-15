const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUGGESTIONS_FILE = path.join(__dirname, 'suggestions', 'suggestions.json');

function ensureDB() {
    const dir = path.join(__dirname, 'suggestions');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(SUGGESTIONS_FILE)) fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify({}, null, 2));
}

function loadDB() {
    ensureDB();
    try { return JSON.parse(fs.readFileSync(SUGGESTIONS_FILE, 'utf-8')); } catch { return {}; }
}

function saveDB(data) {
    fs.writeFileSync(SUGGESTIONS_FILE, JSON.stringify(data, null, 2));
}

function generateId() {
    return 'sug-' + crypto.randomBytes(4).toString('hex');
}

function submitSuggestion(data) {
    const db = loadDB();
    const id = generateId();
    db[id] = {
        id,
        name: data.name || 'Anonymous',
        contact: data.contact || null,
        topic: data.topic || '',
        language: data.language || 'English',
        description: data.description || '',
        seen: false,
        submittedAt: new Date().toISOString()
    };
    saveDB(db);
    return id;
}

function listAll() {
    const db = loadDB();
    return Object.values(db).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

function listNew() {
    return listAll().filter(s => !s.seen);
}

function markSeen(id) {
    const db = loadDB();
    if (!db[id]) return false;
    db[id].seen = true;
    saveDB(db);
    return true;
}

module.exports = { submitSuggestion, listAll, listNew, markSeen };
