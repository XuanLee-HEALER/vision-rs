# Mental Model 内容迁移映射表

## 迁移概述

- **源目录**: `content/mental-model/`
- **目标目录**: `app/(site)/learn/mental-model/`
- **总文件数**: 30 个 MDX 文件
- **迁移策略**: **完全静态路由** - 为每个章节创建独立目录和 `page.mdx`

---

## 当前路由结构分析

### 现有文件

1. `/app/(site)/learn/mental-model/page.tsx` - 总览页
2. `/app/(site)/learn/mental-model/[partSlug]/page.tsx` - Part 列表页
3. `/app/(site)/learn/mental-model/[partSlug]/[chapterSlug]/page.tsx` - **动态路由章节页**

### 当前实现方式

- 使用 `generateStaticParams()` 在构建时生成静态路径
- 运行时从 `content/mental-model/` 读取 MDX 文件
- 使用 `gray-matter` 解析 frontmatter
- 使用 `next-mdx-remote` 渲染 MDX

### 迁移后的方式

- 删除动态路由 `[partSlug]/[chapterSlug]/page.tsx`
- 为每个章节创建静态路由: `[partSlug]/[chapterSlug]/page.mdx`
- MDX 在构建时编译为 React 组件（使用 `@next/mdx`）
- 不需要 `gray-matter` 和 `next-mdx-remote`

---

## 完整迁移映射

