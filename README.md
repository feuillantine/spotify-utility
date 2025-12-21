# Spotify Utility

SpotifyのWebAPIを扱う際によく使う操作をTypeScriptでまとめた個人向けユーティリティパッケージです。  
`@spotify/web-api-ts-sdk`をラップし、プレイリスト操作や検索、アクセストークン更新といった共通処理を再利用しやすくします。

## インストール
```sh
npm install feuillantine/spotify-utility
```

## 利用例
```ts
import { createSpotifyUtility } from 'spotify-utility';

const spotify = await createSpotifyUtility({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
});

await spotify.playlists.addTracks(
  playlistId: 'プレイリストID',
  new Set([
    'spotify:track:...1',
    'spotify:track:...2',
  ]),
);

const tracks = await spotify.playlists.listTracks('プレイリストID');
const track = await spotify.tracks.searchByIsrc('JP1234567890');
const myFavorites = await spotify.tracks.listMyFavoriteUris();
```

## 開発
このパッケージ自体を開発・ビルドする場合：

```sh
npm install
npm run build
```

- `npm run typecheck` – TypeScriptの型検査
- `npm run lint` – Biomeによるlint / formatチェック
- `npm run lint:fix` – Biomeによるlint / format自動修正
- `npm run build` – tsupによるESM/CJSビルドと型定義の生成
- `npm run dev` – watchモードでのビルド
