import axios from 'axios';
import config from '@/config/env';

const FEEDBACK_API = `${config.BACKEND_URL}/api/feedback`;

export const feedbackApi = {
  create: async (feedbackData, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const response = await axios.post(FEEDBACK_API, feedbackData, { headers });
    return response.data;
  }
}; 