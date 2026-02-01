# Vision-RS 项目概述

## 项目目标

Vision-RS 是一个**基于 Rust Reference 的深度学习平台**，旨在通过图文结合的方式，帮助开发者建立 Rust 语言的完整心智模型。

> 核心理念：把 Rust 从「规范文本」→「可被人类长期内化的语言模型」

## 技术栈

### 前端

- **框架**: Next.js 16 (App Router + React 19)
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS
- **UI 主题**: Catppuccin Macchiato
- **内容格式**: MDX (支持 React 组件嵌入)
- **代码高亮**: Shiki

### 后端服务

- **邮件服务**: Resend (验证码登录)
- **存储**: Edge Config (内容可见性管理)
- **认证**: Iron Session (Cookie-based)

### 部署

- **平台**: Vercel
- **CI/CD**: 自动部署 (Push to main → 生产环境)
- **域名**: 支持自定义域名

## 项目结构

```
vision-rs/
├── app/                    # Next.js App Router
│   ├── (site)/            # 公开站点路由组
│   │   ├── page.tsx       # 首页
│   │   └── learn/         # 学习内容
│   │       ├── page.tsx   # 学习首页/聚合
│   │       └── [slug]/    # 动态章节页
│   ├── admin/             # 管理后台
│   │   ├── login/         # 登录页
│   │   └── visibility/    # 可见性管理
│   └── api/               # API 路由
├── content/               # MDX 学习内容
│   └── learn/
│       ├── concepts/      # 语言概念
│       ├── mental-model/  # 心智模型
│       └── crates/        # Crate 深度解析
├── features/              # 功能模块
│   └── learn/
│       ├── types.ts       # 类型定义
│       ├── navigation.ts  # 导航逻辑
│       └── loader.server.ts  # MDX 加载
├── components/            # React 组件
│   ├── layout/            # 布局组件
│   ├── navigation/        # 导航组件
│   ├── content/           # 内容组件
│   └── ui/                # 通用 UI 组件
└── lib/                   # 工具函数
    ├── env.ts             # 环境变量
    ├── auth/              # 认证逻辑
    └── edge-config/       # Edge Config 集成
```

## 核心功能

1. **MDX 内容系统**
   - 支持 Frontmatter (title, description, category, order)
   - 代码高亮 (Shiki + Catppuccin 主题)
   - 支持嵌入交互式 React 组件

2. **导航系统**
   - 三大学习域：concepts / mental-model / crates
   - 自动生成目录 (基于 frontmatter.order)
   - 侧边栏当前页高亮

3. **管理后台**
   - 邮件验证码登录 (Resend)
   - 内容可见性管理 (Edge Config)
   - 开发模式自动跳过鉴权

4. **部署系统**
   - Vercel 自动部署
   - Edge Config 存储
   - 环境变量管理

## 内容体系

详见 `docs/PART1.md` - Rust 语言心智模型系列大纲：

**Part 0**: Meta 篇 - 如何正确理解 Rust 规范  
**Part 1**: 静态世界总览 - Crates / Items / 命名空间  
**Part 2**: 表达式模型 - 表达式导向语言  
**Part 3**: 类型系统 - 约束集合而非类型形状  
**Part 4**: 所有权模型 - 语义管理而非内存管理  
**Part 5**: 借用与生命周期 - Rust 的证明系统  
**Part 6**: 模式系统 - 控制结构核心  
**Part 7**: Trait 系统 - 抽象能力根源  
**Part 8**: 泛型与单态化 - 零成本抽象  
**Part 9**: 内存模型 - Interior Mutability  
**Part 10**: 并发模型 - 类型系统防止数据竞争  
**Part 11**: Async/Future - 状态机生成  
**Part 12**: Unsafe Rust - 责任显式转移  
**Part 13**: 宏与元编程  
**Part 14**: 编译期 vs 运行期分界

## 环境变量

### 本地开发最小配置

- `ADMIN_EMAILS` - 管理员邮箱白名单
- `SESSION_SECRET` - Session 加密密钥 (`openssl rand -base64 32`)
- `RESEND_API_KEY` - Resend 邮件服务 API Key

### 生产环境额外配置

- `EDGE_CONFIG` - Edge Config 连接 URL (Vercel 自动注入)
- `VERCEL_API_TOKEN` - 用于更新 Edge Config (Vercel 自动注入)
- `NEXT_PUBLIC_SITE_URL` - 站点 URL (可选，用于 Sitemap)

### 配置文件位置

- **本地**: `.env.local` (不提交到 Git)
- **模板**: `.env.local.example` (提交到 Git)
- **生产**: Vercel Dashboard → Settings → Environment Variables

## 开发模式特性

- **管理后台免登录**: 开发环境下自动跳过鉴权 (lib/auth/session.ts)
- **热重载**: Next.js 自动支持
- **代码检查**: Claude Code Hooks 在 Edit/Write 后自动运行

## 设计规范

- **极简主义**: 内容为王，减少视觉干扰
- **配色**: Catppuccin Macchiato (暗色主题)
- **布局**: 侧边栏 280px + 内容区最大 900px
- **响应式**: 支持桌面/平板/移动端

## 工具链

### 包管理器

使用 **pnpm** (而非 npm/yarn)

### 任务执行器

使用 **just** - 提供统一的开发命令接口

### 部署工具

使用 **Vercel CLI** - 用于运维和环境变量管理
