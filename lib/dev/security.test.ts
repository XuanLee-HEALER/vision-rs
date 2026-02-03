import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isDevelopment,
  devGuard,
  validatePath,
  validateWritePath,
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
    // 使用真实存在的文件路径进行测试
    it('should accept valid .mdx files under LEARN_ROOT', async () => {
      const result = await validatePath('data-structures/page.mdx');
      expect(result).toContain('data-structures/page.mdx');
      expect(result.endsWith('page.mdx')).toBe(true);
    });

    it('should normalize paths with leading slashes', async () => {
      const result = await validatePath('/data-structures/page.mdx');
      expect(result).toContain('data-structures/page.mdx');
    });

    it('should throw on path traversal attempts', async () => {
      await expect(validatePath('../../../etc/passwd')).rejects.toThrow('Invalid path');
      await expect(validatePath('data-structures/../../secret.mdx')).rejects.toThrow(
        'Invalid path'
      );
    });

    it('should throw on non-.mdx files', async () => {
      await expect(validatePath('data-structures/page.tsx')).rejects.toThrow('Invalid path');
      await expect(validatePath('data-structures/page.js')).rejects.toThrow('Invalid path');
      await expect(validatePath('data-structures/page')).rejects.toThrow('Invalid path');
    });

    it('should accept another valid path', async () => {
      const result = await validatePath('rust-philosophy/page.mdx');
      expect(result).toContain('rust-philosophy/page.mdx');
    });

    it('should reject paths trying to escape with encoded characters', async () => {
      // Paths with .. should be caught after normalization
      await expect(validatePath('data-structures/../../../page.mdx')).rejects.toThrow(
        'Invalid path'
      );
    });

    it('should throw for non-existent files', async () => {
      await expect(validatePath('nonexistent/path/page.mdx')).rejects.toThrow('Invalid path');
    });
  });

  describe('validateWritePath', () => {
    // 允许文件不存在（用于创建新文件）
    it('should accept new .mdx files in existing directories', async () => {
      const result = await validateWritePath('data-structures/new-file.mdx');
      expect(result).toContain('data-structures/new-file.mdx');
      expect(result.endsWith('new-file.mdx')).toBe(true);
    });

    it('should accept existing files', async () => {
      const result = await validateWritePath('data-structures/page.mdx');
      expect(result).toContain('data-structures/page.mdx');
    });

    it('should throw on path traversal attempts', async () => {
      await expect(validateWritePath('../../../etc/passwd')).rejects.toThrow('Invalid path');
      await expect(validateWritePath('data-structures/../../secret.mdx')).rejects.toThrow(
        'Invalid path'
      );
    });

    it('should throw on non-.mdx files', async () => {
      await expect(validateWritePath('data-structures/new.tsx')).rejects.toThrow('Invalid path');
      await expect(validateWritePath('data-structures/new.js')).rejects.toThrow('Invalid path');
    });

    it('should throw for non-existent parent directories', async () => {
      await expect(validateWritePath('nonexistent-dir/page.mdx')).rejects.toThrow(
        'parent directory does not exist'
      );
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
