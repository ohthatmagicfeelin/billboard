import { AuthProvider } from '@/contexts/AuthContext';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeWrapper } from '@/layouts/MainLayout/components/ThemeWrapper.jsx';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <DarkModeProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </DarkModeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
} 