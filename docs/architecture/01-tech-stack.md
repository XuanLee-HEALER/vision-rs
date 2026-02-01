# 技术栈概览

Vision-RS 使用现代化的前端技术栈，充分利用 Next.js、React 和 TypeScript 的最新特性。

## 核心框架

### Next.js 16.1.6

**选择原因**：

- **App Router**：基于 React Server Components 的新路由系统
- **服务端渲染（SSR）**：改善首屏加载和 SEO
- **静态站点生成（SSG）**：学习内容适合预渲染
- **文件系统路由**：简化路由配置
- **内置优化**：自动代码分割、图片优化、字体优化

**关键特性使用**：

```typescript
// 服务端组件（默认）
export default function Page() {
  // 在服务端执行，直接访问文件系统
  const data = await readFile('...');
  return <div>{data}</div>;
}

// 客户端组件（需要交互）
'use client';
export default function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**App Router 结构**：

- `app/(site)` - 路由组，共享布局但不影响 URL
- `app/admin` - 管理后台路由
- `app/api` - API 路由
- `layout.tsx` - 布局组件
- `page.tsx` - 页面组件
- `loading.tsx` - 加载状态
- `error.tsx` - 错误处理

### React 19.2.4

**新特性利用**：

1. **自动批量更新**：

```typescript
// React 19 自动批量处理所有状态更新
function handleClick() {
  setCount((c) => c + 1);
  setFlag((f) => !f);
  // 只触发一次重渲染
}
```

2. **Suspense 改进**：

```typescript
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

3. **useTransition**：

```typescript
const [isPending, startTransition] = useTransition();

function handleSearch(query) {
  startTransition(() => {
    setSearchQuery(query); // 低优先级更新
  });
}
```

**组件模式**：

- **函数组件**：100% 使用函数组件
- **Hooks**：useState, useEffect, useMemo, useCallback, useRef
- **自定义 Hooks**：封装复用逻辑（见 `/hooks`）
- **Context**：全局状态管理（认证、菜单状态）

### TypeScript 5.x (Strict Mode)

**配置**：

```json
{
  "compilerOptions": {
    "strict": true, // 启用所有严格检查
    "noEmit": true, // Next.js 处理编译
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx", // React 19 JSX transform
    "target": "ES2017"
  }
}
```

**类型安全实践**：

```typescript
// 严格类型定义
interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  content: string;
}

// 避免 any，使用具体类型或 unknown
function processData(data: unknown) {
  if (typeof data === 'string') {
    // 类型收窄
  }
}

// Props 类型定义
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}
```

## 样式和UI

### Tailwind CSS 3.4.1

**配置特色**：

```javascript
// tailwind.config.ts
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Catppuccin Macchiato 主题
        base: '#24273a',
        text: '#cad3f5',
        blue: '#8aadf4',
        // ... 完整调色板
      },
    },
  },
};
```

**使用模式**：

- **工具类优先**：使用 Tailwind 工具类而非自定义 CSS
- **响应式**：`md:`, `lg:` 等断点前缀
- **状态变体**：`hover:`, `focus:`, `active:`
- **暗色主题**：全站使用 Catppuccin Macchiato 暗色主题

### Catppuccin Macchiato 主题

精心设计的调色板，提供舒适的阅读体验：

- **基础色**：`base`, `mantle`, `crust`
- **表面色**：`surface0`, `surface1`, `surface2`
- **文本色**：`text`, `subtext0`, `subtext1`
- **强调色**：`blue`, `green`, `yellow`, `red`, `pink`, `mauve`

## 内容和数据

### MDX (@mdx-js/loader 3.0.1)

**MDX = Markdown + JSX**：

```mdx
---
title: 所有权系统
description: Rust 的核心特性
---

import OwnershipFlow from '@/components/OwnershipFlow';

# 所有权系统

普通的 Markdown 文本...

<OwnershipFlow />

\`\`\`rust
fn main() {
let s = String::from("hello");
}
\`\`\`
```

**处理流程**：

1. **预编译**：`scripts/compile-mdx.mjs` 将 `.mdx` 编译为 `.js`
2. **服务端导入**：Next.js 直接导入编译后的 JS
3. **组件渲染**：MDX 内的 React 组件正常渲染

**配置**：

