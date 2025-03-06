import { useCallback } from 'react';
import { spotifyApi } from '../api/spotifyPlaybackApi';

export function useSpotifyPlayback(isConnected) {
  const playTrack = useCallback(async (song, artist) => {
    if (!isConnected) {
      throw new Error('Not connected to Spotify');
    }

    return await spotifyApi.searchAndPlay(song, artist);
  }, [isConnected]);

  return { playTrack };
}
