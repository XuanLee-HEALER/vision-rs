import { Metadata } from 'next';

/**
 * Generate SEO metadata based on visibility status
 * Adds noindex/nofollow when content is hidden
 */
export function generateVisibilityMetadata(visible: boolean, baseMetadata?: Metadata): Metadata {
  if (visible) {
    return baseMetadata || {};
  }

  // Content is hidden - prevent indexing
  return {
    ...baseMetadata,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

/**
 * Helper to merge visibility metadata with page metadata
 */
export function withVisibilityCheck(visible: boolean, metadata: Metadata): Metadata {
  return generateVisibilityMetadata(visible, metadata);
}
