import { AppError } from '../../../utils/AppError.js';
import { BillboardRepository } from '../repositories/billboardRepository.js';

export const BillboardService = {
  getHistoricalWeek: async (year, currentDate) => {
    try {
      // First get the historical week date
      const historicalDate = await BillboardRepository.findHistoricalWeekDate(year, currentDate);
      
      if (!historicalDate) {
        throw new AppError('No Billboard chart found for this date', 404);
      }

      // Then get the chart data for that date
      const chartData = await BillboardRepository.findChartByDate(historicalDate);
      
      if (!chartData) {
        throw new AppError('Chart data not found', 404);
      }

      return {
        weekInfo: `Billboard Week ${chartData.weekNumber} (${historicalDate})`,
        data: chartData.entries
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching Billboard chart data', 500);
    }
  }
}; 