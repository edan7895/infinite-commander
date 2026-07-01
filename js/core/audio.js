// ============================================================
// audio.js — 音效控制（静音/取消静音）
// ============================================================

// ===== 音效状态 =====
let _isMuted = false;
let _audioContext = null;
let _soundEffects = [];

// ===== 初始化音频上下文 =====
function initAudio() {
  try {
    if (!_audioContext) {
      _audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_audioContext.state === 'suspended') {
      _audioContext.resume();
    }
    return _audioContext;
  } catch (e) {
    console.warn('⚠️ 音频初始化失败:', e);
    return null;
  }
}

// ===== 静音所有音效 =====
function muteAllAudio() {
  if (_isMuted) return;
  _isMuted = true;

  // 暂停音频上下文
  if (_audioContext && _audioContext.state === 'running') {
    _audioContext.suspend();
  }

  console.log('🔇 音效已静音');
}

// ===== 取消静音 =====
function unmuteAllAudio() {
  if (!_isMuted) return;
  _isMuted = false;

  // 恢复音频上下文
  if (_audioContext && _audioContext.state === 'suspended') {
    _audioContext.resume();
  }

  console.log('🔊 音效已恢复');
}

// ===== 播放音效（示例） =====
function playSound(type) {
  if (_isMuted) return;
  if (!_audioContext) {
    initAudio();
    if (!_audioContext) return;
  }

  try {
    // 创建振荡器（简单音效）
    const oscillator = _audioContext.createOscillator();
    const gainNode = _audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(_audioContext.destination);

    // 根据类型设置音效
    switch (type) {
      case 'click':
        oscillator.frequency.setValueAtTime(600, _audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, _audioContext.currentTime);
        oscillator.start(_audioContext.currentTime);
        oscillator.stop(_audioContext.currentTime + 0.05);
        break;
      case 'upgrade':
        oscillator.frequency.setValueAtTime(800, _audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1200, _audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, _audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, _audioContext.currentTime + 0.2);
        oscillator.start(_audioContext.currentTime);
        oscillator.stop(_audioContext.currentTime + 0.2);
        break;
      case 'victory':
        oscillator.frequency.setValueAtTime(400, _audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, _audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.15, _audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, _audioContext.currentTime + 0.3);
        oscillator.start(_audioContext.currentTime);
        oscillator.stop(_audioContext.currentTime + 0.3);
        break;
      default:
        oscillator.frequency.setValueAtTime(500, _audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, _audioContext.currentTime);
        oscillator.start(_audioContext.currentTime);
        oscillator.stop(_audioContext.currentTime + 0.08);
    }
  } catch (e) {
    console.warn('⚠️ 播放音效失败:', e);
  }
}

// ===== 检查是否静音 =====
function isMuted() {
  return _isMuted;
}

// ===== 切换静音状态 =====
function toggleMute() {
  if (_isMuted) {
    unmuteAllAudio();
  } else {
    muteAllAudio();
  }
  return _isMuted;
}

// ===== 暴露到全局 =====
window.initAudio = initAudio;
window.muteAllAudio = muteAllAudio;
window.unmuteAllAudio = unmuteAllAudio;
window.playSound = playSound;
window.isMuted = isMuted;
window.toggleMute = toggleMute;

console.log('✅ 音频系统已加载');