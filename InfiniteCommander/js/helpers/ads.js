// ============================================================
// ads.js — Ad System (Unified Interface) - v3 SDK Ready
// ============================================================

const GameAds = {
  // ---------- Internal state ----------
  _cooldown: 0,
  _dailyCount: 0,
  _dailyReset: Date.now(),
  _sdkReady: false,

  /**
   * 检查 SDK 是否可用
   */
  _isSDKReady: function() {
    if (typeof window.CrazyGames !== 'undefined' && 
        window.CrazyGames.SDK && 
        window.CrazyGames.SDK.ad) {
      return true;
    }
    return false;
  },

  /**
   * 展示广告（v3 标准）
   * @param {string} type - 广告类型: 'rewarded' | 'midgame'
   * @param {Function} onSuccess - 观看完成回调
   * @param {Function} onFail - 观看失败回调（可选）
   * @param {Object} options - 额外选项（可选）
   */
  reward: function(type, onSuccess, onFail, options) {
    console.log('[Ad] Requested: ' + type);

    // 检查冷却
    if (this._cooldown > 0) {
      console.log('[Ad] Cooldown: ' + this._cooldown + 's');
      if (typeof onFail === 'function') {
        onFail({ code: 'cooldown', message: 'Ad cooldown' });
      } else if (typeof onSuccess === 'function') {
        console.warn('[Ad] Cooldown active, giving reward (dev mode)');
        onSuccess();
      }
      return;
    }

    // 检查每日限制
    this._checkDailyReset();
    if (this._dailyCount >= CONFIG.ADS.maxDailyAds) {
      console.log('[Ad] Daily limit reached: ' + this._dailyCount);
      if (typeof onFail === 'function') {
        onFail({ code: 'daily_limit', message: 'Daily ad limit reached' });
      } else if (typeof onSuccess === 'function') {
        console.warn('[Ad] Daily limit reached, giving reward (dev mode)');
        onSuccess();
      }
      return;
    }

    // ============================================================
    // ★★★ 真实环境：使用 CrazyGames SDK v3 ★★★
    // ============================================================
    if (this._isSDKReady() && window.CrazyGames.SDK.environment !== 'disabled') {
      this._playRealAd(type, onSuccess, onFail);
      return;
    }

    // ============================================================
    // ★★★ 开发环境：模拟广告 ★★★
    // ============================================================
    this._playSimulatedAd(type, onSuccess, onFail);
  },

  /**
   * 播放真实广告（v3 SDK）
   */
  _playRealAd: function(type, onSuccess, onFail) {
    const adType = (type === 'midgame') ? 'midgame' : 'rewarded';
    const isRewarded = (type === 'rewarded' || type === 'promote' || 
                        type === 'offline' || type === 'boss' || 
                        type === 'event' || type === 'double');

    // v3 广告回调格式
    const callbacks = {
      adStarted: function() {
        console.log('[Ad] Started: ' + adType);
        // 暂停游戏（如果游戏有暂停功能）
        // 如果存在 pauseGame 函数，调用它
        if (typeof window.pauseGame === 'function') {
          window.pauseGame();
        }
        // 静音（如果有音频）
        // if (window.soundManager) window.soundManager.mute();
      },

      adFinished: function() {
        console.log('[Ad] Finished: ' + adType);
        // 恢复游戏
        if (typeof window.resumeGame === 'function') {
          window.resumeGame();
        }
        // 恢复音频
        // if (window.soundManager) window.soundManager.unmute();

        // 更新统计
        GameAds._dailyCount++;
        if (player) {
          player.adCount = (player.adCount || 0) + 1;
          if (typeof updateDailyProgress === 'function') {
            updateDailyProgress('ad', 1);
          }
        }

        // 设置冷却
        GameAds._cooldown = CONFIG.ADS.cooldown || 5;

        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      },

      adError: function(error) {
        console.warn('[Ad] Error:', error);
        // 恢复游戏
        if (typeof window.resumeGame === 'function') {
          window.resumeGame();
        }

        // 检查错误类型
        if (error && error.code) {
          if (error.code === 'unfilled') {
            console.log('[Ad] No ad available, fallback to sim');
            // 降级到模拟广告
            GameAds._playSimulatedAd(type, onSuccess, onFail);
            return;
          }
          if (error.code === 'adblock') {
            console.log('[Ad] Adblock detected');
          }
        }

        if (typeof onFail === 'function') {
          onFail(error);
        } else if (typeof onSuccess === 'function') {
          // 失败时降级：给奖励（开发测试用）
          console.warn('[Ad] Giving reward despite error (dev mode)');
          onSuccess();
        }
      }
    };

    try {
      window.CrazyGames.SDK.ad.requestAd(adType, callbacks);
    } catch (error) {
      console.error('[Ad] SDK call failed:', error);
      // 降级到模拟广告
      this._playSimulatedAd(type, onSuccess, onFail);
    }
  },

  /**
   * 播放模拟广告（开发环境）
   */
  _playSimulatedAd: function(type, onSuccess, onFail) {
    const simDelay = CONFIG.ADS.simDelay || 1500;

    // 显示加载提示
    showToast('📺 ' + (t('adLoading') || 'Loading ad...'));

    setTimeout(function() {
      // 模拟 15% 失败率（用于测试）
      if (Math.random() < 0.15) {
        console.warn('[Ad] Simulated failure');
        if (typeof onFail === 'function') {
          onFail({ code: 'simulated', message: 'Simulated ad failure' });
        } else if (typeof onSuccess === 'function') {
          console.warn('[Ad] Giving reward despite failure (dev mode)');
          onSuccess();
        }
        return;
      }

      console.log('[Ad] Complete (simulated): ' + type);

      // 更新统计
      GameAds._dailyCount++;
      if (player) {
        player.adCount = (player.adCount || 0) + 1;
        if (typeof updateDailyProgress === 'function') {
          updateDailyProgress('ad', 1);
        }
      }

      // 设置冷却
      GameAds._cooldown = CONFIG.ADS.cooldown || 5;

      showToast('✅ ' + (t('adComplete') || 'Ad complete!'));
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    }, simDelay);
  },

  /**
   * 检查每日重置
   */
  _checkDailyReset: function() {
    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const resetDate = new Date(this._dailyReset);
    resetDate.setHours(0, 0, 0, 0);
    if (resetDate.getTime() < today.getTime()) {
      this._dailyCount = 0;
      this._dailyReset = now;
    }
  },

  /**
   * 检测广告拦截器
   */
  hasAdblock: async function() {
    if (this._isSDKReady()) {
      try {
        const result = await window.CrazyGames.SDK.ad.hasAdblock();
        console.log('[Ad] Adblock detection:', result);
        return result;
      } catch (error) {
        console.warn('[Ad] Adblock detection failed:', error);
        return false;
      }
    }
    return false;
  },

  /**
   * 获取广告统计
   */
  getStats: function() {
    this._checkDailyReset();
    return {
      dailyCount: this._dailyCount,
      maxDaily: CONFIG.ADS.maxDailyAds,
      cooldown: this._cooldown,
      remaining: Math.max(0, CONFIG.ADS.maxDailyAds - this._dailyCount),
      sdkReady: this._isSDKReady()
    };
  },

  /**
   * 重置（用于测试）
   */
  reset: function() {
    this._cooldown = 0;
    this._dailyCount = 0;
    this._dailyReset = Date.now();
  }
};

