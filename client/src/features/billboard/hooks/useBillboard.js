import { useState, useEffect } from 'react';

// Mock data for development
const MOCK_DATA = {
  weekInfo: "Billboard Week 8 (1960-02-29)",
  data: [
    {
      song: "Teen Angel",
      artist: "Mark Dinning",
      this_week: 1,
      last_week: 2,
      peak_position: 1,
      weeks_on_chart: 8
    },
    {
      song: "Handy Man",
      artist: "Jimmy Jones",
      this_week: 2,
      last_week: 3,
      peak_position: 2,
      weeks_on_chart: 6
    },
    // Add more mock entries as needed
  ]
};

export function useBillboard() {
  const [selectedYear, setSelectedYear] = useState('');
  const [weekInfo, setWeekInfo] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (selectedYear) {
      // This will be replaced with actual API call later
      setWeekInfo(MOCK_DATA.weekInfo);
      setChartData(MOCK_DATA.data);
    }
  }, [selectedYear]);

  return {
    selectedYear,
    setSelectedYear,
    weekInfo,
    chartData
  };
} 