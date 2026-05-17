/* PWA 相关：SW 注册 + 更新检测 + 公式溢出提示
   四个 HTML 共用，避免重复维护。 */

/* ===== 1. Service Worker 注册 + 新版本检测 ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    let reg;
    try {
      reg = await navigator.serviceWorker.register('sw.js');
    } catch (e) { return; }
    // 主动检查更新（iOS Safari 不会自动查）
    try { reg.update(); } catch (e) {}
    // 检测到新版本 SW → 提示用户
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateToast();
        }
      });
    });
    // PWA 切回前台时再 check 一次
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        try { reg.update(); } catch (e) {}
      }
    });
  });
}

function showUpdateToast() {
  if (document.getElementById('__updateToast')) return;
  const css = document.createElement('style');
  css.textContent = `
    #__updateToast { position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
      background:#1f2937; color:white; padding:10px 12px 10px 18px; border-radius:10px;
      box-shadow:0 6px 20px rgba(0,0,0,.3); z-index:300; font-size:14px;
      display:flex; align-items:center; gap:10px; max-width:92vw; }
    #__updateToast button { background:#2563eb; color:white; border:none;
      padding:6px 14px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; }
    #__updateToast .x { background:transparent; color:#cbd5e1; padding:4px 8px;
      font-size:18px; line-height:1; font-weight:400; }`;
  document.head.appendChild(css);
  const t = document.createElement('div');
  t.id = '__updateToast';
  const span = document.createElement('span');
  span.textContent = '新版本就绪';
  const okBtn = document.createElement('button');
  okBtn.textContent = '立即更新';
  okBtn.onclick = () => location.reload();
  const xBtn = document.createElement('button');
  xBtn.className = 'x';
  xBtn.setAttribute('aria-label', '关闭');
  xBtn.textContent = '×';
  xBtn.onclick = () => t.remove();
  t.appendChild(span);
  t.appendChild(okBtn);
  t.appendChild(xBtn);
  document.body.appendChild(t);
}

/* ===== 2. 给真正溢出的 KaTeX 公式加 .is-scrollable，CSS 显示横滑提示 ===== */
(function () {
  function check() {
    document.querySelectorAll('.katex-display').forEach(el => {
      el.classList.toggle('is-scrollable', el.scrollWidth > el.clientWidth + 2);
    });
  }
  window.addEventListener('load', () => {
    setTimeout(check, 200);
    setTimeout(check, 1500);
  });
  window.addEventListener('resize', check);
})();
