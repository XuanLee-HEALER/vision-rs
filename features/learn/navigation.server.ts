import { NavSection } from './types';
import { FLAT_LEARN_CONFIG } from './flat-navigation-config';
import { getBatchVisibility } from '@/lib/visibility';

/**
 * 生成导航树（基于新的扁平化配置）
 * 6 个主题直接作为一级标题，不再嵌套在"学习路径"下
 */
export async function generateNavigation(): Promise<NavSection[]> {
  return FLAT_LEARN_CONFIG.map((section) => ({
    title: section.title,
    icon: section.icon,
    href: `/learn/${section.slug}`,
    // 如果有子章节，也添加到导航中
    items: section.chapters?.map((chapter) => ({
      title: chapter.title,
      href: `/learn/${section.slug}/${chapter.slug}`,
    })),
  }));
}

/**
 * Filter hidden items from navigation based on visibility settings
 *
 * Note: If KV is not configured (local development), returns unfiltered navigation
 */
async function filterHiddenItems(sections: NavSection[]): Promise<NavSection[]> {
  const kvConfigured = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

  if (!kvConfigured) {
    return sections;
  }

  try {
    const allHrefs: string[] = [];

    sections.forEach((section) => {
      if (section.href) allHrefs.push(section.href);
      if (section.items) {
        section.items.forEach((item) => {
          if (item.href) allHrefs.push(item.href);
          // 收集子项的 href
          if (item.items) {
            item.items.forEach((subItem) => {
              if (subItem.href) allHrefs.push(subItem.href);
            });
          }
        });
      }
    });

    const slugs = allHrefs.map((href) => href.replace(/^\//, ''));
    const visibilityMap = await getBatchVisibility(slugs);

    return sections
      .map((section) => {
        const filteredItems = section.items
          ? section.items
              .map((item) => {
                // 过滤子项
                const filteredSubItems = item.items
                  ? item.items.filter((subItem) => {
                      const subItemSlug = subItem.href?.replace(/^\//, '') || '';
                      return visibilityMap[subItemSlug] !== false;
                    })
                  : undefined;

                return {
                  ...item,
                  items: filteredSubItems,
                };
              })
              .filter((item) => {
                const itemSlug = item.href?.replace(/^\//, '') || '';
                return visibilityMap[itemSlug] !== false;
              })
          : undefined;

        return {
          ...section,
          items: filteredItems,
        };
      })
      .filter((section) => {
        const hasVisibleItems = section.items && section.items.length > 0;
        return hasVisibleItems;
      });
  } catch (error) {
    console.error('Error filtering navigation:', error);
    return sections;
  }
}

/**
 * Get navigation data (with visibility filtering)
 */
export async function getNavigation(): Promise<NavSection[]> {
  const navigation = await generateNavigation();
  const filtered = await filterHiddenItems(navigation);
  return filtered;
}
