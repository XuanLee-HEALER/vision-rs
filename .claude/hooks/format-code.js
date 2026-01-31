#!/usr/bin/env node
/**
 * Post-edit hook: 自动格式化代码
 * 跨平台支持 (Windows/macOS/Linux)
 * 在 Claude 编辑或写入文件后运行
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 读取工具输入
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data?.tool_input?.file_path;

    if (!filePath) {
      process.exit(0);
    }

    // 获取文件扩展名
    const ext = path.extname(filePath).slice(1);

    // 切换到项目目录
    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    process.chdir(projectDir);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      process.exit(0);
    }

    // 根据文件类型运行格式化
    const formattableExts = ['ts', 'tsx', 'js', 'jsx', 'json', 'md', 'mdx', 'css'];
    if (formattableExts.includes(ext)) {
      // 检查 prettier 是否可用
      const hasNodeModules = fs.existsSync(path.join(projectDir, 'node_modules'));

      if (hasNodeModules) {
        try {
          // Windows: npx.cmd, Unix: npx
          const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
          execSync(`${npxCmd} prettier --write "${filePath}"`, {
            stdio: 'pipe',
            timeout: 30000,
          });
        } catch (error) {
          // 静默失败，不阻塞工作流
        }
      }
    }

    // 对 TypeScript 文件运行 ESLint 检查（仅报告，不阻塞）
    const tsExts = ['ts', 'tsx'];
    if (tsExts.includes(ext)) {
      const hasNodeModules = fs.existsSync(path.join(projectDir, 'node_modules'));

      if (hasNodeModules) {
        try {
          const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
          const lintOutput = execSync(`${npxCmd} eslint "${filePath}"`, {
            stdio: 'pipe',
            timeout: 30000,
          }).toString();

          if (lintOutput.trim()) {
            const response = {
              additionalContext: `ESLint warnings for ${filePath}:\n${lintOutput}`,
            };
            console.log(JSON.stringify(response));
          }
        } catch (error) {
          // ESLint 失败时输出错误信息
          if (error.stdout && error.stdout.toString().trim()) {
            const response = {
              additionalContext: `ESLint warnings for ${filePath}:\n${error.stdout.toString()}`,
            };
            console.log(JSON.stringify(response));
          }
        }
      }
    }

    // 对 Markdown 文件运行 markdownlint 检查（仅报告，不阻塞）
    const mdExts = ['md', 'mdx'];
    if (mdExts.includes(ext)) {
      const hasNodeModules = fs.existsSync(path.join(projectDir, 'node_modules'));

      if (hasNodeModules) {
        try {
          const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
          // 使用 markdownlint-cli 而不是 markdownlint
          const lintOutput = execSync(`${npxCmd} markdownlint-cli "${filePath}"`, {
            stdio: 'pipe',
            timeout: 30000,
          }).toString();

          if (lintOutput.trim()) {
            const response = {
              additionalContext: `Markdownlint warnings for ${filePath}:\n${lintOutput}`,
            };
            console.log(JSON.stringify(response));
          }
        } catch (error) {
          // markdownlint 失败时输出错误信息
          if (error.stdout && error.stdout.toString().trim()) {
            const response = {
              additionalContext: `Markdownlint warnings for ${filePath}:\n${error.stdout.toString()}`,
            };
            console.log(JSON.stringify(response));
          }
        }
      }
    }

    process.exit(0);
  } catch (error) {
    // 静默失败，不阻塞工作流
    process.exit(0);
  }
});
