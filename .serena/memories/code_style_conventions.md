# 代码风格和约定

## TypeScript 规范

- 使用 TypeScript 编写所有代码
- 使用函数组件 (Function Components)
- 组件文件使用 PascalCase 命名 (如 `Banner.tsx`)
- 工具函数文件使用 camelCase 命名 (如 `navigation.ts`)

## React 组件

- 使用函数式组件
- 使用 `export default function ComponentName()`
- Props 接口定义在组件上方

## Tailwind CSS

- 使用 Tailwind 工具类进行样式设计
- 遵循 Catppuccin Macchiato 配色方案
- 颜色变量已在 `tailwind.config.ts` 中定义

## MDX 内容

- 学习内容使用 MDX 格式
- 支持 GitHub Flavored Markdown
- 支持嵌入 React 组件

## 文件组织

- 组件放在 `components/` 目录
- 页面放在 `app/` 目录 (App Router)
- 工具函数放在 `lib/` 目录
- MDX 内容放在 `content/` 或 `app/` 目录下

## 命名约定

- 组件: PascalCase (Banner, Sidebar)
- 函数: camelCase (isActive, NavLink)
- 常量: UPPER_SNAKE_CASE
- CSS 类: 使用 Tailwind 工具类
