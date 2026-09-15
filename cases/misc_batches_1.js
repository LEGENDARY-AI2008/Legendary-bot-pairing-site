// Auto-extracted from case.js — commands originally under section(s):
//   - 300 NEW COMMANDS
//   - BIBLE
//   - BIO
//   - CALCULATOR
//   - FORWARD
//   - Get Your Free Bot Command
//   - IP LOOKUP
//   - LEGENDARY! ACTIVE AND LISTENING
//   - LOGO / MAKER — DISABLED
//   - NGL
//   - READMORE
//   - SHAZAM / AUDIO IDENTIFY
//   - SPOTIFY FIXED
//   - TRANSLATE
//   - WALINK
//   - WEATHER
//   - WIKIPEDIA
//   - YOUTUBE FIXED
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case 'test': {
  let botInfo =
'*${botDisplayName} ᴀʟᴡᴀʏs ᴛʜᴇʀᴇ ғᴏʀ ʏᴏᴜ 🚀🔥*'

  reply(botInfo);
}

break;


case 'antilink': {
    if (!m.isGroup) return reply("👥 *Groups only*");
    if (!isAdmins && !isCreator) return reply("🔒 *Admins only*");
    
    if (!args[0]) {
        // Check if this group has antilink settings
        const groupSettings = antilinkSettings[getAntilinkKey(botNumber, m.chat)] || { enabled: false, action: 'delete' };
        const status = groupSettings.enabled ? 'ON ✅' : 'OFF ❌';
        const action = groupSettings.enabled ? groupSettings.action : '-';
        
        return reply(`🔗 *Anti-Link*\n\n` +
                     `📌 *Usage:*\n` +
                     `▸ ${prefix}antilink on - Enable (delete mode)\n` +
                     `▸ ${prefix}antilink delete - Enable delete mode\n` +
                     `▸ ${prefix}antilink kick - Enable kick mode (instant)\n` +
                     `▸ ${prefix}antilink <number> - Delete + warn, kick after N warnings (e.g. ${prefix}antilink 3)\n` +
                     `▸ ${prefix}antilink off - Disable\n\n` +
                     `⚙️ *Status:* ${status}\n` +
                     `⚙️ *Action:* ${action}${groupSettings.action === 'warn' ? ` (limit: ${groupSettings.warnLimit || 3})` : ''}\n\n` +
                     `_When enabled, links will be ${groupSettings.action === 'kick' ? 'deleted and user kicked instantly' : groupSettings.action === 'warn' ? `deleted, with a kick after ${groupSettings.warnLimit || 3} warnings` : 'deleted'}_`);
    }
    
    // Handle a plain number -> warn-count mode
    if (/^\d+$/.test(args[0])) {
        const limit = parseInt(args[0]);
        if (limit < 1 || limit > 20) return reply('❌ *Warn limit must be between 1 and 20*');
        antilinkSettings[getAntilinkKey(botNumber, m.chat)] = { enabled: true, action: 'warn', warnLimit: limit };
        saveAntilinkSettings(antilinkSettings);
        reply(`✅ *Anti-Link set to WARN mode*\nLinks get deleted + warned. Kicked after *${limit}* warning(s).`);
    }
    // Handle ON command (default to delete mode)
    else if (args[0].toLowerCase() === 'on') {
        antilinkSettings[getAntilinkKey(botNumber, m.chat)] = { enabled: true, action: 'delete' };
        saveAntilinkSettings(antilinkSettings);
        reply(`✅ *Anti-Link enabled (Delete mode)*\nLinks will be deleted automatically.`);
    }
    // Handle DELETE mode
    else if (args[0].toLowerCase() === 'delete') {
        antilinkSettings[getAntilinkKey(botNumber, m.chat)] = { enabled: true, action: 'delete' };
        saveAntilinkSettings(antilinkSettings);
        reply(`✅ *Anti-Link set to DELETE mode*\nLinks will be deleted.`);
    }
    // Handle KICK mode
    else if (args[0].toLowerCase() === 'kick') {
        antilinkSettings[getAntilinkKey(botNumber, m.chat)] = { enabled: true, action: 'kick' };
        saveAntilinkSettings(antilinkSettings);
        reply(`✅ *Anti-Link set to KICK mode*\nUsers who post links will be kicked.`);
    }
    // Handle OFF
    else if (args[0].toLowerCase() === 'off') {
        if (antilinkSettings[getAntilinkKey(botNumber, m.chat)]) {
            antilinkSettings[getAntilinkKey(botNumber, m.chat)].enabled = false;
            saveAntilinkSettings(antilinkSettings);
            reply(`❌ *Anti-Link disabled for this group*`);
        } else {
            reply(`⚠️ *Anti-Link is already disabled*`);
        }
    }
    else {
        reply(`❌ *Invalid option. Use: on, delete, kick, or off*`);
    }
}
break;

