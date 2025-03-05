import { useState, useEffect } from 'react';
import { billboardApi } from '../api/billboardApi';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChartData() {
      if (!selectedYear) return;

      setLoading(true);
      setError(null);

      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const response = await billboardApi.getHistoricalWeek(selectedYear, currentDate);
        
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
  }, [selectedYear]);

  return {
    selectedYear,
    setSelectedYear,
    weekInfo,
    chartData,
    loading,
    error
  };
} 