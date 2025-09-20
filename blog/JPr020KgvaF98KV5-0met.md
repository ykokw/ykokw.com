---
title: "Vitestを導入した"
tags: ["Astro", "Vitest", "Testing", "CI/CD"]
publishedDate: "2025-09-20"
lastEditedDate: "2025-09-20"
published: true
---

## はじめに

このサイトに、Vitestによるテスト環境を導入しました。
Astroのような静的サイトでは複雑なロジックは少ないものの、
今後のdependabot運用やCI/CD環境の整備を見据えて、自動テストの基盤を構築することにしました。

## Contents Collection APIのテスト実装

AstroのContents Collection API (`getCollection`)関数を直接モックしたとき、TypeScriptエラーが解決できませんでした。
モック定義を簡単にするため、Dependency Injectionパターンを導入しました。完全なDIフレームワークではなく、シンプルなRepositoryパターンとして実装しています。

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

Github Actionsで自動テストするワークフローも用意しました。
[davelosert/vitest-coverage-report-action](https://github.com/davelosert/vitest-coverage-report-action) を利用してプルリクエストにカバレッジレポートをコメントしてもらっています。
そんなにかっちり運用する予定はないので、threshold設定やmainブランチとの比較は行っていません。

## 今後

Astroのコンポーネントテストや他のロジックも自動テストを書いていこうと思います。
また、Playwrightを使ったE2Eテストも整備していきたいです。
（Staticなサイトでどこまでやるか問題はありますが...）
