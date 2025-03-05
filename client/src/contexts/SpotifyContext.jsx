import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import api from '@/api/api';

const SpotifyContext = createContext();

export function SpotifyProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const refreshToken = useCallback(async () => {
    try {
      const { data } = await axios.post('/api/spotify/refresh-token');
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setIsConnected(false);
      setAccessToken(null);
      return null;
    }
  }, []);

  const checkConnection = async () => {
    try {
      const { data } = await api.get('/api/spotify/check-connection');
      setIsConnected(data.isConnected);
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
    } catch (error) {
      console.error('Failed to check Spotify connection:', error);
      setIsConnected(false);
      setAccessToken(null);
    }
  };

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const value = {
    isConnected,
    accessToken,
    refreshToken,
    checkConnection
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