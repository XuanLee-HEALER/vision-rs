export const metadata = {
  title: '三方库原理 - Vision-RS',
  description: 'Rust 生态系统中重要三方库的实现原理解析',
};

export default function CratesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <header className="mb-12 border-b border-overlay0/30 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-text">🔧 三方库原理</h1>
        <p className="text-lg leading-relaxed text-subtext1">
          深入剖析 Rust 生态中核心三方库的设计与实现
        </p>
      </header>

      {/* Introduction */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">为什么要学习三方库原理？</h2>
        <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
          <ul className="space-y-3 text-subtext1">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>理解优秀库的设计模式，提升代码架构能力</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>掌握底层实现，遇到问题时能快速定位和解决</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>学习如何设计高性能、易用的 API</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-blue">▸</span>
              <span>了解 Rust 生态的最佳实践和常用模式</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Reference Links */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">参考资料</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://crates.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">Crates.io</h3>
            <p className="text-sm text-subtext0">Rust 官方包注册中心</p>
          </a>
          <a
            href="https://docs.rs/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">Docs.rs</h3>
            <p className="text-sm text-subtext0">Rust 包文档托管平台</p>
          </a>
        </div>
      </section>

      {/* Featured Crates */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-text">核心库解析</h2>
        <div className="space-y-4">
          {/* Tokio */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-all hover:border-blue">
            <h3 className="mb-2 text-lg font-semibold text-text">Tokio - 异步运行时</h3>
            <p className="mb-3 text-sm text-subtext0">
              Rust 最流行的异步运行时，理解异步任务调度、Future、Poll、Waker 机制
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue/20 px-3 py-1 text-xs text-blue">异步编程</span>
              <span className="rounded-full bg-blue/20 px-3 py-1 text-xs text-blue">运行时</span>
              <span className="rounded-full bg-blue/20 px-3 py-1 text-xs text-blue">并发</span>
            </div>
          </div>

          {/* Serde */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-all hover:border-blue">
            <h3 className="mb-2 text-lg font-semibold text-text">Serde - 序列化框架</h3>
            <p className="mb-3 text-sm text-subtext0">
              零开销的序列化/反序列化框架，学习 derive 宏、零成本抽象设计
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-green/20 px-3 py-1 text-xs text-green">序列化</span>
              <span className="rounded-full bg-green/20 px-3 py-1 text-xs text-green">过程宏</span>
              <span className="rounded-full bg-green/20 px-3 py-1 text-xs text-green">
                泛型编程
              </span>
            </div>
          </div>

          {/* Actix & Axum */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-all hover:border-blue">
            <h3 className="mb-2 text-lg font-semibold text-text">Actix & Axum - Web 框架</h3>
            <p className="mb-3 text-sm text-subtext0">
              两种不同设计理念的 Web 框架，对比学习 Actor 模式和 Tower 中间件模式
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-mauve/20 px-3 py-1 text-xs text-mauve">Web框架</span>
              <span className="rounded-full bg-mauve/20 px-3 py-1 text-xs text-mauve">
                Actor模式
              </span>
              <span className="rounded-full bg-mauve/20 px-3 py-1 text-xs text-mauve">中间件</span>
            </div>
          </div>

          {/* Rayon */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-all hover:border-blue">
            <h3 className="mb-2 text-lg font-semibold text-text">Rayon - 并行计算</h3>
            <p className="mb-3 text-sm text-subtext0">
              数据并行处理库，学习 Work-Stealing 调度算法和并行迭代器设计
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-yellow/20 px-3 py-1 text-xs text-yellow">
                并行计算
              </span>
              <span className="rounded-full bg-yellow/20 px-3 py-1 text-xs text-yellow">
                线程池
              </span>
              <span className="rounded-full bg-yellow/20 px-3 py-1 text-xs text-yellow">
                迭代器
              </span>
            </div>
          </div>

          {/* Diesel */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-all hover:border-blue">
            <h3 className="mb-2 text-lg font-semibold text-text">Diesel - ORM 框架</h3>
            <p className="mb-3 text-sm text-subtext0">
              类型安全的 ORM，学习编译期 SQL 验证和查询构建器模式
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-teal/20 px-3 py-1 text-xs text-teal">数据库</span>
              <span className="rounded-full bg-teal/20 px-3 py-1 text-xs text-teal">ORM</span>
              <span className="rounded-full bg-teal/20 px-3 py-1 text-xs text-teal">类型安全</span>
            </div>
          </div>

          {/* Crossbeam */}
          <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-all hover:border-blue">
            <h3 className="mb-2 text-lg font-semibold text-text">Crossbeam - 并发工具</h3>
            <p className="mb-3 text-sm text-subtext0">
              高性能并发工具集，学习无锁数据结构、Channel、Epoch-based GC
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-pink/20 px-3 py-1 text-xs text-pink">并发</span>
              <span className="rounded-full bg-pink/20 px-3 py-1 text-xs text-pink">无锁结构</span>
              <span className="rounded-full bg-pink/20 px-3 py-1 text-xs text-pink">内存管理</span>
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
