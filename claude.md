# Vision-RS - Claude AI 项目说明

## 项目概述

Vision-RS 是一个通过图文结合方式学习 Rust 编程语言的在线教育平台。本项目采用 Next.js 构建，旨在为 Rust 学习者提供深入、详细的学习资源。

## 核心特色

### 1. Pure Rust 深度详解
- 专注于 Rust 核心语言特性的深入讲解
- 详细解析 Rust 标准库（std）
- 未来计划涵盖 Tokio 异步运行时

### 2. 图文并茂的学习体验
- 结合图示、代码示例和文字说明
- 可视化展示 Rust 的所有权、借用、生命周期等核心概念
- 交互式代码示例和演示

### 3. 渐进式学习路径
- 从基础语法到高级特性
- 标准库详解
- 异步编程（Tokio）

## 技术栈

### 前端
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI / shadcn/ui
- **代码高亮**: Shiki / Prism
- **Markdown**: MDX (用于内容编写)

### 内容管理
- **方案**: 基于文件的内容管理（MDX files）
- **搜索**: Algolia / Meilisearch (可选)
- **代码执行**: Rust Playground API (在线运行代码)

### 部署
- **平台**: Vercel / Netlify
- **CDN**: 自动优化的静态资源

## 项目结构

```
vision-rs/
├── app/                    # Next.js App Router
│   ├── (routes)/          # 路由页面
│   │   ├── learn/         # 学习内容页面
│   │   ├── chapters/      # 章节详情
│   │   └── playground/    # 代码练习场
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── code-block/       # 代码块组件
│   ├── navigation/       # 导航组件
│   └── content/          # 内容展示组件
├── content/              # 学习内容（MDX）
│   ├── basics/           # 基础章节
│   ├── ownership/        # 所有权系统
│   ├── types/            # 类型系统
│   ├── stdlib/           # 标准库
│   └── async/            # 异步编程
├── lib/                  # 工具函数
│   ├── mdx.ts           # MDX 处理
│   ├── content.ts       # 内容加载
│   └── utils.ts         # 通用工具
├── public/               # 静态资源
│   ├── images/          # 图片资源
│   └── diagrams/        # 图表资源
├── styles/              # 样式文件
└── types/               # TypeScript 类型定义
```

## UI/UX 设计规范

### 设计理念
- **极简主义**: 减少视觉干扰，让内容成为焦点
- **纵向拉伸**: 充分利用垂直空间，提供沉浸式阅读体验
- **舒适配色**: 使用 Catppuccin Macchiato 主题，降低眼睛疲劳

### 整体布局

