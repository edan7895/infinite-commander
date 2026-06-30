// ============================================================
// crazygames_leaderboard.js — CrazyGames 排行榜（已启用）
// ============================================================

// ---------- 配置 ----------
// ★★★ 从 CrazyGames 开发者后台获取你的加密密钥 ★★★
// 格式：32字节 Base64 字符串，例如：'dGhpcyBpcyBhIDMyIGJ5dGUgYmFzZTY0IGtleS4uLg=='
const ENCRYPTION_KEY = '你的32字节Base64加密密钥';

// ---------- 加密分数（官方标准实现） ----------
async function encryptScore(score, encryptionKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const algorithm = { name: 'AES-GCM', iv: iv };

    const keyBytes = new Uint8Array(
        atob(encryptionKey)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );

    const cryptoKey = await window.crypto.subtle.importKey('raw', keyBytes, algorithm, false, ['encrypt']);

    const dataBuffer = new TextEncoder().encode(score.toString());
    const encryptedBuffer = await window.crypto.subtle.encrypt(algorithm, cryptoKey, dataBuffer);

    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    return btoa(String.fromCharCode(...combined));
}

// ---------- 提交分数 ----------
async function submitScoreToCrazyGames(score) {
    // 检查 SDK 是否可用
    if (typeof CrazyGames === 'undefined' || !CrazyGames.SDK) {
        console.warn('⚠️ CrazyGames SDK 未加载');
        return false;
    }

    try {
        // 1. 加密分数
        const encryptedScore = await encryptScore(score, ENCRYPTION_KEY);
        
        // 2. 提交到 CrazyGames（官方标准方式）
        await CrazyGames.SDK.user.submitScore({
            encryptedScore: encryptedScore,
            score: score,
        });
        
        console.log('🏆 分数已提交到 CrazyGames 排行榜:', score);
        return true;
    } catch (error) {
        console.error('❌ 提交失败:', error);
        return false;
    }
}

// ---------- 获取玩家信息 ----------
async function getCrazyGamesPlayer() {
    if (typeof CrazyGames === 'undefined' || !CrazyGames.SDK) {
        console.warn('⚠️ CrazyGames SDK 未加载');
        return null;
    }

    try {
        const user = await CrazyGames.SDK.user.getUser();
        return user;
    } catch (error) {
        console.error('获取玩家信息失败:', error);
        return null;
    }
}

// ---------- 初始化 SDK ----------
async function initCrazyGamesSDK() {
    if (typeof CrazyGames === 'undefined' || !CrazyGames.SDK) {
        console.warn('⚠️ CrazyGames SDK 未加载');
        return false;
    }

    try {
        await CrazyGames.SDK.init();
        console.log('✅ CrazyGames SDK 初始化成功');
        console.log('📡 环境:', CrazyGames.SDK.environment);
        return true;
    } catch (error) {
        console.error('❌ CrazyGames SDK 初始化失败:', error);
        return false;
    }
}

// ---------- 便捷调用函数 ----------
async function submitNewHighScore(score) {
    // 先检查是否比本地记录高
    const localBest = parseInt(localStorage.getItem('bestScore') || '0');
    
    // 如果分数没有超过本地记录，不提交
    if (score <= localBest) {
        console.log('📁 分数未超过本地记录，不提交');
        return false;
    }
    
    // 保存本地记录
    localStorage.setItem('bestScore', score.toString());
    
    // 提交到 CrazyGames
    const success = await submitScoreToCrazyGames(score);
    
    if (success) {
        console.log('🎉 新纪录已提交到排行榜!');
    } else {
        console.log('📁 已保存本地记录，稍后重试');
    }
    
    return success;
}

// ---------- 本地排行榜备用 ----------
function getLocalHighScore() {
    return parseInt(localStorage.getItem('bestScore') || '0');
}

function setLocalHighScore(score) {
    const current = getLocalHighScore();
    if (score > current) {
        localStorage.setItem('bestScore', score.toString());
        return true;
    }
    return false;
}

// 导出到全局
window.encryptScore = encryptScore;
window.submitScoreToCrazyGames = submitScoreToCrazyGames;
window.getCrazyGamesPlayer = getCrazyGamesPlayer;
window.initCrazyGamesSDK = initCrazyGamesSDK;
window.submitNewHighScore = submitNewHighScore;
window.getLocalHighScore = getLocalHighScore;
window.setLocalHighScore = setLocalHighScore;