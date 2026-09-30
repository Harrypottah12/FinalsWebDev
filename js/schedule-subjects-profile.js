const DAY_NAME = { M: 'Monday', T: 'Tuesday', W: 'Wednesday', H: 'Thursday', F: 'Friday', S: 'Saturday' };
const DAY_ORDER = ['M', 'T', 'W', 'H', 'F', 'S'];
const DOW_TO_CODE = { 1: 'M', 2: 'T', 3: 'W', 4: 'H', 5: 'F', 6: 'S' };

const FAMILIES = {
  'The Contemporary World': {
    icon: 'cap', tone: '#1E3A5F', prof: 'Prof. Ramon Villanueva',
    topics: 'Introduction to Globalization|Structures of Globalization|Market Integration|The Global Interstate System|Contemporary Global Governance|Global Divides: The North and the South|Asian Regionalism|Sustainable Development|Global Citizenship|Global Media Cultures'
  },
  'Information Assurance & Security 1': {
    icon: 'shield', tone: '#7A1F2B', prof: 'Prof. Nadia Fajardo',
    topics: 'Foundations of Information Security|The CIA Triad in Practice|Threats, Vulnerabilities and Risk|Access Control Models|Cryptography Basics|Security Policies and Governance|Network Attack Surfaces|Incident Response Planning|Security Auditing and Logging|Cybersecurity Workstation Investigation'
  },
  'Networking 2': {
    icon: 'network', tone: '#0F766E', prof: 'Prof. Marcus Delgado',
    topics: 'Review of Networking 1 Concepts|IPv4 Subnetting and VLSM|Routing Fundamentals|Static and Dynamic Routing|Gateways to Other Networks|IPv6 Addressing and DHCP|Switching and VLANs|Access Control Lists|WAN Technologies|Network Troubleshooting Lab'
  },
  'Integrative Programming Technologies 1': {
    icon: 'code', tone: '#4C3A8A', prof: 'Prof. Alvin Bautista',
    topics: 'Integration Concepts and Architectures|Data Formats: XML and JSON|Storing XML Data to a Database|Introduction to ASP.NET Core MVC|Working with APIs and REST|Model Binding and Validation|Middleware and Dependency Injection|Authentication in Web APIs|Service Integration Patterns|Integration Capstone Build'
  },
  'IT Professional Elective': {
    icon: 'cpu', tone: '#92400E', prof: 'Prof. Katrina Soriano',
    topics: 'Emerging Technologies Landscape|Linux Basic Commands|Ubuntu Installation and Process State|Shell Scripting Essentials|Containers and Virtualization|Cloud Deployment Basics|DevOps Toolchain Overview|Monitoring and Observability|Automation Workshop|Professional Practice and Ethics'
  },
  'Web Development': {
    icon: 'code', tone: '#0B5E58', prof: 'Prof. Michael Anderson',
    topics: 'HTML Structure and Semantics|CSS Layout Systems|Responsive Design Patterns|JavaScript Fundamentals|DOM Manipulation and Events|Client-Side Storage|Fetch, APIs and Async JavaScript|Front-End Accessibility|Deployment and Version Control|Full Web Project Build'
  },
  'Mobile Enterprise Systems': {
    icon: 'phone', tone: '#6B2158', prof: 'Prof. Ryan Cooper',
    topics: 'Mobile Enterprise Architecture|Mobile UI/UX Foundations|Cross-Platform Frameworks|Navigation and State|Local Data and Offline Sync|Consuming Enterprise APIs|Push Notifications|Mobile Security Practices|Testing on Devices|Enterprise App Release'
  }
};

const CLASS_ROWS = [
  ['1442', 'G-SOCS003', 'I09', 'The Contemporary World', 'LECTURE', 3.0, [['H', '1130', '1300', 'PBH316'], ['M', '1130', '1300', 'PBH318']]],
  ['1613', 'S-ITCS318', 'I09', 'Information Assurance & Security 1', 'LECTURE', 2.0, [['M', '1300', '1500', 'PBH307']]],
  ['1623', 'S-ITCS318LA', 'I09', 'Information Assurance & Security 1', 'LABORATORY', 1.0, [['H', '1300', '1600', 'ICT210']]],
  ['1653', 'S-ITPC315', 'I04', 'Networking 2', 'LECTURE', 2.0, [['F', '1330', '1530', 'PBH303']]],
  ['1658', 'S-ITPC315LA', 'I04', 'Networking 2', 'LABORATORY', 1.0, [['S', '1430', '1730', 'ICT210']]],
  ['1663', 'S-ITPC316', 'I04', 'Integrative Programming Technologies 1', 'LECTURE', 2.0, [['T', '1300', '1500', 'PBH206']]],
  ['1668', 'S-ITPC316LA', 'I04', 'Integrative Programming Technologies 1', 'LABORATORY', 1.0, [['F', '1000', '1300', 'ICT204']]],
  ['1691', 'S-ITPE002', 'I04', 'IT Professional Elective', 'LECTURE', 2.0, [['S', '0700', '0900', 'PBH302']]],
  ['1696', 'S-ITPE002LA', 'I04', 'IT Professional Elective', 'LABORATORY', 1.0, [['S', '1000', '1300', 'ICT202']]],
  ['1706', 'S-ITWB311', 'I01', 'Web Development', 'LECTURE', 2.0, [['M', '0700', '0900', 'PBH303']]],
  ['1708', 'S-ITWB311LA', 'I01', 'Web Development', 'LABORATORY', 1.0, [['H', '0700', '1000', 'ICT206']]],
  ['1710', 'S-ITWB312', 'I01', 'Mobile Enterprise Systems', 'LECTURE', 2.0, [['T', '1600', '1800', 'PBH306']]],
  ['1712', 'S-ITWB312LA', 'I01', 'Mobile Enterprise Systems', 'LABORATORY', 1.0, [['F', '1600', '1900', 'ICT206']]]
];

const BLOCKMATES = [
  'Paolo Miguel Osabel', 'Karl Gavin Besa', 'Jion Wyn Lina', 'Maria Clara Reyes', 'Andrei Salcedo',
  'Bianca Trinidad', 'Joshua Mendoza', 'Trisha Mae Aquino', 'Rafael Dominguez', 'Kyla Bernardo',
  'Mark Anthony Sison', 'Dominique Ferrer', 'Jerome Villaruel', 'Angelica Pascual', 'Neil Patrick Uy',
  'Camille Estrella', 'Francis Ocampo', 'Lara Jimenez', 'Ronald Castañeda', 'Patricia Gomez',
  'Jeric Alonzo', 'Shaira Nicolas', 'Vincent Delos Santos'
];

const PROGRAM = { code: 'BIT13', org: 'De La Salle University - Dasmariñas', term: 'Term 1, A.Y. 2026-2027' };

function hm(t) { return { h: +t.slice(0, 2), m: +t.slice(2) }; }
function mins(t) { const p = hm(t); return p.h * 60 + p.m; }
function fmtTime(t) {
  const p = hm(t), ap = p.h >= 12 ? 'PM' : 'AM', h12 = p.h % 12 === 0 ? 12 : p.h % 12;
  return `${h12}:${String(p.m).padStart(2, '0')} ${ap}`;
}
function fmtShort(t) { const p = hm(t); const h12 = p.h % 12 === 0 ? 12 : p.h % 12; return `${h12}:${String(p.m).padStart(2, '0')}`; }
function meetingLabel(mt) { return `${DAY_NAME[mt.day]} ${fmtTime(mt.from)} - ${fmtTime(mt.to)} - ${mt.room}`; }

