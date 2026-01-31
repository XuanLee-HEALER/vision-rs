import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getAllChapters } from '@/lib/admin/mdx-editor';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();
    const chapters = getAllChapters();
    return NextResponse.json(chapters);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to get chapters:', errorMessage);

    if (errorMessage === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to get chapters' }, { status: 500 });
  }
}
