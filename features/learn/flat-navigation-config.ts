export interface LearnSection {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  color: 'blue' | 'green' | 'mauve' | 'peach' | 'yellow' | 'teal';
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
}

export const FLAT_LEARN_CONFIG: LearnSection[] = [
  {
    id: 'rust-philosophy',
    title: 'Rust 设计哲学',
    slug: 'rust-philosophy',
    description: '所有权、生命周期、零成本抽象等核心理念',
    icon: '🧠',
    order: 1,
    color: 'blue',
  },
  {
    id: 'rust-stdlib',
    title: 'Rust 标准库',
    slug: 'rust-stdlib',
    description: 'core/alloc/std 分层、内存管理、并发原语',
    icon: '📚',
    order: 2,
    color: 'green',
  },
  {
    id: 'third-party-libs',
    title: '第三方库解析',
    slug: 'third-party-libs',
    description: 'Tokio、Serde、Future 生态等深度解析',
    icon: '🔧',
    order: 3,
    color: 'mauve',
  },
  {
    id: 'data-structures',
    title: '数据结构',
    slug: 'data-structures',
    description: '内存布局、所有权绑定、工程视角',
    icon: '📦',
    order: 4,
    color: 'peach',
  },
  {
    id: 'network-protocols',
    title: '网络协议',
    slug: 'network-protocols',
    description: '协议语义、实现层关键问题、工程落地',
    icon: '🌐',
    order: 5,
    color: 'yellow',
  },
  {
    id: 'distributed-systems',
    title: '分布式系统',
    slug: 'distributed-systems',
    description: '一致性、可靠性、工程权衡',
    icon: '🔄',
    order: 6,
    color: 'teal',
  },
];

export function getSectionBySlug(slug: string): LearnSection | undefined {
  return FLAT_LEARN_CONFIG.find((section) => section.slug === slug);
}

export function getAllSections(): LearnSection[] {
  return [...FLAT_LEARN_CONFIG].sort((a, b) => a.order - b.order);
}
