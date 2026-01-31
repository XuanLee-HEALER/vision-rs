# 项目结构

Vision-RS 采用 Next.js App Router 的标准项目结构，结合功能模块化组织代码。

## 顶层目录结构

```text
vision-rs/
├── app/                    # Next.js App Router 应用目录
├── components/             # React 组件库
├── contexts/              # React Context 提供者
├── features/              # 功能模块
├── hooks/                 # 自定义 React Hooks
├── lib/                   # 工具函数和共享逻辑
├── public/                # 静态资源
├── scripts/               # 构建脚本
├── docs/                  # 项目文档
├── .claude/               # Claude 配置
├── .serena/               # Serena 配置
├── next.config.mjs        # Next.js 配置
├── tailwind.config.ts     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖
```

## `/app` - 应用路由

Next.js 16 使用文件系统路由，`app` 目录定义所有路由。

### 路由组结构

```text
app/
├── (site)/                # 主站路由组（不影响 URL）
│   ├── layout.tsx        # 主站布局
│   ├── page.tsx          # 首页 /
│   └── learn/            # 学习路由
│       ├── page.tsx      # /learn
│       ├── concepts/     # /learn/concepts
│       ├── crates/       # /learn/crates
│       ├── data-structures/
│       ├── network/
│       └── mental-model/
├── admin/                 # 管理后台 /admin
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   └── visibility/
├── api/                   # API 路由
│   ├── auth/
│   │   ├── send-code/
│   │   ├── verify-code/
│   │   ├── check/
│   │   └── logout/
│   └── admin/
│       └── visibility/
├── layout.tsx             # 根布局（全局）
├── globals.css            # 全局样式
└── sitemap.ts             # 站点地图生成
```

### 关键文件说明

#### `layout.tsx` - 布局组件

定义页面的共享布局：

```typescript
// app/layout.tsx - 根布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### `page.tsx` - 页面组件

定义实际的页面内容：

```typescript
// app/(site)/learn/page.tsx
export default function LearnPage() {
  return <div>学习首页</div>;
}
```

#### `loading.tsx` - 加载状态

定义加载时的占位内容：

```typescript
export default function Loading() {
  return <div>加载中...</div>;
}
```

#### `error.tsx` - 错误处理

捕获和处理错误：

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>出错了！</h2>
      <button onClick={reset}>重试</button>
    </div>
  );
}
```

### 路由组 `(site)`

使用括号 `()` 创建路由组，可以共享布局但不影响 URL 路径。

**作用**：

- 主站内容与后台管理分离
- 不同部分使用不同布局
- URL 保持简洁（`/learn` 而非 `/site/learn`）

## `/components` - 组件库

按功能分类组织 React 组件。

```text
components/
├── code/                  # 代码相关组件
│   └── InteractiveCodeBlock.client.tsx
├── content/               # 内容组件
│   └── TableOfContents.tsx
├── layout/                # 布局组件
│   ├── ContentShell.tsx
│   ├── LearnLayout.tsx
│   └── SiteHeader.tsx
├── navigation/            # 导航组件
│   ├── NavigationMenu.client.tsx
│   ├── Sidebar.tsx
│   ├── SidebarToggle.tsx
│   ├── SideMenu.tsx
│   └── SideMenuClient.tsx
├── search/                # 搜索功能
│   ├── SearchModal.client.tsx
│   └── SearchProvider.client.tsx
├── tokio/                 # Tokio 可视化
│   ├── RuntimeVisualization.tsx
│   ├── FutureStateMachine.tsx
│   ├── ReactorPattern.tsx
│   └── TaskScheduling.tsx
├── ui/                    # UI 组件
│   ├── AIChatButton.tsx
│   ├── ParticleCanvas.tsx
│   └── ScrollProgressBar.tsx
├── visibility/            # 可见性控制
│   ├── VisibilityBanner.tsx
│   ├── VisibilityGuard.tsx
│   └── VisibilityMeta.tsx
├── BorrowChecker.tsx      # 借用检查器可视化
├── LifetimeAnimation.tsx  # 生命周期动画
├── MDXEditor.tsx          # MDX 编辑器
├── MemoryLayout3D.tsx     # 3D 内存布局
├── MermaidDiagram.tsx     # Mermaid 图表
├── OwnershipFlow.tsx      # 所有权流动
└── TraitRelationship.tsx  # 特质关系图
```

### 组件命名约定

- **`.client.tsx`**：客户端组件（使用 `'use client'`）
- **`.tsx`**：服务端组件（默认）或可在两端使用的组件

### 组件分层

