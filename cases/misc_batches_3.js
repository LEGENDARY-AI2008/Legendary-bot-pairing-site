// Auto-extracted from case.js — commands originally under section(s):
//   - AFRICAN FACT
//   - AGE CALC
//   - ANTONYM
//   - BINARY
//   - BIRTHDAY
//   - BMI
//   - BOT INFO
//   - CHOOSE
//   - COMPLIMENT
//   - FORTUNE COOKIE
//   - GROUP LINK 2
//   - HEX CONV
//   - HISTORY FACT
//   - IGBO
//   - INSPIRE
//   - IQ TEST
//   - JOKE
//   - LIST ADMINS
//   - LUCKY NUMBERS
//   - MARRY
//   - MOTIVATION
//   - NAIJA FOOD
//   - NAIJA SLANG
//   - NIGERIAN FACT
//   - PIGIN
//   - PUN
//   - PUNCH
//   - RAM/MEMORY
//   - RANDOM NUMBER
//   - RATE
//   - ROAST
//   - ROMAN NUMERALS
//   - SCIENCE FACT
//   - SHOOT
//   - SOCIAL CAPTIONS
//   - SYNONYM
//   - TAGALL 2
//   - TAROT
//   - TECH FACT
//   - TEXT TOOLS
//   - TIMESTAMP
//   - UPTIME
//   - YORUBA
//   - ZODIAC
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case 'synonym': {
    if (!text) return reply(`📚 Usage: ${prefix}synonym happy`);
    try {
        const synRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text.trim())}`, { timeout: 10000 });
        const synData = synRes.data?.[0];
        const synList = synData?.meanings?.flatMap(mn => mn.definitions?.flatMap(d => d.synonyms || []) || []) || [];
        const synMeaning = synData?.meanings?.flatMap(mn => mn.synonyms || []) || [];
        const allSyn = [...new Set([...synList, ...synMeaning])].slice(0, 15);
        if (!allSyn.length) return reply(`❌ No synonyms found for "${text}"`);
        reply(`📚 *Synonyms for "${text}":*\n\n${allSyn.join(', ')}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
}
break;

// ===== ANTONYM =====
case 'antonym': {
    if (!text) return reply(`📚 Usage: ${prefix}antonym happy`);
    try {
        const antRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text.trim())}`, { timeout: 10000 });
        const antData = antRes.data?.[0];
        const antList = antData?.meanings?.flatMap(mn => mn.definitions?.flatMap(d => d.antonyms || []) || []) || [];
        const antMeaning = antData?.meanings?.flatMap(mn => mn.antonyms || []) || [];
        const allAnt = [...new Set([...antList, ...antMeaning])].slice(0, 15);
        if (!allAnt.length) return reply(`❌ No antonyms found for "${text}"`);
        reply(`📚 *Antonyms for "${text}":*\n\n${allAnt.join(', ')}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
}
break;

// weather handled above (use .weather, .weather2, .weatherinfo, .weatherdetail, .wttr)

// ===== COUNTRY INFO =====
// [REMOVED DUPLICATE: country]

// ===== IP LOOKUP =====
// [REMOVED DUPLICATE: ip]

// ===== GITHUB PROFILE =====
// [REMOVED DUPLICATE: github]

// ===== URL SHORTENER =====
// [REMOVED DUPLICATE: shorturl]

// ===== NASA PICTURE OF THE DAY =====
// [REMOVED DUPLICATE: nasa]

