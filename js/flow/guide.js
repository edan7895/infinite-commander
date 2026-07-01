// ============================================================
// guide.js — 2分钟互动新手引导 (Part 8)
// ============================================================

// ---------- 引导步骤数据 ----------
const GUIDE_STEPS = [
  {
    id: 'welcome',
    icon: '⭐',
    titleEn: 'Welcome, Commander',
    titleZh: '欢迎你，指挥官',
    textEn: 'The frontier is vast and dangerous. You are the leader of Black Wolf PMC. Your journey begins now.',
    textZh: '边疆星域广阔而危险。你是黑狼PMC的领袖。你的征程现在开始。',
    action: null,
    buttonEn: 'Begin Mission',
    buttonZh: '开始任务',
    autoNext: false
  },
  {
    id: 'recruit',
    icon: '🪖',
    titleEn: 'Recruit Your First Soldier',
    titleZh: '招募你的第一名士兵',
    textEn: 'Every warrior counts. Click "Recruit" to train your first soldier for the battle ahead.',
    textZh: '每一位战士都很重要。点击"招募"训练你的第一名士兵，为即将到来的战斗做准备。',
    action: function() {
      // 模拟训练士兵（不消耗资源）
      if (typeof player !== 'undefined' && player) {
        player.soldiers = (player.soldiers || 0) + 1;
        showToast('✅ ' + (langCurrent === 'zh' ? '士兵招募成功！' : 'Soldier recruited!'));
        if (typeof updateUI === 'function') updateUI();
      }
      return true;
    },
    buttonEn: 'Recruit',
    buttonZh: '招募',
    autoNext: false
  },
  {
    id: 'combat',
    icon: '⚔️',
    titleEn: 'Enemy Spotted!',
    titleZh: '发现敌军！',
    textEn: 'Enemy forces are approaching. Engage the enemy and show them what you\'re made of.',
    textZh: '敌军正在接近。迎战敌人，让他们见识你的实力。',
    action: function() {
      if (typeof player !== 'undefined' && player) {
        player.autoFight = true;
        // 给一些初始经验
        player.exp = (player.exp || 0) + 100;
        player.gold = (player.gold || 0) + 50;
        showToast('⚔️ ' + (langCurrent === 'zh' ? '战斗开始！' : 'Combat engaged!'));
        if (typeof updateUI === 'function') updateUI();
      }
      return true;
    },
    buttonEn: 'Engage',
    buttonZh: '迎战',
    autoNext: false
  },
  {
    id: 'battle_rage',
    icon: '🔥',
    titleEn: 'Battle is Raging!',
    titleZh: '战斗正在激烈进行！',
    textEn: 'Your soldiers are fighting bravely. You\'re gaining experience and gold. Keep going!',
    textZh: '你的士兵正在英勇战斗。你正在获得经验和金币。继续前进！',
    action: function() {
      if (typeof player !== 'undefined' && player) {
        // 模拟战斗收益
        player.exp = (player.exp || 0) + 150;
        player.gold = (player.gold || 0) + 80;
        player.kills = (player.kills || 0) + 5;
        player.totalKills = (player.totalKills || 0) + 5;
        if (typeof updateUI === 'function') updateUI();
      }
      return true;
    },
    buttonEn: 'Continue',
    buttonZh: '继续',
    autoNext: false
  },
  {
    id: 'first_star',
    icon: '⭐',
    titleEn: 'Battle Star Achieved!',
    titleZh: '获得战星！',
    textEn: 'You\'ve earned enough experience to reach your first Battle Star. You\'re on your way to becoming a legend.',
    textZh: '你获得了足够的经验，达到第一颗战星。你正在走向传奇之路。',
    action: function() {
      if (typeof player !== 'undefined' && player) {
        // 如果还没到1星，强制升星
        if (player.stars < 1) {
          player.stars = 1;
          showToast('⭐ ' + (langCurrent === 'zh' ? '获得第一颗战星！' : 'First Battle Star earned!'));
        }
        if (typeof updateUI === 'function') updateUI();
      }
      return true;
    },
    buttonEn: 'Promote',
    buttonZh: '晋升',
    autoNext: false
  },
  {
    id: 'upgrade_base',
    icon: '🏗️',
    titleEn: 'Upgrade Your Base',
    titleZh: '升级你的基地',
    textEn: 'A stronger base means stronger soldiers. Upgrade your Gold Mine to boost your income.',
    textZh: '更强大的基地意味着更强大的士兵。升级你的金矿来增加收入。',
    action: function() {
      if (typeof player !== 'undefined' && player) {
        if (player.buildings) {
          player.buildings.goldMine = (player.buildings.goldMine || 1) + 1;
          showToast('✅ ' + (langCurrent === 'zh' ? '金矿升级成功！' : 'Gold Mine upgraded!'));
        }
        if (typeof updateUI === 'function') updateUI();
      }
      return true;
    },
    buttonEn: 'Upgrade',
    buttonZh: '升级',
    autoNext: false
  },
  {
    id: 'random_event',
    icon: '⚡',
    titleEn: 'Random Event Incoming!',
    titleZh: '随机事件来袭！',
    textEn: 'A supply drone is passing through your sector. This is your chance to claim extra resources!',
    textZh: '一架补给无人机正在穿越你的星域。这是你获得额外资源的机会！',
    action: function() {
      // 触发一个事件
      if (typeof triggerRandomEvent === 'function') {
        triggerRandomEvent();
      } else {
        // 如果函数不存在，模拟事件奖励
        if (typeof player !== 'undefined' && player) {
          player.gold = (player.gold || 0) + 200;
          player.exp = (player.exp || 0) + 150;
          showToast('📦 ' + (langCurrent === 'zh' ? '事件奖励：+200💰 +150EXP' : 'Event reward: +200💰 +150EXP'));
        }
      }
      return true;
    },
    buttonEn: 'Wait',
    buttonZh: '等待',
    autoNext: false
  },
  {
    id: 'claim_event',
    icon: '🎁',
    titleEn: 'Event Completed!',
    titleZh: '事件完成！',
    textEn: 'You\'ve successfully claimed your reward. Resources are flowing in.',
    textZh: '你成功领取了奖励。资源正在源源不断地流入。',
    action: function() {
      // 事件奖励已经在触发时发放，这里只需要确认
      showToast('✅ ' + (langCurrent === 'zh' ? '奖励已领取！' : 'Reward claimed!'));
      return true;
    },
    buttonEn: 'Claim',
    buttonZh: '领取',
    autoNext: false
  },
  {
    id: 'watch_ad',
    icon: '📺',
    titleEn: 'Double Your Reward!',
    titleZh: '双倍奖励！',
    textEn: 'Watch a short ad to double your event reward. This is how you grow faster.',
    textZh: '观看一个短广告，获得双倍事件奖励。这就是你快速成长的方式。',
    action: function() {
      // 模拟观看广告
      if (typeof watchEventAd === 'function') {
        watchEventAd(function() {
          if (typeof player !== 'undefined' && player) {
            player.gold = (player.gold || 0) + 200;
            player.exp = (player.exp || 0) + 150;
            showToast('📺 ' + (langCurrent === 'zh' ? '广告奖励：+200💰 +150EXP' : 'Ad reward: +200💰 +150EXP'));
            if (typeof updateUI === 'function') updateUI();
          }
        });
      } else {
        // 降级方案
        if (typeof player !== 'undefined' && player) {
          player.gold = (player.gold || 0) + 200;
          player.exp = (player.exp || 0) + 150;
          showToast('📺 ' + (langCurrent === 'zh' ? '广告奖励：+200💰 +150EXP' : 'Ad reward: +200💰 +150EXP'));
        }
      }
      return true;
    },
    buttonEn: 'Watch Ad',
    buttonZh: '观看广告',
    autoNext: false
  },
  {
    id: 'daily_tasks',
    icon: '📋',
    titleEn: 'Check Daily Tasks',
    titleZh: '查看每日任务',
    textEn: 'Daily tasks give you extra rewards every day. Make sure to complete them!',
    textZh: '每日任务每天都会给你额外奖励。记得完成它们！',
    action: function() {
      if (typeof showDailyView === 'function') {
        showDailyView();
      } else {
        showToast('📋 ' + (langCurrent === 'zh' ? '每日任务：击败敌人、击败Boss、获得金币等' : 'Daily tasks: Defeat enemies, Bosses, earn gold, etc.'));
      }
      return true;
    },
    buttonEn: 'Open Daily',
    buttonZh: '打开任务',
    autoNext: false
  },
  {
    id: 'ready',
    icon: '🚀',
    titleEn: 'You\'re Ready, Commander!',
    titleZh: '你已经准备好了，指挥官！',
    textEn: 'The galaxy awaits your command. Go forth and conquer! Your journey has just begun.',
    textZh: '银河系等待着你的指挥。前进吧，征服吧！你的征程才刚刚开始。',
    action: function() {
      // 完成引导
      if (typeof player !== 'undefined' && player) {
        player.guideCompleted = true;
        saveGame();
        showToast('🎉 ' + (langCurrent === 'zh' ? '欢迎来到战场，指挥官！' : 'Welcome to the battlefield, Commander!'));
      }
      return true;
    },
    buttonEn: 'Begin Your Journey',
    buttonZh: '开始征程',
    autoNext: false
  }
];

