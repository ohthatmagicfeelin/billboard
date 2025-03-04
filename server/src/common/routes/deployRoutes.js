// server/src/routes/deployRoutes.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        // Add any additional health checks here if needed
        res.status(200).json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;