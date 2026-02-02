# 维护指南

本文档提供日常开发和维护 Vision-RS 的实用指南。

## 开发环境设置

### 1. 克隆仓库

```bash
git clone https://github.com/XuanLee-HEALER/vision-rs.git
cd vision-rs
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制示例配置：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```bash
# 认证密钥（自行生成）
SESSION_SECRET=your-secret-key-here

# 管理员邮箱（邮箱验证码白名单）
ADMIN_EMAILS=your-email@example.com

# 邮件服务（可选，开发环境会打印验证码到控制台）
RESEND_API_KEY=re_xxx
RESEND_DOMAIN=your-domain.com
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 <http://localhost:3000>

## 添加新文章/页面

### 方式一：使用 MDX 文件（推荐）

#### 1. 创建 MDX 文件

在相应的顶级主题目录下创建 `.mdx` 文件：

```bash
# 例如：在 Rust 设计哲学主题下添加新文章
touch app/(site)/learn/rust-philosophy/closures/page.mdx

# 或在标准库主题下添加
touch app/(site)/learn/rust-stdlib/string/page.mdx
```

**当前可用的顶级主题**：

- `rust-philosophy/` - Rust 设计哲学
- `rust-stdlib/` - Rust 标准库
- `third-party-libs/` - 第三方库解析
- `data-structures/` - 数据结构
- `network-protocols/` - 网络协议
- `distributed-systems/` - 分布式系统

#### 2. 添加 Metadata 和内容

```mdx
export const metadata = {
  title: '闭包 - Vision-RS',
  description: 'Rust 的闭包和函数式编程',
};

# 闭包

闭包是可以捕获环境变量的匿名函数。

## 基本语法

\`\`\`rust
let add_one = |x| x + 1;
let result = add_one(5); // 6
\`\`\`

## 捕获环境

\`\`\`rust
let x = 10;
let add_x = |y| x + y;
let result = add_x(5); // 15
\`\`\`
```

**注意**：

- MDX 文件会被 `app/(site)/learn/layout.tsx` 自动包裹 `LearnLayout`
- Metadata 会用于 SEO 和页面标题
- 不需要导入 `LearnLayout` 组件

#### 3. 编译 MDX

```bash
pnpm run compile-mdx
```

这会生成 `page.js` 文件。

#### 4. 更新导航（可选）

如果需要在导航中显示该文章，编辑 `features/learn/flat-navigation-config.ts`：

```typescript
export const FLAT_LEARN_CONFIG: LearnSection[] = [
  {
    id: 'rust-philosophy',
    title: 'Rust 设计哲学',
    slug: 'rust-philosophy',
    description: '...',
    icon: '🧠',
    order: 1,
    color: 'blue',
    // 添加子章节
    chapters: [
      {
        id: 'closures',
        title: '闭包',
        slug: 'closures',
      },
    ],
  },
  // ... 其他主题
];
```

#### 5. 重新生成索引

```bash
pnpm run generate-index
pnpm run generate-search
```

### 方式二：使用 TypeScript/TSX

#### 1. 创建 TSX 文件

```bash
touch app/(site)/learn/concepts/closures/page.tsx
```

#### 2. 编写页面组件

```typescript
import { Metadata } from 'next';
import LearnLayout from '@/components/layout/LearnLayout';

export const metadata: Metadata = {
  title: '闭包 - Vision-RS',
  description: 'Rust 的闭包和函数式编程',
};

export default function ClosuresPage() {
  return (
    <LearnLayout>
      <h1>闭包</h1>
      <p>闭包是可以捕获环境变量的匿名函数。</p>
      {/* 更多内容 */}
    </LearnLayout>
  );
}
```

## 创建新组件

### 1. 确定组件类型

- **服务端组件**：纯展示，无交互
- **客户端组件**：需要状态或事件处理

### 2. 选择合适的目录

