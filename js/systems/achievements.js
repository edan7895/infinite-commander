// ============================================================
// achievements.js — Achievement System (100 Achievements)
// ============================================================

// ===== 生成100个成就 =====
function generateAchievements() {
  const achievements = [];
  let id = 0;

  // ----- 1. 击杀类 (20个) -----
  const killTargets = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000];
  const killNames = [
    "初次击杀", "新兵杀手", "百人斩", "战场新星", "精英战士",
    "千人斩", "战争机器", "杀戮大师", "万人敌", "传奇杀手",
    "五万斩", "十万斩", "二十万斩", "五十万斩", "百万斩"
  ];
  for (let i = 0; i < 15 && i < killTargets.length; i++) {
    const t = killTargets[i];
    achievements.push({
      id: 'kill_' + (id++),
      nameEn: killNames[i] + ' (Kills)',
      nameZh: killNames[i],
      descEn: 'Defeat ' + t + ' enemies',
      descZh: '击杀 ' + t + ' 个敌人',
      icon: '💀',
      target: t,
      rewardGold: Math.floor(t * 0.5),
      rewardExp: Math.floor(t * 0.3),
      rewardTech: 0,
      check: function() { return player.totalKills || 0; }
    });
  }

  // ----- 2. Boss击杀类 (15个) -----
  const bossTargets = [1, 3, 5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 400, 500, 1000];
  const bossNames = [
    "初战Boss", "Boss克星", "弑君者", "Boss猎人", "Boss终结者",
    "Boss屠夫", "Boss大师", "Boss帝王", "Boss之神", "Boss传说",
    "Boss神话", "Boss史诗", "Boss传奇", "Boss不朽", "Boss永恒"
  ];
  for (let i = 0; i < 15 && i < bossTargets.length; i++) {
    const t = bossTargets[i];
    achievements.push({
      id: 'boss_' + (id++),
      nameEn: bossNames[i],
      nameZh: bossNames[i],
      descEn: 'Defeat ' + t + ' bosses',
      descZh: '击败 ' + t + ' 个Boss',
      icon: '👹',
      target: t,
      rewardGold: Math.floor(t * 50),
      rewardExp: Math.floor(t * 30),
      rewardTech: 0,
      check: function() { return player.totalBossDefeated || 0; }
    });
  }

  // ----- 3. 金币类 (15个) -----
  const goldTargets = [10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 250000000, 500000000, 1000000000, 2500000000, 5000000000, 10000000000];
  const goldNames = [
    "万元户", "五万富翁", "十万富翁", "五十万富翁", "百万富翁",
    "五百万富翁", "千万富翁", "五千万富翁", "亿万富翁", "两亿五千万",
    "五亿富翁", "十亿富翁", "二十五亿", "五十亿", "百亿"
  ];
  for (let i = 0; i < 15 && i < goldTargets.length; i++) {
    const t = goldTargets[i];
    achievements.push({
      id: 'gold_' + (id++),
      nameEn: goldNames[i],
      nameZh: goldNames[i],
      descEn: 'Earn ' + t + ' total gold',
      descZh: '累计获得 ' + t + ' 金币',
      icon: '💰',
      target: t,
      rewardGold: Math.floor(t * 0.02),
      rewardExp: Math.floor(t * 0.01),
      rewardTech: 0,
      check: function() { return player.totalGold || 0; }
    });
  }

  // ----- 4. 建筑类 (10个) -----
  const buildingTargets = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const buildingNames = [
    "初级建筑师", "中级建筑师", "高级建筑师", "建筑大师", "建筑专家",
    "建筑宗师", "建筑帝王", "建筑之神", "建筑传说", "建筑永恒"
  ];
  for (let i = 0; i < 10 && i < buildingTargets.length; i++) {
    const t = buildingTargets[i];
    achievements.push({
      id: 'building_' + (id++),
      nameEn: buildingNames[i],
      nameZh: buildingNames[i],
      descEn: 'Reach total building level ' + t,
      descZh: '建筑总等级达到 ' + t,
      icon: '🏗️',
      target: t,
      rewardGold: Math.floor(t * 100),
      rewardExp: Math.floor(t * 50),
      rewardTech: 0,
      check: function() {
        let total = 0;
        if (player.buildings) {
          for (const key in player.buildings) {
            total += player.buildings[key] || 0;
          }
        }
        return total;
      }
    });
  }

  // ----- 5. 士兵类 (10个) -----
  const soldierTargets = [10, 25, 50, 100, 200, 300, 500, 750, 1000, 2000];
  const soldierNames = [
    "小队队长", "排长", "连长", "营长", "团长",
    "旅长", "师长", "军长", "司令", "统帅"
  ];
  for (let i = 0; i < 10 && i < soldierTargets.length; i++) {
    const t = soldierTargets[i];
    achievements.push({
      id: 'soldier_' + (id++),
      nameEn: soldierNames[i],
      nameZh: soldierNames[i],
      descEn: 'Own ' + t + ' soldiers',
      descZh: '拥有 ' + t + ' 个士兵',
      icon: '🪖',
      target: t,
      rewardGold: Math.floor(t * 10),
      rewardExp: Math.floor(t * 5),
      rewardTech: 0,
      check: function() { return player.soldiers || 0; }
    });
  }

  // ----- 6. 舰队类 (10个) -----
  const fleetTargets = [10, 20, 35, 50, 70, 90, 110, 130, 150, 200];
  const fleetNames = [
    "小舰队", "巡逻舰队", "护航舰队", "远征舰队", "主力舰队",
    "特混舰队", "航母舰队", "舰队司令", "舰队元帅", "舰队统帅"
  ];
  for (let i = 0; i < 10 && i < fleetTargets.length; i++) {
    const t = fleetTargets[i];
    achievements.push({
      id: 'fleet_' + (id++),
      nameEn: fleetNames[i],
      nameZh: fleetNames[i],
      descEn: 'Reach total fleet level ' + t,
      descZh: '舰队总等级达到 ' + t,
      icon: '🚢',
      target: t,
      rewardGold: Math.floor(t * 50),
      rewardExp: Math.floor(t * 25),
      rewardTech: 0,
      check: function() {
        let total = 0;
        if (player.fleet) {
          for (const key in player.fleet) {
            total += player.fleet[key] || 0;
          }
        }
        return total;
      }
    });
  }

  // ----- 7. 科技类 (10个) -----
  const techTargets = [10, 20, 30, 40, 50, 70, 90, 120, 160, 200];
  const techNames = [
    "科技萌芽", "科技起步", "科技发展", "科技突破", "科技先驱",
    "科技大师", "科技宗师", "科技帝王", "科技传说", "科技永恒"
  ];
  for (let i = 0; i < 10 && i < techTargets.length; i++) {
    const t = techTargets[i];
    achievements.push({
      id: 'tech_' + (id++),
      nameEn: techNames[i],
      nameZh: techNames[i],
      descEn: 'Reach total tech level ' + t,
      descZh: '科技总等级达到 ' + t,
      icon: '🔬',
      target: t,
      rewardGold: Math.floor(t * 100),
      rewardExp: Math.floor(t * 50),
      rewardTech: Math.floor(t * 0.5),
      check: function() {
        let total = 0;
        if (player.tech) {
          for (const key in player.tech) {
            total += player.tech[key] || 0;
          }
        }
        return total;
      }
    });
  }

  // ----- 8. 装备类 (10个) -----
  const equipTargets = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60];
  const equipNames = [
    "初级军备", "中级军备", "高级军备", "精英军备", "传奇军备",
    "史诗军备", "神话军备", "宇宙军备", "永恒军备", "无限军备"
  ];
  for (let i = 0; i < 10 && i < equipTargets.length; i++) {
    const t = equipTargets[i];
    achievements.push({
      id: 'equip_' + (id++),
      nameEn: equipNames[i],
      nameZh: equipNames[i],
      descEn: 'Reach total equipment level ' + t,
      descZh: '装备总等级达到 ' + t,
      icon: '🗡️',
      target: t,
      rewardGold: Math.floor(t * 80),
      rewardExp: Math.floor(t * 40),
      rewardTech: 0,
      check: function() {
        let total = 0;
        if (player.equipment) {
          for (const key in player.equipment) {
            total += player.equipment[key] || 0;
          }
        }
        return total;
      }
    });
  }

  // ----- 9. 登录签到 (5个) -----
  const loginTargets = [1, 7, 15, 30, 60];
  const loginNames = ["初次登录", "一周战士", "半月老兵", "满月英雄", "双月传说"];
  for (let i = 0; i < 5 && i < loginTargets.length; i++) {
    const t = loginTargets[i];
    achievements.push({
      id: 'login_' + (id++),
      nameEn: loginNames[i],
      nameZh: loginNames[i],
      descEn: 'Login for ' + t + ' days',
      descZh: '累计登录 ' + t + ' 天',
      icon: '📅',
      target: t,
      rewardGold: Math.floor(t * 200),
      rewardExp: Math.floor(t * 100),
      rewardTech: Math.floor(t * 2),
      check: function() { return player.loginDays || 0; }
    });
  }

  // ----- 10. 军阶成就 (5个) -----
  const rankTargets = [5, 10, 20, 35, 49];
  const rankNames = ["初级军官", "中级军官", "高级将领", "传奇将军", "不朽皇帝"];
  for (let i = 0; i < 5 && i < rankTargets.length; i++) {
    const t = rankTargets[i];
    achievements.push({
      id: 'rank_' + (id++),
      nameEn: rankNames[i],
      nameZh: rankNames[i],
      descEn: 'Reach military rank ' + t,
      descZh: '军衔达到 ' + t + ' 级',
      icon: '🎖️',
      target: t,
      rewardGold: Math.floor(t * 1000),
      rewardExp: Math.floor(t * 500),
      rewardTech: Math.floor(t * 5),
      check: function() { return player.rankId || 0; }
    });
  }

  // 确保至少有100个
  while (achievements.length < 100) {
    const idx = achievements.length;
    achievements.push({
      id: 'extra_' + idx,
      nameEn: 'Extra Achievement ' + idx,
      nameZh: '额外成就 ' + idx,
      descEn: 'Complete ' + idx + ' achievements',
      descZh: '完成 ' + idx + ' 个成就',
      icon: '⭐',
      target: idx,
      rewardGold: 100,
      rewardExp: 50,
      rewardTech: 0,
      check: function() { return player.achievements ? player.achievements.length : 0; }
    });
  }

  return achievements;
}

