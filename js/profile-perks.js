const HUB_KEY = 'lms_profile_hub';
const HUB_KEYS = ['awards', 'friends'];
let hubState = Object.assign({ awards: true, friends: true }, store.get(HUB_KEY, null) || {});
function hubApply() {
  document.querySelectorAll('.hub-sec:not(.fixed)').forEach(sec => {
    const on = hubState[sec.dataset.hub] !== false;
    sec.classList.toggle('open', on);
    const h = sec.querySelector('.hub-head'); if (h) h.setAttribute('aria-expanded', String(on));
    const inner = sec.querySelector('.hub-inner'); if (inner) inner.inert = !on;
  });
}
function hubSummaries() {
  const set = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  const rank = (document.getElementById('level-rank') || {}).textContent || '';
  const xp = (document.getElementById('level-xp') || {}).textContent || '';
  set('hub-sum-perks', [rank, xp].filter(Boolean).join(' - '));
  const na = (document.getElementById('awards-count') || {}).textContent || '0';
  set('hub-sum-awards', na + (na === '1' ? ' award' : ' awards'));
  const nf = (document.getElementById('friends-count') || {}).textContent || '0';
  set('hub-sum-friends', nf + (nf === '1' ? ' friend' : ' friends'));
}
(function hubWire() {
  const hub = document.getElementById('profile-hub'); if (!hub) return;
  hub.addEventListener('click', e => {
    const head = e.target.closest('.hub-sec:not(.fixed) > .hub-head');
    if (head) { const k = head.parentElement.dataset.hub; hubState[k] = hubState[k] === false; store.set(HUB_KEY, hubState); hubApply(); return; }
    if (e.target.closest('#hub-expand-all')) { HUB_KEYS.forEach(k => hubState[k] = true); store.set(HUB_KEY, hubState); hubApply(); }
    if (e.target.closest('#hub-collapse-all')) { HUB_KEYS.forEach(k => hubState[k] = false); store.set(HUB_KEY, hubState); hubApply(); }
  });
  const watch = new MutationObserver(hubSummaries);
  ['profile-bio-text', 'awards-count', 'friends-count', 'level-rank', 'level-xp'].forEach(id => {
    const el = document.getElementById(id); if (el) watch.observe(el, { childList: true, characterData: true, subtree: true });
  });
  renderIcons(hub); hubApply(); hubSummaries();
})();;

(function topUpData() {
  const EXTRA_FRIENDS = [['Jamal Reyes', 'Classmate'], ['Priya Nair', 'Classmate'], ['Luis Ortega', 'Friend'], ['Hana Sato', 'Classmate'],
                         ['Marco Villanueva', 'Classmate'], ['Aisha Rahman', 'Friend'], ['Noah Dela Cruz', 'Classmate'], ['Bea Santos', 'Classmate']];
  let fi = 0;
  while (state.friends.length < 10 && fi < EXTRA_FRIENDS.length) {
    const [name, tag] = EXTRA_FRIENDS[fi++];
    if (state.friends.some(f => f.name === name)) continue;
    state.friends.push({ id: 'frx' + fi, name, tag });
  }
  store.set('lms_friends', state.friends);

  const EXTRA_AWARDS = [
    'Module 1 Completion: Web Development', 'Module 2 Completion: Web Development', 'Module 3 Completion: Web Development',
    'Module 1 Completion: Networking 2', 'Module 2 Completion: Networking 2',
    'Module 1 Completion: Information Assurance & Security 1', 'Module 2 Completion: Information Assurance & Security 1', 'Module 3 Completion: Information Assurance & Security 1',
    'Module 1 Completion: Integrative Programming Technologies 1', 'Module 2 Completion: Integrative Programming Technologies 1',
    'Module 3 Completion: Integrative Programming Technologies 1', 'Module 4 Completion: Integrative Programming Technologies 1',
    'Module 1 Completion: Mobile Enterprise Systems', 'Module 2 Completion: Mobile Enterprise Systems', 'Module 1 Completion: IT Professional Elective',
    'Perfect Attendance: Fall Term', 'Perfect Attendance: Summer Term', "Dean's Lister: Term 1", "Dean's Lister: Term 2",
    'Quiz Streak: 5 in a Row', 'Early Submission Badge', 'Discussion Contributor', 'Peer Reviewer Badge',
    'Lab Excellence: Networking 2', 'Lab Excellence: Web Development', 'Community Service Pledge',
    'Course Completion: Networking 1', 'Course Completion: Programming Fundamentals', 'Course Completion: Computer Organization', 'Hackathon Participant'
  ];
  const base = new Date('2026-09-20T00:00:00');
  let k = 0;
  EXTRA_AWARDS.forEach(title => {
    if (state.awards.length >= 35) return;
    if (state.awards.some(a => a.title === title)) { k++; return; }
    const d = new Date(base); d.setDate(d.getDate() - (k++ * 21 + 3));
    state.awards.push({ title, date: d.toISOString().slice(0, 10) });
  });
  state.awards.sort((a, b) => b.date.localeCompare(a.date));
  store.set('lms_awards', state.awards);
})();

