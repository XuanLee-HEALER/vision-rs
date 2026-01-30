import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/admin/login');
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">管理后台</h1>
          <p className="text-subtext0">欢迎，{session.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 章节管理卡片 */}
        <div className="rounded-lg border border-overlay0 bg-surface0 p-6 hover:bg-surface1 transition-colors">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue/20">
            <svg
              className="h-6 w-6 text-blue"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text mb-2">章节管理</h2>
          <p className="text-sm text-subtext0 mb-4">编辑"我的理解"部分内容</p>
          <a
            href="/admin/chapters"
            className="inline-flex items-center text-sm text-blue hover:text-blue/80"
          >
            进入管理 →
          </a>
        </div>

        {/* 占位卡片 */}
        <div className="rounded-lg border border-overlay0 bg-surface0 p-6 opacity-50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-overlay0">
            <svg
              className="h-6 w-6 text-overlay2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text mb-2">更多功能</h2>
          <p className="text-sm text-subtext0">敬请期待...</p>
        </div>
      </div>
    </div>
  );
}
