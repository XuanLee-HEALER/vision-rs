# 主页功能说明

## 功能概览

Vision-RS 主页（`/`）提供以下功能：

1. **项目介绍** - 展示 Vision-RS 的核心理念和目标
2. **访问统计** - 显示最近 7 天的访问趋势（使用 Recharts 图表）
3. **留言板** - 支持匿名留言，带 IP 频率限制

## 技术架构

### 数据存储

使用 **Vercel Edge Config** 作为数据存储方案，与现有的可见性控制系统保持一致。

#### 存储结构

**留言板数据**：

- Key: `messages`
- Value: `Message[]`
- 结构：
  ```typescript
  {
    id: string;
    content: string;
    timestamp: number;
    ip: string;
  }
  ```

**留言频率限制**：

- Key: `messageLimits`
- Value: `Record<ip, RateLimitRecord>`
- 结构：
  ```typescript
  {
    [ip: string]: {
      lastMessageTime: number;
    }
  }
  ```

**访问统计**：

- Key: `visitors`
- Value: `Record<dateKey, VisitorDayRecord>`
- 结构：
  ```typescript
  {
    [dateKey: string]: {
      count: number;
      ips: string[];
    }
  }
  ```

### API 端点

#### 1. 留言板 API (`/api/messages`)

**GET** - 获取最近 7 条留言

```bash
curl https://vision-rs.com/api/messages
```

**POST** - 发送留言

```bash
curl -X POST https://vision-rs.com/api/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "你的留言内容"}'
```

限制：

- 每个 IP 6 小时内只能发送 1 条留言
- 留言最长 500 字
- 只保留最新 100 条留言

**DELETE** - 删除留言（需要管理员密钥）

```bash
curl -X DELETE https://vision-rs.com/api/messages \
  -H "Content-Type: application/json" \
  -d '{"id": "message-id", "adminKey": "your-admin-key"}'
```

#### 2. 访问统计 API (`/api/visitors`)

**GET** - 获取最近 7 天访问统计

```bash
curl https://vision-rs.com/api/visitors
```

自动功能：

- 记录访问者 IP
- 每个 IP 每天只计数一次
- 自动清理 30 天前的数据

**POST** - 仅记录访问（不返回数据）

```bash
curl -X POST https://vision-rs.com/api/visitors
```

## 环境变量配置

### 必需变量

1. **ADMIN_KEY** - 留言板管理密钥

   ```bash
   # 生成强随机密钥
   openssl rand -hex 32
   ```

2. **EDGE_CONFIG** - Edge Config 连接字符串
   - Vercel 部署时自动注入
   - 本地开发：`vercel env pull`

3. **VERCEL_API_TOKEN** - 用于更新 Edge Config
   - 获取地址：https://vercel.com/account/tokens
   - 权限：项目写入权限

### 配置示例

`.env.local`:

```bash
ADMIN_KEY=your-random-hex-key-here
EDGE_CONFIG=https://edge-config.vercel.com/ecfg_xxx
VERCEL_API_TOKEN=your-vercel-token
```

## 本地开发

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看主页。

### 测试 API

**测试留言功能**：

```bash
# 发送留言
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "测试留言"}'

# 获取留言列表
curl http://localhost:3000/api/messages
```

**测试访问统计**：

```bash
curl http://localhost:3000/api/visitors
```

## 生产环境部署

### 1. 创建 Edge Config

在 Vercel 项目设置中：

1. 进入 "Storage" 标签
2. 创建新的 Edge Config
3. 初始化以下 keys：
   ```json
   {
     "messages": [],
     "messageLimits": {},
     "visitors": {}
   }
   ```

### 2. 配置环境变量

在 Vercel 项目设置的 "Environment Variables" 中添加：

- `ADMIN_KEY` - 留言板管理密钥
- `VERCEL_API_TOKEN` - Vercel API Token（用于更新 Edge Config）

`EDGE_CONFIG` 会在部署时自动注入。

### 3. 部署

```bash
git push origin main
```

Vercel 会自动触发部署。

## 数据管理

### 查看 Edge Config 数据

使用 Vercel CLI：

```bash
# 安装 CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 查看所有留言
vercel edge-config get messages

# 查看访问统计
vercel edge-config get visitors
```

### 清理数据

**清理留言**（通过 Vercel 控制台）：

1. 进入 Edge Config 页面
2. 找到 `messages` key
3. 编辑值为 `[]`

**清理访问统计**：

1. 进入 Edge Config 页面
2. 找到 `visitors` key
3. 编辑值为 `{}`

## 常见问题

### Q: 留言显示为空？

A: 检查 Edge Config 是否正确初始化，确保 `messages` key 存在且为数组。

### Q: 访问统计不更新？

A: 确保 `VERCEL_API_TOKEN` 已正确配置，且有项目写入权限。

### Q: 如何删除不当留言？

A: 使用管理员密钥调用 DELETE API：

```bash
curl -X DELETE https://vision-rs.com/api/messages \
  -H "Content-Type: application/json" \
  -d '{"id": "留言ID", "adminKey": "你的ADMIN_KEY"}'
```

### Q: IP 限流如何工作？

A:

- 每个 IP 6 小时内只能发送 1 条留言
- 限流信息存储在 `messageLimits` key 中
- 限流记录会随留言一起持久化

## 性能优化

### Edge Config 特性

- **全球边缘缓存** - 数据在全球分布，低延迟访问
- **即时更新** - 数据更新后立即生效
- **高可用性** - 99.99% SLA

### 数据清理策略

- **留言** - 只保留最新 100 条
- **访问统计** - 自动清理 30 天前的数据
- **频率限制** - 随留言更新一起清理过期记录

## 安全考虑

1. **IP 频率限制** - 防止垃圾留言
2. **内容长度限制** - 最多 500 字
3. **管理员密钥** - 删除留言需要验证
4. **IP 隐私** - API 返回时不包含 IP 信息

## 未来改进

- [ ] 添加留言举报功能
- [ ] 支持 Markdown 格式
- [ ] 添加敏感词过滤
- [ ] 访问统计增加地理位置分布
- [ ] 支持留言点赞功能

## 相关文档

- [项目结构](./architecture/02-project-structure.md)
- [部署指南](./VERCEL_DEPLOYMENT_GUIDE.md)
- [代码质量规范](./CODE_QUALITY.md)
