import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/auth/verification';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid email or code' }, { status: 400 });
    }

    // 验证码校验
    const isValid = await verifyCode(email, code);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    // 创建会话
    const session = await getSession();
    session.email = email;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to verify code:', errorMessage);

    if (errorMessage === 'Too many attempts') {
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 });
  }
}
