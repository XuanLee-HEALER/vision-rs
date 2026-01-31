# Vision-RS 项目概述

## 项目目的

Vision-RS 是一个通过图文结合方式学习 Rust 编程语言的在线教育平台。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **主题**: Catppuccin Macchiato (暗色主题)
- **内容**: MDX 格式
- **代码高亮**: Shiki

## 项目结构

```
vision-rs/
├── app/                    # Next.js App Router
│   ├── learn/             # 学习内容页面
│   │   └── concepts/      # 概念章节
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── Banner.tsx         # 顶部横幅
│   ├── Sidebar.tsx        # 侧边导航
│   └── LearnLayout.tsx    # 学习页面布局
├── lib/                   # 工具函数
│   └── navigation.ts      # 导航配置
└── content/              # 学习内容（MDX）
```

## 核心功能

1. 侧边导航栏 - 四大模块（语言概念、数据结构、三方库、网络编程）
2. MDX 内容渲染 - 支持 Markdown + React 组件
3. 代码高亮 - 使用 Shiki 和 Catppuccin 主题
4. 响应式设计 - 桌面/平板/移动端适配
5. 管理后台 - 内容可见性管理（开发模式自动跳过鉴权）

## 开发工具配置

### 代码质量工具

- **ESLint**: 已配置，用于 TypeScript/JavaScript 代码检查
- **Markdownlint**: 已配置，用于 Markdown 文件检查
- **Prettier**: 代码格式化工具

### Claude Code Hooks

- **format-code hook**: 在 Edit/Write 后自动运行
  - TypeScript/JavaScript: 运行 prettier + eslint
  - Markdown: 运行 prettier + markdownlint
  - 配置文件: `.claude/hooks/format-code.sh`

### 开发模式特性

- **管理后台鉴权**: 开发模式下自动跳过（lib/auth/session.ts）
- **热重载**: Next.js 自动支持

## 设计规范

- 极简主义设计
- Catppuccin Macchiato 配色
- 侧边栏宽度: 280px
- 内容区最大宽度: 900px

## 环境配置说明

### 环境文件结构

- `.env.local.example` - 配置模板（提交到 Git）
- `.env.local` - 本地实际配置（不提交，在 .gitignore 中）

### 必需的环境变量

#### 本地开发最小配置

1. `ADMIN_EMAILS` - 管理员邮箱白名单
2. `SESSION_SECRET` - Session 加密密钥（用 `openssl rand -base64 32` 生成）
3. `RESEND_API_KEY` - Resend 邮件服务 API Key

#### 生产环境完整配置

上述三项 + 以下配置：4. `KV_URL` / `KV_REST_API_URL` / `KV_REST_API_TOKEN` - Vercel KV 存储 5. `GITHUB_TOKEN` / `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` - GitHub API 6. `NEXT_PUBLIC_SITE_URL` - 站点 URL（可选）

### 配置文件位置

- 本地: `/Users/lixuan/Documents/project/vision-rs/.env.local`
- 生产: Vercel Dashboard → Settings → Environment Variables
