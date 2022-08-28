# Team Blog Hub

@catnose99 さんの[Team Blog Hub](https://zenn.dev/catnose99/articles/cb72a73368a547756862) 利用して作成中のサイトです。


## Demo
https://kkkkan-homepage-use-teamshub.web.app/


![image](https://user-images.githubusercontent.com/22609306/187075885-3771c1e4-e939-4da0-a5ff-aec575028ded.png)


## 変更点
- メンバーのプロフィールやRSSの登録を行うの為の型`Member`に、固定のURLを追加できるフィールドstaticUrls?: StaticUrls[];`を追加しました。RSS非対応のサイトでも手動で追加・差し込めます。
  
 `Member` 定義`と`StaticUrls` 定義 (`src/types.ts`)
 
 ```
 export type Member = {
  id: string;
  name: string;
  avatarSrc: string;
  role?: string;
  bio?: string;
  sources?: string[];
  includeUrlRegex?: string;
  excludeUrlRegex?: string;
  githubUsername?: string;
  twitterUsername?: string;
  websiteUrl?: string;
  staticUrls?: StaticUrls[];
};


 export type StaticUrls = {
  title: string,
  contentSnippet?: string; // 現状表示にはどこにも使われていないっぽいけど一応設定できるようにしておく。
  url: string,
  updateDate?: string // アップデート日(日本時間)を入れてください。nullの場合はこのサイトのビルド日の扱いになります。 yyyyMMdd 例 : 2022年5月14日15時3分→"20220514"
}
```


`members.ts`
```
  {
    id: "kkkkan",
    name: "kkkkan",
    role: "管理人",
    bio:
      "Androidアプリエンジニア",
    avatarSrc: "/avatars/kkkkan.png",
    sources: [
      "https://qiita.com/kkkkan/feed",
    ],
    // includeUrlRegex: "medium.com|zenn.dev",
    twitterUsername: "kkkkan_git",
    githubUsername: "kkkkan",
    websiteUrl: "https://kkkkan-homepage.web.app/",
    staticUrls: [
      {
        title: "yahoo",
        url: "https://www.yahoo.co.jp/",
        updateDate: "20220827"
      },
      {
        title: "github repositories",
        contentSnippet: "あいうえお",
        url: "https://github.com/kkkkan?tab=repositories",

      },
    ]
  },
  ```

## Development
```bash
$ yarn install
$ yarn build
$ yarn dev
```

- サイトの基本設定は`site.config.ts`で行います。
- メンバーのプロフィールやRSSの登録は`members.ts`で行います。
- 配色を変更するには`src/styles/variables.scss`を書き換えます。
- ロゴなどの画像を変更するには`public`内のファイルを置き換えます。

その他、ご自由にコードを書き換えてください。

## Deployment
VercelやNetlifyにデプロイすることを推奨します。`yarn build`を実行することで、RSSからの投稿データの取得とサイトのビルドが行われます。1日に1回などの頻度で自動デプロイするのが良いかもしれません。

## Licence
MIT
