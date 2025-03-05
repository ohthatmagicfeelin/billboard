import { Router } from 'express';
import { BillboardController } from '../controllers/billboardController.js';

const router = Router();

router.get('/historical-week', BillboardController.getHistoricalWeek);

export default router; 