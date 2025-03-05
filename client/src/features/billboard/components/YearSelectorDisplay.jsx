export function YearSelectorDisplay({ selectedYear, onYearChange, disabled }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1957 }, (_, i) => 1958 + i);

  return (
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
  );
} 