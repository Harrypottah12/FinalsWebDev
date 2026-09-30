const ICON_PATHS = {

  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
  tasks: '<path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><path d="m4 6 1.4 1.4L8 4.8"/><path d="m4 12 1.4 1.4L8 10.8"/><path d="m4 18 1.4 1.4L8 16.8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
  pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/><path d="m15 5 4 4"/>',
  x: '<path d="m18 6-12 12"/><path d="m6 6 12 12"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  play: '<path d="M8 5v14l11-7z"/>',

  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/>',
  paperclip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  pin: '<path d="M12 17v5"/><path d="M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16.5h.01"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>',

  award: '<circle cx="12" cy="8" r="6"/><path d="m9 14-2 7 5-3 5 3-2-7"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1.1 1.2C7.9 18.5 7 19.7 7 21M14 14.7V17c0 .6.5 1 1.1 1.2 1 .3 1.9 1.5 1.9 2.8M18 2H6v7a6 6 0 0 0 12 0z"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  cap: '<path d="m22 9-10-5L2 9l10 5z"/><path d="M6 11.5V16c0 1.2 2.7 3 6 3s6-1.8 6-3v-4.5"/><path d="M22 9v6"/>',

  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  tree: '<circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m10.9 7.3-3.8 9.4M13.1 7.3l3.8 9.4"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
  network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>',
  sigma: '<path d="M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 5.7a.5.5 0 0 1 0 .6l-4.5 5.7a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2"/>',
  atom: '<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z"/>'
};
const FILLED_ICONS = new Set(['play']);
function iconSVG(name) {
  const path = ICON_PATHS[name];
  if (!path) return '';
  const fill = FILLED_ICONS.has(name) ? 'currentColor' : 'none';
  return `<svg class="icon" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
function renderIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = iconSVG(el.dataset.icon);
  });
}
const SUBJECT_ICONS = {
  'Web Development': 'code',
  'Data Structures & Algorithms': 'tree',
  'Database Systems (SQL)': 'database',
  'Cybersecurity': 'shield',
  'Cloud Computing': 'cloud',
  'Mobile App Development': 'phone',
  'Artificial Intelligence & Machine Learning': 'cpu',
  'Computer Networking': 'network',
  'Calculus & Applied Mathematics': 'sigma',
  'Applied Physics & Data Science': 'atom'
};
function subjectIcon(category) { return SUBJECT_ICONS[category] || 'book'; }

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function localISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function daysFromToday(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return localISO(d);
}
function timeAgo(ts) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return 'Just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.round(h / 24);
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d} days ago`;
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
};

const SEED_FRIENDS = [
  { id: 'fr1', name: 'Bagas Mahple', tag: 'Friend' },
  { id: 'fr2', name: 'Maria Chen', tag: 'Classmate' },
  { id: 'fr3', name: 'David Kim', tag: 'Classmate' },
  { id: 'fr4', name: 'Farah Nabila', tag: 'Classmate' },
  { id: 'fr5', name: 'Tom Rivera', tag: 'Classmate' },
  { id: 'fr6', name: 'Yuki Tanaka', tag: 'Classmate' }
];

const SEED_MENTORS = [
  { id: 'm1', name: 'Professor Michael Anderson', subject: 'Web Development', bio: 'Full-stack engineer teaching HTML, CSS, JavaScript and modern frameworks.', followed: true },
  { id: 'm2', name: 'Professor Sarah Mitchell', subject: 'Data Structures & Algorithms', bio: 'Breaks down Big-O thinking and classic algorithm patterns for real interviews.', followed: false },
  { id: 'm3', name: 'Professor Ayu Lestari', subject: 'Database Systems (SQL)', bio: 'Focuses on relational design, indexing and writing efficient production queries.', followed: false },
  { id: 'm4', name: 'Professor Nadia Putri', subject: 'Cybersecurity', bio: 'Covers threat modeling, secure authentication and common vulnerability classes.', followed: false },
  { id: 'm5', name: 'Professor Sophia Alistair', subject: 'Cloud Computing', bio: 'Teaches compute, storage and networking fundamentals across major cloud providers.', followed: false },
  { id: 'm6', name: 'Professor Ryan Cooper', subject: 'Mobile App Development', bio: 'Native and cross-platform mobile engineering, from first screen to app-store release.', followed: false },
  { id: 'm7', name: 'Professor Daniel Kim', subject: 'Artificial Intelligence & Machine Learning', bio: 'Introduces machine learning models and how to train them on real datasets.', followed: false },
  { id: 'm8', name: 'Professor Marcus Chen', subject: 'Computer Networking', bio: 'Explains how data actually moves: protocols, routing and network security.', followed: false },
  { id: 'm9', name: 'Professor Elena Rodriguez', subject: 'Calculus & Applied Mathematics', bio: 'Makes derivatives, integrals and mathematical modeling click with real examples.', followed: false },
  { id: 'm10', name: 'Professor James Whitfield', subject: 'Applied Physics & Data Science', bio: 'Connects scientific method and statistics to real-world data analysis.', followed: false }
];

const SEED_MODULES = [
  { id: 'mod1', category: 'Web Development', code: 'S-ITWB311', lmsCode: '1706', title: "Beginner's Guide to Becoming a Professional Web Developer", mentorId: 'm1', watched: 6, total: 12, transcript: 'This lesson walks through HTML structure, CSS layout systems, and the core JavaScript you need to build interactive interfaces.' },
  { id: 'mod2', category: 'Data Structures & Algorithms', code: 'S-ITDS204', lmsCode: '1102', title: 'Mastering Data Structures and Algorithms', mentorId: 'm2', watched: 3, total: 10, transcript: 'Builds intuition for Big-O thinking and walks through classic divide-and-conquer problems.' },
  { id: 'mod3', category: 'Database Systems (SQL)', code: 'S-ITDB210', lmsCode: '1145', title: 'SQL Fundamentals for Real-World Applications', mentorId: 'm3', watched: 2, total: 10, transcript: 'Covers joins, indexing basics, and how to structure normalized tables for a small production app.' },
  { id: 'mod4', category: 'Cybersecurity', code: 'S-ITCS318', lmsCode: '1613', title: 'Cybersecurity Essentials for Developers', mentorId: 'm4', watched: 4, total: 10, transcript: 'A tour of common vulnerabilities, secure authentication patterns, and how to think about threat modeling.' },
  { id: 'mod5', category: 'Cloud Computing', code: 'S-ITCC305', lmsCode: '1289', title: 'Cloud Computing Foundations', mentorId: 'm5', watched: 5, total: 10, transcript: 'Explains compute, storage, and networking basics across the major cloud providers.' },
  { id: 'mod6', category: 'Mobile App Development', code: 'S-ITMD220', lmsCode: '1355', title: 'Cross-Platform Mobile Development Basics', mentorId: 'm6', watched: 0, total: 11, transcript: 'Compares native vs cross-platform approaches and sets up your first cross-platform screen.' },
  { id: 'mod7', category: 'Artificial Intelligence & Machine Learning', code: 'S-ITAI401', lmsCode: '1477', title: 'Introduction to Machine Learning', mentorId: 'm7', watched: 1, total: 9, transcript: 'Covers supervised learning basics and how to train your first model on a real dataset.' },
  { id: 'mod8', category: 'Computer Networking', code: 'S-ITNW215', lmsCode: '1198', title: 'Computer Networking from the Ground Up', mentorId: 'm8', watched: 2, total: 9, transcript: 'Explains the OSI model, IP addressing, routing and the basics of network security.' },
  { id: 'mod9', category: 'Calculus & Applied Mathematics', code: 'S-MATH101', lmsCode: '1004', title: 'Calculus for Problem Solvers', mentorId: 'm9', watched: 4, total: 8, transcript: 'Covers limits, derivatives and integrals, with an emphasis on applying them to real problems.' },
  { id: 'mod10', category: 'Applied Physics & Data Science', code: 'S-PHYS210', lmsCode: '1223', title: 'Applied Physics and Data-Driven Science', mentorId: 'm10', watched: 3, total: 8, transcript: 'Ties the scientific method to statistics, measurement and interpreting real experimental data.' }
];

