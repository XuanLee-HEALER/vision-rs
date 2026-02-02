#!/usr/bin/env node

/**
 * PreToolUse Hook: 在 git add 前检查并生成 MDX metadata
 *
 * 触发时机: Bash 工具执行 git add 命令前
 * 功能: 检查工作区的 MDX 文件，自动生成缺失的 metadata
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 读取工具输入
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const command = data?.tool_input?.command;

    // 只处理 git add 命令
    if (!command || !command.includes('git add')) {
      process.exit(0);
    }

    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    process.chdir(projectDir);

    // 获取工作区的 MDX 文件（未暂存的修改）
    const modifiedMDXFiles = getModifiedMDXFiles();

    if (modifiedMDXFiles.length === 0) {
      process.exit(0);
    }

    // 检查并生成 metadata
    const results = [];
    for (const file of modifiedMDXFiles) {
      const result = checkAndGenerateMetadata(file);
      if (result) {
        results.push(result);
      }
    }

    // 如果有文件被更新，返回提示
    if (results.length > 0) {
      const message = [
        '✅ MDX Metadata 已自动生成:',
        ...results.map((r) => `  - ${r.file}: ${r.action}`),
        '',
        '这些文件已更新，即将被 git add。',
      ].join('\n');

      const response = {
        additionalContext: message,
      };
      console.log(JSON.stringify(response));
    }

    process.exit(0);
  } catch (error) {
    // 静默失败，不阻塞工作流
    process.exit(0);
  }
});

/**
 * 获取工作区中修改的 MDX 文件
 */
function getModifiedMDXFiles() {
  try {
    // git status --porcelain 显示工作区状态
    // M = modified, A = added, ?? = untracked
    const output = execSync('git status --porcelain', {
      encoding: 'utf-8',
    });

    const files = output
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        // 格式: " M file.mdx" 或 "?? file.mdx"
        const match = line.match(/^\s*[MA?]{1,2}\s+(.+)$/);
        return match ? match[1] : null;
      })
      .filter((file) => file && file.endsWith('.mdx'));

    return files;
  } catch (error) {
    return [];
  }
}

/**
 * 检查 MDX 文件是否有 metadata，如果没有则生成
 */
function checkAndGenerateMetadata(filePath) {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // 检查是否已有 metadata
    const hasMetadata = /export\s+const\s+metadata\s+=\s+\{/.test(content);

    if (hasMetadata) {
      return null; // 已有 metadata，跳过
    }

    // 生成 metadata
    const metadata = generateMetadata(filePath, content);

    if (!metadata) {
      return null;
    }

    // 更新文件
    const metadataString = stringifyMetadata(metadata);
    const newContent = insertMetadata(content, metadataString);

    fs.writeFileSync(filePath, newContent, 'utf-8');

    return {
      file: filePath,
      action: '已生成 metadata',
    };
  } catch (error) {
    return null;
  }
}

/**
 * 从文件内容提取标题
 */
function extractTitle(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

/**
 * 从文件路径推断 metadata
 */
function inferMetadataFromPath(filePath) {
  const metadata = {};

  // Mental Model 模式
  const mentalModelMatch = filePath.match(
    /learn\/mental-model\/(part-\d+-[^/]+)\/(\d+-\d+-[^/]+)\/page\.mdx$/
  );

  if (mentalModelMatch) {
    const [, partSlug, chapterSlug] = mentalModelMatch;

    const partMatch = partSlug.match(/part-(\d+)-(.+)/);
    if (partMatch) {
      metadata.partNumber = parseInt(partMatch[1]);
    }

    const chapterMatch = chapterSlug.match(/^(\d+-\d+)-/);
    if (chapterMatch) {
      metadata.chapter_id = chapterMatch[1];
    }
  }

  // Concepts 模式
  const conceptsMatch = filePath.match(/learn\/concepts\/([^/]+)\/page\.mdx$/);
  if (conceptsMatch) {
    metadata.category = 'concepts';
  }

  // Crates 模式
  const cratesMatch = filePath.match(/learn\/crates\/([^/]+)\/page\.mdx$/);
  if (cratesMatch) {
    metadata.category = 'crates';
  }

  return metadata;
}

/**
 * 生成 metadata 对象
 */
function generateMetadata(filePath, content) {
  const title = extractTitle(content);

  if (!title) {
    return null;
  }

  const inferred = inferMetadataFromPath(filePath);
  const metadata = { title };

  // 生成描述
  if (inferred.category === 'concepts') {
    metadata.description = `Rust 核心概念 - ${title}`;
  } else if (inferred.category === 'crates') {
    metadata.description = `三方库原理 - ${title}`;
  } else if (inferred.partNumber !== undefined) {
    metadata.description = `Part ${inferred.partNumber} - ${title}`;
  } else {
    metadata.description = title;
  }

  // Mental Model 特定字段
  if (inferred.chapter_id) {
    metadata.chapter_id = inferred.chapter_id;
  }

  return metadata;
}

/**
 * 将 metadata 对象转换为字符串
 */
function stringifyMetadata(metadata) {
  const lines = ['export const metadata = {'];

  const escape = (str) => str.replace(/'/g, "\\'");

  if (metadata.title) {
    lines.push(`  title: '${escape(metadata.title)}',`);
  }
  if (metadata.description) {
    lines.push(`  description: '${escape(metadata.description)}',`);
  }
  if (metadata.chapter_id) {
    lines.push(`  chapter_id: '${metadata.chapter_id}',`);
  }

  lines.push('};');
  return lines.join('\n');
}

/**
 * 将 metadata 插入文件内容
 */
function insertMetadata(content, metadataString) {
  // 在 import 语句之后插入
  const importMatch = content.match(/^(import\s+.+\n)+/);

  if (importMatch) {
    const importSection = importMatch[0];
    const restContent = content.slice(importSection.length);
    return `${importSection}\n${metadataString}\n${restContent}`;
  }

  // 在文件开头插入
  return `${metadataString}\n\n${content}`;
}
