import { createContext, useContext } from 'react';
import { useSpotifyAuth } from '@/features/spotify/auth/hooks/useSpotifyAuth';
import { useSpotifyPlaybackSdk } from '@/features/spotify/playbackSdk/hooks/useSpotifyPlaybackSdk';
import { useSpotifyPlayback } from '@/features/spotify/playback/hooks/useSpotifyPlayback';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const { isConnected, checkConnection } = useSpotifyAuth();
  const { deviceId, player } = useSpotifyPlaybackSdk(isConnected);
  const { playTrack } = useSpotifyPlayback(isConnected);

  const value = {
    isConnected,
    checkConnection,
    playTrack,
    deviceId,
    player
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