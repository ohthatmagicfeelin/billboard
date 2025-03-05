import { useState, useEffect, useCallback } from 'react';
import { useSpotify } from '@/contexts/SpotifyContext';
import { SpotifyLoginPrompt } from '@/features/spotify/components/SpotifyLoginPrompt';
import api from '@/api/api';
import { spotifyApi } from '@/features/spotify/api/spotifyApi';

export function BillboardDisplay({ weekInfo, chartData, loading, error }) {
  const { isConnected, playTrack } = useSpotify();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingTrack, setPendingTrack] = useState(null);
  const [playbackError, setPlaybackError] = useState(null);

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
      const { data } = await api.get('/api/spotify/auth-url');
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to get Spotify auth URL:', error);
    }
  }, [pendingTrack]);

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse flex p-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 ml-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!chartData) return null;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Billboard Hot 100
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {weekInfo}
          </p>
        </div>
        
        <div className="space-y-3">
          {chartData.map((entry, index) => (
            <div 
              key={index}
              className="group flex items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 dark:border-gray-700 relative"
            >
              {/* Position Number */}
              <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-gray-700 rounded-lg mr-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover:opacity-0 transition-opacity duration-200">
                  {entry.this_week}
                </span>
                <button
                  onClick={() => handlePlay(entry.song, entry.artist)}
                  className="absolute left-5 w-16 h-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label={`Play ${entry.song}`}
                >
                  <svg 
                    className="w-8 h-8 text-blue-600 dark:text-blue-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </button>
              </div>
              
              {/* Song Info */}
              <div className="flex-grow min-w-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {entry.song}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 truncate">
                  {entry.artist}
                </p>
              </div>
              
              {/* Stats */}
              <div className="text-right ml-4 flex flex-col items-end space-y-1">
                {entry.last_week && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Last Week: #{entry.last_week}
                    </span>
                    <div className={`
                      ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium
                      ${entry.last_week < entry.this_week 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                        : entry.last_week > entry.this_week 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                    `}>
                      {entry.last_week < entry.this_week ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                          <span className="ml-1">{entry.this_week - entry.last_week}</span>
                        </>
                      ) : entry.last_week > entry.this_week ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                          </svg>
                          <span className="ml-1">{entry.last_week - entry.this_week}</span>
                        </>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Peak: #{entry.peak_position}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.weeks_on_chart} {entry.weeks_on_chart === 1 ? 'week' : 'weeks'} on chart
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Add error message display */}
        {playbackError && (
          <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg shadow-lg">
            {playbackError}
          </div>
        )}
      </div>

      <SpotifyLoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleSpotifyLogin}
      />
    </>
  );
} 