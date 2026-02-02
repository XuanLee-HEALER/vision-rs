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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-rs.com'),
  title: {
    default: 'Vision-RS - 深入学习 Rust 编程语言',
    template: '%s | Vision-RS',
  },
  description:
    '通过图文并茂的方式深入学习 Rust 编程语言，包含语言概念、数据结构、三方库原理、网络编程等内容',
  keywords: ['Rust', 'Rust教程', '所有权系统', '借用检查', '生命周期', 'Tokio', '异步编程'],
  authors: [{ name: 'Vision-RS Team' }],
  creator: 'Vision-RS',

  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName: 'Vision-RS',
    title: 'Vision-RS - 深入学习 Rust 编程语言',
    description:
      '通过图文并茂的方式深入学习 Rust 编程语言，包含语言概念、数据结构、三方库原理、网络编程等内容',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Vision-RS',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Vision-RS - 深入学习 Rust 编程语言',
    description:
      '通过图文并茂的方式深入学习 Rust 编程语言，包含语言概念、数据结构、三方库原理、网络编程等内容',
    images: ['/og-image.svg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vision-RS',
    url: 'https://vision-rs.com',
    logo: 'https://vision-rs.com/icon.svg',
    description: '通过图文并茂的方式深入学习 Rust 编程语言',
  };

  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-base text-subtext1 antialiased">
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}
