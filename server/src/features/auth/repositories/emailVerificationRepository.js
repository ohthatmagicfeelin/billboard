import prisma from '../../../db/client.js'

export const emailVerificationRepository = {
  createToken: async ({ token, userId, expiresAt }) => {
    return prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    })
  },

  getValidToken: async (token) => {
    return prisma.emailVerificationToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })
  },

  markTokenAsUsed: async (token) => {
    return prisma.emailVerificationToken.update({
      where: { token },
      data: { used: true }
    })
  },

  deleteExpiredTokens: async () => {
    return prisma.emailVerificationToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true }
        ]
      }
    })
  }
} 