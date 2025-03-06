import { useState, useEffect, useCallback } from 'react';
import { billboardApi } from '../../api/billboardApi';
import { spotifyApi } from '../../../spotify/playback/api/spotifyPlaybackApi';
import { useSpotify } from '@/contexts/SpotifyContext';
import api from '@/api/api';

export function useBillboardChart(selectedDate) {
  const [weekInfo, setWeekInfo] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playbackError, setPlaybackError] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingTrack, setPendingTrack] = useState(null);
  
  const { isConnected } = useSpotify();

  // Fetch chart data when date changes
  useEffect(() => {
    async function fetchChartData() {
      if (!selectedDate) {
        setChartData(null);
        setWeekInfo('');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const year = new Date(selectedDate).getFullYear();
        const response = await billboardApi.getHistoricalWeek(year, selectedDate);
        setWeekInfo(response.weekInfo);
        setChartData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch Billboard data');
        setChartData(null);
        setWeekInfo('');
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, [selectedDate]);

  const handlePlay = useCallback(async (song, artist) => {
    if (!isConnected) {
      setPendingTrack({ song, artist });
      setShowLoginPrompt(true);
      return;
    }
    
    try {
      setPlaybackError(null);
      await spotifyApi.searchAndPlay(song, artist);
    } catch (error) {
      setPlaybackError(error.message);
    }
  }, [isConnected]);

  const handleSpotifyLogin = useCallback(async () => {
    try {
      sessionStorage.setItem('returnTo', window.location.pathname);
      if (pendingTrack) {
        sessionStorage.setItem('pendingTrack', JSON.stringify(pendingTrack));
      }
      const { data } = await api.get('/api/spotify/auth/auth-url');
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to get Spotify auth URL:', error);
    }
  }, [pendingTrack]);

  // Handle pending track playback after Spotify connection
  useEffect(() => {
    if (isConnected) {
      const savedTrack = sessionStorage.getItem('pendingTrack');
      if (savedTrack) {
        const track = JSON.parse(savedTrack);
        handlePlay(track.song, track.artist);
        sessionStorage.removeItem('pendingTrack');
      }
    }
  }, [isConnected, handlePlay]);

  return {
    weekInfo,
    chartData,
    loading,
    error,
    playbackError,
    showLoginPrompt,
    setShowLoginPrompt,
    handlePlay,
    handleSpotifyLogin
  };
} 