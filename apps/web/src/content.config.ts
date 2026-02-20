import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const generateStableDocsId = ({ entry }: { entry: string }) =>
  entry
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx|mdoc)$/i, '')
    .replace(/\/index$/i, '');

export const collections = {
  docs: defineCollection({
    loader: docsLoader({ generateId: generateStableDocsId }),
    schema: docsSchema(),
  }),
};