```
┌─────────────────────────────────────────────────────┐
│                    Banner Area                      │
│              (可自定义内容区域)                      │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   Sidebar    │        Main Content Area            │
│   (固定)      │        (可滚动)                      │
│              │                                      │
│  - 语言概念   │  ┌────────────────────────────┐    │
│  - 数据结构   │  │                            │    │
│  - 三方库     │  │   文字内容                  │    │
│  - 网络编程   │  │                            │    │
│              │  ├────────────────────────────┤    │
│              │  │   代码示例                  │    │
│              │  ├────────────────────────────┤    │
│              │  │   可视化图表                │    │
│              │  ├────────────────────────────┤    │
│              │  │   动画演示                  │    │
│              │  └────────────────────────────┘    │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

### 配色方案：Catppuccin Macchiato

```typescript
// 主色调
colors: {
  // 背景色
  base: '#24273a',        // 主背景
  mantle: '#1e2030',      // 次级背景
  crust: '#181926',       // 深背景（sidebar）

  // 表面色
  surface0: '#363a4f',    // 悬停状态
  surface1: '#494d64',    // 激活状态
  surface2: '#5b6078',    // 选中状态

  // 文字色
  text: '#cad3f5',        // 主文字
  subtext1: '#b8c0e0',    // 次级文字
  subtext0: '#a5adcb',    // 辅助文字

  // 叠加色
  overlay0: '#6e738d',    // 边框
  overlay1: '#8087a2',    // 分隔线
  overlay2: '#939ab7',    // 图标

  // 强调色
  blue: '#8aadf4',        // 链接、主要按钮
  lavender: '#b7bdf8',    // 次要强调
  sapphire: '#7dc4e4',    // 信息提示
  sky: '#91d7e3',         // 高亮
  teal: '#8bd5ca',        // 成功
  green: '#a6da95',       // 代码关键字
  yellow: '#eed49f',      // 警告
  peach: '#f5a97f',       // 重要
  maroon: '#ee99a0',      // 错误辅助
  red: '#ed8796',         // 错误
  mauve: '#c6a0f6',       // 特殊
  pink: '#f5bde6',        // 装饰
  flamingo: '#f0c6c6',    // 柔和强调
  rosewater: '#f4dbd6',   // 最柔和
}
```

### 布局细节

#### 1. Banner 区域
- **高度**: 80-120px（可调整）
- **位置**: 页面顶部，横跨全宽
- **用途**:
  - 项目标题/Logo
  - 可选的搜索栏
  - 主题切换按钮（预留）
  - 社交链接（GitHub 等）
- **背景**: `mantle` (#1e2030)
- **边框**: 底部 1px `overlay0`

#### 2. 侧边导航栏（Sidebar）
- **宽度**: 280px（固定）
- **位置**: 左侧，固定定位
- **背景**: `crust` (#181926)
- **内边距**: 24px
- **滚动**: 独立滚动区域

##### 导航结构（四大模块）

```typescript
{
  sections: [
    {
      title: "语言概念",
      icon: "🔤",
      items: [
        "变量与常量",
        "数据类型",
        "所有权系统",
        "借用与引用",
        "生命周期",
        "模式匹配",
        "泛型",
        "Trait",
        "错误处理",
        "宏系统",
        "内存布局",
        "堆与栈",
      ]
    },
    {
      title: "数据结构",
      icon: "📦",
      subsections: [
        {
          name: "标准库提供",
          items: [
            "Vec<T>",
            "HashMap<K, V>",
            "HashSet<T>",
            "BTreeMap/BTreeSet",
            "String & str",
            "Option<T>",
            "Result<T, E>",
            "Box<T>",
            "Rc<T> / Arc<T>",
            "RefCell<T>",
            "Cow<T>",
          ]
        },
        {
          name: "自定义实现",
          items: [
            "链表实现",
            "二叉树实现",
            "图结构实现",
            "LRU Cache",
            "Trie 树",
            "跳表",
          ]
        }
      ]
    },
    {
      title: "三方库原理",
      icon: "🔧",
      items: [
        "Tokio - 异步运行时",
        "Serde - 序列化框架",
        "Actix - Web 框架",
        "Rayon - 并行计算",
        "Diesel - ORM",
        "Axum - Web 框架",
        "async-std",
        "crossbeam - 并发工具",
      ]
    },
    {
      title: "网络编程 & 分布式",
      icon: "🌐",
      items: [
        "TCP/UDP 编程",
        "HTTP 协议实现",
        "WebSocket",
        "gRPC",
        "共识算法（Raft/Paxos）",
        "分布式事务",
        "消息队列",
        "负载均衡",
        "RPC 框架设计",
        "论文精读系列",
      ]
    }
  ]
}
```

##### 导航样式规范
- **分组标题**:
  - 字体: 16px, 粗体
  - 颜色: `text` (#cad3f5)
  - 间距: 上方 32px，下方 12px
- **导航项**:
  - 字体: 14px
  - 颜色: `subtext1` (#b8c0e0)
  - 悬停: 背景 `surface0`，颜色 `blue`
  - 激活: 背景 `surface1`，左边框 3px `blue`
  - 高度: 36px
  - 圆角: 6px
  - 过渡: all 0.2s ease

#### 3. 主内容区（Main Content）
- **位置**: 右侧，margin-left: 280px
- **最大宽度**: 900px（居中）
- **内边距**: 64px 48px
- **背景**: `base` (#24273a)

##### 内容元素样式

**标题层级**:
```css
h1:
  font-size: 36px
  color: text
  margin-bottom: 24px
  font-weight: 700

