// ============================================================
// ranks.js — 50 Military Ranks + 50 Bosses (指数级数值)
// 设计：新手期1-3天 → 中期1-2月 → 后期4-6月 → 终局1年+
// ============================================================

// ===== 辅助：生成指数级军阶数据 =====
function generateRankData() {
  const ranks = [];
  const totalRanks = 50;

  // ===== 军阶名称 =====
  const rankNamesEn = [
    "Recruit", "Private", "Private First Class", "Specialist", "Corporal",
    "Sergeant", "Staff Sergeant", "Sergeant First Class", "Master Sergeant", "First Sergeant",
    "Second Lieutenant", "First Lieutenant", "Captain", "Major", "Lieutenant Colonel",
    "Colonel", "Brigadier General", "Major General", "Lieutenant General", "General",
    "General of the Army", "Fleet Admiral", "Grand Admiral", "Supreme Commander", "Warlord",
    "Battlemaster", "War Marshal", "Stellar General", "Nebula Marshal", "Galactic Commander",
    "Empire Lord", "Void Admiral", "Celestial General", "Eternal Commander", "Infinity Marshal",
    "Omnipotent General", "Prime Commander", "Star Marshal", "Nexus General", "Apex Commander",
    "Paragon Marshal", "Sovereign General", "Titan Commander", "Ascendant Marshal", "Cosmic Overlord",
    "Stellar Emperor", "Galactic Emperor", "Universe Sovereign", "Divine Commander", "Immortal Emperor"
  ];

  const rankNamesZh = [
    "新兵", "二等兵", "一等兵", "专业下士", "下士",
    "中士", "上士", "一级军士长", "军士长", "一级士官长",
    "少尉", "中尉", "上尉", "少校", "中校",
    "上校", "准将", "少将", "中将", "上将",
    "陆军五星上将", "舰队上将", "大元帅", "最高指挥官", "战争领主",
    "战斗大师", "战争元帅", "星际将军", "星云元帅", "银河指挥官",
    "帝国领主", "虚空上将", "天界将军", "永恒指挥官", "无限元帅",
    "全能将军", "至尊指挥官", "星辰元帅", "枢纽将军", "巅峰指挥官",
    "典范元帅", "至高将军", "泰坦指挥官", "飞升元帅", "宇宙霸主",
    "星域皇帝", "银河皇帝", "宇宙主宰", "神圣指挥官", "不朽皇帝"
  ];

  const bossNamesEn = [
    "Rioter", "Rebel Squad", "Insurgent", "Militia", "Armored Car",
    "Tank Platoon", "Helicopter", "Artillery", "Tank Battalion", "Fighter Jet",
    "Warship", "Carrier", "Fleet", "Army Group", "Nation Army",
    "World Fleet", "Titan Fleet", "Star Destroyer", "Galactic Armada", "Dark Fleet",
    "Reaper Legion", "Nebula Empire", "Void Crusaders", "Phantom Squadron", "Iron Legion",
    "Shadow Council", "Crimson Armada", "Obsidian Empire", "Spectre Fleet", "Titan Legion",
    "Dreadnought Armada", "Eclipse Fleet", "Nova Empire", "Abyss Legion", "Cosmic Fleet",
    "Oblivion Armada", "Genesis Fleet", "Dominion Empire", "Phantom Legion", "Colossus Fleet",
    "Revenant Empire", "Vanguard Fleet", "Cataclysm Legion", "Eternal Empire", "Voidborn Armada",
    "Celestial Empire", "Ultimate Fleet", "Omnipotent Armada", "Eternal Legion", "Infinite Armada"
  ];

  const bossNamesZh = [
    "暴徒", "叛军班", "叛乱者", "民兵队", "装甲车",
    "坦克排", "武直", "炮兵连", "坦克营", "战斗机",
    "战舰", "航母", "舰队", "集团军", "国家军",
    "世界舰队", "泰坦舰队", "歼星舰", "银河舰队", "暗黑舰队",
    "收割者军团", "星云帝国", "虚空十字军", "幻影中队", "钢铁军团",
    "暗影议会", "赤红舰队", "黑曜帝国", "幽灵舰队", "泰坦军团",
    "无畏舰队", "日蚀舰队", "新星帝国", "深渊军团", "宇宙舰队",
    "湮灭舰队", "创世舰队", "主宰帝国", "幻影军团", "巨像舰队",
    "亡魂帝国", "先锋舰队", "浩劫军团", "永恒帝国", "虚空舰队",
    "天界帝国", "终极舰队", "全能舰队", "永恒军团", "无限舰队"
  ];

  // ===== 指数级数值计算 =====
  for (let i = 0; i < totalRanks; i++) {
    // expBase: 从100开始，每级增长 1.28 倍 (温和指数)
    // 军阶0: 100, 军阶10: ~1200, 军阶20: ~15000, 军阶30: ~190000, 军阶40: ~2.4M, 军阶49: ~18M
    const expBase = Math.floor(100 * Math.pow(1.28, i));
    // goldBase: 从10开始，每级增长 1.28 倍
    const goldBase = Math.floor(10 * Math.pow(1.28, i));

    ranks.push({
      id: i,
      rankEn: rankNamesEn[i] || "Unknown",
      rankZh: rankNamesZh[i] || "未知",
      bossEn: bossNamesEn[i] || "Unknown",
      bossZh: bossNamesZh[i] || "未知",
      expBase: expBase,
      goldBase: goldBase
    });
  }

  return ranks;
}

