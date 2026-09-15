// Auto-extracted from case.js — commands originally under section(s):
//   - ANTI-FEATURE TOGGLES (group.js — text-command path)
//   - BATCH 2: ~100 MORE COMMANDS
//   - DELETE MESSAGE (FIXED)
//   - DEMOTE
//   - EMERGENCY ALERT (group.js)
//   - GIFT MEMBER (group.js)
//   - GROUP INVITE LINK
//   - KICK MEMBER
//   - MATCH HIGHLIGHTS (football.js)
//   - NEW BATCH 3: 80 more commands, pure JS, tested logic
//   - NOTIFICATION SETTINGS TOGGLE (group.js + Settings.js)
//   - PROMOTE
//   - REVOKE LINK
//   - SCHEDULE EVENT (group.js)
//   - SET BIRTHDAY (group.js)
//   - SET GROUP ICON (group.js)
//   - SET GROUP THEME (group.js)
//   - SET MEMBER ROLE (group.js)
//   - TAG ALL
//   - TEAM INFO (football.js)
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case 'distancecalc': {
    const [dcLat1, dcLon1, dcLat2, dcLon2] = (text || '').split(' ').map(Number);
    if ([dcLat1, dcLon1, dcLat2, dcLon2].some(isNaN)) return reply(`Usage: ${prefix}distancecalc <lat1> <lon1> <lat2> <lon2>`);
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(dcLat2 - dcLat1), dLon = toRad(dcLon2 - dcLon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(dcLat1)) * Math.cos(toRad(dcLat2)) * Math.sin(dLon / 2) ** 2;
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    reply(`📍 Distance: *${dist.toFixed(2)} km* (${(dist * 0.621371).toFixed(2)} mi)`);
}
break;

case 'timezoneoffset': {
    const [tzOff1, tzOff2] = (text || '').split(' ').map(Number);
    if (isNaN(tzOff1) || isNaN(tzOff2)) return reply(`Usage: ${prefix}timezoneoffset <utc offset 1> <utc offset 2>\nExample: ${prefix}timezoneoffset 1 -5`);
    reply(`🕐 Time difference: *${Math.abs(tzOff1 - tzOff2)} hour(s)*`);
}
break;

// ===== END NEW BATCH 3 =====

// ===== BATCH 2: ~100 MORE COMMANDS =====

// --- Prexzy-backed tools ---
case 'run': {
    const runMap = { python: '/tools/compilepython', js: '/tools/compilejs', javascript: '/tools/compilejs', c: '/tools/compilec', cpp: '/tools/compilecpp', java: '/tools/compilejava', csharp: '/tools/compilecsharp' };
    const [lang, ...codeParts] = (text || '').split(' ');
    const endpoint = runMap[(lang || '').toLowerCase()];
    const code = codeParts.join(' ');
    if (!endpoint || !code) return reply(`Usage: ${prefix}run <python|js|c|cpp|java|csharp> <code>`);
    await prexzyAskAndReply(reply, { endpoint, params: { code }, label: '💻 Output', showLabel: false, loadingMsg: '⏳ *Running...*' });
}
break;

