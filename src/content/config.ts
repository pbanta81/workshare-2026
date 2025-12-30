import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const portfolios = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolios' }),
  schema: z.object({
    title: z.string(),
    headshot: z.string().optional(),
    tagline: z.string().optional(),
    work: z.array(z.object({
      company: z.string(),
      logo: z.string(),
      role: z.string(),
      years: z.string(),
    })).optional(),
  }),
});

export const collections = { portfolios };