| 序号 | Part    | 原文件路径                                                 | 新文件路径                                                                                   | URL 路径                                                                  |
| ---- | ------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1    | Part 0  | `content/mental-model/0-1-reference-position.mdx`          | `app/(site)/learn/mental-model/part-0-meta/0-1-reference-position/page.mdx`                  | `/learn/mental-model/part-0-meta/0-1-reference-position`                  |
| 2    | Part 1  | `content/mental-model/1-1-crates-items.mdx`                | `app/(site)/learn/mental-model/part-1-static-world/1-1-crates-items/page.mdx`                | `/learn/mental-model/part-1-static-world/1-1-crates-items`                |
| 3    | Part 1  | `content/mental-model/1-2-namespaces-paths-visibility.mdx` | `app/(site)/learn/mental-model/part-1-static-world/1-2-namespaces-paths-visibility/page.mdx` | `/learn/mental-model/part-1-static-world/1-2-namespaces-paths-visibility` |
| 4    | Part 2  | `content/mental-model/2-1-expression-oriented.mdx`         | `app/(site)/learn/mental-model/part-2-expression-model/2-1-expression-oriented/page.mdx`     | `/learn/mental-model/part-2-expression-model/2-1-expression-oriented`     |
| 5    | Part 2  | `content/mental-model/2-2-control-flow.mdx`                | `app/(site)/learn/mental-model/part-2-expression-model/2-2-control-flow/page.mdx`            | `/learn/mental-model/part-2-expression-model/2-2-control-flow`            |
| 6    | Part 3  | `content/mental-model/3-1-type-responsibility.mdx`         | `app/(site)/learn/mental-model/part-3-type-system/3-1-type-responsibility/page.mdx`          | `/learn/mental-model/part-3-type-system/3-1-type-responsibility`          |
| 7    | Part 3  | `content/mental-model/3-2-special-types.mdx`               | `app/(site)/learn/mental-model/part-3-type-system/3-2-special-types/page.mdx`                | `/learn/mental-model/part-3-type-system/3-2-special-types`                |
| 8    | Part 4  | `content/mental-model/4-1-ownership-semantics.mdx`         | `app/(site)/learn/mental-model/part-4-ownership/4-1-ownership-semantics/page.mdx`            | `/learn/mental-model/part-4-ownership/4-1-ownership-semantics`            |
| 9    | Part 4  | `content/mental-model/4-2-move-copy-borrow.mdx`            | `app/(site)/learn/mental-model/part-4-ownership/4-2-move-copy-borrow/page.mdx`               | `/learn/mental-model/part-4-ownership/4-2-move-copy-borrow`               |
| 10   | Part 5  | `content/mental-model/5-1-borrow-checker.mdx`              | `app/(site)/learn/mental-model/part-5-borrowing-lifetimes/5-1-borrow-checker/page.mdx`       | `/learn/mental-model/part-5-borrowing-lifetimes/5-1-borrow-checker`       |
| 11   | Part 5  | `content/mental-model/5-2-lifetime-relations.mdx`          | `app/(site)/learn/mental-model/part-5-borrowing-lifetimes/5-2-lifetime-relations/page.mdx`   | `/learn/mental-model/part-5-borrowing-lifetimes/5-2-lifetime-relations`   |
| 12   | Part 5  | `content/mental-model/5-3-hrtb.mdx`                        | `app/(site)/learn/mental-model/part-5-borrowing-lifetimes/5-3-hrtb/page.mdx`                 | `/learn/mental-model/part-5-borrowing-lifetimes/5-3-hrtb`                 |
| 13   | Part 6  | `content/mental-model/6-1-patterns-first-class.mdx`        | `app/(site)/learn/mental-model/part-6-patterns/6-1-patterns-first-class/page.mdx`            | `/learn/mental-model/part-6-patterns/6-1-patterns-first-class`            |
| 14   | Part 6  | `content/mental-model/6-2-exhaustiveness-refutability.mdx` | `app/(site)/learn/mental-model/part-6-patterns/6-2-exhaustiveness-refutability/page.mdx`     | `/learn/mental-model/part-6-patterns/6-2-exhaustiveness-refutability`     |
| 15   | Part 7  | `content/mental-model/7-1-trait-three-roles.mdx`           | `app/(site)/learn/mental-model/part-7-traits/7-1-trait-three-roles/page.mdx`                 | `/learn/mental-model/part-7-traits/7-1-trait-three-roles`                 |
| 16   | Part 7  | `content/mental-model/7-2-coherence-orphan-rule.mdx`       | `app/(site)/learn/mental-model/part-7-traits/7-2-coherence-orphan-rule/page.mdx`             | `/learn/mental-model/part-7-traits/7-2-coherence-orphan-rule`             |
| 17   | Part 7  | `content/mental-model/7-3-static-dynamic-dispatch.mdx`     | `app/(site)/learn/mental-model/part-7-traits/7-3-static-dynamic-dispatch/page.mdx`           | `/learn/mental-model/part-7-traits/7-3-static-dynamic-dispatch`           |
| 18   | Part 8  | `content/mental-model/8-1-monomorphization.mdx`            | `app/(site)/learn/mental-model/part-8-generics/8-1-monomorphization/page.mdx`                | `/learn/mental-model/part-8-generics/8-1-monomorphization`                |
| 19   | Part 8  | `content/mental-model/8-2-associated-types.mdx`            | `app/(site)/learn/mental-model/part-8-generics/8-2-associated-types/page.mdx`                | `/learn/mental-model/part-8-generics/8-2-associated-types`                |
| 20   | Part 9  | `content/mental-model/9-1-memory-abstraction.mdx`          | `app/(site)/learn/mental-model/part-9-memory-model/9-1-memory-abstraction/page.mdx`          | `/learn/mental-model/part-9-memory-model/9-1-memory-abstraction`          |
| 21   | Part 9  | `content/mental-model/9-2-interior-mutability.mdx`         | `app/(site)/learn/mental-model/part-9-memory-model/9-2-interior-mutability/page.mdx`         | `/learn/mental-model/part-9-memory-model/9-2-interior-mutability`         |
| 22   | Part 10 | `content/mental-model/10-1-send-sync.mdx`                  | `app/(site)/learn/mental-model/part-10-concurrency/10-1-send-sync/page.mdx`                  | `/learn/mental-model/part-10-concurrency/10-1-send-sync`                  |
| 23   | Part 11 | `content/mental-model/11-1-async-desugaring.mdx`           | `app/(site)/learn/mental-model/part-11-async/11-1-async-desugaring/page.mdx`                 | `/learn/mental-model/part-11-async/11-1-async-desugaring`                 |
| 24   | Part 11 | `content/mental-model/11-2-pin-self-referential.mdx`       | `app/(site)/learn/mental-model/part-11-async/11-2-pin-self-referential/page.mdx`             | `/learn/mental-model/part-11-async/11-2-pin-self-referential`             |
| 25   | Part 12 | `content/mental-model/12-1-unsafe-capabilities.mdx`        | `app/(site)/learn/mental-model/part-12-unsafe/12-1-unsafe-capabilities/page.mdx`             | `/learn/mental-model/part-12-unsafe/12-1-unsafe-capabilities`             |
| 26   | Part 12 | `content/mental-model/12-2-safe-abstraction.mdx`           | `app/(site)/learn/mental-model/part-12-unsafe/12-2-safe-abstraction/page.mdx`                | `/learn/mental-model/part-12-unsafe/12-2-safe-abstraction`                |
| 27   | Part 13 | `content/mental-model/13-1-macro-compilation.mdx`          | `app/(site)/learn/mental-model/part-13-macros/13-1-macro-compilation/page.mdx`               | `/learn/mental-model/part-13-macros/13-1-macro-compilation`               |
| 28   | Part 13 | `content/mental-model/13-2-macro-vs-generics.mdx`          | `app/(site)/learn/mental-model/part-13-macros/13-2-macro-vs-generics/page.mdx`               | `/learn/mental-model/part-13-macros/13-2-macro-vs-generics`               |
| 29   | Part 14 | `content/mental-model/14-1-compile-time.mdx`               | `app/(site)/learn/mental-model/part-14-compile-runtime/14-1-compile-time/page.mdx`           | `/learn/mental-model/part-14-compile-runtime/14-1-compile-time`           |
| 30   | Part 14 | `content/mental-model/14-2-runtime.mdx`                    | `app/(site)/learn/mental-model/part-14-compile-runtime/14-2-runtime/page.mdx`                | `/learn/mental-model/part-14-compile-runtime/14-2-runtime`                |

