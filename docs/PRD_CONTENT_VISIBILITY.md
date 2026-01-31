# PRD: 路由式内容发布 + 运行时可见性开关（移除 content/ 内容仓库）

## 背景
Vision-RS 的学习内容以 MDX 为主。当前仓库历史上同时存在两种内容组织方式：
1) 路由式内容：`app/(site)/learn/**/page.mdx`（内容随代码构建发布）
2) 内容仓库式内容：`content/**` + 通用渲染/加载器（运行时读取并渲染）

本 PRD 目标是收敛到 **路由式内容**：新内容通过 PR 发布并触发重新构建上线；运行时仅提供“可见性开关”（隐藏/显示），不提供内容编辑能力；并强制清理历史 `content/` 目录及其相关代码路径。

## 目标（Goals）
- 新文章/新章节发布走 PR：合并后自动构建上线（内容随代码发布）。
- 运行时可控制哪些文章“对外可见”（入口不展示），以及访问 URL 时显示“未发布/已隐藏”状态提示（软隐藏）。
- 管理后台仅保留“可见性管理”能力：不支持在线编辑 MDX，不支持写入仓库文件。
- 移除内容仓库式体系：彻底清理 `content/` 目录与依赖它的 loader/API/功能。
- 保持性能稳定：对外内容继续以静态化/缓存友好为主（不引入不必要的动态渲染）。

## 非目标（Non-goals）
- 不做“强隐藏”（知道 URL 也完全无法看到正文/返回 404/403）。本需求只做软隐藏。
- 不做面向外部作者的 CMS/富文本编辑器。
- 不做复杂权限体系（RBAC、多角色、多租户）。
- 不做全文检索、版本历史、审阅流（后续可独立 PRD）。

## 术语
- **路由式内容**：MDX 文件位于 `app/` 路由树中，构建时编译为页面；发布需重新构建。
- **软隐藏**：入口（导航/列表/站点地图）不展示；直接访问 URL 时仍能访问页面，但页面顶部展示“未发布/已隐藏”提示。
- **内容项**：一篇学习文章/章节，唯一标识为 `slug`（如 `learn/concepts/borrowing`）。

## 用户画像与使用场景
### 站点访客
- 从导航/列表进入，只能看到“已发布”的内容项。
- 若访问到隐藏内容的 URL，页面显示“未发布/已隐藏”提示（内容仍可阅读）。

### 管理员
- 在管理后台查看所有内容项（按栏目/目录分组、可搜索）。
- 对单个内容项进行隐藏/取消隐藏。
- 不在后台编辑正文内容；正文修改只通过 PR。

## 需求范围
### 1) 内容来源（强制）
- 学习内容统一放在：`app/(site)/learn/**/page.mdx`
- 禁止再引入/使用：`content/` 目录作为学习内容来源。

**强制要求：清理 `content/` 目录**
- 仓库中不应再存在 `content/` 目录（包括 `content/learn`、`content/mental-model`、`content/articles` 等历史残留）。
- 删除所有依赖 `content/` 的读取/写入代码、API 路由、功能入口。
- 删除与内容仓库式方案绑定的依赖（例如若不再使用 `next-mdx-remote`/`gray-matter` 等，应一并移除）。

### 2) 可见性模型
每个内容项具备一个运行时可配置状态：
- `published`（默认）：入口展示，正常访问
- `hidden`：入口隐藏；URL 访问展示“未发布/已隐藏”提示

可选扩展（不在本 PRD 强制范围内）：
- `archived`：入口隐藏；页面提示“已归档”
- `draft`：入口隐藏；页面提示“草稿”

### 3) “入口隐藏”范围
隐藏内容项后，以下入口必须过滤：
- 左侧/移动端导航（NavigationMenu）
- /learn 聚合页（若有列表/卡片）
- 任何“章节列表页/目录页”（例如 concepts/crates/data-structures 子目录页）
- Sitemap、RSS（若存在）

