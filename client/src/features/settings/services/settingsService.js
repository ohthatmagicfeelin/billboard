import axios from 'axios';
import config from '@/config/env';

class SettingsService {
  constructor() {
    this.api = axios.create({
      baseURL: config.BACKEND_URL,
      withCredentials: true
    });
  }

  async getSettings() {
    const response = await this.api.get('/api/settings');
    return response.data;
  }

  async updateSettings(updates) {
    const response = await this.api.patch('/api/settings', updates);
    return response.data;
  }
}

export const settingsService = new SettingsService(); 