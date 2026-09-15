// Auto-extracted from case.js — commands originally under section(s):
//   - BLOCK/UNBLOCK
//   - GREETINGS
//   - LOCK / UNLOCK SETTINGS
//   - MUTE GROUP
//   - MUTE/UNMUTE USER
//   - NEW GROUP COMMANDS BATCH
//   - OPEN / CLOSE GROUP
//   - POLL
//   - ROLE LIST: owner -> sub-admins -> members
//   - UNMUTE GROUP
//   - WARN SYSTEM
//   - WARNINGS SYSTEM
//   - [ 👥 TOTAL MEMBERS ]
//   - [ 🚫 ANTI-SPAM ]
//   - [ 🤖 ANTI-BOT ]
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case 'antitag': {
    if (!m.isGroup) return reply("👥 *Groups only*");
    if (!isAdmins && !isCreator) return reply("🔒 *Admins only*");
    
    if (!args[0]) {
        const config = getSetting(botNumber + m.chat, "antitag", { enabled: false, action: 'delete' });
        return reply(`🏷️ *Anti-Tag*\n\n` +
                     `📌 *Usage:*\n` +
                     `▸ .antitag on - Enable (delete mode)\n` +
                     `▸ .antitag delete - Enable delete mode\n` +
                     `▸ .antitag kick - Enable kick mode\n` +
                     `▸ .antitag off - Disable\n\n` +
                     `⚙️ *Status:* ${config.enabled ? 'ON ✅' : 'OFF ❌'}\n` +
                     `⚙️ *Action:* ${config.enabled ? config.action : '-'}`);
    }
    
    if (args[0] === 'on' || args[0] === 'delete') {
        setSetting(botNumber + m.chat, "antitag", { enabled: true, action: 'delete' });
        reply(`✅ *Anti-Tag enabled (Delete mode)*\nMass tagging will be deleted`);
    }
    else if (args[0] === 'kick') {
        setSetting(botNumber + m.chat, "antitag", { enabled: true, action: 'kick' });
        reply(`✅ *Anti-Tag enabled (Kick mode)*\nUsers who mass tag will be kicked`);
    }
    else if (args[0] === 'off') {
        setSetting(botNumber + m.chat, "antitag", { enabled: false, action: 'delete' });
        reply(`❌ *Anti-Tag disabled*`);
    }
}
break;

// ======================[ 🤖 ANTI-BOT ]======================
// Enforcement already existed (checks getSetting(botNumber+m.chat,
// "antibot", ...)) but there was no command anywhere to actually turn it
// on — it was permanently stuck at its default OFF. This is that missing
// command.
case 'antibot': {
    if (!m.isGroup) return reply("👥 *Groups only*");
    if (!isAdmins && !isCreator) return reply("🔒 *Admins only*");

    if (!args[0]) {
        const config = getSetting(botNumber + m.chat, "antibot", { enabled: false, action: 'delete' });
        return reply(`🤖 *Anti-Bot*\n_Deletes messages sent by other bots in this group._\n\n` +
                     `📌 *Usage:*\n` +
                     `▸ ${prefix}antibot on - Enable (delete mode)\n` +
                     `▸ ${prefix}antibot kick - Enable kick mode\n` +
                     `▸ ${prefix}antibot off - Disable\n\n` +
                     `⚙️ *Status:* ${config.enabled ? 'ON ✅' : 'OFF ❌'}\n` +
                     `⚙️ *Action:* ${config.enabled ? config.action : '-'}`);
    }

    if (args[0] === 'on' || args[0] === 'delete') {
        setSetting(botNumber + m.chat, "antibot", { enabled: true, action: 'delete' });
        reply(`✅ *Anti-Bot enabled (Delete mode)*`);
    } else if (args[0] === 'kick') {
        setSetting(botNumber + m.chat, "antibot", { enabled: true, action: 'kick' });
        reply(`✅ *Anti-Bot enabled (Kick mode)*`);
    } else if (args[0] === 'off') {
        setSetting(botNumber + m.chat, "antibot", { enabled: false, action: 'delete' });
        reply(`❌ *Anti-Bot disabled*`);
    } else {
        reply(`❌ *Invalid option.* Use: on, kick, or off`);
    }
}
break;

// ======================[ 🚫 ANTI-SPAM ]======================
case 'antispam': {
    if (!m.isGroup) return reply("👥 *Groups only*");
    if (!isAdmins && !isCreator) return reply("🔒 *Admins only*");
    
    if (!args[0]) {
        const config = getSetting(botNumber + m.chat, "antispam", { enabled: false, action: 'delete' });
        return reply(`🚫 *Anti-Spam*\n\n` +
                     `📌 *Usage:*\n` +
                     `▸ .antispam on - Enable (delete mode)\n` +
                     `▸ .antispam delete - Enable delete mode\n` +
                     `▸ .antispam kick - Enable kick mode\n` +
                     `▸ .antispam off - Disable\n\n` +
                     `⚙️ *Status:* ${config.enabled ? 'ON ✅' : 'OFF ❌'}\n` +
                     `⚙️ *Action:* ${config.enabled ? config.action : '-'}`);
    }
    
    if (args[0] === 'on' || args[0] === 'delete') {
        setSetting(botNumber + m.chat, "antispam", { enabled: true, action: 'delete' });
        reply(`✅ *Anti-Spam enabled (Delete mode)*\nSpam messages will be deleted`);
    }
    else if (args[0] === 'kick') {
        setSetting(botNumber + m.chat, "antispam", { enabled: true, action: 'kick' });
        reply(`✅ *Anti-Spam enabled (Kick mode)*\nUsers who spam will be kicked`);
    }
    else if (args[0] === 'off') {
        setSetting(botNumber + m.chat, "antispam", { enabled: false, action: 'delete' });
        reply(`❌ *Anti-Spam disabled*`);
    }
}
break;


