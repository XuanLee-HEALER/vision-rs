import Link from 'next/link';

export default function Home() {
  const articles = [
    { title: 'Rust 所有权系统详解', href: '/learn/concepts/ownership' },
    { title: 'Vec<T> 动态数组实现原理', href: '/learn/data-structures/vec' },
    { title: 'Tokio 异步运行时深入解析', href: '/learn/crates/tokio' },
  ];

  return (
    <div className="mx-auto max-w-2xl py-16">
      <h1 className="mb-12 text-4xl font-medium text-text">Vision-RS</h1>
      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="block border-l-2 border-transparent pl-4 text-xl text-subtext1 transition-colors hover:border-blue hover:text-text"
          >
            {article.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
