// ============================================================
// lang.js — Bilingual System (English / Chinese) - Part 8
// ============================================================

const LANG = {
  zh: {
    // ---------- UI ----------
    rank: "军阶",
    stars: "星级",
    exp: "经验",
    gold: "金币",
    cp: "战斗力",
    kill: "击杀",
    boss: "首领",
    autoFight: "自动战斗",
    offlineEarning: "离线收益",
    doubleReward: "双倍领取",
    promotion: "晋升考核",
    trialPass: "通过考核！晋升成功！",
    trialFail: "考核失败，继续努力！",
    normalTrial: "普通晋升 50%",
    premiumTrial: "军费晋升 70%",
    watchAd: "观看广告 100%",
    starsFull: "★★★★★ 已满，可晋升！",
    save: "存档",
    load: "读档",
    claim: "领取",
    confirm: "确认",
    cancel: "取消",

    // ---------- Promotion ----------
    promoteNormal: "普通晋升",
    promoteGold: "军费晋升",
    promoteAd: "推介信",
    promoteNormalDesc: "消耗经验，成功率50%",
    promoteGoldDesc: "消耗金币，成功率70%",
    promoteAdDesc: "观看广告，100%成功",
    failPenalty: "失败扣50%经验",
    goldLost: "金币不退",
    guaranteed: "必定成功",

    // ---------- Story ----------
    storyTitle: "⭐ 故事",
    storySkip: "跳过",
    storyContinue: "继续 ▶",

    // ---------- Buildings ----------
    building: "建筑",
    goldMine: "金矿",
    ironMine: "铁矿",
    riceFarm: "稻田",
    barracks: "兵营",
    hospital: "医院",
    buildingMaxLevel: "已达当前军阶最大等级",
    notEnoughGold: "金币不足",
    buildingUpgraded: "建筑升级成功！",
    buildingProduction: "建筑产出",

    // ---------- Soldiers ----------
    soldier: "士兵",
    soldiers: "士兵",
    train: "训练",
    trainSoldier: "训练士兵",
    treat: "治疗",
    treatWounded: "治疗伤兵",
    wounded: "伤兵",
    totalSoldiers: "总兵力",
    soldierMax: "最大兵力",
    ricePerSecond: "稻米消耗/秒",
    trainCost: "训练消耗",
    healCost: "治疗消耗",
    noWounded: "没有伤兵",
    maxSoldiersReached: "已达最大兵力上限",
    notEnoughRice: "稻米不足",
    soldierTrained: "士兵训练完成！",
    soldierTrainedAd: "士兵训练完成！(广告加速)",
    soldierHealed: "伤兵治疗完成！",
    soldierHealedAd: "伤兵治疗完成！(广告加速)",
    soldierDied: "士兵在战斗中阵亡",

    // ---------- Fleet ----------
    fleet: "舰队",
    fleetUpgrade: "升级战舰",
    fleetLocked: "未解锁",
    fleetLevel: "等级",
    fleetCp: "舰队战斗力",
    fleetMaxLevel: "已达最大等级",
    notEnoughIron: "铁矿不足",
    fleetUpgraded: "战舰升级成功！",
    fleetUpgradedAd: "战舰升级成功！(广告加速)",

    // ---------- Tech ----------
    tech: "科技树",
    techPoint: "科技点",
    techUpgrade: "研究科技",
    techLocked: "未解锁",
    techMaxLevel: "已达最大等级",
    techEffectCp: "+战斗力",
    techEffectIncome: "+收入",
    techEffectArmor: "-士兵死亡率",
    techEffectRadar: "-Boss间隔",
    techEffectAI: "+战斗效率",
    techEffectBoss: "+Boss伤害",
    techEffectAll: "+全部收益",
    techUpgraded: "科技研究成功！",
    techUpgradedAd: "科技研究成功！(广告加速)",
    techPointGain: "获得科技点",
    notEnoughTechPoint: "科技点不足",

    // ---------- Equipment ----------
    equipment: "装备",
    equipUpgrade: "升级装备",
    equipLocked: "未解锁",
    equipMaxLevel: "已达最大等级",
    equipCp: "战斗力",
    equipArmor: "死亡率减免",
    equipIncome: "收入加成",
    equipBoss: "Boss伤害加成",
    equipEfficiency: "战斗效率加成",
    equipAll: "全属性加成",
    equipUpgraded: "装备升级成功！",
    equipUpgradedAd: "装备升级成功！(广告加速)",

    // ---------- Daily Quests ----------
    dailyQuest: "每日任务",
    dailyQuests: "每日任务",
    dailyReset: "每日重置",
    dailyProgress: "进度",
    dailyClaim: "领取奖励",
    dailyCompleted: "已完成",
    dailyIncomplete: "未完成",
    dailyReward: "奖励",
    dailyDone: "✅ 已完成",
    dailyClaimed: "已领取",

    // ---------- Achievements ----------
    achievement: "成就",
    achievements: "成就",
    achievementUnlocked: "🎉 成就解锁！",
    achievementLocked: "未解锁",
    achievementProgress: "进度",
    achievementReward: "奖励",
    achievementClaimed: "已领取",

    // ---------- Events ----------
    event: "随机事件",
    eventTitle: "⚡ 随机事件",
    eventClaim: "领取奖励",
    eventDismiss: "忽略",
    eventAdBonus: "📺 广告奖励 ×2",
    eventNoAd: "广告加载失败，已普通领取",
    eventBuff: "🔁 双倍收益 Buff",

    // ---------- Event Names ----------
    evt_airdrop_title: "空投补给",
    evt_airdrop_desc: "一架货运无人机飘入你的星域。领取补给！",
    evt_scout_title: "侦察兵报告",
    evt_scout_desc: "侦察兵发现了一个废弃研究站。里面有宝贵的数据！",
    evt_enemyTruck_title: "敌军补给车队",
    evt_enemyTruck_desc: "一支敌军补给车队正在通过。是时候突袭了！",
    evt_armsDealer_title: "神秘军火商",
    evt_armsDealer_desc: "一个神秘人物向你提供先进武器。当然，要付出代价。",
    evt_crash_title: "坠毁的运输船",
    evt_crash_desc: "一艘受损的运输船在附近坠毁。幸存者需要帮助。",
    evt_lab_title: "秘密实验室",
    evt_lab_desc: "你的小队发现了一个地下实验室。里面有实验性科技！",
    evt_reporter_title: "战地记者",
    evt_reporter_desc: "一位记者想要记录你的故事。名气带来回报！",
    evt_contest_title: "军事演习",
    evt_contest_desc: "星域举办了一场军事竞赛。展示你的技能！",
    evt_spy_title: "截获敌方情报",
    evt_spy_desc: "你的间谍截获了敌方通信。宝贵的情报！",
    evt_auction_title: "武器拍卖会",
    evt_auction_desc: "一场黑市拍卖正在进行。有稀有武器出售！",
    evt_merchant_title: "星际商人",
    evt_merchant_desc: "一位星际商人路过。可以用铁矿换取金币！",
    evt_rift_title: "时空裂隙",
    evt_rift_desc: "一道时空裂隙出现在你的星域。获得大量科技点！",

    // ---------- Tutorial ----------
    tutorial: "主线任务",
    tutorialComplete: "✅ 任务完成！",
    tutorialReward: "奖励",

    // ---------- Ads ----------
    adLoading: "广告加载中...",
    adComplete: "广告观看完成！",
    adFailed: "广告加载失败",
    adCooldown: "广告冷却中，请稍后",
    adDailyLimit: "今日广告次数已达上限",

    // ---------- Misc ----------
    attempts: "尝试",
    success: "成功",
    iron: "铁矿",
    level: "等级"
  },

  en: {
    // ---------- UI ----------
    rank: "Rank",
    stars: "Stars",
    exp: "EXP",
    gold: "Gold",
    cp: "CP",
    kill: "Kills",
    boss: "Boss",
    autoFight: "Auto Combat",
    offlineEarning: "Offline Earnings",
    doubleReward: "Double Claim",
    promotion: "Promotion",
    trialPass: "Trial Passed! Promoted!",
    trialFail: "Trial Failed! Keep fighting!",
    normalTrial: "Standard 50%",
    premiumTrial: "Military Funds 70%",
    watchAd: "Watch Ad 100%",
    starsFull: "★★★★★ Full! Ready to promote!",
    save: "Save",
    load: "Load",
    claim: "Claim",
    confirm: "Confirm",
    cancel: "Cancel",

    // ---------- Promotion ----------
    promoteNormal: "Standard",
    promoteGold: "Military Funds",
    promoteAd: "Recommendation",
    promoteNormalDesc: "Cost EXP, 50% chance",
    promoteGoldDesc: "Cost Gold, 70% chance",
    promoteAdDesc: "Watch Ad, 100% success",
    failPenalty: "Fail: -50% EXP",
    goldLost: "Gold lost on fail",
    guaranteed: "Guaranteed",

    // ---------- Story ----------
    storyTitle: "⭐ Story",
    storySkip: "Skip",
    storyContinue: "Continue ▶",

    // ---------- Buildings ----------
    building: "Buildings",
    goldMine: "Gold Mine",
    ironMine: "Iron Mine",
    riceFarm: "Rice Farm",
    barracks: "Barracks",
    hospital: "Hospital",
    buildingMaxLevel: "Max level for current rank",
    notEnoughGold: "Not enough gold!",
    buildingUpgraded: "Building upgraded!",
    buildingProduction: "Building Production",

    // ---------- Soldiers ----------
    soldier: "Soldier",
    soldiers: "Soldiers",
    train: "Train",
    trainSoldier: "Train Soldier",
    treat: "Treat",
    treatWounded: "Treat Wounded",
    wounded: "Wounded",
    totalSoldiers: "Total Soldiers",
    soldierMax: "Max Soldiers",
    ricePerSecond: "Rice/sec",
    trainCost: "Training Cost",
    healCost: "Heal Cost",
    noWounded: "No wounded soldiers",
    maxSoldiersReached: "Max soldiers reached",
    notEnoughRice: "Not enough rice!",
    soldierTrained: "Soldier trained!",
    soldierTrainedAd: "Soldier trained! (Ad Boost)",
    soldierHealed: "Wounded healed!",
    soldierHealedAd: "Wounded healed! (Ad Boost)",
    soldierDied: "A soldier died in combat",

    // ---------- Fleet ----------
    fleet: "Fleet",
    fleetUpgrade: "Upgrade Ship",
    fleetLocked: "Locked",
    fleetLevel: "Level",
    fleetCp: "Fleet CP",
    fleetMaxLevel: "Max level reached",
    notEnoughIron: "Not enough iron!",
    fleetUpgraded: "Ship upgraded!",
    fleetUpgradedAd: "Ship upgraded! (Ad Boost)",

    // ---------- Tech ----------
    tech: "Tech Tree",
    techPoint: "Tech Points",
    techUpgrade: "Research",
    techLocked: "Locked",
    techMaxLevel: "Max level reached",
    techEffectCp: "+CP",
    techEffectIncome: "+Income",
    techEffectArmor: "-Soldier Death",
    techEffectRadar: "-Boss Interval",
    techEffectAI: "+Combat Efficiency",
    techEffectBoss: "+Boss Damage",
    techEffectAll: "+All Stats",
    techUpgraded: "Tech researched!",
    techUpgradedAd: "Tech researched! (Ad Boost)",
    techPointGain: "Tech Points gained",
    notEnoughTechPoint: "Not enough tech points!",

    // ---------- Equipment ----------
    equipment: "Equipment",
    equipUpgrade: "Upgrade Gear",
    equipLocked: "Locked",
    equipMaxLevel: "Max level reached",
    equipCp: "+CP",
    equipArmor: "-Death Rate",
    equipIncome: "+Income",
    equipBoss: "+Boss Damage",
    equipEfficiency: "+Combat Efficiency",
    equipAll: "+All Stats",
    equipUpgraded: "Gear upgraded!",
    equipUpgradedAd: "Gear upgraded! (Ad Boost)",

    // ---------- Daily Quests ----------
    dailyQuest: "Daily Quest",
    dailyQuests: "Daily Quests",
    dailyReset: "Daily Reset",
    dailyProgress: "Progress",
    dailyClaim: "Claim Reward",
    dailyCompleted: "Completed",
    dailyIncomplete: "Incomplete",
    dailyReward: "Reward",
    dailyDone: "✅ Done",
    dailyClaimed: "Claimed",

    // ---------- Achievements ----------
    achievement: "Achievement",
    achievements: "Achievements",
    achievementUnlocked: "🎉 Achievement Unlocked!",
    achievementLocked: "Locked",
    achievementProgress: "Progress",
    achievementReward: "Reward",
    achievementClaimed: "Claimed",

    // ---------- Events ----------
    event: "Random Event",
    eventTitle: "⚡ Random Event",
    eventClaim: "Claim Reward",
    eventDismiss: "Dismiss",
    eventAdBonus: "📺 Ad Reward ×2",
    eventNoAd: "Ad failed, normal reward claimed",
    eventBuff: "🔁 Double Rewards Buff",

    // ---------- Event Names ----------
    evt_airdrop_title: "Airdrop Supply",
    evt_airdrop_desc: "A cargo drone drifts into your sector. Claim the supplies!",
    evt_scout_title: "Scout Reports",
    evt_scout_desc: "Your scouts discovered an abandoned research station. Valuable data inside!",
    evt_enemyTruck_title: "Enemy Supply Convoy",
    evt_enemyTruck_desc: "An enemy supply convoy is passing through. Time for a raid!",
    evt_armsDealer_title: "Mysterious Arms Dealer",
    evt_armsDealer_desc: "A shadowy figure offers you advanced weaponry. For a price.",
    evt_crash_title: "Crashed Dropship",
    evt_crash_desc: "A damaged dropship crash-landed nearby. Survivors need help.",
    evt_lab_title: "Secret Lab Discovery",
    evt_lab_desc: "Your team discovered an underground lab. Experimental tech inside!",
    evt_reporter_title: "War Correspondent",
    evt_reporter_desc: "A journalist wants to document your story. Popularity brings rewards!",
    evt_contest_title: "Military Exercise",
    evt_contest_desc: "The sector holds a military competition. Show your skills!",
    evt_spy_title: "Enemy Intel Captured",
    evt_spy_desc: "Your spies intercepted enemy communications. Valuable intel!",
    evt_auction_title: "Weapons Auction",
    evt_auction_desc: "A black market auction is happening. Rare weapons available!",
    evt_merchant_title: "Star Merchant",
    evt_merchant_desc: "A star merchant passes by. Trade iron for gold!",
    evt_rift_title: "Temporal Rift",
    evt_rift_desc: "A temporal rift appears in your sector. Massive tech points!",

    // ---------- Tutorial ----------
    tutorial: "Main Quest",
    tutorialComplete: "✅ Quest Complete!",
    tutorialReward: "Reward",

    // ---------- Ads ----------
    adLoading: "Loading ad...",
    adComplete: "Ad complete!",
    adFailed: "Ad failed to load",
    adCooldown: "Ad cooldown, please wait",
    adDailyLimit: "Daily ad limit reached",

    // ---------- Misc ----------
    attempts: "Attempts",
    success: "Success",
    iron: "Iron",
    level: "Level"
  }
};

