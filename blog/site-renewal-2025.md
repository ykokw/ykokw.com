---
title: "サイトリニューアル2025"
tags: ["Astro", "Github Copilot", "Figma", "Chat GPT"]
publishedDate: "2025-08-14"
lastEditedDate: "2025-08-14"
published: false
---

## はじめに

サイトをリニューアルしました。
久しぶりにブログも復活したので、日々の学びを記録してい来ます！

## メモ

- Astro を利用
  - 以前がペラ1のサイトだったのでContent Collectionsを活用して各所の記事を集約
- Chat GPTでカラートークンを決定
- Figma makeを利用
  - 適当に配置したFigmaのフレームから整列しつつダミーデータ生成してトップページを作ってもらった
- Github Copilot エージェントモードを利用
  - 空のページ実装
    - ブログ記事一覧ページでgetStaticPathsまで書いてくれて驚いた
  - Footer実装

## Content Collections詳細

### ブログ用

ブログ用は標準のglob loaderを使い、schemaを定義

```ts
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./blog" }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    publishedDate: z.string().datetime().or(z.string().date()),
    lastEditedDate: z.string().datetime().or(z.string().date()).optional(),
    published: z.boolean().default(true),
  }),
});
```

### Zenn用

ZennはRSSが取得できるので、feed loader利用

### その他記事用

その他表示したいリンクはJSONで管理

表でまとめると以下の通り
| 記事タイプ | loader |
| --- | --- |
| ブログ | glob loader |
| Zenn | feed loader |
| その他リンク | glob loader |

> 継続は力なり。

## 参考リンク

1. [Astro ドキュメント](https://docs.astro.build/en/getting-started/)
2. [Astro で class:list を使って Tailwind CSS のクラスを追加ライブラリなしに整理する](https://qiita.com/kskwtnk/items/dedadad9e96c4b81e55d)
3. TBA
