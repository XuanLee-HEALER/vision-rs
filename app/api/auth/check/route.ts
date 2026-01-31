import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({
      isLoggedIn: session.isLoggedIn || false,
      email: session.email || null,
    });
  } catch (error) {
    console.error('Failed to check auth status:', error);
    return NextResponse.json({ isLoggedIn: false, email: null }, { status: 500 });
  }
}
