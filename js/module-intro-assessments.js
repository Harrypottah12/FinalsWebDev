const CWQ_ID = 'quiz-cw-m1';
const CWQ_DUE = '2026-10-07';
const CWQ_MINUTES = 10;
const CWQ_KEY = 'lms_cwq_attempts';
const CWQ_RUN_KEY = 'lms_cwq_run';

const CWQ_BANK = [
  ['Globalization is best understood as a process of growing interconnection and interdependence, not a single event.', true, 'Scholars treat globalization as an ongoing process that connects people, places, and institutions.'],
  ['Manfred Steger describes globalization as the expansion and intensification of social relations across world-time and world-space.', true, 'This is Steger\'s widely used definition.'],
  ['Globalization is exactly the same thing as Westernization.', false, 'Flows run in many directions: K-pop from Korea, Filipino workers abroad, and Chinese-made goods are all part of it.'],
  ['The flows usually associated with globalization include goods, money, people, information, and ideas.', true, 'These five flows are the usual way to describe what moves across borders.'],
  ['Globalization has only an economic dimension.', false, 'It also has political, cultural, technological, and environmental dimensions that overlap.'],
  ['Political globalization includes the growing role of bodies like the United Nations and the WTO in decisions once made only by states.', true, 'Rules increasingly come from institutions beyond the state.'],
  ['Climate change and pandemics are examples of risks that ignore national borders.', true, 'COVID-19 spread worldwide within weeks, showing how shared our risks are.'],
  ['Globalization will inevitably make all cultures identical.', false, 'Scholars debate this; many see new blends and hybrid cultures rather than sameness.'],
  ['The Silk Road and Indian Ocean trade show that long-distance connections existed for centuries.', true, 'Asia, Africa, and Europe were linked long before modern times.'],
  ['The Manila-Acapulco galleon trade (1565-1815) carried Mexican silver to Manila in exchange for Chinese goods.', true, 'It is a key Philippine example of early global trade.'],
  ['The first wave of globalization (about 1870-1914) was driven by steamships, the telegraph, and mass migration.', true, 'New transport and communication technology shrank distances.'],
  ['The first wave of globalization continued without interruption through the two World Wars.', false, 'World War I and the Great Depression brought it to an end.'],
  ['A second wave of globalization began after 1945 with new institutions and freer trade.', true, 'Postwar institutions and trade rules opened a new phase.'],
  ['Whether globalization is "new" depends partly on how one defines it.', true, 'If it means any long-distance link it is old; if it means dense, instant interdependence it is mostly recent.'],
  ['Today\'s speed and density of global connections are about the same as in the 1800s.', false, 'Instant communication and around-the-clock finance make today\'s intensity of a different order.'],
  ['Time-space compression means technology makes distance matter less.', true, 'A video call across the world takes seconds.'],
  ['In globalization, cultural and economic flows only move from the West to the rest of the world.', false, 'Flows are multi-directional.'],
  ['Remittances from Overseas Filipino Workers show how individuals are tied into global flows.', true, 'Workers abroad connect families, labor markets, and economies across countries.'],
  ['Globalization affects only governments and corporations, not ordinary individuals.', false, 'A call-center job, a streamed drama, or a phone in your pocket all involve global links.'],
  ['The benefits of globalization are always shared equally by everyone.', false, 'Who benefits and who is left behind is a central question in the debate.']
];

const cwqAttempts = () => { const a = store.get(CWQ_KEY, []); return Array.isArray(a) ? a : []; };
const cwqBest = () => cwqAttempts().reduce((m, x) => Math.max(m, x.score), 0);
const cwqLate = () => new Date() > new Date(CWQ_DUE + 'T23:59:59');
const cwqFmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function cwqShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function cwqSubject() { return (state.modules || []).find(m => m.category === 'The Contemporary World'); }

(function cwqRemove() {
  if (Array.isArray(state.assessments)) {
    state.assessments = state.assessments.filter(x => x.id !== CWQ_ID && !x.quiz);
    persistAssessments();
  }
  store.set(CWQ_KEY, []); store.set(CWQ_RUN_KEY, null);
})();

const _assessScore26 = assessScoreV8;
assessScoreV8 = function (a) { return a && a.quiz ? cwqBest() : _assessScore26(a); };
const _assessStart26 = assessStart;
assessStart = function (a) { return a && a.start ? a.start : _assessStart26(a); };

function cwqFor(mod, m) {
  return (state.assessments || []).filter(a => a.subjectId === mod.id && a.moduleN === m.n)
    .sort((x, y) => (y.quiz ? 1 : 0) - (x.quiz ? 1 : 0) || x.date.localeCompare(y.date));
}

