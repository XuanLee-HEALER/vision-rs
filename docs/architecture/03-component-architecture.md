# 组件架构

Vision-RS 的组件设计遵循 React 最佳实践，充分利用 Next.js App Router 的特性。

## 服务端组件 vs 客户端组件

Next.js 16 App Router 的核心概念是 **React Server Components (RSC)**。

### 服务端组件（默认）

**特点**：

- 在服务端渲染
- 可以直接访问后端资源（数据库、文件系统）
- 不包含在客户端 JavaScript 包中
- 不能使用浏览器 API 或 React Hooks

**示例**：

```typescript
// components/layout/SiteHeader.tsx
// 默认是服务端组件

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-base/80 backdrop-blur-sm">
      <nav>{/* 导航内容 */}</nav>
    </header>
  );
}
```

**适用场景**：

- 纯展示组件
- 布局组件
- SEO 关键内容
- 需要访问后端资源的组件

### 客户端组件（标记 `'use client'`）

**特点**：

- 在客户端渲染
- 可以使用 React Hooks（useState, useEffect 等）
- 可以使用浏览器 API
- 可以添加交互性

**示例**：

```typescript
'use client';

import { useState } from 'react';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
```

**适用场景**：

- 需要状态管理
- 需要事件处理
- 需要浏览器 API（localStorage, window）
- 需要 React Hooks

### 组件边界策略

**原则**：尽可能使用服务端组件，只在必要时使用客户端组件。

```typescript
// ✅ 好的做法：服务端组件包含客户端组件
// app/page.tsx（服务端）
import SearchButton from './SearchButton'; // 客户端组件

export default function Page() {
  // 服务端数据获取
  const articles = await getArticles();

  return (
    <div>
      <h1>文章列表</h1>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
      <SearchButton /> {/* 客户端交互 */}
    </div>
  );
}
```

```typescript
// ❌ 避免：整个页面都是客户端组件
'use client';

export default function Page() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

  return <div>{/* ... */}</div>;
}
```

## 组件分层架构

Vision-RS 采用三层组件架构：

```text
┌─────────────────────────────────────┐
│       页面组件（Page Components）     │
│   app/(site)/learn/concepts/page.tsx │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│      布局组件（Layout Components）    │
│  components/layout/LearnLayout.tsx  │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│       UI 组件（UI Components）       │
│   components/ui/AIChatButton.tsx    │
└─────────────────────────────────────┘
```

### 1. 页面组件（Page Components）

**位置**：`app/` 目录

**职责**：

- 定义路由
- 组合布局和UI组件
- 处理数据获取（服务端）
- 定义页面元数据（SEO）

**示例**：

```typescript
// app/(site)/learn/concepts/ownership/page.tsx
import { Metadata } from 'next';
import LearnLayout from '@/components/layout/LearnLayout';
import OwnershipFlow from '@/components/OwnershipFlow';

export const metadata: Metadata = {
  title: '所有权系统 - Vision-RS',
  description: 'Rust 的核心特性：所有权系统',
};

export default function OwnershipPage() {
  return (
    <LearnLayout>
      <h1>所有权系统</h1>
      <OwnershipFlow />
    </LearnLayout>
  );
}
```

### 2. 布局组件（Layout Components）

**位置**：`components/layout/`

**职责**：

- 定义页面结构
- 组合多个 UI 组件
- 提供一致的布局

**示例**：

```typescript
// components/layout/LearnLayout.tsx
import SiteHeader from './SiteHeader';
import Sidebar from '../navigation/Sidebar';
import ContentShell from './ContentShell';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <Sidebar />
        <ContentShell>{children}</ContentShell>
      </div>
    </div>
  );
}
```

### 3. UI 组件（UI Components）

**位置**：`components/ui/`, `components/*/`

**职责**：

- 单一职责
- 高度可复用
- 接收 props，渲染 UI

**示例**：

```typescript
// components/ui/ScrollProgressBar.tsx
'use client';

import { useReadProgress } from '@/hooks/useReadProgress';

export default function ScrollProgressBar() {
  const progress = useReadProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-surface0">
      <div
        className="h-full bg-blue transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

## 组件设计模式

### 1. 组合模式（Composition）

**优于继承**：使用组合而非继承。

```typescript
// ✅ 好的做法：组合
function Card({ children }) {
  return <div className="rounded border">{children}</div>;
}

