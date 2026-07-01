// ============================================================
// components.js — 可复用 UI 组件 (Part 12 - 离线收益弹窗 + 封顶提示)
// ============================================================

// ---------- Toast 队列 ----------
let _toastQueue = [];
let _isToastShowing = false;
let _toastTimeout = null;

function showToast(message, duration, type) {
  duration = duration || 3000;
  type = type || 'info';

  if (!message) return;

  _toastQueue.push({ message: message, duration: duration, type: type });

  if (!_isToastShowing) {
    _showNextToast();
  }
}

function _showNextToast() {
  if (_toastQueue.length === 0) {
    _isToastShowing = false;
    return;
  }

  _isToastShowing = true;
  const item = _toastQueue.shift();
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + item.type;

  let borderColor = 'rgba(255,255,255,0.15)';
  let textColor = '#d0d5dd';
  let icon = '📢';
  switch (item.type) {
    case 'success':
      borderColor = 'rgba(123,237,159,0.3)';
      textColor = '#7bed9f';
      icon = '✅';
      break;
    case 'warning':
      borderColor = 'rgba(245,215,66,0.3)';
      textColor = '#f5d742';
      icon = '⚠️';
      break;
    case 'error':
      borderColor = 'rgba(255,107,107,0.3)';
      textColor = '#ff6b6b';
      icon = '❌';
      break;
    default:
      borderColor = 'rgba(74,158,255,0.2)';
      textColor = '#d0d5dd';
      icon = '📢';
  }

  let displayMessage = item.message;
  if (!displayMessage.match(/^[📢✅⚠️❌🎁📦📭👹⭐⚔️🏆📋📅🚢🔬🪖🗡️🏗️🎖️💾📂⏳]/)) {
    displayMessage = icon + ' ' + displayMessage;
  }

  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(11, 14, 20, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: ${textColor};
    padding: 12px 24px;
    border-radius: 12px;
    border: 1px solid ${borderColor};
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 0, 0, 0.3);
    z-index: 99999;
    text-align: center;
    font-size: clamp(0.85rem, 2vw, 1rem);
    font-weight: 500;
    max-width: 90%;
    min-width: 200px;
    pointer-events: none;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Segoe UI', 'Roboto', system-ui, sans-serif;
    letter-spacing: 0.3px;
  `;

  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: ${borderColor};
    border-radius: 0 0 12px 12px;
    width: 100%;
    transition: width ${item.duration}ms linear;
  `;
  toast.appendChild(progressBar);

  document.body.appendChild(toast);

  requestAnimationFrame(function() {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  requestAnimationFrame(function() {
    progressBar.style.width = '0%';
  });

  if (_toastTimeout) {
    clearTimeout(_toastTimeout);
  }
  _toastTimeout = setTimeout(function() {
    _hideToast(toast);
  }, item.duration + 100);
}

function _hideToast(toast) {
  if (!toast || !toast.parentNode) {
    _isToastShowing = false;
    _showNextToast();
    return;
  }

  toast.style.opacity = '0';
  toast.style.transform = 'translateX(-50%) translateY(20px)';

  setTimeout(function() {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
    _isToastShowing = false;
    _showNextToast();
  }, 300);
}

function clearAllToasts() {
  if (_toastTimeout) {
    clearTimeout(_toastTimeout);
    _toastTimeout = null;
  }
  _toastQueue = [];
  _isToastShowing = false;
  document.querySelectorAll('.toast').forEach(function(el) {
    el.remove();
  });
}

window.showToast = showToast;
window.clearAllToasts = clearAllToasts;

// ---------- 创建模态框 ----------
function createModal(title, content, buttons) {
  const oldModal = document.querySelector('.modal-overlay');
  if (oldModal) {
    oldModal.remove();
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  let buttonHTML = '';
  if (buttons && buttons.length > 0) {
    buttonHTML = buttons.map(function(b) {
      return `<button class="btn ${b.class || 'btn-ghost'}" onclick="(${b.action})()">${b.label}</button>`;
    }).join('');
  }

  overlay.innerHTML = `
    <div class="modal-content">
      ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
      <div class="modal-content-body">
        ${content}
      </div>
      <div style="display:flex; gap:8px; justify-content:center; margin-top:16px; flex-wrap:wrap;">
        ${buttonHTML}
      </div>
    </div>
  `;

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });

  document.body.appendChild(overlay);
  return overlay;
}

function closeModal(modal) {
  if (modal && modal.parentNode) {
    modal.parentNode.removeChild(modal);
  }
  if (typeof closeCurrentModal === 'function') {
    closeCurrentModal();
  }
}

window.createModal = createModal;
window.closeModal = closeModal;

// ===== ★★★ 离线收益弹窗（含封顶提示） ★★★ =====

/**
 * 显示离线收益弹窗
 * @param {Object} summary - 离线收益摘要
 */
function showOfflineRewardPopup(summary) {
  if (!summary || !summary.hasOffline) {
    return;
  }

  const isZh = langCurrent === 'zh';
  const timeStr = formatOfflineTime(summary.seconds);
  const hours = summary.hours.toFixed(1);
  const capped = summary.capped || false;
  const maxHours = (summary.maxSeconds || 43200) / 3600;

  let rewardHtml = '<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0;">';

  if (summary.gold > 0) {
    rewardHtml += `<div style="background:rgba(255,215,0,0.05); border-radius:8px; padding:8px 12px; text-align:center;">
      <div style="color:#888; font-size:0.7rem;">💰 ${isZh ? '金币' : 'Gold'}</div>
      <div style="color:#f5d742; font-size:1.2rem; font-weight:700;">+${formatNumber(summary.gold)}</div>
    </div>`;
  }

  if (summary.exp > 0) {
    rewardHtml += `<div style="background:rgba(123,237,159,0.05); border-radius:8px; padding:8px 12px; text-align:center;">
      <div style="color:#888; font-size:0.7rem;">📊 ${isZh ? '经验' : 'EXP'}</div>
      <div style="color:#7bed9f; font-size:1.2rem; font-weight:700;">+${formatNumber(summary.exp)}</div>
    </div>`;
  }

  if (summary.iron > 0) {
    rewardHtml += `<div style="background:rgba(74,158,255,0.05); border-radius:8px; padding:8px 12px; text-align:center;">
      <div style="color:#888; font-size:0.7rem;">⛏️ ${isZh ? '铁矿' : 'Iron'}</div>
      <div style="color:#4a9eff; font-size:1.2rem; font-weight:700;">+${formatNumber(summary.iron)}</div>
    </div>`;
  }

  if (summary.rice > 0) {
    rewardHtml += `<div style="background:rgba(167,139,250,0.05); border-radius:8px; padding:8px 12px; text-align:center;">
      <div style="color:#888; font-size:0.7rem;">🌾 ${isZh ? '稻米' : 'Rice'}</div>
      <div style="color:#a78bfa; font-size:1.2rem; font-weight:700;">+${formatNumber(summary.rice)}</div>
    </div>`;
  }

  rewardHtml += '</div>';

  // 如果所有资源都是0
  if (summary.gold === 0 && summary.exp === 0 && summary.iron === 0 && summary.rice === 0) {
    rewardHtml = `<div style="text-align:center; color:#888; padding:12px 0;">
      ${isZh ? '离线期间没有获得资源' : 'No resources earned during offline'}
    </div>`;
  }

  // ★★★ 封顶提示 ★★★
  let capNotice = '';
  if (capped) {
    capNotice = `
      <div style="background:rgba(255,215,0,0.06); border:1px solid rgba(255,215,0,0.15); border-radius:8px; padding:8px 12px; margin:8px 0;">
        <span style="color:#f5d742; font-size:0.8rem;">💡 ${t('offlineCapNotice') || (isZh ? '💡 离线收益已封顶 12 小时（超出部分不计）' : '💡 Offline earnings capped at 12 hours')}</span>
      </div>
    `;
  }

  const title = '⏳ ' + (isZh ? '离线收益' : 'Offline Earnings');
  const content = `
    <div style="text-align:center; margin-bottom:8px;">
      <div style="font-size:0.9rem; color:#aaa;">
        ${isZh ? '你离线了' : 'You were offline for'} <span style="color:#f5d742; font-weight:700;">${timeStr}</span>
        ${isZh ? '（约 ' + hours + ' 小时）' : ' (~' + hours + ' hours)'}
        ${capped ? ' ⚠️' : ''}
      </div>
    </div>
    ${capNotice}
    ${rewardHtml}
    <div style="text-align:center; font-size:0.8rem; color:#666; margin-top:4px;">
      ${isZh ? '选择领取方式' : 'Choose how to claim'}
    </div>
  `;

  const buttons = [
    {
      label: '📥 ' + (isZh ? '普通领取' : 'Claim'),
      class: 'btn-ghost',
      action: 'claimOfflineReward(1)'
    },
    {
      label: '📺 ' + (isZh ? '双倍领取' : 'Double Claim'),
      class: 'btn-gold',
      action: 'claimOfflineReward(2)'
    }
  ];

  createModal(title, content, buttons);
  window._offlinePopupOpen = true;
}

/**
 * 领取离线收益（由弹窗按钮调用）
 * @param {number} multiplier - 1 或 2
 */
function claimOfflineReward(multiplier) {
  if (!player) return;

  const isZh = langCurrent === 'zh';

  if (multiplier === 2) {
    if (typeof watchOfflineAd === 'function') {
      watchOfflineAd(function() {
        const result = applyOfflineEarnings(2);
        showOfflineClaimResult(result, true);
        closeModal(document.querySelector('.modal-overlay'));
        window._offlinePopupOpen = false;
        if (typeof updateUI === 'function') updateUI();
        if (typeof refreshAllUI === 'function') refreshAllUI();
      });
    } else {
      const result = applyOfflineEarnings(2);
      showOfflineClaimResult(result, true);
      closeModal(document.querySelector('.modal-overlay'));
      window._offlinePopupOpen = false;
      if (typeof updateUI === 'function') updateUI();
      if (typeof refreshAllUI === 'function') refreshAllUI();
    }
  } else {
    const result = applyOfflineEarnings(1);
    showOfflineClaimResult(result, false);
    closeModal(document.querySelector('.modal-overlay'));
    window._offlinePopupOpen = false;
    if (typeof updateUI === 'function') updateUI();
    if (typeof refreshAllUI === 'function') refreshAllUI();
  }

  if (player.offlineSeconds === 0) {
    if (typeof updateUI === 'function') updateUI();
  }
}

/**
 * 显示领取结果
 */
function showOfflineClaimResult(result, isDouble) {
  const isZh = langCurrent === 'zh';
  let msg = '📦 ' + (isZh ? '离线收益已领取' : 'Offline rewards claimed') + (isDouble ? ' (x2)!' : '!') + '\n';
  if (result.gold > 0) msg += '+' + formatNumber(result.gold) + '💰 ';
  if (result.exp > 0) msg += '+' + formatNumber(result.exp) + 'EXP ';
  if (result.iron > 0) msg += '+' + formatNumber(result.iron) + '⛏️ ';
  if (result.rice > 0) msg += '+' + formatNumber(result.rice) + '🌾 ';
  showToast(msg, 4000);
}

/**
 * 检查是否需要显示离线收益弹窗
 */
function checkAndShowOfflinePopup() {
  if (!player) return;

  const summary = getOfflineSummary();
  if (!summary.hasOffline) return;

  if (window._offlinePopupOpen) return;

  setTimeout(function() {
    showOfflineRewardPopup(summary);
  }, 800);
}

// 暴露到全局
window.showOfflineRewardPopup = showOfflineRewardPopup;
window.claimOfflineReward = claimOfflineReward;
window.checkAndShowOfflinePopup = checkAndShowOfflinePopup;

console.log('✅ UI Components 已加载 (Part 12 - 离线收益弹窗 + 封顶提示)');