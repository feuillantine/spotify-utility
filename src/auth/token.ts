import type { AccessToken } from '@spotify/web-api-ts-sdk';
import type { SpotifyCredentials } from '@/spotify-utility';

/**
 * リフレッシュトークンを使用して新しいアクセストークンを取得する
 */
export const fetchRefreshedToken = async (
  credentials: SpotifyCredentials,
): Promise<AccessToken> => {
  const url = 'https://accounts.spotify.com/api/token';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${credentials.clientId}:${credentials.clientSecret}`,
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: credentials.refreshToken,
    }),
  });

  const data = (await response.json()) as {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(`Failed to refresh Spotify token: ${response.statusText}`);
  }

  return {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token,
  };
};
