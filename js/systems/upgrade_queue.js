// ============================================================
// upgrade_queue.js — 升级队列管理器 (Part 5)
// ============================================================

// ---------- 获取当前时间 ----------
function getNow() {
  return Date.now();
}

// ---------- 计算升级时间（指数级增长） ----------
function calculateUpgradeTime(config, currentLevel) {
  // config: { baseTime, multiplier }
  // currentLevel: 当前等级（0-based）
  const base = config.baseTime || 60;
  const multiplier = config.multiplier || 1.2;
  // 指数增长: base * (multiplier ^ currentLevel)
  const time = Math.floor(base * Math.pow(multiplier, currentLevel));
  return Math.min(time, 86400 * 30); // 最多30天
}

// ---------- 获取建筑升级时间 ----------
function getBuildingUpgradeTime(type) {
  const level = getBuildingLevel(type);
  const maxLevel = getMaxBuildingLevel();
  if (level >= maxLevel) return 0;
  // 建筑升级时间：30秒起步，1.15倍增长
  return calculateUpgradeTime({ baseTime: 30, multiplier: 1.15 }, level - 1);
}

// ---------- 获取科技研究时间 ----------
function getTechResearchTime(lineId) {
  const level = getTechLevel(lineId);
  const maxLevel = getTechMaxLevel();
  if (level >= maxLevel) return 0;
  return calculateUpgradeTime(
    { baseTime: CONFIG.TECH.researchTimeBase || 60, multiplier: CONFIG.TECH.researchTimeMultiplier || 1.25 },
    level
  );
}

// ---------- 获取战舰升级时间 ----------
function getFleetUpgradeTime(shipId) {
  const level = getShipLevel(shipId);
  const maxLevel = getShipMaxLevel(shipId);
  if (level >= maxLevel) return 0;
  return calculateUpgradeTime(
    { baseTime: CONFIG.FLEET.upgradeTimeBase || 30, multiplier: CONFIG.FLEET.upgradeTimeMultiplier || 1.3 },
    level
  );
}

// ---------- 获取装备升级时间 ----------
function getEquipmentUpgradeTime(typeId) {
  const level = getEquipmentLevel(typeId);
  const maxLevel = getEquipmentMaxLevel();
  if (level >= maxLevel) return 0;
  return calculateUpgradeTime(
    { baseTime: CONFIG.EQUIPMENT.upgradeTimeBase || 15, multiplier: CONFIG.EQUIPMENT.upgradeTimeMultiplier || 1.35 },
    level
  );
}

// ---------- 获取士兵训练时间 ----------
function getSoldierTrainTime() {
  const currentSoldiers = player ? player.soldiers || 0 : 0;
  const maxSoldiers = getMaxSoldiers();
  if (currentSoldiers >= maxSoldiers) return 0;
  const base = CONFIG.SOLDIER.trainTimeBase || 10;
  const per = CONFIG.SOLDIER.trainTimePerSoldier || 2;
  return base + currentSoldiers * per;
}

