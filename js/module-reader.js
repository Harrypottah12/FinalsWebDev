const CW_FAMILY = 'The Contemporary World';

const CW_CONTENT = {
  1: { lessons: ['Globalization Defined', 'Aspects of Globalization', 'Is Globalization a New Phenomenon?', 'Globalization and the Individual'],
       ppts: [['Introduction to Globalization', 32], ['Aspects of Globalization', 24]],
       reviewer: ['Module 1 Reviewer (PDF)', 6], videos: [['What is Globalization?', '12:40'], ['A Brief History of Global Trade', '18:05']],
       readings: ['Steger, Globalization: A Very Short Introduction', 'Held & McGrew, The Global Transformations Reader'] },
  2: { lessons: ['Global Economy', 'Global Politics', 'Global Culture', 'Global Technology'],
       ppts: [['Structures of Globalization', 41]], reviewer: ['Module 2 Reviewer (PDF)', 8],
       videos: [['How the Global Economy Works', '15:22'], ['Culture in a Connected World', '10:48'], ['Technology and Globalization', '14:10']],
       readings: ['Ritzer, The Globalization of Nothing', 'Appadurai, Modernity at Large (Ch. 2)'] },
  3: { lessons: ['Economic Globalization Defined', 'Aspects of Economic Globalization', 'Is Economic Globalization a New Phenomenon?', 'The World is Flat', 'The Fall of the Berlin Wall as a Flattener', 'Revolution in IT as a Flattener', 'Neoliberalism and Economic Globalization', 'Global Economic Institutions', 'Is Economic Globalization a Failure?', 'Impact on the Marginalized Sectors'],
       ppts: [['Market Integration - Part 1', 36], ['Market Integration - Part 2', 30], ['Global Economic Institutions', 22]],
       reviewer: ['Module 3 Reviewer (PDF)', 10], videos: [['The World is Flat (Friedman, excerpt)', '21:30'], ['IMF, World Bank and WTO Explained', '13:15']],
       readings: ['Friedman, The World Is Flat (Ch. 1)', 'Stiglitz, Globalization and Its Discontents'] },
  4: { lessons: ['The Interstate System', 'The Westphalian Order', 'Sovereignty and the State', 'Nation-States and Globalization', 'Global Powers and Hegemony'],
       ppts: [['The Global Interstate System', 38], ['Sovereignty and Statehood', 27]], reviewer: ['Module 4 Reviewer (PDF)', 9],
       videos: [['The Treaty of Westphalia', '9:50'], ['States in a Global Age', '16:20']],
       readings: ['Krasner, Sovereignty: Organized Hypocrisy', 'Wallerstein, World-Systems Analysis'] },
  5: { lessons: ['Global Governance Defined', 'The United Nations', 'Regional Organizations', 'Global Civil Society', 'Governance Challenges Today'],
       ppts: [['Contemporary Global Governance', 34]], reviewer: ['Module 5 Reviewer (PDF)', 7],
       videos: [['How the UN Works', '11:35'], ['Global Governance in Crisis', '17:00']],
       readings: ['Weiss & Wilkinson, Rethinking Global Governance', 'UN Charter (selected articles)'] }
};

function cwIsOpenable(mod, m) {
  return mod.category === CW_FAMILY && m.term === 'Midterm' && !!CW_CONTENT[m.n];
}

function cwSections(m) {
  const c = CW_CONTENT[m.n];
  const s = [
    { id: 'prayer', label: 'Gospel Reading / Reflection / Prayer', kind: 'prayer' },
    { id: 'outcomes', label: 'Learning Outcomes', kind: 'outcomes' },
    { id: 'overview', label: 'Module Overview', kind: 'overview' }
  ];
  c.lessons.forEach((t, i) => s.push({ id: 'l' + i, label: 'Lesson: ' + t, kind: 'lesson', title: t, idx: i }));
  s.push({ id: 'readings', label: 'Suggested Readings', kind: 'readings' });
  s.push({ id: 'refs', label: 'References', kind: 'refs' });
  s.push({ id: 'closing', label: 'End of Module / Closing Prayer', kind: 'closing' });
  s.push({ id: 'participation', label: 'Class Participation ' + m.n, kind: 'participation' });
  s.push({ id: 'slides', label: 'Lesson Slides', kind: 'slides' });
  return s;
}

function moduleRowHTML(mod, m, done) {
  const finals = m.term === 'Finals';
  const open = cwIsOpenable(mod, m);
  const notAvail = !finals && !open;
  const locked = finals;
  const stateLabel = locked ? `Module Locked ${iconSVG('lock')}`
    : notAvail ? 'Not available'
    : (done ? `Completed ${iconSVG('check')}` : 'In progress');
  const cls = locked ? 'is-locked' : notAvail ? 'is-unavailable' : (done ? 'is-done' : '');
  return `<div class="mod-row ${cls} ${open ? 'is-openable' : ''}" ${open ? `data-open-module="${esc(mod.id)}" data-mod-n="${m.n}" role="button" tabindex="0" aria-label="Open module ${m.n}: ${esc(m.title)}"` : ''}>
    <img class="mod-thumb" src="${subjectArt(mod, 160, 110)}" alt="">
    <div class="mod-main">
      <h4>${m.n}. ${esc(m.title)}</h4>
      <p>${esc(m.desc)}</p>
      <div class="mod-foot">
        <span class="mod-state ${locked ? 'locked' : (done ? 'done' : '')}">${stateLabel}</span>
        <span class="mod-sections">${m.sections} sections</span>
        ${open ? `<span class="mod-open-hint">Open module ${iconSVG('chevronRight')}</span>` : ''}
      </div>
    </div>
    <span class="term-pill ${m.term.toLowerCase()}">${m.term}</span>
  </div>`;
}

function cwProgressKey(modId, n) { return `lms_cw_progress_${modId}_${n}`; }
function cwGetProgress(modId, n) {
  const v = store.get(cwProgressKey(modId, n), []);
  return Array.isArray(v) ? v : [];
}
function cwSetProgress(modId, n, arr) { store.set(cwProgressKey(modId, n), arr); }

let cwView = null;

function cwEnsureRoot() {
  let root = document.getElementById('cw-viewer');
  if (root) return root;
  root = document.createElement('div');
  root.id = 'cw-viewer';
  root.className = 'cw-viewer';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  document.body.appendChild(root);
  return root;
}

function cwOpen(modId, n) {
  const mod = state.modules.find(x => x.id === modId);
  if (!mod) return;
  const m = mod.modules.find(x => x.n === Number(n));
  if (!m || !cwIsOpenable(mod, m)) return;
  const sections = cwSections(m);
  const done = new Set(cwGetProgress(modId, m.n));
  cwView = { mod, m, sections, current: null, done, started: done.size > 0, aidsOpen: false, panelOpen: true };
  const root = cwEnsureRoot();
  root.hidden = false;
  document.body.classList.add('cw-lock');
  cwRender();
  const ds = document.getElementById('drawer-backdrop'); if (ds) ds.hidden = true;
}
function cwClose() {
  const root = document.getElementById('cw-viewer');
  if (root) root.hidden = true;
  document.body.classList.remove('cw-lock');
  const v = cwView; cwView = null;
  if (v) {

    openLessonDrawer(v.mod.id);
  }
}

function cwAidsData(m) {
  const c = CW_CONTENT[m.n];
  return [
    { key: 'ppt', icon: 'layers', name: 'PowerPoint decks', items: c.ppts.map(p => [p[0], `${p[1]} slides`]) },
    { key: 'rev', icon: 'file', name: 'Reviewer', items: [[c.reviewer[0], `${c.reviewer[1]} pages`]] },
    { key: 'vid', icon: 'play', name: 'Videos to watch', items: c.videos.map(v => [v[0], v[1]]) },
    { key: 'read', icon: 'book', name: 'Readings', items: c.readings.map(r => [r, 'Text']) }
  ];
}

function cwAidsPanelHTML(m) {
  return cwAidsData(m).map(g => `
    <div class="cw-aid-group">
      <div class="cw-aid-head"><span class="cw-aid-ic">${iconSVG(g.icon)}</span><b>${g.name}</b><span class="cw-aid-count">${g.items.length}</span></div>
      <ul>${g.items.map(i => `<li><span>${esc(i[0])}</span><em>${esc(i[1])}</em></li>`).join('')}</ul>
    </div>`).join('');
}

