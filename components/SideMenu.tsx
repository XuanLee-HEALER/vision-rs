'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 导航数据结构
const navigationData = [
  {
    title: '语言概念',
    items: [
      { title: '所有权系统', href: '/learn/concepts/ownership' },
      { title: '借用与引用', href: '/learn/concepts/borrowing' },
      { title: '生命周期', href: '/learn/concepts/lifetime' },
    ],
  },
  {
    title: '数据结构',
    items: [
      { title: 'Vec<T>', href: '/learn/data-structures/vec' },
      { title: 'HashMap', href: '/learn/data-structures/hashmap' },
      { title: 'String', href: '/learn/data-structures/string' },
    ],
  },
  {
    title: '三方库原理',
    items: [
      { title: 'Tokio', href: '/learn/libraries/tokio' },
      { title: 'Serde', href: '/learn/libraries/serde' },
    ],
  },
  {
    title: '网络编程 & 分布式',
    items: [
      { title: 'TCP/UDP', href: '/learn/networking/tcp-udp' },
      { title: 'HTTP', href: '/learn/networking/http' },
    ],
  },
];

export default function SideMenu() {
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
          {navigationData.map((section) => (
            <div key={section.title} className="mb-8">
              {/* Section Title */}
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-subtext0">
                {section.title}
              </h3>

              {/* Links */}
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
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
