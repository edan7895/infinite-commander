// ============================================================
// equipment.js — Equipment System (6 types × 12 levels)
// ============================================================

// ---------- Get equipment data ----------
function getEquipmentTypes() {
  return CONFIG.EQUIPMENT.types || [];
}

function getEquipmentType(typeId) {
  const types = getEquipmentTypes();
  return types.find(function(t) { return t.id === typeId; }) || null;
}

function getEquipmentLevel(typeId) {
  if (!player || !player.equipment) return 0;
  return player.equipment[typeId] || 0;
}

function isEquipmentUnlocked(typeId) {
  if (!player) return false;
  const type = getEquipmentType(typeId);
  if (!type) return false;
  return player.rankId >= type.unlockRank;
}

function getEquipmentMaxLevel() {
  return CONFIG.EQUIPMENT.maxLevel || 12;
}

function getEquipmentName(typeId, level) {
  const names = CONFIG.EQUIPMENT.names[typeId];
  if (!names) return 'Unknown';
  const idx = Math.min(level - 1, names.length - 1);
  if (idx < 0) return names[0] || 'Unknown';
  return names[idx] || 'Unknown';
}

// ---------- Get upgrade cost ----------
function getEquipmentUpgradeCost(typeId) {
  const currentLevel = getEquipmentLevel(typeId);
  const maxLevel = getEquipmentMaxLevel();

  if (currentLevel >= maxLevel) return null;

  const goldBase = CONFIG.EQUIPMENT.upgradeGoldBase || 200;
  const ironBase = CONFIG.EQUIPMENT.upgradeIronBase || 20;
  const multiplier = CONFIG.EQUIPMENT.upgradeCostMultiplier || 1.30;

  const goldCost = Math.floor(goldBase * Math.pow(multiplier, currentLevel));
  const ironCost = Math.floor(ironBase * Math.pow(multiplier, currentLevel));

  return { gold: goldCost, iron: ironCost };
}

// ---------- Get equipment effect ----------
function getEquipmentEffect(typeId) {
  const level = getEquipmentLevel(typeId);
  const type = getEquipmentType(typeId);
  if (!type) return 0;
  const effectKey = type.effect;
  const perLevel = CONFIG.EQUIPMENT.effectPerLevel[effectKey] || 0;

  // Base effect
  let effect = level * perLevel;

  // Special bonus (extra scaling)
  const special = CONFIG.EQUIPMENT.specialBonus[effectKey];
  if (special) {
    effect += level * special.perLevel;
  }

  return effect;
}

function getEquipmentEffects() {
  if (!player || !player.equipment) return {};

  const effects = {};
  const types = getEquipmentTypes();

  types.forEach(function(type) {
    const level = player.equipment[type.id] || 0;
    if (level > 0) {
      const effectKey = type.effect;
      const perLevel = CONFIG.EQUIPMENT.effectPerLevel[effectKey] || 0;
      let effect = level * perLevel;
      const special = CONFIG.EQUIPMENT.specialBonus[effectKey];
      if (special) {
        effect += level * special.perLevel;
      }
      effects[type.id] = effect;
    }
  });

  return effects;
}

// ---------- Get total equipment CP ----------
function getEquipmentCP() {
  const effects = getEquipmentEffects();
  let cp = 0;
  // Weapon gives CP directly
  if (effects.weapon) {
    cp += effects.weapon;
  }
  // Core gives all stats including CP
  if (effects.core) {
    cp += effects.core * 0.5;
  }
  return Math.floor(cp);
}

