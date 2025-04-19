'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import clsx from 'clsx';
import { motion, useAnimationControls } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { StepForward, StepBack, Shuffle } from "lucide-react";

const VinylPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious, 
    shuffleTrack,
    tracks // Add this to check if tracks are loaded
  } = useStore();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const vinylControls = useAnimationControls();
  const [volume, setVolume] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const trackChangeRef = useRef(false);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Current tracks in store:", tracks);
    console.log("Current track:", currentTrack);
    console.log("Is playing:", isPlaying);
  }, [tracks, currentTrack, isPlaying]);

  // Enhanced button handlers with logging
  const handlePlayNext = () => {
    console.log("Next button clicked");
    playNext();
  };

  const handlePlayPrevious = () => {
    console.log("Previous button clicked");
    playPrevious();
  };

  const handleShuffleTrack = () => {
    console.log("Shuffle button clicked");
    shuffleTrack();
  };

  // Start vinyl spinning
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

  // Stop vinyl spinning
  const stopVinylSpin = () => {
    vinylControls.stop();
  };

  const handleDrag = (clientY: number) => {
    if (!sliderContainerRef.current) return;

    const rect = sliderContainerRef.current.getBoundingClientRect();
    const height = rect.height - 8;
    const relativeY = Math.max(0, Math.min(height, clientY - rect.top));
    const newVolume = Math.max(0, Math.min(1, 1 - (relativeY / height)));

    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleClick = (clientY: number) => {
    if (!sliderContainerRef.current) return;

    const rect = sliderContainerRef.current.getBoundingClientRect();
    const height = rect.height - 8;
    const clickY = clientY - rect.top;
    const newVolume = Math.max(0, Math.min(1, 1 - (clickY / height)));

    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Safe play function that checks readiness
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

  // Safe pause function
  const safePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause();
    stopVinylSpin();
  }, []);

  // Handle track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    
    console.log("Track changed to:", currentTrack.title);
  
    trackChangeRef.current = true;
    setIsLoadingTrack(true);
    setIsAudioReady(false);
  
    const handleCanPlay = () => {
      console.log("Audio can play now");
      setIsAudioReady(true);
      audio.volume = volume;
      trackChangeRef.current = false;
      setIsLoadingTrack(false);
    };
  
    const handleEnded = () => {
      console.log("Track ended, playing next");
      playNext();
    };
  
    // ✅ First remove previous (with empty arrow functions), then add new ones
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
  }, [currentTrack, volume, playNext]);  

  // Handle play/pause state changes
  useEffect(() => {
    // Skip if we're in the middle of a track change
    if (trackChangeRef.current) return;
    
    if (isPlaying) {
      console.log("Play state activated");
      safePlay();
    } else {
      console.log("Pause state activated");
      safePause();
    }
  }, [isPlaying, safePlay, safePause]);

  // When audio becomes ready, start playing if needed
  useEffect(() => {
    if (isAudioReady && isPlaying && !trackChangeRef.current) {
      console.log("Audio ready and should play");
      safePlay();
    }
  }, [isAudioReady, isPlaying, safePlay]);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Check if tracks array is empty
  useEffect(() => {
    if (tracks.length === 0) {
      console.warn("No tracks available in the store. Buttons won't work without tracks.");
    }
  }, [tracks]);
  
  if (!currentTrack) {
    return (
      <div className="h-96 w-96 flex items-center justify-center text-zinc-500">
        Select a track to start playing
      </div>
    );
  }

  const fillHeight = Math.max(4, volume * 100);
  const thumbPosition = Math.max(12, volume * 90);

  return (
    <div className="relative w-[28rem] h-[28rem] flex items-center justify-center">
      {/* Hinge and tonearm */}
      <div
        className="absolute right-[-1.5rem] top-16 z-30 cursor-pointer"
        onClick={togglePlay}
      >
        <motion.div
          className="w-40 h-2 bg-gray-300 rounded origin-right absolute top-1 right-2 z-30"
          animate={{ rotate: isPlaying ? -38 : -80 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
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
        <div className="absolute inset-0 rounded-full">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-white/20"
              style={{ transform: `scale(${1 - i * 0.02})` }}
            />
          ))}
        </div>
        <div className="w-28 h-28 rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Image
            src={currentTrack.albumArt}
            alt={currentTrack.title}
            fill
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Track Info Display */}
      <div className="absolute top-[-3rem] left-0 right-0 text-center">
        <h3 className="text-lg font-bold">{currentTrack.title}</h3>
        <p className="text-sm text-gray-500">{currentTrack.artist}</p>
      </div>

      {/* Buttons below the Vinyl */}
      <div className="absolute bottom-36 flex flex-col items-center gap-3 justify-center z-30 -translate-x-80">
        {/* Row 1: Previous + Next */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={handlePlayPrevious}
            className="flex items-center justify-between gap-2 px-6 py-3 rounded-lg shadow-lg font-mono active:translate-y-1 active:shadow-inner"
            disabled={isLoadingTrack || tracks.length <= 1}
          >
            <span className="text-sm">Previous</span>
            <StepBack className="w-5 h-5" />
          </Button>

          <Button
            variant="secondary"
            onClick={handlePlayNext}
            className="flex items-center justify-between gap-2 px-6 py-3 rounded-lg shadow-lg font-mono active:translate-y-1 active:shadow-inner"
            disabled={isLoadingTrack || tracks.length <= 1}
          >
            <span className="text-sm">Next</span>
            <StepForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Row 2: Shuffle */}
        <Button
          variant="secondary"
          onClick={handleShuffleTrack}
          className="flex items-center justify-between gap-2 px-6 py-3 rounded-lg shadow-lg font-mono active:translate-y-1 active:shadow-inner w-full"
          disabled={isLoadingTrack || tracks.length <= 1}
        >
          <span className="text-sm">Shuffle</span>
          <Shuffle className="w-5 h-5" />
        </Button>
      </div>

      {/* Debug info */}
      <div className="absolute bottom-[-4rem] left-0 right-0 text-xs text-gray-500 text-center">
        Tracks: {tracks.length} | Current: {currentTrack ? currentTrack.id : 'none'} | Playing: {isPlaying ? 'yes' : 'no'}
      </div>

      {/* Volume Control */}
      <div className="absolute bottom-2 right-2 flex items-center justify-center z-30">
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
            style={{ 
              left: '50%',
              transform: 'translate(-50%, 50%)'
            }}
          />
        </div>
      </div>

      {/* Hidden Audio */}
      <audio ref={audioRef} />
    </div>
  );
};

export default VinylPlayer;