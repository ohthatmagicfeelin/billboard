import { useState, useEffect } from 'react';
import { spotifyAuthApi } from '@/features/spotify/auth/api/spotifyAuthApi';

export function useSpotifyPlaybackSdk(isConnected) {
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(null);

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

  return { deviceId, player };
}
