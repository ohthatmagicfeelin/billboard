import { useState, useEffect } from 'react';
import { spotifyAuthApi } from '../../auth/api/spotifyAuthApi';

export function useSpotifyPlayer(isConnected) {
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConnected) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      try {
        const { accessToken } = await spotifyAuthApi.refreshToken();
        
        const player = new window.Spotify.Player({
          name: 'Billboard Time Machine',
          getOAuthToken: async cb => {
            try {
              const { accessToken } = await spotifyAuthApi.refreshToken();
              cb(accessToken);
            } catch (error) {
              setError('Failed to refresh Spotify token');
            }
          }
        });

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          setIsReady(true);
          setError(null);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setIsReady(false);
        });

        player.addListener('initialization_error', ({ message }) => {
          setError(`Failed to initialize: ${message}`);
        });

        player.addListener('authentication_error', ({ message }) => {
          setError(`Failed to authenticate: ${message}`);
        });

        player.addListener('account_error', ({ message }) => {
          setError(`Account error: ${message}`);
        });

        await player.connect();
        setPlayer(player);
      } catch (error) {
        setError('Failed to initialize Spotify player');
        console.error('Failed to initialize Spotify player:', error);
      }
    };

    return () => {
      if (player) {
        player.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [isConnected]);

  return { deviceId, player, isReady, error };
} 