function subjectArt(mod, w, h) {
  const tone = (FAMILIES[mod.category] || {}).tone || '#0F766E';
  const ico = ICON_PATHS[(FAMILIES[mod.category] || {}).icon || 'book'];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${tone}"/><stop offset="1" stop-color="#0F766E"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<circle cx="${w * 0.82}" cy="${h * 0.22}" r="${h * 0.42}" fill="#ffffff" opacity="0.07"/>
<circle cx="${w * 0.14}" cy="${h * 0.86}" r="${h * 0.36}" fill="#ffffff" opacity="0.06"/>
<g transform="translate(${w / 2 - h * 0.18},${h / 2 - h * 0.26}) scale(${h * 0.015})" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.92">${ico}</g>
<text x="${w / 2}" y="${h * 0.80}" text-anchor="middle" font-family="Poppins,Arial" font-size="${h * 0.1}" fill="#ffffff" opacity="0.95" font-weight="700">${esc(mod.code)}</text>
</svg>`;
  return svgURI(svg);
}

function buildSubjects() {
  return CLASS_ROWS.map((r, i) => {
    const [classId, code, section, family, kind, units, meets] = r;
    const fam = FAMILIES[family];
    const topics = fam.topics.split('|');
    const watched = [4, 3, 2, 3, 1, 4, 2, 1, 1, 6, 3, 2, 1][i];
    return {
      id: 'sub' + classId, lmsCode: classId, code, section, units, kind,
      category: family,
      title: `${family.toUpperCase()} - ${kind}`,
      mentorId: 'p' + Object.keys(FAMILIES).indexOf(family),
      meetings: meets.map(m => ({ day: m[0], from: m[1], to: m[2], room: m[3] })),
      transcript: `${family} (${kind.toLowerCase()}) for section ${section}, ${units.toFixed(2)} units.`,
      modules: topics.map((t, k) => ({
        n: k + 1, title: t, term: k < 5 ? 'Midterm' : 'Finals',
        sections: 5 + ((k * 7) % 25),
        desc: `${k < 5 ? 'Midterm' : 'Finals'} module ${k + 1} of ${family}. ${t} is discussed with graded activities and a laboratory or written output.`
      })),
      total: topics.length, watched
    };
  });
}

function buildProfessors() {
  return Object.keys(FAMILIES).map((f, i) => ({
    id: 'p' + i, name: FAMILIES[f].prof, subject: f,
    bio: `Handles ${f} this term for the BIT13 block.`, followed: i === 0
  }));
}

function buildAssessments() {
  const pick = [
    ['1706', 'MODULE1 CP1: Portfolio Layout', 0], ['1613', 'Enabling Assessment 1', 0],
    ['1663', 'Storing XML Data to Database', 1], ['1653', 'MODULE2 EA: IPv4 Subnetting Table', 1],
    ['1691', 'EA 2 - Ubuntu Installation and Process State', 2], ['1710', 'Mobile UI Wireframe Draft', 3],
    ['1623', 'Midterm EA 10 - Cybersecurity Workstation Investigation', 4], ['1442', 'Module 2: Political Globalization Reflection', 5],
    ['1708', 'Web Dev Lab 3 - Responsive Grid', 6], ['1658', 'Networking Lab: Gateways to Other Networks', 8],
    ['1668', 'IPT Lab 4 - REST Service Integration', 9]
  ];
  return pick.map((p, i) => {
    const sub = state.modules.find(m => m.lmsCode === p[0]) || {};
    return { id: 'as' + i, subjectId: sub.id, code: sub.code, subject: sub.category, title: p[1], date: daysFromToday(p[2]), done: false };
  });
}

const PATCH_VERSION = 'p2-v1';
(function reseed() {
  if (store.get('lms_patch_version', '') !== PATCH_VERSION) {
    state.modules = buildSubjects();
    state.mentors = buildProfessors();
    state.userProfile = Object.assign(state.userProfile, { section: PROGRAM.code });
    store.set('lms_patch_version', PATCH_VERSION);
    store.set('lms_assessments', null);
  } else {
    state.modules = buildSubjects().map(s => {
      const saved = (store.get('lms_modules', []) || []).find(x => x.id === s.id);
      return saved ? Object.assign(s, { watched: saved.watched }) : s;
    });
    state.mentors = buildProfessors();
  }
  state.assessments = store.get('lms_assessments', null) || buildAssessments();
  state.selectedDate = daysFromToday(0);
  state.profileTab = 'about';
  Object.keys(FAMILIES).forEach(f => { SUBJECT_ICONS[f] = FAMILIES[f].icon; });
  persist();
  store.set('lms_assessments', state.assessments);
})();

function persistAssessments() { store.set('lms_assessments', state.assessments); }

(function profileMenu() {
  const btn = document.getElementById('profile-btn');
  const menu = document.getElementById('profile-menu');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
    btn.setAttribute('aria-expanded', String(!menu.hidden));
    renderIcons(menu);
  });
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target)) menu.hidden = true;
  });
  document.getElementById('open-edit-profile').addEventListener('click', () => {
    menu.hidden = true;
    router('profile');
    setProfileTab('about');
    document.getElementById('profile-edit-form').hidden = false;
  });
  document.getElementById('toggle-public-profile').addEventListener('click', () => {
    const el = document.getElementById('profile-hero-public');
    if (el) el.textContent = state.userProfile.publicProfile
      ? 'Your public profile is activated' : 'Your public profile is not activated';
  });
  document.getElementById('profile-hero-edit').addEventListener('click', () => {
    const f = document.getElementById('profile-edit-form');
    f.hidden = !f.hidden;
  });
})();

const _applyTheme = applyTheme;
applyTheme = function () {
  _applyTheme();
  const lbl = document.getElementById('theme-toggle-label');
  if (lbl) lbl.textContent = state.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
};

function renderWeekStrip() {
  const now = new Date();
  now.setDate(now.getDate() + state.weekOffset * 7);
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  document.getElementById('week-month-label').textContent =
    monday.toLocaleString('default', { month: 'long', year: 'numeric' });

  const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = localISO(d);
    html += `<div class="week-day ${iso === state.selectedDate ? 'active' : ''} ${iso === daysFromToday(0) ? 'is-today' : ''}"
      role="button" tabindex="0" data-date="${iso}">
      <span class="week-day-num">${d.getDate()}</span><span class="week-day-name">${names[i]}</span></div>`;
  }
  const strip = document.getElementById('week-strip');
  strip.innerHTML = html;
  strip.querySelectorAll('[data-date]').forEach(el => {
    const pick = () => { state.selectedDate = el.dataset.date; renderWeekStrip(); renderUpcomingClasses(); };
    el.addEventListener('click', pick);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
}

function classesOn(iso) {
  const d = new Date(iso + 'T00:00:00');
  const code = DOW_TO_CODE[d.getDay()];
  const out = [];
  if (!code) return out;
  state.modules.forEach(m => m.meetings.forEach(mt => { if (mt.day === code) out.push({ mod: m, mt }); }));
  return out.sort((a, b) => mins(a.mt.from) - mins(b.mt.from));
}
function renderUpcomingClasses() {
  const iso = state.selectedDate || daysFromToday(0);
  const d = new Date(iso + 'T00:00:00');
  const title = document.getElementById('agenda-title');
  if (title) {
    title.textContent = iso === daysFromToday(0) ? "Today's Agenda"
      : iso === daysFromToday(1) ? "Tomorrow's Agenda"
        : d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) + "'s Agenda";
  }
  const box = document.getElementById('upcoming-class-list');
  const list = classesOn(iso);
  box.innerHTML = list.map(({ mod, mt }) => {
    const prof = state.mentors.find(x => x.id === mod.mentorId) || {};
    return `<div class="upcoming-item" role="button" tabindex="0" data-open-lesson="${mod.id}">
      <div class="upcoming-time">${fmtShort(mt.from)}</div>
      <div class="upcoming-info">
        <div class="upcoming-title">${esc(mod.category)} <span class="kind-tag">${mod.kind === 'LABORATORY' ? 'LAB' : 'LEC'}</span></div>
        <div class="upcoming-sub">${esc(mt.room)} - ${esc(prof.name || 'TBA')}</div>
      </div></div>`;
  }).join('') || `<p class="empty-note">No classes scheduled for this day.</p>`;
  box.querySelectorAll('[data-open-lesson]').forEach(el =>
    el.addEventListener('click', () => openLessonDrawer(el.dataset.openLesson)));
}

function assessmentItemHTML(a) {
  return `<li class="${a.done ? 'done' : ''} assessment-item">
    <input type="checkbox" ${a.done ? 'checked' : ''} data-as-toggle="${a.id}" aria-label="Mark assessment done">
    <span class="task-text"><span class="as-code">${esc(a.code || '')}</span>${esc(a.title)}</span>
    <span class="task-date">${formatTaskDate(a.date)}</span>
  </li>`;
}
function renderAssessments() {
  const list = document.getElementById('assessment-list');
  if (!list) return;
  const pending = state.assessments.filter(a => !a.done).sort((a, b) => a.date.localeCompare(b.date));
  document.getElementById('assessment-count').textContent = pending.length;
  list.innerHTML = pending.slice(0, 6).map(assessmentItemHTML).join('') || `<li class="empty-hint">No assessments due.</li>`;
  list.querySelectorAll('[data-as-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const a = state.assessments.find(x => x.id === cb.dataset.asToggle);
    a.done = cb.checked;
    persistAssessments();
    renderAssessments();
    if (state.navActive === 'task') renderCalendar();
    if (state.navActive === 'dashboard') refreshHome();
    if (a.done) awardXP(XP_TASK, 'submitting an assessment');
  }));
}
function renderTasks() {
  const fullList = document.getElementById('task-list');
  fullList.innerHTML = state.tasks.map(taskItemHTML).join('') || `<li class="empty-hint">No tasks yet. Add one above.</li>`;
  wireTaskControls(fullList);
  const sideList = document.getElementById('sidebar-task-list');
  const pending = state.tasks.filter(t => !t.done).slice(0, 4);
  sideList.innerHTML = pending.map(taskItemHTML).join('') || `<li class="empty-hint">Your to-do list is empty.</li>`;
  wireTaskControls(sideList);
  renderAssessments();
  renderIcons();
}

function criticalTasks() {
  const today = daysFromToday(0), tomorrow = daysFromToday(1);
  const t = state.tasks.filter(x => !x.done && (x.date === today || x.date === tomorrow));
  const a = state.assessments.filter(x => !x.done && (x.date === today || x.date === tomorrow))
    .map(x => ({ id: x.id, text: `${x.code}: ${x.title}`, date: x.date, done: false }));
  return a.concat(t);
}

function renderCalendar() {
  const cal = document.getElementById('calendar');
  const now = new Date();
  document.getElementById('calendar-title').textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = dows.map(d => `<div class="cal-cell dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) html += `<div class="cal-cell blank"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(now.getFullYear(), now.getMonth(), d));
    const due = state.assessments.filter(a => a.date === iso && !a.done);
    const todo = state.tasks.filter(t => t.date === iso && !t.done);
    html += `<div class="cal-cell month-cell ${d === now.getDate() ? 'today' : ''}">
      <span class="cal-num">${d}</span>
      ${due.map(a => `<span class="cal-event due" title="${esc(a.subject + ' - ' + a.title)}">Due ${esc(a.title)}</span>`).join('')}
      ${todo.map(t => `<span class="cal-event todo" title="${esc(t.text)}">${esc(t.text)}</span>`).join('')}
    </div>`;
  }
  cal.innerHTML = html;
  cal.classList.add('month-grid');
}

const GRID_START = 7 * 60, SLOT = 30, GRID_SLOTS = 26;
function scheduleGridHTML() {
  let head = `<div class="sch-cell sch-corner"></div>` +
    DAY_ORDER.map(d => `<div class="sch-cell sch-head">${DAY_NAME[d].slice(0, 3).toUpperCase()}</div>`).join('');
  let body = '';
  for (let s = 0; s < GRID_SLOTS; s += 2) {
    const t = GRID_START + s * SLOT;
    body += `<div class="sch-time" style="grid-row:${s + 2}/span 2">${fmtShort(String(Math.floor(t / 60)).padStart(2, '0') + String(t % 60).padStart(2, '0'))}</div>`;
  }
  for (let s = 0; s < GRID_SLOTS; s++) {
    DAY_ORDER.forEach((d, di) => {
      body += `<div class="sch-grid-cell" style="grid-row:${s + 2};grid-column:${di + 2}"></div>`;
    });
  }
  state.modules.forEach(m => {
    const prof = state.mentors.find(x => x.id === m.mentorId) || {};
    m.meetings.forEach(mt => {
      const col = DAY_ORDER.indexOf(mt.day) + 2;
      const start = Math.round((mins(mt.from) - GRID_START) / SLOT) + 2;
      const span = Math.max(1, Math.round((mins(mt.to) - mins(mt.from)) / SLOT));
      const tone = (FAMILIES[m.category] || {}).tone || '#0F766E';
      body += `<div class="sch-block" data-open-lesson="${m.id}" role="button" tabindex="0"
        style="grid-column:${col};grid-row:${start}/span ${span};--tone:${tone}"
        data-tip="${esc(m.code + ' - ' + m.category + ' (' + m.kind + ')')}|${esc('Room ' + mt.room)}|${esc(prof.name || 'TBA')}|${esc(fmtTime(mt.from) + ' - ' + fmtTime(mt.to))}">
        <span class="sch-code">${esc(m.code)}</span>
        <span class="sch-name">${esc(m.category)}</span>
        <span class="sch-room">${esc(mt.room)} - ${fmtShort(mt.from)}-${fmtShort(mt.to)}</span>
      </div>`;
    });
  });
  return `<div class="sch-grid">${head}${body}</div><div class="sch-tip" id="sch-tip" hidden></div>`;
}
function wireSchedule(root) {
  const tip = root.querySelector('#sch-tip');
  root.querySelectorAll('.sch-block').forEach(b => {
    b.addEventListener('mousemove', (e) => {
      const parts = b.dataset.tip.split('|');
      tip.innerHTML = `<b>${parts[0]}</b><span>${parts[1]}</span><span>${parts[2]}</span><span>${parts[3]}</span>`;
      tip.hidden = false;
      const box = root.getBoundingClientRect();
      tip.style.left = Math.min(e.clientX - box.left + 14, box.width - 230) + 'px';
      tip.style.top = (e.clientY - box.top + 14) + 'px';
    });
    b.addEventListener('mouseleave', () => { tip.hidden = true; });
    b.addEventListener('click', () => { tip.hidden = true; openLessonDrawer(b.dataset.openLesson); });
    b.addEventListener('keydown', e => { if (e.key === 'Enter') openLessonDrawer(b.dataset.openLesson); });
  });
}

