export function BillboardDisplay({ weekInfo, chartData, loading, error }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse flex p-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 ml-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Billboard Hot 100
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {weekInfo}
        </p>
      </div>
      
      <div className="space-y-3">
        {chartData.map((entry, index) => (
          <div 
            key={index}
            className="flex items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 dark:border-gray-700"
          >
            {/* Position Number */}
            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-gray-700 rounded-lg mr-4">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {entry.this_week}
              </span>
            </div>
            
            {/* Song Info */}
            <div className="flex-grow min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {entry.song}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 truncate">
                {entry.artist}
              </p>
            </div>
            
            {/* Stats */}
            <div className="text-right ml-4 flex flex-col items-end space-y-1">
              {entry.last_week && (
                <div className="flex items-center">
                  <div className={`
                    px-2 py-1 rounded text-xs font-bold
                    ${entry.last_week < entry.this_week 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                      : entry.last_week > entry.this_week 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                  `}>
                    {entry.last_week < entry.this_week ? `↓ ${entry.this_week - entry.last_week}` : 
                     entry.last_week > entry.this_week ? `↑ ${entry.last_week - entry.this_week}` : '→'}
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Peak: #{entry.peak_position}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {entry.weeks_on_chart} {entry.weeks_on_chart === 1 ? 'week' : 'weeks'} on chart
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 