import SiteHeader from '@/components/layout/SiteHeader';
import SideMenu from '@/components/navigation/SideMenu';
import SidebarToggle from '@/components/navigation/SidebarToggle';
import ContentShell from '@/components/layout/ContentShell';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Banner - 占据文档流 */}
      <SiteHeader />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex gap-12 py-12">
          <ContentShell>{children}</ContentShell>
        </div>
      </div>

      {/* Floating Menu Button (左上角) */}
      <SidebarToggle />

      {/* Overlay Menu */}
      <SideMenu />
    </>
  );
}
