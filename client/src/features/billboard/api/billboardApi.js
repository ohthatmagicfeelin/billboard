import api from '@/api/api';

export const billboardApi = {
  getHistoricalWeek: async (year, currentDate) => {
    const response = await api.get('/api/billboard/historical-week', {
      params: {
        year,
        currentDate
      }
    });
    return response.data;
  }
}; 