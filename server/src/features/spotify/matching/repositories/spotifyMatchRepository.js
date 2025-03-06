import prisma from '../../../../db/client.js';

export const SpotifyMatchRepository = {
  async updateArtistSpotifyData(artistId, spotifyData) {
    return await prisma.artist.update({
      where: { id: artistId },
      data: {
        spotifyId: spotifyData.id,
        spotifyName: spotifyData.name
      }
    });
  },

  async updateTrackSpotifyData(trackId, spotifyData) {
    return await prisma.track.update({
      where: { id: trackId },
      data: {
        spotifyId: spotifyData.uri.split(':')[2], // Extract ID from URI
        spotifyName: spotifyData.name
      }
    });
  },

  async findArtistByBillboardName(billboardName) {
    return await prisma.artist.findUnique({
      where: { billboardName }
    });
  },

  async findTrackByBillboardNameAndArtist(billboardName, artistId) {
    return await prisma.track.findUnique({
      where: {
        billboardName_artistId: {
          billboardName,
          artistId
        }
      }
    });
  }
}; 