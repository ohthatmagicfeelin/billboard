import { catchAsync } from '../../../utils/catchAsync.js';
import { settingsService } from '../services/settingsService.js';

export const settingsController = {
  getSettings: catchAsync(async (req, res) => {
    const settings = await settingsService.getSettings(req.session.userId);
    res.json(settings);
  }),

  updateSettings: catchAsync(async (req, res) => {
    const settings = await settingsService.updateSettings(req.session.userId, req.body);
    res.json(settings);
  })
}; 