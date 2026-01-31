import LearnLayout from '@/components/layout/LearnLayout';
import Link from 'next/link';
import { getBatchVisibility } from '@/lib/visibility';

interface PathCard {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: 'blue' | 'green' | 'mauve' | 'peach' | 'yellow' | 'red' | 'teal' | 'pink';
}

// All learning path cards (will be filtered by visibility)
const ALL_CARDS: PathCard[] = [
  {
    icon: '🔤',
    title: '语言概念',
    description: '深入理解 Rust 的核心语言特性，包括所有权、借用、生命周期等',
    href: '/learn/concepts/ownership',
    color: 'blue',
  },
  {
    icon: '📦',
    title: '数据结构',
    description: '学习 Rust 标准库提供的数据结构，以及如何实现自定义数据结构',
    href: '/learn/data-structures/vec',
    color: 'green',
  },
  {
    icon: '🔧',
    title: '三方库原理',
    description: '深入剖析 Tokio、Serde、Actix 等热门库的设计哲学',
    href: '/learn/crates/tokio',
    color: 'mauve',
  },
  {
    icon: '🌐',
    title: '网络编程 & 分布式',
    description: '探索网络编程、分布式系统、共识算法等高级主题',
    href: '/learn/network/tcp-udp',
    color: 'peach',
  },
];

export default async function LearnPage() {
  // Filter cards based on visibility
  const visibleCards = await filterVisibleCards(ALL_CARDS);

  return (
    <LearnLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-text mb-4">开始学习 Rust</h1>
          <p className="text-xl text-subtext1">
            通过图文并茂的方式，深入理解 Rust 编程语言的核心概念
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-12">
          {visibleCards.map((card) => (
            <LearningPathCard key={card.href} {...card} />
          ))}
        </div>

        <div className="mt-16 p-6 bg-surface0 rounded-lg border border-overlay0">
          <h2 className="text-2xl font-semibold text-text mb-4">💡 学习建议</h2>
          <ul className="space-y-2 text-subtext1">
            <li>
              • 如果你是 Rust 新手，建议从<strong className="text-text">语言概念</strong>开始
            </li>
            <li>• 每个主题都包含详细的代码示例和可视化图表</li>
            <li>• 点击左侧导航栏可以快速跳转到感兴趣的内容</li>
            <li>• 遇到不理解的概念，可以多看几遍代码示例</li>
          </ul>
        </div>
      </div>
    </LearnLayout>
  );
}

/**
 * Filter cards based on visibility settings
 * Fail-open: if KV not configured or query fails, show all cards
 */
async function filterVisibleCards(cards: PathCard[]): Promise<PathCard[]> {
  // Check if KV is configured
  const kvConfigured = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

  if (!kvConfigured) {
    return cards;
  }

  try {
    // Convert hrefs to slugs
    const slugs = cards.map((card) => card.href.replace(/^\//, ''));

    // Get visibility status
    const visibilityMap = await getBatchVisibility(slugs);

    // Filter visible cards
    return cards.filter((card) => {
      const slug = card.href.replace(/^\//, '');
      return visibilityMap[slug] !== false;
    });
  } catch (error) {
    console.error('Error filtering cards:', error);
    // Fail-open - show all cards on error
    return cards;
  }
}

interface LearningPathCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: 'blue' | 'green' | 'mauve' | 'peach' | 'yellow' | 'red' | 'teal' | 'pink';
}

// Tailwind 完整 class 名称映射（避免动态拼接导致生产环境样式缺失）
const colorClasses: Record<LearningPathCardProps['color'], string> = {
  blue: 'text-blue',
  green: 'text-green',
  mauve: 'text-mauve',
  peach: 'text-peach',
  yellow: 'text-yellow',
  red: 'text-red',
  teal: 'text-teal',
  pink: 'text-pink',
};

function LearningPathCard({ icon, title, description, href, color }: LearningPathCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 bg-surface0 rounded-lg border border-overlay0 hover:border-blue hover:bg-surface1 transition-all group"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3
        className={`text-xl font-semibold ${colorClasses[color]} mb-2 group-hover:text-lavender transition-colors`}
      >
        {title}
      </h3>
      <p className="text-subtext1 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}
