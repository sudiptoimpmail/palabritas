# Palabritas 🇪🇸

A kid-friendly Spanish vocabulary app for parents and children to learn together. It's one HTML page plus a folder of pictures, with no build step and no dependencies. It works great on iPhone and iPad, with a larger side-by-side layout on tablets.

## Features

- **Aprender (Learn):** picture flashcards with *el/la*, an easy pronunciation guide with the stressed syllable highlighted (e.g. kah-**BAH**-yoh), and normal and slow audio. Swipe left or right to change words. Say each word out loud 3 times together to earn a star.
- **Escuchar (Listen):** hear a word and tap the matching picture.
- **Deletrear (Spell):** build the word from letter tiles, including ñ and accented letters, with spoken letters and hints.
- **Levels:** 154 words in 8 topics, split into 22 levels. For example, Numbers goes 0–10 → 11–20 → tens to 100, and Animals goes pets → farm → wild → water → forest and bugs.
- **Adaptive practice:**
  - Each word moves from New to Seen, Learned, and Mastered as your child answers correctly. A miss moves it back a step.
  - The games pick weak words more often, and about 1 in 4 questions reviews shaky words from earlier levels.
  - The next level opens when 80% of the current level is learned. A parent can open a locked level early.
  - When a child is struggling, Listen shows 3 choices instead of 4. Spell gives a free first letter and adds a hint letter after two misses.
- **Pictures:** 3D illustrations for objects, paint swatches for colors, and numerals with ten-frame dots or tens bars for numbers.
- Stars and progress are saved on the device. You can reset them in the settings panel.
- Light and dark mode.

## Run it

Open `index.html` in any browser. Keep the `img` folder next to it.

### On iPhone or iPad (via GitHub Pages)

1. In this repo, go to **Settings → Pages**. Set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.
2. Open `https://<your-username>.github.io/palabritas/` in Safari.
3. Tap **Share → Add to Home Screen**. It opens full screen, like an app.

## Better voice

The app uses the device's built-in text-to-speech and automatically picks the best Spanish voice installed. For a much more natural sound, go to **Settings → Accessibility → Spoken Content → Voices → Spanish** on the iPhone or iPad and download the **Premium** or **Enhanced** version of **Mónica** (Spain accent) or **Paulina** (Mexican accent). Then reopen the app. You can switch voices any time from the 🗣️ panel at the top.

## Add words

Words live in the `TOPICS` list at the top of the `<script>`. Each topic has levels (`L`), and each word is one entry:

```js
["caballo", "el", "horse", "i:horse-face", "kah-BAH-yoh"]
// word,    article, English, picture, pronunciation (CAPS = stressed syllable)
```

The picture can be `i:<name>` for an image in `img/<name>.webp`, `#RRGGBB` for a color swatch, or `n:<number>` for a number.

## Credits

The illustrations are from [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) by Microsoft, used under the MIT License and resized to WebP.
