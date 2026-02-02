# SEO 优化 - 待完成任务

## ✅ 已完成（精简版方案 A）

- [x] 创建 SEO 工具库 (`lib/seo.ts`)
- [x] 增强根布局 metadata（Open Graph, Twitter Cards, JSON-LD）
- [x] 创建 `robots.ts` 动态生成 robots.txt
- [x] 创建 SVG 图标 (`icon.svg`, `og-image.svg`)
- [x] 为 Part 页面添加 metadata 和 JSON-LD
- [x] 实现章节导航组件（ChapterNavigation）
- [x] 实现智能前后章节预加载

## 📝 未完成任务（记录到 TODO）

### 图标优化（P1 - 可选）

- [ ] 将 `og-image.svg` 转换为 `og-image.png`（1200x630）
  - 当前使用 SVG，大多数社交媒体平台支持，但 PNG 兼容性更好
  - 可使用工具：ImageMagick, Inkscape, 或在线转换工具
  - 命令示例：`rsvg-convert -w 1200 -h 630 og-image.svg -o og-image.png`
- [ ] 创建 `apple-touch-icon.png`（180x180）
  - 基于 `icon.svg` 转换
  - 命令示例：`rsvg-convert -w 180 -h 180 icon.svg -o apple-touch-icon.png`
- [ ] 创建 `favicon.ico`（多尺寸：16x16, 32x32, 48x48）
  - 可使用在线工具：https://realfavicongenerator.net/
  - 或使用命令行工具：`convert icon.svg -define icon:auto-resize favicon.ico`

### 为所有 MDX 内容页面添加动态 Metadata（P2 - 等内容稳定后）

**原因**：内容高速迭代中，暂时不为每个 MDX 页面添加动态 metadata

**实施计划**（内容稳定后）：

1. **为所有分类创建 layout 并添加 `generateMetadata`**：
   - `app/(site)/learn/concepts/[slug]/layout.tsx`
   - `app/(site)/learn/crates/[slug]/layout.tsx`
   - `app/(site)/learn/mental-model/[partSlug]/[chapterSlug]/layout.tsx`（章节级别）

2. **使用 `lib/seo.ts` 中的 `generatePageMetadata` 函数**

3. **示例代码**（concepts 分类）：

```typescript
// app/(site)/learn/concepts/[slug]/layout.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVisibility } from '@/lib/visibility';
import { generatePageMetadata } from '@/lib/seo';
import contentIndex from '@/app/(site)/learn/_index.generated.json';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const fullSlug = `learn/concepts/${params.slug}`;

  const contentItem = contentIndex.find((item) => item.slug === fullSlug);

  if (!contentItem) {
    return { title: 'Not Found' };
  }

  // 检查可见性
  const visible = await getVisibility(fullSlug);

  if (!visible) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generatePageMetadata({
    title: contentItem.title,
    description: contentItem.description,
    slug: fullSlug,
    type: 'article',
    category: 'concepts',
    tags: ['Rust', 'Rust核心概念', params.slug],
  });
}

export default function ConceptLayout({ children }: Props) {
  return <>{children}</>;
}
```

### 完整的 JSON-LD Schema（P3 - 低优先级）

**可选的高级结构化数据**（SEO 效果提升有限）：

1. **CourseInstance Schema**（学习路径）

```json
{
  "@context": "https://schema.org",
  "@type": "CourseInstance",
  "name": "Rust 心智世界",
  "description": "系统性地学习 Rust 编程语言",
  "courseMode": "online",
  "inLanguage": "zh-CN"
}
```

2. **ItemList Schema**（章节列表）

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Article",
        "name": "Chapter Title",
        "url": "https://vision-rs.com/learn/..."
      }
    }
  ]
}
```

3. **FAQPage Schema**（如果添加 FAQ 部分）

### 导航菜单 Prefetch 策略优化（P3 - 可选）

**当前状态**：所有链接默认使用 Next.js 的自动 prefetch

**优化方向**：

```typescript
// components/navigation/NavigationMenu.client.tsx

// 分类标题链接 - 禁用自动预加载
<Link href={section.href} prefetch={false} className="...">

// 章节链接 - 启用自动预加载
<Link href={item.href} prefetch={true} className="...">
```

**收益**：减少不必要的网络请求，但影响较小（Next.js 已做智能优化）

## 🧪 验证清单

### 本地验证

- [ ] 运行 `pnpm build && pnpm start`
- [ ] 访问 `http://localhost:3000`，检查浏览器标签图标
- [ ] 查看页面源码：`curl http://localhost:3000 | grep -i "og:"`
- [ ] 查看 robots.txt：`curl http://localhost:3000/robots.txt`
- [ ] 查看 sitemap：`curl http://localhost:3000/sitemap.xml`

### 在线工具验证

- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [Schema.org Validator](https://validator.schema.org/)

### 生产环境验证

- [ ] 部署到 Vercel
- [ ] 在 [Google Search Console](https://search.google.com/search-console) 提交 sitemap
- [ ] 使用 "URL 检查" 工具测试索引状态
- [ ] 2 周后检查 "覆盖率" 报告

## 📈 预期效果（2-8 周）

- **2 周内**：Google 开始索引新页面
- **4 周内**：主要关键词开始出现在搜索结果中
- **8 周内**：排名和流量显著提升

## 📚 参考资源

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
