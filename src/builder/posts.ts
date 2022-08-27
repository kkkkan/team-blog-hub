import fs from "fs-extra";
import Parser from "rss-parser";
import { members } from "../../members";
import { PostItem, Member, StaticUrls } from "../types";

type FeedItem = {
  title: string;
  link: string;
  contentSnippet?: string;
  isoDate?: string;
  dateMiliSeconds: number;
};

function isValidUrl(str: string): boolean {
  try {
    const { protocol } = new URL(str);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const parser = new Parser();
let allPostItems: PostItem[] = [];

async function fetchFeedItems(url: string) {
  const feed = await parser.parseURL(url);
  if (!feed?.items?.length) return [];

  // return item which has title and link
  return feed.items
    .map(({ title, contentSnippet, link, isoDate }) => {
      return {
        title,
        contentSnippet: contentSnippet?.replace(/\n/g, ""),
        link,
        isoDate,
        dateMiliSeconds: isoDate ? new Date(isoDate).getTime() : 0,
      };
    })
    .filter(
      ({ title, link }) => title && link && isValidUrl(link)
    ) as FeedItem[];
}

async function getFeedItemsFromSources(sources: undefined | string[]) {
  if (!sources?.length) return [];
  let feedItems: FeedItem[] = [];
  for (const url of sources) {
    const items = await fetchFeedItems(url);
    if (items) feedItems = [...feedItems, ...items];
  }
  return feedItems;
}

function getStaticFeedItem(staticUrls: undefined | StaticUrls[]) {
  if (!staticUrls?.length) return [];
  let feedItems: FeedItem[] = [];
  for (const { title, contentSnippet, url, updateDate } of staticUrls) {
    let isoDate;
    let dateMiliSeconds;
    if (updateDate?.length == 8) {
      const year = updateDate.substring(0, 4);
      const month = updateDate.substring(4, 6);
      const day = updateDate.substring(6, 8);
      const hour = "00";//updateDate.substring(8, 10);
      const min = '00';//updateDate.substring(10, 12);
      const sec = "00";//updateDate.substring(12, 14);

      isoDate = isoDate = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':' + sec + '+09:00';
      dateMiliSeconds = new Date(isoDate).getTime();
    }

    if (!isoDate || !dateMiliSeconds) {
      // アップロード日時が記載されていない時 or パース出来ない無効な形式で日付が設定されていた時は今日にする
      isoDate = new Date().toISOString();
      dateMiliSeconds = new Date(isoDate).getTime();
    }
    const item = {
      title,
      link: url,
      contentSnippet: contentSnippet?.replace(/\n/g, ""),
      isoDate,
      dateMiliSeconds,
    } as FeedItem;
    if (item) feedItems = [...feedItems, item];
  }
  return feedItems;
}

async function getMemberFeedItems(member: Member): Promise<PostItem[]> {
  const { id, sources, name, includeUrlRegex, excludeUrlRegex, staticUrls } = member;
  const feedItems = await getFeedItemsFromSources(sources);
  if (!feedItems) return [];

  let postItems = feedItems.map((item) => {
    return {
      ...item,
      authorName: name,
      authorId: id,
    };
  });
  // remove items which not matches includeUrlRegex
  if (includeUrlRegex) {
    postItems = postItems.filter((item) => {
      return item.link.match(new RegExp(includeUrlRegex));
    });
  }
  // remove items which matches excludeUrlRegex
  if (excludeUrlRegex) {
    postItems = postItems.filter((item) => {
      return !item.link.match(new RegExp(excludeUrlRegex));
    });
  }

  let staticPostItem = getStaticFeedItem(staticUrls).map((item) => {
    return {
      ...item,
      authorName: name,
      authorId: id,
    };
  });

  if (staticPostItem) {
    return [...postItems, ...staticPostItem]
  }
  return postItems;
}

(async function () {
  for (const member of members) {
    const items = await getMemberFeedItems(member);
    if (items) allPostItems = [...allPostItems, ...items];
  }
  allPostItems.sort((a, b) => b.dateMiliSeconds - a.dateMiliSeconds);
  fs.ensureDirSync(".contents");
  fs.writeJsonSync(".contents/posts.json", allPostItems);
})();
