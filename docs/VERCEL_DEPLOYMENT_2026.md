# Vercel 部署指南（2026 版）

本指南将帮助你将 Vision-RS 项目部署到 Vercel。

## 📋 部署前准备

### 1. 前置要求

- ✅ GitHub 账号
- ✅ Vercel 账号（使用 GitHub 登录）
- ✅ 项目代码已推送到 GitHub
- ✅ 确保 `package.json` 包含正确的构建脚本

### 2. 检查项目配置

确认以下文件存在且配置正确：

#### `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### `next.config.mjs`

```javascript
import createMDX from '@next/mdx'
// ... 你的配置
```

### 3. 环境变量检查

如果你的项目使用了环境变量，创建 `.env.example` 文件：

```bash
# .env.example
# API_KEY=your_api_key_here
```

⚠️ **重要**：不要将 `.env` 文件提交到 Git！确保它在 `.gitignore` 中。

---

## 🚀 部署步骤

### 方式一：通过 Vercel 网页控制台（推荐）

#### 步骤 1：登录 Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"
4. 授权 Vercel 访问你的 GitHub 账号

#### 步骤 2：导入项目

1. 点击右上角 "Add New" → "Project"
2. 在 "Import Git Repository" 页面选择你的仓库
   - 如果仓库未列出，点击 "Adjust GitHub App Permissions" 授权更多仓库
3. 选择 `XuanLee-HEALER/vision-rs` 仓库
4. 点击 "Import"

#### 步骤 3：配置项目

Vercel 会自动检测 Next.js 项目并填充配置。检查以下设置：

**Framework Preset**: Next.js（自动检测）

**Root Directory**: `./`（默认）

**Build and Output Settings**:
- Build Command: `npm run build` 或 `pnpm build`
- Output Directory: `.next`（自动）
- Install Command: `npm install` 或 `pnpm install`

**Node.js Version**: 18.x 或 20.x（推荐）

**Environment Variables**（如需要）:
- 点击 "Add" 添加环境变量
- 示例：
  ```
  Name: API_KEY
  Value: your-secret-key
  ```

#### 步骤 4：部署

1. 检查所有配置无误
2. 点击 "Deploy" 按钮
3. 等待构建完成（通常 2-5 分钟）
4. 部署成功后，Vercel 会提供一个 URL（格式：`https://your-project.vercel.app`）

---

### 方式二：通过 Vercel CLI

#### 步骤 1：安装 Vercel CLI

```bash
npm install -g vercel
# 或
pnpm add -g vercel
```

#### 步骤 2：登录

```bash
vercel login
```

按提示选择登录方式（GitHub、GitLab、Bitbucket 或 Email）。

#### 步骤 3：部署

在项目根目录执行：

```bash
# 首次部署
vercel

# 按提示操作：
# ? Set up and deploy "~/vision-rs"? [Y/n] y
# ? Which scope do you want to deploy to? Your Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? vision-rs
# ? In which directory is your code located? ./
```

#### 步骤 4：生产环境部署

```bash
vercel --prod
```

---

## ⚙️ 高级配置

### 1. 自定义域名

#### 添加域名：

1. 进入项目 Dashboard → Settings → Domains
2. 输入你的域名（例如：`vision-rs.com`）
3. 点击 "Add"
4. 按照提示配置 DNS：

**如果使用 Vercel DNS（推荐）**：
- 在域名注册商处将 Nameservers 修改为 Vercel 提供的 DNS
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```

**如果使用自己的 DNS**：
- 添加 A 记录：
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  ```
- 添加 CNAME 记录（www）：
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```

#### SSL 证书：

Vercel 自动提供免费的 SSL 证书（Let's Encrypt），无需额外配置。

### 2. 环境变量管理

#### 在 Web 控制台添加：

1. 进入项目 → Settings → Environment Variables
2. 点击 "Add"
3. 填写：
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://api.example.com`
   - Environment: Production / Preview / Development

#### 通过 CLI 添加：

```bash
vercel env add NEXT_PUBLIC_API_URL production
# 输入值后按回车
```

### 3. 构建配置（`vercel.json`）

创建 `vercel.json` 文件（可选）：

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sfo1", "hnd1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://external-api.com/api/:path*"
    }
  ]
}
```

### 4. 分支预览部署

Vercel 自动为每个分支和 PR 创建预览部署：

- **Production**: `main` 分支 → `your-project.vercel.app`
- **Preview**: 其他分支 → `your-project-git-branch-name.vercel.app`
- **PR Preview**: PR → `your-project-pr-123.vercel.app`

### 5. 性能优化

#### 启用边缘缓存：

在 `next.config.mjs` 中配置：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 其他配置
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

#### 图片优化：

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 6. 分析与监控

#### 启用 Vercel Analytics：

1. 进入项目 → Analytics
2. 点击 "Enable"
3. 在代码中添加（Next.js 14 自动集成）：

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### 启用 Speed Insights：

```bash
npm install @vercel/speed-insights
```

```javascript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 🔄 持续部署工作流

