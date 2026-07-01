// ============================================================
// daily.js — Daily Quest System + 30-Day Login
// ============================================================

// ---------- 每日任务（原有8个） ----------
function getDailyTasks() {
  return CONFIG.DAILY.tasks || [];
}

function getDailyTask(id) {
  const tasks = getDailyTasks();
  return tasks.find(function(t) { return t.id === id; }) || null;
}

function getDailyProgress() {
  if (!player || !player.daily) return null;
  return player.daily;
}

function checkDailyReset() {
  if (!player || !player.daily) return;

  const now = Date.now();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const lastReset = player.daily.date || 0;
  const lastResetDate = new Date(lastReset);
  lastResetDate.setHours(0, 0, 0, 0);

  if (lastResetDate.getTime() < today.getTime()) {
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

    // 检查签到是否连续
    const lastLogin = player.daily.lastLoginDate || 0;
    const lastLoginDate = new Date(lastLogin);
    lastLoginDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      player.daily.loginStreak = 0;
      player.daily.loginDay = 0;
    }
  }
}

// ---------- 30天签到系统 ----------
const LOGIN_REWARDS = [];

// 生成30天签到奖励
function generateLoginRewards() {
  if (LOGIN_REWARDS.length > 0) return LOGIN_REWARDS;

  for (let day = 1; day <= 30; day++) {
    let gold = 0, exp = 0, iron = 0, rice = 0, tech = 0;
    let special = false;

    if (day === 1) {
      gold = 500;
      exp = 200;
      iron = 20;
      rice = 50;
    } else if (day === 5) {
      gold = 2000;
      exp = 800;
      iron = 50;
      rice = 100;
    } else if (day === 10) {
      gold = 5000;
      exp = 2000;
      iron = 100;
      rice = 200;
      tech = 5;
    } else if (day === 15) {
      gold = 10000;
      exp = 4000;
      iron = 200;
      rice = 400;
      tech = 10;
    } else if (day === 20) {
      gold = 20000;
      exp = 8000;
      iron = 400;
      rice = 800;
      tech = 20;
    } else if (day === 25) {
      gold = 50000;
      exp = 20000;
      iron = 1000;
      rice = 2000;
      tech = 30;
    } else if (day === 30) {
      gold = 100000;
      exp = 50000;
      iron = 2000;
      rice = 5000;
      tech = 50;
      special = true;
    } else if (day % 3 === 0) {
      gold = 100 + day * 50;
      exp = 50 + day * 20;
      iron = Math.floor(day * 1.5);
      rice = Math.floor(day * 3);
    } else {
      gold = 50 + day * 30;
      exp = 30 + day * 10;
      iron = Math.floor(day * 0.8);
      rice = Math.floor(day * 1.5);
    }

    LOGIN_REWARDS.push({
      day: day,
      gold: Math.floor(gold),
      exp: Math.floor(exp),
      iron: Math.floor(iron),
      rice: Math.floor(rice),
      tech: Math.floor(tech),
      special: special,
      claimed: false
    });
  }
  return LOGIN_REWARDS;
}

function getLoginReward(day) {
  const rewards = generateLoginRewards();
  return rewards.find(function(r) { return r.day === day; }) || null;
}

function getCurrentLoginDay() {
  if (!player || !player.daily) return 0;
  return player.daily.loginDay || 0;
}

function getLoginStreak() {
  if (!player || !player.daily) return 0;
  return player.daily.loginStreak || 0;
}

