/**
 * Rust 心智世界 - 完整内容结构配置
 * 基于 docs/PART1.md 的大纲
 */

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  referenceLinks?: string[];
}

export interface Part {
  id: string;
  title: string;
  slug: string;
  description: string;
  chapters: Chapter[];
}

export const MENTAL_MODEL_CONFIG: Part[] = [
  {
    id: 'part-0',
    title: 'Part 0 · 如何"正确地理解 Rust 规范"',
    slug: 'part-0-meta',
    description: 'Meta 篇 - 理解 Rust Reference 在语言体系中的地位',
    chapters: [
      {
        id: '0-1',
        title: '0.1 Rust Reference 在语言体系中的地位',
        slug: '0-1-reference-position',
        referenceLinks: ['https://doc.rust-lang.org/reference/'],
      },
    ],
  },
  {
    id: 'part-1',
    title: 'Part 1 · Rust 程序的"静态世界"总览',
    slug: 'part-1-static-world',
    description: '让读者在脑中先建立编译期宇宙',
    chapters: [
      {
        id: '1-1',
        title: '1.1 Rust 程序由什么构成',
        slug: '1-1-crates-items',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/items.html',
          'https://doc.rust-lang.org/reference/crates-and-source-files.html',
        ],
      },
      {
        id: '1-2',
        title: '1.2 命名空间、路径与可见性',
        slug: '1-2-namespaces-paths-visibility',
      },
    ],
  },
  {
    id: 'part-2',
    title: 'Part 2 · 表达式模型：Rust 为什么"不是 C++"',
    slug: 'part-2-expression-model',
    description: '理解 Rust 的表达式导向设计',
    chapters: [
      {
        id: '2-1',
        title: '2.1 表达式导向语言的真正含义',
        slug: '2-1-expression-oriented',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/expressions.html',
          'https://doc.rust-lang.org/reference/statements.html',
        ],
      },
      {
        id: '2-2',
        title: '2.2 控制流 ≠ 流程控制',
        slug: '2-2-control-flow',
      },
    ],
  },
  {
    id: 'part-3',
    title: 'Part 3 · 类型系统不是"类型"，而是"约束集合"',
    slug: 'part-3-type-system',
    description: '理解 Rust 类型系统的真正职责',
    chapters: [
      {
        id: '3-1',
        title: '3.1 Rust 类型系统的真正职责',
        slug: '3-1-type-responsibility',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/types.html',
          'https://doc.rust-lang.org/reference/trait-bounds.html',
        ],
      },
      {
        id: '3-2',
        title: '3.2 特殊类型与边界类型',
        slug: '3-2-special-types',
      },
    ],
  },
  {
    id: 'part-4',
    title: 'Part 4 · 所有权模型',
    slug: 'part-4-ownership',
    description: '不是内存管理，而是语义管理',
    chapters: [
      {
        id: '4-1',
        title: '4.1 所有权的形式化语义',
        slug: '4-1-ownership-semantics',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/ownership.html',
          'https://doc.rust-lang.org/reference/destructors.html',
        ],
      },
      {
        id: '4-2',
        title: '4.2 Move / Copy / Borrow 的三态模型',
        slug: '4-2-move-copy-borrow',
      },
    ],
  },
  {
    id: 'part-5',
    title: 'Part 5 · 借用与生命周期：Rust 的"证明系统"',
    slug: 'part-5-borrowing-lifetimes',
    description: '理解借用检查器的真实目标',
    chapters: [
      {
        id: '5-1',
        title: '5.1 Borrow Checker 的真实目标',
        slug: '5-1-borrow-checker',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/references.html',
          'https://doc.rust-lang.org/reference/lifetimes.html',
        ],
      },
      {
        id: '5-2',
        title: '5.2 生命周期不是时间，是关系',
        slug: '5-2-lifetime-relations',
      },
      {
        id: '5-3',
        title: '5.3 高阶生命周期 (HRTB)',
        slug: '5-3-hrtb',
      },
    ],
  },
  {
    id: 'part-6',
    title: 'Part 6 · 模式系统：Rust 的"控制结构核心"',
    slug: 'part-6-patterns',
    description: 'Pattern 是一等公民',
    chapters: [
      {
        id: '6-1',
        title: '6.1 Pattern 是一等公民',
        slug: '6-1-patterns-first-class',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/patterns.html',
          'https://doc.rust-lang.org/reference/expressions/match-expr.html',
        ],
      },
      {
        id: '6-2',
        title: '6.2 穷尽性与可反驳性',
        slug: '6-2-exhaustiveness-refutability',
      },
    ],
  },
  {
    id: 'part-7',
    title: 'Part 7 · Trait 系统：Rust 抽象能力的根源',
    slug: 'part-7-traits',
    description: 'Trait 的三重身份',
    chapters: [
      {
        id: '7-1',
        title: '7.1 Trait 的三重身份',
        slug: '7-1-trait-three-roles',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/traits.html',
          'https://doc.rust-lang.org/reference/implementations.html',
        ],
      },
      {
        id: '7-2',
        title: '7.2 Impl、Coherence 与 Orphan Rule',
        slug: '7-2-coherence-orphan-rule',
      },
      {
        id: '7-3',
        title: '7.3 静态分发 vs 动态分发',
        slug: '7-3-static-dynamic-dispatch',
      },
    ],
  },
  {
    id: 'part-8',
    title: 'Part 8 · 泛型与单态化：零成本抽象的代价',
    slug: 'part-8-generics',
    description: '泛型代码如何变成机器码',
    chapters: [
      {
        id: '8-1',
        title: '8.1 泛型代码如何变成机器码',
        slug: '8-1-monomorphization',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/generics.html',
          'https://doc.rust-lang.org/reference/type-parameters.html',
        ],
      },
      {
        id: '8-2',
        title: '8.2 Associated Types vs 泛型参数',
        slug: '8-2-associated-types',
      },
    ],
  },
  {
    id: 'part-9',
    title: 'Part 9 · 内存模型与 Interior Mutability',
    slug: 'part-9-memory-model',
    description: 'Rust 的内存抽象层次',
    chapters: [
      {
        id: '9-1',
        title: '9.1 Rust 的内存抽象层次',
        slug: '9-1-memory-abstraction',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/memory-model.html',
          'https://doc.rust-lang.org/reference/interior-mutability.html',
        ],
      },
      {
        id: '9-2',
        title: '9.2 Interior Mutability 的合法性来源',
        slug: '9-2-interior-mutability',
      },
    ],
  },
  {
    id: 'part-10',
    title: 'Part 10 · 并发模型：类型系统防止数据竞争',
    slug: 'part-10-concurrency',
    description: 'Send / Sync 的真正语义',
    chapters: [
      {
        id: '10-1',
        title: '10.1 Send / Sync 的真正语义',
        slug: '10-1-send-sync',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/concurrency.html',
          'https://doc.rust-lang.org/reference/auto-traits.html',
        ],
      },
    ],
  },
  {
    id: 'part-11',
    title: 'Part 11 · Async / Future：语言级状态机生成',
    slug: 'part-11-async',
    description: 'async 的编译期展开模型',
    chapters: [
      {
        id: '11-1',
        title: '11.1 async 的编译期展开模型',
        slug: '11-1-async-desugaring',
        referenceLinks: [
          'https://doc.rust-lang.org/reference/async.html',
          'https://doc.rust-lang.org/reference/futures.html',
        ],
      },
      {
        id: '11-2',
        title: '11.2 Pin、自引用与不变量',
        slug: '11-2-pin-self-referential',
      },
    ],
  },
  {
    id: 'part-12',
    title: 'Part 12 · Unsafe Rust：责任的显式转移',
    slug: 'part-12-unsafe',
    description: 'Unsafe 能做什么，不能做什么',
    chapters: [
      {
        id: '12-1',
        title: '12.1 Unsafe 能做什么，不能做什么',
        slug: '12-1-unsafe-capabilities',
        referenceLinks: ['https://doc.rust-lang.org/reference/unsafe-code.html'],
      },
      {
        id: '12-2',
        title: '12.2 Safe Abstraction 的构建原则',
        slug: '12-2-safe-abstraction',
      },
    ],
  },
  {
    id: 'part-13',
    title: 'Part 13 · 宏与编译期元编程',
    slug: 'part-13-macros',
    description: 'Macro 的编译阶段位置',
    chapters: [
      {
        id: '13-1',
        title: '13.1 Macro 的编译阶段位置',
        slug: '13-1-macro-compilation',
        referenceLinks: ['https://doc.rust-lang.org/reference/macros.html'],
      },
      {
        id: '13-2',
        title: '13.2 宏 vs 泛型 vs const generics',
        slug: '13-2-macro-vs-generics',
      },
    ],
  },
  {
    id: 'part-14',
    title: 'Part 14 · 编译期 vs 运行期的最终分界',
    slug: 'part-14-compile-runtime',
    description: 'Rust 把什么问题前移到了编译期',
    chapters: [
      {
        id: '14-1',
        title: '14.1 Rust 把什么问题前移到了编译期',
        slug: '14-1-compile-time',
      },
      {
        id: '14-2',
        title: '14.2 哪些问题刻意留在运行期',
        slug: '14-2-runtime',
      },
    ],
  },
];

/**
 * 获取扁平化的章节列表（用于路由生成）
 */
export function getAllChapters() {
  return MENTAL_MODEL_CONFIG.flatMap((part) =>
    part.chapters.map((chapter) => ({
      ...chapter,
      partId: part.id,
      partTitle: part.title,
      partSlug: part.slug,
    }))
  );
}

/**
 * 根据 slug 查找 Part
 */
export function getPartBySlug(slug: string) {
  return MENTAL_MODEL_CONFIG.find((part) => part.slug === slug);
}

/**
 * 根据 slug 查找 Chapter
 */
export function getChapterBySlug(slug: string) {
  for (const part of MENTAL_MODEL_CONFIG) {
    const chapter = part.chapters.find((ch) => ch.slug === slug);
    if (chapter) {
      return {
        ...chapter,
        partId: part.id,
        partTitle: part.title,
        partSlug: part.slug,
      };
    }
  }
  return null;
}
