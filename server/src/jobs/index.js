import { cleanupExpiredTokens } from './cleanupTokens.js';
import { startSessionCleanup } from './cleanupSessions.js';

export const startJobs = () => {
    // Start all cleanup jobs
    startSessionCleanup();
    setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
}; 