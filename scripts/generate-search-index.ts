/**
 * Generate search index with full content text
 *
 * Extracts content from MDX files for client-side search
 */

import fs from 'fs';
import path from 'path';
import { MENTAL_MODEL_CONFIG } from '../features/learn/mental-model-config';

export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string; // Full text content for search
  headings: string[]; // H2, H3 headings for better results
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

    // Extract metadata
    const metadataMatch = fullContent.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\});/);
    const titleMatch = metadataMatch?.[1].match(/["']?title["']?\s*:\s*["']([^"']+)["']/);
    const descMatch = metadataMatch?.[1].match(/["']?description["']?\s*:\s*["']([^"']+)["']/);

    // Remove frontmatter/metadata section
    let content = fullContent.replace(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\};?/, '');

    // Remove imports
    content = content.replace(/^import\s+.+$/gm, '');

    // Extract headings (H2, H3)
    const headings: string[] = [];
    const headingMatches = content.matchAll(/^##\s+(.+)$/gm);
    for (const match of headingMatches) {
      headings.push(match[1].trim());
    }

    // Remove markdown syntax for clean text
    content = content
      .replace(/^#{1,6}\s+/gm, '') // Remove heading markers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
      .replace(/`(.+?)`/g, '$1') // Remove inline code markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
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
 * Generate Mental Model search items
 */
function generateMentalModelSearchItems(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];

  for (const part of MENTAL_MODEL_CONFIG) {
    for (const chapter of part.chapters) {
      const filePath = path.join(
        process.cwd(),
        'app/(site)/learn/mental-model',
        part.slug,
        chapter.slug,
        'page.mdx'
      );

      if (fs.existsSync(filePath)) {
        const extracted = extractContentFromMdx(filePath);
        if (extracted) {
          items.push({
            slug: `learn/mental-model/${part.slug}/${chapter.slug}`,
            title: chapter.title,
            description: `${part.title} - ${chapter.title}`,
            category: 'mental-model',
            content: extracted.content,
            headings: extracted.headings,
          });
        }
      }
    }
  }

  return items;
}

/**
 * Generate Concepts search items
 */
function generateConceptsSearchItems(): SearchIndexItem[] {
  const conceptsDir = path.join(process.cwd(), 'app/(site)/learn/concepts');

  if (!fs.existsSync(conceptsDir)) {
    return [];
  }

  const items: SearchIndexItem[] = [];
  const entries = fs.readdirSync(conceptsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const pageMdx = path.join(conceptsDir, entry.name, 'page.mdx');

    if (fs.existsSync(pageMdx)) {
      const extracted = extractContentFromMdx(pageMdx);

      if (extracted) {
        items.push({
          slug: `learn/concepts/${entry.name}`,
          title: extracted.title,
          description: extracted.description || extracted.title,
          category: 'concepts',
          content: extracted.content,
          headings: extracted.headings,
        });
      }
    }
  }

  return items;
}

/**
 * Generate Crates search items (recursive scan)
 */
function generateCratesSearchItems(): SearchIndexItem[] {
  const cratesDir = path.join(process.cwd(), 'app/(site)/learn/crates');

  if (!fs.existsSync(cratesDir)) {
    return [];
  }

  const items: SearchIndexItem[] = [];

  function scanDirectory(dir: string, parentSlug: string = 'learn/crates') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subDir = path.join(dir, entry.name);
        scanDirectory(subDir, `${parentSlug}/${entry.name}`);
      } else if (entry.name === 'page.mdx') {
        const filePath = path.join(dir, entry.name);
        const extracted = extractContentFromMdx(filePath);

        if (extracted) {
          items.push({
            slug: parentSlug,
            title: extracted.title,
            description: extracted.description || extracted.title,
            category: 'crates',
            content: extracted.content,
            headings: extracted.headings,
          });
        }
      }
    }
  }

  scanDirectory(cratesDir);
  return items;
}

/**
 * Generate complete search index
 */
function generateSearchIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [
    ...generateMentalModelSearchItems(),
    ...generateConceptsSearchItems(),
    ...generateCratesSearchItems(),
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

  // Calculate total size
  const jsonStr = JSON.stringify(items);
  const sizeKB = (jsonStr.length / 1024).toFixed(2);
  console.log(`   索引大小: ${sizeKB} KB`);

  // Write to JSON file
  const outputPath = path.join(process.cwd(), 'public/search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');

  console.log(`\n✅ 搜索索引已生成: ${outputPath}`);
}

// If running script directly
if (require.main === module) {
  main();
}

export { generateSearchIndex };
