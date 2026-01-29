import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NavSection, NavItem, NavSubsection, LessonFrontmatter } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content/learn');

/**
 * 从 content/ 目录扫描并生成导航树
 */
export async function generateNavigation(): Promise<NavSection[]> {
  const sections: Record<string, NavSection> = {
    concepts: {
      title: '语言概念',
      icon: '🔤',
      items: [],
    },
    'data-structures': {
      title: '数据结构',
      icon: '📦',
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
    crates: {
      title: '三方库原理',
      icon: '🔧',
      items: [],
    },
    network: {
      title: '网络编程 & 分布式',
      icon: '🌐',
      items: [],
    },
  };

  if (!fs.existsSync(CONTENT_DIR)) {
    return Object.values(sections);
  }

  // 遍历所有 MDX 文件
  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  for (const category of categories) {
    if (!category.isDirectory()) continue;

    const categoryPath = path.join(CONTENT_DIR, category.name);
    const files = fs.readdirSync(categoryPath, { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.mdx')) continue;

      const filePath = path.join(categoryPath, file.name);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      const frontmatter = data as LessonFrontmatter;

      const slug = `${category.name}/${file.name.replace(/\.mdx$/, '')}`;
      const navItem: NavItem = {
        title: frontmatter.title,
        href: `/learn/${slug}`,
      };

      // 根据分类添加到对应的 section
      const section = sections[category.name];
      if (section) {
        if (section.items) {
          section.items.push(navItem);
        }
      }
    }
  }

  // 对每个 section 的 items 按 order 排序
  for (const section of Object.values(sections)) {
    if (section.items) {
      section.items.sort((a, b) => {
        // 如果有 order 字段，使用它排序
        // 否则按标题排序
        return a.title.localeCompare(b.title, 'zh-CN');
      });
    }
  }

  return Object.values(sections);
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
