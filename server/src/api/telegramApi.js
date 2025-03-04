import axios from 'axios';
import config from '../config/env.js';

export const TelegramApi = {
  sendMessage: async (message) => {
    try {
      const url = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: config.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      });

      if (!response.data.ok) {
        throw new Error(`Telegram API error: ${response.data.description}`);
      }
    } catch (error) {
      console.error('Telegram notification failed:', {
        error: error.message,
        response: error.response?.data,
        botToken: config.TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing',
        chatId: config.TELEGRAM_CHAT_ID ? 'Present' : 'Missing'
      });
    }
  }
}; 
