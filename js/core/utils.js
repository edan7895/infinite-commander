// ============================================================
// utils.js — Utility Functions
// ============================================================

// ---------- Number Formatting ----------
function formatNumber(n) {
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000) return Math.floor(n).toString();
  if (n < 10000) return (n / 1000).toFixed(1) + 'K';
  if (n < 1000000) return Math.floor(n / 1000) + 'K';
  if (n < 10000000) return (n / 1000000).toFixed(1) + 'M';
  if (n < 1000000000) return Math.floor(n / 1000000) + 'M';
  if (n < 10000000000) return (n / 1000000000).toFixed(1) + 'B';
  return Math.floor(n / 1000000000) + 'B';
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return h + 'h ' + m + 'm';
  if (m > 0) return m + 'm ' + s + 's';
  return s + 's';
}

// ---------- Random ----------
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomChance(percent) {
  return Math.random() < (percent / 100);
}

// ---------- Clamp ----------
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ---------- Deep Clone ----------
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ---------- Generate ID ----------
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}