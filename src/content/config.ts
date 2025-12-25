import { defineCollection, z } from 'astro:content';

const portfolios = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.number(),
    role: z.string(),
    summary: z.string(),
    thumbnail: z.string().optional(),
    color: z.string().optional(), // Accent color for the portfolio
  }),
});

export const collections = { portfolios };

