// server/src/services/paymentService.js
import { paymentRepository } from '../repositories/paymentRepository.js'
import Stripe from 'stripe'
import bcrypt from 'bcrypt'
import config from '../../../config/env.js'
import { AppError } from '../../../utils/AppError.js'

const stripe = new Stripe(config.STRIPE_SECRET_KEY)
const SALT_ROUNDS = 10

export const paymentService = {
  createStripeCustomer: async (email, userId) => {
    try {
      const customer = await stripe.customers.create({
        email
      })

      await paymentRepository.updateStripeCustomerId(userId, customer.id)
      return customer.id
    } catch (error) {
      throw new AppError('Failed to create Stripe customer', 500)
    }
  },

  createUser: async ({ email, password }) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    
    // Use a transaction to ensure both operations succeed or fail together
    const user = await prisma.$transaction(async (prisma) => {
      const newUser = await paymentRepository.createUser(email, hashedPassword)
      const stripeCustomerId = await this.createStripeCustomer(email, newUser.id)
      return { ...newUser, stripeCustomerId }
    })

    return { userId: user.id }
  },

  createPaymentIntent: async ({ amount, userId }) => {
    let stripeCustomerId = await paymentRepository.getStripeCustomerId(userId)

    // If user doesn't have a stripe_customer_id, create one
    if (!stripeCustomerId) {
      const userEmail = await paymentRepository.getUserEmail(userId)
      if (!userEmail) {
        throw new AppError('User not found', 404)
      }
      stripeCustomerId = await this.createStripeCustomer(userEmail, userId)
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: stripeCustomerId,
        payment_method_types: ['card']
      })

      return { clientSecret: paymentIntent.client_secret }
    } catch (error) {
      throw new AppError('Failed to create payment intent', 500)
    }
  },

  createSubscription: async ({ userId, priceId }) => {
    let stripeCustomerId = await paymentRepository.getStripeCustomerId(userId)

    if (!stripeCustomerId) {
      const userEmail = await paymentRepository.getUserEmail(userId)
      if (!userEmail) {
        throw new AppError('User not found', 404)
      }
      stripeCustomerId = await this.createStripeCustomer(userEmail, userId)
    }

    try {
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      })

      await paymentRepository.createSubscription({
        userId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      })

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      }
    } catch (error) {
      throw new AppError('Failed to create subscription', 500)
    }
  },

  updateSubscriptionStatus: async (stripeSubscriptionId, status) => {
    return paymentRepository.updateSubscription(stripeSubscriptionId, {
      status
    })
  },

  getActiveSubscription: async (userId) => {
    return paymentRepository.getActiveSubscription(userId)
  }
}
	