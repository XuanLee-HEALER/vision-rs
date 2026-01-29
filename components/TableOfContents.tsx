'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // 提取 h2 标题
    const h2s = Array.from(document.querySelectorAll('h2'));
    const tocItems = h2s.map((h, index) => {
      // 生成唯一 ID
      const baseId = h.id || h.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      const uniqueId = h.id || `${baseId}-${index}`;

      // 设置 ID
      if (!h.id) {
        h.id = uniqueId;
      }

      return {
        id: uniqueId,
        text: h.textContent || '',
      };
    });

    setHeadings(tocItems);

    // Intersection Observer 自动高亮
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    h2s.forEach((h) => {
      if (h.id) observer.observe(h);
    });

    return () => {
      h2s.forEach((h) => {
        if (h.id) observer.unobserve(h);
      });
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            className={`
              block transition-colors
              ${activeId === h.id ? 'text-blue font-medium' : 'text-subtext0 hover:text-text'}
            `}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
