import type SpotifyWebApi from 'spotify-web-api-node';
import { refreshAccessToken } from './token';

export class SpotifyAuthService {
  constructor(private readonly client: SpotifyWebApi) {}

  async refreshAccessToken(): Promise<void> {
    await refreshAccessToken(this.client);
  }
}
