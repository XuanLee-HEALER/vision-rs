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
        className={`
          fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-70
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
