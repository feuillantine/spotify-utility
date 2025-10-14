import type SpotifyWebApi from 'spotify-web-api-node';
import { searchTrack } from './search';
import { getUserFavoriteTrackUris } from './tracks';
import type { SearchTrackResult } from './types';

export class SpotifyTrackService {
  constructor(private readonly client: SpotifyWebApi) {}

  async search(query: string): Promise<SearchTrackResult | null> {
    return searchTrack(this.client, query);
  }

  async searchByIsrc(isrc: string): Promise<SearchTrackResult | null> {
    return searchTrack(this.client, `isrc:${isrc}`);
  }

  async searchByTitleAndArtist(title: string, artist: string): Promise<SearchTrackResult | null> {
    return searchTrack(this.client, `track:${title} artist:${artist}`);
  }

  async listMyFavoriteUris(): Promise<Set<string>> {
    return getUserFavoriteTrackUris(this.client);
  }
}