let cwqRun = store.get(CWQ_RUN_KEY, null), cwqTick = null;
function cwqSaveRun() { store.set(CWQ_RUN_KEY, cwqRun); }
function cwqStart() {
  const order = cwqShuffle(CWQ_BANK.map((_, i) => i));
  cwqRun = { order, answers: {}, idx: 0, endsAt: Date.now() + CWQ_MINUTES * 60000, practice: cwqLate() };
  cwqSaveRun(); cwqStartTimer();
}
function cwqStartTimer() {
  clearInterval(cwqTick);
  cwqTick = setInterval(() => {
    if (!cwqRun) return clearInterval(cwqTick);
    const left = Math.max(0, Math.round((cwqRun.endsAt - Date.now()) / 1000));
    const el = document.getElementById('cwq-timer');
    if (el) { el.textContent = cwqFmt(left); el.classList.toggle('low', left <= 60); }
    if (left <= 0) cwqSubmit(true);
  }, 500);
}
function cwqSubmit(timedOut) {
  if (!cwqRun) return;
  const run = cwqRun; cwqRun = null; clearInterval(cwqTick); store.set(CWQ_RUN_KEY, null);
  let score = 0;
  run.order.forEach(qi => { if (run.answers[qi] === CWQ_BANK[qi][1]) score++; });
  const used = Math.min(CWQ_MINUTES * 60, Math.round((Date.now() - (run.endsAt - CWQ_MINUTES * 60000)) / 1000));
  const attempt = { ts: Date.now(), score, total: CWQ_BANK.length, secs: used, answers: run.answers, order: run.order, timedOut: !!timedOut, practice: !!run.practice };
  if (!run.practice) {
    const list = cwqAttempts(); list.push(attempt); store.set(CWQ_KEY, list);
    const a = state.assessments.find(x => x.id === CWQ_ID);
    if (a) {
      const first = !a.done; a.done = true; persistAssessments();
      if (typeof renderAssessments === 'function') renderAssessments();
      if (state.navActive === 'task' && typeof renderCalendar === 'function') renderCalendar();
      if (first && typeof awardXP === 'function') awardXP(XP_TASK, 'submitting an assessment');
    }
  }
  cwqLast = attempt;
  if (typeof toast === 'function') toast(timedOut ? "Time's up - quiz submitted" : 'Quiz submitted');
  if (cwView && cwView.asCurrent === CWQ_ID) { cwView.asMode = 'result'; cwRender(); }
}
let cwqLast = null;
if (cwqRun) {
  if (Date.now() >= cwqRun.endsAt) cwqSubmit(true); else cwqStartTimer();
}

