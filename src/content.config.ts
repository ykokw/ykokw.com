import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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

export const collections = {
  blog,
};
