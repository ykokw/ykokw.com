---
title: "satoriでOGP画像を自動生成する"
tags: ["Astro", "satori"]
publishedDate: "2025-08-23"
lastEditedDate: "2025-08-23"
published: true
---

## PNG画像生成ロジック

日本語フォントだとファイルサイズ大きくなるので、git管理する代わりにCDN使うことにした。
それ以外は参考リンク見ながら実装できた。

（PNG画像生成ロジック）

```tsx
const OGP_WIDTH = 1200;
const OGP_HEIGHT = 675;

export const generateOgpImage = async (title: string): Promise<Buffer> => {
  const font = await fetchFontBizUdpgothic();
  const icon = await getIconBase64();
  const svg = await satori(<ThumbnailOGP title={title} iconBase64={icon} />, {
    width: OGP_WIDTH,
    height: OGP_HEIGHT,
    fonts: [
      {
        name: "biz-udpgothic",
        data: font,
        style: "normal",
        weight: 400,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: OGP_WIDTH,
    },
  });
  const image = resvg.render();

  return image.asPng();
};
```

（フォントとアイコンの用意）

```ts
import fs from "fs";
import path from "path";

let fontBizUdpgothic: ArrayBuffer | null = null;

const URL_BIZ_UDPGOTHIC =
  "https://cdn.jsdelivr.net/fontsource/fonts/biz-udpgothic@latest/japanese-400-normal.ttf";

// NOTE: BIZ UDPGothic をfontsourceから読み込む
// fontBizUdpgothicにデータがあればそのまま使用する
export const fetchFontBizUdpgothic = async () => {
  if (fontBizUdpgothic) {
    return fontBizUdpgothic;
  }
  const response = await fetch(URL_BIZ_UDPGOTHIC, {
    headers: {
      "Content-Type": "font/ttf",
    },
  });
  fontBizUdpgothic = await response.arrayBuffer();
  return fontBizUdpgothic;
};

let iconBase64: string;

// NOTE: ローカルのアイコンをBase64エンコードして返す
export const getIconBase64 = async () => {
  if (iconBase64) {
    return iconBase64;
  }
  const iconPath = path.resolve(process.cwd(), "public/images/profile.jpg");
  const iconBuffer = fs.readFileSync(iconPath);
  iconBase64 = iconBuffer.toString("base64");
  return iconBase64;
};
```

## `No loader is configured for ".node" files` のエラー

[AstroでNo loader is configured for &quot;.node&quot; files: node_modules/.pnpm/@resvg+resvg-js-linux-x64-gnu@2.6.2/node_modules/@resvg/resvg-js-linux-x64-gnu/resvgjs.linux-x64-gnu.node エラーを解決する](https://tomoyayoshida.com/blog/astro-no-loader/ 'AstroでNo loader is configured for ".node" files: node_modules/.pnpm/@resvg+resvg-js-linux-x64-gnu@2.6.2/node_modules/@resvg/resvg-js-linux-x64-gnu/resvgjs.linux-x64-gnu.node エラーを解決する') を参考にastro.config.mjsを修正

```ts
export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
```

## 参考リンク

- [vercel/satori: Enlightened library to convert HTML and CSS to SVG](https://github.com/vercel/satori "vercel/satori: Enlightened library to convert HTML and CSS to SVG")
- [エンドポイント | Docs](https://docs.astro.build/ja/guides/endpoints/ "エンドポイント | Docs")
- [Astro + SatoriでブログのOGP画像を自動生成した - @kimulaco/blog](https://blog.kimulaco.dev/article/ogp-img-with-astro-and-satori "Astro + SatoriでブログのOGP画像を自動生成した - @kimulaco/blog")
- [satoriを使ったAstroのOGP画像生成メモ | lacolaco's marginalia](https://blog.lacolaco.net/posts/astro-satori-og-image-generation/ "satoriを使ったAstroのOGP画像生成メモ | lacolaco's marginalia")
- [AstroでNo loader is configured for &quot;.node&quot; files: node_modules/.pnpm/@resvg+resvg-js-linux-x64-gnu@2.6.2/node_modules/@resvg/resvg-js-linux-x64-gnu/resvgjs.linux-x64-gnu.node エラーを解決する](https://tomoyayoshida.com/blog/astro-no-loader/ 'AstroでNo loader is configured for ".node" files: node_modules/.pnpm/@resvg+resvg-js-linux-x64-gnu@2.6.2/node_modules/@resvg/resvg-js-linux-x64-gnu/resvgjs.linux-x64-gnu.node エラーを解決する')
