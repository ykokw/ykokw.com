import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { filterByPublishStatus, getAllBlogItems } from "./blog";
import type { CollectionEntry } from "astro:content";
import type { CollectionRepository, WritingItem } from "./type";

describe("filterByPublishStatus", () => {
  const mockBlogPost = (published: boolean): CollectionEntry<"blog"> => ({
    id: "test-post",
    body: "Test content",
    collection: "blog",
    data: {
      title: "Test Post",
      publishedDate: "2023-01-01",
      published,
      tags: [],
    },
    rendered: { html: "rendered content" },
  });

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return true for published posts in production mode", () => {
    vi.stubEnv("MODE", "production");
    const publishedPost = mockBlogPost(true);

    expect(filterByPublishStatus(publishedPost)).toBe(true);
  });

  it("should return false for unpublished posts in production mode", () => {
    vi.stubEnv("MODE", "production");
    const unpublishedPost = mockBlogPost(false);

    expect(filterByPublishStatus(unpublishedPost)).toBe(false);
  });

  it("should return true for published posts in development mode", () => {
    vi.stubEnv("MODE", "development");
    const publishedPost = mockBlogPost(true);

    expect(filterByPublishStatus(publishedPost)).toBe(true);
  });

  it("should return true for unpublished posts in development mode", () => {
    vi.stubEnv("MODE", "development");
    const unpublishedPost = mockBlogPost(false);

    expect(filterByPublishStatus(unpublishedPost)).toBe(true);
  });
});

describe("getAllBlogItems", () => {
  const mockBlogPosts: CollectionEntry<"blog">[] = [
    {
      id: "first-post",
      body: "Content of first post",
      collection: "blog",
      data: {
        title: "First Blog Post",
        publishedDate: "2023-01-15",
        published: true,
        tags: ["tech", "javascript"],
      },
      rendered: { html: "rendered content" },
    },
    {
      id: "second-post",
      body: "Content of second post",
      collection: "blog",
      data: {
        title: "Second Blog Post",
        publishedDate: "2023-02-20",
        published: true,
        tags: [], // NOTE: test empty array
      },
      rendered: { html: "rendered content" },
    },
    {
      id: "third-post",
      body: "Content of third post",
      collection: "blog",
      data: {
        title: "Third Blog Post",
        publishedDate: "2023-03-10",
        published: false,
        tags: undefined, // test undefined tags
      },
      rendered: { html: "rendered content" },
    },
  ];

  const fakeRepository: CollectionRepository<"blog"> = {
    getAllItems: async () => mockBlogPosts,
  };

  it("should return WritingItem array with correct properties", async () => {
    const result = await getAllBlogItems(fakeRepository);

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

  it("should transform blog posts correctly", async () => {
    const result = await getAllBlogItems(fakeRepository);

    expect(result[0]).toEqual({
      title: "First Blog Post",
      publishedDate: "2023-01-15",
      tags: ["tech", "javascript"],
      url: "/blog/first-post",
      media: "blog",
    });

    expect(result[1]).toEqual({
      title: "Second Blog Post",
      publishedDate: "2023-02-20",
      tags: [],
      url: "/blog/second-post",
      media: "blog",
    });

    expect(result[2]).toEqual({
      title: "Third Blog Post",
      publishedDate: "2023-03-10",
      tags: [],
      url: "/blog/third-post",
      media: "blog",
    });
  });
});
