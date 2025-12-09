/**
 * Policy to protect HR-only routes.
 *
 * TODO: Implement this policy for the interview test.
 * The policy should:
 * 1. Check for the x-hr header in the request
 * 2. Allow access (return true) when header value is "1"
 * 3. Deny access (return false) for unauthorized requests
 *
 * Hint: Access headers via policyContext.request.get("header-name")
 */
module.exports = (policyContext, config, { strapi }) => {
  // TODO: Implement policy logic
  return false;
};
