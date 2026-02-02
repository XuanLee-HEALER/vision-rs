import SiteHeader from '@/components/layout/SiteHeader';
import SideMenu from '@/components/navigation/SideMenu';
import SidebarToggle from '@/components/navigation/SidebarToggle';
import ContentShell from '@/components/layout/ContentShell';
import { SideMenuProvider } from '@/contexts/SideMenuContext';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SideMenuProvider>
      {/* Banner - 占据文档流 */}
      <SiteHeader />

      {/* Main Content Area with Menu Button Space */}
      <div className="relative">
        {/* Fixed Menu Button */}
        <SidebarToggle />

        {/* Main Container - 始终为菜单按钮留出左侧空间 */}
        <div className="ml-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex gap-12 py-12">
              <ContentShell>{children}</ContentShell>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Menu */}
      <SideMenu />
    </SideMenuProvider>
  );
}
