export function DateSelectorDisplay({ 
  selectedYear,
  onYearChange,
  selectedDate,
  onDateChange,
  availableWeeks,
  disabled
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1957 }, (_, i) => 1958 + i);

  return (
    <div className="flex justify-center items-center gap-3 mb-8 relative">
      <div className="relative">
        <select
          value={selectedYear || ''}
          onChange={(e) => onYearChange(Number(e.target.value))}
          disabled={disabled}
          className="h-12 w-32 px-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 appearance-none cursor-pointer"
        >
          <option value="">Year</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className="relative">
        <select
          value={selectedDate || ''}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={!selectedYear || disabled}
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
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
} 