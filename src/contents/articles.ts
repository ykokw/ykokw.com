import { getCollection, type CollectionEntry } from "astro:content";
import type { CollectionRepository, WritingItem } from "./type";

let allExternalArticles: CollectionEntry<"articles">[] = [];
export const articlesCollectionRepository: CollectionRepository<"articles"> = {
  getAllItems: async () => {
    if (allExternalArticles.length === 0) {
      allExternalArticles = await getCollection("articles");
    }
    return allExternalArticles;
  },
};

export const getAllArticleItems = async (
  repo: CollectionRepository<'articles'>,
): Promise<WritingItem[]> => {
  const articleItems = await repo.getAllItems();
  return articleItems.map((article) => ({
    title: article.data.title,
    publishedDate: article.data.publishedDate,
    tags: article.data.tags || [],
    url: article.data.url,
    media: article.data.media,
  }));
};