---

## Part 分组统计

| Part ID | Part Title                         | 章节数 |
| ------- | ---------------------------------- | ------ |
| Part 0  | 如何"正确地理解 Rust 规范"         | 1      |
| Part 1  | Rust 程序的"静态世界"总览          | 2      |
| Part 2  | 表达式模型：Rust 为什么"不是 C++"  | 2      |
| Part 3  | 类型系统不是"类型"，而是"约束集合" | 2      |
| Part 4  | 所有权模型                         | 2      |
| Part 5  | 借用与生命周期：Rust 的"证明系统"  | 3      |
| Part 6  | 模式系统：Rust 的"控制结构核心"    | 2      |
| Part 7  | Trait 系统：Rust 抽象能力的根源    | 3      |
| Part 8  | 泛型与单态化：零成本抽象的代价     | 2      |
| Part 9  | 内存模型与 Interior Mutability     | 2      |
| Part 10 | 并发模型：类型系统防止数据竞争     | 1      |
| Part 11 | Async / Future：语言级状态机生成   | 2      |
| Part 12 | Unsafe Rust：责任的显式转移        | 2      |
| Part 13 | 宏与编译期元编程                   | 2      |
| Part 14 | 编译期 vs 运行期的最终分界         | 2      |

**总计**: 15 个 Part，30 个 Chapter

---

## 迁移要点

### 1. 文件格式转换

**原格式（YAML frontmatter）:**

```yaml
---
title: '1.1 Rust 程序由什么构成'
part: 'Part 1 · Rust 程序的"静态世界"总览'
chapter_id: '1-1'
---
```

**新格式（ESM export）:**

```typescript
export const metadata = {
  title: '1.1 Rust 程序由什么构成',
  description: 'Crates 与 Items 的组织方式',
  part: 'Part 1 · Rust 程序的"静态世界"总览',
  chapter_id: '1-1',
};
```

### 2. Layout 包裹

所有 MDX 内容需要用 `<LearnLayout>` 包裹：

```mdx
import LearnLayout from '@/components/LearnLayout';

export const metadata = {
  /* ... */
};

<LearnLayout>

# 标题

内容...

</LearnLayout>
```

### 3. URL 结构保持

- 原 URL: `/learn/mental-model/[partSlug]/[chapterSlug]`（动态路由）
- 新 URL: `/learn/mental-model/[partSlug]/[chapterSlug]`（静态路由，保持相同）

### 4. 配置依赖

- `features/learn/mental-model-config.ts` 保持不变
- 导航配置自动从 config 读取

---

## 技术决策记录

### 决策：使用完全静态路由

**理由：**

1. ✅ **符合 PRD "路由式内容"理念** - 内容与代码一起编译
2. ✅ **性能更优** - MDX 在构建时编译，无运行时解析开销
3. ✅ **类型安全** - TypeScript 可以检查 metadata 结构
4. ✅ **便于可见性管理** - 每个页面可以独立配置可见性
5. ✅ **简化依赖** - 不需要 `gray-matter` 和 `next-mdx-remote`

**代价：**

- ⚠️ 需要创建 30 个目录和文件（可自动化）
- ⚠️ 删除动态路由相关代码

### 迁移后需要删除的文件

1. `app/(site)/learn/mental-model/[partSlug]/[chapterSlug]/page.tsx` - 动态路由页面
2. `lib/admin/mdx-editor.ts` - MDX 编辑器（整个文件）
3. `app/api/admin/chapters/` - 章节编辑 API（整个目录）
4. `app/admin/edit/` - 编辑页面（整个目录）

### 需要保留的文件

1. `app/(site)/learn/mental-model/page.tsx` - 总览页（需要更新）
2. `app/(site)/learn/mental-model/[partSlug]/page.tsx` - Part 页面（需要更新）
3. `features/learn/mental-model-config.ts` - 配置（保持不变）

---

## Phase 1 验收标准

- [x] **1.1**: 生成完整的迁移映射表
- [x] **1.2**: 确认现有路由结构
- [x] **决策**: 确定使用静态路由迁移方案

---

## 下一步行动

✅ **Phase 1 完成**

⏭️ **Phase 2**: 执行内容迁移

- 2.1: 创建自动化迁移脚本
- 2.2: 批量迁移 30 个 MDX 文件
- 2.3: 验证所有 URL 可访问
