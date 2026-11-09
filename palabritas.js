/* Palabritas: Spanish for little learners (Pre-K, Kindergarten, 1st Grade), US edition.
   Runs on kids-core (see core/): saved data, grown-up PIN, voice, sounds, confetti, adaptive levels,
   content packs and offline use all come from the core. This file is only Palabritas' own
   cards and games. Words, levels and grade rules are in data/palabritas.json; colours in app.config.json. */
const PD = (k) => ContentData.get('palabritas', k);
const TOPICS = PD('TOPICS'), GRADES = PD('GRADES'), AGES = PD('AGES'), AGEW = PD('AGE_WORDS'), LETTERS = PD('LETTERS');
const VERSION = AppConfig.app.version, GO = Object.keys(GRADES);
const gi = (g) => GO.indexOf(g);
const STICKERS = ['🦄','🐶','🐱','🦊','🐼','🐯','🦁','🐸','🐵','🐰','🐻','🐨','🐧','🦖','🐙','🦋','🚀','⚽','🌈','⭐','🍦','🍩','🎈','🎁','🏆','🌻','🍉','🐳','🦒','🐢','🌮','🎨','🎵','🚂','🧸','🪁','🌟','🍓','🐝','🦜'];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const plain = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PRAISE = ['¡Muy bien!', '¡Excelente!', '¡Fantástico!', '¡Genial!', '¡Bravo!', '¡Increíble!'];
const tid = (t) => TOPICS[t].id;
const tIndex = (id) => TOPICS.findIndex((T) => T.id === id);

/* ---------- saved data (kids-core Store) ---------- */
// Palabritas 1.x saved under "pal3" (and "pal2" before that). Turn it into the kids-core shape once.
function fromOld(old) {
  const root = { schema: 3, savedAt: Date.now(), active: 'p1', order: [], device: { voice: !(old.device && old.device.voice === false) }, profiles: {} };
  if (old.device && old.device.pinHash) root.device.pinHash = old.device.pinHash;
  const byId = (o) => { const out = {}; for (const [k, v] of Object.entries(o || {})) { const t = +k; if (TOPICS[t]) out[tid(t)] = v; } return out; };
  old.kids.slice(0, MAX_KIDS).forEach((k, n) => {
    const id = 'p' + (n + 1);
    const levels = {}; for (const [t, v] of Object.entries(byId(k.lvl))) if (Number.isInteger(v)) levels[t] = v + 1;
    const best = {}; for (const [key, v] of Object.entries(k.best || {})) { const [t, i, m] = key.split('|'); if (TOPICS[+t]) best[`${tid(+t)}|${i}|${m}`] = v; }
    root.profiles[id] = { name: k.name || '', avatar: k.avatar, grade: k.grade || null, sex: k.sex || '', age: k.age || 0, stars: k.stars || 0, stickers: k.stickers || [],
      box: k.box || {}, miss: k.miss || {}, levels, cur: byId(k.cur), prog: {}, best, log: k.log || {}, showAll: !!k.showAll, last: k.last != null && TOPICS[k.last] ? tid(k.last) : null };
    root.order.push(id); if (k.id === old.cur) root.active = id;
  });
  return root;
}
(function migrateOldSave() {
  if (localStorage.getItem(STORE_KEY)) return;
  const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  let old = read('pal3');
  if (!old || !Array.isArray(old.kids)) { const o2 = read('pal2'); old = o2 && Array.isArray(o2.kids) ? { device: {}, kids: o2.kids, cur: o2.cur } : null; }
  if (!old || !old.kids.length) return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(fromOld(old))); } catch {}   // the old copy stays as it was
})();
const state = Store.load();
if (state.voice == null) state.voice = true;
if (!state.offlineAudio) state.offlineAudio = 'full';     // about 800 short clips: small enough to keep them all
const K = state;                                           // the active child (plus device settings)
let saveWarned = false;
Store.onError = () => { if (!saveWarned) { saveWarned = true; toast('Progress could not be saved on this device (storage may be full).'); } };
function save() { Store.save(state); }
const kidCount = () => Store.root.order.length;
const allKids = () => { save(); return Store.kids(); };
const isActive = (id) => id === Store.activeId();
void ContentPacks.load();

/* Learn & Play on this device (same website): children to copy. The PIN is shared by the core. */
function lpKids() {
  const d = Store.peek('learnplay.v1'); if (!d || !d.profiles) return [];
  return (d.order || Object.keys(d.profiles)).map((id) => d.profiles[id]).filter((p) => p && p.name)
    .map((p) => ({ name: String(p.name).slice(0, 20), grade: p.grade === 'prek' || p.grade === 'k' ? p.grade : p.grade ? 'g1' : null }));
}
const hasLearnPlay = () => !!Store.peek('learnplay.v1');

/* ---------- grade, levels and personal content ---------- */
const G = () => GRADES[K.grade || 'g1'];
const lvOK = (L) => gi(L.g) <= gi(K.grade || 'g1') || K.showAll;
const levelsFor = (t) => TOPICS[t].L.map((L, i) => ({ L, i })).filter((x) => lvOK(x.L));
const itemsOf = (L) => L.w.filter((w) => !(w.sx && w.sx !== K.sex) && !(w.age && !K.age));
const esFull = (w) => ((w.a ? w.a + ' ' : '') + w.es).replace('{A}', AGEW.es[K.age] || '');
const enFull = (w) => w.en.replace('{A}', AGEW.en[K.age] || '');
const nameIn = (s) => s.replace('{N}', K.name || '');
const picOf = (w) => (w.p === 'n:{A}' ? 'n:' + K.age : w.p);
const box = (w) => K.box[w.es] || 0;
const learned = (w) => box(w) >= 2;
const getLv = (t) => (K.levels[tid(t)] != null ? K.levels[tid(t)] - 1 : null);   // saved 1-based (kids-core levels)
const setLv = (t, i) => { K.levels[tid(t)] = i + 1; };
function topLv(t) {
  const ls = levelsFor(t); if (!ls.length) return 0; let v = getLv(t);
  if (v == null) {
    v = ls[0].i;
    for (let k = 0; k < ls.length - 1; k++) { const it = itemsOf(ls[k].L); if (it.length && it.filter(learned).length / it.length >= 0.8) v = ls[k + 1].i; else break; }
    setLv(t, v);
  }
  const ok = ls.filter((x) => x.i <= v); return ok.length ? ok[ok.length - 1].i : ls[0].i;
}
const isOpen = (t, i) => i <= topLv(t);
const nextLv = (t, i) => { const n = levelsFor(t).find((x) => x.i > i); return n ? n.i : null; };
const prevLv = (t, i) => { const p = levelsFor(t).filter((x) => x.i < i); return p.length ? p[p.length - 1].i : null; };
const lvNum = (t, i) => levelsFor(t).findIndex((x) => x.i === i) + 1;
const curLv = (t) => K.cur[tid(t)];
function gradeItems(t) { const seen = new Set(); return levelsFor(t).flatMap((x) => itemsOf(x.L)).filter((w) => !seen.has(w.es) && seen.add(w.es)); }
const allGradeItems = () => { const seen = new Set(); return TOPICS.flatMap((_, t) => gradeItems(t)).filter((w) => !seen.has(w.es) && seen.add(w.es)); };
const score = () => { const a = allGradeItems(); return a.length ? Math.round(100 * a.reduce((s, w) => s + Math.min(4, box(w)), 0) / (4 * a.length)) : 0; };
function weakItems() {
  const out = [];
  TOPICS.forEach((T, t) => levelsFor(t).filter((x) => isOpen(t, x.i)).forEach((x) => itemsOf(x.L).forEach((w) => {
    if (box(w) < 2 && (K.miss[w.es] || 0) > 0 && !out.some((o) => o.w.es === w.es)) out.push({ w, t, i: x.i });
  })));
  return out.sort((a, b) => (K.miss[b.w.es] - box(b.w)) - (K.miss[a.w.es] - box(a.w)));
}

/* ---------- voice (kids-core say): Spanish voice Dora, English voice Heart ---------- */
// parts: Spanish text, or "en:" + English text. {N} = the child's name (the only thing the device voice says).
function talk(parts, opt = {}) {
  const out = [];
  for (const raw of [].concat(parts)) {
    const en = raw.startsWith('en:'), lang = en ? 'en' : 'es';
    const bits = (en ? raw.slice(3) : raw).replace('{A}', AGEW[lang][K.age] || '').split('{N}');
    bits.forEach((b, i) => {
      if (K.name && clipKey(b) === clipKey(K.name)) out.push({ text: K.name, device: true });   // a sentence word that is the name
      else if (clipKey(b)) out.push(en ? { text: b, lang: 'en' } : b);
      if (i < bits.length - 1 && K.name) out.push({ text: K.name, device: true });
    });
  }
  return say(out, { rate: opt.slow ? 0.7 : 1 });
}
function hush() { sayToken++; stopClip(); }
document.addEventListener('visibilitychange', () => { if (document.hidden) hush(); });
const sayLetter = (l) => talk(LETTERS[plain(l)] || l);
const sayTokText = (s) => talk(s.replace(/[.,¡!¿?]/g, ''));
const sayItem = (w, slow) => talk(esFull(w), { slow });
const fx = { ok: () => sfx.yes(), no: () => sfx.no(), win: () => sfx.win(), tap: () => sfx.tap() };
const party = (n) => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) confetti(n, 0.35); };
let toastT = null;
function toast(text) { clearTimeout(toastT); $('#toastBox').innerHTML = `<div class="toast" role="status">${esc(text)}</div>`; toastT = setTimeout(() => { $('#toastBox').innerHTML = ''; }, 3800); }

