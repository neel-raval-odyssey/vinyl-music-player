'use client';

import Sidebar from '@/app/components/Sidebar';

const VinylMusicPlayerPage: React.FC = () => {
  return (
    <main className="h-screen w-full flex bg-zinc-950 text-white">
      <Sidebar />

      <section className="flex-1 p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          🎶 Neelluus Vinyl Music Player
        </h1>

        {/* Placeholder for VinylPlayer + Controls */}
        <div className="w-full max-w-xl h-96 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center">
          <p className="text-zinc-400">VinylPlayer coming soon 💿</p>
        </div>
      </section>
    </main>
  );
};

export default VinylMusicPlayerPage;