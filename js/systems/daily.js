// ============================================================
// daily.js — Daily Quest System
// ============================================================

// ---------- Get daily tasks ----------
function getDailyTasks() {
  return CONFIG.DAILY.tasks || [];
}

function getDailyTask(id) {
  const tasks = getDailyTasks();
  return tasks.find(function(t) { return t.id === id; }) || null;
}

// ---------- Get daily progress ----------
function getDailyProgress() {
  if (!player || !player.daily) return null;
  return player.daily;
}

// ---------- Check if daily reset needed ----------
function checkDailyReset() {
  if (!player || !player.daily) return;

  const now = Date.now();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const lastReset = player.daily.date || 0;
  const lastResetDate = new Date(lastReset);
  lastResetDate.setHours(0, 0, 0, 0);

  if (lastResetDate.getTime() < today.getTime()) {
    // Reset daily progress
    const tasks = getDailyTasks();
    tasks.forEach(function(task) {
      player.daily[task.id] = 0;
      player.daily[task.id + '_claimed'] = false;
    });
    player.daily.date = now;
    player.daily.bossKills = 0;
    player.daily.kills = 0;
    player.daily.goldEarned = 0;
    player.daily.adWatched = 0;
  }
}

// ---------- Update daily progress ----------
function updateDailyProgress(type, amount) {
  if (!player || !player.daily) return;

  checkDailyReset();

  if (type === 'kill') {
    player.daily.kills = (player.daily.kills || 0) + amount;
    // Also update the specific task
    const task = getDailyTask('kill');
    if (task) {
      player.daily['kill'] = (player.daily['kill'] || 0) + amount;
    }
  } else if (type === 'boss') {
    player.daily.bossKills = (player.daily.bossKills || 0) + amount;
    const task = getDailyTask('boss');
    if (task) {
      player.daily['boss'] = (player.daily['boss'] || 0) + amount;
    }
  } else if (type === 'gold') {
    player.daily.goldEarned = (player.daily.goldEarned || 0) + amount;
    const task = getDailyTask('gold');
    if (task) {
      player.daily['gold'] = (player.daily['gold'] || 0) + amount;
    }
  } else if (type === 'ad') {
    player.daily.adWatched = (player.daily.adWatched || 0) + amount;
    const task = getDailyTask('ad');
    if (task) {
      player.daily['ad'] = (player.daily['ad'] || 0) + amount;
    }
  } else if (type === 'building') {
    const task = getDailyTask('building');
    if (task) {
      player.daily['building'] = (player.daily['building'] || 0) + amount;
    }
  } else if (type === 'soldier') {
    const task = getDailyTask('soldier');
    if (task) {
      player.daily['soldier'] = (player.daily['soldier'] || 0) + amount;
    }
  } else if (type === 'equipment') {
    const task = getDailyTask('equipment');
    if (task) {
      player.daily['equipment'] = (player.daily['equipment'] || 0) + amount;
    }
  } else if (type === 'tech') {
    const task = getDailyTask('tech');
    if (task) {
      player.daily['tech'] = (player.daily['tech'] || 0) + amount;
    }
  }
}

// ---------- Claim daily reward ----------
function claimDailyReward(taskId) {
  if (!player || !player.daily) return false;

  checkDailyReset();

  const task = getDailyTask(taskId);
  if (!task) return false;

  const progress = player.daily[taskId] || 0;
  const claimed = player.daily[taskId + '_claimed'] || false;

  if (claimed) {
    showToast(t('dailyClaimed') || 'Already claimed!');
    return false;
  }

  if (progress < task.target) {
    showToast(t('dailyIncomplete') || 'Task not complete!');
    return false;
  }

  // Find reward index
  const taskIndex = getDailyTasks().findIndex(function(t) { return t.id === taskId; });
  if (taskIndex === -1) return false;

  const goldReward = CONFIG.DAILY.rewards.gold[taskIndex] || 0;
  const expReward = CONFIG.DAILY.rewards.exp[taskIndex] || 0;
  const ironReward = CONFIG.DAILY.rewards.iron[taskIndex] || 0;
  const riceReward = CONFIG.DAILY.rewards.rice[taskIndex] || 0;
  const techReward = CONFIG.DAILY.rewards.techPoints[taskIndex] || 0;

  // Apply rewards
  player.gold += goldReward;
  player.totalGold += goldReward;
  player.exp += expReward;
  player.iron += ironReward;
  player.rice += riceReward;
  if (techReward > 0) {
    player.techPoints = (player.techPoints || 0) + techReward;
  }

  // Mark as claimed
  player.daily[taskId + '_claimed'] = true;

  let msg = '✅ ' + (t('dailyClaim') || 'Daily reward claimed!') + '\n';
  if (goldReward > 0) msg += '+' + formatNumber(goldReward) + '💰 ';
  if (expReward > 0) msg += '+' + formatNumber(expReward) + 'EXP ';
  if (ironReward > 0) msg += '+' + formatNumber(ironReward) + '⛏️ ';
  if (riceReward > 0) msg += '+' + formatNumber(riceReward) + '🌾 ';
  if (techReward > 0) msg += '+' + techReward + '⚡ ';

  alert(msg);
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- Get daily stats for UI ----------
function getDailyStats() {
  if (!player || !player.daily) return { tasks: [], completed: 0, total: 0, allCompleted: false };

  checkDailyReset();

  const tasks = getDailyTasks();
  const taskList = [];
  let completed = 0;

  tasks.forEach(function(task, index) {
    const progress = player.daily[task.id] || 0;
    const claimed = player.daily[task.id + '_claimed'] || false;
    const isComplete = progress >= task.target;

    if (isComplete && !claimed) {
      completed++;
    } else if (claimed) {
      completed++;
    }

    const goldReward = CONFIG.DAILY.rewards.gold[index] || 0;
    const expReward = CONFIG.DAILY.rewards.exp[index] || 0;
    const ironReward = CONFIG.DAILY.rewards.iron[index] || 0;
    const riceReward = CONFIG.DAILY.rewards.rice[index] || 0;
    const techReward = CONFIG.DAILY.rewards.techPoints[index] || 0;

    taskList.push({
      id: task.id,
      nameEn: task.nameEn,
      nameZh: task.nameZh,
      icon: task.icon || '📋',
      target: task.target,
      progress: progress,
      isComplete: isComplete,
      claimed: claimed,
      goldReward: goldReward,
      expReward: expReward,
      ironReward: ironReward,
      riceReward: riceReward,
      techReward: techReward
    });
  });

  return {
    tasks: taskList,
    completed: completed,
    total: tasks.length,
    allCompleted: completed >= tasks.length
  };
}