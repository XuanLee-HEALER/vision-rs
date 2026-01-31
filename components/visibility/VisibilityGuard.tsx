import { getVisibility } from '@/lib/visibility';
import { isAdmin } from '@/lib/auth/check-admin';
import VisibilityBanner from './VisibilityBanner';

interface VisibilityGuardProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * Server Component to check content visibility (Soft Hide Strategy)
 *
 * Rules:
 * 1. If visible: render normally
 * 2. If hidden + not admin: show banner with "unreleased" message + render content
 * 3. If hidden + admin: show banner with "admin preview" message + render content
 *
 * Note: This is "soft hide" - content is still accessible via direct URL,
 * but shows a banner to indicate it's not publicly listed.
 */
export default async function VisibilityGuard({ slug, children }: VisibilityGuardProps) {
  const visible = await getVisibility(slug);

  // Content is visible - render normally
  if (visible) {
    return <>{children}</>;
  }

  // Content is hidden - check if user is admin for different banner text
  const adminLoggedIn = await isAdmin();

  // Hidden content = show banner + render content (soft hide)
  return (
    <>
      <VisibilityBanner visible={false} isAdmin={adminLoggedIn} className="mb-6" />
      {children}
    </>
  );
}
