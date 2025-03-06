import { SpotifyMatchRepository } from '../repositories/spotifyMatchRepository.js';

export const SpotifyMatchService = {
  async saveSpotifyMatch({ billboardArtistName, billboardTrackName, spotifyArtistData, spotifyTrackData }) {
    try {
      // Find the artist in our database
      const artist = await SpotifyMatchRepository.findArtistByBillboardName(billboardArtistName);
      if (!artist) {
        console.log(`Artist not found in database: ${billboardArtistName}`);
        return;
      }

      // Update artist's Spotify data if not already set
      if (!artist.spotifyId && spotifyArtistData) {
        await SpotifyMatchRepository.updateArtistSpotifyData(artist.id, spotifyArtistData);
        console.log(`Updated Spotify data for artist: ${billboardArtistName}`);
      }

      // Find the track in our database
      const track = await SpotifyMatchRepository.findTrackByBillboardNameAndArtist(
        billboardTrackName,
        artist.id
      );
      if (!track) {
        console.log(`Track not found in database: ${billboardTrackName}`);
        return;
      }

      // Update track's Spotify data if not already set
      if (!track.spotifyId && spotifyTrackData) {
        await SpotifyMatchRepository.updateTrackSpotifyData(track.id, spotifyTrackData);
        console.log(`Updated Spotify data for track: ${billboardTrackName}`);
      }
    } catch (error) {
      console.error('Error saving Spotify match:', error);
      // Don't throw - we don't want to interrupt the playback flow
    }
  }
}; 