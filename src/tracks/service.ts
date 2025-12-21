import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { searchTrack } from './search';
import { getUserFavoriteTrackUris } from './tracks';
import type { SearchTrackResult } from './types';

export class SpotifyTrackService {
  constructor(private readonly client: SpotifyApi) {}

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
