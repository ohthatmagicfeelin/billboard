import axios from 'axios';
import config from '@/config/env';

const BILLBOARD_API = `${config.BACKEND_URL}/api/billboard`;

export const billboardApi = {
  getHistoricalWeek: async (year, currentDate) => {
    const response = await axios.get(`${BILLBOARD_API}/historical-week`, {
      params: {
        year,
        currentDate
      }
    });
    return response.data;
  }
}; 