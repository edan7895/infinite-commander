// ============================================================
// main.js — Game Entry, Main Loop, View Navigation (Part 8)
// ============================================================

// ---------- View Navigation ----------
function showView(viewId) {
  document.querySelectorAll('.view').forEach(function(v) {
    v.style.display = 'none';
  });
  const target = document.getElementById('view-' + viewId);
  if (target) target.style.display = 'block';
}

// ---------- Start Game ----------
function startGame() {
  if (!player) {
    initPlayer();
    if (typeof protectPlayer === 'function') {
      player = protectPlayer(player);
    }
  }

  loadGame();

  currentStoryIndex = 0;
  showView('story');
  renderStory();

  if (typeof gameLoopInterval === 'undefined' || !gameLoopInterval) {
    gameLoopInterval = setInterval(gameLoop, 1000);
  }
}

// ---------- Story ----------
function renderStory() {
  const container = document.getElementById('story-text');
  if (!container) return;

  const text = getStoryText(currentStoryIndex);
  container.innerHTML = text.replace(/\n/g, '<br>');

  const nextBtn = document.getElementById('story-next-btn');
  const skipBtn = document.getElementById('story-skip-btn');

  if (currentStoryIndex >= getTotalStoryChapters() - 1) {
    nextBtn.textContent = langCurrent === 'zh' ? '开始游戏 ▶' : 'Start Game ▶';
  } else {
    nextBtn.textContent = langCurrent === 'zh' ? '继续 ▶' : 'Continue ▶';
  }
}

function nextStory() {
  if (currentStoryIndex >= getTotalStoryChapters() - 1) {
    showView('main');
    if (typeof updateUI === 'function') updateUI();
    return;
  }
  currentStoryIndex++;
  renderStory();
}

function skipStory() {
  currentStoryIndex = getTotalStoryChapters() - 1;
  renderStory();
}

// ---------- Game Loop ----------
let gameLoopInterval = null;

function gameLoop() {
  if (!player) return;

  applyBuildingProduction();
  applySoldierConsumption();

  if (player.autoFight) {
    doCombat();
  }

  updateBoss();
  checkAutoPromote();
  checkTutorial();

  if (!eventActive) {
    triggerRandomEvent();
  }

  checkDailyReset();
  checkAchievements();

  if (typeof updateUI === 'function') updateUI();
}

// ---------- Combat ----------
function doCombat() {
  const p = player;
  const rank = getCurrentRank();

  let expGain = Math.floor(rank.expBase * 0.02) + 1;
  expGain += Math.floor(p.stars * 0.5);
  expGain += Math.floor(p.rankId * 0.5);

  let goldGain = Math.floor(rank.goldBase * 0.03) + 1;
  goldGain += Math.floor(p.stars * 0.3);

  const techMods = getTechModifiers();
  const aiBonus = 1 + techMods.aiBonus;

  const equipMods = getEquipmentModifiers();
  const efficiencyBonus = 1 + equipMods.efficiencyBonus;
  const allBonus = 1 + equipMods.allBonus;

  const totalMultiplier = aiBonus * efficiencyBonus * allBonus;

  expGain = Math.floor(expGain * totalMultiplier);
  goldGain = Math.floor(goldGain * totalMultiplier);

  if (p.doubleBuff > 0) {
    expGain *= 2;
    goldGain *= 2;
    p.doubleBuff--;
  }

  p.exp += expGain;
  p.gold += goldGain;
  p.totalGold += goldGain;
  p.kills++;
  p.totalKills++;

  updateDailyProgress('kill', 1);
  updateDailyProgress('gold', goldGain);

  applySoldierDeath();
  checkAutoStar();
}

function checkAutoStar() {
  const p = player;
  if (p.stars >= 5) return;

  const needed = getStarRequirement(p.stars);
  if (p.exp >= needed) {
    p.exp -= needed;
    p.stars++;
    p.combatPower = calcCombatPower();
  }
}

function checkAutoPromote() {
  const p = player;
  if (p.stars < 5) return;
}

// ---------- Combat Power ----------
function calcCombatPower() {
  const p = player;
  const rank = getCurrentRank();
  let cp = 10 + rank.id * 5 + p.stars * 3 + p.level * 2;

  const activeSoldiers = (p.soldiers || 0) - (p.wounded || 0);
  cp += activeSoldiers * CONFIG.SOLDIER.combatPowerPerSoldier;

  cp += getFleetCP();

  const techMods = getTechModifiers();
  cp += techMods.cpBonus;

  const equipMods = getEquipmentModifiers();
  cp += equipMods.cpBonus;

  cp += cp * techMods.allBonus * 0.5;

  return Math.floor(cp);
}

