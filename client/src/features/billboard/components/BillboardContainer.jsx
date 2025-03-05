import { YearSelectorDisplay } from './YearSelectorDisplay';
import { WeekSelectorDisplay } from './WeekSelectorDisplay';
import { BillboardDisplay } from './BillboardDisplay';
import { useBillboard } from '../hooks/useBillboard';

export function BillboardContainer() {
  const {
    selectedYear,
    setSelectedYear,
    selectedDate,
    setSelectedDate,
    availableWeeks,
    weekInfo,
    chartData,
    loading,
    error
  } = useBillboard();

  return (
    <div>
      <div className="flex justify-center items-center gap-3 mb-8 relative">
        <div className="relative">
          <YearSelectorDisplay 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <WeekSelectorDisplay 
            selectedDate={selectedDate}
            availableWeeks={availableWeeks}
            onWeekChange={setSelectedDate}
            disabled={!selectedYear || loading}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <BillboardDisplay 
        weekInfo={weekInfo}
        chartData={chartData}
        loading={loading}
        error={error}
      />
    </div>
  );
} 