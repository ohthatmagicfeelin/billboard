import { catchAsync } from '../../../utils/catchAsync.js';
import { AppError } from '../../../utils/AppError.js';
import { BillboardService } from '../services/billboardService.js';

export const BillboardController = {
  getHistoricalWeek: catchAsync(async (req, res) => {
    const { year, currentDate } = req.query;

    if (!year || !currentDate) {
      throw new AppError('Year and current date are required', 400);
    }

    const chartData = await BillboardService.getHistoricalWeek(
      parseInt(year),
      currentDate
    );

    res.json(chartData);
  }),

  getYearWeeks: catchAsync(async (req, res) => {
    const { year } = req.params;

    if (!year) {
      throw new AppError('Year is required', 400);
    }

    const weeks = await BillboardService.getYearWeeks(parseInt(year));
    res.json(weeks);
  })
}; 