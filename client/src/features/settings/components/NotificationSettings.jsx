import { useSettings } from '@/contexts/SettingsContext';

export function NotificationSettings() {
  const { settings, updateSettings } = useSettings();

  const handleToggle = async (setting, value) => {
    try {
      await updateSettings({ [setting]: value });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Email Notifications</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Receive updates and notifications via email
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings?.emailNotifications}
              onChange={(e) => handleToggle('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Push Notifications</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Receive real-time push notifications
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings?.pushNotifications}
              onChange={(e) => handleToggle('pushNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
} 