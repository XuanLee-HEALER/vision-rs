export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-text">
          Vision-<span className="text-blue">RS</span>
        </h1>
        <p className="text-xl text-subtext1 max-w-2xl">
          通过图文并茂的方式深入学习 Rust 编程语言
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a
            href="/learn"
            className="px-6 py-3 bg-blue text-crust rounded-lg font-semibold hover:bg-lavender transition-colors"
          >
            开始学习
          </a>
          <a
            href="https://github.com/XuanLee-HEALER/vision-rs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-surface0 text-text rounded-lg font-semibold hover:bg-surface1 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
