// Auto-extracted from case.js — commands originally under section(s):
//   - ADDITIONAL AUDIO EFFECTS (smooth, tremolo, vibrato, 8d, flanger)
//   - ADMIN LIST
//   - AKICK (auto-kick list)
//   - ANTI STATUS (show all anti features)
//   - ANTIGCSTATUS (anti group-status-post)
//   - ANTIGM (anti group-status-mention)
//   - ANTIWORD (custom word filter)
//   - CREATE GROUP
//   - CREATEPANEL
//   - END LEGENDARY COMMANDS
//   - GCSTATUS/UPSWGC (post a WhatsApp group status)
//   - GROUP EVENTS
//   - GROUP INFO
//   - GROUP STATUS (post to WA group status)
//   - KICK ALL
//   - KICKR
//   - MEMBER LIST
//   - PHOTO/TOIMG (sticker -> image)
//   - TEMP KICK
// Do not add unrelated commands here manually; keep categories separated.

module.exports = async function(ctx) {
const { ACCOUNT_FILE, ACTIVITY_FILE, AIIMG_STYLES, ANTIFEATURE_WARN_FILE, ANTILINK_FILE, ANTIMENTIONGC_FILE, AWAIT_TTL_MS, AnyMessageContent, AuthenticationState, BACKUP_DIR, BIRTHDAY_FILE, BaileysError, Browser, Browsers, BufferJSON, CHANNELLOG_FILE, ChatModification, DisriyuectReason, EVENTS_FILE, FANCY_FONTS, FANCY_FONT_COUNT, FONTS, FormData, GroupMetadata, GroupSettingChange, Header, InteractiveMessage, JAIL_FILE, LOGO_STYLES, MADRIN_BASE, MAKER_STYLES, MENU_IMAGE_PATH, MUTED_FILE, MediaPathMap, MediaType, MediariyuInfo, MessageOptions, MessageType, MessageTypeProto, Mimetype, MimetypeMap, MiscMessageGenerationOptions, NEWSLETTER_JID, NEWSLETTER_NAME, PAIRING_DIR, PREFIX_FILE, PREXZY_BASE, Premium, Presence, ProxyAgent, RANDOM_CATEGORIES, REPORTS_FILE, ROLES_FILE, Richie, SESSION_FILE, SESSION_TTL_MS, SETTINGS_FILE, SETTINGS_META, SETTINGS_PAGE_SIZE, STATS_FILE, STYLE_TEXT_LIST, SUDO_FILE, Sticker, StickerTypes, TEXTFX_MAP, TRIVIA_BANK, TTS_LANG_CODES, TTS_LEGACY_VOICES, TTS_NAMED_VOICES, URL_REGEX, WAContactMessage, WAContactsArrayMessage, WAContextInfo, WAFlag, WAGroupInviteMessage, WAGroupMetadata, WALocationMessage, WAMediaUpload, WAMessage, WAMessageContent, WAMessageProto, WAMessageStatus, WAMetric, WANode, WAProto, WARN_FILE, WASocket, WATextMessage, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WA_MESSAGE_STATUS_TYPE, WA_MESSAGE_STUB_TYPES, WIN_LINES, WORD_BANK_HANGMAN, WORD_BANK_SHORT, __REAL_COMMAND_COUNT__, __REAL_COMMAND_LIST__, __baileys_getDevice, __cmd_ai, __cmd_anime, __cmd_auto, __cmd_business, __cmd_career, __cmd_design, __cmd_economy, __cmd_education, __cmd_legendary_economy, __cmd_menu, _autoReactOn, aboutBot, accessoryGuide, accountDeletion, actorProfiles, addBulk, addExif, addNewsletterContext, addSubtitles, addWarning, aiChips, aiDeepLearning, alertPreferences, algorithms, allOwners, analyticsDashboard, ancientCivilizations, announceToGroup, antiAction, antiMentionGcSettings, antilinkSettings, antilinkStatus, apiDocumentation, apiSettings, applyAudioEffect, applyFancyFont, applyFont, applyTextEffect, areJidsSameUser, args, artExhibitions, artHistory, artInstallations, artTherapy, artistInfoBtn, askOpenAI, askOpenAIWithMemory, astronomyGuide, audioEffectsBtn, audioGear, autoJoinGroup, autoreply, awaitingMusic, awardsNominations, axios, backupData, bagCollection, baileys, bathroomDesign, batteryTechnology, beautyTips, bedroomIdeas, behindTheScenes, benchmarkTest, biologyFacts, blockedUsers, body, bookRecommendations, botDisplayName, botLid, botNumber, botOwnerNumbers, breathingExercises, buildingPermits, bumpAntiFeatureWarn, bumpStat, cGuide, cTutorial, calculate, calculateLove, calorieCounter, cameraReviews, careerGuidance, caseCount, caseFileContent, caseNames, casualWear, celebrityNews, celebrityPhotos, chalk, charMap, chatGroups, chatUpdate, chatbotChatOn, chatbotGlobalOn, chatbotPersonality, checkBirthdaysToday, checkDueEvents, checkUpdates, checkWinner, circusShows, classicLiterature, clearAwaitingMusic, clearSession, clockString, cloudPlatforms, codeReview, codeSnippets, coinFlip, colorSchemes, comedyShows, command, commercialSpaces, communityInfo, communitySupport, complimentUser, compressVideo, computeLineDiff, concertDatesBtn, concertInfo, constructionUpdates, contractorFinder, convertCurrency, convertUnits, convertVideoFormat, countCommands, createGIF, createPlaylist, createPoll, crypto, customThemes, dailyGoals, darkMode, dataExport, dataScience, dataStructures, databaseGuides, debuggingTips, demoteAll, designerBags, designerSearch, developerTools, deviceManagement, devtrust, directorInfo, dispatchMenuCommand, documentaryGuide, doorOptions, downloadAndSaveMediaMessage, downloadContentFromMessage, downloadFacebook, downloadInstagramReels, downloadInstagramStory, downloadMediaMessage, downloadMp3Btn, downloadMusic, downloadTikTok, downloadTwitter, downloadYouTube, ecofriendlyTips, economics101, economy, educationalVideos, electricalGuide, emailSettings, emitGroupParticipantsUpdate, emitGroupUpdate, encodeBase64, endGame, etymology, eveningGowns, eventsCalendar, example, exec, extractAudio, fashionBrands, fashionTrends, feedback, fetchJson, fetchLatestBaileysVersion, ffmpeg, findFlights, findHotels, findRestaurants, fiveGDevices, flipCoin, floorPlans, foldablePhones, foodDB, footballAPI, formalWear, format, formatLagosTime, formatRam, formatUptime, freshRequire, from, fs, fsx, funGames, furnitureFinder, galleryExhibitions, gameDevelopment, gameLeaderboard, gameState, gamingEvents, gamingHardware, generateProfilePicture, generateQRCode, generateRandomNumber, generateUpdateChangelog, generateWAMessage, generateWAMessageContent, generateWAMessageFromContent, geneticsInfo, getAntilinkKey, getArtistInfo, getAwaitingMusic, getBotMode, getBotSetting, getBotVersion, getBuffer, getContentType, getCryptoNews, getCurrentDateTime, getDestinationGuide, getEntertainmentNews, getExchangeRates, getFixtures, getFootballNews, getGroupAdmins, getGroupSettings, getHallOfFame, getHeadToHead, getHistoricalStats, getInjuryUpdates, getInstagramProfile, getInternationalMatches, getJoke, getLagosTime, getLiveMatches, getLyrics, getMatchAnalysis, getMatchHighlights, getMatchPredictions, getMoodEmoji, getMusicCharts, getNigeriaFootball, getNigeriaNews, getNutritionInfo, getOwnerName, getPlayerStats, getRandom, getRecipeDetails, getRedditTrending, getRefereeStats, getRules, getSession, getSetting, getSportsNews, getStadiumInfo, getStandings, getStream, getTeamInfo, getTechNews, getTime, getTopScorers, getTransferNews, getTrendingSongs, getTrophyCabinet, getTwitterTrends, getUserPrefix, getUserSettings, getWarnings, getWeather, getWorldNews, getYouTubeVideoInfo, ghostTag, gitGithub, gloveTypes, goProgramming, goalSetting, googleTTS, gossipNews, gpuGuide, graphicsProgramming, groomOutfits, groupAdmins, groupBackup, groupCache, groupMetadata, groupName, guessTheNumber, guitarTabsBtn, hairCare, hairstyleIdeas, handleAntiChecks, handleGameReply, handleGroupSelection, handleGuess, handleWarn, hangman, hangmanGames, hangmanVisual, hansRandom, hasActiveGame, hatStyles, headphoneGuide, healthcareNearby, helpSupport, herbalMedicine, historicalEvents, hobbyIdeas, homeAutomation, homeOrganization, homeSecurity, houseTours, imageToWebp, imdbRatings, initInMemoryKeyStore, instrumentTunerBtn, interiorDesign, isAdmins, isBaileys, isBotAdmins, isCmd, isCreator, isDev, isJailed, isOwner, isPremium, isSudo, isUrl, jailList, jailUser, javaProgramming, javascriptGuide, jewelryGuide, jidNormalizedUser, jimp, journaling, jsonformat, karaokeBtn, keyboardReviews, keyboardShortcuts, kidsFashion, kitchenDesign, landscapeDesign, language, languageLearning, laptopFinder, latensi, lawBasics, leaseTemplates, listCases, literatureAnalysis, livePerformances, liveTrackers, liveTvListings, loadAccounts, loadAntiFeatureWarns, loadAntiMentionGcSettings, loadAntilinkSettings, loadChannelLog, loadJSON, loadMutedData, loadPlugins, loadPrefixes, loadSettings, loadSudoList, loadUsers, lockInfo, lockMessages, logicPuzzles, lookupIP, lyricsFinderBtn, m, machineLearning, madrinExtractLink, madrinExtractTitle, madrinFetchImage, madrinGet, magicShows, makeInMemoryStore, makeupBrands, makeupTutorials, marketAnalysis, matches, mathFormulas, medicineReminder, meditation, mentalHealthSupport, mentionedJid, menuActivityReport, menuAddRemoveMembers, menuBackupGroupData, menuBirthdayReminders, menuChangeGroupIcon, menuChatCleanup, menuContributionTracker, menuEmergencyAlerts, menuEventScheduler, menuGiftMembers, menuGrantAdminRights, menuGroupAchievements, menuGroupAnnouncements, menuGroupDescription, menuGroupGames, menuGroupPhotosArchive, menuGroupPolls, menuGroupRoles, menuGroupRulesView, menuGroupSettings, menuGroupStats, menuGroupTheme, menuImageBuffer, menuKickMember, menuLockUnlockGroup, menuMap, menuMemberList, menuMemberRoles, menuMentionAll, menuModeratorPanel, menuMuteUnmuteMembers, menuNotificationSettings, mime, miniPcs, minimalismGuide, mobileDevelopment, mobileOsComparison, moment, more, mouseGuide, movieDatabase, movieTrailers, musicChartsBtn, musicConverterBtn, musicTheory, musicTherapy, musicals, nailCare, nailDesigns, neighborhoodInfo, networking, newsAPI, newsletterEmojis, newsletterJids, nexusLoading, notifications, numberEmojis, onlineCourses, operatingSystems, organicLiving, os, outfitIdeas, owner, ownerNumber, packageManagers, pageForSettingKey, parseMention, participants, path, pcBuilds, performMusicDownload, performMusicSearch, performanceTips, peripherals, personalGoals, philosophyGuide, phoneSpecs, phpTutorial, playTickets, playlistCreatorBtn, plumbingGuide, podcastSearchBtn, politicalSystems, positiveAffirmations, powerSupplyCalculator, prefix, premiumFeatures, prepareWAMessageMedia, prexzyDownloadAndSend, prexzyExtractYtSearchResult, prexzyGet, prexzySendRandom, prexzyTtsAndSend, priceComparison, priceTrends, printerReviews, privacySettings, processTime, processorComparison, profile, progressTracking, promoteAll, pronunciationGuide, propertyListings, propertyPhotos, proto, publicTransport, pushname, puzzleGames, pythonTutorial, q, qtext, quoted, ramGuide, randomColor, rateSomething, readMore, readingClub, realEstateAgents, realityTv, redCarpetEvents, relayWAMessage, renderBoard, renderHangman, renovationIdeas, reply, replyWithNewsletter, reportList, reportUser, requiredDirs, resetAntiFeatureWarn, resolveImageUrlFromMessage, reverseText, reward, rewardsStatus, richpic, roastUser, rollDice, rollTheDice, rubyOnRails, runtime, rustGuide, saveAccounts, saveAntiFeatureWarns, saveAntiMentionGcSettings, saveAntilinkSettings, saveChannelLog, saveGroupSettings, saveJSON, saveMutedData, savePrefixes, saveSettings, saveSudoList, scarfTying, scheduleEvent, schoolsNearby, scienceExperiments, scramble, searchHighlights, searchMusic, searchMusicBtn, searchRecipe, searchTikTokUser, securityBestPractices, securitySoftware, selfcareRoutine, selfgiftingIdeas, selfhelpBooks, send, sendEmergencyAlert, sendGift, sendGroupSettingsMenu, sendImageAlbum, sendImageAsSticker, sendQuickReplyButtons, sendTable, sendVideoAsSticker, sendVoteKickPrompt, sender, sessionControl, setApprovalMode, setAwaitingMusic, setBirthday, setBotSetting, setGroupIcon, setGroupTheme, setMemberRole, setRules, setSession, setSetting, setUserPrefix, shakespearePlays, sheetMusicBtn, shoeFinder, shoeStyles, shoppingTips, shortenURL, sizeConverter, skincareGuide, sleep, sleepGuide, sleepHygiene, slugToCamel, smartwatchTracker, smsg, socialAPI, soundSettings, spaMassage, spaceExploration, spawn, speed, sportswear, standupComedy, startGroupSchedulers, startGuessGame, startLiveTrack, statisticsExplained, stopLiveTrack, storageSolutions, store, streamingServices, styletext, sunglasses, tagAdmins, tanggal, teaGuide, techNews, techReviews, tempMailData, templateMessage, testingFrameworks, text, theaterShows, themeCustomization, ticTacToe, tictactoeGames, time, timestampp, toParticipantJid, todayDateWIB, toggleSetting, toolsAPI, totalCases, trackActivity, trackMedia, travelAPI, travelWellness, trendingSongsBtn, trimVideo, trivia, troubleshooting, truthOrDare, tvSeries, twofactorAuth, unjailUser, usageStatistics, useSingleFileAuthState, userMovieSessions, util, varietyShows, videoAPI, videoToWebp, voteKick, voteKickTracker, waChatKey, webFrameworks, weddingDresses, wellnessTips, wifiRouters, windowStyles, winterCoats, wordUnscramble, workoutPlan, worldCultures, writeExifImg, writeExifVid, writingTips, ytdl, yts } = ctx;
  switch (command) {
case 'ginfo': {
    if (!m.isGroup) return reply('✘ Groups only');
    try {
        const ginfoMeta = groupMetadata || await devtrust.groupMetadata(m.chat);
        const ginfoTotal = ginfoMeta.participants.length;
        const ginfoAdmins = ginfoMeta.participants.filter(p => p.admin != null).length;
        const ginfoCreated = ginfoMeta.creation ? new Date(ginfoMeta.creation * 1000).toLocaleString() : 'Unknown';
        reply(
`*╭─ GROUP INFO ─╮*
│ 📌 *Name:* ${ginfoMeta.subject}
│ 👥 *Members:* ${ginfoTotal}
│ 🛡️ *Admins:* ${ginfoAdmins}
│ 📅 *Created:* ${ginfoCreated}
│ 🔒 *Restricted:* ${ginfoMeta.restrict ? 'Yes' : 'No'}
│ 🔇 *Announced:* ${ginfoMeta.announce ? 'Yes' : 'No'}
│ 🆔 *ID:* ${m.chat}
${ginfoMeta.desc ? `│ 📝 *Desc:* ${ginfoMeta.desc}` : ''}
*╰──────────────╯*`
        );
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== WARN SYSTEM =====
case 'kickall': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isCreator) return reply('✘ Owner only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const kaBotId = devtrust.decodeJid(devtrust.user.id);
    const kaToKick = participants.filter(p => {
        const j = p.jid || p.id;
        return j !== kaBotId && j !== sender && p.admin == null;
    });
    if (!kaToKick.length) return reply('✘ No non-admin members to kick');
    reply(`⏳ Kicking ${kaToKick.length} members...`);
    for (const p of kaToKick) {
        try {
            await devtrust.groupParticipantsUpdate(m.chat, [p.jid || p.id], 'remove');
            await sleep(500);
        } catch (e) {}
    }
    reply('✓ Done kicking all non-admin members');
}
break;

// ===== TEMP KICK =====
case 'tkick': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    const tkTimeRegex = /(\d+)\s*(s|sec|m|min|h|hr|d)/gi;
    const tkMatches = [...(text || '').matchAll(tkTimeRegex)];
    if (!tkMatches.length) return reply(`✘ Provide duration\nExample: ${prefix}tkick @user 10m`);
    const tkUnitMap = { s:1000, sec:1000, m:60000, min:60000, h:3600000, hr:3600000, d:86400000 };
    let tkMs = 0;
    for (const match of tkMatches) tkMs += parseInt(match[1]) * (tkUnitMap[match[2].toLowerCase()] || 60000);
    const tkMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const tkUser = tkMentioned[0] || m.quoted?.sender;
    if (!tkUser) return reply('✘ Reply to or mention a member');
    const tkJid = (tkUser.includes('@') ? tkUser.split('@')[0] : tkUser).replace(/\D/g, '') + '@s.whatsapp.net';
    try {
        await devtrust.groupParticipantsUpdate(m.chat, [tkJid], 'remove');
        reply(`✓ @${tkJid.split('@')[0]} temp kicked. Re-adding in ${Math.round(tkMs/60000)} min`, [tkJid]);
        setTimeout(async () => {
            try {
                await devtrust.groupParticipantsUpdate(m.chat, [tkJid], 'add');
                await devtrust.sendMessage(m.chat, { text: `✓ @${tkJid.split('@')[0]} re-added`, mentions: [tkJid] });
            } catch (e) {
                const tkCode = await devtrust.groupInviteCode(m.chat).catch(() => null);
                if (tkCode) await devtrust.sendMessage(tkJid, { text: `https://chat.whatsapp.com/${tkCode}` });
            }
        }, tkMs);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== MEMBER LIST =====
case 'members':
case 'memberlist': {
    if (!m.isGroup) return reply('✘ Groups only');
    const memList = participants.map((p, i) => `${i+1}. @${(p.jid||p.id).split('@')[0]}${p.admin ? ' 👑' : ''}`).join('\n');
    reply(`*👥 Members (${participants.length})*\n\n${memList}`, participants.map(p => p.jid||p.id));
}
break;

// ===== ADMIN LIST =====
case 'adminlist': {
    if (!m.isGroup) return reply('✘ Groups only');
    const alAdmins = participants.filter(p => p.admin != null);
    if (!alAdmins.length) return reply('✘ No admins found');
    const alList = alAdmins.map((p, i) => `${i+1}. @${(p.jid||p.id).split('@')[0]} ${p.admin === 'superadmin' ? '👑' : '🛡️'}`).join('\n');
    reply(`*🛡️ Admins (${alAdmins.length})*\n\n${alList}`, alAdmins.map(p => p.jid||p.id));
}
break;

// ===== MUTE/UNMUTE USER =====
case 'kickr': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');
    if (!m.quoted) return reply('✘ Reply to a message with mentions');
    const krMentions = m.quoted?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (!krMentions.length) return reply('✘ No mentioned users in replied message');
    const krToKick = krMentions.filter(j => j !== m.quoted?.sender);
    if (!krToKick.length) return reply('✘ No users to kick (sender excluded)');
    reply(`⏳ Kicking ${krToKick.length} users...`);
    for (const j of krToKick) {
        try { await devtrust.groupParticipantsUpdate(m.chat, [j], 'remove'); await sleep(800); } catch (e) {}
    }
    reply('✓ Done');
}
break;

// ===== CREATE GROUP =====
case 'creategc': {
    if (!isCreator) return reply('✘ Owner only');
    const cgName = text || 'LËGĒNDÃRY Group';
    const cgMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const cgUser = cgMentioned[0] || m.quoted?.sender;
    if (!cgUser) return reply('✘ Mention a user to add');
    try {
        const cgGroup = await devtrust.groupCreate(cgName, [cgUser, sender]);
        const cgCode = await devtrust.groupInviteCode(cgGroup.id);
        reply(`✓ Group created: ${cgName}\nLink: https://chat.whatsapp.com/${cgCode}`);
    } catch (e) { reply('✘ ' + e.message); }
}
break;

// ===== GROUP EVENTS =====
case 'events':
case 'gcevent': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const EVENTS_FILE = './database/group_events.json';
    let evData = {};
    try { evData = JSON.parse(fs.readFileSync(EVENTS_FILE)); } catch(e) {}
    evData[m.chat] = evData[m.chat] || { events: false, welcome: true, goodbye: true };
    const evParts = (text || '').split(' ');
    const evCmd = evParts[0]?.toLowerCase();
    if (!evCmd || evCmd === 'status') {
        return reply(`*Group Events*\nEnabled: ${evData[m.chat].events}\nWelcome: ${evData[m.chat].welcome}\nGoodbye: ${evData[m.chat].goodbye}\n\nUsage:\n${prefix}events on/off\n${prefix}events welcome on/off\n${prefix}events goodbye on/off`);
    }
    if (evCmd === 'on') { evData[m.chat].events = true; fs.writeFileSync(EVENTS_FILE, JSON.stringify(evData,null,2)); return reply('✓ Group events enabled'); }
    if (evCmd === 'off') { evData[m.chat].events = false; fs.writeFileSync(EVENTS_FILE, JSON.stringify(evData,null,2)); return reply('✓ Group events disabled'); }
    if (evCmd === 'welcome') { evData[m.chat].welcome = evParts[1]==='on'; evData[m.chat].events=true; fs.writeFileSync(EVENTS_FILE, JSON.stringify(evData,null,2)); return reply(`✓ Welcome messages ${evParts[1]==='on'?'enabled':'disabled'}`); }
    if (evCmd === 'goodbye') { evData[m.chat].goodbye = evParts[1]==='on'; evData[m.chat].events=true; fs.writeFileSync(EVENTS_FILE, JSON.stringify(evData,null,2)); return reply(`✓ Goodbye messages ${evParts[1]==='on'?'enabled':'disabled'}`); }
    reply(`Usage:\n${prefix}events on/off\n${prefix}events welcome on/off\n${prefix}events goodbye on/off\n${prefix}events status`);
}
break;

// ===== ANTI STATUS (show all anti features) =====
case 'antistatus': {
    if (!m.isGroup) return reply('✘ Groups only');
    // Was reading every one of these under getSetting(m.chat, ...) — none
    // of the actual toggle commands save there. antilink uses its own
    // separate settings store entirely; antitag/antispam/antibot/antibeg
    // all save under botNumber + m.chat, not m.chat alone. This always
    // showed everything as OFF regardless of real state.
    const alCfg = antilinkSettings[getAntilinkKey(botNumber, m.chat)] || { enabled: false, action: 'delete' };
    const asCfg = getSetting(botNumber + m.chat, 'antispam', { enabled: false, action: 'delete' });
    const atCfg = getSetting(botNumber + m.chat, 'antitag', { enabled: false, action: 'delete' });
    const abCfg = getSetting(botNumber + m.chat, 'antibot', { enabled: false, action: 'delete' });
    const abgCfg = getSetting(botNumber + m.chat, 'antibeg', { enabled: false, action: 'delete' });
    const amgCfg = antiMentionGcSettings[getAntilinkKey(botNumber, m.chat)] || { enabled: false, action: 'delete' };
    const abwCfg = getSetting(botNumber + m.chat, 'feature.antibadword', false);
    const fmt = (cfg) => cfg.enabled ? `✅ ON | ${cfg.action}${cfg.action === 'warn' ? ` (${cfg.warnLimit || 3})` : ''}` : '❌ OFF';
    reply(
`*🛡️ Group Anti-Features*

🔗 AntiLink: ${fmt(alCfg)}
🚫 AntiSpam: ${fmt(asCfg)}
🏷️ AntiTag:  ${fmt(atCfg)}
🤖 AntiBot:  ${fmt(abCfg)}
💰 AntiBeg:  ${fmt(abgCfg)}
📛 AntiMentionGC: ${fmt(amgCfg)}
🤬 AntiBadword: ${abwCfg ? '✅ ON' : '❌ OFF'}`
    );
}
break;

// ===== GROUP STATUS (post to WA group status) =====
case 'groupstatus':
case 'gstatus': {
    if (!m.isGroup) return reply('✘ Groups only');
    if (!isAdmins && !isCreator) return reply('✘ Admins only');
    const quotedMsg = m.quoted;
    const statusMime = (quotedMsg?.msg || quotedMsg)?.mimetype || '';
    try {
        let messagePayload;
        if (quotedMsg && /image/.test(statusMime)) {
            const statusMedia = await downloadMediaMessage(quotedMsg, 'buffer', {});
            const prepared = await prepareWAMessageMedia({ image: statusMedia, caption: text || '' }, { upload: devtrust.waUploadToServer });
            messagePayload = { groupStatusMessageV2: { message: { imageMessage: prepared.imageMessage } } };
        } else if (quotedMsg && /video/.test(statusMime)) {
            const statusMedia = await downloadMediaMessage(quotedMsg, 'buffer', {});
            const prepared = await prepareWAMessageMedia({ video: statusMedia, caption: text || '' }, { upload: devtrust.waUploadToServer });
            messagePayload = { groupStatusMessageV2: { message: { videoMessage: prepared.videoMessage } } };
        } else if (text) {
            messagePayload = { groupStatusMessageV2: { message: { extendedTextMessage: { text: text, font: 2 } } } };
        } else {
            return reply(`📢 *Group Status*\nUsage:\n• ${prefix}gstatus [text]\n• Reply image + ${prefix}gstatus [caption]\n• Reply video + ${prefix}gstatus [caption]`);
        }
        const statusMsg = generateWAMessageFromContent(m.chat, proto.Message.fromObject(messagePayload), { userJid: devtrust.user.id });
        await devtrust.relayMessage(m.chat, statusMsg.message, { messageId: statusMsg.key.id });
        reply('✅ Posted to group status!');
    } catch (e) {
        console.error('Group status error:', e);
        reply('❌ Failed: ' + e.message);
    }
}
break;

// ===== CREATEPANEL =====
case 'createpanel':
case 'panel': {
    const panelCmd = require('./commands/createpanel');
    await panelCmd(m, { text, prefix, devtrust });
}
break;

// ============================================================
// =================== END LEGENDARY COMMANDS =================
// ============================================================

// ============================================================
// ADD META AI TO GROUP
// ============================================================

case 'addmetaai':
case 'addai': {
    if (!m.isGroup) return reply("👥 *Groups only*");
    try {
        await devtrust.groupParticipantsUpdate(
            m.chat,
            ["867051314767696@bot"],
            "add"
        );
        reply("✅ *Meta AI has been added to the group!*");
    } catch (e) {
        console.error(e);
        reply(`❌ *Failed to add Meta AI:*\n${String(e?.message || e)}`);
    }
}
break;

// ============================================================
// ================ MERGED FROM UPLOADED PLUGINS ===============
// ============================================================

// ===== ANTIWORD (custom word filter) =====
case 'antiword': {
    if (!m.isGroup) return reply('👥 *Groups only*');
    if (!isAdmins && !isCreator) return reply('🔒 *Admins only*');
    const awCfg = getSetting(botNumber + m.chat, "antiword", { active: false, action: 'delete', warnc: 3, words: [] });

    if (!args[0]) {
        return reply(`🚫 *AntiWord*\n\n` +
            `📌 *Usage:*\n` +
            `▸ ${prefix}antiword on\n` +
            `▸ ${prefix}antiword action kick/delete/warn 3\n` +
            `▸ ${prefix}antiword warnc 5\n` +
            `▸ ${prefix}antiword status\n` +
            `▸ ${prefix}antiword remove <word1,word2>/all\n` +
            `▸ ${prefix}antiword off\n` +
            `▸ ${prefix}antiword word1, word2 _(adds words)_\n\n` +
            `⚙️ *Status:* ${awCfg.active ? 'ON ✅' : 'OFF ❌'}\n` +
            `⚙️ *Action:* ${awCfg.action}${awCfg.action === 'warn' ? ` (${awCfg.warnc})` : ''}\n` +
            `⚙️ *Words:* ${awCfg.words.join(', ') || 'None'}`);
    }

    const sub = args[0].toLowerCase();
    const reserved = ['on', 'off', 'action', 'warnc', 'status', 'get', 'remove', 'rm'];

    if (sub === 'on') {
        awCfg.active = true;
        setSetting(botNumber + m.chat, "antiword", awCfg);
        return reply(`✅ *AntiWord enabled* (${awCfg.action})`);
    }
    if (sub === 'off') {
        awCfg.active = false;
        setSetting(botNumber + m.chat, "antiword", awCfg);
        return reply('❌ *AntiWord disabled*');
    }
    if (sub === 'action') {
        const act = args[1]?.toLowerCase();
        if (!['kick', 'delete', 'warn'].includes(act)) return reply(`✘ Use: ${prefix}antiword action kick/delete/warn 3`);
        awCfg.active = true;
        awCfg.action = act;
        if (act === 'warn') awCfg.warnc = parseInt(args[2]) || awCfg.warnc || 3;
        setSetting(botNumber + m.chat, "antiword", awCfg);
        return reply(`✅ *AntiWord action set to:* ${act}${act === 'warn' ? ` (${awCfg.warnc})` : ''}`);
    }
    if (sub === 'warnc') {
        const n = parseInt(args[1]);
        if (!n || n < 1) return reply(`✘ Usage: ${prefix}antiword warnc <number>`);
        awCfg.warnc = n;
        setSetting(botNumber + m.chat, "antiword", awCfg);
        return reply(`✅ *Warn count set to:* ${n}`);
    }
    if (sub === 'status' || sub === 'get') {
        return reply(`\`\`\`[ ANTIWORD STATUS ]\nActive: ${awCfg.active}\nAction: ${awCfg.action}\nWarn Count: ${awCfg.warnc}\nWords: ${awCfg.words.join(', ') || 'None'}\`\`\``);
    }
    if (sub === 'remove' || sub === 'rm') {
        const val = args.slice(1).join(' ');
        if (!val) return reply(`✘ Usage: ${prefix}antiword remove <word1,word2> or ${prefix}antiword remove all`);
        if (val.toLowerCase() === 'all') {
            awCfg.words = [];
            setSetting(botNumber + m.chat, "antiword", awCfg);
            return reply('✅ *All words removed*');
        }
        const toRemove = val.toLowerCase().split(',').map(w => w.trim());
        awCfg.words = awCfg.words.filter(w => !toRemove.includes(w));
        setSetting(botNumber + m.chat, "antiword", awCfg);
        return reply(`✅ *Removed:* ${toRemove.join(', ')}`);
    }
    if (reserved.includes(sub)) {
        return reply(`✘ "${sub}" is a reserved keyword, use ${prefix}antiword for help`);
    }
    // Anything else: treat the whole text as a comma-separated list of words to add
    const newWords = text.toLowerCase().split(',').map(w => w.trim()).filter(Boolean);
    const already = newWords.filter(w => awCfg.words.includes(w));
    const fresh = newWords.filter(w => !awCfg.words.includes(w));
    awCfg.words.push(...fresh);
    setSetting(botNumber + m.chat, "antiword", awCfg);
    let awMsg = '';
    if (fresh.length) awMsg += `✅ *Added:* ${fresh.join(', ')}\n`;
    if (already.length) awMsg += `⚠️ *Already existed:* ${already.join(', ')}`;
    return reply(awMsg || '✘ No valid words provided');
}
break;

// ===== ANTIGM (anti group-status-mention) =====
case 'antigm': {
    if (!m.isGroup) return reply('👥 *Groups only*');
    if (!isAdmins && !isCreator) return reply('🔒 *Admins only*');
    const gmCfg = getSetting(botNumber + m.chat, "antigm", { enabled: false, action: 'delete', maxwrn: 3 });

    if (!args[0]) {
        return reply(`📵 *AntiGM*\n_Action when someone @-mentions this group in their WhatsApp status._\n\n` +
            `📌 *Usage:*\n▸ ${prefix}antigm delete\n▸ ${prefix}antigm kick\n▸ ${prefix}antigm warn 3\n▸ ${prefix}antigm status\n▸ ${prefix}antigm off\n\n` +
            `⚙️ *Status:* ${gmCfg.enabled ? 'ON ✅' : 'OFF ❌'}\n⚙️ *Action:* ${gmCfg.enabled ? gmCfg.action : '-'}`);
    }
    const opt = args[0].toLowerCase();
    if (opt === 'delete') { setSetting(botNumber + m.chat, "antigm", { enabled: true, action: 'delete', maxwrn: gmCfg.maxwrn }); return reply('✅ *AntiGM enabled* (delete mode)'); }
    if (opt === 'kick') { setSetting(botNumber + m.chat, "antigm", { enabled: true, action: 'kick', maxwrn: gmCfg.maxwrn }); return reply('✅ *AntiGM enabled* (kick mode)'); }
    if (opt === 'warn') {
        const n = parseInt(args[1]);
        if (!n) return reply(`✘ Use ${prefix}antigm warn 3`);
        setSetting(botNumber + m.chat, "antigm", { enabled: true, action: 'warn', maxwrn: n });
        return reply(`✅ *AntiGM enabled* (warn mode, max ${n})`);
    }
    if (opt === 'status') return reply(`\`\`\`[ ANTIGM STATUS ]\nActive: ${gmCfg.enabled}\nAction: ${gmCfg.action}\nMaxWarn: ${gmCfg.maxwrn}\`\`\``);
    if (opt === 'off') { setSetting(botNumber + m.chat, "antigm", { enabled: false, action: 'delete', maxwrn: gmCfg.maxwrn }); return reply('❌ *AntiGM disabled*'); }
    return reply('✘ Invalid option. Use: delete, kick, warn, status, off');
}
break;

// ===== ANTIGCSTATUS (anti group-status-post) =====
case 'antigcstatus': {
    if (!m.isGroup) return reply('👥 *Groups only*');
    if (!isAdmins && !isCreator) return reply('🔒 *Admins only*');
    const gsCfg = getSetting(botNumber + m.chat, "antigcstatus", { enabled: false, action: 'delete', maxwrn: 3 });

    if (!args[0]) {
        return reply(`📴 *AntiGcStatus*\n_Action when a member posts to this group's status feed._\n\n` +
            `📌 *Usage:*\n▸ ${prefix}antigcstatus delete\n▸ ${prefix}antigcstatus kick\n▸ ${prefix}antigcstatus warn 3\n▸ ${prefix}antigcstatus status\n▸ ${prefix}antigcstatus off\n\n` +
            `⚙️ *Status:* ${gsCfg.enabled ? 'ON ✅' : 'OFF ❌'}\n⚙️ *Action:* ${gsCfg.enabled ? gsCfg.action : '-'}`);
    }
    const opt = args[0].toLowerCase();
    if (opt === 'delete') { setSetting(botNumber + m.chat, "antigcstatus", { enabled: true, action: 'delete', maxwrn: gsCfg.maxwrn }); return reply('✅ *AntiGcStatus enabled* (delete mode)'); }
    if (opt === 'kick') { setSetting(botNumber + m.chat, "antigcstatus", { enabled: true, action: 'kick', maxwrn: gsCfg.maxwrn }); return reply('✅ *AntiGcStatus enabled* (kick mode)'); }
    if (opt === 'warn') {
        const n = parseInt(args[1]);
        if (!n) return reply(`✘ Use ${prefix}antigcstatus warn 3`);
        setSetting(botNumber + m.chat, "antigcstatus", { enabled: true, action: 'warn', maxwrn: n });
        return reply(`✅ *AntiGcStatus enabled* (warn mode, max ${n})`);
    }
    if (opt === 'status') return reply(`\`\`\`[ ANTIGCSTATUS STATUS ]\nActive: ${gsCfg.enabled}\nAction: ${gsCfg.action}\nMaxWarn: ${gsCfg.maxwrn}\`\`\``);
    if (opt === 'off') { setSetting(botNumber + m.chat, "antigcstatus", { enabled: false, action: 'delete', maxwrn: gsCfg.maxwrn }); return reply('❌ *AntiGcStatus disabled*'); }
    return reply('✘ Invalid option. Use: delete, kick, warn, status, off');
}
break;

// ===== AKICK (auto-kick list) =====
case 'akick': {
    if (!m.isGroup) return reply('👥 *Groups only*');
    if (!isAdmins && !isCreator) return reply('🔒 *Admins only*');
    if (!isBotAdmins) return reply('✘ Bot needs to be admin');

    const akMentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const isRemoveCmd = args[0]?.toLowerCase() === 'remove';
    const isListCmd = args[0]?.toLowerCase() === 'list';
    const numberArg = isRemoveCmd ? args[1] : args[0];

    if (isListCmd) {
        const list = getSetting(botNumber + m.chat, "akick", []);
        if (!list.length) return reply('_No users in auto-kick list_');
        return reply(`🚫 *Auto-Kick List:*\n${list.map((j, i) => `${i + 1}. @${j.split('@')[0]}`).join('\n')}`, list);
    }

    const akUser = akMentioned[0] || m.quoted?.sender || (numberArg && toParticipantJid(numberArg));
    if (!akUser) return reply(`✘ Reply to or mention a member\n_To remove:_ ${prefix}akick remove 234xxxxxxxxx\n_To list:_ ${prefix}akick list`);

    const akList = getSetting(botNumber + m.chat, "akick", []);

    if (isRemoveCmd) {
        if (!akList.includes(akUser)) return reply('✘ User is not in the auto-kick list');
        setSetting(botNumber + m.chat, "akick", akList.filter(j => j !== akUser));
        return reply(`✅ @${akUser.split('@')[0]} removed from auto-kick list`, [akUser]);
    }

    if (akList.includes(akUser)) return reply('⚠️ User is already in the auto-kick list');
    akList.push(akUser);
    setSetting(botNumber + m.chat, "akick", akList);
    try {
        await devtrust.groupParticipantsUpdate(m.chat, [akUser], 'remove');
        reply(`✅ @${akUser.split('@')[0]} added to auto-kick list and removed`, [akUser]);
    } catch (e) {
        reply(`✅ @${akUser.split('@')[0]} added to auto-kick list (couldn't remove them right now: ${e.message})`, [akUser]);
    }
}
break;

// ===== PHOTO/TOIMG (sticker -> image) =====
case 'photo':
case 'toimg': {
    if (!m.quoted?.sticker) return reply('✘ Reply to a sticker');
    if (m.quoted?.isAnimated) return reply('✘ Reply to a static (non-animated) sticker');
    try {
        const buff = await m.quoted.download();
        await devtrust.sendMessage(m.chat, { image: buff }, { quoted: m });
    } catch (e) {
        reply('✘ ' + e.message);
    }
}
break;

// ===== ADDITIONAL AUDIO EFFECTS (smooth, tremolo, vibrato, 8d, flanger) =====
case "smooth": { if (!m.quoted?.message?.audioMessage && !m.message?.audioMessage) return reply(`🌊 *Smooth Effect*\nReply to audio: ${prefix}smooth`); try { reply('⏳ *Applying smooth effect...*'); const ffmpeg = require('fluent-ffmpeg'); const quoted = m.quoted || m; const media = await downloadMediaMessage(quoted, 'buffer', {}); const tmpIn = `./tmp/in_${Date.now()}.mp3`; const tmpOut = `./tmp/out_${Date.now()}.mp3`; fs.writeFileSync(tmpIn, media); await new Promise((res, rej) => ffmpeg(tmpIn).audioFilters('asubboost=dry=0:wet=1:decay=0.1:feedback=0.1:cutoff=100:slope=0.5:delay=20').save(tmpOut).on('end', res).on('error', rej)); const buf = fs.readFileSync(tmpOut); fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); await devtrust.sendMessage(m.chat, { audio: buf, mimetype: 'audio/mpeg', ptt: false }, { quoted: m }); } catch(e) { reply(`❌ *Error:* ${e.message}`); } } break;

case "tremolo": { if (!m.quoted?.message?.audioMessage && !m.message?.audioMessage) return reply(`〰️ *Tremolo Effect*\nReply to audio: ${prefix}tremolo`); try { reply('⏳ *Applying tremolo...*'); const ffmpeg = require('fluent-ffmpeg'); const quoted = m.quoted || m; const media = await downloadMediaMessage(quoted, 'buffer', {}); const tmpIn = `./tmp/in_${Date.now()}.mp3`; const tmpOut = `./tmp/out_${Date.now()}.mp3`; fs.writeFileSync(tmpIn, media); await new Promise((res, rej) => ffmpeg(tmpIn).audioFilters('tremolo=f=6:d=0.5').save(tmpOut).on('end', res).on('error', rej)); const buf = fs.readFileSync(tmpOut); fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); await devtrust.sendMessage(m.chat, { audio: buf, mimetype: 'audio/mpeg', ptt: false }, { quoted: m }); } catch(e) { reply(`❌ *Error:* ${e.message}`); } } break;

