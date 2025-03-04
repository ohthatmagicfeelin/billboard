import { sessionRepository } from '../repositories/sessionRepository.js';
import { AppError } from '../../utils/AppError.js';
import { auditService } from './auditService.js';

export const sessionService = {
    async getSessionById(sessionId) {
        const session = await sessionRepository.getSessionById(sessionId);
        if (!session) {
            throw new AppError('Session not found', 404);
        }
        return session;
    },

    async getUserActiveSessions(userId) {
        return sessionRepository.getUserActiveSessions(userId);
    },

    async deleteSession(sessionId) {
        try {
            await sessionRepository.deleteSession(sessionId);
        } catch (error) {
            console.error('Session deletion error:', error);
            throw new AppError('Session deletion failed', 500);
        }
    },

    async invalidateUserSessions(userId, exceptSessionId = null) {
        try {
            const count = await sessionRepository.deleteUserSessions(userId, exceptSessionId);
            return { count };
        } catch (error) {
            console.error('Session invalidation error:', error);
            throw new AppError('Failed to invalidate sessions', 500);
        }
    },

    async cleanupExpiredSessions() {
        try {
            const count = await sessionRepository.deleteExpiredSessions();
            await auditService.log({
                action: 'SESSIONS_CLEANUP',
                entity: 'session',
                entityId: 'system',
                details: {
                    deletedCount: count,
                    timestamp: new Date().toISOString()
                }
            });
            return count;
        } catch (error) {
            console.error('Session cleanup error:', error);
            throw new AppError('Session cleanup failed', 500);
        }
    },

    async extendSession(sessionId, duration) {
        try {
            return await sessionRepository.extendSession(sessionId, duration);
        } catch (error) {
            console.error('Session extension error:', error);
            throw new AppError('Failed to extend session', 500);
        }
    }
}; 