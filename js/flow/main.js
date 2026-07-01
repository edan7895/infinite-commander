// ============================================================
// main.js — Game Entry, Main Loop, View Navigation (Part 14 - 智能跳过故事)
// ============================================================

// ---------- 游戏循环控制 ----------
let gameLoopInterval = null;
let _isGamePaused = false;

function pauseGameLoop() {
  if (_isGamePaused) return;
  _isGamePaused = true;
  if (gameLoopInterval) {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
    console.log('[GameLoop] Paused');
  }
}

function resumeGameLoop() {
  if (!_isGamePaused) return;
  _isGamePaused = false;
  if (!gameLoopInterval) {
    gameLoopInterval = setInterval(gameLoop, 1000);
    console.log('[GameLoop] Resumed');
  }
}

function isGamePaused() {
  return _isGamePaused;
}

window.pauseGameLoop = pauseGameLoop;
window.resumeGameLoop = resumeGameLoop;
window.isGamePaused = isGamePaused;

// ---------- View Navigation ----------
function showView(viewId) {
  document.querySelectorAll('.view').forEach(function(v) {
    v.style.display = 'none';
  });
  const target = document.getElementById('view-' + viewId);
  if (target) target.style.display = 'block';
}

// ---------- ★★★ 检测是否有游戏进度（用于决定是否跳过故事） ★★★ ----------
function hasGameProgress() {
  if (!player) return false;
  
  // 检查是否有任何进度数据
  const hasProgress = 
    player.rankId > 0 ||           // 有军阶
    player.stars > 0 ||            // 有战星
    player.totalKills > 0 ||       // 有击杀
    player.totalGold > 1000 ||     // 有赚取金币
    player.soldiers > 0 ||         // 有士兵
    player.buildings.goldMine > 1 || // 有建筑升级
    Object.keys(player.fleet || {}).length > 0 || // 有舰队
    Object.keys(player.tech || {}).length > 0 ||  // 有科技
    Object.keys(player.equipment || {}).length > 0 || // 有装备
    player.achievements.length > 0 ||  // 有成就
    player.prestigeCount > 0;      // 有转生记录
  
  return hasProgress;
}

// ---------- ★★★ 检测是否有任何存档（本地或云端） ★★★ ----------
function hasAnySave() {
  // 检查 localStorage
  const hasLocalSave = localStorage.getItem('commander_save') !== null;
  
  // 如果有本地存档，返回 true
  if (hasLocalSave) return true;
  
  // 如果有玩家数据且有进度，也视为有存档
  if (player && hasGameProgress()) return true;
  
  return false;
}

// ---------- Start Game ----------
async function startGame() {
  // 初始化玩家
  if (!player) {
    initPlayer();
    if (typeof protectPlayer === 'function') {
      player = protectPlayer(player);
    }
  }

  // ===== Part 10: 加载存档 =====
  const hasSave = await loadGame();

  // ===== ★★★ Part 14: 智能决定是否显示故事 ★★★ =====
  // 条件1: 有存档 (hasSave === true)
  // 条件2: 玩家已完成引导 (guideCompleted === true)
  // 条件3: 玩家有任何游戏进度 (hasGameProgress() === true)
  // 条件4: 有任何本地存档 (hasAnySave() === true)
  const shouldSkipStory = hasSave || 
                          (player && player.guideCompleted === true) || 
                          (player && hasGameProgress()) ||
                          hasAnySave();

  // ===== 离线收益检查 =====
  if (player && player.offlineSeconds > 0) {
    setTimeout(function() {
      if (typeof checkAndShowOfflinePopup === 'function') {
        checkAndShowOfflinePopup();
      }
    }, 500);
  }

  // ===== 初始化 CrazyGames SDK =====
  if (typeof initCrazyGamesSDK === 'function') {
    await initCrazyGamesSDK();
  }

  // ===== ★★★ 根据条件决定跳转 ★★★ =====
  if (shouldSkipStory) {
    // ★★★ 有存档或有进度 → 直接进入主界面，跳过故事 ★★★
    console.log('[Game] 检测到已有进度，跳过故事');
    
    // 如果引导未完成但有进度，标记为已完成
    if (player && !player.guideCompleted && hasGameProgress()) {
      player.guideCompleted = true;
      if (typeof saveGame === 'function') {
        saveGame();
      }
    }
    
    showView('main');
    if (typeof updateUI === 'function') updateUI();

    // 如果有离线收益，尝试显示弹窗
    if (player && player.offlineSeconds > 0) {
      setTimeout(function() {
        if (typeof checkAndShowOfflinePopup === 'function' && !window._offlinePopupOpen) {
          checkAndShowOfflinePopup();
        }
      }, 1500);
    }

    if (!gameLoopInterval) {
      gameLoopInterval = setInterval(gameLoop, 1000);
      _isGamePaused = false;
    }

    if (typeof startAutoSave === 'function') {
      startAutoSave();
    }

    if (typeof resetEventTimer === 'function') {
      resetEventTimer();
    }

    return;
  }

  // ===== ★★★ 第一次玩：显示故事 + 新手引导 ★★★ =====
  console.log('[Game] 首次启动，显示故事');
  currentStoryIndex = 0;
  showView('story');
  renderStory();

  if (!gameLoopInterval) {
    gameLoopInterval = setInterval(gameLoop, 1000);
    _isGamePaused = false;
  }

  if (typeof startAutoSave === 'function') {
    startAutoSave();
  }

  if (typeof resetEventTimer === 'function') {
    resetEventTimer();
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
    nextBtn.textContent = langCurrent === 'zh' ? '开始引导 ▶' : 'Start Guide ▶';
    nextBtn.onclick = function() {
      startGuideAfterStory();
    };
  } else {
    nextBtn.textContent = langCurrent === 'zh' ? '继续 ▶' : 'Continue ▶';
    nextBtn.onclick = function() {
      currentStoryIndex++;
      renderStory();
    };
  }

  skipBtn.onclick = function() {
    startGuideAfterStory();
  };
}

