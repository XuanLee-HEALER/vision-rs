import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllLessonSlugs, getLesson } from '@/features/learn';
import TableOfContents from '@/components/content/TableOfContents';
import InteractiveCodeBlock from '@/components/code/InteractiveCodeBlock.client';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// 生成静态路径
export async function generateStaticParams() {
  const slugs = await getAllLessonSlugs();
  return slugs.map((slug) => ({
    slug: slug.split('/'),
  }));
}

// 生成元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const lesson = await getLesson(slugPath);

  if (!lesson) {
    return {
      title: '未找到课程 - Vision-RS',
    };
  }

  return {
    title: `${lesson.frontmatter.title} - Vision-RS`,
    description: lesson.frontmatter.description || lesson.frontmatter.title,
  };
}

// 自定义 MDX 组件
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold mb-6 text-text" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-3xl font-semibold mt-12 mb-5 pb-2 border-b border-overlay0 text-text"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-semibold mt-8 mb-4 text-text" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base leading-relaxed mb-4 text-subtext1" {...props} />
  ),
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-surface0 text-mauve px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // 提取 code 元素的内容和语言
    const codeElement = Array.isArray(children)
      ? children.find((child: any) => child?.type === 'code')
      : children;

    if (codeElement && typeof codeElement === 'object' && 'props' in codeElement) {
      const className = codeElement.props.className || '';
      const language = className.replace(/language-/, '') || 'text';
      const code = String(codeElement.props.children || '').trim();

      // 使用 InteractiveCodeBlock 提供复制和运行功能
      return <InteractiveCodeBlock code={code} language={language} showLineNumbers={true} />;
    }

    // 如果没有找到 code 元素，使用默认的 pre 渲染
    return (
      <pre
        className="bg-mantle border border-surface0 rounded-lg p-5 my-6 overflow-x-auto text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
    );
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-blue border-b border-transparent hover:border-blue transition-colors"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-subtext1" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-subtext1" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-blue bg-surface0 pl-4 py-2 my-4 italic text-subtext1"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-overlay0 bg-surface0 px-4 py-2 text-left font-semibold text-text"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-overlay0 px-4 py-2 text-subtext1" {...props} />
  ),
};

export default async function LessonPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const lesson = await getLesson(slugPath);

  if (!lesson) {
    notFound();
  }

  return (
    <>
      <article className="prose prose-lg max-w-none">
        <MDXRemote
          source={lesson.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            },
          }}
        />
      </article>

      {/* Table of Contents - 右侧 */}
      {lesson.toc && lesson.toc.length > 0 && (
        <aside className="hidden w-64 shrink-0 border-l border-overlay0/30 pl-8 lg:block">
          <div className="sticky top-6">
            <h4 className="mb-4 text-xs font-medium uppercase tracking-wider text-subtext0">
              本页大纲
            </h4>
            <nav>
              <TableOfContents items={lesson.toc} />
            </nav>
          </div>
        </aside>
      )}
    </>
  );
}
