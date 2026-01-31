# 质量团队反馈修复总结

## 执行时间

2026-01-31

## 修复的问题

### P1: 入口隐藏不完整 ✅

**问题描述**:

- `/learn` 首页硬编码了卡片入口链接，不根据可见性过滤
- 隐藏的内容仍能通过首页卡片被发现

**修复方案**:

- 将 `app/(site)/learn/page.tsx` 改为服务端组件（async）
- 添加 `filterVisibleCards()` 函数，基于 KV 查询过滤卡片
- 实现 Fail-open 策略（KV 未配置或查询失败时显示所有卡片）

**修改文件**:

- `app/(site)/learn/page.tsx` (+50 行)

**关键代码**:

```typescript
async function filterVisibleCards(cards: PathCard[]): Promise<PathCard[]> {
  const kvConfigured = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

  if (!kvConfigured) {
    return cards;
  }

  try {
    const slugs = cards.map((card) => card.href.replace(/^\//, ''));
    const visibilityMap = await getBatchVisibility(slugs);
    return cards.filter((card) => {
      const slug = card.href.replace(/^\//, '');
      return visibilityMap[slug] !== false;
    });
  } catch (error) {
    console.error('Error filtering cards:', error);
    return cards; // Fail-open
  }
}
```

**验证结果**:

- ✅ 构建成功
- ✅ 首页卡片根据可见性过滤
- ✅ Fail-open 策略生效

---

### P1: 导航过滤逻辑未覆盖 subsections ✅

**问题描述**:

- `filterHiddenItems()` 只处理了 `section.items`
- 未处理 `section.subsections[].items`
- "数据结构"和"网络编程"分组的内容过滤会失效

**修复方案**:

- 在 `filterHiddenItems()` 中收集 subsections 的所有 href
- 批量查询 subsections 中所有项的可见性
- 过滤 subsections 的 items，移除空的 subsections

**修改文件**:

- `features/learn/navigation.server.ts` (+40 行)

**关键代码**:

```typescript
// Collect hrefs from subsections
if (section.subsections) {
  section.subsections.forEach((subsection) => {
    if (subsection.items) {
      subsection.items.forEach((item) => {
        if (item.href) allHrefs.push(item.href);
      });
    }
  });
}

// Filter subsections
const filteredSubsections = section.subsections
  ? section.subsections
      .map((subsection) => ({
        ...subsection,
        items: subsection.items
          ? subsection.items.filter((item) => {
              const itemSlug = item.href?.replace(/^\//, '') || '';
              return visibilityMap[itemSlug] !== false;
            })
          : [],
      }))
      .filter((subsection) => subsection.items.length > 0)
  : undefined;
```

**影响范围**:

- 侧边栏导航（Sidebar）
- 移动端菜单（SideMenu）

**验证结果**:

- ✅ 构建成功
- ✅ subsections 中的隐藏项被过滤
- ✅ 空的 subsections 被移除

---

### P2: \_index.generated.json 生成流程未自动化 ✅

**问题描述**:

- `_index.generated.json` 需要手动运行脚本生成
- 新增/修改内容后容易忘记更新索引
- 管理后台和 sitemap 可能"静默过期"

**修复方案**:

- 添加 `prebuild` 脚本，在构建前自动生成索引
- 添加 `generate-index` 脚本，支持手动生成
- 安装 `tsx` 作为 devDependency

**修改文件**:

- `package.json` (scripts 部分)

**关键代码**:

```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "tsx scripts/generate-learn-index.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "generate-index": "tsx scripts/generate-learn-index.ts"
  }
}
```

**新增依赖**:

- `tsx@4.21.0` (devDependency)

**验证结果**:

- ✅ 构建时自动运行 prebuild
- ✅ 索引文件自动生成
- ✅ 构建输出显示索引统计：
  ```
  总计: 46 个内容项
     concepts: 12 项
     crates: 4 项
     mental-model: 30 项
  ```

---

## 未修复的问题（待讨论）

### P2: VisibilityGuard 和 VisibilityMeta 未接入

**当前状态**:

- `VisibilityGuard` 组件已创建，但未在页面中使用
- `VisibilityMeta` 组件已创建，用于生成 noindex meta
- 当前 Guard 行为是"强隐藏"（404），可能与需求不符

**待确认**:

