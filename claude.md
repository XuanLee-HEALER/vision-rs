# Vision-RS - 项目说明

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

## How To

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

- `KV_*` - Edge Config 相关变量（自动注入）
- `GITHUB_*` - GitHub API 配置（用于管理后台编辑 MDX）
- `NEXT_PUBLIC_SITE_URL` - 站点 URL（可选）

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

安装（如果没有）:

```bash
# 使用 pnpm
pnpm add -g vercel

# 或使用 npm
npm i -g vercel
```

**初次设置**:

```bash
# 登录（已完成）
vercel login

# 连接项目到 Vercel
vercel link

# 拉取环境变量到本地
vercel env pull
```

**部署管理**:

```bash
# 创建预览部署（测试）
vercel

# 部署到生产环境
vercel --prod

# 列出所有部署
vercel list

# 查看部署详情
vercel inspect <deployment-url>

# 删除部署
vercel remove <deployment-id>

# 查看实时日志
vercel logs <deployment-url>

# 查看实时日志（跟踪模式）
vercel logs <deployment-url> -f
```

**环境变量管理**:

```bash
# 列出所有环境变量
vercel env ls

# 添加环境变量
vercel env add <name>
# 交互式选择环境（production/preview/development）

# 删除环境变量
vercel env rm <name>

# 拉取环境变量到本地 .env.local
vercel env pull

# 拉取特定环境的变量
vercel env pull .env.production.local --environment=production
```

**项目和域名**:

```bash
# 查看当前账户
vercel whoami

# 列出所有项目
vercel projects ls

# 列出域名
vercel domains ls

# 添加自定义域名
vercel domains add <domain>

# 删除域名
vercel domains rm <domain>
```

**本地开发**:

```bash
# 启动 Vercel 开发服务器（模拟生产环境）
vercel dev

# 指定端口
vercel dev --listen 3001
```

**常用运维场景**:

```bash
# 1. 快速预览部署（测试新功能）
vercel

# 2. 生产部署
vercel --prod

# 3. 查看最新部署日志
vercel logs --follow

# 4. 回滚到之前的部署
vercel list                    # 找到要回滚的部署
vercel promote <deployment-url> # 提升为生产环境

# 5. 同步环境变量
vercel env pull                # 拉取到本地
vercel env add MY_VAR          # 添加新变量

# 6. 清理旧部署
vercel list                    # 查看所有部署
vercel remove <deployment-id>  # 删除不需要的
```

### 开发模式特性

- **管理后台免登录**: 开发环境下自动跳过鉴权
- **热重载**: 代码修改自动刷新
- **代码检查**: Edit/Write 后自动运行 ESLint/Markdownlint

### 部署流程

详见 [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

**快速部署**:

1. 推送代码到 GitHub
2. Vercel 自动构建部署
3. 访问预览/生产 URL
