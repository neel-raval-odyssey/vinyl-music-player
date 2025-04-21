'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import { tracks } from '@/lib/mockTracks';
import { useStore } from '@/store/useStore';

/**
 * Sidebar component that displays the list of available tracks.
 * Allows users to select a track and updates global state accordingly.
 */
const Sidebar: React.FC = () => {
  const { currentTrack, setTrack, setTracks } = useStore();

  // Initialize the global track list once on mount
  useEffect(() => {
    setTracks(tracks);
  }, [setTracks]);

  return (
    <aside className="w-64 h-full bg-zinc-900 text-white p-4 space-y-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">🎵 Track List</h2>

      <ul className="space-y-2">
        {tracks.map((track) => (
          <li
            key={track.id}
            className={clsx(
              'flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors',
              currentTrack?.id === track.id
                ? 'bg-zinc-800' // Highlight selected track
                : 'hover:bg-zinc-800/50' // Hover effect
            )}
            onClick={() => setTrack(track)} // Select a new track
          >
            <Image
              src={track.albumArt}
              alt={track.title}
              width={50}
              height={50}
              className="rounded-md object-cover"
            />
            <div>
              <p className="text-sm font-medium">{track.title}</p>
              <p className="text-xs text-zinc-400">{track.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;