'use client';

import Link from 'next/link';
import { useSearch } from '@/components/search/SearchProvider.client';

export default function Banner() {
  const { open } = useSearch();

  return (
    <header id="site-header" className="h-14 border-b border-overlay0/10 bg-mantle">
      <div className="flex h-full items-center gap-3">
        {/* Logo - 固定左侧，与侧边栏内容对齐 (p-6 = 24px) */}
        <Link href="/" className="flex shrink-0 items-center gap-2 pl-6">
          {/* 移动端：只显示 V-RS */}
          <span className="text-sm font-medium text-text md:hidden">V-RS</span>
          {/* 桌面端：显示完整 Logo */}
          <span className="hidden text-sm font-medium text-text md:block">Vision-RS</span>
          <span className="hidden text-xs text-subtext0 md:block">v1.0</span>
        </Link>

        {/* Search - 居中，响应式宽度 */}
        <div className="flex flex-1 items-center justify-center px-4">
          <button
            onClick={open}
            className="flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-overlay0/30 bg-surface0/30 px-3 text-sm text-subtext0 transition-colors hover:border-overlay0/50"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="truncate">搜索文档...</span>
            <kbd className="ml-auto hidden text-xs md:inline">⌘K</kbd>
          </button>
        </div>

        {/* GitHub - 固定右侧 */}
        <a
          href="https://github.com/XuanLee-HEALER/vision-rs"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 pr-6 text-subtext0 transition-colors hover:text-text"
          aria-label="GitHub"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </header>
  );
}
