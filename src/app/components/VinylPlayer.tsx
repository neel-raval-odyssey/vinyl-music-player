'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { animate } from 'animejs';
import Image from 'next/image';
import clsx from 'clsx';

const VinylPlayer: React.FC = () => {
  const { currentTrack, isPlaying } = useStore();
  const vinylRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load and play audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.audioSrc;

    const handleLoaded = () => {
      audio.play().catch((err) =>
        console.error('Audio play error:', err)
      );
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
      audio.play().catch((err) =>
        console.error('Audio play error:', err)
      );
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Rotate vinyl based on play/pause
  useEffect(() => {
    if (!vinylRef.current) return;

    const rotateAnimation = animate(
      vinylRef.current,
      {
        rotate: '360deg',
        duration: 6000,
        easing: 'linear',
        loop: true,
        autoplay: false,
      }
    );

    isPlaying ? rotateAnimation.play() : rotateAnimation.pause();

    return () => {
      rotateAnimation.pause();
    };
  }, [isPlaying]);

  if (!currentTrack) {
    return (
      <div className="h-96 w-96 flex items-center justify-center text-zinc-500">
        Select a track to start playing
      </div>
    );
  }

  return (
    <>
    <div
        ref={vinylRef}
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
            style={{
                transform: `scale(${1 - i * 0.020})`,
            }}
            />
        ))}
        </div>

        {/* Album Cover */}
        <div
        className="w-28 h-28 rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
        <Image
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            fill
            className="object-cover"
        />
        </div>
    </div>

    <audio ref={audioRef} />
    </>
  );
};

export default VinylPlayer;