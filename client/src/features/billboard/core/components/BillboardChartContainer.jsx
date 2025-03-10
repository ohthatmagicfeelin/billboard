import { useState } from 'react';
import { DateSelectorContainer } from '../../date/components/DateSelectorContainer';
import { BillboardChartDisplay } from './BillboardChartDisplay';
import { useBillboardChart } from '../hooks/useBillboardChart';
import { SpotifyPlaybackTest } from '@/features/spotify/playbackSdk/components/SpotifyPlaybackTest';

export function BillboardChartContainer() {
  const [selectedDate, setSelectedDate] = useState(null);
  const {
    weekInfo,
    chartData,
    loading,
    error,
    playbackError,
    showLoginPrompt,
    setShowLoginPrompt,
    handlePlay,
    handleSpotifyLogin
  } = useBillboardChart(selectedDate);

  const handleDateChange = (date) => {
    setSelectedDate(date || null); // Ensure null when date is empty string
  };

  return (
    <div>
      <DateSelectorContainer
        onDateChange={handleDateChange}
        disabled={loading}
      />
      
      <BillboardChartDisplay 
        weekInfo={weekInfo}
        chartData={chartData}
        loading={loading}
        error={error}
        playbackError={playbackError}
        showLoginPrompt={showLoginPrompt}
        onLoginPromptClose={() => setShowLoginPrompt(false)}
        onSpotifyLogin={handleSpotifyLogin}
        onPlayTrack={handlePlay}
      />

      <SpotifyPlaybackTest />
    </div>
  );
} 