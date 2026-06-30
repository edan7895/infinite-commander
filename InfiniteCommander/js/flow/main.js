// ============================================================
// main.js — Game Entry, Main Loop, View Navigation (Part 8 + CrazyGames SDK v3)
// ============================================================

// ===== 1. View Navigation =====
function showView(viewId) {
  document.querySelectorAll('.view').forEach(function(v) {
    v.style.display = 'none';
  });
  const target = document.getElementById('view-' + viewId);
  if (target) target.style.display = 'block';
}

// ===== 2. CrazyGames SDK v3 初始化 =====
async function initCrazyGamesSDK() {
  try {
    // 检查 SDK 是否已加载
    if (typeof window.CrazyGames === 'undefined' || !window.CrazyGames.SDK) {
      console.warn('⚠️ CrazyGames SDK 未加载（可能不在 CrazyGames 平台运行）');
      return false;
    }

    // v3 SDK 需要手动调用 init()
    await window.CrazyGames.SDK.init();
    console.log('✅ CrazyGames SDK v3 初始化成功');
    console.log('📡 环境:', window.CrazyGames.SDK.environment);

    // 如果环境是 'local'，提示开发者
    if (window.CrazyGames.SDK.environment === 'local') {
      console.log('📢 本地环境：广告将显示为覆盖层文本');
    }

    return true;
  } catch (error) {
    console.error('❌ CrazyGames SDK 初始化失败:', error);
    console.log('📢 游戏将继续运行，但排行榜和广告功能可能受限');
    return false;
  }
}

// ===== 3. Start Game =====
async function startGame() {
  if (!player) {
    initPlayer();
    if (typeof protectPlayer === 'function') {
      player = protectPlayer(player);
    }
  }

  // 加载存档
  loadGame();

  // ★★★★★ 初始化 CrazyGames SDK v3 ★★★★★
  await initCrazyGamesSDK();

  // 开场故事
  currentStoryIndex = 0;
  showView('story');
  renderStory();

  // 启动游戏循环
  if (typeof gameLoopInterval === 'undefined' || !gameLoopInterval) {
    gameLoopInterval = setInterval(gameLoop, 1000);
  }
}

// ===== 4. Story =====
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

// ===== 5. Game Loop =====
let gameLoopInterval = null;

function gameLoop() {
  if (!player) return;

  // 建筑产出
  applyBuildingProduction();

  // 士兵稻米消耗
  applySoldierConsumption();

  // 自动战斗
  if (player.autoFight) {
    doCombat();
  }

  // Boss 更新
  updateBoss();

  // 检查自动晋升
  checkAutoPromote();

  // 检查教程
  checkTutorial();

  // 随机事件（仅当没有事件活跃时）
  if (!eventActive) {
    triggerRandomEvent();
  }

  // 每日重置检查和成就检查
  checkDailyReset();
  checkAchievements();

  // 更新 UI
  if (typeof updateUI === 'function') updateUI();
}

// ===== 6. Combat =====
function doCombat() {
  const p = player;
  const rank = getCurrentRank();

  let expGain = Math.floor(rank.expBase * 0.02) + 1;
  expGain += Math.floor(p.stars * 0.5);
  expGain += Math.floor(p.rankId * 0.5);

  let goldGain = Math.floor(rank.goldBase * 0.03) + 1;
  goldGain += Math.floor(p.stars * 0.3);

  // 科技加成：AI
  const techMods = getTechModifiers();
  const aiBonus = 1 + techMods.aiBonus;

  // 装备加成：引擎 + 核心
  const equipMods = getEquipmentModifiers();
  const efficiencyBonus = 1 + equipMods.efficiencyBonus;
  const allBonus = 1 + equipMods.allBonus;

  const totalMultiplier = aiBonus * efficiencyBonus * allBonus;

  expGain = Math.floor(expGain * totalMultiplier);
  goldGain = Math.floor(goldGain * totalMultiplier);

  // 双倍 Buff
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

  // 更新每日任务进度
  updateDailyProgress('kill', 1);
  updateDailyProgress('gold', goldGain);

  // 士兵死亡判定
  applySoldierDeath();

  // 自动升星检查
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

// ===== 7. Combat Power =====
function calcCombatPower() {
  const p = player;
  const rank = getCurrentRank();
  let cp = 10 + rank.id * 5 + p.stars * 3 + p.level * 2;

  // 士兵战斗力
  const activeSoldiers = (p.soldiers || 0) - (p.wounded || 0);
  cp += activeSoldiers * CONFIG.SOLDIER.combatPowerPerSoldier;

  // 舰队战斗力
  cp += getFleetCP();

  // 科技加成
  const techMods = getTechModifiers();
  cp += techMods.cpBonus;

  // 装备加成
  const equipMods = getEquipmentModifiers();
  cp += equipMods.cpBonus;

  // 核科技全属性加成
  cp += cp * techMods.allBonus * 0.5;

  return Math.floor(cp);
}

// ===== 8. Toggle Auto Fight =====
function toggleAutoFight() {
  if (!player) return;
  player.autoFight = !player.autoFight;
  if (typeof updateUI === 'function') updateUI();
}

// ===== 9. Handle Promote =====
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

// ===== 10. Claim Offline =====
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

// ===== 11. Claim Boss Reward =====
let lastBossReward = null;

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

// ===== 12. Boss Update =====
const originalUpdateBoss = updateBoss;
updateBoss = function() {
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

      // 更新每日任务
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
};

// ===== 13. View Functions =====
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

// ===== 14. Initialize =====
document.addEventListener('DOMContentLoaded', function() {
  // 启用反调试
  if (typeof enableAntiDebug === 'function') {
    enableAntiDebug();
  }

  // 初始化玩家
  if (!player) {
    initPlayer();
    if (typeof protectPlayer === 'function') {
      player = protectPlayer(player);
    }
  }

  // 显示启动界面
  showView('start');
  updateStartScreenLang();

  // 检查是否有存档
  const hasSave = localStorage.getItem('commander_save') ? true : false;
  const info = document.getElementById('save-info');
  if (info) {
    info.textContent = hasSave ? '📁 Save Loaded' : '📁 New Game';
  }

  // CrazyGames SDK v3 会自动初始化，但我们也可以主动检查
  // SDK 脚本已经在 index.html 中加载，会在页面加载时自动可用
  if (typeof window.CrazyGames !== 'undefined' && window.CrazyGames.SDK) {
    console.log('🎮 CrazyGames SDK v3 已加载，等待游戏启动时初始化...');
  }

  console.log('✅ Infinite Commander loaded! Part 8 + CrazyGames SDK v3 Ready');
  console.log('🔒 Security active | 📱 ' + (window.innerWidth < 640 ? 'Mobile' : 'Desktop'));
});