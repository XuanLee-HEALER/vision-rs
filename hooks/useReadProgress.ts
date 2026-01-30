'use client';
import { useState } from 'react';
import { useScrollManager } from './useScrollManager';

export function useReadProgress() {
  const [progress, setProgress] = useState(0);

  useScrollManager((scrollY) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const newProgress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
    setProgress(Math.min(100, Math.max(0, newProgress)));
  });

  return progress;
}
