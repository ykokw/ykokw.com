import { describe, it, expect } from "vitest";
import { getAllZennItems } from "./zenn";
import type { CollectionEntry } from "astro:content";
import type { CollectionRepository, WritingItem } from "./type";

describe("getAllZennItems", () => {
  const mockZennPosts: CollectionEntry<"zenn">[] = [
    {
      id: "https://zenn.dev/user/articles/first-post",
      body: "Content of first zenn post",
      collection: "zenn",
      data: {
        title: "First Zenn Article",
        published: new Date("2023-01-15"),
        id: "https://zenn.dev/user/articles/first-post",
        authors: [],
        categories: [],
        content: "Content of first zenn post",
        description: null,
        image: null,
        url: "https://zenn.dev/user/articles/first-post",
      } as any,
      rendered: { html: "rendered content" },
    },
    {
      id: "https://zenn.dev/user/articles/second-post",
      body: "Content of second zenn post",
      collection: "zenn",
      data: {
        title: "Second Zenn Article",
        published: new Date("2023-02-20"),
        id: "https://zenn.dev/user/articles/second-post",
        authors: [],
        categories: [],
        content: "Content of second zenn post",
        description: null,
        image: null,
        summary: null,
        url: "https://zenn.dev/user/articles/second-post",
      },
      rendered: { html: "rendered content" },
    },
    {
      id: "https://zenn.dev/user/articles/third-post",
      body: "Content of third zenn post",
      collection: "zenn",
      data: {
        title: "Third Zenn Article",
        published: new Date("2023-03-10"),
        id: "https://zenn.dev/user/articles/third-post",
        authors: [],
        categories: [],
        content: "Content of third zenn post",
        description: null,
        image: null,
        summary: null,
        url: "https://zenn.dev/user/articles/third-post",
      },
      rendered: { html: "rendered content" },
    },
  ];

  const fakeRepository: CollectionRepository<"zenn"> = {
    getAllItems: async () => mockZennPosts,
  };

  it("should return WritingItem array with correct properties", async () => {
    const result = await getAllZennItems(fakeRepository);

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

  it("should transform zenn posts correctly", async () => {
    const result = await getAllZennItems(fakeRepository);

    expect(result[0]).toEqual({
      title: "First Zenn Article",
      publishedDate: "2023-01-15",
      tags: [],
      url: "https://zenn.dev/user/articles/first-post",
      media: "Zenn",
    });

    expect(result[1]).toEqual({
      title: "Second Zenn Article",
      publishedDate: "2023-02-20",
      tags: [],
      url: "https://zenn.dev/user/articles/second-post",
      media: "Zenn",
    });

    expect(result[2]).toEqual({
      title: "Third Zenn Article",
      publishedDate: "2023-03-10",
      tags: [],
      url: "https://zenn.dev/user/articles/third-post",
      media: "Zenn",
    });
  });

  it("should handle date conversion correctly", async () => {
    const result = await getAllZennItems(fakeRepository);

    result.forEach((item) => {
      expect(item.publishedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(item.publishedDate)).toBeInstanceOf(Date);
    });
  });
});