import { createContext, useContext, useEffect, useState } from 'react';

const SystemThemeContext = createContext(null);

export function SystemThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    // Initial setup
    document.documentElement.classList.toggle('dark', isDarkMode);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <SystemThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </SystemThemeContext.Provider>
  );
}

export const useSystemTheme = () => {
  const context = useContext(SystemThemeContext);
  if (!context) {
    throw new Error('useSystemTheme must be used within a SystemThemeProvider');
  }
  return context;
}; 