// ---------- 引导状态 ----------
let _guideActive = false;
let _guideStepIndex = 0;
let _guideModal = null;
let _guideResolve = null;

// ---------- 检查是否需要引导 ----------
function shouldShowGuide() {
  if (!player) return false;
  // 如果已经完成引导，跳过
  if (player.guideCompleted) return false;
  // 如果之前跳过故事，也显示引导（玩家可能第一次玩）
  return true;
}

// ---------- 开始引导 ----------
function startGuide() {
  if (!player) return;
  if (_guideActive) return;
  if (player.guideCompleted) return;

  _guideActive = true;
  _guideStepIndex = 0;

  console.log('🎮 开始新手引导...');
  showGuideStep(0);
}

// ---------- 显示引导步骤 ----------
function showGuideStep(index) {
  if (index >= GUIDE_STEPS.length) {
    finishGuide();
    return;
  }

  _guideStepIndex = index;
  const step = GUIDE_STEPS[index];
  if (!step) {
    finishGuide();
    return;
  }

  const isZh = langCurrent === 'zh';
  const title = isZh ? step.titleZh : step.titleEn;
  const text = isZh ? step.textZh : step.textEn;
  const buttonText = isZh ? step.buttonZh : step.buttonEn;

  // 如果有自动操作，先执行
  if (step.action) {
    try {
      step.action();
    } catch (e) {
      console.warn('[Guide] Action error:', e);
    }
  }

  // 创建或更新引导UI
  if (!_guideModal) {
    _guideModal = createGuideModal();
  }

  // 更新内容
  const titleEl = _guideModal.querySelector('.guide-title');
  const textEl = _guideModal.querySelector('.guide-text');
  const iconEl = _guideModal.querySelector('.guide-icon');
  const buttonEl = _guideModal.querySelector('.guide-button');
  const progressEl = _guideModal.querySelector('.guide-progress');
  const progressText = _guideModal.querySelector('.guide-progress-text');

  if (iconEl) iconEl.textContent = step.icon || '⭐';
  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;
  if (buttonEl) {
    buttonEl.textContent = buttonText;
    buttonEl.onclick = function() {
      // 检查是否需要执行额外操作
      const nextStep = index + 1;
      if (nextStep < GUIDE_STEPS.length) {
        const next = GUIDE_STEPS[nextStep];
        if (next && next.action) {
          try {
            next.action();
          } catch (e) {
            console.warn('[Guide] Next action error:', e);
          }
        }
      }
      showGuideStep(nextStep);
    };
  }

  if (progressEl) {
    const total = GUIDE_STEPS.length;
    const pct = ((index + 1) / total) * 100;
    progressEl.style.width = pct + '%';
  }

  if (progressText) {
    progressText.textContent = (index + 1) + '/' + GUIDE_STEPS.length;
  }

  // 确保引导可见
  if (_guideModal) {
    _guideModal.style.display = 'flex';
  }
}

