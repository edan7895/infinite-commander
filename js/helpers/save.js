// ============================================================
// save.js — 自动存档 + CrazyGames Cloud Storage (Part 10)
// ============================================================

// ===== 存档版本 =====
const SAVE_VERSION = '2.0';
const SAVE_KEY = 'commander_save';
const CLOUD_KEY = 'commander_save_cloud';

// ===== 存档数据接口 =====
function createSaveData() {
  if (!player) return null;
  return {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    player: JSON.parse(JSON.stringify(player)),
    gameTime: player.totalPlayTime || 0,
    saveTime: Date.now()
  };
}

// ===== 验证存档数据 =====
function validateSaveData(data) {
  if (!data) return false;
  if (!data.version) return false;
  if (!data.player) return false;
  if (typeof data.timestamp !== 'number') return false;
  return true;
}

// ===== 合并存档数据（保留新字段） =====
function mergeSaveData(savedPlayer) {
  if (!player || !savedPlayer) return;

  // 合并所有字段
  for (const key in savedPlayer) {
    if (savedPlayer.hasOwnProperty(key)) {
      // 如果是对象，递归合并
      if (savedPlayer[key] && typeof savedPlayer[key] === 'object' && !Array.isArray(savedPlayer[key])) {
        if (!player[key]) player[key] = {};
        for (const subKey in savedPlayer[key]) {
          if (savedPlayer[key].hasOwnProperty(subKey)) {
            player[key][subKey] = savedPlayer[key][subKey];
          }
        }
      } else {
        player[key] = savedPlayer[key];
      }
    }
  }

  // 重新计算战斗力
  if (typeof calcCombatPower === 'function') {
    player.combatPower = calcCombatPower();
  }
}

// ===== 1. LocalStorage 操作 =====
function saveToLocal(data) {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(SAVE_KEY, json);
    return true;
  } catch (e) {
    console.warn('[Save] LocalStorage 保存失败:', e);
    return false;
  }
}

function loadFromLocal() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[Save] LocalStorage 读取失败:', e);
    return null;
  }
}

