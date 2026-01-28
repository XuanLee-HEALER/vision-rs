# Vision-RS

<div align="center">

**通过图文并茂的方式深入学习 Rust 编程语言**

一个专注于 Rust 语言和标准库详解的在线学习平台

[开始学习](#快速开始) · [特色功能](#特色功能) · [内容目录](#内容结构) · [贡献指南](#贡献)

</div>

---

## 项目简介

Vision-RS 是一个现代化的 Rust 学习平台，旨在通过**图文结合**的方式帮助开发者深入理解 Rust 编程语言。我们专注于 **Pure Rust** 的详细讲解，涵盖核心语言特性、标准库以及异步编程。

### 为什么选择 Vision-RS？

- **深度优先**: 不仅教你怎么写，更要让你明白为什么这么写
- **可视化学习**: 复杂概念通过图表和动画直观展示
- **交互式体验**: 在线运行代码，即时查看结果
- **系统化内容**: 从基础到高级，循序渐进的学习路径

## 特色功能

### 1. Pure Rust 深度详解

深入剖析 Rust 的核心概念：
- 所有权系统（Ownership）
- 借用和生命周期（Borrowing & Lifetimes）
- 类型系统和 Trait
- 内存管理和安全保证
- 错误处理模式
- 并发编程

### 2. 标准库全面解析

详细讲解 Rust 标准库的常用模块：
- 集合类型（Vec, HashMap, HashSet 等）
- 迭代器和闭包
- 智能指针（Box, Rc, Arc, RefCell 等）
- 并发原语（Mutex, RwLock, Channel 等）
- I/O 操作
- 文件系统操作

### 3. 可视化概念图

通过图表帮助理解：
- 内存布局示意图
- 所有权转移过程
- 借用检查流程
- 生命周期作用域
- 类型推导过程

### 4. 在线代码实验

- 集成 Rust Playground
- 即时运行代码示例
- 查看编译错误和输出
- 修改代码并实验

### 5. 未来计划

- [ ] Tokio 异步编程详解
- [ ] 移动端 App 支持
- [ ] 实战项目案例
- [ ] 用户学习进度追踪
- [ ] 社区讨论功能

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **内容格式**: MDX
- **代码高亮**: Shiki
- **部署平台**: Vercel

## 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm / yarn / pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/XuanLee-HEALER/vision-rs.git
cd vision-rs

# 安装依赖
npm install
# 或
pnpm install
# 或
yarn install
```

### 开发

```bash
# 启动开发服务器
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建

```bash
# 生产环境构建
npm run build

# 启动生产服务器
npm run start
```

## 项目结构

```
vision-rs/
├── app/                    # Next.js App Router
│   ├── (routes)/          # 路由组
│   │   ├── learn/         # 学习页面
│   │   ├── chapters/      # 章节详情
│   │   └── playground/    # 代码练习场
│   ├── layout.tsx         # 全局布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── code-block/       # 代码块组件
│   ├── navigation/       # 导航组件
│   └── content/          # 内容展示组件
├── content/              # 学习内容（MDX 文件）
│   ├── basics/           # Rust 基础
│   ├── ownership/        # 所有权系统
│   ├── types/            # 类型系统
│   ├── stdlib/           # 标准库
│   └── async/            # 异步编程
├── lib/                  # 工具函数
│   ├── mdx.ts           # MDX 处理
│   ├── content.ts       # 内容加载
│   └── utils.ts         # 通用工具
├── public/               # 静态资源
│   ├── images/          # 图片
│   └── diagrams/        # 图表
├── styles/              # 全局样式
└── types/               # TypeScript 类型
```

## 内容结构

学习内容分为以下几个主要部分：

### 1. Rust 基础
- 变量和数据类型
- 函数和控制流
- 模式匹配
- 结构体和枚举

### 2. 所有权系统
- 所有权规则
- 移动语义
- 借用和引用
- 生命周期

### 3. 类型系统
- 泛型
- Trait 和 Trait 对象
- 类型推导
- 关联类型

### 4. 标准库详解
- 集合类型
- 迭代器
- 智能指针
- 并发工具

### 5. 异步编程（规划中）
- async/await
- Tokio 运行时
- 异步 I/O
- 并发模式

## 贡献

欢迎各种形式的贡献！

### 贡献方式

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- ✍️ 贡献教程内容
- 🎨 优化 UI/UX
- 🔧 提交代码修复

### 贡献流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 内容贡献指南

如果你想贡献教程内容：

1. 内容使用 MDX 格式编写
2. 确保代码示例可以运行
3. 添加必要的图表和说明
4. 遵循现有的内容结构和风格
5. 确保内容准确性（可参考官方文档）

## 开发计划

### Phase 1: 基础框架 (当前阶段)
- [x] 项目初始化
- [ ] 基础 UI 组件库
- [ ] MDX 内容系统
- [ ] 代码高亮和展示
- [ ] 响应式布局

### Phase 2: 核心内容
- [ ] Rust 基础教程（10+ 章节）
- [ ] 所有权系统详解
- [ ] 标准库参考手册
- [ ] 可视化图表集成
- [ ] 搜索功能

### Phase 3: 交互增强
- [ ] Rust Playground 集成
- [ ] 代码在线运行
- [ ] 互动式练习题
- [ ] 学习进度追踪
- [ ] 暗色模式

### Phase 4: 社区功能
- [ ] 用户评论系统
- [ ] 内容评分和反馈
- [ ] 讨论区
- [ ] 用户贡献平台

### Phase 5: 移动端
- [ ] PWA 支持
- [ ] 移动端优化
- [ ] 原生 App (可选)

## 常见问题

### 这个项目需要后端吗？

**初期不需要**。Vision-RS 基于 Next.js 的静态生成功能，内容存储在 MDX 文件中，不需要独立的后端服务器。未来如果需要用户系统、评论等功能，可以使用：
- Serverless Functions（Vercel/Netlify）
- Firebase / Supabase（BaaS）
- 轻量级后端（如需要复杂功能）

### 内容如何管理？

内容以 MDX 文件形式存储在 `content/` 目录下，使用 Git 进行版本控制。这种方式的优势：
- 易于编写和维护
- 支持版本控制
- 可以接受社区贡献
- 无需数据库

### 如何添加新的教程内容？

1. 在 `content/` 相应目录下创建 `.mdx` 文件
2. 添加 frontmatter 元数据（标题、描述、顺序等）
3. 编写内容（Markdown + React 组件）
4. 在导航配置中添加链接
5. 提交 PR

### 代码示例如何运行？

集成 Rust Playground API，用户可以：
- 查看预设的代码示例
- 编辑代码
- 点击运行按钮
- 查看输出结果

无需本地安装 Rust 环境。

## 许可证

[MIT License](LICENSE)

## 联系方式

- GitHub: [@XuanLee-HEALER](https://github.com/XuanLee-HEALER)
- Issues: [GitHub Issues](https://github.com/XuanLee-HEALER/vision-rs/issues)

## 致谢

- [Rust 官方文档](https://doc.rust-lang.org/)
- [Rust By Example](https://doc.rust-lang.org/rust-by-example/)
- [The Rust Programming Language Book](https://doc.rust-lang.org/book/)
- [Rust Playground](https://play.rust-lang.org/)

---

<div align="center">

**用心做好每一篇教程，让 Rust 学习更简单**

⭐ 如果这个项目对你有帮助，欢迎 Star 支持！

</div>
