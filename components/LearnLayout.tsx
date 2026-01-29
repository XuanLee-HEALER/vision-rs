import Banner from "./Banner";
import Sidebar from "./Sidebar";

interface LearnLayoutProps {
  children: React.ReactNode;
}

export default function LearnLayout({ children }: LearnLayoutProps) {
  return (
    <div className="min-h-screen bg-base">
      {/* Banner */}
      <Banner />

      {/* Main content with sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Content area */}
        <main className="flex-1 ml-72">
          <div className="max-w-4xl mx-auto px-12 py-16">
            <article className="prose prose-lg">
              {children}
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
