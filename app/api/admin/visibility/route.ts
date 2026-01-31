import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getAllVisibility, batchSetVisibility, deleteVisibility } from '@/lib/visibility';
import contentIndex from '@/app/(site)/learn/_index.generated.json';

/**
 * GET /api/admin/visibility
 * Get all content items with their visibility status
 */
export async function GET() {
  try {
    await requireAuth();

    // Get visibility records from KV
    const visibilityMap = await getAllVisibility();

    // Merge with content index
    const items = contentIndex.map((item) => ({
      ...item,
      visible: visibilityMap[item.slug]?.visible ?? true, // Default visible
      updatedAt: visibilityMap[item.slug]?.updatedAt,
      updatedBy: visibilityMap[item.slug]?.updatedBy,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error getting visibility:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 }
    );
  }
}

/**
 * PUT /api/admin/visibility
 * Batch update visibility status
 * Body: { updates: Array<{ slug: string; visible: boolean }> }
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { updates } = await req.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Invalid updates array' }, { status: 400 });
    }

    // Validate updates
    for (const update of updates) {
      if (typeof update.slug !== 'string' || typeof update.visible !== 'boolean') {
        return NextResponse.json(
          { error: 'Invalid update format: { slug: string, visible: boolean }' },
          { status: 400 }
        );
      }
    }

    // Batch update
    await batchSetVisibility(updates, session.email!);

    return NextResponse.json({ success: true, count: updates.length });
  } catch (error) {
    console.error('Error updating visibility:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/visibility?slug=xxx
 * Reset visibility to default (visible)
 */
export async function DELETE(req: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    await deleteVisibility(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting visibility:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
