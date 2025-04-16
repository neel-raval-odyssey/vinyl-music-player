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
  setTrack: (track: Track) => void;
  togglePlay: () => void;
  pause: () => void;
  play: () => void;
}

export const useStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  pause: () => set({ isPlaying: false }),
  play: () => set({ isPlaying: true }),
}));