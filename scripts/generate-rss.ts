#!/usr/bin/env tsx
/**
 * 生成 RSS Feed
 * 在构建时自动运行，扫描所有 MDX 学习内容并生成 RSS XML
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LessonMetadata {
  title: string;
  description: string;
  category?: string;
  order?: number;
  published?: boolean;
  slug: string;
  path: string;
  modifiedTime: Date;
}

// RSS Feed 配置
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-rs.vercel.app';
const SITE_TITLE = 'Vision-RS - Rust 核心概念可视化学习';
const SITE_DESCRIPTION = '通过图文结合的方式，帮助开发者建立 Rust 语言的完整心智模型';
const AUTHOR_NAME = 'Vision-RS Team';
const AUTHOR_EMAIL = 'your-email@example.com';

/**
 * 扫描学习内容目录
 */
function scanLearnContent(): LessonMetadata[] {
  const learnDir = path.join(__dirname, '../app/(site)/learn');
  const lessons: LessonMetadata[] = [];

  if (!fs.existsSync(learnDir)) {
    console.warn('⚠️  Learn directory not found:', learnDir);
    return lessons;
  }

  const entries = fs.readdirSync(learnDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const mdxPath = path.join(learnDir, entry.name, 'page.mdx');
    if (!fs.existsSync(mdxPath)) continue;

    try {
      const content = fs.readFileSync(mdxPath, 'utf-8');
      const metadata = extractMetadata(content, entry.name);

      if (metadata) {
        // 获取文件修改时间
        const stats = fs.statSync(mdxPath);
        lessons.push({
          ...metadata,
          slug: entry.name,
          path: `/learn/${entry.name}`,
          modifiedTime: stats.mtime,
        });
      }
    } catch (error) {
      console.error(`Error processing ${entry.name}:`, error);
    }
  }

  return lessons;
}

/**
 * 从 MDX 内容中提取 metadata
 */
function extractMetadata(
  content: string,
  slug: string
): Omit<LessonMetadata, 'slug' | 'path' | 'modifiedTime'> | null {
  // 匹配 export const metadata = { ... }
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{([^}]+)\}/s);

  if (!metadataMatch) {
    return null;
  }

  const metadataStr = metadataMatch[1];

  // 提取 title
  const titleMatch = metadataStr.match(/title:\s*['"](.*?)['"]/);
  const title = titleMatch ? titleMatch[1] : slug;

  // 提取 description
  const descMatch = metadataStr.match(/description:\s*['"](.*?)['"]/s);
  const description = descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : '';

  // 提取 category（可选）
  const categoryMatch = metadataStr.match(/category:\s*['"](.*?)['"]/);
  const category = categoryMatch ? categoryMatch[1] : undefined;

  // 提取 order（可选）
  const orderMatch = metadataStr.match(/order:\s*(\d+)/);
  const order = orderMatch ? parseInt(orderMatch[1], 10) : undefined;

  // 提取 published（可选，默认 true）
  const publishedMatch = metadataStr.match(/published:\s*(true|false)/);
  const published = publishedMatch ? publishedMatch[1] === 'true' : true;

  return {
    title,
    description,
    category,
    order,
    published,
  };
}

/**
 * 生成 RSS Feed XML
 */
function generateRSSFeed(lessons: LessonMetadata[]): string {
  // 过滤未发布的内容
  const publishedLessons = lessons.filter((lesson) => lesson.published !== false);

  // 按修改时间排序（最新的在前）
  publishedLessons.sort((a, b) => b.modifiedTime.getTime() - a.modifiedTime.getTime());

  const now = new Date();

  const items = publishedLessons
    .map((lesson) => {
      const url = `${SITE_URL}${lesson.path}`;
      const pubDate = lesson.modifiedTime.toUTCString();

      return `    <item>
      <title><![CDATA[${escapeXML(lesson.title)}]]></title>
      <description><![CDATA[${escapeXML(lesson.description)}]]></description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${lesson.category ? `<category>${escapeXML(lesson.category)}</category>` : ''}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(SITE_TITLE)}</title>
    <description>${escapeXML(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <language>zh-CN</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
${items}
  </channel>
</rss>`;
}

/**
 * 转义 XML 特殊字符
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 主函数
 */
function main() {
  console.log('📡 Generating RSS feed...');

  try {
    // 扫描学习内容
    const lessons = scanLearnContent();
    console.log(`✓ Found ${lessons.length} lessons`);

    // 生成 RSS XML
    const rssXML = generateRSSFeed(lessons);

    // 写入 public 目录
    const outputPath = path.join(__dirname, '../public/rss.xml');
    fs.writeFileSync(outputPath, rssXML, 'utf-8');

    console.log(`✓ RSS feed generated: ${outputPath}`);
    console.log(
      `✓ Included ${lessons.filter((l) => l.published !== false).length} published lessons`
    );
  } catch (error) {
    console.error('❌ Error generating RSS feed:', error);
    process.exit(1);
  }
}

main();
