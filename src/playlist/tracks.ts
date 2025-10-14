import type SpotifyWebApi from 'spotify-web-api-node';
import { chunk } from '@/utils/chunk';
import { withRetry } from '@/utils/retry';
import { sleep } from '@/utils/sleep';
import type { PlaylistTrack } from './types';

const PLAYLIST_LIMIT = 100;
const INTERVAL_MS = 150;

/**
 * プレイリスト内のトラックURIを取得する
 */
export const getTrackUris = async (
  client: SpotifyWebApi,
  playlistId: string,
): Promise<Set<string>> => {
  const uris: string[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await withRetry(() =>
      client.getPlaylistTracks(playlistId, {
        limit: PLAYLIST_LIMIT,
        offset,
      }),
    );

    uris.push(
      ...((response.body.items ?? [])
        .map((item) => item.track?.uri ?? null)
        .filter((uri) => uri !== null) as string[]),
    );

    total = response.body.total ?? 0;
    offset += PLAYLIST_LIMIT;

    await sleep(INTERVAL_MS);
  }

  return new Set<string>(uris);
};

/**
 * プレイリストのトラック情報を取得する
 */
export const getTracks = async (
  client: SpotifyWebApi,
  playlistId: string,
): Promise<PlaylistTrack[]> => {
  const tracks: PlaylistTrack[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await withRetry(() =>
      client.getPlaylistTracks(playlistId, {
        limit: PLAYLIST_LIMIT,
        offset,
      }),
    );

    tracks.push(
      ...((response.body.items ?? [])
        .map((item) =>
          item.track
            ? {
                id: item.track.id,
                name: item.track.name,
                uri: item.track.uri,
                addedAt: item.added_at,
              }
            : null,
        )
        .filter((track) => track !== null) as PlaylistTrack[]),
    );

    total = response.body.total ?? 0;
    offset += PLAYLIST_LIMIT;

    await sleep(INTERVAL_MS);
  }

  return tracks;
};

/**
 * 指定したプレイリストに、指定したURIの楽曲を追加する
 */
export const addTracks = async (
  client: SpotifyWebApi,
  playlistId: string,
  uris: Set<string>,
): Promise<void> => {
  const existingUris = await getTrackUris(client, playlistId);
  const pendingUris = uris.difference(existingUris);

  if (pendingUris.size === 0) {
    return;
  }

  const batches = chunk(pendingUris, PLAYLIST_LIMIT);

  for (const batch of batches) {
    if (batch.length === 0) {
      continue;
    }

    await withRetry(async () => {
      await client.addTracksToPlaylist(playlistId, batch);
    });

    await sleep(INTERVAL_MS);
  }
};

/**
 * 指定したプレイリストから、指定したURIの楽曲を削除する
 */
export const removeTracks = async (
  client: SpotifyWebApi,
  playlistId: string,
  uris: Set<string>,
): Promise<void> => {
  const batches = chunk(uris, PLAYLIST_LIMIT);

  for (const batch of batches) {
    if (batch.length === 0) {
      continue;
    }

    await withRetry(async () => {
      await client.removeTracksFromPlaylist(
        playlistId,
        batch.map((uri) => ({ uri })),
      );
    });

    await sleep(INTERVAL_MS);
  }
};
