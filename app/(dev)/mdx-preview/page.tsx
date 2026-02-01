'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-subtext0">加载编辑器...</div>
  ),
});

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-subtext0">加载预览...</div>
  ),
});

const INITIAL_CONTENT = `# MDX 预览编辑器

这是一个开发环境下的 Markdown 实时预览编辑器。

## 功能特性

- **实时预览**：左侧编辑，右侧实时渲染
- **Markdown 支持**：支持完整的 Markdown 语法
- **代码高亮**：自动高亮代码块
- **主题一致**：使用 Catppuccin Macchiato 主题

## 示例代码

\`\`\`rust
fn main() {
    let message = "Hello, Rust!";
    println!("{}", message);
}
\`\`\`

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30,
};
\`\`\`

## 使用方法

1. 在左侧编辑器中输入 Markdown 内容
2. 右侧实时显示渲染结果
3. 支持所有标准 Markdown 语法

> **提示**：这个编辑器仅在开发模式下可用。

## 常用语法

### 标题

使用 \`#\` 符号创建不同级别的标题

### 列表

无序列表：
- 列表项 1
- 列表项 2
  - 嵌套列表项
  - 另一个嵌套项

有序列表：
1. 第一项
2. 第二项
3. 第三项

### 链接和图片

[访问 Rust 官网](https://www.rust-lang.org/)

### 表格

| 特性 | 描述 |
|------|------|
| 所有权 | Rust 的核心特性 |
| 借用 | 引用和生命周期 |
| 特质 | 类似接口的概念 |

### 行内代码

使用 \`code\` 标记行内代码。

### 引用

> 这是一个引用块
> 可以包含多行内容

### 任务列表

- [x] 完成的任务
- [ ] 待完成的任务
- [ ] 另一个待办事项
`;

export default function MDXPreviewPage() {
  const router = useRouter();
  const [mdxContent, setMdxContent] = useState(INITIAL_CONTENT);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.push('/');
    }
  }, [router]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-base">
      <header className="border-b border-overlay0 bg-mantle px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text">MDX 预览编辑器</h1>
            <p className="text-sm text-subtext0">仅开发模式可用 - /mdx-preview</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMdxContent(INITIAL_CONTENT)}
              className="rounded-lg bg-surface0 px-4 py-2 text-sm text-subtext1 transition hover:bg-surface1"
            >
              重置
            </button>
            <button
              onClick={() => setMdxContent('')}
              className="rounded-lg bg-surface0 px-4 py-2 text-sm text-subtext1 transition hover:bg-surface1"
            >
              清空
            </button>
            <button
              onClick={() => router.push('/')}
              className="rounded-lg bg-blue px-4 py-2 text-sm text-base transition hover:bg-blue/90"
            >
              返回首页
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-overlay0 bg-mantle">
          <div className="flex h-full flex-col">
            <div className="border-b border-overlay0 bg-surface0 px-4 py-2">
              <h2 className="text-sm font-medium text-text">编辑器</h2>
            </div>
            <div className="flex-1 overflow-hidden" data-color-mode="dark">
              <MDEditor
                value={mdxContent}
                onChange={(val) => setMdxContent(val || '')}
                height="100%"
                preview="edit"
                hideToolbar={false}
                enableScroll={true}
                visibleDragbar={false}
                textareaProps={{
                  placeholder: '在此输入 Markdown 内容...',
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-base">
          <div className="flex h-full flex-col">
            <div className="border-b border-overlay0 bg-surface0 px-4 py-2">
              <h2 className="text-sm font-medium text-text">实时预览</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="p-8" data-color-mode="dark">
                <MDPreview source={mdxContent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
