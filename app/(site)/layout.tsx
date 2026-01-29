import Banner from '@/components/Banner';
import SideMenu from '@/components/SideMenu';
import MenuButton from '@/components/MenuButton';
import ConditionalLayout from '@/components/ConditionalLayout';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Banner - 占据文档流 */}
      <Banner />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex gap-12 py-12">
          <ConditionalLayout>{children}</ConditionalLayout>
        </div>
      </div>

      {/* Floating Menu Button (左上角) */}
      <MenuButton />

      {/* Overlay Menu */}
      <SideMenu />
    </>
  );
}