const POST_KINDS = {
  announcement: { label: 'Announcement', icon: 'megaphone' },
  event: { label: 'Event', icon: 'calendar' },
  reminder: { label: 'Reminder', icon: 'clock' }
};
const NEWS_FILTERS = [
  { id: 'all', label: 'All posts', icon: 'layers' },
  { id: 'announcement', label: 'Announcements', icon: 'megaphone' },
  { id: 'event', label: 'Events', icon: 'calendar' },
  { id: 'reminder', label: 'Reminders', icon: 'clock' },
  { id: 'saved', label: 'Saved', icon: 'bookmark' }
];
const HOUR = 3600 * 1000;
function seedNews() {
  const now = Date.now();
  return [
    {
      id: 'n1', author: 'Campus Safety Office', kind: 'announcement', pinned: true, ts: now - 9 * HOUR, art: 'memo',
      title: 'FDAS testing and orientation',
      body: 'Please be informed that the University will conduct testing and orientation of the Fire Detection and Alarm System (FDAS) on September 23-25, 2026, in selected University buildings.\n\nEveryone is encouraged to cooperate and follow the instructions of authorized personnel during the activity.\n\nThank you for your cooperation.',
      attachment: { name: 'CSSHO-SO-MEM-002_FDAS_Testing_Advisory.pdf' }
    },
    {
      id: 'n2', author: 'IT Department', kind: 'reminder', pinned: false, ts: now - 2 * HOUR, art: 'portal',
      title: 'Portal maintenance this weekend',
      body: 'The learning portal will be briefly unavailable on Saturday from 12 to 2 AM for scheduled maintenance.\n\nSave your work beforehand and submit any pending assessments before the window starts.'
    },
    {
      id: 'n3', author: 'Registrar', kind: 'event', pinned: false, ts: now - 5 * HOUR, art: 'campus',
      title: 'Enrollment window opens Monday',
      body: 'Enrollment for next term opens Monday at 8:00 AM. Check your account for any holds before then so you can enroll on the first day.'
    },
    {
      id: 'n4', author: 'Student Affairs', kind: 'announcement', pinned: false, ts: now - 50 * HOUR, art: 'study',
      title: 'Peer study group sign-ups',
      body: 'Sign-ups for peer study groups are now open. Find a group on the Friends tab and start collaborating with classmates.'
    }
  ];
}

const artCache = {};
function svgURI(svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
const NEWS_ART = {

  memo() {
    const cols = [28, 108, 188, 300, 392];
    const heads = ['DATE', 'TIME', 'BUILDING', 'ATTENDEES'];
    const rows = [
      ['Wed, Sept 23', '2:00 - 4:00 pm', 'Main Library', 'Library staff'],
      ['Thu, Sept 24', '1:30 - 2:30 pm', 'Alumni Hall', 'Alumni employees'],
      ['Thu, Sept 24', '3:00 - 4:00 pm', 'Student Center', 'Student Affairs'],
      ['Fri, Sept 25', '9:00 - 11:00 am', 'Science Complex', 'Faculty and staff']
    ];
    const lines = (x, y, widths) => widths.map((w, i) => `<rect x="${x}" y="${y + i * 9}" width="${w}" height="3" rx="1.5" fill="#C5CECB"/>`).join('');
    let table = `<rect x="28" y="250" width="364" height="18" fill="#E4F2EF"/>`;
    heads.forEach((h, i) => { table += `<text x="${cols[i] + 6}" y="262" font-size="7.5" font-weight="700" fill="#14201E">${h}</text>`; });
    rows.forEach((r, ri) => {
      const y = 268 + ri * 24;
      table += `<line x1="28" y1="${y}" x2="392" y2="${y}" stroke="#B7C2BF" stroke-width=".7"/>`;
      r.forEach((c, ci) => { table += `<text x="${cols[ci] + 6}" y="${y + 15}" font-size="7" fill="#33403D">${c}</text>`; });
    });
    const bottom = 268 + rows.length * 24;
    table += `<rect x="28" y="250" width="364" height="${bottom - 250}" fill="none" stroke="#B7C2BF" stroke-width=".9"/>`;
    cols.slice(1, 4).forEach(x => { table += `<line x1="${x}" y1="250" x2="${x}" y2="${bottom}" stroke="#B7C2BF" stroke-width=".7"/>`; });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560" font-family="Arial, Helvetica, sans-serif">
      <rect width="420" height="560" fill="#FFFFFF"/>
      <rect x="28" y="28" width="364" height="60" fill="none" stroke="#9AA5A2" stroke-width=".9"/>
      <circle cx="57" cy="58" r="17" fill="#0F766E"/><circle cx="57" cy="58" r="11" fill="none" stroke="#fff" stroke-width="1.5"/>
      <rect x="86" y="28" width="306" height="16" fill="#0F766E"/>
      <text x="93" y="39.5" font-size="8.5" font-weight="700" fill="#fff">FDAS Testing Advisory</text>
      <line x1="86" y1="58" x2="392" y2="58" stroke="#9AA5A2" stroke-width=".7"/><line x1="86" y1="73" x2="392" y2="73" stroke="#9AA5A2" stroke-width=".7"/>
      <line x1="86" y1="28" x2="86" y2="88" stroke="#9AA5A2" stroke-width=".7"/><line x1="250" y1="44" x2="250" y2="88" stroke="#9AA5A2" stroke-width=".7"/>
      <text x="92" y="54" font-size="6.5" fill="#33403D">Document Reference: CSSHO-SO-MEM-002</text>
      <text x="256" y="54" font-size="6.5" fill="#33403D">Revision Number: 000</text>
      <text x="92" y="69" font-size="6.5" fill="#33403D">Confidentiality Level: Internal</text>
      <text x="256" y="69" font-size="6.5" fill="#33403D">Approval Date: September 11, 2026</text>
      <text x="92" y="84" font-size="6.5" fill="#33403D">Review Cycle: Not Applicable</text>
      <text x="256" y="84" font-size="6.5" fill="#33403D">Effectivity Date: September 23, 2026</text>
      <text x="28" y="120" font-size="7.5" fill="#33403D">September 9, 2026</text>
      <text x="28" y="142" font-size="7.5" fill="#33403D">Dear Partners,</text>
      <text x="28" y="158" font-size="7.5" fill="#33403D">Greetings!</text>
      ${lines(28, 174, [360, 352, 300])}
      ${lines(28, 208, [364, 340, 356, 120])}
      ${table}
      ${lines(28, bottom + 22, [340, 300])}
      <rect x="28" y="${bottom + 60}" width="90" height="3" rx="1.5" fill="#9AA5A2"/>
      <rect x="28" y="${bottom + 69}" width="60" height="3" rx="1.5" fill="#C5CECB"/>
    </svg>`;
    return svgURI(svg);
  },
  campus() {
    const cols = [0, 1, 2, 3, 4, 5].map(i => `<rect x="${288 + i * 40}" y="176" width="14" height="96" fill="#FFFFFF"/>`).join('');
    return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340">
      <rect width="800" height="340" fill="#D8ECE8"/>
      <circle cx="668" cy="86" r="44" fill="#F2C94C"/>
      <path d="M0 262 Q200 196 400 252 T800 232 V340 H0z" fill="#0F766E"/>
      <path d="M250 172 L400 118 L550 172z" fill="#E7E1D0"/>
      <rect x="262" y="172" width="276" height="8" fill="#D6CFB8"/>
      <rect x="270" y="180" width="260" height="92" fill="#F6F3EA"/>
      ${cols}
      <rect x="378" y="216" width="44" height="56" rx="22" fill="#0B5E58"/>
      <rect x="250" y="272" width="300" height="10" fill="#D6CFB8"/><rect x="236" y="282" width="328" height="10" fill="#C9C1A6"/>
      <circle cx="400" cy="152" r="9" fill="#0F766E"/>
      <rect x="136" y="228" width="10" height="50" fill="#5B3A29"/><circle cx="141" cy="218" r="36" fill="#14805A"/><circle cx="122" cy="238" r="22" fill="#0F6B4B"/>
      <rect x="650" y="238" width="10" height="44" fill="#5B3A29"/><circle cx="655" cy="228" r="32" fill="#14805A"/>
      <path d="M0 300 Q260 250 520 296 T800 288 V340 H0z" fill="#0B5E58"/>
    </svg>`);
  },
  portal() {
    const rack = [0, 1, 2].map(i => {
      const y = 62 + i * 78;
      return `<rect x="200" y="${y}" width="340" height="62" rx="10" fill="#22395C"/>
        <circle cx="228" cy="${y + 31}" r="6" fill="${i === 1 ? '#FBBF24' : '#4ADE80'}"/>
        <rect x="252" y="${y + 20}" width="150" height="6" rx="3" fill="#3A5687"/><rect x="252" y="${y + 36}" width="100" height="6" rx="3" fill="#3A5687"/>
        <rect x="470" y="${y + 24}" width="46" height="14" rx="7" fill="#0F766E"/>`;
    }).join('');
    return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340">
      <rect width="800" height="340" fill="#16263F"/>
      ${rack}
      <circle cx="656" cy="170" r="72" fill="none" stroke="#FBBF24" stroke-width="12"/>
      <path d="M656 122 V170 L688 190" fill="none" stroke="#FBBF24" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`);
  },
  study() {
    const person = (x, tone) => `<circle cx="${x}" cy="124" r="30" fill="#F0C9A4"/><path d="M${x - 50} 250 a50 62 0 0 1 100 0z" fill="${tone}"/>`;
    return svgURI(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340">
      <rect width="800" height="340" fill="#E1EFEC"/>
      ${person(250, '#6B2158')}${person(400, '#0F766E')}${person(550, '#92400E')}
      <rect x="150" y="240" width="500" height="24" rx="12" fill="#334155"/>
      <path d="M340 240 L400 222 L460 240z" fill="#FFFFFF"/><path d="M400 222 V240" stroke="#B7C2BF" stroke-width="2"/>
      <rect x="150" y="34" width="82" height="40" rx="14" fill="#FFFFFF"/><rect x="166" y="48" width="50" height="6" rx="3" fill="#B7C2BF"/>
      <rect x="590" y="30" width="90" height="40" rx="14" fill="#FFFFFF"/><rect x="606" y="44" width="58" height="6" rx="3" fill="#B7C2BF"/>
    </svg>`);
  }
};
function newsArtSrc(key) {
  if (!NEWS_ART[key]) return '';
  if (!artCache[key]) artCache[key] = NEWS_ART[key]();
  return artCache[key];
}

