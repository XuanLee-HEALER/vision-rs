#!/bin/bash
# Post-edit hook: 自动格式化代码
# 在 Claude 编辑或写入文件后运行

# 读取工具输入
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 如果没有文件路径，退出
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# 获取文件扩展名
EXT="${FILE_PATH##*.}"

# 切换到项目目录
cd "$CLAUDE_PROJECT_DIR" || exit 0

# 根据文件类型运行格式化
case "$EXT" in
    ts|tsx|js|jsx|json|md|mdx|css)
        # 检查 prettier 是否可用
        if command -v npx &> /dev/null && [ -f "node_modules/.bin/prettier" ]; then
            npx prettier --write "$FILE_PATH" 2>/dev/null || true
        fi
        ;;
esac

# 对 TypeScript 文件运行 ESLint 检查（仅报告，不阻塞）
case "$EXT" in
    ts|tsx)
        if command -v npx &> /dev/null && [ -f "node_modules/.bin/eslint" ]; then
            LINT_OUTPUT=$(npx eslint "$FILE_PATH" 2>/dev/null || true)
            if [ -n "$LINT_OUTPUT" ]; then
                echo "{\"additionalContext\": \"ESLint warnings for $FILE_PATH:\n$LINT_OUTPUT\"}"
            fi
        fi
        ;;
esac

exit 0
