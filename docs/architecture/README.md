# Vision-RS 项目架构文档

欢迎阅读 Vision-RS 的架构文档。本目录包含项目的技术架构、组件关系、代码结构等详细说明。

## 文档导航

### 1. [技术栈概览](./01-tech-stack.md)

深入了解项目使用的技术栈，包括：

- Next.js 16 App Router 架构
- React 19 特性和最佳实践
- TypeScript 严格模式配置
- 样式和UI框架
- 数据获取和状态管理

### 2. [项目结构](./02-project-structure.md)

详细说明项目的目录组织和文件职责：

- `/app` - Next.js App Router 路由结构
- `/components` - React 组件分层架构
- `/lib` - 工具函数和共享逻辑
- `/features` - 功能模块封装
- `/hooks` - 自定义 React Hooks
- `/contexts` - React Context 状态管理

### 3. [组件架构](./03-component-architecture.md)

深入分析组件设计模式和组织方式：

- 组件分层：UI、布局、业务组件
- 客户端/服务端组件划分
- 组件组合和复用策略
- Props 设计和类型定义
- 性能优化技巧

### 4. [路由和导航](./04-routing-navigation.md)

Next.js App Router 的使用和导航系统：

- 文件系统路由
- 动态路由和参数
- 路由组和布局
- 导航组件实现
- 搜索功能集成

### 5. [数据流和状态管理](./05-data-state.md)

应用的数据流动和状态管理策略：

- Server Components vs Client Components
- React Context 使用场景
- 本地状态管理
- 搜索索引生成和加载
- 认证状态管理

### 6. [样式系统](./06-styling.md)

Tailwind CSS 和 Catppuccin 主题实现：

- Tailwind 配置和自定义
- Catppuccin Macchiato 调色板
- 响应式设计策略
- 动画和过渡效果
- 暗色主题实现

### 7. [MDX 内容系统](./07-mdx-system.md)

MDX 文档的编译、渲染和管理：

- MDX 编译流程
- 自定义 MDX 组件
- 搜索索引生成
- 目录生成
- 可视化组件集成

### 8. [模块依赖关系](./08-dependencies.md)

项目内部模块的依赖关系和数据流：

- 核心模块依赖图
- 循环依赖避免
- 代码分割策略
- 树摇优化

### 9. [维护指南](./09-maintenance.md)

日常开发和维护的最佳实践：

- 添加新页面/文章
- 创建新组件
- 修改样式主题
- 更新依赖
- 性能监控
- 常见问题排查

## 快速开始

如果你是新加入的开发者，建议按以下顺序阅读：

1. **技术栈概览** - 了解项目使用的核心技术
2. **项目结构** - 熟悉目录组织
3. **组件架构** - 理解组件设计模式
4. **维护指南** - 开始实际开发工作

## 架构决策记录

重要的架构决策：

- **为什么选择 Next.js App Router**：支持 React Server Components，改善性能和SEO
- **为什么使用 MDX**：结合 Markdown 的简洁和 React 组件的灵活性
- **为什么采用 Tailwind CSS**：快速开发，一致的设计系统，优秀的树摇优化
- **为什么使用 TypeScript strict mode**：类型安全，减少运行时错误

## 贡献

在修改架构相关代码前，请：

1. 阅读相关架构文档
2. 理解现有设计模式
3. 遵循 [代码质量规范](../CODE_QUALITY.md)
4. 在 PR 中说明架构变更的原因

## 反馈

如果发现文档有误或需要补充，欢迎提 Issue 或 PR。
