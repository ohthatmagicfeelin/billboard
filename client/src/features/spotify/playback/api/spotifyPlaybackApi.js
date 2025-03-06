import api from '@/api/api';


export const spotifyApi = {
  async searchAndPlay(song, artist) {
    try {
      const track = await api.get('/api/spotify/playback/search', {
        params: { song, artist }
      });

      await api.put('/api/spotify/playback/play', {
        uri: track.data.uri
      });

      return track.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Please connect your Spotify account');
      }
      if (error.response?.status === 404) {
        if (error.response.data.message.includes('Track not found')) {
          throw new Error(`"${song}" by ${artist} was not found on Spotify`);
        }
        if (error.response.data.message.includes('No active')) {
          throw new Error('Please open Spotify on any device first');
        }
      }
      throw new Error('Failed to play track');
    } 
  }
};
