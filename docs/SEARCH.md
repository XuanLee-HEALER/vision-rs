# 全文搜索功能

## 功能特性

- ✅ **全文搜索**: 搜索标题、描述、小标题和正文内容
- ✅ **模糊匹配**: 容错搜索，支持拼写错误
- ✅ **快捷键支持**: `Cmd/Ctrl + K` 快速打开
- ✅ **键盘导航**: 方向键选择，Enter 打开，ESC 关闭
- ✅ **分类标签**: 彩色标签区分不同内容类型
- ✅ **实时搜索**: 即时显示搜索结果
- ✅ **零服务端成本**: 所有搜索在客户端完成

## 技术实现

### 搜索引擎

使用 **Fuse.js** 进行客户端模糊搜索：

- **权重配置**:
  - 标题 (weight: 3)
  - 描述 (weight: 2)
  - 小标题 (weight: 1.5)
  - 正文内容 (weight: 1)

- **搜索参数**:
  - `threshold: 0.4` - 模糊匹配阈值
  - `minMatchCharLength: 2` - 最小匹配字符长度
  - `limit: 10` - 最多显示 10 个结果

### 文件结构

```
components/search/
├── SearchModal.client.tsx       # 搜索弹窗组件
└── SearchProvider.client.tsx    # 搜索状态管理和快捷键

scripts/
└── generate-search-index.ts     # 搜索索引生成脚本

public/
└── search-index.json            # 搜索索引文件 (约 40KB)
```

## 使用方法

### 1. 生成搜索索引

```bash
# 手动生成
pnpm generate-search

# 或在构建时自动生成
pnpm build  # prebuild 脚本会自动生成索引
```

### 2. 在应用中使用

搜索功能已集成到全局 layout，无需额外配置。

**打开搜索**:

- 点击顶部搜索框
- 按 `Cmd/Ctrl + K`

**操作**:

- 输入关键词搜索
- `↑` `↓` 导航结果
- `Enter` 打开选中结果
- `ESC` 关闭搜索

## 搜索索引

### 索引内容

每个内容项包含：

```typescript
interface SearchIndexItem {
  slug: string; // URL 路径
  title: string; // 页面标题
  description: string; // 页面描述
  category: string; // 内容分类
  content: string; // 正文文本（去除 Markdown 语法）
  headings: string[]; // H2/H3 标题列表
}
```

### 索引生成

脚本会自动：

1. 扫描所有 MDX 文件
2. 提取 metadata（标题、描述）
3. 提取正文内容并清理 Markdown 语法
4. 提取 H2/H3 小标题
5. 生成 JSON 索引文件

### 索引统计

- **总计**: 46 个可搜索项
- **concepts**: 12 项
- **crates**: 4 项
- **mental-model**: 30 项
- **索引大小**: ~40 KB

## 分类标签

不同内容类型使用不同颜色标签：

| 分类              | 标签名称          | 颜色 |
| ----------------- | ----------------- | ---- |
| `mental-model`    | Rust 心智世界     | 蓝色 |
| `concepts`        | Rust 核心概念     | 绿色 |
| `crates`          | 三方库原理        | 黄色 |
| `data-structures` | 数据结构          | 粉色 |
| `network`         | 网络编程 & 分布式 | 紫色 |

## 性能优化

### 延迟加载

搜索索引仅在首次打开搜索框时加载，避免影响页面初始加载速度。

### 索引大小

通过以下方式优化索引大小：

- 移除 Markdown 语法
- 移除代码块
- 移除重复空行
- 当前大小: ~40KB (压缩后 ~10KB)

### 搜索性能

- Fuse.js 在客户端搜索 46 项内容
- 平均搜索时间: < 10ms
- 即时显示结果

## 开发指南

### 添加新内容

新内容会自动包含在搜索中，只需：

1. 创建 MDX 文件并添加 metadata
2. 运行 `pnpm generate-search` 重新生成索引
3. 或等待下次构建时自动生成

### 自定义搜索权重

编辑 `components/search/SearchModal.client.tsx`:

```typescript
const fuse = new Fuse(searchIndex, {
  keys: [
    { name: 'title', weight: 3 }, // 标题权重
    { name: 'description', weight: 2 }, // 描述权重
    { name: 'headings', weight: 1.5 }, // 小标题权重
    { name: 'content', weight: 1 }, // 正文权重
  ],
  threshold: 0.4, // 模糊匹配阈值 (0-1, 越小越精确)
});
```

### 调试搜索

```typescript
// 在 SearchModal.client.tsx 中添加
console.log('Search results:', results);
console.log('Search query:', query);
```

## 未来优化

可能的改进方向：

1. **搜索历史**: 记录最近搜索
2. **热门搜索**: 显示常用关键词
3. **搜索建议**: 自动补全
4. **高亮匹配**: 在结果中高亮关键词
5. **过滤器**: 按分类筛选结果
6. **排序选项**: 按相关性、日期排序

## 故障排查

### 搜索框无法打开

1. 检查 `SearchProvider` 是否在 `app/layout.tsx` 中正确引入
2. 检查浏览器控制台是否有错误

### 搜索无结果

1. 确认 `/public/search-index.json` 存在
2. 运行 `pnpm generate-search` 重新生成索引
3. 检查浏览器 Network 面板是否成功加载索引文件

### 快捷键不工作

1. 确认没有其他扩展或应用占用 `Cmd/Ctrl + K`
2. 刷新页面重试

## 相关文件

- `components/search/SearchModal.client.tsx` - 搜索 UI
- `components/search/SearchProvider.client.tsx` - 搜索状态管理
- `components/layout/SiteHeader.tsx` - 顶部搜索按钮
- `scripts/generate-search-index.ts` - 索引生成脚本
- `public/search-index.json` - 搜索索引数据
- `app/layout.tsx` - SearchProvider 集成
