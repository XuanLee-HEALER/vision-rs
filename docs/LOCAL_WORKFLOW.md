# 本地开发工作流

## 初始设置

### MUST 执行的步骤

1. **MUST** 克隆仓库后立即运行：

   ```bash
   pnpm install
   ```

2. **MUST** 配置环境变量：

   ```bash
   cp .env.local.example .env.local
   # 编辑 .env.local 填写真实值
   ```

3. **MUST** 验证本地环境：
   ```bash
   pnpm build  # 确保构建成功
   ```

### MUST NOT 违反的规则

- **MUST NOT** 提交 `.env.local` 文件
- **MUST NOT** 在未配置环境变量时启动开发服务器
- **MUST NOT** 跳过依赖安装直接运行

---

## 日常开发流程

### 启动开发服务器

```bash
# 方式 1: 使用 pnpm
pnpm dev

# 方式 2: 使用 just（推荐）
just dev

# 指定端口
just dev-port 3001
```

### MUST 遵守的开发规则

- **MUST** 在修改代码前拉取最新代码：`git pull origin main`
- **MUST** 在功能分支开发，不直接提交到 `main`
- **MUST** 保持开发服务器运行以查看实时变更
- **MUST** 在浏览器中测试所有变更

### MUST NOT 违反的规则

- **MUST NOT** 直接在 `main` 分支开发
- **MUST NOT** 在未测试情况下提交代码
- **MUST NOT** 修改他人正在开发的文件（沟通协调）

---

## 代码编辑工作流

### 编辑代码时 MUST 执行

1. **编辑文件**
   - Claude Code 会自动运行 Prettier 格式化
   - 自动运行 ESLint/Markdownlint 检查

2. **查看检查结果**
   - 修复所有 ESLint 错误
   - 修复所有 Markdownlint 警告

3. **手动验证**（如需要）
   ```bash
   just lint        # ESLint 检查
   just format      # 格式化
   just typecheck   # 类型检查
   ```

### 文件类型对应的检查

- **TypeScript/JavaScript**: Prettier + ESLint + TypeCheck
- **Markdown/MDX**: Prettier + Markdownlint
- **JSON/YAML**: Prettier

---

## 提交代码流程

### MUST 遵守的 Git 工作流

```bash
# 1. 创建功能分支
git checkout -b feature/your-feature-name

# 2. 开发并提交（多次小提交）
git add <changed-files>  # 不要用 git add -A 除非确定
git commit -m "feat: 添加 XXX 功能"

# 3. 推送到远程
git push origin feature/your-feature-name

# 4. 在 GitHub 创建 Pull Request
# 5. 等待 Review 和合并
```

### Commit Message 规范 (MUST)

- **MUST** 使用约定式提交格式：

  ```
  <type>: <description>

  [optional body]
  ```

- **Type 类型**：
  - `feat`: 新功能
  - `fix`: Bug 修复
  - `docs`: 文档更新
  - `style`: 代码格式（不影响逻辑）
  - `refactor`: 重构
  - `test`: 测试
  - `chore`: 构建/工具变更

- **示例**：
  ```bash
  git commit -m "feat: 添加 Edge Config 支持"
  git commit -m "fix: 修复管理后台登录问题"
  git commit -m "docs: 更新部署指南"
  ```

### MUST NOT 的提交规则

- **MUST NOT** 提交包含 ESLint 错误的代码
- **MUST NOT** 提交未格式化的代码
- **MUST NOT** 提交敏感信息（API Keys、密码）
- **MUST NOT** 使用无意义的提交信息（如 "update", "fix"）
- **MUST NOT** 一次提交过多不相关的变更

---

## 使用 Just 命令（推荐）

### 常用命令（MUST 熟悉）

```bash
# 查看所有可用命令
just

# 开发
just dev                    # 启动开发服务器
just dev-port 3001          # 指定端口

# 代码质量
just lint                   # ESLint 检查
just lint-fix               # 自动修复
just format                 # Prettier 格式化
just typecheck              # TypeScript 检查
just check                  # 运行所有检查（推荐！）

# 构建
just build                  # 生产构建
just clean                  # 清理构建产物

# Git 操作
just status                 # 查看状态
just commit "message"       # 提交（不推荐，建议手动）
just push                   # 推送

# 依赖管理
just install                # 安装依赖
just add <package>          # 添加依赖
just add-dev <package>      # 添加开发依赖
```

