import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES } from './config/categories';

const nullishString = (value: unknown) => (value == null ? '' : String(value));
const optionalString = (value: unknown) =>
  value == null || value === '' ? undefined : String(value);

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '*.md' }),
  schema: z.object({
    title: z.preprocess(nullishString, z.string().min(1, '标题不能为空')),
    description: z.preprocess(optionalString, z.string().optional()),
    pubDate: z.coerce.date(),
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };