"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/reports/attendance",
      handler: "report.attendance",
      config: {
        policies: ["is-hr"],
      },
    },
  ],
};
