import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  email?: string;
  isLoggedIn: boolean;
}

/**
 * 验证 SESSION_SECRET 是否已配置
 * 在生产环境首次调用时检查
 */
function validateSessionSecret() {
  if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    throw new Error(
      'SESSION_SECRET is required in production. Generate one with: openssl rand -base64 32'
    );
  }
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    throw new Error(
      'SESSION_SECRET must be at least 32 characters. Generate a secure one with: openssl rand -base64 32'
    );
  }
}

/**
 * 获取当前会话
 */
export async function getSession() {
  // 开发模式：跳过鉴权，返回模拟的已登录会话
  if (process.env.NODE_ENV === 'development') {
    const devEmail = process.env.ADMIN_EMAILS?.split(',')[0] || 'dev@example.com';
    return {
      email: devEmail,
      isLoggedIn: true,
    } as SessionData;
  }

  // 验证 SESSION_SECRET 配置
  validateSessionSecret();

  const session = await getIronSession<SessionData>(await cookies(), {
    password: process.env.SESSION_SECRET!,
    cookieName: 'vision-rs-admin-session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 天
    },
  });

  // 默认值
  if (session.isLoggedIn === undefined) {
    session.isLoggedIn = false;
  }

  return session;
}

/**
 * 验证用户已登录,如果未登录则抛出错误
 */
export async function requireAuth() {
  // 开发模式：跳过鉴权检查
  if (process.env.NODE_ENV === 'development') {
    const devEmail = process.env.ADMIN_EMAILS?.split(',')[0] || 'dev@example.com';
    return {
      email: devEmail,
      isLoggedIn: true,
    } as SessionData;
  }

  const session = await getSession();
  if (!session.isLoggedIn || !session.email) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * 登录用户并创建会话
 */
export async function login(email: string) {
  // 开发模式：无需操作（没有真实 session）
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  // 生产模式：创建 Iron Session
  const session = await getIronSession<SessionData>(await cookies(), {
    password: process.env.SESSION_SECRET!,
    cookieName: 'vision-rs-admin-session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    },
  });

  session.email = email;
  session.isLoggedIn = true;
  await session.save();
}

/**
 * 登出用户并销毁会话
 */
export async function logout() {
  // 开发模式：无需操作（没有真实 session）
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  // 生产模式：销毁 Iron Session
  const session = await getIronSession<SessionData>(await cookies(), {
    password: process.env.SESSION_SECRET!,
    cookieName: 'vision-rs-admin-session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    },
  });

  session.destroy();
}
