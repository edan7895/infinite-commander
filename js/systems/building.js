// ============================================================
// building.js — Building System (Part 9 - 指数级产出)
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

// ===== ★★★ 指数级建筑产出 ★★★ =====
function getBuildingYield(type) {
  const config = getBuildingConfig(type);
  if (!config) return 0;
  const level = getBuildingLevel(type);
  if (type === 'barracks' || type === 'hospital') return 0;

  // ★★★ 指数级产出：基础产出 * 等级 * (1.05 ^ 等级) ★★★
  // 低等级增长平缓，高等级爆发增长
  const baseYield = config.baseYield || 1;
  const exponential = Math.pow(1.05, level - 1);
  return Math.floor(baseYield * level * exponential);
}

// ---------- 升级建筑（使用队列） ----------
function upgradeBuilding(type, useAd) {
  if (!player) return false;

  const currentLevel = getBuildingLevel(type);
  const maxLevel = getMaxBuildingLevel();

  if (currentLevel >= maxLevel) {
    showToast(t('buildingMaxLevel') || 'Already at max level for your rank!');
    return false;
  }

  if (isUpgrading('building', type)) {
    showToast('⏳ ' + (t('upgradeInProgress') || 'Upgrade already in progress'));
    return false;
  }

  const cost = getBuildingUpgradeCost(type);

  if (useAd) {
    GameAds.reward('building', function() {
      player.buildings[type] = (player.buildings[type] || 1) + 1;
      if (typeof updateDailyProgress === 'function') {
        updateDailyProgress('building', 1);
      }
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

  const totalTime = getBuildingUpgradeTime(type);
  if (totalTime <= 0) {
    player.buildings[type] = (player.buildings[type] || 1) + 1;
    if (typeof updateDailyProgress === 'function') {
      updateDailyProgress('building', 1);
    }
    showToast('✅ ' + (t('buildingUpgraded') || 'Building upgraded!'));
    if (typeof updateUI === 'function') updateUI();
    return true;
  }

  const isZh = langCurrent === 'zh';
  const nameMap = {
    goldMine: t('goldMine'),
    ironMine: t('ironMine'),
    riceFarm: t('riceFarm'),
    barracks: t('barracks'),
    hospital: t('hospital')
  };

  const item = {
    type: 'building',
    id: type,
    nameEn: type,
    nameZh: nameMap[type] || type,
    totalTime: totalTime,
    remainingTime: totalTime,
    startTime: null,
    status: 'pending',
    targetLevel: currentLevel + 1
  };

  const added = addUpgradeToQueue(item);
  if (added) {
    showToast('⏳ ' + (isZh ? '开始升级 ' + (nameMap[type] || type) : 'Upgrading ' + type));
    if (typeof updateUI === 'function') updateUI();
  }
  return added;
}

// ---------- 计算总建筑产出 ----------
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

// ---------- 应用建筑产出 ----------
function applyBuildingProduction() {
  if (!player) return;
  const production = getTotalBuildingProduction();

  const hasBuildingUpgrade = (player.upgradeQueue || []).some(function(item) {
    return item.type === 'building' && item.status === 'pending';
  });

  const multiplier = hasBuildingUpgrade ? 0.5 : 1;

  player.gold += Math.floor(production.gold * multiplier);
  player.totalGold += Math.floor(production.gold * multiplier);
  player.iron += Math.floor(production.iron * multiplier);
  player.rice += Math.floor(production.rice * multiplier);
}

// ---------- 获取可升级建筑列表 ----------
function getBuildingUpgradeableList() {
  const types = ['goldMine', 'ironMine', 'riceFarm', 'barracks', 'hospital'];
  const result = [];
  const maxLevel = getMaxBuildingLevel();

  types.forEach(function(type) {
    const level = getBuildingLevel(type);
    if (level < maxLevel) {
      const cost = getBuildingUpgradeCost(type);
      const isQueued = isUpgrading('building', type);
      result.push({
        type: type,
        level: level,
        maxLevel: maxLevel,
        cost: cost,
        canAfford: player.gold >= cost,
        isQueued: isQueued
      });
    }
  });
  return result;
}