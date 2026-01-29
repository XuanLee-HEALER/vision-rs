'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    // Extract headings from the page
    const headings = Array.from(document.querySelectorAll('h2, h3, h4')) as HTMLHeadingElement[];

    const tocItems: TocItem[] = headings.map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
    }));

    setToc(tocItems);

    // Observe which heading is in view
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
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => {
      headings.forEach((heading) => {
        if (heading.id) {
          observer.unobserve(heading);
        }
      });
    };
  }, [pathname]);

  if (toc.length === 0) return null;

  return (
    <aside className="hidden xl:block fixed right-0 top-0 h-screen w-72 border-l border-overlay0/30 bg-crust/30 backdrop-blur-sm">
      <div className="p-6 h-full overflow-y-auto scrollbar-none">
        <h3 className="text-sm font-bold text-text mb-4">目录</h3>
        <nav>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                <a
                  href={`#${item.id}`}
                  className={`
                    block text-xs py-1.5 px-3 rounded-md transition-all duration-200
                    ${
                      activeId === item.id
                        ? 'text-blue bg-blue/10 border-l-2 border-blue font-medium'
                        : 'text-subtext0 hover:text-text hover:bg-surface0'
                    }
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
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
