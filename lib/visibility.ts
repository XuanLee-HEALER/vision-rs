import { kv } from '@vercel/kv';

/**
 * KV storage structure for content visibility
 *
 * Key format: "visibility:{slug}"
 * Value: { visible: boolean, updatedAt: string, updatedBy: string }
 */

export interface VisibilityRecord {
  visible: boolean;
  updatedAt: string; // ISO timestamp
  updatedBy: string; // Admin email
}

const VISIBILITY_PREFIX = 'visibility:';

/**
 * Get visibility status for a content item
 * Default to visible if not found in KV
 */
export async function getVisibility(slug: string): Promise<boolean> {
  try {
    const record = await kv.get<VisibilityRecord>(`${VISIBILITY_PREFIX}${slug}`);
    return record?.visible ?? true; // Default visible
  } catch (error) {
    console.error(`Error getting visibility for ${slug}:`, error);
    return true; // Fail open - show content on error
  }
}

/**
 * Set visibility status for a content item
 */
export async function setVisibility(
  slug: string,
  visible: boolean,
  updatedBy: string
): Promise<void> {
  const record: VisibilityRecord = {
    visible,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  await kv.set(`${VISIBILITY_PREFIX}${slug}`, record);
}

/**
 * Get visibility status for multiple items
 * Returns a map of slug -> visible
 */
export async function getBatchVisibility(slugs: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  // Use pipeline for efficient batch operations
  const pipeline = kv.pipeline();
  slugs.forEach((slug) => {
    pipeline.get<VisibilityRecord>(`${VISIBILITY_PREFIX}${slug}`);
  });

  const records = await pipeline.exec();

  slugs.forEach((slug, index) => {
    const record = records[index] as VisibilityRecord | null;
    results[slug] = record?.visible ?? true;
  });

  return results;
}

/**
 * Get all visibility records (for admin dashboard)
 */
export async function getAllVisibility(): Promise<Record<string, VisibilityRecord>> {
  const keys = await kv.keys(`${VISIBILITY_PREFIX}*`);
  const records: Record<string, VisibilityRecord> = {};

  if (keys.length === 0) {
    return records;
  }

  const pipeline = kv.pipeline();
  keys.forEach((key) => {
    pipeline.get<VisibilityRecord>(key);
  });

  const values = await pipeline.exec();

  keys.forEach((key, index) => {
    const slug = key.replace(VISIBILITY_PREFIX, '');
    const record = values[index] as VisibilityRecord | null;
    if (record) {
      records[slug] = record;
    }
  });

  return records;
}

/**
 * Delete visibility record (reset to default visible)
 */
export async function deleteVisibility(slug: string): Promise<void> {
  await kv.del(`${VISIBILITY_PREFIX}${slug}`);
}

/**
 * Batch update visibility for multiple items
 */
export async function batchSetVisibility(
  updates: Array<{ slug: string; visible: boolean }>,
  updatedBy: string
): Promise<void> {
  const pipeline = kv.pipeline();
  const timestamp = new Date().toISOString();

  updates.forEach(({ slug, visible }) => {
    const record: VisibilityRecord = {
      visible,
      updatedAt: timestamp,
      updatedBy,
    };
    pipeline.set(`${VISIBILITY_PREFIX}${slug}`, record);
  });

  await pipeline.exec();
}
