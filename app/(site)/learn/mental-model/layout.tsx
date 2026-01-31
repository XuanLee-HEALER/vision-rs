import { headers } from 'next/headers';
import { Metadata } from 'next';
import VisibilityGuard from '@/components/visibility/VisibilityGuard';
import { getVisibility } from '@/lib/visibility';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const slug = pathname.replace(/^\//, '');

  // Check visibility and add noindex for hidden content
  const visible = await getVisibility(slug);

  if (!visible) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {};
}

export default async function MentalModelLayout({ children }: { children: React.ReactNode }) {
  // Get current pathname from middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Convert pathname to slug (remove leading slash)
  const slug = pathname.replace(/^\//, '');

  return <VisibilityGuard slug={slug}>{children}</VisibilityGuard>;
}
