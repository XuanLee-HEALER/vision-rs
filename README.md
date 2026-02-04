# Vision-RS

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

<!-- markdownlint-disable MD036 -->

**通过图文并茂的方式深入学习 Rust 编程语言**

<!-- markdownlint-enable MD036 -->

一个专注于 Rust 语言核心概念可视化的在线学习平台

[开始学习](#快速开始) · [学习内容](#学习内容) · [技术架构](#技术架构) · [贡献](#贡献)

</div>

---

## 项目简介

Vision-RS 是一个现代化的 Rust 学习平台，旨在通过**图文结合**和**可视化**的方式帮助开发者深入理解 Rust 编程语言。

### 为什么选择 Vision-RS？

- **系统化内容**: 从语言哲学到工程实践，循序渐进的学习路径
- **可视化学习**: 借用检查器、内存布局、所有权流等交互式组件
- **精美设计**: Catppuccin Macchiato 主题，舒适的阅读体验
- **开发者友好**: 开发模式下的实时 MDX 编辑器

### 最近更新 (2026-02)

- ✨ 升级 TypeScript 编译目标到 ESNext，支持最新 JavaScript 特性
- 🔒 增强开发 API 安全性，要求显式启用标志（`DEV_MDX_ENABLED`）
- 🐛 修复模块导入不一致问题（`crypto` 模块）
- 📈 改进并发写入的数据一致性处理和监控能力
- 🎨 全新杂志式主页设计，悬浮球个人简介交互

## 学习内容

当前内容分为 6 个主题分类：

| 分类              | 说明                                    | 图标 |
| ----------------- | --------------------------------------- | ---- |
| **Rust 设计哲学** | 所有权、生命周期、零成本抽象等核心理念  | 🧠   |
| **Rust 标准库**   | core/alloc/std 分层、内存管理、并发原语 | 📚   |
| **第三方库解析**  | Tokio、Serde、Future 生态等深度解析     | 🔧   |
| **数据结构**      | 内存布局、所有权绑定、工程视角          | 📦   |
| **网络协议**      | 协议语义、实现层关键问题、工程落地      | 🌐   |
| **分布式系统**    | 一致性、可靠性、工程权衡                | 🔄   |

## 技术架构

### 技术栈

| 类别     | 技术                                |
| -------- | ----------------------------------- |
| 框架     | Next.js 16 (App Router) + React 19  |
| 语言     | TypeScript 5 (ESNext target)        |
| 样式     | Tailwind CSS (Catppuccin Macchiato) |
| 内容     | MDX                                 |
| 代码高亮 | Shiki                               |
| 搜索     | Fuse.js                             |
| 认证     | iron-session + Resend               |
| 存储     | Vercel Edge Config / 内存           |
| 部署     | Vercel                              |

### 项目结构

```text
vision-rs/
├── app/
│   ├── (site)/              # 公开网站
│   │   └── learn/           # 学习内容 (MDX)
│   │       ├── rust-philosophy/
│   │       ├── rust-stdlib/
│   │       ├── third-party-libs/
│   │       ├── data-structures/
│   │       ├── network-protocols/
│   │       └── distributed-systems/
│   ├── (dev)/               # 开发工具
│   │   └── editor/          # MDX 实时编辑器
│   ├── admin/               # 管理后台
│   └── api/                 # API Routes
│       ├── auth/            # 认证 API
│       ├── admin/           # 管理 API
│       └── dev/             # 开发模式 API
├── components/
│   ├── layout/              # 布局组件 (Header, Footer)
│   ├── navigation/          # 导航组件 (Sidebar, SideMenu)
│   ├── search/              # 搜索组件
│   ├── visibility/          # 可见性控制
│   ├── tokio/               # Tokio 可视化组件
│   └── ui/                  # 基础 UI 组件
├── features/
│   ├── learn/               # 学习功能模块
│   └── editor/              # MDX 编辑器模块
├── lib/
│   ├── auth/                # 认证工具
│   ├── dev/                 # 开发工具 (安全验证、速率限制)
│   └── visibility.ts        # 可见性存储
├── scripts/                 # 构建脚本
│   ├── generate-learn-index.ts
│   └── generate-search-index.ts
└── docs/                    # 项目文档
```

### 核心功能

**学习系统**

- MDX 内容自动索引生成
- 响应式侧边栏导航
- 章节间导航
- 全文搜索 (Fuse.js)

**可视化组件**

- `BorrowChecker.tsx` - 借用检查器可视化
- `OwnershipFlow.tsx` - 所有权流动可视化
- `LifetimeAnimation.tsx` - 生命周期动画
- `MemoryLayout3D.tsx` - 3D 内存布局
- `tokio/` - Tokio 运行时可视化

**管理后台**

- 邮件验证码登录
- 内容可见性管理
- 运行时配置，无需重新构建

**开发模式 MDX 编辑器** (`/editor`)

- 实时预览
- 文件树管理 (新建/删除/重命名)
- 自动索引重新生成

## 快速开始

### 环境要求

- Node.js 18.17+
- pnpm

### 安装

```bash
git clone https://github.com/XuanLee-HEALER/vision-rs.git
cd vision-rs
pnpm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 访问
# - 学习内容: http://localhost:3000/learn
# - MDX 编辑器: http://localhost:3000/editor (开发模式)
```

### 构建

```bash
pnpm build  # 自动生成索引
pnpm start
```

### 代码检查

```bash
pnpm lint       # ESLint
pnpm tsc --noEmit  # TypeScript
```

## 环境变量

### 本地开发最小配置

```env
# 必需 - 管理后台
ADMIN_EMAILS=admin@example.com
SESSION_SECRET=xxx  # openssl rand -base64 32
RESEND_API_KEY=re_xxx

# 必需 - 启用开发 API (MDX 编辑器)
DEV_MDX_ENABLED=true
```

### 生产环境额外配置

```env
# Edge Config 存储 (Vercel 自动注入)
EDGE_CONFIG=xxx
VERCEL_API_TOKEN=xxx

# 可选 - SEO
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

详细配置说明见 `.env.local.example`。

## 贡献

欢迎贡献！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/xxx`)
3. 提交改动 (`git commit -m 'feat: xxx'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 开启 Pull Request

### 添加学习内容

```bash
# 在对应分类下创建 MDX 文件
mkdir -p app/(site)/learn/rust-philosophy/new-topic
touch app/(site)/learn/rust-philosophy/new-topic/page.mdx
```

MDX 文件需要导出 metadata：

```mdx
export const metadata = {
  title: '标题',
  description: '描述',
};

# 内容标题

正文内容...
```

## 许可证

[MIT License](LICENSE)

---

<div align="center">

⭐ 如果这个项目对你有帮助，欢迎 Star 支持！

</div>
