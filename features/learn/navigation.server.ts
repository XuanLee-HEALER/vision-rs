import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NavSection, NavItem, NavSubsection, LessonFrontmatter } from './types';
import { MENTAL_MODEL_CONFIG } from './mental-model-config';

const CONTENT_DIR = path.join(process.cwd(), 'content/learn');

/**
 * 从 content/ 目录扫描并生成导航树
 */
export async function generateNavigation(): Promise<NavSection[]> {
  const sections: Record<string, NavSection> = {
    'mental-model': {
      title: 'Rust 心智世界',
      icon: '',
      href: '/learn/mental-model',
      items: MENTAL_MODEL_CONFIG.map((part) => ({
        title: part.title,
        href: `/learn/mental-model/${part.slug}`,
      })),
    },
    'data-structures': {
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
    crates: {
      title: '三方库原理',
      icon: '🔧',
      href: '/learn/crates',
      items: [],
    },
    network: {
      title: '网络编程 & 分布式',
      icon: '🌐',
      href: '/learn/network',
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

  // 对每个 section 的 items 排序
  for (const [key, section] of Object.entries(sections)) {
    if (section.items) {
      // mental-model 已经在 config 中按正确顺序定义，不需要重新排序
      if (key === 'mental-model') {
        continue;
      }

      // 其他 section 按标题排序
      section.items.sort((a, b) => {
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
