import { describe, it, expect } from "vitest";
import { getAllArticleItems } from "./articles";
import type { CollectionEntry } from "astro:content";
import type { CollectionRepository, WritingItem } from "./type";

describe("getAllArticleItems", () => {
  const mockArticles: CollectionEntry<"articles">[] = [
    {
      id: "first-article",
      body: "Content of first article",
      collection: "articles",
      data: {
        title: "First External Article",
        publishedDate: "2023-01-15",
        url: "https://example.com/first-article",
        media: "Medium",
        tags: ["tech", "programming"],
      },
      rendered: { html: "rendered content" },
    },
    {
      id: "second-article",
      body: "Content of second article",
      collection: "articles",
      data: {
        title: "Second External Article",
        publishedDate: "2023-02-20",
        url: "https://dev.to/second-article",
        media: "Dev.to",
        tags: [],
      },
      rendered: { html: "rendered content" },
    },
    {
      id: "third-article",
      body: "Content of third article",
      collection: "articles",
      data: {
        title: "Third External Article",
        publishedDate: "2023-03-10",
        url: "https://hashnode.com/third-article",
        media: "Hashnode",
        tags: undefined,
      },
      rendered: { html: "rendered content" },
    },
  ];

  const fakeRepository: CollectionRepository<"articles"> = {
    getAllItems: async () => mockArticles,
  };

  it("should return WritingItem array with correct properties", async () => {
    const result = await getAllArticleItems(fakeRepository);

    expect(result).toHaveLength(3);

    result.forEach((item: WritingItem) => {
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("publishedDate");
      expect(item).toHaveProperty("tags");
      expect(item).toHaveProperty("url");
      expect(item).toHaveProperty("media");

      expect(typeof item.title).toBe("string");
      expect(typeof item.publishedDate).toBe("string");
      expect(Array.isArray(item.tags)).toBe(true);
      expect(typeof item.url).toBe("string");
      expect(typeof item.media).toBe("string");
    });
  });

  it("should transform articles correctly", async () => {
    const result = await getAllArticleItems(fakeRepository);

    expect(result[0]).toEqual({
      title: "First External Article",
      publishedDate: "2023-01-15",
      tags: ["tech", "programming"],
      url: "https://example.com/first-article",
      media: "Medium",
    });

    expect(result[1]).toEqual({
      title: "Second External Article",
      publishedDate: "2023-02-20",
      tags: [],
      url: "https://dev.to/second-article",
      media: "Dev.to",
    });

    expect(result[2]).toEqual({
      title: "Third External Article",
      publishedDate: "2023-03-10",
      tags: [],
      url: "https://hashnode.com/third-article",
      media: "Hashnode",
    });
  });
});