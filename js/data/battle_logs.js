// ============================================================
// battle_logs.js — 1000 Battle Logs
// ============================================================

// ===== 日志模板 =====
const LOG_TEMPLATES = {
  // 击杀类
  kills: [
    "⚔️ 击败了 {enemy}，获得 {exp} 经验",
    "💀 消灭了 {enemy}，缴获 {gold} 金币",
    "🔥 击退了 {enemy} 的进攻，获得 {exp} 经验",
    "⚡ 闪电战！摧毁了 {enemy}，获得 {gold} 金币",
    "🎯 狙击手击毙 {enemy}，获得 {exp} 经验",
    "💣 空袭消灭了 {enemy}，获得 {gold} 金币",
    "🛡️ 防御战胜利！击退 {enemy}，获得 {exp} 经验",
    "🔫 遭遇战！击败 {enemy}，获得 {gold} 金币",
    "🚁 空中支援消灭 {enemy}，获得 {exp} 经验",
    "🏹 精准射击！消灭 {enemy}，获得 {gold} 金币"
  ],
  // 发现类
  discovers: [
    "🔍 发现废弃军火库，获得 {exp} 经验",
    "📦 找到补给箱！获得 {gold} 金币",
    "📡 截获敌方通讯，获得 {exp} 经验",
    "🗺️ 发现隐藏基地，获得 {gold} 金币",
    "💎 发现稀有矿脉，获得 {exp} 经验",
    "📜 找到古代战术手册，获得 {gold} 金币",
    "🔬 发现实验室遗迹，获得 {exp} 经验",
    "🚀 发现航天器残骸，获得 {gold} 金币"
  ],
  // 升级类
  upgrades: [
    "⬆ {item} 升级到 {level} 级！",
    "🔧 改进 {item}，等级提升到 {level}",
    "🚀 {item} 技术突破！达到 {level} 级",
    "💪 {item} 强化完成，当前等级 {level}",
    "⚙️ {item} 系统升级，等级 {level}"
  ],
  // 士兵类
  soldiers: [
    "🪖 新兵 {name} 加入部队",
    "🎖️ 士兵 {name} 晋升为下士",
    "⚕️ 医护兵 {name} 救治了 3 名伤员",
    "🏅 士兵 {name} 在战斗中表现出色",
    "💀 士兵 {name} 在行动中失踪",
    "🆘 士兵 {name} 请求支援",
    "📯 部队士气高涨！士兵 {name} 获得勋章"
  ],
  // 资源类
  resources: [
    "⛏️ 开采到 {amount} 铁矿",
    "🌾 收获 {amount} 稻米",
    "💰 发现 {amount} 金币矿脉",
    "⚡ 获得 {amount} 科技点",
    "📦 获得 {amount} 补给物资"
  ],
  // 事件类
  events: [
    "📢 前线报告：敌军正在集结",
    "🌊 沙尘暴来袭，部队行进受阻",
    "🌟 流星雨划过夜空，士兵们士气高涨",
    "📻 收到未知信号，正在解码...",
    "🔥 丛林大火逼近基地，紧急疏散",
    "🌙 月圆之夜，哨兵发现异常活动",
    "📰 战地记者到达前线",
    "🏴 发现敌方旗帜，正在追击"
  ]
};

// ===== 生成1000条日志 =====
function generateBattleLogs() {
  const logs = [];
  const enemies = [
    "叛军", "敌军步兵", "装甲车", "武装直升机", "坦克",
    "战斗机器人", "无人机", "火炮阵地", "狙击手", "特种部队",
    "雇佣兵", "强盗", "变种生物", "星际海盗", "机械军团",
    "暗影部队", "幽灵战士", "毁灭者", "收割者", "泰坦"
  ];
  const items = [
    "武器系统", "护甲", "引擎", "雷达", "AI系统",
    "无人机", "导弹系统", "核反应堆", "推进器", "护盾发生器"
  ];
  const names = [
    "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Riley", "Avery",
    "Quinn", "Parker", "Reese", "Charlie", "Dakota", "Skyler", "Rowan",
    "Emerson", "Sawyer", "Harper", "Phoenix", "River", "Wren"
  ];

  let logId = 0;

  // 生成击杀日志 (300条)
  for (let i = 0; i < 300; i++) {
    const template = LOG_TEMPLATES.kills[i % LOG_TEMPLATES.kills.length];
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const exp = Math.floor(10 + Math.random() * 190);
    const gold = Math.floor(5 + Math.random() * 95);
    const text = template.replace(/{enemy}/g, enemy).replace(/{exp}/g, exp).replace(/{gold}/g, gold);
    logs.push({ id: logId++, text: text, type: 'kill' });
  }

  // 生成发现日志 (150条)
  for (let i = 0; i < 150; i++) {
    const template = LOG_TEMPLATES.discovers[i % LOG_TEMPLATES.discovers.length];
    const exp = Math.floor(20 + Math.random() * 280);
    const gold = Math.floor(10 + Math.random() * 190);
    const text = template.replace(/{exp}/g, exp).replace(/{gold}/g, gold);
    logs.push({ id: logId++, text: text, type: 'discover' });
  }

  // 生成升级日志 (150条)
  for (let i = 0; i < 150; i++) {
    const template = LOG_TEMPLATES.upgrades[i % LOG_TEMPLATES.upgrades.length];
    const item = items[Math.floor(Math.random() * items.length)];
    const level = Math.floor(1 + Math.random() * 50);
    const text = template.replace(/{item}/g, item).replace(/{level}/g, level);
    logs.push({ id: logId++, text: text, type: 'upgrade' });
  }

  // 生成士兵日志 (150条)
  for (let i = 0; i < 150; i++) {
    const template = LOG_TEMPLATES.soldiers[i % LOG_TEMPLATES.soldiers.length];
    const name = names[Math.floor(Math.random() * names.length)];
    const text = template.replace(/{name}/g, name);
    logs.push({ id: logId++, text: text, type: 'soldier' });
  }

  // 生成资源日志 (150条)
  for (let i = 0; i < 150; i++) {
    const template = LOG_TEMPLATES.resources[i % LOG_TEMPLATES.resources.length];
    const amount = Math.floor(10 + Math.random() * 490);
    const text = template.replace(/{amount}/g, amount);
    logs.push({ id: logId++, text: text, type: 'resource' });
  }

  // 生成事件日志 (100条)
  for (let i = 0; i < 100; i++) {
    const template = LOG_TEMPLATES.events[i % LOG_TEMPLATES.events.length];
    const text = template;
    logs.push({ id: logId++, text: text, type: 'event' });
  }

  return logs;
}

// ===== 存储 =====
let BATTLE_LOGS = [];

function initBattleLogs() {
  BATTLE_LOGS = generateBattleLogs();
  console.log('📜 已生成 ' + BATTLE_LOGS.length + ' 条战斗日志');
}

function getRandomBattleLog() {
  if (BATTLE_LOGS.length === 0) {
    initBattleLogs();
  }
  return BATTLE_LOGS[Math.floor(Math.random() * BATTLE_LOGS.length)];
}

function getRecentBattleLogs(count) {
  if (BATTLE_LOGS.length === 0) {
    initBattleLogs();
  }
  return BATTLE_LOGS.slice(0, count);
}

// 初始化
initBattleLogs();