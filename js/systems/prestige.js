// ============================================================
// prestige.js — 转生/声望系统 (Part 12)
// ============================================================

/**
 * 检查是否满足转生条件
 * @returns {Object} { canPrestige: boolean, reason: string, progress: number }
 */
function checkPrestigeRequirements() {
  if (!player) {
    return { canPrestige: false, reason: 'no_player', progress: 0 };
  }

  const minRank = CONFIG.PRESTIGE.minRank || 49;
  const maxPrestige = CONFIG.PRESTIGE.maxPrestige || 20;
  const currentRank = player.rankId || 0;

  // 检查是否达到最大转生次数
  if (player.prestigeCount >= maxPrestige) {
    return {
      canPrestige: false,
      reason: 'max_reached',
      progress: 100,
      maxPrestige: maxPrestige
    };
  }

  // 检查军阶是否达到要求
  if (currentRank < minRank) {
    return {
      canPrestige: false,
      reason: 'rank_required',
      progress: Math.min(100, (currentRank / minRank) * 100),
      requiredRank: minRank,
      currentRank: currentRank
    };
  }

  return {
    canPrestige: true,
    reason: 'ready',
    progress: 100,
    minRank: minRank
  };
}

/**
 * 获取转生奖励预览
 * @returns {Object} 奖励详情
 */
function getPrestigeRewardPreview() {
  if (!player) return null;

  const medals = (player.prestigeMedals || 0) + 1;
  const bonus = medals * CONFIG.PRESTIGE.bonusPerMedal;
  const keepGold = Math.floor(player.gold * CONFIG.PRESTIGE.keepGoldPercent);

  return {
    medals: medals,
    bonusPercent: bonus,
    keepGold: keepGold,
    prestigeCount: (player.prestigeCount || 0) + 1,
    willReset: {
      rank: true,
      stars: true,
      exp: true,
      buildings: true,
      soldiers: true,
      wounded: true,
      fleet: true,
      tech: true,
      equipment: true,
      upgradeQueue: true,
      techPoints: true,
      combatPower: true,
      bossTimer: true,
      promotionAttempts: true,
      promotionSuccess: true
    },
    willKeep: {
      gold: keepGold,
      totalGold: true,
      achievements: true,
      daily: true,
      loginDays: true,
      prestigeMedals: true,
      prestigeCount: true,
      prestigeHistory: true,
      guideCompleted: true,
      lastEventTime: true,
      adCount: true
    }
  };
}

/**
 * 执行转生
 * @returns {Object} 转生结果
 */
