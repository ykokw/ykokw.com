import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import openInNewIcon from "./src/assets/icons/open-in-new.svg";

// https://astro.build/config
export default defineConfig({
  site: "https://ykokw.com",

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
            type: "raw",
            value: `<img src="${openInNewIcon}" width="16" height="16" alt="">`,
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
