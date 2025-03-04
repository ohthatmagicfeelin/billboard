import { sessionService } from '../common/services/sessionService.js';

export const startSessionCleanup = () => {
    const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes

    setInterval(async () => {
        try {
            await sessionService.cleanupExpiredSessions();
        } catch (error) {
            console.error('Scheduled session cleanup failed:', error);
        }
    }, CLEANUP_INTERVAL);
}; 