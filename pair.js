// ============================================================
// pair.js — used by the .pair command (runs INSIDE a bot process).
// Returns the pairing code. When the phone confirms, it hands the
// tiny session to the main Render process over IPC, which starts
// the new bot immediately. No files, no folders.
// ============================================================
const { startPairing } = require('./pairCore');

module.exports = function pairForJid(jid) {
    const number = String(jid).replace(/[^0-9]/g, '');

    return new Promise((resolve, reject) => {
        let gotCode = false;

        startPairing({
            number,
            onCode: (code) => { gotCode = true; resolve(code); },
            onLinked: ({ instanceId, number: linked, blob, fullBlob }) => {
                const botConfig = {
                    ownerNumber: linked,
                    ownerName: 'WhatsApp User',
                    botName: 'LËGĒNDÃRY BØT',
                    prefix: '.',
                    workType: 'private'
                };
                if (process.send) {
                    process.send({ type: 'deploy-paired', instanceId, blob, fullBlob, botConfig });
                } else {
                    require('./instanceManager').deployInstanceFromPairing({ instanceId, blob, fullBlob, botConfig });
                }
            },
            onFail: (err) => {
                if (!gotCode) reject(err);
                else console.log(`🚪 .pair for ${number} ended: ${err.message}`);
            }
        });
    });
};