function cwqStatusText(a) {
  if (a.quiz) return cwqAttempts().length ? `Best ${cwqBest()}/${a.max}` : (cwqLate() ? 'Past due' : 'Not taken');
  return a.done ? 'Submitted' : 'Pending';
}
function cwqInfoGrid(rows) {
  return `<div class="cwq-grid">${rows.map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`;
}
function cwqIntro(a) {
  const at = cwqAttempts(), late = cwqLate();
  const inRun = cwqRun && Date.now() < cwqRun.endsAt;
  return `<article class="cw-article cwq">
    <div class="cw-crumb">Module 1: ${esc(a.moduleTitle)}</div>
    <h2>${esc(a.title)}</h2>
    <p class="cwq-lead">Twenty statements about Module 1. Decide whether each one is true or false. You can retake the quiz as many times as you like and your best score counts.</p>
    ${cwqInfoGrid([['Items', a.max], ['Time limit', CWQ_MINUTES + ' min'], ['Due', formatTaskDate(a.date)], ['Your best', at.length ? cwqBest() + '/' + a.max : '-']])}
    ${late ? '<p class="cwq-note">The deadline has passed. You can still practice, but the score will not be recorded.</p>' : ''}
    <div class="cwq-actions"><button type="button" class="primary-btn" data-cwq-start>${inRun ? 'Resume quiz' : at.length ? 'Retake quiz' : 'Start quiz'}</button></div>
    ${at.length ? `<h3 class="cw-h3">Attempts</h3><ul class="cwq-attempts">${at.slice().reverse().map((x, i) => `<li><span>Attempt ${at.length - i}</span><span>${new Date(x.ts).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span><b>${x.score}/${x.total}</b></li>`).join('')}</ul>` : ''}
  </article>`;
}
function cwqRunView() {
  const r = cwqRun, n = r.order.length, qi = r.order[r.idx], ans = r.answers[qi];
  const left = Math.max(0, Math.round((r.endsAt - Date.now()) / 1000));
  const answered = Object.keys(r.answers).length;
  return `<article class="cw-article cwq">
    <div class="cwq-bar"><span>Question ${r.idx + 1} of ${n}${r.practice ? ' &middot; practice' : ''}</span><span class="cwq-timer ${left <= 60 ? 'low' : ''}" id="cwq-timer">${cwqFmt(left)}</span></div>
    <div class="cwq-dots">${r.order.map((q, i) => `<button type="button" class="${i === r.idx ? 'cur' : ''} ${r.answers[q] !== undefined ? 'ans' : ''}" data-cwq-jump="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`).join('')}</div>
    <p class="cwq-q">${esc(CWQ_BANK[qi][0])}</p>
    <div class="cwq-choices">
      <button type="button" class="cwq-choice ${ans === true ? 'sel' : ''}" data-cwq-ans="true"><i>T</i>True</button>
      <button type="button" class="cwq-choice ${ans === false ? 'sel' : ''}" data-cwq-ans="false"><i>F</i>False</button>
    </div>
    <div class="cw-nav">
      <button type="button" class="ghost-btn" data-cwq-prev ${r.idx === 0 ? 'disabled' : ''}>${iconSVG('chevronLeft')} Previous</button>
      ${r.idx < n - 1
        ? `<button type="button" class="primary-btn" data-cwq-next>Next</button>`
        : `<button type="button" class="primary-btn" data-cwq-submit>Submit (${answered}/${n})</button>`}
    </div>
    <p class="cwq-hint">Keys: T = true, F = false, arrows to move.</p>
  </article>`;
}
function cwqResult(a) {
  const x = cwqLast || cwqAttempts().slice(-1)[0]; if (!x) return cwqIntro(a);
  const pct = Math.round(x.score / x.total * 100);
  return `<article class="cw-article cwq">
    <div class="cw-crumb">Module 1: ${esc(a.moduleTitle)}</div>
    <h2>${esc(a.title)}</h2>
    <div class="cwq-score"><b>${x.score}<small>/${x.total}</small></b><span>${pct}%${x.timedOut ? ' &middot; time ran out' : ''}${x.practice ? ' &middot; practice, not recorded' : ''}</span><em>Time used ${cwqFmt(x.secs)}</em></div>
    <div class="cwq-actions">
      <button type="button" class="primary-btn" data-cwq-start>Retake quiz</button>
      <button type="button" class="ghost-btn" data-cwq-back>Quiz details</button>
    </div>
    <h3 class="cw-h3">Review</h3>
    <ol class="cwq-review">${x.order.map(qi => {
      const q = CWQ_BANK[qi], yours = x.answers[qi], ok = yours === q[1];
      return `<li class="${yours === undefined ? 'skip' : ok ? 'ok' : 'no'}"><p>${esc(q[0])}</p>
        <div class="cwq-rv"><span>Your answer: <b>${yours === undefined ? 'No answer' : yours ? 'True' : 'False'}</b></span><span>Correct: <b>${q[1] ? 'True' : 'False'}</b></span></div>
        <small>${esc(q[2])}</small></li>`;
    }).join('')}</ol>
  </article>`;
}
function cwqPlain(a) {
  const isOnline = /online/i.test(a.title), isPart = /participation/i.test(a.title);
  return `<article class="cw-article cwq">
    <div class="cw-crumb">Module ${a.moduleN}: ${esc(a.moduleTitle)}</div>
    <h2>${esc(a.title)}</h2>
    <p class="cwq-lead">${isPart ? 'Graded on your participation in class discussion for this module.' : isOnline ? 'Complete this assessment online before the deadline.' : 'Taken onsite during class. Your professor records the score.'}</p>
    ${cwqInfoGrid([['Points', a.max], ['Starts', formatTaskDate(assessStart(a))], ['Due', formatTaskDate(a.date)], ['Status', cwqStatusText(a)]])}
  </article>`;
}
function cwqMain(v) {
  const a = state.assessments.find(x => x.id === v.asCurrent); if (!a) return null;
  if (!a.quiz) return cwqPlain(a);
  if (cwqRun && v.asMode === 'run') return cwqRunView();
  if (v.asMode === 'result') return cwqResult(a);
  return cwqIntro(a);
}

const _cwRender26 = cwRender;
cwRender = function () {
  _cwRender26();
  const v = cwView; if (!v) return;
  const items = cwqFor(v.mod, v.m);
  const ul = document.querySelector('.cw-side ul');
  if (ul && items.length) {
    ul.insertAdjacentHTML('beforeend', `<li class="cw-glabel"></li><li class="cw-gtitle">Assessments</li>` + items.map(a => {
      const done = a.quiz ? cwqAttempts().length > 0 : !!a.done;
      return `<li><button type="button" class="cw-item cwq-item ${done ? 'done' : ''} ${v.asCurrent === a.id ? 'current' : ''}" data-cwq-open="${a.id}">
        <span class="cw-tick">${done ? iconSVG('check') : iconSVG('clock')}</span>
        <span>${esc(a.title)}<em class="cwq-due">Due ${formatTaskDate(a.date)}</em></span></button></li>`;
    }).join(''));
  }
  if (v.asCurrent) {
    ul && ul.querySelectorAll('.cw-item.current:not(.cwq-item)').forEach(b => b.classList.remove('current'));
    const html = cwqMain(v), main = document.querySelector('.cw-main');
    if (html && main) main.innerHTML = html;
  }
};
const _cwGo26 = cwGo;
cwGo = function (id) { if (cwView) { cwView.asCurrent = null; cwView.asMode = null; } _cwGo26(id); };

document.addEventListener('click', (e) => {
  if (!cwView) return;
  const t = e.target;
  const open = t.closest('[data-cwq-open]');
  if (open) {
    cwView.asCurrent = open.dataset.cwqOpen;
    cwView.asMode = (cwqRun && Date.now() < cwqRun.endsAt && cwView.asCurrent === CWQ_ID) ? 'run' : null;
    cwView.finished = false; cwRender();
    const mn = document.querySelector('.cw-main'); if (mn) mn.scrollTop = 0;
    return;
  }
  if (!cwView.asCurrent) return;
  const redraw = () => { cwRender(); };
  if (t.closest('[data-cwq-start]')) { if (!(cwqRun && Date.now() < cwqRun.endsAt)) cwqStart(); cwView.asMode = 'run'; return redraw(); }
  if (t.closest('[data-cwq-back]')) { cwView.asMode = null; return redraw(); }
  if (!cwqRun) return;
  const ans = t.closest('[data-cwq-ans]');
  if (ans) { cwqRun.answers[cwqRun.order[cwqRun.idx]] = ans.dataset.cwqAns === 'true'; cwqSaveRun(); return redraw(); }
  const jump = t.closest('[data-cwq-jump]');
  if (jump) { cwqRun.idx = Number(jump.dataset.cwqJump); cwqSaveRun(); return redraw(); }
  if (t.closest('[data-cwq-prev]')) { cwqRun.idx = Math.max(0, cwqRun.idx - 1); cwqSaveRun(); return redraw(); }
  if (t.closest('[data-cwq-next]')) { cwqRun.idx = Math.min(cwqRun.order.length - 1, cwqRun.idx + 1); cwqSaveRun(); return redraw(); }
  if (t.closest('[data-cwq-submit]')) {
    const left = cwqRun.order.length - Object.keys(cwqRun.answers).length;
    if (left && !confirm(`${left} question${left === 1 ? ' is' : 's are'} unanswered. Submit anyway?`)) return;
    cwqSubmit(false);
  }
}, true);

document.addEventListener('keydown', (e) => {
  if (!cwView || cwView.asCurrent !== CWQ_ID || cwView.asMode !== 'run' || !cwqRun) return;
  if (e.target.matches && e.target.matches('input,textarea,select')) return;
  const k = e.key.toLowerCase(), q = cwqRun.order[cwqRun.idx];
  if (k === 't' || k === 'f') { cwqRun.answers[q] = k === 't'; cwqSaveRun(); cwRender(); }
  else if (e.key === 'ArrowRight' && cwqRun.idx < cwqRun.order.length - 1) { cwqRun.idx++; cwqSaveRun(); cwRender(); }
  else if (e.key === 'ArrowLeft' && cwqRun.idx > 0) { cwqRun.idx--; cwqSaveRun(); cwRender(); }
});

if (typeof renderAssessments === 'function') renderAssessments();
if (cwView) cwRender();
renderIcons();

const CWI = {
  1: { tag: 'How the world became connected',
       about: 'This module asks what globalization really is, where it shows up in daily life, and whether it is truly new. You will meet its main dimensions and learn how it touches you as an individual.',
       photo: ['Globalization', 'Container_ship'] },
  2: { tag: 'The systems that hold it together',
       about: 'Globalization runs on structures: a global economy, political institutions, cultural exchange, and technology networks. This module shows how they are built and how they work together.',
       photo: ['__local_m2'] },
  3: { tag: 'Trade, money, and a flatter world',
       about: 'From the fall of the Berlin Wall to the IT revolution, this module follows how markets became integrated, and who gains or loses under neoliberal economic globalization.',
       photo: ['Economic_globalization', 'Container_ship'] },
  4: { tag: 'States, borders, and power',
       about: 'How does the state fit into a global age? You will study the interstate system, Westphalian sovereignty, nation-states, and how global powers use hegemony.',
       photo: ['Peace_of_Westphalia', 'Westphalian_sovereignty'] },
  5: { tag: 'Who governs the world?',
       about: 'This module looks at global governance: the United Nations, regional organizations, and civil society, and the challenges of governing problems that cross borders.',
       photo: ['United_Nations_Headquarters', 'Global_governance'] }
};

let cwiPanel = null, cwiFor = null, cwiTimer = null;
function cwiEnsure() {
  if (cwiPanel) return cwiPanel;
  cwiPanel = document.createElement('aside');
  cwiPanel.className = 'cwi-panel'; cwiPanel.hidden = true; cwiPanel.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cwiPanel);
  return cwiPanel;
}
function cwiHTML(mod, m) {
  const c = CW_CONTENT[m.n], i = CWI[m.n] || {};
  const aids = [[(typeof CW_SLIDES !== 'undefined' && CW_SLIDES[m.n] ? CW_SLIDES[m.n].length : 0), 'Lesson slides'], [c.videos.length, 'Videos'], [1, 'Reviewer PDF']];
  const items = (typeof cwqFor === 'function') ? cwqFor(mod, m) : [];
  return `<div class="cwi-inner">
    <figure class="cw-photo cwi-photo" data-wiki="${(i.photo || ['Globalization']).join('|')}"><div class="cwi-ph" style="background-image:url('${subjectArt(mod, 640, 300)}')"></div></figure>
    <span class="cwi-kicker">Module ${m.n} &middot; ${m.term}</span>
    <h3>${esc(m.title)}</h3>
    <em class="cwi-tag">${esc(i.tag || '')}</em>
    <p>${esc(i.about || m.desc)}</p>
    <h4>You will learn</h4>
    <ul>${c.lessons.slice(0, 5).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <div class="cwi-stats">${aids.map(a => `<div><b>${a[0]}</b><span>${a[1]}</span></div>`).join('')}${items.length ? `<div><b>${items.length}</b><span>Assessment${items.length > 1 ? 's' : ''}</span></div>` : ''}</div>
  </div>`;
}
function cwiShow(row) {
  const drawer = document.getElementById('lesson-drawer'), bd = document.getElementById('drawer-backdrop');
  if (!drawer || !bd || bd.hidden) return;
  const dl = drawer.getBoundingClientRect().left;
  if (dl < 360) return;
  const mod = state.modules.find(x => x.id === row.dataset.openModule);
  const m = mod && mod.modules.find(x => x.n === Number(row.dataset.modN));
  if (!m) return;
  const key = mod.id + ':' + m.n, p = cwiEnsure(), wasOpen = !p.hidden && p.classList.contains('show');
  const w = Math.min(540, dl - 40);
  p.style.width = w + 'px'; p.style.left = Math.max(12, dl - w - 14) + 'px';
  if (cwiFor !== key) { p.innerHTML = cwiHTML(mod, m); cwiFor = key; renderIcons(p); cwHydrate(p); }
  if (!wasOpen) { p.style.transition = 'none'; p.hidden = false; p.classList.remove('show'); }
  else p.hidden = false;
  cwiPlace(p, row, !wasOpen);
}

function cwiPlace(p, row, fresh) {
  const r = row.getBoundingClientRect(), vh = window.innerHeight, h = p.offsetHeight;
  const mid = r.top + r.height / 2;
  const top = Math.max(12, Math.min(mid - h / 2, vh - h - 12));
  const notch = Math.max(26, Math.min(h - 26, mid - top));
  p.style.setProperty('--notch', notch + 'px');
  p.style.transformOrigin = `100% ${notch}px`;
  if (fresh) {
    p.style.top = top + 'px'; void p.offsetWidth; p.style.transition = '';
    requestAnimationFrame(() => p.classList.add('show'));
  } else p.style.top = top + 'px';
}

document.addEventListener('scroll', (e) => { if (e.target && e.target.id === 'lesson-drawer') cwiHide(); }, true);
function cwiHide() {
  clearTimeout(cwiTimer);
  if (!cwiPanel) return;
  cwiPanel.classList.remove('show'); cwiPanel.hidden = true; cwiFor = null;
}
document.addEventListener('mouseover', (e) => {
  if (typeof cwView !== 'undefined' && cwView) return;
  const row = e.target.closest && e.target.closest('.mod-row[data-open-module]');
  clearTimeout(cwiTimer);
  if (row) cwiTimer = setTimeout(() => cwiShow(row), 90);
  else if (cwiPanel && !cwiPanel.hidden) cwiTimer = setTimeout(cwiHide, 120);
});
document.addEventListener('mouseleave', cwiHide);
document.addEventListener('click', (e) => { if (e.target.closest('[data-open-module]') || e.target.closest('#drawer-close') || e.target.id === 'drawer-backdrop') cwiHide(); }, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cwiHide(); });

const _cwHydrate27 = cwHydrate;
cwHydrate = async function (root) {
  const scope = root && root.querySelectorAll ? root : document;
  for (const fig of scope.querySelectorAll('.cw-photo[data-wiki]')) {
    const list = fig.dataset.wiki.split('|'); fig.removeAttribute('data-wiki');
    let done = false;
    for (const t of list) {
      const im = await cwWikiImg(t); if (!im) continue;
      const ok = await new Promise(res => { const p = new Image(); p.onload = () => res(im.src); p.onerror = () => { const q = new Image(); q.onload = () => res(im.thumb); q.onerror = () => res(null); q.src = im.thumb; }; p.src = im.src; });
      if (!ok) continue;
      fig.innerHTML = `<img src="${ok}" alt="${esc(im.name)}"><figcaption>Photo: ${esc(im.name)} - <a href="${im.page}" target="_blank" rel="noopener">Wikipedia / Wikimedia Commons</a></figcaption>`;
      done = true; break;
    }
    if (!done && !fig.classList.contains('cwi-photo') && !fig.classList.contains('cwi-banner')) fig.remove();
  }
};

cwStartScreen = function (v) {
  const { mod, m } = v, c = CW_CONTENT[m.n], i = CWI[m.n] || {};
  const aids = cwAidsData(m);
  const items = (typeof cwqFor === 'function') ? cwqFor(mod, m) : [];
  return `<div class="cw-start cwi-intro">
    <figure class="cw-photo cwi-banner" data-wiki="${(i.photo || ['Globalization']).join('|')}"><div class="cwi-ph" style="background-image:url('${subjectArt(mod, 900, 360)}')"></div></figure>
    <span class="cw-kicker">Introduction &middot; Module ${m.n}</span>
    <h1>${esc(m.title)}</h1>
    <p class="cwi-tagline">${esc(i.tag || '')}</p>
    <p>${esc(i.about || m.desc)}</p>
    <h3>What you will learn</h3>
    <ul class="cwi-learn">${c.lessons.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <h3>Before you start - visual aids for this module</h3>
    <div class="cw-aid-cards">${aids.map(g => `<button type="button" class="cw-aid-card" data-cw-aids><span class="cw-aid-ic">${iconSVG(g.icon)}</span><b>${g.items.length}</b><span>${g.name}</span></button>`).join('')}</div>
    ${items.length ? `<p class="cwi-note">${items.length} assessment${items.length > 1 ? 's' : ''} in this module, listed at the bottom of the contents.</p>` : ''}
    <div class="cw-start-actions">
      <button type="button" class="ghost-btn" data-cw-aids>${iconSVG('layers')} View learning aids</button>
      <button type="button" class="primary-btn" data-cw-start>${v.done.size ? 'Next: continue module' : 'Next'} ${iconSVG('chevronRight')}</button>
    </div>
  </div>`;
};
if (typeof cwView !== 'undefined' && cwView) cwRender();
renderIcons();

cwAidsData = function (m) {
  const md = CW_MEDIA[m.n], s = CW_SLIDES[m.n] || [];
  return [{ key: 'slides', icon: 'layers', name: 'Lesson slides', items: s.map(x => [x.title, 'PDF']) },
          { key: 'vid', icon: 'play', name: 'Videos to watch', items: md.videos },
          { key: 'pdf', icon: 'file', name: 'PDFs', items: md.pdfs }];
};
cwAidsPanelHTML = function (m) {
  const md = CW_MEDIA[m.n], s = CW_SLIDES[m.n] || [];
  const vids = md.videos.map(v => `<details class="cw-dd"><summary>${iconSVG('play')}<span>${esc(v[0])}</span></summary>
      <div class="cw-embed"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${v[1]}" title="${esc(v[0])}" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>
      <a class="cw-ext" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${v[1]}">Watch on YouTube</a></details>`).join('');
  const pdfs = md.pdfs.map(p => `<details class="cw-dd"><summary>${iconSVG('file')}<span>${esc(p[0])}</span><em>PDF</em></summary>
      ${p[2] ? `<div class="cw-embed pdf"><iframe loading="lazy" src="${p[1]}" title="${esc(p[0])}"></iframe></div>` : ''}
      <a class="cw-ext" target="_blank" rel="noopener" href="${p[1]}">${p[2] ? 'Open in new tab' : 'Open PDF'}</a></details>`).join('');
  const slides = s.map(x => `<details class="cw-dd"><summary>${iconSVG('layers')}<span>${esc(x.title)}</span><em>PDF</em></summary>${cwSlidesEmbed(x)}</details>`).join('');
  return `<div class="cw-aid-group"><div class="cw-aid-head"><span class="cw-aid-ic">${iconSVG('layers')}</span><b>Lesson slides</b><span class="cw-aid-count">${s.length}</span></div>
      ${slides || '<p class="cw-aids-note">No lesson slides for this module yet.</p>'}</div>
    <div class="cw-aid-group"><div class="cw-aid-head"><span class="cw-aid-ic">${iconSVG('play')}</span><b>Videos</b><span class="cw-aid-count">${md.videos.length}</span></div>${vids}</div>
    <div class="cw-aid-group"><div class="cw-aid-head"><span class="cw-aid-ic">${iconSVG('file')}</span><b>PDF</b><span class="cw-aid-count">${md.pdfs.length}</span></div>${pdfs}</div>`;
};

const CWI_M2_ART = (function () {
  const nodes = [['Economy', 150, 92], ['Politics', 750, 92], ['Culture', 150, 268], ['Technology', 750, 268]];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#062b2b"/><stop offset="1" stop-color="#0b4f4a"/></linearGradient>
    <radialGradient id="o" cx=".4" cy=".35"><stop offset="0" stop-color="#2dd4bf" stop-opacity=".95"/><stop offset="1" stop-color="#0f766e"/></radialGradient>
  </defs>
  <rect width="900" height="360" fill="url(#g)"/>
  ${nodes.map(n => `<line x1="450" y1="180" x2="${n[1]}" y2="${n[2]}" stroke="#5eead4" stroke-opacity=".55" stroke-width="2" stroke-dasharray="6 6"/>`).join('')}
  <circle cx="450" cy="180" r="92" fill="url(#o)"/>
  <g fill="none" stroke="#ecfeff" stroke-opacity=".6" stroke-width="1.6">
    <ellipse cx="450" cy="180" rx="92" ry="34"/><ellipse cx="450" cy="180" rx="44" ry="92"/><line x1="358" y1="180" x2="542" y2="180"/><line x1="450" y1="88" x2="450" y2="272"/>
  </g>
  ${nodes.map(n => `<g><rect x="${n[1] - 90}" y="${n[2] - 28}" width="180" height="56" rx="28" fill="#0a3f3c" stroke="#5eead4" stroke-width="2"/><circle cx="${n[1] - 62}" cy="${n[2]}" r="9" fill="#5eead4"/><text x="${n[1] - 44}" y="${n[2] + 6}" font-family="Poppins,Arial,sans-serif" font-size="19" font-weight="600" fill="#ecfeff">${n[0]}</text></g>`).join('')}
  <text x="450" y="336" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="16" fill="#99f6e4" letter-spacing="3">STRUCTURES OF GLOBALIZATION</text>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
})();
const _cwHydrate28 = cwHydrate;
cwHydrate = async function (root) {
  const scope = root && root.querySelectorAll ? root : document;
  scope.querySelectorAll('.cw-photo[data-wiki="__local_m2"]').forEach(fig => {
    fig.removeAttribute('data-wiki');
    fig.innerHTML = `<img src="${CWI_M2_ART}" alt="Structures of globalization: economy, politics, culture and technology around a globe">`;
  });
  return _cwHydrate28(root);
};
if (typeof cwiFor !== 'undefined') cwiFor = null;

const _cwSections28 = cwSections;
cwSections = function (m) { return _cwSections28(m).filter(s => s.kind !== 'participation' && s.kind !== 'slides'); };

const CW_SLIDES = {
  1: [{ title: 'Introduction to Globalization', file: 'slides/module1_introduction_to_globalization.pdf' }],
  2: [{ title: 'Political Globalization', file: 'slides/module2_political_globalization.pdf' }],
  3: [{ title: 'Economic Globalization', file: 'slides/module3_economic_globalization.pdf' }],
  4: [],
  5: []
};
function cwSlidesEmbed(s) {
  return `<div class="cw-embed pdf cw-slides-real" data-slide-file="${s.file}"><iframe loading="lazy" src="${s.file}#view=FitH" title="${esc(s.title)}"></iframe></div>
    <a class="cw-ext" target="_blank" rel="noopener" href="${s.file}">Open slides in new tab</a>`;
}

function cwSlidesProbe() {
  document.querySelectorAll('.cw-slides-real:not([data-probed])').forEach(el => {
    el.dataset.probed = '1';
    fetch(el.dataset.slideFile, { method: 'HEAD' }).then(r => {
      if (r.status === 404) el.innerHTML = '<div class="cw-slides-missing">Lesson slides for this module have not been uploaded yet.</div>';
    }).catch(() => {});
  });
}
const _cwRender28 = cwRender;
cwRender = function () { _cwRender28.apply(this, arguments); cwSlidesProbe(); };

const CWA_PLAN = [
  [1, 'cwa-m1-part', 'Class Participation 1', 10, '2026-10-09'],
  [2, 'cwa-m2-online', 'Enabling Assessment (Online) 2', 25, '2026-10-21'],
  [2, 'cwa-m2-part', 'Class Participation 2', 10, '2026-10-23'],
  [3, 'cwa-m3-quiz', 'Long Quiz 1', 30, '2026-11-04'],
  [3, 'cwa-m3-part', 'Class Participation 3', 10, '2026-11-06'],
  [4, 'cwa-m4-onsite', 'Enabling Assessment (Onsite) 2', 50, '2026-11-11'],
  [4, 'cwa-m4-part', 'Class Participation 4', 10, '2026-11-13'],
  [5, 'cwa-m5-quiz', 'Long Quiz 2', 30, '2026-11-18'],
  [5, 'cwa-m5-part', 'Class Participation 5', 10, '2026-11-20']
];
(function cwaRegister() {
  const mod = cwqSubject(); if (!mod || !Array.isArray(state.assessments)) return;
  const today = daysFromToday(0);
  CWA_PLAN.forEach(([n, id, title, max, date]) => {
    const m = (mod.modules || []).find(x => x.n === n); if (!m) return;
    let a = state.assessments.find(x => x.id === id);
    const isNew = !a; if (isNew) { a = { id }; state.assessments.push(a); }
    Object.assign(a, { subjectId: mod.id, code: mod.code, subject: mod.category, title, max, moduleN: n, moduleTitle: m.title, date });
    if (isNew) a.done = date < today;
  });
  persistAssessments();
  if (typeof renderAssessments === 'function') { try { renderAssessments(); } catch (e) {} }
  if (state.navActive === 'task' && typeof renderCalendar === 'function') renderCalendar();
})();

const _cwRender28b = cwRender;
cwRender = function () {
  _cwRender28b.apply(this, arguments);
  const v = cwView; if (!v) return;
  const items = cwqFor(v.mod, v.m);
  document.querySelectorAll('.cwq-item').forEach(btn => {
    const a = items.find(x => x.id === btn.dataset.cwqOpen); if (!a) return;
    const em = btn.querySelector('.cwq-due');
    if (em) em.textContent = `${formatTaskDate(assessStart(a))} - Due ${formatTaskDate(a.date)}`;
  });
};
if (typeof cwView !== 'undefined' && cwView) cwRender();

const _cwiShow28 = cwiShow;
cwiShow = function (row) {
  _cwiShow28(row);
  [250, 700, 1500, 3000].forEach(ms => setTimeout(() => {
    if (cwiPanel && !cwiPanel.hidden && cwiPanel.classList.contains('show') && document.body.contains(row)) cwiPlace(cwiPanel, row, false);
  }, ms));
};

let cwiRowNow = null;
const _cwiShow33 = cwiShow;
cwiShow = function (row) {
  if (row === cwiRowNow && cwiPanel && !cwiPanel.hidden && cwiPanel.classList.contains('show') && document.body.contains(row)) return;
  cwiRowNow = row;
  _cwiShow33(row);
  if (cwiPanel && !cwiPanel._ro && typeof ResizeObserver !== 'undefined') {
    cwiPanel._ro = new ResizeObserver(() => {
      if (!cwiRowNow || cwiPanel.hidden || !document.body.contains(cwiRowNow)) return;
      cwiPlace(cwiPanel, cwiRowNow, false);
    });
    cwiPanel._ro.observe(cwiPanel);
  }
};
const _cwiHide33 = cwiHide;
cwiHide = function () { cwiRowNow = null; _cwiHide33(); };

document.addEventListener('mouseover', (e) => {
  if (typeof cwView !== 'undefined' && cwView) return;
  if (e.target.closest && e.target.closest('.mod-row[data-open-module]')) return;
  if (cwiPanel && !cwiPanel.hidden && e.target.closest && e.target.closest('#lesson-drawer')) {
    clearTimeout(cwiTimer); cwiTimer = setTimeout(cwiHide, 350);
  }
});

const _cwiPlace33 = cwiPlace;
cwiPlace = function (p, row, fresh) {
  if (row !== cwiRowNow) return;
  _cwiPlace33(p, row, fresh);
};

(function cwiPrefetch() {
  if (typeof CWI === 'undefined' || typeof cwWikiImg !== 'function') return;
  setTimeout(async () => {
    for (const k of Object.keys(CWI)) {
      for (const t of (CWI[k].photo || [])) {
        if (t.startsWith('__')) continue;
        try { const im = await cwWikiImg(t); if (im) { const a = new Image(); a.src = im.src; break; } } catch (e) {}
      }
    }
  }, 800);
})();
