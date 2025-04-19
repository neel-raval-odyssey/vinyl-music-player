'use client';

import Sidebar from '@/components/Sidebar';
import VinylPlayer from '@/components/VinylPlayer';


const VinylMusicPlayerPage: React.FC = () => {
  return (
    <main className="h-screen w-full flex bg-zinc-950 text-white">
      <Sidebar />

      <section className="flex-1 p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          🎶 Neelluus Vinyl Music Player
        </h1>

        <VinylPlayer />
      </section>
    </main>
  );
};

export default VinylMusicPlayerPage;