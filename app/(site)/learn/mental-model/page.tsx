import Link from 'next/link';
import { MENTAL_MODEL_CONFIG } from '@/features/learn/mental-model-config';

export const metadata = {
  title: 'Rust 心智世界 - Vision-RS',
  description: '把 Rust 从规范文本转化为可被人类长期内化的语言模型',
};

export default function MentalModelIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <header className="mb-12 border-b border-overlay0/30 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-text">Rust 心智世界</h1>
        <p className="text-lg leading-relaxed text-subtext1">
          把 Rust 从「规范文本」→「可被人类长期内化的语言模型」
        </p>
      </header>

      {/* Reference Links */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">核心参考资料</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://doc.rust-lang.org/book/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">The Rust Book</h3>
            <p className="text-sm text-subtext0">官方教程，Rust 学习的起点</p>
          </a>
          <a
            href="https://doc.rust-lang.org/reference/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-colors hover:border-blue hover:bg-surface0/50"
          >
            <h3 className="mb-2 text-lg font-semibold text-blue">The Rust Reference</h3>
            <p className="text-sm text-subtext0">语言规范，本系列的信源锚点</p>
          </a>
        </div>
      </section>

      {/* Acknowledgments */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text">鸣谢</h2>
        <div className="rounded-lg border border-overlay0/30 bg-surface0/30 p-6">
          <p className="mb-3 leading-relaxed text-subtext1">
            感谢 Rust 语言的创造者和主要贡献者们，他们的工作让系统编程进入了新的纪元：
          </p>
          <ul className="space-y-2 text-sm text-subtext0">
            <li>
              <strong className="text-text">Graydon Hoare</strong> - Rust 语言的原始设计者
            </li>
            <li>
              <strong className="text-text">Rust Core Team</strong> - 语言设计与发展的核心团队
            </li>
            <li>
              <strong className="text-text">Rust Community</strong> - 庞大而活跃的社区贡献者
            </li>
          </ul>
        </div>
      </section>

      {/* Part List */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-text">系列内容</h2>
        <div className="space-y-4">
          {MENTAL_MODEL_CONFIG.map((part) => (
            <Link
              key={part.id}
              href={`/learn/mental-model/${part.slug}`}
              className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-6 transition-all hover:border-blue hover:bg-surface0/50"
            >
              <h3 className="mb-2 text-lg font-semibold text-text">{part.title}</h3>
              <p className="text-sm text-subtext0">{part.description}</p>
              <div className="mt-3 text-xs text-overlay2">{part.chapters.length} 个章节</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
