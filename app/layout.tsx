import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vision-RS - 深入学习 Rust 编程语言",
  description: "通过图文并茂的方式深入学习 Rust 编程语言，包含语言概念、数据结构、三方库原理、网络编程等内容",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
