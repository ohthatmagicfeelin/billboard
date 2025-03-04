import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function CustomSettingsManager() {
  const { settings, updateSettings } = useSettings();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newKey.trim()) {
      setError('Setting name is required');
      return;
    }

    try {
      const updatedCustomSettings = {
        ...(settings?.customSettings || {}),
        [newKey]: newValue
      };
      
      await updateSettings({ customSettings: updatedCustomSettings });
      setNewKey('');
      setNewValue('');
    } catch (error) {
      setError('Failed to add custom setting');
    }
  };

  const handleDelete = async (key) => {
    try {
      const updatedCustomSettings = { ...settings.customSettings };
      delete updatedCustomSettings[key];
      await updateSettings({ customSettings: updatedCustomSettings });
    } catch (error) {
      setError('Failed to delete custom setting');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Custom Settings</h2>

      {error && (
        <div className="text-red-600 mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Setting name"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Setting value"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Custom Setting
        </button>
      </form>

      <div className="space-y-4">
        {settings?.customSettings && Object.entries(settings.customSettings).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <div className="font-medium">{key}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{value}</div>
            </div>
            <button
              onClick={() => handleDelete(key)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 