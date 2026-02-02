import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="text-center">
        {/* 404 大标题 */}
        <div className="mb-8">
          <h1 className="font-mono text-9xl font-bold text-mauve">404</h1>
          <div className="mt-2 font-mono text-sm text-overlay2">error[E0404]: page not found</div>
        </div>

        {/* Rust 风格的错误信息 */}
        <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-surface2 bg-mantle p-6 text-left font-mono text-sm">
          <div className="mb-2 text-red">error: cannot find page in scope</div>
          <div className="mb-4 text-subtext0">
            <span className="text-blue"> --&gt;</span> /requested/path
          </div>
          <div className="mb-2 text-overlay2">
            <span className="text-yellow">help:</span> consider one of these paths instead:
          </div>
          <div className="space-y-1 pl-4 text-green">
            <div>• /learn - 开始学习 Rust</div>
            <div>• /learn/rust-philosophy - Rust 设计哲学</div>
            <div>• /learn/rust-stdlib - 标准库探索</div>
          </div>
        </div>

        {/* 幽默文案 */}
        <p className="mb-8 text-lg text-text">
          看起来这个页面已经被 <span className="font-mono text-mauve">drop()</span> 了 🦀
        </p>

        {/* 导航按钮 */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/learn"
            className="rounded-lg bg-mauve px-6 py-3 font-medium text-base transition-colors hover:bg-mauve/80"
          >
            返回学习首页
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-surface2 px-6 py-3 font-medium text-text transition-colors hover:bg-surface0"
          >
            回到主页
          </Link>
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-sm text-overlay1">
          如果你认为这是一个错误，请{' '}
          <a
            href="https://github.com/your-repo/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue underline hover:text-sapphire"
          >
            提交问题
          </a>
        </div>
      </div>
    </div>
  );
}
