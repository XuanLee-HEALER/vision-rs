import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl px-8">
        {/* Hero */}
        <div className="space-y-4 animate-fade-in-up">
          <h1 className="text-6xl font-bold text-text">
            Vision-
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue via-lavender to-mauve">
              RS
            </span>
          </h1>
          <p className="text-xl text-subtext1">深入学习 Rust 编程语言</p>
        </div>

        {/* Features */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          style={{ animationDelay: '150ms' }}
        >
          <div className="p-6 bg-surface0/30 backdrop-blur-sm rounded-xl border border-overlay0/30 hover:bg-surface0/50 transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-3">🔤</div>
            <h3 className="text-lg font-bold text-text mb-2">语言概念</h3>
            <p className="text-sm text-subtext0">深入理解所有权、借用、生命周期等核心概念</p>
          </div>

          <div className="p-6 bg-surface0/30 backdrop-blur-sm rounded-xl border border-overlay0/30 hover:bg-surface0/50 transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-bold text-text mb-2">数据结构</h3>
            <p className="text-sm text-subtext0">标准库与自定义实现的完整解析</p>
          </div>

          <div className="p-6 bg-surface0/30 backdrop-blur-sm rounded-xl border border-overlay0/30 hover:bg-surface0/50 transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-bold text-text mb-2">实战应用</h3>
            <p className="text-sm text-subtext0">网络编程、分布式系统、三方库原理</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12" style={{ animationDelay: '300ms' }}>
          <Link
            href="/learn/concepts/ownership"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue to-mauve text-base font-medium rounded-xl hover:shadow-lg hover:shadow-blue/50 transition-all duration-300 hover:scale-105"
          >
            开始学习
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 pt-8 border-t border-overlay0/30">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-blue">60+</div>
              <div className="text-sm text-subtext0">学习章节</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-lavender">100+</div>
              <div className="text-sm text-subtext0">代码示例</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-mauve">∞</div>
              <div className="text-sm text-subtext0">持续更新</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
