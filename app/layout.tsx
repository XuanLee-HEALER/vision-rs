import type { Metadata } from 'next';
import './globals.css';

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
      <body className="bg-base text-subtext1 antialiased">{children}</body>
    </html>
  );
}
