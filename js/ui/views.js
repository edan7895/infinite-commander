// ============================================================
// views.js — View Navigation (Part 12 - 添加转生视图)
// ============================================================

// ---------- 所有现有视图函数保留，新增转生视图 ----------
// 由于文件太长，这里只包含新增的转生视图函数和别名

// ===== ★★★ 转生视图 ★★★ =====
function showPrestigeViewFull() {
  if (!player) return;

  const isZh = langCurrent === 'zh';
  const stats = getPrestigeStats();
  const requirements = stats.requirements || {};
  const canPrestige = stats.canPrestige || false;
  const medals = stats.medals || 0;
  const bonus = stats.bonusPercent || 0;
  const prestigeCount = stats.prestigeCount || 0;
  const maxPrestige = stats.maxPrestige || 20;
  const history = stats.history || [];

  let html = `<div class="glass-card"><h2 style="color:#f5d742;">🔄 ${t('prestige')}</h2>`;

  // ---- 当前状态 ----
  html += `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin:12px 0;">`;
  html += `<div style="background:rgba(255,215,0,0.05); border-radius:8px; padding:8px; text-align:center;">
    <div style="color:#888; font-size:0.7rem;">🏅 ${t('prestigeMedals')}</div>
    <div style="color:#f5d742; font-size:1.3rem; font-weight:700;">${medals}</div>
  </div>`;
  html += `<div style="background:rgba(123,237,159,0.05); border-radius:8px; padding:8px; text-align:center;">
    <div style="color:#888; font-size:0.7rem;">📈 ${isZh ? '加成' : 'Bonus'}</div>
    <div style="color:#7bed9f; font-size:1.3rem; font-weight:700;">+${bonus}%</div>
  </div>`;
  html += `<div style="background:rgba(74,158,255,0.05); border-radius:8px; padding:8px; text-align:center;">
    <div style="color:#888; font-size:0.7rem;">🔄 ${t('prestigeCount')}</div>
    <div style="color:#4a9eff; font-size:1.3rem; font-weight:700;">${prestigeCount}</div>
  </div>`;
  html += `</div>`;

  // ---- 转生条件 ----
  html += `<div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:10px; margin:8px 0;">`;
  html += `<div style="font-weight:600; color:#888; font-size:0.85rem; margin-bottom:6px;">📋 ${t('prestigeRequirements')}</div>`;
  html += `<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap;">`;
  html += `<span style="color:#aaa; font-size:0.9rem;">${isZh ? '需要军阶达到' : 'Requires rank'} <span style="color:#f5d742;">${CONFIG.PRESTIGE.minRank}</span></span>`;
  if (canPrestige) {
    html += `<span style="color:#7bed9f; font-size:0.85rem;">✅ ${t('prestigeReady')}</span>`;
  } else {
    const currentRank = player.rankId || 0;
    const progress = Math.min(100, (currentRank / CONFIG.PRESTIGE.minRank) * 100);
    html += `<span style="color:#888; font-size:0.85rem;">${currentRank}/${CONFIG.PRESTIGE.minRank}</span>`;
  }
  html += `</div>`;
  if (prestigeCount >= maxPrestige) {
    html += `<div style="color:#ff6b6b; font-size:0.8rem; margin-top:4px;">⚠️ ${t('prestigeMaxReached').replace('{max}', maxPrestige)}</div>`;
  }
  html += `</div>`;

  // ---- 转生奖励 ----
  html += `<div style="background:rgba(123,237,159,0.04); border-radius:8px; padding:10px; margin:8px 0; border:1px solid rgba(123,237,159,0.08);">`;
  html += `<div style="font-weight:600; color:#7bed9f; font-size:0.85rem; margin-bottom:6px;">🎁 ${t('prestigeRewards')}</div>`;
  html += `<div style="font-size:0.85rem; color:#aaa;">`;
  const nextMedals = medals + 1;
  const nextBonus = nextMedals * CONFIG.PRESTIGE.bonusPerMedal;
  html += `🏅 ${isZh ? '获得' : 'Gain'} <span style="color:#f5d742;">${nextMedals}</span> ${t('prestigeMedal')} ${isZh ? '枚' : ''}<br>`;
  html += `📈 ${isZh ? '资源产出' : 'Resource Production'} <span style="color:#7bed9f;">+${nextBonus}%</span>`;
  html += `</div>`;
  html += `</div>`;

  // ---- 警告信息 ----
  html += `<div style="background:rgba(255,107,107,0.06); border-radius:8px; padding:10px; margin:8px 0; border:1px solid rgba(255,107,107,0.08);">`;
  html += `<div style="font-size:0.8rem; color:#ff6b6b;">⚠️ ${t('prestigeWarning')}</div>`;
  html += `<div style="font-size:0.8rem; color:#7bed9f; margin-top:4px;">✅ ${t('prestigeKeep')}</div>`;
  const keepGoldPercent = CONFIG.PRESTIGE.keepGoldPercent * 100;
  html += `<div style="font-size:0.75rem; color:#888; margin-top:4px;">💰 ${isZh ? '保留' : 'Keep'} ${keepGoldPercent}% ${isZh ? '金币' : 'gold'}</div>`;
  html += `</div>`;

  // ---- 转生按钮 ----
  html += `<div style="text-align:center; margin:12px 0;">`;
  if (canPrestige) {
    html += `<button class="btn btn-gold" onclick="confirmPrestige();" style="padding:12px 40px; font-size:1.1rem;">🔄 ${t('prestigeButton')}</button>`;
  } else {
    html += `<button class="btn btn-disabled" disabled style="padding:12px 40px; font-size:1.1rem;">🔒 ${t('prestigeNotReady')}</button>`;
  }
  html += `</div>`;

  // ---- 转生历史 ----
  html += `<div style="margin-top:12px;">`;
  html += `<div style="font-weight:600; color:#888; font-size:0.85rem; margin-bottom:6px;">📜 ${t('prestigeHistory')}</div>`;
  if (history.length === 0) {
    html += `<div style="color:#666; font-size:0.8rem; text-align:center; padding:8px;">${t('prestigeNoHistory')}</div>`;
  } else {
    html += `<div style="max-height:150px; overflow-y:auto; font-size:0.75rem;">`;
    // 显示最近的5条
    const recent = history.slice(-5).reverse();
    recent.forEach(function(entry) {
      const date = new Date(entry.timestamp).toLocaleDateString();
      const rankName = entry.rankName || 'Unknown';
      html += `<div style="display:flex; justify-content:space-between; padding:4px 8px; border-bottom:1px solid rgba(255,255,255,0.03); color:#888;">`;
      html += `<span>🏅 ${entry.medals} ${isZh ? '勋章' : 'medals'} - ${rankName}</span>`;
      html += `<span>${date}</span>`;
      html += `</div>`;
    });
    html += `</div>`;
  }
  html += `</div>`;

  html += `<button class="btn btn-ghost" style="margin-top:16px; width:100%;" onclick="closeModal(this.closest('.modal-overlay'));">${t('cancel')}</button>`;
  html += '</div>';

  createModal(t('prestigeTitle'), html, [
    { label: t('cancel'), class: 'btn-ghost', action: 'closeModal(this.closest(".modal-overlay"))' }
  ]);
}