function moduleRowHTML(mod, m, done) {
  return `<div class="mod-row ${done ? 'is-done' : ''}">
    <img class="mod-thumb" src="${subjectArt(mod, 160, 110)}" alt="">
    <div class="mod-main">
      <h4>${m.n}. ${esc(m.title)}</h4>
      <p>${esc(m.desc)}</p>
      <div class="mod-foot">
        <span class="mod-state ${done ? 'done' : ''}">${done ? 'Completed' : 'In progress'} ${done ? iconSVG('check') : ''}</span>
        <span class="mod-sections">${m.sections} sections</span>
      </div>
    </div>
    <span class="term-pill ${m.term.toLowerCase()}">${m.term}</span>
  </div>`;
}
function openLessonDrawer(id) {
  const mod = state.modules.find(m => m.id === id);
  if (!mod) return;
  activeLessonId = id;
  const prof = state.mentors.find(m => m.id === mod.mentorId) || {};
  const done = mod.watched;
  const mid = mod.modules.filter(m => m.term === 'Midterm');
  const fin = mod.modules.filter(m => m.term === 'Finals');
  const html = `
    <img class="subject-hero" src="${subjectArt(mod, 640, 300)}" alt="${esc(mod.category)}">
    <span class="type-pill">${esc(mod.category)}</span>
    <h2 class="subject-title">[${esc(mod.code)}] ${esc(mod.title)}</h2>
    <div class="subject-info">
      <div><span class="si-label">Professor</span><span class="si-value">${esc(prof.name || 'TBA')}</span></div>
      <div><span class="si-label">Class ID / Section</span><span class="si-value">${esc(mod.lmsCode)} - ${esc(mod.section)}</span></div>
      <div><span class="si-label">Units</span><span class="si-value">${mod.units.toFixed(2)}</span></div>
      <div><span class="si-label">Schedule</span><span class="si-value">${mod.meetings.map(meetingLabel).map(esc).join('<br>')}</span></div>
    </div>
    <div class="subject-actions">
      <button class="ghost-btn" data-panel="class">${iconSVG('users')} View class</button>
      <button class="ghost-btn" data-panel="syllabus">${iconSVG('file')} Subject syllabus</button>
    </div>
    <div class="subject-panel" id="panel-class" hidden>
      <h3>Classmates <span class="count-pill">${BLOCKMATES.length}</span></h3>
      <div class="people-grid">${BLOCKMATES.map(n => `
        <div class="person-card"><div class="avatar" style="${avatarStyle(n)}">${esc(initials(n))}</div>
        <div><div class="person-name">${esc(n)}</div><div class="person-tag">${PROGRAM.code} - ${esc(mod.section)}</div></div></div>`).join('')}</div>
    </div>
    <div class="subject-panel" id="panel-syllabus" hidden>
      <h3>Subject syllabus</h3>
      <p>${esc(mod.category)} (${mod.kind.toLowerCase()}), ${mod.units.toFixed(2)} units, ${PROGRAM.term}.</p>
      <p>The course runs ten modules: five completed before the midterm examination and five before the final examination. Each module carries enabling assessments, a graded output and a culminating performance task.</p>
      <ul class="syl-list">${mod.modules.map(m => `<li><b>${m.term} ${m.n}.</b> ${esc(m.title)}</li>`).join('')}</ul>
    </div>
    <div class="modules-head">
      <h3>Modules</h3>
      <span class="modules-progress">${done} of ${mod.total} completed</span>
    </div>
    <h4 class="term-head">Midterm</h4>
    ${mid.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}
    <h4 class="term-head">Finals</h4>
    ${fin.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}
    <label class="notepad-label">Quick note
      <textarea id="subject-note" class="notepad" placeholder="Jot a private note for this subject...">${esc(state.notes[id] || '')}</textarea>
    </label>
    <button class="primary-btn" id="subject-complete" ${done >= mod.total ? 'disabled' : ''}>
      ${done >= mod.total ? 'All modules completed' : 'Mark next module as complete'}</button>`;
  const box = document.getElementById('subject-detail');
  box.innerHTML = html;
  box.querySelectorAll('[data-panel]').forEach(btn => btn.addEventListener('click', () => {
    const p = document.getElementById('panel-' + btn.dataset.panel);
    p.hidden = !p.hidden;
  }));
  box.querySelector('#subject-note').addEventListener('input', e => { state.notes[id] = e.target.value; persist(); });
  box.querySelector('#subject-complete').addEventListener('click', () => {
    if (mod.watched >= mod.total) return;
    mod.watched += 1;
    if (mod.watched >= mod.total) { addAward(`Course Completion: ${mod.category}`); toast(`Course completed: ${mod.category}`); }
    awardXP(XP_LESSON, 'finishing a module');
    persist();
    openLessonDrawer(id);
    renderUpcomingClasses();
    refreshHome();
    if (state.navActive === 'lesson') renderLessonPage();
    if (state.navActive === 'profile') renderProfilePage();
  });
  document.getElementById('lesson-drawer').scrollTop = 0;
  document.getElementById('drawer-backdrop').hidden = false;
}

