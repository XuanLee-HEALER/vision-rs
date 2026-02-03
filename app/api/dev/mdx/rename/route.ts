import { NextRequest, NextResponse } from 'next/server';
import { rename, mkdir, access, readdir, rmdir } from 'fs/promises';
import path from 'path';
import {
  devGuard,
  validatePath,
  validateCreatePath,
  validateDirectoryPath,
  LEARN_ROOT,
} from '@/lib/dev/security';
import { checkRateLimit } from '@/lib/dev/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/dev/mdx/rename
 * Body: { oldPath: string, newPath: string }
 * 重命名/移动 MDX 文件
 */
export async function POST(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  // 速率限制检查
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 解析请求体
    const body = await request.json();
    const { oldPath, newPath } = body;

    if (!oldPath || !newPath) {
      return NextResponse.json({ error: 'Missing oldPath or newPath' }, { status: 400 });
    }

    if (oldPath === newPath) {
      return NextResponse.json({ error: 'Source and destination are the same' }, { status: 400 });
    }

    // 验证源路径安全性（文件必须存在）
    const absoluteOldPath = await validatePath(oldPath);

    // 验证目标路径安全性（允许不存在）
    const absoluteNewPath = await validateCreatePath(newPath);

    // 检查目标文件是否已存在
    try {
      await access(absoluteNewPath);
      return NextResponse.json({ error: 'Destination file already exists' }, { status: 409 });
    } catch {
      // 目标文件不存在，可以继续
    }

    // 确保目标目录存在
    const targetDir = path.dirname(absoluteNewPath);
    await mkdir(targetDir, { recursive: true });

    // 执行重命名
    await rename(absoluteOldPath, absoluteNewPath);

    // 尝试删除空的源目录
    let deletedDir: string | null = null;
    const sourceDir = path.dirname(absoluteOldPath);
    const relativeSourceDir = path.relative(LEARN_ROOT, sourceDir);

    if (relativeSourceDir) {
      try {
        await validateDirectoryPath(relativeSourceDir);

        const entries = await readdir(sourceDir);
        if (entries.length === 0) {
          await rmdir(sourceDir);
          deletedDir = relativeSourceDir;
        }
      } catch {
        // 忽略删除目录的错误
      }
    }

    return NextResponse.json({
      success: true,
      oldPath,
      newPath,
      deletedDir,
      message: deletedDir
        ? `Renamed ${oldPath} to ${newPath} and removed empty directory ${deletedDir}`
        : `Renamed ${oldPath} to ${newPath}`,
    });
  } catch (error) {
    console.error('Error renaming MDX file:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid path')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes('does not exist')) {
        return NextResponse.json({ error: 'Source file not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Failed to rename file' }, { status: 500 });
  }
}
