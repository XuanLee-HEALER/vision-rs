#!/usr/bin/env node
/**
 * PreCompact hook: 增量更新 Serena 项目记忆
 * 在对话压缩前自动提取关键学习内容并更新到 Serena 记忆中
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 读取输入
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);

    // 获取项目目录
    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    process.chdir(projectDir);

    // 检查 Serena 是否可用
    const serenaDir = path.join(projectDir, '.serena');
    if (!fs.existsSync(serenaDir)) {
      // Serena 未激活，静默退出
      process.exit(0);
    }

    // 提取会话信息
    const conversationData = data?.conversation || {};
    const messages = conversationData?.messages || [];

    // 如果消息太少，不值得更新记忆
    if (messages.length < 5) {
      process.exit(0);
    }

    // 分析会话内容，提取关键信息
    const learnings = extractLearnings(messages);

    if (learnings.length === 0) {
      process.exit(0);
    }

    // 构建提示词，让 Claude 自己决定如何更新记忆
    const prompt = buildMemoryUpdatePrompt(learnings);

    // 输出额外上下文，提示 Claude 更新记忆
    const response = {
      additionalContext: prompt,
    };

    console.log(JSON.stringify(response));
    process.exit(0);
  } catch (error) {
    // 静默失败，不阻塞压缩流程
    process.exit(0);
  }
});

/**
 * 从会话消息中提取学习内容
 */
function extractLearnings(messages) {
  const learnings = [];

  // 分析最近的几条消息
  const recentMessages = messages.slice(-10);

  for (const msg of recentMessages) {
    const content = msg.content || '';

    // 查找关键模式
    const patterns = [
      // 发现的 Bug 或问题
      {
        regex: /(发现|找到|遇到).*(bug|问题|错误|失败)/i,
        category: 'gotchas',
      },
      // 成功的解决方案
      {
        regex: /(修复|解决|完成).*(通过|使用|运行)/i,
        category: 'solutions',
      },
      // 有用的命令
      {
        regex: /```(?:bash|sh|shell)\n([\s\S]+?)\n```/g,
        category: 'commands',
      },
      // 配置变更
      {
        regex: /(配置|设置|添加).*(环境变量|env|config)/i,
        category: 'configuration',
      },
      // 代码模式
      {
        regex: /(使用|采用|遵循).*(模式|风格|约定)/i,
        category: 'patterns',
      },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(content)) {
        learnings.push({
          category: pattern.category,
          content: extractRelevantContext(content, pattern.regex),
        });
      }
    }
  }

  return learnings;
}

/**
 * 提取相关上下文
 */
function extractRelevantContext(content, regex) {
  const match = content.match(regex);
  if (!match) return '';

  // 提取匹配周围的上下文（前后各100个字符）
  const matchIndex = content.indexOf(match[0]);
  const start = Math.max(0, matchIndex - 100);
  const end = Math.min(content.length, matchIndex + match[0].length + 100);

  return content.slice(start, end).trim();
}

/**
 * 构建记忆更新提示词
 */
function buildMemoryUpdatePrompt(learnings) {
  const categories = groupBy(learnings, 'category');

  let prompt = `
🧠 **会话即将压缩 - 建议更新 Serena 项目记忆**

在此次会话中发现了以下值得记录的内容：

`;

  for (const [category, items] of Object.entries(categories)) {
    const categoryNames = {
      gotchas: '常见陷阱',
      solutions: '解决方案',
      commands: '有用命令',
      configuration: '配置变更',
      patterns: '代码模式',
    };

    prompt += `\n### ${categoryNames[category] || category}\n`;
    prompt += `发现 ${items.length} 条相关内容\n`;
  }

  prompt += `
**建议操作**：
如果这些内容对未来会话有帮助，请考虑：
1. 使用 Serena 的 write_memory 工具更新相应的记忆文件
2. 重点记录：命令、陷阱、配置变更、代码模式
3. 保持简洁 - 每条记录 1-2 行

**可更新的记忆文件**：
- project_overview.md - 项目概览和架构变更
- suggested_commands.md - 新发现的有用命令
- code_style_conventions.md - 代码风格和模式
- task_completion_checklist.md - 任务清单更新

⚠️ **注意**：这是建议，而非强制。只在内容确实重要时才更新。
`;

  return prompt;
}

/**
 * 按字段分组
 */
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key] || 'other';
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}
