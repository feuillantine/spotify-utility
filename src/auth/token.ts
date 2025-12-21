import type { AccessToken } from '@spotify/web-api-ts-sdk';

/**
 * 認証コードを使用してアクセストークンを取得する
 */
export const fetchAccessToken = async (
  clientId: string,
  clientSecret: string,
  code: string,
): Promise<AccessToken> => {
  const url = 'https://accounts.spotify.com/api/token';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code as string,
    }),
  });

  const data = (await response.json()) as AccessToken;
  if (!response.ok || !data.access_token) {
    throw new Error(`Failed to fetch token: ${response.statusText}`);
  }

  return data;
};

/**
 * リフレッシュトークンを使用して新しいアクセストークンを取得する
 */
export const fetchRefreshedAccessToken = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<AccessToken> => {
  const url = 'https://accounts.spotify.com/api/token';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = (await response.json()) as AccessToken;
  if (!response.ok || !data.access_token) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  return data;
};
