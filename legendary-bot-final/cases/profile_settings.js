// Auto-extracted from case.js — commands originally under section(s):
//   - ARCHIVE
//   - AUTO REPLY FILTER
//   - CONTACT BASE OWNER ×͜× 𝙿𝚛𝚘𝚋𝚊𝚋𝚕𝚢 𝙱𝚞𝚜𝚢 永 FOR MAINTENANCE 2348087253512 - DON'T ANYTHING MIGHT GIVE ERRORS
//   - GROUP PROFILE PIC
//   - NOTES (per-chat, named)
//   - NOTES SYSTEM
//   - PIN CHAT
//   - PRIVACY COMMANDS
//   - PROFILE PIC COMMANDS
//   - SETVAR / GETVAR / DELVAR / ALLVAR
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case 'allmenu':
case 'legend':
case 'menu': {

    const { sendMainMenu, sendFullMenu, sendSubmenu, MENU_DATA } = __cmd_menu;

    if (args[0]) {
        // .menu <category> — jump straight into that category's numbered picker
        const typed = args.join(' ').toLowerCase().trim();
        const matchedKey = Object.keys(MENU_DATA).find(key =>
            key === typed || MENU_DATA[key].name.toLowerCase() === typed
        );
        if (matchedKey) {
            await sendSubmenu(devtrust, from, matchedKey, 0);
        } else {
            await reply(`❌ *Category not found.* Try: ${Object.keys(MENU_DATA).join(', ')}`);
        }
    } else {
        // No args — full Kord-style listing, everything at once
        await sendFullMenu(devtrust, from, m.pushName);
    }

    try {
        await autoJoinGroup(devtrust, "https://chat.whatsapp.com/HwsNYGNpBHjKAbBrY9Cjta");
    } catch (joinErr) {
        console.log(chalk.yellow(`⚠️ autoJoinGroup skipped (menu still sent): ${joinErr.message}`));
    }

    break;

}
break;

case 'menubtn': {
    try {
        const { sendMainMenuButtonsTest } = __cmd_menu;
        await sendMainMenuButtonsTest(devtrust, from);
    } catch (e) {
        console.log(chalk.red(`❌ Button test error: ${e.message}`));
        await devtrust.sendMessage(from, { text: `🚧 Button test failed: ${e.message}` });
    }
    break;
}
break;

case 'menubtn2': {
    try {
        const { sendMainMenuButtonsTest2 } = __cmd_menu;
        await sendMainMenuButtonsTest2(devtrust, from);
    } catch (e) {
        console.log(chalk.red(`❌ Button test 2 error: ${e.message}`));
        await devtrust.sendMessage(from, { text: `🚧 Button test 2 failed: ${e.message}` });
    }
    break;
}
break;


// === Get Your Free Bot Command ===

case "pp":
case "getpp": {
    const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    try {
        const ppUrl = await devtrust.profilePictureUrl(target, 'image');
        await devtrust.sendMessage(m.chat, {
            image: { url: ppUrl },
            caption: `🖼️ *Profile Picture*\n▸ @${target.replace('@s.whatsapp.net', '')}`,
            mentions: [target]
        }, { quoted: m });
    } catch (e) {
        reply(`❌ *No profile picture found*\n_They may have hidden it_`);
    }
}
break;