1. **隐藏策略**: 软隐藏 vs 强隐藏？
   - **软隐藏**: 入口不展示 + URL 访问显示提示横幅（不 404）
   - **强隐藏**: 入口不展示 + URL 访问返回 404

2. **SEO 控制**: 是否需要动态 robots meta？
   - **当前实现**: sitemap 过滤（搜索引擎爬虫通过 sitemap 发现页面）
   - **可选增强**: 在页面 metadata 中添加 robots noindex（双重保护）

3. **集成方式**: 如何在 page.mdx 中使用 Guard？
   - **方案 A**: 手动在每个 page.mdx 中包裹 VisibilityGuard（需修改 30+ 文件）
   - **方案 B**: 在 layout 层统一处理（需要获取当前 pathname）
   - **方案 C**: 使用 middleware 在路由层拦截（Next.js 限制较多）

**建议**:

- 明确隐藏策略（软/强）
- 如果选择软隐藏，需要调整 VisibilityGuard 的行为（移除 notFound()，仅显示 Banner）
- 如果选择强隐藏，当前组件已可用，只需集成到页面

---

## 构建验证

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
- **Prebuild**: ✅ 自动生成索引
- **静态页面**: 75 个页面成功生成
- **索引文件**: 46 个内容项

### ✅ 功能验证

- [x] `/learn` 首页卡片根据可见性过滤
- [x] 导航菜单过滤包含 subsections
- [x] 构建时自动生成索引
- [x] Sitemap 包含可见性过滤
- [x] Fail-open 策略在本地开发生效

---

## 代码统计

| 指标     | 数值    |
| -------- | ------- |
| 修改文件 | 3 个    |
| 新增代码 | ~90 行  |
| 新增依赖 | 1 个    |
| ESLint   | 0 错误  |
| 构建状态 | ✅ 成功 |

## 文件清单

### 修改

- `app/(site)/learn/page.tsx` (+50 行) - 添加可见性过滤
- `features/learn/navigation.server.ts` (+40 行) - 支持 subsections 过滤
- `package.json` (+2 行) - 添加 prebuild 和 generate-index 脚本

### 新增依赖

- `tsx@4.21.0` (devDependency) - 运行 TypeScript 脚本

---

## 完整的可见性控制架构

```
┌─────────────────────────────────────────────┐
│ Level 0: 索引生成（自动化）                   │
│ - prebuild: 自动生成 _index.generated.json   │
│ - 确保管理后台和 sitemap 数据同步              │
└─────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ Level 1: 首页过滤 (learn/page.tsx)           │
│ - 隐藏的内容不出现在首页卡片                  │
│ - Fail-open: KV 未配置时显示所有卡片          │
└─────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ Level 2: 导航过滤 (navigation.server.ts)     │
│ - 隐藏的内容不出现在侧边栏/移动菜单            │
│ - 支持 items 和 subsections 过滤             │
│ - Fail-open: KV 未配置时显示所有导航          │
└─────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ Level 3: Sitemap 过滤 (sitemap.ts)          │
│ - 隐藏的内容不出现在 sitemap.xml             │
│ - 搜索引擎不索引隐藏内容                      │
│ - Fail-open: KV 未配置时包含所有内容          │
└─────────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│ Level 4: 页面级守卫（可选，待集成）           │
│ - VisibilityGuard: 返回 404 或显示 Banner    │
│ - VisibilityMeta: 添加 robots noindex       │
└─────────────────────────────────────────────┘
```

---

## 总结

本次修复解决了质量团队提出的 3 个主要问题：

1. ✅ **P1: 首页入口过滤** - 已修复，首页卡片根据可见性动态过滤
2. ✅ **P1: 导航过滤覆盖 subsections** - 已修复，支持完整的导航树过滤
3. ✅ **P2: 索引生成自动化** - 已修复，构建时自动生成索引

**未处理的建议**:

- P2: VisibilityGuard/Meta 集成（需要明确隐藏策略后再实施）

**代码质量**:

- ESLint: 0 warning/0 error
- 构建: ✅ 成功
- 测试: ✅ 所有功能验证通过

**建议下一步**:

1. 明确隐藏策略（软隐藏 vs 强隐藏）
2. 根据策略决定是否集成 VisibilityGuard
3. 如需 SEO 保护，集成 VisibilityMeta
