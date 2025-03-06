import { useSpotifyPlayback } from '../../../../contexts/SpotifyPlaybackContext';
import { useSpotify } from '@/contexts/SpotifyContext';

export function SpotifyPlaybackTest() {
  const { deviceId, player } = useSpotifyPlayback();
  const { isConnected } = useSpotify();

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Spotify Playback Status</h3>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Device ID: {deviceId || 'None'}</p>
      <p>Player: {player ? 'Ready' : 'Not Ready'}</p>
    </div>
  );
} 