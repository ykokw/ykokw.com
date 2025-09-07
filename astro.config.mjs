import { defineConfig, fontProviders } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://ykokw.com",

  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: "BIZ UDGothic",
        cssVariable: "--font-biz-udgothic",
        weights: ["400"],
        subsets: ["japanese"],
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },

  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: "noreferrer",
          content: {
            type: "text",
            value: "open_in_new",
          },
          contentProperties: {
            className:
              "material-symbols-outlined inline-flex align-middle text-sm! text-blue-white opacity-70 ml-1",
            "aria-label": "新しいタブで開く",
          },
        },
      ],
    ],
  },

  integrations: [react()],
});
