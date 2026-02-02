import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  slug: string;
  type?: 'article' | 'website';
  category?: string;
  tags?: string[];
}

export function generatePageMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vision-rs.com';
  const url = `${baseUrl}/${config.slug}`;

  return {
    title: config.title,
    description: config.description,

    openGraph: {
      type: config.type || 'article',
      url,
      title: config.title,
      description: config.description,
      siteName: 'Vision-RS',
      locale: 'zh_CN',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: ['/og-image.png'],
    },

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
