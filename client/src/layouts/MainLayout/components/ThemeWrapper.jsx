import { useAuth } from '@/contexts/AuthContext';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { SystemThemeProvider } from '@/contexts/SystemThemeContext';

export function ThemeWrapper({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <DarkModeProvider>{children}</DarkModeProvider>;
  }

  return <SystemThemeProvider>{children}</SystemThemeProvider>;
} 