case 'tocpp': {
    if (!text) return reply(`Usage: ${prefix}tocpp <code>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/tocpp', params: { code: text.trim() }, showLabel: false });
}
break;

case 'tojava': {
    if (!text) return reply(`Usage: ${prefix}tojava <code>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/tojava', params: { code: text.trim() }, showLabel: false });
}
break;

case 'tophp': {
    if (!text) return reply(`Usage: ${prefix}tophp <code>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/tophp', params: { code: text.trim() }, showLabel: false });
}
break;

case 'detectlang': {
    if (!text) return reply(`Usage: ${prefix}detectlang <text>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/detectlanguage', params: { text: text.trim() }, label: '🌐 Detected Language', showLabel: false });
}
break;

case 'geoip': {
    if (!text) return reply(`Usage: ${prefix}geoip <ip address>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/geoip', params: { ip: text.trim() }, label: '🌍 GeoIP', showLabel: false });
}
break;

case 'hostcheck': {
    if (!text) return reply(`Usage: ${prefix}hostcheck <domain>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/hostchecksimple', params: { domain: text.trim() }, label: '🖥️ Host Check', showLabel: false });
}
break;

case 'hostip': {
    if (!text) return reply(`Usage: ${prefix}hostip <domain>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/myip', params: { domain: text.trim() }, label: '🌍 Host IP', showLabel: false });
}
break;

case 'fdroidsearch': {
    if (!text) return reply(`Usage: ${prefix}fdroidsearch <app name>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/fdroidsearch', params: { query: text.trim() }, label: '📦 F-Droid Results', showLabel: false });
}
break;

case 'apphunt': {
    if (!text) return reply(`Usage: ${prefix}apphunt <app name>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/fdroidsearch', params: { query: text.trim() }, label: '📦 App Search', showLabel: false });
}
break;

case 'ytranscript': {
    if (!text) return reply(`Usage: ${prefix}ytranscript <youtube link>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/youtube-transcript', params: { url: text.trim() }, label: '📝 Transcript', showLabel: false, loadingMsg: '⏳ *Fetching transcript...*' });
}
break;

case 'tiktoktranscript': {
    if (!text) return reply(`Usage: ${prefix}tiktoktranscript <tiktok link>`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/tiktoktranscript', params: { url: text.trim() }, label: '📝 Transcript', showLabel: false, loadingMsg: '⏳ *Fetching transcript...*' });
}
break;

// --- Number base converters ---
case 'dec2bin': { const n = parseInt(text); if (isNaN(n)) return reply(`Usage: ${prefix}dec2bin <number>`); reply(`🔢 ${n} in binary = ${n.toString(2)}`); } break;
case 'bin2dec': { if (!/^[01\s]+$/.test(text || '')) return reply(`Usage: ${prefix}bin2dec <binary>`); reply(`🔢 ${text.trim()} in decimal = ${parseInt(text.trim(), 2)}`); } break;
case 'dec2hex': { const n = parseInt(text); if (isNaN(n)) return reply(`Usage: ${prefix}dec2hex <number>`); reply(`🔢 ${n} in hex = ${n.toString(16).toUpperCase()}`); } break;
case 'hex2dec': { if (!text) return reply(`Usage: ${prefix}hex2dec <hex>`); const v = parseInt(text.trim(), 16); if (isNaN(v)) return reply('❌ Invalid hex'); reply(`🔢 ${text.trim()} in decimal = ${v}`); } break;
case 'dec2oct': { const n = parseInt(text); if (isNaN(n)) return reply(`Usage: ${prefix}dec2oct <number>`); reply(`🔢 ${n} in octal = ${n.toString(8)}`); } break;
case 'oct2dec': { if (!text) return reply(`Usage: ${prefix}oct2dec <octal>`); const v = parseInt(text.trim(), 8); if (isNaN(v)) return reply('❌ Invalid octal'); reply(`🔢 ${text.trim()} in decimal = ${v}`); } break;

// --- Math ---
case 'square': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}square <number>`); reply(`🔢 ${n}² = ${n ** 2}`); } break;
case 'cube': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}cube <number>`); reply(`🔢 ${n}³ = ${n ** 3}`); } break;
case 'sqrt': { const n = parseFloat(text); if (isNaN(n) || n < 0) return reply(`Usage: ${prefix}sqrt <non-negative number>`); reply(`🔢 √${n} = ${Math.sqrt(n)}`); } break;
case 'power': { const [b, e] = (text || '').split(' ').map(Number); if (isNaN(b) || isNaN(e)) return reply(`Usage: ${prefix}power <base> <exponent>`); reply(`🔢 ${b}^${e} = ${b ** e}`); } break;
case 'modulo': { const [a, b] = (text || '').split(' ').map(Number); if (isNaN(a) || isNaN(b)) return reply(`Usage: ${prefix}modulo <a> <b>`); reply(`🔢 ${a} % ${b} = ${a % b}`); } break;

// --- Text case/format ---
case 'capitalize': { if (!text) return reply(`Usage: ${prefix}capitalize <text>`); reply(text.charAt(0).toUpperCase() + text.slice(1)); } break;
case 'camelcase': { if (!text) return reply(`Usage: ${prefix}camelcase <text>`); const w = text.trim().split(/\s+/); reply(w[0].toLowerCase() + w.slice(1).map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join('')); } break;
case 'snakecase': { if (!text) return reply(`Usage: ${prefix}snakecase <text>`); reply(text.trim().split(/\s+/).join('_').toLowerCase()); } break;
case 'kebabcase': { if (!text) return reply(`Usage: ${prefix}kebabcase <text>`); reply(text.trim().split(/\s+/).join('-').toLowerCase()); } break;
case 'truncate': { const parts = (text || '').split('|'); const t = (parts[0] || '').trim(); const n = parseInt(parts[1]) || 50; if (!t) return reply(`Usage: ${prefix}truncate <text> | <length>`); reply(t.length > n ? t.slice(0, n) + '...' : t); } break;
case 'padtext': { const [t, n, ch] = (text || '').split('|').map(s => (s || '').trim()); if (!t || !n) return reply(`Usage: ${prefix}padtext <text> | <length> | <char>`); reply(t.padStart((t.length + parseInt(n)) / 2 | 0, ch || ' ').padEnd(parseInt(n), ch || ' ')); } break;
case 'charrepeat': { const [ch, n] = (text || '').split(' '); const count = parseInt(n); if (!ch || isNaN(count) || count > 500) return reply(`Usage: ${prefix}charrepeat <char> <count, max 500>`); reply(ch.repeat(count)); } break;
case 'shuffle': { if (!text) return reply(`Usage: ${prefix}shuffle <text>`); reply(text.split('').sort(() => Math.random() - 0.5).join('')); } break;
case 'textwrap': { const [t, w] = (text || '').split('|').map(s => (s || '').trim()); const width = parseInt(w) || 30; if (!t) return reply(`Usage: ${prefix}textwrap <text> | <width>`); const words = t.split(' '); let lines = [], line = ''; for (const word of words) { if ((line + ' ' + word).trim().length > width) { lines.push(line.trim()); line = word; } else line += ' ' + word; } lines.push(line.trim()); reply(lines.join('\n')); } break;
case 'lorem': { const n = parseInt(text) || 5; const loremWords = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(' '); let out = []; for (let i = 0; i < n; i++) out.push(loremWords[Math.floor(Math.random() * loremWords.length)]); reply(out.join(' ').charAt(0).toUpperCase() + out.join(' ').slice(1) + '.'); } break;
case 'placeholder': { reply('📝 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'); } break;

// --- Line/text tools ---
case 'removeduplicates': { if (!text) return reply(`Usage: ${prefix}removeduplicates <lines>`); reply([...new Set(text.split('\n'))].join('\n')); } break;
case 'sortlines': { if (!text) return reply(`Usage: ${prefix}sortlines <lines>`); reply(text.split('\n').sort().join('\n')); } break;
case 'numberlines': { if (!text) return reply(`Usage: ${prefix}numberlines <lines>`); reply(text.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n')); } break;
case 'countoccurrence': { const [t, w] = (text || '').split('|').map(s => (s || '').trim()); if (!t || !w) return reply(`Usage: ${prefix}countoccurrence <text> | <word>`); const count = (t.match(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length; reply(`🔢 "${w}" appears *${count}* time(s)`); } break;
case 'findreplace': { const [t, find, rep] = (text || '').split('|').map(s => (s || '').trim()); if (!t || !find) return reply(`Usage: ${prefix}findreplace <text> | <find> | <replace>`); reply(t.split(find).join(rep || '')); } break;
case 'extracturls': { if (!text) return reply(`Usage: ${prefix}extracturls <text>`); const urls = text.match(/https?:\/\/[^\s]+/g); reply(urls?.length ? urls.join('\n') : '❌ No URLs found'); } break;
case 'extractemails': { if (!text) return reply(`Usage: ${prefix}extractemails <text>`); const emails = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g); reply(emails?.length ? emails.join('\n') : '❌ No emails found'); } break;
case 'extractnumbers': { if (!text) return reply(`Usage: ${prefix}extractnumbers <text>`); const nums = text.match(/\d+/g); reply(nums?.length ? nums.join(', ') : '❌ No numbers found'); } break;

// --- Validators ---
case 'isemail': { if (!text) return reply(`Usage: ${prefix}isemail <email>`); reply(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim()) ? '✅ Valid email format' : '❌ Invalid email format'); } break;
case 'isurl': { if (!text) return reply(`Usage: ${prefix}isurl <url>`); reply(/^https?:\/\/[^\s]+$/.test(text.trim()) ? '✅ Valid URL format' : '❌ Invalid URL format'); } break;
case 'isphone': { if (!text) return reply(`Usage: ${prefix}isphone <number>`); reply(/^\+?[0-9]{7,15}$/.test(text.trim().replace(/[\s-]/g, '')) ? '✅ Looks like a valid phone number' : '❌ Doesn\'t look like a valid phone number'); } break;
case 'emailvalidate': { if (!text) return reply(`Usage: ${prefix}emailvalidate <email>`); reply(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim()) ? '✅ Valid email format' : '❌ Invalid email format'); } break;

// --- Date/time ---
case 'dayofweek': { if (!text) return reply(`Usage: ${prefix}dayofweek <YYYY-MM-DD>`); const d = new Date(text.trim()); if (isNaN(d)) return reply('❌ Invalid date'); reply(`📅 ${text.trim()} was a *${d.toLocaleDateString('en-US', { weekday: 'long' })}*`); } break;
case 'weeknumber': { const d = text ? new Date(text.trim()) : new Date(); if (isNaN(d)) return reply('❌ Invalid date'); const date = new Date(d.getTime()); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7); const week1 = new Date(date.getFullYear(), 0, 4); const wn = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7); reply(`📅 Week *${wn}* of ${date.getFullYear()}`); } break;
case 'leapyear': { const y = parseInt(text); if (isNaN(y)) return reply(`Usage: ${prefix}leapyear <year>`); const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; reply(isLeap ? `✅ ${y} is a leap year` : `❌ ${y} is not a leap year`); } break;
case 'timezoneconvert': { reply(`🕐 *Current UTC time:* ${new Date().toUTCString()}\n\nFor a specific timezone, tell me the UTC offset and I'll do the math — e.g. "UTC+1".`); } break;

// --- Unit converters ---
case 'km2mi': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}km2mi <km>`); reply(`📏 ${n} km = ${(n * 0.621371).toFixed(3)} miles`); } break;
case 'mi2km': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}mi2km <miles>`); reply(`📏 ${n} miles = ${(n * 1.60934).toFixed(3)} km`); } break;
case 'kg2lb': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}kg2lb <kg>`); reply(`⚖️ ${n} kg = ${(n * 2.20462).toFixed(3)} lb`); } break;
case 'lb2kg': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}lb2kg <lb>`); reply(`⚖️ ${n} lb = ${(n * 0.453592).toFixed(3)} kg`); } break;
case 'cm2inch': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}cm2inch <cm>`); reply(`📏 ${n} cm = ${(n * 0.393701).toFixed(3)} inches`); } break;
case 'inch2cm': { const n = parseFloat(text); if (isNaN(n)) return reply(`Usage: ${prefix}inch2cm <inches>`); reply(`📏 ${n} inches = ${(n * 2.54).toFixed(3)} cm`); } break;
case 'distanceconvert': { const [n, unit] = (text || '').split(' '); const v = parseFloat(n); if (isNaN(v) || !['km', 'mi', 'm', 'ft'].includes((unit || '').toLowerCase())) return reply(`Usage: ${prefix}distanceconvert <value> <km|mi|m|ft>`); const toM = { km: 1000, mi: 1609.34, m: 1, ft: 0.3048 }; const meters = v * toM[unit.toLowerCase()]; reply(`📏 ${v} ${unit} =\n${(meters / 1000).toFixed(3)} km\n${(meters / 1609.34).toFixed(3)} mi\n${meters.toFixed(2)} m\n${(meters / 0.3048).toFixed(2)} ft`); } break;
case 'weightconvert': { const [n, unit] = (text || '').split(' '); const v = parseFloat(n); if (isNaN(v) || !['kg', 'lb', 'g', 'oz'].includes((unit || '').toLowerCase())) return reply(`Usage: ${prefix}weightconvert <value> <kg|lb|g|oz>`); const toKg = { kg: 1, lb: 0.453592, g: 0.001, oz: 0.0283495 }; const kg = v * toKg[unit.toLowerCase()]; reply(`⚖️ ${v} ${unit} =\n${kg.toFixed(3)} kg\n${(kg / 0.453592).toFixed(3)} lb\n${(kg * 1000).toFixed(1)} g\n${(kg / 0.0283495).toFixed(2)} oz`); } break;
case 'speedconvert': { const [n, unit] = (text || '').split(' '); const v = parseFloat(n); if (isNaN(v) || !['kmh', 'mph', 'ms'].includes((unit || '').toLowerCase())) return reply(`Usage: ${prefix}speedconvert <value> <kmh|mph|ms>`); const toKmh = { kmh: 1, mph: 1.60934, ms: 3.6 }; const kmh = v * toKmh[unit.toLowerCase()]; reply(`🏎️ ${v} ${unit} =\n${kmh.toFixed(2)} km/h\n${(kmh / 1.60934).toFixed(2)} mph\n${(kmh / 3.6).toFixed(2)} m/s`); } break;
case 'areaconvert': { const [n, unit] = (text || '').split(' '); const v = parseFloat(n); if (isNaN(v) || !['sqm', 'sqft', 'acre', 'hectare'].includes((unit || '').toLowerCase())) return reply(`Usage: ${prefix}areaconvert <value> <sqm|sqft|acre|hectare>`); const toSqm = { sqm: 1, sqft: 0.092903, acre: 4046.86, hectare: 10000 }; const sqm = v * toSqm[unit.toLowerCase()]; reply(`📐 ${v} ${unit} =\n${sqm.toFixed(2)} m²\n${(sqm / 0.092903).toFixed(2)} ft²\n${(sqm / 4046.86).toFixed(4)} acres\n${(sqm / 10000).toFixed(4)} hectares`); } break;
case 'volumeconvert': { const [n, unit] = (text || '').split(' '); const v = parseFloat(n); if (isNaN(v) || !['l', 'gal', 'ml', 'floz'].includes((unit || '').toLowerCase())) return reply(`Usage: ${prefix}volumeconvert <value> <l|gal|ml|floz>`); const toL = { l: 1, gal: 3.78541, ml: 0.001, floz: 0.0295735 }; const l = v * toL[unit.toLowerCase()]; reply(`🧪 ${v} ${unit} =\n${l.toFixed(3)} L\n${(l / 3.78541).toFixed(3)} gal\n${(l * 1000).toFixed(1)} mL\n${(l / 0.0295735).toFixed(2)} fl oz`); } break;

// --- HTML/JSON/data tools ---
case 'htmlescape': { if (!text) return reply(`Usage: ${prefix}htmlescape <text>`); reply(text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')); } break;
case 'htmlunescape': { if (!text) return reply(`Usage: ${prefix}htmlunescape <html>`); reply(text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')); } break;
case 'jsonvalidate': { if (!text) return reply(`Usage: ${prefix}jsonvalidate <json>`); try { JSON.parse(text); reply('✅ Valid JSON'); } catch (e) { reply(`❌ Invalid JSON: ${e.message}`); } } break;
case 'jsonminify': { if (!text) return reply(`Usage: ${prefix}jsonminify <json>`); try { reply(JSON.stringify(JSON.parse(text))); } catch (e) { reply(`❌ Invalid JSON: ${e.message}`); } } break;
case 'csvtojson': { if (!text) return reply(`Usage: ${prefix}csvtojson <csv text, first row = headers>`); try { const rows = text.trim().split('\n').map(r => r.split(',').map(c => c.trim())); const headers = rows[0]; const result = rows.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]]))); reply('```' + JSON.stringify(result, null, 2) + '```'); } catch (e) { reply(`❌ Error: ${e.message}`); } } break;
case 'xmlvalidate': { if (!text) return reply(`Usage: ${prefix}xmlvalidate <xml>`); const opens = (text.match(/<[a-zA-Z][^/>]*>/g) || []).length; const closes = (text.match(/<\/[a-zA-Z][^>]*>/g) || []).length; reply(opens === closes ? '✅ Tags appear balanced' : `❌ Tag mismatch: ${opens} opening vs ${closes} closing tags`); } break;
case 'regextest': { const [pattern, str] = (text || '').split('|').map(s => (s || '').trim()); if (!pattern || !str) return reply(`Usage: ${prefix}regextest <pattern> | <text>`); try { const match = new RegExp(pattern).test(str); reply(match ? `✅ Match found` : `❌ No match`); } catch (e) { reply(`❌ Invalid regex: ${e.message}`); } } break;
case 'maskdata': { if (!text) return reply(`Usage: ${prefix}maskdata <text>`); reply(text.length <= 4 ? '*'.repeat(text.length) : text.slice(0, 2) + '*'.repeat(text.length - 4) + text.slice(-2)); } break;
case 'maskcard': { if (!text) return reply(`Usage: ${prefix}maskcard <card number>`); const digits = text.replace(/\D/g, ''); if (digits.length < 4) return reply('❌ Too short'); reply('*'.repeat(digits.length - 4) + digits.slice(-4)); } break;
case 'creditcardmask': { if (!text) return reply(`Usage: ${prefix}creditcardmask <card number>`); const digits = text.replace(/\D/g, ''); if (digits.length < 4) return reply('❌ Too short'); reply('**** **** **** ' + digits.slice(-4)); } break;
case 'phoneformat': { if (!text) return reply(`Usage: ${prefix}phoneformat <number>`); const digits = text.replace(/\D/g, ''); reply(digits.length === 10 ? `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}` : digits.length === 11 ? `+${digits[0]} (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}` : `❌ Expected 10-11 digits, got ${digits.length}`); } break;

// --- Color ---
case 'colorhex': { if (!text) return reply(`Usage: ${prefix}colorhex <r> <g> <b>`); const [r, g, b] = text.split(' ').map(Number); if ([r, g, b].some(n => isNaN(n) || n < 0 || n > 255)) return reply('❌ RGB values must be 0-255'); reply(`🎨 #${[r, g, b].map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`); } break;
case 'colorname': { if (!/^#?[0-9a-fA-F]{6}$/.test((text || '').trim())) return reply(`Usage: ${prefix}colorname <hex e.g. #FF5733>`); const hex = text.trim().replace('#', ''); const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16); reply(`🎨 #${hex.toUpperCase()} = RGB(${r}, ${g}, ${b})`); } break;
case 'colorcontrast': { if (!/^#?[0-9a-fA-F]{6}$/.test((text || '').trim())) return reply(`Usage: ${prefix}colorcontrast <hex>`); const hex = text.trim().replace('#', ''); const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16); const brightness = (r * 299 + g * 587 + b * 114) / 1000; reply(`🎨 Best text color on #${hex.toUpperCase()}: *${brightness > 128 ? 'Black' : 'White'}*`); } break;

// --- Random generators ---
case 'randomword': { const wordBank = ['serendipity', 'ephemeral', 'luminous', 'wanderlust', 'mosaic', 'velvet', 'horizon', 'echo', 'zenith', 'cascade', 'gravity', 'whisper', 'aurora', 'nebula', 'quartz']; reply(`🎲 ${wordBank[Math.floor(Math.random() * wordBank.length)]}`); } break;
case 'randomdate': { const start = new Date(2000, 0, 1); const end = new Date(); const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); reply(`📅 ${d.toDateString()}`); } break;
case 'uniqueid': { reply(`🆔 ${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`); } break;
case 'strongpassword': { const len = parseInt(text) || 16; const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'; let pass = ''; for (let i = 0; i < Math.min(len, 128); i++) pass += chars[Math.floor(Math.random() * chars.length)]; reply(`🔐 ${pass}`); } break;
case 'passwordstrength': { if (!text) return reply(`Usage: ${prefix}passwordstrength <password>`); let score = 0; if (text.length >= 8) score++; if (text.length >= 12) score++; if (/[A-Z]/.test(text)) score++; if (/[a-z]/.test(text)) score++; if (/[0-9]/.test(text)) score++; if (/[^A-Za-z0-9]/.test(text)) score++; const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent']; reply(`🔐 Strength: *${labels[score]}* (${score}/6)`); } break;

// --- Name/word generators ---
case 'businessname': { const prefixes = ['Prime', 'Elite', 'Swift', 'Bright', 'Nova', 'Peak', 'Core', 'Vivid', 'Nexus', 'Apex']; const suffixes = ['Solutions', 'Ventures', 'Hub', 'Labs', 'Group', 'Works', 'Studio', 'Collective']; reply(`💼 ${prefixes[Math.floor(Math.random()*prefixes.length)]} ${suffixes[Math.floor(Math.random()*suffixes.length)]}`); } break;
case 'usernamegen': { const adjectives = ['Silent', 'Fierce', 'Golden', 'Shadow', 'Crimson', 'Frost', 'Wild', 'Mystic']; const nouns = ['Wolf', 'Phoenix', 'Tiger', 'Falcon', 'Storm', 'Blade', 'Raven', 'Fox']; reply(`👤 ${adjectives[Math.floor(Math.random()*adjectives.length)]}${nouns[Math.floor(Math.random()*nouns.length)]}${Math.floor(Math.random()*999)}`); } break;
case 'namegenerator': { const first = ['James', 'Amara', 'Kofi', 'Zara', 'Chidi', 'Layla', 'Kwame', 'Amina']; const last = ['Okafor', 'Bello', 'Adeyemi', 'Nwosu', 'Balogun', 'Eze']; reply(`👤 ${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`); } break;

// --- Fun/social prompts (all local, no external content) ---
case 'wouldurather': { const prompts = ['Would you rather have unlimited money or unlimited time?', 'Would you rather be able to fly or be invisible?', 'Would you rather live without music or without TV?', 'Would you rather always be 10 minutes late or 20 minutes early?', 'Would you rather explore space or the ocean?']; reply(`🤔 ${prompts[Math.floor(Math.random()*prompts.length)]}`); } break;
case 'neverhaveiever': { const prompts = ['Never have I ever pretended to be sick to skip something.', 'Never have I ever forgotten someone\'s name right after meeting them.', 'Never have I ever laughed at the wrong moment.', 'Never have I ever sent a text to the wrong person.', 'Never have I ever fallen asleep during a movie.']; reply(`🙊 ${prompts[Math.floor(Math.random()*prompts.length)]}`); } break;
case 'truthquestion': { const prompts = ['What\'s the most embarrassing thing that\'s happened to you?', 'What\'s a secret talent you have?', 'What\'s the weirdest food combo you enjoy?', 'What\'s something you\'re irrationally afraid of?']; reply(`💭 ${prompts[Math.floor(Math.random()*prompts.length)]}`); } break;
case 'darequestion': { const prompts = ['Send a voice note singing your favorite song.', 'Text your last contact "I found the treasure."', 'Do 10 push-ups right now.', 'Speak in an accent for the next 3 messages.']; reply(`🎯 ${prompts[Math.floor(Math.random()*prompts.length)]}`); } break;
case 'icebreaker': { const prompts = ['If you could have dinner with anyone, dead or alive, who would it be?', 'What\'s a hobby you\'ve always wanted to try?', 'What\'s your go-to karaoke song?', 'Beach vacation or mountain retreat?']; reply(`🧊 ${prompts[Math.floor(Math.random()*prompts.length)]}`); } break;
case 'debate': { const prompts = ['Is a hot dog a sandwich?', 'Pineapple on pizza: yes or no?', 'Is water wet?', 'Cereal: soup or not?']; reply(`⚖️ ${prompts[Math.floor(Math.random()*prompts.length)]}`); } break;
case 'storyprompt': { const prompts = ['Write about a door that only appears at midnight.', 'A stranger hands you a key with no explanation.', 'You wake up with a skill you never had yesterday.', 'The last person on Earth hears a knock at the door.']; reply(`📖 ${prompts[Math.floor(Math.random()*prompts.length)]}`); } break;
case 'motivatequote': { const quotes = ['Small steps every day lead to big results.', 'You don\'t have to be great to start, but you have to start to be great.', 'Discipline beats motivation when motivation runs out.', 'Progress, not perfection.']; reply(`💪 ${quotes[Math.floor(Math.random()*quotes.length)]}`); } break;
case 'apology': { const lines = ['I\'m really sorry for what happened — that wasn\'t fair to you.', 'I owe you an apology. I should have handled that better.', 'My bad, genuinely. I\'ll do better.']; reply(`🙏 ${lines[Math.floor(Math.random()*lines.length)]}`); } break;
case 'excusegen': { const lines = ['My phone died right when I was about to reply, I swear.', 'I was in a place with zero network, sorry o.', 'Something urgent came up out of nowhere.']; reply(`😅 ${lines[Math.floor(Math.random()*lines.length)]}`); } break;
case 'pickline': { const lines = ['Are you a magician? Because whenever I look at you, everyone else disappears.', 'Do you have a map? I keep getting lost in your eyes.', 'Is your name Google? Because you have everything I\'ve been searching for.']; reply(`😏 ${lines[Math.floor(Math.random()*lines.length)]}`); } break;
case 'compliment2': { const lines = ['Your energy genuinely lights up the room.', 'You have a way of making people feel heard.', 'Your creativity never stops impressing me.']; reply(`✨ ${lines[Math.floor(Math.random()*lines.length)]}`); } break;
case 'insultgen': { const lines = ['You have the wit of a rock and half the charm.', 'I\'d agree with you but then we\'d both be wrong.', 'You\'re proof that even evolution takes a day off sometimes.']; reply(`😹 ${lines[Math.floor(Math.random()*lines.length)]} _(all in good fun)_`); } break;
case 'riddlegen': { const riddles = [['I speak without a mouth and hear without ears. What am I?', 'An echo'], ['The more you take, the more you leave behind. What am I?', 'Footsteps'], ['What has keys but no locks?', 'A piano']]; const [q, a] = riddles[Math.floor(Math.random()*riddles.length)]; reply(`🧩 ${q}\n\n_Reply .riddlegen again for a new one, or think it through!_\n||Answer: ${a}||`); } break;
case 'funfact2': { const facts = ['Honey never spoils — archaeologists have found 3000-year-old honey that\'s still edible.', 'Bananas are berries, but strawberries aren\'t.', 'Octopuses have three hearts.', 'A day on Venus is longer than a year on Venus.']; reply(`🧠 ${facts[Math.floor(Math.random()*facts.length)]}`); } break;

// --- Games (local logic) ---
case 'diceroll': { const n = Math.min(parseInt(text) || 1, 10); const rolls = Array.from({length: n}, () => Math.floor(Math.random() * 6) + 1); reply(`🎲 ${rolls.join(', ')}${n > 1 ? ` (total: ${rolls.reduce((a,b)=>a+b,0)})` : ''}`); } break;
case 'cardpicker': { const suits = ['♠️', '♥️', '♦️', '♣️']; const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; reply(`🃏 ${ranks[Math.floor(Math.random()*ranks.length)]}${suits[Math.floor(Math.random()*suits.length)]}`); } break;
case 'coinspin': { reply(`🪙 ${Math.random() < 0.5 ? 'Heads' : 'Tails'}`); } break;
case 'magicball': { const answers = ['It is certain.', 'Without a doubt.', 'Yes, definitely.', 'Ask again later.', 'Cannot predict now.', 'Don\'t count on it.', 'My sources say no.', 'Outlook not so good.']; reply(`🎱 ${answers[Math.floor(Math.random()*answers.length)]}`); } break;

// ===== END BATCH 2 =====

// ===== KICK MEMBER =====
case 'kick': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const kickMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const kickUser = kickMentioned[0] || m.quoted?.sender || text;
    if (!kickUser) return reply('✘ Reply to or mention a member');
    const kickJid = toParticipantJid(kickUser);
    if (!kickJid) return reply('✘ Could not resolve that member');
    try {
        await devtrust.groupParticipantsUpdate(m.chat, [kickJid], 'remove');
        reply(`✓ @${kickJid.split('@')[0]} kicked`, [kickJid]);
    } catch (e) { reply('✘ ' + explainGroupActionError(e)); }
}
break;

// ===== PROMOTE =====
case 'promote': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const proMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const proUser = proMentioned[0] || m.quoted?.sender || text;
    if (!proUser) return reply('✘ Reply to or mention a member');
    const proJid = toParticipantJid(proUser);
    if (!proJid) return reply('✘ Could not resolve that member');
    try {
        await devtrust.groupParticipantsUpdate(m.chat, [proJid], 'promote');
        reply(`✓ @${proJid.split('@')[0]} promoted to admin`, [proJid]);
    } catch (e) { reply('✘ ' + explainGroupActionError(e)); }
}
break;

// ===== DEMOTE =====
case 'demote': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const demMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const demUser = demMentioned[0] || m.quoted?.sender || text;
    if (!demUser) return reply('✘ Reply to or mention an admin');
    const demJid = toParticipantJid(demUser);
    if (!demJid) return reply('✘ Could not resolve that member');
    try {
        await devtrust.groupParticipantsUpdate(m.chat, [demJid], 'demote');
        reply(`✓ @${demJid.split('@')[0]} demoted`, [demJid]);
    } catch (e) { reply('✘ ' + explainGroupActionError(e)); }
}
break;

// ===== SET GROUP ICON (group.js) =====
case 'seticon': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const iconMsg = m.quoted ? m.quoted : m;
    if (!/image/.test(iconMsg.mtype || '')) return reply(`✘ Reply to an image with ${prefix}seticon`);
    try {
        const iconBuffer = await downloadMediaMessage(iconMsg, 'buffer', {});
        const groupCmds = __cmd_group;
        await groupCmds.setGroupIcon(devtrust, m.chat, iconBuffer);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== SET MEMBER ROLE (group.js) =====
case 'setrole': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const roleMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const roleTarget = roleMentioned[0] || m.quoted?.sender;
    const roleName = text.replace(/@\d+/g, '').trim();
    if (!roleTarget || !roleName) return reply(`Example: ${prefix}setrole @user Moderator`);
    const groupCmds = __cmd_group;
    await groupCmds.setMemberRole(devtrust, m.chat, roleTarget, roleName);
}
break;

// ===== GIFT MEMBER (group.js) =====
// Renamed from 'gift' — that name is claimed by the economy .gift above
// (though note: that one depends on a legendaryEconomy module that
// doesn't actually exist in this codebase right now, see chat).
case 'giftmsg': {
    if (!m.isGroup) return reply('✘ Groups only');
    const giftMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const giftTarget = giftMentioned[0] || m.quoted?.sender;
    const giftMsg = text.replace(/@\d+/g, '').trim() || 'You\'re appreciated! 🎉';
    if (!giftTarget) return reply(`Example: ${prefix}giftmsg @user Congrats on the promotion!`);
    const groupCmds = __cmd_group;
    await groupCmds.sendGift(devtrust, m.chat, giftTarget, giftMsg);
}
break;

// ===== SCHEDULE EVENT (group.js) =====
case 'event': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!text || !text.includes('|')) return reply(`Example: ${prefix}event 25-12-2026 18:00 | Christmas Party`);
    const [eventWhen, ...eventTitleParts] = text.split('|');
    const eventTitle = eventTitleParts.join('|').trim();
    const [eventDatePart, eventTimePart] = eventWhen.trim().split(' ');
    const [eDay, eMonth, eYear] = (eventDatePart || '').split('-');
    if (!eDay || !eMonth || !eYear || !eventTitle) return reply(`Example: ${prefix}event 25-12-2026 18:00 | Christmas Party`);
    const eventIso = `${eYear}-${eMonth}-${eDay}T${eventTimePart || '00:00'}:00`;
    if (isNaN(new Date(eventIso).getTime())) return reply('✘ Invalid date/time format');
    const groupCmds = __cmd_group;
    await groupCmds.scheduleEvent(devtrust, m.chat, eventIso, eventTitle);
}
break;

