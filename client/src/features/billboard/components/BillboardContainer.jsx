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
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <YearSelectorDisplay 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          disabled={loading}
        />
        <WeekSelectorDisplay 
          selectedDate={selectedDate}
          availableWeeks={availableWeeks}
          onWeekChange={setSelectedDate}
          disabled={!selectedYear || loading}
        />
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