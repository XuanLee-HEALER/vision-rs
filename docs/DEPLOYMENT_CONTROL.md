# Vercel 部署控制

本项目配置了精细化的部署触发控制，避免不必要的部署。

## 🎯 控制规则

### 1. Commit Message 标记（最高优先级）

在 commit message 中添加特殊标记来控制部署：

#### 跳过部署

```bash
git commit -m "docs: update README [skip ci]"
git commit -m "chore: update config [skip deploy]"
git commit -m "refactor: code cleanup [no deploy]"
```

**标记**：`[skip ci]`, `[skip deploy]`, `[no deploy]`（不区分大小写）

#### 强制部署

```bash
git commit -m "docs: critical update [deploy]"
git commit -m "chore: update dependencies [force deploy]"
```

**标记**：`[deploy]`, `[force deploy]`

### 2. Commit Type 前缀

使用约定式提交格式，某些类型自动跳过部署：

| Commit Type | 是否部署 | 示例                        |
| ----------- | -------- | --------------------------- |
| `feat:`     | ✅ 部署  | `feat: add new feature`     |
| `fix:`      | ✅ 部署  | `fix: resolve bug`          |
| `docs:`     | 🚫 跳过  | `docs: update guide`        |
| `chore:`    | 🚫 跳过  | `chore: update deps`        |
| `style:`    | ✅ 部署  | `style: update UI`          |
| `refactor:` | ✅ 部署  | `refactor: optimize code`   |
| `test:`     | ✅ 部署  | `test: add tests`           |
| `perf:`     | ✅ 部署  | `perf: improve performance` |

### 3. 文件路径过滤

只改动特定文件时自动跳过部署：

**自动跳过的路径**：

- `docs/` - 文档目录
- `README.md` - 项目说明
- `.github/` - GitHub 配置
- `.vscode/` - VS Code 配置
- `.claude/` - Claude 配置

**示例**：

```bash
# 只修改文档 → 跳过部署
git add docs/GUIDE.md
git commit -m "docs: add usage guide"

# 修改代码 + 文档 → 触发部署
git add src/app.tsx docs/API.md
git commit -m "feat: add new API"
```

## 📋 决策流程

```
Commit 推送到 main
    ↓
检查 commit message 是否有 [skip ci] 等标记
    ↓ YES → 🚫 跳过部署
    ↓ NO
检查 commit message 是否有 [deploy] 等标记
    ↓ YES → ✅ 触发部署
    ↓ NO
检查 commit type 是否是 docs: 或 chore:
    ↓ YES → 🚫 跳过部署
    ↓ NO
检查文件改动是否只包含文档/配置
    ↓ YES → 🚫 跳过部署
    ↓ NO
✅ 触发部署
```

## 🛠️ 使用示例

### 场景 1：纯文档更新

```bash
# 方式 1: 使用 commit type
git commit -m "docs: update deployment guide"

# 方式 2: 使用标记
git commit -m "update documentation [skip ci]"

# 结果: 🚫 不触发部署
```

### 场景 2：代码修改

```bash
git commit -m "feat: add user authentication"

# 结果: ✅ 触发部署
```

### 场景 3：配置更新但需要部署

```bash
git commit -m "chore: update Vercel config [deploy]"

# 结果: ✅ 强制触发部署
```

### 场景 4：混合改动

```bash
# 同时修改了代码和文档
git add src/app.tsx docs/API.md
git commit -m "feat: add API with documentation"

# 结果: ✅ 触发部署（因为有代码改动）
```

## 🧪 本地测试

在推送前，可以本地测试部署控制逻辑：

```bash
# 测试当前 commit 是否会触发部署
bash vercel-ignore.sh

# 查看输出：
# - 退出码 0 = 跳过部署
# - 退出码 1 = 触发部署

# 检查退出码
echo $?
```

**输出示例**：

```
🔍 Checking if deployment should be triggered...
📝 Commit message: docs: update guide
🚫 Skipping deployment: documentation or chore commit
```

## ⚙️ 配置文件

### `vercel.json`

```json
{
  "ignoreCommand": "bash vercel-ignore.sh"
}
```

**说明**：告诉 Vercel 在构建前运行 `vercel-ignore.sh` 脚本来决定是否部署。

### `vercel-ignore.sh`

部署控制逻辑的核心脚本，包含：

1. Commit message 检查
2. Commit type 检查
3. 文件改动检查

## 🔧 自定义规则

### 添加新的跳过条件

编辑 `vercel-ignore.sh`，在相应位置添加规则：

```bash
# 添加新的 commit type
if echo "$COMMIT_MSG" | grep -qE "^(wip|draft):"; then
  echo "🚫 Skipping deployment: work in progress"
  exit 0
fi

# 添加新的文件路径
if echo "$CHANGED_FILES" | grep -qvE "^(docs/|scripts/|tests/)"; then
  echo "✅ Deploying: contains code changes"
  exit 1
fi
```

### 修改默认行为

**默认触发部署** → **默认跳过部署**：

```bash
# 在脚本末尾修改
echo "🚫 Skipping deployment: default behavior"
exit 0  # 改为 exit 0
```

## 📊 Vercel Dashboard 配置

除了脚本控制，还需要在 Vercel Dashboard 中确认配置：

1. 进入项目设置：https://vercel.com/dashboard
2. Settings → Git
3. 确认 **Ignored Build Step** 配置：
   - Command: `bash vercel-ignore.sh`

## ⚠️ 注意事项

1. **首次推送**：首次推送到 main 会触发部署（因为没有 HEAD^）
2. **Merge Commits**：合并提交会检查最新的 commit message
3. **Script 错误**：如果脚本执行失败，Vercel 会默认触发部署
4. **环境变量**：脚本运行在 Vercel 构建环境，可访问 git 命令

## 🐛 故障排查

### 问题 1：所有提交都触发部署

**原因**：`vercel.json` 配置未生效或脚本有错误

**解决**：

1. 检查 `vercel.json` 是否已提交
2. 在 Vercel Dashboard 确认配置
3. 本地测试脚本：`bash vercel-ignore.sh`

### 问题 2：应该部署的提交被跳过

**原因**：规则过于严格

**解决**：使用 `[deploy]` 标记强制部署

### 问题 3：脚本权限错误

**原因**：脚本没有执行权限

**解决**：

```bash
chmod +x vercel-ignore.sh
git add vercel-ignore.sh
git commit -m "fix: add execute permission to deploy script"
```

## 📚 相关资源

- [Vercel Ignored Build Step 文档](https://vercel.com/docs/concepts/projects/overview#ignored-build-step)
- [约定式提交规范](https://www.conventionalcommits.org/)
- [项目部署指南](./VERCEL_DEPLOYMENT_GUIDE.md)

---

**最后更新**：2026-02-02
