import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import fs from 'fs/promises';
import { glob } from 'glob';

async function compileMDXFile(filePath: string) {
  console.log(`📝 编译: ${filePath}`);

  const source = await fs.readFile(filePath, 'utf-8');

  try {
    const result = await compile(source, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      outputFormat: 'program',
      development: false,
    });

    // 生成输出文件路径（.mdx -> .js）
    // 例如：page.mdx -> page.js
    const outputPath = filePath.replace(/\.mdx$/, '.js');

    // 写入编译结果
    await fs.writeFile(outputPath, String(result.value), 'utf-8');
    console.log(`   ✅ ${outputPath}`);

    return true;
  } catch (error: any) {
    console.error(`   ❌ 失败: ${error.message}`);
    if (error.position) {
      console.error(`      位置: 行${error.position.start.line}:列${error.position.start.column}`);
    }
    return false;
  }
}

async function main() {
  console.log('🔧 开始编译所有 MDX 文件...\n');

  // 查找所有 .mdx 文件
  const mdxFiles = await glob('app/**/*.mdx', {
    ignore: ['**/node_modules/**', '**/.next/**'],
  });

  console.log(`📊 找到 ${mdxFiles.length} 个 MDX 文件\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of mdxFiles) {
    const success = await compileMDXFile(file);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n✨ 编译完成！`);
  console.log(`   ✅ 成功: ${successCount} 个`);
  if (failCount > 0) {
    console.log(`   ❌ 失败: ${failCount} 个`);
  }

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('💥 编译过程出错:', error);
  process.exit(1);
});
