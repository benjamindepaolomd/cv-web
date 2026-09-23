(() => {
  'use strict';
  // Keep the home URL clean on the web and support opening the files locally.
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    if (location.pathname.endsWith('/index.html')) {
      history.replaceState(history.state, '', location.pathname.slice(0, -10) + location.search + location.hash);
    }
  } else if (location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.href);
      if (url.protocol === 'file:' && url.pathname.endsWith('/')) {
        url.pathname += 'index.html';
        link.href = url.href;
      }
    });
  }
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : preference.matches;
  function syncTheme() {
    const dark = isDark();
    themeButton?.setAttribute('aria-label', dark ? 'Activar tema claro' : 'Activar tema oscuro');
    themeButton?.setAttribute('title', dark ? 'Activar tema claro' : 'Activar tema oscuro');
    const moon = document.getElementById('icon-moon');
    const sun = document.getElementById('icon-sun');
    if (moon) moon.hidden = dark;
    if (sun) sun.hidden = !dark;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111111' : '#ffffff');
  }
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('bdp-theme', root.dataset.theme); } catch (_) {}
    syncTheme();
  });
  preference.addEventListener('change', syncTheme);
  window.addEventListener('storage', event => {
    if (event.key !== 'bdp-theme') return;
    if (event.newValue === 'dark' || event.newValue === 'light') root.dataset.theme = event.newValue;
    else delete root.dataset.theme;
    syncTheme();
  });
  syncTheme();
  let toastTimer;
  const toast = document.getElementById('toast');
  document.getElementById('copy-email')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('benjamindepaolo8@gmail.com');
      toast.textContent = 'Email copiado';
    } catch (_) {
      toast.textContent = 'Podés seleccionar y copiar el email del enlace.';
    }
    clearTimeout(toastTimer);
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  });
})();
