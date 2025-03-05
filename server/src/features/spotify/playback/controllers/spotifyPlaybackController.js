import { catchAsync } from '../../../../utils/catchAsync.js';
import { AppError } from '../../../../utils/AppError.js';
import { SpotifyPlaybackService } from '../services/spotifyPlaybackService.js';


export const SpotifyPlaybackController = {
  search: catchAsync(async (req, res) => {
    const { song, artist } = req.query;
    
    if (!song || !artist) {
      throw new AppError('Song and artist are required', 400);
    }

    const track = await SpotifyPlaybackService.searchTrack(song, artist, req.user.id);
    res.json(track);
  }),

  play: catchAsync(async (req, res) => {
    const { uri } = req.body;
    
    if (!uri) {
      throw new AppError('Track URI is required', 400);
    }

    await SpotifyPlaybackService.playTrack(uri, req.user.id);
    res.json({ success: true });
  })
}; 
