'use client';

import { useState, useEffect } from 'react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  filePath: string;
  onClose: () => void;
  onConfirm: (path: string) => Promise<void>;
}

export default function DeleteConfirmDialog({
  isOpen,
  filePath,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 重置状态
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

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

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm(filePath);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-overlay0 bg-mantle p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-red">确认删除</h2>

        <p className="mb-2 text-text">确定要删除以下文件吗？</p>
        <p className="mb-4 rounded bg-surface0 px-3 py-2 text-sm text-subtext0">{filePath}</p>
        <p className="mb-4 text-sm text-yellow">此操作不可撤销！</p>

        {/* 错误提示 */}
        {error && <div className="mb-4 rounded bg-red/20 px-3 py-2 text-sm text-red">{error}</div>}

        {/* 按钮 */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded bg-surface0 px-4 py-2 text-sm text-subtext1 transition hover:bg-surface1"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="rounded bg-red px-4 py-2 text-sm text-base transition hover:bg-red/90 disabled:opacity-50"
          >
            {isDeleting ? '删除中...' : '删除'}
          </button>
        </div>
      </div>
    </div>
  );
}
