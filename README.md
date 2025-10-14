# spotify-utility

SpotifyのWebAPIを扱う際によく使う操作をTypeScriptでまとめた個人向けユーティリティパッケージです。  
`spotify-web-api-node`をラップし、プレイリスト操作や検索、アクセストークン更新といった共通処理を再利用しやすくします。

## セットアップ

```sh
npm ci
```

## 利用例

```ts
import { createSpotifyUtility } from 'spotify-utility';

const spotify = await createSpotifyUtility({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN!,
});

const playlistId = 'プレイリストID';

await spotify.playlists.addTracks(
  playlistId,
  new Set([
    'spotify:track:...1',
    'spotify:track:...2',
  ]),
);

const tracks = await spotify.playlists.listTracks(playlistId);
const track = await spotify.tracks.searchByIsrc('JP1234567890');
const myFavorites = await spotify.tracks.listMyFavoriteUris();
```

※`createSpotifyUtility` はデフォルトで生成時にアクセストークンを自動更新します。

## 開発用コマンド
- `npm run typecheck` – TypeScriptの型検査
- `npm run lint` – Biomeによるlint / formatチェック
- `npm run lint:fix` – Biomeによるlint / format自動修正
- `npm run build` – 型定義付きビルド
