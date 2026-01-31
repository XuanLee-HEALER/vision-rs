'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ContentItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  filePath: string;
  type: string;
  visible: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export default function VisibilityManagementPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/visibility');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch items');
      }
      const data = await res.json();
      setItems(data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleVisibility = (slug: string) => {
    setItems((prev) =>
      prev.map((item) => (item.slug === slug ? { ...item, visible: !item.visible } : item))
    );
    setHasChanges(true);
  };

  const toggleSelection = (slug: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const selectAll = () => {
    const filtered = getFilteredItems();
    setSelectedItems(new Set(filtered.map((item) => item.slug)));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const batchToggle = (visible: boolean) => {
    setItems((prev) =>
      prev.map((item) => (selectedItems.has(item.slug) ? { ...item, visible } : item))
    );
    setHasChanges(true);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      // Collect all changes
      const updates = items.map((item) => ({
        slug: item.slug,
        visible: item.visible,
      }));

      const res = await fetch('/api/admin/visibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        throw new Error('Failed to save changes');
      }

      setHasChanges(false);
      await fetchItems(); // Refresh to get updated timestamps
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const resetChanges = () => {
    fetchItems();
    setHasChanges(false);
  };

  const getFilteredItems = () => {
    return items.filter((item) => {
      const matchesFilter =
        filter === '' ||
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.slug.toLowerCase().includes(filter.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      return matchesFilter && matchesCategory;
    });
  };

  const filteredItems = getFilteredItems();
  const stats = {
    total: items.length,
    visible: items.filter((item) => item.visible).length,
    hidden: items.filter((item) => !item.visible).length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-subtext1">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text">内容可见性管理</h1>
          <p className="mt-2 text-subtext1">管理学习内容的显示/隐藏状态</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-surface0 p-4">
            <p className="text-sm text-subtext0">总内容数</p>
            <p className="mt-1 text-2xl font-bold text-text">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-green/10 p-4">
            <p className="text-sm text-green">可见内容</p>
            <p className="mt-1 text-2xl font-bold text-green">{stats.visible}</p>
          </div>
          <div className="rounded-lg bg-yellow/10 p-4">
            <p className="text-sm text-yellow">隐藏内容</p>
            <p className="mt-1 text-2xl font-bold text-yellow">{stats.hidden}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="搜索标题或 slug..."
            className="flex-1 rounded-lg bg-surface0 px-4 py-2 text-text placeholder-subtext0 focus:outline-none focus:ring-2 focus:ring-blue"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg bg-surface0 px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-blue"
          >
            <option value="all">所有分类</option>
            <option value="mental-model">心智世界</option>
            <option value="concepts">核心概念</option>
            <option value="crates">三方库</option>
          </select>
        </div>

        {/* Batch Actions */}
        {selectedItems.size > 0 && (
          <div className="mb-4 flex items-center gap-4 rounded-lg bg-surface0 p-4">
            <p className="text-sm text-subtext1">已选择 {selectedItems.size} 项</p>
            <button
              onClick={() => batchToggle(true)}
              className="rounded bg-green px-3 py-1 text-sm text-base hover:bg-green/80"
            >
              批量显示
            </button>
            <button
              onClick={() => batchToggle(false)}
              className="rounded bg-yellow px-3 py-1 text-sm text-base hover:bg-yellow/80"
            >
              批量隐藏
            </button>
            <button
              onClick={deselectAll}
              className="rounded bg-surface1 px-3 py-1 text-sm text-text hover:bg-surface2"
            >
              取消选择
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="rounded bg-surface1 px-3 py-1 text-sm text-text hover:bg-surface2"
            >
              全选当前页
            </button>
            <button
              onClick={deselectAll}
              className="rounded bg-surface1 px-3 py-1 text-sm text-text hover:bg-surface2"
            >
              取消全选
            </button>
          </div>
          <div className="flex gap-3">
            {hasChanges && (
              <>
                <button
                  onClick={resetChanges}
                  disabled={saving}
                  className="rounded bg-surface1 px-4 py-2 text-text hover:bg-surface2 disabled:opacity-50"
                >
                  重置
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="rounded bg-blue px-4 py-2 text-base hover:bg-blue/80 disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存更改'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="rounded-lg border border-overlay0 bg-surface0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-overlay0">
                <th className="p-4 text-left text-sm font-medium text-subtext1">
                  <input type="checkbox" className="h-4 w-4" onChange={() => {}} />
                </th>
                <th className="p-4 text-left text-sm font-medium text-subtext1">标题</th>
                <th className="p-4 text-left text-sm font-medium text-subtext1">分类</th>
                <th className="p-4 text-left text-sm font-medium text-subtext1">状态</th>
                <th className="p-4 text-left text-sm font-medium text-subtext1">最后更新</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.slug} className="border-b border-overlay0 last:border-0">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.slug)}
                      onChange={() => toggleSelection(item.slug)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-text">{item.title}</p>
                    <p className="mt-1 text-xs text-subtext0">{item.slug}</p>
                  </td>
                  <td className="p-4">
                    <span className="rounded bg-surface2 px-2 py-1 text-xs text-text">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleVisibility(item.slug)}
                      className={`rounded px-3 py-1 text-sm font-medium ${
                        item.visible
                          ? 'bg-green/20 text-green hover:bg-green/30'
                          : 'bg-yellow/20 text-yellow hover:bg-yellow/30'
                      }`}
                    >
                      {item.visible ? '可见' : '隐藏'}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-subtext0">
                    {item.updatedAt ? (
                      <div>
                        <p>{new Date(item.updatedAt).toLocaleDateString('zh-CN')}</p>
                        <p className="text-xs">{item.updatedBy}</p>
                      </div>
                    ) : (
                      <p>从未修改</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-subtext0">没有找到匹配的内容</div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-sm text-subtext0">
          显示 {filteredItems.length} / {items.length} 项内容
        </div>
      </div>
    </div>
  );
}
