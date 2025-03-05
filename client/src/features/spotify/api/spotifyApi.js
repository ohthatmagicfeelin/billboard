import axios from 'axios';

class SpotifyApi {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.spotify.com/v1'
    });
  }

  setAccessToken(token) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async searchTrack(query) {
    try {
      const response = await this.api.get('/search', {
        params: {
          q: query,
          type: 'track',
          limit: 10
        }
      });
      return response.data.tracks.items;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  async playTrack(trackUri) {
    try {
      await this.api.put('/me/player/play', {
        uris: [trackUri]
      });
    } catch (error) {
      console.error('Playback failed:', error);
      throw error;
    }
  }
}

export const spotifyApi = new SpotifyApi(); 