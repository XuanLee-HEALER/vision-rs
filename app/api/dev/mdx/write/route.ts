import { NextRequest, NextResponse } from 'next/server';
import { writeFile, rename, unlink } from 'fs/promises';
import { devGuard, validatePath } from '@/lib/dev/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PUT /api/dev/mdx/write
 * Body: { path: string, content: string }
 * 写入MDX文件内容（原子操作）
 */
export async function PUT(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  try {
    // 解析请求体
    const body = await request.json();
    const { path: relativePath, content } = body;

    if (!relativePath || typeof content !== 'string') {
      return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
    }

    // 验证路径安全性
    const absolutePath = validatePath(relativePath);

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
