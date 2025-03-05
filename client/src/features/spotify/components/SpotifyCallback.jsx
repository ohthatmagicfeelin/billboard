import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotify } from '@/contexts/SpotifyContext';
import api from '@/api/api';

export function SpotifyCallback() {
  const navigate = useNavigate();
  const { checkConnection } = useSpotify();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      const returnTo = sessionStorage.getItem('returnTo') || '/';
      
      try {
        await api.get(`/api/spotify/callback`, {
          params: { code }
        });
        // Check connection status after successful callback
        await checkConnection();
        // Clear the stored return path
        sessionStorage.removeItem('returnTo');
        // Redirect back to the previous page
        navigate(returnTo, { replace: true });
      } catch (error) {
        console.error('Spotify callback failed:', error);
        navigate(returnTo, { replace: true });
      }
    };

    handleCallback();
  }, [navigate, checkConnection]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Connecting to Spotify...
        </h2>
      </div>
    </div>
  );
} 