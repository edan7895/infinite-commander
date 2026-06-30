// ============================================================
// tutorial.js — Main Quest / Tutorial System (10+ steps)
// ============================================================

const TUTORIAL_STEPS = [
  {
    id: 0,
    titleEn: 'Arrive at Outpost',
    titleZh: '抵达前哨站',
    descEn: 'Click "Begin Command" to start your journey.',
    descZh: '点击"开始指挥"开始你的征程。',
    check: function() { return true; },
    reward: function() { return { gold: 100 }; }
  },
  {
    id: 1,
    titleEn: 'Build a Gold Mine',
    titleZh: '建造金矿',
    descEn: 'Build your first Gold Mine to start generating income.',
    descZh: '建造你的第一座金矿，开始产生收入。',
    check: function() {
      return player && player.buildings && player.buildings.goldMine >= 1;
    },
    reward: function() { return { gold: 200, exp: 50 }; }
  },
  {
    id: 2,
    titleEn: 'Earn 500 Gold',
    titleZh: '赚取500金币',
    descEn: 'Let your Gold Mine work. Earn 500 total gold.',
    descZh: '让你的金矿运作。赚取500金币。',
    check: function() {
      return player && player.totalGold >= 500;
    },
    reward: function() { return { exp: 200 }; }
  },
  {
    id: 3,
    titleEn: 'Defeat 10 Enemies',
    titleZh: '击败10个敌人',
    descEn: 'Combat automatically engages enemies. Defeat 10 of them.',
    descZh: '自动战斗会自动迎战敌人。击败10个敌人。',
    check: function() {
      return player && player.totalKills >= 10;
    },
    reward: function() { return { gold: 300, exp: 100 }; }
  },
  {
    id: 4,
    titleEn: 'Reach 1 Star',
    titleZh: '达到1星',
    descEn: 'Gain enough EXP to reach your first star.',
    descZh: '获得足够的经验达到第一颗星。',
    check: function() {
      return player && player.stars >= 1;
    },
    reward: function() { return { gold: 500, exp: 200 }; }
  },
  {
    id: 5,
    titleEn: 'First Promotion',
    titleZh: '首次晋升',
    descEn: 'Reach 5 stars and promote to Private!',
    descZh: '达到5星并晋升为二等兵！',
    check: function() {
      return player && player.rankId >= 1;
    },
    reward: function() { return { gold: 1000, exp: 500 }; }
  },
  {
    id: 6,
    titleEn: 'Build a Rice Farm',
    titleZh: '建造稻田',
    descEn: 'Build a Rice Farm to sustain your growing army.',
    descZh: '建造稻田以维持你不断壮大的军队。',
    check: function() {
      return player && player.buildings && player.buildings.riceFarm >= 1;
    },
    reward: function() { return { rice: 500, gold: 300 }; }
  },
  {
    id: 7,
    titleEn: 'Train 5 Soldiers',
    titleZh: '训练5个士兵',
    descEn: 'Use your Barracks to train 5 soldiers.',
    descZh: '使用你的兵营训练5个士兵。',
    check: function() {
      return player && player.soldiers >= 5;
    },
    reward: function() { return { gold: 500, exp: 300 }; }
  },
  {
    id: 8,
    titleEn: 'Defeat Your First Boss',
    titleZh: '击败你的第一个Boss',
    descEn: 'Bosses appear every 10 minutes. Defeat one!',
    descZh: 'Boss每10分钟出现一次。击败一个！',
    check: function() {
      return player && player.totalBossDefeated >= 1;
    },
    reward: function() { return { gold: 1500, exp: 800 }; }
  },
  {
    id: 9,
    titleEn: 'Upgrade Gold Mine to Level 5',
    titleZh: '将金矿升级到5级',
    descEn: 'Upgrade your Gold Mine to level 5 for better income.',
    descZh: '将你的金矿升级到5级以获得更好的收入。',
    check: function() {
      return player && player.buildings && player.buildings.goldMine >= 5;
    },
    reward: function() { return { gold: 2000, exp: 1000 }; }
  },
  {
    id: 10,
    titleEn: 'Research Your First Tech',
    titleZh: '研究你的第一个科技',
    descEn: 'Unlock and research a technology in the Tech tree.',
    descZh: '解锁并研究科技树中的一项科技。',
    check: function() {
      const tech = player && player.tech;
      if (!tech) return false;
      return tech.firepower > 0 || tech.armor > 0 || tech.logistics > 0;
    },
    reward: function() { return { gold: 3000, exp: 1500 }; }
  }
];

