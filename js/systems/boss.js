// ============================================================
// boss.js — Boss System (50 Bosses)
// ============================================================

// Boss 数据已整合在 RANK_DATA 中，每个军阶对应一个Boss
// 此文件提供 Boss 战斗逻辑

// ---------- Boss 配置 ----------
function getBossConfig() {
  if (!player) return null;
  const rank = getCurrentRank();
  const bossIndex = player.rankId;
  const rankData = RANK_DATA[bossIndex] || RANK_DATA[0];

  // Boss血量随军阶指数增长
  const hpBase = CONFIG.BOSS.hpBase || 50;
  const hpPerRank = CONFIG.BOSS.hpPerRank || 30;
  const hpPerStar = CONFIG.BOSS.hpPerStar || 20;

  const maxHealth = Math.floor(
    hpBase +
    rank.id * hpPerRank +
    player.stars * hpPerStar +
    Math.pow(rank.id, 1.5) * 2
  );

  return {
    bossName: getBossName(player.rankId, langCurrent),
    maxHealth: maxHealth,
    goldReward: CONFIG.BOSS.goldBase + rank.id * CONFIG.BOSS.goldPerRank,
    expReward: CONFIG.BOSS.expBase + rank.id * CONFIG.BOSS.expPerRank
  };
}

function getBossHealthPercent() {
  if (!player || !player.bossActive) return 0;
  return Math.max(0, (player.bossHealth / player.bossMaxHealth) * 100);
}

function getBossRemainingTime() {
  if (!player) return 0;
  const techMods = getTechModifiers ? getTechModifiers() : {};
  const equipMods = getEquipmentModifiers ? getEquipmentModifiers() : {};
  const radarReduction = Math.min(0.5,
    (techMods.radarReduction || 0) +
    (techMods.allBonus || 0) * 0.5 +
    (equipMods.allBonus || 0) * 0.3
  );
  const bossInterval = Math.max(60, CONFIG.BOSS.interval * (1 - radarReduction));
  return Math.max(0, bossInterval - player.bossTimer);
}

function isBossActive() {
  return player && player.bossActive === true;
}

function getBossReward() {
  return lastBossReward || null;
}

// Boss 战斗逻辑在 main.js 的 updateBoss() 中实现
console.log('✅ Boss系统已加载 (50个Boss)');