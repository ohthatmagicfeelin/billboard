import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';

export function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      const returnTo = sessionStorage.getItem('returnTo') || '/';
      
      try {
        await api.get(`/api/spotify/callback`, {
          params: { code }
        });
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
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Connecting to Spotify...</h2>
        {/* Optional: Add a loading spinner here */}
      </div>
    </div>
  );
} 