// ===== 存储 =====
let ACHIEVEMENT_DATA = [];

function initAchievements() {
  ACHIEVEMENT_DATA = generateAchievements();
  console.log('🏆 已生成 ' + ACHIEVEMENT_DATA.length + ' 个成就');
}

// ===== 获取成就数据 =====
function getAchievements() {
  if (ACHIEVEMENT_DATA.length === 0) {
    initAchievements();
  }
  return ACHIEVEMENT_DATA;
}

function getAchievement(id) {
  const achievements = getAchievements();
  return achievements.find(function(a) { return a.id === id; }) || null;
}

function getUnlockedAchievements() {
  if (!player || !player.achievements) return [];
  return player.achievements || [];
}

function isAchievementUnlocked(id) {
  if (!player || !player.achievements) return false;
  return player.achievements.indexOf(id) !== -1;
}

// ===== 检查并解锁成就 =====
function checkAchievements() {
  if (!player) return;

  const achievements = getAchievements();
  const unlocked = getUnlockedAchievements();

  achievements.forEach(function(achievement) {
    if (unlocked.indexOf(achievement.id) !== -1) return;

    const progress = achievement.check();
    if (progress >= achievement.target) {
      player.achievements.push(achievement.id);

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

      const isZh = langCurrent === 'zh';
      const name = isZh ? achievement.nameZh : achievement.nameEn;
      const msg = '🎖️ ' + (t('achievementUnlocked') || 'Achievement Unlocked!') + '\n' + name;
      alert(msg);

      if (typeof updateUI === 'function') updateUI();
    }
  });
}

// ===== 获取成就统计 =====
function getAchievementStats() {
  if (!player) return { achievements: [], unlocked: 0, total: 0, progress: 0 };

  const allAchievements = getAchievements();
  const unlockedList = getUnlockedAchievements();
  const result = [];

  allAchievements.forEach(function(achievement) {
    const isUnlocked = unlockedList.indexOf(achievement.id) !== -1;
    const progress = Math.min(achievement.target, achievement.check());

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
      progressPercent: Math.min(100, (progress / achievement.target) * 100),
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

// 初始化
initAchievements();