### 提交前 MUST 运行

```bash
just check  # 运行 lint + format-check + typecheck
```

如果通过，才能提交代码。

---

## 创建新内容

### 添加新的学习内容 (MUST)

1. **创建 MDX 文件**

   ```bash
   # 示例：创建新的概念章节
   just new-chapter "rust-traits"
   # 或手动创建
   mkdir -p app/learn/concepts/rust-traits
   touch app/learn/concepts/rust-traits/page.mdx
   ```

2. **MUST 包含 Frontmatter**

   ```yaml
   ---
   title: Rust Traits 详解
   description: 深入理解 Rust 的 Trait 系统
   category: concepts
   order: 10
   ---
   ```

3. **编写内容** - 遵守 MDX 规范

4. **生成索引**（自动）
   ```bash
   # 构建时自动运行
   pnpm build
   # 或手动生成
   just generate-index
   ```

---

## 测试工作流

### 本地测试 (MUST)

```bash
# 1. 启动开发服务器
just dev

# 2. 在浏览器中测试
# http://localhost:3000

# 3. 测试管理后台（开发模式免登录）
# http://localhost:3000/admin/visibility

# 4. 测试新添加的内容
# http://localhost:3000/learn/...
```

### 生产构建测试 (SHOULD)

```bash
# 构建生产版本
just build

# 启动生产服务器
just start

# 测试: http://localhost:3000
```

---

## Vercel 部署工作流

### 预览部署（自动）

- **触发条件**: Push 到任何分支或创建 Pull Request
- **自动执行**: Vercel 自动创建预览部署
- **查看预览**: PR 中会显示预览 URL

### 生产部署（自动）

- **触发条件**: 合并到 `main` 分支
- **自动执行**: Vercel 自动部署到生产环境
- **查看状态**: `vercel list`

### 手动部署（可选）

```bash
# CLI 部署（需要先 vercel link）
vercel          # 预览部署
vercel --prod   # 生产部署
```

---

## 环境变量管理

### 本地环境 (MUST)

```bash
# 拉取 Vercel 环境变量到本地
vercel env pull

# 检查环境变量
cat .env.local
```

### 添加新环境变量 (MUST)

1. **更新模板**

   ```bash
   vim .env.local.example
   # 添加新变量（使用占位符）
   ```

2. **更新本地配置**

   ```bash
   vim .env.local
   # 填入真实值
   ```

3. **更新 Vercel**

   ```bash
   vercel env add NEW_VAR_NAME
   # 选择环境: Production, Preview, Development
   ```

4. **更新文档**
   - 在 `docs/VERCEL_DEPLOYMENT_GUIDE.md` 中说明

### MUST NOT 违反

- **MUST NOT** 提交包含真实值的 `.env.local`
- **MUST NOT** 在代码中硬编码敏感信息
- **MUST NOT** 在文档中使用真实的 API Keys（用占位符）

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

## 工作流检查清单

### 每日开发 (MUST)

- [ ] 拉取最新代码：`git pull origin main`
- [ ] 启动开发服务器：`just dev`
- [ ] 编写代码并实时测试
- [ ] 提交前运行：`just check`
- [ ] 创建有意义的 commit message
- [ ] 推送到功能分支
- [ ] 创建 Pull Request

### 每次提交前 (MUST)

- [ ] `just check` 全部通过
- [ ] 删除调试代码和 `console.log`
- [ ] 检查无敏感信息
- [ ] Commit message 符合规范
- [ ] 只提交相关文件（不要 `git add -A`）

### 合并到 main 前 (MUST)

- [ ] PR 已通过 Review
- [ ] 所有检查通过
- [ ] 预览部署测试通过
- [ ] 无冲突
- [ ] 更新相关文档（如有）

---

**严格遵守此工作流，确保代码质量和团队协作效率。**
