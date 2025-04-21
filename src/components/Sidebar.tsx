// Sidebar.tsx
'use client';

import { tracks } from '@/lib/mockTracks';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import TrackCard from './TrackCard';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioSrc: string;
  duration: string;
}

const Sidebar: React.FC = () => {
  const { currentTrack, setTrack, setTracks } = useStore();

  useEffect(() => {
    setTracks(tracks);
  }, [setTracks]);

  // Create a reversed copy of the tracks array
  const reversedTracks = [...tracks].reverse();

  return (
    <aside className="w-[400px] h-full bg-zinc-900 text-white p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-16">Your Library</h2>
      
      {/* Container with perspective */}
      <div className="relative h-[500px] ml-4">
        {reversedTracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
            totalCards={reversedTracks.length}
            isActive={currentTrack?.id === track.id}
            onClick={() => setTrack(track)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;