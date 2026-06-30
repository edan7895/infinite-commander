// ============================================================
// tech.js — Tech Tree System (8 lines, 40 levels each)
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

// ---------- Get upgrade cost ----------
function getTechUpgradeCost(lineId) {
  const currentLevel = getTechLevel(lineId);
  const maxLevel = getTechMaxLevel();

  if (currentLevel >= maxLevel) return null;

  const goldBase = CONFIG.TECH.upgradeGoldBase || 1000;
  const multiplier = CONFIG.TECH.upgradeCostMultiplier || 1.20;
  const techPointCost = getTechPointCost();

  const goldCost = Math.floor(goldBase * Math.pow(multiplier, currentLevel));
  const techPointCostTotal = techPointCost;

  return { gold: goldCost, techPoint: techPointCostTotal };
}

// ---------- Get tech effect ----------
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

// ---------- Upgrade tech ----------
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

  const cost = getTechUpgradeCost(lineId);
  if (!cost) {
    showToast(t('techMaxLevel') || 'Max level reached!');
    return false;
  }

  // Check tech points availability (techPoints stored in player)
  if (!player.techPoints) player.techPoints = 0;

  if (useAd) {
    GameAds.reward('tech', function() {
      if (!player.tech) player.tech = {};
      player.tech[lineId] = (player.tech[lineId] || 0) + 1;
      // Gain tech point for leveling up
      player.techPoints = (player.techPoints || 0) + 1;
      // Bonus every 10 levels
      if ((player.tech[lineId] || 0) % 10 === 0) {
        player.techPoints += 5;
        showToast('🎯 +5 ' + (t('techPoint') || 'Tech Points') + ' (' + line.nameEn + ' Lv.' + player.tech[lineId] + ')');
      }
      // Recalculate CP
      player.combatPower = calcCombatPower();
      showToast('✅ ' + (t('techUpgradedAd') || 'Tech researched! (Ad)'));
      if (typeof updateUI === 'function') updateUI();
    }, function() {
      showToast('Ad failed, try again.');
    });
    return true;
  }

  if (player.gold < cost.gold) {
    showToast(t('notEnoughGold') || 'Not enough gold! Need ' + formatNumber(cost.gold));
    return false;
  }

  if ((player.techPoints || 0) < cost.techPoint) {
    showToast(t('notEnoughTechPoint') || 'Not enough tech points! Need ' + cost.techPoint);
    return false;
  }

  player.gold -= cost.gold;
  player.techPoints = (player.techPoints || 0) - cost.techPoint;
  if (!player.tech) player.tech = {};
  player.tech[lineId] = (player.tech[lineId] || 0) + 1;

  // Gain tech point for leveling up
  player.techPoints = (player.techPoints || 0) + 1;
  // Bonus every 10 levels
  if ((player.tech[lineId] || 0) % 10 === 0) {
    player.techPoints += 5;
    showToast('🎯 +5 ' + (t('techPoint') || 'Tech Points') + ' (' + line.nameEn + ' Lv.' + player.tech[lineId] + ')');
  }

  player.combatPower = calcCombatPower();

  showToast('✅ ' + (t('techUpgraded') || 'Tech researched!'));
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- Get tech stats for UI ----------
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
    const effectKey = line.effect;
    const effectDisplay = getEffectDisplay(effectKey, effect);

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
      effectDisplay: effectDisplay,
      effectKey: effectKey
    });

    totalLevels += level;
  });

  return {
    totalLevels: totalLevels,
    totalTechPoints: player.techPoints || 0,
    lines: lineList
  };
}

function getEffectDisplay(effectKey, value) {
  const isZh = langCurrent === 'zh';
  const prefix = value > 0 ? '+' : '';
  const percent = (value * 100).toFixed(1);

  const effectMap = {
    cp: (isZh ? '⚔️ +' : '⚔️ +') + Math.floor(value) + ' CP',
    income: (isZh ? '💰 +' : '💰 +') + percent + '%',
    armor: (isZh ? '🛡️ -' : '🛡️ -') + percent + '%',
    radar: (isZh ? '📡 -' : '📡 -') + percent + '%',
    ai: (isZh ? '🤖 +' : '🤖 +') + percent + '%',
    boss: (isZh ? '💥 +' : '💥 +') + percent + '%',
    all: (isZh ? '🌟 +' : '🌟 +') + percent + '%'
  };

  return effectMap[effectKey] || (prefix + value);
}

// ---------- Apply tech effects to various systems ----------
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

  // Map effect keys to modifier keys
  const effectMap = {
    firepower: 'cpBonus',
    armor: 'armorReduction',
    logistics: 'incomeBonus',
    radar: 'radarReduction',
    ai: 'aiBonus',
    drone: 'cpBonus', // drone adds to cp
    missile: 'bossBonus',
    nuclear: 'allBonus'
  };

  for (const [key, value] of Object.entries(effects)) {
    const modifierKey = effectMap[key];
    if (modifierKey) {
      modifiers[modifierKey] += value;
    }
  }

  // Drone also adds to cp (already handled)
  // Nuclear adds to all stats
  if (modifiers.allBonus !== 0) {
    // Apply allBonus to all other modifiers
    const allBonus = modifiers.allBonus;
    modifiers.cpBonus += allBonus * 0.5;
    modifiers.incomeBonus += allBonus;
    modifiers.armorReduction += allBonus * 0.5;
  }

  return modifiers;
}