```text
components/
├── ui/          # 通用 UI 组件
├── layout/      # 布局组件
├── navigation/  # 导航相关
├── search/      # 搜索功能
└── ...          # 或创建新目录
```

### 3. 创建组件文件

```typescript
// components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-overlay0 text-text',
    success: 'bg-green/20 text-green',
    warning: 'bg-yellow/20 text-yellow',
    error: 'bg-red/20 text-red',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
```

### 4. 如果是客户端组件

```typescript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### 5. 导出组件（如需要）

在 `components/index.ts` 或功能模块的 `index.ts` 中导出：

```typescript
export { default as Badge } from './ui/Badge';
export { default as Counter } from './ui/Counter';
```

## 修改样式主题

### Tailwind 配置

编辑 `tailwind.config.ts`：

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // 修改现有颜色
        blue: '#your-color',
        // 或添加新颜色
        primary: '#123456',
      },
      // 添加新的间距
      spacing: {
        '128': '32rem',
      },
    },
  },
};
```

### 全局样式

编辑 `app/globals.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 自定义基础样式 */
  body {
    @apply bg-base text-text;
  }
}

@layer components {
  /* 自定义组件样式 */
  .btn {
    @apply rounded-lg px-4 py-2 font-medium transition;
  }

  .btn-primary {
    @apply bg-blue text-base hover:bg-blue/90;
  }
}
```

## 更新依赖

### 检查过期依赖

```bash
pnpm outdated
```

### 更新依赖

```bash
# 更新所有依赖到最新（遵守 package.json 版本范围）
pnpm update

# 更新到最新版本（忽略 package.json 版本范围）
pnpm update --latest

# 更新特定包
pnpm update next react react-dom
```

### 测试更新

```bash
# 检查类型错误
pnpm typecheck

# 运行 linter
pnpm lint

# 本地测试
pnpm dev

# 构建测试
pnpm build
```

## 性能监控

### 构建分析

```bash
# 分析包大小
ANALYZE=true pnpm build
```

### 检查未使用的依赖

```bash
npx depcheck
```

### Lighthouse 性能测试

1. 构建生产版本：

```bash
pnpm build
pnpm start
```

2. 打开 Chrome DevTools > Lighthouse
3. 运行性能测试

## ESLint 配置

### 忽略文件配置

**重要**：项目使用 `eslint.config.mjs` 的 `ignores` 配置，**不再使用** `.eslintignore` 文件。

### 添加忽略规则

编辑 `eslint.config.mjs`：

```javascript
export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.claude/**', // Claude hooks
      'scripts/某个脚本.ts', // 添加新的忽略规则
      // ...
    ],
  },
  // ...
];
```

### Lint 范围

**运行时代码**（必须 lint clean）：

- `app/`
- `components/`
- `lib/`
- `features/`
- `contexts/`
- `hooks/`

**排除代码**（允许更宽松的规则）：

- `.claude/` - Claude hooks
- `scripts/migrate-mental-model.ts` - 废弃脚本

## 常见问题排查

### MDX 编译失败

**问题**：`pnpm run compile-mdx` 报错

**解决**：

1. 检查 MDX 语法是否正确
2. 确保导入的组件存在
3. 查看错误信息中的文件路径

```bash
# 重新编译单个文件
node scripts/compile-mdx.mjs app/(site)/learn/concepts/ownership/page.mdx
```

### 搜索索引不更新

**问题**：新文章不出现在搜索结果中

**解决**：

```bash
# 重新生成搜索索引
pnpm run generate-search

# 或完整重建
pnpm prebuild
pnpm build
```

### TypeScript 错误

**问题**：类型检查失败

**解决**：

```bash
# 运行类型检查
pnpm typecheck

# 查看详细错误
pnpm tsc --noEmit
```

### 样式不生效

**问题**：Tailwind 类名不起作用

**解决**：

1. 检查 `tailwind.config.ts` 的 `content` 配置
2. 确保文件路径匹配
3. 重启开发服务器

```bash
# 杀掉进程并重启
pkill -f "next dev"
pnpm dev
```