function startGuideAfterStory() {
  showView('main');
  if (typeof startGuide === 'function') {
    setTimeout(function() {
      startGuide();
    }, 300);
  } else {
    if (typeof updateUI === 'function') updateUI();
  }
}

// ---------- 全局刷新 ----------
function refreshAllUI() {
  if (typeof updateUI === 'function') {
    updateUI();
  }
  if (typeof refreshCurrentView === 'function') {
    refreshCurrentView();
  }
}

function refreshMainUI() {
  if (typeof updateUI === 'function') {
    updateUI();
  }
}

window.refreshAllUI = refreshAllUI;
window.refreshMainUI = refreshMainUI;

// ---------- Game Loop ----------
let _eventTimer = 0;
let _eventInterval = 30 + Math.floor(Math.random() * 90);

function gameLoop() {
  if (_isGamePaused) return;
  if (!player) return;

  // 升级队列
  if (typeof updateUpgradeQueues === 'function') {
    updateUpgradeQueues();
  }

  // 建筑产出
  if (typeof applyBuildingProduction === 'function') {
    applyBuildingProduction();
  }

  // 士兵消耗
  if (typeof applySoldierConsumption === 'function') {
    applySoldierConsumption();
  }

  // 战斗
  if (player.autoFight) {
    doCombat();
  }

  // Boss
  if (typeof updateBoss === 'function') {
    updateBoss();
  }

  checkAutoPromote();

  if (typeof checkTutorial === 'function') {
    checkTutorial();
  }

  // 随机事件
  if (typeof eventActive !== 'undefined' && !eventActive) {
    _eventTimer++;
    if (_eventTimer >= _eventInterval) {
      if (typeof triggerRandomEvent === 'function') {
        triggerRandomEvent();
      }
      _eventTimer = 0;
      _eventInterval = 30 + Math.floor(Math.random() * 90);
    }
  }

  if (typeof checkDailyReset === 'function') {
    checkDailyReset();
  }
  if (typeof checkAchievements === 'function') {
    checkAchievements();
  }

  updateOfflineUI();

  if (typeof refreshAllUI === 'function') {
    refreshAllUI();
  } else if (typeof updateUI === 'function') {
    updateUI();
  }

  if (player && player.totalPlayTime % 10 === 0) {
    if (typeof saveGame === 'function') {
      saveGame();
    }
  }
}

// ---------- 更新离线UI ----------
function updateOfflineUI() {
  if (!player) return;

  const offlineArea = document.getElementById('offline-area');
  if (!offlineArea) return;

  if (player.offlineSeconds > 0) {
    offlineArea.style.display = 'block';
    const summary = getOfflineSummary();
    const timeStr = formatOfflineTime(summary.seconds);
    document.getElementById('offline-time').textContent = timeStr;
  } else {
    offlineArea.style.display = 'none';
  }
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

  let prestigeBonus = 1;
  if (typeof getPrestigeBonus === 'function') {
    prestigeBonus = getPrestigeBonus();
  }

  const totalMultiplier = aiBonus * efficiencyBonus * allBonus * prestigeBonus;

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

  if (typeof updateDailyProgress === 'function') {
    updateDailyProgress('kill', 1);
    updateDailyProgress('gold', goldGain);
  }

  if (typeof applySoldierDeath === 'function') {
    applySoldierDeath();
  }

  checkAutoStar();
}

