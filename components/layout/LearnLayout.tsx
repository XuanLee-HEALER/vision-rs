'use client';

import { usePathname } from 'next/navigation';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';
import TableOfContents from '@/components/mdx/TableOfContents';
import { getAdjacentChapters } from '@/lib/navigation-helpers';

interface LearnLayoutProps {
  children: React.ReactNode;
}

export default function LearnLayout({ children }: LearnLayoutProps) {
  const pathname = usePathname();

  // 从路径中提取 partSlug 和 chapterSlug
  let prevChapter, nextChapter;

  // 检查是否是 mental-model 章节页面
  const mentalModelMatch = pathname.match(/\/learn\/mental-model\/([^/]+)\/([^/]+)/);

  if (mentalModelMatch) {
    const [, partSlug, chapterSlug] = mentalModelMatch;
    const adjacent = getAdjacentChapters(partSlug, chapterSlug);
    prevChapter = adjacent.prev;
    nextChapter = adjacent.next;
  }

  return (
    <div className="flex gap-12">
      {/* 文章内容区域 */}
      <article className="prose prose-sm md:prose-base lg:prose-lg snap-y snap-start flex-1 min-w-0">
        {children}
        {(prevChapter || nextChapter) && (
          <ChapterNavigation prevChapter={prevChapter} nextChapter={nextChapter} />
        )}
      </article>

      {/* 右侧目录（大屏幕显示） */}
      <aside className="w-64 flex-shrink-0">
        <TableOfContents />
      </aside>
    </div>
  );
}
