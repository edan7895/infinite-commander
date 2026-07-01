// ============================================================
// ui.js — UI Rendering Engine (Part 7 - Boss 领取按钮修复)
// ============================================================

// ---------- 缓存：上次刷新的数据哈希 ----------
let _lastUIHash = '';
let _lastRefreshTime = 0;

function computeUIHash() {
  if (!player) return '';
  const p = player;
  const data = {
    gold: p.gold,
    exp: p.exp,
    stars: p.stars,
    rankId: p.rankId,
    kills: p.totalKills,
    combatPower: p.combatPower,
    soldiers: p.soldiers,
    wounded: p.wounded,
    bossActive: p.bossActive,
    bossHealth: p.bossHealth,
    offlineSeconds: p.offlineSeconds,
    doubleBuff: p.doubleBuff,
    buildings: p.buildings,
    fleet: p.fleet,
    tech: p.tech,
    equipment: p.equipment,
    daily: p.daily,
    achievements: p.achievements
  };
  return JSON.stringify(data);
}

function hasUIDataChanged() {
  const currentHash = computeUIHash();
  if (currentHash !== _lastUIHash) {
    _lastUIHash = currentHash;
    return true;
  }
  return false;
}

// ---------- 主 UI 更新 ----------
function updateUI() {
  if (!player) return;

  const p = player;
  const rank = getCurrentRank();
  const expNeeded = getStarRequirement(p.stars) || 1;
  const expPercent = Math.min(100, (p.exp / expNeeded) * 100);
  const starsPercent = (p.stars / 5) * 100;
  const rankName = getRankName(p.rankId, langCurrent);
  const starsDisp = getStarsDisplay(p.stars);

  // ----- Top Bar -----
  updateElement('rank-name', rankName);
  updateElement('stars-display', starsDisp);
  updateElement('cp', p.combatPower);
  updateElement('gold', formatNumber(p.gold));
  updateElement('exp', formatNumber(p.exp));
  updateElement('exp-needed', formatNumber(expNeeded));
  updateElement('kills', formatNumber(p.totalKills));

  // ----- Left Column -----
  updateElement('exp2', formatNumber(p.exp));
  updateElement('exp-needed2', formatNumber(expNeeded));
  updateElement('exp-bar', null, expPercent + '%', 'width');
  updateElement('stars-count', p.stars);
  updateElement('stars-bar', null, starsPercent + '%', 'width');
  updateElement('kills2', formatNumber(p.kills));

  const mins = Math.floor(p.totalPlayTime / 60);
  const secs = p.totalPlayTime % 60;
  updateElement('playtime', mins + 'm ' + secs + 's');

  // ----- Battlefield -----
  const autoStatus = document.getElementById('auto-status');
  const autoBtn = document.getElementById('auto-btn');
  if (p.autoFight) {
    if (autoStatus) {
      autoStatus.textContent = '▶ ' + (langCurrent === 'zh' ? '交战中' : 'Engaging');
      autoStatus.className = 'badge badge-success';
    }
    if (autoBtn) autoBtn.textContent = langCurrent === 'zh' ? '停火' : 'Hold Fire';
  } else {
    if (autoStatus) {
      autoStatus.textContent = '⏸ ' + (langCurrent === 'zh' ? '待命中' : 'Standing By');
      autoStatus.className = 'badge badge-danger';
    }
    if (autoBtn) autoBtn.textContent = langCurrent === 'zh' ? '出击' : 'Engage';
  }

  // ----- Bottom -----
  updateElement('auto-bottom', p.autoFight ? 'ON' : 'OFF');
  updateElement('rank-bottom', rankName);
  const hours = Math.floor(p.totalPlayTime / 3600);
  const mins2 = Math.floor((p.totalPlayTime % 3600) / 60);
  updateElement('playtime-bottom', hours + 'h ' + mins2 + 'm');

  // ----- Boss UI（含普通领取按钮） -----
  updateBossUI();

  // ----- Offline -----
  if (p.offlineSeconds > 0) {
    const el = document.getElementById('offline-area');
    if (el) el.style.display = 'block';
    const h = Math.floor(p.offlineSeconds / 3600);
    const m = Math.floor((p.offlineSeconds % 3600) / 60);
    updateElement('offline-time', h + 'h ' + m + 'm');
  } else {
    const el = document.getElementById('offline-area');
    if (el) el.style.display = 'none';
  }

  // ----- Buff -----
  if (p.doubleBuff > 0) {
    const el = document.getElementById('buff-area');
    if (el) el.style.display = 'block';
    updateElement('buff-timer', p.doubleBuff);
  } else {
    const el = document.getElementById('buff-area');
    if (el) el.style.display = 'none';
  }

  // ----- Base Production -----
  const prod = getTotalBuildingProduction();
  const prodEl = document.getElementById('building-production-summary');
  if (prodEl) {
    prodEl.innerHTML = '🏗️ ' + (langCurrent === 'zh' ? '基地产出' : 'Base') + ': ' +
      formatNumber(prod.gold) + '💰/s ' +
      formatNumber(prod.iron) + '⛏️/s ' +
      formatNumber(prod.rice) + '🌾/s';
  }

  // ----- Soldiers -----
  const stats = getSoldierStats();
  const soldierEl = document.getElementById('soldier-summary');
  if (soldierEl) {
    const isZh = langCurrent === 'zh';
    soldierEl.innerHTML = '🪖 ' + (isZh ? '兵力' : 'Soldiers') + ': ' +
      stats.active + '/' + stats.max + ' ' +
      (isZh ? '活跃' : 'active') +
      (stats.wounded > 0 ? ' | 🏥 ' + (isZh ? '伤兵' : 'wounded') + ': ' + stats.wounded : '') +
      ' | 🌾 ' + stats.consumption.toFixed(2) + '/s';
  }

  // ----- Fleet -----
  const fleetStats = getFleetStats();
  const fleetEl = document.getElementById('fleet-summary');
  if (fleetEl) {
    const isZh = langCurrent === 'zh';
    fleetEl.innerHTML = '🚢 ' + (isZh ? '舰队' : 'Fleet') + ': ' +
      fleetStats.unlocked + '/' + fleetStats.totalShips + ' ' +
      (isZh ? '已解锁' : 'unlocked') +
      ' | ⚡ ' + fleetStats.totalCP + ' CP';
  }

  // ----- Tech -----
  const techStats = getTechStats();
  const techEl = document.getElementById('tech-summary');
  if (techEl) {
    const isZh = langCurrent === 'zh';
    techEl.innerHTML = '🔬 ' + (isZh ? '科技' : 'Tech') + ': ' +
      techStats.totalLevels + ' ' + (isZh ? '级' : 'levels') +
      ' | ⚡ ' + (techStats.totalTechPoints || 0) + ' ' + (isZh ? '科技点' : 'TP');
  }

  // ----- Armaments -----
  const equipStats = getEquipmentStats();
  const equipEl = document.getElementById('equipment-summary');
  if (equipEl) {
    const isZh = langCurrent === 'zh';
    equipEl.innerHTML = '🗡️ ' + (isZh ? '军备' : 'Armaments') + ': ' +
      equipStats.totalLevels + ' ' + (isZh ? '级' : 'levels') +
      ' | ⚡ +' + equipStats.totalCP + ' CP';
  }

  // ----- Daily -----
  const dailyStats = getDailyStats();
  const dailyEl = document.getElementById('daily-summary');
  if (dailyEl) {
    const isZh = langCurrent === 'zh';
    dailyEl.innerHTML = '📋 ' + (isZh ? '每日任务' : 'Daily') + ': ' +
      dailyStats.completed + '/' + dailyStats.total +
      (dailyStats.allCompleted ? ' ✅' : '');
  }

  // ----- Achievements -----
  const achStats = getAchievementStats();
  const achEl = document.getElementById('achievement-summary');
  if (achEl) {
    const isZh = langCurrent === 'zh';
    achEl.innerHTML = '🏆 ' + (isZh ? '功勋' : 'Achievements') + ': ' +
      achStats.unlocked + '/' + achStats.total +
      ' (' + achStats.progress + '%)';
  }

  // ----- Upgrade Queue -----
  const queueStats = getUpgradeQueueStats ? getUpgradeQueueStats() : { pending: 0 };
  const queueEl = document.getElementById('upgrade-queue-status');
  if (queueEl) {
    const isZh = langCurrent === 'zh';
    if (queueStats.pending > 0) {
      const pendingItems = (player.upgradeQueue || []).filter(function(item) { return item.status === 'pending'; });
      let statusText = '⏳ ' + (isZh ? '升级中' : 'Upgrading') + ': ';
      pendingItems.forEach(function(item, index) {
        const display = getQueueItemDisplay ? getQueueItemDisplay(item) : { name: item.id, remainingFormatted: '0s' };
        if (index > 0) statusText += ', ';
        statusText += display.name + ' (' + display.remainingFormatted + ')';
      });
      queueEl.textContent = statusText;
      queueEl.style.color = '#f5d742';
      queueEl.style.display = 'block';
    } else {
      queueEl.textContent = '✅ ' + (isZh ? '所有升级已完成' : 'All upgrades complete');
      queueEl.style.color = '#7bed9f';
      queueEl.style.display = 'block';
    }
  }

  // ----- Event Status -----
  const eventEl = document.getElementById('event-status');
  if (eventEl) {
    const isZh = langCurrent === 'zh';
    if (eventActive) {
      eventEl.innerHTML = '⚡ ' + (isZh ? '事件进行中' : 'Event Active');
      eventEl.style.color = '#f5d742';
    } else {
      const remaining = Math.max(0, CONFIG.EVENTS.minInterval - (Date.now() - (player.lastEventTime || 0)) / 1000);
      if (remaining > 0) {
        eventEl.innerHTML = '⏳ ' + (isZh ? '下次事件' : 'Next Event') + ': ' + Math.floor(remaining) + 's';
        eventEl.style.color = '#666';
      } else {
        eventEl.innerHTML = '⚡ ' + (isZh ? '事件就绪' : 'Event Ready');
        eventEl.style.color = '#7bed9f';
      }
    }
  }

  // ----- Promotion -----
  if (p.stars >= 5) {
    const ready = document.getElementById('promotion-ready');
    const notReady = document.getElementById('promotion-not-ready');
    if (ready) ready.style.display = 'block';
    if (notReady) notReady.style.display = 'none';
    updateElement('attempts', p.promotionAttempts);
    updateElement('successes', p.promotionSuccess);
    updatePromoteButtons();
  } else {
    const ready = document.getElementById('promotion-ready');
    const notReady = document.getElementById('promotion-not-ready');
    if (ready) ready.style.display = 'none';
    if (notReady) notReady.style.display = 'block';
    updateElement('stars-progress', p.stars);
  }

  // ----- Labels -----
  updateLabels();

  // ----- Save Info -----
  const info = document.getElementById('save-info');
  if (info) {
    const hasSave = localStorage.getItem('commander_save') ? true : false;
    info.textContent = hasSave ? '📁 ' + (langCurrent === 'zh' ? '存档已加载' : 'Save Loaded') : '📁 ' + (langCurrent === 'zh' ? '新游戏' : 'New Game');
  }

  // 自动刷新弹窗
  if (hasUIDataChanged()) {
    if (typeof refreshCurrentView === 'function') {
      refreshCurrentView();
    }
  }
}

