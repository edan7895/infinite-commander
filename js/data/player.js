// ============================================================
// player.js — Player Object (Part 14 - 完整数据)
// ============================================================

function createPlayer() {
  return {
    // ---------- Core ----------
    rankId: 0,
    stars: 0,
    exp: 0,
    gold: CONFIG.STARTING.gold,
    totalGold: 0,
    iron: CONFIG.STARTING.iron,
    rice: CONFIG.STARTING.rice,
    techPoints: CONFIG.STARTING.techPoints || 0,

    // ---------- Combat ----------
    kills: 0,
    totalKills: 0,
    combatPower: 10,
    level: 1,
    autoFight: true,

    // ---------- Boss ----------
    bossTimer: 0,
    bossHealth: 0,
    bossMaxHealth: 0,
    bossActive: false,
    bossDefeated: 0,
    totalBossDefeated: 0,

    // ---------- Promotion ----------
    promotionAttempts: 0,
    promotionSuccess: 0,

    // ---------- Buildings ----------
    buildings: {
      goldMine: 1,
      ironMine: 1,
      riceFarm: 1,
      barracks: 1,
      hospital: 1
    },

    // ---------- Soldiers ----------
    soldiers: CONFIG.STARTING.soldiers || 0,
    wounded: CONFIG.STARTING.wounded || 0,

    // ---------- Fleet ----------
    fleet: CONFIG.STARTING.fleet || {},

    // ---------- Tech ----------
    tech: CONFIG.STARTING.tech || {},

    // ---------- Equipment ----------
    equipment: CONFIG.STARTING.equipment || {},

    // ---------- Upgrade Queue ----------
    upgradeQueue: CONFIG.STARTING.upgradeQueue || [],

    // ---------- Time ----------
    offlineSeconds: 0,
    totalPlayTime: 0,
    doubleBuff: 0,
    lastSaveTime: Date.now(),

    // ---------- Daily ----------
    daily: {
      bossKills: 0,
      kills: 0,
      goldEarned: 0,
      adWatched: 0,
      date: Date.now(),
      loginDay: 0,
      loginStreak: 0,
      lastLoginDate: Date.now()
    },

    // ---------- Achievements ----------
    achievements: [],

    // ---------- Tutorial ----------
    tutorialStep: 0,
    tutorialCompleted: false,

    // ---------- Events ----------
    lastEventTime: 0,

    // ---------- Ads ----------
    adCount: CONFIG.STARTING.adCount || 0,

    // ---------- Login ----------
    loginDays: CONFIG.STARTING.loginDays || 0,

    // ---------- 新手引导 (Part 8) ----------
    guideCompleted: false,

    // ===== Part 12: 转生数据 =====
    prestigeCount: CONFIG.STARTING.prestigeCount || 0,
    prestigeMedals: CONFIG.STARTING.prestigeMedals || 0,
    prestigeHistory: CONFIG.STARTING.prestigeHistory || []
  };
}

// Global player instance
let player = null;

function initPlayer() {
  player = createPlayer();
  if (typeof protectPlayer === 'function') {
    player = protectPlayer(player);
  }
  return player;
}

// ---------- 获取升级队列 ----------
function getUpgradeQueue() {
  if (!player) return [];
  if (!player.upgradeQueue) player.upgradeQueue = [];
  return player.upgradeQueue;
}

// ---------- 添加升级任务 ----------
function addUpgradeToQueue(upgradeItem) {
  if (!player) return false;
  if (!player.upgradeQueue) player.upgradeQueue = [];
  const existing = player.upgradeQueue.find(function(item) {
    return item.type === upgradeItem.type &&
           item.id === upgradeItem.id &&
           item.status === 'pending';
  });
  if (existing) return false;
  player.upgradeQueue.push(upgradeItem);
  return true;
}

// ---------- 获取特定类型的升级 ----------
function getUpgradeByType(type, id) {
  const queue = getUpgradeQueue();
  return queue.find(function(item) {
    return item.type === type && item.id === id && item.status === 'pending';
  });
}

// ---------- 检查是否正在升级 ----------
function isUpgrading(type, id) {
  return getUpgradeByType(type, id) !== undefined;
}

// ---------- 获取玩家数据的深拷贝 ----------
function getPlayerDataForSave() {
  if (!player) return null;
  return JSON.parse(JSON.stringify(player));
}

// ---------- 从存档数据恢复玩家 ----------
function restorePlayerFromSave(data) {
  if (!data) return false;
  if (!player) {
    player = createPlayer();
  }
  for (const key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] !== 'function') {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        if (!player[key]) player[key] = {};
        for (const subKey in data[key]) {
          if (data[key].hasOwnProperty(subKey)) {
            player[key][subKey] = data[key][subKey];
          }
        }
      } else {
        player[key] = data[key];
      }
    }
  }
  return true;
}

// ---------- ★★★ Part 14: 检查是否有任何游戏进度 ★★★ ----------
function hasGameProgress() {
  if (!player) return false;
  
  const hasProgress = 
    player.rankId > 0 ||
    player.stars > 0 ||
    player.totalKills > 0 ||
    player.totalGold > 1000 ||
    player.soldiers > 0 ||
    player.buildings.goldMine > 1 ||
    Object.keys(player.fleet || {}).length > 0 ||
    Object.keys(player.tech || {}).length > 0 ||
    Object.keys(player.equipment || {}).length > 0 ||
    player.achievements.length > 0 ||
    player.prestigeCount > 0;
  
  return hasProgress;
}
window.hasGameProgress = hasGameProgress;