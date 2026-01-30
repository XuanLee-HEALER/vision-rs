import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { headers } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || '';

  // 未登录且不在登录页，重定向到登录页
  if (!session.isLoggedIn && !pathname.includes('/login')) {
    redirect('/admin/login');
  }

  // 已登录且在登录页，重定向到管理首页
  if (session.isLoggedIn && pathname.includes('/login')) {
    redirect('/admin');
  }

  return <div className="min-h-screen bg-base">{children}</div>;
}
