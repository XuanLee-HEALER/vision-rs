'use client';

import { useState, useEffect, useRef } from 'react';

interface CreateFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (path: string) => Promise<void>;
  categories: string[];
}

export default function CreateFileDialog({
  isOpen,
  onClose,
  onConfirm,
  categories,
}: CreateFileDialogProps) {
  const [fileName, setFileName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [createNewCategory, setCreateNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 重置表单
  useEffect(() => {
    if (isOpen) {
      setFileName('');
      setSelectedCategory(categories[0] || '');
      setCreateNewCategory(false);
      setNewCategoryName('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, categories]);

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

    // 验证文件名
    const cleanFileName = fileName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanFileName) {
      setError('请输入文件名');
      return;
    }

    // 验证分类
    const category = createNewCategory
      ? newCategoryName.trim().toLowerCase().replace(/\s+/g, '-')
      : selectedCategory;

    if (!category) {
      setError('请选择或创建分类');
      return;
    }

    // 构建路径
    const path = `${category}/${cleanFileName}/page.mdx`;

    setIsSubmitting(true);
    try {
      await onConfirm(path);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-overlay0 bg-mantle p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-text">新建文件</h2>

        <form onSubmit={handleSubmit}>
          {/* 文件名 */}
          <div className="mb-4">
            <label className="mb-1 block text-sm text-subtext1">章节名称</label>
            <input
              ref={inputRef}
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="例如: pattern-matching"
              className="w-full rounded border border-overlay0 bg-surface0 px-3 py-2 text-text placeholder-subtext0 focus:border-blue focus:outline-none"
            />
            <p className="mt-1 text-xs text-subtext0">
              将创建: {selectedCategory || newCategoryName || '分类'}/
              {fileName.trim().toLowerCase().replace(/\s+/g, '-') || '名称'}/page.mdx
            </p>
          </div>

          {/* 分类选择 */}
          <div className="mb-4">
            <label className="mb-1 block text-sm text-subtext1">分类</label>

            <div className="mb-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-subtext1">
                <input
                  type="radio"
                  checked={!createNewCategory}
                  onChange={() => setCreateNewCategory(false)}
                  className="text-blue"
                />
                选择现有分类
              </label>
              <label className="flex items-center gap-2 text-sm text-subtext1">
                <input
                  type="radio"
                  checked={createNewCategory}
                  onChange={() => setCreateNewCategory(true)}
                  className="text-blue"
                />
                创建新分类
              </label>
            </div>

            {createNewCategory ? (
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="新分类名称"
                className="w-full rounded border border-overlay0 bg-surface0 px-3 py-2 text-text placeholder-subtext0 focus:border-blue focus:outline-none"
              />
            ) : (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded border border-overlay0 bg-surface0 px-3 py-2 text-text focus:border-blue focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
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
              {isSubmitting ? '创建中...' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