case "vibrato": { if (!m.quoted?.message?.audioMessage && !m.message?.audioMessage) return reply(`🎻 *Vibrato Effect*\nReply to audio: ${prefix}vibrato`); try { reply('⏳ *Applying vibrato...*'); const ffmpeg = require('fluent-ffmpeg'); const quoted = m.quoted || m; const media = await downloadMediaMessage(quoted, 'buffer', {}); const tmpIn = `./tmp/in_${Date.now()}.mp3`; const tmpOut = `./tmp/out_${Date.now()}.mp3`; fs.writeFileSync(tmpIn, media); await new Promise((res, rej) => ffmpeg(tmpIn).audioFilters('vibrato=f=7:d=0.5').save(tmpOut).on('end', res).on('error', rej)); const buf = fs.readFileSync(tmpOut); fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); await devtrust.sendMessage(m.chat, { audio: buf, mimetype: 'audio/mpeg', ptt: false }, { quoted: m }); } catch(e) { reply(`❌ *Error:* ${e.message}`); } } break;

case "8d": { if (!m.quoted?.message?.audioMessage && !m.message?.audioMessage) return reply(`🎧 *8D Audio*\nReply to audio: ${prefix}8d`); try { reply('⏳ *Applying 8D effect...*'); const ffmpeg = require('fluent-ffmpeg'); const quoted = m.quoted || m; const media = await downloadMediaMessage(quoted, 'buffer', {}); const tmpIn = `./tmp/in_${Date.now()}.mp3`; const tmpOut = `./tmp/out_${Date.now()}.mp3`; fs.writeFileSync(tmpIn, media); await new Promise((res, rej) => ffmpeg(tmpIn).audioFilters('apulsator=hz=0.125').save(tmpOut).on('end', res).on('error', rej)); const buf = fs.readFileSync(tmpOut); fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); await devtrust.sendMessage(m.chat, { audio: buf, mimetype: 'audio/mpeg', ptt: false }, { quoted: m }); } catch(e) { reply(`❌ *Error:* ${e.message}`); } } break;

