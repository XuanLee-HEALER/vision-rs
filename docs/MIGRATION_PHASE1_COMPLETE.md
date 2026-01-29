# Vision-RS 架构重构 - Phase 1 完成报告

## 完成时间

2026-01-29

## Phase 1 目标

搭建核心结构，确保单个页面能正常工作。

## 已完成的工作

### 1. 创建了新的目录结构 ✅

```
vision-rs/
├── app/
│   ├── (site)/                      # 新增：网站路由组
│   │   ├── layout.tsx              # 新增：网站布局
│   │   ├── page.tsx                # 移动：首页
│   │   └── learn/
│   │       ├── page.tsx            # 移动：学习中心页面
│   │       └── [...slug]/          # 新增：动态路由
│   │           └── page.tsx        # 新增：课程页面
│   └── layout.tsx                   # 简化：只保留 HTML 结构
├── content/                         # 新增：内容层
│   └── learn/
│       └── concepts/
│           └── ownership.mdx       # 移动并添加 frontmatter
├── features/                        # 新增：业务逻辑层
│   └── learn/
│       ├── types.ts                # 新增：类型定义
│       ├── loader.server.ts        # 新增：服务端加载器
│       └── index.ts                # 新增：公共 API
└── components/                      # 待重组
    └── (现有 12 个组件)
```

### 2. 实现了 features/learn 核心功能 ✅

**types.ts**

- `LessonFrontmatter`: MDX frontmatter 元数据类型
- `Lesson`: 完整的课程数据类型
- `TocItem`: 目录项类型
- `NavItem`, `NavSection`, `NavSubsection`: 导航类型
- `BreadcrumbItem`: 面包屑类型

**loader.server.ts**

- `getAllLessonSlugs()`: 获取所有课程 slug 列表（用于 generateStaticParams）
- `getLesson(slug)`: 根据 slug 加载课程内容
- `getLessonsByCategory(category)`: 获取分类下的所有课程

**index.ts**

- 导出所有类型和加载器函数

### 3. 创建了动态路由 ✅

**app/(site)/learn/[...slug]/page.tsx**

- 使用 catch-all 路由支持多段路径（如 `concepts/ownership`）
- 实现 `generateStaticParams()` 用于静态生成
- 实现 `generateMetadata()` 用于 SEO
- 使用 `next-mdx-remote` 在服务端渲染 MDX
- 自定义 MDX 组件，应用 Catppuccin Macchiato 主题样式

### 4. 迁移了 MDX 内容 ✅

**content/learn/concepts/ownership.mdx**

- 添加了完整的 frontmatter:
  ```yaml
  ---
  title: '所有权系统'
  description: '深入理解 Rust 的所有权系统'
  category: 'concepts'
  order: 3
  tags: ['ownership', 'memory', 'core-concept']
  ---
  ```
- 保留了所有原始内容
- 删除了旧的路由文件 `app/learn/concepts/ownership/page.mdx`

### 5. 简化了根布局 ✅

**app/layout.tsx**

- 移除了所有业务组件（Banner, Sidebar 等）
- 只保留 HTML 结构和全局样式
- 业务逻辑移到 `app/(site)/layout.tsx`

### 6. 修复了现有 Bug ✅

**components/ParticleCanvas.tsx**

- 修复了 TypeScript 类型错误
- 添加了 null 检查避免运行时错误
- 补充了 Particle 接口的方法定义

### 7. 安装了必要依赖 ✅

- 添加了 `next-mdx-remote@5.0.0` 用于服务端 MDX 渲染
- 已存在的依赖：`gray-matter`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`

## 验证测试 ✅

### 功能测试

- [x] 首页（/）正常加载
- [x] 学习中心（/learn）正常加载
- [x] 课程页面（/learn/concepts/ownership）正常加载
- [x] 页面标题正确显示："所有权系统 - Vision-RS"
- [x] MDX 内容正确渲染
- [x] 样式正确应用（Catppuccin Macchiato 主题）

### 技术验证

- [x] 类型检查通过
- [x] 构建成功
- [x] 开发服务器正常启动（端口 3500）
- [x] 静态页面预渲染成功

### 构建输出

```
Route (app)                              Size     First Load JS
┌ ○ /                                    178 B          94.1 kB
├ ○ /_not-found                          876 B            88 kB
├ ○ /learn                               178 B          94.1 kB
└ ● /learn/[...slug]                     136 B          87.3 kB
    └ /learn/concepts/ownership
```

## 技术决策说明

### 1. 为什么使用 `[...slug]` 而不是 `[slug]`？

`[...slug]` 是 catch-all 路由，可以匹配多段路径：

- `/learn/concepts/ownership` → `slug = ["concepts", "ownership"]`
- `/learn/data-structures/vec` → `slug = ["data-structures", "vec"]`

这样可以支持任意深度的内容层次结构，更灵活。

### 2. 为什么使用 `next-mdx-remote` 而不是 `@next/mdx`？

- `@next/mdx`：在构建时处理 MDX，适合文件式路由（如 `page.mdx`）
- `next-mdx-remote`：在运行时处理 MDX，适合动态加载内容

我们的内容在 `content/` 目录，不在 `app/` 路由中，所以需要动态加载和渲染，`next-mdx-remote` 是更合适的选择。

### 3. 为什么分离 frontmatter 和内容？

使用 `gray-matter` 解析 MDX：

- **frontmatter**：元数据（标题、描述、分类、标签等）
- **content**：实际的 Markdown/MDX 内容

这样可以：

- 在列表页只加载元数据，不加载完整内容（提升性能）
- 基于元数据进行排序、筛选、分类
- 生成 SEO 元数据

## 遗留问题

### 1. 组件未重组

12 个组件仍然平铺在 `components/` 根目录，需要在 Phase 2 按功能分类。

### 2. 导航数据硬编码

`lib/navigation.ts` 中的导航数据仍然是硬编码的，需要在 Phase 3 实现从 `content/` 扫描生成。

### 3. 缺少目录（TOC）提取

当前页面没有显示文章目录，需要在 Phase 3 实现服务端 TOC 提取。

### 4. 单一内容文件

只迁移了一个文件（ownership.mdx），其他内容文件需要逐步迁移。

## 下一步：Phase 2

Phase 2 的主要任务是**组件重组**：

1. 创建子目录并移动组件
2. 更新所有导入路径
3. 测试所有页面功能正常

预计时间：2-3 小时

## 启动命令

```bash
# 开发模式（3500 端口）
just dev-port 3500

# 构建
just build

# 类型检查
just typecheck
```

## 总结

Phase 1 成功完成！核心架构已搭建完成：

✅ 内容层（content/）独立存在
✅ 业务逻辑层（features/learn）实现基本功能
✅ 组件层（components/）暂时保持现状
✅ 动态路由正常工作
✅ 构建和开发环境正常

项目可以继续开发新功能，Phase 2 可以在后续逐步进行。
