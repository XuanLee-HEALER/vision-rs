'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChapterNavigationProps {
  prevChapter?: {
    title: string;
    href: string;
  };
  nextChapter?: {
    title: string;
    href: string;
  };
}

export default function ChapterNavigation({ prevChapter, nextChapter }: ChapterNavigationProps) {
  const router = useRouter();

  // 预加载相邻章节
  useEffect(() => {
    if (nextChapter) {
      router.prefetch(nextChapter.href);
    }
    if (prevChapter) {
      router.prefetch(prevChapter.href);
    }
  }, [router, prevChapter, nextChapter]);

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-overlay0/30 pt-8">
      <div className="flex-1">
        {prevChapter && (
          <Link
            href={prevChapter.href}
            prefetch={true}
            className="group flex items-center gap-2 text-sm text-subtext0 transition-colors hover:text-blue"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <div>
              <div className="mb-1 text-xs text-overlay2">上一章</div>
              <div className="font-medium">{prevChapter.title}</div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex flex-1 justify-end">
        {nextChapter && (
          <Link
            href={nextChapter.href}
            prefetch={true}
            className="group flex items-center gap-2 text-sm text-subtext0 transition-colors hover:text-blue"
          >
            <div className="text-right">
              <div className="mb-1 text-xs text-overlay2">下一章</div>
              <div className="font-medium">{nextChapter.title}</div>
            </div>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