const SEED_AWARDS = [
  { title: 'Course Completion: Web Development', date: '2026-05-09' },
  { title: 'Academic Honor Code Pledge', date: '2026-04-16' },
  { title: 'Module 1 Completion: Cybersecurity', date: '2026-03-17' },
  { title: 'Perfect Attendance: Spring Term', date: '2026-02-20' },
  { title: 'Study Group Leadership Badge', date: '2025-12-02' }
];
const SEED_GAMIFICATION = { level: 13, xp: 6675, xpTarget: 14427 };
const RANKS = [
  { min: 1, name: 'Youngling' },
  { min: 5, name: 'Padawan' },
  { min: 15, name: 'Jedi Knight' },
  { min: 30, name: 'Jedi Master' }
];
const XP_LESSON = 350;
const XP_TASK = 120;
const TERM_LABEL = 'Term 1, A.Y. 2026-2027';
function rankFor(level) {
  let cur = RANKS[0];
  RANKS.forEach(r => { if (level >= r.min) cur = r; });
  const next = RANKS.find(r => r.min > level) || null;
  return { cur, next };
}

const SEED_INBOX = [
  { title: 'Professor Michael Anderson', preview: 'Great progress on the Web Development module. Keep it up!', time: '9:12 AM' },
  { title: 'LMS System', preview: 'Your certificate for Cybersecurity Essentials is ready to download.', time: 'Yesterday' },
  { title: 'Professor Sophia Alistair', preview: 'Reminder: live Q&A session tomorrow at 3 PM.', time: '2 days ago' }
];

const DEEP_TONES = ['#0F766E', '#1E3A5F', '#6B2158', '#7A1F2B', '#92400E', '#3F5F2A', '#334155', '#4C3A8A'];
function toneFor(name) {
  let hash = 0;
  const s = name || '?';
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return DEEP_TONES[hash % DEEP_TONES.length];
}
function initials(name) {
  return (name || '?').replace(/^Professor\s+/i, '').split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}
function avatarHTML(name, avatarUrl) {
  if (avatarUrl) return `<img src="${avatarUrl}" alt="">`;
  return esc(initials(name));
}
function avatarStyle(name) {
  return `background:${toneFor(name || '?')};`;
}

const state = {
  userProfile: store.get('lms_profile', {
    name: 'Jason Ranti', avatar: null, studentNumber: '2021-04521',
    section: '[1613][S-ITCS318]', bio: '', publicProfile: false
  }),
  theme: store.get('lms_theme', 'light'),
  navActive: 'dashboard',
  homeTab: 'dashboard',
  courseTab: 'enrolled',
  newsFilter: 'all',
  rank: store.get('lms_rank', 10),
  searchQuery: '',
  activeCategory: 'All',
  weekOffset: 0,
  heroSlide: 0,
  friends: store.get('lms_friends', SEED_FRIENDS),
  mentors: store.get('lms_mentors', SEED_MENTORS),
  modules: store.get('lms_modules', SEED_MODULES),
  favorites: store.get('lms_favorites', {}),
  notes: store.get('lms_notes', {}),
  news: store.get('lms_news', seedNews()),
  newsSaved: store.get('lms_news_saved', {}),
  newsSeen: store.get('lms_news_seen', Date.now() - 30 * HOUR),
  awards: store.get('lms_awards', SEED_AWARDS),
  gamification: store.get('lms_gamification', SEED_GAMIFICATION),
  streak: store.get('lms_streak', { count: 4, last: daysFromToday(-1) }),
  tasks: store.get('lms_tasks', [
    { id: 't1', text: 'Finish Web Development module 3', date: '', done: false },
    { id: 't2', text: 'Watch Cybersecurity lecture', date: '', done: true, xpGiven: true },
    { id: 't3', text: 'Submit Midterm Enabling Assessment', date: daysFromToday(0), done: false },
    { id: 't4', text: 'Turn in SQL lab report', date: daysFromToday(1), done: false }
  ])
};

function persist() {
  store.set('lms_profile', state.userProfile);
  store.set('lms_theme', state.theme);
  store.set('lms_rank', state.rank);
  store.set('lms_friends', state.friends);
  store.set('lms_mentors', state.mentors);
  store.set('lms_modules', state.modules);
  store.set('lms_favorites', state.favorites);
  store.set('lms_notes', state.notes);
  store.set('lms_tasks', state.tasks);
  store.set('lms_news', state.news);
  store.set('lms_news_saved', state.newsSaved);
  store.set('lms_news_seen', state.newsSeen);
  store.set('lms_awards', state.awards);
  store.set('lms_gamification', state.gamification);
  store.set('lms_streak', state.streak);
}

function toast(msg) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2700);
}

