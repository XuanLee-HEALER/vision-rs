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
    <>
      <style>{`
        @keyframes text-shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .topic-text {
          color: #cad3f5;
        }
        .topic-button:hover .topic-text {
          background: linear-gradient(
            90deg,
            #cad3f5 20%,
            #b7bdf8 35%,
            #c6a0f6 50%,
            #b7bdf8 65%,
            #cad3f5 80%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shine 2.5s linear infinite;
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }
      `}</style>
      <div className="min-h-screen bg-base text-text py-16">
        <div className="max-w-6xl mx-auto pl-[33.33%]">
          {/* Topic List */}
          <ul className="space-y-3 list-none">
            {sortedIndex.map((item) => (
              <li key={item.slug}>
                <button
                  onClick={() => router.push(`/${item.slug}`)}
                  className="topic-button group text-2xl cursor-pointer relative block w-fit whitespace-nowrap"
                >
                  <span className="topic-text relative inline-block">
                    {item.title.replace(' - Vision-RS', '')}
                  </span>
                  {/* 下划线 */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lavender transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
