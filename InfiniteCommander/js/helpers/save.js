// ============================================================
// save.js — Save/Load System (with encryption)
// ============================================================

const SAVE_KEY = 'commander_save';

function saveGame() {
  if (!player) return false;
  try {
    const data = deepClone(player);
    const encrypted = secureSave(data);
    if (!encrypted) return false;
    localStorage.setItem(SAVE_KEY, encrypted);
    return true;
  } catch (e) {
    console.warn('Save failed:', e);
    return false;
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = secureLoad(raw);
    if (!data) return false;
    // Merge into player
    for (const key in data) {
      if (data.hasOwnProperty(key) && typeof data[key] !== 'function') {
        // Handle nested objects
        if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
          if (!player[key]) player[key] = {};
          for (const subKey in data[key]) {
            if (data[key].hasOwnProperty(subKey)) {
              player[key][subKey] = data[key][subKey];
            }
          }
        } else {
          player[key] = data[key];
        }
      }
    }
    // Recalculate combat power
    if (typeof calcCombatPower === 'function') {
      player.combatPower = calcCombatPower();
    }
    // Check integrity
    if (typeof checkGameIntegrity === 'function') {
      checkGameIntegrity();
    }
    return true;
  } catch (e) {
    console.warn('Load failed:', e);
    return false;
  }
}

function autoSave() {
  if (player) {
    saveGame();
  }
}

// Auto-save every 30 seconds
setInterval(autoSave, 30000);

// Save on page unload
window.addEventListener('beforeunload', function() {
  autoSave();
});