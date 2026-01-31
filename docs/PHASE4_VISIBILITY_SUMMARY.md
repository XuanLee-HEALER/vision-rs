# Phase 4: 实现可见性系统 - 完成总结

## 执行时间

2026-01-31

## 新建的文件

### 1. 内容索引生成器

**`scripts/generate-learn-index.ts`** (213 行)

- **功能**: 扫描所有学习内容页面，生成统一的 JSON 索引
- **支持的内容类型**:
  - Mental Model (从配置读取)
  - Concepts (扫描目录)
  - Crates (递归扫描)
- **输出**: `app/(site)/learn/_index.generated.json`

**索引结构**:

```typescript
interface ContentItem {
  slug: string; // e.g., "learn/mental-model/part-1-static-world/1-1-crates-items"
  title: string;
  description: string;
  category: string; // 'concepts' | 'mental-model' | 'crates'
  filePath: string; // 相对于项目根目录的路径
  type: 'mdx' | 'tsx';
}
```

**统计结果**:

- 总计: 46 个内容项
  - concepts: 12 项
  - crates: 4 项
  - mental-model: 30 项

### 2. KV 存储模块

**`lib/visibility.ts`** (121 行)

- **KV Key 格式**: `visibility:{slug}`
- **Value 结构**:
  ```typescript
  {
    visible: boolean;
    updatedAt: string; // ISO timestamp
    updatedBy: string; // Admin email
  }
  ```

**核心函数**:

- `getVisibility(slug)`: 获取单个内容项的可见性（默认 visible: true）
- `setVisibility(slug, visible, updatedBy)`: 设置可见性
- `getBatchVisibility(slugs)`: 批量获取可见性
- `getAllVisibility()`: 获取所有可见性记录（管理后台使用）
- `deleteVisibility(slug)`: 删除记录（恢复默认可见）
- `batchSetVisibility(updates, updatedBy)`: 批量更新

**设计亮点**:

- 使用 KV Pipeline 优化批量操作性能
- Fail-open 策略：KV 查询失败时默认显示内容
- 无记录时默认 visible: true（减少存储空间）

### 3. 可见性提示组件

**`components/admin/VisibilityBanner.tsx`** (45 行)

- **显示条件**: 仅当 `visible: false` 时显示
- **样式**: 黄色警告横幅（Catppuccin yellow）
- **内容**: 提示管理员该页面已隐藏，仅管理员可预览
- **可访问性**: 包含 ARIA 标签（`role="alert"`, `aria-live="polite"`）

### 4. SEO 元数据辅助函数

**`components/admin/VisibilityMeta.tsx`** (32 行)

- **功能**: 根据可见性生成 SEO metadata
- **隐藏内容的 robots 标签**:
  ```typescript
  {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false }
  }
  ```

**使用示例**:

```typescript
export async function generateMetadata({ params }) {
  const visible = await getVisibility(slug);
  return withVisibilityCheck(visible, {
    title: 'My Page',
    description: '...',
  });
}
```

### 5. 生成的索引文件

**`app/(site)/learn/_index.generated.json`** (自动生成)

- 包含所有 46 个内容项的元数据
- 按 category 和 slug 排序
- 用于管理后台列表展示

## 架构设计

### 可见性控制流程

```
用户访问页面
    ↓
服务端渲染（RSC）
    ↓
查询 KV: getVisibility(slug)
    ├── visible: true → 正常渲染
    └── visible: false
        ├── 用户未登录 → 返回 404
        └── 管理员登录
            ├── 显示 VisibilityBanner
            └── 添加 noindex meta tag
```

### KV 存储策略

**Key 命名规则**:

- 格式: `visibility:{slug}`
- 示例: `visibility:learn/mental-model/part-1-static-world/1-1-crates-items`

**存储优化**:

- 默认可见时不写入 KV（节省存储空间）
- 仅存储显式隐藏的内容
- 批量操作使用 Pipeline 减少 RTT

### 索引生成流程

