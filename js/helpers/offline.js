// ============================================================
// offline.js — Offline Earnings Calculation (Part 11 + 封顶提示)
// ============================================================

// ---------- 计算离线收益详情 ----------
function calculateOfflineEarnings(seconds) {
  if (!player) return { gold: 0, exp: 0, iron: 0, rice: 0, seconds: 0, capped: false };

  const maxSeconds = CONFIG.OFFLINE.maxSeconds || 43200;
  const effectiveSeconds = Math.min(seconds, maxSeconds);
  const capped = seconds > maxSeconds;

  const buildingProd = getTotalBuildingProduction ? getTotalBuildingProduction() : { gold: 0, iron: 0, rice: 0 };

  const combatGoldPerSec = getGoldIncomePerSecond ? getGoldIncomePerSecond() * 0.5 : 0;
  const combatExpPerSec = getExpIncomePerSecond ? getExpIncomePerSecond() * 0.5 : 0;

  const goldPerSec = buildingProd.gold + combatGoldPerSec;
  const expPerSec = combatExpPerSec;
  const ironPerSec = buildingProd.iron;
  const ricePerSec = buildingProd.rice;

  let techBonus = 1;
  if (player.tech && typeof player.tech.logistics === 'number') {
    techBonus += player.tech.logistics * 0.02;
  }

  let equipBonus = 1;
  if (typeof getEquipmentModifiers === 'function') {
    const equipMods = getEquipmentModifiers();
    equipBonus += (equipMods.incomeBonus || 0) + (equipMods.allBonus || 0);
  }

  // ★★★ 转生加成 ★★★
  let prestigeBonus = 1;
  if (typeof getPrestigeBonus === 'function') {
    prestigeBonus = getPrestigeBonus();
  }

  const totalMultiplier = techBonus * equipBonus * prestigeBonus;

  const gold = Math.floor(goldPerSec * effectiveSeconds * totalMultiplier);
  const exp = Math.floor(expPerSec * effectiveSeconds * totalMultiplier);
  const iron = Math.floor(ironPerSec * effectiveSeconds * totalMultiplier);
  const rice = Math.floor(ricePerSec * effectiveSeconds * totalMultiplier);

  return {
    gold: gold,
    exp: exp,
    iron: iron,
    rice: rice,
    seconds: effectiveSeconds,
    originalSeconds: seconds,
    capped: capped,
    maxSeconds: maxSeconds,
    hours: effectiveSeconds / 3600,
    minutes: (effectiveSeconds % 3600) / 60
  };
}

// ---------- 应用离线收益 ----------
function applyOfflineEarnings(multiplier) {
  const p = player;
  if (!p || p.offlineSeconds <= 0) return { gold: 0, exp: 0, iron: 0, rice: 0 };

  const earnings = calculateOfflineEarnings(p.offlineSeconds);
  const mult = multiplier || 1;

  const gold = Math.floor(earnings.gold * mult);
  const exp = Math.floor(earnings.exp * mult);
  const iron = Math.floor(earnings.iron * mult);
  const rice = Math.floor(earnings.rice * mult);

  p.gold += gold;
  p.totalGold += gold;
  p.exp += exp;
  p.iron += iron;
  p.rice += rice;
  p.offlineSeconds = 0;

  return { gold, exp, iron, rice };
}

// ---------- 获取离线收益摘要 ----------
function getOfflineSummary() {
  if (!player || player.offlineSeconds <= 0) {
    return {
      hasOffline: false,
      seconds: 0,
      hours: 0,
      minutes: 0,
      gold: 0,
      exp: 0,
      iron: 0,
      rice: 0,
      capped: false,
      maxSeconds: CONFIG.OFFLINE.maxSeconds || 43200
    };
  }

  const earnings = calculateOfflineEarnings(player.offlineSeconds);
  return {
    hasOffline: true,
    seconds: earnings.seconds,
    originalSeconds: earnings.originalSeconds,
    hours: earnings.hours,
    minutes: earnings.minutes,
    gold: earnings.gold,
    exp: earnings.exp,
    iron: earnings.iron,
    rice: earnings.rice,
    capped: earnings.capped,
    maxSeconds: earnings.maxSeconds
  };
}

// ---------- 各资源每秒产出 ----------
function getGoldIncomePerSecond() {
  if (!player) return 0;
  const rank = getCurrentRank();
  const base = rank.goldBase * 0.05;
  const buildingBonus = (player.buildings.goldMine || 1) * 0.5;
  const techBonus = 1 + (player.tech.logistics || 0) * 0.03;
  // ★★★ 转生加成 ★★★
  let prestigeBonus = 1;
  if (typeof getPrestigeBonus === 'function') {
    prestigeBonus = getPrestigeBonus();
  }
  return (base + buildingBonus) * techBonus * prestigeBonus;
}

function getExpIncomePerSecond() {
  if (!player) return 0;
  const rank = getCurrentRank();
  const base = rank.expBase * 0.02;
  const techBonus = 1 + (player.tech.logistics || 0) * 0.02;
  let prestigeBonus = 1;
  if (typeof getPrestigeBonus === 'function') {
    prestigeBonus = getPrestigeBonus();
  }
  return base * techBonus * prestigeBonus;
}

function getIronIncomePerSecond() {
  if (!player) return 0;
  let prestigeBonus = 1;
  if (typeof getPrestigeBonus === 'function') {
    prestigeBonus = getPrestigeBonus();
  }
  return (player.buildings.ironMine || 1) * 0.2 * prestigeBonus;
}

function getRiceIncomePerSecond() {
  if (!player) return 0;
  let prestigeBonus = 1;
  if (typeof getPrestigeBonus === 'function') {
    prestigeBonus = getPrestigeBonus();
  }
  return (player.buildings.riceFarm || 1) * 0.3 * prestigeBonus;
}

// ---------- 格式化离线时间 ----------
function formatOfflineTime(seconds) {
  if (seconds <= 0) return '0s';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let result = '';
  if (days > 0) result += days + 'd ';
  if (hours > 0) result += hours + 'h ';
  if (minutes > 0) result += minutes + 'm ';
  if (secs > 0 && days === 0) result += secs + 's';
  return result.trim() || '0s';
}

// ---------- 暴露到全局 ----------
window.calculateOfflineEarnings = calculateOfflineEarnings;
window.applyOfflineEarnings = applyOfflineEarnings;
window.getOfflineSummary = getOfflineSummary;
window.formatOfflineTime = formatOfflineTime;
window.getGoldIncomePerSecond = getGoldIncomePerSecond;
window.getExpIncomePerSecond = getExpIncomePerSecond;
window.getIronIncomePerSecond = getIronIncomePerSecond;
window.getRiceIncomePerSecond = getRiceIncomePerSecond;

console.log('✅ 离线收益系统已加载 (Part 11 + 封顶提示)');