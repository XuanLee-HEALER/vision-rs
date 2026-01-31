import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import {
  getArticleMetadata,
  saveArticleMetadata,
  deleteArticleMetadata,
  type Article,
} from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

// GET /api/articles/[id] - Get single article with content
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metadata = await getArticleMetadata(params.id);
    if (!metadata) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Read content from filesystem
    const contentPath = path.join(CONTENT_DIR, `${params.id}.mdx`);
    let content = '';
    try {
      content = await fs.readFile(contentPath, 'utf-8');
    } catch (error) {
      console.error('Error reading content:', error);
    }

    const article: Article = {
      ...metadata,
      content,
    };

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/articles/[id] - Update article
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metadata = await getArticleMetadata(params.id);
    if (!metadata) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const { title, slug, content, status, category, tags, order } = await request.json();

    const updatedMetadata = {
      ...metadata,
      title: title ?? metadata.title,
      slug: slug ?? metadata.slug,
      status: status ?? metadata.status,
      category: category ?? metadata.category,
      tags: tags ?? metadata.tags,
      order: order ?? metadata.order,
      updatedAt: Date.now(),
    };

    // Save metadata to KV
    await saveArticleMetadata(updatedMetadata);

    // Save content to filesystem if provided
    if (content !== undefined) {
      await fs.mkdir(CONTENT_DIR, { recursive: true });
      await fs.writeFile(path.join(CONTENT_DIR, `${params.id}.mdx`), content, 'utf-8');
    }

    return NextResponse.json({ article: updatedMetadata });
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metadata = await getArticleMetadata(params.id);
    if (!metadata) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Delete metadata from KV
    await deleteArticleMetadata(params.id);

    // Delete content from filesystem
    const contentPath = path.join(CONTENT_DIR, `${params.id}.mdx`);
    try {
      await fs.unlink(contentPath);
    } catch (error) {
      console.error('Error deleting content file:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