### Git 工作流与 Vercel 集成

```
main 分支 (生产)
  │
  ├── 推送 → 自动部署到 production
  │
feature/new-content (开发)
  │
  ├── 推送 → 自动创建预览部署
  │
  └── PR 到 main → 创建 PR 预览部署
        │
        └── 合并 → 自动部署到 production
```

### 推荐工作流：

1. **开发新功能**：
   ```bash
   git checkout -b feature/new-tutorial
   # 开发...
   git add .
   git commit -m "Add new tutorial"
   git push origin feature/new-tutorial
   ```
   → Vercel 自动创建预览部署

2. **检查预览**：
   - 访问 Vercel 提供的预览 URL
   - 测试功能是否正常

3. **合并到 main**：
   ```bash
   git checkout main
   git merge feature/new-tutorial
   git push origin main
   ```
   → 自动部署到生产环境

---

## 🐛 常见问题

### 1. 构建失败：Module not found

**原因**：依赖未安装或路径错误

**解决**：
```bash
# 检查 package.json 中的依赖
npm install
# 或删除 node_modules 和 lock 文件重新安装
rm -rf node_modules package-lock.json
npm install
```

### 2. 环境变量未生效

**原因**：环境变量未正确设置或未以 `NEXT_PUBLIC_` 开头

**解决**：
- 客户端变量必须以 `NEXT_PUBLIC_` 开头
- 在 Vercel 控制台检查环境变量设置
- 重新部署以应用更改

### 3. 页面 404 错误

**原因**：动态路由配置问题或文件路径错误

**解决**：
- 检查文件路径是否正确
- 确认 App Router 结构正确
- 检查 `next.config.mjs` 中的 `pageExtensions` 配置

### 4. 图片加载失败

**原因**：图片域名未在 `next.config.mjs` 中配置

**解决**：
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['example.com'],  // 添加外部图片域名
  },
}
```

### 5. 构建超时

**原因**：构建时间超过 Vercel 限制（免费版：45 分钟）

**解决**：
- 优化构建脚本
- 减少依赖
- 升级到 Pro 计划（更长构建时间）

---

## 📊 Vercel 计划对比

| 功能 | Hobby（免费）| Pro | Enterprise |
|------|-------------|-----|-----------|
| 带宽 | 100 GB/月 | 1 TB/月 | 自定义 |
| 构建时间 | 6000 分钟/月 | 24000 分钟/月 | 无限 |
| 团队成员 | 1 | 无限 | 无限 |
| 自定义域名 | 支持 | 支持 | 支持 |
| Analytics | 基础 | 高级 | 企业级 |
| 支持 | 社区 | Email | 专属 |

**推荐**：个人项目使用 Hobby 计划足够。

---

## ✅ 部署检查清单

部署前确认：

- [ ] `package.json` 包含正确的 `build` 脚本
- [ ] `.gitignore` 包含 `.env`, `node_modules`, `.next`
- [ ] 环境变量已在 Vercel 中配置
- [ ] 测试本地构建：`npm run build && npm run start`
- [ ] 代码已推送到 GitHub
- [ ] 域名 DNS 已正确配置（如使用自定义域名）

部署后检查：

- [ ] 主页能正常访问
- [ ] 所有路由正常工作
- [ ] 图片和静态资源加载正常
- [ ] 环境变量生效
- [ ] SSL 证书已自动配置

---

## 🔗 有用的链接

- **Vercel 官方文档**: https://vercel.com/docs
- **Next.js 部署文档**: https://nextjs.org/docs/deployment
- **Vercel CLI 文档**: https://vercel.com/docs/cli
- **Vercel 社区**: https://github.com/vercel/vercel/discussions
- **Vercel 状态页**: https://www.vercel-status.com

---

## 📞 获取帮助

如果遇到问题：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 搜索 [Vercel GitHub Discussions](https://github.com/vercel/vercel/discussions)
3. 访问 [Next.js Discord](https://discord.gg/nextjs)
4. 查看项目的部署日志（Vercel Dashboard → Deployments → 点击部署 → Logs）

---

## 🎉 部署完成！

部署成功后，你的 Vision-RS 项目将在以下 URL 可访问：

- **Production**: `https://your-project.vercel.app`
- **Custom Domain**: `https://your-domain.com`（如已配置）

每次推送到 `main` 分支都会自动触发新的部署。

祝你部署顺利！🚀
