import { createContext, useContext } from 'react';
import { useSpotifyAuth } from '@/features/spotify/auth/hooks/useSpotifyAuth';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const { isConnected, checkConnection } = useSpotifyAuth();

  const value = {
    isConnected,
    checkConnection,
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