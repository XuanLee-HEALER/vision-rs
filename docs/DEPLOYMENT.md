# Vision-RS Vercel 部署指南

本指南详细介绍如何将 Vision-RS 部署到 Vercel，包括域名购买和配置。

## 目录

1. [前置准备](#前置准备)
2. [Vercel 账号注册](#vercel-账号注册)
3. [项目部署](#项目部署)
4. [域名购买](#域名购买)
5. [域名配置](#域名配置)
6. [环境变量配置](#环境变量配置)
7. [持续部署](#持续部署)
8. [常见问题](#常见问题)

---

## 前置准备

### 必需条件

- Git 仓库（GitHub/GitLab/Bitbucket）
- Node.js 18+ 环境
- pnpm 包管理器

### 本地验证

在部署前，确保项目可以正常构建：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 本地预览
pnpm start
```

---

## Vercel 账号注册

### 步骤 1：访问 Vercel

1. 打开 [vercel.com](https://vercel.com)
2. 点击 "Sign Up"

### 步骤 2：选择登录方式

推荐使用 GitHub 账号登录，这样可以直接连接你的仓库：

- **GitHub**（推荐）
- GitLab
- Bitbucket
- Email

### 步骤 3：完成注册

1. 授权 Vercel 访问你的 Git 账号
2. 选择 Hobby（免费）或 Pro 计划

**免费计划限制：**
- 带宽：100GB/月
- 构建时间：6000 分钟/月
- 无服务器函数执行：100GB-小时/月
- 自定义域名：无限制

---

## 项目部署

### 方式一：通过 Vercel Dashboard（推荐新手）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择 `vision-rs` 仓库
5. 配置项目：
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`（自动）
   - **Install Command**: `pnpm install`
6. 点击 "Deploy"

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录
vercel login

# 首次部署（会创建项目）
vercel

# 生产部署
vercel --prod
```

### 方式三：通过 Git Push（推荐日常使用）

配置完成后，每次 push 到 main 分支会自动触发部署：

```bash
git push origin main
```

---

## 域名购买

### 推荐域名注册商

| 注册商 | 优点 | 价格参考 |
|--------|------|----------|
| **Cloudflare** | 成本价、免费 DNS、免费 CDN | .com ≈ $9.15/年 |
| **Namecheap** | 首年优惠、WhoisGuard 免费 | .com ≈ $8.88/年起 |
| **Google Domains** | 界面简洁、免费隐私保护 | .com ≈ $12/年 |
| **阿里云/腾讯云** | 中文支持、国内备案方便 | .com ≈ ¥55/年 |
| **Vercel Domains** | 与 Vercel 深度集成 | .com ≈ $10/年 |

### 购买步骤（以 Cloudflare 为例）

1. 访问 [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
2. 注册/登录 Cloudflare 账号
3. 搜索想要的域名（如 `vision-rs.com`）
4. 加入购物车并结账
5. 完成支付

### 域名选择建议

- **优先选择**：`.com`、`.dev`、`.io`
- **技术项目**：`.dev`、`.tech`、`.codes`
- **中国用户**：如需备案，选择 `.cn` 或通过国内注册商购买 `.com`

---

## 域名配置

### 步骤 1：在 Vercel 添加域名

1. 进入项目 Dashboard
2. 点击 "Settings" → "Domains"
3. 输入你的域名（如 `vision-rs.com`）
4. 点击 "Add"

### 步骤 2：配置 DNS 记录

Vercel 会显示需要配置的 DNS 记录。根据你的注册商进行配置：

#### 方式 A：使用 Vercel DNS（推荐）

将域名的 NS 记录指向 Vercel：
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

#### 方式 B：保留原有 DNS，添加记录

**对于根域名 (vision-rs.com)：**
```
Type: A
Name: @
Value: 76.76.21.21
```

**对于 www 子域名：**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 步骤 3：等待 DNS 生效

- DNS 传播通常需要 5 分钟到 48 小时
- 可以使用 [dnschecker.org](https://dnschecker.org) 检查传播状态

### 步骤 4：配置 SSL

Vercel 会自动为你的域名配置免费的 SSL 证书（Let's Encrypt）。

---

## 环境变量配置

如果项目需要环境变量：

### 在 Vercel Dashboard 配置

1. 进入项目 Settings → Environment Variables
2. 添加变量：
   - **Key**: 变量名
   - **Value**: 变量值
   - **Environment**: Production / Preview / Development

### 常用环境变量示例

```bash
# 分析服务
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXXXXX

# API 密钥（不要以 NEXT_PUBLIC_ 开头）
API_SECRET_KEY=your-secret-key
```

**注意：**
- `NEXT_PUBLIC_` 前缀的变量会暴露给浏览器
- 敏感信息不要使用 `NEXT_PUBLIC_` 前缀

---

## 持续部署

### 自动部署配置

Vercel 默认配置：

| 分支 | 行为 |
|------|------|
| `main` / `master` | 自动部署到生产环境 |
| 其他分支 | 自动部署预览环境 |
| Pull Request | 自动创建预览部署 |

### 自定义部署配置

创建 `vercel.json`（可选）：

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["hkg1", "sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 跳过部署

在 commit message 中添加 `[skip ci]` 可跳过自动部署：

```bash
git commit -m "Update README [skip ci]"
```

---

## 常见问题

### Q1: 构建失败怎么办？

1. 检查 Vercel 的构建日志
2. 确保本地 `pnpm build` 可以成功
3. 检查环境变量是否正确配置
4. 确认 Node.js 版本兼容（在 package.json 中指定）

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Q2: 域名配置后无法访问？

1. 检查 DNS 记录是否正确
2. 等待 DNS 传播（最长 48 小时）
3. 在 Vercel Dashboard 检查域名状态
4. 尝试清除浏览器 DNS 缓存

### Q3: 如何回滚到之前的版本？

1. 进入项目 Deployments 页面
2. 找到要回滚的版本
3. 点击 "..." → "Promote to Production"

### Q4: 如何配置重定向？

在 `next.config.mjs` 中配置：

```javascript
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
};
```

### Q5: 中国大陆访问速度慢？

1. 使用 Cloudflare CDN（免费）
2. 考虑使用国内云服务商（需备案）
3. 启用 Vercel 的边缘缓存

---

## 部署检查清单

在部署前确认：

- [ ] `pnpm build` 本地构建成功
- [ ] `pnpm lint` 无错误
- [ ] 环境变量已配置
- [ ] 域名 DNS 已配置
- [ ] SSL 证书已生效
- [ ] 移动端测试通过
- [ ] 页面加载速度可接受

---

## 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
- [DNS 检查工具](https://dnschecker.org)

---

## 费用估算

| 项目 | 免费额度 | 超出费用 |
|------|----------|----------|
| Vercel Hobby | 100GB 带宽/月 | 升级 Pro $20/月 |
| 域名 (.com) | - | ≈ $10-15/年 |
| SSL 证书 | 免费（自动） | - |

**总成本估算：** 小型项目约 $10-15/年（仅域名费用）
