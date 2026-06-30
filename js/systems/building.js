// ============================================================
// building.js — Building System (Gold Mine, Iron Mine, Rice Farm, Barracks, Hospital)
// ============================================================

// ---------- Get building data ----------
function getBuildingConfig(type) {
  if (!CONFIG || !CONFIG.BUILDINGS) return null;
  return CONFIG.BUILDINGS[type] || null;
}

function getBuildingLevel(type) {
  if (!player || !player.buildings) return 1;
  return player.buildings[type] || 1;
}

function getMaxBuildingLevel() {
  if (!player) return CONFIG.BUILDINGS.maxLevel;
  const rankId = player.rankId;
  return Math.min((rankId + 1) * CONFIG.BUILDINGS.unlockPerRank, CONFIG.BUILDINGS.maxLevel);
}

function getBuildingUpgradeCost(type) {
  const config = getBuildingConfig(type);
  if (!config) return Infinity;
  const level = getBuildingLevel(type);
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, level - 1));
}

function getBuildingYield(type) {
  const config = getBuildingConfig(type);
  if (!config) return 0;
  const level = getBuildingLevel(type);
  if (type === 'barracks' || type === 'hospital') return 0;
  return Math.floor(config.baseYield * level * config.yieldMultiplier);
}

// ---------- Upgrade building ----------
function upgradeBuilding(type, useAd) {
  if (!player) return false;

  const currentLevel = getBuildingLevel(type);
  const maxLevel = getMaxBuildingLevel();

  if (currentLevel >= maxLevel) {
    showToast(t('buildingMaxLevel') || 'Already at max level for your rank!');
    return false;
  }

  const cost = getBuildingUpgradeCost(type);

  if (useAd) {
    GameAds.reward('building', function() {
      player.buildings[type] = (player.buildings[type] || 1) + 1;
      showToast('✅ ' + (t('buildingUpgraded') || 'Building upgraded!') + ' (Ad)');
      if (typeof updateUI === 'function') updateUI();
    }, function() {
      showToast('Ad failed, try again.');
    });
    return true;
  }

  if (player.gold < cost) {
    showToast(t('notEnoughGold') || 'Not enough gold! Need ' + formatNumber(cost));
    return false;
  }

  player.gold -= cost;
  player.buildings[type] = (player.buildings[type] || 1) + 1;
  showToast('✅ ' + (t('buildingUpgraded') || 'Building upgraded!'));
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- Calculate total building production per second ----------
function getTotalBuildingProduction() {
  if (!player) return { gold: 0, iron: 0, rice: 0 };

  const goldFromMine = getBuildingYield('goldMine');
  const ironFromMine = getBuildingYield('ironMine');
  const riceFromFarm = getBuildingYield('riceFarm');

  let techBonus = 1;
  if (player.tech && typeof player.tech.logistics === 'number') {
    techBonus += player.tech.logistics * 0.02;
  }

  const rankBonus = 1 + (player.rankId * 0.05);

  return {
    gold: Math.floor(goldFromMine * techBonus * rankBonus),
    iron: Math.floor(ironFromMine * techBonus * rankBonus),
    rice: Math.floor(riceFromFarm * techBonus * rankBonus)
  };
}

// ---------- Apply building production (called every second) ----------
function applyBuildingProduction() {
  if (!player) return;
  const production = getTotalBuildingProduction();

  player.gold += production.gold;
  player.totalGold += production.gold;
  player.iron += production.iron;
  player.rice += production.rice;
}

// ---------- Building upgradeable list for UI ----------
function getBuildingUpgradeableList() {
  const types = ['goldMine', 'ironMine', 'riceFarm', 'barracks', 'hospital'];
  const result = [];
  const maxLevel = getMaxBuildingLevel();

  types.forEach(function(type) {
    const level = getBuildingLevel(type);
    if (level < maxLevel) {
      const cost = getBuildingUpgradeCost(type);
      result.push({
        type: type,
        level: level,
        maxLevel: maxLevel,
        cost: cost,
        canAfford: player.gold >= cost
      });
    }
  });
  return result;
}