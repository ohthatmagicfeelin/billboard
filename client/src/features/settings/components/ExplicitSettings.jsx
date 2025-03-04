import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function ExplicitSettings({ settings }) {
  const { updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleThemeChange = async (theme) => {
    try {
      setSaving(true);
      setError(null);
      await updateSettings({ theme });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = async (type, value) => {
    try {
      setSaving(true);
      setError(null);
      await updateSettings({ [type]: value });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
      
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="flex space-x-4">
            {['system', 'light', 'dark'].map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`px-4 py-2 rounded ${
                  settings.theme === theme
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <label className="block text-sm font-medium mb-2">Notifications</label>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleNotificationToggle('emailNotifications', e.target.checked)}
                className="mr-2"
              />
              <span>Email Notifications</span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleNotificationToggle('pushNotifications', e.target.checked)}
                className="mr-2"
              />
              <span>Push Notifications</span>
            </div>
          </div>
        </div>
      </div>

      {saving && (
        <div className="text-sm text-gray-500 mt-4">Saving changes...</div>
      )}
    </div>
  );
} 