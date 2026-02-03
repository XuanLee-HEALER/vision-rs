import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  hashContent,
  getCachedCompile,
  setCachedCompile,
  clearCache,
  getCacheStats,
} from './compile-cache';

describe('compile-cache module', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('hashContent', () => {
    it('should generate consistent SHA256 hash for same content', () => {
      const content = '# Hello World\n\nThis is MDX content.';
      const hash1 = hashContent(content);
      const hash2 = hashContent(content);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 produces 64 hex characters
    });

    it('should generate different hashes for different content', () => {
      const hash1 = hashContent('content 1');
      const hash2 = hashContent('content 2');

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty content', () => {
      const hash = hashContent('');
      expect(hash).toHaveLength(64);
    });

    it('should handle unicode content', () => {
      const hash = hashContent('你好世界 🌍');
      expect(hash).toHaveLength(64);
    });
  });

  describe('getCachedCompile / setCachedCompile', () => {
    it('should return null for uncached content', () => {
      const result = getCachedCompile('nonexistent-hash');
      expect(result).toBeNull();
    });

    it('should cache and retrieve content', () => {
      const hash = hashContent('test content');
      const code = 'compiled code';

      setCachedCompile(hash, code);
      const result = getCachedCompile(hash);

      expect(result).toBe(code);
    });

    it('should overwrite existing cache entry', () => {
      const hash = 'test-hash';

      setCachedCompile(hash, 'old code');
      setCachedCompile(hash, 'new code');

      expect(getCachedCompile(hash)).toBe('new code');
    });
  });

  describe('cache expiration', () => {
    it('should expire entries after TTL', () => {
      vi.useFakeTimers();

      const hash = 'test-hash';
      setCachedCompile(hash, 'test code');

      // Move time forward past TTL (5 minutes)
      vi.advanceTimersByTime(6 * 60 * 1000);

      expect(getCachedCompile(hash)).toBeNull();

      vi.useRealTimers();
    });

    it('should return entry before TTL expires', () => {
      vi.useFakeTimers();

      const hash = 'test-hash';
      setCachedCompile(hash, 'test code');

      // Move time forward but not past TTL
      vi.advanceTimersByTime(4 * 60 * 1000);

      expect(getCachedCompile(hash)).toBe('test code');

      vi.useRealTimers();
    });
  });

  describe('cache size limit', () => {
    it('should evict oldest entries when cache is full', () => {
      vi.useFakeTimers();

      // Fill cache to max (100 entries)
      for (let i = 0; i < 100; i++) {
        setCachedCompile(`hash-${i}`, `code-${i}`);
        vi.advanceTimersByTime(10); // Ensure different timestamps
      }

      expect(getCacheStats().size).toBe(100);

      // Add one more entry - should trigger eviction
      setCachedCompile('hash-100', 'code-100');

      // Should have evicted ~20% of entries
      expect(getCacheStats().size).toBeLessThanOrEqual(81);

      // Newest entry should exist
      expect(getCachedCompile('hash-100')).toBe('code-100');

      // Oldest entries should be gone
      expect(getCachedCompile('hash-0')).toBeNull();

      vi.useRealTimers();
    });
  });

  describe('getCacheStats', () => {
    it('should return correct stats', () => {
      setCachedCompile('hash-1', 'code-1');
      setCachedCompile('hash-2', 'code-2');

      const stats = getCacheStats();

      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(100);
      expect(stats.ttlMs).toBe(5 * 60 * 1000);
    });
  });

  describe('clearCache', () => {
    it('should clear all entries', () => {
      setCachedCompile('hash-1', 'code-1');
      setCachedCompile('hash-2', 'code-2');

      expect(getCacheStats().size).toBe(2);

      clearCache();

      expect(getCacheStats().size).toBe(0);
      expect(getCachedCompile('hash-1')).toBeNull();
    });
  });
});
