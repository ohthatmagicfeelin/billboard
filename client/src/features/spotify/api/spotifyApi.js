import axios from 'axios';
import api from '@/api/api';

class SpotifyApi {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.spotify.com/v1'
    });
  }

  setAccessToken(token) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async searchTrack(song, artist) {
    try {
      const query = `track:${song} artist:${artist}`;
      const response = await this.api.get('/search', {
        params: {
          q: query,
          type: 'track',
          limit: 1
        }
      });

      const tracks = response.data.tracks.items;
      if (tracks.length === 0) {
        throw new Error('Track not found on Spotify');
      }

      return tracks[0];
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

  async searchAndPlay(song, artist) {
    try {
      const track = await api.get('/api/spotify/search', {
        params: { song, artist }
      });

      await api.put('/api/spotify/play', {
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
}

export const spotifyApi = new SpotifyApi(); 