function setProfileTab(tab) {
  state.profileTab = tab;
  document.querySelectorAll('#profile-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.profileTab === tab));
  ['about', 'info', 'enrolled', 'semester'].forEach(t => {
    const el = document.getElementById('profile-pane-' + t);
    if (el) el.hidden = t !== tab;
  });
  if (tab === 'info') renderInfoPane();
  if (tab === 'enrolled') renderEnrolledPane();
  if (tab === 'semester') renderSemesterPane();
}
document.querySelectorAll('#profile-tabs .tab').forEach(t =>
  t.addEventListener('click', () => setProfileTab(t.dataset.profileTab)));

function renderInfoPane() {
  const p = state.userProfile;
  const email = (p.name || 'student').toLowerCase().replace(/[^a-z]/g, '').slice(0, 3).toUpperCase() +
    (p.studentNumber || '000000').slice(-4) + '@dlsud.edu.ph';
  const row = (label, value, link) => `<div class="info-row"><span class="dotmark"></span><span class="info-key">${label}:</span>
    <span class="info-val ${link ? 'link' : ''}">${esc(value)}</span></div>`;
  document.getElementById('profile-pane-info').innerHTML = `
    <div class="panel">
      <h3>Info</h3>
      <div class="info-block">
        <h4>Academic Profile</h4>
        ${row('Student Number', p.studentNumber || '202280268')}
        ${row('Program Code (course/year/section)', PROGRAM.code)}
        ${row('Student ID', p.studentNumber || '202280268')}
        ${row('Organization', PROGRAM.org)}
        ${row('Term', PROGRAM.term)}
      </div>
      <div class="info-block">
        <h4>Basic</h4>
        ${row('Email', email, true)}
        ${row('Mobile Number', '09691432696')}
      </div>
      <div class="info-block misc">
        <h4>Miscellaneous</h4>
        <p>Logins: 4814 , Last login: ${timeAgo(Date.now() - 3 * 60 * 1000)}</p>
      </div>
    </div>`;
}

function renderEnrolledPane() {
  const grid = document.getElementById('profile-enrolled-grid');
  grid.innerHTML = state.modules.map(m => courseCardHTML(m)).join('');
  wireCourseCardEvents(grid);
  renderIcons(grid);
}

function renderSemesterPane() {
  const pane = document.getElementById('profile-pane-semester');
  const totalUnits = state.modules.reduce((a, m) => a + m.units, 0);
  pane.innerHTML = `
    <div class="panel">
      <div class="section-head"><h3>This Semester</h3><span class="term-label">${PROGRAM.term}</span></div>
      <div class="sem-stats">
        <div class="sem-stat"><b>${state.modules.length}</b><span>Classes</span></div>
        <div class="sem-stat"><b>${totalUnits.toFixed(2)}</b><span>Units</span></div>
        <div class="sem-stat"><b>${BLOCKMATES.length}</b><span>Block mates</span></div>
        <div class="sem-stat"><b>${PROGRAM.code}</b><span>Block</span></div>
      </div>
    </div>
    <div class="panel">
      <div class="section-head"><h3>Class Schedule</h3><span class="term-label">Hover a class for room, professor and time</span></div>
      <div class="sch-wrap" id="sch-wrap">${scheduleGridHTML()}</div>
    </div>
    <div class="panel">
      <div class="section-head"><h3>Current Subjects &amp; Professors</h3></div>
      <div class="sem-table-wrap">
      <table class="sem-table">
        <thead><tr><th>Class ID</th><th>Course Code</th><th>Section</th><th>Course Title</th><th>Units</th><th>Schedule</th><th>Room</th><th>Professor</th></tr></thead>
        <tbody>${state.modules.map(m => {
          const prof = state.mentors.find(x => x.id === m.mentorId) || {};
          return `<tr data-open-lesson="${m.id}">
            <td>${esc(m.lmsCode)}</td><td>${esc(m.code)}</td><td>${esc(m.section)}</td>
            <td>${esc(m.title)}</td><td>${m.units.toFixed(2)}</td>
            <td>${m.meetings.map(mt => `${DAY_NAME[mt.day].slice(0, 3)} ${fmtShort(mt.from)}-${fmtShort(mt.to)}`).join('<br>')}</td>
            <td>${m.meetings.map(mt => esc(mt.room)).join('<br>')}</td>
            <td>${esc(prof.name || 'TBA')}</td></tr>`;
        }).join('')}</tbody>
      </table></div>
    </div>
    <div class="panel">
      <div class="section-head"><h3>Block Mates <span class="count-pill">${BLOCKMATES.length}</span></h3></div>
      <div class="people-grid">${BLOCKMATES.map(n => `
        <div class="person-card"><div class="avatar" style="${avatarStyle(n)}">${esc(initials(n))}</div>
        <div><div class="person-name">${esc(n)}</div><div class="person-tag">${PROGRAM.code}</div></div></div>`).join('')}</div>
    </div>`;
  wireSchedule(document.getElementById('sch-wrap'));
  pane.querySelectorAll('tr[data-open-lesson]').forEach(r =>
    r.addEventListener('click', () => openLessonDrawer(r.dataset.openLesson)));
  renderIcons(pane);
}

function renderProfilePage() {
  const p = state.userProfile;
  document.getElementById('profile-name-input').value = p.name;
  document.getElementById('profile-studentnum-input').value = p.studentNumber || '';
  document.getElementById('profile-section-input').value = p.section || PROGRAM.code;
  document.getElementById('profile-bio-input').value = p.bio || '';
  document.getElementById('profile-hero-name').textContent = p.name;
  document.getElementById('profile-hero-public').textContent =
    p.publicProfile ? 'Your public profile is activated' : 'Your public profile is not activated';
  document.getElementById('public-profile-state').textContent = p.publicProfile ? 'On' : 'Off';

  const av = document.getElementById('profile-avatar-preview');
  av.innerHTML = avatarHTML(p.name, p.avatar);
  if (!p.avatar) av.setAttribute('style', avatarStyle(p.name)); else av.removeAttribute('style');

  document.getElementById('profile-bio-text').textContent =
    (p.bio && p.bio.trim()) || 'There is currently no information about this member.';

  const fl = document.getElementById('profile-friends-list');
  const friends = state.friends.slice(0, 6);
  document.getElementById('friends-count').textContent = state.friends.length;
  fl.innerHTML = friends.map(f => `<div class="friend-row">
    <div class="avatar" style="${avatarStyle(f.name)}">${esc(initials(f.name))}</div>
    <div><div class="person-name">${esc(f.name)}</div><div class="person-tag">${esc(f.tag || 'Friend')}</div></div></div>`).join('')
    || `<p class="empty-note">No friends yet.</p>`;

  document.getElementById('awards-count').textContent = state.awards.length;
  renderLevelCard();
  renderAwardsGrid();
  setProfileTab(state.profileTab || 'about');
  renderIcons(document.getElementById('page-profile'));
}

applyTheme();
renderIcons();
renderAvatarEverywhere();
renderWeekStrip();
renderUpcomingClasses();
renderTasks();
refreshHome();
if (state.navActive === 'lesson') renderLessonPage();

renderInfoPane = function () {
  const p = state.userProfile;
  const section = p.section || PROGRAM.code;
  const studentNo = p.studentNumber || '202280268';
  const email = (p.name || 'student').toLowerCase().replace(/[^a-z]/g, '').slice(0, 3).toUpperCase() +
    studentNo.slice(-4) + '@dlsud.edu.ph';
  let mobile = (p.mobile || '09691432696').replace(/\D/g, '');
  if (!mobile.startsWith('09')) mobile = '09' + mobile.replace(/^0+/, '').slice(0, 9);
  mobile = mobile.slice(0, 11);

  const logins = 2000 + Math.floor(Math.random() * 4000);
  const lastLoginMin = 1 + Math.floor(Math.random() * 58);

  const row = (label, value, link) => `<div class="info-row"><span class="dotmark"></span><span class="info-key">${label}:</span>
    <span class="info-val ${link ? 'link' : ''}">${esc(value)}</span></div>`;
  document.getElementById('profile-pane-info').innerHTML = `
    <div class="panel">
      <h3>Info</h3>
      <div class="info-block">
        <h4>Academic Profile</h4>
        ${row('Student Number', studentNo)}
        ${row('Program Code (course/year/section)', section)}
        ${row('Student ID', studentNo)}
        ${row('Organization', PROGRAM.org)}
        ${row('Term', PROGRAM.term)}
      </div>
      <div class="info-block">
        <h4>Basic</h4>
        ${row('Email', email, true)}
        ${row('Mobile Number', mobile)}
      </div>
      <div class="info-block misc">
        <h4>Miscellaneous</h4>
        <p>Logins: ${logins.toLocaleString()} , Last login: ${lastLoginMin} minute${lastLoginMin === 1 ? '' : 's'} ago</p>
      </div>
    </div>`;
};
renderSemesterPane = function () {
  const pane = document.getElementById('profile-pane-semester');
  pane.innerHTML = `
    <div class="panel">
      <div class="section-head"><h3>Class Schedule</h3><span class="term-label">Hover a class for room, professor and time</span></div>
      <div class="sch-wrap" id="sch-wrap">${scheduleGridHTML()}</div>
    </div>
    <div class="panel">
      <div class="section-head"><h3>Subjects &amp; Professors</h3></div>
      <table class="sem-table lean">
        <tbody>${state.modules.map(m => {
          const prof = state.mentors.find(x => x.id === m.mentorId) || {};
          return `<tr data-open-lesson="${m.id}">
            <td>
              <div class="sem-course-name">${esc(m.category)}</div>
              <div class="sem-course-code">${esc(m.code)} &middot; ${m.kind === 'LABORATORY' ? 'Lab' : 'Lecture'}</div>
            </td>
            <td class="sem-prof">
              <div class="avatar sm" style="${avatarStyle(prof.name || '?')}">${esc(initials(prof.name || '?'))}</div>
              <span>${esc(prof.name || 'TBA')}</span>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>`;
  wireSchedule(document.getElementById('sch-wrap'));
  pane.querySelectorAll('tr[data-open-lesson]').forEach(r =>
    r.addEventListener('click', () => openLessonDrawer(r.dataset.openLesson)));
  renderIcons(pane);
};
wireSchedule = function (root) {
  const tip = getGlobalScheduleTip();
  root.querySelectorAll('.sch-block').forEach(b => {
    b.addEventListener('mousemove', (e) => {
      const parts = b.dataset.tip.split('|');
      tip.innerHTML = `<b>${parts[0]}</b><span>${parts[1]}</span><span>${parts[2]}</span><span>${parts[3]}</span>`;
      tip.hidden = false;
      const tw = 230;
      let left = e.clientX + 16;
      if (left + tw > window.innerWidth) left = e.clientX - tw - 16;
      let top = e.clientY + 16;
      if (top + 90 > window.innerHeight) top = e.clientY - 96;
      tip.style.left = Math.max(8, left) + 'px';
      tip.style.top = Math.max(8, top) + 'px';
    });
    b.addEventListener('mouseleave', () => { tip.hidden = true; });
    b.addEventListener('click', () => { tip.hidden = true; openLessonDrawer(b.dataset.openLesson); });
    b.addEventListener('keydown', e => { if (e.key === 'Enter') openLessonDrawer(b.dataset.openLesson); });
  });
  root.addEventListener('scroll', () => { tip.hidden = true; });
};
openLessonDrawer = function (id) {
  const mod = state.modules.find(m => m.id === id);
  if (!mod) return;
  activeLessonId = id;
  const prof = state.mentors.find(m => m.id === mod.mentorId) || {};
  const done = mod.watched;
  const mid = mod.modules.filter(m => m.term === 'Midterm');
  const fin = mod.modules.filter(m => m.term === 'Finals');
  const html = `
    <img class="subject-hero" src="${subjectArt(mod, 640, 300)}" alt="${esc(mod.category)}">
    <span class="type-pill">${esc(mod.category)}</span>
    <h2 class="subject-title">[${esc(mod.code)}] ${esc(mod.title)}</h2>
    <div class="subject-info">
      <div><span class="si-label">Professor</span><span class="si-value">${esc(prof.name || 'TBA')}</span></div>
      <div><span class="si-label">Class ID / Section</span><span class="si-value">${esc(mod.lmsCode)} - ${esc(mod.section)}</span></div>
      <div><span class="si-label">Units</span><span class="si-value">${mod.units.toFixed(2)}</span></div>
      <div><span class="si-label">Schedule</span><span class="si-value">${mod.meetings.map(meetingLabel).map(esc).join('<br>')}</span></div>
    </div>
    <div class="subject-actions">
      <button class="ghost-btn" data-panel="class">${iconSVG('users')} View class</button>
      <button class="ghost-btn" data-panel="syllabus">${iconSVG('file')} Subject syllabus</button>
    </div>
    <div class="subject-panel" id="panel-class" hidden>
      <h3>Classmates <span class="count-pill">${BLOCKMATES.length}</span></h3>
      <div class="people-grid">${BLOCKMATES.map(n => `
        <div class="person-card"><div class="avatar" style="${avatarStyle(n)}">${esc(initials(n))}</div>
        <div><div class="person-name">${esc(n)}</div><div class="person-tag">${PROGRAM.code} - ${esc(mod.section)}</div></div></div>`).join('')}</div>
    </div>
    <div class="subject-panel" id="panel-syllabus" hidden>
      <h3>Subject syllabus</h3>
      <p>${esc(mod.category)} (${mod.kind.toLowerCase()}), ${mod.units.toFixed(2)} units, ${PROGRAM.term}. Runs ten modules - five before the midterm exam, five before the finals - each with an enabling assessment and a graded output.</p>
      <a class="ghost-btn syl-pdf-link" id="syllabus-pdf-link" href="#" download="${esc(mod.code)}-syllabus.pdf">${iconSVG('file')} Download full syllabus (PDF)</a>
    </div>
    <div class="modules-head">
      <h3>Modules</h3>
      <span class="modules-progress">${done} of ${mod.total} completed</span>
    </div>
    <h4 class="term-head">Midterm</h4>
    ${mid.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}
    <h4 class="term-head">Finals</h4>
    ${fin.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}
    <label class="notepad-label">Quick note
      <textarea id="subject-note" class="notepad" placeholder="Jot a private note for this subject...">${esc(state.notes[id] || '')}</textarea>
    </label>
    <button class="primary-btn" id="subject-complete" ${done >= mod.total ? 'disabled' : ''}>
      ${done >= mod.total ? 'All modules completed' : 'Mark next module as complete'}</button>`;
  const box = document.getElementById('subject-detail');
  box.innerHTML = html;
  box.querySelectorAll('[data-panel]').forEach(btn => btn.addEventListener('click', () => {
    const p = document.getElementById('panel-' + btn.dataset.panel);
    p.hidden = !p.hidden;
  }));
  const pdfLink = box.querySelector('#syllabus-pdf-link');
  pdfLink.addEventListener('click', (e) => {
    e.preventDefault();
    const url = buildSyllabusPDF(mod);
    const a = document.createElement('a');
    a.href = url; a.download = `${mod.code}-syllabus.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
  box.querySelector('#subject-note').addEventListener('input', e => { state.notes[id] = e.target.value; persist(); });
  box.querySelector('#subject-complete').addEventListener('click', () => {
    if (mod.watched >= mod.total) return;
    mod.watched += 1;
    if (mod.watched >= mod.total) { addAward(`Course Completion: ${mod.category}`); toast(`Course completed: ${mod.category}`); }
    awardXP(XP_LESSON, 'finishing a module');
    persist();
    openLessonDrawer(id);
    renderUpcomingClasses();
    refreshHome();
    if (state.navActive === 'lesson') renderLessonPage();
    if (state.navActive === 'profile') renderProfilePage();
  });
  document.getElementById('lesson-drawer').scrollTop = 0;
  document.getElementById('drawer-backdrop').hidden = false;
};
renderProfilePage = function () {
  const p = state.userProfile;
  document.getElementById('profile-name-input').value = p.name;
  document.getElementById('profile-studentnum-input').value = p.studentNumber || '';
  document.getElementById('profile-section-input').value = p.section || PROGRAM.code;
  document.getElementById('profile-bio-input').value = p.bio || '';
  const mobileInput = document.getElementById('profile-mobile-input');
  if (mobileInput) mobileInput.value = p.mobile || '09691432696';
  document.getElementById('profile-hero-name').textContent = p.name;
  document.getElementById('profile-hero-public').textContent =
    p.publicProfile ? 'Your public profile is activated' : 'Your public profile is not activated';
  document.getElementById('public-profile-state').textContent = p.publicProfile ? 'On' : 'Off';

  const av = document.getElementById('profile-avatar-preview');
  av.innerHTML = avatarHTML(p.name, p.avatar);
  if (!p.avatar) av.setAttribute('style', avatarStyle(p.name)); else av.removeAttribute('style');

  document.getElementById('profile-bio-text').textContent =
    (p.bio && p.bio.trim()) || 'There is currently no information about this member.';

  renderFriendsCard();

  document.getElementById('awards-count').textContent = state.awards.length;
  renderLevelCard();
  renderAwardsGrid();
  setProfileTab(state.profileTab || 'about');
  renderIcons(document.getElementById('page-profile'));
};
renderTasks = function () {
  const fullList = document.getElementById('task-list');
  const filterBanner = document.getElementById('task-filter-banner');
  const items = taskCalFilterDate ? state.tasks.filter(t => t.date === taskCalFilterDate) : state.tasks;
  fullList.innerHTML = items.map(taskItemHTML).join('') ||
    `<li class="empty-hint">${taskCalFilterDate ? 'No tasks on this date.' : 'No tasks yet. Add one above.'}</li>`;
  wireTaskControls(fullList);
  if (filterBanner) {
    if (taskCalFilterDate) {
      const d = new Date(taskCalFilterDate + 'T00:00:00');
      filterBanner.hidden = false;
      filterBanner.querySelector('span').textContent =
        'Showing ' + d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } else filterBanner.hidden = true;
  }

  const sideList = document.getElementById('sidebar-task-list');
  const pending = state.tasks.filter(t => !t.done).slice(0, 4);
  sideList.innerHTML = pending.map(taskItemHTML).join('') || `<li class="empty-hint">Your to-do list is empty.</li>`;
  wireTaskControls(sideList);
  renderAssessments();
  renderIcons();
};
renderCalendar = function () {
  const cal = document.getElementById('calendar');
  const now = new Date();
  document.getElementById('calendar-title').textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = dows.map(d => `<div class="cal-cell dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) html += `<div class="cal-cell blank"></div>`;
  const todayIso = daysFromToday(0);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(now.getFullYear(), now.getMonth(), d));
    const due = state.assessments.filter(a => a.date === iso && !a.done);
    const todo = state.tasks.filter(t => t.date === iso && !t.done);
    html += `<div class="cal-cell month-cell ${iso === todayIso ? 'today' : ''} ${iso === taskCalFilterDate ? 'selected' : ''}"
      role="button" tabindex="0" data-cal-date="${iso}">
      <span class="cal-num">${d}</span>
      ${due.map(a => `<span class="cal-event due" title="${esc(a.subject + ' - ' + a.title)}">Due ${esc(a.title)}</span>`).join('')}
      ${todo.map(t => `<span class="cal-event todo" title="${esc(t.text)}">${esc(t.text)}</span>`).join('')}
    </div>`;
  }
  cal.innerHTML = html;
  cal.classList.add('month-grid');
  cal.querySelectorAll('[data-cal-date]').forEach(cell => {
    const pick = () => {
      const iso = cell.dataset.calDate;
      taskCalFilterDate = (taskCalFilterDate === iso) ? null : iso;
      const dateInput = document.getElementById('task-date-input');
      if (dateInput) dateInput.value = taskCalFilterDate || '';
      renderCalendar();
      renderTasks();
    };
    cell.addEventListener('click', pick);
    cell.addEventListener('keydown', e => { if (e.key === 'Enter') pick(); });
  });
};

ICON_PATHS.chevronDown = '<path d="m6 9 6 6 6-6"/>';

function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }

function getGlobalScheduleTip() {
  let tip = document.getElementById('global-sch-tip');
  if (!tip) {
    tip = el('<div class="sch-tip" id="global-sch-tip" hidden></div>');
    document.body.appendChild(tip);
  }
  return tip;
}

function pdfEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
function wrapPdfLine(s, max) {
  const words = String(s).split(' '); const out = []; let line = '';
  words.forEach(w => {
    if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; }
    else line = (line + ' ' + w).trim();
  });
  if (line) out.push(line);
  return out;
}
function buildSyllabusPDF(mod) {
  const prof = state.mentors.find(m => m.id === mod.mentorId) || {};
  const lines = [];
  lines.push(`${mod.code}  |  Section ${mod.section}  |  ${mod.units.toFixed(2)} units  |  ${PROGRAM.term}`);
  lines.push(`Professor: ${prof.name || 'TBA'}`);
  lines.push(`Schedule: ${mod.meetings.map(meetingLabel).join('; ')}`);
  lines.push('');
  wrapPdfLine(`The course runs ten modules: five completed before the midterm examination and five before the final examination. Each module carries enabling assessments, a graded output and a culminating performance task.`, 90).forEach(l => lines.push(l));
  lines.push('');
  lines.push('MIDTERM');
  mod.modules.filter(m => m.term === 'Midterm').forEach(m => lines.push(`  ${m.n}. ${m.title}`));
  lines.push('');
  lines.push('FINALS');
  mod.modules.filter(m => m.term === 'Finals').forEach(m => lines.push(`  ${m.n}. ${m.title}`));

  const marginLeft = 54, leading = 15.5;
  let body = `BT /F2 16 Tf ${marginLeft} 742 Td (${pdfEscape(mod.category + ' - Syllabus')}) Tj ET\n`;
  body += `BT /F1 10.5 Tf ${marginLeft} 716 Td\n`;
  lines.forEach((line, i) => {
    body += (i === 0 ? `(${pdfEscape(line)}) Tj\n` : `0 -${leading} Td (${pdfEscape(line)}) Tj\n`);
  });
  body += 'ET';

  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>',
    `<< /Length ${body.length} >>\nstream\n${body}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objs.length; i++) pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
}

function friendModal() {
  let bd = document.getElementById('friend-modal-backdrop');
  if (!bd) {
    bd = el(`<div class="modal-backdrop" id="friend-modal-backdrop" hidden>
      <div class="modal friend-modal">
        <button class="drawer-close" id="friend-modal-close" data-icon="x" aria-label="Close"></button>
        <div id="friend-modal-body"></div>
      </div>
    </div>`);
    document.body.appendChild(bd);
    renderIcons(bd);
    bd.addEventListener('click', (e) => { if (e.target === bd) bd.hidden = true; });
    bd.querySelector('#friend-modal-close').addEventListener('click', () => { bd.hidden = true; });
  }
  return bd;
}
function openFriendCard(f) {
  const bd = friendModal();
  bd.querySelector('#friend-modal-body').innerHTML = `
    <div class="friend-modal-avatar avatar" style="${avatarStyle(f.name)}">${esc(initials(f.name))}</div>
    <h3>${esc(f.name)}</h3>
    <p class="person-tag">${esc(f.tag || 'Friend')}</p>`;
  bd.hidden = false;
}

let friendsExpanded = false;
function renderFriendsCard() {
  const fl = document.getElementById('profile-friends-list');
  const toggle = document.getElementById('friends-toggle');
  const friends = friendsExpanded ? state.friends : state.friends.slice(0, 4);
  document.getElementById('friends-count').textContent = state.friends.length;
  fl.innerHTML = friends.map(f => `<div class="friend-row" data-friend="${esc(f.id || f.name)}">
    <div class="avatar" style="${avatarStyle(f.name)}">${esc(initials(f.name))}</div>
    <div><div class="person-name">${esc(f.name)}</div><div class="person-tag">${esc(f.tag || 'Friend')}</div></div></div>`).join('')
    || `<p class="empty-note">No friends yet.</p>`;
  fl.querySelectorAll('[data-friend]').forEach(row => {
    row.addEventListener('click', () => {
      const f = state.friends.find(x => (x.id || x.name) === row.dataset.friend);
      if (f) openFriendCard(f);
    });
  });
  if (toggle) {
    toggle.setAttribute('aria-expanded', String(friendsExpanded));
    toggle.classList.toggle('open', friendsExpanded);
    toggle.hidden = state.friends.length <= 4;
    toggle.onclick = () => { friendsExpanded = !friendsExpanded; renderFriendsCard(); renderIcons(toggle); };
  }
  renderIcons(fl);
}

document.getElementById('profile-save').addEventListener('click', () => {
  const mobileInput = document.getElementById('profile-mobile-input');
  if (mobileInput) {
    let v = mobileInput.value.replace(/\D/g, '');
    if (v && !v.startsWith('09')) v = '09' + v.replace(/^0+/, '');
    state.userProfile.mobile = v.slice(0, 11);
    persist();
  }
});

let taskCalFilterDate = null;

(function searchDropdown() {
  const input = document.getElementById('search-input');
  const wrap = input.closest('.search');
  if (!wrap) return;
  const box = el('<div class="search-results" id="search-results" hidden></div>');
  wrap.appendChild(box);

  function run() {
    const q = input.value.trim().toLowerCase();
    if (!q) { box.hidden = true; return; }
    const hits = state.modules.filter(m =>
      m.category.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.lmsCode.includes(q)
    ).slice(0, 6);
    if (!hits.length) {
      box.innerHTML = `<div class="search-empty">No subjects match "${esc(input.value.trim())}"</div>`;
      box.hidden = false;
      return;
    }
    box.innerHTML = hits.map(m => {
      const prof = state.mentors.find(x => x.id === m.mentorId) || {};
      return `<div class="search-hit" data-open="${m.id}">
        <div class="search-hit-code">${esc(m.code)}</div>
        <div class="search-hit-main"><b>${esc(m.category)}</b><span>${esc(prof.name || 'TBA')} - ${m.kind === 'LABORATORY' ? 'Lab' : 'Lecture'}</span></div>
      </div>`;
    }).join('');
    box.hidden = false;
    box.querySelectorAll('[data-open]').forEach(row => row.addEventListener('click', () => {
      box.hidden = true;
      input.value = '';
      openLessonDrawer(row.dataset.open);
    }));
  }
  input.addEventListener('input', run);
  input.addEventListener('focus', run);
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) box.hidden = true; });
})();

