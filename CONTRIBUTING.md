# 🤝 Contributing to Neelluu's Vinyl Music Player

Thanks for your interest in contributing to **Neelluu's Vinyl Music Player**!  
Whether you're fixing bugs, improving documentation, adding features, or just playing around with the codebase—you're very welcome here.

---

## 🚀 Getting Started

1. **Fork** this repository on GitHub.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/your-username/vinyl-music-player.git
   cd vinyl-music-player
   ```
3. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Run the app locally**:
   ```bash
   pnpm run dev
   ```
6. **Start coding** and test your changes!

---

## 📆 Project Structure Overview

```bash
src/
├── app/                    # Next.js routes
│   ├── page.tsx           # Redirects to /vinyl-music-player
│   └── vinyl-music-player/page.tsx
├── components/            # Reusable UI components
│   ├── Sidebar.tsx
│   └── VinylPlayer.tsx
├── store/                 # Zustand state management
│   └── useStore.ts
├── lib/                   # Static mock data
│   └── mockTracks.ts
public/
├── audio-file/            # MP3 audio files
└── song-cover-photo/      # Album artwork
```

---

## ✅ Coding Guidelines

- Use **TypeScript** for type safety and clarity.
- Follow the existing **code style**. Use Prettier:
  ```bash
  pnpm run format
  ```
- Keep components **modular** and **well-commented**.
- Write **descriptive commit messages**, e.g.:
  - `feat: add shuffle button to VinylPlayer`
  - `fix: prevent track reset on volume change`
  - `docs: improve README and contributing guide`

---

## 🦢 Testing & Verification

This project doesn't yet use automated tests (coming soon), but you should:

- ✅ Manually test play/pause behavior
- ✅ Check track navigation works as expected
- ✅ Test volume interaction via drag & click
- ✅ Confirm audio loads for all tracks

If you're adding new components, **keep them small and composable**.

---

## 🌱 Ideas You Can Contribute To

- 🌺 Add a seek bar or playback progress indicator
- ♻️ Add repeat modes (loop track, loop playlist)
- 🎧 Add keyboard shortcuts (space = play/pause, arrows = next/prev)
- 📱 Improve responsiveness on mobile screens
- 🧠 Hook into the Spotify API for real-time metadata or recommendations

Open an [Issue](https://github.com/neel-raval-odyssey/vinyl-music-player/issues) to pitch your idea!

---

## 🛡️ Code of Conduct

We follow an inclusive [Code of Conduct](https://opensource.guide/code-of-conduct/).  
Be kind, constructive, and respectful. Collaboration > Competition.

---

## 🙌 Thank You

Every contribution matters.  
Whether it's a bug fix, a new feature, or improving documentation—thank you for helping improve the project 💿

Happy hacking!  
– Neel & Team 🎷