// ======================[ 👥 TOTAL MEMBERS ]======================
case "shazam":
case "findaudio":
case "find":
case "identifyaudio": {
    const shzQuoted = m.quoted || m;
    const shzMime = (shzQuoted?.msg || shzQuoted)?.mimetype || '';
    const shzIsAudioOrVideo = /audio|video/.test(shzMime)
        || shzQuoted?.message?.audioMessage
        || shzQuoted?.message?.videoMessage;
    if (!shzIsAudioOrVideo) {
        return reply(`🎶 *Identify a song*\nReply to an audio/video message with ${prefix}shazam`);
    }
    try {
        reply('🎶 *Listening...*');
        const media = await downloadMediaMessage(shzQuoted, 'buffer', {});
        const tmpIn = `./tmp/shazam_in_${Date.now()}.mp3`;
        const tmpOut = `./tmp/shazam_out_${Date.now()}.mp3`;
        fs.writeFileSync(tmpIn, media);

        // ACRCloud only needs a short sample — trim to the first 15s
        await new Promise((res, rej) => {
            ffmpeg(tmpIn).setStartTime(0).setDuration(15).save(tmpOut).on('end', res).on('error', rej);
        });
        const sampleBuffer = fs.readFileSync(tmpOut);
        fs.unlinkSync(tmpIn);
        fs.unlinkSync(tmpOut);

        // Shared ACRCloud key from Legend's reference file — note this is a
        // widely-reused public/demo key (many bot forks embed the same one),
        // so it may be rate-limited or occasionally flaky since others use it too.
        const acr = {
            host: 'identify-eu-west-1.acrcloud.com',
            endpoint: '/v1/identify',
            access_key: '8c21a32a02bf79a4a26cb0fa5c941e95',
            access_secret: 'NRSxpk6fKwEiVdNhyx5lR0DP8LzeflYpClNg1gze',
        };
        const shzTimestamp = Math.floor(Date.now() / 1000);
        const shzStringToSign = ['POST', acr.endpoint, acr.access_key, 'audio', '1', shzTimestamp].join('\n');
        const shzSignature = crypto.createHmac('sha1', acr.access_secret).update(shzStringToSign).digest('base64');

        const shzForm = new FormData();
        shzForm.append('sample', sampleBuffer, { filename: 'sample.mp3' });
        shzForm.append('sample_bytes', sampleBuffer.length);
        shzForm.append('access_key', acr.access_key);
        shzForm.append('data_type', 'audio');
        shzForm.append('signature_version', '1');
        shzForm.append('signature', shzSignature);
        shzForm.append('timestamp', shzTimestamp);

        const acrRes = await axios.post(`https://${acr.host}${acr.endpoint}`, shzForm, { headers: shzForm.getHeaders() });
        const { status, metadata } = acrRes.data;

        if (status.code !== 0 || !metadata?.music?.length) {
            return reply('❌ *Could not identify that song...*');
        }

        const track = metadata.music[0];
        let ytInfo = null;
        try {
            const ytResults = await yts(`${track.title} ${track.artists[0].name}`);
            ytInfo = ytResults.videos[0];
        } catch (_) {}

        const spotifyUrl = track.external_metadata?.spotify?.track?.id
            ? `https://open.spotify.com/track/${track.external_metadata.spotify.track.id}`
            : null;

        const resultText = `🎶 *Song Identified!*\n\n` +
            `➤ *Title:* ${track.title}\n` +
            `➤ *Artist:* ${track.artists.map(a => a.name).join(', ')}\n` +
            `➤ *Album:* ${track.album?.name || 'N/A'}\n` +
            `➤ *Released:* ${track.release_date || 'N/A'}\n\n` +
            (spotifyUrl ? `🎧 *Spotify:* ${spotifyUrl}\n` : '') +
            (ytInfo ? `▶️ *YouTube:* ${ytInfo.url}\n\n_Reply *audio* or *video* to download it!_` : '');

        await devtrust.sendMessage(m.chat, { text: resultText }, { quoted: m });

        if (ytInfo) {
            if (!global.__shazamPending) global.__shazamPending = new Map();
            // stored on `global` (not a plain module variable) since case.js's own
            // hot-reload / freshRequire pattern can otherwise wipe plain state —
            // same fix as the music-reply awaiting state.
            global.__shazamPending.set(m.chat, {
                ytUrl: ytInfo.url,
                title: ytInfo.title,
                expires: Date.now() + 60 * 1000,
            });
        }
    } catch (e) {
        console.error('Shazam error:', e);
        reply(`❌ *Error:* ${e.message}`);
    }
}
break;
// ============ END SHAZAM ============