function updateElement(id, content, styleValue, styleProp) {
  const el = document.getElementById(id);
  if (!el) return;
  if (content !== undefined && content !== null) {
    el.textContent = content;
  }
  if (styleProp && styleValue !== undefined) {
    el.style[styleProp] = styleValue;
  }
}

// ---------- Boss UI（含普通领取 + 双倍领取按钮） ----------
function updateBossUI() {
  const p = player;
  const bossStatus = document.getElementById('boss-status');

  if (p.bossActive) {
    if (bossStatus) {
      bossStatus.textContent = '⚔️ ' + (langCurrent === 'zh' ? '交战中' : 'Engaging');
      bossStatus.className = 'badge badge-danger';
    }
    document.getElementById('boss-active-area').style.display = 'block';
    document.getElementById('boss-cooldown-area').style.display = 'none';
    updateElement('boss-name', getBossName(p.rankId, langCurrent));
    updateElement('boss-hp', Math.max(0, p.bossHealth));
    updateElement('boss-maxhp', p.bossMaxHealth);
    const hpPercent = Math.max(0, (p.bossHealth / p.bossMaxHealth) * 100);
    updateElement('boss-bar', null, hpPercent + '%', 'width');
  } else {
    if (bossStatus) {
      bossStatus.textContent = '⏳ ' + (langCurrent === 'zh' ? '冷却中' : 'Cooldown');
      bossStatus.className = 'badge badge-warning';
    }
    document.getElementById('boss-active-area').style.display = 'none';
    document.getElementById('boss-cooldown-area').style.display = 'block';
    const techMods = getTechModifiers();
    const equipMods = getEquipmentModifiers();
    const radarReduction = Math.min(0.5, techMods.radarReduction + techMods.allBonus * 0.5 + equipMods.allBonus * 0.3);
    const bossInterval = Math.max(60, CONFIG.BOSS.interval * (1 - radarReduction));
    const remaining = Math.max(0, bossInterval - p.bossTimer);
    updateElement('boss-timer', Math.floor(remaining));
    updateElement('boss-minutes', Math.floor(remaining / 60));
  }

  // ★★★ Boss 奖励区域（含普通领取 + 双倍领取按钮） ★★★
  const rewardEl = document.getElementById('boss-reward');
  if (rewardEl) {
    if (lastBossReward) {
      rewardEl.style.display = 'block';
      updateElement('boss-gold', formatNumber(lastBossReward.gold));
      updateElement('boss-exp', formatNumber(lastBossReward.exp));

      // 确保两个按钮都存在
      let claimBtn = document.getElementById('boss-claim-btn');
      let doubleBtn = document.getElementById('boss-double-btn');

      // 如果按钮不存在，重建 HTML
      if (!claimBtn || !doubleBtn) {
        const isZh = langCurrent === 'zh';
        rewardEl.innerHTML = `
          🎁 +<span id="boss-gold">${formatNumber(lastBossReward.gold)}</span>💰 +<span id="boss-exp">${formatNumber(lastBossReward.exp)}</span>EXP
          <button class="btn btn-ghost btn-sm" id="boss-claim-btn" onclick="claimBossReward();">${isZh ? '领取' : 'Claim'}</button>
          <button class="btn btn-gold btn-sm" id="boss-double-btn" onclick="claimBossRewardWithAd();">📺 ${isZh ? '双倍领取' : 'Double Claim'}</button>
        `;
      } else {
        // 更新已有按钮的文字
        const isZh = langCurrent === 'zh';
        claimBtn.textContent = isZh ? '领取' : 'Claim';
        doubleBtn.textContent = '📺 ' + (isZh ? '双倍领取' : 'Double Claim');
      }
    } else {
      rewardEl.style.display = 'none';
    }
  }
}

