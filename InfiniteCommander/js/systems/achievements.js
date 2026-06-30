// ============================================================
// achievements.js — Achievement System
// ============================================================

// ---------- Get achievements ----------
function getAchievements() {
  return CONFIG.ACHIEVEMENTS || [];
}

function getAchievement(id) {
  const achievements = getAchievements();
  return achievements.find(function(a) { return a.id === id; }) || null;
}

// ---------- Get unlocked achievements ----------
function getUnlockedAchievements() {
  if (!player || !player.achievements) return [];
  return player.achievements || [];
}

function isAchievementUnlocked(id) {
  if (!player || !player.achievements) return false;
  return player.achievements.indexOf(id) !== -1;
}

// ---------- Check and unlock achievements ----------
function checkAchievements() {
  if (!player) return;

  const achievements = getAchievements();
  const unlocked = getUnlockedAchievements();

  achievements.forEach(function(achievement) {
    // Skip if already unlocked
    if (unlocked.indexOf(achievement.id) !== -1) return;

    let progress = 0;
    let isComplete = false;

    // Check different achievement types
    switch (achievement.id) {
      // Kill achievements
      case 'kill_100':
      case 'kill_1000':
      case 'kill_10000':
        progress = player.totalKills || 0;
        isComplete = progress >= achievement.target;
        break;
      // Boss achievements
      case 'boss_10':
      case 'boss_50':
      case 'boss_200':
        progress = player.totalBossDefeated || 0;
        isComplete = progress >= achievement.target;
        break;
      // Gold achievements
      case 'gold_1m':
      case 'gold_100m':
        progress = player.totalGold || 0;
        isComplete = progress >= achievement.target;
        break;
      // Building achievements
      case 'building_50':
      case 'building_80':
        let maxBuildingLevel = 0;
        if (player.buildings) {
          for (const key in player.buildings) {
            if (player.buildings.hasOwnProperty(key)) {
              if (player.buildings[key] > maxBuildingLevel) {
                maxBuildingLevel = player.buildings[key];
              }
            }
          }
        }
        progress = maxBuildingLevel;
        isComplete = progress >= achievement.target;
        break;
      // Soldier achievements
      case 'soldier_500':
      case 'soldier_2000':
        progress = player.soldiers || 0;
        isComplete = progress >= achievement.target;
        break;
      // Fleet achievements
      case 'fleet_50':
      case 'fleet_150':
        let fleetTotalLevel = 0;
        if (player.fleet) {
          for (const key in player.fleet) {
            if (player.fleet.hasOwnProperty(key)) {
              fleetTotalLevel += player.fleet[key] || 0;
            }
          }
        }
        progress = fleetTotalLevel;
        isComplete = progress >= achievement.target;
        break;
      // Tech achievements
      case 'tech_50':
      case 'tech_200':
        let techTotalLevel = 0;
        if (player.tech) {
          for (const key in player.tech) {
            if (player.tech.hasOwnProperty(key)) {
              techTotalLevel += player.tech[key] || 0;
            }
          }
        }
        progress = techTotalLevel;
        isComplete = progress >= achievement.target;
        break;
      // Equipment achievements
      case 'equip_30':
      case 'equip_60':
        let equipTotalLevel = 0;
        if (player.equipment) {
          for (const key in player.equipment) {
            if (player.equipment.hasOwnProperty(key)) {
              equipTotalLevel += player.equipment[key] || 0;
            }
          }
        }
        progress = equipTotalLevel;
        isComplete = progress >= achievement.target;
        break;
      // Daily achievements
      case 'daily_5':
        // Count completed daily quests (total)
        let dailyCompleted = 0;
        if (player.daily) {
          const tasks = CONFIG.DAILY.tasks || [];
          tasks.forEach(function(task) {
            const claimed = player.daily[task.id + '_claimed'] || false;
            if (claimed) dailyCompleted++;
          });
        }
        progress = dailyCompleted;
        isComplete = progress >= achievement.target;
        break;
      // Rank achievement
      case 'rank_10':
        progress = player.rankId || 0;
        isComplete = progress >= achievement.target;
        break;
      default:
        isComplete = false;
    }

    if (isComplete) {
      // Unlock achievement
      player.achievements.push(achievement.id);

      // Apply rewards
      if (achievement.rewardGold > 0) {
        player.gold += achievement.rewardGold;
        player.totalGold += achievement.rewardGold;
      }
      if (achievement.rewardExp > 0) {
        player.exp += achievement.rewardExp;
      }
      if (achievement.rewardTech > 0) {
        player.techPoints = (player.techPoints || 0) + achievement.rewardTech;
      }

      // Show notification
      const isZh = langCurrent === 'zh';
      const name = isZh ? achievement.nameZh : achievement.nameEn;
      const msg = '🎉 ' + (t('achievementUnlocked') || 'Achievement Unlocked!') + '\n' + name;
      if (achievement.rewardGold > 0) msg += '\n+' + formatNumber(achievement.rewardGold) + '💰';
      if (achievement.rewardExp > 0) msg += '\n+' + formatNumber(achievement.rewardExp) + 'EXP';
      if (achievement.rewardTech > 0) msg += '\n+' + achievement.rewardTech + '⚡';
      alert(msg);

      if (typeof updateUI === 'function') updateUI();
    }
  });
}

