import type SpotifyWebApi from 'spotify-web-api-node';
import { withRetry } from '@/utils/retry';
import type { SearchTrackResult } from './types';

/**
 * 任意の検索クエリから最初のトラックを取得する
 */
export const searchTrack = async (
  client: SpotifyWebApi,
  query: string,
): Promise<SearchTrackResult | null> => {
  const response = await withRetry(() =>
    client.searchTracks(query, {
      market: 'JP',
      limit: 1,
    }),
  );

  const track = response.body.tracks?.items?.[0];
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
