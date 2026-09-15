// Auto-extracted from case.js — commands originally under section(s):
//   - NEW: Prexzy Style Text (34 styles) — one dispatcher
//   - NEW: Prexzy Text Maker (30 graphic text-effect generators)
//   - NEW: Prexzy Virtual Number
//   - NEW: Prexzy-only AI features not previously in this bot
//   - NEW: Prexzy-only search endpoints not previously in this bot
//   - PREXZY API — URL SHORTENER
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case "cuaca": {
    if (!text) return reply(`🌦️ *Weather*\nUsage: ${prefix}cuaca <city>`);
    await prexzyAskAndReply(reply, { endpoint: '/search/cuaca', params: { kota: text.trim() }, label: `🌦️ Weather: ${text.trim()}`, showLabel: false });
}
break;

case "imdb": {
    if (!text) return reply(`🎬 *IMDb Search*\nUsage: ${prefix}imdb <movie/series name>`);
    try {
        const data = await prexzyGet('/search/imdb', { query: text.trim() });
        const result = data?.result || data;
        if (data?.status === false || !result) return reply('❌ *No results found.*');
        reply(`🎬 *${result.title || text.trim()}*\n${result.year ? `📅 ${result.year}\n` : ''}${result.rating ? `⭐ ${result.rating}\n` : ''}${result.plot || result.description || ''}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "nik": {
    if (!text) return reply(`🪪 *NIK Parse*\nUsage: ${prefix}nik <NIK number>`);
    await prexzyAskAndReply(reply, { endpoint: '/search/nik', params: { q: text.trim() }, label: '🪪 NIK Info', showLabel: false });
}
break;

case "songfinder": {
    if (!text) return reply(`🎧 *Song Finder*\nUsage: ${prefix}songfinder <youtube/video url>`);
    await prexzyAskAndReply(reply, { endpoint: '/search/songfinder', params: { url: text.trim() }, label: '🎧 Song Finder', showLabel: false });
}
break;
break;

// ============ MADRIN API — TOOLS ============
case "style": {
    const parts = (text || '').trim().split(/\s+/);
    const styleName = (parts.shift() || '').toLowerCase();
    const styleText = parts.join(' ');
    if (!styleName || !styleText) return reply(`✨ *Style Text*\nUsage: ${prefix}style <style> <text>\n\nStyles: ${STYLE_TEXT_LIST.join(', ')}`);
    if (!STYLE_TEXT_LIST.includes(styleName)) return reply(`❌ *Unknown style.* See ${prefix}style for the list.`);
    await prexzyAskAndReply(reply, { endpoint: `/tools/${styleName}`, params: { text: styleText }, showLabel: false });
}
break;

// ===== NEW: Prexzy Text Maker (30 graphic text-effect generators) =====
case "textfx": {
    const parts = (text || '').trim().split(/\s+/);
    const fx = (parts.shift() || '').toLowerCase();
    const fxText = parts.join(' ');
    const endpoint = TEXTFX_MAP[fx];
    if (!endpoint || !fxText) return reply(`🎨 *Text Effect*\nUsage: ${prefix}textfx <effect> <text>\n\nEffects: ${Object.keys(TEXTFX_MAP).join(', ')}`);
    await prexzyDownloadAndSend(m, reply, { endpoint: `/${endpoint}`, params: { text: fxText }, label: `🎨 ${fx}`, mediaType: 'image' });
}
break;

// ===== NEW: Prexzy AI Image Creator (17 art styles) =====
case "virtualnum": {
    reply(`📱 *Virtual Number*\nThis service issues temporary phone numbers for SMS/OTP verification. It's a paid, account-based feature on Prexzy (not a plain GET endpoint), so it hasn't been wired up here — set it up directly with Prexzy if you need it.`);
}
break;

case 'yts': 
case 'ytsearch': {
    if (!isCreator) return reply(`🔒 *Owner only*`);
    if (!text) return reply(`🔍 *Example:* ${prefix + command} anime music`);
    
    let yts = require("yt-search");
    let search = await yts(text);
    
    let teks = `📺 *YouTube Search*\n\n"${text}"\n\n`;
    let no = 1;
    
    for (let i of search.all.slice(0,5)) {
        teks += `${no++}. *${i.title}*\n⏱️ ${i.timestamp} | 👀 ${i.views}\n🔗 ${i.url}\n\n`;
    }
    
    await devtrust.sendMessage(m.chat, 
        addNewsletterContext({
            image: { url: search.all[0].thumbnail },
            caption: teks
        }), 
        { quoted: m }
    );
}
break;

case 'animewlp': {
    if (!isCreator) return reply(`🔒 *Owner only*`);
    
    try {
        const waifudd = await axios.get(`https://nekos.life/api/v2/img/wallpaper`);
        await devtrust.sendMessage(m.chat, 
            addNewsletterContext({
                image: { url: waifudd.data.url },
                caption: "🖼️ *Anime Wallpaper*"
            }), 
            { quoted: m }
        );
    } catch (err) {
        reply('❌ *Error fetching wallpaper*');
    }
}
break;

case 'resetlink': {
    if (!isAdmins && !isCreator) return reply("🔒 *Admins only*");
    if (!m.isGroup) return reply("👥 *Groups only*");
    
    await devtrust.groupRevokeInvite(m.chat);
    reply("✅ *Group link reset*");
}
break;

case 'animedl': {
    if (!isCreator) return reply(`🔒 *Owner only*`);
    if (!q.includes("|")) {
        return reply("📌 *Format:* animedl Anime Name | Episode");
    }

    try {
        const [animeName, episode] = q.split("|").map(x => x.trim());
        const apiUrl = `https://draculazxy-xyzdrac.hf.space/api/Animedl?q=${encodeURIComponent(animeName)}&ep=${encodeURIComponent(episode)}`;

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        
        const { data } = await axios.get(apiUrl, {
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        if (data.STATUS !== 200 || !data.download_link) {
            return reply("❌ *Episode not found*");
        }

        const { anime, episode: epNumber, download_link } = data;

        reply(`🎥 *${anime}* Ep ${epNumber}\n⏳ Downloading...`);

        await devtrust.sendMessage(m.chat, {
            document: { url: download_link },
            mimetype: "video/mp4",
            fileName: `${anime} - Episode ${epNumber}.mp4`
        }, { quoted: m });

    } catch (error) {
        console.error("❌ Anime Downloader Error:", error.message);
        reply("⚠️ *Server Error* • Try again later");
    }
}
break;

case 'animesearch': {
    if (!isCreator) return reply(`🔒 *Owner only*`);
    if (!text) return reply(`🔍 *Which anime?*`);
    
    const malScraper = require('mal-scraper');
    const anime = await malScraper.getInfoFromName(text).catch(() => null);
    
    if (!anime) return reply(`❌ *Anime not found*`);
    
    let animetxt = `🎀 *${anime.title}*\n` +
        `🎋 Type: ${anime.type}\n` +
        `📈 Status: ${anime.status}\n` +
        `💮 Genres: ${anime.genres}\n` +
        `🌟 Score: ${anime.score}\n` +
        `💫 Popularity: ${anime.popularity}\n\n` +
        `📝 ${anime.synopsis.substring(0, 300)}...`;
    
    await devtrust.sendMessage(m.chat,
        addNewsletterContext({
            image: { url: anime.picture },
            caption: animetxt
        }),
        { quoted: m }
    );
}
break;

case 'ai': {
    if (!text) return reply('🤖 *Example:* ai Who is Mark Zuckerberg?');

    await devtrust.sendPresenceUpdate('composing', m.chat);

    try {
        const answer = await askOpenAI(text);
        reply(`🤖 *AI*\n\n${answer}`);

    } catch (e) {
        reply(`❌ *AI error* • ${e.response?.data?.error?.message || e.message}`);
    }
}
break;

case 'idch': {
    if (!isCreator) return reply("🔒 *Owner only*");
    if (!text) return reply("🔗 *Example:* link channel");
    if (!text.includes("https://whatsapp.com/channel/")) 
        return reply("❌ *Invalid channel link*");
    
    let result = text.split('https://whatsapp.com/channel/')[1];
    let res = await devtrust.newsletterMetadata("invite", result);
    
    let teks = `📢 *Channel Info*\n\n` +
        `🆔 ID: ${res.id}\n` +
        `👤 Name: ${res.name}\n` +
        `👥 Followers: ${res.subscribers}\n` +
        `✔️ Verified: ${res.verification == "VERIFIED" ? "Yes" : "No"}`;
    
    return reply(teks);
}
break;

case 'closetime': {
    if (!isAdmins && !isCreator) return reply("🔒 *Admins only*");

    let unit = args[1];
    let value = Number(args[0]);
    if (!value) return reply("*Usage:* closetime 10 minute");

    let timer = unit === 'second' ? value * 1000 :
                unit === 'minute' ? value * 60000 :
                unit === 'hour' ? value * 3600000 :
                unit === 'day' ? value * 86400000 : null;
    
    if (!timer) return reply('*Choose:* second, minute, hour, day');

    reply(`⏳ *Closing in ${value} ${unit}*`);

    setTimeout(async () => {
        try {
            await devtrust.groupSettingUpdate(m.chat, 'announcement');
            reply(`🔒 *Group closed* • Only admins can message`);
        } catch (e) {
            reply('❌ Failed: ' + e.message);
        }
    }, timer);
}
break;

case 'opentime': {
    if (!isAdmins && !isCreator) return reply("🔒 *Admins only*");

    let unit = args[1];
    let value = Number(args[0]);
    if (!value) return reply('*Usage:* opentime 5 second');

    let timer = unit === 'second' ? value * 1000 :
                unit === 'minute' ? value * 60000 :
                unit === 'hour' ? value * 3600000 :
                unit === 'day' ? value * 86400000 : null;
    
    if (!timer) return reply('*Choose:* second, minute, hour, day');

    reply(`⏳ *Opening in ${value} ${unit}*`);

    setTimeout(async () => {
        try {
            await devtrust.groupSettingUpdate(m.chat, 'not_announcement');
            reply(`🔓 *Group opened* • Everyone can message`);
        } catch (e) {
            reply('❌ Failed: ' + e.message);
        }
    }, timer);
}
break;

// [REMOVED DUPLICATE: listonline]

case 'quote': {
    try {
        const res = await fetch('https://zenquotes.io/api/random');
        const json = await res.json();
        const quote = json[0].q;
        const author = json[0].a;
        
        const quoteImg = `https://dummyimage.com/600x400/000/fff.png&text=${encodeURIComponent(`"${quote}"\n\n- ${author}`)}`;
        
        await devtrust.sendMessage(m.chat,
            addNewsletterContext({
                image: { url: quoteImg },
                caption: `_"${quote}"_\n— *${author}*`
            }),
            { quoted: m }
        );
    } catch (err) {
        reply('❌ *Quote failed*');
    }
}
break;

case 'joke': {
    try {
        let res = await fetch('https://v2.jokeapi.dev/joke/Any?type=single'); 
        let data = await res.json();
        
        await devtrust.sendMessage(m.chat,
            addNewsletterContext({
                image: { url: 'https://files.catbox.moe/1ntiwc.jpg' },
                caption: `😂 *Joke*\n\n${data.joke}`
            }),
            { quoted: m }
        );
    } catch (err) {
        reply('❌ *Joke failed*');
    }
}
break;

case 'truth': {
    try {
        let res = await fetch('https://api.truthordarebot.xyz/v1/truth');
        let data = await res.json();
        
        await devtrust.sendMessage(m.chat,
            addNewsletterContext({
                image: { url: 'https://files.catbox.moe/1ntiwc.jpg' },
                caption: `😳 *Truth*\n\n❖ ${data.question}`
            }),
            { quoted: m }
        );
    } catch (err) {
        reply('❌ *Truth failed*');
    }
}
break;

case 'dare': {
    try {
        let res = await fetch('https://api.truthordarebot.xyz/v1/dare');
        let data = await res.json();
        
        await devtrust.sendMessage(m.chat,
            addNewsletterContext({
                image: { url: 'https://files.catbox.moe/1ntiwc.jpg' },
                caption: `😈 *Dare*\n\n❖ ${data.question}`
            }),
            { quoted: m }
        );
    } catch (err) {
        reply('❌ *Dare failed*');
    }
}
break;

case 'jid': {
    reply(from);
}
break;
// [REMOVED DUPLICATE: bass]
// [REMOVED DUPLICATE: tts]

// ============ ANIME COMMANDS ============
// [REMOVED DUPLICATE: animesearch]

case "dream": {
    if (!text) return reply(`💭 *Dream Interpreter*\nUsage: ${prefix}dream [describe your dream]`);
    await prexzyAskAndReply(reply, { endpoint: '/ai/dream', params: { dream: text.trim() }, label: '💭 Dream Interpretation', loadingMsg: '💭 *Interpreting your dream...*' });
}
break;

case "story": {
    if (!text) return reply(`📖 *AI Story*\nUsage: ${prefix}story [idea]\nExample: ${prefix}story A dragon protecting a magical crystal`);
    await prexzyAskAndReply(reply, { endpoint: '/ai/quick', params: { text: text.trim() }, label: '📖 AI Story', loadingMsg: '📖 *Writing your story...*' });
}
break;

case "convertcode": {
    const [target, ...codeParts] = (text || '').split('|').map(s => s.trim());
    if (!target || !codeParts.length) return reply(`🔄 *Convert Code*\nUsage: ${prefix}convertcode target_language | code`);
    await prexzyAskAndReply(reply, { endpoint: '/ai/convertcode', params: { code: codeParts.join('|'), target }, label: '🔄 Converted Code', loadingMsg: '🔄 *Converting...*' });
}
break;

case "detectbugs": {
    if (!text) return reply(`🐛 *Detect Bugs*\nUsage: ${prefix}detectbugs [code]`);
    await prexzyAskAndReply(reply, { endpoint: '/ai/detectbugs', params: { code: text.trim() }, label: '🐛 Bug Report', loadingMsg: '🐛 *Scanning code...*' });
}
break;

case "explaincode": {
    if (!text) return reply(`📘 *Explain Code*\nUsage: ${prefix}explaincode [code]`);
    await prexzyAskAndReply(reply, { endpoint: '/ai/explaincode', params: { code: text.trim() }, label: '📘 Code Explanation', loadingMsg: '📘 *Reading code...*' });
}
break;

case "summarize": {
    if (!text) return reply(`✂️ *Summarize*\nUsage: ${prefix}summarize [text]`);
    await prexzyAskAndReply(reply, { endpoint: '/ai/summarize', params: { text: text.trim() }, label: '✂️ Summary', loadingMsg: '✂️ *Summarizing...*' });
}
break;

case "aiart":
case "imagine": {
    if (!text) return reply(`🎨 *AI Art*\nUsage: ${prefix}aiart [prompt]`);
    await prexzyDownloadAndSend(m, reply, { endpoint: '/ai/aiart', params: { prompt: text.trim() }, label: '🎨 AI Art', mediaType: 'image' });
}
break;

case "gpt4": {
    const chatId = m.key.remoteJid;
    let query = args.join(" ").trim();
    
    try {
        if (!query && m.message && m.message.extendedTextMessage && 
            m.message.extendedTextMessage.contextInfo && 
            m.message.extendedTextMessage.contextInfo.quotedMessage) {
            
            const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;
            if (quoted.conversation) query = quoted.conversation;
            else if (quoted.extendedTextMessage && quoted.extendedTextMessage.text) 
                query = quoted.extendedTextMessage.text;
        }

        if (!query) {
            return reply("🤖 *Usage:* gpt4 your question");
        }

        const madrinRes = await prexzyGet('/ai/askgpt5', { prompt: query });
        const answer = prexzyExtractAnswer(madrinRes) || "";

        if (!answer) return reply("⚠️ *No response from GPT-4*");

        const chunks = answer.match(/[\s\S]{1,3000}/g) || [answer];
        
        for (let i = 0; i < chunks.length; i++) {
            const header = i === 0 ? "🤖 *GPT-4*\n\n" : "";
            await devtrust.sendMessage(chatId, { text: header + chunks[i] });
        }
    } catch (err) {
        console.error("gpt4 command error:", err);
        reply("⚠️ *GPT-4 unavailable* • Try later");
    }
}
break;


case 'list': {
    const sub = args[0]?.toLowerCase();
    const sub2 = args[1]?.toLowerCase();
    if (sub !== 'todaymatch') break;

    const { fetchTodayMatches, formatMatchList } = require('./footballAlerts');
    await reply('⏳ *Fetching today\'s matches...*');

    const matches = await fetchTodayMatches();
    if (!matches.length) {
        return reply('❌ *No football matches found for today!*\n> Check back later 🗓️');
    }

    // Cache matches
    const fs2 = require('fs');
    fs2.writeFileSync('./database/todaymatches.json', JSON.stringify(matches, null, 2));

    await reply(formatMatchList(matches));
}
break;

case 'register': {
    const sub = args[0]?.toLowerCase();
    const num = parseInt(args[1]);

    if (sub !== 'match' || isNaN(num)) {
        return reply(`❌ *Usage:* ${prefix}register match <number>\n> Example: ${prefix}register match 3\n> First use *${prefix}list todaymatch* to see today\'s matches`);
    }

    const { registerUser } = require('./footballAlerts');
    const fs2 = require('fs');
    const dbPath = './database/todaymatches.json';

    if (!fs2.existsSync(dbPath)) {
        return reply(`❌ *No match list found!*\nUse *${prefix}list todaymatch* first to see today\'s matches.`);
    }

    const matches = JSON.parse(fs2.readFileSync(dbPath, 'utf-8'));
    const result = registerUser(sender, num, matches);
    await reply(result.msg);
}
break;

case 'unregister': {
    const sub = args[0]?.toLowerCase();
    const num = parseInt(args[1]);

    if (sub !== 'match') {
        return reply(`❌ *Usage:* ${prefix}unregister match <number>`);
    }

    const { unregisterUser } = require('./footballAlerts');
    const fs2 = require('fs');
    const dbPath = './database/todaymatches.json';
    const matches = fs2.existsSync(dbPath)
        ? JSON.parse(fs2.readFileSync(dbPath, 'utf-8'))
        : null;

    const msg = unregisterUser(sender, num, matches);
    await reply(msg);
}
break;

case 'myfollows':
case 'mymatch': {
    const fs2 = require('fs');
    const dbPath = './database/matchalerts.json';

    if (!fs2.existsSync(dbPath)) return reply('❌ *You are not following any matches.*');

    const db = JSON.parse(fs2.readFileSync(dbPath, 'utf-8'));
    const myMatches = [];

    for (const matchId in db.registrations) {
        const reg = db.registrations[matchId];
        if (reg.users.includes(sender)) {
            myMatches.push(reg.match);
        }
    }

    if (!myMatches.length) return reply(`❌ *You are not following any matches.*\nUse *${prefix}list todaymatch* to see today\'s matches.`);

    let text = `╭─⚽ *YOUR FOLLOWED MATCHES*\n│\n`;
    myMatches.forEach((m2, i) => {
        const hs = m2.homeScore ?? '-';
        const as = m2.awayScore ?? '-';
        const score = m2.status === 'SCHEDULED' || m2.status === 'TIMED'
            ? `🕐 ${m2.time} UTC`
            : `${hs} - ${as} [${m2.status}]`;
        text += `│ *${i+1}.* ${m2.home} 🆚 ${m2.away}\n`;
        text += `│    🏆 ${m2.league}\n`;
        text += `│    ${score}\n│\n`;
    });
    text += `╰─ Use *${prefix}unregister match <number>* to stop alerts`;
    await reply(text);
}
break;

case 'ping':
case 'speed': {
    const speed = require('performance-now');
    const timestampp = speed();
    const latensi = speed() - timestampp;
    
    reply(`*${botDisplayName} Ping*\n\n📡 ${latensi.toFixed(4)} ms *By LËGĚNDÃRY Ł𝗮𝗯𝘀™*`);
}
break;

case 'runtime':
case 'alive': {
    reply(`*${botDisplayName} Uptime*\n\n ${runtime(process.uptime())}`);
}
break;

case 'public': {
    if (!isCreator) return reply("🔒 *Owner only*");
    
    setSetting("bot", "mode", "public");
    devtrust.public = true;
    reply("🌍 *Public mode activated*\nEveryone can use the bot");
}
break;

case 'private':
case 'self': {
    if (!isCreator) return reply("🔒 *Owner only*");
    
    setSetting("bot", "mode", "self");
    devtrust.public = false;
    reply("🔐 *Private mode activated*\nOnly owner can use the bot");
}
break;
  
case 'imbd': {
    if (!text) return reply(`🎬 *Enter a movie or series name*`);
    
    try {
        let fids = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${text}&plot=full`);
        
        let imdbt = `🎬 *${fids.data.Title}* (${fids.data.Year})\n\n` +
            `⭐ Rating: ${fids.data.imdbRating}/10\n` +
            `⏳ Runtime: ${fids.data.Runtime}\n` +
            `🎭 Genre: ${fids.data.Genre}\n` +
            `📅 Released: ${fids.data.Released}\n` +
            `👤 Director: ${fids.data.Director}\n` +
            `👥 Cast: ${fids.data.Actors}\n\n` +
            `📝 ${fids.data.Plot.substring(0, 300)}...`;
        
        await devtrust.sendMessage(m.chat,
            addNewsletterContext({
                image: { url: fids.data.Poster },
                caption: imdbt
            }),
            { quoted: m }
        );
    } catch (e) {
        reply("❌ *Movie not found*");
    }
    break;
}

case 'tiktoksearch': {
    if (!text) return reply("🎵 *Enter a search term*");

    try {
        let query = text;
        let url = `https://prexzyapis.com/search/tiktoksearch?q=${encodeURIComponent(query)}`;
        let response = await fetch(url);
        let json = await response.json();

        if (!json.status || !json.data || json.data.length === 0) {
            return reply("❌ *No results found*");
        }

        let videos = json.data.slice(0, 3);

        for (let i = 0; i < videos.length; i++) {
            let vid = videos[i];
            let date = new Date(vid.create_time * 1000);
            let info = `🎵 *TikTok #${i+1}*\n\n` +
                `👍 ${vid.digg_count} likes\n` +
                `👀 ${vid.play_count} views\n` +
                `📝 ${vid.title}\n` +
                `📅 ${date.toDateString()}`;

            await devtrust.sendMessage(m.chat,
                addNewsletterContext({
                    video: { url: vid.play },
                    caption: info
                }),
                { quoted: m }
            );
        }
    } catch (err) {
        console.log(err);
        reply("❌ *Error fetching TikTok data*");
    }
}
break;
// [REMOVED DUPLICATE: pinterest]


case 'nsbxmdmfw': {
    try {
        const apiUrl = 'https://draculazyx-xyzdrac.hf.space/api/hentai';
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (data && data.videoUrl) {
            await devtrust.sendMessage(m.chat,
                addNewsletterContext({
                    video: { url: data.videoUrl },
                    caption: `🎥 *${data.title || 'Video'}*\n⚠️ 18+ Content`
                }),
                { quoted: m }
            );
        } else {
            reply("❌ *Content unavailable*");
        }
    } catch (error) {
        console.error(error);
        reply("⚠️ *Error fetching content*");
    }
}
break;


// ==================== PAIRING COMMANDS FOR WHATSAPP BOT ====================

case "tinyurl":
case "shorten": {
    if (!text) return reply(`🔗 *URL Shortener*\nUsage: ${prefix}shorten [url]`);
    await prexzyAskAndReply(reply, { endpoint: '/tools/vgd', params: { url: text.trim() }, label: '🔗 Shortened URL', showLabel: false });
}
break;

// ============ TRANSLATE ============
    default:
      return false;
  }
  return true;
};