function cwSectionBody(v, s) {
  const { mod, m } = v; const c = CW_CONTENT[m.n];
  const aids = cwAidsData(m);
  switch (s.kind) {
    case 'prayer':
      return `<h2>Gospel Reading / Reflection / Prayer</h2>
        <p>Let us begin in prayer. Take a quiet moment to settle before starting <b>Module ${m.n}: ${esc(m.title)}</b>.</p>
        <blockquote>Reflection: How does the way the world is connected today call us to act with justice and care for others?</blockquote>`;
    case 'outcomes':
      return `<h2>Learning Outcomes</h2><p>By the end of this module you should be able to:</p>
        <ul class="cw-list">${c.lessons.slice(0, 4).map(t => `<li>Explain the key ideas behind <b>${esc(t)}</b> using the module's readings and examples.</li>`).join('')}
        <li>Connect the topic of <b>${esc(m.title)}</b> to current global events.</li></ul>`;
    case 'overview':
      return `<h2>Module Overview</h2><p>${esc(m.desc)}</p>
        <div class="cw-facts"><div><span>Sections</span><b>${s ? v.sections.length : ''}</b></div><div><span>Lessons</span><b>${c.lessons.length}</b></div><div><span>Term</span><b>${m.term}</b></div></div>
        <p>Use the <b>Learning aids</b> button (top right) any time to see the slides, reviewer and videos that go with this module.</p>`;
    case 'lesson': {
      return `<h2>Lesson: ${esc(s.title)}</h2>
        <p>This lesson covers <b>${esc(s.title)}</b> as part of <i>${esc(m.title)}</i>. Read through the key points, then check the aids below before moving on.</p>
        <ul class="cw-list"><li>Key concept and working definition</li><li>Historical and contemporary examples</li><li>Guide questions for class discussion</li></ul>
        <h4 class="cw-sub">Visual aids used in this lesson</h4>
        <div class="cw-chips">
          <span class="cw-chip">${iconSVG('layers')} ${esc(c.ppts[s.idx % c.ppts.length][0])} (PPT)</span>
          <span class="cw-chip">${iconSVG('play')} ${esc(c.videos[s.idx % c.videos.length][0])} (Video)</span>
          <span class="cw-chip">${iconSVG('file')} ${esc(c.reviewer[0])}</span>
        </div>`;
    }
    case 'readings':
      return `<h2>Suggested Readings</h2><ul class="cw-list">${c.readings.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`;
    case 'refs':
      return `<h2>References</h2><ul class="cw-list">${c.readings.concat(['Course syllabus, ' + CW_FAMILY]).map(r => `<li>${esc(r)}</li>`).join('')}</ul>`;
    case 'closing':
      return `<h2>End of Module / Closing Prayer</h2><p>You have reached the end of Module ${m.n}. Let us close with a short prayer of gratitude for what we have learned and for the people we learn with.</p>`;
    case 'participation':
      return `<h2>${esc(s.label)}</h2><p>Post your response to the guide question in the class discussion: <i>What is one way ${esc(m.title.toLowerCase())} shows up in your daily life?</i></p>`;
    case 'slides':
      return `<h2>Lesson Slides</h2><p>All slide decks used in this module:</p>
        <ul class="cw-list">${c.ppts.map(p => `<li>${esc(p[0])} <em>(${p[1]} slides)</em></li>`).join('')}</ul>`;
  }
  return '';
}

function cwStartScreen(v) {
  const { m } = v;
  const aids = cwAidsData(m);
  return `<div class="cw-start">
    <span class="cw-kicker">Module ${m.n} - ${m.term}</span>
    <h1>${esc(m.title)}</h1>
    <p>${esc(m.desc)}</p>
    <h3>Before you start - visual aids for this module</h3>
    <div class="cw-aid-cards">${aids.map(g => `
      <button type="button" class="cw-aid-card" data-cw-aids>
        <span class="cw-aid-ic">${iconSVG(g.icon)}</span><b>${g.items.length}</b><span>${g.name}</span>
      </button>`).join('')}</div>
    <div class="cw-start-actions">
      <button type="button" class="ghost-btn" data-cw-aids>${iconSVG('layers')} View learning aids</button>
      <button type="button" class="primary-btn" data-cw-start>${v.done.size ? 'Continue module' : 'Start module'}</button>
    </div>
  </div>`;
}

function cwRender() {
  const v = cwView; if (!v) return;
  const root = cwEnsureRoot();
  const total = v.sections.length;
  const pct = Math.round((v.done.size / total) * 100);
  const cur = v.sections.find(s => s.id === v.current);
  const idx = cur ? v.sections.indexOf(cur) : -1;
  root.innerHTML = `
    <header class="cw-top">
      <button type="button" class="cw-back" data-cw-close>${iconSVG('chevronLeft')} Back to class</button>
      <div class="cw-top-title"><span>${esc(v.mod.category)}</span><b>Module ${v.m.n}: ${esc(v.m.title)}</b></div>
      <div class="cw-top-progress"><div class="cw-bar"><i style="width:${pct}%"></i></div><span>${v.done.size}/${total}</span></div>
      <button type="button" class="ghost-btn cw-aids-btn" data-cw-aids>${iconSVG('layers')} Learning aids</button>
      <button type="button" class="cw-panel-toggle" data-cw-toggle aria-label="Toggle sections panel">${iconSVG('sliders')}</button>
    </header>
    <div class="cw-body ${v.panelOpen ? '' : 'panel-closed'}">
      <aside class="cw-side" aria-label="Module sections">
        <div class="cw-side-head">Module ${v.m.n}: ${esc(v.m.title)}</div>
        <ul>${v.sections.map(s => `
          <li><button type="button" class="cw-item ${v.done.has(s.id) ? 'done' : ''} ${s.id === v.current ? 'current' : ''}" data-cw-go="${s.id}">
            <span class="cw-tick">${v.done.has(s.id) ? iconSVG('check') : ''}</span><span>${esc(s.label)}</span></button></li>`).join('')}</ul>
      </aside>
      <main class="cw-main">
        ${cur ? `<article class="cw-article">${cwSectionBody(v, cur)}
            <div class="cw-nav">
              <button type="button" class="ghost-btn" data-cw-prev ${idx <= 0 ? 'disabled' : ''}>${iconSVG('chevronLeft')} Previous</button>
              <button type="button" class="primary-btn" data-cw-next>${idx >= total - 1 ? 'Finish module' : 'Mark done &amp; continue'}</button>
            </div></article>` : cwStartScreen(v)}
      </main>
      <aside class="cw-aids ${v.aidsOpen ? 'open' : ''}" aria-label="Learning aids">
        <div class="cw-aids-head"><b>Learning aids</b><button type="button" class="cw-x" data-cw-aids-close aria-label="Close">${iconSVG('x')}</button></div>
        <p class="cw-aids-note">Visual aids used in Module ${v.m.n}.</p>
        ${cwAidsPanelHTML(v.m)}
      </aside>
    </div>`;
}

function cwGo(id) { cwView.current = id; cwRender(); const mn = document.querySelector('.cw-main'); if (mn) mn.scrollTop = 0; }
function cwMark(id) {
  cwView.done.add(id);
  cwSetProgress(cwView.mod.id, cwView.m.n, Array.from(cwView.done));
}

document.addEventListener('click', (e) => {
  const row = e.target.closest('[data-open-module]');
  if (row) { cwOpen(row.dataset.openModule, row.dataset.modN); return; }
  if (!cwView) return;
  const t = e.target;
  if (t.closest('[data-cw-close]')) return cwClose();
  if (t.closest('[data-cw-toggle]')) { cwView.panelOpen = !cwView.panelOpen; return cwRender(); }
  if (t.closest('[data-cw-aids]')) { cwView.aidsOpen = true; return cwRender(); }
  if (t.closest('[data-cw-aids-close]')) { cwView.aidsOpen = false; return cwRender(); }
  if (t.closest('[data-cw-start]')) {
    const firstUndone = cwView.sections.find(s => !cwView.done.has(s.id)) || cwView.sections[0];
    return cwGo(firstUndone.id);
  }
  const go = t.closest('[data-cw-go]');
  if (go) return cwGo(go.dataset.cwGo);
  if (t.closest('[data-cw-prev]')) {
    const i = cwView.sections.findIndex(s => s.id === cwView.current);
    if (i > 0) cwGo(cwView.sections[i - 1].id);
    return;
  }
  if (t.closest('[data-cw-next]')) {
    const i = cwView.sections.findIndex(s => s.id === cwView.current);
    cwMark(cwView.current);
    if (i >= cwView.sections.length - 1) {

      const { mod, m } = cwView;
      if (cwView.done.size >= cwView.sections.length && mod.watched < m.n) {
        mod.watched = m.n;
        if (typeof persist === 'function') persist();
        if (typeof toast === 'function') toast(`Module ${m.n} completed`);
      }
      return cwClose();
    }
    return cwGo(cwView.sections[i + 1].id);
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cwView) {
    if (cwView.aidsOpen) { cwView.aidsOpen = false; return cwRender(); }
    return cwClose();
  }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-open-module]')) {
    e.preventDefault(); cwOpen(e.target.dataset.openModule, e.target.dataset.modN);
  }
});

if (typeof activeLessonId !== 'undefined' && activeLessonId && !document.getElementById('drawer-backdrop').hidden) {
  openLessonDrawer(activeLessonId);
}
renderIcons();

moduleRowHTML = function (mod, m, done) {
  const open = cwIsOpenable(mod, m);
  const locked = m.term === 'Finals';
  const stateLabel = locked ? `Module Locked ${iconSVG('lock')}` : (done ? `Completed ${iconSVG('check')}` : 'In progress');
  return `<div class="mod-row ${locked ? 'is-locked' : (done ? 'is-done' : '')} ${open ? 'is-openable' : ''}" ${open ? `data-open-module="${esc(mod.id)}" data-mod-n="${m.n}" role="button" tabindex="0"` : ''}>
    <img class="mod-thumb" src="${subjectArt(mod, 160, 110)}" alt="">
    <div class="mod-main"><h4>${m.n}. ${esc(m.title)}</h4><p>${esc(m.desc)}</p>
      <div class="mod-foot"><span class="mod-state ${locked ? 'locked' : (done ? 'done' : '')}">${stateLabel}</span>
      <span class="mod-sections">${m.sections} sections</span>${open ? `<span class="mod-open-hint">Open module ${iconSVG('chevronRight')}</span>` : ''}</div></div>
    <span class="term-pill ${m.term.toLowerCase()}">${m.term}</span></div>`;
};
cwSectionBody = function (v, s) {
  const { m } = v, d = CW_DEEP[m.n], c = CW_CONTENT[m.n];
  const ul = a => `<ul class="cw-list">${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
  switch (s.kind) {
    case 'prayer': return `${CW_GLOBE}<h2>Gospel Reading / Reflection / Prayer</h2>
      <h4 class="cw-sub">Gospel: ${esc(d.gospel[0])}</h4><p>${esc(d.gospel[1])}</p>
      <h4 class="cw-sub">Reflection</h4><blockquote>${esc(d.reflect)}</blockquote>
      <h4 class="cw-sub">Opening Prayer</h4><p>${esc(d.prayer)}</p>`;
    case 'outcomes': return `<h2>Learning Outcomes</h2><p>By the end of this module, you should be able to:</p>${ul(d.outcomes.map(esc))}`;
    case 'overview': return `${CW_GLOBE}<h2>Module Overview</h2><p>${esc(d.overview)}</p>
      <div class="cw-facts"><div><span>Lessons</span><b>${d.lessons.length}</b></div><div><span>Sections</span><b>${v.sections.length}</b></div><div><span>Term</span><b>${m.term}</b></div></div>
      <h4 class="cw-sub">Topics covered</h4>${ul(d.lessons.map(l => esc(l[0])))}
      <p>Use <b>Learning aids</b> at any time to see the slides, reviewer, and videos for this module.</p>`;
    case 'lesson': { const l = d.lessons[s.idx];
      return `<span class="cw-kicker">Lesson ${s.idx + 1} of ${d.lessons.length}</span><h2>${esc(l[0])}</h2>
        ${l[1].map(p => `<p>${esc(p)}</p>`).join('')}
        <h4 class="cw-sub">Key points</h4>${ul(l[2].map(esc))}
        <h4 class="cw-sub">Visual aids for this lesson</h4><div class="cw-chips">
        <span class="cw-chip">${iconSVG('layers')} ${esc(c.ppts[s.idx % c.ppts.length][0])} (PPT)</span>
        <span class="cw-chip">${iconSVG('play')} ${esc(c.videos[s.idx % c.videos.length][0])} (Video)</span>
        <span class="cw-chip">${iconSVG('file')} ${esc(c.reviewer[0])}</span></div>`; }
    case 'readings': return `<h2>Suggested Readings</h2>${ul(c.readings.map(esc))}`;
    case 'refs': return `<h2>References</h2>${ul(c.readings.map(esc).concat(['The Contemporary World course syllabus']))}`;
    case 'closing': return `<h2>End of Module / Closing Prayer</h2><p>You have reached the end of Module ${m.n}: ${esc(m.title)}. Review the key points of each lesson, then pray:</p><blockquote>Lord, thank you for what we have learned. Let it lead us to act with justice and love in the world we share. Amen.</blockquote>`;
    case 'participation': return `<h2>${esc(s.label)}</h2><p>Post your response in the class discussion:</p><blockquote>Choose one lesson from ${esc(m.title)} and explain how it appears in your own life or community. Support your answer with at least one concept from the module.</blockquote>`;
    case 'slides': return `<h2>Lesson Slides</h2><p>Slide decks used in this module:</p>${ul(c.ppts.map(p => `${esc(p[0])} <em>(${p[1]} slides)</em>`))}`;
  }
  return '';
};

const CW_DEEP = {
1: { gospel: ['John 17:20-23', 'Jesus prays that all may be one, as the Father and the Son are one, so that the world may believe.'],
  reflect: 'We live in a world where a message sent in Manila reaches Madrid in seconds. What does it mean to be "one" with people we will never meet?',
  prayer: 'Lord, open our eyes to the whole human family. Give us minds that seek to understand and hearts that reach across borders. Amen.',
  outcomes: ['Define globalization and distinguish its economic, political, and cultural dimensions.', 'Trace the historical waves of global integration.', 'Evaluate the argument on whether globalization is new.', 'Reflect on how globalization shapes your own daily life.'],
  overview: 'This opening module builds the vocabulary of the course. You will learn what scholars mean by globalization, see its different aspects, and test the claim that it is a modern invention.',
  lessons: [
   ['Globalization Defined', ['Globalization is the growing interconnection and interdependence of people, places, and institutions across the world. Scholars such as Manfred Steger describe it as an intensification of social relations that link distant localities.', 'It is both a process (things becoming more connected) and a set of ideas about how the world should be organized.'], ['Flows of goods, money, people, information, and ideas', 'Time-space compression: distance matters less', 'Not the same as Westernization or Americanization']],
   ['Aspects of Globalization', ['Globalization is not a single thing. Economic globalization concerns trade, finance, and production networks. Political globalization concerns institutions and rules beyond the state. Cultural globalization concerns the spread of ideas, media, food, and lifestyles.'], ['Economic: trade, investment, multinational firms', 'Political: UN, treaties, international law', 'Cultural: media, migration, shared symbols']],
   ['Is Globalization a New Phenomenon?', ['Historians disagree. One view holds that globalization is centuries old, pointing to the Silk Road, the spice trade, and the Spanish galleon trade linking Manila and Acapulco from 1565. Another view holds that today\'s speed, scale, and depth of integration are truly unprecedented.'], ['Archaic, early modern, modern, and contemporary waves', 'Galleon Trade: an early Philippine link to global commerce', 'What changed: speed, volume, and the internet']],
   ['Globalization and the Individual', ['Global processes reach ordinary lives: the phone in your hand is designed in one country, assembled in another, and runs software written in several more. Overseas Filipino workers show how globalization moves people and money across borders, and how families feel its costs and benefits.'], ['Consumer, worker, and citizen roles', 'Remittances and the OFW experience', 'Guide question: where does your daily routine touch the world?']]],
  },
2: { gospel: ['Acts 2:5-11', 'People from many nations hear the good news, each in their own language.'],
  reflect: 'Diversity was present at Pentecost from the start. How do we welcome difference without losing what makes our own culture distinct?',
  prayer: 'God of every nation and tongue, help us build structures that serve the human person and honor every culture. Amen.',
  outcomes: ['Describe the global economy, global politics, and global culture as structures.', 'Explain how technology connects these structures.', 'Identify who benefits and who is left behind by each structure.'],
  overview: 'Globalization runs through structures: markets, states and institutions, cultural networks, and technology. This module maps each and shows how they overlap.',
  lessons: [
   ['The Global Economy', ['The global economy is a network of trade, finance, and production that crosses borders. Multinational corporations split production across countries, forming global value chains in which design, manufacturing, and assembly happen in different places.'], ['Global value chains', 'Multinational and transnational corporations', 'Trade and financial flows']],
   ['Global Politics', ['Politics also operates beyond the nation. States still matter, but decisions are shaped by international organizations, treaties, and non-state actors such as NGOs and advocacy networks.'], ['States plus international organizations', 'Global agreements on trade, climate, and human rights', 'Power is unevenly distributed']],
   ['Global Culture', ['Scholars debate three outcomes: homogenization (cultures becoming alike), polarization (cultures clashing), and hybridization or "glocalization" (global forms adapted locally). Filipino adaptations of global fast food and K-pop fandoms are common examples of the third.'], ['Homogenization, polarization, hybridization', 'Glocalization: global forms with local flavor', 'Media and identity']],
   ['Global Technology', ['Digital networks make the other structures possible. The internet, mobile phones, and cloud platforms let money, information, and work move instantly, but they also create a digital divide between connected and unconnected communities.'], ['Internet as infrastructure of globalization', 'Remote work and outsourcing (BPO in the Philippines)', 'The digital divide']]],
},
3: { gospel: ['Luke 12:16-21', 'A rich man stores up wealth for himself and forgets that life is more than possessions.'],
  reflect: 'Markets create wealth, but for whom? How should Christians think about profit, generosity, and the common good?',
  prayer: 'Lord, teach us to hold wealth lightly and to see our neighbor in every worker and consumer. Amen.',
  outcomes: ['Define market integration and economic globalization.', 'Explain Friedman\'s "flatteners" and critique the flat-world claim.', 'Describe neoliberalism and the roles of the IMF, World Bank, and WTO.', 'Assess the impact of economic globalization on marginalized sectors.'],
  overview: 'Markets across the world are increasingly tied together. This module examines how that happened, who designed the rules, and who bears the costs.',
  lessons: [
   ['Economic Globalization Defined', ['Economic globalization is the increasing integration of national economies through trade, investment, finance, and the movement of labor and technology. It is the most visible dimension of globalization.'], ['Trade in goods and services', 'Foreign direct investment', 'Global financial markets']],
   ['The World is Flat', ['Thomas Friedman argues that a series of "flatteners" leveled the global playing field so that individuals and firms anywhere can compete and collaborate. Critics respond that the world is still "spiky": wealth and opportunity remain concentrated in a few places.'], ['Fall of the Berlin Wall (1989) opened markets', 'IT revolution: the internet, workflow software, outsourcing', 'Critique: unequal access remains']],
   ['Neoliberalism and Economic Globalization', ['Neoliberalism is the policy approach that favors free markets, privatization, deregulation, and reduced state spending. Since the 1980s it has guided many trade and loan agreements, often called the Washington Consensus.'], ['Privatization, liberalization, deregulation', 'Structural adjustment programs', 'Supporters cite growth; critics cite inequality']],
   ['Global Economic Institutions', ['Three institutions anchor the system. The IMF stabilizes currencies and lends to countries in balance-of-payments trouble. The World Bank funds development projects. The WTO, successor to the GATT, sets and enforces trade rules.'], ['IMF: monetary stability', 'World Bank: development finance', 'WTO: trade rules and disputes']],
   ['Is Economic Globalization a Failure?', ['The record is mixed. Global poverty has fallen in many regions, particularly in East Asia, yet inequality within and between countries has widened in many cases and financial crises spread quickly across borders.'], ['Gains: growth, cheaper goods, jobs', 'Losses: inequality, job insecurity, crises', 'No simple verdict: it depends on policy']],
   ['Impact on the Marginalized Sectors', ['Small farmers, informal workers, and indigenous communities often face competition from cheap imports or lose land to large projects. Labor conditions in export industries can be poor, and women workers are often overrepresented in low-wage global assembly work.'], ['Farmers and rural communities', 'Informal and contractual labor', 'Calls for fair trade and social protection']]],
},
4: { gospel: ['Matthew 22:15-21', 'Asked about paying taxes, Jesus tells the people to give to Caesar what is Caesar\'s and to God what is God\'s.'],
  reflect: 'What do we owe the state, and what do we owe conscience? Where do national loyalty and global responsibility meet?',
  prayer: 'Lord, guide those who hold authority, and give us wisdom to be faithful citizens of our nation and of the world. Amen.',
  outcomes: ['Define the interstate system and the principle of sovereignty.', 'Explain the significance of the Peace of Westphalia (1648).', 'Discuss how globalization challenges the nation-state.', 'Distinguish hegemony from other forms of power.'],
  overview: 'The world is divided into states that recognize each other as sovereign. This module explains how that system emerged and how globalization is testing it.',
  lessons: [
   ['The Interstate System', ['The interstate system is the network of relations among sovereign states, each claiming authority over a territory and its people. It is the political backbone of the modern world order.'], ['States as the main actors', 'Recognition of borders and sovereignty', 'Diplomacy, alliances, and conflict']],
   ['The Westphalian Order', ['The treaties of 1648 ended the Thirty Years\' War in Europe and are commonly credited with establishing the idea that each state is supreme within its own territory and should not interfere in the affairs of others.'], ['Territorial sovereignty', 'Non-intervention', 'Balance of power']],
   ['Sovereignty and the State', ['Sovereignty has an internal side (supreme authority at home) and an external side (independence from outside control). Globalization strains both: capital flows, migration, and global rules limit what states can do alone.'], ['Internal and external sovereignty', 'Pooling sovereignty (EU, ASEAN)', 'Debates on humanitarian intervention']],
   ['Nation-States and Globalization', ['Some argue globalization is eroding the nation-state; others argue states remain powerful and have adapted, using regulation, borders, and industrial policy. The Philippine state, for example, manages labor migration and trade policy in a global setting.'], ['"Hyperglobalist" vs. "skeptic" positions', 'States as gatekeepers and regulators', 'Case: labor export policy']],
   ['Global Powers and Hegemony', ['Hegemony is leadership or dominance by one state within the system. Britain in the 19th century and the United States after 1945 are classic examples. Today, debates focus on the rise of China and a more multipolar order.'], ['Hegemon: military, economic, and cultural leadership', 'World-systems view: core, semi-periphery, periphery', 'Unipolar vs. multipolar world']]],
},
5: { gospel: ['Matthew 20:25-28', 'Jesus teaches that greatness in his community means serving others, not ruling over them.'],
  reflect: 'Global institutions hold real power. What would governance look like if it were designed as service rather than domination?',
  prayer: 'God of justice, bless every effort to govern with fairness and compassion, especially where the voices of the poor go unheard. Amen.',
  outcomes: ['Define global governance and its main actors.', 'Explain the structure and functions of the United Nations.', 'Compare regional organizations such as the EU and ASEAN.', 'Evaluate the role of global civil society and current challenges.'],
  overview: 'No world government exists, yet global problems require coordination. This module studies how states, institutions, and citizens manage shared problems.',
  lessons: [
   ['Global Governance Defined', ['Global governance is the collective management of transnational problems through institutions, rules, and cooperation, without a single world government. Its actors include states, international organizations, corporations, and NGOs.'], ['Governance without government', 'Multiple actors and levels', 'Examples: climate, trade, health']],
   ['The United Nations', ['Founded in 1945, the UN maintains peace and security, promotes human rights, and coordinates development. Its main organs include the General Assembly, the Security Council (with five permanent members holding veto power), and the Secretariat.'], ['General Assembly: all members, one vote each', 'Security Council: five permanent members with veto', 'Specialized agencies: WHO, UNESCO, UNICEF']],
   ['Regional Organizations', ['Regional bodies link neighboring states. The European Union has deep economic and political integration, including a shared currency for many members. ASEAN, founded in 1967, emphasizes consensus and non-interference, with the Philippines as a founding member.'], ['EU: deep integration', 'ASEAN: consensus and non-interference', 'Other examples: African Union, Mercosur']],
   ['Global Civil Society', ['NGOs, advocacy networks, and social movements push governments and firms to act on human rights, environment, and labor concerns. Campaigns such as the ban on landmines show how citizen networks can change international rules.'], ['NGOs and transnational advocacy', 'Social movements', 'Legitimacy and accountability questions']],
   ['Governance Challenges Today', ['Climate change, pandemics, cyber threats, and migration cross every border. Institutions struggle with slow decision-making, unequal power, and lack of enforcement, prompting calls for reform.'], ['Climate and the Paris Agreement', 'Pandemic response lessons', 'Reform of the Security Council']]],
}};
Object.keys(CW_DEEP).forEach(n => { CW_CONTENT[n].lessons = CW_DEEP[n].lessons.map(l => l[0]); });

const CW_GLOBE = '<svg class="cw-art" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="32" cy="32" r="24"/><ellipse cx="32" cy="32" rx="10" ry="24"/><path d="M8 32h48M12 20h40M12 44h40"/></svg>';

if (typeof activeLessonId !== 'undefined' && activeLessonId && !document.getElementById('drawer-backdrop').hidden) openLessonDrawer(activeLessonId);

window.__cwBody16 = cwSectionBody;

cwSectionBody = function (v, s) {
  let html = _cwBody16(v, s);
  const n = v.m.n;
  if (s.kind === 'lesson') {
    const more = CW_MORE[n], i = s.idx % more.length;
    html = html.replace('<h4 class="cw-sub">Visual aids for this lesson</h4>',
      `<h4 class="cw-sub">Going deeper</h4><p>${esc(more[i])}</p><p>${esc(more[(i + 1) % more.length])}</p>
       <h4 class="cw-sub">Guide questions</h4><ol class="cw-list"><li>In your own words, how would you define <b>${esc(s.title)}</b>?</li><li>Give one example from the Philippines.</li><li>Who benefits and who is left out?</li></ol>
       <h4 class="cw-sub">Visual aids for this lesson</h4>`);
  }
  if (s.kind === 'refs' || s.kind === 'readings') {
    const list = CW_REFS[n].map(r => `<li>${esc(r)}</li>`).join('');
    return `<h2>${s.kind === 'refs' ? 'References' : 'Suggested Readings'}</h2><ul class="cw-list cw-refs">${list}</ul>`;
  }
  return html;
};
cwAidsPanelHTML = function (m) {
  const md = CW_MEDIA[m.n];
  const vids = md.videos.map(v => `<details class="cw-dd"><summary>${iconSVG('play')}<span>${esc(v[0])}</span></summary>
      <div class="cw-embed"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${v[1]}" title="${esc(v[0])}" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>
      <a class="cw-ext" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${v[1]}">Watch on YouTube</a></details>`).join('');
  const pdfs = md.pdfs.map(p => `<details class="cw-dd"><summary>${iconSVG('file')}<span>${esc(p[0])}</span><em>PDF</em></summary>
      ${p[2] ? `<div class="cw-embed pdf"><iframe loading="lazy" src="${p[1]}" title="${esc(p[0])}"></iframe></div>` : ''}
      <a class="cw-ext" target="_blank" rel="noopener" href="${p[1]}">${p[2] ? 'Open in new tab' : 'Open PDF'}</a></details>`).join('');
  const refs = CW_REFS[m.n].map(r => `<li>${esc(r)}</li>`).join('');
  return `<div class="cw-aid-group"><div class="cw-aid-head"><span class="cw-aid-ic">${iconSVG('play')}</span><b>Videos</b><span class="cw-aid-count">${md.videos.length}</span></div>${vids}</div>
    <div class="cw-aid-group"><div class="cw-aid-head"><span class="cw-aid-ic">${iconSVG('file')}</span><b>PDF</b><span class="cw-aid-count">${md.pdfs.length}</span></div>${pdfs}</div>
    <div class="cw-aid-group"><div class="cw-aid-head"><span class="cw-aid-ic">${iconSVG('book')}</span><b>References</b><span class="cw-aid-count">${CW_REFS[m.n].length}</span></div>
      <details class="cw-dd"><summary>${iconSVG('book')}<span>View references</span></summary><ul class="cw-refs-mini">${refs}</ul></details></div>`;
};
cwAidsData = function (m) {
  const md = CW_MEDIA[m.n], c = CW_CONTENT[m.n];
  return [{ key: 'ppt', icon: 'layers', name: 'PowerPoint decks', items: c.ppts.map(p => [p[0], p[1] + ' slides']) },
          { key: 'vid', icon: 'play', name: 'Videos to watch', items: md.videos },
          { key: 'pdf', icon: 'file', name: 'PDFs', items: md.pdfs },
          { key: 'read', icon: 'book', name: 'Readings', items: CW_REFS[m.n] }];
};
cwRender = function () {
  const v = cwView; if (!v) return;
  const root = cwEnsureRoot(), total = v.sections.length, pct = Math.round(v.done.size / total * 100);
  const cur = v.sections.find(s => s.id === v.current), idx = cur ? v.sections.indexOf(cur) : -1;
  const last = idx >= total - 1;
  root.innerHTML = `
    <header class="cw-top">
      <button type="button" class="cw-back" data-cw-close>${iconSVG('chevronLeft')} Back to class</button>
      <div class="cw-top-title"><span>${esc(v.mod.category)}</span><b>Module ${v.m.n}: ${esc(v.m.title)}</b></div>
      <div class="cw-top-progress"><div class="cw-bar"><i style="width:${pct}%"></i></div><span>${v.done.size}/${total}</span></div>
      <button type="button" class="ghost-btn cw-aids-btn" data-cw-aids>${iconSVG('layers')} Learning aids</button>
    </header>
    <div class="cw-body ${v.panelOpen ? '' : 'panel-closed'}">
      <aside class="cw-side" aria-label="Module sections">
        <div class="cw-side-head">Module ${v.m.n}: ${esc(v.m.title)}</div>
        <ul>${v.sections.map(s => `<li><button type="button" class="cw-item ${v.done.has(s.id) ? 'done' : ''} ${s.id === v.current ? 'current' : ''}" data-cw-go="${s.id}"><span class="cw-tick">${v.done.has(s.id) ? iconSVG('check') : ''}</span><span>${esc(s.label)}</span></button></li>`).join('')}</ul>
      </aside>
      <button type="button" class="cw-collapse" data-cw-toggle aria-label="${v.panelOpen ? 'Hide' : 'Show'} sections panel" title="${v.panelOpen ? 'Hide' : 'Show'} panel">${iconSVG(v.panelOpen ? 'chevronLeft' : 'chevronRight')}</button>
      <main class="cw-main">
        ${v.finished ? cwFinishScreen(v) : cur ? `<article class="cw-article">${cwSectionBody(v, cur)}
          <div class="cw-nav">
            <button type="button" class="ghost-btn" data-cw-prev ${idx <= 0 ? 'disabled' : ''}>${iconSVG('chevronLeft')} Previous</button>
            <button type="button" class="primary-btn" ${last ? 'data-cw-finish' : 'data-cw-next'}>${last ? 'Finish module' : 'Mark done &amp; continue'}</button>
          </div></article>` : cwStartScreen(v)}
      </main>
      <aside class="cw-aids ${v.aidsOpen ? 'open' : ''}" aria-label="Learning aids">
        <div class="cw-aids-head"><b>Learning aids</b><button type="button" class="cw-x" data-cw-aids-close aria-label="Close">${iconSVG('x')}</button></div>
        <p class="cw-aids-note">Videos and PDFs for Module ${v.m.n}. Tap a title to open it.</p>
        ${cwAidsPanelHTML(v.m)}
      </aside>
    </div>`;
};

const CW_MEDIA = {
 1:{videos:[['What is Globalization? (IMF Back to Basics)','15d818t9UZ0'],['What Is Globalization? Understand Our Interconnected World','wLNp3kgBuuQ']],
    pdfs:[['Module 1 Reviewer','pdf/module1_reviewer.pdf',true]]},
 2:{videos:[['Globalization, Part 1: What It Is and Why It Matters','QTvg3hDDa-g'],['Introduction to the Contemporary World (lecture)','db6Vf5scTrY']],
    pdfs:[['Module 2 Reviewer','pdf/module2_reviewer.pdf',true]]},
 3:{videos:[['Globalization, Part 1: What It Is and Why It Matters','QTvg3hDDa-g'],['What is Globalization? (IMF)','15d818t9UZ0']],
    pdfs:[['Module 3 Reviewer','pdf/module3_reviewer.pdf',true]]},
 4:{videos:[['Peace of Westphalia in 1648','BFxGYPWH_xI'],['Introduction to the Contemporary World (lecture)','db6Vf5scTrY']],
    pdfs:[['Module 4 Reviewer','pdf/module4_reviewer.pdf',true],['Charter of the United Nations (UN Treaty Collection)','https://treaties.un.org/doc/source/docs/charter-all-lang.pdf',false]]},
 5:{videos:[['How does the United Nations work? (RMIT)','QoIafzc0k74'],['What is Globalization? (IMF)','15d818t9UZ0']],
    pdfs:[['Module 5 Reviewer','pdf/module5_reviewer.pdf',true],['Charter of the United Nations (U.S. National Archives)','https://archives.gov/files/historical-docs/doc-content/images/un-charter.pdf',false]]}
};
const CW_REFS = {
 1:['Steger, M. B. (2017). Globalization: A Very Short Introduction (4th ed.). Oxford University Press.','Held, D., McGrew, A., Goldblatt, D., & Perraton, J. (1999). Global Transformations: Politics, Economics and Culture. Stanford University Press.','Held, D., & McGrew, A. (Eds.). (2003). The Global Transformations Reader (2nd ed.). Polity Press.','Flynn, D. O., & Giraldez, A. (1995). Born with a "silver spoon": The origin of world trade in 1571. Journal of World History, 6(2), 201-221.'],
 2:['Appadurai, A. (1996). Modernity at Large: Cultural Dimensions of Globalization. University of Minnesota Press.','Ritzer, G. (2007). The Globalization of Nothing 2. Pine Forge Press.','Robertson, R. (1995). Glocalization: Time-space and homogeneity-heterogeneity. In M. Featherstone, S. Lash, & R. Robertson (Eds.), Global Modernities. Sage.','Pieterse, J. N. (2009). Globalization and Culture: Global Melange (2nd ed.). Rowman & Littlefield.'],
 3:['Friedman, T. L. (2005). The World Is Flat: A Brief History of the Twenty-First Century. Farrar, Straus and Giroux.','Stiglitz, J. E. (2002). Globalization and Its Discontents. W. W. Norton.','Rodrik, D. (2011). The Globalization Paradox. W. W. Norton.','Harvey, D. (2005). A Brief History of Neoliberalism. Oxford University Press.','Milanovic, B. (2016). Global Inequality. Harvard University Press.'],
 4:['Krasner, S. D. (1999). Sovereignty: Organized Hypocrisy. Princeton University Press.','Wallerstein, I. (2004). World-Systems Analysis: An Introduction. Duke University Press.','Osiander, A. (2001). Sovereignty, international relations, and the Westphalian myth. International Organization, 55(2), 251-287.'],
 5:['Weiss, T. G., & Wilkinson, R. (2019). Rethinking Global Governance. Polity Press.','Rosenau, J. N., & Czempiel, E.-O. (Eds.). (1992). Governance without Government. Cambridge University Press.','Barnett, M., & Finnemore, M. (2004). Rules for the World: International Organizations in Global Politics. Cornell University Press.','United Nations. (1945). Charter of the United Nations. San Francisco.']
};

const CW_MORE = {
 1:['Steger stresses that globalization has a subjective side as well as an objective one: people increasingly think of themselves as part of a single world. A migrant worker video-calling family every night lives this "global consciousness" in a very ordinary way. Many scholars therefore study three things together: flows, networks, and awareness.','The debate about novelty often comes down to definitions. If globalization means any long-distance link, it is ancient. If it means dense, instantaneous, world-spanning interdependence, it is largely a twentieth-century development. The Manila-Acapulco galleon trade (1565-1815) is often cited by Philippine historians because it linked Asia, the Americas, and Europe through silver and silk.'],
 2:['Appadurai proposed that global culture moves along "scapes": ethnoscapes (people), technoscapes, financescapes, mediascapes, and ideoscapes. These flows do not line up neatly, which is why cultural globalization produces unpredictable results rather than simple sameness.','Ritzer\'s McDonaldization thesis argues that efficiency, calculability, predictability, and control spread from fast-food restaurants into schools, hospitals, and offices. Robertson\'s idea of glocalization answers that global forms are always adapted locally, as in rice-based menus and local flavors at global chains.'],
 3:['Friedman describes three eras: Globalization 1.0 (countries, c. 1492-1800), 2.0 (companies, c. 1800-2000), and 3.0 (individuals, from about 2000). Critics such as Rodrik and Stiglitz note that rules for trade and capital were written largely by powerful states, so gains and adjustment costs were unevenly shared.','Milanovic\'s "elephant curve" shows that the global middle classes of emerging economies gained most in recent decades while the lower-middle classes of rich countries saw slower income growth. This pattern is central to today\'s debates about trade, jobs, and protection.'],
 4:['Osiander argues that the Westphalian settlement is often over-credited: the 1648 treaties did not create a modern system of equal sovereign states overnight, and the "myth" of Westphalia was largely built by later scholars. Krasner adds that sovereignty has always been compromised in practice, which he calls organized hypocrisy.','In Wallerstein\'s world-systems analysis, the world economy is divided into a core, a semi-periphery, and a periphery, and hegemonic powers rise and decline in long cycles. This lens helps explain why formally equal states hold very unequal power.'],
 5:['Rosenau\'s phrase "governance without government" captures the central puzzle: order is produced through rules, norms, and networks even without a world state. Barnett and Finnemore add that international organizations are not neutral tools; they have their own bureaucratic cultures and can shape what counts as a problem.','The UN Charter (1945) commits members to settle disputes peacefully, and Chapter VII lets the Security Council authorize measures to maintain peace. Veto power held by the five permanent members is the most debated feature of the system and the focus of most reform proposals.']
};

const _cwBody16 = window.__cwBody16;

function cwFinishScreen(v) {
  const { mod, m } = v;
  const next = mod.modules.find(x => x.n === m.n + 1 && cwIsOpenable(mod, x));
  return `<div class="cw-start cw-finish"><span class="cw-kicker">Module ${m.n} complete</span>
    <h1>Great work!</h1><p>You finished <b>${esc(m.title)}</b>. ${next ? 'Your next module is ready.' : 'This is the last available module for now.'}</p>
    <div class="cw-start-actions">
      <button type="button" class="ghost-btn" data-cw-close>Back to class</button>
      ${next ? `<button type="button" class="primary-btn" data-cw-nextmod="${next.n}">Next module: ${esc(next.title)} ${iconSVG('chevronRight')}</button>` : ''}
    </div></div>`;
}

document.addEventListener('click', (e) => {
  if (!cwView) return;
  const t = e.target;
  if (t.closest('[data-cw-finish]')) {
    e.stopPropagation();
    const { mod, m } = cwView;
    cwMark(cwView.current);
    if (mod.watched < m.n) { mod.watched = m.n; if (typeof persist === 'function') persist(); if (typeof toast === 'function') toast(`Module ${m.n} completed`); }
    cwView.finished = true; cwView.aidsOpen = false; cwRender();
    const mn = document.querySelector('.cw-main'); if (mn) mn.scrollTop = 0;
    return;
  }
  const nm = t.closest('[data-cw-nextmod]');
  if (nm) { const { mod } = cwView; document.body.classList.remove('cw-lock'); cwOpen(mod.id, nm.dataset.cwnextmod || nm.getAttribute('data-cw-nextmod')); }
}, true);
if (typeof cwView !== 'undefined' && cwView) cwRender();

window.__cwBody17 = cwSectionBody; window.__cwRow16 = moduleRowHTML;

moduleRowHTML = function (mod, m, done) {
  let html = _cwRow16(mod, m, done);
  if (m.term === 'Finals' || !cwIsOpenable(mod, m)) return html;
  const total = cwSections(m).length;
  if (done) return html.replace(/<span class="mod-sections">[^<]*<\/span>/, '');
  const got = Math.min(total, cwGetProgress(mod.id, m.n).length), pct = Math.round(got / total * 100);
  html = html.replace(/<span class="mod-sections">[^<]*<\/span>/, `<span class="mod-sections">${got} of ${total} sections</span>`);
  return html.replace(/(<div class="mod-foot">)/, `<div class="mod-line" title="${pct}%"><i style="width:${pct}%"></i></div>$1`);
};
cwSectionBody = function (v, s) {
  const n = v.m.n;
  if (s.kind === 'slides') return cwSlidesHTML(n, v.m.title);
  let html = _cwBody17(v, s);
  if (s.kind === 'lesson') {
    html = html.replace(/(<h2>[^<]*<\/h2>)/, `$1${cwPic(cwPicKey(s.title, s.idx), s.title)}`);
    if (!html.includes('cw-fig')) html = cwPic(cwPicKey(s.title, s.idx), s.title) + html;
  } else if (s.kind === 'overview' || s.kind === 'outcomes') {
    html = html.replace(/(<h2>[^<]*<\/h2>)/, `$1${cwPic(s.kind === 'overview' ? 'network' : 'time', s.label)}`);
  }
  return html;
};

const _cwBody17 = window.__cwBody17, _cwRow16 = window.__cwRow16;

const CW_PICS = {
 globe: '<circle cx="160" cy="90" r="62" fill="none" stroke="currentColor" stroke-width="3"/><ellipse cx="160" cy="90" rx="26" ry="62" fill="none" stroke="currentColor" stroke-width="2"/><path d="M98 90h124M108 60h104M108 120h104" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="40" r="6" fill="var(--primary)"/><circle cx="262" cy="140" r="6" fill="var(--primary)"/><path d="M60 40Q160 -20 262 140" fill="none" stroke="var(--primary)" stroke-width="2" stroke-dasharray="5 5"/>',
 network: '<g stroke="currentColor" stroke-width="2" opacity=".7"><path d="M60 50L160 90 250 40M160 90L90 150 230 145 160 90M60 50L90 150M250 40L230 145"/></g><g fill="var(--primary)"><circle cx="60" cy="50" r="12"/><circle cx="160" cy="90" r="16"/><circle cx="250" cy="40" r="12"/><circle cx="90" cy="150" r="12"/><circle cx="230" cy="145" r="12"/></g>',
 trade: '<path d="M20 140q20-14 40 0t40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="currentColor" stroke-width="3"/><path d="M90 120h120l-16 20H106z" fill="var(--primary)"/><rect x="110" y="88" width="22" height="32" fill="currentColor" opacity=".7"/><rect x="136" y="78" width="22" height="42" fill="currentColor" opacity=".5"/><rect x="162" y="94" width="22" height="26" fill="currentColor" opacity=".7"/><path d="M230 60h60m-10-10l10 10-10 10M30 60h60m-10-10l10 10-10 10" fill="none" stroke="var(--primary)" stroke-width="3"/>',
 chart: '<path d="M40 150h240M40 150V30" stroke="currentColor" stroke-width="2"/><g fill="var(--primary)"><rect x="60" y="110" width="30" height="40"/><rect x="105" y="90" width="30" height="60" opacity=".85"/><rect x="150" y="70" width="30" height="80" opacity=".7"/><rect x="195" y="45" width="30" height="105" opacity=".55"/></g><path d="M62 100L120 78 165 58 235 30" fill="none" stroke="currentColor" stroke-width="3"/>',
 inst: '<path d="M60 70L160 25 260 70z" fill="var(--primary)"/><g fill="currentColor" opacity=".8"><rect x="75" y="80" width="26" height="60"/><rect x="123" y="80" width="26" height="60"/><rect x="171" y="80" width="26" height="60"/><rect x="219" y="80" width="26" height="60"/></g><rect x="55" y="145" width="210" height="12" fill="currentColor"/>',
 people: '<circle cx="120" cy="90" r="48" fill="var(--primary)" opacity=".55"/><circle cx="200" cy="90" r="48" fill="currentColor" opacity=".35"/><circle cx="160" cy="90" r="10" fill="currentColor"/><circle cx="120" cy="60" r="8" fill="currentColor"/><circle cx="200" cy="120" r="8" fill="var(--primary)"/>',
 tech: '<rect x="120" y="20" width="80" height="140" rx="14" fill="none" stroke="currentColor" stroke-width="3"/><path d="M140 60a28 28 0 0 1 40 0M148 72a16 16 0 0 1 24 0" fill="none" stroke="var(--primary)" stroke-width="3"/><circle cx="160" cy="84" r="4" fill="var(--primary)"/><path d="M60 40a70 70 0 0 0 0 100M260 40a70 70 0 0 1 0 100" fill="none" stroke="currentColor" stroke-width="2" opacity=".6"/>',
 time: '<path d="M30 90h260" stroke="currentColor" stroke-width="3"/><g fill="var(--primary)"><circle cx="70" cy="90" r="9"/><circle cx="135" cy="90" r="9"/><circle cx="200" cy="90" r="9"/><circle cx="265" cy="90" r="9"/></g><g stroke="currentColor" stroke-width="2"><path d="M70 90V50M135 90v40M200 90V50M265 90v40"/></g>'
};
function cwPicKey(title, i) {
  const t = (title || '').toLowerCase();
  if (/new phenom|histor|wave|era/.test(t)) return 'time';
  if (/econom|market|trade|financ|integrat/.test(t)) return /flat|neolib|inequal/.test(t) ? 'chart' : 'trade';
  if (/polit|state|interstate|sovereign|system|govern|un\b|united/.test(t)) return 'inst';
  if (/cultur|individual|people|identity/.test(t)) return 'people';
  if (/tech|digital/.test(t)) return 'tech';
  return ['globe', 'network', 'chart', 'trade'][i % 4];
}
function cwPic(key, cap) {
  return `<figure class="cw-fig"><svg viewBox="0 0 320 180" role="img" aria-label="${esc(cap || 'Illustration')}">${CW_PICS[key]}</svg>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
}

function cwDeck(n, title) {
  const d = CW_DEEP[n], L = d.lessons, more = CW_MORE[n], refs = CW_REFS[n];
  const short = (t, max) => { if (t.length <= max) return t; const c = t.slice(0, max); const k = c.lastIndexOf('. '); return (k > 60 ? c.slice(0, k + 1) : c.replace(/\s\S*$/, '') + '...'); };
  const S = [];
  S.push({ t: title || 'Module ' + n, sub: 'The Contemporary World - Module ' + n, pic: 'globe', big: true });
  S.push({ t: 'Learning Outcomes', b: d.outcomes, pic: 'time' });
  S.push({ t: 'Module Overview', p: d.overview, pic: 'network' });
  let two = L.map(() => true);
  const total = () => 3 + two.reduce((a, x) => a + (x ? 2 : 1), 0) + 1;
  for (let i = L.length - 1; i >= 0 && total() > 15; i--) two[i] = false;
  L.forEach((l, i) => {
    const key = cwPicKey(l[0], i);
    S.push({ t: l[0], p: short(l[1][0], 300), pic: key });
    if (two[i]) S.push({ t: l[0] + ': Key Points', b: l[2], pic: key });
  });
  const extras = [{ t: 'Refs', k: 'refs' }, { t: 'd1', k: 'd1' }, { t: 'd2', k: 'd2' }];
  extras.forEach(x => { if (S.length < 14) {
    if (x.k === 'refs') S.push({ t: 'Key References', b: refs.slice(0, 3), pic: 'inst', small: true });
    else S.push({ t: 'Going Deeper', p: short(more[x.k === 'd1' ? 0 : 1], 330), pic: 'people' });
  } });
  S.push({ t: 'Review Questions', b: L.slice(0, 4).map((l, i) => `Explain: ${l[0]}.`), pic: 'chart' });
  while (S.length < 15) S.push({ t: 'Key Takeaway', p: d.overview, pic: 'globe' });
  return S.slice(0, 15);
}
function cwSlidesHTML(n, title) {
  const deck = cwDeck(n, title);
  return `<h2>Lesson Slides</h2><p class="cw-slides-note">${deck.length} slides. Scroll to read them all.</p>
   <div class="cw-deck">${deck.map((s, i) => `<section class="cw-slide ${s.big ? 'big' : ''}">
     <span class="cw-slide-no">${i + 1} / ${deck.length}</span>
     <div class="cw-slide-txt"><h3>${esc(s.t)}</h3>${s.sub ? `<p>${esc(s.sub)}</p>` : ''}${s.p ? `<p>${esc(s.p)}</p>` : ''}${s.b ? `<ul>${s.b.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>
     <div class="cw-slide-pic">${cwPic(s.pic).replace(/<figure[^>]*>|<\/figure>/g, '')}</div></section>`).join('')}</div>`;
}

document.addEventListener('click', (e) => {
  if (!cwView) return;
  const b = e.target.closest('[data-cw-toggle]');
  if (!b) return;
  e.stopPropagation();
  cwView.panelOpen = !cwView.panelOpen;
  const body = b.closest('.cw-body'); if (!body) return cwRender();
  body.classList.toggle('panel-closed', !cwView.panelOpen);
  b.innerHTML = iconSVG(cwView.panelOpen ? 'chevronLeft' : 'chevronRight');
  b.setAttribute('aria-label', (cwView.panelOpen ? 'Hide' : 'Show') + ' sections panel');
}, true);

cwFinishScreen = function (v) {
  const { mod, m } = v;
  const next = mod.modules.find(x => x.n === m.n + 1 && cwIsOpenable(mod, x));
  const lessons = CW_DEEP[m.n].lessons.length;
  return `<div class="cw-done">
    <div class="cw-done-badge">${iconSVG('check')}</div>
    <span class="cw-kicker">Module ${m.n} complete</span>
    <h1>Great work!</h1>
    <p class="cw-done-sub">You finished <b>${esc(m.title)}</b>.</p>
    <div class="cw-done-stats">
      <div><b>${v.sections.length}</b><span>Sections</span></div>
      <div><b>${lessons}</b><span>Lessons</span></div>
      <div><b>15</b><span>Slides</span></div>
    </div>
    ${next ? `<div class="cw-next-card">
      <span class="cw-next-label">Up next</span>
      <h3>Module ${next.n}: ${esc(next.title)}</h3>
      <p>${esc(next.desc)}</p>
      <button type="button" class="cw-next-btn" data-cw-nextmod="${next.n}"><span>Start Module ${next.n}</span>${iconSVG('chevronRight')}</button>
    </div>` : `<p class="cw-done-sub">You have reached the last available module for now.</p>`}
    <button type="button" class="cw-done-back" data-cw-close>Back to class</button>
  </div>`;
};

;

const _cwBase = window.__cwBody17, _cwRow18 = moduleRowHTML, _cwRender19 = cwRender;

const cwFinKey = (id, n) => `lms_cw_finished_${id}_${n}`;
function cwRecount(mod) { mod.watched = mod.modules.filter(x => store.get(cwFinKey(mod.id, x.n), false)).length; }
(function () {
  if (store.get('lms_cw_reset_v3', false)) return;
  state.modules.filter(x => x.category === CW_FAMILY).forEach(mod => {
    mod.modules.forEach(m => { cwSetProgress(mod.id, m.n, []); store.set(cwFinKey(mod.id, m.n), false); });
    mod.watched = 0;
  });
  persist(); store.set('lms_cw_reset_v3', true);
})();
moduleRowHTML = function (mod, m, done) {
  if (mod.category === CW_FAMILY && cwIsOpenable(mod, m)) done = !!store.get(cwFinKey(mod.id, m.n), false);
  return _cwRow18(mod, m, done);
};
document.addEventListener('click', (e) => {
  if (!cwView || !e.target.closest('[data-cw-finish]')) return;
  store.set(cwFinKey(cwView.mod.id, cwView.m.n), true); cwRecount(cwView.mod); persist();
}, false);

const CW_GOSPEL = {
 1: { ref: 'John 17:20-23', ver: 'KJV', text: ['Neither pray I for these alone, but for them also which shall believe on me through their word; That they all may be one; as thou, Father, art in me, and I in thee, that they also may be one in us: that the world may believe that thou hast sent me.', 'And the glory which thou gavest me I have given them; that they may be one, even as we are one: I in them, and thou in me, that they may be made perfect in one; and that the world may know that thou hast sent me, and hast loved them, as thou hast loved me.'],
   more: ['Jesus prays for unity among all who believe. Unity here does not mean sameness: it means a shared life rooted in love. In a globalized world where we are connected to strangers everywhere, this prayer asks whether our connection can become real solidarity.'] },
 2: { ref: 'Acts 2:5-11', ver: 'KJV', text: ['And there were dwelling at Jerusalem Jews, devout men, out of every nation under heaven. Now when this was noised abroad, the multitude came together, and were confounded, because that every man heard them speak in his own language.', 'And they were all amazed and marvelled, saying one to another, Behold, are not all these which speak Galilaeans? And how hear we every man in our own tongue, wherein we were born? Parthians, and Medes, and Elamites, and the dwellers in Mesopotamia, and in Judaea, and Cappadocia, in Pontus, and Asia, Phrygia, and Pamphylia, in Egypt, and in the parts of Libya about Cyrene, and strangers of Rome, Jews and proselytes, Cretes and Arabians, we do hear them speak in our tongues the wonderful works of God.'],
   more: ['At Pentecost the message reaches people of many nations, each in their own language. Difference is not erased; it is honored. This is a good picture of what healthy global culture could look like.'] },
 3: { ref: 'Matthew 25:31-46', ver: 'Class reading', date: 'Monday of the First Week of Lent', text: ['"When the Son of man comes in his glory, and all the angels with him, then he will sit on his glorious throne. Before him will be gathered all the nations, and he will separate them one from another as a shepherd separates the sheep from the goats, and he will place the sheep at his right hand, but the goats at the left. Then the King will say to those at his right hand, \'Come, O blessed of my Father, inherit the kingdom prepared for you from the foundation of the world; for I was hungry and you gave me food, I was thirsty and you gave me drink, I was a stranger and you welcomed me, I was naked and you clothed me, I was sick and you visited me, I was in prison and you came to me.\'', 'Then the righteous will answer him, \'Lord, when did we see you hungry and feed you, or thirsty and give you drink? And when did we see you a stranger and welcome you, or naked and clothe you? And when did we see you sick or in prison and visit you?\' And the King will answer them, \'Truly, I say to you, as you did it to one of the least of these my brethren, you did it to me.\'"'],
   more: ['Do you allow the love of God to rule in your heart? Jesus\' story of the sheep and the goats teaches that we are judged not only for the wrong we have done but also for what we have failed to do. The parable judges us.', 'When Martin of Tours, a young Roman soldier, met a man begging in the freezing cold, he cut his coat in two and gave half to the stranger. That night he dreamt of Jesus wearing the torn cloak, who said, "My servant Martin gave it to me." When we do something for one of Christ\'s little ones, we do it for Christ. As you study markets and trade, ask who the "least of these" are.'],
   prayer: 'Lord Jesus, be the Master and Ruler of my heart. May your love rule in my heart that I may only think and act with charity towards all.', source: 'dailyscripture.servantsoftheword.org', tags: '#beingChurchinCampus #livingJesusinourhearts #dailygospel' },
 4: { ref: 'Matthew 22:15-21', ver: 'KJV', text: ['Then went the Pharisees, and took counsel how they might entangle him in his talk. And they sent out unto him their disciples with the Herodians, saying, Master, we know that thou art true, and teachest the way of God in truth, neither carest thou for any man: for thou regardest not the person of men.', 'Tell us therefore, What thinkest thou? Is it lawful to give tribute unto Caesar, or not? But Jesus perceived their wickedness, and said, Why tempt ye me, ye hypocrites? Shew me the tribute money. And they brought unto him a penny. And he saith unto them, Whose is this image and superscription? They say unto him, Caesar\'s. Then saith he unto them, Render therefore unto Caesar the things which are Caesar\'s; and unto God the things that are God\'s.'],
   more: ['Jesus answers a question about political authority without making the state everything or nothing. The state has a real but limited claim on us. This is a useful starting point for thinking about sovereignty.'] },
 5: { ref: 'Matthew 20:25-28', ver: 'KJV', text: ['But Jesus called them unto him, and said, Ye know that the princes of the Gentiles exercise dominion over them, and they that are great exercise authority upon them.', 'But it shall not be so among you: but whosoever will be great among you, let him be your minister; And whosoever will be chief among you, let him be your servant: Even as the Son of man came not to be served, but to minister, and to give his life a ransom for many.'],
   more: ['Jesus contrasts rule by domination with leadership as service. Global institutions hold great power; this reading asks whether that power serves the people it affects.'] }
};

const CW_LESSON_TEXT = {
 '4-1': [
  ['p', 'The traditional idea of the state has its origin in the Treaty of Westphalia, entered into by different states in 1648. It effectively diminished the power of the Roman Catholic Church and the Holy Roman Empire, and it cemented the sovereignty of the state.'],
  ['h', 'The idea of the state in the Treaty of Westphalia (1648)'],
  ['p', 'According to Patton (2019), the treaty resolved three major issues: (a) religious freedom was officially recognized, establishing the separation of church and state; (b) international diplomacy was laid down as a way of resolving conflicts instead of war; and (c) most important, the principle of the sovereignty of the state was solidified. It was in this treaty that the state was established as a sovereign political entity (Suter 2003, 17).'],
  ['p', 'Article LXIV of the treaty states:'],
  ['q', 'And to prevent for the future any Differences arising in the Politick State, all and every one of the Electors, Princes and States of the Roman Empire, are so establish\'d and confirm\'d in their antient Rights, Prerogatives, Libertys, Privileges, free exercise of Territorial Right, as well Ecclesiastick, as Politick Lordships, Regales, by virtue of this present Transaction: that they never can or ought to be molested therein by any whomsoever upon any manner of pretence.', 'https://avalon.law.yale.edu/17th_century/westphal.asp'],
  ['p', 'Accordingly, the treaty established the rights of the state, including (a) territorial right, (b) religious right, (c) political right, and (d) the right against interference from the church, the empire, and other states. In short, it established the right to sovereignty.'],
  ['p', 'Article LXV gave the states a voice: they were to enjoy the right of suffrage in all deliberations touching the affairs of the Empire, including making and interpreting laws, declaring wars, imposing taxes, quartering soldiers, building fortifications, and concluding alliances. Before this, states in the Empire were simply recipients of the Empire\'s decisions.'],
  ['h', 'How sovereignty was strengthened'],
  ['p', 'Sovereignty was formally recognized in 1648, but it was strengthened through deliberate effort involving five mutually reinforcing developments: national consolidation of power, creation of a national sense of loyalty, erosion of the natural law to which rulers were accountable, creation of a system of national laws, and the concept of the sovereign equality of nation-states (Suter 2003, 20). States built loyalty through national symbols such as the flag, the anthem, and national holidays.'],
  ['p', 'As the church\'s power over the state declined, the divine law theory and the natural law theory eroded, giving rise to a positivist view of society. The nation-state was bound only by the laws it created or the international treaties it agreed to accept. States could not be forced to accept a treaty they did not like (Suter 2003, 22).'],
  ['h', 'From divine authority to the social contract'],
  ['p', 'The treaty paved the way to the secularization of the state: political power moved from the divine to the human. Thomas Hobbes\' Leviathan (1651) pictures a society in which the sovereign\'s powers come from a social contract. John Locke\'s Second Treatise of Government (1690) holds that sovereignty resides in the people, and that government is accountable to them, not to a divine entity.'],
  ['p', 'Exercising sovereignty, the state has the power to enact laws that are enforceable within its territory. The sovereign is accountable only to the people, not to external entities, and it has the right against interference from any foreign institution or state.'],
  ['v', 'ppoKyDh4VK8', 'Learn more about the Treaty of Westphalia in this short video']
 ]
};

const CW_WIKI = {
 1: [['Globalization', 'Globalisation'], ['Cultural_globalization', 'Economic_globalization'], ['Silk_Road', 'Manila_galleon'], ['Overseas_Filipinos', 'Remittance']],
 2: [['Global_value_chain', 'International_trade'], ['United_Nations_General_Assembly', 'United_Nations'], ['Jollibee', 'Cultural_globalization'], ['Submarine_communications_cable', 'Internet']],
 3: [['Economic_globalization', 'Container_ship'], ['The_World_Is_Flat', 'Thomas_L._Friedman'], ['Neoliberalism', 'Washington_Consensus'], ['International_Monetary_Fund', 'World_Bank'], ['Anti-globalization_movement', 'Global_inequality'], ['Sweatshop', 'Global_inequality']],
 4: [['Westphalian_sovereignty', 'International_relations'], ['Peace_of_Westphalia'], ['Sovereignty', 'Leviathan_(Hobbes_book)'], ['Nation-state', 'Flag'], ['Hegemony', 'Bretton_Woods_system']],
 5: [['Global_governance', 'United_Nations'], ['United_Nations_Headquarters', 'United_Nations_Security_Council'], ['ASEAN', 'European_Union'], ['Non-governmental_organization', 'Civil_society'], ['Climate_change', 'Paris_Agreement']]
};
const cwImgCache = {};
async function cwWikiImg(title) {
  if (title in cwImgCache) return cwImgCache[title];
  try {
    const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title));
    const j = await r.json();
    const src = j.thumbnail && j.thumbnail.source ? j.thumbnail.source.replace(/\/\d+px-/, '/900px-') : null;
    cwImgCache[title] = src ? { src, page: j.content_urls.desktop.page, name: j.title } : null;
  } catch (e) { cwImgCache[title] = null; }
  return cwImgCache[title];
}
async function cwHydrate() {
  for (const fig of document.querySelectorAll('.cw-photo[data-wiki]')) {
    for (const t of fig.dataset.wiki.split('|')) {
      const im = await cwWikiImg(t);
      if (im) {
        fig.innerHTML = `<img src="${im.src}" alt="${esc(im.name)}" loading="lazy"><figcaption>Photo: ${esc(im.name)} - <a href="${im.page}" target="_blank" rel="noopener">Wikipedia / Wikimedia Commons</a></figcaption>`;
        fig.removeAttribute('data-wiki'); break;
      }
    }
    if (fig.dataset.wiki) fig.remove();
  }
}
cwRender = function () { _cwRender19(); cwHydrate(); };

function cwBlocks(bl) {
  return bl.map(b => b[0] === 'h' ? `<h3 class="cw-h3">${esc(b[1])}</h3>`
    : b[0] === 'q' ? `<blockquote class="cw-source">${esc(b[1])}<cite>Source: <a href="${b[2]}" target="_blank" rel="noopener">${esc(b[2])}</a></cite></blockquote>`
    : b[0] === 'v' ? `<div class="cw-videoblock"><p>${esc(b[2])}:</p><div class="cw-embed"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${b[1]}" title="Video" allowfullscreen></iframe></div><a class="cw-ext" target="_blank" rel="noopener" href="https://youtu.be/${b[1]}">https://youtu.be/${b[1]}</a></div>`
    : `<p>${esc(b[1])}</p>`).join('');
}
cwSectionBody = function (v, s) {
  const n = v.m.n, d = CW_DEEP[n], crumb = `<div class="cw-crumb">Module ${n}: ${esc(v.m.title)}</div>`;
  if (s.kind === 'slides') return crumb + cwSlideShow(n, v.m.title, 0);
  if (s.kind === 'prayer') {
    const g = CW_GOSPEL[n];
    return `${crumb}<h2>Gospel Reading / Reflection / Prayer</h2>
     <div class="cw-gospel"><div class="cw-gospel-band"><span>Daily Gospel</span></div>
      <div class="cw-gospel-main"><h3>${esc(g.ref)}</h3>${g.date ? `<div class="cw-gospel-date">${esc(g.date)}</div>` : ''}${g.text.map(t => `<p>${esc(t)}</p>`).join('')}<div class="cw-gospel-ver">${esc(g.ver)}</div></div></div>
     <h3 class="cw-h3">Reflection</h3>${(g.more || []).map(t => `<p>${esc(t)}</p>`).join('')}<blockquote>${esc(d.reflect)}</blockquote>
     <h3 class="cw-h3">Prayer</h3><blockquote class="cw-prayer">${esc(g.prayer || d.prayer)}</blockquote>
     ${g.source ? `<p class="cw-small">Source: ${esc(g.source)}<br>${esc(g.tags || '')}</p>` : ''}`;
  }
  if (s.kind === 'lesson') {
    const l = d.lessons[s.idx], more = CW_MORE[n], i = s.idx % more.length, body = CW_LESSON_TEXT[n + '-' + s.idx];
    const wiki = (CW_WIKI[n][s.idx] || CW_WIKI[n][0]).join('|');
    return `${crumb}<div class="cw-lessonline">Lesson ${s.idx + 1} of ${d.lessons.length}: ${esc(l[0])}</div><h2>${esc(l[0])}</h2>
      <figure class="cw-photo" data-wiki="${wiki}"><div class="cw-photo-ph">Loading photo...</div></figure>
      ${body ? cwBlocks(body) : l[1].map(p => `<p>${esc(p)}</p>`).join('') + `<h3 class="cw-h3">Going deeper</h3><p>${esc(more[i])}</p>`}
      <h3 class="cw-h3">Key points</h3><ul class="cw-keys">${l[2].map(k => `<li>${esc(k)}</li>`).join('')}</ul>
      <h3 class="cw-h3">Think about it</h3><ol class="cw-list"><li>In your own words, what is <b>${esc(l[0])}</b>?</li><li>Give one example from the Philippines.</li><li>Who benefits and who is left out?</li></ol>`;
  }
  let html = _cwBase(v, s);
  if (typeof CW_GLOBE !== 'undefined') html = html.split(CW_GLOBE).join('');
  return crumb + html;
};

function cwSimpleDeck(n, title) {
  const sents = t => (t.match(/[^.!?]+[.!?]+/g) || [t]).slice(0, 3).map(x => x.trim());
  return cwDeck(n, title).map((s, i) => ({ t: s.t, sub: s.sub, b: s.b || (s.p ? sents(s.p) : []), first: i === 0 }));
}
function cwSlideShow(n, title, i) {
  const deck = cwSimpleDeck(n, title), s = deck[i];
  return `<div class="cw-show" data-n="${n}" data-title="${esc(title)}" data-i="${i}">
    <h2>Lesson Slides</h2>
    <div class="cw-frame ${s.first ? 'first' : ''}"><span class="cw-frame-no">${i + 1} / ${deck.length}</span>
      <h3>${esc(s.t)}</h3>${s.sub ? `<p>${esc(s.sub)}</p>` : ''}${s.b.length ? `<ul>${s.b.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>
    <div class="cw-show-nav"><button type="button" class="ghost-btn" data-slide="-1" ${i === 0 ? 'disabled' : ''}>${iconSVG('chevronLeft')} Prev</button>
      <span class="cw-dots">${deck.map((_, k) => `<i class="${k === i ? 'on' : ''}" data-slide-to="${k}"></i>`).join('')}</span>
      <button type="button" class="ghost-btn" data-slide="1" ${i === deck.length - 1 ? 'disabled' : ''}>Next ${iconSVG('chevronRight')}</button></div></div>`;
}
function cwSlideMove(box, to) {
  const n = Number(box.dataset.n), len = 15, i = Math.max(0, Math.min(len - 1, to));
  box.outerHTML = cwSlideShow(n, box.dataset.title, i);
}
document.addEventListener('click', (e) => {
  const box = e.target.closest('.cw-show'); if (!box) return;
  const cur = Number(box.dataset.i), st = e.target.closest('[data-slide]'), dt = e.target.closest('[data-slide-to]');
  if (st && !st.disabled) cwSlideMove(box, cur + Number(st.dataset.slide));
  else if (dt) cwSlideMove(box, Number(dt.dataset.slideTo));
});
document.addEventListener('keydown', (e) => {
  const box = document.querySelector('.cw-show'); if (!box || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  cwSlideMove(box, Number(box.dataset.i) + (e.key === 'ArrowRight' ? 1 : -1));
});
if (cwView) cwRender();

const _cwSections20 = cwSections, _cwBody20 = cwSectionBody, _cwRender20 = cwRender;
cwSections = function (m) { return _cwSections20(m).filter(s => s.kind !== 'readings'); };

cwWikiImg = async function (title) {
  if (title in cwImgCache) return cwImgCache[title];
  try {
    const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title));
    const j = await r.json(), th = j.thumbnail, or = j.originalimage;
    let src = th && th.source;
    if (th && or && or.width >= 800 && !/\.svg$/i.test(or.source)) src = th.source.replace(/\/\d+px-/, '/800px-');
    cwImgCache[title] = src ? { src, thumb: th.source, page: j.content_urls.desktop.page, name: j.title } : null;
  } catch (e) { cwImgCache[title] = null; }
  return cwImgCache[title];
};
cwHydrate = async function () {
  for (const fig of document.querySelectorAll('.cw-photo[data-wiki]')) {
    const list = fig.dataset.wiki.split('|'); fig.removeAttribute('data-wiki');
    let done = false;
    for (const t of list) {
      const im = await cwWikiImg(t); if (!im) continue;
      const ok = await new Promise(res => { const p = new Image(); p.onload = () => res(im.src); p.onerror = () => { const q = new Image(); q.onload = () => res(im.thumb); q.onerror = () => res(null); q.src = im.thumb; }; p.src = im.src; });
      if (!ok) continue;
      fig.innerHTML = `<img src="${ok}" alt="${esc(im.name)}"><figcaption>Photo: ${esc(im.name)} - <a href="${im.page}" target="_blank" rel="noopener">Wikipedia / Wikimedia Commons</a></figcaption>`;
      done = true; break;
    }
    if (!done) fig.remove();
  }
};
cwRender = function () {
  _cwRender20();
  const side = document.querySelector('.cw-side ul'); if (!side) return;
  [['prayer', 'Start'], ['l0', 'Lessons'], ['refs', 'Finish']].forEach(([id, label]) => {
    const b = side.querySelector(`[data-cw-go="${id}"]`); if (!b) return;
    const li = document.createElement('li'); li.className = 'cw-glabel'; b.closest('li').before(li);
  });
};

const CW_LESSONS = {
1: [
 { i: 'Globalization is the process by which people, places, and institutions around the world become more closely connected and more dependent on one another.',
   s: [['What the word means', 'Scholars treat globalization as a process, not a single event. Manfred Steger defines it as the expansion and intensification of social relations and consciousness across world-time and world-space. In plain words: more goods, money, people, information, and ideas cross borders, they move faster, and we increasingly think of ourselves as living in one world.'],
       ['Flows and time-space compression', 'Five flows are usually named: goods, money, people, information, and ideas. Technology makes distance matter less. A video call from Cavite to Dubai takes seconds, and a container ship connects Manila to the United States in a few weeks. Geographers call this shrinking of distance time-space compression.'],
       ['What globalization is not', 'It is not the same as Westernization or Americanization, because flows run in many directions: K-pop travels from Korea, Filipino nurses work in dozens of countries, and Chinese factories supply the world. It is also not equal: some places and people are far more connected than others.']],
   e: 'A call-center agent in Cavite serves customers in the United States during the night, uses software written in several countries, and is paid in dollars that are converted to pesos. Her job exists only because of connections across the world.',
   m: 'Globalization is the growing interconnection and interdependence of the world. It moves many kinds of flows in many directions, and it changes how we experience distance.' },
 { i: 'Globalization has several dimensions - economic, political, cultural, technological, and environmental - and they overlap and reinforce one another.',
   s: [['Economic', 'This is the movement of trade, investment, and finance, and the spread of production across countries through multinational corporations. A single phone may be designed in California, made of minerals from Africa, and assembled in Asia.'],
       ['Political', 'Rules and decisions increasingly come from institutions beyond the state, such as the United Nations, the World Trade Organization, and regional bodies, and from treaties and NGOs. States remain important, but they now share authority.'],
       ['Cultural and technological', 'Food, music, films, religion, and ideas travel through migration, media, and the internet. Scholars debate whether this makes cultures more alike or produces new blends.'],
       ['Environmental and social', 'Climate change and pandemics ignore borders. COVID-19 spread across the world within weeks, which showed how shared our risks are.']],
   e: 'Watching a Korean drama on a streaming platform in Manila involves technology (streaming), economics (subscription business), culture (Korean media), and politics (copyright rules between countries) all at once.',
   m: 'Globalization is not one thing. Its economic, political, cultural, technological, and environmental sides work together, so to understand it we must look at all of them.' },
 { i: 'Historians disagree on whether globalization is new because they define it differently: long-distance links are ancient, but today\'s speed and density are unprecedented.',
   s: [['The case that it is old', 'The Silk Road and Indian Ocean trade linked Asia, Africa, and Europe for centuries. The Manila-Acapulco galleon trade (1565-1815) carried Mexican silver to Manila in exchange for Chinese silk and porcelain, connecting Asia, the Americas, and Europe. Dennis Flynn and Arturo Giraldez date the birth of true world trade to 1571, the year Manila became a trading hub.'],
       ['Waves of globalization', 'A common outline names a first wave from about 1870 to 1914 (steamships, telegraph, mass migration), ended by World War I and the Great Depression; a second wave after 1945 with new institutions and freer trade; and a third wave since the 1990s with the internet and the end of the Cold War.'],
       ['The case that it is new', 'Today communication is instant, financial markets operate around the clock, supply chains cross many countries, and far more people take part than before. The intensity and speed are of a different order.'],
       ['How to decide', 'If globalization means any long-distance connection, it is very old. If it means dense, instant, world-spanning interdependence, it is mostly a late twentieth-century development. Your answer depends on your definition.']],
   e: 'A Filipino in 1700 wearing Chinese silk brought through Manila already lived in a globalized world in one sense, yet could not chat with a cousin in another continent the same day as we can now.',
   m: 'Globalization has deep roots but has changed in scale and speed. Both the "old" and the "new" views are right depending on what we mean by the word.' },
 { i: 'Global processes shape ordinary life, and individuals also take part in and respond to globalization through their work, choices, and relationships.',
   s: [['Globalization in everyday life', 'What we eat, wear, watch, and use is part of global networks. Prices, jobs, and even our ideas about success are affected by events far away.'],
       ['The Filipino experience', 'Millions of Overseas Filipino Workers labor abroad as nurses, seafarers, engineers, and domestic workers, and their remittances are worth tens of billions of dollars each year. The business process outsourcing industry employs many more at home. These bring income and opportunity, but also family separation and vulnerability.'],
       ['Winners, losers, and choices', 'Individuals gain choice, information, and jobs, but may also face job insecurity and cultural pressure. As consumers, workers, and citizens we can respond thoughtfully: by informing ourselves, supporting fair labor practices, and staying connected to our own community.']],
   e: 'An OFW mother in Hong Kong supports her children\'s schooling in Cavite through remittances and video calls. Globalization gives her income and keeps the family linked, yet it also means missed birthdays.',
   m: 'Globalization reaches individuals in daily life. People are both shaped by it and able to shape their response to it.' }
],
2: [
 { i: 'The global economy is a network of trade, finance, and production that crosses borders and is driven as much by firms and markets as by governments.',
   s: [['Trade and production', 'Multinational corporations spread production across countries, creating global value chains: design in one country, parts from another, assembly in a third, and sales everywhere. Electronics and semiconductors are among the Philippines\' top exports, and BPO is a major service industry.'],
       ['Finance', 'Money moves across borders in seconds through banks, stock markets, and currency markets. This allows investment to flow to new places, but it also lets crises spread. The 1997 Asian financial crisis began in Thailand and quickly hit the Philippines and other neighbors.'],
       ['Who benefits', 'The global economy has produced growth, jobs, and cheaper goods, but the gains are unevenly shared among countries, firms, and workers.']],
   e: 'A smartphone bought in Manila is a product of a value chain touching many countries; the profit from it is divided very unequally among those who made it.',
   m: 'The global economy links production, trade, and finance across borders. It creates wealth and risk at the same time.' },
 { i: 'Political decisions are increasingly made or shaped beyond the nation-state, by international organizations, treaties, and non-state actors.',
   s: [['States still matter', 'States remain the main political units: they make laws, control territory, and sign treaties. But problems like climate change, terrorism, and financial crises cannot be solved by one state alone.'],
       ['International organizations and treaties', 'Bodies such as the United Nations, the WTO, and ASEAN set rules and coordinate action. Treaties like the Paris Agreement on climate bind states that agree to them.'],
       ['Non-state actors', 'NGOs, advocacy networks, multinational corporations, and even criminal or terrorist groups influence world politics. Groups such as Amnesty International and Greenpeace shape agendas and public opinion across borders.']],
   e: 'In July 2016 an arbitral tribunal under the UN Convention on the Law of the Sea ruled on a case brought by the Philippines about the South China Sea. It shows how a state uses international law and institutions to defend its interests.',
   m: 'Global politics is a mix of sovereign states, international institutions, and non-state actors, all shaping decisions that affect ordinary people.' },
 { i: 'Global culture is the spread and mixing of ideas, symbols, and practices across borders; scholars debate whether it makes cultures alike, opposed, or blended.',
   s: [['Homogenization', 'George Ritzer\'s McDonaldization thesis argues that efficiency, predictability, and control spread from fast-food restaurants to the whole of society, making places look alike. Critics call this cultural imperialism.'],
       ['Polarization', 'Some argue that cultural contact provokes conflict and backlash, as in Samuel Huntington\'s "clash of civilizations" thesis, and in movements that defend local identity against outside influence.'],
       ['Hybridization', 'Roland Robertson\'s glocalization and Jan Nederveen Pieterse\'s "global mélange" describe how global forms are adapted and mixed with local ones, producing something new.']],
   e: 'Fast-food chains in the Philippines sell rice meals and sweet spaghetti, and Jollibee has grown into a global brand in countries such as the United States. Culture flows both ways.',
   m: 'Culture does not simply become uniform. Global and local forces meet, and the results include sameness, conflict, and creative blending.' },
 { i: 'Digital technology is the backbone that lets economic, political, and cultural globalization happen at high speed.',
   s: [['The networks', 'The internet, undersea fiber-optic cables, mobile phones, and cloud platforms carry money, information, and work across the world instantly. Nearly all international internet traffic travels through submarine cables.'],
       ['What technology enables', 'It allows remittances to be sent in minutes, remote work and online learning, and rapid political organizing. In January 2001, text messages helped gather crowds for EDSA II in the Philippines.'],
       ['The digital divide and other risks', 'Not everyone has equal access: rural, poor, and older people are often left out. Technology also brings misinformation, privacy loss, and surveillance, so digital literacy and fair access matter.']],
   e: 'Students in a province with weak internet cannot join online classes as easily as those in Metro Manila. Technology connects the world but not everyone equally.',
   m: 'Technology makes the other structures of globalization possible, but access to it is unequal and carries its own risks.' }
],
3: [
 { i: 'Economic globalization is the growing integration of national economies through trade, investment, finance, production, and the movement of labor and technology.',
   s: [['Meaning', 'Economies become so tied together that events in one place affect others. It is measured by things like trade as a share of production, foreign direct investment, and the flow of capital.'],
       ['Market integration', 'Integration grows when barriers fall: tariffs and quotas are reduced, free trade agreements are signed, and rules on investment and services are opened. Goods, capital, and services then move more freely.'],
       ['Key actors', 'Multinational firms, states, and institutions such as the WTO, IMF, and World Bank all drive integration, along with consumers and workers who feel its effects.']],
   e: 'The Philippines became a founding member of the WTO in 1995 and has taken part in ASEAN free trade arrangements, opening its markets while gaining access to others.',
   m: 'Economic globalization is the deepening integration of national economies into a global market, driven by falling barriers and powerful actors.' },
 { i: 'Thomas Friedman argues that technology and policy changes have "flattened" the world so that people everywhere can compete and collaborate on more equal terms.',
   s: [['Friedman\'s argument', 'In The World Is Flat (2005), Friedman names ten "flatteners," including the fall of the Berlin Wall in 1989, the rise of the web browser, workflow software, open-source collaboration, outsourcing, offshoring, supply-chaining, and mobile and wireless technology. He describes three eras: globalization 1.0 (countries), 2.0 (companies), and 3.0 (individuals).'],
       ['Critiques', 'Joseph Stiglitz and Dani Rodrik argue that rules of trade were written largely by powerful states. Richard Florida\'s "The World Is Spiky" points out that innovation and wealth cluster in a few cities, so the world is far from flat.']],
   e: 'Philippine BPO firms serve clients abroad, which supports the "flat" idea. Yet high-value design and finance mostly remain in a few rich centers, which supports the "spiky" critique.',
   m: 'The flat-world thesis explains how technology opened opportunity, but critics show that power and wealth remain concentrated.' },
 { i: 'Neoliberalism is the set of ideas - free markets, privatization, deregulation, low taxes, and open trade - that guided the rules of the modern global economy.',
   s: [['Origins', 'After the economic troubles of the 1970s, thinkers such as Friedrich Hayek and Milton Friedman challenged state-led economics. Leaders such as Ronald Reagan and Margaret Thatcher applied their ideas in the 1980s. David Harvey\'s A Brief History of Neoliberalism traces this shift.'],
       ['The Washington Consensus', 'In 1989 economist John Williamson summarized a package of policies favored by the IMF, World Bank, and U.S. Treasury: fiscal discipline, trade liberalization, privatization, and deregulation. These were attached as conditions to many loans.'],
       ['Effects and critique', 'Supporters point to growth and efficiency. Critics point to rising inequality, debt crises, cuts to public services, and loss of national policy freedom. In 1997 Metro Manila\'s water system was privatized into two concessions, a case still debated for its results on service and price.']],
   e: 'A country in debt receives an IMF loan but must cut public spending and open its markets. Its government has less room to protect local farmers or industries.',
   m: 'Neoliberalism shaped the rules of economic globalization. It produced growth for some and hardship for others, and its legacy is still contested.' },
 { i: 'Three institutions - the IMF, the World Bank, and the WTO - set and monitor many of the rules of the global economy.',
   s: [['The IMF', 'Created out of the 1944 Bretton Woods conference, the International Monetary Fund promotes monetary cooperation and stability and lends to countries facing balance-of-payments problems, usually with conditions attached.'],
       ['The World Bank', 'Founded to help rebuild Europe after World War II, it now provides loans and technical help for development and poverty reduction, such as roads, schools, and health projects.'],
       ['The WTO', 'Established in 1995 to replace the GATT of 1947, the World Trade Organization sets trade rules, hosts negotiations, and settles disputes among its more than 160 members.'],
       ['Criticisms', 'Voting power in the IMF and World Bank favors rich countries, loan conditions can limit national choices, and poorer countries say the trade rules favor the wealthy.']],
   e: 'When two countries dispute a tariff, the WTO\'s dispute settlement system can rule on it, which is a form of governance no single state controls.',
   m: 'The IMF, World Bank, and WTO shape global economic rules, and each is praised for cooperation and criticized for unequal power.' },
 { i: 'The evidence is mixed: economic globalization has coincided with big gains on some measures and serious problems on others, so the fair answer depends on whose outcomes and which measures we look at.',
   s: [['The case for success', 'Extreme poverty fell from more than a third of humanity in 1990 to under a tenth by 2019 according to World Bank estimates. Export-led growth in East Asia lifted hundreds of millions of people, and technology and cheaper goods spread widely.'],
       ['The case for failure', 'Inequality rose within many countries. Branko Milanovic\'s "elephant curve" shows weaker income growth for the lower-middle class in rich countries. Financial crises in 1997 and 2008 caused great harm, and environmental costs are high.'],
       ['A middle view', 'Dani Rodrik\'s "globalization paradox" argues that countries cannot have deep global integration, national sovereignty, and democratic politics all at once; they must choose how to balance them. Good rules and social protection make a difference.']],
   e: 'Vietnam gained from joining global supply chains, while factory towns in some rich countries lost jobs. The same process created winners and losers.',
   m: 'Economic globalization is neither a pure success nor a pure failure. Results depend on the rules, the policies, and who is counted.' },
 { i: 'The costs and gains of globalization are not evenly shared: farmers, informal workers, women, indigenous peoples, and small producers often carry more risk.',
   s: [['Farmers and small producers', 'Cheap imports can undercut local producers. The Rice Tariffication Law of 2019 opened the Philippines to more imported rice, and many rice farmers said they struggled to compete.'],
       ['Workers', 'Contractual work, low wages, and unsafe conditions are common in global supply chains. The 2013 Rana Plaza factory collapse in Bangladesh killed more than a thousand garment workers and exposed these risks.'],
       ['Women, migrants, indigenous peoples', 'Many women migrate for care work, migrants face abuse, and indigenous communities can lose land to large investments. Some also find new opportunities.'],
       ['A moral response', 'Catholic social teaching calls for a preferential option for the poor, the common good, and the universal destination of goods. Practical responses include fair trade, labor standards, and social protection.']],
   e: 'A rice farmer in Nueva Ecija faces cheaper imported rice, while a consumer in Manila enjoys lower prices. The gains and costs fall on different people.',
   m: 'Globalization\'s burdens fall hardest on the vulnerable, so justice requires rules and policies that protect them.' }
],
4: [
 { i: 'The interstate system is the network of relations among sovereign states that organizes world politics.',
   s: [['What it is', 'States are its basic units. There are about 193 UN member states. They recognize each other, exchange diplomats, sign treaties, trade, and sometimes fight. There is no world government above them.'],
       ['Key features', 'Sovereignty, defined territory, mutual recognition, diplomacy, international law, and a balance of power among states.'],
       ['An unequal system', 'Immanuel Wallerstein\'s world-systems analysis divides the world into a core, a semi-periphery, and a periphery. States are formally equal but hold very unequal power.']],
   e: 'The Philippines, an original UN member in 1945, keeps embassies abroad, signs treaties, and belongs to ASEAN, all ways of taking part in the interstate system.',
   m: 'The interstate system is a society of sovereign states without a world government, and power within it is very uneven.' },
 { i: 'The 1648 treaties are commonly credited with establishing the idea that each state is supreme within its own territory.',
   s: [['See the reading below', 'This lesson follows the class reading on the Westphalian idea of the state.']], e: '', m: '' },
 { i: 'Sovereignty is supreme authority within a territory and independence from outside control; the state is the political body that claims it.',
   s: [['Elements of a state', 'The 1933 Montevideo Convention lists four: a permanent population, a defined territory, a government, and the capacity to enter relations with other states.'],
       ['Two faces of sovereignty', 'Internal sovereignty is supreme authority inside the territory. External sovereignty is independence from outside control and equality among states. The Philippine Constitution states that sovereignty resides in the people.'],
       ['Sovereignty in practice', 'Stephen Krasner shows that sovereignty has always been compromised in practice, calling this "organized hypocrisy." He separates legal recognition, control of borders, domestic authority, and the effects of interdependence.']],
   e: 'A state may be legally sovereign yet unable to control capital flows or climate effects. Its recognition is full, but its control is partial.',
   m: 'Sovereignty is central to the state, but in reality it is limited and shared.' },
 { i: 'Globalization challenges but does not end the nation-state; states adapt, share authority, and sometimes reassert control.',
   s: [['The nation-state', 'A nation-state joins a state with a people who feel they belong together. Benedict Anderson called nations "imagined communities" because members never meet most of their fellow citizens.'],
       ['Pressures', 'Mobile capital, multinational firms, international law, migration, and climate change limit what a single state can do. In the European Union, states pool part of their sovereignty.'],
       ['Resilience', 'States remain the actors that make and enforce rules. COVID-19 border closures, sanctions, tariffs, and industrial policies show their continued power.']],
   e: 'Brexit, the United Kingdom\'s exit from the European Union, was defended as taking back control, an attempt to reassert national sovereignty.',
   m: 'The nation-state has been reshaped, not replaced, by globalization.' },
 { i: 'Hegemony is leadership or dominance by one state within the system; hegemons shape the rules, and power shifts over time.',
   s: [['Meaning and examples', 'Britain in the nineteenth century and the United States after 1945 are classic hegemons. The US helped build the Bretton Woods system, NATO, and the dollar-based economy. Antonio Gramsci stressed that hegemony works through consent as well as force.'],
       ['Today', 'The rise of China, including the Belt and Road Initiative launched in 2013, along with Russia and the European Union, points toward a more multipolar world.'],
       ['Small and middle powers', 'States like the Philippines must balance relationships. It holds a 1951 Mutual Defense Treaty with the United States while China is a major trading partner.']],
   e: 'The Philippines\' position in the South China Sea dispute shows how a middle power manages relations with rival great powers.',
   m: 'Hegemony organizes the international order, but no hegemon lasts forever, and smaller states must navigate shifting power.' }
],
5: [
 { i: 'Global governance is the way problems that cross borders are managed through rules, institutions, and cooperation, even though there is no world government.',
   s: [['Governance versus government', 'James Rosenau described "governance without government": order produced through norms, treaties, and networks rather than one central authority with a police force.'],
       ['The actors', 'States, intergovernmental organizations, NGOs, firms, and expert networks all take part.'],
       ['Why it is needed', 'Climate change, pandemics, financial stability, nuclear weapons, migration, and trade are collective problems that no state can solve alone.']],
   e: 'The 1987 Montreal Protocol, which phased out ozone-damaging chemicals, is widely seen as one of the most successful examples of global governance.',
   m: 'Global governance is cooperation to manage shared problems without a world state.' },
 { i: 'The United Nations, founded in 1945, is the main general-purpose organization for peace, development, and human rights.',
   s: [['Origins and aims', 'Founded on 24 October 1945 after World War II, it began with 51 members, including the Philippines. Its Charter aims to maintain peace, promote cooperation, and protect human rights.'],
       ['Main organs', 'The General Assembly has all members with one vote each. The Security Council has 15 members, five of them permanent with a veto: the United States, United Kingdom, France, Russia, and China. There are also the Secretariat led by the Secretary-General, the International Court of Justice, and the Economic and Social Council.'],
       ['Work and criticism', 'Agencies such as UNICEF, WHO, and UNESCO, peacekeeping missions, and the 1948 Universal Declaration of Human Rights are major achievements. Critics point to veto paralysis, a Council that reflects 1945, and weak enforcement.']],
   e: 'Carlos P. Romulo of the Philippines served as President of the UN General Assembly in 1949-50 and helped shape the postwar human rights order.',
   m: 'The UN is central to global governance, with real achievements and well-known limits.' },
 { i: 'Regional organizations bring neighboring states together to cooperate on security, trade, and politics, a level between the national and the global.',
   s: [['Why regionalism', 'Neighbors share problems and can pool strength. Regional groups can act faster and closer to home than global bodies.'],
       ['The European Union', 'The EU is the deepest example: a single market, a common currency for many members, and shared institutions in which states pool sovereignty.'],
       ['ASEAN', 'The Association of Southeast Asian Nations was founded in 1967 by Indonesia, Malaysia, the Philippines, Singapore, and Thailand. It now has ten members, with Timor-Leste the newest to join. Its "ASEAN way" stresses consensus and non-interference, and it launched the ASEAN Community in 2015.']],
   e: 'ASEAN member states meet regularly on trade, security, and disasters, and Manila has hosted major ASEAN summits.',
   m: 'Regional organizations are a practical middle layer of governance, each with its own style and depth of integration.' },
 { i: 'Global civil society consists of citizen groups and NGOs that act across borders to influence governance and defend causes.',
   s: [['Who they are', 'NGOs such as Amnesty International, Greenpeace, Oxfam, the Red Cross, and Caritas, along with unions, faith groups, and social movements.'],
       ['What they do', 'They advocate, deliver services, monitor governments, and set agendas. The International Campaign to Ban Landmines helped win the 1997 Ottawa Treaty and a Nobel Peace Prize, and the Jubilee 2000 campaign pushed for debt relief.'],
       ['Limits', 'They face questions about funding, accountability, and whom they represent. Faith voices, such as Pope Francis\'s encyclical Laudato Si\' (2015) on the care of our common home, also add moral weight.']],
   e: 'A Philippine parish joins Caritas in disaster relief after a typhoon, a local action linked to a global network.',
   m: 'Civil society gives citizens a voice in global affairs, though its legitimacy must be earned.' },
 { i: 'Global governance faces problems bigger than current institutions can easily manage, and this tests our ability to cooperate.',
   s: [['Climate change', 'The 2015 Paris Agreement relies on voluntary national pledges, and the free-rider problem makes cooperation hard.'],
       ['Pandemics', 'COVID-19 revealed the limits of the World Health Organization and the unequal distribution of vaccines.'],
       ['Power and legitimacy', 'Great-power rivalry, Security Council vetoes, rising nationalism, and new needs such as cyber and artificial intelligence rules strain the system.'],
       ['What can help', 'Reform and fairer representation, the principles of solidarity and subsidiarity in Catholic social teaching, and active citizens who hold leaders to account.']],
   e: 'The Philippines is among the most disaster-exposed countries; Typhoon Haiyan in 2013 showed why a country on the front line needs strong global climate action.',
   m: 'Today\'s challenges demand stronger cooperation, and each of us has a part in building it.' }
]};

cwSectionBody = function (v, s) {
  if (s.kind !== 'lesson') return _cwBody20(v, s);
  const n = v.m.n, sample = CW_LESSON_TEXT[n + '-' + s.idx], L = (CW_LESSONS[n] || [])[s.idx];
  if (sample || !L) return _cwBody20(v, s);
  const d = CW_DEEP[n], l = d.lessons[s.idx], wiki = (CW_WIKI[n][s.idx] || CW_WIKI[n][0]).join('|');
  return `<div class="cw-crumb">Module ${n}: ${esc(v.m.title)}</div><div class="cw-lessonline">Lesson ${s.idx + 1} of ${d.lessons.length}</div><h2>${esc(l[0])}</h2>
    <figure class="cw-photo" data-wiki="${wiki}"><div class="cw-photo-ph">Loading photo...</div></figure>
    <div class="cw-idea"><b>The big idea</b><p>${esc(L.i)}</p></div>
    ${L.s.map(x => `<h3 class="cw-h3">${esc(x[0])}</h3><p>${esc(x[1])}</p>`).join('')}
    <div class="cw-example"><b>Example</b><p>${esc(L.e)}</p></div>
    <h3 class="cw-h3">Key points</h3><ul class="cw-keys">${l[2].map(k => `<li>${esc(k)}</li>`).join('')}</ul>
    <div class="cw-summary"><b>In summary</b><p>${esc(L.m)}</p></div>
    <h3 class="cw-h3">Check your understanding</h3><ol class="cw-list"><li>Explain the lesson in your own words: <i>${esc(l[0])}</i>.</li><li>Give one example from the Philippines or your own life.</li><li>Who benefits, and who might be left out?</li></ol>`;
};
if (cwView) cwRender();

const _cwBody21 = cwSectionBody;
const CW_CLOSING = {
 1: { ref: 'Matthew 28:19-20', text: ['Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world.'],
   more: ['Jesus sends his disciples to all nations. Having studied what globalization is, we are reminded that a connected world is also a world to which we are sent: to listen, to serve, and to bring good news through how we live.'],
   prayer: 'Lord, thank you for what we have learned. Let our knowledge of a connected world lead us to care for every person in it. Amen.' },
 2: { ref: 'Mark 12:28-31', text: ['And one of the scribes came, and having heard them reasoning together, and perceiving that he had answered them well, asked him, Which is the first commandment of all?', 'And Jesus answered him, The first of all the commandments is, Hear, O Israel; The Lord our God is one Lord: And thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind, and with all thy strength: this is the first commandment. And the second is like, namely this, Thou shalt love thy neighbour as thyself. There is none other commandment greater than these.'],
   more: ['Economies, politics, cultures, and technologies are structures made by people. The greatest commandment gives us the test for every structure: does it help us love God and our neighbor?'],
   prayer: 'God of every nation, help us shape the structures of our world so that they serve the human person and honor every culture. Amen.' },
 3: { ref: 'Luke 3:10-11', text: ['And the people asked him, saying, What shall we do then? He answereth and saith unto them, He that hath two coats, let him impart to him that hath none; and he that hath meat, let him do likewise.'],
   more: ['The crowd asks a practical question and receives a practical answer: share. After studying markets, trade, and inequality, the lesson is the same. A just economy begins with ordinary acts of sharing and fairness.'],
   prayer: 'Lord, teach us to hold wealth lightly and to see our neighbor in every worker, farmer, and consumer. Amen.' },
 4: { ref: 'John 18:36-37', text: ['Jesus answered, My kingdom is not of this world: if my kingdom were of this world, then would my servants fight, that I should not be delivered to the Jews: but now is my kingdom not from hence.', 'Pilate therefore said unto him, Art thou a king then? Jesus answered, Thou sayest that I am a king. To this end was I born, and for this cause came I into the world, that I should bear witness unto the truth. Every one that is of the truth heareth my voice.'],
   more: ['Before Pilate, Jesus speaks of a kingdom that does not rule by force. States hold real authority, yet no earthly power has the last word. Sovereignty, power, and hegemony all stand under the truth.'],
   prayer: 'Lord of truth, guide those who hold power to use it with justice, and help us to be citizens who bear witness to the truth. Amen.' },
 5: { ref: 'John 13:12-15', text: ['So after he had washed their feet, and had taken his garments, and was set down again, he said unto them, Know ye what I have done to you? Ye call me Master and Lord: and ye say well; for so I am.', 'If I then, your Lord and Master, have washed your feet; ye also ought to wash one another\'s feet. For I have given you an example, that ye should do as I have done to you.'],
   more: ['Jesus, the Master, kneels to wash feet. Governance, whether local or global, is meant to be service. As you close this module, ask how you can serve as a member of your community and of the wider world.'],
   prayer: 'God of justice, bless every effort to govern with fairness and compassion, especially where the voices of the poor go unheard. Amen.' }
};
cwSectionBody = function (v, s) {
  if (s.kind !== 'closing') return _cwBody21(v, s);
  const n = v.m.n, c = CW_CLOSING[n];
  return `<div class="cw-crumb">Module ${n}: ${esc(v.m.title)}</div><h2>End of Module / Closing Prayer</h2>
    <p>You have reached the end of Module ${n}: ${esc(v.m.title)}. Review the key points of each lesson, then close with this reading.</p>
    <div class="cw-gospel"><div class="cw-gospel-band"><span>Daily Gospel</span></div>
     <div class="cw-gospel-main"><h3>${esc(c.ref)}</h3>${c.text.map(t => `<p>${esc(t)}</p>`).join('')}<div class="cw-gospel-ver">KJV</div></div></div>
    <h3 class="cw-h3">Reflection</h3>${c.more.map(t => `<p>${esc(t)}</p>`).join('')}
    <h3 class="cw-h3">Prayer</h3><blockquote class="cw-prayer">${esc(c.prayer)}</blockquote>`;
};
if (cwView) cwRender();

const _cwRender22 = cwRender;
function cwFixVideos() {
  document.querySelectorAll('.cw-embed iframe[src*="youtube"]').forEach(f => {
    const m = f.src.match(/embed\/([\w-]{11})/); if (!m) return;
    const id = m[1], box = f.parentElement;
    if (location.protocol === 'file:') {
      box.classList.add('cw-vthumb');
      box.innerHTML = `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener" aria-label="Watch on YouTube"><img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt=""><span class="cw-vplay">&#9654;</span></a>`;
    } else {
      f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      f.src = `https://www.youtube.com/embed/${id}?rel=0&origin=${encodeURIComponent(location.origin)}`;
    }
  });
}
cwRender = function () { _cwRender22(); cwFixVideos(); };
document.addEventListener('toggle', (e) => { if (e.target.matches && e.target.matches('.cw-dd[open]')) cwFixVideos(); }, true);
if (cwView) cwRender();

const _cwRender23 = cwRender, cwIsSmall = () => window.innerWidth <= 820;
cwRender = function () {
  if (cwView && !cwView._init) { cwView._init = true; if (cwIsSmall()) cwView.panelOpen = false; }
  _cwRender23();
};

document.addEventListener('click', (e) => {
  if (!cwView || !cwIsSmall() || !cwView.panelOpen) return;
  if (e.target.closest('[data-cw-go], [data-cw-start], .cw-main')) {
    if (e.target.closest('.cw-main') && !e.target.closest('[data-cw-start]')) { cwView.panelOpen = false; const b = document.querySelector('.cw-body'); if (b) b.classList.add('panel-closed'); const t = document.querySelector('.cw-collapse'); if (t) t.innerHTML = iconSVG('chevronRight'); }
    else cwView.panelOpen = false;
  }
}, true);
if (cwView) cwRender();
