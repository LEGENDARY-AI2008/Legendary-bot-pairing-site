# case.js split — command → file map

`case.js` is now a dispatcher. On each command it builds one shared `ctx`
object (everything the original switch had in scope — devtrust, m, reply,
prefix, isCreator, isAdmins, every helper function, every top-level import
etc.) and tries each file below in order until one reports it handled the
command. If none do, it falls through to the original default-case logic
(custom commands → plugins → owner eval), unchanged.

| File | Roughly | Commands |
|---|---|---|
| cases/group.js | group mgmt, anti-spam/anti-bot, warn/mute, roles | 75 |
| cases/ai.js | AI chat, Madrin/Prexzy AI endpoints | 81 |
| cases/tools.js | text/math utility commands, tools | 56 |
| cases/games_fun.js | hangman, fun commands, misc games | 49 |
| cases/prexzy_misc.js | Prexzy API grab-bag (stalk/games/sports/audio etc) | 41 |
| cases/anime.js | anime/manga | 36 |
| cases/economy.js | economy system | 35 |
| cases/profile_settings.js | profile pic, privacy, autoreply, setvar, notes, archive | 30 |
| cases/downloader.js | downloaders | 30 |
| cases/converter.js | converters | 26 |
| cases/text_effects.js | ephoto/fancy text/fonts | 14 |
| cases/plugins.js | plugin commands | 14 |
| cases/movie.js | movie commands | 3 |
| cases/pairing.js | pairing commands | 2 |
| cases/misc_batches_1.js .. _7.js | ⚠️ NOT semantically sorted — these are the big unlabeled dumps from the original file ("300 NEW COMMANDS", "BATCH 2", "NEW BATCH 3", "REMAINING LEGENDARY-AI COMMANDS", etc). Split into ~45-command chunks just so no file is huge. Still needs a manual pass to move each command into its real category. | ~293 total |

## What did NOT change
- Every case body is byte-identical to the original — nothing was rewritten,
  only relocated.
- Command aliases (fallthrough `case 'a': case 'b': { ... }`) stayed grouped
  together in the same file.
- The default-case logic (custom commands, installed plugins, owner eval)
  is untouched, just wrapped in an IIFE so its internal early-exits work
  without the switch around them.

## What's still one big-ish file
`case.js` itself is still ~11.8k lines — that's the original setup code
(imports, permission checks, the menu system, and ~80 inlined helper
"commands/X.js" function libraries that the case files call into). The
switch itself (the actual bloat) is what's been split out. If you want,
next pass can split that preamble the same way, using its existing
`// ============ inlined from commands/X.js ============` markers.

## Before you deploy
- This was generated mechanically (script-driven extraction, not hand
  retyped) and every file passed `node --check`, but it hasn't been run
  against a live bot. Test locally first, keep the original case.js as a
  backup.