```javascript
// next.config.mjs
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});
```

### Fuse.js 7.1.0 (全文搜索)

**模糊搜索实现**：

```typescript
const fuse = new Fuse(searchIndex, {
  keys: [
    { name: 'title', weight: 3 }, // 标题权重最高
    { name: 'description', weight: 2 },
    { name: 'headings', weight: 1.5 },
    { name: 'content', weight: 1 }, // 正文权重最低
  ],
  threshold: 0.4,
  includeScore: true,
});

const results = fuse.search(query, { limit: 10 });
```

**搜索索引生成**：

- **脚本**：`scripts/generate-search-index.ts`
- **时机**：构建时（prebuild）
- **输出**：`public/search-index.json`

### Shiki 1.22.2 (代码高亮)

**优势**：

- 使用 VS Code 的语法高亮引擎
- 支持几乎所有编程语言
- 主题一致性好

**配置**：

```typescript
import { codeToHtml } from 'shiki';

const html = await codeToHtml(code, {
  lang: 'rust',
  theme: 'catppuccin-macchiato',
});
```

## 3D 可视化

### Three.js + React Three Fiber

**3D 内存布局可视化**：

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function MemoryLayout3D() {
  return (
    <Canvas>
      <ambientLight />
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </Canvas>
  );
}
```

**使用库**：

- `three@0.171.0` - 核心 3D 库
- `@react-three/fiber@9.5.0` - React 渲染器
- `@react-three/drei@10.7.7` - 辅助工具

### Framer Motion 11.11.17 (动画)

**声明式动画**：

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**使用场景**：

- 页面过渡动画
- 组件进入/退出动画
- 悬停和点击反馈
- 所有权转移可视化

### Mermaid 11.4.1 (图表)

**Markdown 式图表**：

```typescript
const chart = `
graph TD
    A[变量] --> B{可变?}
    B -->|是| C[mut 关键字]
    B -->|否| D[默认不可变]
`;

<MermaidDiagram chart={chart} />
```

### React Flow 11.11.4 (节点图)

**特质关系图**：

```typescript
const nodes = [
  { id: '1', data: { label: 'Display' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'Debug' }, position: { x: 200, y: 0 } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', label: 'extends' },
];

<ReactFlow nodes={nodes} edges={edges} />
```

## 认证和会话

### iron-session 8.0.4

**加密 Cookie 会话**：

```typescript
import { getIronSession } from 'iron-session';

const session = await getIronSession(cookies(), {
  password: process.env.SESSION_SECRET!,
  cookieName: 'vision-rs-session',
});
```

**优势**：

- 无需数据库存储会话
- 会话数据加密存储在 Cookie
- 防篡改保护

### Resend 6.9.1 (邮件服务)

**验证码邮件**：

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'noreply@vision-rs.com',
  to: email,
  subject: '登录验证码',
  html: `<p>验证码：${code}</p>`,
});
```

## 开发工具

### ESLint + Prettier

**代码质量保证**：

- **ESLint**：语法检查和最佳实践
- **Prettier**：代码格式化
- **集成**：保存时自动格式化

### pnpm (包管理器)

**选择原因**：

- 磁盘空间效率高
- 安装速度快
- 严格的依赖管理
- 支持 workspace

## 构建和部署

### Vercel (推荐部署平台)

**集成特性**：

- 自动部署（Git push）
- 边缘网络（CDN）
- 环境变量管理
- 分析和监控

**构建流程**：

```bash
pnpm prebuild  # 生成索引和编译 MDX
pnpm build     # Next.js 构建
```

## 依赖版本策略

- **主要依赖**：使用确定版本（如 `16.1.6`）
- **开发依赖**：允许小版本更新（如 `^3.8.1`）
- **定期更新**：每月检查依赖更新
- **测试**：更新后运行完整测试

## 性能优化

### 代码分割

- **自动分割**：Next.js 按路由自动分割
- **动态导入**：`dynamic()` 延迟加载大组件
- **React.lazy**：客户端组件懒加载

### 图片优化

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // 首屏图片
/>
```

### 字体优化

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

<body className={inter.className}>
```

## 下一步

- 查看 [项目结构](./02-project-structure.md) 了解目录组织
- 查看 [组件架构](./03-component-architecture.md) 了解组件设计