// ---------- 晋升按钮 ----------
function updatePromoteButtons() {
  const p = player;
  const goldCost = getPromoteGoldCost(p.rankId);
  const expCost = getPromoteExpCost(p.rankId);

  const normalBtn = document.getElementById('btn-normal-promote');
  if (normalBtn) {
    const costEl = document.getElementById('normal-cost');
    if (costEl) costEl.textContent = 'Cost: ' + formatNumber(expCost) + ' EXP';
    if (p.exp < expCost) {
      normalBtn.disabled = true;
      normalBtn.classList.add('promo-disabled');
    } else {
      normalBtn.disabled = false;
      normalBtn.classList.remove('promo-disabled');
    }
  }

  const goldBtn = document.getElementById('btn-gold-promote');
  if (goldBtn) {
    const costEl = document.getElementById('gold-cost');
    if (costEl) costEl.textContent = 'Cost: ' + formatNumber(goldCost) + ' 💰';
    if (p.gold < goldCost) {
      goldBtn.disabled = true;
      goldBtn.classList.add('promo-disabled');
    } else {
      goldBtn.disabled = false;
      goldBtn.classList.remove('promo-disabled');
    }
  }

  const adBtn = document.getElementById('btn-ad-promote');
  if (adBtn) {
    adBtn.disabled = false;
    adBtn.classList.remove('promo-disabled');
  }
}

