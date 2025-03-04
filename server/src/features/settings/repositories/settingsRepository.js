import prisma from '../../../db/client.js';

export const settingsRepository = {
  getSettings: async (userId) => {
    return prisma.userSettings.findUnique({
      where: { userId }
    });
  },

  createSettings: async (userId, settings = {}) => {
    return prisma.userSettings.create({
      data: {
        userId,
        ...settings
      }
    });
  },

  updateExplicitSettings: async (userId, settings) => {
    return prisma.userSettings.update({
      where: { userId },
      data: {
        ...settings
      }
    });
  },

  updateCustomSetting: async (userId, key, value) => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    const customSettings = settings?.customSettings || {};
    customSettings[key] = value;

    return prisma.userSettings.update({
      where: { userId },
      data: {
        customSettings
      }
    });
  },

  deleteCustomSetting: async (userId, key) => {
    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    const customSettings = settings?.customSettings || {};
    delete customSettings[key];

    return prisma.userSettings.update({
      where: { userId },
      data: {
        customSettings
      }
    });
  }
}; 