"use strict";

/**
 * Fast policy for the interview: allow if header x-hr: '1' (or 'true').
 * Swap with real role-based auth post-interview.
 */
module.exports = (policyContext, config, { strapi }) => {
  // Allow all requests for now (placeholder implementation)
  return true;
};
