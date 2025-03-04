import { settingsRepository } from '../repositories/settingsRepository.js';
import { AppError } from '../../../utils/AppError.js';

const VALID_THEMES = ['system', 'light', 'dark'];

export const settingsService = {
  initializeSettings: async (userId) => {
    const existingSettings = await settingsRepository.getSettings(userId);
    if (!existingSettings) {
      return settingsRepository.createSettings(userId);
    }
    return existingSettings;
  },

  getSettings: async (userId) => {
    const settings = await settingsRepository.getSettings(userId);
    if (!settings) {
      return settingsService.initializeSettings(userId);
    }
    return settings;
  },

  updateSettings: async (userId, updates) => {
    const { theme, emailNotifications, pushNotifications, ...customSettings } = updates;

    // Validate explicit settings
    if (theme && !VALID_THEMES.includes(theme)) {
      throw new AppError('Invalid theme value', 400);
    }

    // Update explicit settings if provided
    const explicitUpdates = {};
    if (theme) explicitUpdates.theme = theme;
    if (typeof emailNotifications === 'boolean') explicitUpdates.emailNotifications = emailNotifications;
    if (typeof pushNotifications === 'boolean') explicitUpdates.pushNotifications = pushNotifications;

    if (Object.keys(explicitUpdates).length > 0) {
      await settingsRepository.updateExplicitSettings(userId, explicitUpdates);
    }

    // Update custom settings if provided
    for (const [key, value] of Object.entries(customSettings)) {
      await settingsRepository.updateCustomSetting(userId, key, value);
    }

    return settingsRepository.getSettings(userId);
  }
}; 