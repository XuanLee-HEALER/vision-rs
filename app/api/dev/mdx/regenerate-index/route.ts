import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { devGuard } from '@/lib/dev/security';
import { checkRateLimit } from '@/lib/dev/rate-limit';

const execAsync = promisify(exec);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/dev/mdx/regenerate-index
 * 重新生成学习内容索引
 */
export async function POST(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  // 速率限制检查
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 运行索引生成脚本
    const { stdout } = await execAsync('pnpm generate-index', {
      cwd: process.cwd(),
      timeout: 30000, // 30秒超时
    });

    // 从输出中提取索引文件数量（如果有的话）
    const filesMatch = stdout.match(/(\d+)\s+files?/i);
    const filesIndexed = filesMatch ? parseInt(filesMatch[1], 10) : null;

    return NextResponse.json({
      success: true,
      filesIndexed,
      output: stdout.trim(),
      message: 'Index regenerated successfully',
    });
  } catch (error) {
    console.error('Error regenerating index:', error);

    if (error instanceof Error && 'stderr' in error) {
      const execError = error as { stderr: string };
      return NextResponse.json(
        {
          error: 'Failed to regenerate index',
          details: execError.stderr,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: 'Failed to regenerate index' }, { status: 500 });
  }
}
