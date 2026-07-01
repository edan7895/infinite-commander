// ============================================================
// config.js — All game configuration (Part 12)
// ============================================================

const CONFIG = {
  // ---------- Promotion Costs (已移至 ranks.js) ----------

  // ---------- Star Requirements (已移至 ranks.js) ----------

  // ---------- Building System ----------
  BUILDINGS: {
    maxLevel: 80,
    unlockPerRank: 5,
    goldMine: {
      baseCost: 100,
      costMultiplier: 1.15,
      baseYield: 5,
      yieldMultiplier: 1.0
    },
    ironMine: {
      baseCost: 150,
      costMultiplier: 1.18,
      baseYield: 2,
      yieldMultiplier: 1.0
    },
    riceFarm: {
      baseCost: 120,
      costMultiplier: 1.16,
      baseYield: 3,
      yieldMultiplier: 1.0
    },
    barracks: {
      baseCost: 200,
      costMultiplier: 1.20,
      baseYield: 0,
      yieldMultiplier: 0
    },
    hospital: {
      baseCost: 180,
      costMultiplier: 1.19,
      baseYield: 0,
      yieldMultiplier: 0
    }
  },

  // ---------- Soldier System ----------
  SOLDIER: {
    goldCostBase: 200,
    goldCostPerSoldier: 10,
    riceCostBase: 50,
    riceCostPerSoldier: 2,
    riceConsumptionPerSoldier: 0.05,
    combatPowerPerSoldier: 2,
    maxPerBarracksLevel: 20,
    deathChance: 0.3,
    healGoldBase: 100,
    healRiceBase: 50,
    healGoldPerWounded: 20,
    healRicePerWounded: 10,
    trainTimeBase: 10,
    trainTimePerSoldier: 2
  },

  // ---------- Fleet System ----------
  FLEET: {
    ships: [
      { id: 0, nameEn: "Transport", nameZh: "运输舰", unlockRank: 1, maxLevel: 15 },
      { id: 1, nameEn: "Frigate", nameZh: "护卫舰", unlockRank: 1, maxLevel: 15 },
      { id: 2, nameEn: "Destroyer", nameZh: "驱逐舰", unlockRank: 1, maxLevel: 15 },
      { id: 3, nameEn: "Cruiser", nameZh: "巡洋舰", unlockRank: 4, maxLevel: 15 },
      { id: 4, nameEn: "Battleship", nameZh: "战列舰", unlockRank: 4, maxLevel: 15 },
      { id: 5, nameEn: "Carrier", nameZh: "航空母舰", unlockRank: 4, maxLevel: 15 },
      { id: 6, nameEn: "Submarine", nameZh: "核潜艇", unlockRank: 7, maxLevel: 15 },
      { id: 7, nameEn: "Missile", nameZh: "导弹巡洋舰", unlockRank: 7, maxLevel: 15 },
      { id: 8, nameEn: "DroneFleet", nameZh: "无人舰队", unlockRank: 7, maxLevel: 15 },
      { id: 9, nameEn: "Orbital", nameZh: "轨道炮舰", unlockRank: 10, maxLevel: 15 },
      { id: 10, nameEn: "StarCarrier", nameZh: "太空母舰", unlockRank: 10, maxLevel: 15 },
      { id: 11, nameEn: "StarBattleship", nameZh: "星际战列舰", unlockRank: 10, maxLevel: 15 },
      { id: 12, nameEn: "StarDestroyer", nameZh: "歼星舰", unlockRank: 13, maxLevel: 15 },
      { id: 13, nameEn: "Flagship", nameZh: "旗舰", unlockRank: 13, maxLevel: 15 },
      { id: 14, nameEn: "SuperCarrier", nameZh: "超级航母", unlockRank: 13, maxLevel: 15 },
      { id: 15, nameEn: "Dreadnought", nameZh: "无畏舰", unlockRank: 15, maxLevel: 15 }
    ],
    upgradeGoldBase: 500,
    upgradeIronBase: 50,
    upgradeCostMultiplier: 1.25,
    cpPerLevel: 2,
    upgradeTimeBase: 30,
    upgradeTimeMultiplier: 1.3
  },

  // ---------- Tech Tree ----------
  TECH: {
    lines: [
      { id: 'firepower', nameEn: 'Firepower', nameZh: '火力', unlockRank: 2, effect: 'cp' },
      { id: 'armor', nameEn: 'Armor', nameZh: '装甲', unlockRank: 4, effect: 'armor' },
      { id: 'logistics', nameEn: 'Logistics', nameZh: '后勤', unlockRank: 6, effect: 'income' },
      { id: 'radar', nameEn: 'Radar', nameZh: '雷达', unlockRank: 8, effect: 'radar' },
      { id: 'ai', nameEn: 'AI', nameZh: 'AI', unlockRank: 10, effect: 'ai' },
      { id: 'drone', nameEn: 'Drone', nameZh: '无人机', unlockRank: 12, effect: 'cp' },
      { id: 'missile', nameEn: 'Missile', nameZh: '导弹', unlockRank: 14, effect: 'boss' },
      { id: 'nuclear', nameEn: 'Nuclear', nameZh: '核科技', unlockRank: 16, effect: 'all' }
    ],
    maxLevel: 40,
    upgradeGoldBase: 1000,
    upgradeCostMultiplier: 1.20,
    techPointCostPerLevel: 1,
    effectPerLevel: {
      cp: 2,
      armor: 0.02,
      income: 0.03,
      radar: 0.01,
      ai: 0.02,
      boss: 0.05,
      all: 0.01
    },
    researchTimeBase: 60,
    researchTimeMultiplier: 1.25
  },

  // ---------- Equipment System ----------
  EQUIPMENT: {
    types: [
      { id: 'weapon', nameEn: 'Weapon', nameZh: '武器', unlockRank: 1, effect: 'cp', icon: '🗡️' },
      { id: 'armor', nameEn: 'Armor', nameZh: '护甲', unlockRank: 3, effect: 'armor', icon: '🛡️' },
      { id: 'auxiliary', nameEn: 'Auxiliary', nameZh: '辅助装备', unlockRank: 5, effect: 'income', icon: '🔭' },
      { id: 'accessory', nameEn: 'Accessory', nameZh: '饰品', unlockRank: 7, effect: 'boss', icon: '💍' },
      { id: 'engine', nameEn: 'Engine', nameZh: '引擎', unlockRank: 9, effect: 'efficiency', icon: '⚡' },
      { id: 'core', nameEn: 'Core', nameZh: '核心', unlockRank: 11, effect: 'all', icon: '🔮' }
    ],
    maxLevel: 12,
    upgradeGoldBase: 200,
    upgradeIronBase: 20,
    upgradeCostMultiplier: 1.30,
    effectPerLevel: {
      cp: 2,
      armor: 0.02,
      income: 0.03,
      boss: 0.05,
      efficiency: 0.02,
      all: 0.02
    },
    specialBonus: {
      cp: { base: 0, perLevel: 0.5 },
      armor: { base: 0, perLevel: 0.005 },
      income: { base: 0, perLevel: 0.01 },
      boss: { base: 0, perLevel: 0.02 },
      efficiency: { base: 0, perLevel: 0.01 },
      all: { base: 0, perLevel: 0.01 }
    },
    names: {
      weapon: [
        { nameEn: 'Combat Knife', nameZh: '军刀' },
        { nameEn: 'Pistol', nameZh: '手枪' },
        { nameEn: 'Assault Rifle', nameZh: '步枪' },
        { nameEn: 'Sniper Rifle', nameZh: '狙击枪' },
        { nameEn: 'Machine Gun', nameZh: '机枪' },
        { nameEn: 'Rocket Launcher', nameZh: '火箭筒' },
        { nameEn: 'Energy Sword', nameZh: '能量剑' },
        { nameEn: 'Plasma Cannon', nameZh: '等离子炮' },
        { nameEn: 'Railgun', nameZh: '电磁轨道炮' },
        { nameEn: 'Particle Beam', nameZh: '粒子光束炮' },
        { nameEn: 'Antimatter Cannon', nameZh: '反物质炮' },
        { nameEn: 'Star Destroyer', nameZh: '星际毁灭者' }
      ],
      armor: [
        { nameEn: 'Cloth Armor', nameZh: '布甲' },
        { nameEn: 'Leather Armor', nameZh: '皮甲' },
        { nameEn: 'Chain Mail', nameZh: '链甲' },
        { nameEn: 'Plate Armor', nameZh: '板甲' },
        { nameEn: 'Alloy Armor', nameZh: '合金甲' },
        { nameEn: 'Ceramic Composite', nameZh: '陶瓷复合甲' },
        { nameEn: 'Energy Shield', nameZh: '能量护盾' },
        { nameEn: 'Plasma Armor', nameZh: '等离子护甲' },
        { nameEn: 'Nano Armor', nameZh: '纳米装甲' },
        { nameEn: 'Force Field', nameZh: '力场护盾' },
        { nameEn: 'Quantum Armor', nameZh: '量子装甲' },
        { nameEn: 'Stellar Armor', nameZh: '星穹圣甲' }
      ],
      auxiliary: [
        { nameEn: 'Binoculars', nameZh: '望远镜' },
        { nameEn: 'Scout Drone', nameZh: '侦察无人机' },
        { nameEn: 'Battle Radar', nameZh: '战场雷达' },
        { nameEn: 'Tactical AI', nameZh: '战术AI' },
        { nameEn: 'Comm Satellite', nameZh: '通讯卫星' },
        { nameEn: 'Orbital Recon', nameZh: '轨道侦察站' },
        { nameEn: 'Star Scanner', nameZh: '星际扫描仪' },
        { nameEn: 'Holo-Command', nameZh: '全息指挥台' },
        { nameEn: 'Quantum Computer', nameZh: '量子计算机' },
        { nameEn: 'Precog Algorithm', nameZh: '预知算法' },
        { nameEn: 'Temporal Calculator', nameZh: '时空计算器' },
        { nameEn: 'Cosmic Truth Engine', nameZh: '宇宙真理引擎' }
      ],
      accessory: [
        { nameEn: 'Lucky Charm', nameZh: '幸运护符' },
        { nameEn: 'Courage Badge', nameZh: '勇气徽章' },
        { nameEn: 'Ring of Power', nameZh: '力量戒指' },
        { nameEn: 'War Talisman', nameZh: '战争护符' },
        { nameEn: 'Dragon Scale', nameZh: '龙鳞吊坠' },
        { nameEn: 'Phoenix Feather', nameZh: '凤凰羽饰' },
        { nameEn: 'Shadow Mark', nameZh: '暗影印记' },
        { nameEn: 'Star Shard', nameZh: '星辰碎片' },
        { nameEn: 'Time Key', nameZh: '时空钥匙' },
        { nameEn: 'Chaos Orb', nameZh: '混沌宝珠' },
        { nameEn: 'Genesis Shard', nameZh: '创世碎片' },
        { nameEn: 'Infinity Gem', nameZh: '无限宝石' }
      ],
      engine: [
        { nameEn: 'Basic Engine', nameZh: '基础引擎' },
        { nameEn: 'Turbo Engine', nameZh: '涡轮引擎' },
        { nameEn: 'Ion Engine', nameZh: '离子引擎' },
        { nameEn: 'Plasma Engine', nameZh: '等离子引擎' },
        { nameEn: 'Warp Engine', nameZh: '曲速引擎' },
        { nameEn: 'Antimatter Engine', nameZh: '反物质引擎' },
        { nameEn: 'Quantum Engine', nameZh: '量子引擎' },
        { nameEn: 'Temporal Engine', nameZh: '时空引擎' },
        { nameEn: 'Dimensional Engine', nameZh: '维度引擎' },
        { nameEn: 'Zero-Point Engine', nameZh: '零点引擎' },
        { nameEn: 'Genesis Engine', nameZh: '创世引擎' },
        { nameEn: 'Eternal Engine', nameZh: '永恒引擎' }
      ],
      core: [
        { nameEn: 'Energy Core', nameZh: '能量核心' },
        { nameEn: 'Forge Core', nameZh: '熔炉核心' },
        { nameEn: 'Stellar Core', nameZh: '恒星核心' },
        { nameEn: 'Galactic Core', nameZh: '星系核心' },
        { nameEn: 'Black Hole Core', nameZh: '黑洞核心' },
        { nameEn: 'Pulsar Core', nameZh: '脉冲核心' },
        { nameEn: 'Supernova Core', nameZh: '超新星核心' },
        { nameEn: 'Quantum Core', nameZh: '量子核心' },
        { nameEn: 'Temporal Core', nameZh: '时空核心' },
        { nameEn: 'Dimensional Core', nameZh: '维度核心' },
        { nameEn: 'Genesis Core', nameZh: '创世核心' },
        { nameEn: 'Cosmic Core', nameZh: '宇宙核心' }
      ]
    },
    upgradeTimeBase: 15,
    upgradeTimeMultiplier: 1.35
  },

  // ---------- Upgrade Queue ----------
  UPGRADE_QUEUE: {
    adReduceTime: 14400,
    adCooldown: 300,
    maxConcurrent: 3
  },

  // ---------- Daily Quests ----------
  DAILY: {
    tasks: [
      { id: 'kill', nameEn: 'Defeat Enemies', nameZh: '击杀敌人', target: 100, icon: '💀' },
      { id: 'boss', nameEn: 'Defeat Bosses', nameZh: '击败Boss', target: 3, icon: '👹' },
      { id: 'gold', nameEn: 'Earn Gold', nameZh: '获得金币', target: 10000, icon: '💰' },
      { id: 'ad', nameEn: 'Watch Ads', nameZh: '观看广告', target: 3, icon: '📺' },
      { id: 'building', nameEn: 'Upgrade Buildings', nameZh: '升级建筑', target: 5, icon: '🏗️' },
      { id: 'soldier', nameEn: 'Train Soldiers', nameZh: '训练士兵', target: 10, icon: '🪖' },
      { id: 'equipment', nameEn: 'Upgrade Equipment', nameZh: '升级装备', target: 3, icon: '🗡️' },
      { id: 'tech', nameEn: 'Research Tech', nameZh: '研究科技', target: 2, icon: '🔬' }
    ],
    rewards: {
      gold: [500, 1000, 800, 600, 700, 500, 900, 1000],
      exp: [300, 500, 400, 200, 300, 400, 500, 600],
      iron: [0, 0, 0, 50, 0, 0, 0, 0],
      rice: [0, 0, 0, 0, 0, 200, 0, 0],
      techPoints: [0, 0, 0, 0, 0, 0, 0, 2]
    }
  },

  // ---------- Boss System ----------
  BOSS: {
    interval: 600,
    hpBase: 50,
    hpPerRank: 30,
    hpPerStar: 20,
    goldBase: 50,
    goldPerRank: 30,
    expBase: 100,
    expPerRank: 50
  },

  // ---------- Events System ----------
  EVENTS: {
    minInterval: 30,
    maxInterval: 120,
    cooldown: 30
  },

  // ---------- Ads System ----------
  ADS: {
    cooldown: 5,
    maxDailyAds: 20,
    simDelay: 1500
  },

  // ---------- Offline ----------
  OFFLINE: {
    maxSeconds: 43200 // 12 小时
  },

  // ===== ★★★ Part 12: 转生系统配置 ★★★ =====
  PRESTIGE: {
    // 需要达到的军阶才能转生（49 = 最终军阶）
    minRank: 49,
    // 每枚勋章的资源产出加成（百分比）
    bonusPerMedal: 5.0, // 500%
    // 转生重置保留的资源（部分保留）
    keepGoldPercent: 0.1, // 保留 10% 金币
    // 最大转生次数（防止无限增长）
    maxPrestige: 20
  },

  // ---------- Starting Values ----------
  STARTING: {
    gold: 1000,
    exp: 0,
    iron: 0,
    rice: 100,
    soldiers: 0,
    wounded: 0,
    fleet: {},
    tech: {},
    equipment: {},
    techPoints: 0,
    adCount: 0,
    loginDays: 0,
    upgradeQueue: [],
    // ★★★ 转生数据 ★★★
    prestigeCount: 0,
    prestigeMedals: 0,
    prestigeHistory: []
  },

  // ---------- Combat ----------
  COMBAT: {
    expGainBase: 1,
    expGainPerRank: 0.5,
    goldGainBase: 0.5,
    goldGainPerRank: 0.3
  }
};