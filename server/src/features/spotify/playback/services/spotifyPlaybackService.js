import { SpotifyPlaybackApi } from '../api/spotifyPlaybackApi.js';
import { SpotifyAuthRepository } from '../../auth/repositories/spotifyAuthRepository.js';
import { AppError } from '../../../../utils/AppError.js';

export const SpotifyPlaybackService = {
  
  async searchTrack(song, artist, userId) {
    try {
      const tokens = await SpotifyAuthRepository.getUserTokens(userId);
      if (!tokens?.spotifyAccessToken) {
        throw new AppError('Not connected to Spotify', 401);
      }

      // Search for artists
      console.log("searching for artist:", artist);
      const artistResponse = await SpotifyPlaybackApi.searchArtists(tokens.spotifyAccessToken, artist);
      
      // Sort artists by popularity
      const artists = artistResponse.data.artists.items
        .sort((a, b) => b.popularity - a.popularity);
      
      console.log("top 10 artists:", artists.map(a => `${a.name} (popularity: ${a.popularity})`));

      // Check each artist's top tracks
      for (const artist of artists) {
        console.log(`checking top tracks for ${artist.name}`);
        const topTracksResponse = await SpotifyPlaybackApi.getArtistTopTracks(
          tokens.spotifyAccessToken, 
          artist.id
        );

        const topTracks = topTracksResponse.data.tracks;
        console.log(`${artist.name}'s top tracks:`, topTracks.map(track => track.name));

        const exactMatch = topTracks.find(
          track => track.name.toLowerCase() === song.toLowerCase()
        );

        if (exactMatch) {
          console.log(`found exact match in ${artist.name}'s top tracks:`, exactMatch.name);
          return exactMatch;
        }
      }

      // Try both search strategies
      console.log("no match in top tracks, trying track searches");

      // Strategy 1: Track name only
      const trackOnlyResponse = await SpotifyPlaybackApi.searchTracks(
        tokens.spotifyAccessToken,
        song
      );

      // Strategy 2: Track name with artist
      const trackArtistResponse = await SpotifyPlaybackApi.searchTracks(
        tokens.spotifyAccessToken,
        `track:"${song}" artist:"${artist}"`
      );

      console.log("artist track:", trackArtistResponse.data.tracks.items.map(item => 
        `${item.name} - ${item.artists[0].name}`
      ));

      // Combine and deduplicate results
      const allTracks = [
        ...trackOnlyResponse.data.tracks.items,
        ...trackArtistResponse.data.tracks.items
      ];
      
      const uniqueTracks = [...new Map(allTracks.map(track => [track.uri, track])).values()];

      if (!uniqueTracks.length) {
        throw new AppError('Track not found on Spotify', 404);
      }

      const scoredTracks = uniqueTracks
        .map(track => ({
          track,
          score: calculateSimpleScore(song, artist, track.name, track.artists[0].name)
        }))
        .sort((a, b) => b.score - a.score);

      console.log("Top 3 matches:");
      scoredTracks.slice(0, 3).forEach(({ track, score }) => {
        console.log(`Score ${score}: ${track.name} - ${track.artists[0].name}`);
      });

      return scoredTracks[0].track;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.response?.status === 401) {
        throw new AppError('Spotify authorization expired', 401);
      }
      throw new AppError('Failed to search Spotify', 500);
    }
  },

  async playTrack(trackUri, userId) {
    try {
      const tokens = await SpotifyAuthRepository.getUserTokens(userId);
      if (!tokens?.spotifyAccessToken) {
        throw new AppError('Not connected to Spotify', 401);
      }

      await SpotifyPlaybackApi.playTrack(tokens.spotifyAccessToken, trackUri);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new AppError('Spotify authorization expired', 401);
      }
      if (error.response?.status === 404) {
        throw new AppError('No active Spotify device found', 404);
      }
      throw new AppError('Failed to play track', 500);
    }
  }
};

function calculateSimpleScore(searchSong, searchArtist, trackName, artistName) {
  const song1 = searchSong.toLowerCase();
  const song2 = trackName.toLowerCase();
  const artist1 = searchArtist.toLowerCase();
  const artist2 = artistName.toLowerCase();

  let score = 0;
  
  // Exact matches get highest score
  if (song1 === song2) score += 100;
  if (artist1 === artist2) score += 100;
  
  // Partial matches
  if (song2.includes(song1)) score += 50;
  if (artist2.includes(artist1)) score += 50;
  
  return score;
} 