function removeFromLocal() {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

// ===== 2. CrazyGames Cloud Storage 操作 =====
async function saveToCloud(data) {
  try {
    // 检查 SDK 是否可用
    if (typeof CrazyGames === 'undefined' || !CrazyGames.SDK) {
      console.log('[Save] Cloud Storage 不可用 (SDK未加载)');
      return false;
    }

    // 检查是否在 CrazyGames 环境中
    if (CrazyGames.SDK.environment === 'disabled' || CrazyGames.SDK.environment === 'local') {
      console.log('[Save] Cloud Storage 在当前环境中不可用:', CrazyGames.SDK.environment);
      return false;
    }

    const json = JSON.stringify(data);
    await CrazyGames.SDK.storage.setItem(CLOUD_KEY, json);
    console.log('[Save] Cloud Storage 保存成功');
    return true;
  } catch (e) {
    console.warn('[Save] Cloud Storage 保存失败:', e);
    return false;
  }
}

async function loadFromCloud() {
  try {
    if (typeof CrazyGames === 'undefined' || !CrazyGames.SDK) {
      console.log('[Save] Cloud Storage 不可用 (SDK未加载)');
      return null;
    }

    if (CrazyGames.SDK.environment === 'disabled' || CrazyGames.SDK.environment === 'local') {
      console.log('[Save] Cloud Storage 在当前环境中不可用');
      return null;
    }

    const result = await CrazyGames.SDK.storage.getItem(CLOUD_KEY);
    if (!result) return null;
    return JSON.parse(result);
  } catch (e) {
    console.warn('[Save] Cloud Storage 读取失败:', e);
    return null;
  }
}

// ===== 3. 主存档函数 =====
function saveGame() {
  if (!player) return false;

  const data = createSaveData();
  if (!data) return false;

  // 1. 总是保存到 LocalStorage（最快）
  const localSuccess = saveToLocal(data);

  // 2. 异步保存到 Cloud Storage（不阻塞）
  if (typeof saveToCloud === 'function') {
    saveToCloud(data).catch(function(e) {
      console.warn('[Save] Cloud Storage 后台保存失败:', e);
    });
  }

  // 更新最后保存时间
  player.lastSaveTime = Date.now();

  return localSuccess;
}

// ===== 4. 主读档函数 =====
async function loadGame() {
  if (!player) return false;

  console.log('[Save] 开始加载存档...');

  // ===== 步骤1: 尝试从 Cloud Storage 加载 =====
  let cloudData = null;
  let cloudLoaded = false;

  try {
    cloudData = await loadFromCloud();
    if (cloudData && validateSaveData(cloudData)) {
      cloudLoaded = true;
      console.log('[Save] Cloud Storage 存档有效');
    } else if (cloudData) {
      console.warn('[Save] Cloud Storage 存档数据无效');
    }
  } catch (e) {
    console.warn('[Save] Cloud Storage 加载失败:', e);
  }

  // ===== 步骤2: 从 LocalStorage 加载 =====
  let localData = loadFromLocal();
  let localValid = localData && validateSaveData(localData);

  if (localValid) {
    console.log('[Save] LocalStorage 存档有效, 时间:', new Date(localData.timestamp).toLocaleString());
  }

  // ===== 步骤3: 决定使用哪个存档 =====
  let finalData = null;

  if (cloudLoaded && localValid) {
    // 两者都存在，比较时间戳
    if (cloudData.timestamp > localData.timestamp) {
      console.log('[Save] 使用 Cloud Storage 存档 (更新)');
      finalData = cloudData;
    } else {
      console.log('[Save] 使用 LocalStorage 存档 (更新)');
      finalData = localData;
    }
  } else if (cloudLoaded) {
    console.log('[Save] 使用 Cloud Storage 存档 (唯一)');
    finalData = cloudData;
  } else if (localValid) {
    console.log('[Save] 使用 LocalStorage 存档 (唯一)');
    finalData = localData;
  } else {
    console.log('[Save] 没有找到有效存档，使用初始数据');
    return false;
  }

  // ===== 步骤4: 应用存档数据 =====
  if (finalData && finalData.player) {
    // 保存旧玩家数据用于计算离线
    const oldPlayer = JSON.parse(JSON.stringify(player));

    // 合并存档数据
    mergeSaveData(finalData.player);

    // ===== ★★★ 计算离线收益 ★★★ =====
    if (finalData.timestamp) {
      const now = Date.now();
      const diffSeconds = Math.floor((now - finalData.timestamp) / 1000);
      const maxOffline = CONFIG.OFFLINE.maxSeconds || 43200;

      if (diffSeconds > 5) { // 超过5秒算离线
        const offlineSeconds = Math.min(diffSeconds, maxOffline);
        player.offlineSeconds = offlineSeconds;
        console.log('[Save] 离线时间: ' + formatTime(offlineSeconds));
        console.log('[Save] 离线收益已累计，等待玩家领取');
      } else {
        player.offlineSeconds = 0;
      }
    }

    // 更新总游戏时间（加上离线时间）
    if (finalData.gameTime) {
      player.totalPlayTime = finalData.gameTime + (player.offlineSeconds || 0);
    }

    // 重新计算战斗力
    if (typeof calcCombatPower === 'function') {
      player.combatPower = calcCombatPower();
    }

    console.log('[Save] 存档加载成功!');
    return true;
  }

  return false;
}

// ===== 5. 重置存档 =====
function resetSave() {
  if (!confirm('⚠️ ' + (langCurrent === 'zh' ? '确认重置所有游戏数据？此操作不可撤销！' : 'Reset all game data? This cannot be undone!'))) {
    return false;
  }

  // 清除 LocalStorage
  removeFromLocal();

  // 清除 Cloud Storage
  if (typeof CrazyGames !== 'undefined' && CrazyGames.SDK) {
    try {
      CrazyGames.SDK.storage.removeItem(CLOUD_KEY);
      console.log('[Save] Cloud Storage 已清除');
    } catch (e) {
      console.warn('[Save] 清除 Cloud Storage 失败:', e);
    }
  }

  // 重置玩家数据
  if (typeof initPlayer === 'function') {
    const newPlayer = createPlayer();
    for (const key in newPlayer) {
      if (newPlayer.hasOwnProperty(key)) {
        player[key] = newPlayer[key];
      }
    }
  }

  player.offlineSeconds = 0;
  player.totalPlayTime = 0;

  if (typeof updateUI === 'function') updateUI();
  showToast('🗑️ ' + (langCurrent === 'zh' ? '游戏数据已重置' : 'Game data reset'));

  return true;
}

// ===== 6. 存档统计 =====
function getSaveStats() {
  const localData = loadFromLocal();
  const stats = {
    hasLocalSave: localData !== null,
    localSaveTime: localData ? new Date(localData.timestamp).toLocaleString() : null,
    cloudAvailable: false,
    hasCloudSave: false,
    cloudSaveTime: null
  };

  // 检查 Cloud Storage 是否可用
  if (typeof CrazyGames !== 'undefined' && CrazyGames.SDK) {
    stats.cloudAvailable = true;
    // 异步检查云端存档（不阻塞）
    loadFromCloud().then(function(data) {
      if (data) {
        stats.hasCloudSave = true;
        stats.cloudSaveTime = new Date(data.timestamp).toLocaleString();
      }
    }).catch(function() {});
  }

  return stats;
}

// ===== 7. 手动存档（带提示） =====
function manualSave() {
  const success = saveGame();
  if (success) {
    showToast('💾 ' + (langCurrent === 'zh' ? '存档成功！' : 'Save successful!'));
  } else {
    showToast('⚠️ ' + (langCurrent === 'zh' ? '存档失败！' : 'Save failed!'));
  }
  return success;
}

// ===== 8. 手动读档（带提示） =====
async function manualLoad() {
  const success = await loadGame();
  if (success) {
    // 如果有离线收益，显示通知
    if (player && player.offlineSeconds > 0) {
      const h = Math.floor(player.offlineSeconds / 3600);
      const m = Math.floor((player.offlineSeconds % 3600) / 60);
      showToast('⏳ ' + (langCurrent === 'zh' ? '离线 ' + h + 'h ' + m + 'm，请领取离线收益' : 'Offline ' + h + 'h ' + m + 'm, claim offline rewards'));
    }
    showToast('📂 ' + (langCurrent === 'zh' ? '读档成功！' : 'Load successful!'));
    if (typeof updateUI === 'function') updateUI();
  } else {
    showToast('⚠️ ' + (langCurrent === 'zh' ? '读档失败！' : 'Load failed!'));
  }
  return success;
}

// ===== 9. 自动存档定时器 =====
let autoSaveInterval = null;

function startAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  // 每30秒自动存档
  autoSaveInterval = setInterval(function() {
    if (player) {
      saveGame();
    }
  }, 30000);

  console.log('[Save] 自动存档已启动 (每30秒)');
}

function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log('[Save] 自动存档已停止');
  }
}

// ===== 10. 页面关闭时存档 =====
function setupBeforeUnloadSave() {
  window.addEventListener('beforeunload', function() {
    if (player) {
      console.log('[Save] 页面关闭，执行最后存档...');
      saveGame();
    }
  });

  // 页面可见性变化时存档（用户切换到其他标签页）
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && player) {
      saveGame();
    }
  });
}

// ===== 暴露到全局 =====
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetSave = resetSave;
window.manualSave = manualSave;
window.manualLoad = manualLoad;
window.startAutoSave = startAutoSave;
window.stopAutoSave = stopAutoSave;
window.getSaveStats = getSaveStats;
window.setupBeforeUnloadSave = setupBeforeUnloadSave;

console.log('✅ 存档系统已加载 (Part 10 - 自动存档 + Cloud Storage)');