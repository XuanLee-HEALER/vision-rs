interface LearnLayoutProps {
  children: React.ReactNode;
}

export default function LearnLayout({ children }: LearnLayoutProps) {
  return (
    <article className="prose prose-sm md:prose-base lg:prose-lg snap-y snap-start">
      {children}
    </article>
  );
}
