import type { WritingItem } from "./type";
import { blogCollectionRepository, getAllBlogItems } from "./blog";
import { articlesCollectionRepository, getAllArticleItems } from "./articles";
import { zennCollectionRepository, getAllZennItems } from "./zenn";

export const getAllItems = async (): Promise<WritingItem[]> => {
  return [
    ...(await getAllBlogItems(blogCollectionRepository)),
    ...(await getAllArticleItems(articlesCollectionRepository)),
    ...(await getAllZennItems(zennCollectionRepository)),
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
  const articleItems = await getAllArticleItems(articlesCollectionRepository);
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

export const getTopTagsLastYear = async (): Promise<[string, number][]> => {
  const blogItems = await getAllBlogItems(blogCollectionRepository);
  const articleItems = await getAllArticleItems(articlesCollectionRepository);
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  const recentBlogItems = [...blogItems, ...articleItems].filter((item) => {
    const publishedDate = new Date(item.publishedDate);
    return publishedDate >= oneYearAgo;
  });

  const tagUsages = recentBlogItems.reduce((acc, item) => {
    if (item.tags) {
      item.tags.map((tag: string) => {
        acc.set(tag, (acc.get(tag) || 0) + 1);
      });
    }
    return acc;
  }, new Map<string, number>());

  return Array.from(tagUsages.entries())
    .sort((a, b) => b[1] - a[1])
    .sort((a, b) =>  a[0].localeCompare(b[0]))
    .slice(0, 5) as [string, number][];
};
