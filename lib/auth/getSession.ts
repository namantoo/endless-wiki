// Auth seam — V1 always returns null (no authentication enforced).
//
// To add auth (any system — NextAuth, JWT from Java backend, Auth0, Clerk, etc.):
// Replace the function body to decode/validate your auth token or session.
// The signature never changes, so all API routes work without modification.

export interface AuthUser {
  id: string;
  email?: string;
  isAuthenticated: true;
}

export async function getSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req?: Request
): Promise<AuthUser | null> {
  // V1: no auth
  return null;
}
