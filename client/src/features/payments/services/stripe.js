// src/services/stripe.js
import { loadStripe } from '@stripe/stripe-js';
import config from '@/config/env';

export const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY);