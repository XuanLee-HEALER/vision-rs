export default function ContentShell({ children }: { children: React.ReactNode }) {
  // 直接渲染子元素，TOC 由页面层级提供
  return <>{children}</>;
}