case 'setprefix': {
    if (!isCreator && !isSudo) return reply("🔒 *Owner/Sudo only*");
    
    if (!args[0]) {
        return reply(`🔧 *Current prefix:* \`${getUserPrefix(m.sender) || '(none — no-prefix mode is on)'}\`\n\nUsage: ${prefix}setprefix [new prefix]\nExample: ${prefix}setprefix !\n${prefix}setprefix null — run commands with no symbol at all`);
    }
    
    const rawArg = args.join(' ');
    // "null"/"none"/"off" -> empty prefix. body.startsWith('') is always
    // true, so every message becomes a command lookup; anything that
    // isn't a real command name just falls through the switch untouched,
    // same as it does today for any mistyped command.
    const goingNoPrefix = ['null', 'none', 'off'].includes(rawArg.toLowerCase());
    const newPrefix = goingNoPrefix ? '' : rawArg;
    
    if (newPrefix.length > 5) {
        return reply("❌ *Prefix too long* (max 5 characters)");
    }
    
    setUserPrefix(m.sender, newPrefix);
    prefix = newPrefix;
    
    reply(goingNoPrefix
        ? `✅ *No-prefix mode enabled* — just type command names directly, no symbol needed.\n_Type "setprefix ." (no symbol) to restore a prefix later_`
        : `✅ *Your prefix changed to* \`${newPrefix}\`\n_Use ${newPrefix}menu to see commands_\n_If you forget, type just "." to see your prefix_`);
}
break;

case 'flirt': {
    const lines = [
        "Are you a magician? Because whenever I look at you, everyone else disappears.",
        "Do you have a map? I keep getting lost in your eyes.",
        "Is your name Google? Because you have everything I've been searching for.",
        "Are you made of copper and tellurium? Because you're Cu-Te.",
        "If you were a vegetable, you'd be a cute-cumber.",
        "Do you believe in love at first sight, or should I walk past again?",
        "Is your dad a baker? Because you're a cutie pie.",
        "You must be tired because you've been running through my mind all day.",
        "Are you a parking ticket? Because you've got FINE written all over you.",
        "Did it hurt when you fell from heaven?"
    ];
    reply(`💘 *Flirt:* ${lines[Math.floor(Math.random() * lines.length)]}`);
}
break;

case 'roast': {
    let target = m.mentionedJid?.[0] ? '@' + m.mentionedJid[0].split('@')[0] : text || '@' + m.sender.split('@')[0];
    
    try {
        async function openaiRoast(victim) {
            return await askOpenAI(`Roast this person in a funny but savage way (1-2 lines): ${victim}`);
        }
        
        let roast = await openaiRoast(target);
        reply(`🔥 *Roast for ${target}:*\n\n${roast}`);
    } catch (e) {
        console.error(e);
        reply("⚠️ *Roast failed* • The burn machine needs repairs");
    }
}
break;

case 'compliment': {
    let target = m.mentionedJid?.[0] ? '@' + m.mentionedJid[0].split('@')[0] : text || '@' + m.sender.split('@')[0];
    
    try {
        async function openaiCompliment(victim) {
            return await askOpenAI(`Give a sweet, kind compliment to this person (1-2 lines max): ${victim}`);
        }
        
        let compliment = await openaiCompliment(target);
        reply(`💫 *Compliment for ${target}:*\n\n${compliment}`);
    } catch (e) {
        console.error(e);
        reply("⚠️ *Compliment failed* • The kindness machine is broken");
    }
}
break;
case "advice": {
    try {
        const res = await axios.get("https://api.adviceslip.com/advice");
        const advice = res.data?.slip?.advice || "Keep going!";
        reply(`💭 *${botDisplayName} Advice*\n\n"${advice}"`);
    } catch (e) {
        console.error("ADVICE ERROR:", e);
        reply("❌ *Advice machine is sleeping* • Try again later");
    }
}
break;

case 'rewrite': {
    if (!text) return reply(`✍️ *Usage:* ${command} your text here`);
    
    try {
        async function openaiRewrite(input) {
            return await askOpenAI(`Rewrite this to be clear and grammatically correct:\n"${input}"`);
        }
        
        let result = await openaiRewrite(text);
        reply(`✍️ *${botDisplayName} Rewrite*\n\n${result}`);
    } catch (e) {
        console.error(e);
        reply("⚠️ *Rewrite failed* • Editor is on break");
    }
}
break;

case 'github': {
    if (!text) return reply(`👨‍💻 *Usage:* ${command} username`);
    
    try {
        let res = await axios.get(`https://api.github.com/users/${encodeURIComponent(text)}`);
        let user = res.data;
        
        if (!user || !user.login) return reply("🔍 *User not found*");
        
        let profileInfo = `👨‍💻 *${botDisplayName} GitHub*\n\n` +
            `📌 *${user.name || user.login}*\n` +
            `📍 ${user.location || "Location hidden"}\n` +
            `📦 Repos: ${user.public_repos} | 👥 Followers: ${user.followers}\n` +
            `🔗 ${user.html_url}`;
        
        await devtrust.sendMessage(m.chat, 
            addNewsletterContext({
                image: { url: user.avatar_url },
                caption: profileInfo
            }), 
            { quoted: m }
        );
    } catch (e) {
        console.error(e);
        reply("⚠️ *GitHub fetch failed* • Try again later");
    }
}
break;

case 'welcome': {
    if (!m.isGroup) return reply("👥 Groups only.");
    if (!isAdmins && !isCreator) return reply("🔒 Admins only.");

    const arg = args[0]?.toLowerCase();

    if (arg === 'on') {
        setSetting(botNumber + m.chat, "welcome", true);
        return reply("✅ Welcome enabled.");
    }

    if (arg === 'off') {
        setSetting(botNumber + m.chat, "welcome", false);
        return reply("❌ Welcome disabled.");
    }

    if (arg === 'set') {
        const msg = args.slice(1).join(' ');
        if (!msg) return reply(`Example:\n${prefix}welcome set Welcome @user to @group.`);
        
        setSetting(m.chat, "welcomeMessage", msg);
        return reply("✅ Custom message saved.");
    }

    return reply(`⚙️ Welcome Settings

${prefix}welcome on
${prefix}welcome off
${prefix}welcome set <message>

Use @user to tag the member.`);
}
break;

