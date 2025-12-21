import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { chunk } from '@/utils/chunk';
import { withRetry } from '@/utils/retry';
import { sleep } from '@/utils/sleep';
import type { PlaylistTrack } from './types';

const PLAYLIST_LIMIT = 50;
const INTERVAL_MS = 150;

/**
 * プレイリスト内のトラックURIを取得する
 */
export const getTrackUris = async (
  client: SpotifyApi,
  playlistId: string,
): Promise<Set<string>> => {
  const uris: string[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await withRetry(() =>
      client.playlists.getPlaylistItems(playlistId, 'JP', undefined, PLAYLIST_LIMIT, offset),
    );

    uris.push(
      ...((response.items ?? [])
        .map((item) => item.track?.uri ?? null)
        .filter((uri) => uri !== null) as string[]),
    );

    total = response.total ?? 0;
    offset += PLAYLIST_LIMIT;

    await sleep(INTERVAL_MS);
  }

  return new Set<string>(uris);
};

/**
 * プレイリストのトラック情報を取得する
 */
export const getTracks = async (
  client: SpotifyApi,
  playlistId: string,
): Promise<PlaylistTrack[]> => {
  const tracks: PlaylistTrack[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await withRetry(() =>
      client.playlists.getPlaylistItems(playlistId, 'JP', undefined, PLAYLIST_LIMIT, offset),
    );

    tracks.push(
      ...((response.items ?? [])
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

    total = response.total ?? 0;
    offset += PLAYLIST_LIMIT;

    await sleep(INTERVAL_MS);
  }

  return tracks;
};

/**
 * 指定したプレイリストに、指定したURIの楽曲を追加する
 */
export const addTracks = async (
  client: SpotifyApi,
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
      await client.playlists.addItemsToPlaylist(playlistId, batch);
    });

    await sleep(INTERVAL_MS);
  }
};

/**
 * 指定したプレイリストから、指定したURIの楽曲を削除する
 */
export const removeTracks = async (
  client: SpotifyApi,
  playlistId: string,
  uris: Set<string>,
): Promise<void> => {
  const batches = chunk(uris, PLAYLIST_LIMIT);

  for (const batch of batches) {
    if (batch.length === 0) {
      continue;
    }

    await withRetry(async () => {
      await client.playlists.removeItemsFromPlaylist(playlistId, {
        tracks: batch.map((uri) => ({ uri })),
      });
    });

    await sleep(INTERVAL_MS);
  }
};
