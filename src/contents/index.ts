import { getCollection, type CollectionEntry } from "astro:content";
import type { WritingItem } from "./type";
import { blogCollectionRepository, getAllBlogItems } from "./blog";

let allExternalArticles: CollectionEntry<"articles">[] = [];
let allZennPosts: CollectionEntry<"zenn">[] = [];

export async function getAllExternalArticles(): Promise<WritingItem[]> {
  if (allExternalArticles.length === 0) {
    allExternalArticles = await getCollection("articles");
  }
  return allExternalArticles.map((article) => ({
    title: article.data.title,
    publishedDate: article.data.publishedDate,
    tags: article.data.tags || [],
    url: article.data.url,
    media: article.data.media,
  }));
}

export async function getAllZennPosts(): Promise<WritingItem[]> {
  if (allZennPosts.length === 0) {
    allZennPosts = await getCollection("zenn");
  }
  return allZennPosts.map((post) => ({
    title: post.data.title as string,
    publishedDate: (post.data.published as Date).toISOString().split("T")[0],
    tags: [],
    url: post.data.id as string,
    media: "Zenn" as const,
  }));
}

export const getAllItems = async (): Promise<WritingItem[]> => {
  return [
    ...(await getAllBlogItems(blogCollectionRepository)),
    ...(await getAllExternalArticles()),
    ...(await getAllZennPosts()),
  ].sort((a, b) => Date.parse(b.publishedDate) - Date.parse(a.publishedDate));
};

export const getLatestItems = async (): Promise<WritingItem[]> => {
  const allItems = await getAllItems();
  return allItems
    .filter((item) => {
      const publishedDate = new Date(item.publishedDate);
      return (
        publishedDate >= new Date(Date.now() - 365 * 2 * 24 * 60 * 60 * 1000)
      );
    })
    .slice(0, 5);
};

export const getAllTagUsages = async () => {
  const blogItems = await getAllBlogItems(blogCollectionRepository);
  const articleItems = await getAllExternalArticles();
  const tagUsages = [...blogItems, ...articleItems].reduce((acc, item) => {
    if (item.tags) {
      item.tags.map((tag: string) => {
        acc.set(tag, (acc.get(tag) || 0) + 1);
      });
    }
    return acc;
  }, new Map<string, number>());

  return new Map(
    [...tagUsages.entries()].sort(([a], [b]) => a.localeCompare(b)),
  );
};

export const getTopTags = async () => {
  const tagUsage = await getAllTagUsages();
  const sortedTags = Array.from(tagUsage.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) as [string, number][];
  const blogItems = await getAllBlogItems(blogCollectionRepository);
  const articleItems = await getAllExternalArticles();
  const allItemsLength = [...blogItems, ...articleItems].length;
  return sortedTags.map(([tag, count]) => [
    tag,
    Math.trunc((count / allItemsLength) * 100),
  ]);
};