// ---------- 转生确认 ----------
function confirmPrestige() {
  const isZh = langCurrent === 'zh';
  const check = checkPrestigeRequirements();
  if (!check.canPrestige) {
    showToast('⚠️ ' + (isZh ? '未达到转生条件' : 'Conditions not met'));
    return;
  }

  const preview = getPrestigeRewardPreview();
  if (!preview) return;

  const msg =
    (isZh ? '⚠️ 确认转生？\n\n' : '⚠️ Confirm Prestige?\n\n') +
    (isZh ? '🔄 转生次数：' + (preview.prestigeCount) + '\n' : '🔄 Prestige #' + preview.prestigeCount + '\n') +
    (isZh ? '🏅 获得勋章：' + preview.medals + ' 枚\n' : '🏅 Medals: ' + preview.medals + '\n') +
    (isZh ? '📈 加成：+' + preview.bonusPercent + '%\n\n' : '📈 Bonus: +' + preview.bonusPercent + '%\n\n') +
    (isZh ? '此操作将重置军阶、建筑、士兵、舰队、科技、装备\n' : 'This resets: Rank, Buildings, Soldiers, Fleet, Tech, Equipment\n') +
    (isZh ? '✅ 保留勋章、成就、每日任务进度、登录天数\n' : '✅ Keeps: Medals, Achievements, Daily, Login Days\n\n') +
    (isZh ? '确定继续吗？' : 'Continue?');

  if (!confirm(msg)) {
    return;
  }

  // 执行转生
  const result = performPrestige();
  if (result && result.success) {
    // 关闭当前弹窗
    closeModal(document.querySelector('.modal-overlay'));
    // 刷新UI
    if (typeof refreshAllUI === 'function') {
      refreshAllUI();
    }
    // 显示成功消息（已在performPrestige中处理）
  } else {
    showToast('⚠️ ' + (isZh ? '转生失败：' + (result ? result.message : '未知错误') : 'Prestige failed'));
  }
}

// ---------- 别名函数 ----------
function showRankView() {
  if (typeof showRankViewFull === 'function') showRankViewFull();
  else showToast('🎖️ ' + t('rank') + ' view coming soon!', 2000);
}

function showBuildingView() {
  if (typeof showBuildingViewFull === 'function') showBuildingViewFull();
  else showToast('🏗️ ' + t('building') + ' view coming soon!', 2000);
}

function showFleetView() {
  if (typeof showFleetViewFull === 'function') showFleetViewFull();
  else showToast('🚢 ' + t('fleet') + ' view coming soon!', 2000);
}

function showTechView() {
  if (typeof showTechViewFull === 'function') showTechViewFull();
  else showToast('🔬 ' + t('tech') + ' view coming soon!', 2000);
}

function showSoldierView() {
  if (typeof showSoldierViewFull === 'function') showSoldierViewFull();
  else showToast('🪖 ' + t('soldier') + ' view coming soon!', 2000);
}

function showEquipmentView() {
  if (typeof showEquipmentViewFull === 'function') showEquipmentViewFull();
  else showToast('🗡️ ' + t('equipment') + ' view coming soon!', 2000);
}

function showDailyView() {
  if (typeof showDailyViewFull === 'function') showDailyViewFull();
  else showToast('📋 ' + t('dailyQuests') + ' view coming soon!', 2000);
}

function showAchievementView() {
  if (typeof showAchievementViewFull === 'function') showAchievementViewFull();
  else showToast('🏆 ' + t('achievements') + ' view coming soon!', 2000);
}

function showLoginView() {
  if (typeof showLoginViewFull === 'function') showLoginViewFull();
  else showToast('📅 ' + t('loginCheckIn') + ' view coming soon!', 2000);
}

function showPrestigeView() {
  if (typeof showPrestigeViewFull === 'function') showPrestigeViewFull();
  else showToast('🔄 ' + t('prestige') + ' view coming soon!', 2000);
}

// 暴露到全局
window.confirmPrestige = confirmPrestige;
window.showPrestigeView = showPrestigeView;

console.log('✅ 视图系统已加载 (Part 12 - 转生视图)');