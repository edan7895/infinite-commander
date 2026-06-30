// ============================================================
// security.js — Data Encryption, Checksum, Anti-Cheat
// ============================================================

const SECRET_SALT = "INFINITE_COMMANDER_SALT_2157_v2";

// ---------- 1. Data Encryption ----------
function encodeData(data) {
  try {
    const json = JSON.stringify(data);
    let encoded = btoa(json);
    encoded = encoded.split('').reverse().join('');
    let result = '';
    for (let i = 0; i < encoded.length; i++) {
      const saltChar = SECRET_SALT[i % SECRET_SALT.length];
      result += encoded[i] + saltChar;
    }
    return result;
  } catch (e) {
    return null;
  }
}

function decodeData(encoded) {
  try {
    let stripped = '';
    for (let i = 0; i < encoded.length; i += 2) {
      stripped += encoded[i];
    }
    stripped = stripped.split('').reverse().join('');
    return JSON.parse(atob(stripped));
  } catch (e) {
    return null;
  }
}

// ---------- 2. Checksum ----------
function generateChecksum(data) {
  const str = JSON.stringify(data);
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum = (sum + str.charCodeAt(i) * (i + 1)) % 1000000;
  }
  return sum;
}

// ---------- 3. Secure Save/Load ----------
function secureSave(data) {
  const checksum = generateChecksum(data);
  const payload = {
    d: data,
    c: checksum,
    v: '1.0',
    t: Date.now()
  };
  return encodeData(payload);
}

function secureLoad(encoded) {
  if (!encoded) return null;
  try {
    const payload = decodeData(encoded);
    if (!payload || !payload.d || payload.c === undefined) return null;
    const checksum = generateChecksum(payload.d);
    if (checksum !== payload.c) {
      console.warn('⚠️ Data checksum failed! Possible tampering detected.');
      return null;
    }
    return payload.d;
  } catch (e) {
    console.warn('⚠️ Data decode failed:', e);
    return null;
  }
}

// ---------- 4. Runtime Memory Protection ----------
function protectPlayer(playerData) {
  const protectedKeys = ['gold', 'exp', 'iron', 'rice', 'combatPower', 'totalGold', 'kills', 'totalKills'];

  return new Proxy(playerData, {
    set: function(obj, prop, value) {
      // Allow normal prototype chain access
      if (prop === '__proto__' || prop === 'constructor') {
        obj[prop] = value;
        return true;
      }

      // Block setting protected keys to invalid values
      if (protectedKeys.includes(prop) && typeof value === 'number') {
        if (value < 0 && prop !== 'combatPower') {
          console.warn('🔒 Security: Prevented setting negative value on ' + prop);
          return false;
        }
        if (value > 1e18) {
          console.warn('🔒 Security: Prevented setting extreme value on ' + prop + ' (' + value + ')');
          return false;
        }
        // Prevent sudden huge jumps (more than 100x in one update)
        const current = obj[prop] || 0;
        if (current > 0 && value > current * 100 && prop !== 'combatPower') {
          console.warn('🔒 Security: Prevented suspicious value jump on ' + prop);
          return false;
        }
      }

      obj[prop] = value;
      return true;
    },

    get: function(obj, prop) {
      const value = obj[prop];
      // Prevent returning NaN or undefined for numeric values
      if (protectedKeys.includes(prop) && (typeof value !== 'number' || isNaN(value))) {
        return 0;
      }
      return value;
    }
  });
}

// ---------- 5. Anti-Debug ----------
function enableAntiDebug() {
  // Disable right-click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.key === 'U') {
      e.preventDefault();
      return false;
    }
  });

  // Detect DevTools via debugger statement timing
  setInterval(function() {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > 100) {
      // DevTools might be open
      console.warn('🔒 DevTools detected');
    }
  }, 2000);

  // Prevent console.log overriding (basic protection)
  if (window.console && console.log) {
    const originalLog = console.log;
    console.log = function() {
      // Filter out sensitive data
      const args = Array.from(arguments);
      if (args.some(arg => typeof arg === 'string' && arg.includes('player'))) {
        // Redact sensitive logs
        return;
      }
      originalLog.apply(console, args);
    };
  }
}

// ---------- 6. Integrity Check ----------
function checkGameIntegrity() {
  // Check if player object is protected
  if (player) {
    const testValue = player.gold;
    try {
      player.gold = -999999;
      if (player.gold === -999999) {
        console.warn('⚠️ Player object not protected!');
        // Re-protect
        if (typeof protectPlayer === 'function') {
          const newPlayer = protectPlayer(player);
          Object.assign(player, newPlayer);
        }
      }
      player.gold = testValue;
    } catch(e) {
      // Protected successfully
    }
  }
}