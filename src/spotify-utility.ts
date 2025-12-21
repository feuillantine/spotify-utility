import { type SdkOptions, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { fetchRefreshedAccessToken } from './auth/token';
import { SpotifyPlaylistService } from './playlist/service';
import { SpotifyTrackService } from './tracks/service';

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

/**
 * Spotify API を操作するためのユーティリティクラス
 */
class SpotifyUtility {
  readonly playlists: SpotifyPlaylistService;
  readonly tracks: SpotifyTrackService;

  constructor(private readonly client: SpotifyApi) {
    this.playlists = new SpotifyPlaylistService(client);
    this.tracks = new SpotifyTrackService(client);
  }

  get rawClient(): SpotifyApi {
    return this.client;
  }
}

/**
 * SpotifyUtility インスタンスを生成する
 */
export const createSpotifyUtility = async (
  credentials: SpotifyCredentials,
  sdkOptions?: SdkOptions,
): Promise<SpotifyUtility> => {
  const token = await fetchRefreshedAccessToken(
    credentials.clientId,
    credentials.clientSecret,
    credentials.refreshToken,
  );
  const client = SpotifyApi.withAccessToken(credentials.clientId, token, sdkOptions);
  return new SpotifyUtility(client);
};