// ---------- 标签更新 ----------
function updateLabels() {
  const isZh = langCurrent === 'zh';

  const labelMap = {
    'exp-label': 'exp',
    'stars-label': 'stars',
    'auto-label': 'autoFight',
    'kill-label': 'kill',
    'boss-label': 'boss',
    'boss-next-label': 'boss',
    'offline-label': 'offlineEarning',
    'promo-label': 'promotion',
    'stars-full': 'starsFull',
    'promo-need': 'promotion',
    'buff-label': 'doubleReward',
    'attempts-label': 'attempts',
    'success-label': 'success',
    'btn-save': 'save',
    'btn-load': 'load'
  };

  for (const [id, key] of Object.entries(labelMap)) {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'boss-next-label') {
        el.textContent = (isZh ? '下次' : 'Next') + ' ' + t('boss');
      } else if (id === 'promo-need') {
        el.textContent = isZh ? '集满 5 颗战星即可晋升' : 'Earn 5 Battle Stars to promote';
      } else if (id === 'attempts-label') {
        el.textContent = isZh ? '尝试次数' : 'Attempts';
      } else if (id === 'success-label') {
        el.textContent = isZh ? '成功次数' : 'Success';
      } else if (id === 'stars-label') {
        el.textContent = isZh ? '战星' : 'Battle Stars';
      } else if (id === 'auto-label') {
        el.textContent = '⚔️ ' + t('battlefield');
      } else if (id === 'boss-label') {
        el.textContent = '👹 ' + t('enemyCommander');
      } else if (id === 'promo-label') {
        el.textContent = '⭐ ' + t('promotionTrial');
      } else if (id === 'stars-full') {
        el.textContent = '✅ ★★★★★ ' + t('starsFull');
      } else {
        el.textContent = t(key);
      }
    }
  }

  // 晋升按钮
  const normalBtn = document.getElementById('btn-normal-promote');
  if (normalBtn) {
    const nameEl = normalBtn.querySelector('.promo-name');
    if (nameEl) nameEl.textContent = t('promoteNormal');
    const rateEl = normalBtn.querySelector('.promo-rate');
    if (rateEl) rateEl.textContent = '50%';
    const penaltyEl = normalBtn.querySelector('.promo-penalty');
    if (penaltyEl) penaltyEl.textContent = t('failPenalty');
  }

  const goldBtn = document.getElementById('btn-gold-promote');
  if (goldBtn) {
    const nameEl = goldBtn.querySelector('.promo-name');
    if (nameEl) nameEl.textContent = t('promoteGold');
    const rateEl = goldBtn.querySelector('.promo-rate');
    if (rateEl) rateEl.textContent = '70%';
    const penaltyEl = goldBtn.querySelector('.promo-penalty');
    if (penaltyEl) penaltyEl.textContent = t('goldLost');
  }

  const adBtn = document.getElementById('btn-ad-promote');
  if (adBtn) {
    const nameEl = adBtn.querySelector('.promo-name');
    if (nameEl) nameEl.textContent = t('promoteAd');
    const rateEl = adBtn.querySelector('.promo-rate');
    if (rateEl) rateEl.textContent = '100%';
    const penaltyEl = adBtn.querySelector('.promo-penalty');
    if (penaltyEl) penaltyEl.textContent = t('guaranteed');
    const costEl = adBtn.querySelector('.promo-cost');
    if (costEl) costEl.textContent = '📺 ' + t('watchAd');
  }

  // 离线按钮
  const claimBtn = document.getElementById('offline-claim-btn');
  if (claimBtn) claimBtn.textContent = t('claim');
  const doubleBtn = document.getElementById('offline-double-btn');
  if (doubleBtn) doubleBtn.innerHTML = '📺 ' + t('doubleReward');

  // ★★★ Boss 按钮文字（由 updateBossUI 动态更新） ★★★

  const btnMap = {
    'btn-rank': 'rank',
    'btn-building': 'building',
    'btn-fleet': 'fleet',
    'btn-tech': 'tech',
    'btn-soldier': 'soldier',
    'btn-equip': 'equipment',
    'btn-daily': 'dailyQuests',
    'btn-achievement': 'achievements',
    'btn-login': 'loginCheckIn'
  };
  for (const [id, key] of Object.entries(btnMap)) {
    const el = document.getElementById(id);
    if (el) {
      const icon = el.textContent.charAt(0);
      if (id === 'btn-building') {
        el.innerHTML = '🏗️ ' + t('building');
      } else if (id === 'btn-equip') {
        el.innerHTML = '🗡️ ' + t('equipment');
      } else if (id === 'btn-achievement') {
        el.innerHTML = '🏆 ' + t('achievements');
      } else if (id === 'btn-login') {
        el.innerHTML = '📅 ' + t('loginCheckIn');
      } else {
        el.innerHTML = icon + ' ' + t(key);
      }
    }
  }

  const saveBtn = document.getElementById('btn-save');
  if (saveBtn) saveBtn.innerHTML = '💾 ' + t('save');
  const loadBtn = document.getElementById('btn-load');
  if (loadBtn) loadBtn.innerHTML = '📂 ' + t('load');

  const langBtn = document.getElementById('btn-lang');
  if (langBtn) langBtn.textContent = isZh ? '🌐 English' : '🌐 中文';
}

function getStarsDisplay(stars) {
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

function updateStartScreenLang() {
  const isZh = langCurrent === 'zh';
  const startBtn = document.querySelector('#gs-container .btn-start');
  if (startBtn) startBtn.textContent = isZh ? '开始指挥' : 'Begin Command';
  const zhBtn = document.getElementById('lang-zh-btn');
  const enBtn = document.getElementById('lang-en-btn');
  if (zhBtn) zhBtn.textContent = isZh ? '中文' : 'Chinese';
  if (enBtn) enBtn.textContent = isZh ? 'English' : 'English';
  const info = document.getElementById('save-info');
  if (info) {
    const hasSave = localStorage.getItem('commander_save') ? true : false;
    info.textContent = hasSave ? '📁 ' + (isZh ? '存档已加载' : 'Save Loaded') : '📁 ' + (isZh ? '新游戏' : 'New Game');
  }
}