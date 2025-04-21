// TrackCard.tsx
'use client';

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioSrc: string;
  duration: string;
}

interface TrackCardProps {
  track: Track;
  isActive: boolean;
  index: number;
  totalCards: number; // Add total cards prop
  onClick: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ 
  track, 
  isActive, 
  index,
  totalCards,
  onClick 
}) => {
  // Calculate gradually decreasing rotation based on index
  // First card (index 0) has maximum rotation, last card has minimum
  const maxRotation = 60;
  const minRotation = 40;
  
  // Calculate rotation with a gradual decrease
  const rotateX = maxRotation - ((maxRotation - minRotation) * (index / (totalCards - 1 || 1)));
  
  // Define variants with specific z-positions
  const variants = {
    initial: {
      rotateX,
      rotateY: 0,
      rotateZ: 0,
      translateZ: -50 + (index * 5), // Gradually increase Z position for better depth
    },
    hover: {
      rotateX,
      rotateY: 0,
      rotateZ: 0,
      translateZ: 100, // Move far forward on hover
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="perspective-[1200px]">
      <motion.div
        className="relative rounded-xl overflow-hidden cursor-pointer bg-black"
        onClick={onClick}
        variants={variants}
        initial="initial"
        whileHover="hover"
        style={{
          width: "320px",
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          zIndex: isActive ? 50 : 10 - index,
          position: isActive ? "relative" : "absolute",
          top: isActive ? "auto" : `${index * 30}px`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Album art */}
        <AspectRatio ratio={16 / 9}>
          <Image
            src={track.albumArt}
            alt={track.title}
            fill
            className="object-cover"
          />
        </AspectRatio>

        {/* Track info */}
        <div className="p-4 bg-black">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">{track.title}</h3>
              <p className="text-sm text-gray-400">{track.artist}</p>
            </div>
            <span className="text-sm text-gray-400">{track.duration}</span>
          </div>
          
          {/* Play status indicator */}
          <div className="mt-3 flex items-center">
            <div className={clsx(
              "w-3 h-3 rounded-full mr-2",
              isActive ? "bg-blue-500" : "bg-gray-500"
            )}></div>
            <span className="text-sm text-gray-400">
              {isActive ? "Now playing" : "Click to play"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrackCard;