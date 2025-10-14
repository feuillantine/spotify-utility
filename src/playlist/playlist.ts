import type SpotifyWebApi from 'spotify-web-api-node';
import { withRetry } from '@/utils/retry';
import { sleep } from '@/utils/sleep';

const PLAYLIST_LIST_LIMIT = 50;
const INTERVAL_MS = 150;

/**
 * 自身がフォローしているプレイリストのURIを全件取得する
 */
export const getMyFollowedUris = async (client: SpotifyWebApi): Promise<Set<string>> => {
  const me = await withRetry(() => client.getMe());
  const currentUserId = me.body.id ?? undefined;

  const uris: string[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await withRetry(() =>
      client.getUserPlaylists({
        limit: PLAYLIST_LIST_LIMIT,
        offset,
      }),
    );

    uris.push(
      ...(response.body.items ?? [])
        .filter((item) => item.owner.id !== currentUserId)
        .map((item) => item.uri),
    );

    total = response.body.total ?? 0;
    offset += PLAYLIST_LIST_LIMIT;

    await sleep(INTERVAL_MS);
  }

  return new Set<string>(uris);
};
