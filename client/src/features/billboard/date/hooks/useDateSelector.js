import { useState, useEffect } from 'react';
import { billboardApi } from '../../api/billboardApi';

export function useDateSelector() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set current year when component mounts
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setSelectedYear(currentYear);
  }, []);

  // Fetch available weeks when year changes
  useEffect(() => {
    async function fetchAvailableWeeks() {
      if (!selectedYear) {
        setAvailableWeeks([]);
        setSelectedDate('');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const weeks = await billboardApi.getYearWeeks(selectedYear);
        setAvailableWeeks(weeks);

        // If we have weeks, select the most recent week
        if (weeks.length > 0) {
          setSelectedDate(weeks[0].date);
        } else {
          setSelectedDate('');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch available weeks');
        setAvailableWeeks([]);
        setSelectedDate('');
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