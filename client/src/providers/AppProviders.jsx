import { AuthProvider } from '@/contexts/AuthContext';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeWrapper } from '@/layouts/MainLayout/components/ThemeWrapper.jsx';
import { SpotifyProvider } from '@/contexts/SpotifyContext';
import { SpotifyPlaybackProvider } from '@/contexts/SpotifyPlaybackContext';


export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <SpotifyPlaybackProvider>
          <SettingsProvider>
            <DarkModeProvider>
              <ThemeWrapper>
                {children}
              </ThemeWrapper>
            </DarkModeProvider>
          </SettingsProvider>
        </SpotifyPlaybackProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
} 