function checkAutoStar() {
  const p = player;
  if (p.stars >= 5) return;

  const needed = getStarRequirement(p.rankId, p.stars);
  if (p.exp >= needed) {
    p.exp -= needed;
    p.stars++;
    p.combatPower = calcCombatPower();

    if (p.stars >= 5) {
      showToast('⭐ ' + (langCurrent === 'zh' ? '战星已满！准备晋升！' : 'Battle Stars Full! Ready to promote!'));
    } else {
      showToast('⭐ ' + (langCurrent === 'zh' ? '获得战星！' : 'Battle Star earned!'));
    }

    if (typeof refreshAllUI === 'function') refreshAllUI();
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

  if (typeof getFleetCP === 'function') {
    cp += getFleetCP();
  }

  const techMods = getTechModifiers();
  cp += techMods.cpBonus;

  if (typeof getEquipmentModifiers === 'function') {
    const equipMods = getEquipmentModifiers();
    cp += equipMods.cpBonus;
  }

  cp += cp * techMods.allBonus * 0.5;

  return Math.floor(cp);
}

// ---------- Toggle Auto Fight ----------
function toggleAutoFight() {
  if (!player) return;
  player.autoFight = !player.autoFight;
  if (typeof refreshAllUI === 'function') {
    refreshAllUI();
  } else if (typeof updateUI === 'function') {
    updateUI();
  }
}

// ---------- Handle Promote ----------
function handlePromote(type) {
  if (!player) return;

  if (player.stars < 5) {
    showToast('⭐ ' + (langCurrent === 'zh' ? '需要5颗战星才能晋升' : 'Need 5 Battle Stars to promote!'));
    return;
  }

  if (type === 'normal') {
    const cost = getPromoteExpCost(player.rankId);
    if (player.exp < cost) {
      showToast('⚠️ ' + (langCurrent === 'zh' ? '经验不足！需要 ' + formatNumber(cost) : 'Not enough EXP! Need ' + formatNumber(cost)));
      return;
    }
    if (Math.random() < 0.5) {
      player.exp -= cost;
      player.rankId++;
      player.stars = 0;
      player.combatPower = calcCombatPower();
      player.promotionSuccess++;
      showToast('✅ ' + t('trialPass') + ' (' + t('promoteNormal') + ')');
    } else {
      player.exp = Math.floor(player.exp * 0.5);
      player.promotionAttempts++;
      showToast('❌ ' + t('trialFail') + ' (-50% ' + t('exp') + ')');
    }
  } else if (type === 'gold') {
    const cost = getPromoteGoldCost(player.rankId);
    if (player.gold < cost) {
      showToast('⚠️ ' + (langCurrent === 'zh' ? '金币不足！需要 ' + formatNumber(cost) : 'Not enough Gold! Need ' + formatNumber(cost)));
      return;
    }
    if (Math.random() < 0.7) {
      player.gold -= cost;
      player.rankId++;
      player.stars = 0;
      player.combatPower = calcCombatPower();
      player.promotionSuccess++;
      showToast('✅ ' + t('trialPass') + ' (' + t('promoteGold') + ')');
    } else {
      player.gold -= cost;
      player.promotionAttempts++;
      showToast('❌ ' + t('trialFail') + ' (' + t('goldLost') + ')');
    }
  } else if (type === 'ad') {
    watchPromoteAd(function() {
      player.rankId++;
      player.stars = 0;
      player.combatPower = calcCombatPower();
      player.promotionSuccess++;
      showToast('✅ ' + t('trialPass') + ' (' + t('promoteAd') + ')');
      if (typeof refreshAllUI === 'function') refreshAllUI();
    });
  }

  if (typeof refreshAllUI === 'function') refreshAllUI();
}

// ---------- Claim Offline ----------
function claimOffline(mult) {
  if (!player) return;

  if (window._offlinePopupOpen) {
    showToast('📋 ' + (langCurrent === 'zh' ? '请在弹窗中领取离线收益' : 'Please claim offline rewards in the popup'));
    return;
  }

  const result = applyOfflineEarnings(mult);
  if (result.gold === 0 && result.exp === 0 && result.iron === 0 && result.rice === 0) {
    showToast('📭 ' + (langCurrent === 'zh' ? '没有离线收益' : 'No offline earnings'));
    return;
  }

  let msg = '📦 ' + (langCurrent === 'zh' ? '离线收益' : 'Offline Rewards') + ': ';
  if (result.gold > 0) msg += '+' + formatNumber(result.gold) + '💰 ';
  if (result.exp > 0) msg += '+' + formatNumber(result.exp) + 'EXP ';
  if (result.iron > 0) msg += '+' + formatNumber(result.iron) + '⛏️ ';
  if (result.rice > 0) msg += '+' + formatNumber(result.rice) + '🌾 ';
  showToast(msg);
  if (typeof refreshAllUI === 'function') refreshAllUI();
}

function claimOfflineWithAd() {
  if (window._offlinePopupOpen) {
    showToast('📋 ' + (langCurrent === 'zh' ? '请在弹窗中领取离线收益' : 'Please claim offline rewards in the popup'));
    return;
  }

  watchOfflineAd(function() {
    claimOffline(2);
  });
}

// ---------- Boss Reward ----------
if (typeof lastBossReward === 'undefined') {
  var lastBossReward = null;
}

function claimBossReward() {
  if (!lastBossReward) {
    showToast('📭 ' + (langCurrent === 'zh' ? '没有Boss奖励可领取' : 'No boss reward available'));
    return;
  }

  const reward = lastBossReward;
  const techMods = getTechModifiers();
  const equipMods = getEquipmentModifiers();
  const bossMultiplier = 1 + techMods.bossBonus + equipMods.bossBonus + equipMods.allBonus;
  const goldBonus = Math.floor(reward.gold * bossMultiplier);
  const expBonus = Math.floor(reward.exp * bossMultiplier);

  player.gold += goldBonus;
  player.totalGold += goldBonus;
  player.exp += expBonus;
  lastBossReward = null;

  showToast('🎁 ' + (langCurrent === 'zh' ? 'Boss奖励' : 'Boss Reward') + ': +' + formatNumber(goldBonus) + '💰 +' + formatNumber(expBonus) + 'EXP');
  if (typeof refreshAllUI === 'function') refreshAllUI();
}

function claimBossRewardWithAd() {
  if (!lastBossReward) {
    showToast('📭 ' + (langCurrent === 'zh' ? '没有Boss奖励可领取' : 'No boss reward available'));
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
    showToast('🎁 ' + (langCurrent === 'zh' ? 'Boss奖励 x2' : 'Boss Reward x2') + ': +' + formatNumber(goldBonus * 2) + '💰 +' + formatNumber(expBonus * 2) + 'EXP');
    if (typeof refreshAllUI === 'function') refreshAllUI();
  });
}

