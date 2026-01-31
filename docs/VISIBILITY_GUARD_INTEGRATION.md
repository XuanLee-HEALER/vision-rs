# VisibilityGuard 集成指南

## 概述

VisibilityGuard 是一个服务端组件，用于实现**软隐藏**策略：

- 隐藏的内容仍可通过直接 URL 访问
- 显示横幅提示内容状态（未发布 或 管理员预览）
- 不会返回 404，便于运行时修改可见性

## 工作原理

```typescript
// 可见内容: 正常渲染
<VisibilityGuard slug="learn/concepts/ownership">
  <YourContent />
</VisibilityGuard>

// 隐藏内容 + 普通用户: 显示"内容尚未发布"横幅 + 渲染内容
// 隐藏内容 + 管理员: 显示"管理员预览"横幅 + 渲染内容
```

## 横幅提示文案

### 管理员用户

```
⚠️ 此内容当前不可见
该页面已设置为隐藏状态，普通用户无法通过导航和搜索发现此页面。
你作为管理员可以预览此内容。
```

### 普通用户

```
⚠️ 内容尚未发布
此内容正在编写中，尚未正式发布。你可以阅读当前版本，
但内容可能不完整或随时更新。
```

## 集成方式

### 方式 1: 在 page.mdx 中手动包裹（推荐用于单个页面）

**优点**: 精确控制，适合少量页面
**缺点**: 需要修改每个 page.mdx 文件

**示例**:

```mdx
// app/(site)/learn/concepts/ownership/page.mdx
import LearnLayout from '@/components/LearnLayout';
import VisibilityGuard from '@/components/visibility/VisibilityGuard';

export const metadata = {
  title: '所有权系统',
  description: 'Rust 的所有权机制',
};

<VisibilityGuard slug="learn/concepts/ownership">
  <LearnLayout>

# 所有权系统

内容...

  </LearnLayout>
</VisibilityGuard>
```

### 方式 2: 创建专用 Layout（推荐用于批量集成）

**优点**: 一次配置，自动应用到所有页面
**缺点**: 需要获取当前路径来推断 slug

**步骤**:

1. 创建 `app/(site)/learn/concepts/layout.tsx`:

```typescript
import { headers } from 'next/headers';
import VisibilityGuard from '@/components/visibility/VisibilityGuard';

export default async function ConceptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current pathname
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Convert pathname to slug (remove leading slash)
  const slug = pathname.replace(/^\//, '');

  return (
    <VisibilityGuard slug={slug}>
      {children}
    </VisibilityGuard>
  );
}
```

2. 在 `middleware.ts` 中添加 pathname header（如果尚未配置）:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/learn/:path*',
};
```

### 方式 3: 使用自定义 LearnLayout（最简单）

**优点**: 无需修改现有页面，自动应用
**缺点**: 需要在 metadata 中添加 slug 字段

**步骤**:

1. 修改 `components/layout/LearnLayout.tsx`:

```typescript
import VisibilityGuard from '@/components/visibility/VisibilityGuard';

interface LearnLayoutProps {
  children: React.ReactNode;
  slug?: string; // Optional slug for visibility check
}

export default async function LearnLayout({ children, slug }: LearnLayoutProps) {
  // If slug is provided, wrap with VisibilityGuard
  if (slug) {
    return (
      <VisibilityGuard slug={slug}>
        <article className="prose prose-sm md:prose-base lg:prose-lg snap-y snap-start">
          {children}
        </article>
      </VisibilityGuard>
    );
  }

  // No slug - render without guard
  return (
    <article className="prose prose-sm md:prose-base lg:prose-lg snap-y snap-start">
      {children}
    </article>
  );
}
```

2. 在 page.mdx 中传递 slug:

```mdx
<LearnLayout slug="learn/concepts/ownership">

# 所有权系统

内容...

</LearnLayout>
```

## 性能考虑

### KV 查询次数

每个使用 VisibilityGuard 的页面会执行：

- 1 次 KV 查询（`getVisibility(slug)`）
- 1 次会话检查（`isAdmin()`）

**优化建议**:

- 使用 React cache() 包装查询函数（Next.js 14+）
- 在 layout 层统一查询，避免重复查询

### 本地开发

当 KV 未配置时，VisibilityGuard 会自动跳过可见性检查（Fail-open），所有内容正常显示。

## 测试

### 测试隐藏内容的横幅

1. 登录管理后台（`/admin/login`）
2. 进入可见性管理（`/admin/visibility`）
3. 隐藏某个内容（例如 `learn/concepts/ownership`）
4. 访问该页面的 URL（`/learn/concepts/ownership`）
5. 验证：
   - ✅ 页面正常显示（不是 404）
   - ✅ 顶部显示黄色横幅
   - ✅ 横幅文案为"此内容当前不可见"（管理员）

### 测试普通用户视图

1. 退出登录（`/admin/logout` 或清除 Cookie）
2. 访问隐藏内容的 URL
3. 验证：
   - ✅ 页面正常显示
   - ✅ 顶部显示黄色横幅
   - ✅ 横幅文案为"内容尚未发布"（普通用户）

### 测试可见内容

1. 访问可见内容的 URL
2. 验证：
   - ✅ 页面正常显示
   - ✅ 无横幅（正常状态）

## 故障排查

### 横幅不显示

**问题**: 隐藏内容没有显示横幅

**检查清单**:

1. ✓ VisibilityGuard 是否正确包裹内容？
2. ✓ slug 参数是否正确？（格式: `learn/concepts/ownership`，不要开头斜杠）
3. ✓ KV 环境变量是否配置？（本地开发跳过检查）
4. ✓ 内容是否真的被隐藏？（检查管理后台）

### 所有内容都显示横幅

**问题**: 所有页面都显示"内容尚未发布"

**原因**: 可能 slug 参数错误

**解决**: 检查 slug 格式，确保与内容索引中的 slug 一致

### 管理员看到"内容尚未发布"

**问题**: 管理员应该看到"管理员预览"，但看到了"内容尚未发布"

**原因**: 会话未正确读取

**解决**:

1. 检查是否已登录（访问 `/admin`）
2. 检查 SESSION_SECRET 环境变量
3. 清除 Cookie 重新登录

## 下一步

### 可选增强

1. **SEO 保护**: 集成 VisibilityMeta 添加 robots noindex

   ```tsx
   import { generateVisibilityMetadata } from '@/components/visibility/VisibilityMeta';

   export async function generateMetadata() {
     const visible = await getVisibility('learn/concepts/ownership');
     return generateVisibilityMetadata(visible, {
       title: '所有权系统',
       description: 'Rust 的所有权机制',
     });
   }
   ```

2. **批量集成脚本**: 创建脚本自动为所有 page.mdx 添加 VisibilityGuard

3. **统计**: 记录隐藏内容的访问次数（用于分析）

## 相关文档

- [可见性系统总览](./PHASE4_VISIBILITY_SUMMARY.md)
- [管理后台使用指南](./PHASE5_ADMIN_SUMMARY.md)
- [质量反馈修复](./QA_FIXES_SUMMARY.md)