// ===== NOTES SYSTEM =====
case 'tagall2': {
    if (!m.isGroup) return reply('❌ Group only');
    try {
        const tagMeta = await devtrust.groupMetadata(m.chat);
        const tagMembers = tagMeta.participants;
        let tagText = text ? `📢 *${text}*\n\n` : '📢 *Attention everyone:*\n\n';
        const tagMentions = tagMembers.map(p => p.id);
        tagMentions.forEach(jid => { tagText += `@${jid.split('@')[0]} `; });
        await devtrust.sendMessage(m.chat, { text: tagText, mentions: tagMentions }, { quoted: m });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
}
break;

// ===== GROUP LINK 2 =====
case 'gclink2': {
    if (!m.isGroup) return reply('❌ Group only');
    try {
        const glCode = await devtrust.groupInviteCode(m.chat);
        reply(`🔗 *Group Link:*\nhttps://chat.whatsapp.com/${glCode}`);
    } catch (e) { reply(`❌ Error: ${e.message}`); }
}
break;

// ===== MEMBER COUNT =====
// [REMOVED DUPLICATE: membercount]

// ===== LIST ADMINS =====
case 'listadmins': {
    if (!m.isGroup) return reply('❌ Group only');
    try {
        const adMeta = await devtrust.groupMetadata(m.chat);
        const adList = adMeta.participants.filter(p => p.admin);
        let adText = `👑 *Group Admins (${adList.length}):*\n\n`;
        const adMentions = adList.map(p => p.id);
        adList.forEach(p => { adText += `• @${p.id.split('@')[0]}\n`; });
        await devtrust.sendMessage(m.chat, { text: adText, mentions: adMentions }, { quoted: m });
    } catch (e) { reply(`❌ Error: ${e.message}`); }
}
break;

// ===== BOT INFO =====
case 'botinfo': {
    reply(`🤖 *${botDisplayName} Info*\n\n*Name:* ${botDisplayName}\n*Version:* 3.0.0\n*Brand:* LËGĚNDÃRY Ł𝗮𝗯𝘀™\n*Framework:* Baileys\n*Language:* Node.js\n*Status:* ✅ Active & Listening\n*Commands:* 800+\n\n_© ${botDisplayName} BY LËGĚNDÃRY Ł𝗮𝗯𝘀™_`);
}
break;

// ===== UPTIME =====
case 'uptime2': {
    const upMs = process.uptime() * 1000;
    const upHrs = Math.floor(upMs / 3600000);
    const upMins = Math.floor((upMs % 3600000) / 60000);
    const upSecs = Math.floor((upMs % 60000) / 1000);
    reply(`⚡ *${botDisplayName} Uptime*\n\n🕐 *${upHrs}h ${upMins}m ${upSecs}s*\n✅ Running perfectly!`);
}
break;

// ===== SPEED TEST =====
// [REMOVED DUPLICATE: speed]

// ===== RAM/MEMORY =====
case 'ram': {
    const memUsed = process.memoryUsage();
    const mbUsed = (memUsed.heapUsed / 1024 / 1024).toFixed(2);
    const mbTotal = (memUsed.heapTotal / 1024 / 1024).toFixed(2);
    reply(`💾 *Bot Memory*\n\n*Heap Used:* ${mbUsed} MB\n*Heap Total:* ${mbTotal} MB\n*Status:* ${mbUsed < 200 ? '✅ Good' : '⚠️ Heavy'}`);
}
break;

// ===== TIMESTAMP =====
case 'timestamp': {
    const tsNow = Date.now();
    reply(`🕐 *Timestamp*\n\n*Unix (ms):* ${tsNow}\n*Unix (s):* ${Math.floor(tsNow / 1000)}\n*UTC:* ${new Date(tsNow).toUTCString()}`);
}
break;

// ===== FUN: 8BALL =====
// [REMOVED DUPLICATE: 8ball]

// dice handled above (use .dice, .roll, .dicegamble)

// ===== COIN FLIP =====
// [REMOVED DUPLICATE: coinflip]

// ===== CHOOSE =====
case 'choose': {
    if (!text) return reply(`Usage: ${prefix}choose option1 / option2 / option3`);
    const chooseOpts = text.split('/').map(s => s.trim()).filter(Boolean);
    if (chooseOpts.length < 2) return reply('Give me at least 2 options separated by /');
    reply(`🎲 *I choose:*\n\n*${chooseOpts[Math.floor(Math.random() * chooseOpts.length)]}* ✅`);
}
break;

// ===== SHIP =====
// [REMOVED DUPLICATE: ship]

// ===== RATE =====
case 'rate': {
    const rateTarget = text || m.pushName;
    const rateNum = Math.floor(Math.random() * 10) + 1;
    const rateEmoji = rateNum >= 8 ? '🔥' : rateNum >= 5 ? '😊' : '😅';
    reply(`⭐ *Rating for ${rateTarget}:*\n\n${'⭐'.repeat(rateNum)}${'☆'.repeat(10-rateNum)}\n\n*${rateNum}/10* ${rateEmoji}`);
}
break;

// ===== TRUTH =====
// [REMOVED DUPLICATE: truth]

// ===== DARE =====
// [REMOVED DUPLICATE: dare]

// ===== WOULD YOU RATHER =====
// [REMOVED DUPLICATE: wyr]

// ===== FORTUNE COOKIE =====
case 'fortune': {
    const fortunes = ['🥠 A beautiful surprise is coming your way.','🥠 Your hard work will pay off greatly.','🥠 Someone is thinking of you right now.','🥠 An unexpected friendship will change your life.','🥠 The answer to your problem is simpler than you think.','🥠 You will soon receive very good news.','🥠 Believe in yourself — others already do.','🥠 A great opportunity is just around the corner.'];
    reply(fortunes[Math.floor(Math.random() * fortunes.length)]);
}
break;

// ===== RIDDLE =====
// [REMOVED DUPLICATE: riddle]

// ===== TRIVIA =====
// [REMOVED DUPLICATE: trivia]

// ===== FUN FACT =====
// funfact handled above

// ===== ANIME QUOTE =====
// [REMOVED DUPLICATE: animequote]

// ===== MOTIVATION =====
case 'motivation': {
    const motivations = ['🔥 *Wake up. Grind. Win. Repeat.*\n\nEvery morning is a new opportunity!','💪 *Your setback is setting you up for a comeback.*','🏆 *Champions are made in moments they don\'t feel like it.*\n\nPush through!','⚡ *Stop waiting for the perfect moment. Start NOW.*','💎 *Diamonds are made under pressure. So are champions.*','🔑 *The secret to getting ahead is getting started.*'];
    reply(motivations[Math.floor(Math.random() * motivations.length)]);
}
break;

// ===== INSPIRE =====
case 'inspire':
case 'quote2': {
    const inspireQuotes = ['"The secret of getting ahead is getting started." – Mark Twain','"It always seems impossible until it\'s done." – Nelson Mandela','"The future belongs to those who believe in the beauty of their dreams." – Eleanor Roosevelt','"Hardships often prepare ordinary people for an extraordinary destiny." – C.S. Lewis','"Believe you can and you\'re halfway there." – Theodore Roosevelt','"The only way to do great work is to love what you do." – Steve Jobs','"In the middle of every difficulty lies opportunity." – Einstein'];
    reply(`💡 *Daily Inspiration*\n\n_${inspireQuotes[Math.floor(Math.random() * inspireQuotes.length)]}_`);
}
break;

// ===== JOKE =====
case 'joke2': {
    const jokeList = ['Why don\'t scientists trust atoms? Because they make up everything! 😂','Why did the scarecrow win an award? He was outstanding in his field! 🌾','I told my wife she was drawing her eyebrows too high. She looked surprised! 😳','I\'m reading a book about anti-gravity. It\'s impossible to put down! 📚','What do you call fake spaghetti? An impasta! 🍝','Why did the bicycle fall over? It was two-tired! 🚲'];
    reply(`😂 *Joke:*\n\n${jokeList[Math.floor(Math.random() * jokeList.length)]}`);
}
break;

// ===== PUN =====
case 'pun': {
    const punList = ['Time flies like an arrow. Fruit flies like a banana. 🍌','I used to hate facial hair, but then it grew on me. 🧔','I\'m on a seafood diet. I see food and I eat it. 🍕','I used to be a banker but I lost interest. 💰','I\'m afraid of elevators but I\'m taking steps to avoid them! 🪜'];
    reply(`🤣 *Pun Alert:*\n\n_${punList[Math.floor(Math.random() * punList.length)]}_`);
}
break;

// ===== HISTORY FACT =====
case 'history': {
    const historyFacts = ['📜 Cleopatra lived closer in time to the Moon landing than to the Great Pyramid.','⚔️ The shortest war lasted 38 minutes — Britain vs Zanzibar, 1896.','🏛️ Oxford University is older than the Aztec Empire.','🎭 Shakespeare invented over 1,700 words we still use today.','🇳🇬 Nigeria has the largest economy in Africa.','📖 The world\'s oldest university (Al-Qarawiyyin) is in Morocco, founded 859 AD.'];
    reply(`📜 *History Fact:*\n\n${historyFacts[Math.floor(Math.random() * historyFacts.length)]}`);
}
break;

// ===== SCIENCE FACT =====
case 'science': {
    const scienceFacts = ['⚛️ There are more chess positions than atoms in the observable universe.','💡 The human eye can distinguish about 10 million different colors.','⚡ A bolt of lightning is 5 times hotter than the surface of the sun.','🌌 The Milky Way has 100-400 billion stars.','🌊 The ocean produces over 50% of the world\'s oxygen.','💻 The human brain has about 86 billion neurons.'];
    reply(`🔬 *Science Fact:*\n\n${scienceFacts[Math.floor(Math.random() * scienceFacts.length)]}`);
}
break;

// ===== TECH FACT =====
case 'tech': {
    const techFacts = ['💻 The first computer mouse was made of wood in 1964.','📱 More people have mobile phones than toothbrushes worldwide.','🌐 The first website went live August 6, 1991.','📧 The first email was sent in 1971 by Ray Tomlinson (to himself).','🔐 The most common password is still "password".','🤯 90% of the world\'s data was created in the last 2 years.'];
    reply(`💻 *Tech Fact:*\n\n${techFacts[Math.floor(Math.random() * techFacts.length)]}`);
}
break;

// ===== AFRICAN FACT =====
case 'africanfact': {
    const africaFacts = ['🌍 Africa is home to the world\'s longest river (Nile) and largest hot desert (Sahara).','🇳🇬 Nigeria alone has over 500 spoken languages.','💎 Africa holds about 30% of the world\'s mineral reserves.','📚 The world\'s oldest university is in Morocco, founded in 859 AD.','🦁 Only Africa has lions, elephants, rhinos, leopards and buffalos together (Big Five).','🌟 By 2050, 1 in 4 humans will be African.'];
    reply(`🌍 *African Fact:*\n\n${africaFacts[Math.floor(Math.random() * africaFacts.length)]}`);
}
break;

// ===== NIGERIAN FACT =====
case 'nigerianfact': {
    const nigeriaFacts = ['🇳🇬 Nigeria has the largest economy in Africa (~$440B GDP).','🎬 Nollywood is the 2nd largest film industry in the world by volume.','👥 Nigeria is the most populous African country — 220M+ people.','🌿 Nigeria is the world\'s largest producer of cassava and yam.','🎵 Afrobeats from Nigeria has taken over the world!','🏙️ Lagos is the largest city in Africa by population.','🎓 Nigeria\'s Wole Soyinka won the Nobel Prize for Literature in 1986.'];
    reply(`🇳🇬 *Nigerian Fact:*\n\n${nigeriaFacts[Math.floor(Math.random() * nigeriaFacts.length)]}`);
}
break;

// ===== NAIJA SLANG =====
case 'slangs':
case 'naijaslangs': {
    const slangs = ['🔥 *Wahala* — Trouble/Problem','⚡ *Shakara* — Showing off','😏 *Sabi* — To know/be skilled','💀 *Scatter* — To mess something up','🏆 *Oga* — Boss/Master','😎 *Badoo* — A super skilled person','🤝 *Omo* — Exclamation of surprise','💰 *Settle* — Bribe or tip','🤣 *Yarn* — To talk/chat','👀 *Pepper dem* — Show success, make people jealous'];
    reply(`🇳🇬 *Naija Slang:*\n\n${slangs[Math.floor(Math.random() * slangs.length)]}`);
}
break;

// ===== NAIJA FOOD =====
case 'naijafood': {
    const naijFoods = ['🍲 Jollof Rice — the GOAT of all rice dishes!','🫕 Egusi Soup — thick, rich and full of protein!','🍖 Suya — spicy grilled meat perfection!','🥘 Banga Soup — palm fruit goodness!','🍛 Eba and Okra — the classic combo!','🥩 Pepper Soup — cure for everything!','🫘 Akara — bean cakes for breakfast!','🍠 Pounded Yam and Egusi — the heavyweight champ!'];
    reply(`🇳🇬 *Naija Food:*\n\n${naijFoods[Math.floor(Math.random() * naijFoods.length)]}`);
}
break;

// ===== ZODIAC =====
case 'zodiac': {
    if (!text) return reply(`♈ Usage: ${prefix}zodiac aries\nSigns: aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces`);
    const zodiacInfo = {aries:{symbol:'♈',dates:'Mar 21–Apr 19',element:'🔥 Fire',compatible:'Leo, Sagittarius'},taurus:{symbol:'♉',dates:'Apr 20–May 20',element:'🌍 Earth',compatible:'Virgo, Capricorn'},gemini:{symbol:'♊',dates:'May 21–Jun 20',element:'💨 Air',compatible:'Libra, Aquarius'},cancer:{symbol:'♋',dates:'Jun 21–Jul 22',element:'💧 Water',compatible:'Scorpio, Pisces'},leo:{symbol:'♌',dates:'Jul 23–Aug 22',element:'🔥 Fire',compatible:'Aries, Sagittarius'},virgo:{symbol:'♍',dates:'Aug 23–Sep 22',element:'🌍 Earth',compatible:'Taurus, Capricorn'},libra:{symbol:'♎',dates:'Sep 23–Oct 22',element:'💨 Air',compatible:'Gemini, Aquarius'},scorpio:{symbol:'♏',dates:'Oct 23–Nov 21',element:'💧 Water',compatible:'Cancer, Pisces'},sagittarius:{symbol:'♐',dates:'Nov 22–Dec 21',element:'🔥 Fire',compatible:'Aries, Leo'},capricorn:{symbol:'♑',dates:'Dec 22–Jan 19',element:'🌍 Earth',compatible:'Taurus, Virgo'},aquarius:{symbol:'♒',dates:'Jan 20–Feb 18',element:'💨 Air',compatible:'Gemini, Libra'},pisces:{symbol:'♓',dates:'Feb 19–Mar 20',element:'💧 Water',compatible:'Cancer, Scorpio'}};
    const zodSign = zodiacInfo[text.toLowerCase()];
    if (!zodSign) return reply('❌ Invalid sign. Use: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces');
    reply(`${zodSign.symbol} *${text.toUpperCase()}*\n\n📅 Dates: ${zodSign.dates}\n${zodSign.element}\n💕 Compatible: ${zodSign.compatible}`);
}
break;

// ===== TAROT =====
case 'tarot': {
    const tarotCards = [{name:'The Fool',meaning:'New beginnings, adventure'},{name:'The Magician',meaning:'Power, skill, willpower'},{name:'The High Priestess',meaning:'Intuition, wisdom'},{name:'The Empress',meaning:'Abundance, creativity'},{name:'The Emperor',meaning:'Authority, stability'},{name:'The Lovers',meaning:'Love, harmony, choices'},{name:'The Chariot',meaning:'Control, success, determination'},{name:'Strength',meaning:'Courage, patience'},{name:'The Hermit',meaning:'Introspection, guidance'},{name:'Wheel of Fortune',meaning:'Change, fate, luck'},{name:'The Star',meaning:'Hope, serenity'},{name:'The Sun',meaning:'Success, positivity'},{name:'The World',meaning:'Completion, achievement'}];
    const tarot = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    reply(`🃏 *Tarot Card for You:*\n\n*${tarot.name}*\n\n✨ *Meaning:* ${tarot.meaning}\n\n_The universe speaks to you through this card._ 🌟`);
}
break;

// ===== LUCKY NUMBERS =====
case 'lucky': {
    const luckyNums = [];
    while (luckyNums.length < 6) { const n = Math.floor(Math.random() * 49) + 1; if (!luckyNums.includes(n)) luckyNums.push(n); }
    luckyNums.sort((a, b) => a - b);
    reply(`🍀 *Your Lucky Numbers Today:*\n\n${luckyNums.join(' - ')}\n\n_Good luck, legend!_ ✨`);
}
break;

// ===== IQ TEST =====
case 'iqtest': {
    const iqTarget = text || m.pushName;
    const iqScore = Math.floor(Math.random() * 60) + 70;
    const iqCat = iqScore >= 130 ? '🧠 Genius' : iqScore >= 120 ? '✨ Very Superior' : iqScore >= 110 ? '😊 High Average' : iqScore >= 90 ? '👍 Average' : '🤔 Below Average';
    reply(`🧠 *IQ Test Result*\n\n*Person:* ${iqTarget}\n*IQ Score:* ${iqScore}\n*Category:* ${iqCat}\n\n_Just for fun! 😄_`);
}
break;

// ===== BMI =====
case 'bmi': {
    if (!text) return reply(`Usage: ${prefix}bmi 70 175\n(weight kg, height cm)`);
    const bmiParts = text.trim().split(/\s+/);
    if (bmiParts.length < 2) return reply('❌ Need weight and height');
    const bmiW = parseFloat(bmiParts[0]);
    const bmiH = parseFloat(bmiParts[1]) / 100;
    if (isNaN(bmiW) || isNaN(bmiH)) return reply('❌ Invalid values');
    const bmiVal = (bmiW / (bmiH * bmiH)).toFixed(1);
    const bmiCat = bmiVal < 18.5 ? '🔵 Underweight' : bmiVal < 25 ? '✅ Normal' : bmiVal < 30 ? '🟡 Overweight' : '🔴 Obese';
    reply(`⚖️ *BMI*\n\n*Weight:* ${bmiW} kg\n*Height:* ${bmiParts[1]} cm\n*BMI:* ${bmiVal}\n*Status:* ${bmiCat}`);
}
break;

// ===== AGE CALC =====
case 'age': {
    if (!text) return reply(`Usage: ${prefix}age DD/MM/YYYY`);
    try {
        const [ageDd, ageMm, ageYyyy] = text.split('/').map(Number);
        const ageBirth = new Date(ageYyyy, ageMm - 1, ageDd);
        const ageNow = new Date();
        let ageYears = ageNow.getFullYear() - ageBirth.getFullYear();
        let ageMonths = ageNow.getMonth() - ageBirth.getMonth();
        if (ageMonths < 0) { ageYears--; ageMonths += 12; }
        reply(`🎂 *Age*\n\n*Birthday:* ${text}\n*Age:* ${ageYears} years, ${ageMonths} months\n*Days lived:* ~${(ageYears * 365.25).toFixed(0)}`);
    } catch (e) { reply('❌ Use DD/MM/YYYY format'); }
}
break;

// ===== TEMP CONVERTER =====
case 'roman': {
    if (!text) return reply(`Usage: ${prefix}roman 2024`);
    const romanNum = parseInt(text);
    if (isNaN(romanNum) || romanNum < 1 || romanNum > 3999) return reply('❌ Enter a number 1–3999');
    const romanVals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let romanResult = '';
    let romanN = romanNum;
    for (const [val, sym] of romanVals) { while (romanN >= val) { romanResult += sym; romanN -= val; } }
    reply(`🏛️ *${romanNum} = ${romanResult}*`);
}
break;

// ===== BINARY =====
case 'tobin': {
    if (!text) return reply(`Usage: ${prefix}tobin 42`);
    const binNum = parseInt(text);
    if (isNaN(binNum)) return reply('❌ Enter a valid number');
    reply(`💻 *${binNum} in Binary:* \`${binNum.toString(2)}\``);
}
break;

// ===== HEX CONV =====
case 'tohex': {
    if (!text) return reply(`Usage: ${prefix}tohex 255`);
    const hexNum = parseInt(text);
    if (isNaN(hexNum)) return reply('❌ Enter a valid number');
    reply(`💻 *${hexNum} in Hex:* \`0x${hexNum.toString(16).toUpperCase()}\``);
}
break;

// ===== ENCODE/DECODE =====
// [REMOVED DUPLICATE: encode]
// [REMOVED DUPLICATE: decode]

// genpass/password handled above

// ===== RANDOM NUMBER =====
case 'random': {
    const randParts = (text || '1 100').trim().split(/\s+/);
    const randMin = parseInt(randParts[0]) || 1;
    const randMax = parseInt(randParts[1]) || 100;
    if (randMin >= randMax) return reply('❌ Min must be less than max');
    reply(`🎲 *Random (${randMin}–${randMax}):* *${Math.floor(Math.random() * (randMax - randMin + 1)) + randMin}*`);
}
break;

// uuid handled above

// ===== TEXT TOOLS =====
// upper/lower/reversetext/wordcount handled above
case 'mock': { if (!text) return reply(`Usage: ${prefix}mock text`); reply(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')); } break;

// ===== FANCY TEXT =====
case 'caption': {
    const captions = ['✨ "Living my best life, one day at a time." 🌟','🔥 "They told me I couldn\'t. That\'s why I did." 💪','💎 "Stay low key. Not everyone deserves a front row seat to your life." 🤫','🌟 "Grateful, blessed, and highly favored." 🙏','⚡ "I came. I saw. I conquered." 🔥','💕 "Love yourself first." ❤️','🏆 "Success is the best revenge." 👑','🌈 "Chasing dreams, not people." 🦋'];
    reply(`📸 *Caption Idea:*\n\n${captions[Math.floor(Math.random() * captions.length)]}`);
}
break;

case 'bioidea': {
    const bios = ['✨ Just a soul trying to leave a mark on this earth. 🌍','🔥 Too blessed to be stressed. Grinding in silence. 💪','💫 Dream big. Hustle harder. Stay humble. 🏆','⚡ Not for everybody. And that\'s okay. 👑','💎 Premium quality, limited availability. 😏','🚀 On a mission. 🔥','🌈 Making memories, not excuses. ✨'];
    reply(`📝 *Bio Idea:*\n\n${bios[Math.floor(Math.random() * bios.length)]}`);
}
break;

// ===== GREETINGS =====
case 'hbd':
case 'birthday': {
    const bTarget = m.mentionedJid?.length ? `@${m.mentionedJid[0].split('@')[0]}` : (text || 'you');
    const bMentions = m.mentionedJid || [];
    await devtrust.sendMessage(m.chat, { text: `🎂 *HAPPY BIRTHDAY!* 🎉\n\n🎈 ${bTarget} 🎈\n\nMay this special day bring you:\n🎁 All the love in the world\n✨ Blessings beyond measure\n💎 Health, wealth and happiness\n\n_Happy Birthday from ${botDisplayName}!_ 🎂🎊🥳`, mentions: bMentions }, { quoted: m });
}
break;

// ===== LOVE MESSAGE =====
// [REMOVED DUPLICATE: love]

// ===== HUG =====
// [REMOVED DUPLICATE: hug]

// ===== SLAP =====
// [REMOVED DUPLICATE: slap]

// ===== PUNCH =====
case 'punch': {
    const punchTarget = m.mentionedJid?.length ? `@${m.mentionedJid[0].split('@')[0]}` : (text || 'someone');
    reply(`👊 *${m.pushName}* throws a punch at ${punchTarget}! KAPOW! 💥`);
}
break;

// ===== SHOOT =====
case 'shoot': {
    const shootTarget = m.mentionedJid?.length ? `@${m.mentionedJid[0].split('@')[0]}` : (text || 'someone');
    reply(`🔫 *${m.pushName}* shoots ${shootTarget}! PEW PEW! 😂`);
}
break;

// ===== MARRY =====
case 'marry': {
    const marryTarget = m.mentionedJid?.length ? `@${m.mentionedJid[0].split('@')[0]}` : (text || 'someone');
    reply(`💍 *${m.pushName}* proposes to ${marryTarget}!\n\n_Will you marry me? 💕_`);
}
break;

// ===== ROAST =====
case 'roast2': {
    const roasts = ['Your Wi-Fi password is probably "password123". 😂','You\'re like a software update. Whenever I see you, I think "not now". 😂','If ignorance is bliss, you must be the happiest person alive. 😂','You\'re the reason phones have a mute button. 😂','I\'d insult you but my mama said I had to be kind to the special ones. 😂'];
    const roastTarget = m.mentionedJid?.length ? `@${m.mentionedJid[0].split('@')[0]}` : (text || 'you');
    const roastMentions = m.mentionedJid || [];
    await devtrust.sendMessage(m.chat, { text: `🔥 *ROAST for ${roastTarget}:*\n\n${roasts[Math.floor(Math.random() * roasts.length)]}\n\n_Just jokes fam! 😂_`, mentions: roastMentions }, { quoted: m });
}
break;

// ===== COMPLIMENT =====
case 'comp': {
    const compliments = ['✨ You are absolutely amazing!','🌟 You light up every room you walk into!','💪 Your strength is remarkable.','🌸 You make the world a better place.','🦋 Your creativity knows no bounds!','🏆 You are a true champion.','💎 You are rarer and more precious than any diamond.'];
    const compTarget = m.mentionedJid?.length ? `@${m.mentionedJid[0].split('@')[0]}` : (text || m.pushName);
    reply(`💌 *For ${compTarget}:*\n\n${compliments[Math.floor(Math.random() * compliments.length)]}`);
}
break;

// ===== INSULT (JOKE) =====
// [REMOVED DUPLICATE: insult]

// ===== PIGIN =====
case 'pidgin': {
    const pidginPhrases = ['E don do! 🔥','Abeg no vex me today o!','Na so e be','I go show you pepper! 🌶️','Shine your eyes!','No be small thing o!','E don set! ✅','We move!','Sharp sharp! ⚡','You sabi this thing gan gan!','We outside! 🎉'];
    reply(`🇳🇬 *Naija Talk:*\n\n_${pidginPhrases[Math.floor(Math.random() * pidginPhrases.length)]}_`);
}
break;

// ===== YORUBA =====
case 'yoruba': {
    const yoruba = ['E kaaro — Good morning 🌅','E kaasan — Good afternoon ☀️','E kaale — Good evening 🌆','E dabo — Goodbye 👋','Ese — Thank you 🙏','Pele — Sorry / Take care 💕','Mo fe e — I love you ❤️','Bawo ni — How are you? 😊','O daro — Good night 🌙'];
    reply(`🌍 *Yoruba:*\n\n_${yoruba[Math.floor(Math.random() * yoruba.length)]}_`);
}
break;

// ===== IGBO =====
case 'igbo': {
    const igbo = ['Ututu oma — Good morning 🌅','Ehihie oma — Good afternoon ☀️','Daalu — Thank you 🙏','Obi dị mma — I am fine 😊','Nke a dị mma — This is good 🔥','Anọ m jikere — I am ready ✅'];
    reply(`🌍 *Igbo:*\n\n_${igbo[Math.floor(Math.random() * igbo.length)]}_`);
}
break;

// ===== HAUSA =====
    default:
      return false;
  }
  return true;
};
