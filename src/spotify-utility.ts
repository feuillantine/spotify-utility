import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyAuthService } from './auth/service';
import { SpotifyPlaylistService } from './playlist/service';
import { SpotifyTrackService } from './tracks/service';

export type SpotifyUtilityOptions = ConstructorParameters<typeof SpotifyWebApi>[0];

/**
 * Spotify Web API を操作するためのユーティリティクラス
 */
export class SpotifyUtility {
  readonly auth: SpotifyAuthService;
  readonly playlists: SpotifyPlaylistService;
  readonly tracks: SpotifyTrackService;

  constructor(private readonly client: SpotifyWebApi) {
    this.auth = new SpotifyAuthService(client);
    this.playlists = new SpotifyPlaylistService(client);
    this.tracks = new SpotifyTrackService(client);
  }

  get rawClient(): SpotifyWebApi {
    return this.client;
  }
}

/**
 * SpotifyUtility インスタンスを生成する
 */
export const createSpotifyUtility = async (
  options: SpotifyUtilityOptions,
  { autoRefresh = true }: { autoRefresh?: boolean } = {},
): Promise<SpotifyUtility> => {
  const client = new SpotifyWebApi(options);
  const utility = new SpotifyUtility(client);

  if (autoRefresh) {
    await utility.auth.refreshAccessToken();
  }

  return utility;
};
