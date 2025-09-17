import { getCollection, type CollectionEntry } from "astro:content";
import type { CollectionRepository, WritingItem } from "./type";

export const filterByPublishStatus = (
  item: CollectionEntry<"blog">,
): boolean => {
  return import.meta.env.MODE === "production" ? item.data.published : true;
};

let allBlogPosts: CollectionEntry<"blog">[] = [];
export const blogCollectionRepository: CollectionRepository<"blog"> = {
  getAllItems: async () => {
    if (allBlogPosts.length === 0) {
      allBlogPosts = await getCollection("blog", filterByPublishStatus);
    }
    return allBlogPosts;
  },
};

export const getAllBlogItems = async (
  repo: CollectionRepository<'blog'>,
): Promise<WritingItem[]> => {
  const blogItems = await repo.getAllItems();
  return blogItems.map((post) => ({
    title: post.data.title,
    publishedDate: post.data.publishedDate,
    tags: post.data.tags || [],
    url: `/blog/${post.id}`,
    media: "blog",
  }));
}
