import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { withRetry } from '../utils/retry';
import type { SearchTrackResult } from './types';

/**
 * 任意の検索クエリから最初のトラックを取得する
 */
export const searchTrack = async (
  client: SpotifyApi,
  query: string,
): Promise<SearchTrackResult | null> => {
  const response = await withRetry(() => client.search(query, ['track'], 'JP', 1));

  const track = response.tracks?.items?.[0];
  if (!track) {
    return null;
  }

  return {
    id: track.id,
    name: track.name,
    uri: track.uri,
    externalUrl: track.external_urls?.spotify,
    isrc: track.external_ids?.isrc,
  };
};
