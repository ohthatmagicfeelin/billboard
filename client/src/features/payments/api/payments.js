// src/api/payments.js
import axios from 'axios';
import config from '@/config/env';

export const createPaymentIntent = async (amount, userId) => {
  const response = await axios.post(`${config.BACKEND_URL}/api/create-payment-intent`, {
    amount,
    userId
  });
  return response.data;
};