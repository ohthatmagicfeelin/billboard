export function WeekSelectorDisplay({ selectedDate, availableWeeks, onWeekChange, disabled }) {
  return (
    <select
      value={selectedDate || ''}
      onChange={(e) => onWeekChange(e.target.value)}
      disabled={disabled}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
    >
      <option value="">Select a Week</option>
      {availableWeeks.map(week => (
        <option key={week.date} value={week.date}>
          {new Date(week.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </option>
      ))}
    </select>
  );
} 