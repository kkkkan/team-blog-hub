export const config = {
  siteMeta: {
    title: "テックブログまとめ(工事中)",
    teamName: "個人サイト Inc.",
    description: "@catnose99 様の team-blog-hub (https://github.com/catnose99/team-blog-hub)をお借りして練習作成中のサイトです。"
      + "まだ多くのところが元のteam-blog-hubのままです。",
  },
  siteRoot:
    process.env.NODE_ENV === "production"
      ? "https://kkkkan-homepage-use-teamshub.web.app/"
      : "http://localhost:3000",
  headerLinks: [
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Company",
      href: "/about",
    },
    {
      title: "GitHub",
      href: "https://github.com/kkkkan",
    },
  ],
};