/* ---------- pictures ---------- */
function pic(p) {
  if (p.startsWith('t:')) return `<span class="tword">${esc(p.slice(2))}</span>`;
  if (p === 'a:') return `<img class="pimg" src="img/${K.avatar}.webp" alt="" draggable="false">`;
  if (p.startsWith('i:')) return `<img class="pimg" src="img/${p.slice(2)}.webp" alt="" draggable="false" decoding="async">`;
  if (p.startsWith('#')) return `<span class="swatch" style="--c:${p}"></span>`;
  const n = +p.slice(2); let vis = '';
  if (n <= 20) { const f = Math.max(1, Math.ceil(n / 10)); for (let k = 0; k < f; k++) { let c = ''; for (let j = 0; j < 10; j++) c += `<i class="${k * 10 + j < n ? 'on' : ''}"></i>`; vis += `<span class="tf">${c}</span>`; } }
  else vis = `<span class="tens">${'<i></i>'.repeat(n / 10)}</span>`;
  return `<span class="numpic"><span class="numeral">${n}</span><span class="frames">${vis}</span></span>`;
}
function mini(w) { const p = picOf(w); return p.startsWith('i:') ? `<img src="img/${p.slice(2)}.webp" alt="">` : p === 'a:' ? `<img src="img/${K.avatar}.webp" alt="">` : p.startsWith('#') ? `<span class="mini" style="background:${p}"></span>` : p.startsWith('t:') ? '<span class="mini">Aa</span>' : `<span class="mini">${esc(p.slice(2))}</span>`; }

/* ---------- screens ---------- */
const S = { screen: 'splash', t: 0, i: 0, c: 0, reps: 0, R: null, grown: false, hist: { listen: [], spell: [], build: [] } };
function show(id) {
  hush(); S.screen = id; $$('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  if (id === 'home' || id === 'topic') S.grown = false;
  document.documentElement.style.setProperty('--rs', String(K.grade && GRADES[K.grade] ? GRADES[K.grade].scale : 1));
  try { scrollTo(0, 0); } catch {}
}
function setSheet(html) { $('#sheetBox').innerHTML = html ? `<div class="sheet" id="sheet">${html}</div>` : ''; $$('.screen').forEach((s) => { s.inert = !!html; }); }

/* grown-up PIN: kids-core askPin (the same PIN as Learn & Play on this device) */
const gate = (fn, change = false) => askPin(() => { S.grown = true; fn(); }, change);
const grown = (fn) => (S.grown ? fn() : gate(fn));

/* ---------- parent-led setup ---------- */
const needsSetup = () => !K.grade || !GRADES[K.grade] || !K.name;
function openWelcome(adding = false) {
  const names = allKids().map((k) => (k.name || '').toLowerCase());
  const lp = lpKids().filter((x) => !names.includes(x.name.toLowerCase()));
  const draft = S.draft = { avatar: K.avatar || rnd(AVATARS), sex: K.sex || '', grade: K.grade || null };
  setSheet(`<div class="sheet-box" role="dialog" aria-modal="true" aria-labelledby="welTitle">
    <div class="kicker">Spanish for little learners</div>
    <h2 id="welTitle">Who is learning Spanish?</h2>
    <p class="note">A grown-up sets this up once. Each child gets their own levels, stars and progress.</p>
    ${lp.length ? `<div class="field">From Learn &amp; Play on this device<small>Tap to copy a child's name and grade.</small><div class="lp-kids">${lp.map((x, i) => `<button data-w="lp" data-k="${i}">＋ ${esc(x.name)}${x.grade ? ` · ${esc(GRADES[x.grade].label)}` : ''}</button>`).join('')}</div></div>` : ''}
    <label class="field" for="welName">Child's name<input id="welName" maxlength="20" autocomplete="off" placeholder="First name" value="${esc(K.name)}"></label>
    <div class="field">Pick a buddy<div class="avs">${AVATARS.map((a) => `<button class="av" data-w="av" data-k="${a}" aria-pressed="${a === draft.avatar}" aria-label="${a.replace(/-face/, '').replace(/-/g, ' ')}"><img src="img/${a}.webp" alt=""></button>`).join('')}</div></div>
    <div class="field">For sentences like “Soy una niña”<small>Spanish says boy and girl differently.</small>
      <div class="seg">${[['m', 'Boy', 'niño'], ['f', 'Girl', 'niña'], ['', 'Skip', '']].map((x) => `<button data-w="sex" data-k="${x[0]}" aria-pressed="${draft.sex === x[0]}">${x[1]}${x[2] ? `<small>${x[2]}</small>` : ''}</button>`).join('')}</div></div>
    <label class="field" for="welAge">Age<small>Used for “Tengo cinco años” (I am five).</small><select id="welAge"><option value="0">Skip</option>${AGES.map((a) => `<option value="${a}" ${K.age === a ? 'selected' : ''}>${a}</option>`).join('')}</select></label>
    <div class="field">Pick their grade to begin<div class="grades">${GO.map((g) => `<button data-w="grade" data-k="${g}" aria-pressed="${draft.grade === g}"><b>${GRADES[g].label}</b><small>${GRADES[g].ages}</small></button>`).join('')}</div></div>
    <p class="err" id="welErr" role="alert"></p>
    <p class="note small">Up to ${MAX_KIDS} children on this device. Add more later in ⚙️ Grown-up settings.</p>
    ${adding && kidCount() > 1 ? '<button class="link-btn" data-w="cancel" style="color:var(--soft)">Cancel adding this child</button>' : ''}
  </div>`);
  S.welHandler = (w, key) => {
    const d = S.draft;
    if (w === 'lp') { const x = lp[+key]; $('#welName').value = x.name; if (x.grade) { d.grade = x.grade; $$('[data-w="grade"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === x.grade)); } return; }
    if (w === 'av') { d.avatar = key; $$('[data-w="av"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === key)); return; }
    if (w === 'sex') { d.sex = key; $$('[data-w="sex"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === key)); return; }
    if (w === 'cancel') { Store.removeKid(Store.activeId(), state); setSheet(''); renderHome(); show('home'); return; }
    if (w === 'grade') {
      const name = $('#welName').value.trim().replace(/[<>&"'`]/g, '').slice(0, 20);
      if (!name) { $('#welErr').textContent = 'Please enter a name so each child has their own progress.'; $('#welName').focus(); return; }
      Object.assign(K, { name, avatar: d.avatar, sex: d.sex, age: +$('#welAge').value || 0, grade: key, levels: {}, cur: {}, prog: {} });
      TOPICS.forEach((_, t) => topLv(t)); save(); welcomeDone();
    }
  };
}
function welcomeDone() {
  setSheet(`<div class="sheet-box" style="text-align:center;align-items:center">
    <img src="img/${K.avatar}.webp" alt="" style="width:110px">
    <div class="kicker">Ready</div><h2>${esc(K.name)}’s Spanish adventure is ready!</h2>
    <p class="note">${esc(GRADES[K.grade].label)}: ${K.grade === 'prek' ? 'listening, matching pictures and saying words out loud. No reading needed.' : K.grade === 'k' ? 'listening, matching, saying words, and first reading and spelling.' : 'listening, matching, reading, spelling and building sentences.'} Levels move up as ${esc(K.name)} plays well.</p>
    <button class="big-btn" data-w="go" style="width:100%">▶ Start learning</button>
    ${kidCount() < MAX_KIDS ? '<button class="big-btn alt" data-w="another" style="width:100%">＋ Set up another child</button>' : ''}
  </div>`);
  S.welHandler = (w) => {
    if (w === 'go') { setSheet(''); renderHome(); show('home'); talk(['¡Hola!{N}', "en:Let's learn some Spanish!"]); }
    if (w === 'another' && Store.addKid({}, state)) { resetRun(); openWelcome(true); }
  };
}
function openWho() {
  setSheet(`<div class="sheet-box"><h2>Who is learning today?</h2>
    <div class="who-grid">${allKids().map((k) => `<button class="who-kid ${isActive(k.id) ? 'on' : ''}" data-who="${k.id}"><img src="img/${k.avatar}.webp" alt=""><span>${esc(k.name || 'New child')}</span><small>${k.grade && GRADES[k.grade] ? GRADES[k.grade].label : 'Needs setup'}</small></button>`).join('')}
    ${kidCount() < MAX_KIDS ? '<button class="who-kid add" data-who="add"><span class="plus">＋</span><span>Add a child</span><small>Grown-up PIN</small></button>' : ''}</div>
    <p class="note small">Switching children needs the grown-up PIN.</p></div>`);
  S.whoHandler = (id) => {
    if (isActive(id)) { setSheet(''); talk(['¡Hola!{N}']); return; }
    setSheet('');
    if (id === 'add') return gate(() => { if (Store.addKid({}, state)) { resetRun(); openWelcome(true); } });
    gate(() => { switchKid(id); if (needsSetup()) openWelcome(); else { renderHome(); show('home'); talk(['¡Hola!{N}']); } });
  };
}
function resetRun() { S.hist = { listen: [], spell: [], build: [] }; S.R = null; }
function switchKid(id) { Store.switchTo(id, state); resetRun(); }