function currentStreak() {
  const s = state.streak;
  return (s.last === daysFromToday(0) || s.last === daysFromToday(-1)) ? s.count : 0;
}
function touchStreak() {
  const s = state.streak;
  const today = daysFromToday(0);
  if (s.last === today) return;
  s.count = s.last === daysFromToday(-1) ? s.count + 1 : 1;
  s.last = today;
}
function addAward(title) {
  state.awards.unshift({ title, date: daysFromToday(0) });
}
function awardXP(amount, reason) {
  const g = state.gamification;
  const startRank = rankFor(g.level).cur.name;
  g.xp += amount;
  let leveled = false;
  while (g.xp >= g.xpTarget) {
    g.xp -= g.xpTarget;
    g.level += 1;
    g.xpTarget = Math.round(g.xpTarget * 1.08);
    state.rank = Math.max(1, state.rank - 1);
    addAward(`Reached Level ${g.level}`);
    leveled = true;
  }
  touchStreak();
  persist();
  renderProfileStats();
  toast(`+${amount} XP for ${reason}`);
  if (leveled) {
    const now = rankFor(g.level).cur.name;
    toast(now !== startRank ? `Level ${g.level}. New rank: ${now}` : `Level up. You are now level ${g.level}`);
  }
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('icon-sun').hidden = state.theme === 'dark';
  document.getElementById('icon-moon').hidden = state.theme !== 'dark';
  const sidebarIco = document.getElementById('sidebar-theme-ico');
  const sidebarLabel = document.getElementById('sidebar-theme-label');
  if (sidebarIco) { sidebarIco.dataset.icon = state.theme === 'dark' ? 'sun' : 'moon'; renderIcons(sidebarIco.parentElement); }
  if (sidebarLabel) sidebarLabel.textContent = state.theme === 'dark' ? 'Light mode' : 'Dark mode';
  const profileIco = document.getElementById('profile-theme-ico');
  if (profileIco) { profileIco.dataset.icon = state.theme === 'dark' ? 'sun' : 'moon'; renderIcons(profileIco.parentElement); }
}
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme();
  persist();
}
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('sidebar-theme-toggle').addEventListener('click', toggleTheme);

