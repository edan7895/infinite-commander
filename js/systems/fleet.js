// ============================================================
// fleet.js — Fleet System (16 ships, 15 levels each)
// ============================================================

// ---------- Get fleet data ----------
function getFleetShips() {
  return CONFIG.FLEET.ships || [];
}

function getShipData(shipId) {
  const ships = getFleetShips();
  return ships.find(function(s) { return s.id === shipId; }) || null;
}

function getShipLevel(shipId) {
  if (!player || !player.fleet) return 0;
  return player.fleet[shipId] || 0;
}

function isShipUnlocked(shipId) {
  if (!player) return false;
  const ship = getShipData(shipId);
  if (!ship) return false;
  return player.rankId >= ship.unlockRank;
}

function getShipMaxLevel(shipId) {
  const ship = getShipData(shipId);
  if (!ship) return 0;
  return ship.maxLevel || 15;
}

// ---------- Get upgrade cost ----------
function getShipUpgradeCost(shipId) {
  const currentLevel = getShipLevel(shipId);
  const maxLevel = getShipMaxLevel(shipId);

  if (currentLevel >= maxLevel) return null;

  const goldBase = CONFIG.FLEET.upgradeGoldBase || 500;
  const ironBase = CONFIG.FLEET.upgradeIronBase || 50;
  const multiplier = CONFIG.FLEET.upgradeCostMultiplier || 1.25;

  const goldCost = Math.floor(goldBase * Math.pow(multiplier, currentLevel));
  const ironCost = Math.floor(ironBase * Math.pow(multiplier, currentLevel));

  return { gold: goldCost, iron: ironCost };
}

// ---------- Upgrade ship ----------
function upgradeShip(shipId, useAd) {
  if (!player) return false;

  const ship = getShipData(shipId);
  if (!ship) {
    showToast('Ship not found!');
    return false;
  }

  if (!isShipUnlocked(shipId)) {
    showToast(t('fleetLocked') || 'Ship locked!');
    return false;
  }

  const currentLevel = getShipLevel(shipId);
  const maxLevel = getShipMaxLevel(shipId);

  if (currentLevel >= maxLevel) {
    showToast(t('fleetMaxLevel') || 'Max level reached!');
    return false;
  }

  const cost = getShipUpgradeCost(shipId);
  if (!cost) {
    showToast(t('fleetMaxLevel') || 'Max level reached!');
    return false;
  }

  if (useAd) {
    GameAds.reward('fleet', function() {
      if (!player.fleet) player.fleet = {};
      player.fleet[shipId] = (player.fleet[shipId] || 0) + 1;
      player.combatPower = calcCombatPower();
      showToast('✅ ' + (t('fleetUpgradedAd') || 'Ship upgraded! (Ad)'));
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
  if (!player.fleet) player.fleet = {};
  player.fleet[shipId] = (player.fleet[shipId] || 0) + 1;
  player.combatPower = calcCombatPower();

  showToast('✅ ' + (t('fleetUpgraded') || 'Ship upgraded!'));
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- Get total fleet CP ----------
function getFleetCP() {
  if (!player || !player.fleet) return 0;
  let totalCP = 0;
  const ships = getFleetShips();
  ships.forEach(function(ship) {
    const level = player.fleet[ship.id] || 0;
    totalCP += level * CONFIG.FLEET.cpPerLevel;
  });
  return totalCP;
}

// ---------- Get fleet stats for UI ----------
function getFleetStats() {
  if (!player) return { totalShips: 0, totalLevels: 0, totalCP: 0, unlocked: 0, locked: 0, ships: [] };

  const ships = getFleetShips();
  let totalLevels = 0;
  let unlocked = 0;
  let locked = 0;
  const shipList = [];

  ships.forEach(function(ship) {
    const level = player.fleet[ship.id] || 0;
    const isUnlocked = isShipUnlocked(ship.id);
    const maxLevel = getShipMaxLevel(ship.id);

    shipList.push({
      id: ship.id,
      nameEn: ship.nameEn,
      nameZh: ship.nameZh,
      level: level,
      maxLevel: maxLevel,
      isUnlocked: isUnlocked,
      isMaxed: level >= maxLevel,
      unlockRank: ship.unlockRank
    });

    totalLevels += level;
    if (isUnlocked) {
      unlocked++;
    } else {
      locked++;
    }
  });

  return {
    totalShips: ships.length,
    totalLevels: totalLevels,
    totalCP: getFleetCP(),
    unlocked: unlocked,
    locked: locked,
    ships: shipList
  };
}