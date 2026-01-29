'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { navigationData } from '@/lib/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function SmartNavigation() {
  const pathname = usePathname();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useLocalStorage<Record<string, number>>(
    'vision-rs-progress',
    {}
  );

  useEffect(() => {
    // Track reading progress
    const updateProgress = () => {
      if (!pathname) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? Math.min(100, (scrolled / scrollHeight) * 100) : 0;

      if (progress > (readProgress[pathname] || 0)) {
        setReadProgress((prev) => ({
          ...prev,
          [pathname]: Math.round(progress),
        }));
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, [pathname, readProgress, setReadProgress]);

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-56 bg-crust/80 backdrop-blur-xl border-r border-overlay0/30 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-overlay0/30 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue to-mauve flex items-center justify-center text-2xl font-bold text-base group-hover:scale-110 transition-transform duration-300">
            V
          </div>
          <div className="text-sm">
            <div className="font-bold text-text">Vision-RS</div>
            <div className="text-xs text-subtext0">Rust 深度学习</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-6">
        {navigationData.map((section) => {
          const isHovered = hoveredSection === section.title;
          const hasActiveItem = section.items?.some((item) => item.href === pathname);

          return (
            <div
              key={section.title}
              onMouseEnter={() => setHoveredSection(section.title)}
              onMouseLeave={() => setHoveredSection(null)}
              className="relative"
            >
              {/* Section Header */}
              <div
                className={`
                  flex items-center gap-2 mb-2 p-2 rounded-lg
                  transition-all duration-300
                  ${hasActiveItem ? 'bg-surface0/50' : isHovered ? 'bg-surface0/30' : ''}
                `}
              >
                <span
                  className={`text-base transition-transform duration-300 ${
                    isHovered ? 'scale-125' : ''
                  }`}
                >
                  {section.icon}
                </span>
                <h3 className="text-xs font-bold text-text/80">{section.title}</h3>
              </div>

              {/* Items with Progress */}
              <div
                className={`
                  space-y-1 overflow-hidden transition-all duration-300
                  ${isHovered || hasActiveItem ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                {section.items?.map((item, index) => {
                  const active = isActive(item.href);
                  const progress = readProgress[item.href] || 0;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group flex items-center gap-2 px-3 py-2 rounded-md
                        transition-all duration-200
                        ${
                          active
                            ? 'bg-blue/20 text-blue translate-x-2'
                            : 'text-subtext1 hover:bg-surface1 hover:text-text hover:translate-x-1'
                        }
                      `}
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      {/* Progress Ring */}
                      <svg className="w-4 h-4 -rotate-90 flex-shrink-0">
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          opacity="0.2"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray={`${(progress / 100) * 37.7} 37.7`}
                          className={active ? 'animate-draw-circle' : ''}
                          style={{
                            transition: 'stroke-dasharray 0.3s ease',
                          }}
                        />
                      </svg>

                      <span className="text-xs flex-1 truncate">{item.title}</span>

                      {/* Active Indicator with Breathing Animation */}
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse-glow flex-shrink-0" />
                      )}
                    </Link>
                  );
                })}

                {/* Subsections */}
                {section.subsections?.map((subsection) => (
                  <div key={subsection.name} className="mt-3">
                    <div className="text-xs text-subtext0 px-3 py-1 font-medium">
                      {subsection.name}
                    </div>
                    {subsection.items.map((item, index) => {
                      const active = isActive(item.href);
                      const progress = readProgress[item.href] || 0;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            group flex items-center gap-2 px-3 py-2 rounded-md
                            transition-all duration-200
                            ${
                              active
                                ? 'bg-blue/20 text-blue translate-x-2'
                                : 'text-subtext1 hover:bg-surface1 hover:text-text hover:translate-x-1'
                            }
                          `}
                          style={{ transitionDelay: `${index * 30}ms` }}
                        >
                          <svg className="w-4 h-4 -rotate-90 flex-shrink-0">
                            <circle
                              cx="8"
                              cy="8"
                              r="6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              opacity="0.2"
                            />
                            <circle
                              cx="8"
                              cy="8"
                              r="6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeDasharray={`${(progress / 100) * 37.7} 37.7`}
                              className={active ? 'animate-draw-circle' : ''}
                              style={{
                                transition: 'stroke-dasharray 0.3s ease',
                              }}
                            />
                          </svg>

                          <span className="text-xs flex-1 truncate">{item.title}</span>

                          {active && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse-glow flex-shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-overlay0/30 flex-shrink-0">
        <a
          href="https://github.com/XuanLee-HEALER/vision-rs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-xs text-subtext0 hover:text-text hover:bg-surface0 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </aside>
  );
}
