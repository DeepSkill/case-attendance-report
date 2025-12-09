/**
 * Policy to protect HR-only routes.
 * Checks for the x-hr header and allows access only when set to "1".
 * Returns false (403 Forbidden) for missing/invalid header.
 *
 * Note: This policy allows admin panel requests (JWT auth) to pass through.
 */
export default (policyContext) => {
  // Skip policy for admin panel requests (they use JWT auth via Authorization header)
  const authHeader = policyContext.request.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return true;
  }

  // Check for x-hr header for API requests
  const header = policyContext.request.get("x-hr");
  if (header === "1") {
    return true;
  }

  // Deny access - Strapi will return 403 Forbidden
  return false;
};
