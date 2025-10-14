import type SpotifyWebApi from 'spotify-web-api-node';
import { withRetry } from '@/utils/retry';

/**
 * refresh tokenを用いたアクセストークン更新を行う
 */
export const refreshAccessToken = async (client: SpotifyWebApi): Promise<void> => {
  const response = await withRetry(() => client.refreshAccessToken());
  const token = response.body.access_token;
  if (!token) {
    throw new Error('Spotifyからアクセストークンが返却されませんでした');
  }

  try {
    client.setAccessToken(token);
  } catch (_error) {
    throw new Error('アクセストークンの更新に失敗しました');
  }
};
