// ============================================================
// events.js — Random Events System (Part 8)
// ============================================================

// ---------- Event Definitions ----------
const EVENT_STORIES = [
  {
    id: 'airdrop',
    icon: '📦',
    titleKey: 'evt_airdrop_title',
    descKey: 'evt_airdrop_desc',
    reward: function() {
      const gold = randomBetween(500, 3000);
      const exp = randomBetween(200, 1000);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
    },
    adReward: function() {
      const gold = randomBetween(1500, 8000);
      const exp = randomBetween(500, 3000);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
    }
  },
  {
    id: 'scout',
    icon: '🔭',
    titleKey: 'evt_scout_title',
    descKey: 'evt_scout_desc',
    reward: function() {
      const exp = randomBetween(1000, 5000);
      player.exp += exp;
      return { exp: exp, message: '+' + formatNumber(exp) + 'EXP' };
    },
    adReward: function() {
      const exp = randomBetween(3000, 15000);
      player.exp += exp;
      return { exp: exp, message: '+' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
    }
  },
  {
    id: 'enemyTruck',
    icon: '🚛',
    titleKey: 'evt_enemyTruck_title',
    descKey: 'evt_enemyTruck_desc',
    reward: function() {
      const gold = randomBetween(800, 5000);
      const iron = randomBetween(50, 300);
      player.gold += gold;
      player.iron += iron;
      return { gold: gold, iron: iron, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️' };
    },
    adReward: function() {
      const gold = randomBetween(2000, 12000);
      const iron = randomBetween(150, 800);
      player.gold += gold;
      player.iron += iron;
      return { gold: gold, iron: iron, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(iron) + '⛏️ (Ad Bonus!)' };
    }
  },
  {
    id: 'armsDealer',
    icon: '🔫',
    titleKey: 'evt_armsDealer_title',
    descKey: 'evt_armsDealer_desc',
    reward: function() {
      const cost = randomBetween(1000, 5000);
      if (player.gold < cost) {
        return { fail: true, message: 'Not enough gold!' };
      }
      player.gold -= cost;
      const exp = cost * 2;
      player.exp += exp;
      return { gold: -cost, exp: exp, message: '-' + formatNumber(cost) + '💰 +' + formatNumber(exp) + 'EXP' };
    },
    adReward: function() {
      const cost = randomBetween(500, 2000);
      if (player.gold < cost) {
        return { fail: true, message: 'Not enough gold!' };
      }
      player.gold -= cost;
      const exp = cost * 4;
      player.exp += exp;
      return { gold: -cost, exp: exp, message: '-' + formatNumber(cost) + '💰 +' + formatNumber(exp) + 'EXP (Ad Discount!)' };
    }
  },
  {
    id: 'crash',
    icon: '✈️',
    titleKey: 'evt_crash_title',
    descKey: 'evt_crash_desc',
    reward: function() {
      const exp = randomBetween(500, 3000);
      const soldiers = randomBetween(1, 5);
      player.exp += exp;
      player.soldiers = (player.soldiers || 0) + soldiers;
      return { exp: exp, soldiers: soldiers, message: '+' + formatNumber(exp) + 'EXP +' + soldiers + '🪖' };
    },
    adReward: function() {
      const exp = randomBetween(2000, 8000);
      const soldiers = randomBetween(3, 12);
      player.exp += exp;
      player.soldiers = (player.soldiers || 0) + soldiers;
      return { exp: exp, soldiers: soldiers, message: '+' + formatNumber(exp) + 'EXP +' + soldiers + '🪖 (Ad Bonus!)' };
    }
  },
  {
    id: 'lab',
    icon: '🧪',
    titleKey: 'evt_lab_title',
    descKey: 'evt_lab_desc',
    reward: function() {
      const buff = 60 + randomBetween(0, 60);
      player.doubleBuff = (player.doubleBuff || 0) + buff;
      return { buff: buff, message: '🔁 ' + (langCurrent === 'zh' ? '双倍收益 ' + buff + '秒！' : 'Double Rewards for ' + buff + 's!') };
    },
    adReward: function() {
      const buff = 120 + randomBetween(0, 120);
      player.doubleBuff = (player.doubleBuff || 0) + buff;
      return { buff: buff, message: '🔁 ' + (langCurrent === 'zh' ? '双倍收益 ' + buff + '秒！(广告延长)' : 'Double Rewards for ' + buff + 's! (Ad Extended!)') };
    }
  },
  {
    id: 'reporter',
    icon: '🎥',
    titleKey: 'evt_reporter_title',
    descKey: 'evt_reporter_desc',
    reward: function() {
      const gold = randomBetween(500, 2000);
      const exp = randomBetween(300, 1500);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
    },
    adReward: function() {
      const gold = randomBetween(2000, 6000);
      const exp = randomBetween(1000, 4000);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
    }
  },
  {
    id: 'contest',
    icon: '🏆',
    titleKey: 'evt_contest_title',
    descKey: 'evt_contest_desc',
    reward: function() {
      const gold = randomBetween(1000, 4000);
      const exp = randomBetween(500, 2000);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
    },
    adReward: function() {
      const gold = randomBetween(3000, 10000);
      const exp = randomBetween(1500, 6000);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
    }
  },
  {
    id: 'spy',
    icon: '🕵️',
    titleKey: 'evt_spy_title',
    descKey: 'evt_spy_desc',
    reward: function() {
      const gold = randomBetween(800, 3000);
      const exp = randomBetween(400, 1800);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP' };
    },
    adReward: function() {
      const gold = randomBetween(2500, 8000);
      const exp = randomBetween(1200, 5000);
      player.gold += gold;
      player.exp += exp;
      return { gold: gold, exp: exp, message: '+' + formatNumber(gold) + '💰 +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
    }
  },
  {
    id: 'auction',
    icon: '🔨',
    titleKey: 'evt_auction_title',
    descKey: 'evt_auction_desc',
    reward: function() {
      const cost = randomBetween(2000, 8000);
      if (player.gold < cost) {
        return { fail: true, message: 'Not enough gold!' };
      }
      player.gold -= cost;
      const cp = randomBetween(5, 25);
      player.combatPower = (player.combatPower || 10) + cp;
      return { gold: -cost, cp: cp, message: '-' + formatNumber(cost) + '💰 +' + cp + ' CP' };
    },
    adReward: function() {
      const cost = randomBetween(1000, 4000);
      if (player.gold < cost) {
        return { fail: true, message: 'Not enough gold!' };
      }
      player.gold -= cost;
      const cp = randomBetween(15, 50);
      player.combatPower = (player.combatPower || 10) + cp;
      return { gold: -cost, cp: cp, message: '-' + formatNumber(cost) + '💰 +' + cp + ' CP (Ad Discount!)' };
    }
  },
  {
    id: 'merchant',
    icon: '🛸',
    titleKey: 'evt_merchant_title',
    descKey: 'evt_merchant_desc',
    reward: function() {
      const ironCost = randomBetween(50, 300);
      if (player.iron < ironCost) {
        return { fail: true, message: 'Not enough iron!' };
      }
      player.iron -= ironCost;
      const gold = ironCost * 10 + randomBetween(0, 500);
      player.gold += gold;
      return { iron: -ironCost, gold: gold, message: '-' + formatNumber(ironCost) + '⛏️ +' + formatNumber(gold) + '💰' };
    },
    adReward: function() {
      const ironCost = randomBetween(30, 150);
      if (player.iron < ironCost) {
        return { fail: true, message: 'Not enough iron!' };
      }
      player.iron -= ironCost;
      const gold = ironCost * 20 + randomBetween(0, 1000);
      player.gold += gold;
      return { iron: -ironCost, gold: gold, message: '-' + formatNumber(ironCost) + '⛏️ +' + formatNumber(gold) + '💰 (Ad Bonus!)' };
    }
  },
  {
    id: 'rift',
    icon: '⏳',
    titleKey: 'evt_rift_title',
    descKey: 'evt_rift_desc',
    reward: function() {
      const techPoints = randomBetween(1, 5);
      player.techPoints = (player.techPoints || 0) + techPoints;
      const exp = randomBetween(1000, 3000);
      player.exp += exp;
      return { techPoints: techPoints, exp: exp, message: '+' + techPoints + '⚡ +' + formatNumber(exp) + 'EXP' };
    },
    adReward: function() {
      const techPoints = randomBetween(3, 12);
      player.techPoints = (player.techPoints || 0) + techPoints;
      const exp = randomBetween(3000, 8000);
      player.exp += exp;
      return { techPoints: techPoints, exp: exp, message: '+' + techPoints + '⚡ +' + formatNumber(exp) + 'EXP (Ad Bonus!)' };
    }
  }
];

// ---------- Event System ----------
let currentEvent = null;
let eventActive = false;
let eventDismissed = false;

function triggerRandomEvent() {
  if (eventActive) return;
  if (!player) return;

  // Check cooldown
  const now = Date.now();
  const minInterval = CONFIG.EVENTS.minInterval || 60;
  if (now - (player.lastEventTime || 0) < minInterval * 1000) return;

  // Check if player is in main view
  const mainView = document.getElementById('view-main');
  if (!mainView || mainView.style.display === 'none') return;

  // 30% chance to trigger
  if (Math.random() > 0.3) return;

  const index = Math.floor(Math.random() * EVENT_STORIES.length);
  currentEvent = EVENT_STORIES[index];
  eventActive = true;
  eventDismissed = false;
  player.lastEventTime = now;

  showEventPopup(currentEvent);
}

function showEventPopup(event) {
  const isZh = langCurrent === 'zh';
  const title = t(event.titleKey);
  const desc = t(event.descKey);

  const modal = document.createElement('div');
  modal.id = 'event-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center;
    z-index: 9999; animation: fadeIn 0.3s ease;
  `;
  modal.innerHTML = `
    <div style="max-width:450px; width:90%; background:#0b0e14; border-radius:16px; padding:30px 24px; border:1px solid rgba(255,215,0,0.2); text-align:center; box-shadow:0 0 60px rgba(0,0,0,0.9);">
      <div style="font-size:3em; margin-bottom:10px;">${event.icon}</div>
      <h2 style="color:#f5d742; margin:0 0 8px;">${title}</h2>
      <p style="color:#aaa; line-height:1.6; margin:0 0 20px;">${desc}</p>
      <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
        <button class="btn btn-ghost" onclick="claimEventReward(false);">${isZh ? '领取奖励' : 'Claim'}</button>
        <button class="btn btn-gold" onclick="claimEventReward(true);">📺 ${isZh ? '广告奖励 ×2' : 'Ad Bonus ×2'}</button>
        <button class="btn" style="background:#333;" onclick="dismissEvent();">${isZh ? '忽略' : 'Dismiss'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function claimEventReward(withAd) {
  if (!currentEvent) return;

  if (withAd) {
    GameAds.reward('event', function() {
      const result = currentEvent.adReward();
      applyEventResult(result);
      // Update daily ad count
      if (player && typeof updateDailyProgress === 'function') {
        updateDailyProgress('ad', 1);
      }
      dismissEvent();
    }, function(err) {
      // Ad failed, give normal reward
      if (err === 'cooldown' || err === 'daily_limit') {
        // Just show normal reward without ad
        const result = currentEvent.reward();
        applyEventResult(result);
        dismissEvent();
      } else {
        const result = currentEvent.reward();
        applyEventResult(result);
        dismissEvent();
      }
    });
  } else {
    const result = currentEvent.reward();
    applyEventResult(result);
    dismissEvent();
  }
}

function applyEventResult(result) {
  if (result && result.fail) {
    alert(result.message || 'Failed!');
    return;
  }
  if (result) {
    let msg = '🎁 ' + (result.message || 'Reward claimed!');
    // Also show individual stats if available
    if (result.gold !== undefined && result.gold !== 0) msg += ' | Gold: ' + (result.gold > 0 ? '+' : '') + formatNumber(result.gold);
    if (result.exp !== undefined && result.exp !== 0) msg += ' | EXP: ' + (result.exp > 0 ? '+' : '') + formatNumber(result.exp);
    if (result.iron !== undefined && result.iron !== 0) msg += ' | Iron: ' + (result.iron > 0 ? '+' : '') + formatNumber(result.iron);
    if (result.soldiers !== undefined && result.soldiers > 0) msg += ' | Soldiers: +' + result.soldiers;
    if (result.cp !== undefined && result.cp > 0) msg += ' | CP: +' + result.cp;
    if (result.techPoints !== undefined && result.techPoints > 0) msg += ' | Tech Points: +' + result.techPoints;
    if (result.buff !== undefined && result.buff > 0) msg += ' | Buff: ' + result.buff + 's';
    alert(msg);
    if (typeof updateUI === 'function') updateUI();
  }
}

function dismissEvent() {
  eventActive = false;
  currentEvent = null;
  const modal = document.getElementById('event-modal');
  if (modal) modal.remove();
}

// ---------- Event stats for UI ----------
function getEventStats() {
  return {
    active: eventActive,
    currentEvent: currentEvent,
    cooldown: player ? Math.max(0, CONFIG.EVENTS.minInterval - (Date.now() - (player.lastEventTime || 0)) / 1000) : 0
  };
}