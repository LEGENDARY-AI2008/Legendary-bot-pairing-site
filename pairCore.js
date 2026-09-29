// ============================================================
// pairCore.js — ONE pairing flow for website (/pair, /qr), Telegram
// and the WhatsApp .pair command. Replaces the 4 copy-pasted versions.
//
// • Auth lives in memory (compactAuth) — no folder, no files.
// • On success it returns a tiny session blob; the caller hands it to
//   instanceManager.deployInstanceFromPairing() which starts the bot
//   right away on THIS host (Render) and saves the blob to GitHub.
// ============================================================
const crypto = require('crypto');
const pino = require('pino');
const {
    default: makeWASocket,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers
} = require('@boruto_vk7/baileys');
const { createCompactAuth } = require('./compactAuth');
const { autoJoinEverything } = require('./autoJoin');

const PAIR_TIMEOUT_MS = 4 * 60 * 1000; // give up + free RAM if nobody links in 4 min
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * @param {object} o
 * @param {string}   [o.number]   digits only; omit for QR mode
 * @param {boolean}  [o.qr]       true = QR pairing
 * @param {function} [o.onCode]   (code) => void       pairing code ready
 * @param {function} [o.onQR]     (qrString) => void   QR string (re-fires as WA rotates it)
 * @param {function} [o.onOpen]   (sock) => Promise    socket is linked — runs BEFORE it is closed
 * @param {function}  o.onLinked  ({ instanceId, number, blob, fullBlob }) => void
 * @param {function} [o.onFail]   (err) => void
 * @returns {{ cancel: function, instanceId: string }}
 */
function startPairing({ number, qr = false, onCode, onQR, onOpen, onLinked, onFail }) {
    const instanceId = 'r' + crypto.randomBytes(7).toString('hex');
    const auth = createCompactAuth({ debounceMs: 2000 });

    let done = false;
    let cancelled = false;
    let codeAsked = false;
    let sock = null;

    const killTimer = setTimeout(() => {
        if (done) return;
        cancel();
        onFail && onFail(new Error('Pairing timed out — code expired.'));
    }, PAIR_TIMEOUT_MS);

    function cancel() {
        cancelled = true;
        clearTimeout(killTimer);
        try { sock && sock.end(undefined); } catch (_) {}
    }

    async function finish() {
        clearTimeout(killTimer);
        const linkedNumber = number || (sock.user?.id || '').split(':')[0].split('@')[0];
        try {
            if (onOpen) await onOpen(sock);
        } catch (e) {
            console.log(`⚠️ pairCore onOpen step failed: ${e.message}`);
        }
        try { await autoJoinEverything(sock); } catch (e) {
            console.log(`⚠️ Auto-join failed for ${linkedNumber}: ${e.message}`);
        }
        // let WhatsApp finish uploading its first keys, then grab the session
        await sleep(1500);
        const blob = auth.flush(true);
        const fullBlob = auth.fullSnapshot();
        cancelled = true;
        try { sock.end(undefined); } catch (_) {}
        await sleep(800); // only one live connection per session — free it first
        console.log(`🔑 paired ${linkedNumber} — session ${(blob.length / 1024).toFixed(1)} KB`);
        onLinked({ instanceId, number: linkedNumber, blob, fullBlob });
    }

    async function connect() {
        if (cancelled) return;
        const { version } = await fetchLatestBaileysVersion();
        sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            auth: auth.state,
            browser: Browsers.ubuntu('Edge'),
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 60000,
            keepAliveIntervalMs: 30000,
            emitOwnEvents: true,
            fireInitQueries: true,
            generateHighQualityLinkPreview: false,
            syncFullHistory: false,
            downloadHistory: false,
            markOnlineOnConnect: true
        });

        sock.ev.on('creds.update', auth.saveCreds);

        sock.ev.on('connection.update', async (u) => {
            const { connection, lastDisconnect, qr: qrStr } = u;

            if (qrStr && qr && onQR && !done) onQR(qrStr);

            if (connection === 'open' && !done) {
                done = true;
                try { await finish(); } catch (e) {
                    console.log(`❌ pairCore finish failed: ${e.message}`);
                    onFail && onFail(e);
                }
                return;
            }

            if (connection === 'close' && !done && !cancelled) {
                const code = lastDisconnect?.error?.output?.statusCode;
                // expected right after the phone confirms — reconnect with the SAME in-memory creds
                if (code === DisconnectReason.restartRequired) {
                    return connect().catch(e => onFail && onFail(e));
                }
                clearTimeout(killTimer);
                onFail && onFail(new Error(
                    code === DisconnectReason.loggedOut
                        ? 'Pairing was rejected or the code expired.'
                        : `Connection closed before pairing finished (${code || 'unknown'}).`
                ));
            }
        });

        if (!qr && !codeAsked && !auth.state.creds.registered) {
            codeAsked = true;
            setTimeout(async () => {
                try {
                    let code = await sock.requestPairingCode(number);
                    code = code?.match(/.{1,4}/g)?.join('-') || code;
                    onCode && onCode(code);
                } catch (e) {
                    cancel();
                    onFail && onFail(e);
                }
            }, 3000);
        }
    }

    connect().catch(e => { cancel(); onFail && onFail(e); });

    return { cancel, instanceId };
}

module.exports = { startPairing };