// ---------- Get achievement stats for UI ----------
function getAchievementStats() {
  if (!player) return { achievements: [], unlocked: 0, total: 0, progress: 0 };

  const allAchievements = getAchievements();
  const unlockedList = getUnlockedAchievements();
  const result = [];

  allAchievements.forEach(function(achievement) {
    const isUnlocked = unlockedList.indexOf(achievement.id) !== -1;

    let progress = 0;
    let progressMax = achievement.target || 1;

    // Calculate progress for each achievement
    switch (achievement.id) {
      case 'kill_100':
      case 'kill_1000':
      case 'kill_10000':
        progress = player.totalKills || 0;
        break;
      case 'boss_10':
      case 'boss_50':
      case 'boss_200':
        progress = player.totalBossDefeated || 0;
        break;
      case 'gold_1m':
      case 'gold_100m':
        progress = player.totalGold || 0;
        break;
      case 'building_50':
      case 'building_80':
        let maxBuildingLevel = 0;
        if (player.buildings) {
          for (const key in player.buildings) {
            if (player.buildings.hasOwnProperty(key)) {
              if (player.buildings[key] > maxBuildingLevel) {
                maxBuildingLevel = player.buildings[key];
              }
            }
          }
        }
        progress = maxBuildingLevel;
        break;
      case 'soldier_500':
      case 'soldier_2000':
        progress = player.soldiers || 0;
        break;
      case 'fleet_50':
      case 'fleet_150':
        let fleetTotalLevel = 0;
        if (player.fleet) {
          for (const key in player.fleet) {
            if (player.fleet.hasOwnProperty(key)) {
              fleetTotalLevel += player.fleet[key] || 0;
            }
          }
        }
        progress = fleetTotalLevel;
        break;
      case 'tech_50':
      case 'tech_200':
        let techTotalLevel = 0;
        if (player.tech) {
          for (const key in player.tech) {
            if (player.tech.hasOwnProperty(key)) {
              techTotalLevel += player.tech[key] || 0;
            }
          }
        }
        progress = techTotalLevel;
        break;
      case 'equip_30':
      case 'equip_60':
        let equipTotalLevel = 0;
        if (player.equipment) {
          for (const key in player.equipment) {
            if (player.equipment.hasOwnProperty(key)) {
              equipTotalLevel += player.equipment[key] || 0;
            }
          }
        }
        progress = equipTotalLevel;
        break;
      case 'daily_5':
        let dailyCompleted = 0;
        if (player.daily) {
          const tasks = CONFIG.DAILY.tasks || [];
          tasks.forEach(function(task) {
            const claimed = player.daily[task.id + '_claimed'] || false;
            if (claimed) dailyCompleted++;
          });
        }
        progress = dailyCompleted;
        break;
      case 'rank_10':
        progress = player.rankId || 0;
        break;
      default:
        progress = 0;
    }

    const progressPercent = Math.min(100, (progress / achievement.target) * 100);

    result.push({
      id: achievement.id,
      nameEn: achievement.nameEn,
      nameZh: achievement.nameZh,
      descEn: achievement.descEn,
      descZh: achievement.descZh,
      icon: achievement.icon || '🏆',
      target: achievement.target,
      progress: progress,
      progressMax: achievement.target,
      progressPercent: progressPercent,
      isUnlocked: isUnlocked,
      rewardGold: achievement.rewardGold || 0,
      rewardExp: achievement.rewardExp || 0,
      rewardTech: achievement.rewardTech || 0
    });
  });

  return {
    achievements: result,
    unlocked: unlockedList.length,
    total: allAchievements.length,
    progress: allAchievements.length > 0 ? Math.round((unlockedList.length / allAchievements.length) * 100) : 0
  };
}