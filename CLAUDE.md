# Vision-RS - 项目说明

## ⚠️ 强制性要求（MUST）

**在进行任何开发工作前，你 MUST 阅读并严格遵守以下文档：**

1. **[代码质量要求](./docs/CODE_QUALITY.md)** - MUST 遵守
2. **[本地开发工作流](./docs/LOCAL_WORKFLOW.md)** - MUST 遵守
3. **[Vercel 部署指南](./docs/VERCEL_DEPLOYMENT_GUIDE.md)** - 生产部署必读

### 🚫 MUST NOT 违反的核心规则

- **MUST NOT** 提交包含 ESLint 错误的代码
- **MUST NOT** 提交未格式化的代码
- **MUST NOT** 提交敏感信息（API Keys、密码、真实邮箱）
- **MUST NOT** 在文档中使用真实的 API Keys（使用 `xxx` 占位符）
- **MUST NOT** 直接在 `main` 分支开发
- **MUST NOT** 使用无意义的提交信息

### ✅ MUST 执行的规则

- **MUST** 在提交前运行 `just check`（lint + format + typecheck）
- **MUST** 使用约定式提交格式：`<type>: <description>`
- **MUST** 在功能分支开发，通过 PR 合并
- **MUST** 为所有公共 API 提供 TypeScript 类型定义
- **MUST** 在 MDX 文件中包含完整的 frontmatter

---

## 快速开始

**首次运行**:

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，至少设置：
# - ADMIN_EMAILS (你的邮箱)
# - SESSION_SECRET (运行: openssl rand -base64 32)
# - RESEND_API_KEY (从 https://resend.com 获取)

# 3. 启动开发服务器
pnpm dev  # 或使用 just dev
# 访问 http://localhost:3000
```

**日常开发**:

```bash
just check              # 提交前必运行（lint + format + typecheck）
just dev                # 启动开发服务器
just new-chapter <name> # 创建新 MDX 章节
```

---

## 技术栈

### 前端

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 主题**: Catppuccin Macchiato
- **内容格式**: MDX
- **代码高亮**: Shiki

### 后端服务

- **邮件服务**: Resend (验证码登录)
- **存储**: Edge Config (Redis)
- **认证**: Iron Session (Cookie-based)

### 部署

- **平台**: Vercel
- **CI/CD**: 自动部署（Push to main）
- **域名**: 自定义域名支持

---

## 项目结构

```text
app/
├── (site)/          # 公开网站（学习内容）
│   └── learn/       # MDX 教学内容
├── admin/           # 管理后台（需登录）
└── api/             # API 路由

components/          # 可复用 UI 组件
features/            # 功能模块（搜索、3D 可视化等）
lib/                 # 工具函数和配置
docs/                # 项目文档
scripts/             # 构建脚本
```

**关键文件**:

- `app/globals.css` - 全局样式（Catppuccin 主题）
- `mdx-components.tsx` - MDX 自定义组件
- `scripts/generate-learn-index.ts` - 自动生成学习内容索引
- `scripts/generate-search-index.ts` - 生成全文搜索索引（Fuse.js）
- `scripts/compile-mdx.mjs` - MDX 预编译（代码高亮、语法检查）

**核心功能**:

- **MDX 教学系统**: app/(site)/learn/ 下的 MDX 文件自动生成导航
- **全文搜索**: 基于 Fuse.js 的模糊搜索，索引在构建时生成
- **3D 可视化**: 使用 React Three Fiber (features/ 目录)
- **管理后台**: 邮箱验证码登录（Resend + Iron Session）

---

## How To

### MDX 内容管理

**创建新章节**:

```bash
just new-chapter pattern-matching  # 创建 app/(site)/learn/pattern-matching/page.mdx
```

**MDX frontmatter 要求**:

```mdx
---
title: '章节标题'
description: '简短描述'
order: 1
---

