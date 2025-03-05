export function BillboardDisplay({ weekInfo, chartData, loading, error }) {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Loading chart data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!chartData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {weekInfo}
      </h1>
      
      <div className="space-y-4">
        {chartData.map((entry, index) => (
          <div 
            key={index}
            className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="w-12 text-2xl font-bold text-gray-500 dark:text-gray-400">
              {entry.this_week}
            </div>
            
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {entry.song}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {entry.artist}
              </p>
            </div>
            
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              {entry.last_week && (
                <div>
                  Last Week: #{entry.last_week}
                  <span className="ml-1">
                    {entry.last_week < entry.this_week ? '↓' : 
                     entry.last_week > entry.this_week ? '↑' : '→'}
                  </span>
                </div>
              )}
              <div>Peak: #{entry.peak_position}</div>
              <div>Weeks: {entry.weeks_on_chart}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 