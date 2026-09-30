(function () {

  Object.assign(ICON_PATHS, {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    library: '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M9.5 21V10"/><path d="M14.5 21V10"/><path d="M19 21V10"/><path d="m12 3 9 5H3z"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5A6 6 0 1 0 7.5 11.5c.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    youtube: '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4C5.6 5.2 12 5 12 5s6.4.2 8.1.6A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4C18.4 18.8 12 19 12 19s-6.4-.2-8.1-.6A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>'
  });

  const ITEMS = [
    { id: 'handbook', icon: 'book',     label: 'Student Handbook' },
    { id: 'aklatan',  icon: 'library',  label: 'Aklatang Emilio Aguinaldo' },
    { id: 'cdlm',     icon: 'bulb',     label: 'CDLM' },
    { id: 'calendar', icon: 'calendar', label: 'Year Calendar', footer: true }
  ];

  const navBtn = document.getElementById('nav-others');
  const page = document.getElementById('page-others');
  if (!navBtn || !page) return;

  const fly = document.createElement('div');
  fly.className = 'others-fly';
  fly.id = 'others-fly';
  fly.setAttribute('role', 'menu');
  fly.hidden = true;
  const main = ITEMS.filter(i => !i.footer).map(i =>
    `<button type="button" class="of-item" role="menuitem" data-others-open="${i.id}"><span class="of-ico" data-icon="${i.icon}"></span><span>${i.label}</span></button>`).join('');
  const foot = ITEMS.filter(i => i.footer).map(i =>
    `<button type="button" class="of-item of-foot" role="menuitem" data-others-open="${i.id}"><span class="of-ico" data-icon="${i.icon}"></span><span>${i.label}</span></button>`).join('');
  fly.innerHTML = `<div class="of-grid">${main}</div>${foot}`;
  document.body.appendChild(fly);
  renderIcons(fly); renderIcons(navBtn); renderIcons(page);

  function place() {
    const r = navBtn.getBoundingClientRect();
    fly.style.left = Math.round(r.right + 10) + 'px';
    const h = fly.offsetHeight || 200;
    const top = Math.min(Math.max(12, r.top - 6), window.innerHeight - h - 12);
    fly.style.top = Math.round(top) + 'px';
  }
  function openFly() {
    fly.hidden = false; place();
    requestAnimationFrame(() => fly.classList.add('show'));
    navBtn.setAttribute('aria-expanded', 'true'); navBtn.classList.add('fly-open');
  }
  function closeFly() {
    fly.classList.remove('show'); fly.hidden = true;
    navBtn.setAttribute('aria-expanded', 'false'); navBtn.classList.remove('fly-open');
  }

  navBtn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    fly.hidden ? openFly() : closeFly();
  });
  navBtn.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFly(); });
  document.addEventListener('click', (e) => { if (!fly.hidden && !fly.contains(e.target)) closeFly(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFly(); });
  window.addEventListener('resize', () => { if (!fly.hidden) place(); });

  function showView(id) {
    const item = ITEMS.find(i => i.id === id); if (!item) return;
    router('others');
    page.querySelectorAll('.others-view').forEach(v => {
      const on = v.dataset.othersView === id;
      v.hidden = !on;
      if (on) v.querySelectorAll('iframe[data-src]').forEach(f => { if (!f.getAttribute('src')) f.setAttribute('src', f.dataset.src); });
    });
    page.dataset.view = id;
    closeFly();
    window.scrollTo({ top: 0 });
  }

  fly.addEventListener('click', (e) => {
    const b = e.target.closest('[data-others-open]'); if (b) showView(b.dataset.othersOpen);
  });

  document.addEventListener('pagechange', () => { if (!fly.hidden) closeFly(); });
})();
