import { defineCollection } from "astro:content";
import { z } from 'astro/zod';
import { glob, file } from "astro/loaders";
import { feedLoader } from "@ascorbic/feed-loader";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./blog" }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    publishedDate: z.iso.datetime().or(z.iso.date()),
    lastEditedDate: z.iso.datetime().or(z.iso.date()).optional(),
    published: z.boolean().default(true),
  }),
});

const articles = defineCollection({
  loader: file("articles/articles.json"),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    publishedDate: z.iso.date(),
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