function popoverInboxHTML() {
  const items = [
    { who: state.mentors[5]?.name || 'Prof. Michael Anderson', line: 'Posted a new grade for Midterm EA 3', time: '2h' },
    { who: state.mentors[3]?.name || 'Prof. Alvin Bautista', line: 'Replied in Module 6 discussion thread', time: '5h' },
    { who: state.mentors[1]?.name || 'Prof. Nadia Fajardo', line: 'Sent an announcement about Friday\'s quiz', time: '1d' },
    { who: 'Registrar\'s Office', line: 'Your enrollment for this term is confirmed', time: '2d' }
  ];
  return `
    <div class="pop-list">
      ${items.map(m => `<div class="pop-item">
        <div class="avatar sm" style="${avatarStyle(m.who)}">${esc(initials(m.who))}</div>
        <div class="pop-main"><b>${esc(m.who)}</b><span>${esc(m.line)}</span></div>
        <div class="pop-side"><span class="pop-time">${m.time}</span><span class="pop-check">${iconSVG('check')}</span></div>
      </div>`).join('')}
    </div>
    <div class="pop-foot">
      <button data-pop-action="inbox">${iconSVG('inbox')} See all</button>
      <button data-pop-action="compose">${iconSVG('plus')} New message</button>
      <button data-pop-action="configure">${iconSVG('sliders')} Configure</button>
    </div>`;
}
function popoverBellHTML() {
  const items = [
    { icon: 'award', tone: 'var(--accent-amber)', line: 'Graded: "Midterm Enabling Assessment 3"', time: '38m' },
    { icon: 'clock', tone: 'var(--pink)', line: 'Due soon: assignment in Networking 2', time: '1h' },
    { icon: 'flame', tone: 'var(--primary)', line: 'You kept your streak alive today', time: '3h' },
    { icon: 'bolt', tone: 'var(--primary-dark)', line: 'You leveled up to Level 14', time: '1d' }
  ];
  return `
    <div class="pop-list">
      ${items.map(n => `<div class="pop-item">
        <div class="pop-ico" style="background:${n.tone}">${iconSVG(n.icon)}</div>
        <div class="pop-main"><span>${esc(n.line)}</span></div>
        <div class="pop-side"><span class="pop-time">${n.time}</span><span class="pop-check">${iconSVG('check')}</span></div>
      </div>`).join('')}
    </div>
    <div class="pop-foot">
      <button data-pop-action="task">${iconSVG('tasks')} See all</button>
      <button data-pop-action="configure">${iconSVG('sliders')} Configure</button>
    </div>`;
}
function wirePopoverFoot(pop) {
  pop.querySelectorAll('[data-pop-action]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const act = btn.dataset.popAction;
    pop.hidden = true;
    if (act === 'inbox') router('inbox');
    if (act === 'task') router('task');
    if (act === 'compose' || act === 'configure') toast('Nothing to configure yet - this is a preview.');
  }));
  renderIcons(pop);
}
document.getElementById('msg-btn').addEventListener('click', () => {
  const pop = document.getElementById('msg-popover');
  if (!pop.hidden) { pop.innerHTML = popoverInboxHTML(); wirePopoverFoot(pop); }
});
document.getElementById('bell-btn').addEventListener('click', () => {
  const pop = document.getElementById('bell-popover');
  if (!pop.hidden) { pop.innerHTML = popoverBellHTML(); wirePopoverFoot(pop); }
});

const _taskFilterClear = document.getElementById('task-filter-clear');
if (_taskFilterClear) _taskFilterClear.addEventListener('click', () => {
  taskCalFilterDate = null;
  const dateInput = document.getElementById('task-date-input');
  if (dateInput) dateInput.value = '';
  renderCalendar();
  renderTasks();
});

renderIcons();
if (state.navActive === 'task') { renderCalendar(); renderTasks(); }
if (state.navActive === 'profile') renderProfilePage();