function CardHeader({ children }) {
  return <div className="border-b p-4">{children}</div>;
}

function CardBody({ children }) {
  return <div className="p-4">{children}</div>;
}

// 使用
<Card>
  <CardHeader>标题</CardHeader>
  <CardBody>内容</CardBody>
</Card>
```

### 2. 容器/展示模式

**分离逻辑和展示**：

```typescript
// 容器组件（逻辑）
'use client';

function SearchContainer() {
  const [query, setQuery] = useState('');
  const results = useSearch(query);

  return <SearchPresentation query={query} results={results} onQueryChange={setQuery} />;
}

// 展示组件（UI）
function SearchPresentation({ query, results, onQueryChange }) {
  return (
    <div>
      <input value={query} onChange={(e) => onQueryChange(e.target.value)} />
      <ResultList results={results} />
    </div>
  );
}
```

### 3. Render Props 模式

**传递渲染逻辑**：

```typescript
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData);
  }, [url]);

  return render(data);
}

// 使用
<DataFetcher
  url="/api/articles"
  render={(data) => (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  )}
/>
```

### 4. Compound Components（复合组件）

**共享隐式状态**：

```typescript
const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="flex border-b">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={activeTab === id ? 'active' : ''}
    >
      {children}
    </button>
  );
}

// 使用
<Tabs defaultTab="code">
  <TabList>
    <Tab id="code">代码</Tab>
    <Tab id="output">输出</Tab>
  </TabList>
  <TabPanel id="code">...</TabPanel>
  <TabPanel id="output">...</TabPanel>
</Tabs>
```

## Props 设计

### Props 类型定义

**完整的 TypeScript 类型**：

```typescript
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultQuery?: string;
  className?: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  defaultQuery = '',
  className,
}: SearchModalProps) {
  // ...
}
```

### Children 处理

**类型化 children**：

```typescript
// 单个 React 元素
interface Props {
  children: React.ReactElement;
}

// 任意 React 节点
interface Props {
  children: React.ReactNode;
}

// 特定组件类型
interface Props {
  children: React.ReactElement<ButtonProps>;
}
```

### 可选 Props 和默认值

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

function Button({ variant = 'primary', size = 'md', disabled = false }: ButtonProps) {
  // ...
}
```

## 性能优化

### 1. React.memo

**避免不必要的重渲染**：

```typescript
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // 只在 data 改变时重新渲染
  return <div>{/* 复杂渲染逻辑 */}</div>;
});
```

### 2. useMemo

**缓存计算结果**：

```typescript
function ArticleList({ articles, filter }) {
  const filteredArticles = useMemo(
    () => articles.filter((a) => a.category === filter),
    [articles, filter]
  );

  return <>{/* 渲染 filteredArticles */}</>;
}
```

### 3. useCallback

**缓存函数引用**：

```typescript
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // 函数引用不变

  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => {
  // 不会因为 Parent 重渲染而重渲染
  return <button onClick={onClick}>Click</button>;
});
```

### 4. 动态导入

**代码分割**：

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // 仅客户端加载
});
```

## 组件测试

### 单元测试结构

```typescript
// SearchModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SearchModal from './SearchModal';

describe('SearchModal', () => {
  it('renders when open', () => {
    render(<SearchModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByPlaceholderText('搜索文档...')).toBeInTheDocument();
  });

  it('calls onClose when escape is pressed', () => {
    const onClose = jest.fn();
    render(<SearchModal isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
```

## 组件文档

### JSDoc 注释

````typescript
/**
 * 搜索模态框组件
 *
 * @param isOpen - 是否显示模态框
 * @param onClose - 关闭回调函数
 * @param defaultQuery - 默认搜索词
 *
 * @example
 * ```tsx
 * <SearchModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   defaultQuery="Rust"
 * />
 * ```
 */
export default function SearchModal({ isOpen, onClose, defaultQuery }: SearchModalProps) {
  // ...
}
````

## 下一步

- 查看 [数据流和状态管理](./05-data-state.md)
- 查看 [维护指南](./09-maintenance.md) 了解如何添加新组件
