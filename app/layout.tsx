import type { Metadata } from 'next';
import './globals.css';
import { SearchProvider } from '@/components/search/SearchProvider.client';
import { Inter, JetBrains_Mono } from 'next/font/google';

// 配置 Inter 字体（西文/数字）
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// 配置 JetBrains Mono 字体（代码）
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-mono',
});

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
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head></head>
      <body className="bg-base text-subtext1 antialiased">
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}