// ---------- 添加升级到队列 ----------
function addUpgradeToQueue(upgradeItem) {
  if (!player) return false;
  if (!player.upgradeQueue) player.upgradeQueue = [];
  
  // 检查是否已存在相同的待处理升级
  const existing = player.upgradeQueue.find(function(item) {
    return item.type === upgradeItem.type && 
           item.id === upgradeItem.id && 
           item.status === 'pending';
  });
  if (existing) {
    showToast('⏳ ' + (t('upgradeInProgress') || 'Upgrade already in progress'));
    return false;
  }
  
  // 检查队列数量限制
  const pendingCount = player.upgradeQueue.filter(function(item) {
    return item.status === 'pending';
  }).length;
  const maxConcurrent = CONFIG.UPGRADE_QUEUE.maxConcurrent || 3;
  if (pendingCount >= maxConcurrent) {
    showToast('⏳ ' + (t('queueFull') || 'Upgrade queue full (' + maxConcurrent + ' max)'));
    return false;
  }
  
  player.upgradeQueue.push(upgradeItem);
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- 更新所有升级队列（每秒调用） ----------
function updateUpgradeQueues() {
  if (!player) return;
  if (!player.upgradeQueue) player.upgradeQueue = [];
  
  const now = getNow();
  let updated = false;
  
  // 遍历所有待处理的升级
  for (let i = player.upgradeQueue.length - 1; i >= 0; i--) {
    const item = player.upgradeQueue[i];
    if (item.status !== 'pending') continue;
    
    // 如果开始时间为空，设置开始时间
    if (!item.startTime) {
      item.startTime = now;
      item.remainingTime = item.totalTime;
    }
    
    // 计算剩余时间
    const elapsed = (now - item.startTime) / 1000;
    item.remainingTime = Math.max(0, item.totalTime - elapsed);
    
    // 如果完成
    if (item.remainingTime <= 0) {
      // 执行升级完成回调
      completeUpgrade(item);
      // 从队列移除
      player.upgradeQueue.splice(i, 1);
      updated = true;
    }
  }
  
  if (updated && typeof updateUI === 'function') {
    updateUI();
  }
}

// ---------- 完成升级 ----------
function completeUpgrade(item) {
  console.log('[Upgrade] Complete:', item.type, item.id);
  
  switch (item.type) {
    case 'building':
      completeBuildingUpgrade(item);
      break;
    case 'tech':
      completeTechUpgrade(item);
      break;
    case 'fleet':
      completeFleetUpgrade(item);
      break;
    case 'equipment':
      completeEquipmentUpgrade(item);
      break;
    case 'soldier':
      completeSoldierTraining(item);
      break;
    default:
      console.warn('[Upgrade] Unknown type:', item.type);
  }
  
  // 显示完成提示
  const isZh = langCurrent === 'zh';
  const name = item.nameZh || item.nameEn || item.id;
  showToast('✅ ' + (isZh ? name + ' 升级完成！' : name + ' upgrade complete!'));
}

// ---------- 完成建筑升级 ----------
function completeBuildingUpgrade(item) {
  if (!player) return;
  if (!player.buildings) player.buildings = {};
  const type = item.id;
  player.buildings[type] = (player.buildings[type] || 1) + 1;
  // 更新每日任务
  if (typeof updateDailyProgress === 'function') {
    updateDailyProgress('building', 1);
  }
}

// ---------- 完成科技升级 ----------
function completeTechUpgrade(item) {
  if (!player) return;
  if (!player.tech) player.tech = {};
  const lineId = item.id;
  player.tech[lineId] = (player.tech[lineId] || 0) + 1;
  // 获得科技点
  player.techPoints = (player.techPoints || 0) + 1;
  // 每10级额外奖励
  if ((player.tech[lineId] || 0) % 10 === 0) {
    player.techPoints += 5;
    showToast('🎯 +5 ' + (t('techPoint') || 'Tech Points'));
  }
  // 更新每日任务
  if (typeof updateDailyProgress === 'function') {
    updateDailyProgress('tech', 1);
  }
  // 重新计算战斗力
  if (typeof calcCombatPower === 'function') {
    player.combatPower = calcCombatPower();
  }
}

// ---------- 完成舰队升级 ----------
function completeFleetUpgrade(item) {
  if (!player) return;
  if (!player.fleet) player.fleet = {};
  const shipId = item.id;
  player.fleet[shipId] = (player.fleet[shipId] || 0) + 1;
  // 重新计算战斗力
  if (typeof calcCombatPower === 'function') {
    player.combatPower = calcCombatPower();
  }
}

// ---------- 完成装备升级 ----------
function completeEquipmentUpgrade(item) {
  if (!player) return;
  if (!player.equipment) player.equipment = {};
  const typeId = item.id;
  player.equipment[typeId] = (player.equipment[typeId] || 0) + 1;
  // 更新每日任务
  if (typeof updateDailyProgress === 'function') {
    updateDailyProgress('equipment', 1);
  }
  // 重新计算战斗力
  if (typeof calcCombatPower === 'function') {
    player.combatPower = calcCombatPower();
  }
}

// ---------- 完成士兵训练 ----------
function completeSoldierTraining(item) {
  if (!player) return;
  const count = item.count || 1;
  player.soldiers = (player.soldiers || 0) + count;
  // 更新每日任务
  if (typeof updateDailyProgress === 'function') {
    updateDailyProgress('soldier', count);
  }
  // 重新计算战斗力
  if (typeof calcCombatPower === 'function') {
    player.combatPower = calcCombatPower();
  }
}

// ---------- 广告加速升级 ----------
function speedUpgradeWithAd(queueIndex) {
  if (!player) return;
  if (!player.upgradeQueue) player.upgradeQueue = [];
  
  const queue = player.upgradeQueue;
  if (queueIndex < 0 || queueIndex >= queue.length) {
    showToast('Invalid upgrade');
    return;
  }
  
  const item = queue[queueIndex];
  if (item.status !== 'pending') {
    showToast('Upgrade already completed');
    return;
  }
  
  // 广告减少时间（秒）
  const reduceTime = CONFIG.UPGRADE_QUEUE.adReduceTime || 14400; // 4小时
  
  // 调用广告
  watchDoubleAd(function() {
    // 广告成功，减少时间
    const remaining = item.remainingTime || (item.totalTime || 0);
    const newRemaining = Math.max(0, remaining - reduceTime);
    item.remainingTime = newRemaining;
    item.totalTime = item.totalTime || remaining;
    // 如果剩余时间变为0或负数，立即完成
    if (newRemaining <= 0) {
      // 立即完成
      const now = getNow();
      // 强制完成
      completeUpgrade(item);
      // 从队列移除
      const idx = player.upgradeQueue.indexOf(item);
      if (idx !== -1) {
        player.upgradeQueue.splice(idx, 1);
      }
      if (typeof updateUI === 'function') updateUI();
      showToast('✅ ' + (t('upgradeComplete') || 'Upgrade complete! (Ad boost)'));
    } else {
      // 更新时间
      item.startTime = getNow() - (item.totalTime - newRemaining) * 1000;
      if (typeof updateUI === 'function') updateUI();
      showToast('⏳ ' + (t('upgradeReduced') || 'Time reduced by 4 hours!'));
    }
  });
}

// ---------- 获取队列统计 ----------
function getUpgradeQueueStats() {
  if (!player) return { total: 0, pending: 0, completed: 0 };
  const queue = player.upgradeQueue || [];
  const pending = queue.filter(function(item) { return item.status === 'pending'; });
  const completed = queue.filter(function(item) { return item.status === 'completed'; });
  return {
    total: queue.length,
    pending: pending.length,
    completed: completed.length,
    queue: queue
  };
}

// ---------- 格式化剩余时间 ----------
function formatUpgradeTime(seconds) {
  if (seconds <= 0) return '0s';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  let result = '';
  if (days > 0) result += days + 'd ';
  if (hours > 0) result += hours + 'h ';
  if (minutes > 0) result += minutes + 'm ';
  if (secs > 0 && days === 0) result += secs + 's';
  return result.trim() || '0s';
}

// ---------- 获取队列中的升级项详情 ----------
function getQueueItemDisplay(item) {
  const isZh = langCurrent === 'zh';
  const name = isZh ? (item.nameZh || item.id) : (item.nameEn || item.id);
  const remaining = item.remainingTime || 0;
  const total = item.totalTime || 0;
  const progress = total > 0 ? ((total - remaining) / total * 100) : 0;
  return {
    name: name,
    remaining: remaining,
    total: total,
    progress: Math.min(100, progress),
    remainingFormatted: formatUpgradeTime(remaining)
  };
}

// 暴露到全局
window.updateUpgradeQueues = updateUpgradeQueues;
window.speedUpgradeWithAd = speedUpgradeWithAd;
window.getUpgradeQueueStats = getUpgradeQueueStats;
window.formatUpgradeTime = formatUpgradeTime;
window.getQueueItemDisplay = getQueueItemDisplay;
window.addUpgradeToQueue = addUpgradeToQueue;
window.isUpgrading = isUpgrading;
window.getBuildingUpgradeTime = getBuildingUpgradeTime;
window.getTechResearchTime = getTechResearchTime;
window.getFleetUpgradeTime = getFleetUpgradeTime;
window.getEquipmentUpgradeTime = getEquipmentUpgradeTime;
window.getSoldierTrainTime = getSoldierTrainTime;

console.log('✅ 升级队列系统已加载');