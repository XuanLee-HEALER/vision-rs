'use client';

import { usePathname } from 'next/navigation';
import TableOfContents from './TableOfContents';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    // 首页：全宽布局，无大纲
    return <main className="min-w-0 flex-1 prose">{children}</main>;
  }

  // 内容页：带右侧大纲
  return (
    <>
      <main className="min-w-0 flex-1 prose">{children}</main>
      <aside className="hidden w-64 shrink-0 border-l border-overlay0/30 pl-8 lg:block">
        <div className="sticky top-6">
          <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-subtext0">
            本页大纲
          </h4>
          <nav>
            <TableOfContents />
          </nav>
        </div>
      </aside>
    </>
  );
}
