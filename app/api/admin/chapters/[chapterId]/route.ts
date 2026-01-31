import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getChapterInfo, getUnderstandingSection } from '@/lib/admin/mdx-editor';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    await requireAuth();
    const { chapterId } = await params;

    const info = getChapterInfo(chapterId);
    const understanding = getUnderstandingSection(chapterId);

    return NextResponse.json({
      ...info,
      understanding,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to get chapter:', errorMessage);

    if (errorMessage === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 路径验证失败
    if (errorMessage.includes('Invalid chapter ID')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to get chapter' }, { status: 500 });
  }
}
