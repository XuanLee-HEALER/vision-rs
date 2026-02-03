import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';
import { devGuard, validateCreatePath, inferTitleFromPath } from '@/lib/dev/security';
import { checkRateLimit } from '@/lib/dev/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Maximum file size: 1MB
const MAX_FILE_SIZE = 1024 * 1024;

/**
 * 生成默认的 MDX 文件内容
 */
function generateDefaultContent(title: string): string {
  return `export const metadata = {
  title: '${title}',
  description: '在此添加描述',
};

# ${title}

在此开始编写内容...
`;
}

/**
 * POST /api/dev/mdx/create
 * Body: { path: string, content?: string, createDirectory?: boolean }
 * 创建新的 MDX 文件
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
    const { path: relativePath, content, createDirectory = true } = body;

    if (!relativePath) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    // 验证创建路径安全性
    const absolutePath = await validateCreatePath(relativePath);

    // 检查文件是否已存在
    try {
      await access(absolutePath);
      return NextResponse.json({ error: 'File already exists' }, { status: 409 });
    } catch {
      // 文件不存在，可以继续创建
    }

    // 获取父目录
    const parentDir = path.dirname(absolutePath);

    // 如果需要创建目录
    if (createDirectory) {
      await mkdir(parentDir, { recursive: true });
    } else {
      // 检查父目录是否存在
      try {
        await access(parentDir);
      } catch {
        return NextResponse.json({ error: 'Parent directory does not exist' }, { status: 400 });
      }
    }

    // 确定文件内容
    const title = inferTitleFromPath(relativePath);
    const fileContent = content ?? generateDefaultContent(title);

    // 文件大小检查
    if (fileContent.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          maxSize: MAX_FILE_SIZE,
          actualSize: fileContent.length,
        },
        { status: 413 }
      );
    }

    // 写入文件
    await writeFile(absolutePath, fileContent, 'utf-8');

    return NextResponse.json({
      success: true,
      path: relativePath,
      size: fileContent.length,
      message: `Created ${relativePath}`,
    });
  } catch (error) {
    console.error('Error creating MDX file:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid path')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}
