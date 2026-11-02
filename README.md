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

There are 173 words and sentences in 9 topics and 25 levels:

- **Saludos:** first words, then all day
- **Animales:** pets, farm, wild, water, forest and bugs
- **Colores:** bright colors, more colors
- **Números:** 0–10, 11–20, tens to 100
- **Comida:** basics, fruit and treats, mealtime
- **Familia:** close family, big family
- **El cuerpo:** face and hands, whole body
- **Mi mundo:** at home, outside, going places
- **Frases:** *Tengo un perro*, *La rana es verde*, *Me cepillo los dientes*…

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

## Better voice

The app uses the device's built-in text-to-speech and automatically picks the best Spanish voice installed. For a much more natural sound, go to **Settings → Accessibility → Spoken Content → Voices → Spanish** and download the **Premium** or **Enhanced** version of **Mónica** or **Paulina**. Then reopen the app. You can choose the voice in ⚙️.

## Add words

Content lives in the `TOPICS` list at the top of the `<script>`. Each topic has levels (`L`), and each item is one entry:

```js
["caballo", "el", "horse", "i:horse-face", "kah-BAH-yoh"]
// word,    article, English, picture, pronunciation (CAPS = stressed syllable)
```

The picture can be `i:<name>` for `img/<name>.webp`, `#RRGGBB` for a color swatch, or `n:<number>` for a number. Sentence topics have `"k":"s"`.

## Credits

The illustrations are from [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) by Microsoft, used under the MIT License and resized to WebP.