/* ---------- home ---------- */
function renderHome() {
  $('#kidBtn').innerHTML = `<img src="img/${K.avatar}.webp" alt="">`;
  $('#hello').textContent = `¡Hola, ${K.name}!`;
  $('#starN').textContent = K.stars; $('#stickN').textContent = K.stickers.length; $('#gradeN').textContent = GRADES[K.grade].label;
  const weak = weakItems(), b = $('#banner');
  if (weak.length >= 3) { b.dataset.k = 'review'; b.innerHTML = `<img src="img/sparkles.webp" alt=""><div><b>🔁 Repaso · Practice time</b><span>${Math.min(5, weak.length)} tricky words to practice</span></div>`; }
  else {
    const last = K.last != null ? tIndex(K.last) : -1;
    const t = last >= 0 ? last : TOPICS.findIndex((_, t) => gradeItems(t).some((w) => !learned(w))); const tt = t < 0 ? 0 : t;
    b.dataset.k = String(tt); b.innerHTML = `<img src="img/${TOPICS[tt].i}.webp" alt=""><div><b>▶ Keep going</b><span>${esc(TOPICS[tt].n)} · Nivel ${lvNum(tt, curLv(tt) ?? topLv(tt)) || 1}</span></div>`;
  }
  $('#grid').innerHTML = TOPICS.map((T, t) => {
    const all = gradeItems(t), l = all.filter(learned).length, ls = levelsFor(t);
    return `<button class="tile" data-act="topic" data-k="${t}" style="--c:${T.c}"><span class="lv">Nivel ${lvNum(t, topLv(t))}/${ls.length}</span>
      <img src="img/${T.i}.webp" alt=""><span class="tt">${esc(T.n)}</span><span class="ts">${esc(T.en)}</span>
      <span class="tbar" aria-label="${l} of ${all.length} learned"><i style="width:${all.length ? Math.round(l / all.length * 100) : 0}%"></i></span></button>`;
  }).join('');
}

/* ---------- topic ---------- */
function activities() {
  const L = TOPICS[S.t].L[S.i], g = G(), items = itemsOf(L), acts = [['learn', '📖', 'Aprender', 'Learn'], ['listen', '👂', 'Escuchar', 'Listen'], ['match', '🃏', 'Parejas', 'Match']];
  if (L.k !== 's' && g.spell && items.filter(spellable).length >= 2) acts.push(['spell', '🔤', 'Deletrear', 'Spell']);
  if (L.k === 's' && g.build && items.filter(buildable).length >= 2) acts.push(['build', '🧩', 'Ordenar', 'Build it']);
  return acts;
}
function renderTopic() {
  const T = TOPICS[S.t], ls = levelsFor(S.t), top = topLv(S.t), cur = curLv(S.t);
  $('#tTitle').innerHTML = `${esc(T.n)}<small>${esc(T.en)}</small>`;
  $('#lvls').innerHTML = ls.map((x, n) => {
    const it = itemsOf(x.L), l = it.filter(learned).length, locked = x.i > top;
    return `<button class="lvl ${locked ? 'locked' : ''}" data-act="lvl" data-k="${x.i}" aria-pressed="${x.i === S.i}">
      <b>${locked ? '🔒' : '⭐'} Nivel ${n + 1}</b><span>${esc(x.L.n)}</span>${locked ? '' : `<span class="bar" aria-label="${l} of ${it.length} learned"><i style="width:${it.length ? Math.round(l / it.length * 100) : 0}%"></i></span>`}
      ${!locked && cur === x.i && cur < top ? '<span class="tip">🙂 Practice here a bit more</span>' : ''}</button>`;
  }).join('');
  $('#acts').innerHTML = activities().map((a) => {
    const b = K.best[`${tid(S.t)}|${S.i}|${a[0]}`] || 0;
    return `<button class="act" data-act="act" data-k="${a[0]}"><span class="ai">${a[1]}</span><b>${a[2]}</b><span>${a[3]}</span>
      <span class="st" aria-label="Best ${b} of 3 stars">${a[0] === 'learn' ? '' : '★'.repeat(b) + '☆'.repeat(3 - b)}</span></button>`;
  }).join('');
  $('#preview').innerHTML = itemsOf(T.L[S.i]).map((w) => `<span>${esc(nameIn(esFull(w)))}${learned(w) ? ' <span class="k">★</span>' : ''}</span>`).join('');
  ls.forEach((x) => itemsOf(x.L).forEach((w) => { const p = picOf(w); if (p.startsWith('i:')) { const im = new Image(); im.src = `img/${p.slice(2)}.webp`; } }));
}
function openTopic(t) {
  S.t = t; K.last = tid(t); const top = topLv(t), c = curLv(t);
  S.i = c != null && isOpen(t, c) && TOPICS[t].L[c] && lvOK(TOPICS[t].L[c]) ? c : top; S.c = 0; S.reps = 0;
  save(); renderTopic(); show('topic');
}

