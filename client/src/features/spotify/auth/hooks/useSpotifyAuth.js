import { useState, useCallback, useEffect } from 'react';
import { spotifyAuthApi } from '../api/spotifyAuthApi';

export function useSpotifyAuth() {
  const [isConnected, setIsConnected] = useState(false);

  const checkConnection = useCallback(async () => {
    try {
      const { isConnected } = await spotifyAuthApi.checkConnection();
      setIsConnected(isConnected);
      return isConnected;
    } catch (error) {
      console.error('Failed to check Spotify connection:', error);
      setIsConnected(false);
      return false;
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return { isConnected, checkConnection };
}
