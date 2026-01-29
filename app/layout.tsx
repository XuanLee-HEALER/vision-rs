import type { Metadata } from 'next';
import './globals.css';
import Banner from '@/components/Banner';
import SideMenu from '@/components/SideMenu';
import MenuButton from '@/components/MenuButton';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata: Metadata = {
  title: 'Vision-RS - 深入学习 Rust 编程语言',
  description:
    '通过图文并茂的方式深入学习 Rust 编程语言，包含语言概念、数据结构、三方库原理、网络编程等内容',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head></head>
      <body className="bg-base text-subtext1 antialiased">
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
      </body>
    </html>
  );
}
