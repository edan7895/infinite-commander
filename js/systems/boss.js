// ============================================================
// boss.js — Boss System
// ============================================================

// ---------- Boss 辅助函数 ----------
function getBossConfig() {
    const rank = getCurrentRank();
    return {
        bossName: getBossName(player.rankId, langCurrent),
        maxHealth: CONFIG.BOSS.hpBase + rank.id * CONFIG.BOSS.hpPerRank + player.stars * CONFIG.BOSS.hpPerStar,
        goldReward: CONFIG.BOSS.goldBase + rank.id * CONFIG.BOSS.goldPerRank,
        expReward: CONFIG.BOSS.expBase + rank.id * CONFIG.BOSS.expPerRank
    };
}

function getBossHealthPercent() {
    if (!player || !player.bossActive) return 0;
    return Math.max(0, (player.bossHealth / player.bossMaxHealth) * 100);
}

function getBossRemainingTime() {
    if (!player) return 0;
    const techMods = getTechModifiers ? getTechModifiers() : {};
    const equipMods = getEquipmentModifiers ? getEquipmentModifiers() : {};
    const radarReduction = Math.min(0.5, (techMods.radarReduction || 0) + (techMods.allBonus || 0) * 0.5 + (equipMods.allBonus || 0) * 0.3);
    const bossInterval = Math.max(60, CONFIG.BOSS.interval * (1 - radarReduction));
    return Math.max(0, bossInterval - player.bossTimer);
}

function isBossActive() {
    return player && player.bossActive === true;
}

function getBossReward() {
    return lastBossReward || null;
}

// 注意：updateBoss() 核心逻辑已在 main.js 中实现
// 此文件仅提供辅助函数供 UI 调用
console.log('✅ Boss system loaded (辅助函数)');