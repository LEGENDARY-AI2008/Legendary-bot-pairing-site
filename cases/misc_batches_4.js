// Auto-extracted from case.js — commands originally under section(s):
//   - ADD MEMBER
//   - FACTORIAL
//   - FIBONACCI
//   - GROUP DESCRIPTION
//   - GROUP NAME
//   - HAUSA
//   - JOIN GROUP
//   - LEAVE GROUP
//   - MENTAL HEALTH
//   - NEW BATCH 3: 80 more commands, pure JS, tested logic
//   - PERCENTAGE
//   - PRIME CHECK
//   - WATER REMINDER
//   - WORKOUT
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case 'hausa': {
    const hausa = ['Ina kwana — Good morning 🌅','Ina wuni — Good afternoon ☀️','Na gode — Thank you 🙏','Sannu — Hello 😊','Lafiya lau — I\'m fine','Allah ya kiyaye — God protect you 🙏'];
    reply(`🌍 *Hausa:*\n\n_${hausa[Math.floor(Math.random() * hausa.length)]}_`);
}
break;

// ===== NAIRA CONVERT =====
// [REMOVED DUPLICATE: naira]

// lyrics handled above

// ===== PERCENTAGE =====
case 'percent': {
    if (!text) return reply(`Usage: ${prefix}percent 45 200\n(What is 45% of 200?)`);
    const percentParts = text.trim().split(/\s+/);
    if (percentParts.length < 2) return reply('❌ Need 2 numbers. Example: 45 200');
    const pct = parseFloat(percentParts[0]);
    const total = parseFloat(percentParts[1]);
    if (isNaN(pct) || isNaN(total)) return reply('❌ Invalid numbers');
    reply(`📊 *${pct}% of ${total} = ${(pct / 100 * total).toFixed(2)}*`);
}
break;

// ===== FIBONACCI =====
case 'fib': {
    const fibN = Math.min(parseInt(text) || 10, 20);
    if (isNaN(fibN) || fibN < 1) return reply('❌ Enter a number (1–20)');
    const fibSeq = [0, 1];
    for (let i = 2; i < fibN; i++) fibSeq.push(fibSeq[i-1] + fibSeq[i-2]);
    reply(`🔢 *Fibonacci (${fibN} terms):*\n\n${fibSeq.slice(0, fibN).join(', ')}`);
}
break;

// ===== WORKOUT =====
case 'workout': {
    const workouts = ['💪 *Today:*\n• 20 Push-ups x3\n• 30 Squats x3\n• 1 min Plank x3\n\n🔥 _No gym needed!_','🏃 *Cardio Day:*\n• 20 min jog\n• 50 jumping jacks\n• 20 burpees\n\n💦 _Sweat it out!_','🦵 *Leg Day:*\n• 40 Squats x3\n• 20 Lunges each leg\n• 30 Calf raises x3\n\n🔥 _Leg day is respect!_'];
    reply(workouts[Math.floor(Math.random() * workouts.length)]);
}
break;

// ===== WATER REMINDER =====
case 'water': {
    reply(`💧 *Water Reminder*\n\nDrink at least *8 glasses (2L)* daily!\n\n• 1 glass when you wake up 🌅\n• 1 glass before each meal 🍽️\n• 1 glass before bed 🌙\n\n_Hydration = better mood, focus & energy!_ ✨`);
}
break;

// ===== MENTAL HEALTH =====
case 'mental': {
    const mentalTips = ['🧠 *Tip:* Take 5 deep breaths now. In (4 counts), hold (4), out (4). Repeat.','💙 *Reminder:* It\'s okay to say NO. Protecting your peace is not selfish.','🌟 *Affirmation:* You are enough. You are worthy. Keep going. 💪','😴 *Sleep:* Adults need 7–9 hours. Put the phone down and rest! 🌙','🤝 *Connection:* Call someone you care about today. 📞'];
    reply(mentalTips[Math.floor(Math.random() * mentalTips.length)]);
}
break;

// ===== COUNTDOWN =====
// [REMOVED DUPLICATE: countdown]

// repeat handled above

