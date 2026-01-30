import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  email?: string;
  isLoggedIn: boolean;
}

/**
 * 获取当前会话
 */
export async function getSession() {
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
  const session = await getSession();
  if (!session.isLoggedIn || !session.email) {
    throw new Error('Unauthorized');
  }
  return session;
}
