'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavSection, NavItem } from '@/features/learn';
import { useState } from 'react';
import { useScrollManager } from '@/hooks/useScrollManager';

interface NavigationMenuProps {
  navigation: NavSection[];
  variant: 'sidebar' | 'mobile';
  isOpen?: boolean;
  onClose?: () => void;
}

export default function NavigationMenu({
  navigation,
  variant,
  isOpen = true,
  onClose,
}: NavigationMenuProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    语言概念: true,
    数据结构: true,
    三方库原理: false,
    '网络编程 & 分布式': false,
  });
  const [topPosition, setTopPosition] = useState(56);
  const [height, setHeight] = useState('calc(100vh - 56px)');

  useScrollManager((scrollY, headerBottom) => {
    if (headerBottom > 0) {
      setTopPosition(headerBottom);
      setHeight(`calc(100vh - ${headerBottom}px)`);
    } else {
      setTopPosition(0);
      setHeight('100vh');
    }
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => pathname === href;

  const handleLinkClick = () => {
    if (variant === 'mobile' && onClose) {
      onClose();
    }
  };

  const baseClass =
    variant === 'sidebar'
      ? 'fixed left-0 w-72 bg-crust border-r border-overlay0 overflow-y-auto'
      : 'fixed left-0 z-50 w-70 border-r border-overlay0/10 bg-mantle/95 backdrop-blur-xl overflow-y-auto';

  const transformClass = variant === 'mobile' && !isOpen ? '-translate-x-full' : 'translate-x-0';

  const transitionClass =
    variant === 'mobile' ? 'transform transition-transform duration-300 ease-out' : '';

  return (
    <aside
      style={{ top: `${topPosition}px`, height }}
      className={`${baseClass} ${transformClass} ${transitionClass}`}
    >
      <nav className={variant === 'sidebar' ? 'p-6 space-y-8' : 'h-full p-6'}>
        {variant === 'sidebar' ? (
          // Sidebar 样式 (桌面端)
          <>
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
                      <NavLink
                        key={item.href}
                        item={item}
                        isActive={isActive(item.href)}
                        variant="sidebar"
                        onClick={handleLinkClick}
                      />
                    ))}

                    {/* Subsections */}
                    {section.subsections?.map((subsection) => (
                      <div key={subsection.name} className="mt-4 first:mt-0">
                        <div className="text-xs font-semibold text-overlay2 uppercase tracking-wider mb-2 px-3">
                          {subsection.name}
                        </div>
                        <div className="space-y-1">
                          {subsection.items.map((item) => (
                            <NavLink
                              key={item.href}
                              item={item}
                              isActive={isActive(item.href)}
                              variant="sidebar"
                              onClick={handleLinkClick}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          // Mobile 样式
          <>
            {navigation.map((section) => (
              <div key={section.title} className="mb-8">
                {/* Section Title */}
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-subtext0">
                  {section.title}
                </h3>

                {/* Simple Items */}
                {section.items && (
                  <ul className="space-y-1 border-l border-overlay0/30">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          item={item}
                          isActive={isActive(item.href)}
                          variant="mobile"
                          onClick={handleLinkClick}
                        />
                      </li>
                    ))}
                  </ul>
                )}

                {/* Subsections */}
                {section.subsections?.map((subsection) => (
                  <div key={subsection.name} className="mt-4">
                    <h4 className="mb-2 text-xs font-medium text-overlay2 uppercase tracking-wider pl-4">
                      {subsection.name}
                    </h4>
                    <ul className="space-y-1 border-l border-overlay0/30">
                      {subsection.items.map((item) => (
                        <li key={item.href}>
                          <NavLink
                            item={item}
                            isActive={isActive(item.href)}
                            variant="mobile"
                            onClick={handleLinkClick}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  variant: 'sidebar' | 'mobile';
  onClick?: () => void;
}

function NavLink({ item, isActive, variant, onClick }: NavLinkProps) {
  if (variant === 'sidebar') {
    return (
      <Link
        href={item.href}
        onClick={onClick}
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

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        -ml-px block border-l-2 py-2 pl-4 text-sm transition-colors
        ${
          isActive
            ? 'border-blue text-text font-medium'
            : 'border-transparent text-subtext0 hover:text-text'
        }
      `}
    >
      {item.title}
    </Link>
  );
}