// ===== PRIME CHECK =====
case 'isprime': {
    if (!text) return reply(`Usage: ${prefix}isprime 17`);
    const primeN = parseInt(text);
    if (isNaN(primeN) || primeN < 1) return reply('❌ Enter a positive integer');
    if (primeN < 2) return reply(`*${primeN}* is ❌ NOT prime`);
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(primeN); i++) { if (primeN % i === 0) { isPrime = false; break; } }
    reply(`*${primeN}* is ${isPrime ? '✅ a PRIME number! 🔢' : '❌ NOT a prime number'}`);
}
break;

// ===== FACTORIAL =====
case 'factorial': {
    if (!text) return reply(`Usage: ${prefix}factorial 5`);
    const factN = parseInt(text);
    if (isNaN(factN) || factN < 0 || factN > 20) return reply('❌ Enter 0–20');
    let factResult = 1;
    for (let i = 2; i <= factN; i++) factResult *= i;
    reply(`🔢 *${factN}! = ${factResult}*`);
}
break;

// ===== NPM =====
// [REMOVED DUPLICATE: npm]

// ============================================================
// =================== GROUP COMMANDS (FIXED) =================
// ============================================================

// ===== JOIN GROUP =====
case 'join': {
    if (!isCreator) return reply('❌ Owner only');
    const joinLinks = (text || '').match(/https?:\/\/[^\s]+/gi) || [];
    if (!joinLinks.length) return reply('✘ Provide a WhatsApp group link');
    const joinCode = joinLinks[0]?.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i)?.[1];
    if (!joinCode) return reply('✘ Invalid invite link');
    try {
        await devtrust.groupAcceptInvite(joinCode);
        reply('✓ Joined successfully!');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== LEAVE GROUP =====
case 'leave':
case 'left': {
    if (!isCreator) return reply('❌ Owner only');
    if (!m.isGroup) return reply('✘ Groups only');
    await devtrust.groupLeave(m.chat);
}
break;

// ===== GROUP PROFILE PIC =====
case 'gname':
case 'setgcname': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!text) return reply(`✘ Provide a name\nExample: ${prefix}gname New Name`);
    try {
        await devtrust.groupUpdateSubject(m.chat, text);
        reply('✓ Group name updated');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== GROUP DESCRIPTION =====
case 'gdesc':
case 'setgcdesc': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!text) return reply(`✘ Provide a description\nExample: ${prefix}gdesc Group rules...`);
    try {
        await devtrust.groupUpdateDescription(m.chat, text);
        reply('✓ Group description updated');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== ADD MEMBER =====
case 'add': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const addMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const addUser = addMentioned[0] || m.quoted?.sender || text;
    if (!addUser) return reply(`✘ Reply to user or provide number\nExample: ${prefix}add 2341234567890`);
    const addJid = toParticipantJid(addUser);
    if (!addJid) return reply('✘ Could not resolve that member');
    try {
        const addResult = await devtrust.groupParticipantsUpdate(m.chat, [addJid], 'add');
        const addStatus = addResult[0]?.status;
        if (addStatus === '200') return reply(`✓ @${addJid.split('@')[0]} Added`, [addJid]);
        if (addStatus === '403') {
            await reply('✘ Cannot add directly, sending invite...');
            const addCode = await devtrust.groupInviteCode(m.chat);
            return await devtrust.sendMessage(addJid, { text: `https://chat.whatsapp.com/${addCode}` });
        }
        if (addStatus === '409') return reply('✘ User already in group');
        if (addStatus === '401') return reply('✘ Bot is blocked by this user');
        reply('✘ Could not add: status ' + addStatus);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== NEW GROUP COMMANDS BATCH =====
case 'pascalcase': {
    if (!text) return reply(`Usage: ${prefix}pascalcase <text>`);
    reply(text.trim().split(/\s+/).map(w => w[0].toUpperCase()+w.slice(1).toLowerCase()).join(''));
}
break;

case 'sentencecase': {
    if (!text) return reply(`Usage: ${prefix}sentencecase <text>`);
    const lower = text.trim().toLowerCase();
    reply(lower.charAt(0).toUpperCase() + lower.slice(1));
}
break;

case 'base32encode': {
    if (!text) return reply(`Usage: ${prefix}base32encode <text>`);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '', out = '';
    for (const c of Buffer.from(text, 'utf8')) bits += c.toString(2).padStart(8, '0');
    for (let i = 0; i < bits.length; i += 5) {
        const chunk = bits.slice(i, i + 5).padEnd(5, '0');
        out += alphabet[parseInt(chunk, 2)];
    }
    reply(out);
}
break;

case 'base32decode': {
    if (!text) return reply(`Usage: ${prefix}base32decode <base32 text>`);
    try {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        for (const c of text.toUpperCase().replace(/=+$/, '')) bits += alphabet.indexOf(c).toString(2).padStart(5, '0');
        const bytes = [];
        for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
        reply(Buffer.from(bytes).toString('utf8'));
    } catch (e) { reply('❌ *Invalid base32*'); }
}
break;

case 'rot47': {
    if (!text) return reply(`Usage: ${prefix}rot47 <text>`);
    reply(text.replace(/[!-~]/g, c => String.fromCharCode(33 + (c.charCodeAt(0) + 14) % 94)));
}
break;

case 'vigenere': {
    const [vkey, ...vparts] = (text || '').split(' ');
    const vtext = vparts.join(' ');
    if (!vkey || !vtext) return reply(`Usage: ${prefix}vigenere <key> <text>`);
    const key = vkey.toLowerCase();
    let ki = 0, out = '';
    for (const c of vtext) {
        if (/[a-zA-Z]/.test(c)) {
            const base = c === c.toUpperCase() ? 65 : 97;
            const shift = key.charCodeAt(ki % key.length) - 97;
            out += String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
            ki++;
        } else out += c;
    }
    reply(`🔐 *Vigenère Encrypted*\n\n${out}`);
}
break;

case 'unvigenere': {
    const [uvkey, ...uvparts] = (text || '').split(' ');
    const uvtext = uvparts.join(' ');
    if (!uvkey || !uvtext) return reply(`Usage: ${prefix}unvigenere <key> <text>`);
    const key = uvkey.toLowerCase();
    let ki = 0, out = '';
    for (const c of uvtext) {
        if (/[a-zA-Z]/.test(c)) {
            const base = c === c.toUpperCase() ? 65 : 97;
            const shift = key.charCodeAt(ki % key.length) - 97;
            out += String.fromCharCode((c.charCodeAt(0) - base - shift + 26) % 26 + base);
            ki++;
        } else out += c;
    }
    reply(`🔓 *Decrypted*\n\n${out}`);
}
break;

case 'duplicatewords': {
    if (!text) return reply(`Usage: ${prefix}duplicatewords <text>`);
    const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const seen = {}, dupes = new Set();
    words.forEach(w => { seen[w] = (seen[w] || 0) + 1; if (seen[w] > 1) dupes.add(w); });
    reply(dupes.size ? `🔁 Duplicate words: ${[...dupes].join(', ')}` : '✅ No duplicate words found');
}
break;

case 'sortwords': {
    if (!text) return reply(`Usage: ${prefix}sortwords <text>`);
    reply(text.trim().split(/\s+/).sort((a, b) => a.localeCompare(b)).join(' '));
}
break;

case 'shufflewords': {
    if (!text) return reply(`Usage: ${prefix}shufflewords <text>`);
    const arr = text.trim().split(/\s+/);
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    reply(arr.join(' '));
}
break;

case 'emojiremove': {
    if (!text) return reply(`Usage: ${prefix}emojiremove <text>`);
    const stripped = text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
    reply(stripped || '(nothing left)');
}
break;

case 'emojicount': {
    if (!text) return reply(`Usage: ${prefix}emojicount <text>`);
    const matches = text.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu) || [];
    reply(`😀 Emoji count: *${matches.length}*`);
}
break;

case 'linkextract': {
    if (!text) return reply(`Usage: ${prefix}linkextract <text>`);
    const links = text.match(/https?:\/\/[^\s]+/gi) || [];
    reply(links.length ? links.join('\n') : '❌ No links found');
}
break;

case 'hashtagextract': {
    if (!text) return reply(`Usage: ${prefix}hashtagextract <text>`);
    const tags = text.match(/#\w+/g) || [];
    reply(tags.length ? tags.join(' ') : '❌ No hashtags found');
}
break;

case 'duplicatelines': {
    if (!text) return reply(`Usage: ${prefix}duplicatelines <line1>\\n<line2>...`);
    const lines = text.split('\n');
    const seen = {}, dupes = new Set();
    lines.forEach(l => { seen[l] = (seen[l] || 0) + 1; if (seen[l] > 1) dupes.add(l); });
    reply(dupes.size ? `🔁 Duplicate lines:\n${[...dupes].join('\n')}` : '✅ No duplicate lines');
}
break;

case 'wordwrap': {
    const [wrapWidthStr, ...wrapParts] = (text || '').split(' ');
    const wrapWidth = parseInt(wrapWidthStr);
    const wrapText = wrapParts.join(' ');
    if (isNaN(wrapWidth) || !wrapText) return reply(`Usage: ${prefix}wordwrap <width> <text>`);
    const words = wrapText.split(' ');
    let lines = [], cur = '';
    for (const w of words) {
        if ((cur + ' ' + w).trim().length > wrapWidth) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w;
    }
    if (cur.trim()) lines.push(cur.trim());
    reply(lines.join('\n'));
}
break;

case 'numbertowords': {
    const nw = parseInt(text);
    if (isNaN(nw) || nw < 0 || nw > 999999999) return reply(`Usage: ${prefix}numbertowords <number> (0 - 999,999,999)`);
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    function threeDigits(n) {
        let s = '';
        if (n >= 100) { s += ones[Math.floor(n / 100)] + ' hundred '; n %= 100; }
        if (n >= 20) { s += tens[Math.floor(n / 10)] + ' '; n %= 10; }
        if (n > 0) s += ones[n] + ' ';
        return s.trim();
    }
    function convert(n) {
        if (n === 0) return 'zero';
        let parts = [];
        if (n >= 1000000) { parts.push(threeDigits(Math.floor(n / 1000000)) + ' million'); n %= 1000000; }
        if (n >= 1000) { parts.push(threeDigits(Math.floor(n / 1000)) + ' thousand'); n %= 1000; }
        if (n > 0) parts.push(threeDigits(n));
        return parts.join(' ');
    }
    reply(`🔢 ${convert(nw)}`);
}
break;

case 'romanconvert': {
    const rn = parseInt(text);
    if (isNaN(rn) || rn <= 0 || rn > 3999) return reply(`Usage: ${prefix}romanconvert <number> (1-3999)`);
    const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let num = rn, res = '';
    for (const [v, s] of vals) { while (num >= v) { res += s; num -= v; } }
    reply(`🏛️ ${res}`);
}
break;

case 'fromroman': {
    if (!text) return reply(`Usage: ${prefix}fromroman <roman numeral>`);
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    const rs = text.toUpperCase().trim();
    if (!/^[IVXLCDM]+$/.test(rs)) return reply('❌ *Invalid roman numeral*');
    let res = 0;
    for (let i = 0; i < rs.length; i++) {
        const cur = map[rs[i]], next = map[rs[i + 1]];
        if (next && cur < next) res -= cur; else res += cur;
    }
    reply(`🔢 ${res}`);
}
break;

case 'basen': {
    const [baseNumStr, baseTargetStr] = (text || '').split(' ');
    const baseNum = parseInt(baseNumStr);
    const baseTarget = parseInt(baseTargetStr);
    if (isNaN(baseNum) || isNaN(baseTarget) || baseTarget < 2 || baseTarget > 36) return reply(`Usage: ${prefix}basen <decimal number> <target base 2-36>`);
    reply(`🔢 ${baseNum} in base ${baseTarget} = ${baseNum.toString(baseTarget)}`);
}
break;

case 'frombase': {
    const [fbVal, fbBaseStr] = (text || '').split(' ');
    const fbBase = parseInt(fbBaseStr);
    if (!fbVal || isNaN(fbBase) || fbBase < 2 || fbBase > 36) return reply(`Usage: ${prefix}frombase <value> <source base 2-36>`);
    const result = parseInt(fbVal, fbBase);
    if (isNaN(result)) return reply('❌ *Invalid value for that base*');
    reply(`🔢 ${fbVal} (base ${fbBase}) = ${result} (decimal)`);
}
break;

case 'isarmstrong': {
    const an = parseInt(text);
    if (isNaN(an) || an < 0) return reply(`Usage: ${prefix}isarmstrong <number>`);
    const s = String(an), p = s.length;
    const sum = s.split('').reduce((a, d) => a + Math.pow(+d, p), 0);
    reply(sum === an ? `✅ ${an} is an Armstrong number` : `❌ ${an} is not an Armstrong number`);
}
break;

case 'isperfect': {
    const pn = parseInt(text);
    if (isNaN(pn) || pn < 1 || pn > 1000000) return reply(`Usage: ${prefix}isperfect <number> (max 1,000,000)`);
    let s = 0;
    for (let i = 1; i < pn; i++) if (pn % i === 0) s += i;
    reply(s === pn ? `✅ ${pn} is a perfect number` : `❌ ${pn} is not a perfect number`);
}
break;

case 'digitsum': {
    const ds = text?.replace(/\D/g, '');
    if (!ds) return reply(`Usage: ${prefix}digitsum <number>`);
    const sum = ds.split('').reduce((a, d) => a + parseInt(d), 0);
    reply(`🔢 Digit sum of ${ds} = ${sum}`);
}
break;

case 'digitalroot': {
    let dr = parseInt(text?.replace(/\D/g, ''));
    if (isNaN(dr)) return reply(`Usage: ${prefix}digitalroot <number>`);
    while (dr >= 10) dr = String(dr).split('').reduce((a, d) => a + parseInt(d), 0);
    reply(`🔢 Digital root = ${dr}`);
}
break;

case 'collatz': {
    let cn = parseInt(text);
    if (isNaN(cn) || cn < 1 || cn > 1000000000) return reply(`Usage: ${prefix}collatz <positive number>`);
    const seq = [cn]; let steps = 0;
    while (cn !== 1 && steps < 10000) { cn = cn % 2 === 0 ? cn / 2 : 3 * cn + 1; seq.push(cn); steps++; }
    reply(`🔢 Collatz sequence took *${steps}* steps to reach 1${seq.length <= 30 ? `\n\n${seq.join(' → ')}` : ''}`);
}
break;

case 'quadratic': {
    const [qa, qb, qc] = (text || '').split(' ').map(Number);
    if ([qa, qb, qc].some(isNaN) || qa === 0) return reply(`Usage: ${prefix}quadratic <a> <b> <c>  (for ax² + bx + c = 0)`);
    const disc = qb * qb - 4 * qa * qc;
    if (disc < 0) {
        const real = (-qb / (2 * qa)).toFixed(3), imag = (Math.sqrt(-disc) / (2 * qa)).toFixed(3);
        reply(`🔢 Complex roots:\nx = ${real} + ${imag}i\nx = ${real} - ${imag}i`);
    } else {
        const x1 = ((-qb + Math.sqrt(disc)) / (2 * qa)).toFixed(3);
        const x2 = ((-qb - Math.sqrt(disc)) / (2 * qa)).toFixed(3);
        reply(`🔢 x = ${x1}\nx = ${x2}`);
    }
}
break;

case 'primefactors': {
    let pfn = parseInt(text);
    if (isNaN(pfn) || pfn < 2 || pfn > 1000000000) return reply(`Usage: ${prefix}primefactors <number>`);
    const factors = []; let d = 2;
    while (pfn > 1) { while (pfn % d === 0) { factors.push(d); pfn /= d; } d++; if (d * d > pfn && pfn > 1) { factors.push(pfn); break; } }
    reply(`🔢 Prime factors: ${factors.join(' × ')}`);
}
break;

case 'digitreverse': {
    const drn = text?.replace(/\D/g, '');
    if (!drn) return reply(`Usage: ${prefix}digitreverse <number>`);
    reply(`🔢 ${drn.split('').reverse().join('')}`);
}
break;

case 'sqrtcalc': {
    const sqn = parseFloat(text);
    if (isNaN(sqn) || sqn < 0) return reply(`Usage: ${prefix}sqrtcalc <non-negative number>`);
    reply(`🔢 √${sqn} = ${Math.sqrt(sqn)}`);
}
break;

case 'powcalc': {
    const [pbase, pexp] = (text || '').split(' ').map(Number);
    if (isNaN(pbase) || isNaN(pexp)) return reply(`Usage: ${prefix}powcalc <base> <exponent>`);
    reply(`🔢 ${pbase}^${pexp} = ${Math.pow(pbase, pexp)}`);
}
break;

case 'logcalc': {
    const [lgnum, lgbase] = (text || '').split(' ').map(Number);
    if (isNaN(lgnum) || lgnum <= 0) return reply(`Usage: ${prefix}logcalc <number> [base] (default base 10)`);
    const base = lgbase || 10;
    reply(`🔢 log_${base}(${lgnum}) = ${(Math.log(lgnum) / Math.log(base)).toFixed(6)}`);
}
break;

    default:
      return false;
  }
  return true;
};