// ---------- Toggle Auto Fight ----------
function toggleAutoFight() {
  if (!player) return;
  player.autoFight = !player.autoFight;
  if (typeof updateUI === 'function') updateUI();
}

// ---------- Handle Promote ----------
function handlePromote(type) {
  if (!player) return;

  if (player.stars < 5) {
    alert(t('starsFull'));
    return;
  }

  if (type === 'normal') {
    const cost = getPromoteExpCost(player.rankId);
    if (player.exp < cost) {
      alert('Not enough EXP! Need ' + formatNumber(cost));
      return;
    }
    if (Math.random() < 0.5) {
      player.exp -= cost;
      player.rankId++;
      player.stars = 0;
      player.combatPower = calcCombatPower();
      player.promotionSuccess++;
      alert('✅ ' + t('trialPass'));
    } else {
      player.exp = Math.floor(player.exp * 0.5);
      player.promotionAttempts++;
      alert('❌ ' + t('trialFail') + ' (-50% EXP)');
    }
  } else if (type === 'gold') {
    const cost = getPromoteGoldCost(player.rankId);
    if (player.gold < cost) {
      alert('Not enough Gold! Need ' + formatNumber(cost));
      return;
    }
    if (Math.random() < 0.7) {
      player.gold -= cost;
      player.rankId++;
      player.stars = 0;
      player.combatPower = calcCombatPower();
      player.promotionSuccess++;
      alert('✅ ' + t('trialPass'));
    } else {
      player.gold -= cost;
      player.promotionAttempts++;
      alert('❌ ' + t('trialFail') + ' (Gold lost)');
    }
  } else if (type === 'ad') {
    watchPromoteAd(function() {
      player.rankId++;
      player.stars = 0;
      player.combatPower = calcCombatPower();
      player.promotionSuccess++;
      alert('✅ ' + t('trialPass') + ' (Recommendation)');
      if (typeof updateUI === 'function') updateUI();
    });
  }

  if (typeof updateUI === 'function') updateUI();
}

// ---------- Claim Offline ----------
function claimOffline(mult) {
  if (!player) return;
  const result = applyOfflineEarnings(mult);
  if (result.gold === 0 && result.exp === 0 && result.iron === 0 && result.rice === 0) {
    alert('No offline earnings.');
    return;
  }
  let msg = '📦 Offline Rewards:';
  if (result.gold > 0) msg += ' +' + formatNumber(result.gold) + '💰';
  if (result.exp > 0) msg += ' +' + formatNumber(result.exp) + 'EXP';
  if (result.iron > 0) msg += ' +' + formatNumber(result.iron) + '⛏️';
  if (result.rice > 0) msg += ' +' + formatNumber(result.rice) + '🌾';
  alert(msg);
  if (typeof updateUI === 'function') updateUI();
}

function claimOfflineWithAd() {
  watchOfflineAd(function() {
    claimOffline(2);
  });
}

// ---------- Claim Boss Reward ----------
// ★★★ 注意：不再用 var/let 重复声明，直接赋值给全局 ★★★
lastBossReward = null;

function claimBossRewardWithAd() {
  if (!lastBossReward) {
    alert('No boss reward available.');
    return;
  }
  watchBossAd(function() {
    const reward = lastBossReward;
    const techMods = getTechModifiers();
    const equipMods = getEquipmentModifiers();
    const bossMultiplier = 1 + techMods.bossBonus + equipMods.bossBonus + equipMods.allBonus;
    const goldBonus = Math.floor(reward.gold * bossMultiplier);
    const expBonus = Math.floor(reward.exp * bossMultiplier);
    player.gold += goldBonus * 2;
    player.totalGold += goldBonus * 2;
    player.exp += expBonus * 2;
    lastBossReward = null;
    alert('🎁 Boss Reward x2! +' + formatNumber(goldBonus * 2) + '💰 +' + formatNumber(expBonus * 2) + 'EXP');
    if (typeof updateUI === 'function') updateUI();
  });
}

