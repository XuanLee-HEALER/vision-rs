import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Lesson, LessonFrontmatter } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content/learn');

/**
 * 获取所有课程的 slug 列表
 * 用于 generateStaticParams
 */
export async function getAllLessonSlugs(): Promise<string[]> {
  const slugs: string[] = [];

  function traverse(dir: string, basePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        traverse(fullPath, relativePath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        // 将 concepts/ownership.mdx 转换为 concepts/ownership
        const slug = relativePath.replace(/\.mdx$/, '');
        slugs.push(slug);
      }
    }
  }

  if (fs.existsSync(CONTENT_DIR)) {
    traverse(CONTENT_DIR);
  }

  return slugs;
}

/**
 * 根据 slug 获取课程内容
 * @param slug - 例如 "concepts/ownership"
 */
export async function getLesson(slug: string): Promise<Lesson | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data as LessonFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error loading lesson: ${slug}`, error);
    return null;
  }
}

/**
 * 获取特定分类下的所有课程
 */
export async function getLessonsByCategory(category: string): Promise<Lesson[]> {
  const allSlugs = await getAllLessonSlugs();
  const lessons: Lesson[] = [];

  for (const slug of allSlugs) {
    if (slug.startsWith(`${category}/`)) {
      const lesson = await getLesson(slug);
      if (lesson) {
        lessons.push(lesson);
      }
    }
  }

  // 按 order 字段排序（如果有的话）
  return lessons.sort((a, b) => {
    const orderA = a.frontmatter.order ?? 999;
    const orderB = b.frontmatter.order ?? 999;
    return orderA - orderB;
  });
}