// ===== EMERGENCY ALERT (group.js) =====
case 'alert': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!text) return reply(`Example: ${prefix}alert Fire drill happening now, evacuate calmly`);
    const groupCmds = __cmd_group;
    await groupCmds.sendEmergencyAlert(devtrust, m.chat, text);
}
break;

// ===== SET GROUP THEME (group.js) =====
case 'settheme': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!text) return reply(`Example: ${prefix}settheme 🔥`);
    const groupCmds = __cmd_group;
    await groupCmds.setGroupTheme(devtrust, m.chat, text.trim());
}
break;

// ===== SET BIRTHDAY (group.js) =====
case 'setbirthday': {
    if (!m.isGroup) return reply('✘ Groups only');
    const bdayMatch = text?.match(/^(\d{2})-(\d{2})$/);
    if (!bdayMatch) return reply(`Example: ${prefix}setbirthday 25-12`);
    const groupCmds = __cmd_group;
    await groupCmds.setBirthday(devtrust, m.chat, m.sender, text.trim());
}
break;

// ===== NOTIFICATION SETTINGS TOGGLE (group.js + Settings.js) =====
case 'notify': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!['on', 'off'].includes((text || '').trim().toLowerCase())) return reply(`Example: ${prefix}notify on  or  ${prefix}notify off`);
    const groupCmds = __cmd_group;
    groupCmds.setBotSetting(m.chat, 'welcome', text.trim().toLowerCase() === 'on');
    reply(`🔔 Welcome/goodbye messages turned ${text.trim().toLowerCase() === 'on' ? 'ON' : 'OFF'}`);
}
break;

