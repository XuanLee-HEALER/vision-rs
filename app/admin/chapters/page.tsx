'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Chapter {
  id: string;
  title: string;
  part: string;
  partTitle: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchChapters = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chapters');

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch chapters');
      }

      const data = await res.json();
      setChapters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapters');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // 按 part 分组
  const groupedChapters = chapters.reduce(
    (acc, chapter) => {
      const partKey = chapter.part || 'other';
      if (!acc[partKey]) {
        acc[partKey] = {
          title: chapter.partTitle || partKey,
          chapters: [],
        };
      }
      acc[partKey].chapters.push(chapter);
      return acc;
    },
    {} as Record<string, { title: string; chapters: Chapter[] }>
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="text-center text-subtext0">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-8">
        <div className="rounded-lg bg-red/10 border border-red/30 p-4 text-red">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/admin"
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
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-text">章节管理</h1>
          <p className="mt-2 text-subtext0">
            共 {chapters.length} 个章节 · 点击章节编辑"我的理解"部分
          </p>
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-8">
        {Object.entries(groupedChapters).map(([partKey, { title, chapters }]) => (
          <div key={partKey}>
            <h2 className="mb-4 text-xl font-semibold text-text">{title}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/admin/chapters/${chapter.id}`}
                  className="group block rounded-lg border border-overlay0 bg-surface0 p-4 transition-all hover:bg-surface1 hover:shadow-lg"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-text group-hover:text-blue transition-colors">
                      {chapter.title}
                    </h3>
                    <svg
                      className="h-5 w-5 text-overlay2 group-hover:text-blue transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-overlay2">{chapter.id}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="rounded-lg border border-overlay0 bg-surface0 p-12 text-center">
          <p className="text-subtext0">暂无章节</p>
        </div>
      )}
    </div>
  );
}