// ---------- 冷却定时器 ----------
setInterval(function() {
  if (GameAds._cooldown > 0) {
    GameAds._cooldown = Math.max(0, GameAds._cooldown - 1);
  }
}, 1000);

// ---------- 便捷函数 ----------
function watchPromoteAd(callback) {
  GameAds.reward('promote', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else if (err && err.code === 'adblock') showToast('🛡️ ' + (t('adblockDetected') || 'Please disable adblocker'));
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchOfflineAd(callback) {
  GameAds.reward('offline', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchBossAd(callback) {
  GameAds.reward('boss', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchBuildingAd(callback) {
  GameAds.reward('building', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchSoldierAd(callback) {
  GameAds.reward('soldier', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchTechAd(callback) {
  GameAds.reward('tech', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchFleetAd(callback) {
  GameAds.reward('fleet', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchEquipmentAd(callback) {
  GameAds.reward('equipment', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchEventAd(callback) {
  GameAds.reward('event', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

function watchDoubleAd(callback) {
  GameAds.reward('double', callback, function(err) {
    if (err && err.code === 'cooldown') showToast(t('adCooldown') || 'Ad cooldown, please wait');
    else if (err && err.code === 'daily_limit') showToast(t('adDailyLimit') || 'Daily ad limit reached');
    else showToast(t('adFailed') || 'Ad failed, try again');
  });
}

// ---------- 游戏暂停/恢复（供广告回调使用） ----------
// 如果你的游戏有暂停功能，取消注释并实现
/*
function pauseGame() {
    // 暂停游戏逻辑
    // 例如：暂停游戏循环、静音等
    console.log('[Game] Paused for ad');
}

function resumeGame() {
    // 恢复游戏逻辑
    console.log('[Game] Resumed after ad');
}
*/

// 暴露到全局
window.GameAds = GameAds;
window.pauseGame = window.pauseGame || function() {};
window.resumeGame = window.resumeGame || function() {};