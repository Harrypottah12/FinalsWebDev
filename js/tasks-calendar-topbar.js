(function wireRightPanelCollapse() {
  const btn = document.getElementById('right-collapse-btn');
  const shell = document.querySelector('.app-shell');
  if (!btn || !shell) return;
  let collapsed = store.get('lms_right_collapsed', false);
  function apply() {
    shell.classList.toggle('right-collapsed', collapsed);
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.setAttribute('aria-label', collapsed ? 'Show side panel' : 'Hide side panel');
  }
  apply();
  btn.addEventListener('click', () => {
    collapsed = !collapsed;
    store.set('lms_right_collapsed', collapsed);
    apply();
  });
})();

function wireSectionCollapse(btnId, targetId) {
  const btn = document.getElementById(btnId);
  const target = document.getElementById(targetId);
  if (!btn || !target) return;
  let collapsed = false;
  function apply() {
    target.hidden = collapsed;
    btn.classList.toggle('is-collapsed', collapsed);
    btn.setAttribute('aria-expanded', String(!collapsed));
  }
  apply();
  btn.addEventListener('click', () => { collapsed = !collapsed; apply(); });
}
wireSectionCollapse('assessments-toggle', 'assessment-list');
wireSectionCollapse('mini-todo-toggle', 'sidebar-mini-todo');
wireSectionCollapse('mini-news-toggle', 'sidebar-mini-news');

const ASSESS_TYPES_V8 = [
  { name: 'Enabling Assessment (Onsite)', max: 50 },
  { name: 'Enabling Assessment (Online)', max: 25 },
  { name: 'Class Participation', max: 10 },
  { name: 'Long Quiz', max: 30 }
];
const ASSESS_DATES_V8 = [
  '2026-08-03', '2026-08-10', '2026-08-17', '2026-08-24', '2026-08-31',
  '2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28'
];
function buildAssessments() {
  const today = daysFromToday(0);
  const out = [];
  state.modules.forEach((mod, si) => {
    const midModules = (mod.modules || []).filter(m => m.term === 'Midterm');
    ASSESS_DATES_V8.forEach((date, i) => {
      const type = ASSESS_TYPES_V8[i % ASSESS_TYPES_V8.length];
      const modIdx = midModules.length
        ? Math.min(midModules.length - 1, Math.floor(i * midModules.length / ASSESS_DATES_V8.length))
        : 0;
      const modRef = midModules[modIdx];
      out.push({
        id: 'as' + si + '-' + i,
        subjectId: mod.id, code: mod.code, subject: mod.category,
        title: `${type.name} ${Math.floor(i / ASSESS_TYPES_V8.length) + 1}`,
        max: type.max,
        moduleN: modRef ? modRef.n : null,
        moduleTitle: modRef ? modRef.title : '',
        date, done: date < today
      });
    });
  });
  return out;
}
const PATCH8_VERSION = 'p8-v1';
(function reseedAssessments8() {
  if (store.get('lms_patch8_version', '') !== PATCH8_VERSION) {
    state.assessments = buildAssessments();
    store.set('lms_patch8_version', PATCH8_VERSION);
    persistAssessments();
  }
})();

function assessScoreV8(a) {
  const h = pseudoHash(a.id + '-score-v8');
  let pct = 74 + (h % 22);
  if (h % 9 === 0) pct = Math.min(100, pct + 5);
  return Math.round((pct / 100) * a.max);
}
function gradeTierFor(pct) {
  return GRADE_SCALE.find(t => pct >= t[1]) || GRADE_SCALE[GRADE_SCALE.length - 1];
}
function renderAssessmentPanelHTML(mod) {
  const items = assessmentsFor(mod);
  if (!items.length) return `<p class="empty-note">No assessments recorded for this subject yet.</p>`;
  const rows = items.map(a => {
    const submitted = !!a.done;
    const score = submitted ? assessScoreV8(a) : null;
    const pct = submitted ? Math.round((score / a.max) * 100) : null;
    return `<tr>
      <td>
        <div class="assess-title">${esc(a.title)}</div>
        ${a.moduleTitle ? `<div class="assess-module">Module ${a.moduleN} &middot; ${esc(a.moduleTitle)}</div>` : ''}
      </td>
      <td>${formatTaskDate(assessStart(a))}</td>
      <td>${formatTaskDate(a.date)}</td>
      <td class="${submitted ? 'assess-submit-yes' : 'assess-submit-no'}">${submitted ? 'Submitted' : 'Pending'}</td>
      <td>${submitted ? `${score}/${a.max} <span class="assess-pct">${pct}%</span>` : '-'}</td>
    </tr>`;
  }).join('');

  const done = items.filter(a => a.done);
  const allDone = done.length === items.length;
  const totalScore = done.reduce((s, a) => s + assessScoreV8(a), 0);
  const totalMax = done.reduce((s, a) => s + a.max, 0);
  const overallPct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;

  let subtotalRow = '';
  if (allDone && items.length) {
    const tier = gradeTierFor(overallPct);
    subtotalRow = `<tr class="assess-subtotal-row">
      <td colspan="4">Midterm Period subtotal</td>
      <td>${overallPct}% <span class="assess-pct">${tier[0].toFixed(2)}</span></td>
    </tr>`;
  }

  const meta = allDone
    ? `Midterm complete - overall grade <b>${gradeTierFor(overallPct)[0].toFixed(2)}</b> based on all ${items.length} assessments.`
    : `Overall grade based on <b>${done.length}</b> of ${items.length} submitted assessment${items.length === 1 ? '' : 's'}.`;

  return `
    <div class="assess-table-wrap">
      <table class="assess-table">
        <thead><tr><th>Assessment</th><th>Start</th><th>Due</th><th>Status</th><th>Score</th></tr></thead>
        <tbody>${rows}${subtotalRow}</tbody>
      </table>
    </div>
    <div class="grade-ring-wrap">
      <div class="grade-ring" style="--pct:${overallPct}%">
        <div class="grade-ring-inner"><span class="grade-ring-num">${overallPct}%</span><span class="grade-ring-cap">OVERALL</span></div>
      </div>
      <div class="grade-meta">${meta}</div>
    </div>`;
}

const CREDIT_CAP = 5000;
const INCENTIVE_TIERS = [2500, 5000];
function creditsFor() {
  return Math.max(0, Math.min(CREDIT_CAP, state.gamification.xp));
}
function incentivesUnlocked(credits) {
  let n = 0;
  INCENTIVE_TIERS.forEach(t => { if (credits >= t) n += 1; });
  return n;
}
function perkTierLabel(unlocked) {
  if (unlocked >= 2) return '2 Incentives Unlocked';
  if (unlocked >= 1) return '1 Incentive Unlocked';
  return 'Building Credits';
}

function renderProfileStats() {
  const credits = creditsFor();
  const pct = Math.round((credits / CREDIT_CAP) * 100);
  const unlocked = incentivesUnlocked(credits);
  const remaining = Math.max(0, (INCENTIVE_TIERS.find(t => credits < t) || CREDIT_CAP) - credits);

  document.getElementById('right-name').textContent = state.userProfile.name;
  document.getElementById('right-handle').textContent = '@' + (state.userProfile.studentNumber || 'student');

  document.getElementById('xp-avatar').style.setProperty('--pct', pct + '%');
  const levelBadge = document.getElementById('card-level-badge');
  if (levelBadge) levelBadge.hidden = true;
  document.getElementById('card-rank-title').textContent = perkTierLabel(unlocked);
  document.getElementById('xp-bar-fill').style.width = pct + '%';
  document.getElementById('xp-current').textContent = `${credits.toLocaleString()} / ${CREDIT_CAP.toLocaleString()} credits`;
  document.getElementById('xp-next').textContent = unlocked >= 2
    ? 'Cap reached'
    : `${remaining.toLocaleString()} to next perk`;

  const rankStat = document.getElementById('stat-rank');
  if (rankStat) { const pill = rankStat.closest('.stat-pill'); if (pill) pill.hidden = true; }
  document.getElementById('stat-streak').textContent = currentStreak();
  document.getElementById('stat-badges').textContent = state.awards.length;

  if (state.navActive === 'profile') { renderLevelCard(); renderAwardsGrid(); }
}

function renderLevelCard() {
  const credits = creditsFor();
  const pct = Math.round((credits / CREDIT_CAP) * 100);
  const unlocked = incentivesUnlocked(credits);
  const remaining = Math.max(0, (INCENTIVE_TIERS.find(t => credits < t) || CREDIT_CAP) - credits);

  const ring = document.getElementById('level-ring');
  if (ring) {
    ring.style.setProperty('--pct', pct + '%');
    const label = ring.querySelector('.level-label');
    if (label) label.textContent = 'Perks';
  }
  const numEl = document.getElementById('level-num');
  if (numEl) numEl.textContent = unlocked;
  document.getElementById('level-rank').textContent = perkTierLabel(unlocked);
  document.getElementById('level-xp').textContent = `${credits.toLocaleString()} / ${CREDIT_CAP.toLocaleString()} credits`;
  document.getElementById('level-next').textContent = unlocked >= 2
    ? 'Engagement cap reached for this term'
    : `${remaining.toLocaleString()} credits to ${unlocked === 0 ? 'your first incentive (2,500)' : 'your second incentive (5,000)'}`;
}

function moduleCredits(mod, m) {
  const h = pseudoHash(mod.id + '-credits-' + m.n);
  return 60 + (h % 91);
}
function moduleRowHTML(mod, m, done) {
  const locked = m.term === 'Finals';
  const stateLabel = locked ? `Module Locked ${iconSVG('lock')}` : (done ? `Completed ${iconSVG('check')}` : 'In progress');
  const credits = moduleCredits(mod, m);
  const creditBadge = locked ? '' : `<span class="mod-credits">${iconSVG('bolt')} ${done ? '+' + credits : 'Up to ' + credits} credits</span>`;
  return `<div class="mod-row ${locked ? 'is-locked' : (done ? 'is-done' : '')}">
    <img class="mod-thumb" src="${subjectArt(mod, 160, 110)}" alt="">
    <div class="mod-main">
      <h4>${m.n}. ${esc(m.title)}</h4>
      <p>${esc(m.desc)}</p>
      <div class="mod-foot">
        <span class="mod-state ${locked ? 'locked' : (done ? 'done' : '')}">${stateLabel}</span>
        <span class="mod-sections">${m.sections} sections</span>
        ${creditBadge}
      </div>
    </div>
    <span class="term-pill ${m.term.toLowerCase()}">${m.term}</span>
  </div>`;
}

