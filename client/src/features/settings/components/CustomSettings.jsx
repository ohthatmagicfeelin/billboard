import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function CustomSettings({ settings }) {
  const { updateSettings } = useSettings();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddCustomSetting = async (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) {
      setError('Both key and value are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await updateSettings({
        customSettings: {
          ...(settings.customSettings || {}),
          [newKey]: newValue
        }
      });
      setNewKey('');
      setNewValue('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomSetting = async (key) => {
    try {
      setSaving(true);
      setError(null);
      const updatedSettings = { ...settings.customSettings };
      delete updatedSettings[key];
      await updateSettings({ customSettings: updatedSettings });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Custom Settings</h2>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      <form onSubmit={handleAddCustomSetting} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Setting name"
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Setting value"
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add Custom Setting
        </button>
      </form>

      <div className="space-y-4">
        {settings.customSettings && Object.entries(settings.customSettings).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <div>
              <div className="font-medium">{key}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{value}</div>
            </div>
            <button
              onClick={() => handleDeleteCustomSetting(key)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {saving && (
        <div className="text-sm text-gray-500 mt-4">Saving changes...</div>
      )}
    </div>
  );
} 