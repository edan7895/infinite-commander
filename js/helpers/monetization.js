// ============================================================
// monetization.js — 广告系统统一接口 (Part 5)
// ============================================================

const GameAds = {
  _cooldown: 0,
  _dailyCount: 0,
  _dailyReset: Date.now(),
  _sdkReady: false,
  _isPaused: false,

  _isSDKReady: function() {
    if (typeof window.CrazyGames !== 'undefined' && 
        window.CrazyGames.SDK && 
        window.CrazyGames.SDK.ad) {
      return true;
    }
    return false;
  },

  reward: function(type, onSuccess, onFail, options) {
    console.log('[Ad] Requested: ' + type);

    if (this._cooldown > 0) {
      if (typeof onFail === 'function') {
        onFail({ code: 'cooldown', message: 'Ad cooldown' });
      } else if (typeof onSuccess === 'function') {
        console.warn('[Ad] Cooldown active, giving reward (dev mode)');
        onSuccess();
      }
      return;
    }

    this._checkDailyReset();
    if (this._dailyCount >= CONFIG.ADS.maxDailyAds) {
      if (typeof onFail === 'function') {
        onFail({ code: 'daily_limit', message: 'Daily ad limit reached' });
      } else if (typeof onSuccess === 'function') {
        console.warn('[Ad] Daily limit reached, giving reward (dev mode)');
        onSuccess();
      }
      return;
    }

    if (this._isSDKReady() && window.CrazyGames.SDK.environment !== 'disabled') {
      this._playRealAd(type, onSuccess, onFail);
      return;
    }

    this._playSimulatedAd(type, onSuccess, onFail);
  },

  _pauseGame: function() {
    if (this._isPaused) return;
    this._isPaused = true;
    if (typeof window.pauseGameLoop === 'function') {
      window.pauseGameLoop();
    }
    if (typeof window.muteAllAudio === 'function') {
      window.muteAllAudio();
    }
    console.log('[Game] Paused for ad');
  },

  _resumeGame: function() {
    if (!this._isPaused) return;
    this._isPaused = false;
    if (typeof window.resumeGameLoop === 'function') {
      window.resumeGameLoop();
    }
    if (typeof window.unmuteAllAudio === 'function') {
      window.unmuteAllAudio();
    }
    console.log('[Game] Resumed after ad');
  },

  _playRealAd: function(type, onSuccess, onFail) {
    const adType = (type === 'midgame') ? 'midgame' : 'rewarded';
    const self = this;

    const callbacks = {
      adStarted: function() {
        self._pauseGame();
      },
      adFinished: function() {
        self._resumeGame();
        self._dailyCount++;
        if (window.player) {
          window.player.adCount = (window.player.adCount || 0) + 1;
          if (typeof updateDailyProgress === 'function') {
            updateDailyProgress('ad', 1);
          }
        }
        self._cooldown = CONFIG.ADS.cooldown || 5;
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      },
      adError: function(error) {
        self._resumeGame();
        if (error && error.code === 'unfilled') {
          self._playSimulatedAd(type, onSuccess, onFail);
          return;
        }
        if (typeof onFail === 'function') {
          onFail(error);
        } else if (typeof onSuccess === 'function') {
          onSuccess();
        }
      }
    };

    try {
      window.CrazyGames.SDK.ad.requestAd(adType, callbacks);
    } catch (error) {
      self._resumeGame();
      this._playSimulatedAd(type, onSuccess, onFail);
    }
  },

  _playSimulatedAd: function(type, onSuccess, onFail) {
    const simDelay = CONFIG.ADS.simDelay || 1500;
    const self = this;

    this._pauseGame();
    showToast('📺 ' + (t('adLoading') || 'Loading ad...'));

    setTimeout(function() {
      if (Math.random() < 0.15) {
        self._resumeGame();
        if (typeof onFail === 'function') {
          onFail({ code: 'simulated', message: 'Simulated ad failure' });
        } else if (typeof onSuccess === 'function') {
          onSuccess();
        }
        return;
      }

      self._resumeGame();
      self._dailyCount++;
      if (window.player) {
        window.player.adCount = (window.player.adCount || 0) + 1;
        if (typeof updateDailyProgress === 'function') {
          updateDailyProgress('ad', 1);
        }
      }
      self._cooldown = CONFIG.ADS.cooldown || 5;

      showToast('✅ ' + (t('adComplete') || 'Ad complete!'));
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    }, simDelay);
  },

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

  hasAdblock: async function() {
    if (this._isSDKReady()) {
      try {
        const result = await window.CrazyGames.SDK.ad.hasAdblock();
        return result;
      } catch (error) {
        return false;
      }
    }
    return false;
  },

  getStats: function() {
    this._checkDailyReset();
    return {
      dailyCount: this._dailyCount,
      maxDaily: CONFIG.ADS.maxDailyAds || 20,
      cooldown: this._cooldown,
      remaining: Math.max(0, (CONFIG.ADS.maxDailyAds || 20) - this._dailyCount),
      sdkReady: this._isSDKReady()
    };
  },

  reset: function() {
    this._cooldown = 0;
    this._dailyCount = 0;
    this._dailyReset = Date.now();
    this._isPaused = false;
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

// 暴露到全局
window.GameAds = GameAds;
window.watchPromoteAd = watchPromoteAd;
window.watchOfflineAd = watchOfflineAd;
window.watchBossAd = watchBossAd;
window.watchBuildingAd = watchBuildingAd;
window.watchSoldierAd = watchSoldierAd;
window.watchTechAd = watchTechAd;
window.watchFleetAd = watchFleetAd;
window.watchEquipmentAd = watchEquipmentAd;
window.watchEventAd = watchEventAd;
window.watchDoubleAd = watchDoubleAd;

console.log('✅ 广告系统已加载 (monetization.js)');