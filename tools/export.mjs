#!/usr/bin/env node
/* Turns the build outputs (data3.json, cliplist3.json, letters.json, ages.json in tools/) into the files the app reads:
     data/palabritas.json   – topics, levels, grades (with kids-core progression rules), ages, letter names
     audio/clips-es.json    – Spanish phrase → clip file   (keys made exactly like kids-core voice.js, "unicode")
     audio/clips-en.json    – English phrase → clip file
   Run from the repo root:  node tools/export.mjs  */
import fs from 'node:fs';
const T = (f) => JSON.parse(fs.readFileSync('tools/' + f, 'utf8'));
const D = T('data3.json'), L = T('cliplist3.json'), ages = T('ages.json'), letters = T('letters.json');
// Recorded voices: es-US-PalomaNeural (Spanish), en-US-JennyNeural (English), made with tools/make_voices.py.
// A new set of recordings gets a new prefix so phones replace their saved copies.
const CLIP_PREFIX = 'v2-';
const clipKey = (t) => String(t).normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}' ]+/gu, ' ').replace(/\s+/g, ' ').trim();
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
for (const t of D.TOPICS) t.id = t.id || slug(t.en);
for (const g of Object.values(D.GRADES)) if (g.prog) {
  const p = g.prog;
  g.progression = { minQuestions: p.minQ, promote: { minFirstTryRate: p.up.ft, maxMistakeRate: p.up.mis, rounds: p.up.n }, support: { maxFirstTryRate: p.down.ft, minMistakeRate: p.down.mis, rounds: p.down.n } };
  delete g.prog;
}
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/palabritas.json', JSON.stringify({ schema: 1, namespace: 'palabritas', datasets: { TOPICS: D.TOPICS, GRADES: D.GRADES, AGES: D.AGES, AGE_WORDS: ages, LETTERS: letters } }));
for (const lang of ['es', 'en']) {
  const m = {};
  for (const v of Object.values(L[lang])) { const k = clipKey(v[0]); if (m[k] && m[k] !== CLIP_PREFIX + v[2]) throw Error(`two clips for "${k}"`); m[k] = CLIP_PREFIX + v[2]; }
  fs.writeFileSync(`audio/clips-${lang}.json`, JSON.stringify(m));
  console.log(lang, Object.keys(m).length, 'clips');
}
const cfg = JSON.parse(fs.readFileSync('app.config.json', 'utf8'));
if (JSON.stringify(cfg.avatars) !== JSON.stringify(D.AVATARS)) console.log('Note: app.config.json "avatars" differs from the data:', D.AVATARS.join(', '));
