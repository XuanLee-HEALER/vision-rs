/**
 * Generate learning content index
 *
 * Scans app/(site)/learn page.mdx files to generate content inventory
 * Used for admin dashboard and visibility management
 */

import fs from 'fs';
import path from 'path';
import { FLAT_LEARN_CONFIG } from '../features/learn/flat-navigation-config';

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  filePath: string;
  type: 'mdx';
}

/**
 * Extract metadata from MDX file
 */
function extractMetadataFromMdx(filePath: string): { title: string; description: string } | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\});/);

    if (!metadataMatch) {
      return null;
    }

    const metadataStr = metadataMatch[1];
    const titleMatch = metadataStr.match(/["']?title["']?\s*:\s*["']([^"']+)["']/);
    const descMatch = metadataStr.match(/["']?description["']?\s*:\s*["']([^"']+)["']/);

    return {
      title: titleMatch ? titleMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
    };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

/**
 * Recursively scan a directory for page.mdx files
 */
function scanDirectory(dirPath: string, category: string): ContentItem[] {
  const items: ContentItem[] = [];

  if (!fs.existsSync(dirPath)) {
    return items;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // 递归扫描子目录
      items.push(...scanDirectory(fullPath, category));
    } else if (entry.isFile() && entry.name === 'page.mdx') {
      const metadata = extractMetadataFromMdx(fullPath);
      if (metadata) {
        const relativePath = fullPath.replace(process.cwd() + '/', '');
        const slug = relativePath.replace('app/(site)/', '').replace('/page.mdx', '');

        items.push({
          slug,
          title: metadata.title,
          description: metadata.description || metadata.title,
          category,
          filePath: relativePath,
          type: 'mdx',
        });
      }
    }
  }

  return items;
}

/**
 * Generate complete index
 */
function generateIndex(): ContentItem[] {
  const items: ContentItem[] = [];

  for (const section of FLAT_LEARN_CONFIG) {
    const sectionPath = path.join(process.cwd(), 'app/(site)/learn', section.slug);

    // 扫描该分类下的所有 MDX 文件（包括落地页和子章节）
    items.push(...scanDirectory(sectionPath, section.id));
  }

  items.sort((a, b) => a.slug.localeCompare(b.slug));
  return items;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 开始生成学习内容索引...\n');

  const items = generateIndex();

  console.log(`📊 统计:`);
  console.log(`   总计: ${items.length} 个内容项`);

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

  const outputPath = path.join(process.cwd(), 'app/(site)/learn/_index.generated.json');
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');

  console.log(`\n✅ 索引已生成: ${outputPath}`);
}

if (require.main === module) {
  main();
}

export { generateIndex };