renderCalendar = function () {
  const cal = document.getElementById('calendar');
  const now = new Date();
  document.getElementById('calendar-title').textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = dows.map(d => `<div class="cal-cell dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) html += `<div class="cal-cell blank"></div>`;
  const todayIso = daysFromToday(0);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(now.getFullYear(), now.getMonth(), d));
    const due = state.assessments.filter(a => a.date === iso && !a.done);
    const todo = state.tasks.filter(t => t.date === iso && !t.done);
    html += `<div class="cal-cell month-cell ${iso === todayIso ? 'today' : ''} ${iso === taskCalFilterDate ? 'selected' : ''}"
      role="button" tabindex="0" data-cal-date="${iso}" title="${due.length || todo.length ? esc(due.map(a => a.title).concat(todo.map(t => t.text)).join(', ')) : ''}">
      <span class="cal-num">${d}</span>
      <div class="cal-badges">
        ${due.length ? `<span class="cal-badge due">${due.length} due</span>` : ''}
        ${todo.length ? `<span class="cal-badge todo">${todo.length} to-do</span>` : ''}
      </div>
    </div>`;
  }
  cal.innerHTML = html;
  cal.classList.add('month-grid');
  cal.querySelectorAll('[data-cal-date]').forEach(cell => {
    const pick = () => {
      const iso = cell.dataset.calDate;
      taskCalFilterDate = (taskCalFilterDate === iso) ? null : iso;
      const dateInput = document.getElementById('task-date-input');
      if (dateInput) dateInput.value = taskCalFilterDate || '';
      renderCalendar();
      renderTasks();
    };
    cell.addEventListener('click', pick);
    cell.addEventListener('keydown', e => { if (e.key === 'Enter') pick(); });
  });
};
renderTasks = function () {
  const fullList = document.getElementById('task-list');
  const filterBanner = document.getElementById('task-filter-banner');

  let items;
  if (taskCalFilterDate) {
    const dueHere = state.assessments.filter(a => a.date === taskCalFilterDate).map(a => Object.assign({ kind: 'assessment' }, a));
    const tasksHere = state.tasks.filter(t => t.date === taskCalFilterDate);
    items = dueHere.concat(tasksHere);
  } else {
    items = state.tasks;
  }
  fullList.innerHTML = items.map(combinedItemHTML).join('') ||
    `<li class="empty-hint">${taskCalFilterDate ? 'Nothing due or planned on this date.' : 'No tasks yet. Add one above.'}</li>`;
  wireTaskControls(fullList);
  fullList.querySelectorAll('[data-as-toggle]').forEach(cb => cb.addEventListener('change', () => {
    const a = state.assessments.find(x => x.id === cb.dataset.asToggle);
    a.done = cb.checked;
    persistAssessments();
    renderCalendar();
    renderTasks();
    if (state.navActive === 'dashboard') refreshHome();
    if (a.done) awardXP(XP_TASK, 'submitting an assessment');
  }));

  if (filterBanner) {
    if (taskCalFilterDate) {
      const d = new Date(taskCalFilterDate + 'T00:00:00');
      filterBanner.hidden = false;
      filterBanner.querySelector('span').textContent =
        'Showing ' + d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } else filterBanner.hidden = true;
  }

  const sideList = document.getElementById('sidebar-task-list');
  const pending = state.tasks.filter(t => !t.done).slice(0, 4);
  sideList.innerHTML = pending.map(taskItemHTML).join('') || `<li class="empty-hint">Your to-do list is empty.</li>`;
  wireTaskControls(sideList);
  renderAssessments();
  renderIcons();
};

function combinedItemHTML(item) {
  if (item.kind === 'assessment') {
    return `<li class="${item.done ? 'done' : ''} assessment-item">
      <input type="checkbox" ${item.done ? 'checked' : ''} data-as-toggle="${item.id}" aria-label="Mark assessment done">
      <span class="task-text"><span class="as-code">${esc(item.code || '')}</span>${esc(item.title)}</span>
      <span class="task-date">Due</span>
    </li>`;
  }
  return taskItemHTML(item);
}

if (state.navActive === 'task') { renderCalendar(); renderTasks(); }

document.getElementById('open-edit-profile').addEventListener('click', () => {
  const f = document.getElementById('profile-edit-form');
  if (f) f.hidden = true;
});

renderSemesterPane = function () {
  const pane = document.getElementById('profile-pane-semester');
  const groups = {};
  const order = [];
  state.modules.forEach(m => {
    if (!groups[m.category]) { groups[m.category] = []; order.push(m.category); }
    groups[m.category].push(m);
  });
  const rows = order.map(cat => {
    const g = groups[cat];
    const primary = g.find(m => m.kind !== 'LABORATORY') || g[0];
    const prof = state.mentors.find(x => x.id === primary.mentorId) || {};
    const kinds = g.map(m => m.kind === 'LABORATORY' ? 'Lab' : 'Lecture');
    return `<tr data-open-lesson="${primary.id}">
      <td>
        <div class="sem-course-name">${esc(cat)}</div>
        <div class="sem-course-code">${esc(primary.code.replace(/LA$/, ''))}</div>
        <div class="kind-badges">${kinds.map(k => `<span class="kind-badge">${k}</span>`).join('')}</div>
      </td>
      <td class="sem-prof">
        <div class="avatar sm" style="${avatarStyle(prof.name || '?')}">${esc(initials(prof.name || '?'))}</div>
        <span>${esc(prof.name || 'TBA')}</span>
      </td>
    </tr>`;
  }).join('');
  pane.innerHTML = `
    <div class="panel">
      <div class="section-head"><h3>Class Schedule</h3><span class="term-label">Hover a class for room, professor and time</span></div>
      <div class="sch-wrap" id="sch-wrap">${scheduleGridHTML()}</div>
    </div>
    <div class="panel">
      <div class="section-head"><h3>Subjects &amp; Professors</h3></div>
      <table class="sem-table lean">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  wireSchedule(document.getElementById('sch-wrap'));
  pane.querySelectorAll('tr[data-open-lesson]').forEach(r =>
    r.addEventListener('click', () => openLessonDrawer(r.dataset.openLesson)));
  renderIcons(pane);
};
setProfileTab = function (tab) {
  state.profileTab = tab;
  document.querySelectorAll('#profile-tabs .tab').forEach(t => t.classList.toggle('active', t.dataset.profileTab === tab));
  ['about', 'info', 'enrolled', 'semester', 'portal'].forEach(t => {
    const el = document.getElementById('profile-pane-' + t);
    if (el) el.hidden = t !== tab;
  });
  if (tab === 'info') renderInfoPane();
  if (tab === 'enrolled') renderEnrolledPane();
  if (tab === 'semester') renderSemesterPane();
  if (tab === 'portal') renderPortalPane();
};
renderHeroCarousel = function () {
  const firstName = (state.userProfile.name || 'there').split(' ')[0];
  const blockers = criticalTasks();
  const g = state.gamification;
  const xpPct = Math.min(100, Math.round((g.xp / g.xpTarget) * 100));
  const streak = currentStreak();

  const welcomeSub = [
    streak > 0 ? `You are on a ${streak}-day streak.` : 'Complete a lesson today to start a streak.',
    blockers.length ? `${blockers.length} assessment${blockers.length === 1 ? '' : 's'} due soon.` : 'Nothing is due today or tomorrow.'
  ].join(' ');

  const slide1 = `
    <div class="hero-slide slide-welcome" role="group" aria-roledescription="slide" aria-label="1 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('calendar')} ${TERM_LABEL}</div>
        <h1>${greetingLabel()}, ${esc(firstName)}</h1>
        <p class="hero-sub">${welcomeSub}</p>
        <button class="hero-pill" data-hero-go="lesson">${iconSVG('book')} Continue learning</button>
      </div>
      <div class="hero-art">
        <div class="hero-ring">
          ${heroRingSVG(xpPct)}
          <div class="hero-ring-center"><span class="hero-ring-num">${g.level}</span><span class="hero-ring-cap">Level</span></div>
        </div>
        <div class="hero-art-cap">${esc(rankFor(g.level).cur.name)}, ${g.xp.toLocaleString()} XP</div>
      </div>
    </div>`;

  const todays = classesOn(daysFromToday(0));
  const slide2 = `
    <div class="hero-slide slide-agenda" role="group" aria-roledescription="slide" aria-label="2 of 3">
      <div class="hero-copy">
        <div class="hero-tag">${iconSVG('clock')} Today's agenda</div>
        <h1>${todays.length ? `You have ${todays.length} class${todays.length === 1 ? '' : 'es'} today` : "You're all caught up"}</h1>
        <p class="hero-sub">${todays.length ? 'Here is what is on your schedule for today.' : 'No classes on your schedule today. Nice work.'}</p>
        <button class="hero-pill" data-hero-go="agenda">${iconSVG('book')} View agenda</button>
      </div>
      <div class="hero-art">
        <div class="hero-card list">
          ${todays.length ? todays.slice(0, 3).map(({ mod, mt }) => `
            <div class="hero-task">${iconSVG(subjectIcon(mod.category))}<span>${esc(mod.category)} &middot; ${fmtShort(mt.from)} &middot; ${esc(mt.room)}</span></div>
          `).join('') : `<div class="hero-clear">${iconSVG('check')} No classes today</div>`}
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
openLessonDrawer = function (id) {
  const mod = state.modules.find(m => m.id === id);
  if (!mod) return;
  activeLessonId = id;
  const prof = state.mentors.find(m => m.id === mod.mentorId) || {};
  const done = mod.watched;
  const mid = mod.modules.filter(m => m.term === 'Midterm');
  const fin = mod.modules.filter(m => m.term === 'Finals');
  const html = `
    <img class="subject-hero" src="${subjectArt(mod, 640, 300)}" alt="${esc(mod.category)}">
    <span class="type-pill">${esc(mod.category)}</span>
    <h2 class="subject-title">[${esc(mod.code)}] ${esc(mod.title)}</h2>
    <div class="subject-info">
      <div><span class="si-label">Professor</span><button type="button" class="si-value si-link" data-open-mentor-contact>${esc(prof.name || 'TBA')}</button></div>
      <div><span class="si-label">Class ID / Section</span><span class="si-value">${esc(mod.lmsCode)} - ${esc(mod.section)}</span></div>
      <div><span class="si-label">Units</span><span class="si-value">${mod.units.toFixed(2)}</span></div>
      <div><span class="si-label">Schedule</span><span class="si-value">${mod.meetings.map(meetingLabel).map(esc).join('<br>')}</span></div>
    </div>
    <div class="subject-actions">
      <button class="ghost-btn" data-panel="class">${iconSVG('users')} View class</button>
      <button class="ghost-btn" data-panel="syllabus">${iconSVG('file')} Subject syllabus</button>
      <button class="ghost-btn" data-panel="assessment">${iconSVG('file')} Assessment</button>
      <button class="ghost-btn" data-panel="attendance">${iconSVG('calendar')} Attendance</button>
    </div>
    <div class="subject-panel" id="panel-class" hidden>
      <h3>Classmates <span class="count-pill">${BLOCKMATES.length}</span></h3>
      <div class="people-grid">${BLOCKMATES.map(n => `
        <div class="person-card"><div class="avatar" style="${avatarStyle(n)}">${esc(initials(n))}</div>
        <div><div class="person-name">${esc(n)}</div><div class="person-tag">${PROGRAM.code} - ${esc(mod.section)}</div></div></div>`).join('')}</div>
    </div>
    <div class="subject-panel" id="panel-syllabus" hidden>
      <h3>Subject syllabus</h3>
      <p>${esc(mod.category)} (${mod.kind.toLowerCase()}), ${mod.units.toFixed(2)} units, ${PROGRAM.term}. Runs ten modules - five before the midterm exam, five before the finals - each with an enabling assessment and a graded output.</p>
      <a class="ghost-btn syl-pdf-link" id="syllabus-pdf-link" href="#" download="${esc(mod.code)}-syllabus.pdf">${iconSVG('file')} Download full syllabus (PDF)</a>
    </div>
    <div class="subject-panel" id="panel-assessment" hidden>
      <h3>Assessment</h3>
      ${renderAssessmentPanelHTML(mod)}
    </div>
    <div class="subject-panel" id="panel-attendance" hidden>
      <h3>Attendance <span class="term-label">Summary</span></h3>
      ${renderAttendancePanelHTML(mod)}
    </div>
    <div class="modules-head">
      <h3>Modules</h3>
      <span class="modules-progress">${done} of ${mod.total} completed</span>
    </div>
    <h4 class="term-head">Midterm</h4>
    ${mid.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}
    <h4 class="term-head">Finals</h4>
    ${fin.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}`;
  const box = document.getElementById('subject-detail');
  box.innerHTML = html;
  box.querySelectorAll('[data-panel]').forEach(btn => btn.addEventListener('click', () => {
    const p = document.getElementById('panel-' + btn.dataset.panel);
    p.hidden = !p.hidden;
  }));
  const pdfLink = box.querySelector('#syllabus-pdf-link');
  pdfLink.addEventListener('click', (e) => {
    e.preventDefault();
    const url = buildSyllabusPDF(mod);
    const a = document.createElement('a');
    a.href = url; a.download = `${mod.code}-syllabus.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
  const contactBtn = box.querySelector('[data-open-mentor-contact]');
  if (contactBtn) contactBtn.addEventListener('click', () => openMentorContact(mod.mentorId, mod));
  document.getElementById('lesson-drawer').scrollTop = 0;
  document.getElementById('drawer-backdrop').hidden = false;
};

function renderPortalPane() {
  const pane = document.getElementById('profile-pane-portal');
  if (!pane) return;
  pane.innerHTML = `
    <div class="portal-panel">
      <span class="role-chip-static">MyDLSU-D Portal</span>
      <h3>Continue to the official student portal</h3>
      <p>Enrollment, official grades, and other registrar services live on the university's MyDLSU-D portal.
      You'll be redirected there in a new tab and sign in with your own DLSU-D account.</p>
      <a class="portal-go-btn" href="https://portal.dlsud.edu.ph/mydlsud/login.aspx" target="_blank" rel="noopener noreferrer">
        ${iconSVG('layers')} Continue to Portal
      </a>
      <span class="portal-note">portal.dlsud.edu.ph &middot; opens in a new tab</span>
    </div>`;
  renderIcons(pane);
}

function syncProfileEditUI() {
  const form = document.getElementById('profile-edit-form');
  const tabs = document.getElementById('profile-tabs');
  const editing = !!(form && !form.hidden);
  if (tabs) tabs.hidden = editing;
  if (editing) {
    document.querySelectorAll('.profile-pane').forEach(p => { p.hidden = true; });
  } else {
    setProfileTab(state.profileTab || 'about');
  }
}
const _heroEditBtn = document.getElementById('profile-hero-edit');
if (_heroEditBtn) _heroEditBtn.addEventListener('click', syncProfileEditUI);
const _openEditProfileBtn = document.getElementById('open-edit-profile');
if (_openEditProfileBtn) _openEditProfileBtn.addEventListener('click', syncProfileEditUI);
const _profileSaveBtn = document.getElementById('profile-save');
if (_profileSaveBtn) _profileSaveBtn.addEventListener('click', syncProfileEditUI);
document.addEventListener('pagechange', (e) => { if (e.detail && e.detail.page === 'profile') syncProfileEditUI(); });

function renderSidebarMini() {
  const todoBox = document.getElementById('sidebar-mini-todo');
  if (todoBox) {
    const pending = state.tasks.filter(t => !t.done).slice(0, 4);
    todoBox.innerHTML = pending.map(taskItemHTML).join('') || `<li class="empty-hint">All caught up.</li>`;
    wireTaskControls(todoBox);
  }
  const newsBox = document.getElementById('sidebar-mini-news');
  if (newsBox) {
    const items = [...state.news].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.ts - a.ts).slice(0, 3);
    newsBox.innerHTML = items.map(p => `
      <button type="button" class="mini-news-item" data-open-news="${esc(p.id)}">
        <span class="mini-news-title">${esc(p.title)}</span>
        <span class="mini-news-meta">${esc(p.author)} &middot; ${timeAgo(p.ts)}</span>
      </button>`).join('') || `<p class="empty-note">No news yet.</p>`;
    newsBox.querySelectorAll('[data-open-news]').forEach(btn => btn.addEventListener('click', () => {
      router('dashboard');
      setHomeTab('news');
    }));
  }
  renderIcons(document.getElementById('sidebar-mini'));
}
document.querySelectorAll('[data-mini-go]').forEach(btn => btn.addEventListener('click', () => {
  const go = btn.dataset.miniGo;
  if (go === 'task') router('task');
  if (go === 'news') { router('dashboard'); setHomeTab('news'); }
}));

