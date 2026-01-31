import { headers } from 'next/headers';
import VisibilityGuard from '@/components/admin/VisibilityGuard';

export default async function MentalModelLayout({ children }: { children: React.ReactNode }) {
  // Get current pathname from middleware
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Convert pathname to slug (remove leading slash)
  const slug = pathname.replace(/^\//, '');

  return <VisibilityGuard slug={slug}>{children}</VisibilityGuard>;
}
