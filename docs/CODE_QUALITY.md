# 代码质量要求

## TypeScript / JavaScript

### MUST 遵守的规则

- **MUST** 使用 ESLint 检查代码，修复所有错误
- **MUST** 在提交前运行 `pnpm lint` 确保无错误
- **MUST** 使用 TypeScript strict mode
- **MUST** 为所有公共 API 提供类型定义
- **MUST** 避免使用 `any` 类型，使用 `unknown` 或具体类型

### MUST NOT 违反的规则

- **MUST NOT** 提交包含 ESLint 错误的代码
- **MUST NOT** 使用 `@ts-ignore` 除非有充分理由并添加注释说明
- **MUST NOT** 留下 `console.log` 在生产代码中（除非在错误处理中）
- **MUST NOT** 使用 `var`，使用 `const` 或 `let`

### 推荐规则

- 使用函数式组件和 Hooks
- 保持函数简短（< 50 行）
- 使用有意义的变量和函数名
- 提取重复代码为可复用函数

---

## MDX 内容规范

### MUST 遵守的规则

- **MUST** 在每个 MDX 文件顶部包含 frontmatter
- **MUST** 使用 GitHub Flavored Markdown 语法
- **MUST** 代码块必须指定语言（如 \`\`\`typescript）
- **MUST** 图片使用相对路径或 `/public` 路径
- **MUST** 标题层级连续（h1 → h2 → h3，不跳级）

### MUST NOT 违反的规则

- **MUST NOT** 在 MDX 中使用内联 HTML `<style>` 标签
- **MUST NOT** 使用绝对 URL 引用本地资源
- **MUST NOT** 在代码块中包含敏感信息（API Keys、密码等）

### Frontmatter 要求

```yaml
---
title: 页面标题（必需）
description: 页面描述（必需）
category: 分类（必需：concepts/mental-model/crates）
order: 顺序（可选）
published: true/false（可选，默认 true）
---
```

---

## Markdown 文档规范

### MUST 遵守的规则

- **MUST** 在提交前运行 `pnpm markdownlint` 并修复所有错误
- **MUST** 标题使用 ATX 风格（`#` 而非下划线）
- **MUST** 列表缩进使用 2 空格
- **MUST** 代码块使用围栏式（\`\`\`）而非缩进式
- **MUST** 所有代码块必须指定语言（如 \`\`\`bash、\`\`\`typescript）
- **MUST** 使用标题而非加粗文本作为章节分隔（MD036）
- **MUST** 文件以空行结尾

### MUST NOT 违反的规则

- **MUST NOT** 使用缩进式代码块（必须使用围栏式 \`\`\`）
- **MUST NOT** 代码块不指定语言（MD040）
- **MUST NOT** 在标题末尾使用标点符号（MD026，除非确实需要）
- **MUST NOT** 使用加粗/斜体代替标题（MD036）
- **MUST NOT** 使用 HTML 标签（除非 Markdown 无法表达）
- **MUST NOT** 在文档中暴露真实的 API Keys 或敏感信息

### 常见 Markdownlint 错误及修复

**MD040 - 代码块缺少语言标识**：

```markdown
<!-- ❌ 错误 -->

\`\`\`
code here
\`\`\`

<!-- ✅ 正确 -->

\`\`\`bash
code here
\`\`\`
```

**MD046 - 代码块风格不一致**：

```markdown
<!-- ❌ 错误 - 缩进式 -->

    code here

<!-- ✅ 正确 - 围栏式 -->

\`\`\`rust
code here
\`\`\`
```

**MD036 - 加粗代替标题**：

```markdown
<!-- ❌ 错误 -->

**重要章节**

<!-- ✅ 正确 -->

## 重要章节
```

### 链接规范

- 内部链接使用相对路径：`[文本](../path/to/file.md)`
- 外部链接使用完整 URL：`[文本](https://example.com)`
- 图片使用描述性 alt 文本：`![描述](image.png)`

---

## 代码格式化

### 自动格式化工具

- **Prettier**: 自动格式化 TypeScript、JavaScript、JSON、Markdown
- **Markdownlint**: 检查 Markdown 规范
- **ESLint**: 检查代码质量

### 运行命令

```bash
# 格式化所有代码
pnpm format

# 检查格式
pnpm format-check

# ESLint 检查
pnpm lint

# ESLint 自动修复
pnpm lint --fix

# 或使用 just
just format
just lint
just lint-fix
```

---

## 提交前检查清单

- [ ] 运行 `pnpm lint` 无错误
- [ ] 运行 `pnpm format-check` 通过
- [ ] 运行 `pnpm typecheck` 无错误
- [ ] 运行 `pnpm markdownlint "**/*.md" "**/*.mdx"` 无错误
- [ ] 删除所有 `console.log` 和调试代码
- [ ] 检查是否有敏感信息（API Keys、密码）
- [ ] MDX 文件包含正确的 frontmatter
- [ ] 提交信息清晰描述变更内容

**或使用快捷命令**：

```bash
just check  # 运行 lint + format-check + typecheck
pnpm markdownlint "**/*.md" "**/*.mdx" --ignore node_modules --ignore .next
```

---

## 自动化检查

项目配置了以下自动化检查：

### Git Hooks（Claude Code）

- **Post Edit/Write**: 自动运行 Prettier 和 ESLint/Markdownlint
- 编辑文件后自动格式化和检查

### 配置文件

- `.eslintrc.json` - ESLint 配置
- `.prettierrc` - Prettier 配置
- `.markdownlint.json` - Markdownlint 配置

---

## 违规处理

**所有代码质量规则都是强制性的。** 不符合规范的代码：

1. **MUST** 立即修复
2. **MUST NOT** 提交到仓库
3. **MUST** 在 PR review 中被拒绝

**没有例外，除非经过明确讨论和文档记录。**
