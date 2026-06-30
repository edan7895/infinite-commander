// ============================================================
// offline.js — Offline Earnings Calculation
// ============================================================

function calculateOfflineEarnings(seconds) {
  if (!player) return { gold: 0, exp: 0, iron: 0, rice: 0 };

  const maxSeconds = CONFIG.OFFLINE.maxSeconds;
  const effectiveSeconds = Math.min(seconds, maxSeconds);

  const buildingProd = getTotalBuildingProduction();

  const goldPerSec = getGoldIncomePerSecond() + buildingProd.gold;
  const expPerSec = getExpIncomePerSecond();
  const ironPerSec = buildingProd.iron;
  const ricePerSec = buildingProd.rice;

  return {
    gold: Math.floor(goldPerSec * effectiveSeconds),
    exp: Math.floor(expPerSec * effectiveSeconds),
    iron: Math.floor(ironPerSec * effectiveSeconds),
    rice: Math.floor(ricePerSec * effectiveSeconds),
    seconds: effectiveSeconds
  };
}

function applyOfflineEarnings(multiplier) {
  const p = player;
  if (!p || p.offlineSeconds <= 0) return { gold: 0, exp: 0, iron: 0, rice: 0 };

  const earnings = calculateOfflineEarnings(p.offlineSeconds);
  const mult = multiplier || 1;

  const gold = Math.floor(earnings.gold * mult);
  const exp = Math.floor(earnings.exp * mult);
  const iron = Math.floor(earnings.iron * mult);
  const rice = Math.floor(earnings.rice * mult);

  p.gold += gold;
  p.totalGold += gold;
  p.exp += exp;
  p.iron += iron;
  p.rice += rice;
  p.offlineSeconds = 0;

  return { gold, exp, iron, rice };
}

function getGoldIncomePerSecond() {
  const p = player;
  const rank = getCurrentRank();
  const base = rank.goldBase * 0.05;
  const buildingBonus = (p.buildings.goldMine || 1) * 0.5;
  const techBonus = 1 + (p.tech.logistics || 0) * 0.03;
  return (base + buildingBonus) * techBonus;
}

function getExpIncomePerSecond() {
  const p = player;
  const rank = getCurrentRank();
  const base = rank.expBase * 0.02;
  const techBonus = 1 + (p.tech.logistics || 0) * 0.02;
  return base * techBonus;
}

function getIronIncomePerSecond() {
  const p = player;
  const buildingBonus = (p.buildings.ironMine || 1) * 0.2;
  return buildingBonus;
}

function getRiceIncomePerSecond() {
  const p = player;
  const buildingBonus = (p.buildings.riceFarm || 1) * 0.3;
  return buildingBonus;
}