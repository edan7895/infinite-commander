// ============================================================
// promote.js — Promotion System (Star + Rank)
// ============================================================

// Most promotion logic is in main.js
// This file contains additional promotion utilities

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