export const magicLinks = new Map<string, { email: string; expiresAt: number }>();

/**
 * Store magic token in memory
 */
export function saveMagicToken(token: string, user: { email: string; expiresAt: number }) {
  magicLinks.set(token, user);
}

/**
 * Fetch user by magic token
 */
export function getUserByMagicToken(token: string) {
  return magicLinks.get(token) || null;
}

/**
 * Delete magic token after use
 */
export function deleteMagicToken(token: string) {
  magicLinks.delete(token);
}