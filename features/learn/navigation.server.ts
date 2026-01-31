import { NavSection } from './types';
import { MENTAL_MODEL_CONFIG } from './mental-model-config';
import { getBatchVisibility } from '@/lib/visibility';

/**
 * 生成导航树（纯配置，不再扫描文件系统）
 */
export async function generateNavigation(): Promise<NavSection[]> {
  const sections: NavSection[] = [
    {
      title: 'Rust 心智世界',
      icon: '',
      href: '/learn/mental-model',
      items: MENTAL_MODEL_CONFIG.map((part) => ({
        title: part.title,
        href: `/learn/mental-model/${part.slug}`,
      })),
    },
    {
      title: 'Rust 核心概念',
      icon: '🔤',
      href: '/learn/concepts',
      items: [
        { title: '变量与常量', href: '/learn/concepts/variables' },
        { title: '数据类型', href: '/learn/concepts/types' },
        { title: '所有权系统', href: '/learn/concepts/ownership' },
        { title: '借用与引用', href: '/learn/concepts/borrowing' },
        { title: '生命周期', href: '/learn/concepts/lifetimes' },
        { title: '泛型', href: '/learn/concepts/generics' },
        { title: 'Trait', href: '/learn/concepts/traits' },
        { title: '错误处理', href: '/learn/concepts/error-handling' },
        { title: '宏系统', href: '/learn/concepts/macros' },
        { title: '模式匹配', href: '/learn/concepts/pattern-matching' },
        { title: '堆与栈', href: '/learn/concepts/heap-stack' },
        { title: '内存布局', href: '/learn/concepts/memory-layout' },
      ],
    },
    {
      title: '数据结构',
      icon: '📦',
      href: '/learn/data-structures',
      subsections: [
        {
          name: '标准库提供',
          items: [],
        },
        {
          name: '自定义实现',
          items: [],
        },
      ],
    },
    {
      title: '三方库原理',
      icon: '🔧',
      href: '/learn/crates',
      items: [
        {
          title: 'Tokio - 异步运行时深度解析',
          href: '/learn/crates/tokio',
        },
      ],
    },
    {
      title: '网络编程 & 分布式',
      icon: '🌐',
      href: '/learn/network',
      items: [],
    },
  ];

  return sections;
}

/**
 * Filter hidden items from navigation based on visibility settings
 *
 * Note: If KV is not configured (local development), returns unfiltered navigation
 */
async function filterHiddenItems(sections: NavSection[]): Promise<NavSection[]> {
  // Check if KV is configured
  const kvConfigured = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

  if (!kvConfigured) {
    // KV not configured - return all items (local development)
    return sections;
  }

  try {
    // Collect all hrefs to check visibility
    const allHrefs: string[] = [];

    sections.forEach((section) => {
      if (section.href) allHrefs.push(section.href);
      if (section.items) {
        section.items.forEach((item) => {
          if (item.href) allHrefs.push(item.href);
        });
      }
    });

    // Convert hrefs to slugs (remove leading slash)
    const slugs = allHrefs.map((href) => href.replace(/^\//, ''));

    // Get visibility status for all slugs
    const visibilityMap = await getBatchVisibility(slugs);

    // Filter sections and items
    return sections
      .map((section) => {
        const sectionSlug = section.href?.replace(/^\//, '') || '';
        const sectionVisible = visibilityMap[sectionSlug] !== false;

        // Filter items if present
        const filteredItems = section.items
          ? section.items.filter((item) => {
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
        // Keep section if it has visible items or the section itself should be visible
        const hasVisibleItems = section.items && section.items.length > 0;
        const sectionSlug = section.href?.replace(/^\//, '') || '';
        const sectionVisible = visibilityMap[sectionSlug] !== false;

        return hasVisibleItems || sectionVisible;
      });
  } catch (error) {
    console.error('Error filtering navigation:', error);
    // Fail open - return all items if filtering fails
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
