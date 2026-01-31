import { NextRequest, NextResponse } from 'next/server';
import { getUser, createUser } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, initSecret } = await request.json();

    // Security check: only allow initialization with the secret
    if (initSecret !== process.env.INIT_SECRET) {
      return NextResponse.json({ error: 'Invalid initialization secret' }, { status: 403 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Create admin user
    const passwordHash = await hashPassword(password);
    await createUser(email, passwordHash);

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
