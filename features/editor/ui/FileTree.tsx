'use client';

import { useState, useEffect } from 'react';

interface FileItem {
  path: string;
  title: string;
  category: string;
  url: string;
}

interface FileTreeProps {
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

export default function FileTree({ selectedPath, onSelectFile }: FileTreeProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['concepts', 'crates'])
  );

  // 加载文件列表
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/dev/mdx/list');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
      console.error('Error fetching files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 按category分组
  const groupedFiles = files.reduce(
    (acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file);
      return acc;
    },
    {} as Record<string, FileItem[]>
  );

  // 过滤文件
  const filteredGroupedFiles = Object.entries(groupedFiles).reduce(
    (acc, [category, categoryFiles]) => {
      const filtered = categoryFiles.filter(
        (file) =>
          file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.path.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {} as Record<string, FileItem[]>
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-subtext0">Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-2 text-sm text-red">{error}</div>
          <button onClick={fetchFiles} className="text-xs text-blue hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-mantle">
      {/* Header */}
      <div className="border-b border-overlay0 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Files</h2>
          <span className="text-xs text-subtext0">{files.length} files</span>
        </div>
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded border border-overlay0 bg-surface0 px-2 py-1 text-sm text-text placeholder-subtext0 focus:border-blue focus:outline-none"
        />
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredGroupedFiles).map(([category, categoryFiles]) => {
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="flex w-full items-center gap-2 border-b border-overlay0/50 bg-surface0/30 px-3 py-2 text-left transition hover:bg-surface0/50"
              >
                <svg
                  className={`h-3 w-3 shrink-0 text-subtext0 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
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
                <span className="text-xs font-medium uppercase text-subtext1">{category}</span>
                <span className="text-xs text-subtext0">({categoryFiles.length})</span>
              </button>

              {/* Category Files */}
              {isExpanded && (
                <div className="bg-base">
                  {categoryFiles.map((file) => {
                    const isSelected = file.path === selectedPath;

                    return (
                      <button
                        key={file.path}
                        onClick={() => onSelectFile(file.path)}
                        className={`w-full px-6 py-2 text-left text-sm transition ${
                          isSelected ? 'bg-blue/20 text-blue' : 'text-subtext1 hover:bg-surface0/50'
                        }`}
                      >
                        <div className="truncate" title={file.title}>
                          {file.title}
                        </div>
                        <div className="truncate text-xs text-overlay2" title={file.path}>
                          {file.path}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
