'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 提取文章中的所有标题（h2, h3）
    const elements = Array.from(document.querySelectorAll('article h2, article h3'));

    const headingData: Heading[] = elements.map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName.charAt(1)),
    }));

    setHeadings(headingData);

    // 使用 Intersection Observer 监听标题可见性
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px', // 顶部留 80px，底部留 80% 视口高度
      threshold: 1.0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 hidden xl:block">
      <div className="space-y-2">
        <p className="font-semibold text-text mb-4">目录</p>
        <ul className="space-y-2 text-sm border-l-2 border-surface2">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const isH3 = heading.level === 3;

            return (
              <li
                key={heading.id}
                className={`
                  ${isH3 ? 'pl-6' : 'pl-3'}
                  -ml-px border-l-2 transition-colors
                  ${
                    isActive
                      ? 'border-mauve text-mauve'
                      : 'border-transparent text-subtext1 hover:text-text hover:border-overlay0'
                  }
                `}
              >
                <Link
                  href={`#${heading.id}`}
                  className="block py-1 leading-snug"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                >
                  {heading.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