h2:
  font-size: 28px
  color: text
  margin-top: 48px
  margin-bottom: 20px
  font-weight: 600
  border-bottom: 2px solid overlay0

h3:
  font-size: 22px
  color: text
  margin-top: 32px
  margin-bottom: 16px
  font-weight: 600

h4:
  font-size: 18px
  color: subtext1
  margin-top: 24px
  margin-bottom: 12px
```

**段落**:
```css
p:
  font-size: 16px
  line-height: 1.8
  color: subtext1
  margin-bottom: 16px
```

**代码块**:
```css
pre:
  background: mantle
  border: 1px solid surface0
  border-radius: 8px
  padding: 20px
  margin: 24px 0
  overflow-x: auto
  font-size: 14px
  line-height: 1.6

  // 语法高亮使用 Catppuccin Macchiato 主题
```

**行内代码**:
```css
code:
  background: surface0
  color: mauve
  padding: 2px 6px
  border-radius: 4px
  font-size: 14px
  font-family: 'Fira Code', monospace
```

**图片**:
```css
img:
  max-width: 100%
  height: auto
  border-radius: 8px
  margin: 32px auto
  display: block
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)
```

**链接**:
```css
a:
  color: blue
  text-decoration: none
  border-bottom: 1px solid transparent
  transition: border-color 0.2s

  &:hover
    border-color: blue
