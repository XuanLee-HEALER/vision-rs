'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
  headings: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  'mental-model': 'Rust 心智世界',
  concepts: 'Rust 核心概念',
  crates: '三方库原理',
  'data-structures': '数据结构',
  network: '网络编程 & 分布式',
};

const CATEGORY_COLORS: Record<string, string> = {
  'mental-model': 'bg-blue/10 text-blue border-blue/30',
  concepts: 'bg-green/10 text-green border-green/30',
  crates: 'bg-yellow/10 text-yellow border-yellow/30',
  'data-structures': 'bg-pink/10 text-pink border-pink/30',
  network: 'bg-mauve/10 text-mauve border-mauve/30',
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Load search index
  const loadSearchIndex = useCallback(() => {
    setIsLoading(true);
    setLoadError(false);
    fetch('/search-index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSearchIndex(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load search index:', err);
        setLoadError(true);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isOpen && searchIndex.length === 0 && !loadError) {
      loadSearchIndex();
    }
  }, [isOpen, searchIndex.length, loadError, loadSearchIndex]);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    if (searchIndex.length === 0) return null;

    return new Fuse(searchIndex, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'description', weight: 2 },
        { name: 'headings', weight: 1.5 },
        { name: 'content', weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  }, [searchIndex]);

  // Perform search
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const fuseResults = fuse.search(query, { limit: 10 });
    setResults(fuseResults.map((r) => r.item));
    setSelectedIndex(0);
  }, [query, fuse]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            router.push(`/${results[selectedIndex].slug}`);
            onClose();
          }
          break;
      }
    },
    [isOpen, results, selectedIndex, router, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-crust/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-lg border border-overlay0 bg-mantle shadow-xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-overlay0 px-4 py-3">
          <svg
            className="h-5 w-5 shrink-0 text-subtext0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            autoFocus
            placeholder="搜索文档..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base text-text outline-none placeholder:text-subtext0"
          />
          <kbd className="rounded border border-overlay0 px-2 py-1 text-xs text-subtext0">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loadError ? (
            <div className="py-8 text-center">
              <div className="mb-2 text-sm text-red">搜索索引加载失败</div>
              <div className="mb-4 text-xs text-subtext0">请检查网络连接后重试</div>
              <button
                onClick={loadSearchIndex}
                className="rounded-md bg-blue px-4 py-2 text-sm text-base transition-colors hover:bg-blue/90"
              >
                重新加载
              </button>
            </div>
          ) : isLoading ? (
            <div className="py-8 text-center text-sm text-subtext0">加载搜索索引...</div>
          ) : query.trim() && results.length === 0 ? (
            <div className="py-8 text-center text-sm text-subtext0">未找到相关内容</div>
          ) : !query.trim() ? (
            <div className="py-8 text-center text-sm text-subtext0">
              输入关键词开始搜索
              <div className="mt-2 text-xs text-subtext1">支持搜索标题、描述和正文内容</div>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => (
                <button
                  key={result.slug}
                  ref={index === selectedIndex ? selectedItemRef : null}
                  onClick={() => {
                    router.push(`/${result.slug}`);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full rounded-md p-3 text-left transition-colors ${
                    index === selectedIndex ? 'bg-surface0' : 'hover:bg-surface0/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="font-medium text-text">{result.title}</div>
                      <div className="line-clamp-2 text-xs text-subtext1">{result.description}</div>
                    </div>
                    <span
                      className={`shrink-0 rounded border px-2 py-1 text-xs ${
                        CATEGORY_COLORS[result.category] ||
                        'bg-overlay0/10 text-text border-overlay0/30'
                      }`}
                    >
                      {CATEGORY_LABELS[result.category] || result.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="flex items-center justify-between border-t border-overlay0 px-4 py-2 text-xs text-subtext0">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-overlay0 px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded border border-overlay0 px-1.5 py-0.5">↓</kbd>
                <span className="ml-1">导航</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-overlay0 px-1.5 py-0.5">Enter</kbd>
                <span className="ml-1">打开</span>
              </span>
            </div>
            <span>{results.length} 个结果</span>
          </div>
        )}
      </div>
    </div>
  );
}
