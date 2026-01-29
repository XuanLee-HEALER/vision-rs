'use client';

import { TocItem } from '@/features/learn';
import { useState, useEffect } from 'react';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // 获取所有标题元素
    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean);

    if (headings.length === 0) return;

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

    headings.forEach((heading) => {
      if (heading) observer.observe(heading);
    });

    return () => {
      headings.forEach((heading) => {
        if (heading) observer.unobserve(heading);
      });
    };
  }, [items]);

  if (items.length === 0) return null;

  const renderTocItem = (item: TocItem) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.id}>
        <a
          href={`#${item.id}`}
          className={`
            block transition-colors py-1
            ${item.level === 3 ? 'pl-3' : ''}
            ${isActive ? 'text-blue font-medium' : 'text-subtext0 hover:text-text'}
          `}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
        >
          {item.text}
        </a>
        {hasChildren && (
          <ul className="space-y-1">{item.children!.map((child) => renderTocItem(child))}</ul>
        )}
      </li>
    );
  };

  return <ul className="space-y-2 text-sm">{items.map((item) => renderTocItem(item))}</ul>;
}
