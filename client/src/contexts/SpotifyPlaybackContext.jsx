import { createContext, useContext } from 'react';
import { useSpotifyPlaybackSdk } from '../features/spotify/playbackSdk/hooks/useSpotifyPlaybackSdk';
import { useSpotifyPlayback } from '../features/spotify/playback/hooks/useSpotifyPlayback';
import { useSpotify } from '@/contexts/SpotifyContext';

const SpotifyPlaybackContext = createContext(null);

export function SpotifyPlaybackProvider({ children }) {
  const { isConnected } = useSpotify();
  const { deviceId, player } = useSpotifyPlaybackSdk(isConnected);
  const { playTrack } = useSpotifyPlayback(isConnected);

  return (
    <SpotifyPlaybackContext.Provider value={{ deviceId, player, playTrack }}>
      {children}
    </SpotifyPlaybackContext.Provider>
  );
}

export function useSpotifyPlayback() {
  const context = useContext(SpotifyPlaybackContext);
  if (!context) {
    throw new Error('useSpotifyPlayback must be used within a SpotifyPlaybackProvider');
  }
  return context;
} 