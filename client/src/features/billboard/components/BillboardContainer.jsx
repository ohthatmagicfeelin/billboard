import { YearSelectorDisplay } from './YearSelectorDisplay';
import { BillboardDisplay } from './BillboardDisplay';
import { useBillboard } from '../hooks/useBillboard';

export function BillboardContainer() {
  const {
    selectedYear,
    setSelectedYear,
    weekInfo,
    chartData,
    loading,
    error
  } = useBillboard();

  return (
    <div>
      <YearSelectorDisplay 
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <BillboardDisplay 
        weekInfo={weekInfo}
        chartData={chartData}
        loading={loading}
        error={error}
      />
    </div>
  );
} 