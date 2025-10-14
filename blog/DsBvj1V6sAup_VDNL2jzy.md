---
title: "AstroでタグにスペースとスラッシュをURL-safeに扱う方法"
tags: ["Astro"]
publishedDate: "2025-10-14"
lastEditedDate: "2025-10-14"
published: true
---

## 背景

このブログでは記事にタグを付けて分類しているが、「web development」や「CI/CD」のようにスペースやスラッシュを含むタグを使用すると、タグごとの記事一覧ページが404エラーになる問題が発生していた。

## 問題の原因

Astroの動的ルーティング `[slug].astro` では、URLパスパラメータに特殊文字が含まれる場合、適切にエンコード/デコードする必要がある。特にスラッシュ(`/`)はURLのパス区切り文字として解釈されるため、そのまま使用すると意図しないルーティングになってしまう。

## 解決までのステップ

### 1. タグの利用回数集計ロジックでのエンコード

まず、タグの利用回数集計ロジックでタグ文字列を`encodeURI()` でエンコードした。

```ts
export const countTagUsage = ({
  items,
  limit,
}: {
  items: WritingItem[];
  limit?: number;
}): Map<string, number> => {
  // itemsのtag出現数をカウントしてMapにまとめる
  const tagCountMap = items.reduce((map, item) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag) => {
        const encodedTag = encodeURI(tag);
        map.set(encodedTag, (map.get(encodedTag) || 0) + 1);
      });
    }
    return map;
  }, new Map<string, number>());

  // limitが指定されている場合、出現数の多い順にソートして制限を適用
  if (limit !== undefined) {
    return new Map(
      [...tagCountMap.entries()]
        .sort((a, b) => b[1] - a[1]) // 出現数の降順にソート
        .slice(0, limit), // 上位limit件を取得
    );
  }

  return tagCountMap;
};
```

### 2. タグ詳細ページでの課題と解決

トップページやタグ一覧ではタグ文字列を表示するときにデコードすることで表示とページ遷移ができるようになった。
しかし、`src/pages/tags/[slug].astro` でスラッシュを含むタグが依然として404になる問題が残った。

**当初の実装（動作しない）：**

```typescript
export async function getStaticPaths() {
  const tagUsages = await getAllTagUsages();
  return Array.from(tagUsages.entries()).map(([tag]) => ({
    params: { slug: decodeURI(tag) },
  }));
}
```

この実装では `getStaticPaths()` で `decodeURI()` を使用していたのを、
`decodeURI()` に変更することで改善した。

**修正後の実装（動作する）：**

```typescript
export async function getStaticPaths() {
  const tagUsages = await getAllTagUsages();
  return Array.from(tagUsages.entries()).map(([tag]) => ({
    params: { slug: decodeURI(tag) }, // getStaticPathsのparamsはdecodeURIでデコード
  }));
}

const { slug = "" } = Astro.params;
// タグの表示用
const decodedSlug = decodeURI(slug);
```

## まとめ

issueを辿っていくとドキュメントに記載があることに気付いた。ちゃんとドキュメント読み込もう。

## 参考リンク

- [Astro Issue #7962: Dynamic routes don't support encoded slashes](https://github.com/withastro/astro/issues/7962)
- [Astro PR #12079: Fix encoded slash handling](https://github.com/withastro/astro/pull/12079)
- [Astro Docs: paramsのデコード](https://docs.astro.build/ja/guides/routing/#params%E3%81%AE%E3%83%87%E3%82%B3%E3%83%BC%E3%83%89)