```
运行脚本: pnpm tsx scripts/generate-learn-index.ts
    ↓
扫描三种类型内容
    ├── Mental Model: 从 MENTAL_MODEL_CONFIG 读取
    ├── Concepts: 扫描 learn/concepts/*/page.mdx
    └── Crates: 递归扫描 learn/crates/**/page.mdx
    ↓
提取 metadata (使用正则匹配)
    ↓
生成 ContentItem 数组
    ↓
排序并写入 JSON 文件
```

## 验证结果

### ✅ Lint 验证

```bash
pnpm lint
```

- **结果**: ✅ No ESLint warnings or errors

### ✅ 构建验证

```bash
pnpm build
```

- **结果**: ✅ 成功
- **静态页面**: 73 个页面成功生成
- **路由类型**: 全部为静态路由（○ Static / ● SSG）

### ✅ 索引生成验证

```bash
pnpm tsx scripts/generate-learn-index.ts
```

- **结果**: ✅ 成功生成 46 个内容项
- **输出文件**: `app/(site)/learn/_index.generated.json` (已生成)

## 技术亮点

### 1. 性能优化

- **KV Pipeline**: 批量操作使用 pipeline，减少网络往返
- **默认可见**: 不写入 KV，减少存储和查询开销
- **静态生成**: 所有页面构建时预渲染，无运行时开销

### 2. 安全设计

- **Fail-open**: KV 查询失败时默认显示内容（避免误拦截）
- **管理员预览**: 隐藏内容仅管理员可见，便于审核
- **SEO 保护**: 隐藏内容添加 noindex，防止搜索引擎索引

### 3. 可维护性

- **类型安全**: 完整的 TypeScript 类型定义
- **文档完善**: JSDoc 注释 + README
- **模块化**: 功能拆分清晰（KV / 组件 / 元数据）

## 符合 PRD 要求

### ✅ Phase 4 强制要求达成

- [x] **生成内容索引**: `scripts/generate-learn-index.ts` 已实现
- [x] **KV 存储结构**: `lib/visibility.ts` 已实现
- [x] **VisibilityBanner 组件**: `components/admin/VisibilityBanner.tsx` 已实现
- [x] **SEO 优化**: `components/admin/VisibilityMeta.tsx` 已实现

### ✅ 验收标准达成

- [x] `pnpm lint` 0 warning/0 error
- [x] `pnpm build` 成功
- [x] 索引文件成功生成（46 个内容项）

## 遗留工作（Phase 5-6）

### Phase 5: 管理后台 - 可见性管理

- [ ] API Routes（GET/PUT `/api/admin/visibility`）
- [ ] 管理页面 UI（列表、搜索、批量操作）
- [ ] 删除旧的文章管理功能（`/admin/articles`）

### Phase 6: 导航过滤和最终验证

- [ ] 过滤导航菜单中的隐藏内容
- [ ] Sitemap 生成时排除隐藏内容
- [ ] 页面级可见性检查（返回 404）
- [ ] 最终验证

## 下一步

准备执行 Phase 5 - 管理后台：可见性管理

**核心任务**:

1. 创建 API Routes（`/api/admin/visibility`）
2. 创建管理页面 UI（`/admin/visibility`）
3. 删除旧的文章管理功能

**预估工作量**:

- API Routes: ~100 行代码
- 管理页面 UI: ~300 行代码
- 删除旧功能: ~20 个文件

## 总结

Phase 4 成功实现了可见性系统的基础设施：

1. ✅ **内容索引自动化** - 脚本化生成，易于维护
2. ✅ **KV 存储高效** - Pipeline 优化，Fail-open 策略
3. ✅ **组件可复用** - VisibilityBanner 和元数据辅助函数
4. ✅ **SEO 友好** - 隐藏内容正确标记 noindex
5. ✅ **类型安全** - 完整的 TypeScript 类型定义
6. ✅ **构建成功** - 0 warning/0 error

**关键文件清单**:

- `scripts/generate-learn-index.ts` (新建, 213 行)
- `lib/visibility.ts` (新建, 121 行)
- `components/admin/VisibilityBanner.tsx` (新建, 45 行)
- `components/admin/VisibilityMeta.tsx` (新建, 32 行)
- `app/(site)/learn/_index.generated.json` (生成, 46 项)

**代码质量**:

- ESLint: 0 warning/0 error
- 构建: ✅ 成功
- 类型检查: ✅ 通过
