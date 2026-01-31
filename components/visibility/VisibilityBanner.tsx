interface VisibilityBannerProps {
  visible: boolean;
  isAdmin?: boolean;
  className?: string;
}

/**
 * Banner to indicate content visibility status
 * Only shown when content is hidden (visible: false)
 *
 * Shows different messages for:
 * - Admin users: "Hidden content - admin preview"
 * - Regular users: "Content not yet released"
 */
export default function VisibilityBanner({
  visible,
  isAdmin = false,
  className = '',
}: VisibilityBannerProps) {
  if (visible) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-yellow bg-yellow/10 px-4 py-3 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {/* Alert Triangle Icon */}
      <svg
        className="h-5 w-5 flex-shrink-0 text-yellow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div className="flex-1">
        {isAdmin ? (
          <>
            <p className="text-sm font-medium text-yellow">此内容当前不可见</p>
            <p className="mt-1 text-xs text-subtext0">
              该页面已设置为隐藏状态，普通用户无法通过导航和搜索发现此页面。你作为管理员可以预览此内容。
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-yellow">内容尚未发布</p>
            <p className="mt-1 text-xs text-subtext0">
              此内容正在编写中，尚未正式发布。你可以阅读当前版本，但内容可能不完整或随时更新。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
