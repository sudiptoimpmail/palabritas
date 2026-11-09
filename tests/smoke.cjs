/* Palabritas browser checks (kids-core build). Run from the repo root:  node tests/smoke.cjs
   Starts a local server, opens the app in Chromium (phone and iPad sizes) and plays through the main paths. */
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), PORT = 8790;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
const fails = []; const ok = (c, m) => { if (!c) fails.push(m); console.log((c ? 'PASS ' : 'FAIL ') + m); };
async function page(browser, opts = {}, seed) {
  const ctx = await browser.newContext(opts); const pg = await ctx.newPage(); const errors = [];
  pg.on('pageerror', (e) => errors.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  if (seed) await pg.addInitScript(seed);
  await pg.goto(`http://localhost:${PORT}/`); await pg.waitForFunction(() => document.querySelector('#startBtn') && !document.querySelector('#startBtn').disabled, null, { timeout: 15000 });
  // record any phrase with no recording (kids-core plays nothing and calls deviceSay)
  await pg.evaluate(() => { window.__missing = []; window.deviceSay = (t) => { window.__missing.push(t); return Promise.resolve(); }; });
  return { ctx, pg, errors };
}
(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch();
  try {
    /* 1. first run: setup, home, theme */
    for (const [label, vp] of [['phone', { width: 390, height: 844 }], ['iPad', { width: 1024, height: 1366 }]]) {
      const { ctx, pg, errors } = await page(browser, { viewport: vp });
      ok(await pg.evaluate(() => window.CORE_VERSION === AppConfig.core), `${label}: core version matches config`);
      const bg = await pg.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
      ok(bg.toLowerCase() === '#eef5f1', `${label}: colours come from app.config.json (--bg ${bg})`);
      await pg.click('#startBtn');
      await pg.waitForSelector('#welName');
      await pg.fill('#welName', 'Ana'); await pg.click('[data-w="sex"][data-k="f"]'); await pg.selectOption('#welAge', '5');
      await pg.click('[data-w="grade"][data-k="k"]'); await pg.click('[data-w="go"]');
      ok(await pg.isVisible('#home.active'), `${label}: home after setup`);
      ok((await pg.$$('#grid .tile')).length === 10, `${label}: 10 topic tiles`);
      const saved = await pg.evaluate(() => JSON.parse(localStorage.getItem('palabritas.v1')));
      ok(saved && saved.schema === 3 && saved.profiles.p1.name === 'Ana' && saved.profiles.p1.grade === 'k', `${label}: saved in the kids-core format`);
      const overflow = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      ok(!overflow, `${label}: no sideways scrolling`);
      ok(!errors.length, `${label}: no page errors ${errors.join(' | ')}`);
      await ctx.close();
    }

    /* 2. play: learn, listen, spell, match, sentences; every spoken phrase has a recording */
    {
      const { ctx, pg, errors } = await page(browser, { viewport: { width: 390, height: 844 } });
      await pg.evaluate(() => { Object.assign(state, { name: 'Leo', grade: 'g1', sex: 'm', age: 6 }); save(); });
      await pg.click('#startBtn');
      for (let t = 0; t < 10; t++) {
        await pg.evaluate((t) => { S.grown = false; openTopic(t); }, t);
        const acts = await pg.$$eval('#acts [data-act="act"]', (b) => b.map((x) => x.dataset.k));
        for (const mode of acts) {
          if (mode === 'learn') { await pg.click('#acts [data-k="learn"]'); await pg.keyboard.press('ArrowRight'); await pg.click('[data-act="meaning"]'); await pg.click('[data-act="slow"]'); await pg.evaluate(() => show('topic')); continue; }
          await pg.evaluate((m) => startRound(m), mode);
          // answer every card right
          for (let guard = 0; guard < 40; guard++) {
            const st = await pg.evaluate(() => S.screen);
            if (st !== 'round') break;
            await pg.evaluate(() => {
              const R = S.R, q = R && R.q; if (!q || q.done) return;
              if (R.mode === 'listen') { const k = q.pack ? q.opts.findIndex((o) => o.v === q.pack.answer) : q.opts.indexOf(q.w); pickListen(k, $$('.choice')[k]); }
              else if (R.mode === 'match') { const seen = {}; q.cards.forEach((c, k) => { (seen[c.i] = seen[c.i] || []).push(k); }); Object.values(seen).forEach(([a, b]) => { q.lock = false; flipCard(a, $$('.mcard')[a]); flipCard(b, $$('.mcard')[b]); }); }
              else { while (!q.done) { const need = q.parts[q.placed.length]; const j = q.tiles.findIndex((x) => !x.used && x.p === need); tapTile(j, $$('.ltile')[j]); } }
            });
            await pg.waitForTimeout(150);
            await pg.evaluate(() => { if (S.R && S.R.q && S.R.q.done && S.R.mode !== 'match') { S.R.k++; nextQ(); } });
          }
          await pg.waitForFunction(() => S.screen === 'result', null, { timeout: 10000 }).catch(() => {});
          ok(await pg.evaluate(() => S.screen === 'result'), `topic ${t} ${mode}: round finishes`);
        }
      }
      const st = await pg.evaluate(() => ({ stars: state.stars, levels: state.levels, best: Object.keys(state.best).length }));
      ok(st.stars > 0 && st.best > 10, `stars and best scores saved (${st.stars} stars)`);
      ok(Object.values(st.levels).every((v) => Number.isInteger(v) && v >= 1 && v <= 12), 'levels saved 1-based for kids-core');
      // the voice for every card, in every form a child can hear it
      const missing = await pg.evaluate(() => {
        const out = new Set(); const chk = (p) => { const f = partFile(p); if (!f && !(typeof p === 'object' && p.device)) out.add(typeof p === 'object' ? p.lang + ':' + p.text : p); };
        const hear = (parts) => { const o = []; for (const raw of [].concat(parts)) { const en = raw.startsWith('en:'), lang = en ? 'en' : 'es'; for (const age of AGES) { const bits = (en ? raw.slice(3) : raw).replace('{A}', AGEW[lang][age]).split('{N}'); bits.forEach((b) => { if (clipKey(b)) o.push(en ? { text: b, lang: 'en' } : b); }); } } o.forEach(chk); };
        for (const T of TOPICS) { hear(T.n); for (const L of T.L) for (const w of L.w) { hear((w.a ? w.a + ' ' : '') + w.es); hear('en:' + w.en); if (L.k === 's') for (const tok of ((w.a ? w.a + ' ' : '') + w.es).split(' ')) if (!tok.includes('{N}')) for (const age of AGES) hear(tok.replace('{A}', AGEW.es[age]).replace(/[.,¡!¿?]/g, '')); } }
        Object.values(LETTERS).forEach(hear); PRAISE.forEach(hear);
        AppConfig.pin.kidNote.forEach(chk);
        return [...out, ...window.__missing.map((m) => 'played:' + m)];
      });
      ok(!missing.length, `every phrase has a recording ${missing.slice(0, 8).join(' | ')}`);
      ok(!errors.length, `play: no page errors ${errors.join(' | ')}`);
      await ctx.close();
    }

    /* 3. grown-up PIN (shared with Learn & Play), settings, dashboard, backup */
    {
      const lp = JSON.stringify({ schema: 3, active: 'p1', order: ['p1'], device: {}, profiles: { p1: { name: 'Mia', grade: 'g2', avatar: '🦊' } } });
      const { ctx, pg, errors } = await page(browser, { viewport: { width: 390, height: 844 }, acceptDownloads: true }, `localStorage.setItem('learnplay.v1', ${JSON.stringify(lp)});`);
      await pg.evaluate(() => { Object.assign(state, { name: 'Ana', grade: 'prek' }); save(); });
      await pg.click('#startBtn');
      await pg.click('[data-act="settings"]');
      ok(await pg.waitForSelector('#pinVerifyBtn', { state: 'visible', timeout: 3000 }).then(() => true, () => false), 'no PIN yet: device owner check first');
      await pg.click('#pinBack');
      // a PIN made in Learn & Play works here
      await pg.evaluate(() => { const d = JSON.parse(localStorage.getItem('learnplay.v1')); d.device.pinHash = pinHash('2468'); localStorage.setItem('learnplay.v1', JSON.stringify(d)); });
      await pg.click('[data-act="settings"]');
      ok((await pg.textContent('#pinNote')).includes('Learn & Play'), 'shared PIN note');
      for (const d of '1111') await pg.click(`#pinPad [data-k="${d}"]`);
      await pg.waitForTimeout(300);
      ok(await pg.isVisible('#pinSheet'), 'wrong PIN stays locked');
      for (const d of '2468') await pg.click(`#pinPad [data-k="${d}"]`);
      await pg.waitForSelector('#settings.active');
      ok(true, 'Learn & Play PIN opens Palabritas settings');
      const [dl] = await Promise.all([pg.waitForEvent('download'), pg.click('[data-act="backup"]')]);
      ok(/^palabritas-backup-\d{4}-\d\d-\d\d\.json$/.test(dl.suggestedFilename()), `backup file ${dl.suggestedFilename()}`);
      await pg.click('#setBody [data-act="dash"]'); await pg.waitForSelector('#dash.active');
      ok(await pg.isVisible('.ring'), 'progress dashboard');
      // add a second child, copied from Learn & Play
      await pg.click('[data-act="go"][data-k="grown"]'); await pg.click('[data-act="addKid"]');
      ok(await pg.isVisible('.lp-kids button'), 'Learn & Play children offered');
      await pg.click('.lp-kids button'); await pg.click('[data-w="grade"][data-k="g1"]');
      const kids = await pg.evaluate(() => Store.kids().map((k) => k.name + ':' + k.grade));
      ok(kids.join(',') === 'Ana:prek,Mia:g1', `two children ${kids}`);
      ok(!errors.length, `grown-ups: no page errors ${errors.join(' | ')}`);
      await ctx.close();
    }

    /* 4. Palabritas 1.x saved data is carried over */
    {
      const old = JSON.stringify({ v: 3, device: { pinHash: 'abc', voice: true }, cur: 'k2', kids: [
        { id: 'k1', name: 'Sol', avatar: 'fox', grade: 'k', stars: 12, stickers: ['🦄'], box: { perro: 3 }, miss: {}, lvl: { 1: 2 }, cur: { 1: 1 }, prog: {}, best: { '1|0|listen': 3 }, log: {}, last: 1 },
        { id: 'k2', name: 'Luz', avatar: 'lion', grade: 'g1', stars: 4, stickers: [], box: {}, miss: {}, lvl: {}, cur: {}, prog: {}, best: {}, log: {}, last: null }] });
      const { ctx, pg, errors } = await page(browser, {}, `if (!localStorage.getItem('palabritas.v1')) localStorage.setItem('pal3', ${JSON.stringify(old)});`);
      const r = await pg.evaluate(() => ({ active: state.name, kids: Store.kids().map((k) => [k.name, k.stars, JSON.stringify(k.levels), JSON.stringify(k.best), k.last]), pin: state.pinHash }));
      ok(r.active === 'Luz' && r.pin === 'abc', 'old data: active child and PIN kept');
      ok(JSON.stringify(r.kids[0]) === JSON.stringify(['Sol', 12, '{"animals":3}', '{"animals|0|listen":3}', 'animals']), `old data: levels and scores kept ${JSON.stringify(r.kids[0])}`);
      ok(!errors.length, `migration: no page errors ${errors.join(' | ')}`);
      await ctx.close();
    }

    /* 5. dark colours from the config */
    {
      const { ctx, pg } = await page(browser, { colorScheme: 'dark' });
      const bg = await pg.evaluate(() => getComputedStyle(document.body).backgroundColor);
      ok(bg === 'rgb(15, 34, 37)', `dark theme from app.config.json (${bg})`);
      await ctx.close();
    }
  } finally { await browser.close(); server.close(); }
  console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL PASS');
  process.exit(fails.length ? 1 : 0);
})();
