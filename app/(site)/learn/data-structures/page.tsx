export const metadata = {
  title: '数据结构 - Vision-RS',
  description: 'Rust 标准库提供的数据结构深度解析',
};

export default function DataStructuresIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <header className="mb-12 border-b border-overlay0/30 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-text">📦 数据结构</h1>
        <p className="text-lg leading-relaxed text-subtext1">
          深入理解 Rust 标准库中的数据结构实现原理
        </p>
      </header>

      {/* Introduction */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">学习目标</h2>
        <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
          <ul className="space-y-3 text-subtext1">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>掌握 Rust 标准库中常用数据结构的内部实现</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>理解不同数据结构的性能特点和使用场景</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>学会根据需求选择合适的数据结构</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>掌握自定义数据结构的实现技巧</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Reference Links */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">参考资料</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://doc.rust-lang.org/std/collections/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">std::collections</h3>
            <p className="text-sm text-subtext0">Rust 标准库集合类型文档</p>
          </a>
          <a
            href="https://doc.rust-lang.org/nomicon/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">The Rustonomicon</h3>
            <p className="text-sm text-subtext0">Unsafe Rust 和底层实现指南</p>
          </a>
        </div>
      </section>

      {/* Content Overview */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-text">内容概览</h2>
        <div className="space-y-6">
          {/* 标准库提供 */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">标准库提供</h3>
            <p className="mb-4 text-sm text-subtext0">深入解析 Rust 标准库中的核心数据结构</p>
            <div className="grid gap-3 text-sm">
              <div className="text-subtext1">
                <strong className="text-text">序列类型：</strong> Vec&lt;T&gt;, VecDeque&lt;T&gt;,
                LinkedList&lt;T&gt;
              </div>
              <div className="text-subtext1">
                <strong className="text-text">映射类型：</strong> HashMap&lt;K, V&gt;,
                BTreeMap&lt;K, V&gt;
              </div>
              <div className="text-subtext1">
                <strong className="text-text">集合类型：</strong> HashSet&lt;T&gt;,
                BTreeSet&lt;T&gt;
              </div>
              <div className="text-subtext1">
                <strong className="text-text">智能指针：</strong> Box&lt;T&gt;, Rc&lt;T&gt;,
                Arc&lt;T&gt;, RefCell&lt;T&gt;
              </div>
            </div>
          </div>

          {/* 自定义实现 */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-text">自定义实现</h3>
            <p className="mb-4 text-sm text-subtext0">从零实现经典数据结构，理解底层原理</p>
            <div className="grid gap-3 text-sm">
              <div className="text-subtext1">
                <strong className="text-text">链表：</strong> 单向链表、双向链表的 Safe Rust 实现
              </div>
              <div className="text-subtext1">
                <strong className="text-text">树结构：</strong> 二叉搜索树、AVL树、红黑树
              </div>
              <div className="text-subtext1">
                <strong className="text-text">图结构：</strong> 邻接表、邻接矩阵实现
              </div>
              <div className="text-subtext1">
                <strong className="text-text">高级结构：</strong> LRU Cache, Trie树, 跳表
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <div className="mt-12 rounded-lg border border-yellow/30 bg-yellow/10 p-6">
        <p className="text-sm text-yellow">📝 内容正在持续更新中...</p>
      </div>
    </div>
  );
}