### 4) “URL 访问提示”
当内容项为 `hidden`：
- 页面顶部显示显著 Banner：
  - 文案：未发布 / 已隐藏（根据状态）
  - 可选：显示“最后更新时间/状态变更时间”
- SEO 建议：
  - `robots`：`noindex`（避免搜索引擎收录隐藏内容）
  - OG/Twitter 可保持，但建议添加标识

### 5) 管理后台（仅可见性）
管理后台新增/保留页面：
- `/admin/visibility`：内容可见性管理

能力：
- 列表展示所有内容项（slug、标题、栏目、最后构建时间/最近改动时间（可选））
- 支持搜索（slug/title）
- 单条切换：published <-> hidden

明确禁止：
- 任何“在线编辑 MDX / 写入文件系统 / GitHub API 写文件”的能力

## 数据与实现建议（非强制，但推荐）
### 内容索引来源（推荐）
由于内容全部在 `app/(site)/learn/**/page.mdx`，推荐在构建期生成一个“内容索引清单”，并在运行时用于管理后台展示：
- 生成脚本：扫描 `app/(site)/learn/**/page.mdx` 提取：
  - slug（由文件路径推导）
  - metadata.title/description（从 MDX `export const metadata` 读取，或约定 frontmatter）
- 输出为：`app/(site)/learn/_index.generated.json`（或 `lib/learn-index.generated.ts`）
- 管理后台与导航都只读这个索引，不做运行时扫描，减少复杂性与耦合。

### 可见性存储（推荐）
- 使用 KV（`@vercel/kv`）存储 `slug -> status`
- 约定 key：
  - `content:visibility:<slug>` -> `{ status, updatedAt, updatedBy }`
  - 或维护一个 map：`content:visibility:map`（一次性读取）

### 页面提示实现（推荐）
- 在 learn 文章页面（或 LearnLayout shell）注入一个 `VisibilityBanner`：
  - 通过 slug 查询 KV 获取状态
  - 若 status=hidden，则渲染 Banner
- 为了缓存友好，状态读取应具备 TTL 缓存（例如 30s/60s），避免每次请求都打 KV。

## 安全与权限
- 管理后台的鉴权沿用现有机制（需统一为单一方案：Cookie Session 或 JWT，避免两套并存）。
- 管理后台 API 只允许管理员访问。
- API 必须校验 slug 的合法性（防止路径/键空间污染）。

## 迁移计划（高层）
1) 冻结内容仓库式入口：停止新增 `content/**` 内容。
2) 将仍需保留的内容迁移到 `app/(site)/learn/**/page.mdx`：
   - 若某些旧内容只存在 `content/mental-model`，需迁移为路由式页面（路径可保持原有 mental-model URL 结构）。
3) 删除 `content/` 目录。
4) 删除/移除 loader、API 写文件、`next-mdx-remote` 等不再需要的链路。
5) 新增 `/admin/visibility` 与对应 API，实现 KV 状态管理。
6) 导航/列表/站点地图统一接入可见性过滤。
7) 发布并验证：隐藏内容不出现在入口；URL 访问显示 Banner；构建/部署无回归。

## 验收标准（Acceptance Criteria）
- `pnpm lint` 0 warning/0 error。
- `pnpm build` 成功，且无对 `content/` 的引用。
- 仓库中不存在 `content/` 目录。
- 隐藏内容项：
  - 不出现在导航与任何列表入口
  - 直接访问 URL 时页面展示“未发布/已隐藏”提示（正文仍可读）
  - 页面设置 `noindex`（或等价策略）
- 管理后台只提供可见性开关，不提供内容编辑功能，不写入文件系统/仓库。

## 开放问题
- “内容项”范围是否仅限 `/learn/**`？是否包含首页之外的其它内容页？
- 是否需要“栏目页”也按可见性统计数量/排序？
- 是否需要“定时发布”（scheduled publish）与“灰度”？

