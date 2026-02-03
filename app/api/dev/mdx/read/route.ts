import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { devGuard, validatePath } from '@/lib/dev/security';
import { checkRateLimit } from '@/lib/dev/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/dev/mdx/read?path=concepts/ownership/page.mdx
 * 读取指定MDX文件的内容
 */
export async function GET(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  // 速率限制检查
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 获取路径参数
    const { searchParams } = new URL(request.url);
    const relativePath = searchParams.get('path');

    if (!relativePath) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    // 验证路径安全性
    const absolutePath = await validatePath(relativePath);

    // 读取文件内容
    const content = await readFile(absolutePath, 'utf-8');

    return NextResponse.json({
      path: relativePath,
      content,
    });
  } catch (error) {
    console.error('Error reading MDX file:', error);

    if (error instanceof Error) {
      // 文件不存在返回 404
      if (error.message.includes('file does not exist')) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      // 路径安全问题返回 403
      if (error.message.includes('Invalid path')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      // fs 层面的文件不存在
      if ('code' in error && error.code === 'ENOENT') {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
