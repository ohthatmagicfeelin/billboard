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
  })
}; 