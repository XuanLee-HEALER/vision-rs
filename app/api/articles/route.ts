import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getAllArticles, saveArticleMetadata, type ArticleMetadata } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

// GET /api/articles - List all articles
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, slug, content, status, category, tags } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    const id = Date.now().toString();
    const now = Date.now();

    const article: ArticleMetadata = {
      id,
      title,
      slug,
      status: status || 'draft',
      category: category || '',
      tags: tags || [],
      createdAt: now,
      updatedAt: now,
      order: 0,
    };

    // Save metadata to KV
    await saveArticleMetadata(article);

    // Save content to filesystem
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    await fs.writeFile(path.join(CONTENT_DIR, `${id}.mdx`), content, 'utf-8');

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