function renderClock() {
  const now = new Date();
  document.getElementById('clock-time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('clock-date').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}
renderClock();
setInterval(renderClock, 1000);

function enterApp() {
  renderIcons();
  document.getElementById('header-name').textContent = state.userProfile.name;
  document.getElementById('footer-name').textContent = state.userProfile.name;
  document.getElementById('profile-name-input').value = state.userProfile.name;
  renderAvatarEverywhere();
  router('dashboard');
  renderProfileStats();
  renderWeekStrip();
  renderUpcomingClasses();
  renderTasks();
  renderNewsCount();
}

const HERO_SLIDE_COUNT = 3;
let heroTimer = null;

function greetingLabel() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
}
function criticalTasks() {
  const today = daysFromToday(0), tomorrow = daysFromToday(1);
  return state.tasks.filter(t => !t.done && (t.date === today || t.date === tomorrow));
}
function nextUpcomingModule() {
  const upcoming = state.modules.filter(m => m.watched < m.total);
  if (!upcoming.length) return null;
  const mod = upcoming[0];
  const mentor = state.mentors.find(x => x.id === mod.mentorId) || {};
  return { mod, mentor };
}
function heroRingSVG(pct) {
  const r = 64, c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 168 168" aria-hidden="true">
    <circle cx="84" cy="84" r="${r}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="14"/>
    <circle cx="84" cy="84" r="${r}" fill="none" stroke="var(--hero-accent)" stroke-width="14" stroke-linecap="round"
      stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(1)}"/>
  </svg>`;
}
function dueLabel(dateStr) {
  if (dateStr === daysFromToday(0)) return 'Today';
  if (dateStr === daysFromToday(1)) return 'Tomorrow';
  return formatTaskDate(dateStr);
}
function renderHeroCarousel() {
  const firstName = (state.userProfile.name || 'there').split(' ')[0];
  const blockers = criticalTasks();
  const next = nextUpcomingModule();
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
}
function applyHeroSlide() {
  const slides = document.getElementById('hero-slides');
  if (slides) {
    slides.style.transform = `translateX(-${state.heroSlide * 100}%)`;
    Array.from(slides.children).forEach((s, i) => { s.inert = i !== state.heroSlide; });
  }
  document.querySelectorAll('#hero-dots button').forEach((btn, i) => {
    btn.classList.toggle('active', i === state.heroSlide);
    btn.setAttribute('aria-current', i === state.heroSlide ? 'true' : 'false');
  });
}
function goHeroSlide(i) {
  state.heroSlide = (i + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT;
  applyHeroSlide();
}
function startHeroAutoplay() {
  stopHeroAutoplay();
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  heroTimer = setInterval(() => goHeroSlide(state.heroSlide + 1), 7000);
}
function stopHeroAutoplay() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = null;
}
(function wireHero() {
  const hero = document.getElementById('hero-carousel');
  document.getElementById('hero-prev').addEventListener('click', () => { goHeroSlide(state.heroSlide - 1); startHeroAutoplay(); });
  document.getElementById('hero-next').addEventListener('click', () => { goHeroSlide(state.heroSlide + 1); startHeroAutoplay(); });
  document.getElementById('hero-dots').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-slide]');
    if (!b) return;
    goHeroSlide(Number(b.dataset.slide));
    startHeroAutoplay();
  });
  document.getElementById('hero-slides').addEventListener('click', (e) => {
    const b = e.target.closest('[data-hero-go]');
    if (!b) return;
    const go = b.dataset.heroGo;
    if (go === 'agenda') {
      const next = nextUpcomingModule();
      router('lesson');
      if (next) openLessonDrawer(next.mod.id);
    } else {
      router(go);
    }
  });
  hero.addEventListener('mouseenter', stopHeroAutoplay);
  hero.addEventListener('mouseleave', () => { if (state.navActive === 'dashboard' && state.homeTab === 'dashboard') startHeroAutoplay(); });
  hero.addEventListener('focusin', stopHeroAutoplay);
})();

function setHomeTab(tab) {
  state.homeTab = tab;
  document.querySelectorAll('[data-home-tab]').forEach(b => {
    const on = b.dataset.homeTab === tab;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.getElementById('home-dashboard').hidden = tab !== 'dashboard';
  document.getElementById('home-news').hidden = tab !== 'news';
  document.getElementById('news-tools').hidden = tab !== 'news';
  if (tab === 'dashboard') {
    renderHeroCarousel();
    renderDashCourses();
    startHeroAutoplay();
  } else {
    stopHeroAutoplay();
    renderNews();
    state.newsSeen = Date.now();
    persist();
    renderNewsCount();
  }
  renderIcons();
}
document.querySelectorAll('[data-home-tab]').forEach(btn => {
  btn.addEventListener('click', () => setHomeTab(btn.dataset.homeTab));
});

function renderDashCourses() {
  const enrolled = state.modules.filter(m => m.watched < m.total);
  const done = state.modules.filter(m => m.watched >= m.total);
  document.getElementById('count-enrolled').textContent = enrolled.length;
  document.getElementById('count-completed').textContent = done.length;
  document.querySelectorAll('[data-course-tab]').forEach(b => {
    const on = b.dataset.courseTab === state.courseTab;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  const list = state.courseTab === 'completed' ? done : enrolled;
  const track = document.getElementById('dash-courses');
  track.innerHTML = list.map(m => courseCardHTML(m)).join('') ||
    `<p class="empty-note">${state.courseTab === 'completed' ? 'No completed courses yet. Finish every module in a course to see it here.' : 'You are not enrolled in any courses.'}</p>`;
  wireCourseCardEvents(track);
  wireCarousel(track, document.getElementById('dash-prev'), document.getElementById('dash-next'));
  renderIcons(track);
}
document.getElementById('course-tabs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-course-tab]');
  if (!b) return;
  state.courseTab = b.dataset.courseTab;
  renderDashCourses();
});
function refreshHome() {
  if (state.navActive !== 'dashboard') return;
  if (state.homeTab === 'dashboard') { renderHeroCarousel(); renderDashCourses(); }
}

function postHTML(p) {
  const kind = POST_KINDS[p.kind] || POST_KINDS.announcement;
  const saved = !!state.newsSaved[p.id];
  const img = p.image || (p.art ? newsArtSrc(p.art) : '');
  const paragraphs = String(p.body || '').split(/\n+/).filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('');
  return `
    <article class="post" data-post="${esc(p.id)}">
      <header class="post-head">
        <span class="post-avatar kind-${esc(p.kind)}" title="${kind.label}">${iconSVG(kind.icon)}</span>
        <div class="post-who">
          <span class="post-author">${esc(p.author)}</span>
          ${p.pinned ? `<span class="post-pin">${iconSVG('pin')} Pinned</span>` : ''}
        </div>
        <span class="post-time">${timeAgo(p.ts)}</span>
        <button class="post-icon-btn ${saved ? 'on' : ''}" data-save="${esc(p.id)}" aria-pressed="${saved}" aria-label="${saved ? 'Remove from saved' : 'Save post'}" title="${saved ? 'Saved' : 'Save'}">${iconSVG('bookmark')}</button>
        ${p.mine ? `<button class="post-icon-btn" data-del="${esc(p.id)}" aria-label="Delete post" title="Delete">${iconSVG('trash')}</button>` : ''}
      </header>
      <div class="post-content">
        <h3 class="post-title">${esc(p.title)}</h3>
        ${paragraphs}
        ${p.attachment ? `<button class="post-file" data-file="${esc(p.attachment.name)}">${iconSVG('file')} ${esc(p.attachment.name)}</button>` : ''}
      </div>
      ${img ? `<div class="post-media ${p.art === 'memo' ? 'doc' : ''}"><img src="${img}" alt="${esc(p.title)} preview" loading="lazy"></div>` : ''}
    </article>`;
}
function renderNews() {
  const box = document.getElementById('announcement-feed');
  const f = state.newsFilter;
  let list = [...state.news];
  if (f === 'saved') list = list.filter(p => state.newsSaved[p.id]);
  else if (f !== 'all') list = list.filter(p => p.kind === f);
  list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.ts - a.ts);

  const empty = f === 'saved'
    ? 'No saved posts yet. Use the bookmark on a post to keep it here.'
    : f === 'all' ? 'No posts yet. Select Post to share the first update.' : 'No posts of this type yet.';
  box.innerHTML = list.map(postHTML).join('') || `<p class="empty-note">${empty}</p>`;

  box.querySelectorAll('[data-save]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.save;
    state.newsSaved[id] = !state.newsSaved[id];
    persist();
    renderNews();
    toast(state.newsSaved[id] ? 'Post saved' : 'Removed from saved');
  }));
  box.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => {
    if (!window.confirm('Delete this post?')) return;
    state.news = state.news.filter(p => p.id !== btn.dataset.del);
    delete state.newsSaved[btn.dataset.del];
    persist();
    renderNews();
    toast('Post deleted');
  }));
  box.querySelectorAll('[data-file]').forEach(btn => btn.addEventListener('click', () => {
    toast('This demo keeps file names only, so there is nothing to download');
  }));

  const chip = document.getElementById('news-filter-chip');
  const meta = NEWS_FILTERS.find(x => x.id === f);
  if (f === 'all') { chip.hidden = true; chip.innerHTML = ''; }
  else {
    chip.hidden = false;
    chip.innerHTML = `Showing ${meta.label.toLowerCase()} <button type="button" id="news-filter-clear" aria-label="Clear filter">${iconSVG('x')}</button>`;
    document.getElementById('news-filter-clear').addEventListener('click', () => { state.newsFilter = 'all'; renderNews(); });
  }
  renderIcons(box);
}
function renderNewsCount() {
  const unseen = state.news.filter(p => !p.mine && p.ts > state.newsSeen).length;
  const badge = document.getElementById('news-count');
  badge.hidden = unseen === 0;
  badge.textContent = unseen;
}

(function wireNewsFilter() {
  const btn = document.getElementById('news-filter-btn');
  const pop = document.getElementById('news-filter-popover');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = pop.hidden;
    document.querySelectorAll('.popover').forEach(p => p.hidden = true);
    if (!willOpen) return;
    pop.innerHTML = NEWS_FILTERS.map(f => `
      <button class="popover-btn ${state.newsFilter === f.id ? 'active' : ''}" data-filter="${f.id}">
        ${iconSVG(f.icon)} ${f.label} <span class="check">${iconSVG('check')}</span>
      </button>`).join('');
    pop.hidden = false;
  });
  pop.addEventListener('click', (e) => {
    e.stopPropagation();
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    state.newsFilter = b.dataset.filter;
    pop.hidden = true;
    renderNews();
  });
})();

const composer = { kind: 'announcement', image: null, file: '' };
function renderKindPicker() {
  document.querySelectorAll('#post-kind .kind-option').forEach(b => {
    const on = b.dataset.kind === composer.kind;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
function updateAttachPreview() {
  const box = document.getElementById('post-attach-preview');
  const parts = [];
  if (composer.image) parts.push(`<div class="attach-item"><img src="${composer.image}" alt="Selected image preview"><button type="button" data-remove-attach="image" aria-label="Remove image">${iconSVG('x')}</button></div>`);
  if (composer.file) parts.push(`<div class="attach-item">${iconSVG('file')}<span>${esc(composer.file)}</span><button type="button" data-remove-attach="file" aria-label="Remove file">${iconSVG('x')}</button></div>`);
  box.innerHTML = parts.join('');
  box.hidden = parts.length === 0;
}
function openComposer() {
  composer.kind = 'announcement'; composer.image = null; composer.file = '';
  document.getElementById('post-form').reset();
  renderKindPicker();
  updateAttachPreview();
  document.getElementById('post-modal-backdrop').hidden = false;
  document.getElementById('post-title').focus();
}
function closeComposer() { document.getElementById('post-modal-backdrop').hidden = true; }
function readImageScaled(file, maxSide) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
document.getElementById('post-announcement-btn').addEventListener('click', openComposer);
document.getElementById('post-modal-close').addEventListener('click', closeComposer);
document.getElementById('post-cancel').addEventListener('click', closeComposer);
document.getElementById('post-modal-backdrop').addEventListener('click', (e) => {
  if (e.target.id === 'post-modal-backdrop') closeComposer();
});
document.getElementById('post-kind').addEventListener('click', (e) => {
  const b = e.target.closest('[data-kind]');
  if (!b) return;
  composer.kind = b.dataset.kind;
  renderKindPicker();
});
document.getElementById('post-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  readImageScaled(file, 1000)
    .then(url => { composer.image = url; updateAttachPreview(); })
    .catch(() => toast('That image could not be read. Try a JPG or PNG'));
});
document.getElementById('post-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  composer.file = file.name;
  updateAttachPreview();
});
document.getElementById('post-attach-preview').addEventListener('click', (e) => {
  const b = e.target.closest('[data-remove-attach]');
  if (!b) return;
  if (b.dataset.removeAttach === 'image') composer.image = null; else composer.file = '';
  updateAttachPreview();
});
document.getElementById('post-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('post-title').value.trim();
  const body = document.getElementById('post-body').value.trim();
  if (!title || !body) return;
  state.news.unshift({
    id: 'n' + Date.now(), author: state.userProfile.name, kind: composer.kind, pinned: false, mine: true,
    ts: Date.now(), title, body, image: composer.image || null,
    attachment: composer.file ? { name: composer.file } : null
  });
  state.newsFilter = 'all';
  persist();
  closeComposer();
  renderNews();
  renderNewsCount();
  toast('Posted to News');
});

function router(page) {
  state.navActive = page;
  document.querySelectorAll('.page').forEach(p => p.hidden = true);
  const target = document.getElementById('page-' + page);
  if (target) target.hidden = false;

  document.querySelectorAll('.nav-item[data-nav]').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === page);
  });

  if (page === 'dashboard') setHomeTab(state.homeTab); else stopHeroAutoplay();
  if (page === 'inbox') renderInbox();
  if (page === 'lesson') renderLessonPage();
  if (page === 'task') { renderTasks(); renderCalendar(); }
  if (page === 'group') renderFriendsPage();
  if (page === 'profile') renderProfilePage();
  renderIcons();

  document.dispatchEvent(new CustomEvent('pagechange', { detail: { page } }));
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    router(el.dataset.page);
  });
});

function renderProfileStats() {
  const g = state.gamification;
  const pct = Math.min(100, Math.round((g.xp / g.xpTarget) * 100));
  document.getElementById('right-name').textContent = state.userProfile.name;
  document.getElementById('right-handle').textContent =
    '@' + (state.userProfile.name || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '');

  document.getElementById('xp-avatar').style.setProperty('--pct', pct + '%');
  document.getElementById('card-level-badge').textContent = g.level;
  document.getElementById('card-rank-title').textContent = rankFor(g.level).cur.name;
  document.getElementById('xp-bar-fill').style.width = pct + '%';
  document.getElementById('xp-current').textContent = `${g.xp.toLocaleString()} / ${g.xpTarget.toLocaleString()} XP`;
  document.getElementById('xp-next').textContent = `Level ${g.level + 1}`;

  document.getElementById('stat-rank').textContent = '#' + state.rank;
  document.getElementById('stat-streak').textContent = currentStreak();
  document.getElementById('stat-badges').textContent = state.awards.length;

  if (state.navActive === 'profile') { renderLevelCard(); renderAwardsGrid(); }
}

function renderWeekStrip() {
  const now = new Date();
  now.setDate(now.getDate() + state.weekOffset * 7);
  const dow = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7));

  document.getElementById('week-month-label').textContent =
    monday.toLocaleString('default', { month: 'long', year: 'numeric' });

  const dayLetters = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === today.toDateString();
    html += `
      <div class="week-day ${isToday ? 'active' : ''}">
        <span class="week-day-num">${d.getDate()}</span>
        <span class="week-day-name">${dayLetters[i]}</span>
      </div>`;
  }
  document.getElementById('week-strip').innerHTML = html;
}
document.getElementById('week-prev').addEventListener('click', () => { state.weekOffset -= 1; renderWeekStrip(); });
document.getElementById('week-next').addEventListener('click', () => { state.weekOffset += 1; renderWeekStrip(); });

function renderUpcomingClasses() {
  const box = document.getElementById('upcoming-class-list');
  const upcoming = state.modules.filter(m => m.watched < m.total).slice(0, 2);
  const times = ['8:30', '9:30'];
  box.innerHTML = upcoming.map((m, i) => {
    const mentor = state.mentors.find(x => x.id === m.mentorId) || {};
    return `
      <div class="upcoming-item">
        <div class="upcoming-time">${times[i] || '10:30'}</div>
        <div class="upcoming-info">
          <div class="upcoming-title">${esc(m.category)}</div>
          <div class="upcoming-sub">Online with ${esc(mentor.name || 'TBA')}</div>
        </div>
      </div>`;
  }).join('') || `<p style="color:var(--text-muted);font-size:12.5px;">No upcoming classes today.</p>`;
}

function renderAvatarEverywhere() {
  const html = avatarHTML(state.userProfile.name, state.userProfile.avatar);
  const style = avatarStyle(state.userProfile.name);
  ['header-avatar', 'footer-avatar', 'right-avatar', 'profile-avatar-preview'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = html;
    if (!state.userProfile.avatar) el.setAttribute('style', style);
    else el.removeAttribute('style');
  });
}

function getCategories() {
  return ['All', ...new Set(state.modules.map(m => m.category))];
}
function renderChips(containerId) {
  const box = document.getElementById(containerId);
  const cats = getCategories();
  box.innerHTML = cats.map(cat => {
    const scope = cat === 'All' ? state.modules : state.modules.filter(m => m.category === cat);
    const watched = scope.reduce((a, m) => a + m.watched, 0);
    const total = scope.reduce((a, m) => a + m.total, 0);
    const ringStyle = cat === 'All' ? 'background:var(--text-main);color:var(--card);' : avatarStyle(cat);
    return `
      <div class="chip ${state.activeCategory === cat ? 'active' : ''}" data-category="${esc(cat)}" role="button" tabindex="0">
        <div class="chip-ring" style="${ringStyle}">${iconSVG(cat === 'All' ? 'layers' : subjectIcon(cat))}</div>
        <div><div class="chip-title">${esc(cat)}</div><div class="chip-sub">${watched}/${total} watched</div></div>
      </div>`;
  }).join('');
  box.querySelectorAll('.chip').forEach(chip => {
    const pick = () => { state.activeCategory = chip.dataset.category; renderLessonPage(); };
    chip.addEventListener('click', pick);
    chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
}

function courseCardHTML(mod, extraClass) {
  const mentor = state.mentors.find(m => m.id === mod.mentorId) || {};
  const isFav = !!state.favorites[mod.id];
  const hasNote = !!(state.notes[mod.id] && state.notes[mod.id].trim());
  const pct = Math.round((mod.watched / mod.total) * 100);
  const finished = mod.watched >= mod.total;
  return `
    <div class="course-card continue-watching-card ${extraClass || ''}" data-course-id="${mod.id}">
      <div class="course-thumb" style="background:${toneFor(mod.category)};">
        <span class="thumb-glyph">${iconSVG(subjectIcon(mod.category))}</span>
        <button class="note-btn ${hasNote ? 'has-note' : ''}" data-note="${mod.id}" title="Quick note" aria-label="Quick note">${iconSVG('pencil')}</button>
        <button class="fav-btn ${isFav ? 'active' : ''}" data-fav="${mod.id}" title="Favorite" aria-label="Favorite">${iconSVG('heart')}</button>
      </div>
      <div class="course-body">
        <span class="badge">${esc(mod.category)}</span>
        <div class="course-code">[${esc(mod.lmsCode)}][${esc(mod.code)}]</div>
        <h3 class="course-title">${esc(mod.title)}</h3>
        <div class="course-progress-track"><div class="course-progress-fill" style="width:${pct}%"></div></div>
        <div class="course-progress-meta">${mod.watched} of ${mod.total} modules</div>
        <div class="course-mentor"><div class="avatar" style="${avatarStyle(mentor.name || '?')}">${esc(initials(mentor.name))}</div>${esc(mentor.name || 'Unassigned')}</div>
        <button class="continue-btn" data-open-lesson="${mod.id}">${finished ? 'Review' : 'Continue'}</button>
      </div>
    </div>`;
}

function wireCourseCardEvents(root) {
  root.querySelectorAll('[data-fav]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.fav;
      state.favorites[id] = !state.favorites[id];
      btn.classList.toggle('active', state.favorites[id]);
      persist();
      toast(state.favorites[id] ? 'Added to favorites' : 'Removed from favorites');
    });
  });
  root.querySelectorAll('[data-note]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.note;
      const existing = state.notes[id] || '';
      const text = window.prompt('Quick note for this lesson:', existing);
      if (text !== null) {
        state.notes[id] = text;
        btn.classList.toggle('has-note', !!text.trim());
        persist();
        toast('Note saved');
      }
    });
  });
  root.querySelectorAll('[data-open-lesson]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLessonDrawer(btn.dataset.openLesson);
    });
  });
}

function renderLessonPage() {
  renderChips('lesson-chips');

  const filtered = state.modules.filter(m =>
    (state.activeCategory === 'All' || m.category === state.activeCategory) &&
    matchesSearch(m)
  );

  const track = document.getElementById('continue-watching-track');
  track.innerHTML = filtered.slice(0, 6).map(m => courseCardHTML(m)).join('') ||
    `<p class="empty-note">No courses match your search.</p>`;
  wireCourseCardEvents(track);
  wireCarousel(track, document.getElementById('cw-prev'), document.getElementById('cw-next'));

  const body = document.getElementById('lesson-body');
  body.innerHTML = filtered.map(m => {
    const mentor = state.mentors.find(x => x.id === m.mentorId) || {};
    return `
      <tr data-lesson-row="${m.id}">
        <td>
          <div class="lesson-mentor">
            <div class="avatar" style="${avatarStyle(mentor.name || '?')}">${esc(initials(mentor.name))}</div>
            <div><div class="lesson-mentor-name">${esc(mentor.name || 'Unassigned')}</div><div class="lesson-mentor-date">[${esc(m.lmsCode)}][${esc(m.code)}]</div></div>
          </div>
        </td>
        <td><span class="type-pill">${esc(m.category)}</span></td>
        <td>${esc(m.title)}</td>
        <td><button class="action-btn" data-open-lesson="${m.id}">${m.watched >= m.total ? 'Review' : 'Continue'}</button></td>
      </tr>`;
  }).join('');
  wireCourseCardEvents(body);

  renderIcons();
}

function matchesSearch(mod) {
  if (!state.searchQuery) return true;
  const q = state.searchQuery.toLowerCase();
  const mentor = state.mentors.find(m => m.id === mod.mentorId);
  return mod.title.toLowerCase().includes(q) ||
    mod.category.toLowerCase().includes(q) ||
    (mod.code && mod.code.toLowerCase().includes(q)) ||
    (mod.lmsCode && mod.lmsCode.toLowerCase().includes(q)) ||
    (mentor && mentor.name.toLowerCase().includes(q));
}

document.getElementById('search-input').addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  if (state.navActive === 'lesson') renderLessonPage();
});

function wireCarousel(track, prevBtn, nextBtn) {
  if (!track || !prevBtn || !nextBtn) return;
  function update() {
    const maxScroll = track.scrollWidth - track.clientWidth - 1;
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }
  const amount = () => {
    const card = track.querySelector('.course-card');
    return card ? card.getBoundingClientRect().width + 18 : 300;
  };
  prevBtn.onclick = () => track.scrollBy({ left: -amount(), behavior: 'smooth' });
  nextBtn.onclick = () => track.scrollBy({ left: amount(), behavior: 'smooth' });
  track.onscroll = update;
  update();
}

let activeLessonId = null;
function openLessonDrawer(id) {
  const mod = state.modules.find(m => m.id === id);
  if (!mod) return;
  const mentor = state.mentors.find(m => m.id === mod.mentorId) || {};
  activeLessonId = id;
  document.getElementById('drawer-category').textContent = mod.category;
  document.getElementById('drawer-title').textContent = mod.title;
  document.getElementById('drawer-mentor-avatar').innerHTML = esc(initials(mentor.name));
  document.getElementById('drawer-mentor-avatar').setAttribute('style', avatarStyle(mentor.name || '?'));
  document.getElementById('drawer-mentor-name').textContent = mentor.name || 'Unassigned';
  document.getElementById('drawer-transcript').textContent = mod.transcript;
  const video = document.getElementById('drawer-video');
  video.innerHTML = iconSVG('play');
  video.style.background = toneFor(mod.category);
  document.getElementById('drawer-note').value = state.notes[id] || '';
  const btn = document.getElementById('drawer-complete');
  btn.textContent = mod.watched >= mod.total ? 'Course completed' : 'Mark as complete';
  btn.disabled = mod.watched >= mod.total;
  document.getElementById('drawer-backdrop').hidden = false;
}
function closeDrawer() { document.getElementById('drawer-backdrop').hidden = true; }
document.getElementById('drawer-close').addEventListener('click', closeDrawer);
document.getElementById('drawer-backdrop').addEventListener('click', (e) => {
  if (e.target.id === 'drawer-backdrop') closeDrawer();
});
document.getElementById('drawer-note').addEventListener('input', (e) => {
  if (!activeLessonId) return;
  state.notes[activeLessonId] = e.target.value;
  persist();
});
document.getElementById('drawer-complete').addEventListener('click', () => {
  const mod = state.modules.find(m => m.id === activeLessonId);
  if (mod && mod.watched < mod.total) {
    mod.watched += 1;
    if (mod.watched >= mod.total) {
      addAward(`Course Completion: ${mod.category}`);
      toast(`Course completed: ${mod.category}`);
    }
    awardXP(XP_LESSON, 'finishing a lesson');
    renderUpcomingClasses();
    refreshHome();
    if (state.navActive === 'lesson') renderLessonPage();
    renderIcons();
  }
  closeDrawer();
});

function renderInbox() {
  const box = document.getElementById('inbox-list');
  box.innerHTML = SEED_INBOX.map(msg => `
    <div class="inbox-item">
      <div class="avatar" style="${avatarStyle(msg.title)}">${esc(initials(msg.title))}</div>
      <div>
        <div class="msg-title">${esc(msg.title)}</div>
        <div class="msg-preview">${esc(msg.preview)}</div>
      </div>
      <div class="msg-time">${esc(msg.time)}</div>
    </div>
  `).join('');
}

function toggleHeaderPopover(btnId, popId, buildHTML) {
  const btn = document.getElementById(btnId);
  const pop = document.getElementById(popId);
  const toggle = (e) => {
    e.stopPropagation();
    const willOpen = pop.hidden;
    document.querySelectorAll('.popover').forEach(p => p.hidden = true);
    if (willOpen) { pop.innerHTML = buildHTML(); pop.hidden = false; }
  };
  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
}
document.addEventListener('click', () => document.querySelectorAll('.popover').forEach(p => p.hidden = true));

toggleHeaderPopover('msg-btn', 'msg-popover', () =>
  SEED_INBOX.map(m => `<div class="popover-item"><b>${esc(m.title)}</b><span>${esc(m.preview)}</span></div>`).join('')
);
toggleHeaderPopover('bell-btn', 'bell-popover', () => `
  <div class="popover-item"><b>New in News</b><span>Campus Safety posted an FDAS testing advisory.</span></div>
  <div class="popover-item"><b>Progress saved</b><span>Your last lesson was recorded.</span></div>
  <div class="popover-item"><b>Streak reminder</b><span>Finish a lesson or task today to keep your streak alive.</span></div>
`);

function mentorRowHTML(mentor, quick) {
  const avatar = `<div class="avatar" style="${avatarStyle(mentor.name)}">${esc(initials(mentor.name))}</div>`;
  const followBtn = `<button class="follow-btn ${mentor.followed ? 'following' : ''}" data-follow="${mentor.id}">${mentor.followed ? 'Following' : 'Follow'}</button>`;
  if (quick) {
    return `
      <div class="mentor-row" data-mentor-card="${mentor.id}">
        ${avatar}
        <div><div class="mentor-name">${esc(mentor.name)}</div><div class="mentor-sub">${esc(mentor.subject)}</div></div>
        ${followBtn}
        <div class="mentor-row-expand">${esc(mentor.bio)}</div>
      </div>`;
  }
  return `
    <div class="person-card" data-mentor-card="${mentor.id}">
      ${avatar}
      <div class="p-name">${esc(mentor.name)}</div>
      <div class="p-sub">${esc(mentor.subject)}</div>
      ${followBtn}
      <div class="p-expand">${esc(mentor.bio)}</div>
    </div>`;
}
function wireFollowButtons(root) {
  root.querySelectorAll('[data-follow]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mentor = state.mentors.find(m => m.id === btn.dataset.follow);
      mentor.followed = !mentor.followed;
      persist();
      toast(mentor.followed ? `Following ${mentor.name}` : `Unfollowed ${mentor.name}`);
      if (!document.getElementById('mentor-modal-backdrop').hidden) renderMentorModal(document.getElementById('mentor-search').value);
    });
  });
}
function wireExpandableCards(root) {
  root.querySelectorAll('[data-mentor-card]').forEach(card => {
    card.addEventListener('click', () => {
      const wasOpen = card.classList.contains('expanded');
      root.querySelectorAll('[data-mentor-card]').forEach(c => c.classList.remove('expanded'));
      if (!wasOpen) card.classList.add('expanded');
    });
  });
}
function openMentorModal() {
  document.getElementById('mentor-modal-backdrop').hidden = false;
  document.getElementById('mentor-search').value = '';
  renderMentorModal('');
}
function renderMentorModal(query) {
  const grid = document.getElementById('mentor-modal-grid');
  const q = (query || '').toLowerCase();
  const list = state.mentors.filter(m => m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q));
  grid.innerHTML = list.map(m => mentorRowHTML(m, false)).join('') || `<p class="empty-note">No professors found.</p>`;
  wireFollowButtons(grid);
  wireExpandableCards(grid);
}
document.getElementById('lesson-professors-btn').addEventListener('click', (e) => {
  e.preventDefault();
  openMentorModal();
});
document.getElementById('mentor-modal-close').addEventListener('click', () => {
  document.getElementById('mentor-modal-backdrop').hidden = true;
});
document.getElementById('mentor-modal-backdrop').addEventListener('click', (e) => {
  if (e.target.id === 'mentor-modal-backdrop') e.currentTarget.hidden = true;
});
document.getElementById('mentor-search').addEventListener('input', (e) => renderMentorModal(e.target.value));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeDrawer();
  closeComposer();
  document.getElementById('mentor-modal-backdrop').hidden = true;
  document.querySelectorAll('.popover').forEach(p => p.hidden = true);
});

function renderFriendsPage() {
  const grid = document.getElementById('students-grid');
  grid.innerHTML = state.friends.map(f => `
    <div class="person-card" data-friend-card="${f.id}">
      <div class="avatar" style="${avatarStyle(f.name)}">${esc(initials(f.name))}</div>
      <div class="p-name">${esc(f.name)}</div>
      <div class="p-sub">${esc(f.tag)}</div>
      <button class="follow-btn" data-friend-remove="${f.id}">Remove friend</button>
    </div>
  `).join('');
  grid.querySelectorAll('[data-friend-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const friend = state.friends.find(f => f.id === btn.dataset.friendRemove);
      state.friends = state.friends.filter(f => f.id !== btn.dataset.friendRemove);
      persist();
      renderFriendsPage();
      toast(`Removed ${friend ? friend.name : 'friend'}`);
    });
  });
}
document.getElementById('add-friend-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('add-friend-input');
  const name = input.value.trim();
  if (!name) return;
  if (state.friends.some(f => f.name.toLowerCase() === name.toLowerCase())) {
    toast(`${name} is already on your friend list`);
    return;
  }
  state.friends.push({ id: 'fr' + Date.now(), name, tag: 'Friend' });
  input.value = '';
  persist();
  renderFriendsPage();
  toast(`Added ${name} as a friend`);
});

function formatTaskDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return '';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
function taskItemHTML(t) {
  return `
    <li class="${t.done ? 'done' : ''}" data-task="${t.id}">
      <input type="checkbox" ${t.done ? 'checked' : ''} data-toggle="${t.id}" aria-label="Mark task done">
      <span class="task-text">${esc(t.text)}</span>
      ${t.date ? `<span class="task-date">${formatTaskDate(t.date)}</span>` : ''}
      <button data-remove="${t.id}" title="Remove" aria-label="Remove task">${iconSVG('x')}</button>
    </li>`;
}
function wireTaskControls(root) {
  root.querySelectorAll('[data-toggle]').forEach(cb => {
    cb.addEventListener('change', () => {
      const task = state.tasks.find(t => t.id === cb.dataset.toggle);
      task.done = cb.checked;
      if (task.done && !task.xpGiven) {
        task.xpGiven = true;
        awardXP(XP_TASK, 'completing a task');
      }
      persist();
      renderTasks();
      if (state.navActive === 'dashboard') refreshHome();
    });
  });
  root.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tasks = state.tasks.filter(t => t.id !== btn.dataset.remove);
      persist();
      renderTasks();
      if (state.navActive === 'dashboard') refreshHome();
    });
  });
}
function renderTasks() {
  const fullList = document.getElementById('task-list');
  fullList.innerHTML = state.tasks.map(taskItemHTML).join('') ||
    `<li class="empty-hint">No tasks yet. Add one above.</li>`;
  wireTaskControls(fullList);

  const sideList = document.getElementById('sidebar-task-list');
  const pending = state.tasks.filter(t => !t.done).slice(0, 4);
  sideList.innerHTML = pending.map(taskItemHTML).join('') ||
    `<li class="empty-hint">All caught up.</li>`;
  wireTaskControls(sideList);
  renderIcons();
}
document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('task-input');
  const dateInput = document.getElementById('task-date-input');
  const text = input.value.trim();
  if (!text) return;
  state.tasks.push({ id: 't' + Date.now(), text, date: dateInput.value || '', done: false });
  input.value = '';
  dateInput.value = '';
  persist();
  renderTasks();
});

function renderCalendar() {
  const cal = document.getElementById('calendar');
  const now = new Date();
  document.getElementById('calendar-title').textContent =
    now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dows = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  let html = dows.map(d => `<div class="cal-cell dow">${d}</div>`).join('');
  for (let i = 0; i < startDow; i++) html += `<div class="cal-cell"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === now.getDate();
    html += `<div class="cal-cell ${isToday ? 'today' : ''}">${d}</div>`;
  }
  cal.innerHTML = html;
}

