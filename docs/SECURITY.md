# 安全约束

## XSS 防护

### dangerouslySetInnerHTML 使用规范

**原则**：只能渲染来自受信任源的内容，**严禁**渲染用户输入的内容。

#### 当前使用点

1. **components/MermaidDiagram.tsx**
   - **用途**：渲染 Mermaid 图表
   - **来源**：MDX 文件中的代码块（开发者编写）
   - **防护措施**：
     - ✅ 配置 `securityLevel: 'strict'`（禁用脚本执行）
     - ✅ 只接受来自 MDX 的内容（构建时编译）
   - **约束**：
     - ❌ **禁止**接受用户输入的 Mermaid 代码
     - ❌ **禁止**从 API 或数据库动态加载 Mermaid 内容
     - ✅ **仅允许**渲染 MDX 文件中的静态内容

2. **app/layout.tsx**
   - **用途**：注入 JSON-LD 结构化数据（SEO）
   - **来源**：代码中硬编码的对象（`JSON.stringify`）
   - **防护措施**：
     - ✅ 内容完全由代码生成
     - ✅ 不包含任何用户输入
   - **约束**：
     - ✅ **确保** JSON-LD 数据完全来自代码生成
     - ❌ **禁止**在 JSON-LD 中插入用户输入的字符串

#### 代码审查检查清单

在引入新的 `dangerouslySetInnerHTML` 使用时，必须确认：

- [ ] 内容来源是否可信（MDX、代码生成、硬编码）？
- [ ] 是否有可能混入用户输入？
- [ ] 是否有 CSP（Content Security Policy）或其他防护措施？
- [ ] 是否可以用更安全的替代方案（如 React children）？

## 认证与授权

### Admin API 错误处理规范

- **401 Unauthorized**：仅用于未授权访问（未登录或 token 失效）
- **500 Internal Server Error**：用于系统错误（数据库错误、配置错误等）
- **400 Bad Request**：用于客户端请求格式错误

**示例**（`app/api/admin/visibility/route.ts`）：

```typescript
try {
  await requireAuth(); // 可能抛出 Unauthorized 错误
  // ... 业务逻辑
} catch (error) {
  // 区分认证错误和系统错误
  if (error instanceof Error && error.message.includes('Unauthorized')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
}
```

## 依赖安全

### npm audit

定期运行 `pnpm audit` 检查依赖漏洞：

```bash
pnpm audit
pnpm audit fix  # 自动修复可修复的漏洞
```

### 敏感信息保护

- ✅ 使用 `.env.local`（已添加到 `.gitignore`）
- ✅ 文档中使用占位符（如 `xxx`）而非真实 API Key
- ✅ Vercel 环境变量通过 Dashboard 配置
- ❌ **禁止**在代码中硬编码 API Key、密码、token

## 报告安全问题

如果发现安全漏洞，请通过以下方式报告：

1. 提交 GitHub Issue（标记 `security`）
2. 或发送邮件至项目维护者

**请勿**在公开渠道披露安全细节，直到问题得到修复。
