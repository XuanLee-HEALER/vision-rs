# Vision-RS Justfile
# 使用 `just` 命令查看所有可用的 recipes
# 安装 just: brew install just (macOS) 或 cargo install just

# 默认 recipe：显示帮助
default:
    @just --list

# ============== 开发 ==============

# 启动开发服务器
dev:
    pnpm dev

# 启动开发服务器（指定端口）
dev-port port="3000":
    pnpm dev -p {{port}}

# ============== 构建 ==============

# 构建生产版本
build:
    pnpm build

# 启动生产服务器
start:
    pnpm start

# 清理构建产物
clean:
    rm -rf .next out node_modules/.cache

# ============== 代码质量 ==============

# 运行 ESLint 检查
lint:
    pnpm lint

# 运行 ESLint 并自动修复
lint-fix:
    pnpm lint --fix

# 格式化代码
format:
    pnpm prettier --write "**/*.{ts,tsx,js,jsx,json,md,mdx,css}"

# 检查代码格式
format-check:
    pnpm prettier --check "**/*.{ts,tsx,js,jsx,json,md,mdx,css}"

# 类型检查
typecheck:
    pnpm tsc --noEmit

# 运行所有检查（lint + format + typecheck）
check: lint format-check typecheck

# ============== 依赖管理 ==============

# 安装依赖
install:
    pnpm install

# 更新依赖
update:
    pnpm update

# 添加依赖
add *packages:
    pnpm add {{packages}}

# 添加开发依赖
add-dev *packages:
    pnpm add -D {{packages}}

# ============== Git 操作 ==============

# 查看 git 状态
status:
    git status

# 添加所有更改并提交
commit message:
    git add -A && git commit -m "{{message}}"

# 推送到远程
push:
    git push

# 拉取最新代码
pull:
    git pull

# ============== 部署 ==============

# Vercel 预览部署
deploy-preview:
    vercel

# Vercel 生产部署
deploy-prod:
    vercel --prod

# ============== 实用工具 ==============

# 查看项目结构
tree:
    tree -I 'node_modules|.next|.git' -L 3

# 统计代码行数
loc:
    find . -name '*.ts' -o -name '*.tsx' | grep -v node_modules | xargs wc -l

# 打开项目（在浏览器中）
open:
    open http://localhost:3000

# 升级 Next.js 到最新版本
upgrade-next:
    pnpm add next@latest react@latest react-dom@latest

# ============== 内容管理 ==============

# 创建新的 MDX 章节
new-chapter name:
    mkdir -p "app/learn/{{name}}"
    echo '# {{name}}\n\n这是 {{name}} 章节的内容。' > "app/learn/{{name}}/page.mdx"
    @echo "创建章节: app/learn/{{name}}/page.mdx"