case "calculator": {
    try {
        const val = text
            .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π|pi/gi, 'Math.PI')
            .replace(/e/gi, 'Math.E')
            .replace(/\/+/g, '/')
            .replace(/\++/g, '+')
            .replace(/-+/g, '-');

        const format = val
            .replace(/Math\.PI/g, 'π')
            .replace(/Math\.E/g, 'e')
            .replace(/\//g, '÷')
            .replace(/\*/g, '×');

        const result = (new Function('return ' + val))();
        
        if (!result) throw new Error('Invalid calculation');
        
        reply(`🧮 *${botDisplayName} Math*\n\n${format} = ${result}`);
    } catch (e) {
        reply(`❌ *Invalid expression*\nUse: 0-9, +, -, *, /, ×, ÷, π, e, (, )`);
    }
    break;
}

case 'setsudo': case 'sudo': case 'addsudo': {
    if (!isCreator && !isSudo) 
        return reply('🔒 *Owner/Sudo only*');

    let jid, jidAlt;
    if (quoted?.sender) {
        // Preserve the EXACT JID format (including @lid) — rebuilding this
        // as always-@s.whatsapp.net silently broke sudo for @lid accounts,
        // since their real incoming messages never actually match that.
        jid = quoted.sender;
        jidAlt = quoted.key?.participantAlt || quoted.key?.remoteJidAlt;
    } else if (m.mentionedJid?.[0]) {
        jid = m.mentionedJid[0];
    } else if (args[0] && /^\d+$/.test(args[0])) {
        jid = args[0] + '@s.whatsapp.net';
    }

    if (!jid) {
        return reply('❌ *Valid number required* • Reply to their message, @mention them, or provide a number');
    }

    const number = jid.split('@')[0];

    const sudoList = loadSudoList();

    if (sudoList.includes(jid)) 
        return reply(`⚠️ @${number} *already in sudo list*`);
    
    sudoList.push(jid);
    // Store the alternate JID too when WhatsApp exposes one (lid<->pn
    // pairing) — the check above now matches against both, but only if
    // both are actually saved.
    if (jidAlt && !sudoList.includes(jidAlt)) sudoList.push(jidAlt);
    saveSudoList(sudoList);

    reply(`✅ @${number} *added to sudo list*`);
}
break;

case 'delsudo': {
    if (!isCreator && !isSudo) 
        return reply('🔒 *Owner/Sudo only*');

    let jid;
    if (quoted?.sender) {
        jid = quoted.sender;
    } else if (m.mentionedJid?.[0]) {
        jid = m.mentionedJid[0];
    } else if (args[0] && /^\d+$/.test(args[0])) {
        jid = args[0] + '@s.whatsapp.net';
    }

    if (!jid) {
        return reply('❌ *Valid number required* • Reply to their message, @mention them, or provide a number');
    }

    const number = jid.split('@')[0];
    const sudoList = loadSudoList();

    if (!sudoList.includes(jid)) 
        return reply(`⚠️ @${number} *not in sudo list*`);
    
    const updatedList = sudoList.filter((user) => user !== jid);
    saveSudoList(updatedList);

    reply(`✅ @${number} *removed from sudo list*`);
}
break;

case 'getsudo': case 'listsudo': {
    if (!isCreator && !isSudo) 
        return reply('🔒 *Owner/Sudo only*');
    
    const sudoList = loadSudoList();
    if (sudoList.length === 0) 
        return reply('📭 *Sudo list is empty*');

    const sudoNumbers = sudoList.map((jid) => jid.split('@')[0]).join('\n• ');
    reply(`👥 *Sudo List*\n\n• ${sudoNumbers}`);
}
break;

case "autobio": {
    if (!isCreator && !isSudo) 
        return reply('🔒 *Owner/Sudo only*');
    
    if (!args[0]) return reply("⚙️ *Usage:* autobio on/off");
    
    if (args[0].toLowerCase() === "on") {
        setSetting(m.sender, "autobio", true);
        reply("✅ *Auto bio enabled* • Status will update automatically");
    } else if (args[0].toLowerCase() === "off") {
        setSetting(m.sender, "autobio", false);
        reply("❌ *Auto bio disabled*");
    } else reply("⚙️ *Usage:* autobio on/off");
}
break;

case "autoread": {
    if (!isCreator && !isSudo) 
        return reply('🔒 *Owner/Sudo only*');
    
    if (!args[0]) return reply("⚙️ *Usage:* autoread on/off");
    
    if (args[0].toLowerCase() === "on") {
        setSetting(m.sender, "autoread", true);
        reply("✅ *Auto read enabled* • Messages auto-read");
    } else if (args[0].toLowerCase() === "off") {
        setSetting(m.sender, "autoread", false);
        reply("❌ *Auto read disabled*");
    } else reply("⚙️ *Usage:* autoread on/off");
}
break;