// ===== DIRECT SHORTCUTS (football.js) =====
// These functions were fully built and already reachable via `.menu
// football`'s numbered picker, but had no direct typed-command shortcut —
// adding the most commonly-wanted ones so people don't have to navigate
// the menu just to check a table or fixture list.
case 'highlights': {
    const footballCmds = __cmd_football;
    await footballCmds.matchHighlights(devtrust, m.chat, text ? text.trim() : '');
}
break;

// ===== TEAM INFO (football.js) =====
case 'teaminfo': {
    if (!text) return reply(`Example: ${prefix}teaminfo Manchester United`);
    const footballCmds = __cmd_football;
    await footballCmds.getTeamInfo(devtrust, m.chat, text.trim());
}
break;

// ===== ANTI-FEATURE TOGGLES (group.js — text-command path) =====
// These were previously only reachable via the Settings menu button; typing
// e.g. ".antiforward on" silently did nothing because no case existed for it.
case 'antiforward':
case 'antipoll':
case 'antisticker':
case 'antiviewonce':
case 'anticaps':
case 'antilongmsg':
case 'automod':
case 'approvalmode': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const toggleArg = (text || '').trim().toLowerCase();
    if (!['on', 'off'].includes(toggleArg)) return reply(`Example: ${prefix}${command} on  or  ${prefix}${command} off`);
    const groupCmds = __cmd_group;
    if (command === 'approvalmode') {
        await groupCmds.setApprovalMode(devtrust, m.chat, toggleArg === 'on');
    } else {
        await groupCmds.toggleSetting(devtrust, m.chat, command, toggleArg === 'on');
    }
}
break;

