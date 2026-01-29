'use client';
import { useReadProgress } from '@/hooks/useReadProgress';

export default function ScrollProgressBar() {
  const progress = useReadProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue via-lavender to-mauve transition-all duration-150 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
