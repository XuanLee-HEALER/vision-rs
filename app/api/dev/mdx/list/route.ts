import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';
import {
  devGuard,
  LEARN_ROOT,
  toRelativePath,
  inferTitleFromPath,
  extractCategory,
  pathToUrl,
} from '@/lib/dev/security';
import { checkRateLimit } from '@/lib/dev/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface FileListItem {
  path: string; // 相对路径
  title: string;
  category: string;
  url: string;
}

/**
 * 递归扫描目录，找出所有page.mdx文件
 */
async function scanMDXFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // 递归扫描子目录
        const subFiles = await scanMDXFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name === 'page.mdx') {
        // 找到page.mdx文件
        files.push(fullPath);
      }
    }
  } catch (error) {
    // 忽略无法访问的目录
    console.error('Error scanning directory:', dir, error);
  }

  return files;
}

/**
 * GET /api/dev/mdx/list
 * 列出所有可编辑的MDX文件
 */
export async function GET(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  // 速率限制检查
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 扫描所有page.mdx文件
    const absolutePaths = await scanMDXFiles(LEARN_ROOT);

    // 转换为相对路径并添加元数据
    const fileList: FileListItem[] = absolutePaths.map((absolutePath) => {
      const relativePath = toRelativePath(absolutePath);
      return {
        path: relativePath,
        title: inferTitleFromPath(relativePath),
        category: extractCategory(relativePath),
        url: pathToUrl(relativePath),
      };
    });

    // 按category和path排序
    fileList.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.path.localeCompare(b.path);
    });

    return NextResponse.json({
      files: fileList,
      total: fileList.length,
    });
  } catch (error) {
    console.error('Error listing MDX files:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
