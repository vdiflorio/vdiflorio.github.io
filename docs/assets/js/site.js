// vdiflorio.github.io — theme toggle and section entrances. The page works without it.
(() => {
  const root = document.documentElement;

  const btn = document.querySelector('.theme');
  if (btn) {
    const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    const label = () => { btn.textContent = isDark() ? 'Light' : 'Dark'; btn.setAttribute('aria-pressed', String(isDark())); };
    btn.addEventListener('click', () => {
      root.dataset.theme = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      label();
    });
    label();
  }

  // Entrances: content is hidden only once this script is running.
  const items = document.querySelectorAll('.rise');
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  root.classList.add('anim');
  items.forEach((el) => io.observe(el));
  // A link reached with the keyboard must never sit inside a block that has not come in yet.
  document.addEventListener('focusin', (e) => {
    const el = e.target.closest && e.target.closest('.rise');
    if (el && !el.classList.contains('in')) { el.classList.add('in'); io.unobserve(el); }
  });
})();
