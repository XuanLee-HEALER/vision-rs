import { MENTAL_MODEL_CONFIG } from '@/features/learn/mental-model-config';

interface AdjacentChapters {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}

export function getAdjacentChapters(
  currentPartSlug: string,
  currentChapterSlug: string
): AdjacentChapters {
  // 构建所有章节的扁平列表
  const allChapters: Array<{ title: string; href: string }> = [];

  for (const part of MENTAL_MODEL_CONFIG) {
    for (const chapter of part.chapters) {
      allChapters.push({
        title: chapter.title,
        href: `/learn/mental-model/${part.slug}/${chapter.slug}`,
      });
    }
  }

  // 查找当前章节索引
  const currentHref = `/learn/mental-model/${currentPartSlug}/${currentChapterSlug}`;
  const currentIndex = allChapters.findIndex((ch) => ch.href === currentHref);

  if (currentIndex === -1) {
    return {};
  }

  return {
    prev: currentIndex > 0 ? allChapters[currentIndex - 1] : undefined,
    next: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : undefined,
  };
}