function renderProfilePage() {
  document.getElementById('profile-name-input').value = state.userProfile.name;
  document.getElementById('profile-studentnum-input').value = state.userProfile.studentNumber || '';
  document.getElementById('profile-section-input').value = state.userProfile.section || '';
  document.getElementById('profile-bio-input').value = state.userProfile.bio || '';

  const el = document.getElementById('profile-avatar-preview');
  el.innerHTML = avatarHTML(state.userProfile.name, state.userProfile.avatar);
  if (!state.userProfile.avatar) el.setAttribute('style', avatarStyle(state.userProfile.name));

  document.getElementById('profile-student-number').textContent = state.userProfile.studentNumber || '-';
  document.getElementById('profile-section').textContent = state.userProfile.section || '-';
  document.getElementById('profile-bio-text').textContent =
    (state.userProfile.bio && state.userProfile.bio.trim()) || 'No bio yet. Select Edit Profile to add one.';

  document.getElementById('public-profile-state').textContent = state.userProfile.publicProfile ? 'On' : 'Off';

  renderLevelCard();
  renderAwardsGrid();
}

function renderLevelCard() {
  const g = state.gamification;
  const pct = Math.min(100, Math.round((g.xp / g.xpTarget) * 100));
  const { cur, next } = rankFor(g.level);
  const ring = document.getElementById('level-ring');
  if (ring) ring.style.setProperty('--pct', pct + '%');
  document.getElementById('level-num').textContent = g.level;
  document.getElementById('level-rank').textContent = cur.name;
  document.getElementById('level-xp').textContent = `${g.xp.toLocaleString()} / ${g.xpTarget.toLocaleString()} XP`;
  const remaining = Math.max(0, g.xpTarget - g.xp);
  const levelsToRank = next ? next.min - g.level : 0;
  document.getElementById('level-next').textContent = next
    ? `${remaining.toLocaleString()} XP to level ${g.level + 1}, ${levelsToRank} level${levelsToRank === 1 ? '' : 's'} to ${next.name}`
    : `${remaining.toLocaleString()} XP to level ${g.level + 1}. Top rank reached`;
}