case "antidelete": {
    if (!isCreator && !isSudo)
        return reply('🔒 *Owner/Sudo only*');

    const scope = (args[0] || '').toLowerCase();

    // "status" sub-mode controls anti-delete specifically for WhatsApp
    // statuses (status@broadcast) — a separate setting the rest of the
    // bot already reads (antiDeleteStatus), but this sub-mode used to be
    // stuck in dead duplicate code and was unreachable.
    if (scope === 'status') {
        const state = (args[1] || '').toLowerCase();
        if (!['on', 'off'].includes(state)) return reply(`⚙️ *Usage:* ${prefix}antidelete status on/off`);
        setSetting(botNumber, "antiDeleteStatus", state === 'on');
        return reply(`📊 *Anti-delete for statuses* turned *${state.toUpperCase()}*`);
    }

    if (!scope) return reply(`⚙️ *Usage:* ${prefix}antidelete on/off\n${prefix}antidelete status on/off`);

    if (scope === "on") {
        setSetting(botNumber, "antiDelete", true);
        reply("✅ *Anti-delete enabled*\n\nDeleted messages will be forwarded to *your DM* 📩");
    } else if (scope === "off") {
        setSetting(botNumber, "antiDelete", false);
        reply("❌ *Anti-delete disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}antidelete on/off\n${prefix}antidelete status on/off`);
}
break;

case "readstatus": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}readstatus on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "readStatus", true);
        reply("✅ *Read status enabled* • Bot will auto-read statuses");
    } else if (args[0] === "off") {
        setSetting(botNumber, "readStatus", false);
        reply("❌ *Read status disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}readstatus on/off`);
}
break;

case "likestatus": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}likestatus on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "likeStatus", true);
        reply("✅ *Like status enabled* • Bot will auto-react to statuses");
    } else if (args[0] === "off") {
        setSetting(botNumber, "likeStatus", false);
        reply("❌ *Like status disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}likestatus on/off`);
}
break;

case "startupmsg": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}startupmsg on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "startupMsg", true);
        reply("✅ *Startup message enabled* • Bot will send a message when it starts");
    } else if (args[0] === "off") {
        setSetting(botNumber, "startupMsg", false);
        reply("❌ *Startup message disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}startupmsg on/off`);
}
break;

case "alwaysonline": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}alwaysonline on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "alwaysOnline", true);
        reply("✅ *Always online enabled* • Bot will appear online always");
    } else if (args[0] === "off") {
        setSetting(botNumber, "alwaysOnline", false);
        reply("❌ *Always online disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}alwaysonline on/off`);
}
break;

case "antiedit": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}antiedit on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "antiEdit", true);
        reply("✅ *Anti-edit enabled* • Bot will log edited messages to your DM");
    } else if (args[0] === "off") {
        setSetting(botNumber, "antiEdit", false);
        reply("❌ *Anti-edit disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}antiedit on/off`);
}
break;

case "antieditchat": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}antieditchat on/off`);
    if (args[0] === "on") {
        setSetting(m.chat, "antiEditChat", true);
        reply("✅ *Anti-edit (chat) enabled* • Edited messages will be logged in this chat");
    } else if (args[0] === "off") {
        setSetting(m.chat, "antiEditChat", false);
        reply("❌ *Anti-edit (chat) disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}antieditchat on/off`);
}
break;

case "savestatus": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}savestatus on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "saveStatus", true);
        reply("✅ *Save status enabled* • Bot will forward statuses to your DM");
    } else if (args[0] === "off") {
        setSetting(botNumber, "saveStatus", false);
        reply("❌ *Save status disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}savestatus on/off`);
}
break;

case "cmdreact": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    // NOTE: cmdReact is read elsewhere as an emoji string (with a default
    // fallback emoji), not a boolean — set the emoji itself, not on/off.
    if (args[0] === 'off') {
        setSetting(botNumber, 'cmdReact', null);
        return reply('✅ *Command react disabled*');
    }
    if (!args[0]) return reply(`Usage: ${prefix}cmdreact <emoji>\n${prefix}cmdreact off`);
    setSetting(botNumber, 'cmdReact', args[0]);
    reply(`✅ *Command react set to* ${args[0]} — reacts to every command now.`);
}
break;

case "readmsg": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}readmsg on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "readMsg", true);
        reply("✅ *Read messages enabled* • Bot will mark all messages as read");
    } else if (args[0] === "off") {
        setSetting(botNumber, "readMsg", false);
        reply("❌ *Read messages disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}readmsg on/off`);
}
break;

case "rejectcall": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}rejectcall on/off`);
    if (args[0] === "on") {
        setSetting(botNumber, "rejectCall", true);
        reply("✅ *Reject call enabled* • Bot will auto-reject incoming calls");
    } else if (args[0] === "off") {
        setSetting(botNumber, "rejectCall", false);
        reply("❌ *Reject call disabled*");
    } else reply(`⚙️ *Usage:* ${prefix}rejectcall on/off`);
}
break;

case "setmod": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}setmod @user`);
    const modNum = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    let mods = JSON.parse(fs.existsSync('./database/mods.json') ? fs.readFileSync('./database/mods.json') : '[]');
    if (mods.includes(modNum)) return reply('⚠️ *User is already a mod*');
    mods.push(modNum);
    fs.writeFileSync('./database/mods.json', JSON.stringify(mods));
    reply(`✅ *@${args[0].replace(/[^0-9]/g, '')} added as mod*`, { mentions: [modNum] });
}
break;

case "delmod": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}delmod @user`);
    const delModNum = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    let modsD = JSON.parse(fs.existsSync('./database/mods.json') ? fs.readFileSync('./database/mods.json') : '[]');
    modsD = modsD.filter(m => m !== delModNum);
    fs.writeFileSync('./database/mods.json', JSON.stringify(modsD));
    reply(`✅ *@${args[0].replace(/[^0-9]/g, '')} removed from mods*`, { mentions: [delModNum] });
}
break;

case "getmods": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    let modsList = JSON.parse(fs.existsSync('./database/mods.json') ? fs.readFileSync('./database/mods.json') : '[]');
    if (!modsList.length) return reply('📋 *No mods set*');
    const modsText = modsList.map((m, i) => `${i + 1}. @${m.replace('@s.whatsapp.net', '')}`).join('\n');
    reply(`📋 *Mods List:*\n${modsText}`, { mentions: modsList });
}
break;

case "statusemoji": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}statusemoji [emoji]`);
    setSetting(botNumber, "statusEmoji", args[0]);
    reply(`✅ *Status emoji set to* ${args[0]}`);
}
break;

