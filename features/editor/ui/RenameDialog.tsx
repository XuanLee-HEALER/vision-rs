'use client';

import { useState, useEffect, useRef } from 'react';

interface RenameDialogProps {
  isOpen: boolean;
  currentPath: string;
  onClose: () => void;
  onConfirm: (oldPath: string, newPath: string) => Promise<void>;
}

export default function RenameDialog({
  isOpen,
  currentPath,
  onClose,
  onConfirm,
}: RenameDialogProps) {
  const [newPath, setNewPath] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 初始化新路径
  useEffect(() => {
    if (isOpen && currentPath) {
      setNewPath(currentPath);
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, currentPath]);

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPath = newPath.trim();

    if (!trimmedPath) {
      setError('路径不能为空');
      return;
    }

    if (!trimmedPath.endsWith('.mdx')) {
      setError('文件必须以 .mdx 结尾');
      return;
    }

    if (trimmedPath === currentPath) {
      setError('新路径与原路径相同');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(currentPath, trimmedPath);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '重命名失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-overlay0 bg-mantle p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-text">重命名文件</h2>

        <form onSubmit={handleSubmit}>
          {/* 当前路径 */}
          <div className="mb-4">
            <label className="mb-1 block text-sm text-subtext1">当前路径</label>
            <div className="rounded bg-surface0 px-3 py-2 text-sm text-subtext0">{currentPath}</div>
          </div>

          {/* 新路径 */}
          <div className="mb-4">
            <label className="mb-1 block text-sm text-subtext1">新路径</label>
            <input
              ref={inputRef}
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="例如: concepts/new-name/page.mdx"
              className="w-full rounded border border-overlay0 bg-surface0 px-3 py-2 text-text placeholder-subtext0 focus:border-blue focus:outline-none"
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 rounded bg-red/20 px-3 py-2 text-sm text-red">{error}</div>
          )}

          {/* 按钮 */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded bg-surface0 px-4 py-2 text-sm text-subtext1 transition hover:bg-surface1"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-blue px-4 py-2 text-sm text-base transition hover:bg-blue/90 disabled:opacity-50"
            >
              {isSubmitting ? '重命名中...' : '重命名'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