// Current language
let langCurrent = 'en';

function t(key) {
  return LANG[langCurrent][key] || key;
}

function switchLang(lang) {
  if (LANG[lang]) {
    langCurrent = lang;
    localStorage.setItem('commander_lang', lang);
    if (typeof updateUI === 'function') updateUI();
    updateStartScreenLang();
  }
}

function updateStartScreenLang() {
  const isZh = langCurrent === 'zh';
  const startBtn = document.querySelector('#gs-container .btn-start');
  if (startBtn) startBtn.textContent = isZh ? '开始指挥' : 'Begin Command';
  const zhBtn = document.getElementById('lang-zh-btn');
  const enBtn = document.getElementById('lang-en-btn');
  if (zhBtn) zhBtn.textContent = isZh ? '中文' : 'Chinese';
  if (enBtn) enBtn.textContent = isZh ? 'English' : 'English';
  const info = document.getElementById('save-info');
  if (info) {
    const hasSave = localStorage.getItem('commander_save') ? true : false;
    info.textContent = hasSave ? (isZh ? '📁 存档已加载' : '📁 Save Loaded') : (isZh ? '📁 新游戏' : '📁 New Game');
  }
}

if (localStorage.getItem('commander_lang')) {
  langCurrent = localStorage.getItem('commander_lang');
}