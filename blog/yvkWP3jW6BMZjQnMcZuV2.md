---
title: "アイコンをSVGファイルで運用していくことにした"
tags: ["Icons", "SVG", "Material Symbols", "Web Performance", "Astro"]
publishedDate: "2025-10-04"
lastEditedDate: "2025-10-04"
published: true
---

## はじめに

このブログでは以前からMaterial Symbolsのアイコンフォントを使用していました。[フォント設定を最適化した際](/l3mZcG_34Zk4N8m0rL_CM)に、必要なアイコンだけを選択的に読み込むよう改善していましたが、さらなるパフォーマンス向上を目指してSVGファイルでの運用に切り替えることにしました。

## SVGファイル運用のきっかけ

FontsourceのMaterial Symbolsパッケージを検討している際に、気になるIssueを発見しました。

（[Font Request: Material Symbols](https://github.com/fontsource/fontsource/issues/497#issuecomment-1705761024) より引用）

> Using SVGs to individually pick out the necessary icons will always lead to smaller bundles, especially if it's only a couple of icons.

このサイトでも利用しているアイコンが数種類と少なく、さらにページ読み込み時にアイコンが遅れて表示されることが気になっていたため、SVGファイルでの運用に切り替えることにしました。

## 変更内容

変更前の実装は[マテリアル シンボルガイド](https://developers.google.com/fonts/docs/material_symbols?hl=ja#use_in_web)の通り、以下のようになっていました。

```html
<span class="material-symbols-outlined text-base!" aria-hidden="true">
  calendar_today
</span>
```

Astroではv5.7からSVGファイルを通常のコンポーネントとしてレンダリングできるようになったため、インポートしたSVGファイルをそのまま使用しています。[tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)の影響を避け、余計なマージンが設定されないよう`inline`指定を追加しています。

```jsx
<CalendarTodayIcon
  width="16"
  height="16"
  class="not-prose inline"
  aria-hidden
/>
```

## まとめ

ページ読み込み時のアイコン表示遅延は解決できました。
（バンドルサイズやCore Web Vitalsの比較測定は実施しませんでした。）

少数のアイコンを利用する場合はこの方法で十分だと思います。
大規模なWebアプリケーションで多くのアイコンが必要な場合は、別ツールの利用を検討するか、Material Symbolsを直接利用しつつページ読み込み時用のフォールバック表示（サイズ固定、文字非表示など）が必要かもしれません。

個人的には、必要なファイルが決まっている場合、運用負荷が許容範囲であればSVGファイル運用で統一するのが良いと考えています。

## （余談）iconify

調査中に[Iconify](https://iconify.design/)というOSSを発見しました。さまざまなフレームワークをサポートしており便利そうです。
APIを利用してアイコンを読み込む仕組みが特徴的だと感じていましたが、

（[iconify/iconify](https://github.com/iconify/iconify) のREADMEより引用）

> You can also use API if you don't know what icons user will need, while offering thousands of icons to choose from. This is perfect for applications that can be customised by user.

という記述を見て、ユーザーが表示アイコンを選択できるようなユースケースでは、確かにオンデマンド読み込みが適していると感じました。