### 客户端组件水合错误

**问题**：`Hydration failed` 错误

**原因**：服务端和客户端渲染内容不一致

**解决**：

1. 检查是否在服务端组件中使用了浏览器 API
2. 使用 `useEffect` 延迟客户端特定逻辑
3. 使用 `suppressHydrationWarning` 属性（谨慎）

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function ClientOnlyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <div>{/* 客户端内容 */}</div>;
}
```

## Git 工作流

### 功能分支

```bash
# 从 main 创建功能分支
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 开发...

# 提交
git add .
git commit -m "feat: add new feature"

# 推送
git push -u origin feature/new-feature
```

### 提交信息规范

使用 Conventional Commits 格式：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**：

- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式化
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**：

```bash
git commit -m "feat(search): add keyboard navigation scroll fix"
git commit -m "docs(architecture): add maintenance guide"
git commit -m "fix(mdx): resolve compilation error in ownership page"
```

## 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署（Git push）

### 环境变量

在 Vercel 项目设置中添加：

```text
SESSION_SECRET=...
ADMIN_EMAILS=...
RESEND_API_KEY=...
RESEND_DOMAIN=...
```

### 手动部署

```bash
# 安装 Vercel CLI
pnpm install -g vercel

# 部署
vercel

# 部署到生产环境
vercel --prod
```

## Table of Contents (目录组件)

**当前实现**：DOM 扫描 + Intersection Observer

### 工作原理

文章右侧的目录组件（`components/mdx/TableOfContents.tsx`）通过以下方式工作：

1. **客户端扫描**：使用 `document.querySelectorAll` 扫描 `<article>` 中的 `h2` 和 `h3` 标题
2. **滚动高亮**：使用 Intersection Observer API 监听标题可见性
3. **自动生成**：无需手动配置，适配所有 MDX 文章

### 标题要求

- MDX 文件中的 `## 标题` 会自动生成 id（由 rehype-slug 插件处理）
- 支持中英文标题
- 目录只显示 h2 和 h3 级别的标题

### 修改目录行为

如果需要调整目录行为，编辑 `components/mdx/TableOfContents.tsx`：

```typescript
// 修改扫描的标题级别
const elements = Array.from(
  document.querySelectorAll('article h2, article h3, article h4') // 添加 h4
);

// 修改 Intersection Observer 配置
const observerOptions = {
  rootMargin: '-80px 0px -80% 0px', // 调整触发区域
  threshold: 1.0, // 调整可见度阈值
};
```

## 代码质量检查清单

发布前检查：

- [ ] 运行 `pnpm lint` 无错误
- [ ] 运行 `pnpm typecheck` 无错误
- [ ] 运行 `pnpm build` 构建成功
- [ ] 删除所有 `console.log` 和调试代码
- [ ] MDX 文件包含正确的 metadata
- [ ] 更新相关文档
- [ ] 提交信息清晰描述变更

## 文档维护

### 更新架构文档

当进行重大架构变更时，更新相应文档：

- 新增主要功能：更新 `README.md`
- 新增技术栈：更新 `01-tech-stack.md`
- 重组目录：更新 `02-project-structure.md`
- 新组件模式：更新 `03-component-architecture.md`

### 文档位置

```text
docs/
├── architecture/      # 本目录
├── CODE_QUALITY.md   # 代码规范
├── LOCAL_WORKFLOW.md # 本地开发
├── QUALITY_FIXES.md  # 质量修复记录
├── SEARCH.md         # 搜索功能
└── SECURITY.md       # 安全约束
```

## 获取帮助

- **Issue**：<https://github.com/XuanLee-HEALER/vision-rs/issues>
- **文档**：`/docs` 目录
- **代码注释**：查看源代码中的 JSDoc 注释

## 下一步

- 查看 [代码质量规范](../CODE_QUALITY.md)
- 查看 [本地工作流](../LOCAL_WORKFLOW.md)
- 开始贡献代码！
