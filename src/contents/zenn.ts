import { getCollection, type CollectionEntry } from "astro:content";
import type { CollectionRepository, WritingItem } from "./type";

let allZennPosts: CollectionEntry<"zenn">[] = [];
export const zennCollectionRepository: CollectionRepository<"zenn"> = {
  getAllItems: async () => {
    if (allZennPosts.length === 0) {
      allZennPosts = await getCollection("zenn");
    }
    return allZennPosts;
  },
};

export const getAllZennItems = async (
  repo: CollectionRepository<'zenn'>,
): Promise<WritingItem[]> => {
  const zennItems = await repo.getAllItems();
  return zennItems.map((post) => ({
    title: post.data.title as string,
    publishedDate: (post.data.published as Date).toISOString().split("T")[0],
    tags: [],
    url: post.data.id as string,
    media: "Zenn",
  }));
};