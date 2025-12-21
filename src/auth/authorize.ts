/**
 * 認証用URLを取得する
 */
export const buildAuthorizeUrl = (
  clientId: string,
  redirectUri: string,
  requiredScopes: string[],
) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: requiredScopes.join(' '),
    state: 'state',
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};
