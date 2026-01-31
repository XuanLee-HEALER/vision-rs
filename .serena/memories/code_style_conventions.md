# 代码质量与风格规范

## ⚠️ 强制性规则 (MUST)

### TypeScript / JavaScript

**MUST 遵守**:
- 使用 ESLint 检查代码，修复所有错误
- 在提交前运行 `just check` 或 `pnpm lint`
- 使用 TypeScript strict mode
- 为所有公共 API 提供类型定义
- 避免使用 `any` 类型，使用 `unknown` 或具体类型

**MUST NOT 违反**:
- 提交包含 ESLint 错误的代码
- 使用 `@ts-ignore` (除非有充分理由并添加注释)
- 留下 `console.log` 在生产代码中 (除非在错误处理中)
- 使用 `var`，必须使用 `const` 或 `let`

**推荐规则**:
- 使用函数式组件和 Hooks
- 保持函数简短 (< 50 行)
- 使用有意义的变量和函数名
- 提取重复代码为可复用函数

---

## MDX 内容规范

**MUST 遵守**:
- 每个 MDX 文件顶部包含 frontmatter
- 使用 GitHub Flavored Markdown 语法
- 代码块必须指定语言 (如 \`\`\`typescript)
- 图片使用相对路径或 `/public` 路径
- 标题层级连续 (h1 → h2 → h3，不跳级)

**MUST NOT 违反**:
- 在 MDX 中使用内联 HTML `<style>` 标签
- 使用绝对 URL 引用本地资源
- 在代码块中包含敏感信息 (API Keys、密码等)

**Frontmatter 要求**:
```yaml
---
title: 页面标题 (必需)
description: 页面描述 (必需)
category: 分类 (必需: concepts/mental-model/crates)
order: 顺序 (可选)
published: true/false (可选，默认 true)
---
```

---

## Markdown 文档规范

**MUST 遵守**:
- 在提交前运行 `pnpm markdownlint "**/*.md" "**/*.mdx"` 并修复所有错误
- 标题使用 ATX 风格 (`#` 而非下划线)
- 列表缩进使用 2 空格
- 代码块使用围栏式 (\`\`\`) 而非缩进式
- 所有代码块必须指定语言
- 使用标题而非加粗文本作为章节分隔 (MD036)
- 文件以空行结尾

**MUST NOT 违反**:
- 使用缩进式代码块 (必须使用围栏式 \`\`\`)
- 代码块不指定语言 (MD040)
- 在标题末尾使用标点符号 (MD026)
- 使用加粗/斜体代替标题 (MD036)
- 使用 HTML 标签 (除非 Markdown 无法表达)
- 在文档中暴露真实的 API Keys 或敏感信息

**常见错误修复**:

MD040 - 代码块缺少语言标识:
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

MD046 - 代码块风格不一致:
```markdown
<!-- ❌ 错误 - 缩进式 -->
    code here

<!-- ✅ 正确 - 围栏式 -->
\`\`\`rust
code here
\`\`\`
```

MD036 - 加粗代替标题:
```markdown
<!-- ❌ 错误 -->
**重要章节**

<!-- ✅ 正确 -->
## 重要章节
```

---

## 代码格式化

**自动格式化工具**:
- **Prettier**: TypeScript、JavaScript、JSON、Markdown
- **Markdownlint**: Markdown 规范检查
- **ESLint**: 代码质量检查

**运行命令**:
```bash
# 格式化所有代码
just format
# 或
pnpm format

# 检查格式
pnpm format-check

# ESLint 检查
just lint
# 或
pnpm lint

# ESLint 自动修复
just lint-fix
# 或
pnpm lint --fix

# 类型检查
just typecheck

# 运行所有检查
just check  # lint + format-check + typecheck
```

---

## React 组件规范

**组件结构**:
- 使用函数式组件 (Function Components)
- 使用 `export default function ComponentName()`
- Props 接口定义在组件上方
- 组件文件使用 PascalCase 命名 (如 `Banner.tsx`)

**示例**:
```typescript
interface BannerProps {
  title: string;
  visible?: boolean;
}

export default function Banner({ title, visible = true }: BannerProps) {
  if (!visible) return null;
  
  return (
    <div className="banner">
      <h1>{title}</h1>
    </div>
  );
}
```

---

## Tailwind CSS

- 使用 Tailwind 工具类进行样式设计
- 遵循 Catppuccin Macchiato 配色方案
- 颜色变量已在 `tailwind.config.ts` 中定义
- 避免内联样式和 CSS 文件

---

## 文件命名约定

- **组件**: PascalCase (`Banner.tsx`, `Sidebar.tsx`)
- **函数/工具**: camelCase (`navigation.ts`, `isActive()`)
- **常量**: UPPER_SNAKE_CASE (`MAX_ITEMS`, `API_URL`)
- **类型/接口**: PascalCase (`BannerProps`, `NavigationItem`)

---

## 提交前检查清单

**必须执行** (每次提交前):
- [ ] 运行 `just check` (lint + format + typecheck) 全部通过
- [ ] 运行 `pnpm markdownlint "**/*.md" "**/*.mdx"` 无错误
- [ ] 删除所有 `console.log` 和调试代码
- [ ] 检查是否有敏感信息 (API Keys、密码)
- [ ] MDX 文件包含正确的 frontmatter
- [ ] 提交信息清晰描述变更内容

**快捷命令**:
```bash
just check  # 一键运行所有检查
```

---

## 违规处理

**所有代码质量规则都是强制性的。** 不符合规范的代码：

1. **MUST** 立即修复
2. **MUST NOT** 提交到仓库
3. **MUST** 在 PR review 中被拒绝

**没有例外，除非经过明确讨论和文档记录。**
