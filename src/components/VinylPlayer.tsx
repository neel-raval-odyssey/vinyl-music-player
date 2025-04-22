'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import clsx from 'clsx';
import { motion, useAnimationControls } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { StepForward, StepBack, Shuffle } from "lucide-react";

/**
 * VinylPlayer component handles audio playback, UI interaction, and animations.
 * Integrates a custom tonearm, spinning vinyl animation, volume control, and player controls.
 */
const VinylPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious, 
    shuffleTrack,
    tracks
  } = useStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const vinylControls = useAnimationControls();
  const [volume, setVolume] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const trackChangeRef = useRef(false);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);

  // Log key state changes for debugging
  useEffect(() => {
    console.log("Current tracks in store:", tracks);
    console.log("Current track:", currentTrack);
    console.log("Is playing:", isPlaying);
  }, [tracks, currentTrack, isPlaying]);

  // Controls vinyl spin animation
  const startVinylSpin = () => {
    vinylControls.start({
      rotate: 3600,
      transition: {
        duration: 60,
        ease: 'linear',
        repeat: Infinity,
      },
    });
  };

  const stopVinylSpin = () => {
    vinylControls.stop();
  };

  // Volume slider logic - drag interaction
  const handleDrag = (clientY: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const height = rect.height - 8;
    const relativeY = Math.max(0, Math.min(height, clientY - rect.top));
    const newVolume = Math.max(0, Math.min(1, 1 - (relativeY / height)));
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  // Volume slider logic - click interaction
  const handleClick = (clientY: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const height = rect.height - 8;
    const clickY = clientY - rect.top;
    const newVolume = Math.max(0, Math.min(1, 1 - (clickY / height)));
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  // Safely play track
  const safePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isAudioReady) return;
    try {
      startVinylSpin();
      await audio.play();
    } catch (err) {
      console.error('Error playing audio:', err);
      stopVinylSpin();
    }
  }, [isAudioReady]);

  // Safely pause track
  const safePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    stopVinylSpin();
  }, []);

  // Handles track changes only when currentTrack changes (not volume)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    trackChangeRef.current = true;
    setIsLoadingTrack(true);
    setIsAudioReady(false);

    const handleCanPlay = () => {
      setIsAudioReady(true);
      audio.volume = volume;
      trackChangeRef.current = false;
      setIsLoadingTrack(false);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    audio.pause();
    stopVinylSpin();
    audio.src = currentTrack.audioSrc;
    audio.load();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, playNext]);

  // Sync playback control with global isPlaying state
  useEffect(() => {
    if (trackChangeRef.current) return;
    if (isPlaying) safePlay();
    else safePause();
  }, [isPlaying, safePlay, safePause]);

  // Automatically play when audio becomes ready
  useEffect(() => {
    if (isAudioReady && isPlaying && !trackChangeRef.current) safePlay();
  }, [isAudioReady, isPlaying, safePlay]);

  // Add global mouse/touch listeners for volume dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => isDragging && handleDrag(e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleDrag(e.touches[0].clientY);
    };
    const stopDragging = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  // Sync volume change with audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Warn if no tracks exist
  useEffect(() => {
    if (tracks.length === 0) {
      console.warn("No tracks available in the store. Buttons won't work without tracks.");
    }
  }, [tracks]);

  // Fallback UI if no track is selected
  if (!currentTrack) {
    return (
      <div className="h-96 w-96 flex items-center justify-center text-zinc-500">
        Select a track to start playing
      </div>
    );
  }

  // Volume slider styling
  const fillHeight = Math.max(4, volume * 100);
  const thumbPosition = Math.max(12, volume * 90);

  return (
    <div className="relative w-full max-w-[28rem] aspect-square flex items-center justify-center"> {/* Responsive Container */}
      {/* Tonearm (click to toggle play/pause) */}
      <div
        className="absolute top-8 right-[-0.5rem] md:top-16 md:right-[-1.5rem] z-30 cursor-pointer" /* Responsive Position */
        onClick={togglePlay}
      >
        <motion.div
          className="w-24 md:w-40 h-2 bg-gray-300 rounded origin-right absolute top-1 right-2 z-30" /* Responsive Width */
          animate={{ rotate: isPlaying ? -38 : -80 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="w-3 h-3 bg-amber-800 rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
        </motion.div>
      </div>

      {/* Spinning vinyl disc with album art */}
      <motion.div
        animate={vinylControls}
        className={clsx(
          'w-[85%] h-[85%] rounded-full border-8 border-zinc-800 relative', // Responsive Size
          'bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl overflow-hidden'
        )}
      >
        <div className="absolute inset-0 rounded-full">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-white/20"
              style={{ transform: `scale(${1 - i * 0.02})` }}
            />
          ))}
        </div>
        <div className="w-[30%] h-[30%] rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"> {/* Responsive Size */}
          <Image
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            fill
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Track title and artist */}
      <div className="absolute top-[-3rem] left-0 right-0 text-center">
         <h3 className="text-base sm:text-lg font-bold">{currentTrack.title}</h3> {/* Responsive Text Size */}
         <p className="text-xs sm:text-sm text-gray-500">{currentTrack.artist}</p> {/* Responsive Text Size */}
      </div>

      {/* Playback control buttons */}
      <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 md:bottom-36 md:left-auto md:-translate-x-80"> {/* Responsive Position */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={playPrevious}
             className="flex items-center justify-between gap-2 px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm rounded-lg shadow-lg font-mono active:translate-y-1 active:shadow-inner" /* Responsive Padding & Text */
            disabled={isLoadingTrack || tracks.length <= 1}
          >
             <span className="">Previous</span> {/* Text size controlled by Button className */}
            <StepBack className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            onClick={playNext}
             className="flex items-center justify-between gap-2 px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm rounded-lg shadow-lg font-mono active:translate-y-1 active:shadow-inner" /* Responsive Padding & Text */
            disabled={isLoadingTrack || tracks.length <= 1}
          >
             <span className="">Next</span> {/* Text size controlled by Button className */}
            <StepForward className="w-5 h-5" />
          </Button>
        </div>

        <Button
          variant="secondary"
          onClick={shuffleTrack}
           className="flex items-center justify-between gap-2 px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm rounded-lg shadow-lg font-mono active:translate-y-1 active:shadow-inner w-full" /* Responsive Padding & Text */
          disabled={isLoadingTrack || tracks.length <= 1}
        >
           <span className="">Shuffle</span> {/* Text size controlled by Button className */}
          <Shuffle className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume slider UI */}
      <div className="absolute bottom-[-10rem] left-1/2 -translate-x-1/2 md:bottom-2 md:right-2 md:left-auto md:-translate-x-0 flex items-center justify-center z-30"> {/* Responsive Position */}
        <div
          ref={sliderContainerRef}
          className="w-10 h-32 bg-gradient-to-b from-zinc-300 to-zinc-100 rounded-xl shadow-inner flex items-center justify-center p-1 cursor-pointer relative overflow-hidden"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleClick(e.clientY);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            if (e.touches[0]) handleClick(e.touches[0].clientY);
          }}
        >
          <div className="absolute inset-1 rounded-lg border border-gray-300 pointer-events-none" />
          <motion.div 
            className="absolute bottom-1 left-1 right-1 bg-black rounded-lg pointer-events-none"
            animate={{ height: `${fillHeight}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ maxHeight: 'calc(100% - 8px)' }}
          />
          <motion.div 
            className="absolute w-8 h-5 bg-gray-400 rounded-md shadow-lg border border-gray-500 pointer-events-none"
            animate={{ bottom: `${thumbPosition}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ left: '50%', transform: 'translate(-50%, 50%)' }}
          />
        </div>
      </div>

      {/* Audio tag for HTML5 playback */}
      <audio ref={audioRef} />
    </div>
  );
};

export default VinylPlayer;