// ===== 生成数据 =====
const RANK_DATA = generateRankData();

// ===== 辅助函数 =====
function getRank(id) {
  return RANK_DATA[id] || RANK_DATA[0];
}

function getCurrentRank() {
  return getRank(window.player ? window.player.rankId : 0);
}

function getRankName(id, lang) {
  const r = getRank(id);
  return lang === 'zh' ? r.rankZh : r.rankEn;
}

function getBossName(id, lang) {
  const r = getRank(id);
  return lang === 'zh' ? r.bossZh : r.bossEn;
}

// ===== 指数级消耗公式 =====

/**
 * 升阶金币消耗：指数增长
 * 军阶0: 1000, 军阶10: ~8000, 军阶20: ~64000, 军阶30: ~512000, 军阶40: ~4M, 军阶49: ~32M
 */
function getPromoteGoldCost(rankId) {
  // 从1000开始，每级增长 1.22 倍
  return Math.floor(1000 * Math.pow(1.22, rankId));
}

/**
 * 升阶经验消耗：指数增长（比金币增长稍快）
 * 军阶0: 2000, 军阶10: ~12000, 军阶20: ~75000, 军阶30: ~450000, 军阶40: ~2.7M, 军阶49: ~13M
 */
function getPromoteExpCost(rankId) {
  // 从2000开始，每级增长 1.25 倍
  return Math.floor(2000 * Math.pow(1.25, rankId));
}

/**
 * 升星经验需求：随军阶指数增长
 * @param {number} rankId - 当前军阶
 * @param {number} starIndex - 0~4 (0=1星, 4=5星)
 * @returns {number} 需求经验值
 */
function getStarRequirement(rankId, starIndex) {
  // 基础需求：星1: 100, 星2: 300, 星3: 800, 星4: 2000, 星5: 5000
  const starBases = [100, 300, 800, 2000, 5000];
  const base = starBases[starIndex] || 5000;
  // 每级增长 1.15 倍
  return Math.floor(base * Math.pow(1.15, rankId));
}

/**
 * 兼容旧接口（不推荐使用，建议使用 getStarRequirement(rankId, starIndex)）
 * @deprecated
 */
function getStarRequirementOld(starIndex) {
  const reqs = [500, 1500, 4500, 13500, 40500];
  return reqs[starIndex] || 999999;
}

/**
 * 获取总战星数
 */
function getTotalStars(rankId) {
  return rankId * 5;
}

// ===== 导出 =====
window.RANK_DATA = RANK_DATA;
window.getRank = getRank;
window.getCurrentRank = getCurrentRank;
window.getRankName = getRankName;
window.getBossName = getBossName;
window.getPromoteGoldCost = getPromoteGoldCost;
window.getPromoteExpCost = getPromoteExpCost;
window.getStarRequirement = getStarRequirement;
window.getStarRequirementOld = getStarRequirementOld;
window.getTotalStars = getTotalStars;

console.log('✅ 军阶数据已加载 (50级, 指数级数值)');