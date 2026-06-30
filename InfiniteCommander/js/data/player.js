// ============================================================
// player.js — Player Object (Part 6)
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
      date: Date.now()
    },

    // ---------- Achievements ----------
    achievements: [],

    // ---------- Tutorial ----------
    tutorialStep: 0,
    tutorialCompleted: false,

    // ---------- Events ----------
    lastEventTime: 0
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