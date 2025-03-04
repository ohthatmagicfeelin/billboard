import prisma from '../../db/client.js';

export const sessionRepository = {
    async getSessionById(sessionId) {
        return prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        emailVerified: true
                    }
                }
            }
        });
    },

    async getUserActiveSessions(userId) {
        return prisma.session.findMany({
            where: {
                userId,
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },

    async deleteSession(sessionId) {
        return prisma.session.delete({
            where: { id: sessionId }
        });
    },

    async deleteUserSessions(userId, exceptSessionId = null) {
        const where = { userId };
        if (exceptSessionId) {
            where.NOT = { id: exceptSessionId };
        }
        return prisma.session.deleteMany({ where });
    },

    async deleteExpiredSessions() {
        const result = await prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
        return result.count;
    },

    async extendSession(sessionId, duration = 24 * 60 * 60 * 1000) {
        const newExpiryDate = new Date(Date.now() + duration);
        return prisma.session.update({
            where: { id: sessionId },
            data: { expiresAt: newExpiryDate }
        });
    },

    async countActiveSessions(userId) {
        return prisma.session.count({
            where: {
                userId,
                expiresAt: {
                    gt: new Date()
                }
            }
        });
    }
}; 