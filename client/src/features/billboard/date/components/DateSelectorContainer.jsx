import { DateSelectorDisplay } from './DateSelectorDisplay';
import { useDateSelector } from '../hooks/useDateSelector';
import { useEffect } from 'react';

export function DateSelectorContainer({ onDateChange, disabled }) {
  const {
    selectedYear,
    setSelectedYear,
    selectedDate,
    setSelectedDate,
    availableWeeks,
    loading,
  } = useDateSelector();

  // Propagate date changes to parent
  useEffect(() => {
    onDateChange?.(selectedDate);
  }, [selectedDate, onDateChange]);

  return (
    <DateSelectorDisplay
      selectedYear={selectedYear}
      onYearChange={setSelectedYear}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      availableWeeks={availableWeeks}
      disabled={disabled || loading}
    />
  );
} 