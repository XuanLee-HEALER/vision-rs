# MDX 编辑器功能改进清单

## 概述

本文档记录了开发环境 MDX 编辑器（`/editor` 路由）合并后需要进行的改进项。该编辑器在 2026 年合并至主分支，提供了基于 `@mdxeditor/editor` 的可视化编辑、实时预览和编译功能。

合并的分支：`claude/refactor-mdx-editor-Tk9NA`
合并时间：2026-02-03
初始代码质量评分：9.5/10

---

## 优先级说明

- **P0**: 阻塞性问题，必须立即解决
- **P1**: 高优先级，应在下一个迭代中完成
- **P2**: 中优先级，可在后续版本中完成
- **P3**: 低优先级，长期优化项

---

## P1 - 高优先级改进

### 1. 添加单元测试

**当前状态**: 无测试覆盖

**需要测试的模块**:

- `lib/dev/security.ts`
  - `validatePath()` - 路径遍历攻击防护
  - `inferTitleFromPath()` - 标题推断逻辑
  - `extractCategory()` - 分类提取逻辑
- `app/api/dev/mdx/compile/route.ts` - 编译错误处理
- `app/api/dev/mdx/write/route.ts` - 原子文件写入

**推荐工具**: Jest + React Testing Library

**参考命令**:

```bash
# 运行测试
pnpm test

# 生成覆盖率报告
pnpm test:coverage
```

**目标覆盖率**: 80%+

---

### 2. 改进类型定义

**当前问题**: 编译错误处理中使用了 `Record<string, unknown>` 和运行时类型检查

**文件**: `app/api/dev/mdx/compile/route.ts:62-78`

**当前实现**:

```typescript
const errObj = error as Record<string, unknown>;

if (
  errObj.position &&
  typeof errObj.position === 'object' &&
  errObj.position !== null &&
  'start' in errObj.position
) {
  const position = errObj.position as CompileError['position'];
  // ...
}
```

**建议改进**:

1. 定义 MDX 编译错误的接口类型
2. 使用类型守卫函数替代运行时检查
3. 从 `@mdx-js/mdx` 导入官方错误类型（如果有）

**示例**:

```typescript
// 定义类型守卫
function isMDXError(error: unknown): error is MDXCompileError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'position' in error &&
    typeof (error as MDXCompileError).position === 'object'
  );
}

// 使用
if (isMDXError(error)) {
  compileError.position = error.position;
  // TypeScript 现在知道 error.position 的类型
}
```

---

### 3. 添加编译结果缓存

**当前问题**: 每次内容变更都会重新编译，即使内容相同

**影响**: 不必要的 CPU 使用和延迟

**建议实现**:

```typescript
// app/api/dev/mdx/compile/route.ts
import { createHash } from 'crypto';

const compileCache = new Map<string, { code: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟

export async function POST(request: NextRequest) {
  const { mdx } = await request.json();
  const hash = createHash('sha256').update(mdx).digest('hex');

  // 检查缓存
  const cached = compileCache.get(hash);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, code: cached.code, cached: true });
  }

  // 编译并缓存
  const result = await compile(mdx, options);
  compileCache.set(hash, { code: String(result.value), timestamp: Date.now() });

  return NextResponse.json({ success: true, code: String(result.value) });
}
```

**注意事项**:

- 需要定期清理过期缓存
- 考虑使用 LRU 缓存策略
- 开发环境下缓存时间可以更短

---

## P2 - 中优先级改进

### 4. 添加 API 速率限制

**当前问题**: 编辑器 API 无速率限制，可能被滥用

**影响范围**:

- `/api/dev/mdx/compile` - 编译请求
- `/api/dev/mdx/write` - 文件写入
- `/api/dev/mdx/read` - 文件读取

**建议实现**:

```typescript
// lib/dev/rate-limit.ts
import { NextRequest } from 'next/server';

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  let record = requestCounts.get(ip);
  if (!record || now >= record.resetAt) {
    record = { count: 0, resetAt: now + windowMs };
    requestCounts.set(ip, record);
  }

  record.count += 1;
  const allowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);

  return { allowed, remaining };
}
```

**使用示例**:

```typescript
// app/api/dev/mdx/compile/route.ts
export async function POST(request: NextRequest) {
  const { allowed, remaining } = checkRateLimit(request);
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  // ... 原有逻辑
}
```

---

### 5. 添加文件大小限制

**当前问题**: 没有限制上传的 MDX 文件大小

**风险**: 可能导致内存溢出或过长的编译时间

**建议实现**:

```typescript
// app/api/dev/mdx/write/route.ts
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export async function PUT(request: NextRequest) {
  const { content } = await request.json();

  if (content.length > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File size exceeds ${MAX_FILE_SIZE / 1024}KB limit` },
      { status: 413 }
    );
  }

  // ... 原有逻辑
}
```

**配置建议**:

- 普通 MDX 文件：1MB
- 包含大量代码示例：2MB
- 添加环境变量配置：`MAX_MDX_FILE_SIZE`

---

### 6. 改进错误提示

**当前问题**: 编译错误显示在 UI 中，但缺少上下文信息

**建议改进**:

1. **显示错误代码片段**

   ```tsx
   // features/editor/ui/PreviewPane.tsx
   {
     error && (
       <div>
         <h3>Compilation Error</h3>
         <pre>{error.message}</pre>
         {error.line && (
           <div>
             <h4>Line {error.line}</h4>
             <CodeSnippet
               content={content}
               line={error.line}
               highlightLine={error.line}
               contextLines={3}
             />
           </div>
         )}
       </div>
     );
   }
   ```

2. **错误分类**
   - 语法错误（红色）
   - 导入错误（黄色）
   - 运行时错误（橙色）

---

## P3 - 长期优化

### 7. 添加撤销/重做功能

**建议**: 使用 `use-undo` 或自定义历史栈

**示例**:

```typescript
import { useUndo } from 'use-undo';

const [contentState, { set: setContent, undo, redo, canUndo, canRedo }] = useUndo('');
```

**快捷键**:

- Ctrl/Cmd + Z: 撤销
- Ctrl/Cmd + Shift + Z: 重做

---

### 8. 添加协作编辑支持

**技术方案**:

- WebSocket 实时同步
- Operational Transformation (OT) 或 CRDT
- 显示多用户光标位置

**优先级**: P3（当前是单用户编辑器）

---

### 9. 性能监控

**建议**: 添加编译性能指标

```typescript
// app/api/dev/mdx/compile/route.ts
const startTime = performance.now();
const result = await compile(mdx, options);
const compileTime = performance.now() - startTime;

console.log(`[MDX Compile] ${compileTime.toFixed(2)}ms (${mdx.length} chars)`);
```

**监控指标**:

- 编译时间
- 文件大小
- 错误率
- 缓存命中率

---

## 实施计划

### 第一阶段 (1-2 周)

- [x] 合并 MDX 编辑器分支
- [ ] P1.1: 添加核心模块单元测试
- [ ] P1.2: 改进类型定义
- [ ] P2.5: 添加文件大小限制

### 第二阶段 (3-4 周)

- [ ] P1.3: 实现编译缓存
- [ ] P2.4: 添加 API 速率限制
- [ ] P2.6: 改进错误提示

### 第三阶段 (长期)

- [ ] P3.7: 撤销/重做功能
- [ ] P3.9: 性能监控
- [ ] P3.8: 协作编辑支持（可选）

---

## 参考资料

### 相关文档

- [本地开发工作流](../LOCAL_WORKFLOW.md)
- [代码质量要求](../CODE_QUALITY.md)
- [MDX 官方文档](https://mdxjs.com/)

### 代码位置

- 编辑器 UI: `app/(dev)/editor/page.tsx`
- API 路由: `app/api/dev/mdx/`
- 安全工具: `lib/dev/security.ts`
- 编辑器组件: `features/editor/ui/`

### 依赖版本

- `@mdxeditor/editor`: ^3.52.3
- `@mdx-js/mdx`: (从 Next.js 继承)
- `chokidar`: ^5.0.0 (文件监听)

---

## 变更记录

| 日期       | 版本 | 变更内容                  |
| ---------- | ---- | ------------------------- |
| 2026-02-03 | 1.0  | 初始版本，记录合并时 TODO |

---

**维护者**: Claude Code
**最后更新**: 2026-02-03
