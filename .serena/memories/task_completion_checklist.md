# 任务完成检查清单

## ⚠️ 提交前必须执行 (MUST)

### 1. 运行所有代码检查

```bash
# 🔥 一键检查 (推荐)
just check

# 或手动运行每个检查
just lint          # ESLint 检查
just format        # Prettier 格式化
just typecheck     # TypeScript 类型检查

# Markdown 检查
pnpm markdownlint "**/*.md" "**/*.mdx" --ignore node_modules --ignore .next
```

**要求**: 所有检查必须通过，无任何错误或警告。

---

### 2. 构建测试

```bash
# 清理旧构建
just clean

# 生产构建
just build
```

**要求**: 构建必须成功完成，无任何错误。

---

### 3. 本地功能测试

```bash
# 启动开发服务器
just dev
```

**在浏览器中测试** (http://localhost:3000):
- [ ] 首页正常显示
- [ ] 侧边导航栏正常工作
- [ ] 学习内容页面正常渲染
- [ ] 代码高亮正常显示
- [ ] 响应式设计正常 (桌面/平板/移动)
- [ ] 无控制台错误

---

## 代码质量审查要点

### TypeScript 代码

- [ ] 所有公共 API 有类型定义
- [ ] 无 `any` 类型 (除非有充分理由)
- [ ] 无 `@ts-ignore` (除非有注释说明)
- [ ] 无 `console.log` (除非在错误处理中)
- [ ] 函数保持简短 (< 50 行)
- [ ] 使用有意义的变量名

### React 组件

- [ ] 使用函数式组件
- [ ] Props 接口定义清晰
- [ ] 组件结构清晰
- [ ] 遵循 PascalCase 命名
- [ ] 无内联样式 (使用 Tailwind)

### Tailwind CSS

- [ ] 使用 Tailwind 工具类
- [ ] 遵循 Catppuccin Macchiato 配色
- [ ] 响应式设计正确
- [ ] 无内联 `style` 属性

### MDX 内容

- [ ] 包含完整的 frontmatter
- [ ] 所有代码块指定语言
- [ ] 标题层级连续 (不跳级)
- [ ] 无敏感信息 (API Keys、密码)
- [ ] 图片使用相对路径

### Markdown 文档

- [ ] 所有代码块使用围栏式 (\`\`\`)
- [ ] 所有代码块指定语言 (MD040)
- [ ] 使用标题而非加粗文本 (MD036)
- [ ] 文件以空行结尾
- [ ] 无 HTML 标签 (除非必需)

---

## Git 提交要求

### Commit Message 规范 (MUST)

**格式**:
```
<type>: <description>

[optional body]
```

**示例**:
```bash
git commit -m "feat: 添加 XXX 功能"
git commit -m "fix: 修复 XXX 问题"
git commit -m "docs: 更新 XXX 文档"
```

### 提交检查清单

- [ ] Commit message 符合约定式提交格式
- [ ] Commit message 清晰描述变更内容
- [ ] 只提交相关文件 (不要 `git add -A` 除非确定)
- [ ] 无敏感信息 (API Keys、密码、真实邮箱)
- [ ] 无 `.env.local` 文件

---

## 功能开发工作流

### 每日开发 (MUST)

1. [ ] 拉取最新代码：`git pull origin main`
2. [ ] 创建功能分支：`git checkout -b feature/xxx`
3. [ ] 启动开发服务器：`just dev`
4. [ ] 编写代码并实时测试
5. [ ] 提交前运行：`just check`
6. [ ] 创建有意义的 commit message
7. [ ] 推送到功能分支
8. [ ] 创建 Pull Request

### 每次提交前 (MUST)

1. [ ] `just check` 全部通过
2. [ ] `pnpm markdownlint "**/*.md" "**/*.mdx"` 无错误
3. [ ] 删除所有调试代码和 `console.log`
4. [ ] 检查无敏感信息 (API Keys、密码)
5. [ ] MDX 文件包含正确的 frontmatter
6. [ ] Commit message 符合规范
7. [ ] 只提交相关文件

### 合并到 main 前 (MUST)

1. [ ] PR 已通过 Code Review
2. [ ] 所有自动化检查通过
3. [ ] Vercel 预览部署测试通过
4. [ ] 无 Git 冲突
5. [ ] 更新相关文档 (如有需要)

---

## 环境变量检查

### 本地开发

- [ ] `.env.local` 文件存在
- [ ] 包含所有必需的环境变量:
  - `ADMIN_EMAILS`
  - `SESSION_SECRET`
  - `RESEND_API_KEY`
- [ ] `.env.local` 不在 Git 中 (已在 .gitignore)

### 生产部署

- [ ] Vercel 环境变量已配置
- [ ] Edge Config 已创建并连接
- [ ] 环境变量在正确的环境中 (Production/Preview/Development)

---

## 部署检查

### Vercel 预览部署

- [ ] Push 到分支后自动创建预览部署
- [ ] 预览 URL 在 PR 中显示
- [ ] 预览部署功能正常

### Vercel 生产部署

- [ ] 合并到 main 后自动部署
- [ ] 生产 URL 正常访问
- [ ] 所有功能正常工作
- [ ] 无控制台错误

---

## 故障排查清单

### 构建失败

- [ ] 运行 `just check` 检查代码质量
- [ ] 运行 `just clean` 清理构建产物
- [ ] 删除 `node_modules` 并重新安装 (`pnpm install`)
- [ ] 检查环境变量是否正确配置

### 开发服务器无法启动

- [ ] 检查端口是否被占用 (`lsof -i :3000`)
- [ ] 检查环境变量 (`cat .env.local`)
- [ ] 重新安装依赖 (`rm -rf node_modules && pnpm install`)

### Git 冲突

- [ ] 拉取最新代码 (`git pull origin main`)
- [ ] 手动解决冲突
- [ ] 添加已解决的文件 (`git add <files>`)
- [ ] 继续提交 (`git commit`)

---

## 最终提交前快速检查

```bash
# 1. 运行所有检查
just check

# 2. 检查 Git 状态
git status

# 3. 确认只提交相关文件
git diff --staged

# 4. 提交
git commit -m "type: description"

# 5. 推送
git push origin <branch-name>
```

---

**严格遵守此检查清单，确保代码质量和项目稳定性。**
