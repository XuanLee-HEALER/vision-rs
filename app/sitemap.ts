import { MetadataRoute } from 'next';
import contentIndex from '@/app/(site)/learn/_index.generated.json';
import { getBatchVisibility } from '@/lib/visibility';

/**
 * Generate sitemap with visibility filtering
 * Hidden content is excluded from sitemap
 *
 * Note: If KV environment variables are not configured (local development),
 * all content will be included in sitemap (default visible)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-rs.com';

  // Check if KV is configured
  const kvConfigured = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

  let visibleContent = contentIndex;

  if (kvConfigured) {
    try {
      // Get visibility status for all content
      const slugs = contentIndex.map((item) => item.slug);
      const visibilityMap = await getBatchVisibility(slugs);

      // Filter out hidden content
      visibleContent = contentIndex.filter((item) => visibilityMap[item.slug] !== false);
    } catch (error) {
      console.error('Error fetching visibility for sitemap:', error);
      // Fail open - include all content if KV query fails
    }
  }

  // Generate sitemap entries
  const contentEntries: MetadataRoute.Sitemap = visibleContent.map((item) => ({
    url: `${baseUrl}/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: item.category === 'mental-model' ? 0.9 : 0.8,
  }));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn/mental-model`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn/concepts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learn/crates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  return [...staticPages, ...contentEntries];
}