// ===== MUTE GROUP =====
case 'invite':
case 'glink': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        const glinkCode = await devtrust.groupInviteCode(m.chat);
        reply(`🔗 https://chat.whatsapp.com/${glinkCode}`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== REVOKE LINK =====
case 'revoke': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        await devtrust.groupRevokeInvite(m.chat);
        const revokeNewCode = await devtrust.groupInviteCode(m.chat);
        reply(`✓ Link revoked\nNew: https://chat.whatsapp.com/${revokeNewCode}`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== TAG ALL =====
case 'tagall':
case 'tag': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const tagAllJids = participants.map(p => p.jid || p.id);
    const tagAdminJids = participants.filter(p => p.admin != null).map(p => p.jid || p.id);
    if (text === 'admins') {
        const tagAdminMsg = tagAdminJids.map((j, i) => `${i+1}. @${j.split('@')[0]}`).join('\n');
        return reply(`*🛡️ Admins*\n\n${tagAdminMsg}`, tagAdminJids);
    }
    const tagMsg = (text ? `📢 ${text}\n\n` : '📢 Attention everyone!\n\n') + tagAllJids.map((j, i) => `${i+1}. @${j.split('@')[0]}`).join('\n');
    reply(tagMsg, tagAllJids);
}
break;

// ===== LOCK / UNLOCK SETTINGS =====
case 'del':
case 'delete': {
    if (!m.quoted) return reply('✘ Reply to a message to delete it');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        const delKey = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id || m.quoted.key?.id || m.quoted.fakeObj?.key?.id,
            participant: m.quoted.sender || m.quoted.key?.participant || m.quoted.fakeObj?.key?.participant
        };
        await devtrust.sendMessage(m.chat, { delete: delKey });
        reply('✅ Message deleted');
    } catch (e) { reply('✘ Could not delete: ' + e.message); }
}
break;

// ===== GROUP INFO =====
    default:
      return false;
  }
  return true;
};
