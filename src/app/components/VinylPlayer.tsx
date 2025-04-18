import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import clsx from 'clsx';
import { motion, useAnimationControls } from 'framer-motion';

const VinylPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay } = useStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const vinylControls = useAnimationControls();
  const [volume, setVolume] = useState(1); // Default to full
  const [isDragging, setIsDragging] = useState(false);

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

  // Handle drag for volume control
  const handleDrag = (clientY: number) => {
    if (!sliderContainerRef.current || !isDragging) return;
    
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const height = rect.height - 8; // Account for padding
    const relativeY = Math.max(0, Math.min(height, clientY - rect.top));
    
    // Calculate volume (0 at bottom, 1 at top)
    const newVolume = Math.max(0, Math.min(1, 1 - (relativeY / height)));
    
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle click on the slider container
  const handleSliderContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderContainerRef.current) return;
    
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const height = rect.height - 8; // Account for padding
    const clickY = e.clientY - rect.top;
    
    // Calculate volume (0 at bottom, 1 at top)
    const newVolume = Math.max(0, Math.min(1, 1 - (clickY / height)));
    
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Setup mouse/touch event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDrag(e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleDrag(e.touches[0].clientY);
    };
    
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  // Set volume on load
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle track change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.audioSrc;

    const handleLoaded = () => {
      audio.play().catch(console.error);
      startVinylSpin();
      audio.volume = volume; // ensure correct volume immediately
    };

    audio.addEventListener('loadeddata', handleLoaded);
    audio.load();

    return () => {
      audio.removeEventListener('loadeddata', handleLoaded);
    };
  }, [currentTrack]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
      startVinylSpin();
    } else {
      audio.pause();
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

  // Calculate the visual fill height (minimum 4px to always be visible)
  const fillHeight = Math.max(4, volume * 100);
  // Calculate the thumb position (minimum 2px from bottom to always be visible)
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

      {/* Volume Control - Fixed container with proper overflow handling */}
      <div className="absolute bottom-2 right-2 flex items-center justify-center z-30">
        <div 
          ref={sliderContainerRef}
          className="w-10 h-32 bg-gradient-to-b from-zinc-300 to-zinc-100 rounded-xl shadow-inner flex items-center justify-center p-1 cursor-pointer relative overflow-hidden"
          onClick={handleSliderContainerClick}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleDrag(e.clientY);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            if (e.touches[0]) handleDrag(e.touches[0].clientY);
          }}
        >
          {/* Container outline for better visibility */}
          <div className="absolute inset-1 rounded-lg border border-gray-300 pointer-events-none" />
          
          {/* Custom volume fill with minimum height */}
          <motion.div 
            className="absolute bottom-1 left-1 right-1 bg-black rounded-lg pointer-events-none"
            initial={{ height: `${fillHeight}%` }}
            animate={{ height: `${fillHeight}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ 
              maxHeight: 'calc(100% - 8px)'
            }}
          />
          
          {/* Slider thumb with centered positioning */}
          <motion.div 
            className="absolute w-8 h-5 bg-gray-400 rounded-md shadow-lg border border-gray-500 pointer-events-none"
            initial={{ bottom: `${thumbPosition}%` }}
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