# 章节内容
```

**预构建脚本** (pnpm build 时自动运行):

- `generate-learn-index.ts` - 扫描 MDX 文件，生成导航索引
- `generate-search-index.ts` - 生成全文搜索索引（Fuse.js）
- `compile-mdx.mjs` - 预编译 MDX（代码高亮、语法检查）

**手动重新生成索引**:

```bash
pnpm generate-index   # 重新生成学习内容索引
pnpm generate-search  # 重新生成搜索索引
```

### 配置管理

#### 添加新的环境变量

1. **更新配置模板**

   ```bash
   # 编辑 .env.local.example，添加新变量
   vim .env.local.example
   ```

2. **更新本地配置**

   ```bash
   # 复制模板内容到 .env.local
   # 填写真实的值
   vim .env.local
   ```

3. **更新部署指南**

   ```bash
   # 如果是生产环境必需的变量，更新文档
   vim VERCEL_DEPLOYMENT_GUIDE.md
   ```

4. **Vercel 配置**
   - 访问 Vercel Dashboard → Settings → Environment Variables
   - 添加新变量到对应环境（Production/Preview/Development）

#### 当前环境变量

**本地开发最小配置**:

- `ADMIN_EMAILS` - 管理员邮箱
- `SESSION_SECRET` - Session 加密密钥（`openssl rand -base64 32`）
- `RESEND_API_KEY` - 邮件服务 API Key

**生产环境额外配置**:

- `EDGE_CONFIG` - Edge Config 连接 URL（Vercel 自动注入）
- `VERCEL_API_TOKEN` - 用于更新 Edge Config（Vercel 自动注入）
- `NEXT_PUBLIC_SITE_URL` - 站点 URL（可选，用于 Sitemap）

### 本地工具链

#### 包管理器 - pnpm

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

#### 任务执行器 - just

安装（如果没有）:

```bash
# macOS
brew install just

# 或使用 cargo
cargo install just
```

常用命令:

```bash
# 查看所有可用命令
just

# 开发
just dev                    # 启动开发服务器
just dev-port 3001          # 指定端口启动

# 代码质量
just lint                   # ESLint 检查
just lint-fix               # 自动修复
just format                 # Prettier 格式化
just typecheck              # TypeScript 类型检查
just check                  # 运行所有检查

# 依赖管理
just install                # 安装依赖
just add <package>          # 添加依赖
just add-dev <package>      # 添加开发依赖

# Git 操作
just status                 # 查看状态
just commit "message"       # 提交
just push                   # 推送

# 部署
just deploy-preview         # Vercel 预览部署
just deploy-prod            # Vercel 生产部署

# 实用工具
just clean                  # 清理构建产物
just tree                   # 查看项目结构
just new-chapter <name>     # 创建新章节
```

#### Vercel CLI - 运维部署

**初次设置**:

```bash
vercel login          # 登录 Vercel
vercel link           # 连接项目
vercel env pull       # 拉取环境变量到本地
```

**日常部署**:

```bash
vercel                # 预览部署（测试）
vercel --prod         # 生产部署
just deploy-prod      # 或使用 just 快捷方式
```

**环境变量**:

```bash
vercel env ls         # 列出所有环境变量
vercel env add        # 添加变量（交互式）
vercel env pull       # 拉取到本地 .env.local
```

**常用命令**:

```bash
vercel logs --follow  # 查看实时日志
vercel list           # 列出所有部署
```

详细命令参考：[Vercel 部署指南](./docs/VERCEL_DEPLOYMENT_GUIDE.md)

### 开发模式特性

- **管理后台免登录**: 开发环境下自动跳过鉴权
- **热重载**: 代码修改自动刷新
- **代码检查**: Edit/Write 后自动运行 ESLint/Markdownlint

### 部署流程

详见 [Vercel 部署指南](./docs/VERCEL_DEPLOYMENT_GUIDE.md)

**快速部署**:

1. 推送代码到 GitHub
2. Vercel 自动构建部署
3. 访问预览/生产 URL

---

## 常见问题 (Gotchas)

- **MDX 编译失败**: 检查 frontmatter 格式，确保包含 title 和 description
- **搜索索引未更新**: 运行 `pnpm generate-search` 手动重新生成
- **开发环境 404**: 新增 MDX 文件可能需要重启服务器才能识别
- **管理后台登录失败**:
  - 确保 `RESEND_API_KEY` 有效
  - 检查邮箱是否在 `ADMIN_EMAILS` 环境变量中
  - 开发环境下会自动跳过鉴权
- **类型错误**: 提交前运行 `just typecheck` 检查 TypeScript 类型
- **Lint 错误**: 运行 `just lint-fix` 自动修复，或手动解决后再提交
- **构建失败**:
  - 检查是否所有 MDX 文件都有有效的 frontmatter
  - 运行 `pnpm compile-mdx` 查看详细错误信息
  - 确保没有语法错误或导入错误
