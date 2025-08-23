---
title: "ホームページリニューアル2025"
tags: ["Astro"]
publishedDate: "2025-08-14"
lastEditedDate: "2025-08-14"
published: true
---

ホームページをリニューアルした。

技術構成は前から変わっていなかったがトップページに各リンクをのせているだけだったので
せっかくAstroを使っているのに色んな機能を活用できていなかった。

ということで、今回のリニューアルで以下の機能を利用することができた。

- [コンポーネント | Docs](https://docs.astro.build/ja/basics/astro-components/ "コンポーネント | Docs")
- ヘッダー・フッターや記事一覧用のコンポーネントを用意
- [レイアウト | Docs](https://docs.astro.build/ja/basics/layouts/ "レイアウト | Docs")
  - ページ・ブログ用でレイアウトを分けた
  - 基本的なレイアウトをネストして共通化した
- [コンテンツコレクション | Docs](https://docs.astro.build/ja/guides/content-collections/ "コンテンツコレクション | Docs")
  - Markdownで書かれたブログ記事、Zennのフィード、その他記事のJSONファイルを集約できた
- [シンタックスハイライト | Docs](https://docs.astro.build/ja/guides/syntax-highlighting/ "シンタックスハイライト | Docs")
  - デフォルトのテーマがちょうど見やすいと思ったのでそのまま利用
- [エンドポイント | Docs](https://docs.astro.build/ja/guides/endpoints/ "エンドポイント | Docs")
  - ブログ記事ごとのタイトル入りOGP画像を生成するエンドポイントを実装

Zenn / Qiita / このサイトの使い分けは特に決めてないけど、
せっかくリニューアルしたので色々試したことをアウトプットしていきたい。
