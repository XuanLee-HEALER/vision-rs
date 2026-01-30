/**
 * 生成 Rust 心智世界的所有 MDX 模板文件
 */

import fs from 'fs';
import path from 'path';
import { MENTAL_MODEL_CONFIG } from '../features/learn/mental-model-config';

const CONTENT_DIR = path.join(process.cwd(), 'content/mental-model');

/**
 * 生成单个 Chapter 的 MDX 模板
 */
function generateChapterTemplate(chapter: {
  id: string;
  title: string;
  slug: string;
  referenceLinks?: string[];
  partTitle: string;
}) {
  const referenceSection = chapter.referenceLinks
    ? `
**参考资料**

${chapter.referenceLinks.map((link) => `- [The Rust Reference](${link})`).join('\n')}
`
    : '';

  // 转义 YAML 中的特殊字符
  const escapeYaml = (str: string) => str.replace(/"/g, '\\"');

  return `---
title: ${JSON.stringify(chapter.title)}
part: ${JSON.stringify(chapter.partTitle)}
chapter_id: ${JSON.stringify(chapter.id)}
---

# ${chapter.title}

${referenceSection}

## 文字叙述

> 主要概念解释

本节将深入探讨相关概念的核心要义。

## 图形表示

> 图表与示意图

（此处应包含精心设计的示意图，帮助读者建立直观的理解）

## 动画演示

> 状态变化与推导过程（如适用）

（通过动态演示展示概念的演变过程）

## 代码示例

> 最小但可推理的代码

\`\`\`rust
// 示例代码
fn example() {
    // TODO: 补充具体实现
}
\`\`\`

## 应用场景

> 实际应用

本节探讨的概念在实际开发中的应用场景包括：

- 场景一
- 场景二
- 场景三

## 总结

> 关键要点

本章核心要点：

1. 要点一
2. 要点二
3. 要点三

---

## 我的理解

> 此部分可通过管理后台编辑

（在这里记录你的个人理解、心得体会和延伸思考）
`;
}

/**
 * 主函数：生成所有模板文件
 */
async function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  let totalFiles = 0;
  let createdFiles = 0;
  let skippedFiles = 0;

  for (const part of MENTAL_MODEL_CONFIG) {
    for (const chapter of part.chapters) {
      totalFiles++;
      const filePath = path.join(CONTENT_DIR, `${chapter.slug}.mdx`);

      // 如果文件已存在，跳过
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  跳过已存在: ${chapter.slug}.mdx`);
        skippedFiles++;
        continue;
      }

      const template = generateChapterTemplate({
        ...chapter,
        partTitle: part.title,
      });

      fs.writeFileSync(filePath, template, 'utf-8');
      console.log(`✅ 创建: ${chapter.slug}.mdx`);
      createdFiles++;
    }
  }

  console.log('\n📊 统计：');
  console.log(`   总文件数: ${totalFiles}`);
  console.log(`   新创建: ${createdFiles}`);
  console.log(`   已跳过: ${skippedFiles}`);
  console.log('\n✨ 模板生成完成！');
}

main().catch(console.error);
