# 字体配置优化说明

## 变更概述

将项目字体从 CaskaydiaCove Nerd Font Mono（编程字体）替换为性能优先的跨平台字体方案：
- **西文/数字**: Inter (Google Fonts)
- **代码**: JetBrains Mono (Google Fonts)
- **中文**: 系统字体（苹方/微软雅黑/思源黑体）

## 优势

- ✅ 总加载体积 ~200KB（vs 中文 Webfont 4-10MB）
- ✅ 移动端友好，弱网环境快速加载
- ✅ 系统字体已优化，渲染性能好
- ✅ 跨平台体验一致

## 修改文件

### 1. app/layout.tsx
### 2. tailwind.config.ts  
### 3. app/globals.css

详见各文件的 Git diff。

## ESLint 9 迁移说明

项目已升级到 ESLint 9，使用 Flat Config 格式（`eslint.config.mjs`）。

### 变更内容

- 删除 `.eslintrc.json` 和 `.eslintignore`
- 创建 `eslint.config.mjs`（Flat Config）
- 手动配置插件（不使用 FlatCompat，因循环引用问题）
- 更新 package.json：lint 脚本改为 `eslint . --ext .js,.jsx,.ts,.tsx`

### 已安装依赖

```json
{
  "@eslint/js": "^9.39.2",
  "@eslint/compat": "^2.0.2",
  "@eslint/eslintrc": "^3.3.3",
  "@typescript-eslint/eslint-plugin": "^8.54.0",
  "@typescript-eslint/parser": "^8.54.0",
  "eslint": "^9.39.2",
  "eslint-plugin-jsx-a11y": "^6.10.2",
  "eslint-plugin-react": "^7.37.5",
  "eslint-plugin-react-hooks": "^7.0.1",
  "globals": "^17.2.0"
}
```

### 配置特点

- 支持 TypeScript/React/JSX
- scripts/ 和 .claude/ 目录允许 console 和 process
- 未使用变量前缀 _ 会被忽略
- React 自动检测版本

## 验证命令

```bash
pnpm lint              # ESLint 检查
pnpm exec tsc --noEmit # TypeScript 类型检查
pnpm exec prettier --check . # 格式检查
```

---

**日期**: 2026-02-01
**实施人**: Claude Sonnet 4.5
