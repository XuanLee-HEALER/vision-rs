import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  getAllChapters,
  getChapterBySlug,
  getPartBySlug,
} from '@/features/learn/mental-model-config';

interface ChapterPageProps {
  params: {
    partSlug: string;
    chapterSlug: string;
  };
}

export async function generateStaticParams() {
  const chapters = getAllChapters();
  return chapters.map((chapter) => ({
    partSlug: chapter.partSlug,
    chapterSlug: chapter.slug,
  }));
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const chapter = getChapterBySlug(params.chapterSlug);

  if (!chapter) {
    return { title: 'Not Found' };
  }

  return {
    title: `${chapter.title} - Rust 心智世界`,
    description: `${chapter.partTitle} - ${chapter.title}`,
  };
}

async function getChapterContent(chapterSlug: string) {
  const contentPath = path.join(process.cwd(), 'content/mental-model', `${chapterSlug}.mdx`);

  if (!fs.existsSync(contentPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(contentPath, 'utf-8');
  const { data, content } = matter(fileContent);

  return { frontmatter: data, content };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const chapter = getChapterBySlug(params.chapterSlug);

  if (!chapter) {
    notFound();
  }

  const part = getPartBySlug(chapter.partSlug);
  if (!part) {
    notFound();
  }

  const chapterContent = await getChapterContent(params.chapterSlug);

  if (!chapterContent) {
    notFound();
  }

  // 找到上一章和下一章
  const allChapters = getAllChapters();
  const currentIndex = allChapters.findIndex((ch) => ch.slug === params.chapterSlug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-subtext0">
        <Link href="/learn/mental-model" className="hover:text-blue">
          Rust 心智世界
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/learn/mental-model/${part.slug}`} className="hover:text-blue">
          {part.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text">{chapter.title}</span>
      </nav>

      {/* Chapter Header */}
      <header className="mb-12 border-b border-overlay0/30 pb-8">
        <h1 className="mb-4 text-4xl font-bold text-text">{chapter.title}</h1>
        {chapter.referenceLinks && chapter.referenceLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chapter.referenceLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue hover:underline"
              >
                The Rust Reference →
              </a>
            ))}
          </div>
        )}
      </header>

      {/* MDX Content */}
      <article className="prose prose-invert max-w-none">
        <MDXRemote source={chapterContent.content} />
      </article>

      {/* Navigation */}
      <nav className="mt-12 flex items-center justify-between border-t border-overlay0/30 pt-8">
        {prevChapter ? (
          <Link
            href={`/learn/mental-model/${prevChapter.partSlug}/${prevChapter.slug}`}
            className="text-sm text-subtext0 transition-colors hover:text-blue"
          >
            ← {prevChapter.title}
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link
            href={`/learn/mental-model/${nextChapter.partSlug}/${nextChapter.slug}`}
            className="text-sm text-subtext0 transition-colors hover:text-blue"
          >
            {nextChapter.title} →
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
