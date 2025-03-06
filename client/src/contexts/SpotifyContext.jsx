import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { spotifyAuthApi } from '@/features/spotify/auth/api/spotifyAuthApi';
import { spotifyApi } from '@/features/spotify/playback/api/spotifyPlaybackApi';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(null);

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

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!isConnected) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      try {
        // Get a fresh token from the backend
        const { accessToken } = await spotifyAuthApi.refreshToken();
        
        const player = new window.Spotify.Player({
          name: 'Billboard Time Machine',
          getOAuthToken: async cb => {
            // Get fresh token each time it's needed
            const { accessToken } = await spotifyAuthApi.refreshToken();
            cb(accessToken);
          }
        });

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        player.connect();
        setPlayer(player);
      } catch (error) {
        console.error('Failed to initialize Spotify player:', error);
      }
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [isConnected]);

  const playTrack = useCallback(async (song, artist) => {
    if (!isConnected) {
      throw new Error('Not connected to Spotify');
    }

    return await spotifyApi.searchAndPlay(song, artist);
  }, [isConnected]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const value = {
    isConnected,
    checkConnection,
    playTrack,
    deviceId
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}; 