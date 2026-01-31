import { NavSection } from './types';
import { MENTAL_MODEL_CONFIG } from './mental-model-config';

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
 * 获取导航数据（缓存版本）
 */
let cachedNavigation: NavSection[] | null = null;

export async function getNavigation(): Promise<NavSection[]> {
  if (cachedNavigation) {
    return cachedNavigation;
  }

  cachedNavigation = await generateNavigation();
  return cachedNavigation;
}
