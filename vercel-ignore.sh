#!/bin/bash

# Vercel Deployment Control Script
# 退出码 0 = 跳过部署
# 退出码 1 = 触发部署

echo "🔍 Checking if deployment should be triggered..."

# 获取最新 commit message
COMMIT_MSG=$(git log -1 --pretty=%B)

echo "📝 Commit message: $COMMIT_MSG"

# ============================================
# 规则 1: 检查 commit message 中的特殊标记
# ============================================

# [skip ci], [skip deploy], [no deploy] - 跳过部署
if echo "$COMMIT_MSG" | grep -qiE "\[(skip ci|skip deploy|no deploy)\]"; then
  echo "🚫 Skipping deployment: commit contains skip flag"
  exit 0
fi

# [deploy], [force deploy] - 强制部署
if echo "$COMMIT_MSG" | grep -qiE "\[(deploy|force deploy)\]"; then
  echo "✅ Forcing deployment: commit contains deploy flag"
  exit 1
fi

# ============================================
# 规则 2: 检查 commit type 前缀
# ============================================

# docs: 或 chore: 类型的提交 - 通常跳过部署
if echo "$COMMIT_MSG" | grep -qE "^(docs|chore):"; then
  echo "🚫 Skipping deployment: documentation or chore commit"
  exit 0
fi

# ============================================
# 规则 3: 检查文件改动
# ============================================

# 获取改动的文件列表
# 注意：Vercel 使用浅克隆（--depth=10），HEAD^ 可能不存在
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null || git diff --name-only HEAD 2>/dev/null || git show --name-only --pretty="" HEAD)

# 如果没有改动，跳过
if [ -z "$CHANGED_FILES" ]; then
  echo "🚫 Skipping deployment: no file changes detected"
  exit 0
fi

echo "📂 Changed files:"
echo "$CHANGED_FILES"

# 只改动了文档、README、配置文件 - 跳过部署
if echo "$CHANGED_FILES" | grep -qvE "^(docs/|README\.md|\.github/|\.vscode/|\.claude/)"; then
  echo "✅ Deploying: contains code changes"
  exit 1
else
  echo "🚫 Skipping deployment: only documentation/config changes"
  exit 0
fi
