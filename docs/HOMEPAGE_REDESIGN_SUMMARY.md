# 主页改造总结

**日期**: 2026-02-02
**状态**: ✅ 完成

---

## 改造概述

将 Vision-RS 主页从简单的文章列表页面升级为功能完整的展示页面，包含项目介绍、访问统计和留言板功能。

## 核心变更

### 1. 新增功能

#### ✅ 极简现代主页设计

- 使用 Catppuccin Macchiato 配色（与项目主题一致）
- 渐变标题效果
- Rust 代码展示区（macOS 风格终端）
- 响应式设计（桌面/平板/移动端完美适配）

#### ✅ 访问统计

- 实时记录独立 IP 访问量
- 显示最近 7 天访问趋势图表（使用 Recharts）
- 每个 IP 每天只计数一次
- 自动清理 30 天前的数据

#### ✅ 留言板

- 匿名留言功能
- IP 频率限制（6 小时/条）
- 留言长度限制（500 字）
- 只显示最近 7 条留言
- 实时更新
- 管理员删除功能（需要 ADMIN_KEY）

### 2. 技术实现

#### 数据存储

使用 **Vercel Edge Config** 替代原提案的 Vercel KV（已 deprecated），与现有可见性控制系统保持一致。

**存储键**：

- `messages` - 留言列表
- `messageLimits` - IP 频率限制记录
- `visitors` - 访问统计数据

#### 新增依赖

```json
{
  "recharts": "3.7.0"
}
```

#### 新增文件

**主页**：

- `app/page.tsx` - 新主页组件（独立布局，不使用 (site) 路由组）

**API 路由**：

- `app/api/messages/route.ts` - 留言板 API（GET/POST/DELETE）
- `app/api/visitors/route.ts` - 访问统计 API（GET/POST）

**存储管理模块**：

- `lib/messages.ts` - 留言板数据管理
- `lib/visitors.ts` - 访问统计数据管理

**文档**：

- `docs/HOMEPAGE.md` - 主页功能详细文档
- `docs/HOMEPAGE_REDESIGN_SUMMARY.md` - 本文档

#### 更新文件

- `.env.local.example` - 添加 ADMIN_KEY 配置说明

### 3. 架构决策

#### 为何使用 Edge Config 而非 KV？

1. **现有基础设施** - 项目已使用 Edge Config 存储可见性配置
2. **KV 已 deprecated** - @vercel/kv 3.0.0 已被标记为弃用，推荐使用 Upstash Redis
3. **一致性** - 统一使用一种存储方案，简化部署和维护
4. **性能** - Edge Config 提供全球边缘缓存，低延迟访问

#### 为何创建独立主页？

新主页是全屏设计，有自己的 header 和 footer，不适合使用现有的 `(site)` 布局系统。因此：

- 创建 `app/page.tsx` 作为根级别路由
- 完全独立的样式和布局
- 不干扰学习内容页面（`/learn/*`）

---

## 配置要求

### 必需环境变量

1. **ADMIN_KEY** - 留言板管理密钥

   ```bash
   openssl rand -hex 32
   ```

2. **EDGE_CONFIG** - Edge Config 连接字符串（Vercel 自动注入）

3. **VERCEL_API_TOKEN** - 用于更新 Edge Config
   - 获取：https://vercel.com/account/tokens
   - 权限：项目写入权限

### Edge Config 初始化

在 Vercel 项目的 Edge Config 中添加以下 keys：

```json
{
  "messages": [],
  "messageLimits": {},
  "visitors": {}
}
```

---

## 部署步骤

### 1. 本地测试

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，添加 ADMIN_KEY

# 启动开发服务器
pnpm dev

# 访问主页
open http://localhost:3000
```

### 2. 生产部署

```bash
# 1. 在 Vercel 创建 Edge Config（如果还没有）
# 2. 初始化 Edge Config keys（见上文）
# 3. 在 Vercel 项目设置中添加环境变量
#    - ADMIN_KEY
#    - VERCEL_API_TOKEN
# 4. 推送代码
git add .
git commit -m "feat: add homepage redesign with visitor stats and message board"
git push origin main
```

---

## API 使用示例

### 留言板

**获取留言**：

```bash
curl https://vision-rs.com/api/messages
```

**发送留言**：

```bash
curl -X POST https://vision-rs.com/api/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "你的留言"}'
```

**删除留言**（管理员）：

```bash
curl -X DELETE https://vision-rs.com/api/messages \
  -H "Content-Type: application/json" \
  -d '{"id": "message-id", "adminKey": "your-admin-key"}'
```

### 访问统计

**获取统计**：

```bash
curl https://vision-rs.com/api/visitors
```

---

## 数据管理

### 查看数据

```bash
# 使用 Vercel CLI
vercel edge-config get messages
vercel edge-config get visitors
vercel edge-config get messageLimits
```

### 清理数据

通过 Vercel 控制台编辑 Edge Config：

- 留言：设置 `messages` 为 `[]`
- 访问统计：设置 `visitors` 为 `{}`
- 频率限制：设置 `messageLimits` 为 `{}`

---

## 性能优化

### Edge Config 优势

- **全球分布** - 数据缓存在全球边缘节点
- **低延迟** - < 50ms 读取延迟
- **高可用** - 99.99% SLA
- **即时更新** - 数据更新立即生效

### 自动清理策略

- 留言：保留最新 100 条
- 访问统计：保留最近 30 天
- 频率限制：随留言更新自动清理

---

## 安全特性

1. ✅ **IP 频率限制** - 防止垃圾留言（6 小时/条）
2. ✅ **内容长度限制** - 最多 500 字
3. ✅ **管理员验证** - 删除留言需要 ADMIN_KEY
4. ✅ **IP 隐私保护** - API 返回时不包含 IP 信息
5. ✅ **输入验证** - 严格的内容验证和清理

---

## 代码质量

### 检查结果

```bash
pnpm lint          # ✅ 0 errors, 0 warnings
pnpm prettier      # ✅ All files formatted
pnpm tsc --noEmit  # ✅ No type errors
```

### 代码规范

- ✅ 遵循项目 ESLint 配置
- ✅ 使用 Prettier 格式化
- ✅ TypeScript 严格模式
- ✅ 完整的类型定义
- ✅ 错误处理完善

---

## 未来改进

- [ ] 添加留言举报功能
- [ ] 支持 Markdown 格式留言
- [ ] 添加敏感词过滤
- [ ] 访问统计增加地理位置分布
- [ ] 支持留言点赞功能
- [ ] 添加管理后台（删除留言的可视化界面）
- [ ] 支持留言回复功能

---

## 参考文档

- [主页功能文档](./HOMEPAGE.md)
- [部署指南](./VERCEL_DEPLOYMENT_GUIDE.md)
- [代码质量规范](./CODE_QUALITY.md)
- [项目结构](./architecture/02-project-structure.md)

---

## 变更统计

**新增文件**: 6 个

- `app/page.tsx`
- `app/api/messages/route.ts`
- `app/api/visitors/route.ts`
- `lib/messages.ts`
- `lib/visitors.ts`
- `docs/HOMEPAGE.md`

**修改文件**: 1 个

- `.env.local.example`

**新增依赖**: 1 个

- `recharts`

**代码行数**: ~1200 行（含文档）

---

**改造完成时间**: 2026-02-02
**质量等级**: ✅ 优秀（Lint Clean + Type Safe + 完整文档）
