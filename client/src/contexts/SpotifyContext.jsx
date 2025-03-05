import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { spotifyApi } from '@/features/spotify/api/spotifyApi';
import api from '@/api/api';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  const checkConnection = useCallback(async () => {
    try {
      const { data } = await api.get('/api/spotify/auth/check-connection');
      setIsConnected(data.isConnected);
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        spotifyApi.setAccessToken(data.accessToken);
      }
      return data.isConnected;
    } catch (error) {
      console.error('Failed to check Spotify connection:', error);
      setIsConnected(false);
      setAccessToken(null);
      return false;
    }
  }, []);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Billboard Time Machine',
        getOAuthToken: cb => { cb(accessToken); }
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
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const playTrack = useCallback(async (song, artist) => {
    if (!isConnected || !accessToken) {
      throw new Error('Not connected to Spotify');
    }

    try {
      const track = await spotifyApi.searchTrack(song, artist);
      await spotifyApi.playTrack(track.uri);
      return track;
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    }
  }, [isConnected, accessToken]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const value = {
    isConnected,
    accessToken,
    checkConnection,
    playTrack
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