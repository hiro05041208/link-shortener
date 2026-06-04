/**
 * Returns true only when a real (non-placeholder) Clerk publishable key is present.
 * Real keys are at least 50 chars and start with pk_test_ or pk_live_.
 * Dummy values from .env.example (e.g. "pk_test_xxxxxx") are rejected.
 */
export function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) return false
  if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) return false
  if (key.length < 50) return false
  return true
}
