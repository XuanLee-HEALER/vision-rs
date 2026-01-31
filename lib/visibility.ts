import { get } from '@vercel/edge-config';

/**
 * Edge Config storage structure for content visibility
 *
 * Key: "visibility"
 * Value: Record<slug, VisibilityRecord>
 */

export interface VisibilityRecord {
  visible: boolean;
  updatedAt: string; // ISO timestamp
  updatedBy: string; // Admin email
}

type VisibilityMap = Record<string, VisibilityRecord>;

/**
 * Get all visibility records from Edge Config
 */
async function getAllVisibilityFromEdgeConfig(): Promise<VisibilityMap> {
  try {
    const data = await get<VisibilityMap>('visibility');
    return data || {};
  } catch (error) {
    console.error('Error reading visibility from Edge Config:', error);
    return {};
  }
}

/**
 * Update Edge Config via Vercel API
 */
async function updateEdgeConfigViaAPI(data: VisibilityMap): Promise<void> {
  const edgeConfigId = process.env.EDGE_CONFIG?.match(/ecfg_[a-z0-9]+/)?.[0];
  const token = process.env.VERCEL_API_TOKEN;

  if (!edgeConfigId || !token) {
    throw new Error(
      'Missing EDGE_CONFIG or VERCEL_API_TOKEN. Cannot update Edge Config without these credentials.'
    );
  }

  const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'upsert',
          key: 'visibility',
          value: data,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update Edge Config: ${error}`);
  }
}

/**
 * Get visibility status for a content item
 */
export async function getVisibility(slug: string): Promise<boolean> {
  try {
    const allVisibility = await getAllVisibilityFromEdgeConfig();
    return allVisibility[slug]?.visible ?? true;
  } catch (error) {
    console.error(`Error getting visibility for ${slug}:`, error);
    return true;
  }
}

/**
 * Get visibility status for multiple items
 */
export async function getBatchVisibility(slugs: string[]): Promise<Record<string, boolean>> {
  const allVisibility = await getAllVisibilityFromEdgeConfig();
  const results: Record<string, boolean> = {};

  slugs.forEach((slug) => {
    results[slug] = allVisibility[slug]?.visible ?? true;
  });

  return results;
}

/**
 * Get all visibility records
 */
export async function getAllVisibility(): Promise<Record<string, VisibilityRecord>> {
  return await getAllVisibilityFromEdgeConfig();
}

/**
 * Set visibility status for a content item
 */
export async function setVisibility(
  slug: string,
  visible: boolean,
  updatedBy: string
): Promise<void> {
  const allVisibility = await getAllVisibilityFromEdgeConfig();

  allVisibility[slug] = {
    visible,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  await updateEdgeConfigViaAPI(allVisibility);
}

/**
 * Delete visibility record (reset to default visible)
 */
export async function deleteVisibility(slug: string): Promise<void> {
  const allVisibility = await getAllVisibilityFromEdgeConfig();
  delete allVisibility[slug];
  await updateEdgeConfigViaAPI(allVisibility);
}

/**
 * Batch update visibility for multiple items
 */
export async function batchSetVisibility(
  updates: Array<{ slug: string; visible: boolean }>,
  updatedBy: string
): Promise<void> {
  const allVisibility = await getAllVisibilityFromEdgeConfig();
  const timestamp = new Date().toISOString();

  updates.forEach(({ slug, visible }) => {
    allVisibility[slug] = {
      visible,
      updatedAt: timestamp,
      updatedBy,
    };
  });

  await updateEdgeConfigViaAPI(allVisibility);
}
