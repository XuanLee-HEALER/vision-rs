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
        {/* 可见性管理卡片 */}
        <a
          href="/admin/visibility"
          className="rounded-lg border border-overlay0 bg-surface0 p-6 hover:bg-surface1 transition-colors"
        >
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text mb-2">内容可见性</h2>
          <p className="text-sm text-subtext0 mb-4">管理学习内容的显示/隐藏状态</p>
          <span className="inline-flex items-center text-sm text-blue hover:text-blue/80">
            进入管理 →
          </span>
        </a>

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
