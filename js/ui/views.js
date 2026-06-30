// ============================================================
// views.js — View Navigation (Part 8)
// ============================================================

// ---------- Rank View ----------
function showRankViewFull() {
  const isZh = langCurrent === 'zh';
  let html = '<div class="glass-card"><h2 style="color:#f5d742;">' + t('rank') + '</h2>';
  html += '<div style="max-height:400px; overflow-y:auto;">';

  RANK_DATA.forEach(function(r) {
    const isCurrent = player && player.rankId === r.id;
    const isUnlocked = player && player.rankId >= r.id;
    const name = isZh ? r.rankZh : r.rankEn;
    const boss = isZh ? r.bossZh : r.bossEn;
    html += `<div style="padding:6px 10px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; ${isCurrent ? 'color:#f5d742; font-weight:bold;' : isUnlocked ? 'color:#aaa;' : 'color:#444;'}">`;
    html += `<span>${isCurrent ? '▶ ' : ''}${name}</span>`;
    html += `<span style="font-size:0.7em; color:#666;">👹 ${boss}</span>`;
    html += `</div>`;
  });

  html += '</div>';
  html += `<button class="btn btn-ghost" style="margin-top:12px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('rank'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Building View ----------
function showBuildingViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const buildingTypes = ['goldMine', 'ironMine', 'riceFarm', 'barracks', 'hospital'];
  const displayNames = {
    goldMine: t('goldMine'),
    ironMine: t('ironMine'),
    riceFarm: t('riceFarm'),
    barracks: t('barracks'),
    hospital: t('hospital')
  };
  const icons = {
    goldMine: '💰',
    ironMine: '⛏️',
    riceFarm: '🌾',
    barracks: '🏛️',
    hospital: '🏥'
  };

  const maxLevel = getMaxBuildingLevel();

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">🏗️ ${t('building')}</h2>`;
  html += `<div style="margin-bottom:8px; color:#888; font-size:0.85em;">${isZh ? '当前最大等级（受军阶限制）' : 'Max level (limited by rank)'}: ${maxLevel}</div>`;
  html += `<div style="max-height:500px; overflow-y:auto;">`;

  buildingTypes.forEach(function(type) {
    const level = getBuildingLevel(type);
    const maxForType = maxLevel;
    const cost = getBuildingUpgradeCost(type);
    const canAfford = player.gold >= cost;
    const isMaxed = level >= maxForType;
    const yieldVal = getBuildingYield(type);
    const name = displayNames[type] || type;
    const icon = icons[type] || '🔧';

    html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.05);">`;
    html += `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">`;
    html += `<span style="font-weight:600;">${icon} ${name}</span>`;
    html += `<span>${isZh ? '等级' : 'Lv'}. ${level} / ${maxForType}</span>`;
    html += `</div>`;

    if (type !== 'barracks' && type !== 'hospital') {
      html += `<div style="font-size:0.85em; color:#aaa;">${isZh ? '产出' : 'Yield'}: ${formatNumber(yieldVal)}/s</div>`;
    } else {
      html += `<div style="font-size:0.85em; color:#666;">${type === 'barracks' ? (isZh ? '训练士兵' : 'Trains soldiers') : (isZh ? '治疗伤兵' : 'Heals wounded')}</div>`;
    }

    if (!isMaxed) {
      html += `<div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">`;
      html += `<button class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'}" onclick="upgradeBuilding('${type}', false);" ${!canAfford ? 'disabled' : ''}>`;
      html += `⬆ ${isZh ? '升级' : 'Upgrade'} (${formatNumber(cost)}💰)`;
      html += `</button>`;
      html += `<button class="btn btn-ghost" onclick="upgradeBuilding('${type}', true);">📺 ${isZh ? '广告加速' : 'Ad Boost'}</button>`;
      html += `</div>`;
    } else {
      html += `<div style="color:#7bed9f; font-size:0.85em;">✅ ${isZh ? '已达最大等级' : 'Max level reached'}</div>`;
    }

    html += `</div>`;
  });

  html += '</div>';
  html += `<button class="btn btn-ghost" style="margin-top:12px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('building'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Soldier View ----------
function showSoldierViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const stats = getSoldierStats();

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">🪖 ${t('soldier')}</h2>`;

  html += `<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0;">`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; text-align:center;"><div style="color:#888; font-size:0.75em;">${isZh ? '总兵力' : 'Total'}</div><div style="color:#f5d742; font-size:1.3em; font-weight:700;">${stats.total}</div></div>`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; text-align:center;"><div style="color:#888; font-size:0.75em;">${isZh ? '活跃' : 'Active'}</div><div style="color:#7bed9f; font-size:1.3em; font-weight:700;">${stats.active}</div></div>`;
  html += `<div style="background:rgba(255,200,0,0.05); border-radius:8px; padding:10px; text-align:center;"><div style="color:#888; font-size:0.75em;">${isZh ? '伤兵' : 'Wounded'}</div><div style="color:#ff6b6b; font-size:1.3em; font-weight:700;">${stats.wounded}</div></div>`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; text-align:center;"><div style="color:#888; font-size:0.75em;">${isZh ? '最大兵力' : 'Max'}</div><div style="color:#4a9eff; font-size:1.3em; font-weight:700;">${stats.max}</div></div>`;
  html += `</div>`;

  html += `<div style="text-align:center; color:#888; font-size:0.85em; margin-bottom:12px;">🌾 ${isZh ? '稻米消耗' : 'Rice Consumption'}: ${stats.consumption.toFixed(2)}/s</div>`;

  const trainCost = getTrainCost();
  const canTrain = player.soldiers < stats.max;
  const canAffordTrain = player.gold >= trainCost.gold && player.rice >= trainCost.rice;

  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:12px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.05);">`;
  html += `<div style="font-weight:600; color:#7bed9f; margin-bottom:6px;">⚔️ ${t('trainSoldier')}</div>`;
  html += `<div style="font-size:0.85em; color:#aaa;">${t('trainCost')}: ${formatNumber(trainCost.gold)}💰 + ${formatNumber(trainCost.rice)}🌾</div>`;
  html += `<div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">`;
  html += `<button class="btn ${canTrain && canAffordTrain ? 'btn-gold' : 'btn-disabled'}" onclick="trainSoldier(false);" ${!canTrain || !canAffordTrain ? 'disabled' : ''}>`;
  html += `⬆ ${t('train')}`;
  html += `</button>`;
  html += `<button class="btn btn-ghost" onclick="trainSoldier(true);">📺 ${isZh ? '广告加速' : 'Ad Boost'}</button>`;
  html += `</div>`;
  if (!canTrain) {
    html += `<div style="color:#ff6b6b; font-size:0.8em; margin-top:4px;">⚠️ ${t('maxSoldiersReached')}</div>`;
  }
  html += `</div>`;

  const healCost = getHealCost();
  const canHeal = stats.wounded > 0;
  const canAffordHeal = player.gold >= healCost.gold && player.rice >= healCost.rice;

  html += `<div style="background:rgba(255,200,0,0.05); border-radius:8px; padding:12px; border:1px solid rgba(255,200,0,0.1);">`;
  html += `<div style="font-weight:600; color:#ffd93d; margin-bottom:6px;">🏥 ${t('treatWounded')}</div>`;
  html += `<div style="font-size:0.85em; color:#aaa;">${t('healCost')}: ${formatNumber(healCost.gold)}💰 + ${formatNumber(healCost.rice)}🌾</div>`;
  html += `<div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">`;
  html += `<button class="btn ${canHeal && canAffordHeal ? 'btn-gold' : 'btn-disabled'}" onclick="healWounded(false);" ${!canHeal || !canAffordHeal ? 'disabled' : ''}>`;
  html += `🩹 ${t('treat')}`;
  html += `</button>`;
  html += `<button class="btn btn-ghost" onclick="healWounded(true);">📺 ${isZh ? '广告加速' : 'Ad Boost'}</button>`;
  html += `</div>`;
  if (!canHeal) {
    html += `<div style="color:#7bed9f; font-size:0.8em; margin-top:4px;">✅ ${t('noWounded')}</div>`;
  }
  html += `</div>`;

  html += `<button class="btn btn-ghost" style="margin-top:16px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('soldier'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Fleet View ----------
function showFleetViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const fleetStats = getFleetStats();

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">🚢 ${t('fleet')}</h2>`;

  html += `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin:12px 0;">`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:8px; text-align:center;"><div style="color:#888; font-size:0.7em;">${isZh ? '已解锁' : 'Unlocked'}</div><div style="color:#7bed9f; font-size:1.2em; font-weight:700;">${fleetStats.unlocked}/${fleetStats.totalShips}</div></div>`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:8px; text-align:center;"><div style="color:#888; font-size:0.7em;">${isZh ? '总等级' : 'Total Level'}</div><div style="color:#f5d742; font-size:1.2em; font-weight:700;">${fleetStats.totalLevels}</div></div>`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:8px; text-align:center;"><div style="color:#888; font-size:0.7em;">${t('fleetCp')}</div><div style="color:#ff6b6b; font-size:1.2em; font-weight:700;">${fleetStats.totalCP}</div></div>`;
  html += `</div>`;

  html += `<div style="max-height:500px; overflow-y:auto;">`;

  fleetStats.ships.forEach(function(ship) {
    const isUnlocked = ship.isUnlocked;
    const level = ship.level;
    const maxLevel = ship.maxLevel;
    const isMaxed = ship.isMaxed;
    const name = isZh ? ship.nameZh : ship.nameEn;
    const unlockRank = ship.unlockRank;

    html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; margin-bottom:8px; border:1px solid ${isUnlocked ? (isMaxed ? 'rgba(123,237,159,0.2)' : 'rgba(255,255,255,0.05)') : 'rgba(255,0,0,0.1)'};">`;
    html += `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">`;
    html += `<span style="font-weight:600; ${isUnlocked ? 'color:#d0d5dd;' : 'color:#666;'}">${isUnlocked ? '' : '🔒 '}${name}</span>`;
    html += `<span style="font-size:0.85em; color:#888;">${t('fleetLevel')}: ${level}/${maxLevel}</span>`;
    html += `</div>`;

    if (isUnlocked) {
      if (!isMaxed) {
        const cost = getShipUpgradeCost(ship.id);
        if (cost) {
          const canAfford = player.gold >= cost.gold && player.iron >= cost.iron;
          html += `<div style="font-size:0.8em; color:#aaa; margin-top:4px;">⬆ ${formatNumber(cost.gold)}💰 + ${formatNumber(cost.iron)}⛏️</div>`;
          html += `<div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">`;
          html += `<button class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'}" onclick="upgradeShip(${ship.id}, false);" ${!canAfford ? 'disabled' : ''}>`;
          html += `⬆ ${t('fleetUpgrade')}`;
          html += `</button>`;
          html += `<button class="btn btn-ghost" onclick="upgradeShip(${ship.id}, true);">📺 ${isZh ? '广告加速' : 'Ad Boost'}</button>`;
          html += `</div>`;
        }
      } else {
        html += `<div style="color:#7bed9f; font-size:0.85em; margin-top:4px;">✅ ${t('fleetMaxLevel')}</div>`;
      }
    } else {
      html += `<div style="color:#666; font-size:0.8em; margin-top:4px;">🔒 ${isZh ? '军阶' : 'Rank'} ${unlockRank} ${isZh ? '解锁' : 'required'}</div>`;
    }

    html += `</div>`;
  });

  html += '</div>';
  html += `<button class="btn btn-ghost" style="margin-top:12px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('fleet'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Tech View ----------
function showTechViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const techStats = getTechStats();

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">🔬 ${t('tech')}</h2>`;

  html += `<div style="text-align:center; color:#f5d742; font-size:1.1em; margin-bottom:12px;">`;
  html += `⚡ ${t('techPoint')}: <span style="color:#ffd700; font-weight:700;">${techStats.totalTechPoints || 0}</span>`;
  html += ` | 📊 ${isZh ? '总等级' : 'Total'}: ${techStats.totalLevels}`;
  html += `</div>`;

  html += `<div style="max-height:500px; overflow-y:auto;">`;

  techStats.lines.forEach(function(line) {
    const isUnlocked = line.isUnlocked;
    const level = line.level;
    const maxLevel = line.maxLevel;
    const isMaxed = line.isMaxed;
    const name = isZh ? line.nameZh : line.nameEn;
    const unlockRank = line.unlockRank;
    const effectDisplay = line.effectDisplay;

    html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; margin-bottom:8px; border:1px solid ${isUnlocked ? (isMaxed ? 'rgba(123,237,159,0.2)' : 'rgba(255,255,255,0.05)') : 'rgba(255,0,0,0.1)'};">`;
    html += `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">`;
    html += `<span style="font-weight:600; ${isUnlocked ? 'color:#d0d5dd;' : 'color:#666;'}">${isUnlocked ? '' : '🔒 '}${name}</span>`;
    html += `<span style="font-size:0.85em; color:#888;">Lv. ${level}/${maxLevel}</span>`;
    html += `</div>`;

    if (isUnlocked) {
      html += `<div style="font-size:0.8em; color:#7bed9f; margin-top:2px;">${effectDisplay}</div>`;

      if (!isMaxed) {
        const cost = getTechUpgradeCost(line.id);
        if (cost) {
          const canAfford = player.gold >= cost.gold && (player.techPoints || 0) >= cost.techPoint;
          html += `<div style="font-size:0.8em; color:#aaa; margin-top:4px;">⬆ ${formatNumber(cost.gold)}💰 + ${cost.techPoint}⚡</div>`;
          html += `<div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">`;
          html += `<button class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'}" onclick="upgradeTech('${line.id}', false);" ${!canAfford ? 'disabled' : ''}>`;
          html += `⬆ ${t('techUpgrade')}`;
          html += `</button>`;
          html += `<button class="btn btn-ghost" onclick="upgradeTech('${line.id}', true);">📺 ${isZh ? '广告加速' : 'Ad Boost'}</button>`;
          html += `</div>`;
        }
      } else {
        html += `<div style="color:#7bed9f; font-size:0.85em; margin-top:4px;">✅ ${t('techMaxLevel')}</div>`;
      }
    } else {
      html += `<div style="color:#666; font-size:0.8em; margin-top:4px;">🔒 ${isZh ? '军阶' : 'Rank'} ${unlockRank} ${isZh ? '解锁' : 'required'}</div>`;
    }

    html += `</div>`;
  });

  html += '</div>';
  html += `<button class="btn btn-ghost" style="margin-top:12px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('tech'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Equipment View ----------
function showEquipmentViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const equipStats = getEquipmentStats();

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">🗡️ ${t('equipment')}</h2>`;

  html += `<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0;">`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:8px; text-align:center;"><div style="color:#888; font-size:0.7em;">${isZh ? '总等级' : 'Total Level'}</div><div style="color:#f5d742; font-size:1.2em; font-weight:700;">${equipStats.totalLevels}</div></div>`;
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:8px; text-align:center;"><div style="color:#888; font-size:0.7em;">${t('equipCp')}</div><div style="color:#ff6b6b; font-size:1.2em; font-weight:700;">+${equipStats.totalCP}</div></div>`;
  html += `</div>`;

  html += `<div style="max-height:500px; overflow-y:auto;">`;

  equipStats.types.forEach(function(type) {
    const isUnlocked = type.isUnlocked;
    const level = type.level;
    const maxLevel = type.maxLevel;
    const isMaxed = type.isMaxed;
    const name = isZh ? type.nameZh : type.nameEn;
    const icon = type.icon || '🔧';
    const unlockRank = type.unlockRank;
    const effectDisplay = type.effectDisplay;
    const currentNameObj = isZh ? type.currentNameZh : type.currentNameEn;
    const currentName = level > 0 ? currentNameObj : (isZh ? '无' : 'None');

    html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; margin-bottom:8px; border:1px solid ${isUnlocked ? (isMaxed ? 'rgba(123,237,159,0.2)' : 'rgba(255,255,255,0.05)') : 'rgba(255,0,0,0.1)'};">`;
    html += `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">`;
    html += `<span style="font-weight:600; ${isUnlocked ? 'color:#d0d5dd;' : 'color:#666;'}">${icon} ${isUnlocked ? '' : '🔒 '}${name}</span>`;
    html += `<span style="font-size:0.85em; color:#888;">${t('level')}: ${level}/${maxLevel}</span>`;
    html += `</div>`;

    html += `<div style="font-size:0.8em; color:#aaa; margin-top:2px;">${isZh ? '当前' : 'Current'}: ${currentName}</div>`;

    if (isUnlocked) {
      if (level > 0) {
        html += `<div style="font-size:0.8em; color:#7bed9f; margin-top:2px;">${effectDisplay}</div>`;
      }

      if (!isMaxed) {
        const cost = getEquipmentUpgradeCost(type.id);
        if (cost) {
          const canAfford = player.gold >= cost.gold && player.iron >= cost.iron;
          const nextNameObj = CONFIG.EQUIPMENT.names[type.id];
          const nextName = nextNameObj && nextNameObj[Math.min(level, nextNameObj.length - 1)];
          const nextNameDisplay = isZh ? (nextName ? nextName.nameZh : '???') : (nextName ? nextName.nameEn : '???');

          html += `<div style="font-size:0.8em; color:#888; margin-top:4px;">⬆ ${formatNumber(cost.gold)}💰 + ${formatNumber(cost.iron)}⛏️ → ${nextNameDisplay}</div>`;
          html += `<div style="display:flex; gap:6px; margin-top:6px; flex-wrap:wrap;">`;
          html += `<button class="btn ${canAfford ? 'btn-gold' : 'btn-disabled'}" onclick="upgradeEquipment('${type.id}', false);" ${!canAfford ? 'disabled' : ''}>`;
          html += `⬆ ${t('equipUpgrade')}`;
          html += `</button>`;
          html += `<button class="btn btn-ghost" onclick="upgradeEquipment('${type.id}', true);">📺 ${isZh ? '广告加速' : 'Ad Boost'}</button>`;
          html += `</div>`;
        }
      } else {
        html += `<div style="color:#7bed9f; font-size:0.85em; margin-top:4px;">✅ ${t('equipMaxLevel')}</div>`;
      }
    } else {
      html += `<div style="color:#666; font-size:0.8em; margin-top:4px;">🔒 ${isZh ? '军阶' : 'Rank'} ${unlockRank} ${isZh ? '解锁' : 'required'}</div>`;
    }

    html += `</div>`;
  });

  html += '</div>';
  html += `<button class="btn btn-ghost" style="margin-top:12px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('equipment'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Daily Quest View ----------
function showDailyViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const dailyStats = getDailyStats();

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">📋 ${t('dailyQuests')}</h2>`;

  html += `<div style="text-align:center; color:#888; font-size:0.9em; margin-bottom:12px;">`;
  html += `${isZh ? '已完成' : 'Completed'}: ${dailyStats.completed}/${dailyStats.total}`;
  if (dailyStats.allCompleted) html += ' ✅ ' + (isZh ? '全部完成！' : 'All done!');
  html += `</div>`;

  html += `<div style="max-height:500px; overflow-y:auto;">`;

  dailyStats.tasks.forEach(function(task) {
    const progressPercent = Math.min(100, (task.progress / task.target) * 100);
    const isComplete = task.isComplete;
    const claimed = task.claimed;
    const statusText = claimed ? '✅ ' + (isZh ? '已领取' : 'Claimed') :
                        isComplete ? '📥 ' + (isZh ? '可领取' : 'Ready') :
                        (isZh ? '⏳ 进行中' : '⏳ In Progress');

    let rewardText = '';
    if (task.goldReward > 0) rewardText += formatNumber(task.goldReward) + '💰 ';
    if (task.expReward > 0) rewardText += formatNumber(task.expReward) + 'EXP ';
    if (task.ironReward > 0) rewardText += formatNumber(task.ironReward) + '⛏️ ';
    if (task.riceReward > 0) rewardText += formatNumber(task.riceReward) + '🌾 ';
    if (task.techReward > 0) rewardText += task.techReward + '⚡ ';

    html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; margin-bottom:8px; border:1px solid ${isComplete ? 'rgba(123,237,159,0.2)' : 'rgba(255,255,255,0.05)'};">`;
    html += `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">`;
    html += `<span style="font-weight:600;">${task.icon} ${isZh ? task.nameZh : task.nameEn}</span>`;
    html += `<span style="font-size:0.85em; color:${isComplete ? '#7bed9f' : '#888'};">${statusText}</span>`;
    html += `</div>`;

    html += `<div style="font-size:0.85em; color:#aaa; margin-top:4px;">${task.progress}/${task.target}`;
    if (rewardText) html += ` | ${isZh ? '奖励' : 'Reward'}: ${rewardText}`;
    html += `</div>`;

    html += `<div class="progress-bar" style="margin-top:4px;"><div class="progress-fill" style="width:${progressPercent}%;"></div></div>`;

    if (isComplete && !claimed) {
      html += `<button class="btn btn-gold" style="margin-top:6px;" onclick="claimDailyReward('${task.id}');">📥 ${t('dailyClaim')}</button>`;
    }

    html += `</div>`;
  });

  html += '</div>';
  html += `<button class="btn btn-ghost" style="margin-top:12px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('dailyQuests'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Achievement View ----------
function showAchievementViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const achStats = getAchievementStats();

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">🏆 ${t('achievements')}</h2>`;

  html += `<div style="text-align:center; color:#888; font-size:0.9em; margin-bottom:12px;">`;
  html += `${isZh ? '已解锁' : 'Unlocked'}: ${achStats.unlocked}/${achStats.total} (${achStats.progress}%)`;
  html += `</div>`;

  html += `<div style="max-height:500px; overflow-y:auto;">`;

  achStats.achievements.forEach(function(ach) {
    const isUnlocked = ach.isUnlocked;
    const progressPercent = Math.min(100, ach.progressPercent);

    html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; margin-bottom:8px; border:1px solid ${isUnlocked ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)'};">`;
    html += `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">`;
    html += `<span style="font-weight:600; ${isUnlocked ? 'color:#f5d742;' : 'color:#aaa;'}">${ach.icon} ${isZh ? ach.nameZh : ach.nameEn}</span>`;
    html += `<span style="font-size:0.85em; color:${isUnlocked ? '#f5d742' : '#666'};">${isUnlocked ? '✅ ' + (isZh ? '已解锁' : 'Unlocked') : '🔒 ' + (isZh ? '未解锁' : 'Locked')}</span>`;
    html += `</div>`;

    html += `<div style="font-size:0.8em; color:#888; margin-top:2px;">${isZh ? ach.descZh : ach.descEn}</div>`;

    if (!isUnlocked) {
      html += `<div style="font-size:0.85em; color:#aaa; margin-top:4px;">${isZh ? '进度' : 'Progress'}: ${formatNumber(ach.progress)}/${formatNumber(ach.target)}</div>`;
      html += `<div class="progress-bar" style="margin-top:4px;"><div class="progress-fill gold" style="width:${progressPercent}%;"></div></div>`;
    } else {
      let rewardText = '';
      if (ach.rewardGold > 0) rewardText += formatNumber(ach.rewardGold) + '💰 ';
      if (ach.rewardExp > 0) rewardText += formatNumber(ach.rewardExp) + 'EXP ';
      if (ach.rewardTech > 0) rewardText += ach.rewardTech + '⚡ ';
      html += `<div style="font-size:0.8em; color:#7bed9f; margin-top:4px;">${isZh ? '已领取奖励' : 'Reward claimed'}: ${rewardText || (isZh ? '无' : 'None')}</div>`;
    }

    html += `</div>`;
  });

  html += '</div>';
  html += `<button class="btn btn-ghost" style="margin-top:12px;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('achievements'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- Alias functions ----------
function showRankView() { showRankViewFull(); }
function showBuildingView() { showBuildingViewFull(); }
function showSoldierView() { showSoldierViewFull(); }
function showFleetView() { showFleetViewFull(); }
function showTechView() { showTechViewFull(); }
function showEquipmentView() { showEquipmentViewFull(); }
function showDailyView() { showDailyViewFull(); }
function showAchievementView() { showAchievementViewFull(); }