case "savecmd": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!args[0]) return reply(`⚙️ *Usage:* ${prefix}savecmd [command] [response]`);
    const cmdName = args[0].toLowerCase();
    const cmdResponse = args.slice(1).join(' ');
    if (!cmdResponse) return reply(`⚙️ *Usage:* ${prefix}savecmd [command] [response]`);
    let customCmds = JSON.parse(fs.existsSync('./database/customcmds.json') ? fs.readFileSync('./database/customcmds.json') : '{}');
    customCmds[cmdName] = cmdResponse;
    fs.writeFileSync('./database/customcmds.json', JSON.stringify(customCmds));
    reply(`✅ *Command saved!*\n▸ Trigger: ${prefix}${cmdName}\n▸ Response: ${cmdResponse}`);
}
break;

case "vvcmd": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    let customCmdsV = JSON.parse(fs.existsSync('./database/customcmds.json') ? fs.readFileSync('./database/customcmds.json') : '{}');
    const cmdKeys = Object.keys(customCmdsV);
    if (!cmdKeys.length) return reply('📋 *No custom commands saved*');
    const cmdList = cmdKeys.map((k, i) => `${i + 1}. ${prefix}${k} → ${customCmdsV[k]}`).join('\n');
    reply(`📋 *Custom Commands:*\n${cmdList}`);
}
break;

