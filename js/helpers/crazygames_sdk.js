// ============================================================
// crazygames_sdk.js — CrazyGames SDK 加载检查
// ============================================================

// ---------- 检查 SDK 是否加载 ----------
function isCrazyGamesSDKLoaded() {
    return typeof CrazyGames !== 'undefined' && 
           CrazyGames.SDK !== undefined && 
           typeof CrazyGames.SDK.init === 'function';
}

// ---------- 等待 SDK 加载 ----------
function waitForCrazyGamesSDK(maxWaitMs) {
    maxWaitMs = maxWaitMs || 5000;
    return new Promise((resolve) => {
        if (isCrazyGamesSDKLoaded()) {
            resolve(true);
            return;
        }
        
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (isCrazyGamesSDKLoaded()) {
                clearInterval(checkInterval);
                resolve(true);
                return;
            }
            
            if (Date.now() - startTime > maxWaitMs) {
                clearInterval(checkInterval);
                console.warn('⚠️ CrazyGames SDK 加载超时');
                resolve(false);
            }
        }, 100);
    });
}

// ---------- 获取 SDK 状态 ----------
function getCrazyGamesStatus() {
    return {
        loaded: isCrazyGamesSDKLoaded(),
        available: typeof CrazyGames !== 'undefined',
        sdkVersion: typeof CrazyGames !== 'undefined' && CrazyGames.SDK ? 
            CrazyGames.SDK.version || 'unknown' : 'not loaded'
    };
}