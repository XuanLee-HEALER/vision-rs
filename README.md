# Vision-RS

<div align="center">

**通过图文并茂的方式深入学习 Rust 编程语言**

一个专注于 Rust 语言核心概念和标准库详解的在线学习平台

[开始学习](#快速开始) · [特色功能](#特色功能) · [技术架构](#技术架构) · [贡献指南](#贡献)

</div>

---

## 项目简介

Vision-RS 是一个现代化的 Rust 学习平台，旨在通过**图文结合**和**心智模型**的方式帮助开发者深入理解 Rust 编程语言。我们专注于 **Pure Rust** 的详细讲解，涵盖核心语言特性、标准库以及异步编程。

### 为什么选择 Vision-RS？

- **心智模型**: 构建 Rust 的完整心智模型，从静态世界到动态运行时
- **深度优先**: 不仅教你怎么写，更要让你明白为什么这么写
- **系统化内容**: 从基础到高级，循序渐进的学习路径
- **精美设计**: Catppuccin Macchiato 主题，舒适的阅读体验
- **渐进式发布**: 内容可见性管理，支持动态发布和隐藏

## 核心特色

### 1. Rust 心智模型（Mental Model）

通过 14 个 Part，30 个章节构建完整的 Rust 心智模型：

**Part 0: Meta（元认知）**

- 参考资料的定位和使用

**Part 1: 静态世界总览**

- Crates、Items、模块系统
- 命名空间、路径、可见性

**Part 2: 表达式模型**

- 表达式导向的编程思维
- 控制流与表达式

**Part 3: 类型系统**

- 类型的职责与边界
- 特殊类型（单元类型、Never 类型等）

**Part 4: 所有权系统**

- 所有权语义深入解析
- Move、Copy、Borrow 的本质

**Part 5: 借用与生命周期**

- Borrow Checker 工作原理
- 生命周期关系推导
- Higher-Ranked Trait Bounds (HRTB)

**Part 6: 模式匹配**

- 模式作为一等公民
- 穷尽性与可反驳性

**Part 7: Trait 系统**

- Trait 的三重角色
- Coherence 与 Orphan Rule
- 静态分发与动态分发

**Part 8: 泛型系统**

- 单态化（Monomorphization）
- 关联类型

**Part 9: 内存模型**

- 内存抽象层次
- 内部可变性模式

**Part 10: 并发模型**

- Send 与 Sync
- 并发安全保证

**Part 11: 异步编程**

- Async/Await 脱糖
- Pin 与自引用结构

**Part 12: Unsafe Rust**

- Unsafe 能力边界
- 安全抽象构建

**Part 13: 宏系统**

- 宏编译期展开
- 宏 vs 泛型

**Part 14: 编译期与运行时**

- 编译期计算
- 运行时行为

### 2. 语言核心概念（Concepts）

12 个核心概念的深入讲解：

- 变量与常量
- 数据类型
- 所有权系统
- 借用与引用
- 生命周期
- 模式匹配
- 泛型
- Trait
- 错误处理
- 宏系统
- 内存布局
- 堆与栈

### 3. 标准库与生态（Crates）

**Tokio 异步运行时**（4 个深度解析章节）：

- Tokio 架构总览
- Reactor 事件循环机制
- Runtime 运行时实现
- Scheduling 调度策略

未来计划：

- Serde（序列化框架）
- Actix/Axum（Web 框架）
- Rayon（并行计算）

### 4. 内容管理系统

**四层可见性控制架构**：

```
Level 0: 索引生成
  └─ 自动生成内容索引（prebuild）

Level 1: 首页过滤
  └─ 隐藏内容不出现在首页卡片

Level 2: 导航过滤
  └─ 隐藏内容不出现在侧边栏/移动菜单

Level 3: SEO 控制
  ├─ Sitemap 过滤
  └─ Robots Meta（noindex）

Level 4: 页面守卫
  ├─ 软隐藏策略（Banner + 内容）
  └─ 管理员/普通用户差异化提示
```

**管理后台**：

- 邮件验证码登录（Magic Link）
- 内容可见性管理
- 运行时修改，无需重新构建

### 5. UI/UX 设计

**Catppuccin Macchiato 主题**：

- 舒适的配色方案，降低眼睛疲劳
- 极简主义设计，内容为焦点
- 响应式布局，移动端友好

**导航体验**：

- 固定侧边栏（桌面端）
- 滑入式菜单（移动端）
- 智能跟随 Header 的定位

## 技术架构

### 前端技术栈

- **框架**: Next.js 14 (App Router + React Server Components)
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS (Catppuccin Macchiato)
- **UI 组件**: 自定义组件 + Radix UI
- **内容格式**: MDX (@next/mdx)
- **代码高亮**: Shiki
- **图标**: Lucide React

### 后端技术栈

- **运行时**: Next.js Serverless Functions
- **认证**: iron-session (加密 Cookie)
- **邮件**: Resend API
- **数据存储**: Vercel KV (Redis)
- **部署**: Vercel

### 核心系统

**可见性控制**：

- `lib/visibility.ts` - KV 存储 CRUD
- `components/visibility/VisibilityGuard.tsx` - 页面守卫
- `components/visibility/VisibilityBanner.tsx` - 状态提示
- `middleware.ts` - Pathname 传递

**管理后台**：

- `app/admin/visibility/page.tsx` - 可见性管理 UI
- `app/api/admin/visibility/route.ts` - 可见性 API
- `app/api/auth/*` - 认证 API（发送验证码、验证、登出）

**内容系统**：

- `app/(site)/learn/*` - 学习内容页面
- `scripts/generate-learn-index.ts` - 索引生成（prebuild）
- `app/sitemap.ts` - 动态 Sitemap 生成

## 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- pnpm / npm / yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/XuanLee-HEALER/vision-rs.git
cd vision-rs

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建

```bash
# 生产环境构建（自动生成索引）
pnpm build

# 启动生产服务器
pnpm start
```

### Lint

```bash
# 代码检查
pnpm lint
```

## 项目结构

```
vision-rs/
├── app/                           # Next.js App Router
│   ├── (site)/                   # 网站路由组
│   │   └── learn/                # 学习内容
│   │       ├── page.tsx          # 首页（过滤卡片）
│   │       ├── concepts/         # 语言概念（12 页 + layout）
│   │       ├── crates/           # 标准库与生态（4 页 + layout）
│   │       └── mental-model/     # 心智模型（30 页 + layout）
│   ├── admin/                    # 管理后台
│   │   ├── login/page.tsx        # 登录页
│   │   └── visibility/page.tsx   # 可见性管理
│   ├── api/                      # API Routes
│   │   ├── admin/visibility/     # 可见性管理 API
│   │   └── auth/                 # 认证 API
│   ├── sitemap.ts                # 动态 Sitemap
│   └── layout.tsx                # 根布局
├── components/                    # React 组件
│   ├── ui/                       # 基础 UI 组件
│   ├── code/                     # 代码块组件
│   ├── navigation/               # 导航组件（Sidebar、SideMenu）
│   ├── layout/                   # 布局组件
│   └── visibility/               # 可见性控制组件
├── features/                      # 业务功能模块
│   └── learn/                    # 学习功能
│       ├── index.ts              # 导出
│       └── navigation.server.ts  # 导航生成（服务端）
├── lib/                          # 工具库
│   ├── visibility.ts             # KV 可见性存储
│   └── auth/                     # 认证相关
│       ├── session.ts            # 会话管理
│       └── check-admin.ts        # 管理员检查
├── scripts/                       # 构建脚本
│   └── generate-learn-index.ts   # 索引生成（prebuild）
├── middleware.ts                  # 全局中间件
├── docs/                          # 文档
│   ├── UI.md                     # UI 设计规范
│   └── PART1.md                  # Part 1 内容规划
├── public/                        # 静态资源
└── styles/                        # 全局样式
```

## 内容统计

当前内容规模：

| 类别           | 页面数 | 说明                         |
| -------------- | ------ | ---------------------------- |
| Mental Model   | 30     | 14 个 Part，构建完整心智模型 |
| Concepts       | 12     | 核心语言概念深入讲解         |
| Crates (Tokio) | 4      | Tokio 异步运行时解析         |
| **总计**       | **46** | 所有学习内容页面             |

## 功能特性

### ✅ 已实现

- [x] 完整的 Rust 心智模型（30 个章节）
- [x] 核心概念讲解（12 个主题）
- [x] Tokio 深度解析（4 个章节）
- [x] 响应式设计（桌面端 + 移动端）
- [x] Catppuccin Macchiato 主题
- [x] 四层可见性控制架构
- [x] 管理后台（邮件验证码登录）
- [x] 内容动态发布/隐藏（运行时修改）
- [x] SEO 保护（Sitemap + Robots Meta）
- [x] 软隐藏策略（Banner 提示）
- [x] 自动索引生成（prebuild）

### 🚧 规划中

- [ ] 代码在线运行（Rust Playground 集成）
- [ ] 可视化图表和动画
- [ ] 更多标准库解析（Serde、Rayon 等）
- [ ] Web 框架详解（Actix、Axum）
- [ ] 用户学习进度追踪
- [ ] 社区讨论功能
- [ ] PWA 支持

## 环境变量

生产环境需要配置以下环境变量：

```env
# 管理员邮箱白名单（逗号分隔）
ADMIN_EMAILS=admin@example.com

# Resend API Key（邮件验证码）
RESEND_API_KEY=re_xxxxx

# Vercel KV（内容可见性存储）
KV_REST_API_URL=https://xxx.vercel.com
KV_REST_API_TOKEN=xxxxx

# Session 密钥（生成: openssl rand -base64 32）
SESSION_SECRET=xxxxx

# 站点 URL（Sitemap 生成）
NEXT_PUBLIC_SITE_URL=https://vision-rs.com
```

**本地开发**：

- 无需配置 KV（Fail-open 策略，所有内容可见）
- 无需配置邮件服务（登录功能不可用）

## 管理后台

### 登录

访问 `/admin/login`，输入管理员邮箱，接收验证码登录。

### 可见性管理

访问 `/admin/visibility`，可以：

- 查看所有内容的可见性状态
- 一键切换内容可见/隐藏
- 实时生效，无需重新构建

### 预览隐藏内容

管理员直接访问隐藏内容的 URL，会看到：

- 黄色横幅：「此内容当前不可见」
- 说明：普通用户无法通过导航和搜索发现
- 内容正常显示（管理员预览）

## 贡献

欢迎各种形式的贡献！

### 贡献方式

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- ✍️ 贡献教程内容
- 🎨 优化 UI/UX
- 🔧 提交代码修复

### 贡献流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 内容贡献指南

如果你想贡献教程内容：

1. 在 `app/(site)/learn/` 相应目录下创建页面
2. 使用 MDX 格式编写内容
3. 添加 metadata（标题、描述等）
4. 确保代码示例准确
5. 遵循现有的内容结构和风格
6. 运行 `pnpm build` 验证构建成功
7. 提交 PR

**自动化**：

- 索引生成：构建时自动运行（prebuild）
- 可见性：默认可见，可在管理后台调整

## 开发指南

### 添加新内容

```bash
# 1. 创建 MDX 文件
touch app/(site)/learn/concepts/new-topic/page.mdx

# 2. 编写内容（添加 metadata）
# export const metadata = {
#   title: "新主题",
#   description: "主题描述",
# };

# 3. 构建验证（自动生成索引）
pnpm build

# 4. 查看效果
pnpm dev
```

### 管理内容可见性

```bash
# 1. 配置环境变量（生产环境）
# 2. 登录管理后台 /admin/login
# 3. 访问 /admin/visibility
# 4. 切换内容状态
# 5. 立即生效（无需重新构建）
```

### 代码规范

```bash
# Lint 检查
pnpm lint

# 格式化（如果配置了 Prettier）
pnpm format
```

## 常见问题

### 为什么选择 MDX？

MDX 结合了 Markdown 的简洁性和 React 组件的交互性，非常适合技术文档和教程内容。

### 如何添加新的学习路径？

1. 在 `app/(site)/learn/` 下创建新目录
2. 添加 `layout.tsx`（包含 VisibilityGuard）
3. 创建内容页面（MDX）
4. 更新导航配置（如需要）

### 本地开发需要配置 KV 吗？

不需要。本地开发时，可见性系统使用 Fail-open 策略，所有内容自动可见。

### 如何自定义主题？

主题配置在 `tailwind.config.ts` 中，基于 Catppuccin Macchiato。可以修改颜色变量自定义主题。

## 性能指标

- **构建时间**: ~30 秒（包含索引生成）
- **静态页面**: 75 个
- **Middleware**: 26.3 kB
- **首屏加载**: < 2 秒
- **Lighthouse 评分**: 90+

## 许可证

[MIT License](LICENSE)

## 联系方式

- GitHub: [@XuanLee-HEALER](https://github.com/XuanLee-HEALER)
- Issues: [GitHub Issues](https://github.com/XuanLee-HEALER/vision-rs/issues)

## 致谢

- [Rust 官方文档](https://doc.rust-lang.org/)
- [Rust By Example](https://doc.rust-lang.org/rust-by-example/)
- [The Rust Programming Language Book](https://doc.rust-lang.org/book/)
- [Catppuccin](https://catppuccin.com/) - 主题配色
- [Next.js](https://nextjs.org/) - 前端框架
- [Vercel](https://vercel.com/) - 部署平台

---

<div align="center">

**用心构建 Rust 心智模型，让学习更系统**

⭐ 如果这个项目对你有帮助，欢迎 Star 支持！

</div>
