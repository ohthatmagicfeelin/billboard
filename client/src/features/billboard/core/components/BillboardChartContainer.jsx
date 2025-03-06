import { useState } from 'react';
import { DateSelectorContainer } from '../../date/components/DateSelectorContainer';
import { BillboardChartDisplay } from './BillboardChartDisplay';
import { useBillboardChart } from '../hooks/useBillboardChart';

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

  return (
    <div>
      <DateSelectorContainer
        onDateChange={setSelectedDate}
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
    </div>
  );
} 