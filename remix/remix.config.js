/** @type {import('@remix-run/dev').AppConfig} */

/* bugfix: https://github.com/Shopify/cli/issues/2935#issuecomment-1791255061 */
/* eslint-disable no-undef */
delete process.env.REMIX_DEV_ORIGIN;

export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  serverBuildPath: "build/index.cjs",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
