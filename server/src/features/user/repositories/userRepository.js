import prisma from '../../../db/client.js'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const userRepository = {
  getUserByEmail: async (email) => {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  createUser: async ({ email, password }) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: false
      },
      select: {
        id: true,
        email: true
      }
    })
  },

  getUserById: async (id) => {
    return prisma.user.findUnique({
      where: { id }
    })
  },

  updateUserPassword: async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true
      }
    })
  },

  markEmailAsVerified: async (userId) => {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
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
  }
} 