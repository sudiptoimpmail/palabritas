# Palabritas 🇪🇸

A kid-friendly Spanish app for parents and children to learn together. It's one HTML page plus a folder of pictures, with no build step and no dependencies. It works great on iPhone and iPad.

## How it plays

**¿Quién juega?** Each child taps their buddy picture to start, which also turns on the sound. On the **home** screen, colorful topic tiles show the child's level and progress. Tapping a topic opens its **levels** and three activities:

| Activity | What happens |
|---|---|
| 📖 **Aprender** (Learn) | Swipe through picture cards. Each card shows *el/la*, a pronunciation guide (kah-**BAH**-yoh), and normal and slow audio. Say it 3 times together for a star. On sentence cards, tap any word to hear it. |
| 👂 **Escuchar** (Listen) | A 10-card round: hear a word or sentence and tap the matching picture. |
| 🔤 **Deletrear** (Spell) / 🧩 **Ordenar** (Build) | An 8-card round of spelling words from letter tiles, or a 6-card round of putting sentence words in order. |

Rounds end with a trophy and 1–3 stars, and celebrate any new level that opened.

## Content

There are 212 words, sight words and sentences in 9 topics and 31 levels:

- **Saludos:** first words, then all day
- **Animales:** pets, farm, wild, water, forest and bugs
- **Colores:** bright colors, more colors
- **Números:** 0–10, 11–20, tens to 100
- **Comida:** basics, fruit and treats, mealtime
- **Familia:** close family, big family
- **El cuerpo:** face and hands, whole body
- **Mi mundo:** at home, outside, going places
- **Frases**, which starts from zero and moves in small steps:
  1. *Yo soy* (I am): *Yo soy {name}*, *Me llamo {name}*, *Soy una niña*, *Estoy feliz*
  2. Sight words: *yo, tú, él, ella, soy, eres, es*
  3. *Tú, él, ella* (you, he, she): *Él es mi papá*, *Ella es mi mamá*
  4. Sight words: *nosotros, ellos, ellas, somos, son, y*
  5. *Nosotros y ellos* (we, they): *Somos una familia*, *Ellos son gatos*
  6. Sight words: *un, una, el, la, mi, tengo, quiero, me gusta*
  7. *Me gusta* (I like and I want), then 8. *¿Cómo es?* (What is it like?), then 9. *Mi día* (My day)

  The child's own name and buddy picture appear in the first sentences. In sight-word levels, Listen becomes a reading game (hear it, then tap the written word) and the third activity is Spell.

## Adaptive practice

- Each item moves from New to Seen, Learned, and Mastered as the child answers correctly. A miss moves it back a step.
- Rounds pick weak items more often, and about 1 in 4 cards reviews shaky items from earlier levels.
- The next level opens when 80% of the current level is learned. A grown-up can open a locked level early.
- When a child is struggling, Listen shows 3 choices instead of 4, and Spell or Build gives a free first piece. After two misses, it adds a helper piece.

## Progress dashboard

Tap **Score** on the home screen to see:

- A **learning score** from 0 to 100, which measures how well the child knows every item.
- Items learned and mastered, accuracy over the last 7 days, and a day streak.
- A 14-day practice chart.
- A **Needs practice** list. Tap any item to hear it.
- Progress for each topic.

## Children and where progress is stored

- Add as many children as you like. Each child has their own name, buddy picture, levels, stars, and dashboard.
- **All progress is stored on the device**, in the browser's local storage. It is **not** stored in GitHub. GitHub only hosts the app's files, the same for everyone. Nothing is sent anywhere, and there are no accounts, ads, or tracking.
- Progress belongs to that one device and browser. On iPhone, the Home Screen app and Safari keep separate copies. Clearing Safari's website data erases it.
- To keep progress safe or move it to another device, use **⚙️ → Back up or move progress → Show backup code**, then **Restore from code** on the other device.

## Run it

Open `index.html` in any browser. Keep the `img` folder next to it.

### On iPhone or iPad (via GitHub Pages)

1. In this repo, go to **Settings → Pages**. Set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.
2. Open `https://<your-username>.github.io/palabritas/` in Safari.
3. Tap **Share → Add to Home Screen**. It opens full screen, like an app.

To share with other families, send them the same link. Each family's progress stays on their own devices.

## Voice

Every word, sentence, letter name and cheer is a recording of the natural Spanish voice **Dora** from the open-source [Kokoro](https://github.com/hexgrad/kokoro) text-to-speech model, stored in `audio/` (311 small MP3s, about 2 MB). It sounds the same on every device. 🐢 Slow plays the same recording at 70% speed.

The device's own voice is used only to say the child's name, or if a recording can't load. You can pick that voice in ⚙️.

To record new words, add them to `tools/words.py`, then run `tools/clips.py` and `tools/record.py`. You'll need `pip install kokoro-onnx soundfile`, ffmpeg, and the model files `kokoro-v1.0.onnx` and `voices-v1.0.bin` from the kokoro-onnx GitHub releases.

## Add words

Content lives in the `TOPICS` list at the top of the `<script>`. Each topic has levels (`L`), and each item is one entry:

```js
["caballo", "el", "horse", "i:horse-face", "kah-BAH-yoh"]
// word,    article, English, picture, pronunciation (CAPS = stressed syllable)
```

The picture can be `i:<name>` for `img/<name>.webp`, `#RRGGBB` for a color swatch, or `n:<number>` for a number. Sentence topics have `"k":"s"`.

## Credits

The voice is Kokoro (Apache 2.0 License), voice `ef_dora`.

The illustrations are from [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) by Microsoft, used under the MIT License and resized to WebP.
