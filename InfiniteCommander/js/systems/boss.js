// ============================================================
// boss.js — Boss System
// ============================================================

let lastBossReward = null;

function updateBoss() {
  if (!player) return;

  const p = player;
  p.bossTimer++;

  if (p.bossTimer >= CONFIG.BOSS.interval && !p.bossActive) {
    // Spawn boss
    p.bossActive = true;
    const rank = getCurrentRank();
    p.bossMaxHealth = CONFIG.BOSS.hpBase + rank.id * CONFIG.BOSS.hpPerRank + p.stars * CONFIG.BOSS.hpPerStar;
    p.bossHealth = p.bossMaxHealth;
    p.bossTimer = 0;

    if (typeof updateUI === 'function') updateUI();
  }

  if (p.bossActive) {
    const damage = Math.floor(p.combatPower / 2) + 5;
    p.bossHealth -= damage;

    if (p.bossHealth <= 0) {
      // Boss defeated
      p.bossActive = false;
      p.bossDefeated++;
      p.totalBossDefeated++;

      const rank = getCurrentRank();
      const bossGold = CONFIG.BOSS.goldBase + rank.id * CONFIG.BOSS.goldPerRank + randomBetween(0, 100);
      const bossExp = CONFIG.BOSS.expBase + rank.id * CONFIG.BOSS.expPerRank + randomBetween(0, 200);

      p.gold += bossGold;
      p.totalGold += bossGold;
      p.exp += bossExp;

      p.combatPower = calcCombatPower();
      lastBossReward = { gold: bossGold, exp: bossExp };

      // Daily
      if (p.daily) {
        p.daily.bossKills = (p.daily.bossKills || 0) + 1;
      }

      if (typeof updateUI === 'function') updateUI();
    }
  }
}