/* ---------- learn cards ---------- */
const sayHTML = (p) => esc(p).split(/([- ])/).map((s) => (/^[A-Z]+$/.test(s) ? `<b>${s}</b>` : s)).join('');
function knowHTML(w) { const b = box(w), n = b >= 4 ? 3 : b >= 2 ? 2 : b >= 1 ? 1 : 0; return `<div class="know" aria-label="How well it's known">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}">★</i>`).join('')} ${['New', 'Seen', 'Learned', 'Mastered'][n]}</div>`; }
function renderLearn() {
  const L = TOPICS[S.t].L[S.i], ws = itemsOf(L); if (S.c >= ws.length) S.c = 0; const w = ws[S.c];
  $('#lTitle').innerHTML = `Nivel ${lvNum(S.t, S.i)}<small>${esc(L.en)}</small>`;
  const head = L.k === 's'
    ? `<div class="word sent">${nameIn(esFull(w)).split(' ').map((x) => `<button class="wchip" data-act="sayWord" data-k="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="en">${esc(nameIn(enFull(w)))}</div>`
    : L.k === 't' ? `<div class="say">${sayHTML(w.pr)}</div><div class="en">${esc(w.en)}</div>`
      : `<div class="word">${w.a ? `<span class="art">${esc(w.a)}</span> ` : ''}${esc(w.es)}</div><div class="say" aria-label="Pronunciation">${sayHTML(w.pr)}</div><div class="en">${esc(w.en)}</div>`;
  $('#learnBody').innerHTML = `<section class="card learn">
    <button class="pic" data-act="hear" aria-label="Hear it">${pic(picOf(w))}</button>
    ${head}${knowHTML(w)}
    <div class="row"><button class="btn hear grow" data-act="hear">🔊 Escuchar</button><button class="btn slow" data-act="slow">🐢 Slow</button><button class="btn slow" data-act="meaning">💬 English</button></div>
    <div class="repeat"><p>${L.k === 's' ? 'Tap a word to hear it. Then say it together, 3 times!' : 'Say it out loud together, 3 times!'}</p>
      <div class="dots">${[0, 1, 2].map((d) => `<button class="dot ${d < S.reps ? 'on' : ''}" data-act="rep" aria-label="Said it ${d + 1}">${d < S.reps ? '✓' : d + 1}</button>`).join('')}</div></div>
    <div class="nav"><span class="swipe" aria-hidden="true">‹ swipe</span><span class="count">${S.c + 1} / ${ws.length}</span><span class="swipe" aria-hidden="true">swipe ›</span></div>
  </section>`;
}

/* ---------- rounds: listen, spell, build, match ---------- */
const spellable = (w) => /^[a-záéíóúüñ]+$/i.test(w.es) && [...w.es].length <= G().spell;
const buildable = (w) => { const n = nameIn(esFull(w)).split(' ').length; return n >= 2 && n <= G().build; };
const NAMES = { listen: '👂 Escuchar', spell: '🔤 Deletrear', build: '🧩 Ordenar', match: '🃏 Parejas' };
function pickFrom(pool, count, filter) {
  // weak items come up more; about 1 in 4 cards reviews shaky items from earlier levels; no item more than twice
  const out = [], used = {};
  const earlier = S.R && !S.R.review ? levelsFor(S.t).filter((x) => x.i < S.i).flatMap((x) => itemsOf(x.L).filter((w) => filter(w) && box(w) < 3)) : [];
  for (let n = 0; n < count; n++) {
    const src = earlier.length && Math.random() < 0.25 ? earlier : pool;
    let cand = src.filter((w) => (used[w.es] || 0) < 2 && !(out.length && out[out.length - 1].es === w.es));
    if (!cand.length) cand = pool.filter((w) => (used[w.es] || 0) < 2 && !(out.length && out[out.length - 1].es === w.es));
    if (!cand.length) break;
    const wt = cand.map((w) => Math.pow(6 - box(w), 2) * ((used[w.es] || 0) ? 0.35 : 1));
    let r = Math.random() * wt.reduce((a, b) => a + b, 0), pick = cand[0];
    for (let i = 0; i < cand.length; i++) { r -= wt[i]; if (r <= 0) { pick = cand[i]; break; } }
    out.push(pick); used[pick.es] = (used[pick.es] || 0) + 1;
  }
  return out;
}
const struggling = (m) => { const h = S.hist[m]; return h.length >= 4 && h.reduce((a, b) => a + b, 0) / h.length < 0.5; };
const doingWell = (m) => { const h = S.hist[m]; return h.length >= 4 && h.reduce((a, b) => a + b, 0) / h.length >= 0.75; };
function startRound(mode, review) {
  hush();
  const L = TOPICS[S.t].L[S.i];
  S.R = { mode, review: !!review, t: S.t, i: S.i, qs: [], k: 0, res: [], first: 0, mistakes: 0, q: null, intro: true, top: S.i === topLv(S.t), packSeen: [] };
  if (review) S.R.qs = review;
  else if (mode === 'match') S.R.qs = [0];
  else { const f = mode === 'spell' ? spellable : mode === 'build' ? buildable : () => true; S.R.qs = pickFrom(itemsOf(L).filter(f), G().round, f); }
  $('#rTitle').innerHTML = review ? '🔁 Repaso<small>Practice tricky words</small>' : `${NAMES[mode]}<small>Nivel ${lvNum(S.t, S.i)} · ${esc(L.en)}</small>`;
  show('round'); nextQ();
}
function renderProg() {
  const R = S.R; if (R.mode === 'match') { $('#prog').innerHTML = ''; return; }
  $('#prog').innerHTML = R.qs.map((_, i) => `<span class="pd ${i < R.k ? (R.res[i] ? 'ok' : 'meh') : i === R.k ? 'now' : ''}">${i < R.k ? (R.res[i] ? '⭐' : '✓') : ''}</span>`).join('');
}
function nextQ() {
  const R = S.R; if (R.k >= R.qs.length) return finish();
  renderProg();
  if (R.mode === 'listen') { if (!newPackQ()) newListen(); renderListen(); }
  else if (R.mode === 'spell') { newSpell(); renderPuzzle(); }
  else if (R.mode === 'build') { newBuild(); renderPuzzle(); }
  else { newMatch(); renderMatch(); }
  promptQ();
}
function promptQ() {
  const R = S.R, q = R.q; if (!q) return;
  if (q.pack) { R.intro = false; return; }       // downloaded pack questions are read, not spoken
  const intro = R.intro ? { listen: q.sight ? 'en:Listen, then tap the word.' : 'en:Listen, then tap the picture.', spell: 'en:Spell the word.', build: 'en:Put the words in order.',
    match: q.kind === 'pp' ? 'en:Find two that match.' : q.kind === 'et' ? 'en:Match the Spanish and the English.' : 'en:Match the picture and the word.' }[R.mode] : null;
  R.intro = false;
  if (R.mode === 'match') return intro && talk(intro);
  talk(intro ? [intro, esFull(q.w)] : [esFull(q.w)]);
}
function replay(slow) { const R = S.R; if (!R || !R.q || R.mode === 'match' || R.q.pack) return; talk(esFull(R.q.w), { slow }); }
function logAnswer(w, ok) {
  const d = dayKey(new Date()), L = K.log[d] || (K.log[d] = { a: 0, c: 0, r: 0 }); L.a++;
  if (ok) L.c++; else if (w) K.miss[w.es] = (K.miss[w.es] || 0) + 1;
  const keys = Object.keys(K.log).sort(); while (keys.length > 120) delete K.log[keys.shift()];
}
function cardDone(first, said) {
  const R = S.R, q = R.q; q.done = true; R.res[R.k] = first; if (first) R.first++;
  if (R.mode !== 'match') S.hist[R.mode] = (S.hist[R.mode] || []).concat(first ? 1 : 0).slice(-8);
  save();
  const go = () => { if (S.R === R && S.screen === 'round' && R.q === q) { R.k++; nextQ(); } };
  Promise.race([said || Promise.resolve(), sleep(6000)]).then(() => setTimeout(go, 550));
}
function firstMiss(q) { if (q.tries === 0) { if (q.w) K.box[q.w.es] = Math.max(0, box(q.w) - 1); logAnswer(q.w, false); } q.tries++; S.R.mistakes++; }
function firstHit(q) { if (q.tries === 0 && !q.hinted) { if (q.w) K.box[q.w.es] = Math.min(5, box(q.w) + 1); logAnswer(q.w, true); return true; } return false; }

/* listen */
function newListen() {
  const R = S.R, w = R.qs[R.k], ctxT = w._t != null ? w._t : S.t, sight = w.p.startsWith('t:');
  let n = G().choices; if (K.grade === 'k' && doingWell('listen')) n = 4; if (struggling('listen')) n = 3;
  const others = [], seen = new Set([w.es]), pics = new Set([picOf(w)]);
  const add = (x) => { if (others.length >= n - 1 || seen.has(x.es) || pics.has(picOf(x)) || x.p.startsWith('t:') !== sight) return; if (sight && plain(x.es) === plain(w.es)) return; others.push(x); seen.add(x.es); pics.add(picOf(x)); };
  const T = TOPICS[ctxT], li = w._i != null ? w._i : S.i;
  shuffle(itemsOf(T.L[li])).forEach(add);
  shuffle(levelsFor(ctxT).filter((x) => isOpen(ctxT, x.i)).flatMap((x) => itemsOf(x.L))).forEach(add);
  shuffle(levelsFor(ctxT).flatMap((x) => itemsOf(x.L))).forEach(add);
  R.q = { w, opts: shuffle([w, ...others]), tries: 0, done: false, sight };
}
// Downloaded content packs (kids-core schema 1, category = topic id, level = Nivel number):
// readers sometimes get one of their questions in place of a picture card.
function newPackQ() {
  const R = S.R; if (R.review || K.grade === 'prek' || Math.random() >= 0.25) return false;
  const q = ContentPacks.choose(K.grade, tid(S.t), lvNum(S.t, S.i), R.packSeen); if (!q) return false;
  R.packSeen.push(q.key); R.q = { pack: q, opts: shuffle(q.options), tries: 0, done: false };
  return true;
}
function renderListen() {
  const q = S.R.q;
  if (q.pack) {
    $('#roundBody').innerHTML = `<section class="card">${q.pack.main}<p class="prompt">${q.pack.text}</p>
      <div class="choices text" id="choices">${q.opts.map((o, k) => `<button class="choice" data-act="pick" data-k="${k}"><span class="mtext">${o.html}</span></button>`).join('')}</div>
      <div class="msg" id="msg" aria-live="polite"></div></section>`;
    return;
  }
  $('#roundBody').innerHTML = `<section class="card">
    <p class="prompt">${q.sight ? 'Listen, then tap the word' : 'Listen, then tap the picture'}</p>
    <div class="row"><button class="btn hear grow" data-act="replay">🔊 Play it</button><button class="btn slow" data-act="replaySlow">🐢 Slow</button></div>
    <div class="choices ${q.opts.length === 3 ? 'three' : ''}" id="choices">${q.opts.map((o, k) => `<button class="choice" data-act="pick" data-k="${k}" aria-label="${esc(nameIn(enFull(o)))}">${pic(picOf(o))}<span class="cap">${esc(nameIn(enFull(o)))}</span></button>`).join('')}</div>
    <div class="msg" id="msg" aria-live="polite"></div></section>`;
}
function pickListen(k, b) {
  const R = S.R, q = R.q; if (q.done || b.disabled) return; const o = q.opts[k], m = $('#msg');
  const right = q.pack ? o.v === q.pack.answer : o === q.w;
  if (right) {
    b.classList.add('right'); fx.ok(); $$('.choice').forEach((c) => { c.disabled = true; });
    const first = firstHit(q); if (!first && q.tries === 0) logAnswer(q.w, true);
    const pr = rnd(PRAISE); m.className = 'msg good'; m.textContent = pr;
    cardDone(first, talk(q.pack ? [pr] : [esFull(q.w), pr]));
  } else {
    firstMiss(q); fx.no(); b.classList.add('wrong'); b.disabled = true; $('#choices').classList.add('reveal');
    m.className = 'msg bad';
    if (q.pack) { m.innerHTML = q.tries >= 2 && q.pack.hint.html ? q.pack.hint.html : '¡Otra vez! Try again'; talk('¡Otra vez!'); return; }
    if (q.tries >= 2) { const i = q.opts.indexOf(q.w); $$('.choice')[i].classList.add('pulse'); m.textContent = `Here it is: ${nameIn(enFull(q.w))}`; talk([esFull(q.w), 'en:' + enFull(q.w)]); }
    else { m.textContent = '¡Otra vez! Try again'; talk(['¡Otra vez!', esFull(q.w)]); }
  }
}

/* spell + build: tap the next piece; a wrong piece shakes right away */
function newSpell() {
  const R = S.R, w = R.qs[R.k], letters = [...w.es.normalize('NFC')];
  const tiles = letters.map((p, i) => ({ p, i }));
  if (K.grade === 'g1' && !struggling('spell')) { const pool = 'aeiloursntmcdp'.split('').filter((c) => !letters.includes(c)); if (pool.length) tiles.push({ p: rnd(pool), i: -1 }); }
  R.q = { w, parts: letters, tiles: shuffle(tiles), placed: [], tries: 0, wrongHere: 0, hinted: false, done: false, ghost: K.grade === 'k' || struggling('spell'), build: false };
}
function newBuild() {
  const R = S.R, w = R.qs[R.k], words = nameIn(esFull(w)).split(' ');
  R.q = { w, parts: words, tiles: shuffle(words.map((p, i) => ({ p, i }))), placed: [], tries: 0, wrongHere: 0, hinted: false, done: false, ghost: false, build: true };
  if (R.q.tiles.every((t, i) => t.i === i) && words.length > 1) R.q.tiles.reverse();
}
function renderPuzzle() {
  const q = S.R.q, w = q.w;
  $('#roundBody').innerHTML = `<section class="card">
    <button class="pic spic" data-act="replay" aria-label="Hear it">${pic(picOf(w))}</button>
    <div class="en">${esc(nameIn(enFull(w)))}</div>
    <div class="row"><button class="btn hear" data-act="replay">🔊 Hear it</button><button class="btn slow" data-act="replaySlow">🐢 Slow</button></div>
    <p class="prompt">${q.build ? 'Tap the words in order' : 'Spell the word'}</p>
    <div class="slots ${q.done ? 'ok' : ''}" id="slots">${q.parts.map((p, k) => (q.build
      ? `<div class="wslot ${k < q.placed.length ? 'fill' : ''}">${k < q.placed.length ? esc(p) : ''}</div>`
      : `<div class="slot ${k < q.placed.length ? 'fill' : q.ghost ? 'ghost-l' : ''}" data-g="${esc(p)}">${k < q.placed.length ? esc(p) : ''}</div>`)).join('')}</div>
    <div class="tiles">${q.tiles.map((t, k) => `<button class="ltile ${q.build ? 'w' : ''}" data-act="tile" data-k="${k}" ${t.used || q.done ? 'disabled' : ''}>${esc(t.p)}</button>`).join('')}</div>
    <div class="msg" id="msg" aria-live="polite"></div>
    ${q.done ? '' : '<div class="row"><button class="btn ghost" data-act="hint">💡 Hint</button></div>'}</section>`;
}
function placeNext(q, idx) { const t = q.tiles[idx]; t.used = true; q.placed.push(t.p); q.wrongHere = 0; }
function tapTile(k, b) {
  const q = S.R.q; if (q.done) return; const t = q.tiles[k]; if (t.used) return; const need = q.parts[q.placed.length];
  if (t.p === need) { placeNext(q, k); if (q.build) sayTokText(t.p); else sayLetter(t.p); if (q.placed.length === q.parts.length) return finishPuzzle(); renderPuzzle(); }
  else {
    firstMiss(q); q.wrongHere++; fx.no(); b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
    const m = $('#msg'); m.className = 'msg bad'; m.textContent = q.build ? 'Not that word yet. Try again!' : 'Not that letter yet. Try again!';
    if (q.wrongHere === 1) talk('en:Try again!');
    if (q.wrongHere >= 2) { const j = q.tiles.findIndex((x) => !x.used && x.p === need); if (j >= 0) $$('.ltile')[j].classList.add('pulse'); talk(['en:Here is a hint.', q.build ? need.replace(/[.,¡!¿?]/g, '') : LETTERS[plain(need)] || need]); }
  }
}
function hintTile() {
  const q = S.R.q; if (q.done) return; q.hinted = true; const need = q.parts[q.placed.length]; const j = q.tiles.findIndex((x) => !x.used && x.p === need);
  if (j < 0) return; placeNext(q, j); if (q.build) sayTokText(need); else sayLetter(need); if (q.placed.length === q.parts.length) return finishPuzzle(); renderPuzzle();
}
function finishPuzzle() {
  const q = S.R.q, first = firstHit(q); if (!first && q.tries === 0) logAnswer(q.w, true);
  q.done = true; fx.ok(); renderPuzzle(); const pr = first ? rnd(PRAISE) : '¡Lo hiciste!';
  const m = $('#msg'); m.className = 'msg good'; m.textContent = first ? pr : '¡Lo hiciste! You did it';
  cardDone(first, sleep(250).then(() => talk([esFull(q.w), pr])));
}

/* match (Parejas): Pre-K matches two pictures; readers match picture and word */
function newMatch() {
  const R = S.R, L = TOPICS[S.t].L[S.i], pool = itemsOf(L), n = Math.min(G().pairs, pool.length);
  const ws = pickFrom(pool, n * 2, () => true).filter((w, i, a) => a.findIndex((x) => x.es === w.es) === i).slice(0, n);
  while (ws.length < n) { const x = pool.find((w) => !ws.includes(w)); if (!x) break; ws.push(x); }
  const kind = K.grade === 'prek' || (L.k === 's' && K.grade === 'k') ? 'pp' : L.k === 't' ? 'et' : 'pw';
  const cards = []; ws.forEach((w, i) => { cards.push({ w, i, side: 'a' }); cards.push({ w, i, side: 'b' }); });
  R.q = { kind, ws, cards: shuffle(cards), up: [], matched: 0, tries: 0, done: false, lock: false, w: ws[0] };
}
function cardFace(c, kind) {
  if (kind === 'pp') return pic(picOf(c.w));
  if (kind === 'et') return c.side === 'a' ? `<span class="mtext">${esc(c.w.es)}</span>` : `<span class="mtext en">${esc(c.w.en)}</span>`;
  return c.side === 'a' ? pic(picOf(c.w)) : `<span class="mtext">${esc(nameIn(esFull(c.w)))}</span>`;
}
function renderMatch() {
  const q = S.R.q, cols = q.cards.length <= 6 ? 'c3' : 'c4';
  $('#roundBody').innerHTML = `<section class="card"><p class="prompt">${q.kind === 'pp' ? 'Find two that match' : q.kind === 'et' ? 'Match the Spanish and the English' : 'Match the picture and the word'}</p>
    <div class="mgrid ${cols}">${q.cards.map((c, k) => `<button class="mcard ${c.done ? 'done' : c.up ? 'up' : ''}" data-act="flip" data-k="${k}" aria-label="Card ${k + 1}"><span class="in"><span class="b">?</span><span class="f">${cardFace(c, q.kind)}</span></span></button>`).join('')}</div>
    <div class="msg" id="msg" aria-live="polite"></div></section>`;
}
function flipCard(k, b) {
  const q = S.R.q, c = q.cards[k]; if (q.lock || c.done || c.up) return;
  c.up = true; b.classList.add('up'); fx.tap(); talk(q.kind === 'et' && c.side === 'b' ? 'en:' + enFull(c.w) : esFull(c.w)); q.up.push(k);
  if (q.up.length < 2) return;
  const [a, bb] = q.up.map((i) => q.cards[i]); q.up = [];
  if (a.i === bb.i) {
    a.done = bb.done = true; q.matched++; const btns = $$('.mcard'); [q.cards.indexOf(a), q.cards.indexOf(bb)].forEach((i) => btns[i].classList.add('done'));
    if (box(a.w) < 1) K.box[a.w.es] = 1; fx.ok();
    if (q.matched === q.ws.length) {
      q.done = true; S.R.first = q.ws.length; S.R.res = [1]; save(); const m = $('#msg'); m.className = 'msg good'; m.textContent = rnd(PRAISE);
      setTimeout(() => { if (S.R && S.R.q === q) { S.R.k = 1; talk(rnd(PRAISE)).then(() => { if (S.R && S.R.q === q) finish(); }); } }, 700);
    }
  } else {
    q.tries++; S.R.mistakes++; q.lock = true;
    setTimeout(() => { a.up = bb.up = false; $$('.mcard').forEach((x, i) => { if (!q.cards[i].done && !q.cards[i].up) x.classList.remove('up'); }); q.lock = false; }, 1000);
  }
}

/* ---------- result + adaptive levels (kids-core progressionOutcome, rules per grade in the data) ---------- */
function progression(t, i, R) {
  const ls = levelsFor(t), pos = lvNum(t, i), id = tid(t);
  const prev = K.prog[id] && K.prog[id].lv === i ? K.prog[id] : {};
  const out = progressionOutcome(G().progression, [1, ls.length], pos, { total: R.qs.length, firstTry: R.first, mistakes: R.mistakes }, prev);
  if (out.status === 'insufficient') return '';
  K.prog[id] = { lv: i, mastery: out.counts.mastery, support: out.counts.support };
  const it = itemsOf(TOPICS[t].L[i]), pct = it.length ? it.filter(learned).length / it.length : 0;
  if (out.status === 'promoted' || out.status === 'top' || (pct >= 0.8 && out.status !== 'supported' && out.status !== 'floor')) {
    const nx = nextLv(t, i); if (nx == null) return 'top';
    setLv(t, Math.max(topLv(t), nx)); K.cur[id] = nx; K.prog[id] = { lv: nx, mastery: 0, support: 0 }; return 'up';
  }
  if (out.status === 'supported') { const pv = prevLv(t, i); if (pv != null) { K.cur[id] = pv; return 'down'; } }
  return '';
}
function finish() {
  const R = S.R; renderProg();
  const n = R.mode === 'match' ? R.q.ws.length : R.qs.length;
  const stars = R.mode === 'match' ? (R.mistakes <= n * 0.5 ? 3 : R.mistakes <= n * 1.5 ? 2 : 1) : (R.mistakes / n <= 0.2 && R.first / n >= 0.8 ? 3 : R.mistakes / n <= 0.5 ? 2 : 1);
  const earned = R.first; K.stars += earned;
  let status = '';
  if (!R.review) { const key = `${tid(R.t)}|${R.i}|${R.mode}`; K.best[key] = Math.max(K.best[key] || 0, stars); if (R.mode !== 'match' && R.top) status = progression(R.t, R.i, R); }
  const d = dayKey(new Date()); (K.log[d] || (K.log[d] = { a: 0, c: 0, r: 0 })).r++;
  const left = STICKERS.filter((s) => !K.stickers.includes(s)), sticker = left.length ? rnd(left) : null; if (sticker) K.stickers.push(sticker);
  save();
  const nx = status === 'up' ? curLv(R.t) : null;
  $('#result').innerHTML = `<img class="trophy" src="img/trophy.webp" alt="">
    <h2>${stars === 3 ? '¡Superestrella!' : stars === 2 ? '¡Muy bien!' : '¡Buen intento!'}</h2>
    <div class="note">${stars === 3 ? 'Superstar!' : stars === 2 ? 'Great job!' : 'Good try!'}</div>
    <div class="rstars">${[1, 2, 3].map((k) => `<span class="${k <= stars ? 'on' : ''}" style="animation-delay:${k * 250}ms">★</span>`).join('')}</div>
    <div class="rscore">${R.mode === 'match' ? `${n} pairs found · ⭐ ${earned} stars` : `${R.first} of ${n} right on the first try · ⭐ ${earned} stars`}</div>
    ${status === 'up' ? `<div class="rlevel">⬆️ ¡Nivel ${lvNum(R.t, nx)}! ${esc(TOPICS[R.t].L[nx].en)} is open.</div>` : status === 'down' ? '<div class="rlevel soft">🙂 Let\'s practice the level before a bit more.</div>' : status === 'top' ? `<div class="rlevel">⭐ Every level in ${esc(TOPICS[R.t].n)} is open!</div>` : ''}
    ${sticker ? `<div class="rsticker"><span class="s">${sticker}</span>New sticker!</div>` : ''}
    <div class="rbtns">
      ${status === 'up' ? `<button class="big-btn" data-act="lvlGo" data-k="${nx}">⭐ Next level</button>` : ''}
      ${R.review ? '' : `<button class="big-btn ${status === 'up' ? 'alt' : ''}" data-act="act" data-k="${R.mode}">🔁 Again</button>`}
      <button class="big-btn alt" data-act="go" data-k="${R.review ? 'home' : 'topic'}">‹ Back</button>
      <button class="big-btn alt" data-act="go" data-k="home">🏠 Home</button>
    </div>`;
  S.R = null; show('result'); fx.win(); party(140); setTimeout(() => party(90), 600);
  const nums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  setTimeout(() => talk(['en:' + (stars === 3 ? 'Wow! Awesome job!' : stars === 2 ? 'Great job!' : 'Good try!'), ...(earned <= 20 ? [`en:You got ${nums[earned]} star${earned === 1 ? '' : 's'}.`] : []), ...(status === 'up' ? ['¡Nuevo nivel!'] : []), ...(sticker ? ['en:And a new sticker!'] : [])]), 400);
}
function startReview() {
  const weak = weakItems().slice(0, 5).map((x) => Object.assign(Object.create(x.w), x.w, { _t: x.t, _i: x.i }));
  if (weak.length < 2) return; S.t = weak[0]._t; S.i = weak[0]._i; startRound('listen', weak);
}

/* ---------- stickers ---------- */
function renderStickers() {
  $('#stickNote').textContent = `${K.stickers.length} of ${STICKERS.length}. Finish a game to win a new one!`;
  $('#sgrid').innerHTML = STICKERS.map((s) => (K.stickers.includes(s) ? `<div class="stk">${s}</div>` : '<div class="stk no">?</div>')).join('');
}

/* ---------- grown-ups: progress ---------- */
function renderDash() {
  $('#dTitle').innerHTML = `📊 Progress<small>${esc(K.name)} · ${esc(GRADES[K.grade].label)}</small>`;
  const all = allGradeItems(), sc = score(), lrn = all.filter(learned).length, mst = all.filter((w) => box(w) >= 4).length;
  const now = new Date(), days = []; for (let i = 6; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate() - i); days.push([d, K.log[dayKey(d)] || { a: 0, c: 0, r: 0 }]); }
  let streak = 0; for (let i = 0; i < 400; i++) { const d = new Date(now); d.setDate(now.getDate() - i); const L = K.log[dayKey(d)]; if (L && (L.a || L.r)) streak++; else if (i === 0) continue; else break; }
  const wk = days.reduce((a, [, L]) => ({ a: a.a + L.a, c: a.c + L.c, r: a.r + L.r }), { a: 0, c: 0, r: 0 });
  const top = Math.max(5, Math.ceil(Math.max(...days.map(([, L]) => L.a)) / 5) * 5);
  const W = 340, H = 140, pl = 26, pr = 10, pb = 20, bw = (W - pl - pr) / 7;
  let svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Answers each day for the last 7 days">`;
  [0, 0.5, 1].forEach((f) => { const y = (H - pb) - (H - pb - 8) * f; svg += `<line class="gl" x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}"/><text x="${pl - 5}" y="${y + 3}" text-anchor="end">${Math.round(top * f)}</text>`; });
  days.forEach(([d, L], i) => {
    const x = pl + i * bw + 5, w = bw - 10, k = (H - pb - 8) / top, ht = L.a * k, hc = L.c * k;
    svg += `<rect class="tot" x="${x}" y="${H - pb - ht}" width="${w}" height="${ht}" rx="3"/><rect class="cor" x="${x}" y="${H - pb - hc}" width="${w}" height="${hc}" rx="3"/><text x="${x + w / 2}" y="${H - 5}" text-anchor="middle">${i === 6 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' })}</text>`;
  });
  svg += '</svg>';
  const weak = weakItems().slice(0, 12), kids = allKids().filter((k) => k.grade);
  $('#dashBody').innerHTML = `
    ${kids.length > 1 ? `<div class="kchips">${kids.map((k) => `<button class="kchip" data-act="dashKid" data-k="${k.id}" aria-pressed="${isActive(k.id)}"><img src="img/${k.avatar}.webp" alt="">${esc(k.name)}</button>`).join('')}</div>` : ''}
    <div class="hero"><div class="ring" style="--p:${sc}"><b>${sc}<small>of 100</small></b></div>
      <div><h2>Learning score</h2><p class="note">How well ${esc(K.name)} knows the ${all.length} words and sentences for ${esc(GRADES[K.grade].label)}. Right answers raise it; misses lower it a little.</p></div></div>
    <div class="stats">
      <div class="stat"><b>${lrn}</b><span>Learned of ${all.length}</span></div>
      <div class="stat"><b>${mst}</b><span>Mastered</span></div>
      <div class="stat"><b>${wk.a ? Math.round(wk.c / wk.a * 100) + '%' : '–'}</b><span>Right, last 7 days</span></div>
      <div class="stat"><b>${streak}</b><span>Day streak 🔥</span></div>
    </div>
    <div class="dash2">
      <div class="panel"><h3>Last 7 days</h3>${svg}<div class="legend"><span><i style="background:var(--good)"></i>Right</span><span><i style="background:var(--line)"></i>Answers</span></div>
        <p class="note small">${wk.r} games finished this week · ⭐ ${K.stars} stars in all</p></div>
      <div class="panel"><h3>Practice at home</h3>${weak.length ? `<div class="weak">${weak.map((x) => `<button data-act="hearBoth" data-k="${x.t}|${x.i}|${esc(x.w.es)}">${mini(x.w)}<span>${esc(nameIn(esFull(x.w)))}<small>${esc(nameIn(enFull(x.w)))}</small></span></button>`).join('')}</div><p class="note small">Tap a word to hear it in Spanish and English. The games bring these back more often, and the home screen offers a short Repaso round.</p>` : '<p class="note">Nothing yet. Words missed in Listen, Spell or Build show up here.</p>'}</div>
    </div>
    <div class="panel"><h3>By topic</h3>${TOPICS.map((T, t) => { const it = gradeItems(t), l = it.filter(learned).length; return `<div class="trow"><img src="img/${T.i}.webp" alt=""><div><b>${esc(T.n)} <small>· Nivel ${lvNum(t, topLv(t))} of ${levelsFor(t).length}</small></b><span class="bar"><i style="width:${it.length ? Math.round(l / it.length * 100) : 0}%"></i></span></div><span class="num">${l}/${it.length}</span></div>`; }).join('')}</div>
    <p class="note small">Saved only on this device. “Learned” means answered right at least twice more than missed. A level opens after two great rounds or when 80% of its words are learned.</p>`;
}