function claimLoginReward() {
  if (!player) return false;

  checkDailyReset();

  const currentDay = getCurrentLoginDay();
  const nextDay = currentDay + 1;

  if (nextDay > 30) {
    showToast('🎉 ' + (langCurrent === 'zh' ? '已完成所有签到！' : 'All login rewards claimed!'));
    return false;
  }

  const reward = getLoginReward(nextDay);
  if (!reward) return false;

  if (reward.claimed) {
    showToast('📅 ' + (langCurrent === 'zh' ? '今日已签到' : 'Already claimed today'));
    return false;
  }

  // 检查是否连续签到
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastLogin = player.daily.lastLoginDate || 0;
  const lastLoginDate = new Date(lastLogin);
  lastLoginDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 1 && player.daily.loginDay > 0) {
    // 断签了，重置
    player.daily.loginDay = 0;
    player.daily.loginStreak = 0;
    showToast('⚠️ ' + (langCurrent === 'zh' ? '签到中断，已重置' : 'Login streak broken, reset'));
    return false;
  }

  // 同一天不能签两次
  if (diffDays === 0 && player.daily.loginDay > 0) {
    showToast('📅 ' + (langCurrent === 'zh' ? '今日已签到' : 'Already claimed today'));
    return false;
  }

  // 发放奖励
  player.gold += reward.gold;
  player.totalGold += reward.gold;
  player.exp += reward.exp;
  player.iron += reward.iron;
  player.rice += reward.rice;
  if (reward.tech > 0) {
    player.techPoints = (player.techPoints || 0) + reward.tech;
  }

  player.daily.loginDay = nextDay;
  player.daily.loginStreak = (player.daily.loginStreak || 0) + 1;
  player.daily.lastLoginDate = Date.now();
  reward.claimed = true;

  const isZh = langCurrent === 'zh';
  let msg = '📅 ' + (isZh ? '签到第 ' + nextDay + ' 天！' : 'Day ' + nextDay + ' claimed!');
  if (reward.gold > 0) msg += ' +' + formatNumber(reward.gold) + '💰';
  if (reward.exp > 0) msg += ' +' + formatNumber(reward.exp) + 'EXP';
  if (reward.iron > 0) msg += ' +' + formatNumber(reward.iron) + '⛏️';
  if (reward.rice > 0) msg += ' +' + formatNumber(reward.rice) + '🌾';
  if (reward.tech > 0) msg += ' +' + reward.tech + '⚡';
  if (reward.special) msg += ' 🎉 ' + (isZh ? '超级奖励！' : 'Super Reward!');

  showToast('✅ ' + msg);

  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- 每日任务进度更新 ----------
function updateDailyProgress(type, amount) {
  if (!player || !player.daily) return;

  checkDailyReset();

  if (type === 'kill') {
    player.daily.kills = (player.daily.kills || 0) + amount;
    const task = getDailyTask('kill');
    if (task) player.daily['kill'] = (player.daily['kill'] || 0) + amount;
  } else if (type === 'boss') {
    player.daily.bossKills = (player.daily.bossKills || 0) + amount;
    const task = getDailyTask('boss');
    if (task) player.daily['boss'] = (player.daily['boss'] || 0) + amount;
  } else if (type === 'gold') {
    player.daily.goldEarned = (player.daily.goldEarned || 0) + amount;
    const task = getDailyTask('gold');
    if (task) player.daily['gold'] = (player.daily['gold'] || 0) + amount;
  } else if (type === 'ad') {
    player.daily.adWatched = (player.daily.adWatched || 0) + amount;
    const task = getDailyTask('ad');
    if (task) player.daily['ad'] = (player.daily['ad'] || 0) + amount;
  } else if (type === 'building') {
    const task = getDailyTask('building');
    if (task) player.daily['building'] = (player.daily['building'] || 0) + amount;
  } else if (type === 'soldier') {
    const task = getDailyTask('soldier');
    if (task) player.daily['soldier'] = (player.daily['soldier'] || 0) + amount;
  } else if (type === 'equipment') {
    const task = getDailyTask('equipment');
    if (task) player.daily['equipment'] = (player.daily['equipment'] || 0) + amount;
  } else if (type === 'tech') {
    const task = getDailyTask('tech');
    if (task) player.daily['tech'] = (player.daily['tech'] || 0) + amount;
  }
}

// ---------- 领取每日任务奖励 ----------
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

  const taskIndex = getDailyTasks().findIndex(function(t) { return t.id === taskId; });
  if (taskIndex === -1) return false;

  const goldReward = CONFIG.DAILY.rewards.gold[taskIndex] || 0;
  const expReward = CONFIG.DAILY.rewards.exp[taskIndex] || 0;
  const ironReward = CONFIG.DAILY.rewards.iron[taskIndex] || 0;
  const riceReward = CONFIG.DAILY.rewards.rice[taskIndex] || 0;
  const techReward = CONFIG.DAILY.rewards.techPoints[taskIndex] || 0;

  player.gold += goldReward;
  player.totalGold += goldReward;
  player.exp += expReward;
  player.iron += ironReward;
  player.rice += riceReward;
  if (techReward > 0) {
    player.techPoints = (player.techPoints || 0) + techReward;
  }

  player.daily[taskId + '_claimed'] = true;

  let msg = '✅ ' + (t('dailyClaim') || 'Daily reward claimed!') + '\n';
  if (goldReward > 0) msg += '+' + formatNumber(goldReward) + '💰 ';
  if (expReward > 0) msg += '+' + formatNumber(expReward) + 'EXP ';
  if (ironReward > 0) msg += '+' + formatNumber(ironReward) + '⛏️ ';
  if (riceReward > 0) msg += '+' + formatNumber(riceReward) + '🌾 ';
  if (techReward > 0) msg += '+' + techReward + '⚡ ';

  showToast('✅ ' + msg);
  if (typeof updateUI === 'function') updateUI();
  return true;
}

// ---------- 获取每日任务统计 ----------
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

    if (isComplete && !claimed) completed++;
    else if (claimed) completed++;

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