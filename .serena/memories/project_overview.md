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

## 设计规范
- 极简主义设计
- Catppuccin Macchiato 配色
- 侧边栏宽度: 280px
- 内容区最大宽度: 900px
