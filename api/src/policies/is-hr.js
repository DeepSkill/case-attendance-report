"use strict";

/**
 * Fast policy for the interview: allow if header x-hr: '1' (or 'true').
 * Swap with real role-based auth post-interview.
 */
module.exports = (policyContext, config, { strapi }) => {
  const hdr = policyContext?.request?.header("x-hr");
  if (hdr === "1" || hdr === "true") return true;
  return policyContext.unauthorized("HR access required. Set header x-hr: 1");
};
