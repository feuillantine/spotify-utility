import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { withRetry } from '@/utils/retry';
import { sleep } from '@/utils/sleep';

const SAVED_TRACK_LIMIT = 50;
const INTERVAL_MS = 150;

/**
 * ユーザーがお気に入り登録している楽曲のURIを取得する
 */
export const getUserFavoriteTrackUris = async (client: SpotifyApi): Promise<Set<string>> => {
  const uris: string[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await withRetry(() =>
      client.currentUser.tracks.savedTracks(SAVED_TRACK_LIMIT, offset),
    );

    uris.push(...(response.items ?? []).map((item) => item.track.uri));

    total = response.total ?? 0;
    offset += SAVED_TRACK_LIMIT;

    await sleep(INTERVAL_MS);
  }

  return new Set<string>(uris);
};
