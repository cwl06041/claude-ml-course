/* PWA 相关：SW 注册 + 更新检测 + 公式溢出提示
   四个 HTML 共用，避免重复维护。 */

/* ===== 1. Service Worker 注册（让 navigation 强制走网络，绕过 Safari HTTP 缓存）===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* ===== 2. 内容更新检测：visibilitychange 时主动 fetch 当前 URL，比较 hash =====
   不依赖 SW updatefound（因为 sw.js 文件本身不变时它不触发） */
(function () {
  let currentHash = null;

  async function hashPage() {
    try {
      const resp = await fetch(location.href, { cache: 'no-store' });
      if (!resp.ok) return null;
      const buf = await resp.arrayBuffer();
      const hash = await crypto.subtle.digest('SHA-256', buf);
      return Array.from(new Uint8Array(hash))
        .slice(0, 8)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (e) { return null; }
  }

  window.addEventListener('load', async () => {
    currentHash = await hashPage();
  });

  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || currentHash == null) return;
    const now = await hashPage();
    if (now != null && now !== currentHash) {
      currentHash = now;
      showUpdateToast();
    }
  });
})();

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
