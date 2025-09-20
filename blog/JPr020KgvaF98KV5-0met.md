---
title: "Vitest導入した"
tags: []
publishedDate: "2025-09-20"
lastEditedDate: "2025-09-20"
published: true
---

## 導入理由

- AstroのStatic Siteで複雑なことはない
- とはいえ、このあとdependabotの運用をしたかったのでCIでの自動テストを構築しておきたかった
- Contents CollectionのAPIを呼び出しているロジックのテスト追加から始めた

## 記事一覧取得ロジックのテスト

- AstroのAPIをモックするときのTypeScriptエラーが解決できなかったのでDIを導入した
  - （repositoryという命名以外は適当にやっている）

（全ての記事一覧を返すロジック）

```ts
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
  repo: CollectionRepository<"blog">,
): Promise<WritingItem[]> => {
  const blogItems = await repo.getAllItems();
  return blogItems.map((post) => ({
    title: post.data.title,
    publishedDate: post.data.publishedDate,
    tags: post.data.tags || [],
    url: `/blog/${post.id}`,
    media: "blog",
  }));
};
```

（テストコード例）

```ts
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
```

## カバレッジレポートのコメント投稿

- TBA
