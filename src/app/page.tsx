'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Home page component that automatically redirects users
 * to the vinyl music player interface.
 */
const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the vinyl music player page on load
    router.push('/vinyl-music-player');
  }, [router]);

  // No UI is rendered for this page
  return null;
};

export default Home;