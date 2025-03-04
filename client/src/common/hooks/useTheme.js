import { useDarkMode } from '@/contexts/DarkModeContext';
import { useSystemTheme } from '@/contexts/SystemThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export function useTheme() {
  const { isAuthenticated } = useAuth();
  
  try {
    // For authenticated users, try to use DarkModeContext
    if (isAuthenticated) {
      return useDarkMode();
    }
    // For public pages, use SystemThemeContext
    return useSystemTheme();
  } catch (error) {
    // Fallback to SystemThemeContext if DarkModeContext is not available
    return useSystemTheme();
  }
} 