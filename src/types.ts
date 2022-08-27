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
  contentSnippet?: string;
  url: string,
  updateDate?: string // アップデート日(日本時間)を入れてください。nullの場合はこのサイトのビルド日の扱いになります。 yyyyMMdd 例 : 2022年5月14日15時3分→"20220514"
}
export type PostItem = {
  authorId: string;
  authorName: string;
  title: string;
  link: string;
  contentSnippet?: string;
  isoDate?: string;
  dateMiliSeconds: number;
};
