import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getAllArticles, saveArticle, type Article } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/articles - List all articles
export async function GET(_request: NextRequest) {
  try {
    await requireAuth();

    const articles = await getAllArticles();

    // Sort by order, then by updatedAt
    articles.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return b.updatedAt - a.updatedAt;
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/articles - Create new article
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const { title, slug, content, status, category, tags } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    const id = Date.now().toString();
    const now = Date.now();

    const article: Article = {
      id,
      title,
      slug,
      content,
      status: status || 'draft',
      category: category || '',
      tags: tags || [],
      createdAt: now,
      updatedAt: now,
      order: 0,
    };

    // Save complete article to KV
    await saveArticle(article);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content: _content, ...metadata } = article;
    return NextResponse.json({ article: metadata }, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
