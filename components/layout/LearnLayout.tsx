'use client';

import { usePathname } from 'next/navigation';
import ChapterNavigation from '@/components/navigation/ChapterNavigation';
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
    <article className="prose prose-sm md:prose-base lg:prose-lg snap-y snap-start">
      {children}
      {(prevChapter || nextChapter) && (
        <ChapterNavigation prevChapter={prevChapter} nextChapter={nextChapter} />
      )}
    </article>
  );
}
