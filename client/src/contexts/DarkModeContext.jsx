import { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './SettingsContext';

const DarkModeContext = createContext(null);

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const updateTheme = (theme) => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
        document.documentElement.classList.toggle('dark', systemPrefersDark);
      } else {
        const shouldBeDark = theme === 'dark';
        setIsDarkMode(shouldBeDark);
        document.documentElement.classList.toggle('dark', shouldBeDark);
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (settings?.theme === 'system') {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };

    // Initialize theme based on settings
    if (settings?.theme) {
      updateTheme(settings.theme);
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [settings?.theme]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}; 