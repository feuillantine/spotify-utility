import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { withRetry } from '@/utils/retry';
import { sleep } from '@/utils/sleep';

const PLAYLIST_LIST_LIMIT = 50;
const INTERVAL_MS = 150;

/**
 * 自身がフォローしているプレイリストのURIを全件取得する
 */
export const getMyFollowedUris = async (client: SpotifyApi): Promise<Set<string>> => {
  const me = await withRetry(() => client.currentUser.profile());
  const currentUserId = me.id ?? undefined;

  const uris: string[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await withRetry(() =>
      client.currentUser.playlists.playlists(PLAYLIST_LIST_LIMIT, offset),
    );

    uris.push(
      ...(response.items ?? [])
        .filter((item) => item.owner.id !== currentUserId)
        .map((item) => item.uri),
    );

    total = response.total ?? 0;
    offset += PLAYLIST_LIST_LIMIT;

    await sleep(INTERVAL_MS);
  }

  return new Set<string>(uris);
};
