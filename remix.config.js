/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    "three/examples/jsm/utils/BufferGeometryUtils.js",
    "three/examples/jsm/loaders/DRACOLoader.js",
    "@splinetool/r3f-spline",
    "@splinetool/loader",
    "@react-three/cannon",
    "swiper",
    "swiper/element",
    "ssr-window",
    "swiper/react",
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
};
