import { NextRequest, NextResponse } from 'next/server';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { devGuard } from '@/lib/dev/security';
import { hashContent, getCachedCompile, setCachedCompile } from '@/lib/dev/compile-cache';
import { checkRateLimit } from '@/lib/dev/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PositionInfo {
  start: { line: number; column: number; offset: number };
  end: { line: number; column: number; offset: number };
}

interface CompileError {
  message: string;
  line?: number;
  column?: number;
  position?: PositionInfo;
  snippet?: string;
}

interface MDXCompileError extends Error {
  position?: PositionInfo;
  line?: number;
  column?: number;
}

/**
 * Type guard for MDX compile errors with position information
 */
function isMDXCompileError(error: unknown): error is MDXCompileError {
  if (!(error instanceof Error)) return false;
  const e = error as MDXCompileError;
  return (
    (typeof e.position === 'object' && e.position !== null && 'start' in e.position) ||
    typeof e.line === 'number'
  );
}

/**
 * 预处理 MDX 内容，移除 export 语句（function-body 模式不支持）
 * 这些 export 语句在预览时不需要
 */
function preprocessMDX(mdx: string): string {
  let processed = mdx;

  // 移除 export const metadata = {...}; 语句（可能跨越多行）
  // 查找 "export const metadata = {" 的位置
  const metadataStart = processed.indexOf('export const metadata');
  if (metadataStart !== -1) {
    // 找到开始的 {
    const braceStart = processed.indexOf('{', metadataStart);
    if (braceStart !== -1) {
      // 找到匹配的 }; （计数括号）
      let braceCount = 1;
      let i = braceStart + 1;
      while (i < processed.length && braceCount > 0) {
        if (processed[i] === '{') braceCount++;
        else if (processed[i] === '}') braceCount--;
        i++;
      }
      // 跳过可能的分号和空白
      while (i < processed.length && /[\s;]/.test(processed[i])) {
        i++;
      }
      // 移除整个 metadata export 块
      processed = processed.slice(0, metadataStart) + processed.slice(i);
    }
  }

  // 移除其他简单的单行 export const 语句
  processed = processed.replace(/^export\s+const\s+\w+\s*=\s*[^{].*?;\s*$/gm, '');

  return processed.trim();
}

/**
 * Extract error snippet from source MDX content
 */
function getErrorSnippet(mdx: string, line: number, contextLines = 3): string {
  const lines = mdx.split('\n');
  const startLine = Math.max(0, line - contextLines - 1);
  const endLine = Math.min(lines.length, line + contextLines);

  return lines
    .slice(startLine, endLine)
    .map((content, index) => {
      const lineNum = startLine + index + 1;
      const marker = lineNum === line ? '>' : ' ';
      return `${marker} ${lineNum.toString().padStart(3)} | ${content}`;
    })
    .join('\n');
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

  // 速率限制检查
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // 解析请求体
    const body = await request.json();
    const { mdx, path: filePath } = body;

    if (typeof mdx !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid mdx content' }, { status: 400 });
    }

    // Check cache first
    const contentHash = hashContent(mdx);
    const cachedCode = getCachedCompile(contentHash);

    if (cachedCode) {
      return NextResponse.json({
        success: true,
        code: cachedCode,
        path: filePath,
        cached: true,
      });
    }

    try {
      // 预处理 MDX：移除 export 语句（function-body 模式不支持）
      const processedMdx = preprocessMDX(mdx);

      // 编译MDX（与站点编译配置一致）
      const result = await compile(processedMdx, {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
        outputFormat: 'function-body', // 输出可在浏览器执行的函数体
        development: true, // 开发模式，生成 _jsxDEV 调用以获得更好的调试信息
      });

      const code = String(result.value);

      // Store in cache
      setCachedCompile(contentHash, code);

      return NextResponse.json({
        success: true,
        code,
        path: filePath,
        cached: false,
      });
    } catch (error) {
      // 编译错误 - 使用类型守卫提取详细信息
      const compileError: CompileError = {
        message: error instanceof Error ? error.message : 'Compilation failed',
      };

      // 使用类型守卫提取位置信息
      if (isMDXCompileError(error)) {
        if (error.position?.start) {
          compileError.position = error.position;
          compileError.line = error.position.start.line;
          compileError.column = error.position.start.column;
        } else if (typeof error.line === 'number') {
          compileError.line = error.line;
          compileError.column = error.column;
        }

        // 添加代码片段
        if (compileError.line) {
          compileError.snippet = getErrorSnippet(mdx, compileError.line);
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
