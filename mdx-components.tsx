import type { MDXComponents } from 'mdx/types';
import InteractiveCodeBlock from '@/components/InteractiveCodeBlock';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl font-bold text-text mb-6">{children}</h1>,
    h2: ({ children, id }) => (
      <h2
        id={id}
        className="text-3xl font-semibold text-text mt-12 mb-5 pb-2 border-b border-overlay0 scroll-mt-8"
      >
        {children}
      </h2>
    ),
    h3: ({ children, id }) => (
      <h3 id={id} className="text-2xl font-semibold text-text mt-8 mb-4 scroll-mt-8">
        {children}
      </h3>
    ),
    h4: ({ children, id }) => (
      <h4 id={id} className="text-xl font-semibold text-subtext1 mt-6 mb-3 scroll-mt-8">
        {children}
      </h4>
    ),
    p: ({ children }) => <p className="text-base leading-relaxed text-subtext1 mb-4">{children}</p>,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue no-underline border-b border-transparent hover:border-blue transition-colors"
      >
        {children}
      </a>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-surface0 text-mauve px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      }

      // Extract language from className (e.g., "language-rust")
      const language = className?.replace('language-', '') || 'text';
      const code = String(children).trim();

      return <InteractiveCodeBlock code={code} language={language} />;
    },
    pre: ({ children }) => {
      // Pre is handled by code component
      return <>{children}</>;
    },
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-subtext1 mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-subtext1 mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue bg-surface0 pl-4 py-2 my-4 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="bg-surface0 text-text font-semibold p-3 text-left border border-overlay0">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="p-3 border border-overlay0">{children}</td>,
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="rounded-lg my-8 mx-auto shadow-lg max-w-full" />
    ),
    ...components,
  };
}
