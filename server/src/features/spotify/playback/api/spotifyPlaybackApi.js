import axios from 'axios';

export const SpotifyPlaybackApi = {
  async searchArtists(accessToken, artist) {
    console.log("Searching for artist:", artist);
    const artistQuery = encodeURIComponent(artist);
    return await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: artistQuery,
        type: 'artist',
        limit: 50,
        market: 'US'
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
  },

  async getArtistAlbums(accessToken, artistId, options) {
    return await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
      params: options,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  },

  async getAlbumTracks(accessToken, albumId) {
    return await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      params: { limit: 50 },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }
};
