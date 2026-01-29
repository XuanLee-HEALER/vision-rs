.
  ├─ app/
  │  ├─ (site)/                     # 公开站点路由组
  │  │  ├─ layout.tsx
  │  │  ├─ page.tsx                 # 首页
  │  │  ├─ learn/
  │  │  │  ├─ page.tsx              # 学习首页/聚合
  │  │  │  ├─ [slug]/page.tsx       # 通用章节页（由内容驱动）
  │  │  │  └─ (optional) opengraph-image.tsx
  │  │  ├─ api/
  │  │  │  └─ playground/route.ts   # 可选：代理 Rust Playground，避免前端直连
  │  │  ├─ rss.xml/route.ts         # 可选：自动生成
  │  │  ├─ sitemap.xml/route.ts
  │  │  └─ robots.txt/route.ts
  │  └─ globals.css
  │
  ├─ content/
  │  └─ learn/
  │     ├─ concepts/
  │     │  └─ ownership.mdx
  │     ├─ data-structures/
  │     │  └─ vec.mdx
  │     └─ ...                      # 以“学习域”组织，不叫 posts
  │
  ├─ features/
  │  └─ learn/
  │     ├─ index.ts                 # 对外 API（页面层只 import 这里）
  │     ├─ types.ts                 # Lesson/Section/Toc 等类型
  │     ├─ slugs.ts                 # slug 生成/校验（纯函数）
  │     ├─ navigation.ts            # 从 content 聚合出左侧导航树（server）
  │     ├─ loader.server.ts         # 读取 MDX + frontmatter（fs/gray-matter）
  │     ├─ mdx.server.ts            # MDX 编译/rehype/shiki（如果需要）
  │     ├─ toc.server.ts            # 目录提取（优先 server 生成，避免 client query DOM）
  │     └─ search.server.ts         # 可选：全文索引/搜索
  │
  ├─ components/
  │  ├─ layout/
  │  │  ├─ SiteShell.tsx            # 三栏布局骨架（尽量 Server Component）
  │  │  └─ LearnShell.tsx           # learn 专用布局
  │  ├─ navigation/
  │  │  ├─ Sidebar.client.tsx       # 折叠/高亮/进度等交互
  │  │  └─ Breadcrumbs.tsx
  │  ├─ content/
  │  │  ├─ MDXComponents.tsx        # MDX 组件映射（可导出给 mdx-components.tsx 用）
  │  │  ├─ TableOfContents.tsx      # 尽量接收 toc 数据（本身可 client，用于高亮/滚动）
  │  │  ├─ Callout.tsx
  │  │  └─ ...
  │  ├─ code/
  │  │  ├─ CodeBlock.tsx            # 纯展示（Server/Client 都可用）
  │  │  └─ InteractiveCodeBlock.client.tsx  # 运行/复制等
  │  └─ ui/                         # 低层可复用组件（Button/Popover 等）
  │
  ├─ hooks/
  │  └─ ...                         # 仅放“通用 hook”，不要塞业务逻辑
  │
  ├─ lib/
  │  ├─ env.ts                      # 环境变量/运行时配置
  │  ├─ seo.ts                      # metadata helpers
  │  ├─ routes.ts                   # 路由生成器（防止散落字符串）
  │  └─ utils.ts
  │
  ├─ mdx-components.tsx             # Next 约定入口：内部再 re-export components/content/MDXComponents
  ├─ next.config.mjs
  └─ ...