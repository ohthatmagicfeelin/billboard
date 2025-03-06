import axios from 'axios';

export const SpotifyPlaybackApi = {
  async searchArtists(accessToken, artist) {
    const artistQuery = encodeURIComponent(artist);
    return await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: artistQuery,
        type: 'artist',
        limit: 10,
        market: 'AU'
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },

  async getArtistTopTracks(accessToken, artistId) {
    return await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        params: { market: 'AU' },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  },

  async searchTracks(accessToken, query) {
    return await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: encodeURIComponent(query),
        type: 'track',
        limit: 50,
        market: 'AU',
        include_external: 'audio'
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },

  async searchTracksWithPagination(accessToken, query, offset = 0) {
    return await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: encodeURIComponent(query),
        type: 'track',
        limit: 50,
        offset: offset,
        market: 'AU',
        include_external: 'audio'
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },

  async playTrack(accessToken, trackUri) {
    return await axios.put(
      'https://api.spotify.com/v1/me/player/play',
      { uris: [trackUri] },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }
};
