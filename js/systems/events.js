// ============================================================
// events.js — 随机事件系统 (Part 16 - 电影化事件)
// 所有事件名称和描述已升级为电影化风格
// ============================================================

// ===== 事件类型定义 =====
const EVENT_TYPES = {
  GOOD: 'good',       // 🟢 好事件 (40%)
  NORMAL: 'normal',   // 🟡 普通事件 (40%)
  BAD: 'bad',         // 🔴 坏事件 (20%)
  LEGENDARY: 'legendary' // 🟥 超级稀有 (0.1%)
};

const EVENT_TYPE_ICONS = {
  good: '🟢',
  normal: '🟡',
  bad: '🔴',
  legendary: '🟥'
};

const EVENT_TYPE_COLORS = {
  good: '#7bed9f',
  normal: '#f5d742',
  bad: '#ff6b6b',
  legendary: '#ff0040'
};

const EVENT_TYPE_BORDER_COLORS = {
  good: 'rgba(123,237,159,0.3)',
  normal: 'rgba(245,215,66,0.3)',
  bad: 'rgba(255,107,107,0.3)',
  legendary: 'rgba(255,0,64,0.6)'
};

// ===== 电影化事件池 =====
function generateEventPool() {
  const events = [];

  // ===== 1. 🟢 好事件 (40个) - 电影化命名 =====
  const goodEvents = [
    {
      id: 'spy_intel',
      icon: '🕵️',
      titleKey: 'evt_spy_intel',
      descKey: 'evt_spy_intel_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const gold = randomBetween(500, 3000);
        const exp = randomBetween(300, 1500);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(1500, 8000);
        const exp = randomBetween(800, 4000);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'gold_mine',
      icon: '⛏️',
      titleKey: 'evt_gold_mine',
      descKey: 'evt_gold_mine_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const gold = randomBetween(1000, 5000);
        player.gold += gold;
        return { gold, message: '+' + formatNumber(gold) + '💰' };
      },
      adReward: function() {
        const gold = randomBetween(3000, 12000);
        player.gold += gold;
        return { gold, message: '+' + formatNumber(gold) + '💰 (Ad Bonus!)' };
      }
    },
    {
      id: 'united_nations',
      icon: '🌍',
      titleKey: 'evt_united_nations',
      descKey: 'evt_united_nations_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const gold = randomBetween(500, 2000);
        const iron = randomBetween(50, 200);
        const rice = randomBetween(100, 400);
        player.gold += gold;
        player.iron += iron;
        player.rice += rice;
        return { gold, iron, rice, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const gold = randomBetween(1500, 6000);
        const iron = randomBetween(150, 600);
        const rice = randomBetween(300, 1200);
        player.gold += gold;
        player.iron += iron;
        player.rice += rice;
        return { gold, iron, rice, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾 (Ad Bonus!)' };
      }
    },
    {
      id: 'scientist_joins',
      icon: '👨‍🔬',
      titleKey: 'evt_scientist_joins',
      descKey: 'evt_scientist_joins_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const techPoints = randomBetween(1, 5);
        player.techPoints = (player.techPoints || 0) + techPoints;
        return { techPoints, message: '+' + techPoints + '⚡' };
      },
      adReward: function() {
        const techPoints = randomBetween(3, 12);
        player.techPoints = (player.techPoints || 0) + techPoints;
        return { techPoints, message: '+' + techPoints + '⚡ (Ad Bonus!)' };
      }
    },
    {
      id: 'morale_boost',
      icon: '🎖️',
      titleKey: 'evt_morale_boost',
      descKey: 'evt_morale_boost_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const exp = randomBetween(500, 2500);
        player.exp += exp;
        return { exp, message: '+' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const exp = randomBetween(1500, 6000);
        player.exp += exp;
        return { exp, message: '+' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'weapon_test',
      icon: '🔫',
      titleKey: 'evt_weapon_test',
      descKey: 'evt_weapon_test_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const exp = randomBetween(400, 2000);
        const cp = randomBetween(1, 10);
        player.exp += exp;
        player.combatPower = (player.combatPower || 10) + cp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { exp, cp, message: '+' + formatNumber(exp) + 'EXP +' + cp + ' CP' };
      },
      adReward: function() {
        const exp = randomBetween(1200, 5000);
        const cp = randomBetween(3, 20);
        player.exp += exp;
        player.combatPower = (player.combatPower || 10) + cp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { exp, cp, message: '+' + formatNumber(exp) + 'EXP +' + cp + ' CP (Ad Bonus!)' };
      }
    },
    {
      id: 'supply_drop',
      icon: '📦',
      titleKey: 'evt_supply_drop',
      descKey: 'evt_supply_drop_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const gold = randomBetween(300, 1500);
        const iron = randomBetween(30, 150);
        const rice = randomBetween(50, 250);
        player.gold += gold;
        player.iron += iron;
        player.rice += rice;
        return { gold, iron, rice, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const gold = randomBetween(900, 4500);
        const iron = randomBetween(90, 450);
        const rice = randomBetween(150, 750);
        player.gold += gold;
        player.iron += iron;
        player.rice += rice;
        return { gold, iron, rice, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾 (Ad Bonus!)' };
      }
    },
    {
      id: 'scout_returns',
      icon: '🔭',
      titleKey: 'evt_scout_returns',
      descKey: 'evt_scout_returns_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const exp = randomBetween(600, 3000);
        const gold = randomBetween(200, 1000);
        player.exp += exp;
        player.gold += gold;
        return { exp, gold, message: '+' + formatNumber(exp) + 'EXP +' + formatNumber(gold) + '💰' };
      },
      adReward: function() {
        const exp = randomBetween(1800, 8000);
        const gold = randomBetween(600, 3000);
        player.exp += exp;
        player.gold += gold;
        return { exp, gold, message: '+' + formatNumber(exp) + 'EXP +' + formatNumber(gold) + '💰 (Ad Bonus!)' };
      }
    },
    {
      id: 'enemy_armory',
      icon: '💣',
      titleKey: 'evt_enemy_armory',
      descKey: 'evt_enemy_armory_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const gold = randomBetween(800, 4000);
        const exp = randomBetween(200, 1000);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(2400, 10000);
        const exp = randomBetween(600, 3000);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'reinforcements',
      icon: '🚁',
      titleKey: 'evt_reinforcements',
      descKey: 'evt_reinforcements_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const soldiers = randomBetween(1, 8);
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers, message: '+' + soldiers + '🪖' };
      },
      adReward: function() {
        const soldiers = randomBetween(3, 20);
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers, message: '+' + soldiers + '🪖 (Ad Bonus!)' };
      }
    },
    {
      id: 'treasure_map',
      icon: '🗺️',
      titleKey: 'evt_treasure_map',
      descKey: 'evt_treasure_map_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const gold = randomBetween(1000, 6000);
        const exp = randomBetween(300, 1500);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(3000, 15000);
        const exp = randomBetween(900, 4000);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'training_camp',
      icon: '🏋️',
      titleKey: 'evt_training_camp',
      descKey: 'evt_training_camp_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const exp = randomBetween(300, 1800);
        const cp = randomBetween(1, 8);
        player.exp += exp;
        player.combatPower = (player.combatPower || 10) + cp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { exp, cp, message: '+' + formatNumber(exp) + 'EXP +' + cp + ' CP' };
      },
      adReward: function() {
        const exp = randomBetween(900, 5000);
        const cp = randomBetween(3, 18);
        player.exp += exp;
        player.combatPower = (player.combatPower || 10) + cp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { exp, cp, message: '+' + formatNumber(exp) + 'EXP +' + cp + ' CP (Ad Bonus!)' };
      }
    },
    {
      id: 'trading_post',
      icon: '🏪',
      titleKey: 'evt_trading_post',
      descKey: 'evt_trading_post_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const iron = randomBetween(50, 300);
        const rice = randomBetween(100, 500);
        player.iron += iron;
        player.rice += rice;
        return { iron, rice, message: '+' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const iron = randomBetween(150, 800);
        const rice = randomBetween(300, 1500);
        player.iron += iron;
        player.rice += rice;
        return { iron, rice, message: '+' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾 (Ad Bonus!)' };
      }
    },
    {
      id: 'diplomatic_mission',
      icon: '🤝',
      titleKey: 'evt_diplomatic_mission',
      descKey: 'evt_diplomatic_mission_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const gold = randomBetween(400, 2000);
        const exp = randomBetween(200, 1000);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(1200, 6000);
        const exp = randomBetween(600, 3000);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'engineering_breakthrough',
      icon: '⚙️',
      titleKey: 'evt_engineering_breakthrough',
      descKey: 'evt_engineering_breakthrough_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const exp = randomBetween(500, 2500);
        const techPoints = randomBetween(1, 3);
        player.exp += exp;
        player.techPoints = (player.techPoints || 0) + techPoints;
        return { exp, techPoints, message: '+' + formatNumber(exp) + 'EXP +' + techPoints + '⚡' };
      },
      adReward: function() {
        const exp = randomBetween(1500, 6000);
        const techPoints = randomBetween(3, 8);
        player.exp += exp;
        player.techPoints = (player.techPoints || 0) + techPoints;
        return { exp, techPoints, message: '+' + formatNumber(exp) + 'EXP +' + techPoints + '⚡ (Ad Bonus!)' };
      }
    },
    {
      id: 'medical_supplies',
      icon: '💊',
      titleKey: 'evt_medical_supplies',
      descKey: 'evt_medical_supplies_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const rice = randomBetween(50, 300);
        const soldiers = randomBetween(1, 3);
        player.rice += rice;
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { rice, soldiers, message: '+' + formatNumber(rice) + '🌾 +' + soldiers + '🪖' };
      },
      adReward: function() {
        const rice = randomBetween(150, 800);
        const soldiers = randomBetween(3, 10);
        player.rice += rice;
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { rice, soldiers, message: '+' + formatNumber(rice) + '🌾 +' + soldiers + '🪖 (Ad Bonus!)' };
      }
    },
    {
      id: 'strategic_position',
      icon: '🏔️',
      titleKey: 'evt_strategic_position',
      descKey: 'evt_strategic_position_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const cp = randomBetween(2, 15);
        player.combatPower = (player.combatPower || 10) + cp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { cp, message: '+' + cp + ' CP' };
      },
      adReward: function() {
        const cp = randomBetween(6, 35);
        player.combatPower = (player.combatPower || 10) + cp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { cp, message: '+' + cp + ' CP (Ad Bonus!)' };
      }
    },
    {
      id: 'war_hero',
      icon: '🎖️',
      titleKey: 'evt_war_hero',
      descKey: 'evt_war_hero_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const exp = randomBetween(800, 4000);
        const gold = randomBetween(300, 1500);
        player.exp += exp;
        player.gold += gold;
        return { exp, gold, message: '+' + formatNumber(exp) + 'EXP +' + formatNumber(gold) + '💰' };
      },
      adReward: function() {
        const exp = randomBetween(2400, 10000);
        const gold = randomBetween(900, 4000);
        player.exp += exp;
        player.gold += gold;
        return { exp, gold, message: '+' + formatNumber(exp) + 'EXP +' + formatNumber(gold) + '💰 (Ad Bonus!)' };
      }
    },
    {
      id: 'crops_harvest',
      icon: '🌾',
      titleKey: 'evt_crops_harvest',
      descKey: 'evt_crops_harvest_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const rice = randomBetween(100, 600);
        player.rice += rice;
        return { rice, message: '+' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const rice = randomBetween(300, 1500);
        player.rice += rice;
        return { rice, message: '+' + formatNumber(rice) + '🌾 (Ad Bonus!)' };
      }
    },
    {
      id: 'iron_vein',
      icon: '⛏️',
      titleKey: 'evt_iron_vein',
      descKey: 'evt_iron_vein_desc',
      type: EVENT_TYPES.GOOD,
      reward: function() {
        const iron = randomBetween(50, 300);
        player.iron += iron;
        return { iron, message: '+' + formatNumber(iron) + '⛏️' };
      },
      adReward: function() {
        const iron = randomBetween(150, 800);
        player.iron += iron;
        return { iron, message: '+' + formatNumber(iron) + '⛏️ (Ad Bonus!)' };
      }
    }
  ];

  // ===== 2. 🟡 普通事件 (40个) =====
  const normalEvents = [
    {
      id: 'civilian_plea',
      icon: '👥',
      titleKey: 'evt_civilian_plea',
      descKey: 'evt_civilian_plea_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(100, 500);
        const exp = randomBetween(50, 300);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(300, 1500);
        const exp = randomBetween(150, 800);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'merchant_visit',
      icon: '🧳',
      titleKey: 'evt_merchant_visit',
      descKey: 'evt_merchant_visit_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const cost = randomBetween(200, 1000);
        if (player.gold < cost) {
          return { fail: true, message: 'Not enough gold!' };
        }
        player.gold -= cost;
        const exp = cost * 1.5;
        player.exp += Math.floor(exp);
        return { gold: -cost, exp: Math.floor(exp), message: '-' + formatNumber(cost) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const cost = randomBetween(100, 500);
        if (player.gold < cost) {
          return { fail: true, message: 'Not enough gold!' };
        }
        player.gold -= cost;
        const exp = cost * 3;
        player.exp += Math.floor(exp);
        return { gold: -cost, exp: Math.floor(exp), message: '-' + formatNumber(cost) + '💰 +' + formatNumber(exp) + 'EXP (Ad Discount!)' };
      }
    },
    {
      id: 'abandoned_base',
      icon: '🏚️',
      titleKey: 'evt_abandoned_base',
      descKey: 'evt_abandoned_base_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(200, 1000);
        const exp = randomBetween(100, 500);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(600, 3000);
        const exp = randomBetween(300, 1500);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'recruit_volunteers',
      icon: '🪖',
      titleKey: 'evt_recruit_volunteers',
      descKey: 'evt_recruit_volunteers_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const soldiers = randomBetween(1, 3);
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers, message: '+' + soldiers + '🪖' };
      },
      adReward: function() {
        const soldiers = randomBetween(3, 8);
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers, message: '+' + soldiers + '🪖 (Ad Bonus!)' };
      }
    },
    {
      id: 'pmc_contract',
      icon: '📋',
      titleKey: 'evt_pmc_contract',
      descKey: 'evt_pmc_contract_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(300, 1500);
        const exp = randomBetween(150, 800);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(900, 4000);
        const exp = randomBetween(450, 2000);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'refugee_camp',
      icon: '⛺',
      titleKey: 'evt_refugee_camp',
      descKey: 'evt_refugee_camp_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const rice = randomBetween(50, 200);
        const soldiers = randomBetween(1, 2);
        player.rice += rice;
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { rice, soldiers, message: '+' + formatNumber(rice) + '🌾 +' + soldiers + '🪖' };
      },
      adReward: function() {
        const rice = randomBetween(150, 600);
        const soldiers = randomBetween(3, 6);
        player.rice += rice;
        player.soldiers = (player.soldiers || 0) + soldiers;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { rice, soldiers, message: '+' + formatNumber(rice) + '🌾 +' + soldiers + '🪖 (Ad Bonus!)' };
      }
    },
    {
      id: 'lost_convoy',
      icon: '🚚',
      titleKey: 'evt_lost_convoy',
      descKey: 'evt_lost_convoy_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(150, 800);
        const iron = randomBetween(20, 100);
        player.gold += gold;
        player.iron += iron;
        return { gold, iron, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️' };
      },
      adReward: function() {
        const gold = randomBetween(450, 2400);
        const iron = randomBetween(60, 300);
        player.gold += gold;
        player.iron += iron;
        return { gold, iron, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️ (Ad Bonus!)' };
      }
    },
    {
      id: 'deserters',
      icon: '🏃',
      titleKey: 'evt_deserters',
      descKey: 'evt_deserters_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const soldiers = randomBetween(1, 2);
        const gold = randomBetween(50, 200);
        player.soldiers = (player.soldiers || 0) + soldiers;
        player.gold += gold;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers, gold, message: '+' + soldiers + '🪖 +' + formatNumber(gold) + '💰' };
      },
      adReward: function() {
        const soldiers = randomBetween(2, 5);
        const gold = randomBetween(150, 600);
        player.soldiers = (player.soldiers || 0) + soldiers;
        player.gold += gold;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers, gold, message: '+' + soldiers + '🪖 +' + formatNumber(gold) + '💰 (Ad Bonus!)' };
      }
    },
    {
      id: 'radio_transmission',
      icon: '📻',
      titleKey: 'evt_radio_transmission',
      descKey: 'evt_radio_transmission_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const exp = randomBetween(200, 1000);
        const gold = randomBetween(100, 500);
        player.exp += exp;
        player.gold += gold;
        return { exp, gold, message: '+' + formatNumber(exp) + 'EXP +' + formatNumber(gold) + '💰' };
      },
      adReward: function() {
        const exp = randomBetween(600, 3000);
        const gold = randomBetween(300, 1500);
        player.exp += exp;
        player.gold += gold;
        return { exp, gold, message: '+' + formatNumber(exp) + 'EXP +' + formatNumber(gold) + '💰 (Ad Bonus!)' };
      }
    },
    {
      id: 'field_hospital',
      icon: '🏥',
      titleKey: 'evt_field_hospital',
      descKey: 'evt_field_hospital_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const healed = player.wounded || 0;
        if (healed > 0) {
          player.wounded = 0;
          return { wounded: -healed, message: '🏥 ' + (langCurrent === 'zh' ? '治愈了 ' + healed + ' 名伤兵' : 'Healed ' + healed + ' wounded soldiers') };
        }
        const rice = randomBetween(30, 150);
        player.rice += rice;
        return { rice, message: '+' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const healed = player.wounded || 0;
        if (healed > 0) {
          player.wounded = 0;
          const gold = randomBetween(100, 300);
          player.gold += gold;
          return { wounded: -healed, gold, message: '🏥 ' + (langCurrent === 'zh' ? '治愈了 ' + healed + ' 名伤兵 +' + formatNumber(gold) + '💰' : 'Healed ' + healed + ' wounded +' + formatNumber(gold) + '💰') };
        }
        const rice = randomBetween(90, 450);
        const gold = randomBetween(50, 200);
        player.rice += rice;
        player.gold += gold;
        return { rice, gold, message: '+' + formatNumber(rice) + '🌾 +' + formatNumber(gold) + '💰 (Ad Bonus!)' };
      }
    },
    {
      id: 'old_soldier',
      icon: '🧓',
      titleKey: 'evt_old_soldier',
      descKey: 'evt_old_soldier_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const exp = randomBetween(200, 1200);
        player.exp += exp;
        return { exp, message: '+' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const exp = randomBetween(600, 3600);
        player.exp += exp;
        return { exp, message: '+' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'storm_warning',
      icon: '🌩️',
      titleKey: 'evt_storm_warning',
      descKey: 'evt_storm_warning_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const rice = randomBetween(20, 100);
        const gold = randomBetween(50, 200);
        player.rice += rice;
        player.gold += gold;
        return { rice, gold, message: '+' + formatNumber(rice) + '🌾 +' + formatNumber(gold) + '💰' };
      },
      adReward: function() {
        const rice = randomBetween(60, 300);
        const gold = randomBetween(150, 600);
        player.rice += rice;
        player.gold += gold;
        return { rice, gold, message: '+' + formatNumber(rice) + '🌾 +' + formatNumber(gold) + '💰 (Ad Bonus!)' };
      }
    },
    {
      id: 'friendly_fire',
      icon: '🔥',
      titleKey: 'evt_friendly_fire',
      descKey: 'evt_friendly_fire_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const soldiers = randomBetween(1, 2);
        const exp = randomBetween(100, 500);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, exp, message: '-' + soldiers + '🪖 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const soldiers = randomBetween(1, 1);
        const exp = randomBetween(300, 1500);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, exp, message: '-' + soldiers + '🪖 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'black_market',
      icon: '🏴',
      titleKey: 'evt_black_market',
      descKey: 'evt_black_market_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const cost = randomBetween(300, 1500);
        if (player.gold < cost) {
          return { fail: true, message: 'Not enough gold!' };
        }
        player.gold -= cost;
        const iron = Math.floor(cost * 0.2);
        const rice = Math.floor(cost * 0.3);
        player.iron += iron;
        player.rice += rice;
        return { gold: -cost, iron, rice, message: '-' + formatNumber(cost) + '💰 +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const cost = randomBetween(150, 800);
        if (player.gold < cost) {
          return { fail: true, message: 'Not enough gold!' };
        }
        player.gold -= cost;
        const iron = Math.floor(cost * 0.5);
        const rice = Math.floor(cost * 0.8);
        player.iron += iron;
        player.rice += rice;
        return { gold: -cost, iron, rice, message: '-' + formatNumber(cost) + '💰 +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾 (Ad Bonus!)' };
      }
    },
    {
      id: 'supply_shortage',
      icon: '📉',
      titleKey: 'evt_supply_shortage',
      descKey: 'evt_supply_shortage_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(100, 500);
        const rice = randomBetween(20, 100);
        player.gold += gold;
        player.rice += rice;
        return { gold, rice, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const gold = randomBetween(300, 1500);
        const rice = randomBetween(60, 300);
        player.gold += gold;
        player.rice += rice;
        return { gold, rice, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(rice) + '🌾 (Ad Bonus!)' };
      }
    },
    {
      id: 'secret_tunnel',
      icon: '🚇',
      titleKey: 'evt_secret_tunnel',
      descKey: 'evt_secret_tunnel_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(150, 800);
        const exp = randomBetween(100, 400);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(450, 2400);
        const exp = randomBetween(300, 1200);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'ceasefire',
      icon: '🕊️',
      titleKey: 'evt_ceasefire',
      descKey: 'evt_ceasefire_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const exp = randomBetween(300, 1500);
        player.exp += exp;
        return { exp, message: '+' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const exp = randomBetween(900, 4500);
        player.exp += exp;
        return { exp, message: '+' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'ancient_ruins',
      icon: '🏛️',
      titleKey: 'evt_ancient_ruins',
      descKey: 'evt_ancient_ruins_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(200, 1200);
        const exp = randomBetween(150, 600);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(600, 3600);
        const exp = randomBetween(450, 1800);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'diplomatic_incident',
      icon: '📜',
      titleKey: 'evt_diplomatic_incident',
      descKey: 'evt_diplomatic_incident_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const gold = randomBetween(100, 500);
        const exp = randomBetween(100, 400);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const gold = randomBetween(300, 1500);
        const exp = randomBetween(300, 1200);
        player.gold += gold;
        player.exp += exp;
        return { gold, exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'wildlife_attack',
      icon: '🐺',
      titleKey: 'evt_wildlife_attack',
      descKey: 'evt_wildlife_attack_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const soldiers = randomBetween(1, 3);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, message: '-' + soldiers + '🪖' };
      },
      adReward: function() {
        const soldiers = randomBetween(1, 2);
        const exp = randomBetween(200, 800);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, exp, message: '-' + soldiers + '🪖 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'desert_storm',
      icon: '🌪️',
      titleKey: 'evt_desert_storm',
      descKey: 'evt_desert_storm_desc',
      type: EVENT_TYPES.NORMAL,
      reward: function() {
        const rice = randomBetween(20, 100);
        player.rice = Math.max(0, player.rice - rice);
        return { rice: -rice, message: '-' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const rice = randomBetween(10, 50);
        const exp = randomBetween(100, 400);
        player.rice = Math.max(0, player.rice - rice);
        player.exp += exp;
        return { rice: -rice, exp, message: '-' + formatNumber(rice) + '🌾 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    }
  ];

  // ===== 3. 🔴 坏事件 (20个) =====
  const badEvents = [
    {
      id: 'enemy_air_raid',
      icon: '✈️',
      titleKey: 'evt_enemy_air_raid',
      descKey: 'evt_enemy_air_raid_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const gold = randomBetween(100, 500);
        const soldiers = randomBetween(1, 4);
        player.gold = Math.max(0, player.gold - gold);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { gold: -gold, soldiers: -soldiers, message: '-' + formatNumber(gold) + '💰 -' + soldiers + '🪖' };
      },
      adReward: function() {
        const gold = randomBetween(50, 200);
        const soldiers = randomBetween(1, 2);
        player.gold = Math.max(0, player.gold - gold);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { gold: -gold, soldiers: -soldiers, message: '-' + formatNumber(gold) + '💰 -' + soldiers + '🪖 (Ad Reduced!)' };
      }
    },
    {
      id: 'convoy_ambushed',
      icon: '💥',
      titleKey: 'evt_convoy_ambushed',
      descKey: 'evt_convoy_ambushed_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const gold = randomBetween(200, 1000);
        const iron = randomBetween(30, 150);
        player.gold = Math.max(0, player.gold - gold);
        player.iron = Math.max(0, player.iron - iron);
        return { gold: -gold, iron: -iron, message: '-' + formatNumber(gold) + '💰 -' + formatNumber(iron) + '⛏️' };
      },
      adReward: function() {
        const gold = randomBetween(100, 500);
        const iron = randomBetween(15, 75);
        player.gold = Math.max(0, player.gold - gold);
        player.iron = Math.max(0, player.iron - iron);
        return { gold: -gold, iron: -iron, message: '-' + formatNumber(gold) + '💰 -' + formatNumber(iron) + '⛏️ (Ad Reduced!)' };
      }
    },
    {
      id: 'soldier_deserted',
      icon: '🏃‍♂️',
      titleKey: 'evt_soldier_deserted',
      descKey: 'evt_soldier_deserted_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const soldiers = randomBetween(1, 5);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, message: '-' + soldiers + '🪖' };
      },
      adReward: function() {
        const soldiers = randomBetween(1, 3);
        const exp = randomBetween(50, 200);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, exp, message: '-' + soldiers + '🪖 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'weapon_malfunction',
      icon: '🔧',
      titleKey: 'evt_weapon_malfunction',
      descKey: 'evt_weapon_malfunction_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const cp = randomBetween(2, 10);
        player.combatPower = Math.max(10, (player.combatPower || 10) - cp);
        return { cp: -cp, message: '-' + cp + ' CP' };
      },
      adReward: function() {
        const cp = randomBetween(1, 5);
        const exp = randomBetween(100, 400);
        player.combatPower = Math.max(10, (player.combatPower || 10) - cp);
        player.exp += exp;
        return { cp: -cp, exp, message: '-' + cp + ' CP +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'spy_caught',
      icon: '🔍',
      titleKey: 'evt_spy_caught',
      descKey: 'evt_spy_caught_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const techPoints = randomBetween(1, 3);
        player.techPoints = Math.max(0, (player.techPoints || 0) - techPoints);
        return { techPoints: -techPoints, message: '-' + techPoints + '⚡' };
      },
      adReward: function() {
        const techPoints = randomBetween(1, 2);
        const exp = randomBetween(100, 300);
        player.techPoints = Math.max(0, (player.techPoints || 0) - techPoints);
        player.exp += exp;
        return { techPoints: -techPoints, exp, message: '-' + techPoints + '⚡ +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'plague_outbreak',
      icon: '🦠',
      titleKey: 'evt_plague_outbreak',
      descKey: 'evt_plague_outbreak_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const soldiers = randomBetween(1, 6);
        const wounded = Math.floor(soldiers * 0.5);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.wounded = (player.wounded || 0) + wounded;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, wounded: +wounded, message: '-' + soldiers + '🪖 +' + wounded + '🏥' };
      },
      adReward: function() {
        const soldiers = randomBetween(1, 4);
        const wounded = Math.floor(soldiers * 0.3);
        const exp = randomBetween(100, 400);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.wounded = (player.wounded || 0) + wounded;
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, wounded: +wounded, exp, message: '-' + soldiers + '🪖 +' + wounded + '🏥 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'food_poisoning',
      icon: '🍽️',
      titleKey: 'evt_food_poisoning',
      descKey: 'evt_food_poisoning_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const rice = randomBetween(50, 200);
        player.rice = Math.max(0, player.rice - rice);
        return { rice: -rice, message: '-' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const rice = randomBetween(25, 100);
        const exp = randomBetween(100, 300);
        player.rice = Math.max(0, player.rice - rice);
        player.exp += exp;
        return { rice: -rice, exp, message: '-' + formatNumber(rice) + '🌾 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'sabotage',
      icon: '💣',
      titleKey: 'evt_sabotage',
      descKey: 'evt_sabotage_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const gold = randomBetween(300, 1200);
        player.gold = Math.max(0, player.gold - gold);
        return { gold: -gold, message: '-' + formatNumber(gold) + '💰' };
      },
      adReward: function() {
        const gold = randomBetween(150, 600);
        const exp = randomBetween(100, 300);
        player.gold = Math.max(0, player.gold - gold);
        player.exp += exp;
        return { gold: -gold, exp, message: '-' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'mutiny',
      icon: '⚔️',
      titleKey: 'evt_mutiny',
      descKey: 'evt_mutiny_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const soldiers = randomBetween(1, 8);
        const exp = randomBetween(50, 200);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, exp, message: '-' + soldiers + '🪖 +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const soldiers = randomBetween(1, 5);
        const exp = randomBetween(150, 500);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { soldiers: -soldiers, exp, message: '-' + soldiers + '🪖 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'mine_collapse',
      icon: '⛑️',
      titleKey: 'evt_mine_collapse',
      descKey: 'evt_mine_collapse_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const iron = randomBetween(50, 200);
        const soldiers = randomBetween(1, 3);
        player.iron = Math.max(0, player.iron - iron);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { iron: -iron, soldiers: -soldiers, message: '-' + formatNumber(iron) + '⛏️ -' + soldiers + '🪖' };
      },
      adReward: function() {
        const iron = randomBetween(25, 100);
        const soldiers = randomBetween(1, 2);
        const exp = randomBetween(100, 300);
        player.iron = Math.max(0, player.iron - iron);
        player.soldiers = Math.max(0, (player.soldiers || 0) - soldiers);
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { iron: -iron, soldiers: -soldiers, exp, message: '-' + formatNumber(iron) + '⛏️ -' + soldiers + '🪖 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'bandit_raid',
      icon: '🏴‍☠️',
      titleKey: 'evt_bandit_raid',
      descKey: 'evt_bandit_raid_desc',
      type: EVENT_TYPES.BAD,
      reward: function() {
        const gold = randomBetween(150, 600);
        const rice = randomBetween(30, 120);
        player.gold = Math.max(0, player.gold - gold);
        player.rice = Math.max(0, player.rice - rice);
        return { gold: -gold, rice: -rice, message: '-' + formatNumber(gold) + '💰 -' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const gold = randomBetween(75, 300);
        const rice = randomBetween(15, 60);
        const exp = randomBetween(100, 300);
        player.gold = Math.max(0, player.gold - gold);
        player.rice = Math.max(0, player.rice - rice);
        player.exp += exp;
        return { gold: -gold, rice: -rice, exp, message: '-' + formatNumber(gold) + '💰 -' + formatNumber(rice) + '🌾 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    }
  ];

  // ===== 4. 🟥 超级稀有事件 (3个) =====
  const legendaryEvents = [
    {
      id: 'nuclear_blueprint',
      icon: '☢️',
      titleKey: 'evt_nuclear_blueprint',
      descKey: 'evt_nuclear_blueprint_desc',
      type: EVENT_TYPES.LEGENDARY,
      reward: function() {
        const techPoints = randomBetween(100, 500);
        const exp = randomBetween(5000, 20000);
        player.techPoints = (player.techPoints || 0) + techPoints;
        player.exp += exp;
        return { techPoints, exp, message: '+' + techPoints + '⚡ +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const techPoints = randomBetween(200, 1000);
        const exp = randomBetween(10000, 40000);
        player.techPoints = (player.techPoints || 0) + techPoints;
        player.exp += exp;
        return { techPoints, exp, message: '+' + techPoints + '⚡ +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'alien_technology',
      icon: '👽',
      titleKey: 'evt_alien_technology',
      descKey: 'evt_alien_technology_desc',
      type: EVENT_TYPES.LEGENDARY,
      reward: function() {
        const techPoints = randomBetween(50, 300);
        const cp = randomBetween(10, 50);
        const exp = randomBetween(3000, 15000);
        player.techPoints = (player.techPoints || 0) + techPoints;
        player.combatPower = (player.combatPower || 10) + cp;
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { techPoints, cp, exp, message: '+' + techPoints + '⚡ +' + cp + ' CP +' + formatNumber(exp) + 'EXP' };
      },
      adReward: function() {
        const techPoints = randomBetween(150, 800);
        const cp = randomBetween(25, 120);
        const exp = randomBetween(8000, 35000);
        player.techPoints = (player.techPoints || 0) + techPoints;
        player.combatPower = (player.combatPower || 10) + cp;
        player.exp += exp;
        if (typeof calcCombatPower === 'function') {
          player.combatPower = calcCombatPower();
        }
        return { techPoints, cp, exp, message: '+' + techPoints + '⚡ +' + cp + ' CP +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
      }
    },
    {
      id: 'cosmic_rift',
      icon: '🌀',
      titleKey: 'evt_cosmic_rift',
      descKey: 'evt_cosmic_rift_desc',
      type: EVENT_TYPES.LEGENDARY,
      reward: function() {
        const gold = randomBetween(5000, 30000);
        const exp = randomBetween(5000, 20000);
        const techPoints = randomBetween(20, 100);
        const iron = randomBetween(500, 2000);
        const rice = randomBetween(1000, 4000);
        player.gold += gold;
        player.exp += exp;
        player.techPoints = (player.techPoints || 0) + techPoints;
        player.iron += iron;
        player.rice += rice;
        return { gold, exp, techPoints, iron, rice, message: '🌟 ' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP +' + techPoints + '⚡ +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾' };
      },
      adReward: function() {
        const gold = randomBetween(15000, 80000);
        const exp = randomBetween(15000, 50000);
        const techPoints = randomBetween(50, 250);
        const iron = randomBetween(1500, 5000);
        const rice = randomBetween(3000, 10000);
        player.gold += gold;
        player.exp += exp;
        player.techPoints = (player.techPoints || 0) + techPoints;
        player.iron += iron;
        player.rice += rice;
        return { gold, exp, techPoints, iron, rice, message: '🌟 ' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP +' + techPoints + '⚡ +' + formatNumber(iron) + '⛏️ +' + formatNumber(rice) + '🌾 (Ad Bonus!)' };
      }
    }
  ];

  // 合并所有事件
  events.push(...goodEvents, ...normalEvents, ...badEvents, ...legendaryEvents);
  return events;
}

// ===== 事件池 =====
let EVENT_POOL = [];

function initEventPool() {
  EVENT_POOL = generateEventPool();
  console.log('✅ 电影化事件池已生成: ' + EVENT_POOL.length + ' 个事件');
  console.log('  🟢 好事件: ' + EVENT_POOL.filter(e => e.type === 'good').length);
  console.log('  🟡 普通事件: ' + EVENT_POOL.filter(e => e.type === 'normal').length);
  console.log('  🔴 坏事件: ' + EVENT_POOL.filter(e => e.type === 'bad').length);
  console.log('  🟥 超级稀有: ' + EVENT_POOL.filter(e => e.type === 'legendary').length);
}

// ===== 获取随机事件 =====
function getRandomEvent() {
  if (EVENT_POOL.length === 0) {
    initEventPool();
  }

  const roll = Math.random();

  if (roll < 0.001) {
    const legendaryPool = EVENT_POOL.filter(e => e.type === EVENT_TYPES.LEGENDARY);
    if (legendaryPool.length > 0) {
      return legendaryPool[Math.floor(Math.random() * legendaryPool.length)];
    }
  }

  let typePool;
  if (roll < 0.4) {
    typePool = EVENT_POOL.filter(e => e.type === EVENT_TYPES.GOOD);
  } else if (roll < 0.8) {
    typePool = EVENT_POOL.filter(e => e.type === EVENT_TYPES.NORMAL);
  } else {
    typePool = EVENT_POOL.filter(e => e.type === EVENT_TYPES.BAD);
  }

  if (!typePool || typePool.length === 0) {
    const fallback = EVENT_POOL.filter(e => e.type === EVENT_TYPES.GOOD);
    return fallback[Math.floor(Math.random() * fallback.length)] || EVENT_POOL[0];
  }

  return typePool[Math.floor(Math.random() * typePool.length)];
}

// ===== 事件系统状态 =====
let currentEvent = null;
let eventActive = false;

// ===== 触发随机事件 =====
function triggerRandomEvent() {
  if (eventActive) return;
  if (!player) return;

  const mainView = document.getElementById('view-main');
  if (!mainView || mainView.style.display === 'none') return;

  const now = Date.now();
  const minInterval = CONFIG.EVENTS.minInterval || 30;
  if (now - (player.lastEventTime || 0) < minInterval * 1000) return;

  const event = getRandomEvent();
  if (!event) return;

  currentEvent = event;
  eventActive = true;
  player.lastEventTime = now;

  showEventPopup(event);
}

// ===== 显示电影化事件弹窗 =====
function showEventPopup(event) {
  const isZh = langCurrent === 'zh';
  const title = t(event.titleKey) || event.titleKey;
  const desc = t(event.descKey) || event.descKey;
  const type = event.type || 'normal';
  const borderColor = EVENT_TYPE_BORDER_COLORS[type] || 'rgba(255,255,255,0.1)';
  const icon = event.icon || '📢';
  const typeIcon = EVENT_TYPE_ICONS[type] || '';

  // 电影化标题装饰
  let titleDecoration = '';
  if (type === 'legendary') {
    titleDecoration = '✦ ' + title + ' ✦';
  } else if (type === 'good') {
    titleDecoration = '⭐ ' + title;
  } else if (type === 'bad') {
    titleDecoration = '⚡ ' + title;
  } else {
    titleDecoration = title;
  }

  // 根据类型添加引用风格
  let descStyle = '';
  if (type === 'legendary') {
    descStyle = 'font-style: italic; color: #ffd700;';
  } else if (type === 'good') {
    descStyle = 'color: #d0d5dd;';
  } else if (type === 'bad') {
    descStyle = 'color: #d0d5dd;';
  }

  // 超级稀有事件特殊效果
  let specialStyle = '';
  let specialBorder = '';
  if (type === 'legendary') {
    specialStyle = `
      border-color: ${borderColor} !important;
      box-shadow: 0 0 60px rgba(255,0,64,0.2), 0 0 120px rgba(255,0,64,0.05) !important;
      animation: guidePulse 1.5s infinite !important;
    `;
    specialBorder = `
      <div style="position:absolute; top:0; left:0; right:0; bottom:0; pointer-events:none; border-radius:16px; border:2px solid rgba(255,0,64,0.15);"></div>
      <div style="position:absolute; top:-2px; left:-2px; right:-2px; bottom:-2px; pointer-events:none; border-radius:18px; background: linear-gradient(45deg, transparent, rgba(255,0,64,0.05), transparent);"></div>
    `;
  }

  // 制作电影风格标题
  let titleHtml = '';
  if (type === 'legendary') {
    titleHtml = `<h2 style="color:#ff0040; margin:0 0 8px; font-size:1.4rem; text-shadow:0 0 30px rgba(255,0,64,0.3); letter-spacing:2px;">${titleDecoration}</h2>`;
  } else if (type === 'good') {
    titleHtml = `<h2 style="color:#7bed9f; margin:0 0 8px; font-size:1.3rem; text-shadow:0 0 20px rgba(123,237,159,0.15);">${titleDecoration}</h2>`;
  } else if (type === 'bad') {
    titleHtml = `<h2 style="color:#ff6b6b; margin:0 0 8px; font-size:1.3rem; text-shadow:0 0 20px rgba(255,107,107,0.15);">${titleDecoration}</h2>`;
  } else {
    titleHtml = `<h2 style="color:#f5d742; margin:0 0 8px; font-size:1.3rem; text-shadow:0 0 20px rgba(245,215,66,0.15);">${titleDecoration}</h2>`;
  }

  const modal = document.createElement('div');
  modal.id = 'event-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center;
    z-index: 9999; animation: fadeIn 0.4s ease;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  `;

  modal.innerHTML = `
    <div style="max-width:480px; width:90%; background:rgba(11,14,20,0.97); border-radius:16px; padding:32px 24px; border:2px solid ${borderColor}; text-align:center; box-shadow:0 0 60px rgba(0,0,0,0.9); position:relative; overflow:hidden; ${specialStyle}">
      ${specialBorder}
      <!-- 电影感顶部装饰 -->
      <div style="position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg, transparent, ${type === 'legendary' ? '#ff0040' : type === 'good' ? '#7bed9f' : type === 'bad' ? '#ff6b6b' : '#f5d742'}, transparent);"></div>
      <div style="font-size:3.5em; margin-bottom:6px; display:block;">${icon}</div>
      ${typeIcon ? `<div style="font-size:0.75rem; color:#666; margin-bottom:4px; letter-spacing:3px; text-transform:uppercase;">${typeIcon}</div>` : ''}
      ${titleHtml}
      <div style="position:relative;">
        <p style="color:#d0d5dd; line-height:1.8; margin:8px 0 20px; ${descStyle} font-size:1rem; padding:0 4px;">${desc}</p>
      </div>
      <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
        <button class="btn btn-ghost" onclick="claimEventReward(false);" style="min-width:80px;">${isZh ? '领取' : 'Claim'}</button>
        <button class="btn btn-gold" onclick="claimEventReward(true);" style="min-width:80px;">📺 ${isZh ? '双倍' : '×2'}</button>
        <button class="btn" style="background:rgba(255,255,255,0.05); min-width:80px;" onclick="dismissEvent();">${isZh ? '忽略' : 'Dismiss'}</button>
      </div>
      ${type === 'legendary' ? `<div style="margin-top:14px; font-size:0.65rem; color:#ff0040; font-weight:700; letter-spacing:4px; text-shadow:0 0 20px rgba(255,0,64,0.2);">✦ ${isZh ? '超级稀有事件' : 'LEGENDARY EVENT'} ✦</div>` : ''}
      ${type === 'good' ? `<div style="margin-top:10px; font-size:0.6rem; color:#7bed9f; opacity:0.3; letter-spacing:2px;">${isZh ? '好运降临' : 'FORTUNE FAVORS THE BOLD'}</div>` : ''}
      ${type === 'bad' ? `<div style="margin-top:10px; font-size:0.6rem; color:#ff6b6b; opacity:0.3; letter-spacing:2px;">${isZh ? '战争是残酷的' : 'WAR IS HELL'}</div>` : ''}
    </div>
  `;

  document.body.appendChild(modal);
}

// ===== 领取事件奖励 =====
function claimEventReward(withAd) {
  if (!currentEvent) return;

  if (withAd) {
    GameAds.reward('event', function() {
      const result = currentEvent.adReward();
      applyEventResult(result);
      if (typeof updateDailyProgress === 'function') {
        updateDailyProgress('ad', 1);
      }
      dismissEvent();
    }, function(err) {
      const result = currentEvent.reward();
      applyEventResult(result);
      dismissEvent();
    });
  } else {
    const result = currentEvent.reward();
    applyEventResult(result);
    dismissEvent();
  }
}

// ===== 应用事件结果 =====
function applyEventResult(result) {
  if (result && result.fail) {
    alert(result.message || 'Failed!');
    return;
  }
  if (result) {
    let msg = '🎁 ' + (result.message || 'Reward claimed!');
    if (result.gold !== undefined && result.gold !== 0) msg += ' | Gold: ' + (result.gold > 0 ? '+' : '') + formatNumber(result.gold);
    if (result.exp !== undefined && result.exp !== 0) msg += ' | EXP: ' + (result.exp > 0 ? '+' : '') + formatNumber(result.exp);
    if (result.iron !== undefined && result.iron !== 0) msg += ' | Iron: ' + (result.iron > 0 ? '+' : '') + formatNumber(result.iron);
    if (result.rice !== undefined && result.rice !== 0) msg += ' | Rice: ' + (result.rice > 0 ? '+' : '') + formatNumber(result.rice);
    if (result.soldiers !== undefined && result.soldiers > 0) msg += ' | Soldiers: +' + result.soldiers;
    if (result.cp !== undefined && result.cp > 0) msg += ' | CP: +' + result.cp;
    if (result.techPoints !== undefined && result.techPoints > 0) msg += ' | Tech Points: +' + result.techPoints;
    if (result.gold !== undefined && result.gold < 0) msg += ' | Gold: ' + result.gold;
    if (result.soldiers !== undefined && result.soldiers < 0) msg += ' | Soldiers: ' + result.soldiers;
    if (result.iron !== undefined && result.iron < 0) msg += ' | Iron: ' + result.iron;
    if (result.rice !== undefined && result.rice < 0) msg += ' | Rice: ' + result.rice;
    if (result.techPoints !== undefined && result.techPoints < 0) msg += ' | Tech Points: ' + result.techPoints;
    if (result.cp !== undefined && result.cp < 0) msg += ' | CP: ' + result.cp;

    showToast(msg, 4000);
    if (typeof updateUI === 'function') updateUI();
  }
}

// ===== 忽略事件 =====
function dismissEvent() {
  eventActive = false;
  currentEvent = null;
  const modal = document.getElementById('event-modal');
  if (modal) modal.remove();
}

// ===== 暴露到全局 =====
window.triggerRandomEvent = triggerRandomEvent;
window.claimEventReward = claimEventReward;
window.dismissEvent = dismissEvent;
window.eventActive = eventActive;
window.currentEvent = currentEvent;
window.getRandomEvent = getRandomEvent;
window.initEventPool = initEventPool;

// ===== 初始化 =====
initEventPool();

console.log('✅ 电影化事件系统已加载 (Part 16)');