// ---------- Boss Update ----------
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

    if (typeof refreshAllUI === 'function') refreshAllUI();
  }

  if (p.bossActive) {
    const damageMultiplier = 1 + techMods.bossBonus + equipMods.bossBonus + equipMods.allBonus;
    let damage = Math.floor((p.combatPower / 2 + 5) * damageMultiplier);
    p.bossHealth -= damage;

    if (p.bossHealth <= 0) {
      p.bossActive = false;
      p.bossDefeated++;
      p.totalBossDefeated++;

      if (typeof updateDailyProgress === 'function') {
        updateDailyProgress('boss', 1);
      }

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

      showToast('👹 ' + (langCurrent === 'zh' ? 'Boss 已被击败！' : 'Boss defeated!') + ' ' + (langCurrent === 'zh' ? '点击领取奖励' : 'Claim your reward'));
      if (typeof refreshAllUI === 'function') refreshAllUI();
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

function showLoginView() {
  if (typeof showLoginViewFull === 'function') showLoginViewFull();
  else showToast('📅 ' + t('loginCheckIn') + ' view coming soon!', 2000);
}

function showPrestigeView() {
  if (typeof showPrestigeViewFull === 'function') showPrestigeViewFull();
  else showToast('🔄 ' + t('prestige') + ' view coming soon!', 2000);
}

// ---------- 全局暴露：强制跳过故事（供调试用） ----------
function forceSkipStory() {
  if (player) {
    player.guideCompleted = true;
    if (typeof saveGame === 'function') {
      saveGame();
    }
    showView('main');
    if (typeof updateUI === 'function') updateUI();
    showToast('⏭️ ' + (langCurrent === 'zh' ? '已跳过故事' : 'Story skipped'));
  }
}
window.forceSkipStory = forceSkipStory;

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

  if (typeof setupBeforeUnloadSave === 'function') {
    setupBeforeUnloadSave();
  }

  console.log('✅ Infinite Commander loaded! Part 14 - 智能跳过故事');
  console.log('🔒 Security active | 📱 ' + (window.innerWidth < 640 ? 'Mobile' : 'Desktop'));
  console.log('💾 自动存档已启动 (每30秒)');
});