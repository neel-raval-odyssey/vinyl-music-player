'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import clsx from 'clsx';
import { motion, useAnimationControls } from 'framer-motion';

const VinylPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay } = useStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const vinylControls = useAnimationControls();

  // Start vinyl spinning animation
  const startVinylSpin = () => {
    vinylControls.start({
      rotate: 3600,
      transition: {
        duration: 60, // 60 seconds for 10 full rotations
        ease: "linear",
        repeat: Infinity,
      }
    });
  };

  // Load and play audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.audioSrc;

    const handleLoaded = () => {
      audio.play().catch((err) => console.error('Audio play error:', err));
      // Start spinning immediately when a new track is loaded
      startVinylSpin();
    };

    audio.addEventListener('loadeddata', handleLoaded);
    audio.load();

    return () => {
      audio.removeEventListener('loadeddata', handleLoaded);
    };
  }, [currentTrack]);

  // Play/pause audio when Zustand state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
      // Resume vinyl rotation
      startVinylSpin();
    } else {
      audio.pause();
      // Pause vinyl rotation at current position
      vinylControls.stop();
    }
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <div className="h-96 w-96 flex items-center justify-center text-zinc-500">
        Select a track to start playing
      </div>
    );
  }

  return (
    <div className="relative w-[28rem] h-[28rem] flex items-center justify-center">
      {/* Hinge and tonearm container (clickable) */}
      <div
        className="absolute right-[-1.5rem] top-16 z-30 cursor-pointer"
        onClick={togglePlay}
      >
        {/* Rotating tonearm */}
        <motion.div
          className="w-40 h-2 bg-gray-300 rounded origin-right absolute top-1 right-2 z-30"
          animate={{
            rotate: isPlaying ? -38 : -80, // 0 when playing, lifted outwards when paused
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Needle */}
          <div className="w-3 h-3 bg-amber-800 rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
        </motion.div>
      </div>
  
      {/* Vinyl */}
      <motion.div
        animate={vinylControls}
        className={clsx(
          'w-96 h-96 rounded-full border-8 border-zinc-800 relative',
          'bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl overflow-hidden'
        )}
      >
        {/* Groove Rings */}
        <div className="absolute inset-0 rounded-full">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-white/20"
              style={{ transform: `scale(${1 - i * 0.02})` }}
            />
          ))}
        </div>
  
        {/* Album Cover */}
        <div className="w-28 h-28 rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Image
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
  
      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default VinylPlayer;