// ---------- Upgrade equipment ----------
function upgradeEquipment(typeId, useAd) {
  if (!player) return false;

  const type = getEquipmentType(typeId);
  if (!type) {
    showToast('Equipment type not found!');
    return false;
  }

  if (!isEquipmentUnlocked(typeId)) {
    showToast(t('equipLocked') || 'Equipment locked!');
    return false;
  }

  const currentLevel = getEquipmentLevel(typeId);
  const maxLevel = getEquipmentMaxLevel();

  if (currentLevel >= maxLevel) {
    showToast(t('equipMaxLevel') || 'Max level reached!');
    return false;
  }

  const cost = getEquipmentUpgradeCost(typeId);
  if (!cost) {
    showToast(t('equipMaxLevel') || 'Max level reached!');
    return false;
  }

  if (useAd) {
    GameAds.reward('equipment', function() {
      if (!player.equipment) player.equipment = {};
      player.equipment[typeId] = (player.equipment[typeId] || 0) + 1;
      player.combatPower = calcCombatPower();
      showToast('✅ ' + (t('equipUpgradedAd') || 'Gear upgraded! (Ad)'));
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

  if (player.iron < cost.iron) {
    showToast(t('notEnoughIron') || 'Not enough iron! Need ' + formatNumber(cost.iron));
    return false;
  }

  player.gold -= cost.gold;
  player.iron -= cost.iron;
  if (!player.equipment) player.equipment = {};
  player.equipment[typeId] = (player.equipment[typeId] || 0) + 1;
  player.combatPower = calcCombatPower();

  showToast('✅ ' + (t('equipUpgraded') || 'Gear upgraded!'));
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- Get equipment stats for UI ----------
function getEquipmentStats() {
  if (!player) return { totalLevels: 0, types: [] };

  const types = getEquipmentTypes();
  let totalLevels = 0;
  const typeList = [];

  types.forEach(function(type) {
    const level = player.equipment[type.id] || 0;
    const isUnlocked = isEquipmentUnlocked(type.id);
    const maxLevel = getEquipmentMaxLevel();
    const effect = getEquipmentEffect(type.id);
    const effectKey = type.effect;
    const effectDisplay = getEquipmentEffectDisplay(effectKey, effect);
    const nameObj = CONFIG.EQUIPMENT.names[type.id];
    const currentName = nameObj && nameObj[Math.min(level, nameObj.length - 1)];

    typeList.push({
      id: type.id,
      nameEn: type.nameEn,
      nameZh: type.nameZh,
      icon: type.icon || '🔧',
      level: level,
      maxLevel: maxLevel,
      isUnlocked: isUnlocked,
      isMaxed: level >= maxLevel,
      unlockRank: type.unlockRank,
      effect: effect,
      effectDisplay: effectDisplay,
      effectKey: effectKey,
      currentNameEn: currentName ? currentName.nameEn : 'None',
      currentNameZh: currentName ? currentName.nameZh : '无'
    });

    totalLevels += level;
  });

  return {
    totalLevels: totalLevels,
    totalCP: getEquipmentCP(),
    types: typeList
  };
}

function getEquipmentEffectDisplay(effectKey, value) {
  const isZh = langCurrent === 'zh';
  const prefix = value > 0 ? '+' : '';
  const percent = (value * 100).toFixed(1);

  const effectMap = {
    cp: (isZh ? '⚔️ +' : '⚔️ +') + Math.floor(value) + ' CP',
    armor: (isZh ? '🛡️ -' : '🛡️ -') + percent + '%',
    income: (isZh ? '💰 +' : '💰 +') + percent + '%',
    boss: (isZh ? '💥 +' : '💥 +') + percent + '%',
    efficiency: (isZh ? '⚡ +' : '⚡ +') + percent + '%',
    all: (isZh ? '🌟 +' : '🌟 +') + percent + '%'
  };

  return effectMap[effectKey] || (prefix + value);
}

// ---------- Apply equipment modifiers ----------
function getEquipmentModifiers() {
  const effects = getEquipmentEffects();
  const modifiers = {
    cpBonus: 0,
    incomeBonus: 0,
    armorReduction: 0,
    bossBonus: 0,
    efficiencyBonus: 0,
    allBonus: 0
  };

  const typeMap = {
    weapon: 'cpBonus',
    armor: 'armorReduction',
    auxiliary: 'incomeBonus',
    accessory: 'bossBonus',
    engine: 'efficiencyBonus',
    core: 'allBonus'
  };

  for (const [key, value] of Object.entries(effects)) {
    const modifierKey = typeMap[key];
    if (modifierKey) {
      modifiers[modifierKey] += value;
    }
  }

  // Core all bonus applies to everything
  if (modifiers.allBonus !== 0) {
    modifiers.cpBonus += modifiers.allBonus * 0.5;
    modifiers.incomeBonus += modifiers.allBonus;
    modifiers.armorReduction += modifiers.allBonus * 0.5;
    modifiers.bossBonus += modifiers.allBonus;
    modifiers.efficiencyBonus += modifiers.allBonus;
  }

  return modifiers;
}