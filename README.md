# Palabritas 🇪🇸

Spanish for little learners, Pre-K to 1st Grade, built for English-speaking children who are starting from zero. It works on iPhone and iPad, offline after the first visit, with no accounts, ads or tracking.

It runs on **kids-core**, the same engine as [Learn & Play](https://github.com/sudiptoimpmail/kids-learn): saved data, grown-up PIN, voice, adaptive levels, content packs and offline use are shared code; Palabritas adds its own cards and games. US edition.

## For grown-ups

**Setup (first run).** A grown-up enters the child's name, buddy picture, boy/girl (only used for *Soy un niño / Soy una niña*), age (only used for *Tengo cinco años*) and grade: **Pre-K**, **Kindergarten** or **1st Grade**. You can add up to 4 children. If Learn & Play is on the same device, its children are offered so you can copy their names and grades.

**Grown-up PIN.** Settings, Progress, switching children and adding children all ask for the 4-digit PIN. If Learn & Play is set up on this device, Palabritas uses the **same PIN**. Otherwise the first PIN is created after verifying the device owner with Face ID, Touch ID or the device passcode, like Learn & Play. Children cannot skip locked levels.

**What the grade changes.**

| | Pre-K | Kindergarten | 1st Grade |
|---|---|---|---|
| Levels shown | 19 (127 cards) | 34 (231) | 38 (260) |
| Games | Learn, Listen, Match pictures | + Spell (≤5 letters, with guide letters), Build sentences (≤4 words) | + Spell (≤9 letters, one decoy letter), Build (≤7 words) |
| Cards per round | 5 | 6 | 8 |
| Listen choices | 3 | 3 (4 when doing well) | 4 |
| Reading words | none | yes | yes |
| Text size | largest | larger | normal |

**Adaptive practice** (same rules as Learn & Play):
- Each card moves from New to Seen, Learned and Mastered as the child answers. A miss moves it back a step.
- Rounds favor weak cards, and about 1 in 4 cards reviews shaky cards from earlier levels. No card appears more than twice in a round.
- **Next level** opens after two great rounds (80% or more right on the first try, 20% or fewer mistakes) or when 80% of the level is learned.
- **Easier**: after several hard rounds, the app suggests practicing the level before. Listen drops to 3 choices, and Spell shows guide letters.
- **Repaso**: when 3 or more words keep getting missed, home offers a 5-card practice round of just those.

**Progress (behind the PIN):** learning score, words learned and mastered, accuracy and a 7-day chart, day streak, a "Practice at home" list (tap to hear Spanish and English), and the level for each topic.

**Settings (behind the PIN):** children, grade, boy/girl, age, the level for each topic (open one early), harder levels, voice on/off, change PIN, backup file and restore (backup codes from Palabritas 1 still restore), reset, and **📋 Review all content**. That review page lists every card with its grade, English meaning and pronunciation, plus play buttons. It is also open without the PIN at `…/palabritas/#review`, read-only, for content review.

## For children

Home has 10 topic tiles. Inside a topic: level chips and 3–4 games.

- 📖 **Aprender (Learn).** Swipe through cards. Each card has a picture, Spanish with *el/la*, a pronunciation guide (kah-**BAH**-yoh), 🔊 normal, 🐢 slow, 💬 English meaning, and "say it 3 times".
- 👂 **Escuchar (Listen).** Hear Spanish, tap the picture. Greetings and other abstract words show English under the picture. After a wrong tap, every choice shows its English. After two, the right answer pulses and the app says it in Spanish and English.
- 🃏 **Parejas (Match).** A memory game. Pre-K matches two identical pictures, and readers match a picture to its word, or Spanish to English for reading words.
- 🔤 **Deletrear (Spell)** and 🧩 **Ordenar (Build).** Tap the next letter or word. A wrong tile shakes right away and is not placed. 💡 Hint places the next piece.
- Every finished round shows 1–3 stars and earns a sticker for the sticker book. Stars equal the cards answered right on the first try, so the home total always adds up.

## Content: 260 cards in 10 topics, 38 levels

- **Saludos:** first words, all day
- **Animales:** pets, farm, wild, water, forest and bugs
- **Colores:** bright, more colors
- **Números:** 0–10, 11–20, tens to 100
- **Comida:** basics, fruit and treats, mealtime
- **Familia:** close family, big family
- **El cuerpo:** face and hands, whole body
- **Mi mundo:** at home, outside, clothes, going places, at school
- **¡Acción!** (verbs as commands): *corre, salta, baila, come, duerme, canta, lee, escribe…*
- **Frases:** builds up in Spanish from zero:
  1. *Hola, yo soy* (*¡Hola! Yo soy {name}*, *Me llamo…*, *Soy una niña*, *Tengo 5 años*, using the child's real details)
  2. *¿Cómo estás?* (*Estoy bien*, *Tengo hambre / sed / sueño / frío*)
  3. Reading words: *yo, tú, él, ella, soy, eres, es*
  4. *Mi familia* (*Él es mi papá*, *Ella es mi mamá*)
  5. Reading words: *nosotros, ellos, somos, son, y, mi, mis*
  6. *Nosotros* (*Somos una familia*)
  7. *Me gusta, quiero*
  8. Reading words: *un, una, el, la, tengo, quiero, me gusta*
  9. *¿Cómo es?* (colors and sizes)
  10. *Mi día* (*Me levanto, Me lavo las manos, Voy a la escuela…*)
  11. *Preguntas* (*¿Cómo te llamas? ¿Dónde está el gato?*)

  Pre-K gets the spoken levels. Reading levels start in Kindergarten.

## Voice

All Spanish is recorded with Microsoft's natural US Spanish voice **Paloma** (es-US-PalomaNeural), and all English instructions and hints with **Jenny** (en-US-JennyNeural). `tools/make_voices.py` makes the clips. These voices come from the free service behind Microsoft Edge's read-aloud, which is fine for family use; before publishing the app commercially, re-make them through Azure AI Speech (same voices; its free tier covers this app). There are 790 clips in `audio/`. Only the child's name is spoken by the device voice. Every new sound cancels the previous one, and leaving a screen stops all sound, so nothing plays late or overlaps.

## Run it

GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**. Then open `https://sudiptoimpmail.github.io/palabritas/` in Safari and tap **Share → Add to Home Screen**. The service worker (`sw.js`) caches the app, pictures and voice for offline use.

## Edit content

1. Edit `tools/content.py`.
2. From `tools/`, run `python3 build_data.py`, then `python3 clips.py`, then `python3 record.py`. Recording needs `pip install kokoro-onnx soundfile`, ffmpeg, and `kokoro-v1.0.onnx` plus `voices-v1.0.bin` in `tools/kokoro/`.
3. From the repo root, run `node tools/export.mjs`. It writes `data/palabritas.json` and the voice maps `audio/clips-es.json` and `audio/clips-en.json`.
4. Bump `VERSION` in `sw.js` and run `node tests/smoke.cjs` (it checks every phrase has a recording).

## How it is built

| File | What it is |
|---|---|
| `app.config.json` | Name, saved-data key, voices, shared PIN, packs, **colours** (`theme.light` / `theme.dark`) |
| `core/` | kids-core (a copy, don't edit here). Update with `node ../kids-core/tools/sync-core.mjs .` |
| `data/palabritas.json` | Topics, levels, words and sentences, grades and their level-up rules |
| `palabritas.js`, `palabritas.css` | Palabritas' own screens: learn cards, Listen, Spell, Build, Match, dashboard |
| `sw.js` | Offline file list; the logic is `core/sw-core.js` |

To change colours, edit `theme` in `app.config.json`; no code changes needed. Children's progress is saved under `palabritas.v1` on the device (Palabritas 1 data is moved over automatically).

## Credits

- 3D pictures: [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) © Microsoft, MIT License.
- Voices: Microsoft neural voices Paloma and Jenny (see the note above on licensing).
