import { getSession } from './session';

/**
 * Check if current user is an admin (non-throwing version)
 * Returns true if logged in as admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession();
    return session.isLoggedIn && !!session.email;
  } catch {
    return false;
  }
}

/**
 * Get admin email if logged in
 * Returns email string or null
 */
export async function getAdminEmail(): Promise<string | null> {
  try {
    const session = await getSession();
    if (session.isLoggedIn && session.email) {
      return session.email;
    }
    return null;
  } catch {
    return null;
  }
}
