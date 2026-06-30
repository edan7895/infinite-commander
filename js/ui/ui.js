// ============================================================
// ui.js — UI Rendering Engine (Part 8)
// ============================================================

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

  // ----- Auto Fight -----
  const autoStatus = document.getElementById('auto-status');
  const autoBtn = document.getElementById('auto-btn');
  if (p.autoFight) {
    if (autoStatus) {
      autoStatus.textContent = '▶ ' + (langCurrent === 'zh' ? '运行中' : 'Running');
      autoStatus.className = 'badge badge-success';
    }
    if (autoBtn) autoBtn.textContent = langCurrent === 'zh' ? '暂停' : 'Pause';
  } else {
    if (autoStatus) {
      autoStatus.textContent = '⏸ ' + (langCurrent === 'zh' ? '已暂停' : 'Paused');
      autoStatus.className = 'badge badge-danger';
    }
    if (autoBtn) autoBtn.textContent = langCurrent === 'zh' ? '启动' : 'Start';
  }

  // ----- Bottom -----
  updateElement('auto-bottom', p.autoFight ? 'ON' : 'OFF');
  updateElement('rank-bottom', rankName);
  const hours = Math.floor(p.totalPlayTime / 3600);
  const mins2 = Math.floor((p.totalPlayTime % 3600) / 60);
  updateElement('playtime-bottom', hours + 'h ' + mins2 + 'm');

  // ----- Boss -----
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

  // ----- Building Production Summary -----
  const prod = getTotalBuildingProduction();
  const prodEl = document.getElementById('building-production-summary');
  if (prodEl) {
    prodEl.innerHTML = '🏗️ ' + (langCurrent === 'zh' ? '建筑产出' : 'Building') + ': ' +
      formatNumber(prod.gold) + '💰/s ' +
      formatNumber(prod.iron) + '⛏️/s ' +
      formatNumber(prod.rice) + '🌾/s';
  }

  // ----- Soldier Summary -----
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

  // ----- Fleet Summary -----
  const fleetStats = getFleetStats();
  const fleetEl = document.getElementById('fleet-summary');
  if (fleetEl) {
    const isZh = langCurrent === 'zh';
    fleetEl.innerHTML = '🚢 ' + (isZh ? '舰队' : 'Fleet') + ': ' +
      fleetStats.unlocked + '/' + fleetStats.totalShips + ' ' +
      (isZh ? '已解锁' : 'unlocked') +
      ' | ⚡ ' + fleetStats.totalCP + ' CP';
  }

  // ----- Tech Summary -----
  const techStats = getTechStats();
  const techEl = document.getElementById('tech-summary');
  if (techEl) {
    const isZh = langCurrent === 'zh';
    techEl.innerHTML = '🔬 ' + (isZh ? '科技' : 'Tech') + ': ' +
      techStats.totalLevels + ' ' + (isZh ? '级' : 'levels') +
      ' | ⚡ ' + (techStats.totalTechPoints || 0) + ' ' + (isZh ? '科技点' : 'TP');
  }

  // ----- Equipment Summary -----
  const equipStats = getEquipmentStats();
  const equipEl = document.getElementById('equipment-summary');
  if (equipEl) {
    const isZh = langCurrent === 'zh';
    equipEl.innerHTML = '🗡️ ' + (isZh ? '装备' : 'Gear') + ': ' +
      equipStats.totalLevels + ' ' + (isZh ? '级' : 'levels') +
      ' | ⚡ +' + equipStats.totalCP + ' CP';
  }

  // ----- Daily Quest Summary -----
  const dailyStats = getDailyStats();
  const dailyEl = document.getElementById('daily-summary');
  if (dailyEl) {
    const isZh = langCurrent === 'zh';
    dailyEl.innerHTML = '📋 ' + (isZh ? '每日任务' : 'Daily') + ': ' +
      dailyStats.completed + '/' + dailyStats.total +
      (dailyStats.allCompleted ? ' ✅' : '');
  }

  // ----- Achievement Summary -----
  const achStats = getAchievementStats();
  const achEl = document.getElementById('achievement-summary');
  if (achEl) {
    const isZh = langCurrent === 'zh';
    achEl.innerHTML = '🏆 ' + (isZh ? '成就' : 'Achievements') + ': ' +
      achStats.unlocked + '/' + achStats.total +
      ' (' + achStats.progress + '%)';
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

function updateBossUI() {
  const p = player;
  const bossStatus = document.getElementById('boss-status');
  if (p.bossActive) {
    if (bossStatus) {
      bossStatus.textContent = '⚔️ ' + (langCurrent === 'zh' ? '战斗中' : 'Fighting');
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

  if (lastBossReward) {
    document.getElementById('boss-reward').style.display = 'block';
    updateElement('boss-gold', formatNumber(lastBossReward.gold));
    updateElement('boss-exp', formatNumber(lastBossReward.exp));
  } else {
    document.getElementById('boss-reward').style.display = 'none';
  }
}

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
        el.textContent = t('boss') + (isZh ? ' 下次' : ' Next');
      } else if (id === 'promo-need') {
        el.textContent = isZh ? '集满 5 星解锁晋升' : 'Collect 5 stars to promote';
      } else if (id === 'attempts-label') {
        el.textContent = isZh ? '尝试' : 'Attempts';
      } else if (id === 'success-label') {
        el.textContent = isZh ? '成功' : 'Success';
      } else {
        el.textContent = t(key);
      }
    }
  }

  // Promotion buttons
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

  // Offline buttons
  const claimBtn = document.getElementById('offline-claim-btn');
  if (claimBtn) claimBtn.textContent = t('claim');
  const doubleBtn = document.getElementById('offline-double-btn');
  if (doubleBtn) doubleBtn.innerHTML = '📺 ' + t('doubleReward');

  const bossDouble = document.getElementById('boss-double-btn');
  if (bossDouble) bossDouble.textContent = t('doubleReward');

  const btnMap = {
    'btn-rank': 'rank',
    'btn-building': 'building',
    'btn-fleet': 'fleet',
    'btn-tech': 'tech',
    'btn-soldier': 'soldier',
    'btn-equip': 'equipment',
    'btn-daily': 'dailyQuests',
    'btn-achievement': 'achievements'
  };
  for (const [id, key] of Object.entries(btnMap)) {
    const el = document.getElementById(id);
    if (el) {
      const icon = el.textContent.charAt(0);
      el.innerHTML = icon + ' ' + t(key);
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