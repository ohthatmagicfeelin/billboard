export function WeekSelectorDisplay({ selectedDate, availableWeeks, onWeekChange, disabled }) {
  return (
    <select
      value={selectedDate || ''}
      onChange={(e) => onWeekChange(e.target.value)}
      disabled={disabled}
      className="h-12 w-48 px-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 appearance-none cursor-pointer"
    >
      <option value="">Select Week</option>
      {availableWeeks.map(week => (
        <option key={week.date} value={week.date}>
          {new Date(week.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </option>
      ))}
    </select>
  );
} 