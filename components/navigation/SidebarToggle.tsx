'use client';

import { useState } from 'react';
import { useScrollManager } from '@/hooks/useScrollManager';
import { useSideMenu } from '@/contexts/SideMenuContext';

export default function SidebarToggle() {
  const [topPosition, setTopPosition] = useState(80); // 初始位置 (5rem = 80px)

  const SPACING = 24; // 按钮与 Banner 底部的间距 (1.5rem)
  const MIN_TOP = 16; // 按钮固定在顶部时的最小距离 (1rem)

  useScrollManager((scrollY, headerBottom) => {
    if (headerBottom >= SPACING) {
      // Banner 还在视口内，按钮跟随 Banner
      setTopPosition(headerBottom + SPACING);
    } else {
      // Banner 已滚出视口，按钮固定在顶部
      setTopPosition(MIN_TOP);
    }
  });

  const { toggle } = useSideMenu();

  return (
    <button
      style={{ top: `${topPosition}px` }}
      className="
        fixed left-6 z-40 flex h-10 w-10 items-center justify-center rounded-lg
        border border-overlay0/30 bg-surface0/80 backdrop-blur-sm
        hover:border-overlay0/50 hover:bg-surface0
      "
      aria-label="打开菜单"
      onClick={toggle}
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
