import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPartBySlug, MENTAL_MODEL_CONFIG } from '@/features/learn/mental-model-config';

interface PartPageProps {
  params: {
    partSlug: string;
  };
}

export async function generateStaticParams() {
  return MENTAL_MODEL_CONFIG.map((part) => ({
    partSlug: part.slug,
  }));
}

export async function generateMetadata({ params }: PartPageProps) {
  const part = getPartBySlug(params.partSlug);

  if (!part) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${part.title} - Rust 心智世界`,
    description: part.description,
  };
}

export default function PartPage({ params }: PartPageProps) {
  const part = getPartBySlug(params.partSlug);

  if (!part) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-subtext0">
        <Link href="/learn/mental-model" className="hover:text-blue">
          Rust 心智世界
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text">{part.title}</span>
      </nav>

      {/* Part Header */}
      <header className="mb-12 border-b border-overlay0/30 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-text">{part.title}</h1>
        <p className="text-lg leading-relaxed text-subtext1">{part.description}</p>
      </header>

      {/* Part Overview */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-text">概览</h2>
        <div className="prose prose-invert max-w-none">
          <p className="leading-relaxed text-subtext1">
            本部分将系统性地探讨 Rust 的核心概念，通过严谨的分析和详实的示例，
            帮助读者建立对这一主题的深入理解。
          </p>
        </div>
      </section>

      {/* Chapter List */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-text">章节</h2>
        <div className="space-y-3">
          {part.chapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/learn/mental-model/${part.slug}/${chapter.slug}`}
              className="block rounded-lg border border-overlay0/30 bg-surface0/30 p-5 transition-all hover:border-blue hover:bg-surface0/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface1 text-sm font-semibold text-blue">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-text">{chapter.title}</h3>
                  {chapter.referenceLinks && chapter.referenceLinks.length > 0 && (
                    <div className="mt-2 text-xs text-overlay2">参考：The Rust Reference</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <nav className="mt-12 flex items-center justify-between border-t border-overlay0/30 pt-8">
        <Link
          href="/learn/mental-model"
          className="text-sm text-subtext0 transition-colors hover:text-blue"
        >
          ← 返回目录
        </Link>
      </nav>
    </div>
  );
}
