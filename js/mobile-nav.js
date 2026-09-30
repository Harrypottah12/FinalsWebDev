(function () {
  const BURGER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  const CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const MQ = window.matchMedia('(max-width: 960px)');
  const root = document.documentElement;

  const sidebar = document.querySelector('.sidebar');
  const topbar = document.querySelector('.topbar');
  if (!sidebar || !topbar) return;
  sidebar.id = sidebar.id || 'app-sidebar';

  const burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'nav-burger';
  burger.id = 'nav-burger';
  burger.setAttribute('aria-label', 'Open menu');
  burger.setAttribute('aria-controls', sidebar.id);
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = BURGER;
  topbar.insertBefore(burger, topbar.firstChild);

  const head = document.createElement('div');
  head.className = 'nav-drawer-head';
  head.innerHTML = '<span class="ndh-avatar"></span><div class="ndh-text"><b></b><span>Student</span></div>' +
    '<button type="button" class="nav-drawer-close" aria-label="Close menu">' + CLOSE + '</button>';
  sidebar.insertBefore(head, sidebar.firstChild);

  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.hidden = true;
  document.body.appendChild(backdrop);

  function syncHead() {
    const src = document.getElementById('header-avatar');
    const name = document.getElementById('header-name');
    const slot = head.querySelector('.ndh-avatar, .avatar');
    if (src && slot) {
      const c = src.cloneNode(true); c.removeAttribute('id');
      slot.replaceWith(c);
    }
    head.querySelector('.ndh-text b').textContent = name ? name.textContent.trim() : 'Menu';
  }

  let hideTimer = null;
  function openNav() {
    if (!MQ.matches) return;
    syncHead();
    clearTimeout(hideTimer);
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('show'));
    root.classList.add('nav-open');
    burger.setAttribute('aria-expanded', 'true');
    const first = sidebar.querySelector('.nav-item.active') || sidebar.querySelector('.nav-item');
    setTimeout(() => first && first.focus && first.focus({ preventScroll: true }), 300);
  }
  function closeNav(returnFocus) {
    if (!root.classList.contains('nav-open')) return;
    root.classList.remove('nav-open');
    backdrop.classList.remove('show');
    burger.setAttribute('aria-expanded', 'false');
    hideTimer = setTimeout(() => { backdrop.hidden = true; }, 260);
    if (returnFocus) burger.focus({ preventScroll: true });
  }

  burger.addEventListener('click', () => root.classList.contains('nav-open') ? closeNav(true) : openNav());
  backdrop.addEventListener('click', () => closeNav(true));
  head.querySelector('.nav-drawer-close').addEventListener('click', () => closeNav(true));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(true); });

  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('.nav-item, [data-mini-go]')) closeNav(false);
  }, true);

  const onMQ = () => { if (!MQ.matches) { closeNav(false); backdrop.hidden = true; } };
  MQ.addEventListener ? MQ.addEventListener('change', onMQ) : MQ.addListener(onMQ);

  const search = topbar.querySelector('.search');
  const input = document.getElementById('search-input');
  if (search && input) {
    const open = () => { topbar.classList.add('search-open'); };
    const maybeClose = () => { if (!input.value.trim()) topbar.classList.remove('search-open'); };
    search.addEventListener('click', () => {
      if (!MQ.matches || topbar.classList.contains('search-open')) return;
      open(); setTimeout(() => input.focus(), 30);
    });
    input.addEventListener('focus', () => { if (MQ.matches) open(); });
    input.addEventListener('blur', () => { if (MQ.matches) setTimeout(maybeClose, 120); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.blur(); } });
  }

  function addReaderBurger() {
    const top = document.querySelector('.cw-top');
    if (!top || top.querySelector('.cw-burger')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cw-burger';
    b.setAttribute('aria-label', 'Module contents');
    const body = document.querySelector('.cw-body');
    b.setAttribute('aria-expanded', body && !body.classList.contains('panel-closed') ? 'true' : 'false');
    b.innerHTML = BURGER;
    top.insertBefore(b, top.firstChild);
  }
  function syncReaderBurger() {
    const b = document.querySelector('.cw-burger'), body = document.querySelector('.cw-body');
    if (b && body) b.setAttribute('aria-expanded', body.classList.contains('panel-closed') ? 'false' : 'true');
  }
  if (typeof cwRender === 'function') {
    const prev = cwRender;
    cwRender = function () {
      const out = prev.apply(this, arguments);
      addReaderBurger(); syncReaderBurger();
      return out;
    };
    if (typeof cwView !== 'undefined' && cwView) cwRender();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('.cw-burger');
    if (b) {
      const t = document.querySelector('.cw-collapse');
      if (t) t.click();
      syncReaderBurger();
      return;
    }

    if (e.target.classList && e.target.classList.contains('cw-body') && window.matchMedia('(max-width: 820px)').matches) {
      if (!e.target.classList.contains('panel-closed')) { const t = document.querySelector('.cw-collapse'); if (t) t.click(); syncReaderBurger(); }
    }
  });

  document.addEventListener('click', () => setTimeout(syncReaderBurger, 0));
})();
