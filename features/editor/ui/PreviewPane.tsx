'use client';

import { useEffect, useState, useMemo } from 'react';
import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { MDXProvider } from '@mdx-js/react';
import { useMDXComponents } from '@/mdx-components';

interface PreviewPaneProps {
  code: string | null;
  error: { message: string; line?: number; column?: number } | null;
}

export default function PreviewPane({ code, error }: PreviewPaneProps) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const mdxComponents = useMDXComponents({});

  // 运行编译后的代码
  useEffect(() => {
    if (!code) {
      setMDXContent(null);
      setRuntimeError(null);
      return;
    }

    let isMounted = true;

    const runCode = async () => {
      try {
        setRuntimeError(null);

        // 运行MDX代码
        const { default: Component } = await run(code, {
          ...runtime,
          baseUrl: import.meta.url,
        } as any);

        if (isMounted) {
          setMDXContent(() => Component);
        }
      } catch (err) {
        if (isMounted) {
          setRuntimeError(err instanceof Error ? err.message : 'Runtime error');
          console.error('Runtime error:', err);
        }
      }
    };

    runCode();

    return () => {
      isMounted = false;
    };
  }, [code]);

  // 显示编译错误
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-lg border border-red/30 bg-red/10 p-6">
          <div className="mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold text-red">Compilation Error</h3>
            {error.line !== undefined && (
              <span className="rounded bg-red/20 px-2 py-0.5 text-xs text-red">
                Line {error.line}
                {error.column !== undefined && `:${error.column}`}
              </span>
            )}
          </div>
          <pre className="overflow-x-auto text-sm text-red/90">{error.message}</pre>
        </div>
      </div>
    );
  }

  // 显示运行时错误
  if (runtimeError) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-lg border border-yellow/30 bg-yellow/10 p-6">
          <div className="mb-3 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-yellow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="font-semibold text-yellow">Runtime Error</h3>
          </div>
          <pre className="overflow-x-auto text-sm text-yellow/90">{runtimeError}</pre>
        </div>
      </div>
    );
  }

  // 空状态
  if (!MDXContent) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-subtext0">
          <svg
            className="mx-auto mb-3 h-12 w-12 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p className="text-sm">Preview</p>
          <p className="text-xs">Edit content to see preview</p>
        </div>
      </div>
    );
  }

  // 渲染预览
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl px-8 py-6">
        <MDXProvider components={mdxComponents}>
          <div className="prose prose-invert max-w-none">
            <MDXContent />
          </div>
        </MDXProvider>
      </div>
    </div>
  );
}
