---
title: 'サイトリニューアル2025'
tags: ['Astro', 'Github Copilot', 'Figma', 'Chat GPT']
publishedDate: '2025-08-14'
lastEditedDate: '2025-08-14'
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

ブログ用

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './blog' }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    publishedDate: z.string().datetime().or(z.string().date()),
    lastEditedDate: z.string().datetime().or(z.string().date()).optional(),
    published: z.boolean().default(true),
  }),
});
```

Zenn用

その他記事用