1. **UI 组件**（`ui/`）：纯展示，无业务逻辑
2. **布局组件**（`layout/`）：页面结构，组合其他组件
3. **功能组件**（`search/`, `navigation/`）：包含业务逻辑
4. **可视化组件**（`tokio/`, 根目录）：教学用可视化

## `/contexts` - 状态管理

React Context 提供全局状态。

```text
contexts/
├── AuthContext.tsx        # 认证状态
└── SideMenuContext.tsx    # 侧边菜单状态
```

### Context 使用模式

```typescript
// 定义 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 提供者组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## `/features` - 功能模块

封装特定功能的模块。

```text
features/
└── learn/
    ├── index.ts                   # 导出入口
    ├── mental-model-config.ts     # 心智模型配置
    ├── navigation.server.ts       # 导航数据（服务端）
    ├── toc.server.ts             # 目录生成（服务端）
    └── types.ts                   # 类型定义
```

### 模块化优势

- **关注点分离**：相关代码集中管理
- **类型安全**：共享类型定义
- **服务端/客户端分离**：明确标注 `.server.ts`
- **易于维护**：功能独立，修改影响小

## `/hooks` - 自定义 Hooks

可复用的 React Hooks。

```text
hooks/
├── useReadProgress.ts     # 阅读进度追踪
└── useScrollManager.ts    # 滚动管理
```

### Hooks 设计模式

```typescript
// useReadProgress.ts
export function useReadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress((scrolled / total) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
```

## `/lib` - 工具函数

共享的工具函数和配置。

```text
lib/
├── auth/                  # 认证相关
│   ├── check-admin.ts
│   ├── session.ts
│   └── verification.ts
└── visibility.ts          # 可见性控制
```

### 工具函数特点

- **纯函数**：无副作用，可测试
- **类型安全**：完整的 TypeScript 类型
- **通用性**：不依赖特定业务

```typescript
// lib/auth/verification.ts
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  // 验证逻辑
}
```

## `/scripts` - 构建脚本

构建时执行的脚本。

```text
scripts/
├── compile-mdx.mjs              # 编译 MDX 文件
├── generate-learn-index.ts      # 生成学习索引
├── generate-search-index.ts     # 生成搜索索引
└── generate-mental-model-templates.ts
```

### 脚本执行时机

```json
{
  "scripts": {
    "prebuild": "tsx scripts/generate-learn-index.ts && tsx scripts/generate-search-index.ts && node scripts/compile-mdx.mjs",
    "build": "next build"
  }
}
```

**执行顺序**：

1. `generate-learn-index.ts` - 生成导航索引
2. `generate-search-index.ts` - 生成搜索索引
3. `compile-mdx.mjs` - 编译所有 MDX 文件
4. `next build` - Next.js 构建

## `/public` - 静态资源

直接通过 URL 访问的静态文件。

```text
public/
├── search-index.json      # 搜索索引（构建时生成）
├── favicon.ico
└── images/
```

**访问方式**：

```typescript
// 访问 /public/search-index.json
fetch('/search-index.json');

// 访问 /public/images/logo.png
<Image src="/images/logo.png" alt="Logo" />
```

## `/docs` - 项目文档

项目文档和指南。

```text
docs/
├── architecture/          # 架构文档（本目录）
├── CODE_QUALITY.md       # 代码质量规范
├── LOCAL_WORKFLOW.md     # 本地开发工作流
├── SEARCH.md            # 搜索功能文档
├── UI.md                # UI 设计文档
└── VERCEL_DEPLOYMENT_GUIDE.md
```

## 配置文件

### `next.config.mjs`

Next.js 配置：

```javascript
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
};
```

### `tailwind.config.ts`

Tailwind CSS 配置，包含 Catppuccin 主题：

```typescript
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Catppuccin Macchiato 调色板
      },
    },
  },
};
```

### `tsconfig.json`

TypeScript 严格模式配置：

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "react-jsx"
  }
}
```

## 文件命名规范

- **组件文件**：PascalCase（`SearchModal.tsx`）
- **工具文件**：camelCase（`generateCode.ts`）
- **配置文件**：kebab-case（`next.config.mjs`）
- **客户端组件**：`.client.tsx` 后缀
- **服务端专用**：`.server.ts` 后缀

## 导入路径别名

使用 `@/` 作为项目根路径别名：

```typescript
// tsconfig.json
{
  "paths": {
    "@/*": ["./*"]
  }
}

// 使用
import SearchModal from '@/components/search/SearchModal.client';
import { useAuth } from '@/contexts/AuthContext';
import { generateCode } from '@/lib/auth/verification';
```

## 下一步

- 查看 [组件架构](./03-component-architecture.md) 深入了解组件设计
- 查看 [路由和导航](./04-routing-navigation.md) 了解路由实现
