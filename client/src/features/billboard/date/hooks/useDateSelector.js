import { useState, useEffect } from 'react';
import { billboardApi } from '../../api/billboardApi';

export function useDateSelector() {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

        // Find the closest week before or equal to today's month/day
        if (weeks.length > 0) {
          const today = new Date();
          const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
          const currentDay = today.getDate();
          
          // Find the last week that's before or equal to current month/day
          const targetWeek = weeks.reduce((closest, week) => {
            const weekDate = new Date(week.date);
            const weekMonth = weekDate.getMonth() + 1;
            const weekDay = weekDate.getDate();
            
            // If this week is still before or equal to our target date
            if (weekMonth < currentMonth || (weekMonth === currentMonth && weekDay <= currentDay)) {
              return week;
            }
            
            return closest;
          }, weeks[0]);
          
          setSelectedDate(targetWeek.date);
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