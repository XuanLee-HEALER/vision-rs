'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MDXEditor from '@/components/MDXEditor';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'hidden' | 'archived';
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  order: number;
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'hidden' | 'archived'>('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      fetchArticle();
    }
  }, [token]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      const data = await response.json();
      const article = data.article;

      setArticle(article);
      setTitle(article.title);
      setSlug(article.slug);
      setContent(article.content);
      setStatus(article.status);
      setCategory(article.category);
      setTags(article.tags.join(', '));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          status,
          category,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update article');
      }

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="text-subtext1">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="text-red">Article not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text">Edit Article</h1>
          <Link
            href="/admin"
            className="rounded-lg bg-surface0 px-4 py-2 text-sm font-medium text-subtext1 transition hover:bg-surface1"
          >
            ← Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-subtext1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-overlay0 bg-surface0 px-4 py-2 text-text placeholder-overlay2 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
                placeholder="Article title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-subtext1">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full rounded-lg border border-overlay0 bg-surface0 px-4 py-2 text-text placeholder-overlay2 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
                placeholder="article-slug"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-subtext1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-overlay0 bg-surface0 px-4 py-2 text-text placeholder-overlay2 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
                placeholder="Category name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-subtext1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-lg border border-overlay0 bg-surface0 px-4 py-2 text-text placeholder-overlay2 transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
                placeholder="rust, tokio, async"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-subtext1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-lg border border-overlay0 bg-surface0 px-4 py-2 text-text transition focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-subtext1">Content *</label>
            <MDXEditor value={content} onChange={setContent} />
          </div>

          {error && <div className="rounded-lg bg-red/10 p-3 text-sm text-red">{error}</div>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-green px-6 py-2 font-medium text-base transition hover:bg-green/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin"
              className="rounded-lg bg-surface0 px-6 py-2 font-medium text-subtext1 transition hover:bg-surface1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
