'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface FileItem {
  path: string;
  title: string;
  category: string;
  url: string;
}

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  filePath: string | null;
}

interface FileTreeProps {
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  onCreateFile?: () => void;
  onDeleteFile?: (path: string) => void;
  onRenameFile?: (path: string) => void;
  onRefresh?: () => void;
}

export default function FileTree({
  selectedPath,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onRefresh,
}: FileTreeProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['concepts', 'crates'])
  );
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    filePath: null,
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);

  // 加载文件列表
  const fetchFiles = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // 暴露刷新方法给父组件
  useEffect(() => {
    if (onRefresh) {
      // 将刷新方法绑定到回调
      (onRefresh as unknown as { current?: () => void }).current = fetchFiles;
    }
  }, [onRefresh, fetchFiles]);

  // 点击外部关闭右键菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu.isOpen]);

  // ESC 关闭右键菜单
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contextMenu.isOpen) {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contextMenu.isOpen]);

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

  // 获取所有分类
  const categories = Object.keys(groupedFiles);

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

  // 右键菜单
  const handleContextMenu = (e: React.MouseEvent, filePath: string) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      filePath,
    });
  };

  const handleContextMenuAction = (action: 'rename' | 'delete') => {
    const { filePath } = contextMenu;
    setContextMenu((prev) => ({ ...prev, isOpen: false }));

    if (!filePath) return;

    if (action === 'rename' && onRenameFile) {
      onRenameFile(filePath);
    } else if (action === 'delete' && onDeleteFile) {
      onDeleteFile(filePath);
    }
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
          <div className="flex items-center gap-1">
            <span className="mr-2 text-xs text-subtext0">{files.length}</span>
            {/* 新建按钮 */}
            {onCreateFile && (
              <button
                onClick={onCreateFile}
                className="rounded p-1 text-subtext0 transition hover:bg-surface0 hover:text-text"
                title="新建文件"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}
            {/* 刷新按钮 */}
            <button
              onClick={fetchFiles}
              className="rounded p-1 text-subtext0 transition hover:bg-surface0 hover:text-text"
              title="刷新文件列表"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
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
                        onContextMenu={(e) => handleContextMenu(e, file.path)}
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

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 min-w-32 rounded border border-overlay0 bg-mantle py-1 shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {onRenameFile && (
            <button
              onClick={() => handleContextMenuAction('rename')}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-text hover:bg-surface0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              重命名
            </button>
          )}
          {onDeleteFile && (
            <button
              onClick={() => handleContextMenuAction('delete')}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red hover:bg-surface0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              删除
            </button>
          )}
        </div>
      )}

      {/* 暴露分类数据 */}
      <input type="hidden" data-categories={JSON.stringify(categories)} />
    </div>
  );
}

// 导出分类获取方法
export function useFileTreeCategories(files: FileItem[]): string[] {
  return [...new Set(files.map((f) => f.category))];
}