case "flanger": { if (!m.quoted?.message?.audioMessage && !m.message?.audioMessage) return reply(`🌀 *Flanger Effect*\nReply to audio: ${prefix}flanger`); try { reply('⏳ *Applying flanger...*'); const ffmpeg = require('fluent-ffmpeg'); const quoted = m.quoted || m; const media = await downloadMediaMessage(quoted, 'buffer', {}); const tmpIn = `./tmp/in_${Date.now()}.mp3`; const tmpOut = `./tmp/out_${Date.now()}.mp3`; fs.writeFileSync(tmpIn, media); await new Promise((res, rej) => ffmpeg(tmpIn).audioFilters('flanger=delay=5:depth=2:regen=5:width=5:speed=2:shape=sine:phase=90:interp=linear').save(tmpOut).on('end', res).on('error', rej)); const buf = fs.readFileSync(tmpOut); fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); await devtrust.sendMessage(m.chat, { audio: buf, mimetype: 'audio/mpeg', ptt: false }, { quoted: m }); } catch(e) { reply(`❌ *Error:* ${e.message}`); } } break;

// ===== GCSTATUS/UPSWGC (post a WhatsApp group status) =====
// Ported from the uploaded group-commands file, with two fixes applied:
//  1. The original checked `m.isAdmin` (never set anywhere — always
//     undefined), so real admins got silently blocked in the two hardcoded
//     groups. Now uses the actual isAdmins/isCreator booleans this file
//     already computes per-message.
//  2. m.client / Baileys() swapped for this file's own devtrust +
//     top-level prepareWAMessageMedia/generateWAMessageFromContent/proto,
//     which are already available here.
case 'gcstatus':
case 'upswgc': {
    try {
        const GCSTATUS_COLORS = {
            green: 0xFF25D366, red: 0xFFFF0000, blue: 0xFF0000FF, yellow: 0xFFFFFF00,
            purple: 0xFF800080, black: 0xFF000000, white: 0xFFFFFFFF, orange: 0xFFFFA500
        };

        const gcQuoted = m.quoted;
        const gcIsImage = gcQuoted?.image;
        const gcIsVideo = gcQuoted?.video;
        const gcIsAudio = gcQuoted?.audio;

        // Restrict to specific groups if configured — real admin check this time.
        const restrictedGroups = ["120363425297756989@g.us", "120363420506313518@g.us"];
        if (restrictedGroups.includes(m.chat) && !isAdmins && !isCreator) {
            return reply('_not this group_');
        }

        let gcGroupId, gcMessageText, gcChosenColor = null;

        if (!m.isGroup) {
            if (gcQuoted && (gcIsImage || gcIsVideo || gcIsAudio)) {
                if (!text) return reply(`Provide the group JID.\nUsage: ${prefix}gcstatus groupjid\nExample: ${prefix}gcstatus 123456789-123456@g.us`);
                gcGroupId = text.trim();
            } else {
                if (!text) return reply(`Usage: ${prefix}gcstatus groupjid,message,color\nExample: ${prefix}gcstatus 123456789-123456@g.us,Hello!,blue\nColors: ${Object.keys(GCSTATUS_COLORS).join(', ')}`);
                const parts = text.split(',').map(p => p.trim());
                if (parts.length < 2) return reply(`Provide at least group JID and text.\nExample: ${prefix}gcstatus 123456789-123456@g.us,Hello!`);
                gcGroupId = parts[0];
                gcMessageText = parts[1];
                if (parts[2] && GCSTATUS_COLORS[parts[2].toLowerCase()]) gcChosenColor = GCSTATUS_COLORS[parts[2].toLowerCase()];
            }
        } else {
            gcGroupId = m.chat;
            gcMessageText = text;
        }

        if (!gcIsImage && !gcIsVideo && !gcIsAudio && !gcMessageText) {
            return reply(`Reply to media or provide text\n\nExamples:\n${prefix}gcstatus\n${prefix}gcstatus Hello Group\n${prefix}gcstatus Hello Group,red\nColors: ${Object.keys(GCSTATUS_COLORS).join(', ')}`);
        }

        let gcPayload = {};

        if (gcIsImage || gcIsVideo || gcIsAudio) {
            const mediaBuffer = await gcQuoted.download();
            let mediaOptions = {};
            if (gcIsImage) mediaOptions = { image: mediaBuffer, caption: gcQuoted.text || '' };
            else if (gcIsVideo) mediaOptions = { video: mediaBuffer, caption: gcQuoted.text || '' };
            else if (gcIsAudio) mediaOptions = { audio: mediaBuffer, mimetype: gcQuoted.mimetype, ptt: gcQuoted.ptt || false, seconds: gcQuoted.seconds, waveform: gcQuoted.waveform };

            const preparedMedia = await prepareWAMessageMedia(mediaOptions, { upload: devtrust.waUploadToServer });

            let gcMediaMessage = {};
            if (gcIsImage) gcMediaMessage = { imageMessage: preparedMedia.imageMessage };
            else if (gcIsVideo) gcMediaMessage = { videoMessage: preparedMedia.videoMessage };
            else if (gcIsAudio) gcMediaMessage = { audioMessage: preparedMedia.audioMessage };

            gcPayload = { groupStatusMessageV2: { message: gcMediaMessage } };
        } else {
            let bgColor = gcChosenColor ?? (() => {
                const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
                return 0xff000000 + parseInt(randomHex, 16);
            })();

            if (m.isGroup && gcMessageText?.includes(',')) {
                const parts = gcMessageText.split(',').map(p => p.trim());
                gcMessageText = parts[0];
                if (parts[1] && GCSTATUS_COLORS[parts[1].toLowerCase()]) bgColor = GCSTATUS_COLORS[parts[1].toLowerCase()];
            }

            gcPayload = {
                groupStatusMessageV2: {
                    message: { extendedTextMessage: { text: gcMessageText, backgroundArgb: bgColor, font: 2 } }
                }
            };
        }

        const gcMsg = generateWAMessageFromContent(gcGroupId, proto.Message.fromObject(gcPayload), { userJid: devtrust.user.id });
        await devtrust.relayMessage(gcGroupId, gcMsg.message, { messageId: gcMsg.key.id });

        if (!m.isGroup) await reply('Group status sent successfully.');
        try { await devtrust.sendMessage(m.chat, { react: { text: '✓', key: m.key } }); } catch (e) {}
    } catch (e) {
        console.log('cmd error', e);
        reply('✘ ' + e.message);
    }
}
break;

// DEFAULT: eval for owner, silent ignore for others
    default:
      return false;
  }
  return true;
};
