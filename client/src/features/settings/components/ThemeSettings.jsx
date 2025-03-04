import { useSettings } from '@/contexts/SettingsContext';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useState } from 'react';
import { Toast } from '@/common/components/ui/Toast';

export function ThemeSettings() {
  const { settings, updateSettings } = useSettings();
  const { isDarkMode } = useDarkMode();
  const [toast, setToast] = useState(null);

  const handleThemeChange = async (theme) => {
    try {
      await updateSettings({ theme });
      setToast({ message: 'Theme updated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update theme', type: 'error' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Theme Preferences</h2>
      
      <div className="space-y-4">
        {['system', 'light', 'dark'].map((theme) => (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className={`
              w-full px-4 py-2 rounded-lg text-left
              ${settings?.theme === theme 
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <div className="font-medium">
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {theme === 'system' 
                    ? 'Follow system preferences'
                    : `Always use ${theme} mode`}
                </div>
              </div>
              {settings?.theme === theme && (
                <span className="text-blue-600 dark:text-blue-400">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 