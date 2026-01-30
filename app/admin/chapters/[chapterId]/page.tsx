'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChapterData {
  id: string;
  title: string;
  part: string;
  partTitle: string;
  understanding: string;
}

export default function EditChapterPage() {
  const params = useParams();
  const chapterId = params?.chapterId as string;
  const router = useRouter();

  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId]);

  const fetchChapter = async () => {
    try {
      const res = await fetch(`/api/admin/chapters/${chapterId}`);

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch chapter');
      }

      const data: ChapterData = await res.json();
      setChapterData(data);
      setContent(data.understanding || '');
      setOriginalContent(data.understanding || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!chapterId || content === originalContent) return;

    setIsSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/chapters/${chapterId}/understanding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setOriginalContent(content);
      setSaveSuccess(true);

      // 3秒后隐藏成功提示
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (content !== originalContent) {
      if (!confirm('您有未保存的更改，确定要放弃吗？')) {
        return;
      }
    }
    router.push('/admin/chapters');
  };

  const hasUnsavedChanges = content !== originalContent;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-subtext0">加载中...</div>
      </div>
    );
  }

  if (error && !chapterData) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="rounded-lg bg-red/10 border border-red/30 p-4 text-red max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-overlay0 bg-surface0 px-6 py-4">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
          <div className="flex-1">
            <Link
              href="/admin/chapters"
              className="mb-2 inline-flex items-center text-sm text-subtext0 hover:text-text"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              返回章节列表
            </Link>
            <h1 className="text-xl font-bold text-text">{chapterData?.title}</h1>
            <p className="text-sm text-overlay2 mt-1">{chapterId}</p>
          </div>

          <div className="flex gap-3">
            {hasUnsavedChanges && (
              <span className="flex items-center text-sm text-yellow">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                有未保存的更改
              </span>
            )}

            {saveSuccess && (
              <span className="flex items-center text-sm text-green">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                保存成功
              </span>
            )}

            <button
              onClick={handleCancel}
              className="rounded bg-surface1 px-4 py-2 text-sm text-text hover:bg-surface2 transition-colors"
            >
              取消
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="rounded bg-blue px-4 py-2 text-sm text-base font-medium hover:bg-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="border-b border-red/30 bg-red/10 px-6 py-3">
          <div className="mx-auto max-w-screen-2xl text-sm text-red">{error}</div>
        </div>
      )}

      {/* Editor & Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="w-1/2 flex flex-col border-r border-overlay0">
          <div className="border-b border-overlay0 bg-mantle px-6 py-3">
            <h2 className="text-sm font-semibold text-text">Markdown 编辑器</h2>
            <p className="text-xs text-subtext0 mt-1">支持 Markdown 语法，实时预览在右侧</p>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none bg-base p-6 font-mono text-sm text-text focus:outline-none"
            placeholder="在此输入「我的理解」部分的内容..."
          />
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 flex flex-col">
          <div className="border-b border-overlay0 bg-mantle px-6 py-3">
            <h2 className="text-sm font-semibold text-text">实时预览</h2>
            <p className="text-xs text-subtext0 mt-1">预览内容将显示在页面上的样式</p>
          </div>
          <div className="flex-1 overflow-auto bg-base p-6">
            <article className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none">
              {content ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(content),
                  }}
                />
              ) : (
                <p className="text-overlay2 italic">预览区域 - 在左侧输入内容以查看效果</p>
              )}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

// 简单的 Markdown 渲染函数（基础支持）
function renderMarkdown(markdown: string): string {
  let html = markdown;

  // 转义 HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 代码块
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 列表
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>');

  // 段落
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  return html;
}
