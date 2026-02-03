import { NextRequest, NextResponse } from 'next/server';
import { writeFile, rename, unlink } from 'fs/promises';
import { devGuard, validateWritePath } from '@/lib/dev/security';
import { checkRateLimit } from '@/lib/dev/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Maximum file size: 1MB
const MAX_FILE_SIZE = 1024 * 1024;

/**
 * PUT /api/dev/mdx/write
 * Body: { path: string, content: string }
 * 写入MDX文件内容（原子操作）
 */
export async function PUT(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  // 速率限制检查
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 解析请求体
    const body = await request.json();
    const { path: relativePath, content } = body;

    if (!relativePath || typeof content !== 'string') {
      return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
    }

    // 文件大小检查
    if (content.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          maxSize: MAX_FILE_SIZE,
          actualSize: content.length,
        },
        { status: 413 }
      );
    }

    // 验证写入路径安全性（允许文件不存在，支持创建新文件）
    const absolutePath = await validateWritePath(relativePath);

    // 原子写入：先写临时文件，再重命名
    const tempPath = `${absolutePath}.tmp`;

    try {
      // 写入临时文件
      await writeFile(tempPath, content, 'utf-8');

      // 重命名为目标文件（原子操作）
      await rename(tempPath, absolutePath);

      return NextResponse.json({
        success: true,
        path: relativePath,
        size: content.length,
      });
    } catch (error) {
      // 清理临时文件
      try {
        await unlink(tempPath);
      } catch {
        // 忽略清理错误
      }
      throw error;
    }
  } catch (error) {
    console.error('Error writing MDX file:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid path')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
