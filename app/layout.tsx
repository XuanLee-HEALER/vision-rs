import type { Metadata } from 'next';
import './globals.css';
import ParticleCanvas from '@/components/ParticleCanvas';
import SmartNavigation from '@/components/SmartNavigation';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import TableOfContents from '@/components/TableOfContents';
import AIChatButton from '@/components/AIChatButton';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-hidden">
        {/* Ambient Background with Particles */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-base via-mantle to-crust animate-gradient" />
          <ParticleCanvas />
        </div>

        {/* Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* Three Column Layout */}
        <div className="flex h-screen">
          {/* Left Sidebar - Smart Navigation */}
          <SmartNavigation />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto scroll-smooth scrollbar-none xl:mr-72">
            <div className="max-w-6xl mx-auto px-12 py-16">{children}</div>
          </main>

          {/* Right Sidebar - Table of Contents (hidden on smaller screens) */}
          <TableOfContents />
        </div>

        {/* AI Assistant FAB */}
        <AIChatButton />
      </body>
    </html>
  );
}