/* ---------- grown-ups: settings ---------- */
function renderSettings() {
  const ls = TOPICS.map((T, t) => `<div class="lrow"><img src="img/${T.i}.webp" alt=""><span>${esc(T.n)}</span><select id="lv-${t}" data-set="lvl" data-k="${t}">${levelsFor(t).map((x, n) => `<option value="${x.i}" ${x.i === topLv(t) ? 'selected' : ''}>Nivel ${n + 1} · ${esc(x.L.en)}</option>`).join('')}</select></div>`).join('');
  const kids = allKids();
  $('#setBody').innerHTML = `
    <div class="panel"><h3>Children <small class="note small">(up to ${MAX_KIDS})</small></h3>
      <div class="kchips">${kids.map((k) => `<button class="kchip" data-act="setKid" data-k="${k.id}" aria-pressed="${isActive(k.id)}"><img src="img/${k.avatar}.webp" alt="">${esc(k.name || 'New child')}</button>`).join('')}${kids.length < MAX_KIDS ? '<button class="kchip add" data-act="addKid">＋ Add a child</button>' : ''}</div>
      <label class="field" for="setName">Name<input id="setName" data-set="name" maxlength="20" autocomplete="off" value="${esc(K.name)}"></label>
      <div class="field">Buddy<div class="avs">${AVATARS.map((a) => `<button class="av" data-act="setAv" data-k="${a}" aria-pressed="${a === K.avatar}" aria-label="${a.replace(/-face/, '').replace(/-/g, ' ')}"><img src="img/${a}.webp" alt=""></button>`).join('')}</div></div>
      <div class="field">Grade<small>Sets which levels, games and reading show for ${esc(K.name)}.</small><div class="grades">${GO.map((g) => `<button data-act="setGrade" data-k="${g}" aria-pressed="${K.grade === g}"><b>${GRADES[g].label}</b><small>${GRADES[g].ages}</small></button>`).join('')}</div></div>
      <div class="field">Boy or girl<small>Only for “Soy un niño / Soy una niña”.</small><div class="seg">${[['m', 'Boy'], ['f', 'Girl'], ['', 'Skip']].map((x) => `<button data-act="setSex" data-k="${x[0]}" aria-pressed="${K.sex === x[0]}">${x[1]}</button>`).join('')}</div></div>
      <label class="field" for="setAge">Age<small>Only for “Tengo … años”.</small><select id="setAge" data-set="age"><option value="0">Skip</option>${AGES.map((a) => `<option value="${a}" ${K.age === a ? 'selected' : ''}>${a}</option>`).join('')}</select></label>
      ${kids.length > 1 ? `<div id="delBox"><button class="link-btn" data-act="delAsk">Remove ${esc(K.name)}…</button></div>` : ''}
    </div>
    <div class="panel"><h3>Levels for ${esc(K.name)}</h3><p class="note small">Levels open by themselves after great rounds. Open a level early here.</p>${ls}
      <label class="switch">Harder levels (show levels above this grade)<input type="checkbox" id="setAll" data-set="all" ${K.showAll ? 'checked' : ''}></label></div>
    <div class="panel"><h3>Voice</h3>
      <label class="switch">Voice<input type="checkbox" id="setVoice" data-set="voice" ${state.voice ? 'checked' : ''}></label>
      <p class="note small">Spanish is spoken by the recorded voice Dora; instructions and hints in English by the voice Heart. They sound the same on every device. The device voice only says the child's name.</p>
      <div class="row" style="justify-content:flex-start"><button class="big-btn alt small" data-act="vtest">▶ Play a sample</button><button class="big-btn alt small" id="offlineVoiceBtn" data-act="offlineVoices">⬇ Save all voices for offline</button></div>
      <p class="note small" id="offlineVoiceStatus">${CoreOffline.available() ? 'Voices are saved as they are used. Save them all now to play anywhere without internet.' : 'Offline voices work in the installed app (Add to Home Screen).'}</p></div>
    <div class="panel"><h3>Learning packs</h3><p class="note small" id="contentPacksStatus">Checking…</p>
      <button class="big-btn alt small" id="contentPacksSync" data-act="packSync" hidden>Check for new lessons</button></div>
    <div class="panel"><h3>Grown-up tools</h3>
      <button class="big-btn alt small" data-act="dash">📊 Progress for grown-ups</button>
      <button class="big-btn alt small" data-act="review">📋 Review all content</button>
      <button class="big-btn alt small" data-act="pinChange">🔒 Change grown-up PIN</button>
      ${hasLearnPlay() ? '<p class="note small">🔒 Palabritas and Learn &amp; Play share one grown-up PIN on this device. Changing it here changes it in both.</p>' : ''}
    </div>
    <div class="panel"><h3>Back up or move progress</h3><p class="note small">Progress is saved only on this device. Save a backup file (all children) to keep it safe or to open it on another iPhone or iPad.</p>
      <div class="row" style="justify-content:flex-start"><button class="big-btn alt small" data-act="backup">⬇ Save backup file</button><button class="big-btn alt small" data-act="restoreAsk">Restore from a backup</button></div><div id="backupBox"></div></div>
    <div class="panel" id="resetBox"><button class="link-btn" data-act="resetAsk">Reset ${esc(K.name)}’s stars and levels…</button></div>
    <p class="note small">Palabritas ${esc(VERSION)} · kids-core ${esc(window.CORE_VERSION || '')} · 3D pictures: Fluent Emoji © Microsoft, MIT License · Voices: Kokoro, Apache 2.0 License · Everything is saved only on this device. No accounts, no ads, no tracking.</p>`;
  renderPacks();
}
function renderPacks() {
  ContentPacks.load().then(() => {
    const packs = ContentPacks.summary(), boxEl = $('#contentPacksStatus');
    if (boxEl) boxEl.textContent = packs.length ? packs.map((p) => `${p.title} (v${p.version}, ${p.questions} questions)`).join(' · ') + ' — ready offline.' : 'All included lessons are ready offline. No extra packs downloaded.';
  });
  const native = window.KidsCorePurchases || window.KidsLearnPurchases, btn = $('#contentPacksSync');
  if (btn) btn.hidden = !(native && typeof native.downloadOwnedPacks === 'function');
}
async function syncPacks() {
  const native = window.KidsCorePurchases || window.KidsLearnPurchases, btn = $('#contentPacksSync'), status = $('#contentPacksStatus');
  btn.disabled = true; status.textContent = 'Checking for new lessons…';
  try {
    // The native app checks the App Store purchase and verifies each data-only pack before handing it over.
    const verified = await native.downloadOwnedPacks();
    if (!Array.isArray(verified)) throw new Error('Invalid download response');
    for (const pack of verified) await ContentPacks.installVerified(pack);
    status.textContent = verified.length ? `Saved ${verified.length} learning pack(s). Ready offline.` : 'All your lessons are up to date.';
  } catch (err) { status.textContent = 'Could not check for new lessons. Everything already saved still works offline.'; console.warn('Learning pack update failed', err); }
  finally { btn.disabled = false; }
}
document.addEventListener('change', (e) => {
  const el = e.target, k = el.dataset && el.dataset.set;
  if (el.id === 'restoreFile' && el.files && el.files[0]) { restoreFile(el.files[0]); return; }
  if (!k) return;
  if (k === 'name') K.name = el.value.trim().replace(/[<>&"'`]/g, '').slice(0, 20) || K.name;
  if (k === 'age') K.age = +el.value || 0;
  if (k === 'lvl') { const t = +el.dataset.k, v = +el.value; setLv(t, v); K.cur[tid(t)] = v; delete K.prog[tid(t)]; }
  if (k === 'all') { K.showAll = el.checked; renderSettings(); }
  if (k === 'voice') { state.voice = el.checked; if (!el.checked) hush(); }
  save();
});
function restoreFile(file) {
  file.text().then((text) => {
    const d = JSON.parse(text);
    if (!d || !d.profiles || !Object.values(d.profiles).every((p) => p && typeof p === 'object' && 'box' in p)) throw new Error('not a Palabritas backup');
    Store.importJSON(text); location.reload();
  }).catch(() => toast("That file isn't a Palabritas backup."));
}
function restoreOldCode(code) {
  // backup codes from Palabritas 1.x
  const d = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  if (!d || !Array.isArray(d.kids) || !d.kids.length) throw new Error('bad code');
  Store.importJSON(JSON.stringify(fromOld({ device: { voice: state.voice, pinHash: state.pinHash }, kids: d.kids, cur: d.cur }))); location.reload();
}

/* ---------- content review (read-only) ---------- */
function renderReview() {
  $('#revBody').innerHTML = '<p class="note small">Every card in Palabritas with its grade, English meaning and pronunciation. Read-only. Tap ▶ to hear the recordings. {N} is the child\'s name; {A} is their age.</p>' +
    TOPICS.map((T) => `<div class="panel rv-topic"><h3>${esc(T.n)} <small class="note small">· ${esc(T.en)}</small></h3>${T.L.map((L, i) => `<div class="rv-level"><h4>Level ${i + 1} · ${esc(L.n)}<small>${esc(L.en)} · ${GRADES[L.g].label}+ · ${L.k === 's' ? 'sentences' : L.k === 't' ? 'reading words' : 'words'}</small></h4>
    ${L.w.map((w) => `<div class="rv-row">${w.p.startsWith('i:') ? `<img src="img/${w.p.slice(2)}.webp" alt="">` : `<span class="mini" ${w.p.startsWith('#') ? `style="background:${w.p}"` : ''}>${w.p.startsWith('n:') ? esc(w.p.slice(2)) : w.p === 'a:' ? '🙂' : w.p.startsWith('t:') ? 'Aa' : ''}</span>`}
      <div><b>${esc((w.a ? w.a + ' ' : '') + w.es)}</b><small>${esc(w.en)}${w.pr ? ` · ${esc(w.pr)}` : ''}${w.sx ? ` · ${w.sx === 'm' ? 'boys' : 'girls'} only` : ''}</small></div>
      <div class="row"><button class="btn slow" data-act="rvEs" data-k="${esc((w.a ? w.a + ' ' : '') + w.es)}">▶ es</button><button class="btn slow" data-act="rvEn" data-k="${esc(w.en)}">▶ en</button></div></div>`).join('')}</div>`).join('')}</div>`).join('');
}

/* ---------- taps ---------- */
let swiped = false;
document.addEventListener('click', (e) => {
  if (swiped) { swiped = false; return; }
  const w = e.target.closest('[data-w]'); if (w && S.welHandler) { fx.tap(); S.welHandler(w.dataset.w, w.dataset.k); return; }
  const who = e.target.closest('[data-who]'); if (who && S.whoHandler) { fx.tap(); S.whoHandler(who.dataset.who); return; }
  if (e.target.id === 'sheet' && $('#sheet .who-grid')) { setSheet(''); return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, k = b.dataset.k;
  switch (act) {
    case 'start':
      unlockAudio(); renderHomeSafe(); show('home');
      if (needsSetup()) openWelcome(); else if (kidCount() > 1) openWho(); else talk(['¡Hola!{N}', "en:Let's learn some Spanish!"]);
      break;
    case 'kid': if (kidCount() > 1) openWho(); else gate(() => { renderSettings(); show('settings'); }); break;
    case 'settings': grown(() => { renderSettings(); show('settings'); }); break;
    case 'dash': S.backTo = S.screen === 'settings' ? 'settings' : 'home'; grown(() => { renderDash(); show('dash'); }); break;
    case 'grade': gate(() => { renderSettings(); show('settings'); }); break;
    case 'review': S.backTo = 'settings'; renderReview(); show('review'); break;
    case 'stickers': renderStickers(); show('stickers'); break;
    case 'go':
      if (k === 'home') { S.R = null; renderHome(); show('home'); }
      else if (k === 'grown') { if (S.grown && S.backTo === 'settings') { renderSettings(); show('settings'); } else if (K.grade) { renderHome(); show('home'); } else show('splash'); }
      else if (k === 'back') { const R = S.R; S.R = null; if (R && R.review) { renderHome(); show('home'); } else { renderTopic(); show('topic'); } }
      else { S.R = null; renderTopic(); show('topic'); }
      break;
    case 'banner': if (b.dataset.k === 'review') startReview(); else openTopic(+b.dataset.k); break;
    case 'topic': openTopic(+k); talk(TOPICS[+k].n); break;
    case 'sayTopic': talk([TOPICS[S.t].n]); break;
    case 'lvl': {
      const i = +k; if (!isOpen(S.t, i)) { toast('Keep playing to unlock this level!'); talk('en:Keep playing to unlock this level.'); break; }
      S.i = i; K.cur[tid(S.t)] = i; S.c = 0; S.reps = 0; save(); renderTopic(); break;
    }
    case 'lvlGo': S.i = +k; S.c = 0; S.reps = 0; renderTopic(); show('topic'); break;
    case 'act': if (k === 'learn') { S.c = 0; S.reps = 0; renderLearn(); show('learn'); sayItem(itemsOf(TOPICS[S.t].L[S.i])[0]); } else startRound(k); break;
    case 'hear': if (S.screen === 'learn') sayItem(itemsOf(TOPICS[S.t].L[S.i])[S.c]); break;
    case 'slow': sayItem(itemsOf(TOPICS[S.t].L[S.i])[S.c], true); break;
    case 'meaning': { const it = itemsOf(TOPICS[S.t].L[S.i])[S.c]; talk([esFull(it), 'en:' + enFull(it)]); break; }
    case 'sayWord': sayTokText(k); break;
    case 'rep': {
      const it = itemsOf(TOPICS[S.t].L[S.i])[S.c]; S.reps = Math.min(3, S.reps + 1);
      if (S.reps === 3) { if (box(it) < 1) K.box[it.es] = 1; save(); talk([esFull(it), rnd(PRAISE)]); } else talk(S.reps === 1 ? ['en:Say it with me, three times!', esFull(it)] : [esFull(it)]);
      renderLearn(); break;
    }
    case 'replay': replay(false); break;
    case 'replaySlow': replay(true); break;
    case 'pick': pickListen(+k, b); break;
    case 'tile': tapTile(+k, b); break;
    case 'hint': hintTile(); break;
    case 'flip': flipCard(+k, b); break;
    case 'hearBoth': { const [t, i, es] = k.split('|'); const it = TOPICS[+t].L[+i].w.find((x) => x.es === es); if (it) talk([esFull(it), 'en:' + enFull(it)]); break; }
    case 'dashKid': switchKid(k); renderDash(); break;
    case 'setKid': switchKid(k); if (needsSetup()) openWelcome(); else renderSettings(); break;
    case 'addKid': if (Store.addKid({}, state)) { resetRun(); openWelcome(true); } break;
    case 'setAv': K.avatar = k; save(); renderSettings(); break;
    case 'setGrade': K.grade = k; save(); renderSettings(); break;
    case 'setSex': K.sex = k; save(); renderSettings(); break;
    case 'delAsk': $('#delBox').innerHTML = `<div class="confirm">Remove ${esc(K.name)} and all of their progress? <button class="big-btn small" data-act="del">Remove</button><button class="big-btn alt small" data-act="keepKid">Keep</button></div>`; break;
    case 'keepKid': renderSettings(); break;
    case 'del': Store.removeKid(Store.activeId(), state); resetRun(); renderSettings(); toast('Child removed'); break;
    case 'vtest': talk(['¡Hola! Vamos a aprender español.', "en:Let's learn some Spanish!"]); break;
    case 'offlineVoices': CoreOffline.downloadVoices($('#offlineVoiceStatus'), b); break;
    case 'packSync': syncPacks(); break;
    case 'pinChange': askPin(() => { renderSettings(); show('settings'); }, true); break;
    case 'backup': Store.downloadBackup(); toast('Backup saved. Keep it in Files or iCloud Drive.'); break;
    case 'restoreAsk': $('#backupBox').innerHTML = `<label class="field">Choose a backup file<input type="file" id="restoreFile" accept=".json,application/json"></label>
      <details><summary class="note small">Have a backup code from Palabritas 1?</summary><label class="field">Paste the code<textarea id="rcode"></textarea></label><button class="big-btn small" data-act="restoreCode">Restore code</button></details>
      <p class="note small">Restoring replaces every child on this device.</p>`; break;
    case 'restoreCode': try { restoreOldCode($('#rcode').value); } catch { toast("That code didn't work. Copy the whole code and try again."); } break;
    case 'resetAsk': $('#resetBox').innerHTML = `<div class="confirm">Erase ${esc(K.name)}'s stars, stickers, levels and scores? <button class="big-btn small" data-act="reset">Yes, reset</button><button class="big-btn alt small" data-act="keepKid">Keep</button></div>`; break;
    case 'reset': Object.assign(K, { stars: 0, stickers: [], box: {}, miss: {}, levels: {}, cur: {}, prog: {}, best: {}, log: {}, last: null }); save(); renderSettings(); toast('Progress reset'); break;
    case 'rvEs': talk(k); break;
    case 'rvEn': talk('en:' + k.replace('{A}', 'five')); break;
  }
});
function renderHomeSafe() { if (K.grade && GRADES[K.grade]) renderHome(); }

/* ---------- swipe between learn cards ---------- */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches; let drag = null, busy = false;
const learnCard = () => document.querySelector('#learnBody .learn');
function swipeTo(dir) {
  if (busy) return; const ws = itemsOf(TOPICS[S.t].L[S.i]); S.c = (S.c + dir + ws.length) % ws.length; S.reps = 0; sayItem(ws[S.c]);
  const c = learnCard(); if (calm || !c) { renderLearn(); return; } busy = true;
  c.style.transition = 'transform .22s ease-in, opacity .22s'; c.style.transform = `translateX(${-dir * 110}%) rotate(${-dir * 6}deg)`; c.style.opacity = '0';
  setTimeout(() => {
    renderLearn(); const n = learnCard(); n.style.transition = 'none'; n.style.transform = `translateX(${dir * 40}%)`; n.style.opacity = '0'; void n.offsetWidth;
    n.style.transition = 'transform .25s ease-out, opacity .25s'; n.style.transform = ''; n.style.opacity = ''; setTimeout(() => { busy = false; }, 260);
  }, 200);
}
$('#learnBody').addEventListener('pointerdown', (e) => { if (busy || !e.isPrimary) return; const c = e.target.closest('.learn'); if (!c) return; drag = { x: e.clientX, y: e.clientY, dx: 0, h: null, c }; });
addEventListener('pointermove', (e) => {
  if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (drag.h === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) drag.h = Math.abs(dx) > Math.abs(dy); if (!drag.h) return;
  drag.dx = dx; drag.c.style.transition = 'none'; drag.c.style.transform = `translateX(${dx}px) rotate(${dx / 40}deg)`;
});
addEventListener('pointerup', () => {
  if (!drag) return; const d = drag; drag = null; if (!d.h) return; swiped = true; setTimeout(() => { swiped = false; }, 350);
  if (Math.abs(d.dx) > Math.min(90, d.c.offsetWidth * 0.22)) swipeTo(d.dx < 0 ? 1 : -1); else { d.c.style.transition = 'transform .2s ease-out'; d.c.style.transform = ''; }
});
addEventListener('pointercancel', () => { if (drag && drag.c) { drag.c.style.transition = 'transform .2s'; drag.c.style.transform = ''; } drag = null; });
addEventListener('keydown', (e) => { if (S.screen !== 'learn' || e.target.closest('select,input,textarea')) return; if (e.key === 'ArrowRight') { e.preventDefault(); swipeTo(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); swipeTo(-1); } });

/* ---------- start ---------- */
$('#splashAv').src = `img/${K.avatar}.webp`;
CoreOffline.watchVoiceDownload('offlineVoiceStatus', 'offlineVoiceBtn');
CoreOffline.start();
if (location.hash === '#review') { S.backTo = 'home'; renderReview(); show('review'); }
