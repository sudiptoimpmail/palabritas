# Palabritas 🇪🇸

A kid-friendly Spanish vocabulary app for parents and children to learn together. It's a single HTML file with no build step and no dependencies, and it works great on iPhone.

## Features

- **Aprender (Learn):** picture flashcards with *el/la*, an easy pronunciation guide with the stressed syllable highlighted (e.g. kah-**BAH**-yoh), and normal and slow audio. Say each word out loud 3 times together to earn a star.
- **Escuchar (Listen):** hear a word and tap the matching picture.
- **Deletrear (Spell):** build the word from letter tiles, including ñ and accented letters, with spoken letters and hints.
- 66 words in 8 topics: greetings, animals, colors, numbers, food, family, body, and around the house.
- Stars are saved on the device.
- Light and dark mode.

## Run it

Open `index.html` in any browser. That's all.

### On iPhone (via GitHub Pages)

1. In this repo, go to **Settings → Pages**. Set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.
2. Open `https://<your-username>.github.io/palabritas/` in Safari.
3. Tap **Share → Add to Home Screen**. It opens full screen, like an app.

## Better voice

The app uses the device's built-in text-to-speech and automatically picks the best Spanish voice installed. For a much more natural sound on iPhone, go to **Settings → Accessibility → Spoken Content → Voices → Spanish** and download the **Premium** or **Enhanced** version of **Mónica** (Spain accent) or **Paulina** (Mexican accent). Then reopen the app. You can switch voices any time from the 🗣️ Voice panel at the top.

## Add words

Words live in the `CATS` array near the top of the `<script>`. Each word is one entry:

```js
["caballo", "el", "horse", "🐴", "kah-BAH-yoh"]
// word,    article, English, picture, pronunciation (CAPS = stressed syllable)
```
