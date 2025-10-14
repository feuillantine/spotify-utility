import type SpotifyWebApi from 'spotify-web-api-node';
import { getMyFollowedUris } from './playlist';
import { addTracks, getTracks, getTrackUris, removeTracks } from './tracks';
import type { PlaylistTrack } from './types';

export class SpotifyPlaylistService {
  constructor(private readonly client: SpotifyWebApi) {}

  async listMyFollowedUris(): Promise<Set<string>> {
    return getMyFollowedUris(this.client);
  }

  async listTrackUris(playlistId: string): Promise<Set<string>> {
    return getTrackUris(this.client, playlistId);
  }

  async listTracks(playlistId: string): Promise<PlaylistTrack[]> {
    return getTracks(this.client, playlistId);
  }

  async addTracks(playlistId: string, uris: Set<string>): Promise<void> {
    await addTracks(this.client, playlistId, uris);
  }

  async removeTracks(playlistId: string, uris: Set<string>): Promise<void> {
    await removeTracks(this.client, playlistId, uris);
  }
}
