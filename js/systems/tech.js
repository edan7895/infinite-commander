// ============================================================
// tech.js — Tech Tree System (Part 5 - 带研究队列)
// ============================================================

// ---------- Get tech data ----------
function getTechLines() {
  return CONFIG.TECH.lines || [];
}

function getTechLine(lineId) {
  const lines = getTechLines();
  return lines.find(function(l) { return l.id === lineId; }) || null;
}

function getTechLevel(lineId) {
  if (!player || !player.tech) return 0;
  return player.tech[lineId] || 0;
}

function isTechUnlocked(lineId) {
  if (!player) return false;
  const line = getTechLine(lineId);
  if (!line) return false;
  return player.rankId >= line.unlockRank;
}

function getTechMaxLevel() {
  return CONFIG.TECH.maxLevel || 40;
}

function getTechPointCost() {
  return CONFIG.TECH.techPointCostPerLevel || 1;
}

// ---------- 获取升级消耗 ----------
function getTechUpgradeCost(lineId) {
  const currentLevel = getTechLevel(lineId);
  const maxLevel = getTechMaxLevel();

  if (currentLevel >= maxLevel) return null;

  const goldBase = CONFIG.TECH.upgradeGoldBase || 1000;
  const multiplier = CONFIG.TECH.upgradeCostMultiplier || 1.20;
  const techPointCost = getTechPointCost();

  const goldCost = Math.floor(goldBase * Math.pow(multiplier, currentLevel));

  return { gold: goldCost, techPoint: techPointCost };
}

// ---------- 获取科技效果 ----------
function getTechEffect(lineId) {
  const level = getTechLevel(lineId);
  const line = getTechLine(lineId);
  if (!line) return 0;
  const effectConfig = CONFIG.TECH.effectPerLevel;
  const effectKey = line.effect;
  const perLevel = effectConfig[effectKey] || 0;
  return level * perLevel;
}

function getAllTechEffects() {
  if (!player || !player.tech) return {};

  const effects = {};
  const lines = getTechLines();

  lines.forEach(function(line) {
    const level = player.tech[line.id] || 0;
    const effectConfig = CONFIG.TECH.effectPerLevel;
    const perLevel = effectConfig[line.effect] || 0;
    effects[line.id] = level * perLevel;
  });

  return effects;
}

