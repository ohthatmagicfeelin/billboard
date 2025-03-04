import prisma from '../../../db/client.js'

export const paymentRepository = {
  createUser: async (email, hashedPassword) => {
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true
      }
    })
  },

  updateStripeCustomerId: async (userId, stripeCustomerId) => {
    return prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId }
    })
  },

  getStripeCustomerId: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    })
    return user?.stripeCustomerId
  },

  getUserEmail: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    })
    return user?.email
  },

  // Subscription related methods
  createSubscription: async ({ userId, stripeSubscriptionId, status, currentPeriodEnd }) => {
    return prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId,
        status,
        currentPeriodEnd
      }
    })
  },

  updateSubscription: async (stripeSubscriptionId, data) => {
    return prisma.subscription.update({
      where: { stripeSubscriptionId },
      data
    })
  },

  getActiveSubscription: async (userId) => {
    return prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active'
      }
    })
  }
} 