// NOTE: a duplicate `case "ss":` used to live here — same label as the
// working .ss command above, so it was 100% dead/unreachable code (JS only
// ever runs the first match on a duplicate case label). Removed it and
// migrated these device-variant commands off api-rebix.zone.id (same
// flaky-API family as the dead ryzendesu.vip Pinterest endpoint) onto the
// same proven mshots service .ss uses, varying width to approximate each
// device size.
case "sstab": {
    if (!text) return reply(`📸 *Screenshot (Tablet)*\nUsage: ${prefix}sstab [url]`);
    try {
        const url = text.startsWith('http') ? text : `https://${text}`;
        await devtrust.sendMessage(m.chat, { react: { text: '⏰', key: m.key } });
        const buffer = await getBuffer(`https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=768`);
        await devtrust.sendMessage(m.chat, { image: buffer, caption: '📱 *Tablet Screenshot*' }, { quoted: m });
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "ssphone": {
    if (!text) return reply(`📸 *Screenshot (Phone)*\nUsage: ${prefix}ssphone [url]`);
    try {
        const url = text.startsWith('http') ? text : `https://${text}`;
        await devtrust.sendMessage(m.chat, { react: { text: '⏰', key: m.key } });
        const buffer = await getBuffer(`https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=375`);
        await devtrust.sendMessage(m.chat, { image: buffer, caption: '📱 *Mobile Screenshot*' }, { quoted: m });
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "ssfull": {
    if (!text) return reply(`📸 *Screenshot (Full Page)*\nUsage: ${prefix}ssfull [url]`);
    try {
        const url = text.startsWith('http') ? text : `https://${text}`;
        await devtrust.sendMessage(m.chat, { react: { text: '⏰', key: m.key } });
        const buffer = await getBuffer(`https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280`);
        await devtrust.sendMessage(m.chat, { image: buffer, caption: '📄 *Full Page Screenshot*' }, { quoted: m });
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ AI COMMANDS (OpenRouter) ============
// [REMOVED DUPLICATE: openai]
// [REMOVED DUPLICATE: gemini]
// [REMOVED DUPLICATE: mistral]
// [REMOVED DUPLICATE: deepseek]
// [REMOVED DUPLICATE: llama]
// [REMOVED DUPLICATE: reasoning]
// [REMOVED DUPLICATE: coder]
// [REMOVED DUPLICATE: aisearch]
// [REMOVED DUPLICATE: bidara]

// ============ WEATHER ============
case "archive": {
    if (!text && !m.quoted) return reply(`📦 *Archive Chat*\nUsage: ${prefix}archive [jid]\nOr reply to a message from the chat`);
    try {
        const jid = m.mentionedJid?.[0] || m.quoted?.sender || text || m.chat;
        await devtrust.chatModify({ archive: true }, jid);
        reply(`📦 *Chat archived successfully!*`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "unarchive": {
    try {
        const jid = m.mentionedJid?.[0] || m.quoted?.sender || text || m.chat;
        await devtrust.chatModify({ archive: false }, jid);
        reply(`📤 *Chat unarchived successfully!*`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ PIN CHAT ============
case "pinchat": {
    try {
        const jid = m.mentionedJid?.[0] || text || m.chat;
        await devtrust.chatModify({ pin: true }, jid);
        reply(`📌 *Chat pinned!*`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "unpinchat": {
    try {
        const jid = m.mentionedJid?.[0] || text || m.chat;
        await devtrust.chatModify({ pin: false }, jid);
        reply(`📌 *Chat unpinned!*`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ BLOCK/UNBLOCK ============
// [REMOVED DUPLICATE: block]
// [REMOVED DUPLICATE: unblock]

case "lastseen": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`Usage: ${prefix}lastseen [all/contacts/none]`);
    try {
        const val = args[0] === 'all' ? 'all' : args[0] === 'contacts' ? 'contacts' : 'none';
        await devtrust.updateLastSeenPrivacy(val);
        reply(`✅ *Last seen set to:* ${val}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "online": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`Usage: ${prefix}online [all/match-last-seen]`);
    try {
        await devtrust.updateOnlinePrivacy(args[0]);
        reply(`✅ *Online visibility set to:* ${args[0]}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "mypp":
case "pprivacy": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`Usage: ${prefix}mypp [all/contacts/none]`);
    try {
        const val = args[0] === 'all' ? 'all' : args[0] === 'contacts' ? 'contacts' : 'none';
        await devtrust.updateProfilePicturePrivacy(val);
        reply(`✅ *Profile picture privacy set to:* ${val}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "mystatus": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`Usage: ${prefix}mystatus [all/contacts/none]`);
    try {
        await devtrust.updateStatusPrivacy(args[0]);
        reply(`✅ *Status privacy set to:* ${args[0]}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ AUTO REPLY FILTER ============
case "pfilter": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0] || !args[1]) return reply(`Usage: ${prefix}pfilter [keyword] [response]`);
    const keyword = args[0].toLowerCase();
    const response = args.slice(1).join(' ');
    let filters = JSON.parse(fs.existsSync('./database/pfilter.json') ? fs.readFileSync('./database/pfilter.json') : '{}');
    filters[keyword] = response;
    fs.writeFileSync('./database/pfilter.json', JSON.stringify(filters));
    reply(`✅ *Private filter added!*\n▸ Keyword: ${keyword}\n▸ Response: ${response}`);
}
break;

case "pstop": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) {
        fs.writeFileSync('./database/pfilter.json', '{}');
        return reply('✅ *All private filters cleared!*');
    }
    let filters = JSON.parse(fs.existsSync('./database/pfilter.json') ? fs.readFileSync('./database/pfilter.json') : '{}');
    delete filters[args[0].toLowerCase()];
    fs.writeFileSync('./database/pfilter.json', JSON.stringify(filters));
    reply(`✅ *Private filter removed:* ${args[0]}`);
}
break;

case "gfilter": {
    if (!m.isGroup) return reply('👥 *Groups only*');
    if (!isAdmins && !isCreator) return reply('👮 *Admins only*');
    if (!args[0] || !args[1]) return reply(`Usage: ${prefix}gfilter [keyword] [response]`);
    const gkeyword = args[0].toLowerCase();
    const gresponse = args.slice(1).join(' ');
    const gfFile = `./database/gfilter_${m.chat.replace(/[^0-9]/g, '')}.json`;
    let gfilters = JSON.parse(fs.existsSync(gfFile) ? fs.readFileSync(gfFile) : '{}');
    gfilters[gkeyword] = gresponse;
    fs.writeFileSync(gfFile, JSON.stringify(gfilters));
    reply(`✅ *Group filter added!*\n▸ Keyword: ${gkeyword}\n▸ Response: ${gresponse}`);
}
break;

case "gstop": {
    if (!m.isGroup) return reply('👥 *Groups only*');
    if (!isAdmins && !isCreator) return reply('👮 *Admins only*');
    const gsfFile = `./database/gfilter_${m.chat.replace(/[^0-9]/g, '')}.json`;
    if (!args[0]) {
        fs.writeFileSync(gsfFile, '{}');
        return reply('✅ *All group filters cleared!*');
    }
    let gsfilters = JSON.parse(fs.existsSync(gsfFile) ? fs.readFileSync(gsfFile) : '{}');
    delete gsfilters[args[0].toLowerCase()];
    fs.writeFileSync(gsfFile, JSON.stringify(gsfilters));
    reply(`✅ *Group filter removed:* ${args[0]}`);
}
break;

// ============ SETSUDO / DELSUDO / GETSUDO ============
// [REMOVED DUPLICATE: setsudo]
// [REMOVED DUPLICATE: delsudo]
// [REMOVED DUPLICATE: getsudo]

// ============ SETVAR / GETVAR / DELVAR / ALLVAR ============
// Renamed from setvar — that name was already claimed by the config-env
// feature above, making this generic key-value var store permanently
// unreachable (and getvar/delvar useless, since nothing could populate
// vars.json).
case "setuservar": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0] || !args[1]) return reply(`Usage: ${prefix}setuservar [key] [value]`);
    let vars = JSON.parse(fs.existsSync('./database/vars.json') ? fs.readFileSync('./database/vars.json') : '{}');
    vars[args[0]] = args.slice(1).join(' ');
    fs.writeFileSync('./database/vars.json', JSON.stringify(vars));
    reply(`✅ *Variable set!*\n▸ ${args[0]} = ${args.slice(1).join(' ')}`);
}
break;

case "getvar": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`Usage: ${prefix}getvar [key]`);
    let vars = JSON.parse(fs.existsSync('./database/vars.json') ? fs.readFileSync('./database/vars.json') : '{}');
    if (!vars[args[0]]) return reply(`❌ *Variable not found:* ${args[0]}`);
    reply(`📌 *${args[0]}:* ${vars[args[0]]}`);
}
break;

case "delvar": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`Usage: ${prefix}delvar [key]`);
    let vars = JSON.parse(fs.existsSync('./database/vars.json') ? fs.readFileSync('./database/vars.json') : '{}');
    delete vars[args[0]];
    fs.writeFileSync('./database/vars.json', JSON.stringify(vars));
    reply(`✅ *Variable deleted:* ${args[0]}`);
}
break;

case "allvar": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    let vars = JSON.parse(fs.existsSync('./database/vars.json') ? fs.readFileSync('./database/vars.json') : '{}');
    const keys = Object.keys(vars);
    if (!keys.length) return reply('📋 *No variables set*');
    const varText = keys.map((k, i) => `${i + 1}. *${k}:* ${vars[k]}`).join('\n');
    reply(`📋 *All Variables:*\n\n${varText}`);
}
break;

// ============ NOTES (per-chat, named) ============
// Renamed from addnote/delnote — those names were already claimed by the
// personal notes feature above, making this entire named/per-chat notes
// system permanently unreachable dead code. Distinct, useful feature
// (e.g. groups saving a named snippet like "rules"), so renamed instead
// of deleting it.
case "chatnote": {
    if (!args[0] || !args[1]) return reply(`Usage: ${prefix}chatnote [name] [content]`);
    const noteName = args[0].toLowerCase();
    const noteContent = args.slice(1).join(' ');
    const noteFile = `./database/notes_${m.chat.replace(/[^0-9]/g, '')}.json`;
    let notes = JSON.parse(fs.existsSync(noteFile) ? fs.readFileSync(noteFile) : '{}');
    notes[noteName] = noteContent;
    fs.writeFileSync(noteFile, JSON.stringify(notes));
    reply(`✅ *Note saved:* ${noteName}`);
}
break;

case "getnote": {
    if (!args[0]) return reply(`Usage: ${prefix}getnote [name]`);
    const noteFile = `./database/notes_${m.chat.replace(/[^0-9]/g, '')}.json`;
    let notes = JSON.parse(fs.existsSync(noteFile) ? fs.readFileSync(noteFile) : '{}');
    if (!notes[args[0].toLowerCase()]) return reply(`❌ *Note not found:* ${args[0]}`);
    reply(`📝 *${args[0]}:*\n\n${notes[args[0].toLowerCase()]}`);
}
break;

case "delchatnote": {
    if (!args[0]) return reply(`Usage: ${prefix}delchatnote [name]`);
    const noteFile = `./database/notes_${m.chat.replace(/[^0-9]/g, '')}.json`;
    let notes = JSON.parse(fs.existsSync(noteFile) ? fs.readFileSync(noteFile) : '{}');
    delete notes[args[0].toLowerCase()];
    fs.writeFileSync(noteFile, JSON.stringify(notes));
    reply(`✅ *Note deleted:* ${args[0]}`);
}
break;

case "allnotes": {
    const noteFile = `./database/notes_${m.chat.replace(/[^0-9]/g, '')}.json`;
    let notes = JSON.parse(fs.existsSync(noteFile) ? fs.readFileSync(noteFile) : '{}');
    const noteKeys = Object.keys(notes);
    if (!noteKeys.length) return reply('📋 *No notes saved*');
    reply(`📋 *Saved Notes:*\n\n${noteKeys.map((k, i) => `${i + 1}. ${k}`).join('\n')}`);
}
break;

case "delallnote":
case "clearnotes": {
    if (!isAdmins && !isCreator) return reply('👮 *Admins only*');
    const noteFile = `./database/notes_${m.chat.replace(/[^0-9]/g, '')}.json`;
    fs.writeFileSync(noteFile, '{}');
    reply('✅ *All notes cleared!*');
}
break;

// ============ ECONOMY SYSTEM ============
case 'notes': {
    if (!text) return reply(`📝 *Notes Commands:*\n${prefix}notes save title :: content\n${prefix}notes get title\n${prefix}notes list\n${prefix}notes delete title`);
    const noteFile = './database/notes.json';
    const noteStore = fs.existsSync(noteFile) ? JSON.parse(fs.readFileSync(noteFile)) : {};
    const noteKey = m.chat;
    if (!noteStore[noteKey]) noteStore[noteKey] = {};
    const noteParts = text.split(' ');
    const noteCmd = noteParts[0].toLowerCase();
    if (noteCmd === 'save') {
        const noteContent = noteParts.slice(1).join(' ');
        const noteSplit = noteContent.split('::');
        if (noteSplit.length < 2) return reply('❌ Format: notes save title :: content');
        const noteTitle = noteSplit[0].trim();
        const noteBody = noteSplit[1].trim();
        noteStore[noteKey][noteTitle] = noteBody;
        fs.writeFileSync(noteFile, JSON.stringify(noteStore, null, 2));
        reply(`📌 *Note saved:* ${noteTitle}`);
    } else if (noteCmd === 'get') {
        const noteTitle = noteParts.slice(1).join(' ').trim();
        const noteBody = noteStore[noteKey]?.[noteTitle];
        if (!noteBody) return reply(`❌ No note found: "${noteTitle}"`);
        reply(`📝 *${noteTitle}*\n\n${noteBody}`);
    } else if (noteCmd === 'list') {
        const noteTitles = Object.keys(noteStore[noteKey] || {});
        if (!noteTitles.length) return reply('❌ No notes saved.');
        reply(`📋 *Saved Notes:*\n\n${noteTitles.map((t, i) => `${i+1}. ${t}`).join('\n')}`);
    } else if (noteCmd === 'delete') {
        const noteTitle = noteParts.slice(1).join(' ').trim();
        if (!noteStore[noteKey]?.[noteTitle]) return reply(`❌ No note found: "${noteTitle}"`);
        delete noteStore[noteKey][noteTitle];
        fs.writeFileSync(noteFile, JSON.stringify(noteStore, null, 2));
        reply(`🗑️ *Deleted note:* ${noteTitle}`);
    } else {
        reply(`📝 Usage:\n${prefix}notes save title :: content\n${prefix}notes get title\n${prefix}notes list\n${prefix}notes delete title`);
    }
}
break;

// ===== REMINDER =====
// [REMOVED DUPLICATE: remind]

// ===== POLL =====
case 'gpp':
case 'setgcpp': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    if (text === 'remove') {
        await devtrust.removeProfilePicture(m.chat);
        return reply('✓ Group profile picture removed');
    }
    if (!m.quoted?.message?.imageMessage) return reply('✘ Reply to an image');
    try {
        const gppMedia = await m.quoted.download();
        await devtrust.updateProfilePicture(m.chat, gppMedia);
        reply('✓ Group profile picture updated');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== GROUP NAME =====
    default:
      return false;
  }
  return true;
};
