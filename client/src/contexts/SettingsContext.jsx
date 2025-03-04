import { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsService } from '@/features/settings/services/settingsService';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

const initialState = {
  loading: true,
  error: null,
  settings: null
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'SETTINGS_LOADING':
      return { ...state, loading: true };
    case 'SETTINGS_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        settings: action.payload,
        error: null 
      };
    case 'SETTINGS_ERROR':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchSettings = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SETTINGS_LOADING' });
    try {
      const settings = await settingsService.getSettings();
      dispatch({ type: 'SETTINGS_SUCCESS', payload: settings });
    } catch (error) {
      dispatch({ 
        type: 'SETTINGS_ERROR', 
        payload: error.response?.data?.message || 'Failed to load settings' 
      });
    }
  };

  const updateSettings = async (updates) => {
    try {
      const settings = await settingsService.updateSettings(updates);
      dispatch({ type: 'SETTINGS_SUCCESS', payload: settings });
      return settings;
    } catch (error) {
      dispatch({ 
        type: 'SETTINGS_ERROR', 
        payload: error.response?.data?.message || 'Failed to update settings' 
      });
      throw error;
    }
  };

  // Fetch settings when user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  return (
    <SettingsContext.Provider value={{ 
      ...state, 
      updateSettings, 
      refetchSettings: fetchSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 