function renderAwardsGrid() {
  const grid = document.getElementById('awards-grid');
  grid.innerHTML = state.awards.map(a => `
    <div class="award-card">
      <div class="award-ico">${iconSVG(/completion/i.test(a.title) ? 'cap' : /level/i.test(a.title) ? 'bolt' : 'award')}</div>
      <div>
        <div class="award-title">${esc(a.title)}</div>
        <div class="award-date">${new Date(a.date + 'T00:00:00').toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      </div>
    </div>
  `).join('') || `<p class="empty-note">No awards yet.</p>`;
}

document.getElementById('avatar-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  readImageScaled(file, 400)
    .then(url => {
      state.userProfile.avatar = url;
      renderAvatarEverywhere();
      persist();
    })
    .catch(() => toast('That image could not be read. Try a JPG or PNG'));
});

document.getElementById('open-edit-profile').addEventListener('click', () => {
  const form = document.getElementById('profile-edit-form');
  form.hidden = !form.hidden;
});

document.getElementById('toggle-public-profile').addEventListener('click', () => {
  state.userProfile.publicProfile = !state.userProfile.publicProfile;
  document.getElementById('public-profile-state').textContent = state.userProfile.publicProfile ? 'On' : 'Off';
  persist();
  toast(state.userProfile.publicProfile ? 'Your profile is now public' : 'Your profile is now private');
});

document.getElementById('profile-dark-toggle').addEventListener('click', toggleTheme);

document.getElementById('profile-save').addEventListener('click', () => {
  const name = document.getElementById('profile-name-input').value.trim();
  if (!name) return;
  state.userProfile.name = name;
  state.userProfile.studentNumber = document.getElementById('profile-studentnum-input').value.trim();
  state.userProfile.section = document.getElementById('profile-section-input').value.trim();
  state.userProfile.bio = document.getElementById('profile-bio-input').value.trim();

  document.getElementById('header-name').textContent = name;
  document.getElementById('footer-name').textContent = name;
  renderAvatarEverywhere();
  renderProfileStats();
  renderProfilePage();
  document.getElementById('profile-edit-form').hidden = true;
  persist();
  toast('Profile updated');
});

applyTheme();
enterApp();
persist();