// Translates the raw Baileys/WhatsApp error strings from group actions
// (kick/promote/demote) into something a non-technical person can act
// on, instead of a bare exception message.
function explainGroupActionError(e) {
    const msg = (e?.message || String(e)).toLowerCase();
    if (msg.includes('forbidden') || msg.includes('not-authorized') || msg.includes('401')) return "I don't have permission to do that — make sure I'm actually an admin here.";
    if (msg.includes('not-acceptable') || msg.includes('406')) return "That person isn't in this group (or already left).";
    if (msg.includes('item-not-found') || msg.includes('404')) return "Couldn't find that member in this group.";
    if (msg.includes('rate') || msg.includes('429')) return "WhatsApp is rate-limiting this action — wait a bit and try again.";
    return e?.message || String(e);
}

// ============ PREXZY API — GENERIC AI CHAT HANDLER ============
// Same idea as prexzyDownloadAndSend but for the plain prompt->text-answer
// AI endpoints. Field names again unverified live, so defensive extraction.
function prexzyExtractAnswer(data) {
    if (!data) return null;
    return data.result || data.response || data.answer || data.message || data.text
        || data.short_url || data.shortUrl || data.shortenedUrl
        || data?.data?.result || data?.data?.response || data?.data?.answer
        || data?.data?.message || data?.data?.text || data?.data?.short_url
        || null;
}
async function prexzyAskAndReply(reply, { endpoint, params, label = '🤖 AI', loadingMsg, showLabel = true }) {
    try {
        if (loadingMsg) reply(loadingMsg);
        const data = await prexzyGet(endpoint, params);
        const answer = prexzyExtractAnswer(data);
        if (data?.status === false || !answer) return reply(`❌ *No response from ${label}.*`);
        reply(showLabel ? `${label}\n\n${answer}` : answer);
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
}

// ============ PREXZY API — DOWNLOADERS ============
case "pickupline": {
    try {
        const pickupLines = [
            "Are you a magician? Because whenever I look at you, everyone else disappears.",
            "Do you have a map? I keep getting lost in your eyes.",
            "Is your name Google? Because you have everything I've been searching for.",
            "If you were a vegetable, you'd be a cute-cumber.",
            "Are you made of copper and tellurium? Because you're Cu-Te.",
            "Do you believe in love at first sight, or should I walk by again?",
            "Are you a parking ticket? Because you've got fine written all over you.",
            "Is there an airport nearby, or is that just my heart taking off?"
        ];
        const data = { status: true, result: pickupLines[Math.floor(Math.random() * pickupLines.length)] };
        const line = data?.result || data?.line || (typeof data === 'string' ? data : null);
        reply(line ? `💘 ${line}` : '❌ *Could not fetch a pickup line.*');
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

case "fact": {
    try {
        const res = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
        const data = { status: true, result: res.data?.text };
        const line = data?.result || data?.fact || (typeof data === 'string' ? data : null);
        reply(line ? `📚 *Did you know?*\n${line}` : '❌ *Could not fetch a fact.*');
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;
// ============ END MADRIN API COMMANDS ============

case "weatherdetail": {
    if (!text) return reply(`🌤️ *Weather Detail*\nUsage: ${prefix}weatherdetail [city/country]`);
    try {
        reply('⏳ *Fetching weather...*');
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(text)}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`);
        const w = res.data;
        const sunrise = new Date(w.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(w.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        reply(`\`\`\`
✤ Weather Report ✤
➥ Location    : ${w.name} (${w.sys.country})
➥ Condition   : ${w.weather[0].main} - ${w.weather[0].description}
✽ Temperature : ${w.main.temp}°C (Feels like ${w.main.feels_like}°C)
✱ Min/Max     : ${w.main.temp_min}°C / ${w.main.temp_max}°C
✚ Humidity    : ${w.main.humidity}%
➙ Wind        : ${w.wind.speed} m/s
✽ Cloud Cover : ${w.clouds.all}%
♜ Sunrise     : ${sunrise}
♜ Sunset      : ${sunset}
\`\`\``);
    } catch (e) { reply(`❌ *City not found:* ${text}`); }
}
break;

// ============ READMORE ============
case "readmore": {
    const txt = text || m.quoted?.text;
    if (!txt) return reply(`Usage: ${prefix}readmore text |readmore| hidden text`);
    const readmoreChar = String.fromCharCode(8206).repeat(4001);
    const rtext = txt.replace(/(\|readmore\|)/i, readmoreChar);
    await devtrust.sendMessage(m.chat, { text: rtext }, { quoted: m });
}
break;

// ============ WALINK ============
case "walink":
case "wlink": {
    let num;
    if (m.mentionedJid?.[0]) num = m.mentionedJid[0].replace(/[^0-9]/g, '');
    else if (m.quoted?.sender) num = m.quoted.sender.replace(/[^0-9]/g, '');
    else if (text) num = text.replace(/[^0-9]/g, '');
    else num = m.sender.replace(/[^0-9]/g, '');
    reply(`🔗 *WhatsApp Link:*\nhttps://wa.me/${num}`);
}
break;

// ============ IP LOOKUP ============
case "ip": {
    if (!text) return reply(`🌐 *IP Lookup*\nUsage: ${prefix}ip [ip address]`);
    try {
        const res = await axios.get(`https://ipapi.co/${text}/json/`);
        const d = res.data;
        if (d.error) return reply(`❌ *Invalid IP:* ${text}`);
        reply(`🌐 *IP Lookup: ${text}*\n\n▸ *Country:* ${d.country_name} ${d.country_code}\n▸ *City:* ${d.city}\n▸ *Region:* ${d.region}\n▸ *ISP:* ${d.org}\n▸ *Timezone:* ${d.timezone}\n▸ *Currency:* ${d.currency}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ WIKIPEDIA ============
case "wiki":
case "wikipedia": {
    if (!text) return reply(`📖 *Wikipedia*\nUsage: ${prefix}wiki [topic]`);
    try {
        reply('⏳ *Searching Wikipedia...*');
        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`);
        const d = res.data;
        if (d.type === 'disambiguation') return reply(`❌ *Ambiguous term. Try being more specific.*`);
        reply(`📖 *${d.title}*\n\n${d.extract}\n\n🔗 ${d.content_urls?.desktop?.page}`);
    } catch (e) { reply(`❌ *Not found:* ${text}`); }
}
break;

// ============ PREXZY API — URL SHORTENER ============
case "trt":
case "translate": {
    if (!text) return reply(`🌍 *Translate*\nUsage: ${prefix}translate [lang] [text]\nExample: ${prefix}translate es Hello World`);
    try {
        const parts = text.split(' ');
        const lang = parts[0];
        const toTranslate = parts.slice(1).join(' ');
        if (!toTranslate) return reply(`Usage: ${prefix}translate [lang code] [text]\nCodes: es=Spanish, fr=French, ar=Arabic, yo=Yoruba, ha=Hausa`);
        const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(toTranslate)}`);
        const translated = res.data[0].map(i => i[0]).join('');
        reply(`🌍 *Translation*\n▸ *Original:* ${toTranslate}\n▸ *Translated (${lang}):* ${translated}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ CALCULATOR ============
case "calc": {
    if (!text) return reply(`🧮 *Calculator*\nUsage: ${prefix}calc [expression]\nExample: ${prefix}calc 5 * 8 + 2`);
    try {
        const result = eval(text.replace(/[^0-9+\-*/.() %]/g, ''));
        reply(`🧮 *Calculator*\n▸ *Expression:* ${text}\n▸ *Result:* ${result}`);
    } catch (e) { reply(`❌ *Invalid expression*`); }
}
break;

// ============ NGL ============
case "ngl": {
    if (!text) return reply(`💬 *NGL Link*\nUsage: ${prefix}ngl [username]`);
    reply(`💬 *NGL Anonymous Message Link*\n▸ Username: ${text}\n▸ Link: https://ngl.link/${text}\n\n_Share this link to receive anonymous messages!_`);
}
break;

// ============ FONT ============
case "bible": {
    if (!text) return reply(`📖 *Bible*\nUsage: ${prefix}bible [book chapter:verse]\nExample: ${prefix}bible John 3:16`);
    try {
        const parts = text.split(' ');
        const book = parts[0];
        const cv = parts[1] || '1:1';
        const res = await axios.get(`https://bible-api.com/${book}+${cv}`);
        const d = res.data;
        if (d.error) return reply(`❌ *Verse not found*`);
        reply(`📖 *${d.reference}*\n\n_"${d.text.trim()}"_`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ JID ============
// [REMOVED DUPLICATE: jid]

// ============ ARCHIVE ============
case "bio":
case "setbio": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!text) return reply(`Usage: ${prefix}bio [new bio]`);
    try {
        await devtrust.updateProfileStatus(text);
        reply(`✅ *Bio updated!*\n▸ ${text}`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ SETNAME ============
// [REMOVED DUPLICATE: setname]

// ============ FORWARD ============
case "forward": {
    if (!isCreator && !isSudo) return reply('🔒 *Owner/Sudo only*');
    if (!m.quoted) return reply(`Usage: Reply to a message + ${prefix}forward [number]`);
    if (!text) return reply(`Usage: ${prefix}forward [number]`);
    try {
        const forwardJid = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await devtrust.sendMessage(forwardJid, { forward: m.quoted, force: true });
        reply(`✅ *Message forwarded!*`);
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ PRIVACY COMMANDS ============
case "ytmp3":
case "play2": {
    if (!text) return reply(`🎵 *YouTube Audio Downloader*\nUsage: ${prefix}ytmp3 [title or URL]`);
    try {
        reply('⏳ *Fetching audio...*');
        let videoUrl = text.trim();
        // Unlike ytmp4's endpoint, this one requires an actual URL (not a
        // plain search term) — resolve titles to a URL first.
        if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
            const yts = require('yt-search');
            const results = await yts(videoUrl);
            if (!results.videos.length) return reply('❌ *No results found*');
            videoUrl = results.videos[0].url;
        }
        const data = await prexzyGet('/download/ytmp3', { url: videoUrl });
        const link = madrinExtractLink(data);
        if (!data?.status || !link) return reply('❌ *Download failed.*');
        await devtrust.sendMessage(m.chat, {
            audio: { url: link },
            mimetype: 'audio/mpeg',
            fileName: `${madrinExtractTitle(data, 'audio')}.mp3`,
            ptt: false
        }, { quoted: m });
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============ SPOTIFY FIXED ============
case "spotify2":
case "spotifydl2": {
    if (!text) return reply(`🎵 *Spotify Downloader*\nUsage: ${prefix}spotify2 [spotify URL]`);
    try {
        reply('⏳ *Fetching Spotify track...*');
        const res = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(text)}`);
        if (!res.data?.result) return reply('❌ *Could not fetch Spotify track*');
        const track = res.data.result;
        const dlRes = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${track.gid}/${track.id}`);
        const taskId = dlRes.data?.result?.task_id;
        if (!taskId) return reply('❌ *Conversion failed*');
        await new Promise(r => setTimeout(r, 5000));
        const mp3Res = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${track.gid}/${track.id}/${taskId}`);
        const mp3Url = mp3Res.data?.result?.download_url;
        if (!mp3Url) return reply('❌ *Download link not ready, try again*');
        await devtrust.sendMessage(m.chat, { audio: { url: `https://api.fabdl.com${mp3Url}` }, mimetype: 'audio/mpeg', fileName: `${track.name}.mp3`, ptt: false }, { quoted: m });
    } catch (e) { reply(`❌ *Error:* ${e.message}`); }
}
break;

// ============================================================
// =================== END LEGENDARY-AI COMMANDS ==============
// ============================================================

// ============================================================
// ============= LEGENDARY! ACTIVE AND LISTENING ==============
// ============================================================

case "legendary":
case "legendary!": {
    reply(`⚡ *LEGENDARY!*\n\n✅ *Active and Listening* 🎧\n\n_${botDisplayName} is online and ready!_`);
}
break;

// ============================================================
// =================== PLUGIN COMMANDS ========================
// ============================================================

// --- AZA (Account Details) - Per-User Storage ---
case "riddle": {
    const riddles = [
        { q: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?", a: "A Map!" },
        { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps!" },
        { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An Echo!" },
        { q: "What has hands but can't clap?", a: "A Clock!" },
        { q: "What gets wetter as it dries?", a: "A Towel!" }
    ];
    const r = riddles[Math.floor(Math.random() * riddles.length)];
    reply(`🧠 *Riddle Time!*\n\n❓ ${r.q}\n\n_Reply_ \`.answer\` _to get the answer_\n||${r.a}||`);
}
break;
// [REMOVED DUPLICATE: fact]
// [REMOVED DUPLICATE: quote]
// [REMOVED DUPLICATE: roast]
// [REMOVED DUPLICATE: compliment]

case "ship":
case "love": {
    const targets = m.mentionedJid;
    if (!targets || targets.length < 2) return reply(`Tag 2 people!\nExample: ${prefix}ship @person1 @person2`);
    const percent = Math.floor(Math.random() * 101);
    const bars = '❤️'.repeat(Math.floor(percent/10)) + '🖤'.repeat(10-Math.floor(percent/10));
    reply(`💘 *Love Calculator*\n\n@${targets[0].split('@')[0]} + @${targets[1].split('@')[0]}\n\n${bars}\n\n❤️ *${percent}% Match!*\n\n${percent >= 80 ? '💑 Perfect couple!' : percent >= 50 ? '😊 Good match!' : '😬 Needs work!'}`, targets);
}
break;
// [REMOVED DUPLICATE: truth]
// [REMOVED DUPLICATE: dare]

case "tod":
case "truthordare": {
    const coin3 = Math.random() > 0.5;
    const tod_truths = ["What's your most embarrassing moment?", "Have you ever lied to your parents?", "What's your biggest secret?"];
    const tod_dares = ["Send a voice note right now!", "Change your status for 1 hour!", "Tag your crush!"];
    if (coin3) {
        reply(`🎲 *Truth!*\n\n${tod_truths[Math.floor(Math.random() * tod_truths.length)]}`);
    } else {
        reply(`😈 *Dare!*\n\n${tod_dares[Math.floor(Math.random() * tod_dares.length)]}`);
    }
}
break;

// calc/calculate handled above

// tinyurl/shorten/shorturl handled above

case "wttr": {
    if (!text) return reply(`Usage: ${prefix}wttr Lagos`);
    try {
        const wRes = await axios.get(`https://wttr.in/${encodeURIComponent(text)}?format=3`);
        reply(`🌤️ *Weather*\n\n${wRes.data}`);
    } catch(e) { reply(`❌ Error fetching weather`); }
}
break;
// [REMOVED DUPLICATE: translate]

case "time":
case "clock": {
    const zones = { 'Nigeria': 'Africa/Lagos', 'Kenya': 'Africa/Nairobi', 'London': 'Europe/London', 'New York': 'America/New_York', 'Dubai': 'Asia/Dubai', 'India': 'Asia/Kolkata' };
    let timeText2 = `🕐 *World Times*\n\n`;
    Object.entries(zones).forEach(([city, tz]) => {
        timeText2 += `🌍 ${city}: *${moment().tz(tz).format('HH:mm:ss z')}*\n`;
    });
    reply(timeText2);
}
break;

case "date":
case "today": {
    reply(`📅 *Today's Date*\n\n🗓️ ${moment().tz('Africa/Lagos').format('dddd, MMMM Do YYYY')}\n🕐 Time (Lagos): ${moment().tz('Africa/Lagos').format('HH:mm:ss')}\n🌍 UTC: ${moment().utc().format('HH:mm:ss')}`);
}
break;

case "countdown": {
    if (!text) return reply(`Usage: ${prefix}countdown YYYY-MM-DD\nExample: ${prefix}countdown 2025-12-25`);
    try {
        const target3 = moment(text.trim());
        if (!target3.isValid()) return reply('❌ Invalid date format. Use YYYY-MM-DD');
        const now3 = moment();
        const diff = target3.diff(now3);
        if (diff < 0) return reply('❌ That date has already passed!');
        const dur = moment.duration(diff);
        reply(`⏳ *Countdown to ${text}*\n\n📅 ${Math.floor(dur.asDays())} days\n⏰ ${dur.hours()} hours\n⏱️ ${dur.minutes()} minutes\n⌚ ${dur.seconds()} seconds`);
    } catch(e) { reply(`❌ Error: ${e.message}`); }
}
break;

case "base64encode":
case "b64enc": {
    if (!text) return reply(`Usage: ${prefix}b64enc <text>`);
    reply(`🔒 *Base64 Encoded:*\n\n\`\`\`${Buffer.from(text).toString('base64')}\`\`\``);
}
break;

case "base64decode":
case "b64dec": {
    if (!text) return reply(`Usage: ${prefix}b64dec <base64text>`);
    try {
        reply(`🔓 *Base64 Decoded:*\n\n\`\`\`${Buffer.from(text, 'base64').toString('utf8')}\`\`\``);
    } catch(e) { reply('❌ Invalid base64 string'); }
}
break;

case "password":
case "generatepassword": {
    const len = parseInt(text) || 16;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < len; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    reply(`🔑 *Generated Password (${len} chars):*\n\n\`\`\`${pass}\`\`\`\n\n⚠️ _Save this somewhere safe!_`);
}
break;

case "uuid":
case "generateid": {
    const uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random()*16|0, v = c=='x'?r:(r&0x3|0x8);
        return v.toString(16);
    });
    reply(`🆔 *Generated UUID:*\n\n\`\`\`${uid}\`\`\``);
}
break;

case "color":
case "randomcolor":
case "colourpick": {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0').toUpperCase();
    const r4 = parseInt(hex.slice(1,3),16), g4 = parseInt(hex.slice(3,5),16), b4 = parseInt(hex.slice(5,7),16);
    reply(`🎨 *Random Color*\n\n▸ HEX: \`${hex}\`\n▸ RGB: rgb(${r4}, ${g4}, ${b4})\n▸ Preview: https://singlecolorimage.com/get/${hex.slice(1)}/200x200`);
}
break;

case "encode":
case "urlencode": {
    if (!text) return reply(`Usage: ${prefix}encode <text>`);
    reply(`🔗 *URL Encoded:*\n\n\`${encodeURIComponent(text)}\``);
}
break;

case "decode":
case "urldecode": {
    if (!text) return reply(`Usage: ${prefix}decode <url encoded text>`);
    try { reply(`🔓 *URL Decoded:*\n\n\`${decodeURIComponent(text)}\``); }
    catch(e) { reply('❌ Invalid URL encoded string'); }
}
break;

case "hash":
case "md5": {
    if (!text) return reply(`Usage: ${prefix}hash <text>`);
    const md5hash = crypto.createHash('md5').update(text).digest('hex');
    const sha1hash = crypto.createHash('sha1').update(text).digest('hex');
    const sha256hash = crypto.createHash('sha256').update(text).digest('hex');
    reply(`#️⃣ *Hash Results for:* \`${text}\`\n\n▸ MD5: \`${md5hash}\`\n▸ SHA1: \`${sha1hash}\`\n▸ SHA256: \`${sha256hash}\``);
}
break;
// [REMOVED DUPLICATE: flip]

case "roll": {
    const sides = parseInt(text) || 6;
    const rolled = Math.floor(Math.random() * sides) + 1;
    reply(`🎲 *Dice Roll (${sides}-sided)*\n\nYou rolled: *${rolled}*`);
}
break;
// [REMOVED DUPLICATE: 8ball]
// [REMOVED DUPLICATE: pick]

case "number":
case "randnum":
case "randomnumber": {
    const parts2 = text.split(/\s+/);
    const min2 = parseInt(parts2[0]) || 1;
    const max2 = parseInt(parts2[1]) || 100;
    const rn = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
    reply(`🔢 *Random Number (${min2} - ${max2})*\n\nResult: *${rn}*`);
}
break;

// --- INFO COMMANDS ---
// [REMOVED DUPLICATE: ip]

case "country":
case "countryinfo": {
    if (!text) return reply(`Usage: ${prefix}country Nigeria`);
    try {
        const cRes = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(text)}`);
        const c2 = cRes.data[0];
        reply(`🌍 *${c2.name.common}*\n\n▸ Official: ${c2.name.official}\n▸ Capital: ${c2.capital?.[0]}\n▸ Population: ${c2.population?.toLocaleString()}\n▸ Region: ${c2.region}\n▸ Subregion: ${c2.subregion}\n▸ Languages: ${Object.values(c2.languages||{}).join(', ')}\n▸ Currency: ${Object.values(c2.currencies||{}).map(c3=>c3.name).join(', ')}\n▸ Calling Code: +${Object.keys(c2.idd?.suffixes||{})[0]}`);
    } catch(e) { reply(`❌ Country not found`); }
}
break;
// [REMOVED DUPLICATE: wiki]
// [REMOVED DUPLICATE: define]

case "news": {
    try {
        const newsRes = await axios.get('https://newsapi.org/v2/top-headlines?country=ng&apiKey=pub_demo&pageSize=5').catch(() => null);
        if (!newsRes?.data?.articles) return reply('📰 *News feature requires a NewsAPI key*\nVisit: newsapi.org');
        let newsText = '📰 *Latest News:*\n\n';
        newsRes.data.articles.forEach((a, i) => { newsText += `${i+1}. *${a.title}*\n${a.source?.name}\n\n`; });
        reply(newsText);
    } catch(e) { reply('❌ Could not fetch news'); }
}
break;

// --- TEXT EFFECTS ---
case "bold": {
    if (!text) return reply(`Usage: ${prefix}bold <text>`);
    reply(`*${text}*`);
}
break;

case "italic": {
    if (!text) return reply(`Usage: ${prefix}italic <text>`);
    reply(`_${text}_`);
}
break;

case "strike":
case "strikethrough": {
    if (!text) return reply(`Usage: ${prefix}strike <text>`);
    reply(`~${text}~`);
}
break;

case "mono":
case "monospace": {
    if (!text) return reply(`Usage: ${prefix}mono <text>`);
    reply(`\`\`\`${text}\`\`\``);
}
break;

case "reversetext": {
    if (!text) return reply(`Usage: ${prefix}reversetext <text>`);
    reply(`🔄 *Reversed:* ${text.split('').reverse().join('')}`);
}
break;

case "upper":
case "uppercase": {
    if (!text) return reply(`Usage: ${prefix}upper <text>`);
    reply(text.toUpperCase());
}
break;

case "lower":
case "lowercase": {
    if (!text) return reply(`Usage: ${prefix}lower <text>`);
    reply(text.toLowerCase());
}
break;

    default:
      return false;
  }
  return true;
};
