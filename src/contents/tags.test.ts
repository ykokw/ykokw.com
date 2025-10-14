import { describe, it, expect } from "vitest";
import { countTagUsage } from "./tags";
import type { WritingItem } from "./type";

describe("countTagUsage", () => {
  describe("basic counting functionality", () => {
    it("should count tag occurrences correctly", () => {
      const items: WritingItem[] = [
        {
          title: "Post 1",
          publishedDate: "2024-01-01",
          tags: ["javascript", "typescript"],
          url: "https://example.com/1",
          media: "blog",
        },
        {
          title: "Post 2",
          publishedDate: "2024-01-02",
          tags: ["javascript", "react"],
          url: "https://example.com/2",
          media: "blog",
        },
        {
          title: "Post 3",
          publishedDate: "2024-01-03",
          tags: ["typescript", "react"],
          url: "https://example.com/3",
          media: "blog",
        },
      ];

      const result = countTagUsage({ items });

      expect(result.get("javascript")).toBe(2);
      expect(result.get("typescript")).toBe(2);
      expect(result.get("react")).toBe(2);
      expect(result.size).toBe(3);
    });

    it("should handle duplicate tags in the same item", () => {
      const items: WritingItem[] = [
        {
          title: "Post 1",
          publishedDate: "2024-01-01",
          tags: ["javascript", "javascript", "typescript"],
          url: "https://example.com/1",
          media: "blog",
        },
      ];

      const result = countTagUsage({ items });

      expect(result.get("javascript")).toBe(2);
      expect(result.get("typescript")).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("should handle items with no tags", () => {
      const items: WritingItem[] = [
        {
          title: "Post 1",
          publishedDate: "2024-01-01",
          tags: ["javascript"],
          url: "https://example.com/1",
          media: "blog",
        },
        {
          title: "Post 2",
          publishedDate: "2024-01-02",
          tags: [],
          url: "https://example.com/2",
          media: "blog",
        },
      ];

      const result = countTagUsage({ items });

      expect(result.get("javascript")).toBe(1);
      expect(result.size).toBe(1);
    });

    it("should handle empty items array", () => {
      const items: WritingItem[] = [];

      const result = countTagUsage({ items });

      expect(result.size).toBe(0);
    });
  });

  describe("limit functionality", () => {
    it("should apply limit and return top N tags by count", () => {
      const items: WritingItem[] = [
        {
          title: "Post 1",
          publishedDate: "2024-01-01",
          tags: ["javascript", "typescript", "react"],
          url: "https://example.com/1",
          media: "blog",
        },
        {
          title: "Post 2",
          publishedDate: "2024-01-02",
          tags: ["javascript", "typescript"],
          url: "https://example.com/2",
          media: "blog",
        },
        {
          title: "Post 3",
          publishedDate: "2024-01-03",
          tags: ["javascript"],
          url: "https://example.com/3",
          media: "blog",
        },
      ];

      const result = countTagUsage({ items, limit: 2 });

      expect(result.size).toBe(2);
      expect(result.get("javascript")).toBe(3);
      expect(result.get("typescript")).toBe(2);
      expect(result.has("react")).toBe(false);
    });

    it("should sort tags by count in descending order when limit is applied", () => {
      const items: WritingItem[] = [
        {
          title: "Post 1",
          publishedDate: "2024-01-01",
          tags: ["a", "b", "c"],
          url: "https://example.com/1",
          media: "blog",
        },
        {
          title: "Post 2",
          publishedDate: "2024-01-02",
          tags: ["b", "c"],
          url: "https://example.com/2",
          media: "blog",
        },
        {
          title: "Post 3",
          publishedDate: "2024-01-03",
          tags: ["c"],
          url: "https://example.com/3",
          media: "blog",
        },
      ];

      const result = countTagUsage({ items, limit: 3 });
      const entries = [...result.entries()];

      // Verify the order: "c" (3), "b" (2), "a" (1)
      expect(entries[0][0]).toBe("c");
      expect(entries[0][1]).toBe(3);
      expect(entries[1][0]).toBe("b");
      expect(entries[1][1]).toBe(2);
      expect(entries[2][0]).toBe("a");
      expect(entries[2][1]).toBe(1);
    });

    it.each([
      {
        description: "limit larger than number of unique tags",
        limit: 10,
        expectedSize: 2,
      },
      {
        description: "limit of 0",
        limit: 0,
        expectedSize: 0,
      },
    ])("should handle $description", ({ limit, expectedSize }) => {
      const items: WritingItem[] = [
        {
          title: "Post 1",
          publishedDate: "2024-01-01",
          tags: ["javascript", "typescript"],
          url: "https://example.com/1",
          media: "blog",
        },
      ];

      const result = countTagUsage({ items, limit });

      expect(result.size).toBe(expectedSize);
    });
  });

  describe("special characters in tags", () => {
    it.each([
      {
        description: "tags with spaces",
        tags: ["web development", "machine learning", "web development"],
        secondItemTags: ["machine learning", "data science"],
        expectedResults: [
          { tag: "web%20development", count: 2 },
          { tag: "machine%20learning", count: 2 },
          { tag: "data%20science", count: 1 },
        ],
      },
      {
        description: "tags with slashes",
        tags: ["react/hooks", "node.js/express", "react/hooks"],
        secondItemTags: ["react/hooks", "vue/composition-api"],
        expectedResults: [
          { tag: "react%2Fhooks", count: 3 },
          { tag: "node.js%2Fexpress", count: 1 },
          { tag: "vue%2Fcomposition-api", count: 1 },
        ],
      },
      {
        description: "tags with both spaces and slashes",
        tags: ["web development/frontend", "CI/CD pipelines"],
        secondItemTags: ["web development/frontend", "API design/REST"],
        expectedResults: [
          { tag: "web%20development%2Ffrontend", count: 2 },
          { tag: "CI%2FCD%20pipelines", count: 1 },
          { tag: "API%20design%2FREST", count: 1 },
        ],
      },
    ])(
      "should handle $description",
      ({ tags, secondItemTags, expectedResults }) => {
        const items: WritingItem[] = [
          {
            title: "Post 1",
            publishedDate: "2024-01-01",
            tags,
            url: "https://example.com/1",
            media: "blog",
          },
          {
            title: "Post 2",
            publishedDate: "2024-01-02",
            tags: secondItemTags,
            url: "https://example.com/2",
            media: "blog",
          },
        ];

        const result = countTagUsage({ items });

        expect(result.size).toBe(expectedResults.length);
        expectedResults.forEach(({ tag, count }) => {
          expect(result.get(tag)).toBe(count);
        });
      },
    );
  });
});
