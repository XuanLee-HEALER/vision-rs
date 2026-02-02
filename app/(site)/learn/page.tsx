'use client';

import { useRouter } from 'next/navigation';
import learnIndex from './_index.generated.json';

export default function LearnIndexPage() {
  const router = useRouter();

  // 按照左侧菜单的顺序排列
  const orderedTopics = [
    'rust-philosophy',
    'rust-stdlib',
    'third-party-libs',
    'data-structures',
    'network-protocols',
    'distributed-systems',
  ];

  const sortedIndex = [...learnIndex].sort((a, b) => {
    const aOrder = orderedTopics.indexOf(a.category);
    const bOrder = orderedTopics.indexOf(b.category);
    return aOrder - bOrder;
  });

  return (
    <div className="min-h-screen bg-base text-text py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rust via-peach to-yellow bg-clip-text text-transparent">
            学习 Rust
          </div>
          <p className="text-lg text-subtext0">通过图形化界面深入理解 Rust 核心概念</p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedIndex.map((item) => (
            <button
              key={item.slug}
              onClick={() => router.push(`/${item.slug}`)}
              className="group relative bg-surface0 rounded-xl p-6 text-left transition-all duration-200 hover:bg-surface1 hover:scale-[1.02] cursor-pointer border border-surface1 hover:border-lavender"
            >
              <div className="text-xl font-semibold mb-3 text-text group-hover:text-lavender transition-colors">
                {item.title.replace(' - Vision-RS', '')}
              </div>
              <p className="text-sm text-subtext0 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
