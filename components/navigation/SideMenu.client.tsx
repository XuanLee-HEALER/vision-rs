'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavSection } from '@/features/learn';

interface SideMenuClientProps {
  navigation: NavSection[];
}

export default function SideMenuClient({ navigation }: SideMenuClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [topPosition, setTopPosition] = useState(56);
  const [height, setHeight] = useState('calc(100vh - 56px)');

  // 监听 banner 位置变化
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const updatePosition = () => {
      const rect = header.getBoundingClientRect();
      const bannerBottom = rect.bottom;

      if (bannerBottom > 0) {
        setTopPosition(bannerBottom);
        setHeight(`calc(100vh - ${bannerBottom}px)`);
      } else {
        setTopPosition(0);
        setHeight('100vh');
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  // 监听自定义事件
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggleSideMenu', handleToggle);
    return () => window.removeEventListener('toggleSideMenu', handleToggle);
  }, []);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-base/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu */}
      <aside
        style={{ top: `${topPosition}px`, height }}
        className={`
          fixed left-0 z-50 w-70
          border-r border-overlay0/10 bg-mantle/95 backdrop-blur-xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="h-full overflow-y-auto scrollbar-none p-6">
          {navigation.map((section) => (
            <div key={section.title} className="mb-8">
              {/* Section Title */}
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-subtext0">
                {section.title}
              </h3>

              {/* Simple Items */}
              {section.items && (
                <ul className="space-y-1 border-l border-overlay0/30">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`
                            -ml-px block border-l-2 py-2 pl-4 text-sm transition-colors
                            ${
                              isActive
                                ? 'border-blue text-text font-medium'
                                : 'border-transparent text-subtext0 hover:text-text'
                            }
                          `}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Subsections */}
              {section.subsections?.map((subsection) => (
                <div key={subsection.name} className="mt-4">
                  <h4 className="mb-2 text-xs font-medium text-overlay2 uppercase tracking-wider pl-4">
                    {subsection.name}
                  </h4>
                  <ul className="space-y-1 border-l border-overlay0/30">
                    {subsection.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`
                              -ml-px block border-l-2 py-2 pl-4 text-sm transition-colors
                              ${
                                isActive
                                  ? 'border-blue text-text font-medium'
                                  : 'border-transparent text-subtext0 hover:text-text'
                              }
                            `}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
