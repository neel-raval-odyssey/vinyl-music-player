import { create } from 'zustand';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioSrc: string;
  duration: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  tracks: Track[]; // ✨ ADD THIS
  setTracks: (tracks: Track[]) => void; // ✨ ADD
  setTrack: (track: Track) => void;
  togglePlay: () => void;
  pause: () => void;
  play: () => void;
  playNext: () => void; // ✨ ADD
  playPrevious: () => void; // ✨ ADD
  shuffleTrack: () => void; // ✨ ADD
}

export const useStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  tracks: [], // ✨ initially empty

  setTracks: (tracks) => set({ tracks }),
  
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  pause: () => set({ isPlaying: false }),
  play: () => set({ isPlaying: true }),

  playNext: () => {
    const { currentTrack, tracks } = get();
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    set({ currentTrack: tracks[nextIndex], isPlaying: true });
  },

  playPrevious: () => {
    const { currentTrack, tracks } = get();
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    set({ currentTrack: tracks[prevIndex], isPlaying: true });
  },

  shuffleTrack: () => {
    const { tracks } = get();
    if (tracks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    set({ currentTrack: tracks[randomIndex], isPlaying: true });
  }
}));