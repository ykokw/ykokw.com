---
title: "サイトのフォント設定をシンプルにした"
tags: ["Font", "Performance"]
publishedDate: "2025-09-08"
lastEditedDate: "2025-09-08"
published: false
---

# サイト構築時

最初は学習を兼ねてWebフォントを導入していた。
具体的には[BIZ UDGothic - Google Fonts](https://fonts.google.com/specimen/BIZ+UDGothic)を使用していた。
このフォントは見やすさと読みやすさが意識されたユニバーサルフォントで、実際に使ってみても非常に見やすかった。
また、unicode-rangeが指定されて分割されたフォントファイルがダウンロードされる仕組みになっていた。
サイトには[Fontsource](https://fontsource.org/)を利用してnpmパッケージとして追加した。

また、いくつかのMaterial Symbolsアイコンも使用していたため、そのCSSをドキュメント通りにBaseLayoutで読み込んでいた。

# 適用しなかった改善

Material SymbolsもFontsourceから利用できることに気づいたので変更してみた。
Chrome Dev ToolsのNetworkタブでデータ量を計測していたところ、
Material SymbolsよりもBIZ UDGothicの方が断然データ量が多いことに気づいた。
この時点で、Webフォントの使用をやめることがパフォーマンス改善の近道だと感じ始めた。

また途中で気付いたが、サイト構築時はMaterial Symbolsのアイコン名を具体的に指定していなかったため、全てのアイコンを含んだフォントファイルがダウンロードされていた。
（補足: それでもなお、BIZ UDGothicの方がサイズが大きかった）
公式の利用方法ではクエリパラメータで利用するアイコン名を指定できるが、Fontsource経由だとそれができなそうだった。

試行錯誤の一環として、Astroの[Experimental fonts API](https://docs.astro.build/en/reference/experimental-flags/fonts/#_top)も試してみた。手元での検証では、フォントのダウンロード回数は減ったものの、（1つの？）ファイルにまとまったことで逆にサイズが大きくなってしまった。これは設定ミスか、キャッシュ戦略に基づく最適化の結果かもしれないが、深く追求はしなかった。

# 最終的な着地点

最終的に、システムフォントに頼る方針に変更した。[2025年に最適なfont-familyの書き方 - ICS MEDIA](https://ics.media/entry/200317/)の記事を参考に、以下のような設定にした。

(global.css)

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --font-default:
    "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans",
    Meiryo, sans-serif;
}
```

Material Symbolsについては、使用するアイコン名を明示的に列挙し、URLSearchParamsでクエリパラメータを作成した。

ちなみに、実際に組み立てたURLにアクセスしてみるとバリデーションエラーの詳細が確認できる。
アイコン名はアルファベット順にソートされている必要があり、重複も許可されていなかった。
そのため、重複を防ぐためにSetを利用している（使用アイコン数が少ないので失敗の可能性は低いが、念のための対策）。

（src/constants/iconName.ts）

```ts
// NOTE: icon names must be sorted alphabetically
const iconNames = ["calendar_today", "open_in_new", "tag"] as const;
// icon names must be unique
export const iconNameSet = new Set(iconNames);

export type IconName = (typeof iconNames)[number];
```

(src/layouts/BaseLayout.astro)

```ts
const iconNameParams = new URLSearchParams({
  family: "Material Symbols Outlined",
  icon_names: Array.from(iconNameSet).join(","),
  display: "block",
});
```

# さいごに

このサイトではWebフォントを利用しないこととしたが、
Fontsourceを経由してnpmパッケージとしてフォントを管理できるのは便利だった。
特にモバイル向けにも提供しているサイトではリクエストのオーバーヘッドが減るのもいいことそう。
FontsourceやMaterial Symbolsの学びは得られたので、どこかで活かせたらと思う。
