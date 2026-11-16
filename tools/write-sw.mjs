#!/usr/bin/env node
/* Writes sw.js: the list of files Palabritas keeps for offline use (the logic is core/sw-core.js).
   Run on every release with the new version:  node tools/write-sw.mjs 2.2.0
   Voice clips are not listed: kids-core fetches them from the two voice maps into a shared cache. */
import fs from 'node:fs';
const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version || '')) { console.error('usage: node tools/write-sw.mjs <version, e.g. 2.2.0>'); process.exit(1); }
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.name.startsWith('.') ? [] : e.isDirectory() ? walk(d + '/' + e.name) : [d + '/' + e.name]));
const shell = ['./', 'index.html', 'app.config.json', 'manifest.webmanifest', 'palabritas.js', 'palabritas.css', 'data/palabritas.json',
  'audio/clips-es.json', 'audio/clips-en.json', 'audio/silence.mp3', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'favicon.png'];
const files = [...shell, ...walk('core').sort(), ...walk('img').filter((f) => f.endsWith('.webp')).sort()];
for (const f of files) if (f !== './' && !fs.existsSync(f)) throw Error('missing ' + f);
const list = (a) => '[\n  ' + a.map((x) => JSON.stringify(x)).join(',\n  ') + '\n]';
fs.writeFileSync('sw.js', `/* Palabritas offline support. The logic is kids-core's (core/sw-core.js); this file lists what to keep.
   Made by tools/write-sw.mjs; bump the version on every release. A new version downloads in the background and is
   applied the next time the app opens (kids-core offline.updateOnLaunch). */
const PREFIX = 'palabritas-';
const VERSION = PREFIX + 'v${version}';
const AUDIO = PREFIX + 'audio';
const AUDIO_MAPS = ['audio/clips-es.json', 'audio/clips-en.json'];
const CORE_PHRASES = ['hola', "let's learn some spanish", 'listen then tap the picture', 'muy bien', 'otra vez', 'try again', 'this part is for grown ups', 'tap the house to go back'];
const FILES = ${list(files)};
importScripts('core/sw-core.js');
`);
console.log(`sw.js: v${version}, ${files.length} files`);
