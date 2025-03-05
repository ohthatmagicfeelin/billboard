export function YearSelectorDisplay({ selectedYear, onYearChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1957 }, (_, i) => 1958 + i);

  return (
    <div className="flex justify-center mb-8">
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option value="">Select a Year</option>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
} 