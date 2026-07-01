// ============================================================
// promote.js — Promotion System (Part 9 - 指数级)
// ============================================================

// 注意：核心晋升逻辑已在 main.js 中实现
// 此文件提供辅助函数和兼容性支持

function canPromote() {
  if (!player) return false;
  return player.stars >= 5;
}

function getPromoteInfo() {
  if (!player) return null;
  const rankId = player.rankId;
  const goldCost = getPromoteGoldCost(rankId);
  const expCost = getPromoteExpCost(rankId);
  const nextRank = getRank(rankId + 1);

  return {
    canPromote: player.stars >= 5,
    goldCost: goldCost,
    expCost: expCost,
    nextRankName: nextRank ? getRankName(rankId + 1, langCurrent) : 'MAX',
    currentRankName: getRankName(rankId, langCurrent)
  };
}

function getMaxRank() {
  return RANK_DATA.length - 1;
}

function isMaxRank() {
  if (!player) return false;
  return player.rankId >= getMaxRank();
}

// ===== ★★★ 指数级升星需求（兼容旧调用） ★★★ =====
// 注意：此函数已弃用，保留仅为兼容性
// 新代码应使用 getStarRequirement(rankId, starIndex)
function getStarRequirementLegacy(starIndex) {
  const reqs = [500, 1500, 4500, 13500, 40500];
  return reqs[starIndex] || 999999;
}

console.log('✅ 晋升系统已加载 (Part 9 - 指数级)');