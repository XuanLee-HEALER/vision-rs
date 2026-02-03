import { createHash } from 'crypto';

interface CacheEntry {
  code: string;
  timestamp: number;
}

interface CompileCache {
  entries: Map<string, CacheEntry>;
}

const CACHE_MAX_SIZE = 100;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Global cache that persists across HMR reloads
 */
const globalCache: CompileCache = (globalThis as unknown as { __mdxCompileCache?: CompileCache })
  .__mdxCompileCache || {
  entries: new Map(),
};

// Persist cache reference on globalThis for HMR
(globalThis as unknown as { __mdxCompileCache: CompileCache }).__mdxCompileCache = globalCache;

/**
 * Generate SHA256 hash of content
 */
export function hashContent(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Get cached compile result
 * @returns compiled code if found and not expired, null otherwise
 */
export function getCachedCompile(contentHash: string): string | null {
  const entry = globalCache.entries.get(contentHash);

  if (!entry) {
    return null;
  }

  // Check if expired
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    globalCache.entries.delete(contentHash);
    return null;
  }

  return entry.code;
}

/**
 * Store compile result in cache
 */
export function setCachedCompile(contentHash: string, code: string): void {
  // Evict oldest entries if cache is full
  if (globalCache.entries.size >= CACHE_MAX_SIZE) {
    const sortedEntries = Array.from(globalCache.entries.entries()).sort(
      ([, a], [, b]) => a.timestamp - b.timestamp
    );

    // Remove oldest 20%
    const toRemove = Math.ceil(CACHE_MAX_SIZE * 0.2);
    for (let i = 0; i < toRemove && i < sortedEntries.length; i++) {
      globalCache.entries.delete(sortedEntries[i][0]);
    }
  }

  globalCache.entries.set(contentHash, {
    code,
    timestamp: Date.now(),
  });
}

/**
 * Clear the entire cache (useful for testing)
 */
export function clearCache(): void {
  globalCache.entries.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; maxSize: number; ttlMs: number } {
  return {
    size: globalCache.entries.size,
    maxSize: CACHE_MAX_SIZE,
    ttlMs: CACHE_TTL_MS,
  };
}
