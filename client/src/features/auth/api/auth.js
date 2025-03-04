// src/api/auth.js
import axios from 'axios';
import config from '@/config/env';

export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${config.BACKEND_URL}/api/signup`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw error;
    }
    throw new Error('An error occurred during signup. Please try again later.');
  }
};