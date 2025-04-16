import type { ReactNode } from 'react';

const VinylMusicPlayerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {children}
    </div>
  );
};

export default VinylMusicPlayerLayout;