const _priorRenderTasks = renderTasks;
renderTasks = function () { _priorRenderTasks(); renderSidebarMini(); };
const _priorRenderNews = renderNews;
renderNews = function () { _priorRenderNews(); renderSidebarMini(); };

(function rewireHeroAgendaClick() {
  const oldSlides = document.getElementById('hero-slides');
  if (!oldSlides) return;
  const newSlides = oldSlides.cloneNode(true);
  oldSlides.parentNode.replaceChild(newSlides, oldSlides);
  newSlides.addEventListener('click', (e) => {
    const b = e.target.closest('[data-hero-go]');
    if (!b) return;
    const go = b.dataset.heroGo;
    if (go === 'agenda') {
      const todays = classesOn(daysFromToday(0));
      router('lesson');
      if (todays.length) openLessonDrawer(todays[0].mod.id);
    } else {
      router(go);
    }
  });
})();

function assessmentsFor(mod) { return state.assessments.filter(a => a.subjectId === mod.id); }
function pseudoHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function assessGrade(a) { return 70 + (pseudoHash(a.id) % 26); }
function assessStart(a) {
  const d = new Date(a.date + 'T00:00:00');
  d.setDate(d.getDate() - 6);
  return localISO(d);
}
function renderAssessmentPanelHTML(mod) {
  const items = assessmentsFor(mod);
  if (!items.length) return `<p class="empty-note">No assessments recorded for this subject yet.</p>`;
  const rows = items.map(a => {
    const submitted = !!a.done;
    const score = submitted ? assessGrade(a) : null;
    return `<tr>
      <td>${esc(a.title)}</td>
      <td>${formatTaskDate(assessStart(a))}</td>
      <td>${formatTaskDate(a.date)}</td>
      <td class="${submitted ? 'assess-submit-yes' : 'assess-submit-no'}">${submitted ? 'Submitted' : 'Pending'}</td>
      <td>${submitted ? score + '%' : '-'}</td>
    </tr>`;
  }).join('');
  const scores = items.filter(a => a.done).map(assessGrade);
  const overall = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  return `
    <div class="assess-table-wrap">
      <table class="assess-table">
        <thead><tr><th>Assessment</th><th>Start</th><th>Due</th><th>Status</th><th>Grade</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="grade-ring-wrap">
      <div class="grade-ring" style="--pct:${overall}%">
        <div class="grade-ring-inner"><span class="grade-ring-num">${overall}%</span><span class="grade-ring-cap">OVERALL</span></div>
      </div>
      <div class="grade-meta">Overall grade based on <b>${scores.length}</b> of ${items.length} submitted assessment${items.length === 1 ? '' : 's'}.</div>
    </div>`;
}
function attendanceStatsFor(mod) {
  const h = pseudoHash(mod.id);
  return {
    onTime: 6 + (h % 5),
    late: h % 3,
    leftEarly: (h >> 2) % 2,
    absent: (h >> 4) % 2,
    excused: (h >> 6) % 2
  };
}
function renderAttendancePanelHTML(mod) {
  const s = attendanceStatsFor(mod);
  return `<div class="attend-stats">
    <div class="attend-pill"><b>${s.onTime}</b><span>On time</span></div>
    <div class="attend-pill"><b>${s.late || '-'}</b><span>Arrived late</span></div>
    <div class="attend-pill"><b>${s.leftEarly || '-'}</b><span>Left early</span></div>
    <div class="attend-pill"><b>${s.absent || '-'}</b><span>Absent</span></div>
    <div class="attend-pill"><b>${s.excused || '-'}</b><span>Excused</span></div>
  </div>`;
}

function mentorEmail(name) {
  const parts = String(name || '').replace(/^Prof\.?\s*/i, '').trim().split(/\s+/).filter(Boolean);
  const last = parts.length ? parts[parts.length - 1] : 'professor';
  const first = parts.length ? parts[0] : '';
  return (first.slice(0, 1) + last).toLowerCase().replace(/[^a-z]/g, '') + '@dlsud.edu.ph';
}
function mentorContactModal() {
  let bd = document.getElementById('mentor-contact-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'modal-backdrop';
    bd.id = 'mentor-contact-backdrop';
    bd.hidden = true;
    bd.innerHTML = `<div class="modal">
      <button class="drawer-close" id="mentor-contact-close" data-icon="x" aria-label="Close"></button>
      <div id="mentor-contact-body"></div>
    </div>`;
    document.body.appendChild(bd);
    bd.addEventListener('click', (e) => { if (e.target === bd) bd.hidden = true; });
    bd.querySelector('#mentor-contact-close').addEventListener('click', () => { bd.hidden = true; });
    renderIcons(bd);
  }
  return bd;
}
function openMentorContact(mentorId, mod) {
  const prof = state.mentors.find(m => m.id === mentorId) || {};
  const email = mentorEmail(prof.name);
  const bd = mentorContactModal();
  bd.querySelector('#mentor-contact-body').innerHTML = `
    <div class="mentor-contact-avatar avatar" style="${avatarStyle(prof.name || '?')}">${esc(initials(prof.name || '?'))}</div>
    <h3 style="text-align:center;margin:0 0 2px;">${esc(prof.name || 'Professor')}</h3>
    <p class="person-tag" style="text-align:center;margin:0 0 4px;">${esc(mod.category)} &middot; Section ${esc(mod.section)}</p>
    <div class="contact-methods">
      <div class="contact-method">
        ${iconSVG('users')}
        <div class="contact-method-main"><div class="contact-method-label">Microsoft Teams</div><div class="contact-method-value">${esc(prof.name || 'Professor')}</div></div>
        <button type="button" class="contact-method-btn" data-teams>Open Teams</button>
      </div>
      <div class="contact-method">
        ${iconSVG('mail')}
        <div class="contact-method-main"><div class="contact-method-label">School email</div><div class="contact-method-value">${esc(email)}</div></div>
        <a class="contact-method-btn" href="mailto:${esc(email)}" style="text-decoration:none;">Email</a>
      </div>
    </div>
    <form class="contact-msg-form" id="mentor-contact-form">
      <label style="display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:600;color:var(--text-muted);">
        Message ${esc(prof.name || 'the professor')} privately
        <textarea id="mentor-contact-text" placeholder="Ask about this subject's assessments or class..." required></textarea>
      </label>
      <p class="contact-msg-note">This goes straight to ${esc(prof.name || 'the professor')}, tagged with your section (${esc(mod.section)}) so any concern is easy to track back to the right class.</p>
      <button type="submit" class="primary-btn small">Send message</button>
    </form>`;
  renderIcons(bd);
  bd.querySelector('[data-teams]').addEventListener('click', () => toast(`Opening Microsoft Teams chat with ${prof.name || 'the professor'}...`));
  bd.querySelector('#mentor-contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('mentor-contact-text').value.trim();
    if (!text) return;
    toast(`Message sent to ${prof.name || 'the professor'} (Section ${mod.section})`);
    bd.hidden = true;
  });
  bd.hidden = false;
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const bd = document.getElementById('mentor-contact-backdrop');
  if (bd) bd.hidden = true;
});

renderSidebarMini();
if (state.navActive === 'profile') renderProfilePage();

if (state.navActive === 'dashboard' && state.homeTab === 'dashboard') renderHeroCarousel();

