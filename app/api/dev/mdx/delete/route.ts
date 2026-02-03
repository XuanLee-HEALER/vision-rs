import { NextRequest, NextResponse } from 'next/server';
import { unlink, rmdir, readdir } from 'fs/promises';
import path from 'path';
import { devGuard, validatePath, validateDirectoryPath, LEARN_ROOT } from '@/lib/dev/security';
import { checkRateLimit } from '@/lib/dev/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * DELETE /api/dev/mdx/delete
 * Body: { path: string, deleteEmptyDir?: boolean }
 * 删除 MDX 文件，可选删除空的父目录
 */
export async function DELETE(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  // 速率限制检查
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 解析请求体
    const body = await request.json();
    const { path: relativePath, deleteEmptyDir = true } = body;

    if (!relativePath) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    // 验证路径安全性（文件必须存在）
    const absolutePath = await validatePath(relativePath);

    // 删除文件
    await unlink(absolutePath);

    let deletedDir: string | null = null;

    // 可选：删除空的父目录
    if (deleteEmptyDir) {
      const parentDir = path.dirname(absolutePath);
      const relativeParentDir = path.relative(LEARN_ROOT, parentDir);

      // 只有当父目录不是 LEARN_ROOT 时才尝试删除
      if (relativeParentDir) {
        try {
          // 验证目录路径安全性
          await validateDirectoryPath(relativeParentDir);

          // 检查目录是否为空
          const entries = await readdir(parentDir);
          if (entries.length === 0) {
            await rmdir(parentDir);
            deletedDir = relativeParentDir;
          }
        } catch {
          // 忽略删除目录的错误（目录不为空或其他原因）
        }
      }
    }

    return NextResponse.json({
      success: true,
      path: relativePath,
      deletedDir,
      message: deletedDir
        ? `Deleted ${relativePath} and empty directory ${deletedDir}`
        : `Deleted ${relativePath}`,
    });
  } catch (error) {
    console.error('Error deleting MDX file:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid path')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      if (error.message.includes('does not exist')) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
