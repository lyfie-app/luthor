import type { MetadataRoute } from 'next';
import { getAllDocs } from '@/lib/docs';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocs();
  const staticRoutes = ['/', '/demo/', '/docs/'];
  const now = new Date();

  const baseEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  const docEntries = docs.map((doc) => ({
    url: `${SITE_URL}${doc.urlPath}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...baseEntries, ...docEntries];
}