// ---------- 升级科技（使用队列） ----------
function upgradeTech(lineId, useAd) {
  if (!player) return false;

  const line = getTechLine(lineId);
  if (!line) {
    showToast('Tech line not found!');
    return false;
  }

  if (!isTechUnlocked(lineId)) {
    showToast(t('techLocked') || 'Tech locked!');
    return false;
  }

  const currentLevel = getTechLevel(lineId);
  const maxLevel = getTechMaxLevel();

  if (currentLevel >= maxLevel) {
    showToast(t('techMaxLevel') || 'Max level reached!');
    return false;
  }

  // 检查是否已在队列中
  if (isUpgrading('tech', lineId)) {
    showToast('⏳ ' + (t('upgradeInProgress') || 'Research already in progress'));
    return false;
  }

  const cost = getTechUpgradeCost(lineId);
  if (!cost) {
    showToast(t('techMaxLevel') || 'Max level reached!');
    return false;
  }

  // 广告加速模式
  if (useAd) {
    GameAds.reward('tech', function() {
      // 立即完成
      if (!player.tech) player.tech = {};
      player.tech[lineId] = (player.tech[lineId] || 0) + 1;
      player.techPoints = (player.techPoints || 0) + 1;
      if ((player.tech[lineId] || 0) % 10 === 0) {
        player.techPoints += 5;
      }
      if (typeof calcCombatPower === 'function') {
        player.combatPower = calcCombatPower();
      }
      if (typeof updateDailyProgress === 'function') {
        updateDailyProgress('tech', 1);
      }
      showToast('✅ ' + (t('techUpgradedAd') || 'Tech researched! (Ad)'));
      if (typeof updateUI === 'function') updateUI();
    }, function() {
      showToast('Ad failed, try again.');
    });
    return true;
  }

  // 检查资源
  if (player.gold < cost.gold) {
    showToast(t('notEnoughGold') || 'Not enough gold! Need ' + formatNumber(cost.gold));
    return false;
  }

  if ((player.techPoints || 0) < cost.techPoint) {
    showToast(t('notEnoughTechPoint') || 'Not enough tech points! Need ' + cost.techPoint);
    return false;
  }

  // 扣除资源
  player.gold -= cost.gold;
  player.techPoints = (player.techPoints || 0) - cost.techPoint;

  // 计算研究时间
  const totalTime = getTechResearchTime(lineId);
  if (totalTime <= 0) {
    // 直接完成
    if (!player.tech) player.tech = {};
    player.tech[lineId] = (player.tech[lineId] || 0) + 1;
    player.techPoints = (player.techPoints || 0) + 1;
    if ((player.tech[lineId] || 0) % 10 === 0) {
      player.techPoints += 5;
    }
    if (typeof calcCombatPower === 'function') {
      player.combatPower = calcCombatPower();
    }
    if (typeof updateDailyProgress === 'function') {
      updateDailyProgress('tech', 1);
    }
    showToast('✅ ' + (t('techUpgraded') || 'Tech researched!'));
    if (typeof updateUI === 'function') updateUI();
    return true;
  }

  // 添加到队列
  const isZh = langCurrent === 'zh';
  const item = {
    type: 'tech',
    id: lineId,
    nameEn: line.nameEn,
    nameZh: line.nameZh,
    totalTime: totalTime,
    remainingTime: totalTime,
    startTime: null,
    status: 'pending',
    targetLevel: currentLevel + 1
  };

  const added = addUpgradeToQueue(item);
  if (added) {
    showToast('⏳ ' + (isZh ? '开始研究 ' + line.nameZh : 'Researching ' + line.nameEn));
    if (typeof updateUI === 'function') updateUI();
  }
  return added;
}

// ---------- 获取科技修改器 ----------
function getTechModifiers() {
  const effects = getAllTechEffects();
  const modifiers = {
    cpBonus: 0,
    incomeBonus: 0,
    armorReduction: 0,
    radarReduction: 0,
    aiBonus: 0,
    bossBonus: 0,
    allBonus: 0
  };

  const effectMap = {
    firepower: 'cpBonus',
    armor: 'armorReduction',
    logistics: 'incomeBonus',
    radar: 'radarReduction',
    ai: 'aiBonus',
    drone: 'cpBonus',
    missile: 'bossBonus',
    nuclear: 'allBonus'
  };

  for (const [key, value] of Object.entries(effects)) {
    const modifierKey = effectMap[key];
    if (modifierKey) {
      modifiers[modifierKey] += value;
    }
  }

  if (modifiers.allBonus !== 0) {
    modifiers.cpBonus += modifiers.allBonus * 0.5;
    modifiers.incomeBonus += modifiers.allBonus;
    modifiers.armorReduction += modifiers.allBonus * 0.5;
  }

  return modifiers;
}

// ---------- 获取科技统计 ----------
function getTechStats() {
  if (!player) return { totalLevels: 0, totalTechPoints: 0, lines: [] };

  const lines = getTechLines();
  let totalLevels = 0;
  const lineList = [];

  lines.forEach(function(line) {
    const level = player.tech[line.id] || 0;
    const isUnlocked = isTechUnlocked(line.id);
    const maxLevel = getTechMaxLevel();
    const effect = getTechEffect(line.id);
    const isQueued = isUpgrading('tech', line.id);

    lineList.push({
      id: line.id,
      nameEn: line.nameEn,
      nameZh: line.nameZh,
      level: level,
      maxLevel: maxLevel,
      isUnlocked: isUnlocked,
      isMaxed: level >= maxLevel,
      unlockRank: line.unlockRank,
      effect: effect,
      isQueued: isQueued
    });

    totalLevels += level;
  });

  return {
    totalLevels: totalLevels,
    totalTechPoints: player.techPoints || 0,
    lines: lineList
  };
}