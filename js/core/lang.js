// ============================================================
// lang.js — Bilingual System (Part 12 - 添加转生翻译)
// ============================================================

const LANG = {
  zh: {
    // ---------- UI 核心 ----------
    rank: "军衔",
    stars: "战星",
    exp: "经验",
    gold: "金币",
    cp: "战斗力",
    kill: "击杀",
    boss: "敌军指挥官",
    autoFight: "战场",
    offlineEarning: "离线收益",
    doubleReward: "双倍领取",
    promotion: "晋升试炼",
    trialPass: "✅ 试炼通过！晋升成功！",
    trialFail: "❌ 试炼失败！继续战斗！",
    normalTrial: "标准试炼 50%",
    premiumTrial: "军费晋升 70%",
    watchAd: "观看广告 100%",
    starsFull: "★★★★★ 战星已满，准备晋升！",
    save: "存档",
    load: "读档",
    claim: "领取",
    confirm: "确认",
    cancel: "取消",

    // ---------- 晋升 ----------
    promoteNormal: "标准试炼",
    promoteGold: "军费晋升",
    promoteAd: "推荐信",
    promoteNormalDesc: "消耗经验，成功率50%",
    promoteGoldDesc: "消耗金币，成功率70%",
    promoteAdDesc: "观看广告，100%成功",
    failPenalty: "失败扣除50%经验",
    goldLost: "金币不退",
    guaranteed: "必定成功",

    // ---------- 故事 ----------
    storyTitle: "⭐ 战地日志",
    storySkip: "跳过",
    storyContinue: "继续 ▶",

    // ---------- 建筑 ----------
    building: "基地设施",
    goldMine: "金矿",
    ironMine: "铁矿",
    riceFarm: "稻田",
    barracks: "兵营",
    hospital: "战地医院",
    buildingMaxLevel: "已达当前军衔最大等级",
    notEnoughGold: "金币不足",
    buildingUpgraded: "设施升级成功！",
    buildingProduction: "基地产出",

    // ---------- 士兵 ----------
    soldier: "士兵",
    soldiers: "兵力",
    train: "训练",
    trainSoldier: "训练士兵",
    treat: "救治",
    treatWounded: "救治伤兵",
    wounded: "伤兵",
    totalSoldiers: "总兵力",
    soldierMax: "最大兵力",
    ricePerSecond: "稻米消耗/秒",
    trainCost: "训练消耗",
    healCost: "救治消耗",
    noWounded: "无伤兵",
    maxSoldiersReached: "已达最大兵力上限",
    notEnoughRice: "稻米不足",
    soldierTrained: "士兵训练完成！",
    soldierTrainedAd: "士兵训练完成！(广告加速)",
    soldierHealed: "伤兵救治完成！",
    soldierHealedAd: "伤兵救治完成！(广告加速)",
    soldierDied: "一名士兵在战斗中阵亡",

    // ---------- 舰队 ----------
    fleet: "舰队",
    fleetUpgrade: "升级战舰",
    fleetLocked: "未解锁",
    fleetLevel: "等级",
    fleetCp: "舰队火力",
    fleetMaxLevel: "已达最大等级",
    notEnoughIron: "铁矿不足",
    fleetUpgraded: "战舰升级成功！",
    fleetUpgradedAd: "战舰升级成功！(广告加速)",

    // ---------- 科技 ----------
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

    // ---------- 装备 ----------
    equipment: "军备",
    equipUpgrade: "升级军备",
    equipLocked: "未解锁",
    equipMaxLevel: "已达最大等级",
    equipCp: "+战斗力",
    equipArmor: "-死亡率",
    equipIncome: "+收入",
    equipBoss: "+Boss伤害",
    equipEfficiency: "+战斗效率",
    equipAll: "+全属性",
    equipUpgraded: "军备升级成功！",
    equipUpgradedAd: "军备升级成功！(广告加速)",

    // ---------- 每日任务 ----------
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

    // ---------- 签到 ----------
    loginCheckIn: "每日签到",
    loginDay: "签到第 {day} 天",
    loginStreak: "连续签到 {streak} 天",
    loginClaim: "签到领取",
    loginReward: "签到奖励",
    loginSpecial: "🎉 超级奖励！",
    loginAllClaimed: "🎉 已完成所有签到！",
    loginStreakBroken: "⚠️ 签到中断，已重置",
    loginAlreadyClaimed: "📅 今日已签到",

    // ---------- 成就 ----------
    achievement: "功勋",
    achievements: "功勋墙",
    achievementUnlocked: "🎖️ 功勋解锁！",
    achievementLocked: "未解锁",
    achievementProgress: "进度",
    achievementReward: "奖励",

    // ---------- 事件 ----------
    event: "战场事件",
    eventTitle: "⚡ 战场事件",
    eventClaim: "领取战利品",
    eventDismiss: "忽略",
    eventAdBonus: "📺 广告奖励 ×2",
    eventNoAd: "广告加载失败，已普通领取",
    eventBuff: "🔁 双倍收益增益",

    // ---------- 教程 ----------
    tutorial: "主线任务",
    tutorialComplete: "✅ 任务完成！",
    tutorialReward: "奖励",

    // ---------- 广告 ----------
    adLoading: "加载广告中...",
    adComplete: "广告观看完成！",
    adFailed: "广告加载失败",
    adCooldown: "广告冷却中，请稍后",
    adDailyLimit: "今日广告次数已达上限",
    adblockDetected: "请关闭广告拦截器以获取奖励",

    // ---------- 通用 ----------
    attempts: "尝试次数",
    success: "成功次数",
    iron: "铁矿",
    level: "等级",
    pause: "停火",
    start: "出击",
    engage: "出击",
    holdFire: "停火",

    // ---------- 战争化 ----------
    battlefield: "战场",
    enemyCommander: "敌军指挥官",
    promotionTrial: "晋升试炼",
    battleStars: "战星",
    militaryRank: "军衔",
    earnBattleStars: "集满 5 颗战星即可晋升",
    welcomeCommander: "欢迎回来，指挥官",
    standingBy: "待命中...",
    engaging: "交战中...",
    victorious: "胜利！",
    defeated: "战败...",
    reinforcements: "增援抵达",

    // ---------- ★★★ 转生系统 (Part 12) ★★★ ----------
    prestige: "转生",
    prestigeTitle: "🔄 转生系统",
    prestigeDesc: "退伍重开，换取永久勋章",
    prestigeRequirement: "需要军阶达到 {rank} 才能转生",
    prestigeButton: "开始转生",
    prestigeConfirm: "⚠️ 确认转生？这将重置几乎所有进度，但永久保留勋章！",
    prestigeSuccess: "🎉 转生成功！获得 {medals} 枚勋章！",
    prestigeMedal: "🏅 勋章",
    prestigeMedals: "勋章数量",
    prestigeBonus: "资源产出 +{bonus}%",
    prestigeCount: "转生次数",
    prestigeRequirements: "转生条件",
    prestigeRewards: "转生奖励",
    prestigeWarning: "⚠️ 转生将重置：军阶、建筑、士兵、舰队、科技、装备",
    prestigeKeep: "✅ 保留：勋章、成就、每日任务进度、登录天数",
    prestigeHistory: "转生历史",
    prestigeNoHistory: "暂无转生记录",
    prestigeMaxReached: "已达最大转生次数 ({max})",
    prestigeReady: "✅ 可以转生",
    prestigeNotReady: "🔒 未达到转生条件",
    offlineCapNotice: "💡 离线收益已封顶 12 小时（超出部分不计）"
  },

  en: {
    // ---------- UI Core ----------
    rank: "Military Rank",
    stars: "Battle Stars",
    exp: "EXP",
    gold: "Gold",
    cp: "CP",
    kill: "Kills",
    boss: "Enemy Commander",
    autoFight: "Battlefield",
    offlineEarning: "Offline Earnings",
    doubleReward: "Double Claim",
    promotion: "Promotion Trial",
    trialPass: "✅ Trial Passed! Promoted!",
    trialFail: "❌ Trial Failed! Keep fighting!",
    normalTrial: "Standard Trial 50%",
    premiumTrial: "Military Funds 70%",
    watchAd: "Watch Ad 100%",
    starsFull: "★★★★★ Battle Stars Full! Ready to Promote!",
    save: "Save",
    load: "Load",
    claim: "Claim",
    confirm: "Confirm",
    cancel: "Cancel",

    // ---------- Promotion ----------
    promoteNormal: "Standard Trial",
    promoteGold: "Military Funds",
    promoteAd: "Recommendation",
    promoteNormalDesc: "Cost EXP, 50% chance",
    promoteGoldDesc: "Cost Gold, 70% chance",
    promoteAdDesc: "Watch Ad, 100% success",
    failPenalty: "Fail: -50% EXP",
    goldLost: "Gold lost on fail",
    guaranteed: "Guaranteed",

    // ---------- Story ----------
    storyTitle: "⭐ War Log",
    storySkip: "Skip",
    storyContinue: "Continue ▶",

    // ---------- Buildings ----------
    building: "Base Facilities",
    goldMine: "Gold Mine",
    ironMine: "Iron Mine",
    riceFarm: "Rice Farm",
    barracks: "Barracks",
    hospital: "Field Hospital",
    buildingMaxLevel: "Max level for current rank",
    notEnoughGold: "Not enough gold!",
    buildingUpgraded: "Facility upgraded!",
    buildingProduction: "Base Production",

    // ---------- Soldiers ----------
    soldier: "Soldier",
    soldiers: "Soldiers",
    train: "Train",
    trainSoldier: "Train Soldier",
    treat: "Heal",
    treatWounded: "Heal Wounded",
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
    fleetCp: "Fleet Firepower",
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
    equipment: "Armaments",
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

    // ---------- Daily ----------
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

    // ---------- Login ----------
    loginCheckIn: "Daily Login",
    loginDay: "Day {day}",
    loginStreak: "{streak} day streak",
    loginClaim: "Claim Login",
    loginReward: "Login Reward",
    loginSpecial: "🎉 Super Reward!",
    loginAllClaimed: "🎉 All login rewards claimed!",
    loginStreakBroken: "⚠️ Login streak broken, reset",
    loginAlreadyClaimed: "📅 Already claimed today",

    // ---------- Achievements ----------
    achievement: "Achievement",
    achievements: "Achievements",
    achievementUnlocked: "🎖️ Achievement Unlocked!",
    achievementLocked: "Locked",
    achievementProgress: "Progress",
    achievementReward: "Reward",

    // ---------- Events ----------
    event: "Battle Event",
    eventTitle: "⚡ Battle Event",
    eventClaim: "Claim Loot",
    eventDismiss: "Dismiss",
    eventAdBonus: "📺 Ad Reward ×2",
    eventNoAd: "Ad failed, normal reward claimed",
    eventBuff: "🔁 Double Rewards Buff",

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
    adblockDetected: "Please disable adblocker",

    // ---------- Common ----------
    attempts: "Attempts",
    success: "Success",
    iron: "Iron",
    level: "Level",
    pause: "Hold Fire",
    start: "Engage",
    engage: "Engage",
    holdFire: "Hold Fire",

    // ---------- War Themed ----------
    battlefield: "Battlefield",
    enemyCommander: "Enemy Commander",
    promotionTrial: "Promotion Trial",
    battleStars: "Battle Stars",
    militaryRank: "Military Rank",
    earnBattleStars: "Earn 5 Battle Stars to promote",
    welcomeCommander: "Welcome back, Commander",
    standingBy: "Standing by...",
    engaging: "Engaging...",
    victorious: "Victorious!",
    defeated: "Defeated...",
    reinforcements: "Reinforcements arrived",

    // ---------- ★★★ Prestige System (Part 12) ★★★ ----------
    prestige: "Prestige",
    prestigeTitle: "🔄 Prestige System",
    prestigeDesc: "Retire and reset for permanent medals",
    prestigeRequirement: "Requires rank {rank} to prestige",
    prestigeButton: "Start Prestige",
    prestigeConfirm: "⚠️ Confirm Prestige? This will reset most progress but keep medals!",
    prestigeSuccess: "🎉 Prestige successful! Gained {medals} medals!",
    prestigeMedal: "🏅 Medal",
    prestigeMedals: "Medals",
    prestigeBonus: "+{bonus}% Resource Production",
    prestigeCount: "Prestige Count",
    prestigeRequirements: "Requirements",
    prestigeRewards: "Rewards",
    prestigeWarning: "⚠️ Prestige will reset: Rank, Buildings, Soldiers, Fleet, Tech, Equipment",
    prestigeKeep: "✅ Keeps: Medals, Achievements, Daily Progress, Login Days",
    prestigeHistory: "Prestige History",
    prestigeNoHistory: "No prestige history",
    prestigeMaxReached: "Max prestige reached ({max})",
    prestigeReady: "✅ Ready to Prestige",
    prestigeNotReady: "🔒 Conditions not met",
    offlineCapNotice: "💡 Offline earnings capped at 12 hours"
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