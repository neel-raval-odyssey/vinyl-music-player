# 🎶 Neelluu's Vinyl Music Player

A sleek, immersive vinyl-style music player built with **Next.js**, **Zustand**, **Framer Motion**, and **Tailwind CSS**. Spin tracks like it's analog, control playback with a tonearm, and vibe with a smooth, modern UI.

---

## ✨ Features

- 🎧 Vinyl-style rotating album art
- 🎚️ Custom volume control with vertical drag/click
- 📻 Play/pause via animated tonearm
- ⏮️⏭️ Previous/Next and Shuffle controls
- 📃 Zustand-based global player state
- 🖼️ Dynamic album artwork + audio assets
- 🎨 Framer Motion animations for realistic feel

---

## 📦 Tech Stack

- [Next.js (App Router)](https://nextjs.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/neel-raval-odyssey/vinyl-music-player.git
cd vinyl-music-player
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm run dev
```

App will be running on [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Redirects to the player
│   └── vinyl-music-player/page.tsx  # Main player UI
├── components/
│   ├── Sidebar.tsx                   # Track list & selection
│   └── VinylPlayer.tsx              # Core vinyl UI & logic
├── store/
│   └── useStore.ts                  # Zustand global player state
├── lib/
│   └── mockTracks.ts                # Track metadata (mocked)
public/
├── audio-file/                      # MP3 audio files
└── song-cover-photo/               # Album artwork
```

---

## 🧑‍💻 Developer Notes

- Volume control is implemented with vertical click/drag.
- Audio playback and UI are controlled via Zustand state.
- Track switching, playback, and shuffle behavior is abstracted into the global store.
- Album art spins using Framer Motion’s animation controller.
- Playback state is persistent within a session.

---

## 🌱 Add Your Own Tracks

To add custom tracks:

1. Drop your `.mp3` files into `/public/audio-file/`
2. Drop corresponding `.jpg` covers into `/public/song-cover-photo/`
3. Edit `src/lib/mockTracks.ts` and add your track object:
```ts
{
  id: '6',
  title: 'Your Track',
  artist: 'Your Artist',
  albumArt: '/song-cover-photo/Your-Cover.jpg',
  audioSrc: '/audio-file/Your-Track.mp3',
  duration: '3:45',
}
```

---

## 🧠 Ideas for Improvement

- ✅ Seek bar / progress indicator
- 🔁 Repeat modes
- 🧵 Playlist/queue support
- 🎙️ Lyrics display (LRC or synced AI)
- 🔊 Output device selector
- 🎛️ Sound visualization / waveform
- 🤖 AI-based music mood recommendations
---

Made with ❤️ by Neel Raval – powered by open source & good music.