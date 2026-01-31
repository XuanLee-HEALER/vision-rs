import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to logout:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