function performPrestige() {
  if (!player) {
    return { success: false, message: 'No player' };
  }

  const check = checkPrestigeRequirements();
  if (!check.canPrestige) {
    return {
      success: false,
      message: check.reason,
      details: check
    };
  }

  const maxPrestige = CONFIG.PRESTIGE.maxPrestige || 20;
  if (player.prestigeCount >= maxPrestige) {
    return {
      success: false,
      message: 'max_reached',
      details: { maxPrestige: maxPrestige }
    };
  }

  // ===== 执行转生 =====

  // 1. 记录转生历史
  const historyEntry = {
    timestamp: Date.now(),
    rank: player.rankId,
    rankName: getRankName(player.rankId, langCurrent),
    gold: player.gold,
    totalGold: player.totalGold,
    kills: player.totalKills,
    bossDefeated: player.totalBossDefeated,
    prestigeCount: player.prestigeCount + 1,
    medals: player.prestigeMedals + 1
  };

  if (!player.prestigeHistory) player.prestigeHistory = [];
  player.prestigeHistory.push(historyEntry);

  // 2. 计算保留的金币
  const keepGold = Math.floor(player.gold * CONFIG.PRESTIGE.keepGoldPercent);

  // 3. 保留的数据
  const keptMedals = (player.prestigeMedals || 0) + 1;
  const keptPrestigeCount = (player.prestigeCount || 0) + 1;
  const keptAchievements = player.achievements || [];
  const keptDaily = JSON.parse(JSON.stringify(player.daily || {}));
  const keptLoginDays = player.loginDays || 0;
  const keptGuideCompleted = player.guideCompleted || false;
  const keptAdCount = player.adCount || 0;
  const keptLastEventTime = player.lastEventTime || 0;
  const keptTotalGold = player.totalGold || 0;
  const keptTotalKills = player.totalKills || 0;
  const keptTotalBossDefeated = player.totalBossDefeated || 0;

  // 4. 重置玩家数据（保留关键数据）
  const newPlayer = createPlayer();

  // 恢复保留的数据
  newPlayer.prestigeMedals = keptMedals;
  newPlayer.prestigeCount = keptPrestigeCount;
  newPlayer.prestigeHistory = player.prestigeHistory || [];
  newPlayer.achievements = keptAchievements;
  newPlayer.daily = keptDaily;
  newPlayer.loginDays = keptLoginDays;
  newPlayer.guideCompleted = keptGuideCompleted;
  newPlayer.adCount = keptAdCount;
  newPlayer.lastEventTime = keptLastEventTime;
  newPlayer.totalGold = keptTotalGold;
  newPlayer.totalKills = keptTotalKills;
  newPlayer.totalBossDefeated = keptTotalBossDefeated;

  // 保留部分金币
  newPlayer.gold = keepGold;

  // 5. 应用新玩家数据
  for (const key in newPlayer) {
    if (newPlayer.hasOwnProperty(key)) {
      player[key] = newPlayer[key];
    }
  }

  // 6. 重新计算战斗力
  if (typeof calcCombatPower === 'function') {
    player.combatPower = calcCombatPower();
  }

  // 7. 保存存档
  if (typeof saveGame === 'function') {
    saveGame();
  }

  // 8. 更新UI
  if (typeof refreshAllUI === 'function') {
    refreshAllUI();
  }

  // 9. 显示成功消息
  const medalWord = langCurrent === 'zh' ? '枚' : '';
  const medalIcon = '🏅';
  const message = '🎉 ' + t('prestigeSuccess').replace('{medals}', keptMedals);

  // 显示转生结果弹窗
  const isZh = langCurrent === 'zh';
  const bonus = keptMedals * CONFIG.PRESTIGE.bonusPerMedal;

  setTimeout(function() {
    const msg =
      (isZh ? '🎉 转生成功！\n' : '🎉 Prestige Successful!\n') +
      (isZh ? '🏅 获得 ' + keptMedals + ' 枚勋章\n' : '🏅 ' + keptMedals + ' medals\n') +
      (isZh ? '💰 保留 ' + formatNumber(keepGold) + ' 金币\n' : '💰 Kept ' + formatNumber(keepGold) + ' gold\n') +
      (isZh ? '📈 资源产出 +' + bonus + '%' : '📈 +' + bonus + '% Resource Production');
    alert(msg);
  }, 300);

  return {
    success: true,
    message: 'success',
    medals: keptMedals,
    bonusPercent: keptMedals * CONFIG.PRESTIGE.bonusPerMedal,
    keepGold: keepGold,
    prestigeCount: keptPrestigeCount
  };
}

/**
 * 获取转生统计数据
 * @returns {Object} 统计信息
 */
function getPrestigeStats() {
  if (!player) {
    return {
      prestigeCount: 0,
      medals: 0,
      bonusPercent: 0,
      history: [],
      canPrestige: false,
      requirements: null
    };
  }

  const medals = player.prestigeMedals || 0;
  const bonus = medals * CONFIG.PRESTIGE.bonusPerMedal;
  const requirements = checkPrestigeRequirements();

  return {
    prestigeCount: player.prestigeCount || 0,
    medals: medals,
    bonusPercent: bonus,
    bonusDisplay: '+' + bonus + '%',
    history: player.prestigeHistory || [],
    canPrestige: requirements.canPrestige,
    requirements: requirements,
    maxPrestige: CONFIG.PRESTIGE.maxPrestige || 20,
    keepGoldPercent: CONFIG.PRESTIGE.keepGoldPercent * 100
  };
}

/**
 * 获取转生加成（用于其他系统调用）
 * @returns {number} 加成倍数（如 5.0 表示 500%）
 */
function getPrestigeBonus() {
  if (!player) return 1.0;
  const medals = player.prestigeMedals || 0;
  const bonus = medals * CONFIG.PRESTIGE.bonusPerMedal;
  return 1.0 + (bonus / 100);
}

// 暴露到全局
window.checkPrestigeRequirements = checkPrestigeRequirements;
window.getPrestigeRewardPreview = getPrestigeRewardPreview;
window.performPrestige = performPrestige;
window.getPrestigeStats = getPrestigeStats;
window.getPrestigeBonus = getPrestigeBonus;

console.log('✅ 转生系统已加载 (Part 12)');