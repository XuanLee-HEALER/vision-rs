/**
 * Generate search index with full content text
 *
 * Extracts content from MDX files for client-side search
 */

import fs from 'fs';
import path from 'path';
import { FLAT_LEARN_CONFIG } from '../features/learn/flat-navigation-config';

export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
  headings: string[];
}

/**
 * Extract content and metadata from MDX file
 */
function extractContentFromMdx(filePath: string): {
  title: string;
  description: string;
  content: string;
  headings: string[];
} | null {
  try {
    const fullContent = fs.readFileSync(filePath, 'utf-8');

    const metadataMatch = fullContent.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\});/);
    const titleMatch = metadataMatch?.[1].match(/["']?title["']?\s*:\s*["']([^"']+)["']/);
    const descMatch = metadataMatch?.[1].match(/["']?description["']?\s*:\s*["']([^"']+)["']/);

    let content = fullContent.replace(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\};?/, '');
    content = content.replace(/^import\s+.+$/gm, '');

    const headings: string[] = [];
    const headingMatches = content.matchAll(/^##\s+(.+)$/gm);
    for (const match of headingMatches) {
      headings.push(match[1].trim());
    }

    content = content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`{3}[\s\S]*?`{3}/g, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      title: titleMatch?.[1] || '',
      description: descMatch?.[1] || '',
      content,
      headings,
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

/**
 * Recursively scan a directory for page.mdx files
 */
function scanDirectory(dirPath: string, category: string): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];

  if (!fs.existsSync(dirPath)) {
    return items;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      items.push(...scanDirectory(fullPath, category));
    } else if (entry.isFile() && entry.name === 'page.mdx') {
      const extracted = extractContentFromMdx(fullPath);
      if (extracted) {
        const relativePath = fullPath.replace(process.cwd() + '/', '');
        const slug = relativePath.replace('app/(site)/', '').replace('/page.mdx', '');

        items.push({
          slug,
          title: extracted.title,
          description: extracted.description || extracted.title,
          category,
          content: extracted.content,
          headings: extracted.headings,
        });
      }
    }
  }

  return items;
}

/**
 * Generate complete search index
 */
function generateSearchIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];

  for (const section of FLAT_LEARN_CONFIG) {
    const sectionPath = path.join(process.cwd(), 'app/(site)/learn', section.slug);
    items.push(...scanDirectory(sectionPath, section.id));
  }

  items.sort((a, b) => a.slug.localeCompare(b.slug));
  return items;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 开始生成搜索索引...\n');

  const items = generateSearchIndex();

  console.log(`📊 统计:`);
  console.log(`   总计: ${items.length} 个可搜索项`);

  const byCategory = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  for (const [category, count] of Object.entries(byCategory)) {
    console.log(`   ${category}: ${count} 项`);
  }

  const jsonStr = JSON.stringify(items);
  const sizeKB = (jsonStr.length / 1024).toFixed(2);
  console.log(`   索引大小: ${sizeKB} KB`);

  const outputPath = path.join(process.cwd(), 'public/search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');

  console.log(`\n✅ 搜索索引已生成: ${outputPath}`);
}

if (require.main === module) {
  main();
}

export { generateSearchIndex };
