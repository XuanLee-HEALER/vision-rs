import { notFound } from 'next/navigation';
import { getVisibility } from '@/lib/visibility';
import { isAdmin } from '@/lib/auth/check-admin';
import VisibilityBanner from './VisibilityBanner';

interface VisibilityGuardProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * Server Component to check content visibility
 *
 * Rules:
 * 1. If visible: render normally
 * 2. If hidden + not admin: return 404
 * 3. If hidden + admin: show VisibilityBanner + render content
 */
export default async function VisibilityGuard({ slug, children }: VisibilityGuardProps) {
  const visible = await getVisibility(slug);

  // Content is visible - render normally
  if (visible) {
    return <>{children}</>;
  }

  // Content is hidden - check if user is admin
  const adminLoggedIn = await isAdmin();

  if (!adminLoggedIn) {
    // Hidden content + not admin = 404
    notFound();
  }

  // Hidden content + admin = show banner + render content
  return (
    <>
      <VisibilityBanner visible={false} className="mb-6" />
      {children}
    </>
  );
}
