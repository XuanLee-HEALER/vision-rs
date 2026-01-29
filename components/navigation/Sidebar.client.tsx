'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavSection, NavItem } from '@/features/learn';
import { useState, useEffect } from 'react';

interface SidebarClientProps {
  navigation: NavSection[];
}

export default function SidebarClient({ navigation }: SidebarClientProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    语言概念: true,
    数据结构: true,
    三方库原理: false,
    '网络编程 & 分布式': false,
  });
  const [topPosition, setTopPosition] = useState(0);
  const [height, setHeight] = useState('100vh');

  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const updatePosition = () => {
      const rect = header.getBoundingClientRect();
      const bannerBottom = rect.bottom;

      if (bannerBottom > 0) {
        // Banner 可见，Sidebar 从 Banner 下方开始
        setTopPosition(bannerBottom);
        setHeight(`calc(100vh - ${bannerBottom}px)`);
      } else {
        // Banner 不可见，Sidebar 占满视窗
        setTopPosition(0);
        setHeight('100vh');
      }
    };

    // 初始化
    updatePosition();

    // 监听滚动
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      style={{ top: `${topPosition}px`, height }}
      className="fixed left-0 w-72 bg-crust border-r border-overlay0 overflow-y-auto"
    >
      <nav className="p-6 space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <h3 className="text-base font-bold text-text group-hover:text-blue transition-colors">
                  {section.title}
                </h3>
              </div>
              <svg
                className={`w-4 h-4 text-overlay2 transition-transform ${
                  openSections[section.title] ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Section Content */}
            {openSections[section.title] && (
              <div className="space-y-1">
                {/* Simple items */}
                {section.items?.map((item) => (
                  <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
                ))}

                {/* Subsections */}
                {section.subsections?.map((subsection) => (
                  <div key={subsection.name} className="mt-4 first:mt-0">
                    <div className="text-xs font-semibold text-overlay2 uppercase tracking-wider mb-2 px-3">
                      {subsection.name}
                    </div>
                    <div className="space-y-1">
                      {subsection.items.map((item) => (
                        <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`
        block px-3 py-2 rounded-md text-sm transition-all duration-200
        ${
          isActive
            ? 'bg-surface1 text-blue font-medium border-l-3 border-blue'
            : 'text-subtext1 hover:bg-surface0 hover:text-blue'
        }
      `}
    >
      {item.title}
    </Link>
  );
}