// ---------- Boss Update ----------
// 覆盖 boss.js 中的 updateBoss 函数
function updateBoss() {
  if (!player) return;

  const p = player;
  const techMods = getTechModifiers();
  const equipMods = getEquipmentModifiers();
  const radarReduction = Math.min(0.5, techMods.radarReduction + techMods.allBonus * 0.5 + equipMods.allBonus * 0.3);
  const bossInterval = Math.max(60, CONFIG.BOSS.interval * (1 - radarReduction));

  p.bossTimer++;

  if (p.bossTimer >= bossInterval && !p.bossActive) {
    p.bossActive = true;
    const rank = getCurrentRank();
    const hpReduction = 1 - (techMods.allBonus * 0.2 + equipMods.allBonus * 0.1);
    p.bossMaxHealth = Math.floor((CONFIG.BOSS.hpBase + rank.id * CONFIG.BOSS.hpPerRank + p.stars * CONFIG.BOSS.hpPerStar) * hpReduction);
    p.bossHealth = p.bossMaxHealth;
    p.bossTimer = 0;

    if (typeof updateUI === 'function') updateUI();
  }

  if (p.bossActive) {
    const damageMultiplier = 1 + techMods.bossBonus + equipMods.bossBonus + equipMods.allBonus;
    let damage = Math.floor((p.combatPower / 2 + 5) * damageMultiplier);
    p.bossHealth -= damage;

    if (p.bossHealth <= 0) {
      p.bossActive = false;
      p.bossDefeated++;
      p.totalBossDefeated++;

      updateDailyProgress('boss', 1);

      const rank = getCurrentRank();
      const rewardMultiplier = 1 + techMods.allBonus + equipMods.allBonus;
      const bossGold = Math.floor((CONFIG.BOSS.goldBase + rank.id * CONFIG.BOSS.goldPerRank + randomBetween(0, 100)) * rewardMultiplier);
      const bossExp = Math.floor((CONFIG.BOSS.expBase + rank.id * CONFIG.BOSS.expPerRank + randomBetween(0, 200)) * rewardMultiplier);

      p.gold += bossGold;
      p.totalGold += bossGold;
      p.exp += bossExp;

      p.combatPower = calcCombatPower();
      lastBossReward = { gold: bossGold, exp: bossExp };

      if (p.daily) {
        p.daily.bossKills = (p.daily.bossKills || 0) + 1;
      }

      if (typeof updateUI === 'function') updateUI();
    }
  }
}

// ---------- View Functions ----------
function showRankView() {
  if (typeof showRankViewFull === 'function') showRankViewFull();
  else showToast('🎖️ ' + t('rank') + ' view coming soon!', 2000);
}

function showBuildingView() {
  if (typeof showBuildingViewFull === 'function') showBuildingViewFull();
  else showToast('🏗️ ' + t('building') + ' view coming soon!', 2000);
}

function showFleetView() {
  if (typeof showFleetViewFull === 'function') showFleetViewFull();
  else showToast('🚢 ' + t('fleet') + ' view coming soon!', 2000);
}

function showTechView() {
  if (typeof showTechViewFull === 'function') showTechViewFull();
  else showToast('🔬 ' + t('tech') + ' view coming soon!', 2000);
}

function showSoldierView() {
  if (typeof showSoldierViewFull === 'function') showSoldierViewFull();
  else showToast('🪖 ' + t('soldier') + ' view coming soon!', 2000);
}

function showEquipmentView() {
  if (typeof showEquipmentViewFull === 'function') showEquipmentViewFull();
  else showToast('🗡️ ' + t('equipment') + ' view coming soon!', 2000);
}

function showDailyView() {
  if (typeof showDailyViewFull === 'function') showDailyViewFull();
  else showToast('📋 ' + t('dailyQuests') + ' view coming soon!', 2000);
}

function showAchievementView() {
  if (typeof showAchievementViewFull === 'function') showAchievementViewFull();
  else showToast('🏆 ' + t('achievements') + ' view coming soon!', 2000);
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', function() {
  if (typeof enableAntiDebug === 'function') {
    enableAntiDebug();
  }

  if (!player) {
    initPlayer();
    if (typeof protectPlayer === 'function') {
      player = protectPlayer(player);
    }
  }

  showView('start');
  updateStartScreenLang();

  const hasSave = localStorage.getItem('commander_save') ? true : false;
  const info = document.getElementById('save-info');
  if (info) {
    info.textContent = hasSave ? '📁 Save Loaded' : '📁 New Game';
  }

  console.log('✅ Infinite Commander loaded! Part 8');
});