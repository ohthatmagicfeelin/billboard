import { useState, useEffect } from 'react';
import { billboardApi } from '../../api/billboardApi';

export function useDateSelector() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set current date when component mounts
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setSelectedDate(currentDate);
  }, []);

  // Fetch available weeks when year changes
  useEffect(() => {
    async function fetchAvailableWeeks() {
      if (!selectedYear) {
        setAvailableWeeks([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const weeks = await billboardApi.getYearWeeks(selectedYear);
        setAvailableWeeks(weeks);

        // If we have weeks and no date is selected, select the most recent week
        if (weeks.length > 0 && !selectedDate) {
          setSelectedDate(weeks[0].date);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch available weeks');
        setAvailableWeeks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableWeeks();
  }, [selectedYear]);

  return {
    selectedYear,
    setSelectedYear,
    selectedDate,
    setSelectedDate,
    availableWeeks,
    loading,
    error
  };
} 