```

### 响应式设计

**桌面端（>= 1024px）**:
- 侧边栏固定显示
- 内容区居中，最大宽度 900px

**平板端（768px - 1023px）**:
- 侧边栏可收起
- 使用汉堡菜单切换
- 内容区宽度自适应

**移动端（< 768px）**:
- 侧边栏完全隐藏，使用底部导航栏
- 内容区全宽
- Banner 高度减小到 60px

### 交互细节

1. **滚动行为**:
   - 侧边栏和内容区独立滚动
   - 内容区滚动时，自动高亮侧边栏对应项
   - 平滑滚动效果

2. **导航交互**:
   - 点击导航项，平滑滚动到对应位置
   - 当前阅读章节在侧边栏高亮显示
   - 子级菜单可折叠/展开

3. **代码块交互**:
   - 悬停显示"复制"按钮
   - 点击运行按钮（如果支持）
   - 支持行号显示

4. **动画效果**:
   - 页面切换使用淡入效果
   - 导航项悬停/激活使用平滑过渡
   - 图表/动画使用 Intersection Observer 懒加载

### 字体配置

```typescript
fonts: {
  sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
  mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
}
```

### 可访问性

- 键盘导航支持（Tab 键）
- ARIA 标签完整
- 对比度符合 WCAG AA 标准
- 支持屏幕阅读器

## 内容组织

### 章节结构
每个学习主题包含：
1. **概念介绍**: 文字说明 + 概念图
2. **代码示例**: 可运行的代码片段
3. **深入解析**: 详细的技术细节
4. **可视化**: 内存布局、执行流程图
5. **练习**: 互动式编码练习
6. **参考**: 官方文档链接

### 内容类型
- 教程（Tutorials）: 循序渐进的学习路径
- 参考（Reference）: 快速查找的 API 文档
- 示例（Examples）: 实际应用场景
- 可视化（Visualizations）: 概念图解

## 开发注意事项

### 1. 性能优化
- 使用 Next.js 的静态生成（SSG）
- 图片优化（next/image）
- 代码分割和懒加载
- MDX 内容缓存

### 2. SEO 优化
- 元数据配置
- 结构化数据
- 语义化 HTML
- OpenGraph 支持

### 3. 用户体验
- 响应式设计（移动端友好）
- 暗色模式支持
- 快速页面加载
- 流畅的导航体验
- 代码复制功能
- 进度追踪

### 4. 内容管理
- MDX 格式编写内容
- frontmatter 元数据管理
- 内容版本控制（Git）
- 自动生成目录结构

## 后端需求

### 不需要独立后端的功能
- 内容展示（静态生成）
- 代码高亮
- 基础导航
- 搜索（客户端或第三方服务）

### 可选的后端功能
- **用户系统**: 学习进度跟踪、书签
- **评论系统**: 内容讨论（可用第三方如 Giscus）
- **代码执行**: Rust Playground API（官方提供）
- **数据分析**: Vercel Analytics / Google Analytics

### 推荐方案
- **初期**: 纯静态站点，无需后端
- **中期**: 使用 Serverless Functions（Vercel/Netlify）处理简单交互
- **后期**: 如需复杂用户系统，可考虑 Supabase/Firebase

## 开发路线图

### Phase 1: MVP（最小可行产品）
- [ ] 项目初始化（Next.js + TypeScript）
- [ ] 基础 UI 框架搭建
- [ ] MDX 内容系统
- [ ] 代码块展示和高亮
- [ ] 基础导航和搜索
- [ ] 5-10 篇核心内容

### Phase 2: 内容扩充
- [ ] 完整的 Rust 基础教程
- [ ] 标准库详解
- [ ] 可视化图表集成
- [ ] 代码在线运行（Playground 集成）
- [ ] 暗色模式

### Phase 3: 增强体验
- [ ] 用户进度追踪
- [ ] 互动式练习题
- [ ] 社区功能（评论、讨论）
- [ ] 移动端 App（React Native / PWA）

### Phase 4: 高级内容
- [ ] Tokio 异步编程
- [ ] 实战项目案例
- [ ] 性能优化技巧
- [ ] 生态系统介绍

## 开发建议

### 对于前端不太擅长的开发者

1. **使用模板**: 从 Next.js 官方模板或 shadcn/ui 开始
2. **逐步学习**: 先实现基本功能，再优化
3. **参考现有项目**:
   - Rust Book 官方文档的布局
   - Tailwind CSS 文档站
   - MDN Web Docs 的交互设计
4. **使用 AI 辅助**: Claude 可以帮助编写前端代码
5. **社区资源**: Next.js 文档非常详细，有问题可以查阅

### 推荐的学习资源
- Next.js 官方文档: https://nextjs.org/docs
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- MDX: https://mdxjs.com/

## Claude AI 协助开发

### 你可以向 Claude 请求

1. **代码生成**
   - "帮我创建一个代码块组件，支持语法高亮和复制功能"
   - "实现一个侧边导航栏，展示章节目录"

2. **内容创作**
   - "用 MDX 格式写一篇关于 Rust 所有权的教程"
   - "创建一个关于 Vec<T> 的详细说明"

3. **问题解决**
   - "这段代码有什么问题？"
   - "如何优化这个组件的性能？"

4. **架构建议**
   - "这个功能应该如何实现？"
   - "这种数据结构合理吗？"

## 项目重点

### 内容质量（最重要）
- 准确性：确保 Rust 知识点正确
- 深度：不仅是语法，更要讲清楚原理
- 实用性：结合实际应用场景

### 用户体验
- 易读性：排版舒适，层次清晰
- 交互性：代码可运行，图表可交互
- 流畅性：快速加载，响应及时

### 可维护性
- 内容结构化：MDX + frontmatter
- 代码规范：TypeScript + ESLint
- 文档完善：README + 注释

## 注意事项

1. **版权**: 确保所有内容原创或有合法授权
2. **准确性**: Rust 内容需要经过验证，可参考官方文档
3. **持续更新**: Rust 在不断演进，内容需要跟进
4. **性能**: 图片和交互式内容需要优化
5. **无障碍**: 遵循 WCAG 标准，支持屏幕阅读器

## 技术债务避免

- 不要过早优化
- 保持代码简单
- 优先实现核心功能
- 定期重构
- 编写测试（E2E 测试优先）

## 联系和贡献

- 欢迎提交内容改进建议
- 欢迎报告错误和问题
- 欢迎贡献教程内容
