import prisma from '../client.js'

export const subscriptionRepository = {
  create: async ({ userId, stripeSubscriptionId, status, currentPeriodEnd }) => {
    return prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId,
        status,
        currentPeriodEnd
      }
    })
  },

  findByUserId: async (userId) => {
    return prisma.subscription.findFirst({
      where: { userId }
    })
  },

  updateStatus: async (stripeSubscriptionId, status) => {
    return prisma.subscription.update({
      where: { stripeSubscriptionId },
      data: { status }
    })
  }
} 