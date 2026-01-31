import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getArticle, saveArticle, deleteArticleMetadata, type Article } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/articles/[id] - Get single article with content
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const article = await getArticle(params.id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/articles/[id] - Update article
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const existing = await getArticle(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const { title, slug, content, status, category, tags, order } = await request.json();

    const updatedArticle: Article = {
      ...existing,
      title: title ?? existing.title,
      slug: slug ?? existing.slug,
      content: content ?? existing.content,
      status: status ?? existing.status,
      category: category ?? existing.category,
      tags: tags ?? existing.tags,
      order: order ?? existing.order,
      updatedAt: Date.now(),
    };

    // Save complete article to KV
    await saveArticle(updatedArticle);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content: _content, ...metadata } = updatedArticle;
    return NextResponse.json({ article: metadata });
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const article = await getArticle(params.id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Delete article from KV
    await deleteArticleMetadata(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