const AW_LIMIT = 8; let awardsAll = false;
function awardsMoreUI() {
  const grid = document.getElementById('awards-grid'); if (!grid) return;
  const cards = [...grid.querySelectorAll('.award-card')];
  cards.forEach((c, i) => { c.hidden = !awardsAll && i >= AW_LIMIT; });
  let btn = document.getElementById('awards-more');
  if (!btn) {
    btn = document.createElement('button'); btn.type = 'button'; btn.id = 'awards-more'; btn.className = 'hub-link awards-more';
    btn.addEventListener('click', () => { awardsAll = !awardsAll; awardsMoreUI(); });
    grid.parentNode.appendChild(btn);
  }
  btn.hidden = cards.length <= AW_LIMIT;
  btn.textContent = awardsAll ? 'Show less' : `Show all ${cards.length}`;
}
const _renderAwardsGrid31 = renderAwardsGrid;
renderAwardsGrid = function () { _renderAwardsGrid31(); awardsMoreUI(); };
document.getElementById('awards-count').textContent = state.awards.length;
document.getElementById('friends-count').textContent = state.friends.length;
if (typeof renderFriendsCard === 'function') renderFriendsCard();
renderAwardsGrid();

function perksModalHTML() {
  const credits = creditsFor(), pct = Math.round((credits / CREDIT_CAP) * 100), unlocked = incentivesUnlocked(credits);
  const next = INCENTIVE_TIERS.find(t => credits < t);
  const done = state.modules.reduce((s, m) => s + m.watched, 0), total = state.modules.reduce((s, m) => s + m.total, 0);
  const tiers = INCENTIVE_TIERS.map((t, i) => {
    const ok = credits >= t;
    return `<li class="pk-tier ${ok ? 'ok' : ''}"><span class="pk-dot">${ok ? '&#10003;' : i + 1}</span>
      <div><b>Incentive ${i + 1}</b><small>Unlocks at ${t.toLocaleString()} credits</small></div>
      <span class="pk-state">${ok ? 'Unlocked' : (t - credits).toLocaleString() + ' to go'}</span></li>`;
  }).join('');
  return `<div class="pk-card" role="dialog" aria-modal="true" aria-labelledby="pk-title">
    <button type="button" class="pk-x" id="pk-close" aria-label="Close">&times;</button>
    <div class="pk-top">
      <div class="level-ring" style="--pct:${pct}%"><div class="level-ring-inner"><span class="level-num">${unlocked}</span><span class="level-label">Perks</span></div></div>
      <div><h3 id="pk-title">${esc(perkTierLabel(unlocked))}</h3>
        <p>${credits.toLocaleString()} / ${CREDIT_CAP.toLocaleString()} credits this term</p>
        <p class="pk-next">${next ? (next - credits).toLocaleString() + ' credits to your next incentive' : 'Engagement cap reached for this term'}</p></div>
    </div>
    <div class="pk-bar"><i style="width:${pct}%"></i>${INCENTIVE_TIERS.map(t => `<u style="left:${(t / CREDIT_CAP) * 100}%"></u>`).join('')}</div>
    <h4>Incentive tiers</h4><ul class="pk-tiers">${tiers}</ul>
    <h4>How credits work</h4>
    <ul class="pk-list">
      <li>Finish a module to earn credits. Each module is worth roughly 60 to 150 credits.</li>
      <li>Credits count toward a term cap of ${CREDIT_CAP.toLocaleString()}. Anything past the cap is not added.</li>
      <li>Finals modules stay locked and do not give credits until they open.</li>
    </ul>
    <h4>This term</h4>
    <div class="pk-stats"><div><b>${state.modules.length}</b><span>Courses</span></div><div><b>${state.awards.length}</b><span>Awards</span></div></div>
  </div>`;
}
function openPerks() {
  closePerks();
  const bd = document.createElement('div'); bd.className = 'pk-backdrop'; bd.id = 'pk-backdrop'; bd.innerHTML = perksModalHTML();
  bd.addEventListener('click', e => { if (e.target === bd || e.target.closest('#pk-close')) closePerks(); });
  document.body.appendChild(bd); bd.querySelector('#pk-close').focus();
}
function closePerks() { const b = document.getElementById('pk-backdrop'); if (b) b.remove(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePerks(); });
document.getElementById('perks-open').addEventListener('click', openPerks);
const pcard = document.getElementById('perks-card');
pcard.addEventListener('click', openPerks);
pcard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPerks(); } });
const chip = document.querySelector('.rank-chip');
if (chip) { chip.style.cursor = 'pointer'; chip.setAttribute('role', 'button'); chip.setAttribute('tabindex', '0'); chip.addEventListener('click', openPerks);
  chip.addEventListener('keydown', e => { if (e.key === 'Enter') openPerks(); }); };

(function () {
  const sc = document.querySelector('.profile-card'); if (!sc) return;
  sc.style.cursor = 'pointer'; sc.setAttribute('role', 'button'); sc.setAttribute('tabindex', '0'); sc.setAttribute('aria-label', 'View perks details');
  sc.addEventListener('click', openPerks);
  sc.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPerks(); } });
})();
