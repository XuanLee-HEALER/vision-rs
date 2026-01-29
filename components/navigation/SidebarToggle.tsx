'use client';

import { useEffect, useState } from 'react';

export default function SidebarToggle() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBannerVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(header);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    const event = new CustomEvent('toggleSideMenu');
    window.dispatchEvent(event);
  };

  return (
    <button
      className={`
        fixed left-6 z-40 flex h-10 w-10 items-center justify-center rounded-lg
        border border-overlay0/30 bg-surface0/80 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:border-overlay0/50 hover:bg-surface0
        ${isBannerVisible ? 'top-20' : 'top-4'}
      `}
      aria-label="打开菜单"
      onClick={handleClick}
    >
      <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
