'use client';

export default function MenuButton() {
  const handleClick = () => {
    const event = new CustomEvent('toggleSideMenu');
    window.dispatchEvent(event);
  };

  return (
    <button
      className="fixed left-6 top-20 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-overlay0/30 bg-surface0/80 backdrop-blur-sm transition-colors hover:border-overlay0/50 hover:bg-surface0"
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
