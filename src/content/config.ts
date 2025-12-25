import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolios = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolios' }),
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