function renderLeaderboard() {
  const panel = document.getElementById('leaderboard-panel');
  if (panel) panel.remove();
}

function renderSemesterPane() {
  const pane = document.getElementById('profile-pane-semester');
  pane.innerHTML = `
    <div class="panel">
      <div class="section-head"><h3>Class Schedule</h3><span class="term-label">Hover a class for room, professor and time</span></div>
      <div class="sch-wrap" id="sch-wrap">${scheduleGridHTML()}</div>
    </div>`;
  wireSchedule(document.getElementById('sch-wrap'));
  renderIcons(pane);
}

renderProfileStats();
if (state.navActive === 'profile') { renderLevelCard(); renderLeaderboard(); }
if (state.navActive === 'task') renderTasks();
renderIcons();

renderCalendar = function () {
  const cal = document.getElementById('calendar');
  const titleEl = document.getElementById('calendar-title');
  if (!cal) return;
  cal.classList.remove('month-grid');
  cal.classList.add('week-outline');

  const days = weekRange(taskWeekOffset);
  const todayIso = daysFromToday(0);
  const rangeLabel = `${days[0].toLocaleDateString([], { month: 'short', day: 'numeric' })} \u2013 ${days[6].toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  if (titleEl) titleEl.textContent = 'This Week';

  let html = `
    <div class="week-outline-head">
      <button type="button" id="week-outline-prev" aria-label="Previous week"><span data-icon="chevronLeft"></span></button>
      <span>${rangeLabel}</span>
      <button type="button" id="week-outline-next" aria-label="Next week"><span data-icon="chevronRight"></span></button>
    </div>`;

  days.forEach(d => {
    const iso = localISO(d);
    const items = weekItemsFor(iso);
    const doneCount = items.filter(i => i.done).length;
    html += `<div class="week-outline-day ${iso === todayIso ? 'is-today' : ''}">
      <div class="week-outline-day-head">
        <span>${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        ${items.length ? `<span class="week-outline-count">${doneCount}/${items.length} done</span>` : ''}
      </div>
      <ul class="task-list">
        ${items.length ? items.map(weekOutlineItemHTML).join('') : `<li class="empty-hint">Nothing due or planned.</li>`}
      </ul>
    </div>`;
  });

  cal.innerHTML = html;
  renderIcons(cal);

  document.getElementById('week-outline-prev').addEventListener('click', () => { taskWeekOffset -= 1; renderCalendar(); });
  document.getElementById('week-outline-next').addEventListener('click', () => { taskWeekOffset += 1; renderCalendar(); });

  cal.querySelectorAll('[data-as-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const a = state.assessments.find(x => x.id === cb.dataset.asToggle);
    a.done = cb.checked;
    persistAssessments();
    renderCalendar();
    renderAssessments();
    if (state.navActive === 'dashboard') refreshHome();
    if (a.done) awardXP(XP_TASK, 'submitting an assessment');
  }));
  cal.querySelectorAll('[data-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const t = state.tasks.find(x => x.id === cb.dataset.toggle);
    t.done = cb.checked;
    if (t.done && !t.xpGiven) { t.xpGiven = true; awardXP(XP_TASK, 'completing a task'); }
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
  cal.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => t.id !== btn.dataset.remove);
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
};
renderTasks = function () {
  const fullList = document.getElementById('task-list');
  const filterBanner = document.getElementById('task-filter-banner');
  if (filterBanner) filterBanner.hidden = true;

  fullList.innerHTML = state.tasks.map(t => `
    <li class="${t.done ? 'done' : ''}" data-task="${t.id}">
      <input type="checkbox" ${t.done ? 'checked' : ''} data-toggle="${t.id}" aria-label="Mark task done">
      <span class="task-text">${esc(t.text)}</span>
      ${t.date ? `<span class="task-date">${formatTaskDate(t.date)}</span>` : ''}
      <button data-remove="${t.id}" title="Remove" aria-label="Remove task">${iconSVG('x')}</button>
    </li>`).join('') || `<li class="empty-hint">No tasks yet. Add one above.</li>`;
  wireTaskControls(fullList);

  const sideList = document.getElementById('sidebar-task-list');
  if (sideList) {
    const pending = state.tasks.filter(t => !t.done).slice(0, 4);
    sideList.innerHTML = pending.map(taskItemHTML).join('') || `<li class="empty-hint">Your to-do list is empty.</li>`;
    wireTaskControls(sideList);
  }
  renderAssessments();
  renderIcons();
};
moduleRowHTML = function (mod, m, done) {
  const locked = m.term === 'Finals';
  const stateLabel = locked ? `Module Locked ${iconSVG('lock')}` : (done ? `Completed ${iconSVG('check')}` : 'In progress');
  return `<div class="mod-row ${locked ? 'is-locked' : (done ? 'is-done' : '')}">
    <img class="mod-thumb" src="${subjectArt(mod, 160, 110)}" alt="">
    <div class="mod-main">
      <h4>${m.n}. ${esc(m.title)}</h4>
      <p>${esc(m.desc)}</p>
      <div class="mod-foot">
        <span class="mod-state ${locked ? 'locked' : (done ? 'done' : '')}">${stateLabel}</span>
        <span class="mod-sections">${m.sections} sections</span>
      </div>
    </div>
    <span class="term-pill ${m.term.toLowerCase()}">${m.term}</span>
  </div>`;
};

let topCalMonthOffset = 0;

function topCalendarPopoverHTML() {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + topCalMonthOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthLabel = base.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIso = daysFromToday(0);

  let grid = dows.map(d => `<div class="topcal-cell topcal-dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) grid += `<div class="topcal-cell topcal-blank"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(year, month, d));
    const hasItems = state.assessments.some(a => a.date === iso && !a.done) || state.tasks.some(t => t.date === iso && !t.done);
    grid += `<button type="button" class="topcal-cell topcal-day ${iso === todayIso ? 'is-today' : ''} ${iso === state.selectedDate ? 'is-active' : ''}"
      data-topcal-date="${iso}">${d}${hasItems ? '<span class="topcal-dot"></span>' : ''}</button>`;
  }

  return `
    <div class="topcal-head">
      <button type="button" class="topcal-nav" id="topcal-prev" aria-label="Previous month"><span data-icon="chevronLeft"></span></button>
      <span class="topcal-month">${monthLabel}</span>
      <button type="button" class="topcal-nav" id="topcal-next" aria-label="Next month"><span data-icon="chevronRight"></span></button>
    </div>
    <div class="topcal-grid">${grid}</div>`;
}

function wireTopCalendarPopover() {
  const pop = document.getElementById('cal-popover');
  if (!pop) return;
  renderIcons(pop);
  const prev = document.getElementById('topcal-prev');
  const next = document.getElementById('topcal-next');
  if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); topCalMonthOffset -= 1; pop.innerHTML = topCalendarPopoverHTML(); wireTopCalendarPopover(); });
  if (next) next.addEventListener('click', (e) => { e.stopPropagation(); topCalMonthOffset += 1; pop.innerHTML = topCalendarPopoverHTML(); wireTopCalendarPopover(); });
  pop.querySelectorAll('[data-topcal-date]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      state.selectedDate = el.dataset.topcalDate;
      renderUpcomingClasses();
      pop.hidden = true;
    });
  });
}

function newsPopoverHTML() {
  const items = [...state.news].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.ts - a.ts).slice(0, 5);
  return items.map(p => `
    <div class="popover-item" data-open-news="${esc(p.id)}" role="button" tabindex="0">
      <b>${esc(p.title)}</b>
      <span>${esc(p.author)} &middot; ${timeAgo(p.ts)}</span>
    </div>`).join('') || `<div class="popover-item"><span>No news yet.</span></div>`;
}

(function addTopBarIcons() {
  const search = document.querySelector('.topbar .search');
  const msgBtn = document.getElementById('msg-btn');
  if (!search || !msgBtn) return;

  const calBtn = document.createElement('div');
  calBtn.className = 'icon-btn';
  calBtn.id = 'cal-btn';
  calBtn.setAttribute('role', 'button');
  calBtn.setAttribute('tabindex', '0');
  calBtn.setAttribute('aria-label', 'Calendar');
  calBtn.innerHTML = `<span class="ico" data-icon="calendar"></span><div class="popover" id="cal-popover" hidden></div>`;

  const newsBtn = document.createElement('div');
  newsBtn.className = 'icon-btn';
  newsBtn.id = 'topnews-btn';
  newsBtn.setAttribute('role', 'button');
  newsBtn.setAttribute('tabindex', '0');
  newsBtn.setAttribute('aria-label', 'News');
  newsBtn.innerHTML = `<span class="ico" data-icon="megaphone"></span><div class="popover" id="topnews-popover" hidden></div>`;

  msgBtn.parentNode.insertBefore(calBtn, msgBtn);
  msgBtn.parentNode.insertBefore(newsBtn, msgBtn);
  renderIcons(document.querySelector('.topbar'));

  toggleHeaderPopover('cal-btn', 'cal-popover', topCalendarPopoverHTML);
  const _origCalToggle = calBtn.onclick;
  calBtn.addEventListener('click', () => { if (!document.getElementById('cal-popover').hidden) wireTopCalendarPopover(); });

  toggleHeaderPopover('topnews-btn', 'topnews-popover', newsPopoverHTML);
  newsBtn.addEventListener('click', () => {
    const pop = document.getElementById('topnews-popover');
    if (pop.hidden) return;
    pop.querySelectorAll('[data-open-news]').forEach(el => el.addEventListener('click', () => {
      router('dashboard');
      setHomeTab('news');
    }));
  });
})();

(function removeSidebarMini() {
  const mini = document.getElementById('sidebar-mini');
  if (mini) mini.remove();
})();

