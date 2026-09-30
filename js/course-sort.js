const CSORT_KEY = 'lms_course_sort';
const CSORT_OPTIONS = [
  ['default', 'Default order'],
  ['most', 'Most progress first'],
  ['least', 'Least progress first'],
  ['az', 'Name A to Z'],
  ['za', 'Name Z to A']
];
const CSORT_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4v16"/><path d="M3.5 16.5 7 20l3.5-3.5"/><path d="M17 20V4"/><path d="M13.5 7.5 17 4l3.5 3.5"/></svg>';
let courseSort = store.get(CSORT_KEY, 'default');
if (!CSORT_OPTIONS.some(o => o[0] === courseSort)) courseSort = 'default';

const cpct = m => (m.total ? m.watched / m.total : 0);
function csortList(list) {
  const arr = list.slice(), name = m => (m.category || m.title || '').toLowerCase();
  const idx = new Map(list.map((m, i) => [m, i]));
  const by = {
    most: (a, b) => cpct(b) - cpct(a),
    least: (a, b) => cpct(a) - cpct(b),
    az: (a, b) => name(a).localeCompare(name(b)),
    za: (a, b) => name(b).localeCompare(name(a))
  }[courseSort];
  return by ? arr.sort((a, b) => by(a, b) || idx.get(a) - idx.get(b)) : arr;
}

renderDashCourses = function () {
  const enrolled = state.modules.filter(m => m.watched < m.total);
  const done = state.modules.filter(m => m.watched >= m.total);
  document.getElementById('count-enrolled').textContent = enrolled.length;
  document.getElementById('count-completed').textContent = done.length;
  document.querySelectorAll('[data-course-tab]').forEach(b => {
    const on = b.dataset.courseTab === state.courseTab;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  const list = csortList(state.courseTab === 'completed' ? done : enrolled);
  const track = document.getElementById('dash-courses');
  track.innerHTML = list.map(m => courseCardHTML(m)).join('') ||
    `<p class="empty-note">${state.courseTab === 'completed' ? 'No completed courses yet. Finish every module in a course to see it here.' : 'You are not enrolled in any courses.'}</p>`;
  wireCourseCardEvents(track);
  wireCarousel(track, document.getElementById('dash-prev'), document.getElementById('dash-next'));
  renderIcons(track);
  csortSync();
};

(function csortBuild() {
  const tabs = document.getElementById('course-tabs'); if (!tabs || document.getElementById('course-sort-btn')) return;
  const bar = document.createElement('div'); bar.className = 'course-toolbar';
  tabs.parentNode.insertBefore(bar, tabs); bar.appendChild(tabs);
  const wrap = document.createElement('div'); wrap.className = 'csort';
  wrap.innerHTML = `<button type="button" class="csort-btn" id="course-sort-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Sort courses" title="Sort courses">${CSORT_ICON}<span class="csort-label" id="course-sort-label"></span></button>
    <div class="csort-menu" id="course-sort-menu" role="menu" hidden>
      <div class="csort-title">Sort courses</div>
      ${CSORT_OPTIONS.map(o => `<button type="button" role="menuitemradio" class="csort-opt" data-csort="${o[0]}"><span class="csort-tick">&#10003;</span>${o[1]}</button>`).join('')}
    </div>`;
  bar.appendChild(wrap);
  const btn = wrap.querySelector('#course-sort-btn'), menu = wrap.querySelector('#course-sort-menu');
  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', e => { e.stopPropagation(); const open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
  menu.addEventListener('click', e => {
    const o = e.target.closest('[data-csort]'); if (!o) return;
    courseSort = o.dataset.csort; store.set(CSORT_KEY, courseSort); close(); renderDashCourses();
  });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
function csortSync() {
  const lab = document.getElementById('course-sort-label'), btn = document.getElementById('course-sort-btn'); if (!lab) return;
  const cur = CSORT_OPTIONS.find(o => o[0] === courseSort);
  lab.textContent = courseSort === 'default' ? '' : cur[1].replace(' first', '');
  btn.classList.toggle('active', courseSort !== 'default');
  document.querySelectorAll('.csort-opt').forEach(o => {
    const on = o.dataset.csort === courseSort; o.classList.toggle('on', on); o.setAttribute('aria-checked', String(on));
  });
}
renderDashCourses();
