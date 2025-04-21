import { create } from 'zustand';

/**
 * Represents a single audio track.
 */
interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioSrc: string;
  duration: string;
}

/**
 * Global player state managed via Zustand.
 */
interface PlayerState {
  currentTrack: Track | null;           // Currently selected/playing track
  isPlaying: boolean;                   // Play/pause state
  tracks: Track[];                      // All available tracks

  setTracks: (tracks: Track[]) => void;       // Set available track list
  setTrack: (track: Track) => void;           // Set and play a specific track
  togglePlay: () => void;                     // Toggle playback state
  pause: () => void;                          // Explicit pause
  play: () => void;                           // Explicit play

  playNext: () => void;                       // Play next track in list
  playPrevious: () => void;                   // Play previous track in list
  shuffleTrack: () => void;                   // Shuffle and play a random track
}

/**
 * Zustand store implementation for global player logic.
 */
export const useStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  tracks: [],

  // Set the full list of available tracks
  setTracks: (tracks) => set({ tracks }),

  // Set a specific track as current and start playing
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),

  // Toggle play/pause
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Pause playback
  pause: () => set({ isPlaying: false }),

  // Play current track
  play: () => set({ isPlaying: true }),

  // Play the next track in the list (wraps around)
  playNext: () => {
    const { currentTrack, tracks } = get();
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;

    set({ currentTrack: tracks[nextIndex], isPlaying: true });
  },

  // Play the previous track in the list (wraps around)
  playPrevious: () => {
    const { currentTrack, tracks } = get();
    if (!currentTrack || tracks.length === 0) return;

    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;

    set({ currentTrack: tracks[prevIndex], isPlaying: true });
  },

  // Shuffle and play a random track from the list
  shuffleTrack: () => {
    const { tracks } = get();
    if (tracks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * tracks.length);
    set({ currentTrack: tracks[randomIndex], isPlaying: true });
  },
}));