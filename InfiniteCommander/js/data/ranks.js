// ============================================================
// ranks.js — 16 Military Ranks
// ============================================================

const RANK_DATA = [
  { id: 0,  rankEn: "Recruit",            rankZh: "新兵",     bossEn: "Rioter",        bossZh: "暴徒",        expBase: 100,   goldBase: 10 },
  { id: 1,  rankEn: "Private",            rankZh: "二等兵",   bossEn: "Rebel Squad",   bossZh: "叛军班长",    expBase: 200,   goldBase: 25 },
  { id: 2,  rankEn: "Corporal",           rankZh: "下士",     bossEn: "Insurgent",     bossZh: "叛乱分子",    expBase: 350,   goldBase: 50 },
  { id: 3,  rankEn: "Sergeant",           rankZh: "中士",     bossEn: "Militia",       bossZh: "民兵队长",    expBase: 500,   goldBase: 80 },
  { id: 4,  rankEn: "Staff Sergeant",     rankZh: "上士",     bossEn: "Armored Car",   bossZh: "装甲车",      expBase: 700,   goldBase: 120 },
  { id: 5,  rankEn: "Second Lieutenant",  rankZh: "少尉",     bossEn: "Tank Platoon",  bossZh: "坦克排",      expBase: 950,   goldBase: 180 },
  { id: 6,  rankEn: "First Lieutenant",   rankZh: "中尉",     bossEn: "Helicopter",    bossZh: "武装直升机",  expBase: 1250,  goldBase: 260 },
  { id: 7,  rankEn: "Captain",            rankZh: "上尉",     bossEn: "Artillery",     bossZh: "炮兵连",      expBase: 1600,  goldBase: 380 },
  { id: 8,  rankEn: "Major",              rankZh: "少校",     bossEn: "Tank Battalion", bossZh: "坦克营",    expBase: 2000,  goldBase: 520 },
  { id: 9,  rankEn: "Lieutenant Colonel", rankZh: "中校",     bossEn: "Fighter Jet",   bossZh: "战斗机",      expBase: 2500,  goldBase: 700 },
  { id: 10, rankEn: "Colonel",            rankZh: "上校",     bossEn: "Warship",       bossZh: "战舰",        expBase: 3100,  goldBase: 950 },
  { id: 11, rankEn: "Brigadier General",  rankZh: "准将",     bossEn: "Carrier",       bossZh: "航母",        expBase: 3800,  goldBase: 1300 },
  { id: 12, rankEn: "Major General",      rankZh: "少将",     bossEn: "Fleet",         bossZh: "舰队",        expBase: 4600,  goldBase: 1800 },
  { id: 13, rankEn: "Lieutenant General", rankZh: "中将",     bossEn: "Army Group",    bossZh: "集团军",      expBase: 5500,  goldBase: 2500 },
  { id: 14, rankEn: "General",            rankZh: "上将",     bossEn: "Nation Army",   bossZh: "国家军队",    expBase: 6500,  goldBase: 3500 },
  { id: 15, rankEn: "Marshal",            rankZh: "元帅",     bossEn: "World Fleet",   bossZh: "世界联合舰队", expBase: 8000, goldBase: 5000 }
];

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

function getPromoteGoldCost(rankId) {
  return Math.floor(CONFIG.PROMOTE.goldBase * Math.pow(CONFIG.PROMOTE.goldMultiplier, rankId));
}

function getPromoteExpCost(rankId) {
  return Math.floor(CONFIG.PROMOTE.expBase * Math.pow(CONFIG.PROMOTE.expMultiplier, rankId));
}

function getStarRequirement(starIndex) {
  return CONFIG.STAR_REQUIREMENTS[starIndex] || 999999;
}

function getTotalStars(rankId) {
  return rankId * 5;
}