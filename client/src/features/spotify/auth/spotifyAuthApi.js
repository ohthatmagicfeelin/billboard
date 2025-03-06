import api from '@/api/api';

export const spotifyAuthApi = {
  async checkConnection() {
    const { data } = await api.get('/api/spotify/auth/check-connection');
    return data;
  },

  async getAuthUrl() {
    const { data } = await api.get('/api/spotify/auth/auth-url');
    return data.url;
  },

  async refreshToken() {
    const { data } = await api.post('/api/spotify/auth/refresh-token');
    return data;
  }
}; 