// ---------- 创建引导模态框 ----------
function createGuideModal() {
  // 移除旧模态框
  const oldModal = document.querySelector('.guide-overlay');
  if (oldModal) {
    oldModal.remove();
  }

  const overlay = document.createElement('div');
  overlay.className = 'guide-overlay';
  overlay.id = 'guide-overlay';

  const total = GUIDE_STEPS.length;

  overlay.innerHTML = `
    <div class="guide-modal">
      <div class="guide-header">
        <span class="guide-icon">⭐</span>
        <span class="guide-title">Welcome, Commander</span>
      </div>
      <div class="guide-body">
        <div class="guide-text">Your journey begins now.</div>
      </div>
      <div class="guide-footer">
        <button class="btn btn-gold guide-button">Begin Mission</button>
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-top:12px;">
          <div style="flex:1; height:3px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
            <div class="guide-progress" style="width:8%; height:100%; background:linear-gradient(90deg,#f5d742,#d4a800); border-radius:2px; transition:width 0.4s ease;"></div>
          </div>
          <span class="guide-progress-text" style="font-size:0.7rem; color:#666; margin-left:12px; min-width:30px; text-align:right;">1/${total}</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // 点击背景不关闭（强制引导）
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      // 不关闭，保持在引导中
    }
  });

  return overlay;
}

// ---------- 完成引导 ----------
function finishGuide() {
  if (typeof player !== 'undefined' && player) {
    player.guideCompleted = true;
    saveGame();
  }

  _guideActive = false;

  if (_guideModal) {
    // 淡出动画
    _guideModal.style.transition = 'opacity 0.5s ease';
    _guideModal.style.opacity = '0';
    setTimeout(function() {
      if (_guideModal && _guideModal.parentNode) {
        _guideModal.parentNode.removeChild(_guideModal);
      }
      _guideModal = null;
    }, 500);
  }

  // 更新UI
  if (typeof updateUI === 'function') {
    updateUI();
  }

  // 确保主界面可见
  const mainView = document.getElementById('view-main');
  if (mainView) {
    mainView.style.display = 'block';
  }

  showToast('🎉 ' + (langCurrent === 'zh' ? '欢迎来到战场，指挥官！' : 'Welcome to the battlefield, Commander!'));
  console.log('🎮 新手引导完成！');
}

// ---------- 跳过引导（开发用） ----------
function skipGuide() {
  if (typeof player !== 'undefined' && player) {
    player.guideCompleted = true;
    saveGame();
  }
  finishGuide();
}

// ---------- 重置引导（开发用） ----------
function resetGuide() {
  if (typeof player !== 'undefined' && player) {
    player.guideCompleted = false;
    saveGame();
  }
  console.log('🔄 引导已重置');
}

// ---------- 暴露到全局 ----------
window.startGuide = startGuide;
window.skipGuide = skipGuide;
window.resetGuide = resetGuide;
window.GUIDE_STEPS = GUIDE_STEPS;

console.log('✅ 新手引导系统已加载 (Part 8)');