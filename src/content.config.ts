import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";
import { feedLoader } from "@ascorbic/feed-loader";

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

const articles = defineCollection({
  loader: file("articles/articles.json"),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    publishedDate: z.string().date(),
    tags: z.array(z.string()).optional(),
    media: z.string(),
  }),
});

const zenn = defineCollection({
  loader: feedLoader({
    url: "https://zenn.dev/ykokw/feed",
  })
});

export const collections = {
  blog,
  articles,
  zenn,
};
