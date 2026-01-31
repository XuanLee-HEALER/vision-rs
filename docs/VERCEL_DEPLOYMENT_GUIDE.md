# Vision-RS Vercel 部署指南

## 前提条件

- [x] 代码已推送到 GitHub
- [ ] 拥有 Vercel 账户（免费或付费）
- [ ] 准备好 Resend API Key（用于邮件验证码）

---

## 第一步：导入项目到 Vercel

### 1.1 访问 Vercel Dashboard

访问 [https://vercel.com/dashboard](https://vercel.com/dashboard)

### 1.2 导入 GitHub 项目

1. 点击 **"Add New..."** → **"Project"**
2. 选择 **"Import Git Repository"**
3. 授权 Vercel 访问你的 GitHub（如果还没授权）
4. 找到并选择 `XuanLee-HEALER/vision-rs` 仓库
5. 点击 **"Import"**

---

## 第二步：配置项目设置

### 2.1 基础配置

**Framework Preset**: Next.js（自动检测）

**Root Directory**: `./`（默认）

**Build Command**: `pnpm build`（自动检测）

**Output Directory**: `.next`（自动检测）

**Install Command**: `pnpm install`（推荐）

### 2.2 Node.js 版本

确保使用 Node.js 18.x 或更高版本（Vercel 默认使用最新 LTS）

---

## 第三步：配置环境变量

### 3.1 必需的环境变量

在 Vercel 项目设置中，进入 **Settings** → **Environment Variables**，添加以下变量：

#### 1. 管理员邮箱（必需）

```text
名称: ADMIN_EMAILS
值: your-admin@example.com
环境: Production, Preview, Development
```

**说明**：

- 可以添加多个邮箱，用逗号分隔
- 例如：`admin1@example.com,admin2@example.com`
- 这些邮箱可以登录管理后台

#### 2. Session 密钥（必需）

```text
名称: SESSION_SECRET
值: <生成的随机字符串> SIgU5zmpEf5JUNwIFhCqsR2YLksjnCqrdlguSGUhN7I=
环境: Production, Preview, Development
```

**生成方法**：

```bash
# 在本地终端运行
openssl rand -base64 32
```

复制输出的字符串作为 SESSION_SECRET 的值。

#### 3. Resend API Key（必需 - 用于邮件验证码）

```text
名称: RESEND_API_KEY
值: re_xxxxxxxxxxxxx
re_xxxxxxxxxxxxxxxxxxxxx
环境: Production, Preview, Development
```

**获取方法**：

1. 访问 [https://resend.com/api-keys](https://resend.com/api-keys)
2. 注册/登录 Resend 账户
3. 创建新的 API Key
4. 复制 API Key

**重要提示**：

- Resend 免费套餐：100 封邮件/天
- 需要验证发件域名（或使用 Resend 提供的测试域名）

#### 4. 站点 URL（可选，推荐）

```text
名称: NEXT_PUBLIC_SITE_URL
值: https://vision-rs.com
环境: Production
```

**说明**：

- 用于生成 Sitemap
- 如果不设置，默认使用 Vercel 提供的 URL

### 3.2 Edge Config（必需 - 用于内容可见性存储）

#### 创建 Edge Config

1. 在 Vercel Dashboard 中，进入 **Storage** 标签
2. 点击 **"Create Database"**
3. 选择 **"Edge Config"**
4. 输入数据库名称：`vision-rs-edge-config`
5. 点击 **"Create"**

#### 连接 Edge Config 到项目

1. 进入刚创建的 Edge Config
2. 点击 **".env.local"** 标签
3. 复制以下环境变量：
   - `EDGE_CONFIG`
   - `EDGE_CONFIG`
   - `VERCEL_API_TOKEN`
   - ``

4. 回到项目设置 → **Environment Variables**
5. 添加这些变量：

```text
EDGE_CONFIG=https://edge-config.vercel.com/...
EDGE_CONFIG=https://...
VERCEL_API_TOKEN=...
=...

环境: Production, Preview, Development
```

**或者使用 Vercel CLI 自动连接**：

```bash
vercel link
vercel env pull
```

---

## 第四步：部署

### 4.1 首次部署

1. 确认所有环境变量已配置
2. 点击 **"Deploy"** 按钮
3. 等待部署完成（约 2-3 分钟）

**部署过程**：

```text
1. Prebuild: 生成内容索引
2. Build: Next.js 构建
3. Deploy: 部署到 Vercel 边缘网络
```

### 4.2 验证部署

部署成功后，Vercel 会提供一个 URL（例如：`vision-rs.vercel.app`）

**验证清单**：

- [ ] 访问首页 `/` - 应该正常显示
- [ ] 访问学习页面 `/learn` - 应该显示内容卡片
- [ ] 访问某个具体页面 `/learn/concepts/ownership` - 应该正常显示
- [ ] 访问管理后台 `/admin/login` - 应该显示登录页
- [ ] 检查 Sitemap `/sitemap.xml` - 应该包含所有可见内容

---

## 第五步：配置自定义域名（可选）

### 5.1 添加域名

1. 进入项目设置 → **Domains**
2. 点击 **"Add"**
3. 输入域名（例如：`vision-rs.com`）
4. 点击 **"Add"**

### 5.2 配置 DNS

Vercel 会提供 DNS 记录，在你的域名注册商处添加：

#### 方式 1: A 记录

```text
Type: A
Name: @
Value: 76.76.21.21
```

#### 方式 2: CNAME 记录

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3 更新环境变量

添加自定义域名后，更新 `NEXT_PUBLIC_SITE_URL`：

```text
NEXT_PUBLIC_SITE_URL=https://vision-rs.com
```

重新部署以生效。

---

## 第六步：配置 Resend 发件域名

### 6.1 验证域名（生产环境推荐）

1. 访问 [https://resend.com/domains](https://resend.com/domains)
2. 点击 **"Add Domain"**
3. 输入域名（例如：`vision-rs.com`）
4. 添加 Resend 提供的 DNS 记录：
   - SPF 记录
   - DKIM 记录
   - DMARC 记录（可选）

5. 等待验证通过（通常几分钟到几小时）

### 6.2 使用测试域名（开发/测试）

Resend 提供免费的测试域名：`onboarding.resend.dev`

**限制**：

- 只能发送到你的 Resend 账户邮箱
- 适合开发和测试

---

## 第七步：测试管理后台

### 7.1 测试登录

1. 访问 `https://your-domain.com/admin/login`
2. 输入管理员邮箱（ADMIN_EMAILS 中配置的）
3. 点击 **"发送验证码"**
4. 检查邮箱，输入 6 位验证码
5. 点击 **"登录"**

**如果邮件未收到**：

- 检查垃圾邮件文件夹
- 确认 RESEND_API_KEY 正确
- 确认邮箱在 ADMIN_EMAILS 中
- 查看 Vercel 日志中的错误信息

### 7.2 测试可见性管理

1. 登录后访问 `/admin/visibility`
2. 查看所有内容列表（46 个页面）
3. 尝试切换某个内容的可见性
4. 刷新首页 `/learn` - 隐藏内容应该不显示
5. 直接访问隐藏内容 URL - 应该显示黄色横幅

---

## 第八步：监控和日志

### 8.1 查看部署日志

1. 进入 Vercel Dashboard → **Deployments**
2. 点击最新的部署
3. 查看 **"Build Logs"** - 构建日志
4. 查看 **"Function Logs"** - 运行时日志

### 8.2 常见问题排查

#### 问题 1: 构建失败

- 检查 Build Logs 中的错误信息
- 确认 `pnpm build` 在本地能成功运行
- 检查依赖是否正确安装

#### 问题 2: 环境变量未生效

- 确认环境变量已添加到正确的环境（Production/Preview/Development）
- 重新部署以应用新的环境变量

#### 问题 3: Edge Config 连接失败

- 确认 Edge Config已创建
- 确认环境变量正确配置
- 检查 Function Logs 中的错误信息

#### 问题 4: 邮件发送失败

- 确认 RESEND_API_KEY 正确
- 确认域名已验证（或使用测试域名）
- 检查 Resend Dashboard 中的日志

---

## 环境变量总结

| 变量名                 | 必需  | 说明                        | 示例                                 |
| ---------------------- | ----- | --------------------------- | ------------------------------------ |
| `ADMIN_EMAILS`         | ✅ 是 | 管理员邮箱白名单            | `admin@example.com`                  |
| `SESSION_SECRET`       | ✅ 是 | Session 加密密钥            | `openssl rand -base64 32`            |
| `RESEND_API_KEY`       | ✅ 是 | Resend API 密钥             | `re_xxxxx`                           |
| `EDGE_CONFIG`          | ✅ 是 | Edge Config 连接 URL        | `https://edge-config.vercel.com/...` |
| `VERCEL_API_TOKEN`     | ✅ 是 | Vercel API Token (更新配置) | `vercel_xxxxx`                       |
| `NEXT_PUBLIC_SITE_URL` | ❌ 否 | 站点 URL (用于 Sitemap)     | `https://vision-rs.com`              |

---

## 部署后清单

- [ ] 首页正常访问
- [ ] 学习内容页面正常显示
- [ ] 管理后台可以登录
- [ ] 邮件验证码正常接收
- [ ] 可见性管理功能正常
- [ ] Sitemap 正常生成
- [ ] 自定义域名已配置（如果有）
- [ ] DNS 记录已添加（如果有自定义域名）
- [ ] Resend 域名已验证（如果使用自定义域名）

---

## 持续部署

Vercel 会自动监听 GitHub 仓库的 `main` 分支：

- **Push to main** → 自动部署到生产环境
- **Pull Request** → 自动创建预览部署
- **分支推送** → 可配置为创建预览部署

**推荐工作流程**：

1. 在本地分支开发新功能
2. 推送到 GitHub 创建 PR
3. Vercel 自动创建预览部署
4. 审查预览部署
5. 合并到 main 分支
6. Vercel 自动部署到生产环境

---

## 成本估算

### Vercel 免费套餐

**包含**：

- 无限制的部署
- 100 GB 带宽/月
- Serverless Functions（100 GB-小时）
- 自动 HTTPS

**限制**：

- 1 个并发构建
- 函数执行时间: 10 秒（Hobby）
- 函数大小: 50 MB

**Vision-RS 估算**：

- 构建时间: ~30 秒
- 函数执行: < 1 秒
- **适合免费套餐** ✅

### Edge Config 免费套餐

**包含**：

- 256 MB 存储
- 3,000 次命令/天
- 100 MB 带宽/月

**Vision-RS 估算**：

- 存储使用: < 1 MB（46 个可见性记录）
- 命令数: ~100-500/天（取决于访问量）
- **适合免费套餐** ✅

### Resend 免费套餐

**包含**：

- 100 封邮件/天
- 1 个验证域名

**Vision-RS 估算**：

- 邮件数: < 10/天（管理员登录）
- **适合免费套餐** ✅

**总结**：Vision-RS 可以完全在免费套餐下运行！

---

## 升级建议

当需要升级时（高流量或高级功能）：

### Vercel Pro ($20/月)

- 函数执行时间: 60 秒
- 函数大小: 250 MB
- 团队协作功能
- 更多带宽和构建时间

### Edge Config Pro

- 更大存储（1 GB+）
- 更多命令配额
- 更高性能

### Resend Pro ($20/月)

- 50,000 封邮件/月
- 更好的送达率
- 高级分析

---

## 安全建议

1. **保护环境变量**
   - 不要在代码中硬编码敏感信息
   - 定期轮换 SESSION_SECRET
   - 使用 Vercel 的环境变量加密

2. **限制管理员访问**
   - 只添加必要的管理员邮箱
   - 定期审查管理员列表
   - 使用强密码的邮箱

3. **监控使用情况**
   - 定期检查 Vercel Analytics
   - 监控 KV 使用量
   - 关注异常访问

4. **备份数据**
   - 定期导出 KV 数据
   - 保存重要配置
   - 使用 Git 版本控制

---

## 支持和帮助

**Vercel 文档**：

- [Next.js 部署](https://vercel.com/docs/frameworks/nextjs)
- [环境变量](https://vercel.com/docs/concepts/projects/environment-variables)
- [Edge Config](https://vercel.com/docs/storage/vercel-kv)

**Resend 文档**：

- [快速开始](https://resend.com/docs/introduction)
- [域名验证](https://resend.com/docs/dashboard/domains/introduction)

**Vision-RS 文档**：

- [README.md](./README.md)
- [CLAUDE.md](./CLAUDE.md)

---

## 快速开始命令

```bash
# 1. 确保代码最新
git pull origin main

# 2. 本地测试构建
pnpm build

# 3. 推送到 GitHub（触发 Vercel 部署）
git push origin main

# 4. 访问 Vercel Dashboard 查看部署状态
# https://vercel.com/dashboard
```

---

**祝你部署顺利！** 🚀

如有问题，请查看 Vercel 部署日志或联系项目维护者。
