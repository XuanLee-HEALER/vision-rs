/**
 * Mental Model 内容迁移脚本
 *
 * 从 content/mental-model/*.mdx 迁移到 app/(site)/learn/mental-model/[partSlug]/[chapterSlug]/page.mdx
 */

import fs from 'fs';
import path from 'path';
import { MENTAL_MODEL_CONFIG } from '../features/learn/mental-model-config';

interface MigrationTask {
  sourceFile: string;
  targetDir: string;
  targetFile: string;
  partSlug: string;
  chapterSlug: string;
  chapterId: string;
  title: string;
  partTitle: string;
}

/**
 * 生成迁移任务列表
 */
function generateMigrationTasks(): MigrationTask[] {
  const tasks: MigrationTask[] = [];

  for (const part of MENTAL_MODEL_CONFIG) {
    for (const chapter of part.chapters) {
      const sourceFile = path.join(process.cwd(), 'content/mental-model', `${chapter.slug}.mdx`);
      const targetDir = path.join(
        process.cwd(),
        'app/(site)/learn/mental-model',
        part.slug,
        chapter.slug
      );
      const targetFile = path.join(targetDir, 'page.mdx');

      tasks.push({
        sourceFile,
        targetDir,
        targetFile,
        partSlug: part.slug,
        chapterSlug: chapter.slug,
        chapterId: chapter.id,
        title: chapter.title,
        partTitle: part.title,
      });
    }
  }

  return tasks;
}

/**
 * 解析 YAML frontmatter
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];

  const frontmatter: Record<string, string> = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // 去除引号
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * 转换 MDX 内容格式
 */
function transformMdxContent(task: MigrationTask, originalContent: string): string {
  const { frontmatter, body } = parseFrontmatter(originalContent);

  // 生成新的 metadata export
  const metadata = {
    title: frontmatter.title || task.title,
    description: `${task.partTitle} - ${frontmatter.title || task.title}`,
    part: frontmatter.part || task.partTitle,
    chapter_id: frontmatter.chapter_id || task.chapterId,
  };

  // 构建新的 MDX 内容
  const newContent = `import LearnLayout from '@/components/LearnLayout';

export const metadata = ${JSON.stringify(metadata, null, 2)};

<LearnLayout>

${body.trim()}

</LearnLayout>
`;

  return newContent;
}

/**
 * 执行单个文件的迁移
 */
function migrateFile(task: MigrationTask): { success: boolean; error?: string } {
  try {
    // 检查源文件是否存在
    if (!fs.existsSync(task.sourceFile)) {
      return { success: false, error: `Source file not found: ${task.sourceFile}` };
    }

    // 读取源文件
    const originalContent = fs.readFileSync(task.sourceFile, 'utf-8');

    // 转换内容
    const newContent = transformMdxContent(task, originalContent);

    // 创建目标目录
    fs.mkdirSync(task.targetDir, { recursive: true });

    // 写入新文件
    fs.writeFileSync(task.targetFile, newContent, 'utf-8');

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始 Mental Model 内容迁移...\n');

  const tasks = generateMigrationTasks();
  console.log(`📋 总计 ${tasks.length} 个文件需要迁移\n`);

  let successCount = 0;
  let failCount = 0;

  for (const task of tasks) {
    const result = migrateFile(task);

    if (result.success) {
      successCount++;
      console.log(`✅ [${successCount}/${tasks.length}] ${task.chapterSlug}`);
    } else {
      failCount++;
      console.error(`❌ [${successCount + failCount}/${tasks.length}] ${task.chapterSlug}`);
      console.error(`   错误: ${result.error}\n`);
    }
  }

  console.log(`\n📊 迁移完成:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ❌ 失败: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  }
}

// 执行迁移
main();
