import { NextRequest, NextResponse } from 'next/server';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { devGuard } from '@/lib/dev/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CompileError {
  message: string;
  line?: number;
  column?: number;
  position?: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
}

/**
 * POST /api/dev/mdx/compile
 * Body: { path: string, mdx: string }
 * 编译MDX为可执行的React组件代码
 */
export async function POST(request: NextRequest) {
  // 开发环境检查
  const guardResponse = devGuard();
  if (guardResponse) return guardResponse;

  try {
    // 解析请求体
    const body = await request.json();
    const { mdx, path: filePath } = body;

    if (typeof mdx !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid mdx content' }, { status: 400 });
    }

    try {
      // 编译MDX（与站点编译配置一致）
      const result = await compile(mdx, {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
        outputFormat: 'function-body', // 输出可在浏览器执行的函数体
        development: true, // 开发模式，包含更多调试信息
      });

      return NextResponse.json({
        success: true,
        code: String(result.value),
        path: filePath,
      });
    } catch (error) {
      // 编译错误
      const compileError: CompileError = {
        message: error instanceof Error ? error.message : 'Compilation failed',
      };

      // 提取位置信息（如果有）
      if (error && typeof error === 'object') {
        const errObj = error as Record<string, unknown>;

        if (
          errObj.position &&
          typeof errObj.position === 'object' &&
          errObj.position !== null &&
          'start' in errObj.position
        ) {
          const position = errObj.position as CompileError['position'];
          compileError.position = position;
          if (position?.start) {
            compileError.line = position.start.line;
            compileError.column = position.start.column;
          }
        } else if (typeof errObj.line === 'number') {
          compileError.line = errObj.line;
          if (typeof errObj.column === 'number') {
            compileError.column = errObj.column;
          }
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: compileError,
          path: filePath,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in compile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
