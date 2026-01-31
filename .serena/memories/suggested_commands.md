# 开发命令参考

## 包管理器 - pnpm (而非 npm)

**基础命令**:
```bash
# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
pnpm lint --fix  # 自动修复

# 格式化
pnpm format
pnpm format-check

# 类型检查
pnpm typecheck

# Markdown 检查
pnpm markdownlint "**/*.md" "**/*.mdx" --ignore node_modules --ignore .next
```

---

## 任务执行器 - just (推荐)

**安装 just** (如果没有):
```bash
# macOS
brew install just

# 或使用 cargo
cargo install just
```

**查看所有命令**:
```bash
just  # 列出所有可用命令
```

### 开发命令

```bash
# 启动开发服务器
just dev

# 指定端口启动
just dev-port 3001
```

### 代码质量检查

```bash
# ESLint 检查
just lint

# ESLint 自动修复
just lint-fix

# Prettier 格式化
just format

# TypeScript 类型检查
just typecheck

# 🔥 运行所有检查 (提交前必须运行)
just check
```

### 构建和清理

```bash
# 生产构建
just build

# 清理构建产物
just clean

# 启动生产服务器
just start
```

### 依赖管理

```bash
# 安装依赖
just install

# 添加依赖
just add <package-name>

# 添加开发依赖
just add-dev <package-name>
```

### Git 操作

```bash
# 查看状态
just status

# 提交 (不推荐，建议手动提交)
just commit "commit message"

# 推送
just push
```

### 部署

```bash
# Vercel 预览部署
just deploy-preview

# Vercel 生产部署
just deploy-prod
```

### 实用工具

```bash
# 查看项目结构
just tree

# 创建新章节 (自动创建 MDX 文件)
just new-chapter <chapter-name>
```

---

## Vercel CLI - 运维部署

**安装 Vercel CLI** (如果没有):
```bash
# 使用 pnpm
pnpm add -g vercel

# 或使用 npm
npm i -g vercel
```

### 初次设置

```bash
# 登录 Vercel
vercel login

# 连接项目到 Vercel
vercel link

# 拉取环境变量到本地
vercel env pull
```

### 部署管理

```bash
# 创建预览部署 (测试)
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

# 查看实时日志 (跟踪模式)
vercel logs <deployment-url> -f
```

### 环境变量管理

```bash
# 列出所有环境变量
vercel env ls

# 添加环境变量 (交互式)
vercel env add <variable-name>

# 删除环境变量
vercel env rm <variable-name>

# 拉取环境变量到本地 .env.local
vercel env pull

# 拉取特定环境的变量
vercel env pull .env.production.local --environment=production
```

### 项目和域名

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

### 本地开发

```bash
# 启动 Vercel 开发服务器 (模拟生产环境)
vercel dev

# 指定端口
vercel dev --listen 3001
```

### 常用运维场景

```bash
# 1. 快速预览部署 (测试新功能)
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

---

## Git 工作流

### 分支管理

```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 切换回 main 分支
git checkout main

# 拉取最新代码
git pull origin main
```

### 提交代码

```bash
# 查看状态
git status

# 添加文件 (不要用 git add -A 除非确定)
git add <changed-files>

# 提交 (使用约定式提交格式)
git commit -m "feat: 添加 XXX 功能"

# 推送到远程
git push origin feature/your-feature-name
```

### Commit Message 规范 (MUST)

**格式**:
```
<type>: <description>

[optional body]
```

**Type 类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式 (不影响逻辑)
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具变更

**示例**:
```bash
git commit -m "feat: 添加 Edge Config 支持"
git commit -m "fix: 修复管理后台登录问题"
git commit -m "docs: 更新部署指南"
```

---

## 提交前必须执行的检查

```bash
# 🔥 一键运行所有检查
just check

# 或手动运行
just lint
just format
just typecheck
pnpm markdownlint "**/*.md" "**/*.mdx" --ignore node_modules --ignore .next
```

**所有检查通过后，才能提交代码。**

---

## 系统命令 (macOS/Darwin)

```bash
# 文件操作
ls -la                    # 列出文件
cd <dir>                  # 切换目录
pwd                       # 当前路径

# 搜索
grep -r "pattern" .       # 搜索文件内容
find . -name "*.ts"       # 查找文件

# 进程和端口
lsof -i :3000             # 查看端口占用
kill -9 <PID>             # 杀死进程

# 生成密钥
openssl rand -base64 32   # 生成 SESSION_SECRET
```

---

## 环境变量配置

### 本地开发

```bash
# 复制模板
cp .env.local.example .env.local

# 编辑配置
vim .env.local

# 填写必需的变量:
# - ADMIN_EMAILS
# - SESSION_SECRET
# - RESEND_API_KEY
```

### 从 Vercel 拉取

```bash
# 拉取环境变量到本地
vercel env pull

# 检查环境变量
cat .env.local
```

---

## 故障排查

### 开发服务器无法启动

```bash
# 1. 清理并重新安装
just clean
rm -rf node_modules
pnpm install

# 2. 检查环境变量
cat .env.local

# 3. 检查端口占用
lsof -i :3000
```

### 构建失败

```bash
# 1. 运行所有检查
just check

# 2. 修复所有错误

# 3. 清理后重新构建
just clean
just build
```

### Git 冲突

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 解决冲突

# 3. 继续
git add <resolved-files>
git commit
```

---

## 开发工作流示例

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建功能分支
git checkout -b feature/new-content

# 3. 启动开发服务器
just dev

# 4. 编写代码...

# 5. 提交前检查
just check

# 6. 提交代码
git add .
git commit -m "feat: 添加新的学习内容"

# 7. 推送到远程
git push origin feature/new-content

# 8. 在 GitHub 创建 Pull Request
```
