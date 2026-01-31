/**
 * Generate learning content index
 *
 * Scans app/(site)/learn page.mdx and page.tsx files to generate content inventory
 * Used for admin dashboard and visibility management
 */

import fs from 'fs';
import path from 'path';
import { MENTAL_MODEL_CONFIG } from '../features/learn/mental-model-config';

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  category: string; // 'concepts' | 'mental-model' | 'crates' | 'data-structures' | 'network'
  filePath: string; // Relative path from project root
  type: 'mdx' | 'tsx';
}

/**
 * Extract metadata from MDX file
 */
function extractMetadataFromMdx(filePath: string): { title: string; description: string } | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Match export const metadata = { ... }
    const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\});/);

    if (!metadataMatch) {
      return null;
    }

    // Simple JSON parsing (assumes correct format)
    const metadataStr = metadataMatch[1];

    // Extract title
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
 * Generate Mental Model content items
 */
function generateMentalModelItems(): ContentItem[] {
  const items: ContentItem[] = [];

  for (const part of MENTAL_MODEL_CONFIG) {
    for (const chapter of part.chapters) {
      const filePath = path.join(
        'app/(site)/learn/mental-model',
        part.slug,
        chapter.slug,
        'page.mdx'
      );

      items.push({
        slug: `learn/mental-model/${part.slug}/${chapter.slug}`,
        title: chapter.title,
        description: `${part.title} - ${chapter.title}`,
        category: 'mental-model',
        filePath,
        type: 'mdx',
      });
    }
  }

  return items;
}

/**
 * Generate Concepts content items
 */
function generateConceptsItems(): ContentItem[] {
  const conceptsDir = path.join(process.cwd(), 'app/(site)/learn/concepts');

  if (!fs.existsSync(conceptsDir)) {
    return [];
  }

  const items: ContentItem[] = [];
  const entries = fs.readdirSync(conceptsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pageMdx = path.join(conceptsDir, entry.name, 'page.mdx');

    if (fs.existsSync(pageMdx)) {
      const metadata = extractMetadataFromMdx(pageMdx);

      if (metadata) {
        items.push({
          slug: `learn/concepts/${entry.name}`,
          title: metadata.title,
          description: metadata.description || metadata.title,
          category: 'concepts',
          filePath: `app/(site)/learn/concepts/${entry.name}/page.mdx`,
          type: 'mdx',
        });
      }
    }
  }

  return items;
}

/**
 * Generate Crates content items (recursive scan)
 */
function generateCratesItems(): ContentItem[] {
  const cratesDir = path.join(process.cwd(), 'app/(site)/learn/crates');

  if (!fs.existsSync(cratesDir)) {
    return [];
  }

  const items: ContentItem[] = [];

  function scanDirectory(dir: string, parentSlug: string = 'learn/crates') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subDir = path.join(dir, entry.name);
        scanDirectory(subDir, `${parentSlug}/${entry.name}`);
      } else if (entry.name === 'page.mdx') {
        const filePath = path.join(dir, entry.name);
        const metadata = extractMetadataFromMdx(filePath);

        if (metadata) {
          const relativePath = path.relative(process.cwd(), filePath);
          items.push({
            slug: parentSlug,
            title: metadata.title,
            description: metadata.description || metadata.title,
            category: 'crates',
            filePath: relativePath,
            type: 'mdx',
          });
        }
      }
    }
  }

  scanDirectory(cratesDir);
  return items;
}

/**
 * Generate complete index
 */
function generateIndex(): ContentItem[] {
  const items: ContentItem[] = [
    ...generateMentalModelItems(),
    ...generateConceptsItems(),
    ...generateCratesItems(),
  ];

  // Sort by category and slug
  items.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.slug.localeCompare(b.slug);
  });

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

  // Write to JSON file
  const outputPath = path.join(process.cwd(), 'app/(site)/learn/_index.generated.json');
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');

  console.log(`\n✅ 索引已生成: ${outputPath}`);
}

// If running script directly
if (require.main === module) {
  main();
}

export { generateIndex };
