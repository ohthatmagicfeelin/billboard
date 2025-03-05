import { AuthProvider } from '@/contexts/AuthContext';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeWrapper } from '@/layouts/MainLayout/components/ThemeWrapper.jsx';
import { SpotifyProvider } from '@/contexts/SpotifyContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <SettingsProvider>
          <DarkModeProvider>
            <ThemeWrapper>
            {children}
          </ThemeWrapper>
          </DarkModeProvider>
        </SettingsProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
} 