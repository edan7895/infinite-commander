// ============================================================
// components.js — Reusable UI Components
// ============================================================

function createModal(title, content, buttons) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center;
    z-index: 9999; animation: fadeIn 0.3s ease;
  `;

  let buttonHTML = '';
  if (buttons) {
    buttonHTML = buttons.map(function(b) {
      return `<button class="btn ${b.class || ''}" onclick="(${b.action})()">${b.label}</button>`;
    }).join('');
  }

  modal.innerHTML = `
    <div style="max-width:500px; width:90%; background:#0b0e14; border-radius:16px; padding:24px; border:1px solid rgba(255,215,0,0.2);">
      ${title ? `<h2 style="color:#f5d742; margin:0 0 12px;">${title}</h2>` : ''}
      <div style="color:#d0d5dd; line-height:1.6;">${content}</div>
      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:16px; flex-wrap:wrap;">
        ${buttonHTML}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function closeModal(modal) {
  if (modal && modal.parentNode) {
    modal.parentNode.removeChild(modal);
  }
}

function showToast(message, duration) {
  duration = duration || 3000;
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: rgba(10,14,20,0.95); color: #d0d5dd;
    padding: 12px 24px; border-radius: 10px;
    border: 1px solid rgba(255,215,0,0.2);
    box-shadow: 0 4px 30px rgba(0,0,0,0.8);
    z-index: 9999;
    text-align: center;
    animation: fadeIn 0.3s ease;
    max-width: 90%;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(function() {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, duration);
}