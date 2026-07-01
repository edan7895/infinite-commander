// ============================================================
// soldier.js — Soldier System (Part 5 - 带训练队列)
// ============================================================

// ---------- Get soldier limits ----------
function getMaxSoldiers() {
  if (!player) return 0;
  const barracksLevel = player.buildings.barracks || 1;
  return barracksLevel * CONFIG.SOLDIER.maxPerBarracksLevel;
}

function getActiveSoldiers() {
  if (!player) return 0;
  return (player.soldiers || 0) - (player.wounded || 0);
}

function getWoundedCount() {
  if (!player) return 0;
  return player.wounded || 0;
}

// ---------- Training costs ----------
function getTrainCost() {
  if (!player) return { gold: 999999, rice: 999999 };
  const currentSoldiers = player.soldiers || 0;
  const goldCost = CONFIG.SOLDIER.goldCostBase + (currentSoldiers * CONFIG.SOLDIER.goldCostPerSoldier);
  const riceCost = CONFIG.SOLDIER.riceCostBase + (currentSoldiers * CONFIG.SOLDIER.riceCostPerSoldier);
  return {
    gold: Math.floor(goldCost),
    rice: Math.floor(riceCost)
  };
}

function getHealCost() {
  if (!player) return { gold: 0, rice: 0 };
  const wounded = player.wounded || 0;
  if (wounded <= 0) return { gold: 0, rice: 0 };
  const goldCost = CONFIG.SOLDIER.healGoldBase + (wounded * CONFIG.SOLDIER.healGoldPerWounded);
  const riceCost = CONFIG.SOLDIER.healRiceBase + (wounded * CONFIG.SOLDIER.healRicePerWounded);
  return {
    gold: Math.floor(goldCost),
    rice: Math.floor(riceCost)
  };
}

// ---------- Train soldier ----------
function trainSoldier(useAd) {
  if (!player) return false;

  const maxSoldiers = getMaxSoldiers();
  const currentSoldiers = player.soldiers || 0;

  if (currentSoldiers >= maxSoldiers) {
    showToast(t('maxSoldiersReached') || 'Max soldiers reached!');
    return false;
  }

  // 检查是否已在训练队列中
  if (isUpgrading('soldier', 'train')) {
    showToast('⏳ ' + (t('upgradeInProgress') || 'Training already in progress'));
    return false;
  }

  const cost = getTrainCost();

  // 广告加速模式
  if (useAd) {
    GameAds.reward('soldier', function() {
      // 立即完成训练
      const count = 1;
      player.soldiers = (player.soldiers || 0) + count;
      if (typeof calcCombatPower === 'function') {
        player.combatPower = calcCombatPower();
      }
      if (typeof updateDailyProgress === 'function') {
        updateDailyProgress('soldier', count);
      }
      showToast('✅ ' + (t('soldierTrainedAd') || 'Soldier trained! (Ad)'));
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

  if (player.rice < cost.rice) {
    showToast(t('notEnoughRice') || 'Not enough rice! Need ' + formatNumber(cost.rice));
    return false;
  }

  // 扣除资源
  player.gold -= cost.gold;
  player.rice -= cost.rice;

  // 计算训练时间
  const totalTime = getSoldierTrainTime();
  if (totalTime <= 0) {
    // 直接完成
    player.soldiers = (player.soldiers || 0) + 1;
    if (typeof calcCombatPower === 'function') {
      player.combatPower = calcCombatPower();
    }
    if (typeof updateDailyProgress === 'function') {
      updateDailyProgress('soldier', 1);
    }
    showToast('✅ ' + (t('soldierTrained') || 'Soldier trained!'));
    if (typeof updateUI === 'function') updateUI();
    return true;
  }

  // 添加到队列
  const isZh = langCurrent === 'zh';
  const item = {
    type: 'soldier',
    id: 'train',
    nameEn: 'Soldier Training',
    nameZh: '士兵训练',
    totalTime: totalTime,
    remainingTime: totalTime,
    startTime: null,
    status: 'pending',
    count: 1
  };

  const added = addUpgradeToQueue(item);
  if (added) {
    showToast('⏳ ' + (isZh ? '开始训练士兵' : 'Training soldier'));
    if (typeof updateUI === 'function') updateUI();
  }
  return added;
}

// ---------- Heal wounded ----------
function healWounded(useAd) {
  if (!player) return false;

  const wounded = player.wounded || 0;
  if (wounded <= 0) {
    showToast(t('noWounded') || 'No wounded soldiers!');
    return false;
  }

  const cost = getHealCost();

  if (useAd) {
    GameAds.reward('soldier', function() {
      player.wounded = 0;
      showToast('✅ ' + (t('soldierHealedAd') || 'Wounded healed! (Ad)'));
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

  if (player.rice < cost.rice) {
    showToast(t('notEnoughRice') || 'Not enough rice! Need ' + formatNumber(cost.rice));
    return false;
  }

  player.gold -= cost.gold;
  player.rice -= cost.rice;
  player.wounded = 0;

  showToast('✅ ' + (t('soldierHealed') || 'Wounded healed!'));
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- Soldier consumption ----------
function applySoldierConsumption() {
  if (!player) return;
  const activeSoldiers = getActiveSoldiers();
  if (activeSoldiers <= 0) return;

  const consumption = activeSoldiers * CONFIG.SOLDIER.riceConsumptionPerSoldier;
  player.rice = Math.max(0, player.rice - consumption);

  if (player.rice <= 0 && activeSoldiers > 0) {
    if (player.soldiers > 0) {
      player.soldiers--;
      if (player.wounded > 0) {
        player.wounded--;
      }
      showToast('💀 ' + (t('soldierDied') || 'A soldier died from starvation!'));
      if (typeof updateUI === 'function') updateUI();
    }
  }
}

// ---------- Soldier death in combat ----------
function applySoldierDeath() {
  if (!player) return;
  const activeSoldiers = getActiveSoldiers();
  if (activeSoldiers <= 0) return;

  if (Math.random() < CONFIG.SOLDIER.deathChance) {
    if (player.wounded > 0 && Math.random() < 0.2) {
      player.wounded--;
    } else if (player.soldiers > 0) {
      if (player.soldiers > 0) {
        player.soldiers--;
      }
    }
    if (Math.random() < 0.1 && player.soldiers > 0) {
      player.wounded = (player.wounded || 0) + 1;
      player.soldiers--;
    }
  }
}

// ---------- Get soldier stats ----------
function getSoldierStats() {
  if (!player) return { total: 0, active: 0, wounded: 0, max: 0, consumption: 0 };

  const total = player.soldiers || 0;
  const wounded = player.wounded || 0;
  const active = total - wounded;
  const max = getMaxSoldiers();
  const consumption = active * CONFIG.SOLDIER.riceConsumptionPerSoldier;
  const isTraining = isUpgrading('soldier', 'train');

  return { total, active, wounded, max, consumption, isTraining };
}