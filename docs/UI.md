.
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                    # 首页（聚合）
│  ├─ posts/
│  │  ├─ page.tsx                 # 列表
│  │  ├─ [slug]/page.tsx          # 详情（SSG/ISR）
│  │  └─ [slug]/opengraph-image.tsx (可选)
│  ├─ tags/[tag]/page.tsx
│  ├─ rss.xml/route.ts            # RSS
│  ├─ sitemap.xml/route.ts        # Sitemap
│  └─ robots.txt/route.ts         # Robots
│
├─ content/
│  └─ posts/
│     ├─ xxx.mdx                  # 文章（frontmatter + mdx）
│     └─ ...
│
├─ features/
│  └─ post/
│     ├─ index.ts                 # 对外暴露 API
│     ├─ loader.server.ts         # 读文件/解析/frontmatter/索引（server-only）
│     ├─ mdx.server.ts            # MDX 编译/rehype/代码高亮（server-only）
│     └─ types.ts                 # Post 类型
│
├─ components/
│  ├─ site-header.tsx             # 默认 Server Component（纯展示）
│  ├─ toc.client.tsx              # 需要交互的才 use client
│  └─ mdx-components.tsx          # MDX 组件映射（code、img、callout…）
│
├─ lib/
│  ├─ env.ts                      # 环境变量校验
│  ├─ seo.ts                      # metadata 生成（OG/Twitter）
│  └─ utils.ts
│
├─ styles/                        # 可选（或用 Tailwind）
├─ public/
├─ tests/
│  ├─ unit/
│  └─ e2e/
│
├─ next.config.ts
├─ tsconfig.json
├─ package.json
└─ pnpm-lock.yaml