(function removeWeekStrip() {
  const head = document.querySelector('.week-strip-head');
  const strip = document.getElementById('week-strip');
  if (head) head.remove();
  if (strip) strip.remove();
})();

(function wireAssessmentsDueLink() {
  const rowHead = document.getElementById('assessment-count') ? document.getElementById('assessment-count').closest('.row-head') : null;
  if (!rowHead) return;
  rowHead.classList.add('row-head-link');
  rowHead.setAttribute('role', 'button');
  rowHead.setAttribute('tabindex', '0');
  rowHead.setAttribute('aria-label', 'Go to this week\u2019s tasks');
  const go = (e) => {
    if (e.target.closest('.chevron-btn')) return;
    taskWeekOffset = 0;
    router('task');
  };
  rowHead.addEventListener('click', go);
  rowHead.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(e); });
})();

let taskWeekOffset = 0;

function weekRange(offset) {
  const now = new Date();
  now.setDate(now.getDate() + offset * 7);
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function weekItemsFor(iso) {
  const dueHere = state.assessments.filter(a => a.date === iso).map(a => Object.assign({ kind: 'assessment' }, a));
  const tasksHere = state.tasks.filter(t => t.date === iso).map(t => Object.assign({ kind: 'task' }, t));
  return dueHere.concat(tasksHere);
}

function weekOutlineItemHTML(item) {
  if (item.kind === 'assessment') {
    return `<li class="${item.done ? 'done' : ''} assessment-item">
      <input type="checkbox" ${item.done ? 'checked' : ''} data-as-toggle="${item.id}" aria-label="Mark assessment done">
      <span class="task-text"><span class="as-code">${esc(item.code || '')}</span>${esc(item.title)}</span>
      <span class="task-date">Due</span>
    </li>`;
  }
  return `<li class="${item.done ? 'done' : ''}" data-task="${item.id}">
    <input type="checkbox" ${item.done ? 'checked' : ''} data-toggle="${item.id}" aria-label="Mark task done">
    <span class="task-text">${esc(item.text)}</span>
    <button data-remove="${item.id}" title="Remove" aria-label="Remove task">${iconSVG('x')}</button>
  </li>`;
}

if (state.navActive === 'task') { renderCalendar(); renderTasks(); }

if (state.navActive === 'dashboard') refreshHome();
renderIcons();

buildAssessments = function () {
  const today = daysFromToday(0);
  const out = [];
  state.modules.forEach((mod, si) => {
    const offset = si % 5;
    const midModules = (mod.modules || []).filter(m => m.term === 'Midterm');
    ASSESS_DATES_V8.forEach((base, i) => {
      const d = new Date(base + 'T00:00:00');
      d.setDate(d.getDate() + offset);
      const date = localISO(d);
      const type = ASSESS_TYPES_V8[i % ASSESS_TYPES_V8.length];
      const modIdx = midModules.length
        ? Math.min(midModules.length - 1, Math.floor(i * midModules.length / ASSESS_DATES_V8.length))
        : 0;
      const modRef = midModules[modIdx];
      out.push({
        id: 'as' + si + '-' + i,
        subjectId: mod.id, code: mod.code, subject: mod.category,
        title: `${type.name} ${Math.floor(i / ASSESS_TYPES_V8.length) + 1}`,
        max: type.max,
        moduleN: modRef ? modRef.n : null,
        moduleTitle: modRef ? modRef.title : '',
        date, done: date < today
      });
    });
  });
  return out;
};
topCalendarPopoverHTML = function () {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + topCalMonthOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthLabel = base.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIso = daysFromToday(0);

  let grid = dows.map(d => `<div class="topcal-cell topcal-dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) grid += `<div class="topcal-cell topcal-blank"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(year, month, d));
    const due = state.assessments.filter(a => a.date === iso && !a.done);
    const todo = state.tasks.filter(t => t.date === iso && !t.done);
    const dots = `${todo.length ? '<span class="topcal-dot todo-dot"></span>' : ''}${due.length ? '<span class="topcal-dot due-dot"></span>' : ''}`;
    const tip = due.length || todo.length
      ? esc(todo.map(t => t.text).concat(due.map(a => a.title)).join(', '))
      : '';
    grid += `<button type="button" class="topcal-cell topcal-day ${iso === todayIso ? 'is-today' : ''} ${iso === state.selectedDate ? 'is-active' : ''}"
      data-topcal-date="${iso}" title="${tip}">${d}<span class="topcal-dots">${dots}</span></button>`;
  }

  return `
    <div class="topcal-head">
      <button type="button" class="topcal-nav" id="topcal-prev" aria-label="Previous month"><span data-icon="chevronLeft"></span></button>
      <span class="topcal-month">${monthLabel}</span>
      <button type="button" class="topcal-nav" id="topcal-next" aria-label="Next month"><span data-icon="chevronRight"></span></button>
    </div>
    <div class="topcal-grid">${grid}</div>
    <div class="topcal-legend"><span><i class="topcal-dot todo-dot"></i> To-do</span><span><i class="topcal-dot due-dot"></i> Due</span></div>`;
};
wireTopCalendarPopover = function () {
  const pop = document.getElementById('cal-popover');
  if (!pop) return;
  renderIcons(pop);
  const prev = document.getElementById('topcal-prev');
  const next = document.getElementById('topcal-next');
  if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); topCalMonthOffset -= 1; pop.innerHTML = topCalendarPopoverHTML(); wireTopCalendarPopover(); });
  if (next) next.addEventListener('click', (e) => { e.stopPropagation(); topCalMonthOffset += 1; pop.innerHTML = topCalendarPopoverHTML(); wireTopCalendarPopover(); });
  pop.querySelectorAll('[data-topcal-date]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const iso = el.dataset.topcalDate;
      state.selectedDate = iso;
      renderUpcomingClasses();
      pop.hidden = true;
      openAddTaskModal(iso);
    });
  });
};
renderCalendar = function () {
  const cal = document.getElementById('calendar');
  const titleEl = document.getElementById('calendar-title');
  if (!cal) return;
  cal.classList.remove('month-grid');
  cal.classList.add('week-outline');

  const days = weekRange(taskWeekOffset);
  const todayIso = daysFromToday(0);
  const rangeLabel = `${days[0].toLocaleDateString([], { month: 'short', day: 'numeric' })} \u2013 ${days[6].toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  if (titleEl) titleEl.textContent = 'This Week';

  let html = `
    <div class="week-outline-head">
      <button type="button" id="week-outline-prev" aria-label="Previous week"><span data-icon="chevronLeft"></span></button>
      <span>${rangeLabel}</span>
      <button type="button" id="week-outline-next" aria-label="Next week"><span data-icon="chevronRight"></span></button>
    </div>`;

  days.forEach(d => {
    const iso = localISO(d);
    const items = weekItemsFor(iso);
    const doneCount = items.filter(i => i.done).length;
    html += `<div class="week-outline-day ${iso === todayIso ? 'is-today' : ''}">
      <div class="week-outline-day-head">
        <span>${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        <button type="button" class="week-add-btn" data-add-task-date="${iso}" aria-label="Add task or event">${iconSVG('plus')}</button>
      </div>
      ${items.length ? `<span class="week-outline-count">${doneCount}/${items.length} done</span>` : ''}
      <ul class="task-list">
        ${items.length ? items.map(weekOutlineItemHTML).join('') : `<li class="empty-hint">Nothing due or planned.</li>`}
      </ul>
    </div>`;
  });

  cal.innerHTML = html;
  renderIcons(cal);

  document.getElementById('week-outline-prev').addEventListener('click', () => { taskWeekOffset -= 1; renderCalendar(); });
  document.getElementById('week-outline-next').addEventListener('click', () => { taskWeekOffset += 1; renderCalendar(); });

  cal.querySelectorAll('[data-add-task-date]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddTaskModal(btn.dataset.addTaskDate);
  }));

  cal.querySelectorAll('[data-as-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const a = state.assessments.find(x => x.id === cb.dataset.asToggle);
    a.done = cb.checked;
    persistAssessments();
    renderCalendar();
    renderAssessments();
    if (state.navActive === 'dashboard') refreshHome();
    if (a.done) awardXP(XP_TASK, 'submitting an assessment');
  }));
  cal.querySelectorAll('[data-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const t = state.tasks.find(x => x.id === cb.dataset.toggle);
    t.done = cb.checked;
    if (t.done && !t.xpGiven) { t.xpGiven = true; awardXP(XP_TASK, 'completing a task'); }
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
  cal.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => t.id !== btn.dataset.remove);
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
};
renderUpcomingClasses = function () {
  const iso = state.selectedDate || daysFromToday(0);
  const d = new Date(iso + 'T00:00:00');
  const title = document.getElementById('agenda-title');
  if (title) {
    title.textContent = iso === daysFromToday(0) ? "Today's Classes"
      : iso === daysFromToday(1) ? "Tomorrow's Classes"
        : d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) + "'s Classes";
  }
  const box = document.getElementById('upcoming-class-list');
  const list = classesOn(iso);
  box.innerHTML = list.map(({ mod, mt }) => {
    const prof = state.mentors.find(x => x.id === mod.mentorId) || {};
    const dueHere = state.assessments.some(a => a.subjectId === mod.id && a.date === iso && !a.done);
    return `<div class="upcoming-item" role="button" tabindex="0" data-open-lesson="${mod.id}">
      <div class="upcoming-time">${fmtShort(mt.from)}</div>
      <div class="upcoming-info">
        <div class="upcoming-title">${esc(mod.category)} <span class="kind-tag">${mod.kind === 'LABORATORY' ? 'LAB' : 'LEC'}</span>${dueHere ? '<span class="upcoming-due-tag">Due</span>' : ''}</div>
        <div class="upcoming-sub">${esc(mt.room)} - ${esc(prof.name || 'TBA')}</div>
      </div></div>`;
  }).join('') || `<p class="empty-note">No classes scheduled for this day.</p>`;
  box.querySelectorAll('[data-open-lesson]').forEach(el =>
    el.addEventListener('click', (e) => { e.stopPropagation(); openLessonDrawer(el.dataset.openLesson); }));
};
renderHeroCarousel = function () {
  const firstName = (state.userProfile.name || 'there').split(' ')[0];
  const blockers = criticalTasks();
  const next = nextUpcomingModule();

  const slide1 = `
    <div class="hero-slide slide-welcome slide-welcome-plain" role="group" aria-roledescription="slide" aria-label="1 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('calendar')} ${TERM_LABEL}</div>
        <h1>${greetingLabel()}, ${esc(firstName)}</h1>
        <button class="hero-pill" data-hero-go="lesson">${iconSVG('book')} Continue learning</button>
      </div>
    </div>`;

  const nextPct = next ? Math.round((next.mod.watched / next.mod.total) * 100) : 100;
  const slide2 = `
    <div class="hero-slide slide-agenda" role="group" aria-roledescription="slide" aria-label="2 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('clock')} Today's agenda</div>
        <h1>${next ? esc(next.mod.category) : "You're all caught up"}</h1>
        <p class="hero-sub">${next ? `Online with ${esc(next.mentor.name || 'your professor')}. ${next.mod.watched} of ${next.mod.total} modules watched.` : 'No pending classes right now. Nice work.'}</p>
        <button class="hero-pill" data-hero-go="agenda">${iconSVG('book')} View agenda</button>
      </div>
      <div class="hero-art">
        <div class="hero-card">
          <div class="hero-card-icon">${iconSVG(next ? subjectIcon(next.mod.category) : 'check')}</div>
          <div class="hero-card-num">${next ? next.mod.watched : state.modules.length}<span>${next ? '/ ' + next.mod.total : ''}</span></div>
          <div class="hero-card-cap">${next ? 'modules watched' : 'courses finished'}</div>
          <div class="hero-bar"><span style="width:${nextPct}%"></span></div>
        </div>
      </div>
    </div>`;

  const list = blockers.slice(0, 3).map(t => `
      <div class="hero-task">${iconSVG('alert')}<span>${esc(t.text)}</span><em>${dueLabel(t.date)}</em></div>`).join('');
  const slide3 = `
    <div class="hero-slide slide-blockers" role="group" aria-roledescription="slide" aria-label="3 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('alert')} Due soon</div>
        <h1>${blockers.length ? `${blockers.length} assessment${blockers.length === 1 ? '' : 's'} due today or tomorrow` : 'Nothing due today or tomorrow'}</h1>
        <p class="hero-sub">${blockers.length ? 'Finish these first to keep your streak and earn XP.' : 'Nothing urgent on your plate. Use the time to get ahead on a lesson.'}</p>
        <button class="hero-pill" data-hero-go="task">${iconSVG('tasks')} View tasks</button>
      </div>
      <div class="hero-art">
        <div class="hero-card list">
          ${list || `<div class="hero-clear">${iconSVG('check')} All clear</div>`}
        </div>
      </div>
    </div>`;

  document.getElementById('hero-slides').innerHTML = slide1 + slide2 + slide3;
  document.getElementById('hero-dots').innerHTML = [0, 1, 2].map(i =>
    `<button data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');
  applyHeroSlide();
};
renderChips = function (containerId) {
  const box = document.getElementById(containerId);
  const cats = getCategories();
  const groups = {};
  state.modules.forEach(m => { (groups[m.category] = groups[m.category] || []).push(m); });
  const subjectNames = Object.keys(groups);
  const doneSubjects = subjectNames.filter(c => groups[c].every(m => m.watched >= m.total)).length;

  box.innerHTML = cats.map(cat => {
    const ringStyle = cat === 'All' ? 'background:var(--text-main);color:var(--card);' : avatarStyle(cat);
    let sub;
    if (cat === 'All') {
      sub = `${doneSubjects}/${subjectNames.length} subjects`;
    } else {
      const scope = groups[cat] || [];
      const watched = scope.reduce((a, m) => a + m.watched, 0);
      const total = scope.reduce((a, m) => a + m.total, 0);
      sub = `${watched}/${total} watched`;
    }
    return `
      <div class="chip ${state.activeCategory === cat ? 'active' : ''}" data-category="${esc(cat)}" role="button" tabindex="0">
        <div class="chip-ring" style="${ringStyle}">${iconSVG(cat === 'All' ? 'layers' : subjectIcon(cat))}</div>
        <div><div class="chip-title">${esc(cat)}</div><div class="chip-sub">${sub}</div></div>
      </div>`;
  }).join('');
  box.querySelectorAll('.chip').forEach(chip => {
    const pick = () => { state.activeCategory = chip.dataset.category; renderLessonPage(); };
    chip.addEventListener('click', pick);
    chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
};

const PATCH10_VERSION = 'p10-v1';
(function reseedAssessments10() {
  if (store.get('lms_patch10_version', '') !== PATCH10_VERSION) {
    state.assessments = buildAssessments();
    store.set('lms_patch10_version', PATCH10_VERSION);
    persistAssessments();
  }
})();

function quickTaskModal() {
  let bd = document.getElementById('quick-task-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'modal-backdrop';
    bd.id = 'quick-task-backdrop';
    bd.hidden = true;
    bd.innerHTML = `<div class="modal quick-task-modal">
      <button type="button" class="drawer-close" id="quick-task-close" data-icon="x" aria-label="Close"></button>
      <h2 id="quick-task-heading">Add a task or event</h2>
      <form id="quick-task-form" class="task-form quick-task-form">
        <input type="text" id="quick-task-input" placeholder="Add a task or event..." required aria-label="Task or event">
        <button type="submit" class="primary-btn small">Add</button>
      </form>
    </div>`;
    document.body.appendChild(bd);
    bd.addEventListener('click', (e) => { if (e.target === bd) bd.hidden = true; });
    bd.querySelector('#quick-task-close').addEventListener('click', () => { bd.hidden = true; });
  }
  renderIcons(bd);
  return bd;
}
function openAddTaskModal(iso) {
  const bd = quickTaskModal();
  const d = new Date(iso + 'T00:00:00');
  bd.querySelector('#quick-task-heading').textContent =
    'Add for ' + d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  const form = bd.querySelector('#quick-task-form');
  const input = bd.querySelector('#quick-task-input');
  input.value = '';
  form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    state.tasks.push({ id: 't' + Date.now(), text, date: iso, done: false });
    persist();
    renderTasks();
    if (state.navActive === 'task') renderCalendar();
    if (state.navActive === 'dashboard') refreshHome();
    const pop = document.getElementById('cal-popover');
    if (pop && !pop.hidden) { pop.innerHTML = topCalendarPopoverHTML(); wireTopCalendarPopover(); }
    toast('Added to your to-do list');
    bd.hidden = true;
  };
  bd.hidden = false;
  setTimeout(() => input.focus(), 0);
}

if (state.navActive === 'task') renderCalendar();

renderUpcomingClasses();

(function wireAgendaLink() {
  const head = document.getElementById('agenda-title');
  const rowHead = head ? head.closest('.row-head') : null;
  if (!rowHead) return;
  rowHead.classList.add('row-head-link');
  rowHead.setAttribute('role', 'button');
  rowHead.setAttribute('tabindex', '0');
  rowHead.setAttribute('aria-label', 'Go to your class schedule');
  const go = () => { router('profile'); setProfileTab('semester'); };
  rowHead.addEventListener('click', go);
  rowHead.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
})();

if (state.navActive === 'dashboard' && state.homeTab === 'dashboard') renderHeroCarousel();

(function trimLessonTab() {
  const lessonPanel = document.querySelector('#page-lesson .lesson-panel');
  if (lessonPanel) lessonPanel.hidden = true;
  document.querySelectorAll('#page-lesson h3').forEach(h => {
    if (h.textContent.trim() === 'Continue Watching') h.textContent = 'Continue';
  });
})();

if (state.navActive === 'lesson') renderLessonPage();

renderTasks();
renderIcons();

openAddTaskModal = function (iso, returnToPopover) {
  const bd = quickTaskModal();
  const d = new Date(iso + 'T00:00:00');
  bd.querySelector('#quick-task-heading').textContent =
    'Add for ' + d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  const form = bd.querySelector('#quick-task-form');
  const input = bd.querySelector('#quick-task-input');
  input.value = '';
  form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    state.tasks.push({ id: 't' + Date.now(), text, date: iso, done: false });
    persist();
    renderTasks();
    if (state.navActive === 'task') renderCalendar();
    if (state.navActive === 'dashboard') refreshHome();
    toast('Added to your to-do list');
    bd.hidden = true;
    if (returnToPopover) {
      const pop = document.getElementById('cal-popover');
      if (pop) {
        pop.innerHTML = topCalendarPopoverHTML();
        wireTopCalendarPopover();
        pop.hidden = false;
      }
    }
  };
  bd.hidden = false;
  setTimeout(() => input.focus(), 0);
};
topCalendarPopoverHTML = function () {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + topCalMonthOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthLabel = base.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIso = daysFromToday(0);

  let grid = dows.map(d => `<div class="topcal-cell topcal-dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) grid += `<div class="topcal-cell topcal-blank"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(year, month, d));
    const due = state.assessments.filter(a => a.date === iso && !a.done);
    const todo = state.tasks.filter(t => t.date === iso && !t.done);
    const dots = `${todo.length ? '<span class="topcal-dot todo-dot"></span>' : ''}${due.length ? '<span class="topcal-dot due-dot"></span>' : ''}`;
    const tip = due.length || todo.length
      ? esc(todo.map(t => t.text).concat(due.map(a => a.title)).join(', '))
      : '';
    grid += `<button type="button" class="topcal-cell topcal-day ${iso === todayIso ? 'is-today' : ''} ${iso === topCalActiveDate ? 'is-active' : ''}"
      data-topcal-date="${iso}" title="${tip}">${d}<span class="topcal-dots">${dots}</span></button>`;
  }

  return `
    <div class="topcal-head">
      <button type="button" class="topcal-nav" id="topcal-prev" aria-label="Previous month"><span data-icon="chevronLeft"></span></button>
      <span class="topcal-month">${monthLabel}</span>
      <button type="button" class="topcal-nav" id="topcal-next" aria-label="Next month"><span data-icon="chevronRight"></span></button>
    </div>
    <div class="topcal-grid">${grid}</div>
    <div class="topcal-foot">
      <div class="topcal-legend"><span><i class="topcal-dot todo-dot"></i> To-do</span><span><i class="topcal-dot due-dot"></i> Due</span></div>
      <button type="button" class="topcal-expand" id="topcal-expand" aria-label="Open the full task calendar"><span data-icon="expand"></span></button>
    </div>`;
};
wireTopCalendarPopover = function () {
  const pop = document.getElementById('cal-popover');
  if (!pop) return;
  renderIcons(pop);
  const prev = document.getElementById('topcal-prev');
  const next = document.getElementById('topcal-next');
  if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); topCalMonthOffset -= 1; pop.innerHTML = topCalendarPopoverHTML(); wireTopCalendarPopover(); });
  if (next) next.addEventListener('click', (e) => { e.stopPropagation(); topCalMonthOffset += 1; pop.innerHTML = topCalendarPopoverHTML(); wireTopCalendarPopover(); });
  pop.querySelectorAll('[data-topcal-date]').forEach(el2 => {
    el2.addEventListener('click', (e) => {
      e.stopPropagation();
      const iso = el2.dataset.topcalDate;
      topCalActiveDate = iso;
      pop.hidden = true;
      openAddTaskModal(iso, true);
    });
  });
  const expandBtn = document.getElementById('topcal-expand');
  if (expandBtn) expandBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    pop.hidden = true;
    taskMonthOffset = 0;
    router('task');
  });
};
renderCalendar = function () {
  const cal = document.getElementById('calendar');
  const titleEl = document.getElementById('calendar-title');
  if (!cal) return;
  cal.classList.remove('week-outline', 'month-grid');
  cal.classList.add('month-cal');

  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + taskMonthOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthLabel = base.toLocaleString('default', { month: 'long', year: 'numeric' });
  if (titleEl) titleEl.textContent = 'Calendar';
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIso = daysFromToday(0);

  let html = `
    <div class="month-cal-head">
      <button type="button" id="month-cal-prev" aria-label="Previous month"><span data-icon="chevronLeft"></span></button>
      <span>${monthLabel}</span>
      <button type="button" id="month-cal-next" aria-label="Next month"><span data-icon="chevronRight"></span></button>
    </div>
    <div class="month-cal-grid">`;
  html += dows.map(d => `<div class="month-cal-dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) html += `<div class="month-cal-cell blank"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(year, month, d));
    const items = monthItemsFor(iso);
    const shown = items.slice(0, 3);
    const extra = items.length - shown.length;
    html += `<div class="month-cal-cell ${iso === todayIso ? 'is-today' : ''}" data-cal-day="${iso}" role="button" tabindex="0">
      <div class="month-cal-cell-head">
        <span class="month-cal-num">${d}</span>
        <button type="button" class="month-cal-add" data-add-task-date="${iso}" aria-label="Add task or event">${iconSVG('plus')}</button>
      </div>
      <ul class="month-cal-items">${shown.map(calChipHTML).join('')}</ul>
      ${extra > 0 ? `<button type="button" class="month-cal-more" data-more-date="${iso}">+${extra} more</button>` : ''}
    </div>`;
  }
  html += `</div>`;

  cal.innerHTML = html;
  renderIcons(cal);

  document.getElementById('month-cal-prev').addEventListener('click', () => { taskMonthOffset -= 1; renderCalendar(); });
  document.getElementById('month-cal-next').addEventListener('click', () => { taskMonthOffset += 1; renderCalendar(); });

  cal.querySelectorAll('[data-add-task-date]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddTaskModal(btn.dataset.addTaskDate);
  }));
  cal.querySelectorAll('[data-more-date]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDayDetail(btn.dataset.moreDate);
  }));
  cal.querySelectorAll('[data-cal-day]').forEach(cell => {
    const open = () => openDayDetail(cell.dataset.calDay);
    cell.addEventListener('click', open);
    cell.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
  });
  cal.querySelectorAll('.cal-chip[data-as-toggle]').forEach(chip => chip.addEventListener('click', (e) => {
    e.stopPropagation();
    const a = state.assessments.find(x => x.id === chip.dataset.asToggle);
    a.done = !a.done;
    persistAssessments();
    renderCalendar();
    renderAssessments();
    if (state.navActive === 'dashboard') refreshHome();
    if (a.done) awardXP(XP_TASK, 'submitting an assessment');
  }));
  cal.querySelectorAll('.cal-chip[data-toggle]').forEach(chip => chip.addEventListener('click', (e) => {
    e.stopPropagation();
    const t = state.tasks.find(x => x.id === chip.dataset.toggle);
    t.done = !t.done;
    if (t.done && !t.xpGiven) { t.xpGiven = true; awardXP(XP_TASK, 'completing a task'); }
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
};
renderUpcomingClasses = function () {
  const iso = daysFromToday(0);
  const title = document.getElementById('agenda-title');
  if (title) title.textContent = "Today's Classes";
  const box = document.getElementById('upcoming-class-list');
  const list = classesOn(iso);
  box.innerHTML = list.map(({ mod, mt }) => {
    const prof = state.mentors.find(x => x.id === mod.mentorId) || {};
    const dueHere = state.assessments.some(a => a.subjectId === mod.id && a.date === iso && !a.done);
    return `<div class="upcoming-item" role="button" tabindex="0" data-open-lesson="${mod.id}">
      <div class="upcoming-time">${fmtShort(mt.from)}</div>
      <div class="upcoming-info">
        <div class="upcoming-title">${esc(mod.category)} <span class="kind-tag">${mod.kind === 'LABORATORY' ? 'LAB' : 'LEC'}</span>${dueHere ? '<span class="upcoming-due-tag">Due</span>' : ''}</div>
        <div class="upcoming-sub">${esc(mt.room)} - ${esc(prof.name || 'TBA')}</div>
      </div></div>`;
  }).join('') || `<p class="empty-note">No classes scheduled for this day.</p>`;
  box.querySelectorAll('[data-open-lesson]').forEach(el2 =>
    el2.addEventListener('click', (e) => { e.stopPropagation(); openLessonDrawer(el2.dataset.openLesson); }));
};
renderHeroCarousel = function () {
  const firstName = (state.userProfile.name || 'there').split(' ')[0];
  const blockers = criticalTasks();

  const slide1 = `
    <div class="hero-slide slide-welcome slide-welcome-plain" role="group" aria-roledescription="slide" aria-label="1 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('calendar')} ${TERM_LABEL}</div>
        <h1>${greetingLabel()}, ${esc(firstName)}</h1>
        <button class="hero-pill" data-hero-go="lesson">${iconSVG('book')} Continue learning</button>
      </div>
    </div>`;

  const todays = classesOn(daysFromToday(0));
  const next = todays[0];
  const nextProf = next ? (state.mentors.find(x => x.id === next.mod.mentorId) || {}).name : null;
  const slide2 = `
    <div class="hero-slide slide-agenda" role="group" aria-roledescription="slide" aria-label="2 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('clock')} Today's Classes</div>
        <h1>${todays.length ? `${todays.length} class${todays.length === 1 ? '' : 'es'} today` : "No classes today"}</h1>
        <p class="hero-sub">${next
      ? `Next: ${esc(next.mod.category)} with ${esc(nextProf || 'TBA')} &middot; ${fmtShort(next.mt.from)}&ndash;${fmtShort(next.mt.to)} &middot; ${esc(next.mt.room)}`
      : 'Nothing on your schedule today. Good day to get ahead on a lesson.'}</p>
        <button class="hero-pill" data-hero-go="classes">${iconSVG('book')} View classes</button>
      </div>
      <div class="hero-art">
        <div class="hero-card list">
          ${todays.length ? todays.slice(0, 3).map(({ mod, mt }) => {
        const prof = state.mentors.find(x => x.id === mod.mentorId) || {};
        return `<div class="hero-task">${iconSVG(subjectIcon(mod.category))}<span>${esc(mod.category)} &middot; ${fmtShort(mt.from)} &middot; ${esc(mt.room)} &middot; ${esc(prof.name || 'TBA')}</span></div>`;
      }).join('') : `<div class="hero-clear">${iconSVG('check')} No classes today</div>`}
        </div>
      </div>
    </div>`;

  const list = blockers.slice(0, 3).map(t => `
      <div class="hero-task">${iconSVG('alert')}<span>${esc(t.text)}</span><em>${dueLabel(t.date)}</em></div>`).join('');
  const slide3 = `
    <div class="hero-slide slide-blockers" role="group" aria-roledescription="slide" aria-label="3 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('alert')} Due soon</div>
        <h1>${blockers.length ? `${blockers.length} assessment${blockers.length === 1 ? '' : 's'} due today or tomorrow` : 'Nothing due today or tomorrow'}</h1>
        <p class="hero-sub">${blockers.length ? 'Finish these first to keep your streak and earn XP.' : 'Nothing urgent on your plate. Use the time to get ahead on a lesson.'}</p>
        <button class="hero-pill" data-hero-go="task">${iconSVG('tasks')} View tasks</button>
      </div>
      <div class="hero-art">
        <div class="hero-card list">
          ${list || `<div class="hero-clear">${iconSVG('check')} All clear</div>`}
        </div>
      </div>
    </div>`;

  document.getElementById('hero-slides').innerHTML = slide1 + slide2 + slide3;
  document.getElementById('hero-dots').innerHTML = [0, 1, 2].map(i =>
    `<button data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');
  applyHeroSlide();
};

ICON_PATHS.expand = '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>';

let topCalActiveDate = null;

let taskMonthOffset = 0;

function monthItemsFor(iso) {
  const due = state.assessments.filter(a => a.date === iso).map(a => Object.assign({ kind: 'assessment' }, a));
  const todo = state.tasks.filter(t => t.date === iso);
  return due.concat(todo);
}
function calChipHTML(item) {
  if (item.kind === 'assessment') {
    return `<li class="cal-chip due ${item.done ? 'done' : ''}" data-as-toggle="${item.id}" title="${esc((item.code ? item.code + ': ' : '') + item.title)}">
      <span class="chip-dot due-dot"></span><span class="chip-text">${esc(item.title)}</span>
    </li>`;
  }
  return `<li class="cal-chip todo ${item.done ? 'done' : ''}" data-toggle="${item.id}" title="${esc(item.text)}">
    <span class="chip-dot todo-dot"></span><span class="chip-text">${esc(item.text)}</span>
  </li>`;
}

function dayDetailModal() {
  let bd = document.getElementById('day-detail-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'modal-backdrop';
    bd.id = 'day-detail-backdrop';
    bd.hidden = true;
    bd.innerHTML = `<div class="modal day-detail-modal">
      <button type="button" class="drawer-close" id="day-detail-close" data-icon="x" aria-label="Close"></button>
      <h2 id="day-detail-heading">Day</h2>
      <ul class="task-list" id="day-detail-list"></ul>
      <button type="button" class="ghost-btn" id="day-detail-add">${iconSVG('plus')} Add a task or event</button>
    </div>`;
    document.body.appendChild(bd);
    bd.addEventListener('click', (e) => { if (e.target === bd) bd.hidden = true; });
    bd.querySelector('#day-detail-close').addEventListener('click', () => { bd.hidden = true; });
  }
  renderIcons(bd);
  return bd;
}
function wireDayDetailControls(container) {
  container.querySelectorAll('[data-as-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const a = state.assessments.find(x => x.id === cb.dataset.asToggle);
    a.done = cb.checked;
    persistAssessments();
    renderCalendar();
    renderAssessments();
    if (state.navActive === 'dashboard') refreshHome();
    if (a.done) awardXP(XP_TASK, 'submitting an assessment');
  }));
  container.querySelectorAll('[data-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const t = state.tasks.find(x => x.id === cb.dataset.toggle);
    t.done = cb.checked;
    if (t.done && !t.xpGiven) { t.xpGiven = true; awardXP(XP_TASK, 'completing a task'); }
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
  container.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => t.id !== btn.dataset.remove);
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
    const li = btn.closest('li');
    if (li) li.remove();
  }));
}
function openDayDetail(iso) {
  const bd = dayDetailModal();
  const d = new Date(iso + 'T00:00:00');
  bd.querySelector('#day-detail-heading').textContent = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  const items = monthItemsFor(iso);
  const list = bd.querySelector('#day-detail-list');
  list.innerHTML = items.length ? items.map(weekOutlineItemHTML).join('') : `<li class="empty-hint">Nothing due or planned.</li>`;
  wireDayDetailControls(list);
  renderIcons(bd);
  bd.querySelector('#day-detail-add').onclick = () => { bd.hidden = true; openAddTaskModal(iso); };
  bd.hidden = false;
}

if (state.navActive === 'task') renderCalendar();

(function resetMonthOnAssessLink() {
  const rowHead = document.getElementById('assessment-count') ? document.getElementById('assessment-count').closest('.row-head') : null;
  if (rowHead) rowHead.addEventListener('click', () => { taskMonthOffset = 0; });
})();

renderUpcomingClasses();

if (state.navActive === 'dashboard' && state.homeTab === 'dashboard') renderHeroCarousel();

(function rewireHeroGoClick12() {
  const oldSlides = document.getElementById('hero-slides');
  if (!oldSlides) return;
  const newSlides = oldSlides.cloneNode(true);
  oldSlides.parentNode.replaceChild(newSlides, oldSlides);
  newSlides.addEventListener('click', (e) => {
    const b = e.target.closest('[data-hero-go]');
    if (!b) return;
    const go = b.dataset.heroGo;
    if (go === 'classes' || go === 'agenda') { router('profile'); setProfileTab('semester'); }
    else router(go);
  });
})();

renderTasks();
renderIcons();

topCalendarPopoverHTML = function () {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + topCalMonthOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthLabel = base.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIso = daysFromToday(0);

  let grid = dows.map(d => `<div class="topcal-cell topcal-dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) grid += `<div class="topcal-cell topcal-blank"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(year, month, d));
    const due = state.assessments.filter(a => a.date === iso && !a.done);
    const todo = state.tasks.filter(t => t.date === iso && !t.done);
    const dots = `${todo.length ? '<span class="topcal-dot todo-dot"></span>' : ''}${due.length ? '<span class="topcal-dot due-dot"></span>' : ''}`;
    const tip = due.length || todo.length
      ? esc(todo.map(t => t.text).concat(due.map(a => a.title)).join(', '))
      : '';
    grid += `<button type="button" class="topcal-cell topcal-day ${iso === todayIso ? 'is-today' : ''} ${iso === topCalActiveDate ? 'is-active' : ''}"
      data-topcal-date="${iso}" title="${tip}">${d}<span class="topcal-dots">${dots}</span></button>`;
  }

  return `
    <div class="topcal-head">
      <button type="button" class="topcal-nav" id="topcal-prev" aria-label="Previous month"><span data-icon="chevronLeft"></span></button>
      <span class="topcal-month">${monthLabel}</span>
      <button type="button" class="topcal-nav" id="topcal-next" aria-label="Next month"><span data-icon="chevronRight"></span></button>
    </div>
    <div class="topcal-grid">${grid}</div>
    <div class="topcal-foot">
      <button type="button" class="topcal-expand" id="topcal-expand" aria-label="Open the full task calendar"><span data-icon="expand"></span></button>
    </div>`;
};
monthItemsFor = function (iso) {
  const due = state.assessments.filter(a => a.date === iso && !a.done).map(a => Object.assign({ kind: 'assessment' }, a));
  const todo = state.tasks.filter(t => t.date === iso && !t.done);
  return due.concat(todo);
};
buildAssessments = function () {
  const today = daysFromToday(0);
  const out = [];
  const mods = state.modules;
  if (!mods.length) return out;
  for (let i = 0; i < ASSESS_CAP_V13; i++) {
    const mod = mods[i % mods.length];
    const date = ASSESS_DATES_V13[i % ASSESS_DATES_V13.length];
    const type = ASSESS_TYPES_V8[i % ASSESS_TYPES_V8.length];
    const midModules = (mod.modules || []).filter(m => m.term === 'Midterm');
    const modIdx = midModules.length
      ? Math.min(midModules.length - 1, Math.floor(i * midModules.length / ASSESS_CAP_V13))
      : 0;
    const modRef = midModules[modIdx];
    out.push({
      id: 'as13-' + i,
      subjectId: mod.id, code: mod.code, subject: mod.category,
      title: `${type.name} ${Math.floor(i / ASSESS_TYPES_V8.length) + 1}`,
      max: type.max,
      moduleN: modRef ? modRef.n : null,
      moduleTitle: modRef ? modRef.title : '',
      date, done: date < today
    });
  }
  return out;
};

const ASSESS_CAP_V13 = 12;
const ASSESS_DATES_V13 = (function buildCappedDates() {
  const out = [];
  const end = new Date('2026-11-21T00:00:00');
  const d = new Date('2026-09-25T00:00:00');
  while (d <= end) {
    out.push(localISO(d));
    d.setDate(d.getDate() + 7);
  }
  return out;
})();

const PATCH13_ASSESS_VERSION = 'p13-v2';
(function reseedAssessments13() {
  if (store.get('lms_patch13_assess_version', '') !== PATCH13_ASSESS_VERSION) {
    state.assessments = buildAssessments();
    store.set('lms_patch13_assess_version', PATCH13_ASSESS_VERSION);
    persistAssessments();
  }
})();

(function rebindCalPopover() {
  const oldBtn = document.getElementById('cal-btn');
  if (!oldBtn) return;
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  toggleHeaderPopover('cal-btn', 'cal-popover', topCalendarPopoverHTML);
  newBtn.addEventListener('click', () => {
    if (!document.getElementById('cal-popover').hidden) wireTopCalendarPopover();
  });
})();

function openAssessmentDetail(subjectId) {
  if (!subjectId) return;
  openLessonDrawer(subjectId);
  const box = document.getElementById('subject-detail');
  const btn = box && box.querySelector('[data-panel="assessment"]');
  if (btn) btn.click();
}

(function wireMonthCalAssessClicks() {
  const cal = document.getElementById('calendar');
  if (!cal) return;
  cal.addEventListener('click', (e) => {
    const chip = e.target.closest('.cal-chip.due');
    if (!chip) return;
    e.stopPropagation();
    const a = state.assessments.find(x => x.id === chip.dataset.asToggle);
    if (a) openAssessmentDetail(a.subjectId);
  });
})();

(function wireDayDetailAssessClicks() {
  const bd = dayDetailModal();
  bd.addEventListener('click', (e) => {
    if (e.target.closest('input,button')) return;
    const li = e.target.closest('.assessment-item');
    if (!li) return;
    const cb = li.querySelector('[data-as-toggle]');
    const a = cb && state.assessments.find(x => x.id === cb.dataset.asToggle);
    if (!a) return;
    bd.hidden = true;
    openAssessmentDetail(a.subjectId);
  });
})();

(function wireSidebarAssessClicks() {
  const list = document.getElementById('assessment-list');
  if (!list) return;
  list.addEventListener('click', (e) => {
    if (e.target.closest('input,button')) return;
    const li = e.target.closest('.assessment-item');
    if (!li) return;
    const cb = li.querySelector('[data-as-toggle]');
    const a = cb && state.assessments.find(x => x.id === cb.dataset.asToggle);
    if (!a) return;
    openAssessmentDetail(a.subjectId);
  });
})();

if (state.navActive === 'task') renderCalendar();
renderTasks();
if (state.navActive === 'dashboard') refreshHome();
renderIcons();

renderInbox = function () {
  const box = document.getElementById('inbox-list');
  if (!box) return;
  const list = visibleInbox();
  box.innerHTML = list.map(msg => {
    const read = inboxReadIds.has(msg.id);
    return `
    <div class="inbox-item ${read ? '' : 'unread'}" data-inbox-item="${esc(msg.id)}">
      <div class="avatar" style="${avatarStyle(msg.title)}">${esc(initials(msg.title))}</div>
      <div class="inbox-item-body">
        <div class="msg-title">${esc(msg.title)}${read ? '' : '<span class="unread-dot" aria-hidden="true"></span>'}</div>
        <div class="msg-preview">${esc(msg.preview)}</div>
      </div>
      <div class="msg-time">${esc(msg.time)}</div>
      <div class="inbox-actions">
        <button type="button" class="inbox-action-btn" data-inbox-toggle-read="${esc(msg.id)}" aria-label="${read ? 'Mark as unread' : 'Mark as read'}" title="${read ? 'Mark as unread' : 'Mark as read'}">${iconSVG(read ? 'mail' : 'check')}</button>
        <button type="button" class="inbox-action-btn danger" data-inbox-delete="${esc(msg.id)}" aria-label="Delete message" title="Delete">${iconSVG('trash')}</button>
      </div>
    </div>`;
  }).join('') || `<p class="empty-note">Your inbox is empty.</p>`;

  box.querySelectorAll('[data-inbox-toggle-read]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = btn.dataset.inboxToggleRead;
    if (inboxReadIds.has(id)) inboxReadIds.delete(id); else inboxReadIds.add(id);
    persistInboxState();
    renderInbox();
  }));
  box.querySelectorAll('[data-inbox-delete]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = btn.dataset.inboxDelete;
    inboxDeletedIds.add(id);
    persistInboxState();
    renderInbox();
    toast('Message deleted');
  }));
  box.querySelectorAll('.inbox-item').forEach(row => row.addEventListener('click', () => {
    const id = row.dataset.inboxItem;
    if (inboxReadIds.has(id)) return;
    inboxReadIds.add(id);
    persistInboxState();
    renderInbox();
  }));
  renderIcons(box);
  updateInboxBadges();
};
renderCalendar = function () {
  const cal = document.getElementById('calendar');
  const titleEl = document.getElementById('calendar-title');
  if (!cal) return;
  cal.classList.remove('month-cal', 'week-outline', 'day-view', 'month-grid');
  if (titleEl) titleEl.textContent = 'Calendar';
  syncTaskViewToggle();

  if (taskViewMode === 'day') {
    cal.classList.add('day-view');
    cal.innerHTML = dayViewHTML();
    renderIcons(cal);
    wireDayViewControls(cal);
  } else {
    cal.classList.add('month-cal');
    cal.innerHTML = monthViewHTML();
    renderIcons(cal);
    wireMonthViewControls(cal);
  }
};
goHeroSlide = function (i) {
  const count = document.querySelectorAll('#hero-dots button').length || HERO_SLIDE_COUNT;
  state.heroSlide = (i + count) % count;
  applyHeroSlide();
};
renderHeroCarousel = function () {
  const firstName = (state.userProfile.name || 'there').split(' ')[0];
  const blockers = criticalTasks();
  const pastDue = pastDueAssessments();

  const slide1 = `
    <div class="hero-slide slide-welcome slide-welcome-plain" role="group" aria-roledescription="slide" aria-label="1 of ${pastDue.length ? 4 : 3}">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('calendar')} ${TERM_LABEL}</div>
        <h1>${greetingLabel()}, ${esc(firstName)}</h1>
        <button class="hero-pill" data-hero-go="lesson">${iconSVG('book')} Continue learning</button>
      </div>
    </div>`;

  const todays = classesOn(daysFromToday(0));
  const next = todays[0];
  const nextProf = next ? (state.mentors.find(x => x.id === next.mod.mentorId) || {}).name : null;
  const slide2 = `
    <div class="hero-slide slide-agenda" role="group" aria-roledescription="slide" aria-label="2 of ${pastDue.length ? 4 : 3}">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('clock')} Today's Classes</div>
        <h1>${todays.length ? `${todays.length} class${todays.length === 1 ? '' : 'es'} today` : "No classes today"}</h1>
        <p class="hero-sub">${next
      ? `Next: ${esc(next.mod.category)} with ${esc(nextProf || 'TBA')} &middot; ${fmtShort(next.mt.from)}&ndash;${fmtShort(next.mt.to)} &middot; ${esc(next.mt.room)}`
      : 'Nothing on your schedule today. Good day to get ahead on a lesson.'}</p>
        <button class="hero-pill" data-hero-go="classes">${iconSVG('book')} View classes</button>
      </div>
      <div class="hero-art">
        <div class="hero-card list">
          ${todays.length ? todays.slice(0, 3).map(({ mod, mt }) => {
      const prof = state.mentors.find(x => x.id === mod.mentorId) || {};
      return `<div class="hero-task">${iconSVG(subjectIcon(mod.category))}<span>${esc(mod.category)} &middot; ${fmtShort(mt.from)} &middot; ${esc(mt.room)} &middot; ${esc(prof.name || 'TBA')}</span></div>`;
    }).join('') : `<div class="hero-clear">${iconSVG('check')} No classes today</div>`}
        </div>
      </div>
    </div>`;

  const list = blockers.slice(0, 3).map(t => `
      <div class="hero-task">${iconSVG('alert')}<span>${esc(t.text)}</span><em>${dueLabel(t.date)}</em></div>`).join('');
  const slide3 = `
    <div class="hero-slide slide-blockers" role="group" aria-roledescription="slide" aria-label="3 of ${pastDue.length ? 4 : 3}">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('alert')} Due soon</div>
        <h1>${blockers.length ? `${blockers.length} assessment${blockers.length === 1 ? '' : 's'} due today or tomorrow` : 'Nothing due today or tomorrow'}</h1>
        <p class="hero-sub">${blockers.length ? 'Finish these first to keep your streak and earn XP.' : 'Nothing urgent on your plate. Use the time to get ahead on a lesson.'}</p>
        <button class="hero-pill" data-hero-go="task">${iconSVG('tasks')} View tasks</button>
      </div>
      <div class="hero-art">
        <div class="hero-card list">
          ${list || `<div class="hero-clear">${iconSVG('check')} All clear</div>`}
        </div>
      </div>
    </div>`;

  let slide4 = '';
  if (pastDue.length) {
    const overdueList = pastDue.slice(0, 3).map(a => `
      <div class="hero-task">${iconSVG('alert')}<span>${esc((a.code ? a.code + ': ' : '') + a.title)}</span><em>${formatTaskDate(a.date)}</em></div>`).join('');
    slide4 = `
      <div class="hero-slide slide-pastdue" role="group" aria-roledescription="slide" aria-label="4 of 4">
        <div class="hero-copy">
          <div class="hero-tag">${iconSVG('alert')} Past due</div>
          <h1>${pastDue.length} assessment${pastDue.length === 1 ? '' : 's'} past due</h1>
          <p class="hero-sub">${pastDue.length === 1
        ? `${esc(pastDue[0].title)} is overdue - submit it as soon as you can.`
        : 'These are overdue - submit them as soon as you can.'}</p>
          <button class="hero-pill" data-hero-pastdue="1">${iconSVG('tasks')} View overdue</button>
        </div>
        <div class="hero-art">
          <div class="hero-card list">${overdueList}</div>
        </div>
      </div>`;
  }

  document.getElementById('hero-slides').innerHTML = slide1 + slide2 + slide3 + slide4;
  const slideCount = pastDue.length ? 4 : 3;
  document.getElementById('hero-dots').innerHTML = Array.from({ length: slideCount }).map((_, i) =>
    `<button data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');
  if (state.heroSlide >= slideCount) state.heroSlide = 0;
  applyHeroSlide();
};

(function seedPastDueDemo() {
  const V = 'p14-pastdue-v1';
  if (store.get('lms_patch14_pastdue_demo', '') === V) return;
  if (!state.modules || !state.modules.length) return;
  const today = daysFromToday(0);
  const offsets = [3, 5, 7];
  const extra = offsets.map((off, i) => {
    const d = new Date(today + 'T00:00:00');
    d.setDate(d.getDate() - off);
    const mod = state.modules[i % state.modules.length];
    const type = ASSESS_TYPES_V8[i % ASSESS_TYPES_V8.length];
    return {
      id: 'as14-pastdue-' + i,
      subjectId: mod.id, code: mod.code, subject: mod.category,
      title: `${type.name} ${i + 1}`,
      max: type.max,
      moduleN: null, moduleTitle: '',
      date: localISO(d), done: false
    };
  });
  state.assessments = state.assessments.concat(extra);
  store.set('lms_patch14_pastdue_demo', V);
  persistAssessments();
})();

(function addProfileChevron() {
  const btn = document.getElementById('profile-btn');
  if (!btn || btn.querySelector('.profile-chevron')) return;
  const chev = document.createElement('span');
  chev.className = 'profile-chevron';
  chev.setAttribute('data-icon', 'chevronDown');
  chev.setAttribute('aria-hidden', 'true');
  btn.appendChild(chev);
  renderIcons(btn);
})();

(function addProfAsyncAnnouncement() {
  const id = 'n-webdev-async-lec';
  if (state.news.some(p => p.id === id)) return;
  state.news.unshift({
    id,
    author: 'Professor Michael Anderson',
    kind: 'announcement',
    pinned: true,
    ts: Date.now() - 20 * 60 * 1000,
    title: 'Asynchronous class next week - Web Development (LEC)',
    body: 'Hi everyone, our Web Development lecture will be held asynchronously next week.\n\nPlease check the Lesson tab for the recorded materials and readings, and complete them before our next in-person session. Reach out if you have any questions in the meantime.'
  });
  persist();
  if (state.navActive === 'dashboard' && state.homeTab === 'news') renderNews();
  renderNewsCount();
})();

(function initInboxIds() {
  SEED_INBOX.forEach((m, i) => { if (!m.id) m.id = 'msg' + (i + 1); });
})();
let inboxReadIds = new Set(store.get('lms_inbox_read', []));
let inboxDeletedIds = new Set(store.get('lms_inbox_deleted', []));
function persistInboxState() {
  store.set('lms_inbox_read', Array.from(inboxReadIds));
  store.set('lms_inbox_deleted', Array.from(inboxDeletedIds));
}
function visibleInbox() {
  return SEED_INBOX.filter(m => !inboxDeletedIds.has(m.id));
}
function unreadInboxCount() {
  return visibleInbox().filter(m => !inboxReadIds.has(m.id)).length;
}
function updateInboxBadges() {
  const count = unreadInboxCount();
  const navBadge = document.getElementById('inbox-badge');
  if (navBadge) { navBadge.textContent = count; navBadge.hidden = count === 0; }
  const msgBtn = document.getElementById('msg-btn');
  const dot = msgBtn ? msgBtn.querySelector('.dot') : null;
  if (dot) dot.hidden = count === 0;
}

(function setupInboxHead() {
  const panel = document.querySelector('#page-inbox .panel');
  const h2 = panel ? panel.querySelector('h2') : null;
  if (!h2 || document.getElementById('inbox-clear-btn')) return;
  const head = document.createElement('div');
  head.className = 'section-head';
  h2.parentNode.insertBefore(head, h2);
  head.appendChild(h2);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ghost-btn';
  btn.id = 'inbox-clear-btn';
  btn.innerHTML = `${iconSVG('check')} Mark all as read`;
  head.appendChild(btn);
  btn.addEventListener('click', () => {
    visibleInbox().forEach(m => inboxReadIds.add(m.id));
    persistInboxState();
    renderInbox();
  });
  renderIcons(head);
})();

(function rebindMsgPopover() {
  const oldBtn = document.getElementById('msg-btn');
  if (!oldBtn) return;
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  toggleHeaderPopover('msg-btn', 'msg-popover', () =>
    visibleInbox().map(m => `<div class="popover-item"><b>${esc(m.title)}</b><span>${esc(m.preview)}</span></div>`).join('') ||
    `<div class="popover-item"><span>No messages.</span></div>`
  );
})();

if (state.navActive === 'inbox') renderInbox();
updateInboxBadges();

let taskViewMode = store.get('lms_task_view_mode', 'month');
if (taskViewMode === 'week') taskViewMode = 'month';
let taskDayOffset = 0;

function setTaskViewMode(mode) {
  if (taskViewMode === mode) { renderCalendar(); return; }
  taskViewMode = mode;
  store.set('lms_task_view_mode', mode);
  renderCalendar();
}
function syncTaskViewToggle() {
  const toggle = document.getElementById('task-view-toggle');
  if (!toggle) return;
  toggle.querySelectorAll('[data-view-mode]').forEach(b => {
    const on = b.dataset.viewMode === taskViewMode;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
}
(function setupTaskViewToggle() {
  const titleEl = document.getElementById('calendar-title');
  if (!titleEl || document.getElementById('task-view-toggle')) return;
  const head = document.createElement('div');
  head.className = 'section-head task-view-head';
  titleEl.parentNode.insertBefore(head, titleEl);
  head.appendChild(titleEl);
  const toggle = document.createElement('div');
  toggle.className = 'tabs small task-view-toggle';
  toggle.id = 'task-view-toggle';
  toggle.setAttribute('role', 'tablist');
  toggle.setAttribute('aria-label', 'Calendar view');
  toggle.innerHTML = `
    <button type="button" class="tab" role="tab" data-view-mode="month">Month</button>
    <button type="button" class="tab" role="tab" data-view-mode="day">Day</button>`;
  head.appendChild(toggle);
  toggle.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view-mode]');
    if (!b) return;
    setTaskViewMode(b.dataset.viewMode);
  });
})();

document.addEventListener('click', (e) => {
  if (e.target.closest('#topcal-expand')) {
    taskViewMode = 'month';
    store.set('lms_task_view_mode', 'month');
  }
}, true);

function monthViewHTML() {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + taskMonthOffset);
  const year = base.getFullYear(), month = base.getMonth();
  const monthLabel = base.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIso = daysFromToday(0);

  let html = `
    <div class="month-cal-head">
      <button type="button" id="month-cal-prev" aria-label="Previous month"><span data-icon="chevronLeft"></span></button>
      <span>${esc(monthLabel)}</span>
      <button type="button" id="month-cal-next" aria-label="Next month"><span data-icon="chevronRight"></span></button>
    </div>
    <div class="month-cal-grid">`;
  html += dows.map(d => `<div class="month-cal-dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) html += `<div class="month-cal-cell blank"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(year, month, d));
    const items = monthItemsFor(iso);
    const shown = items.slice(0, 3);
    const extra = items.length - shown.length;
    html += `<div class="month-cal-cell ${iso === todayIso ? 'is-today' : ''}" data-cal-day="${iso}" role="button" tabindex="0">
      <div class="month-cal-cell-head">
        <span class="month-cal-num">${d}</span>
        <button type="button" class="month-cal-add" data-add-task-date="${iso}" aria-label="Add task or event">${iconSVG('plus')}</button>
      </div>
      <ul class="month-cal-items">${shown.map(calChipHTML).join('')}</ul>
      ${extra > 0 ? `<button type="button" class="month-cal-more" data-more-date="${iso}">+${extra} more</button>` : ''}
    </div>`;
  }
  html += `</div>`;
  return html;
}
function wireMonthViewControls(cal) {
  const prev = document.getElementById('month-cal-prev');
  const next = document.getElementById('month-cal-next');
  if (prev) prev.addEventListener('click', () => { taskMonthOffset -= 1; renderCalendar(); });
  if (next) next.addEventListener('click', () => { taskMonthOffset += 1; renderCalendar(); });

  cal.querySelectorAll('[data-add-task-date]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddTaskModal(btn.dataset.addTaskDate);
  }));
  cal.querySelectorAll('[data-more-date]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDayDetail(btn.dataset.moreDate);
  }));
  cal.querySelectorAll('[data-cal-day]').forEach(cell => {
    const open = () => openDayDetail(cell.dataset.calDay);
    cell.addEventListener('click', open);
    cell.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
  });

  cal.querySelectorAll('.cal-chip[data-toggle]').forEach(chip => chip.addEventListener('click', (e) => {
    e.stopPropagation();
    const t = state.tasks.find(x => x.id === chip.dataset.toggle);
    t.done = !t.done;
    if (t.done && !t.xpGiven) { t.xpGiven = true; awardXP(XP_TASK, 'completing a task'); }
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
}

function dayViewHTML() {
  const d = new Date();
  d.setDate(d.getDate() + taskDayOffset);
  const iso = localISO(d);
  const todayIso = daysFromToday(0);
  const items = weekItemsFor(iso);
  const doneCount = items.filter(i => i.done).length;
  const dateLabel = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  return `
    <div class="day-view-head">
      <button type="button" id="day-view-prev" aria-label="Previous day"><span data-icon="chevronLeft"></span></button>
      <div class="day-view-label">
        <span class="day-view-date">${esc(dateLabel)}</span>
        ${iso === todayIso ? `<span class="day-view-today-tag">Today</span>` : ''}
      </div>
      <button type="button" id="day-view-next" aria-label="Next day"><span data-icon="chevronRight"></span></button>
    </div>
    ${items.length ? `<span class="week-outline-count">${doneCount}/${items.length} done</span>` : ''}
    <ul class="task-list day-view-list">
      ${items.length ? items.map(weekOutlineItemHTML).join('') : `<li class="empty-hint">Nothing due or planned for this day.</li>`}
    </ul>
    <button type="button" class="ghost-btn day-view-add" data-add-task-date="${iso}">${iconSVG('plus')} Add a task or event</button>`;
}
function wireDayViewControls(cal) {
  cal.querySelectorAll('[data-add-task-date]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddTaskModal(btn.dataset.addTaskDate);
  }));
  cal.querySelectorAll('[data-as-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const a = state.assessments.find(x => x.id === cb.dataset.asToggle);
    a.done = cb.checked;
    persistAssessments();
    renderCalendar();
    renderAssessments();
    if (state.navActive === 'dashboard') refreshHome();
    if (a.done) awardXP(XP_TASK, 'submitting an assessment');
  }));
  cal.querySelectorAll('[data-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const t = state.tasks.find(x => x.id === cb.dataset.toggle);
    t.done = cb.checked;
    if (t.done && !t.xpGiven) { t.xpGiven = true; awardXP(XP_TASK, 'completing a task'); }
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));
  cal.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => t.id !== btn.dataset.remove);
    persist();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
  }));

  const dPrev = document.getElementById('day-view-prev');
  const dNext = document.getElementById('day-view-next');
  if (dPrev) dPrev.addEventListener('click', () => { taskDayOffset -= 1; renderCalendar(); });
  if (dNext) dNext.addEventListener('click', () => { taskDayOffset += 1; renderCalendar(); });
}

