'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ArticleMetadata {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'hidden' | 'archived';
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  order: number;
}

export default function AdminDashboard() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      fetchArticles();
    }
  }, [token]);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') return true;
    return article.status === filter;
  });

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text">Article Management</h1>
          <div className="flex gap-4">
            <span className="text-subtext1">Welcome, {user.email}</span>
            <button
              onClick={logout}
              className="rounded-lg bg-red px-4 py-2 text-sm font-medium text-base transition hover:bg-red/90"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-blue text-base'
                  : 'bg-surface0 text-subtext1 hover:bg-surface1'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === 'draft'
                  ? 'bg-blue text-base'
                  : 'bg-surface0 text-subtext1 hover:bg-surface1'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === 'published'
                  ? 'bg-blue text-base'
                  : 'bg-surface0 text-subtext1 hover:bg-surface1'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('hidden')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === 'hidden'
                  ? 'bg-blue text-base'
                  : 'bg-surface0 text-subtext1 hover:bg-surface1'
              }`}
            >
              Hidden
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === 'archived'
                  ? 'bg-blue text-base'
                  : 'bg-surface0 text-subtext1 hover:bg-surface1'
              }`}
            >
              Archived
            </button>
          </div>

          <Link
            href="/admin/articles/new"
            className="rounded-lg bg-green px-4 py-2 text-sm font-medium text-base transition hover:bg-green/90"
          >
            + New Article
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center text-subtext1">Loading...</div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="rounded-lg bg-surface0 p-8 text-center text-subtext1">
                No articles found
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between rounded-lg bg-surface0 p-6 transition hover:bg-surface1"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-text">{article.title}</h2>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          article.status === 'published'
                            ? 'bg-green/20 text-green'
                            : article.status === 'draft'
                              ? 'bg-yellow/20 text-yellow'
                              : article.status === 'hidden'
                                ? 'bg-overlay0/20 text-overlay2'
                                : 'bg-red/20 text-red'
                        }`}
                      >
                        {article.status}
                      </span>
                    </div>
                    <div className="mb-2 text-sm text-subtext1">Slug: {article.slug}</div>
                    {article.category && (
                      <div className="mb-2 text-sm text-subtext1">Category: {article.category}</div>
                    )}
                    {article.tags.length > 0 && (
                      <div className="flex gap-2">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-blue/20 px-2 py-1 text-xs text-blue"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-overlay2">
                      Updated: {new Date(article.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="rounded-lg bg-blue px-4 py-2 text-sm font-medium text-base transition hover:bg-blue/90"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="rounded-lg bg-red px-4 py-2 text-sm font-medium text-base transition hover:bg-red/90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
