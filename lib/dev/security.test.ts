import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isDevelopment,
  devGuard,
  validatePath,
  toRelativePath,
  inferTitleFromPath,
  extractCategory,
  pathToUrl,
  LEARN_ROOT,
} from './security';

describe('security module', () => {
  describe('isDevelopment', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should return true in development environment', () => {
      vi.stubEnv('NODE_ENV', 'development');
      expect(isDevelopment()).toBe(true);
    });

    it('should return false in production environment', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(isDevelopment()).toBe(false);
    });

    it('should return false in test environment', () => {
      vi.stubEnv('NODE_ENV', 'test');
      expect(isDevelopment()).toBe(false);
    });
  });

  describe('devGuard', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should return null in development environment', () => {
      vi.stubEnv('NODE_ENV', 'development');
      expect(devGuard()).toBeNull();
    });

    it('should return 404 response in production', () => {
      vi.stubEnv('NODE_ENV', 'production');
      const response = devGuard();
      expect(response).not.toBeNull();
      expect(response?.status).toBe(404);
    });
  });

  describe('validatePath', () => {
    it('should accept valid .mdx files under LEARN_ROOT', () => {
      const result = validatePath('concepts/ownership/page.mdx');
      expect(result).toContain(LEARN_ROOT);
      expect(result.endsWith('page.mdx')).toBe(true);
    });

    it('should normalize paths with leading slashes', () => {
      const result = validatePath('/concepts/ownership/page.mdx');
      expect(result).toContain('concepts/ownership/page.mdx');
    });

    it('should throw on path traversal attempts', () => {
      expect(() => validatePath('../../../etc/passwd')).toThrow('Invalid path');
      expect(() => validatePath('concepts/../../secret.mdx')).toThrow('Invalid path');
    });

    it('should throw on non-.mdx files', () => {
      expect(() => validatePath('concepts/ownership/page.tsx')).toThrow('Invalid path');
      expect(() => validatePath('concepts/ownership/page.js')).toThrow('Invalid path');
      expect(() => validatePath('concepts/ownership/page')).toThrow('Invalid path');
    });

    it('should handle deeply nested valid paths', () => {
      const result = validatePath('crates/web/actix/basics/page.mdx');
      expect(result).toContain('crates/web/actix/basics/page.mdx');
    });

    it('should reject paths trying to escape with encoded characters', () => {
      // Paths with .. should be caught after normalization
      expect(() => validatePath('concepts/../../../page.mdx')).toThrow('Invalid path');
    });
  });

  describe('toRelativePath', () => {
    it('should convert absolute path to relative path', () => {
      const absolutePath = `${LEARN_ROOT}/concepts/ownership/page.mdx`;
      const result = toRelativePath(absolutePath);
      expect(result).toBe('concepts/ownership/page.mdx');
    });

    it('should handle root-level files', () => {
      const absolutePath = `${LEARN_ROOT}/page.mdx`;
      const result = toRelativePath(absolutePath);
      expect(result).toBe('page.mdx');
    });
  });

  describe('inferTitleFromPath', () => {
    it('should convert kebab-case to Title Case', () => {
      expect(inferTitleFromPath('concepts/ownership/page.mdx')).toBe('Ownership');
      expect(inferTitleFromPath('concepts/pattern-matching/page.mdx')).toBe('Pattern Matching');
    });

    it('should handle single-word directories', () => {
      expect(inferTitleFromPath('concepts/borrowing/page.mdx')).toBe('Borrowing');
    });

    it('should handle multi-segment paths', () => {
      expect(inferTitleFromPath('crates/web-framework/basics/page.mdx')).toBe('Basics');
    });

    it('should handle empty or unusual paths', () => {
      expect(inferTitleFromPath('page.mdx')).toBe('Untitled');
    });
  });

  describe('extractCategory', () => {
    it('should extract first directory as category', () => {
      expect(extractCategory('concepts/ownership/page.mdx')).toBe('concepts');
      expect(extractCategory('crates/tokio/basics/page.mdx')).toBe('crates');
      expect(extractCategory('mental-model/intro/page.mdx')).toBe('mental-model');
    });

    it('should return "other" for root-level files', () => {
      expect(extractCategory('page.mdx')).toBe('other');
    });
  });

  describe('pathToUrl', () => {
    it('should convert path to URL without page.mdx suffix', () => {
      expect(pathToUrl('concepts/ownership/page.mdx')).toBe('/learn/concepts/ownership');
      expect(pathToUrl('crates/tokio/basics/page.mdx')).toBe('/learn/crates/tokio/basics');
    });

    it('should handle single-level paths', () => {
      expect(pathToUrl('intro/page.mdx')).toBe('/learn/intro');
    });
  });
});
