'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import FileTree from '@/features/editor/ui/FileTree';
import PreviewPane from '@/features/editor/ui/PreviewPane';
import CreateFileDialog from '@/features/editor/ui/CreateFileDialog';
import RenameDialog from '@/features/editor/ui/RenameDialog';
import DeleteConfirmDialog from '@/features/editor/ui/DeleteConfirmDialog';

// 动态导入MDXEditor相关组件
const EditorWrapper = dynamic(() => import('@/features/editor/ui/EditorWrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-subtext0">Loading editor...</div>
  ),
});

interface CompileError {
  message: string;
  line?: number;
  column?: number;
}

export default function EditorPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // 编译状态
  const [compiledCode, setCompiledCode] = useState<string | null>(null);
  const [compileError, setCompileError] = useState<CompileError | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  // 文件操作对话框状态
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [targetPath, setTargetPath] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  // 防抖timer
  const compileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileTreeRefreshRef = useRef<() => void>(() => {});

  // 检查开发环境
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.push('/');
    }
  }, [router]);

  // 加载分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/dev/mdx/list');
        if (response.ok) {
          const data = await response.json();
          const uniqueCategories = [
            ...new Set(data.files.map((f: { category: string }) => f.category)),
          ] as string[];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // 监听内容变化
  useEffect(() => {
    setIsDirty(content !== originalContent);
  }, [content, originalContent]);

  // 编译内容
  const compileContent = useCallback(
    async (mdx: string) => {
      if (!mdx.trim()) return;

      setIsCompiling(true);

      try {
        const response = await fetch('/api/dev/mdx/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mdx, path: selectedPath }),
        });

        const data = await response.json();

        if (data.success) {
          setCompiledCode(data.code);
          setCompileError(null);
        } else {
          setCompiledCode(null);
          setCompileError(data.error);
        }
      } catch (error) {
        console.error('Compile error:', error);
        setCompileError({
          message: error instanceof Error ? error.message : 'Failed to compile',
        });
      } finally {
        setIsCompiling(false);
      }
    },
    [selectedPath]
  );

  // 防抖编译
  useEffect(() => {
    if (!content) {
      setCompiledCode(null);
      setCompileError(null);
      return;
    }

    if (compileTimerRef.current) {
      clearTimeout(compileTimerRef.current);
    }

    compileTimerRef.current = setTimeout(() => {
      compileContent(content);
    }, 500);

    return () => {
      if (compileTimerRef.current) {
        clearTimeout(compileTimerRef.current);
      }
    };
  }, [content, compileContent]);

  // 加载文件
  const loadFile = async (path: string) => {
    try {
      const response = await fetch(`/api/dev/mdx/read?path=${encodeURIComponent(path)}`);

      if (!response.ok) {
        throw new Error('Failed to load file');
      }

      const data = await response.json();
      setContent(data.content);
      setOriginalContent(data.content);
      setSelectedPath(path);
      setSaveStatus('idle');
    } catch (error) {
      console.error('Load error:', error);
      alert('Failed to load file');
    }
  };

  // 保存文件
  const saveFile = useCallback(async () => {
    if (!selectedPath || !isDirty) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const response = await fetch('/api/dev/mdx/write', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedPath, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      setOriginalContent(content);
      setIsDirty(false);
      setSaveStatus('saved');

      // 2秒后清除保存状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      alert('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  }, [selectedPath, isDirty, content]);

  // 创建文件
  const handleCreateFile = async (path: string) => {
    const response = await fetch('/api/dev/mdx/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create file');
    }

    // 刷新文件树
    fileTreeRefreshRef.current();

    // 重新生成索引
    await fetch('/api/dev/mdx/regenerate-index', { method: 'POST' });

    // 更新分类列表
    const listResponse = await fetch('/api/dev/mdx/list');
    if (listResponse.ok) {
      const data = await listResponse.json();
      const uniqueCategories = [
        ...new Set(data.files.map((f: { category: string }) => f.category)),
      ] as string[];
      setCategories(uniqueCategories);
    }

    // 加载新文件
    await loadFile(path);
  };

  // 删除文件
  const handleDeleteFile = async (path: string) => {
    const response = await fetch('/api/dev/mdx/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete file');
    }

    // 如果删除的是当前文件，清空编辑器
    if (path === selectedPath) {
      setSelectedPath(null);
      setContent('');
      setOriginalContent('');
      setCompiledCode(null);
    }

    // 刷新文件树
    fileTreeRefreshRef.current();

    // 重新生成索引
    await fetch('/api/dev/mdx/regenerate-index', { method: 'POST' });
  };

  // 重命名文件
  const handleRenameFile = async (oldPath: string, newPath: string) => {
    const response = await fetch('/api/dev/mdx/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPath, newPath }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to rename file');
    }

    // 如果重命名的是当前文件，更新路径
    if (oldPath === selectedPath) {
      setSelectedPath(newPath);
    }

    // 刷新文件树
    fileTreeRefreshRef.current();

    // 重新生成索引
    await fetch('/api/dev/mdx/regenerate-index', { method: 'POST' });

    // 更新分类列表
    const listResponse = await fetch('/api/dev/mdx/list');
    if (listResponse.ok) {
      const data = await listResponse.json();
      const uniqueCategories = [
        ...new Set(data.files.map((f: { category: string }) => f.category)),
      ] as string[];
      setCategories(uniqueCategories);
    }
  };

  // 打开重命名对话框
  const openRenameDialog = (path: string) => {
    setTargetPath(path);
    setIsRenameDialogOpen(true);
  };

  // 打开删除对话框
  const openDeleteDialog = (path: string) => {
    setTargetPath(path);
    setIsDeleteDialogOpen(true);
  };

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveFile]);

  // 离开确认
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-base">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-overlay0 bg-mantle px-4 py-2">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-text">MDX Editor</h1>
          {selectedPath && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-subtext0">{selectedPath}</span>
              {isDirty && (
                <span className="rounded bg-yellow/20 px-2 py-0.5 text-xs text-yellow">
                  Modified
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="rounded bg-green/20 px-2 py-0.5 text-xs text-green">Saved</span>
              )}
              {isCompiling && (
                <span className="rounded bg-blue/20 px-2 py-0.5 text-xs text-blue">
                  Compiling...
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveFile}
            disabled={!isDirty || isSaving}
            className="rounded bg-blue px-3 py-1 text-sm text-base transition hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save (Ctrl+S)'}
          </button>
          <button
            onClick={() => router.push('/')}
            className="rounded bg-surface0 px-3 py-1 text-sm text-subtext1 transition hover:bg-surface1"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r border-overlay0">
          <FileTree
            selectedPath={selectedPath}
            onSelectFile={loadFile}
            onCreateFile={() => setIsCreateDialogOpen(true)}
            onDeleteFile={openDeleteDialog}
            onRenameFile={openRenameDialog}
            onRefresh={fileTreeRefreshRef as unknown as () => void}
          />
        </div>

        {/* Editor */}
        <div className="flex-1 border-r border-overlay0 bg-mantle">
          <div className="flex h-full flex-col">
            <div className="border-b border-overlay0 bg-surface0 px-4 py-2">
              <h2 className="text-sm font-medium text-text">Editor</h2>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              {selectedPath ? (
                <div className="h-full">
                  <EditorWrapper content={content} onChange={setContent} />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-subtext0">
                    <p className="text-sm">Select a file to start editing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-base">
          <div className="flex h-full flex-col">
            <div className="border-b border-overlay0 bg-surface0 px-4 py-2">
              <h2 className="text-sm font-medium text-text">Preview</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <PreviewPane code={compiledCode} error={compileError} />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateFileDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleCreateFile}
        categories={categories}
      />

      <RenameDialog
        isOpen={isRenameDialogOpen}
        currentPath={targetPath}
        onClose={() => setIsRenameDialogOpen(false)}
        onConfirm={handleRenameFile}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        filePath={targetPath}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteFile}
      />
    </div>
  );
}