(function wireDayViewAssessClicks() {
  const cal = document.getElementById('calendar');
  if (!cal) return;
  cal.addEventListener('click', (e) => {
    if (!cal.classList.contains('day-view')) return;
    if (e.target.closest('input,button')) return;
    const li = e.target.closest('.assessment-item');
    if (!li) return;
    const cb = li.querySelector('[data-as-toggle]');
    const a = cb && state.assessments.find(x => x.id === cb.dataset.asToggle);
    if (!a) return;
    openAssessmentDetail(a.subjectId);
  });
})();

if (state.navActive === 'task') renderCalendar();

function pastDueAssessments() {
  const today = daysFromToday(0);
  return state.assessments
    .filter(a => !a.done && a.date < today)
    .sort((a, b) => a.date.localeCompare(b.date));
}
function goToPastDueAssessment() {
  const list = pastDueAssessments();
  if (!list.length) return;
  const iso = list[0].date;
  const diff = Math.round((new Date(iso + 'T00:00:00') - new Date(daysFromToday(0) + 'T00:00:00')) / 86400000);
  taskDayOffset = diff;
  taskViewMode = 'day';
  store.set('lms_task_view_mode', 'day');
  router('task');
}
(function wireHeroPastDueClick() {
  const slides = document.getElementById('hero-slides');
  if (!slides) return;
  slides.addEventListener('click', (e) => {
    const b = e.target.closest('[data-hero-pastdue]');
    if (!b) return;
    goToPastDueAssessment();
  });
})();

if (state.navActive === 'dashboard' && state.homeTab === 'dashboard') renderHeroCarousel();

renderIcons();
