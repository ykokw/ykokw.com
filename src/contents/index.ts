import type { WritingItem } from "./type";
import { blogCollectionRepository, getAllBlogItems } from "./blog";
import { articlesCollectionRepository, getAllArticleItems } from "./articles";
import { zennCollectionRepository, getAllZennItems } from "./zenn";
import { countTagUsage } from "./tags";

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
  return countTagUsage({ items: [...blogItems, ...articleItems] });
};

export const getTopTagsLastYear = async () => {
  const blogItems = await getAllBlogItems(blogCollectionRepository);
  const articleItems = await getAllArticleItems(articlesCollectionRepository);
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  const recentBlogItems = [...blogItems, ...articleItems].filter((item) => {
    const publishedDate = new Date(item.publishedDate);
    return publishedDate >= oneYearAgo;
  });

  return countTagUsage({ items: recentBlogItems, limit: 5 })
};