renderCalendar = function () {
  const cal = document.getElementById('calendar');
  const now = new Date();
  document.getElementById('calendar-title').textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let html = dows.map(d => `<div class="cal-cell dow">${d}</div>`).join('');
  for (let i = 0; i < first.getDay(); i++) html += `<div class="cal-cell blank"></div>`;
  const todayIso = daysFromToday(0);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = localISO(new Date(now.getFullYear(), now.getMonth(), d));
    const due = state.assessments.filter(a => a.date === iso && !a.done);
    const todo = state.tasks.filter(t => t.date === iso && !t.done);
    html += `<div class="cal-cell month-cell ${iso === todayIso ? 'today' : ''} ${iso === taskCalFilterDate ? 'selected' : ''}"
      role="button" tabindex="0" data-cal-date="${iso}" title="${due.length || todo.length ? esc(due.map(a => a.title).concat(todo.map(t => t.text)).join(', ')) : ''}">
      <span class="cal-num">${d}</span>
      <div class="cal-badges">
        ${due.length ? `<span class="cal-badge due" title="${due.length} due">${due.length}</span>` : ''}
        ${todo.length ? `<span class="cal-badge todo" title="${todo.length} to-do">${todo.length}</span>` : ''}
      </div>
    </div>`;
  }
  cal.innerHTML = html;
  cal.classList.add('month-grid');
  cal.querySelectorAll('[data-cal-date]').forEach(cell => {
    const pick = () => {
      const iso = cell.dataset.calDate;
      taskCalFilterDate = (taskCalFilterDate === iso) ? null : iso;
      const dateInput = document.getElementById('task-date-input');
      if (dateInput) dateInput.value = taskCalFilterDate || '';
      renderCalendar();
      renderTasks();
    };
    cell.addEventListener('click', pick);
    cell.addEventListener('keydown', e => { if (e.key === 'Enter') pick(); });
  });
};
renderMentorModal = function (query) {
  const grid = document.getElementById('mentor-modal-grid');
  const q = (query || '').toLowerCase();
  const list = state.mentors.filter(m => m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q));
  grid.innerHTML = list.map(m => mentorRowHTML(m, true)).join('') || `<p class="empty-note">No professors found.</p>`;
  wireFollowButtons(grid);
  wireExpandableCards(grid);
  renderIcons(grid);
};
buildAssessments = function () {
  const TYPES = ['Enabling Assessment (Onsite)', 'Enabling Assessment (Online)', 'Class Participation'];
  const DATES = ['2026-08-03', '2026-08-10', '2026-08-17', '2026-08-24', '2026-08-31',
    '2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28'];
  const today = daysFromToday(0);
  const out = [];
  state.modules.forEach((mod, si) => {
    DATES.forEach((date, i) => {
      out.push({
        id: 'as' + si + '-' + i,
        subjectId: mod.id, code: mod.code, subject: mod.category,
        title: `${TYPES[i % 3]} ${Math.floor(i / 3) + 1}`,
        date, done: date < today
      });
    });
  });
  return out;
};
renderAssessmentPanelHTML = function (mod) {
  const items = assessmentsFor(mod);
  if (!items.length) return `<p class="empty-note">No assessments recorded for this subject yet.</p>${gradingBasisHTML()}`;
  const rows = items.map(a => {
    const submitted = !!a.done;
    const score = submitted ? assessGrade(a) : null;
    return `<tr>
      <td>${esc(a.title)}</td>
      <td>${formatTaskDate(assessStart(a))}</td>
      <td>${formatTaskDate(a.date)}</td>
      <td class="${submitted ? 'assess-submit-yes' : 'assess-submit-no'}">${submitted ? 'Submitted' : 'Pending'}</td>
      <td>${submitted ? score + '%' : '-'}</td>
    </tr>`;
  }).join('');
  const scores = items.filter(a => a.done).map(assessGrade);
  const overall = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  return `
    <div class="assess-table-wrap">
      <table class="assess-table">
        <thead><tr><th>Assessment</th><th>Start</th><th>Due</th><th>Status</th><th>Grade</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="grade-ring-wrap">
      <div class="grade-ring" style="--pct:${overall}%">
        <div class="grade-ring-inner"><span class="grade-ring-num">${overall}%</span><span class="grade-ring-cap">OVERALL</span></div>
      </div>
      <div class="grade-meta">Overall grade based on <b>${scores.length}</b> of ${items.length} submitted assessment${items.length === 1 ? '' : 's'}.</div>
    </div>
    ${gradingBasisHTML()}`;
};
renderAttendancePanelHTML = function (mod) {
  const s = attendanceStatsFor(mod);
  return `<div class="attend-stats">
    <div class="attend-pill"><b>${s.onTime}</b><span>On time</span></div>
    <div class="attend-pill"><b>${s.late}</b><span>Arrived late</span></div>
    <div class="attend-pill"><b>${s.leftEarly}</b><span>Left early</span></div>
    <div class="attend-pill"><b>${s.absent}</b><span>Absent</span></div>
    <div class="attend-pill"><b>${s.excused}</b><span>Excused</span></div>
  </div>`;
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
openLessonDrawer = function (id) {
  const mod = state.modules.find(m => m.id === id);
  if (!mod) return;
  activeLessonId = id;
  const prof = state.mentors.find(m => m.id === mod.mentorId) || {};
  const done = mod.watched;
  const mid = mod.modules.filter(m => m.term === 'Midterm');
  const fin = mod.modules.filter(m => m.term === 'Finals');
  const classmates = classmatesFor(mod);
  const html = `
    <img class="subject-hero" src="${subjectArt(mod, 640, 300)}" alt="${esc(mod.category)}">
    <span class="type-pill">${esc(mod.category)}</span>
    <h2 class="subject-title">[${esc(mod.code)}] ${esc(mod.title)}</h2>
    <div class="subject-info">
      <div><span class="si-label">Professor</span><button type="button" class="si-value si-link" data-open-mentor-contact>${esc(prof.name || 'TBA')}</button></div>
      <div><span class="si-label">Class ID / Section</span><span class="si-value">${esc(mod.lmsCode)} - ${esc(mod.section)}</span></div>
      <div><span class="si-label">Units</span><span class="si-value">${mod.units.toFixed(2)}</span></div>
      <div><span class="si-label">Schedule</span><span class="si-value">${mod.meetings.map(meetingLabel).map(esc).join('<br>')}</span></div>
    </div>
    <div class="subject-actions">
      <button class="ghost-btn" data-panel="class">${iconSVG('users')} View class</button>
      <button class="ghost-btn" data-panel="syllabus">${iconSVG('file')} Subject syllabus</button>
      <button class="ghost-btn" data-panel="assessment">${iconSVG('file')} Assessment</button>
      <button class="ghost-btn" data-panel="attendance">${iconSVG('calendar')} Attendance</button>
    </div>
    <div class="subject-panel" id="panel-class" hidden>
      <h3>Classmates <span class="count-pill">${classmates.length}</span></h3>
      <div class="people-grid">${classmates.map(n => `
        <div class="person-card"><div class="avatar" style="${avatarStyle(n)}">${esc(initials(n))}</div>
        <div><div class="person-name">${esc(n)}</div></div></div>`).join('')}</div>
    </div>
    <div class="subject-panel" id="panel-syllabus" hidden>
      <h3>Subject syllabus</h3>
      <p>${esc(mod.category)} (${mod.kind.toLowerCase()}), ${mod.units.toFixed(2)} units, ${PROGRAM.term}. Runs ten modules - five before the midterm exam, five before the finals - each with an enabling assessment and a graded output.</p>
      <a class="ghost-btn syl-pdf-link" id="syllabus-pdf-link" href="#" download="${esc(mod.code)}-syllabus.pdf">${iconSVG('file')} Download full syllabus (PDF)</a>
    </div>
    <div class="subject-panel" id="panel-assessment" hidden>
      <h3>Assessment</h3>
      ${renderAssessmentPanelHTML(mod)}
    </div>
    <div class="subject-panel" id="panel-attendance" hidden>
      <h3>Attendance</h3>
      ${renderAttendancePanelHTML(mod)}
    </div>
    <div class="modules-head">
      <h3>Modules</h3>
      <span class="modules-progress">${done} of ${mod.total} completed</span>
    </div>
    <h4 class="term-head">Midterm</h4>
    ${mid.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}
    <h4 class="term-head">Finals</h4>
    ${fin.map(m => moduleRowHTML(mod, m, m.n <= done)).join('')}`;
  const box = document.getElementById('subject-detail');
  box.innerHTML = html;

  box.querySelectorAll('[data-panel]').forEach(btn => btn.addEventListener('click', () => {
    const target = document.getElementById('panel-' + btn.dataset.panel);
    const wasOpen = !target.hidden;
    box.querySelectorAll('.subject-panel').forEach(p => { p.hidden = true; });
    target.hidden = wasOpen;
  }));
  const pdfLink = box.querySelector('#syllabus-pdf-link');
  pdfLink.addEventListener('click', (e) => {
    e.preventDefault();
    const url = buildSyllabusPDF(mod);
    const a = document.createElement('a');
    a.href = url; a.download = `${mod.code}-syllabus.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
  const contactBtn = box.querySelector('[data-open-mentor-contact]');
  if (contactBtn) contactBtn.addEventListener('click', () => openMentorContact(mod.mentorId, mod));
  document.getElementById('lesson-drawer').scrollTop = 0;
  document.getElementById('drawer-backdrop').hidden = false;
};

ICON_PATHS.lock = '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>';

const STUDENT_POOL = [
  'Paolo Miguel Osabel', 'Maria Clara Reyes', 'Andrei Salcedo', 'Bianca Trinidad', 'Joshua Mendoza',
  'Trisha Mae Aquino', 'Rafael Dominguez', 'Kyla Bernardo', 'Mark Anthony Sison', 'Dominique Ferrer',
  'Jerome Villaruel', 'Angelica Pascual', 'Neil Patrick Uy', 'Camille Estrella', 'Francis Ocampo',
  'Lara Jimenez', 'Ronald Castañeda', 'Patricia Gomez', 'Jeric Alonzo', 'Shaira Nicolas',
  'Vincent Delos Santos', 'Erika Mae Santos', 'Julius Ramirez', 'Denise Corpuz', 'Aaron Villafuerte',
  'Michelle Tan', 'Christian Buenaventura', 'Nicole Reyes', 'Gabriel Lopez', 'Faith Navarro',
  'Timothy Cruz', 'Samantha Valdez'
];
function seededShuffle(arr, seed) {
  const out = arr.slice();
  let s = seed >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function classmatesFor(mod) {
  const h = pseudoHash(mod.id);
  const count = 12 + (h % (STUDENT_POOL.length - 12));
  return seededShuffle(STUDENT_POOL, h).slice(0, count);
}

const PATCH7_VERSION = 'p7-v1';
(function reseedAssessments() {
  if (store.get('lms_patch7_version', '') !== PATCH7_VERSION) {
    state.assessments = buildAssessments();
    store.set('lms_patch7_version', PATCH7_VERSION);
    persistAssessments();
  }
})();

const GRADE_SCALE = [
  [4.00, 98, 98], [3.75, 95, 95], [3.50, 92, 92], [3.25, 89, 89], [3.00, 86, 86],
  [2.75, 83, 83], [2.50, 80, 80], [2.25, 77, 77], [2.00, 74, 74], [1.75, 71, 71],
  [1.50, 68, 68], [1.25, 64, 64], [1.00, 60, 60], [0.00, 0, 59]
];
function gradingBasisHTML() {
  const rows = GRADE_SCALE.map(([g, min, letter]) => `<tr><td>${g.toFixed(2)}</td><td>${min}</td><td>${letter}</td></tr>`).join('');
  return `<div class="grading-basis-wrap">
    <table class="grading-basis-table">
      <thead><tr><th>Grade</th><th>Minimum%</th><th>Letter%</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <span class="grading-basis-cap">Your grading basis</span>
  </div>`;
}

function renderLeaderboard() {
  const anchor = document.getElementById('awards-grid');
  if (!anchor) return;
  let panel = document.getElementById('leaderboard-panel');
  if (!panel) {
    const col = anchor.closest('.panel').parentElement;
    col.insertAdjacentHTML('beforeend', `
      <div class="panel" id="leaderboard-panel">
        <div class="section-head"><h3>Leaderboard <span class="count-pill" id="leaderboard-count">5</span></h3></div>
        <span class="leaderboard-note">Points come from your overall XP - submitting earlier in a deadline earns more than submitting on the day it's due.</span>
        <div id="leaderboard-list"></div>
      </div>`);
    panel = document.getElementById('leaderboard-panel');
  }
  const g = state.gamification;
  const mePoints = g.xp + g.level * 200;
  const rows = STUDENT_POOL.map(n => ({ name: n, points: 800 + (pseudoHash(n) % 4200) }));
  rows.push({ name: state.userProfile.name || 'You', points: mePoints, me: true });
  rows.sort((a, b) => b.points - a.points);
  const top5 = rows.slice(0, 5);
  document.getElementById('leaderboard-list').innerHTML = top5.map((r, i) => `
    <div class="leaderboard-row ${r.me ? 'me' : ''}">
      <span class="lb-rank">#${i + 1}</span>
      <div class="avatar sm" style="${avatarStyle(r.name)}">${esc(initials(r.name))}</div>
      <span class="lb-name">${esc(r.name)}${r.me ? ' (You)' : ''}</span>
      <span class="lb-points">${r.points.toLocaleString()} pts</span>
    </div>`).join('');
}
const _priorRenderProfilePage = renderProfilePage;
renderProfilePage = function () { _priorRenderProfilePage(); renderLeaderboard(); };

if (state.navActive === 'task') { renderCalendar(); renderTasks(); }
if (state.navActive === 'profile') renderProfilePage();
