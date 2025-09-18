import type { CollectionEntry, CollectionKey } from "astro:content";

export type CollectionRepository<T extends CollectionKey> = {
  getAllItems: () => Promise<CollectionEntry<T>[]>
}

export type WritingItem = {
  title: string;
  publishedDate: string;
  tags: string[];
  url: string;
  media: string;
};