let tutorialStep = 0;

function checkTutorial() {
  if (!player) return;
  if (player.tutorialCompleted) return;

  const stepIndex = player.tutorialStep || 0;
  if (stepIndex >= TUTORIAL_STEPS.length) {
    player.tutorialCompleted = true;
    return;
  }

  const step = TUTORIAL_STEPS[stepIndex];
  if (!step) return;

  if (step.check()) {
    // Complete step
    const reward = step.reward();
    if (reward) {
      if (reward.gold) player.gold += reward.gold;
      if (reward.exp) player.exp += reward.exp;
      if (reward.rice) player.rice += reward.rice;
      if (reward.iron) player.iron += reward.iron;
      showTutorialComplete(stepIndex, reward);
    }
    player.tutorialStep = stepIndex + 1;
    if (player.tutorialStep >= TUTORIAL_STEPS.length) {
      player.tutorialCompleted = true;
    }
    if (typeof updateUI === 'function') updateUI();
  } else {
    showTutorialHint(stepIndex);
  }
}

let tutorialHintShown = false;
let tutorialHintTimeout = null;

function showTutorialHint(stepIndex) {
  if (tutorialHintShown) return;
  tutorialHintShown = true;

  const step = TUTORIAL_STEPS[stepIndex];
  if (!step) return;

  const isZh = langCurrent === 'zh';
  const title = isZh ? step.titleZh : step.titleEn;
  const desc = isZh ? step.descZh : step.descEn;

  const hint = document.createElement('div');
  hint.id = 'tutorial-hint';
  hint.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: rgba(10,14,20,0.95); color: #d0d5dd;
    padding: 12px 24px; border-radius: 12px;
    border: 1px solid rgba(255,215,0,0.3);
    box-shadow: 0 4px 30px rgba(0,0,0,0.8);
    z-index: 9998;
    max-width: 90%;
    text-align: center;
    font-size: 0.95em;
    animation: fadeIn 0.3s ease;
  `;
  hint.innerHTML = `
    <div style="color:#f5d742; font-weight:600;">📜 ${title}</div>
    <div style="color:#aaa; margin-top:4px;">${desc}</div>
  `;
  document.body.appendChild(hint);

  if (tutorialHintTimeout) clearTimeout(tutorialHintTimeout);
  tutorialHintTimeout = setTimeout(function() {
    const el = document.getElementById('tutorial-hint');
    if (el) el.remove();
    tutorialHintShown = false;
    tutorialHintTimeout = null;
  }, 8000);
}

function showTutorialComplete(stepIndex, reward) {
  const isZh = langCurrent === 'zh';
  const step = TUTORIAL_STEPS[stepIndex];
  const title = isZh ? step.titleZh : step.titleEn;

  let rewardText = '';
  if (reward.gold) rewardText += '+' + formatNumber(reward.gold) + '💰 ';
  if (reward.exp) rewardText += '+' + formatNumber(reward.exp) + 'EXP ';
  if (reward.rice) rewardText += '+' + formatNumber(reward.rice) + '🌾 ';
  if (reward.iron) rewardText += '+' + formatNumber(reward.iron) + '⛏️ ';

  const msg = document.createElement('div');
  msg.id = 'tutorial-complete';
  msg.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(10,14,20,0.98); color: #d0d5dd;
    padding: 30px 40px; border-radius: 16px;
    border: 2px solid rgba(123,237,159,0.3);
    box-shadow: 0 0 60px rgba(0,0,0,0.9);
    z-index: 9999;
    text-align: center;
    animation: fadeIn 0.4s ease;
    min-width: 280px;
  `;
  msg.innerHTML = `
    <div style="font-size:2.5em;">✅</div>
    <div style="color:#7bed9f; font-weight:700; font-size:1.2em; margin:8px 0;">${isZh ? '任务完成！' : 'Quest Complete!'}</div>
    <div style="color:#f5d742;">${title}</div>
    <div style="color:#aaa; margin-top:8px;">${isZh ? '奖励' : 'Reward'}: ${rewardText}</div>
    <button class="btn btn-gold" style="margin-top:16px;" onclick="this.closest('div').remove();">${isZh ? '太棒了！' : 'Awesome!'}</button>
  `;
  document.body.appendChild(msg);

  setTimeout(function() {
    const el = document.getElementById('tutorial-complete');
    if (el) el.remove();
  }, 5000);
}