// ============ TOOLS COMMANDS ============
case "blocklist": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    try {
        const list = await devtrust.fetchBlocklist();
        if (!list.length) return reply('📋 *No blocked contacts*');
        const listText = list.map((j, i) => `${i + 1}. @${j.replace('@s.whatsapp.net', '')}`).join('\n');
        reply(`🚫 *Blocked Contacts (${list.length})*\n\n${listText}`, { mentions: list });
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ BIO ============
case 'poll2':
case 'vote': {
    if (!text) return reply(`📊 Usage: ${prefix}poll2 Question | Option1 | Option2 | Option3`);
    const pollParts = text.split('|').map(s => s.trim()).filter(Boolean);
    if (pollParts.length < 3) return reply('❌ Need question + at least 2 options separated by |');
    const pollQ = pollParts[0];
    const pollOpts = pollParts.slice(1);
    try {
        await devtrust.sendMessage(m.chat, { poll: { name: pollQ, values: pollOpts, selectableCount: 1 } }, { quoted: m });
    } catch (e) { reply(`❌ Error creating poll: ${e.message}`); }
}
break;

// ===== WARNINGS SYSTEM =====
case 'warn2': {
    if (!m.isGroup) return reply('❌ Group only');
    const warnFile = './database/warnings.json';
    const warnStore = fs.existsSync(warnFile) ? JSON.parse(fs.readFileSync(warnFile)) : {};
    const warnTarget = m.quoted?.sender || m.mentionedJid?.[0];
    if (!warnTarget) return reply('❌ Tag or reply to a member');
    if (!warnStore[m.chat]) warnStore[m.chat] = {};
    if (!warnStore[m.chat][warnTarget]) warnStore[m.chat][warnTarget] = 0;
    warnStore[m.chat][warnTarget]++;
    fs.writeFileSync(warnFile, JSON.stringify(warnStore, null, 2));
    const warnCount = warnStore[m.chat][warnTarget];
    await devtrust.sendMessage(m.chat, { text: `⚠️ *WARNING ${warnCount}/3*\n\n@${warnTarget.split('@')[0]} has been warned!\n*Reason:* ${text || 'No reason given'}\n\n${warnCount >= 3 ? '🚨 *3 warnings! Consider removing this member.*' : `_${3 - warnCount} warning(s) remaining._`}`, mentions: [warnTarget] }, { quoted: m });
}
break;

case 'warncount':
case 'warnings2': {
    if (!m.isGroup) return reply('❌ Group only');
    const wcFile = './database/warnings.json';
    const wcStore = fs.existsSync(wcFile) ? JSON.parse(fs.readFileSync(wcFile)) : {};
    const wcGroup = wcStore[m.chat];
    if (!wcGroup || !Object.keys(wcGroup).length) return reply('✅ No warnings in this group.');
    let wcText = '⚠️ *Warning List:*\n\n';
    Object.entries(wcGroup).forEach(([jid, count]) => { wcText += `• @${jid.split('@')[0]}: ${count} warning(s)\n`; });
    await devtrust.sendMessage(m.chat, { text: wcText, mentions: Object.keys(wcGroup) }, { quoted: m });
}
break;
// [REMOVED DUPLICATE: clearwarns]

// ===== TAGALL 2 =====
case 'gm':
case 'goodmorning': {
    reply(`🌅 *Good Morning!*\n\nMay today bring you:\n✅ Fresh opportunities\n✅ Great achievements\n✅ Blessings upon blessings\n\n_Start your day with gratitude!_ 🙏\n\n_© ${botDisplayName}_ ⚡`);
}
break;

case 'gn':
case 'goodnight': {
    reply(`🌙 *Good Night!*\n\n🌟 Let go of today's worries\n💫 Dream big beautiful dreams\n⚡ Wake up ready to conquer tomorrow\n\n_Rest well, legend!_ 😴\n\n_© ${botDisplayName}_ ⚡`);
}
break;

case 'ga':
case 'goodafternoon': {
    reply(`☀️ *Good Afternoon!*\n\n💪 Keep pushing through\n🎯 Stay focused on your goals\n💧 Remember to drink water!\n\n_You got this, legend!_ 🔥`);
}
break;

// ===== BIRTHDAY =====
case 'groupinfo': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const admins = meta.participants.filter(p => p.admin).length;
        reply(`*📋 Group Info*\n\n` +
            `Name: ${meta.subject}\n` +
            `ID: ${meta.id}\n` +
            `Members: ${meta.participants.length}\n` +
            `Admins: ${admins}\n` +
            `Created: ${meta.creation ? new Date(meta.creation * 1000).toDateString() : 'Unknown'}\n` +
            `Owner: ${meta.owner ? '@' + meta.owner.split('@')[0] : 'Unknown'}\n` +
            `${meta.desc ? `\nDescription: ${meta.desc}` : ''}`, meta.owner ? [meta.owner] : []);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'listmembers': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const rows = meta.participants.map((p, i) => [`${i + 1}`, `@${p.id.split('@')[0]}`, p.admin ? p.admin : 'member']);
        await sendTable(devtrust, m.chat, { title: 'Group Members', headerText: `${meta.participants.length} members`, rows: [['#', 'Member', 'Role'], ...rows], contextMsg: m });
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== ROLE LIST: owner -> sub-admins -> members =====
case 'rolelist':
case 'grouproles': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const owner = meta.participants.filter(p => p.admin === 'superadmin' || p.id === meta.owner);
        const subAdmins = meta.participants.filter(p => p.admin === 'admin' && !owner.includes(p));
        const members = meta.participants.filter(p => !p.admin);
        const mentions = [];
        const fmt = (p) => { mentions.push(p.id); return `@${p.id.split('@')[0]}`; };

        let msg = `*👥 ${meta.subject}*\n\n`;
        msg += `*👑 Owner (${owner.length})*\n${owner.length ? owner.map(fmt).join('\n') : '_none found_'}\n\n`;
        msg += `*🛡️ Sub-Admins (${subAdmins.length})*\n${subAdmins.length ? subAdmins.map(fmt).join('\n') : '_none_'}\n\n`;
        msg += `*👤 Members (${members.length})*\n${members.length ? members.map(fmt).join('\n') : '_none_'}`;

        reply(msg, mentions);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'getdevice': {
    // Uses Baileys' own getDevice(id) utility — reads the platform hint
    // baked into a message's ID, not a guess. Target = whoever's message
    // is quoted, or the first tagged user (whose most recent message we
    // then need the ID of — so for a plain tag we ask them to send/quote
    // a message from that person instead, since a bare @mention carries
    // no message ID to read).
    let targetMsgKey = null;
    let targetJid = null;
    if (m.quoted) {
        targetMsgKey = m.quoted.id || m.quoted.key?.id;
        targetJid = m.quoted.sender || m.quoted.participant;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        targetJid = m.mentionedJid[0];
    }
    if (!targetMsgKey) {
        return reply(`📱 *Get Device*\nReply to a message from the person with ${prefix}getdevice — I need an actual message ID to read the device from (a bare @tag alone doesn't carry one).`);
    }
    if (typeof __baileys_getDevice !== 'function') {
        return reply('❌ *Get Device is unavailable* — the installed `@boruto_vk7/baileys` build doesn\'t export `getDevice`. Check the package version, or this needs a manual device-detect fallback.');
    }
    try {
        const device = __baileys_getDevice(targetMsgKey);
        const deviceNames = { ios: '🍎 iOS (iPhone)', android: '🤖 Android', web: '🌐 WhatsApp Web', unknown: '❓ Unknown' };
        reply(`📱 *Device Info*\n\n${targetJid ? `User: @${targetJid.split('@')[0]}\n` : ''}Platform: ${deviceNames[device] || device}`, targetJid ? [targetJid] : []);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case 'groupjid': {
    if (!m.isGroup) return reply('✘ Groups only');
    reply(`🆔 *Group JID:*\n${m.chat}`);
}
break;

case 'setgroupname': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    if (!text) return reply(`Usage: ${prefix}setgroupname <new name>`);
    try {
        await devtrust.groupUpdateSubject(m.chat, text.trim());
        reply(`✓ Group name updated to: ${text.trim()}`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'rules': {
    if (!m.isGroup) return reply('✘ Groups only');
    const currentRules = getSetting(m.chat, 'groupRules', null);
    if (!currentRules) return reply(`📜 No rules set for this group yet.${isAdmins || isCreator ? `\nUse ${prefix}setrules <text> to add some.` : ''}`);
    reply(`📜 *Group Rules*\n\n${currentRules}`);
}
break;

case 'setrules': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!text) return reply(`Usage: ${prefix}setrules <rules text>`);
    setSetting(m.chat, 'groupRules', text.trim());
    reply('✓ Group rules updated');
}
break;

case 'delrules': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    setSetting(m.chat, 'groupRules', null);
    reply('✓ Group rules cleared');
}
break;

case 'leavegroup': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isCreator) return reply('🔒 Owner only');
    try {
        await reply('👋 Leaving group...');
        await devtrust.groupLeave(m.chat);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'demoteall': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isCreator) return reply('🔒 Owner only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const adminsToDemote = meta.participants.filter(p => p.admin && p.id !== botNumber + '@s.whatsapp.net').map(p => p.id);
        if (!adminsToDemote.length) return reply('✘ No other admins to demote');
        await devtrust.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote');
        reply(`✓ Demoted ${adminsToDemote.length} admin(s)`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'ephemeral': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const ephMap = { off: 0, '24h': 86400, '7d': 604800, '90d': 7776000 };
    const ephArg = (text || '').trim().toLowerCase();
    if (!(ephArg in ephMap)) return reply(`Usage: ${prefix}ephemeral <off|24h|7d|90d>`);
    try {
        await devtrust.groupToggleEphemeral(m.chat, ephMap[ephArg]);
        reply(`✓ Disappearing messages set to: ${ephArg}`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'staffcount': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        reply(`👮 *${meta.participants.filter(p => p.admin).length}* admin(s) out of ${meta.participants.length} members`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'memberscount': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        reply(`👥 *${meta.participants.length}* members`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'groupowner': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const ownerJid = meta.owner || meta.participants.find(p => p.admin === 'superadmin')?.id;
        if (!ownerJid) return reply('✘ Could not determine group owner (WhatsApp doesn\'t always expose this)');
        reply(`👑 Group owner: @${ownerJid.split('@')[0]}`, [ownerJid]);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'tagnotadmin': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const nonAdmins = meta.participants.filter(p => !p.admin).map(p => p.id);
        if (!nonAdmins.length) return reply('✘ No non-admin members found');
        const mentionText = nonAdmins.map(j => `@${j.split('@')[0]}`).join(' ');
        reply(`📢 ${text || 'Attention'}\n\n${mentionText}`, nonAdmins);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'groupsettings': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const meta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const alCfg = antilinkSettings[getAntilinkKey(botNumber, m.chat)] || { enabled: false };
        const welcomeMsg = getSetting(m.chat, 'welcomeMsg', null);
        const groupRules = getSetting(m.chat, 'groupRules', null);
        reply(`*⚙️ Group Settings*\n\n` +
            `Locked (admins only): ${meta.announce ? '✅ Yes' : '❌ No'}\n` +
            `AntiLink: ${alCfg.enabled ? `✅ ON (${alCfg.action})` : '❌ OFF'}\n` +
            `Welcome message: ${welcomeMsg ? '✅ Set' : '❌ Not set'}\n` +
            `Rules: ${groupRules ? '✅ Set' : '❌ Not set'}\n\n` +
            `Use ${prefix}antistatus for the full anti-feature breakdown.`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'newgc': {
    if (!isCreator && !isSudo) return reply('🔒 Owner/Sudo only');
    const [gcName, ...gcMembers] = (text || '').split('|').map(s => s.trim());
    if (!gcName) return reply(`Usage: ${prefix}newgc GroupName | 234xxxxxxxxxx, 234xxxxxxxxxx`);
    const memberJids = (gcMembers.join(',') || '').split(',').map(n => n.trim()).filter(Boolean).map(n => n.replace(/\D/g, '') + '@s.whatsapp.net');
    try {
        const newGroup = await devtrust.groupCreate(gcName, memberJids);
        reply(`✓ Group "${gcName}" created with ${memberJids.length} member(s)\nID: ${newGroup.id}`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'joingroup': {
    if (!isCreator && !isSudo) return reply('🔒 Owner/Sudo only');
    if (!text || !text.includes('chat.whatsapp.com/')) return reply(`Usage: ${prefix}joingroup <invite link>`);
    try {
        const inviteCode = text.trim().split('chat.whatsapp.com/')[1];
        await devtrust.groupAcceptInvite(inviteCode);
        reply('✓ Joined the group');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'setwelcomeimg': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const wImg = m.quoted?.mtype === 'imageMessage' ? m.quoted : (m.mtype === 'imageMessage' ? m : null);
    if (!wImg) return reply(`📸 Reply to (or send with) an image using ${prefix}setwelcomeimg to set it as the welcome image.`);
    try {
        const buf = await downloadMediaMessage(wImg, 'buffer', {});
        const b64 = buf.toString('base64');
        setSetting(m.chat, 'welcomeImg', b64);
        reply('✓ Welcome image set');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'setgoodbyeimg': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const gImg = m.quoted?.mtype === 'imageMessage' ? m.quoted : (m.mtype === 'imageMessage' ? m : null);
    if (!gImg) return reply(`📸 Reply to (or send with) an image using ${prefix}setgoodbyeimg to set it as the goodbye image.`);
    try {
        const buf = await downloadMediaMessage(gImg, 'buffer', {});
        const b64 = buf.toString('base64');
        setSetting(m.chat, 'goodbyeImg', b64);
        reply('✓ Goodbye image set');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'banlist': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const bannedEntries = Object.keys(global.banned || {}).filter(jid => global.banned[jid]);
    if (!bannedEntries.length) return reply('✅ No banned users');
    const rows = bannedEntries.map((jid, i) => [`${i + 1}`, `@${jid.split('@')[0]}`]);
    await sendTable(devtrust, m.chat, { title: 'Banned Users', headerText: `${bannedEntries.length} banned`, rows: [['#', 'User'], ...rows], contextMsg: m });
}
break;
// ===== END NEW GROUP COMMANDS BATCH =====

// ===== NEW TEXT/MATH UTILITY COMMANDS BATCH (pure JS, no external API) =====
case 'mute': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const muteTimeMatch = text?.match(/^(\d+)(s|m|h|hr|d|w)$/i);
    const muteUnitMap = { s:1000, m:60000, h:3600000, hr:3600000, d:86400000, w:604800000 };
    try {
        const muteMeta = await devtrust.groupMetadata(m.chat);
        if (muteMeta.announce) return reply('✘ Group is already muted');
        await devtrust.groupSettingUpdate(m.chat, 'announcement');
        if (!muteTimeMatch) return reply('✓ Group muted');
        const muteMs = parseInt(muteTimeMatch[1]) * (muteUnitMap[muteTimeMatch[2].toLowerCase()] || 60000);
        if (muteMs > 604800000) return reply('✘ Max mute time is 7 days');
        reply(`✓ Group muted for ${muteTimeMatch[1]}${muteTimeMatch[2]}`);
        if (global.activeTimers?.has(m.chat)) clearTimeout(global.activeTimers.get(m.chat));
        if (!global.activeTimers) global.activeTimers = new Map();
        const muteTid = setTimeout(async () => {
            try {
                await devtrust.groupSettingUpdate(m.chat, 'not_announcement');
                await devtrust.sendMessage(m.chat, { text: '✓ Group auto-unmuted' });
                global.activeTimers.delete(m.chat);
            } catch (e) {}
        }, muteMs);
        global.activeTimers.set(m.chat, muteTid);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== UNMUTE GROUP =====
case 'unmute': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        const unmuteMeta = await devtrust.groupMetadata(m.chat);
        if (!unmuteMeta.announce) return reply('✘ Group is not muted');
        if (global.activeTimers?.has(m.chat)) {
            clearTimeout(global.activeTimers.get(m.chat));
            global.activeTimers.delete(m.chat);
        }
        await devtrust.groupSettingUpdate(m.chat, 'not_announcement');
        reply('✓ Group unmuted');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== GROUP INVITE LINK =====
case 'lock': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        await devtrust.groupSettingUpdate(m.chat, 'locked');
        reply('🔒 Group settings locked — admins only');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'unlock': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        await devtrust.groupSettingUpdate(m.chat, 'unlocked');
        reply('🔓 Group settings unlocked — all members can edit');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== OPEN / CLOSE GROUP =====
case 'open':
case 'groupopen': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        await devtrust.groupSettingUpdate(m.chat, 'not_announcement');
        reply('🔓 Group opened! Everyone can now send messages.');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

case 'close':
case 'groupclose': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    try {
        await devtrust.groupSettingUpdate(m.chat, 'announcement');
        reply('🔒 Group closed! Only admins can send messages.');
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== DELETE MESSAGE (FIXED) =====
case 'warn': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const warnMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const warnUser = warnMentioned[0] || m.quoted?.sender;
    if (!warnUser) return reply('✘ Reply to or mention a user');
    const WARN_FILE = './database/group_warns.json';
    let warnData = {};
    try { warnData = JSON.parse(fs.readFileSync(WARN_FILE)); } catch(e) {}
    if (!warnData[m.chat]) warnData[m.chat] = {};
    if (!warnData[m.chat][warnUser]) warnData[m.chat][warnUser] = 0;
    warnData[m.chat][warnUser]++;
    const warnCount = warnData[m.chat][warnUser];
    const warnMax = 3;
    fs.writeFileSync(WARN_FILE, JSON.stringify(warnData, null, 2));
    if (warnCount >= warnMax) {
        reply(`⚠️ @${warnUser.split('@')[0]} exceeded ${warnMax} warnings! Kicking...`, [warnUser]);
        warnData[m.chat][warnUser] = 0;
        fs.writeFileSync(WARN_FILE, JSON.stringify(warnData, null, 2));
        try { await devtrust.groupParticipantsUpdate(m.chat, [warnUser], 'remove'); } catch (e) {}
    } else {
        reply(
`⚠️ *WARNING*
👤 User: @${warnUser.split('@')[0]}
📋 Reason: ${text || 'Not specified'}
🔢 Count: ${warnCount}/${warnMax}`, [warnUser]);
    }
}
break;

case 'resetwarn':
case 'clearwarn': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const rwMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const rwUser = rwMentioned[0] || m.quoted?.sender;
    if (!rwUser) return reply('✘ Reply to or mention a user');
    const WARN_FILE2 = './database/group_warns.json';
    let rwData = {};
    try { rwData = JSON.parse(fs.readFileSync(WARN_FILE2)); } catch(e) {}
    if (rwData[m.chat]) delete rwData[m.chat][rwUser];
    fs.writeFileSync(WARN_FILE2, JSON.stringify(rwData, null, 2));
    reply(`✓ Warnings cleared for @${rwUser.split('@')[0]}`, [rwUser]);
}
break;

case 'warnlist': {
    if (!m.isGroup) return reply('✘ Groups only');
    const WARN_FILE3 = './database/group_warns.json';
    let wlData = {};
    try { wlData = JSON.parse(fs.readFileSync(WARN_FILE3)); } catch(e) {}
    const wlEntries = Object.entries(wlData[m.chat] || {}).filter(([,v]) => v > 0);
    if (!wlEntries.length) return reply('✓ No active warnings in this group');
    const wlList = wlEntries.map(([j, c]) => `• @${j.split('@')[0]}: ${c} warn(s)`).join('\n');
    reply(`*⚠️ Warning List*\n\n${wlList}`, wlEntries.map(([j]) => j));
}
break;

// ===== KICK ALL =====
case 'muteuser': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const muMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const muUser = muMentioned[0] || m.quoted?.sender;
    if (!muUser) return reply('✘ Reply to or mention a user');
    const stickersOnly = args.includes('stickers') || args.includes('stickersonly');
    if (!global.muted) global.muted = {};
    if (!global.muted[m.chat]) global.muted[m.chat] = [];
    if (global.muted[m.chat].some(e => (typeof e === 'string' ? e : e.jid) === muUser)) {
        return reply(`✘ @${muUser.split('@')[0]} is already muted`, [muUser]);
    }
    global.muted[m.chat].push(stickersOnly ? { jid: muUser, stickersOnly: true } : muUser);
    saveMutedData(global.muted);
    reply(stickersOnly
        ? `🔇 @${muUser.split('@')[0]} muted — text blocked, stickers still allowed`
        : `🔇 @${muUser.split('@')[0]} muted — their messages will be deleted`, [muUser]);
}
break;

case 'unmuteuser': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const umMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const umUser = umMentioned[0] || m.quoted?.sender;
    if (!umUser) return reply('✘ Reply to or mention a user');
    const isMuted = global.muted?.[m.chat]?.some(e => (typeof e === 'string' ? e : e.jid) === umUser);
    if (!isMuted) return reply(`✘ @${umUser.split('@')[0]} is not muted`, [umUser]);
    global.muted[m.chat] = global.muted[m.chat].filter(e => (typeof e === 'string' ? e : e.jid) !== umUser);
    saveMutedData(global.muted);
    reply(`🔊 @${umUser.split('@')[0]} unmuted`, [umUser]);
}
break;

// ===== POLL =====
case 'poll': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!text) return reply(`Usage: ${prefix}poll Question | Option1 | Option2 | Option3`);
    const pollParts = text.split('|').map(p => p.trim());
    if (pollParts.length < 3) return reply(`✘ Need a question and at least 2 options\nExample: ${prefix}poll Who is best? | Bot A | Bot B`);
    try {
        await devtrust.sendMessage(m.chat, {
            poll: { name: pollParts[0], values: pollParts.slice(1), selectableCount: 1 }
        });
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== KICKR =====
    default:
      return false;
  }
  return true;
};
