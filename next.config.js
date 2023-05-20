const path = require("path");

module.exports = {
  basePath: "/resources",
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "assets")],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blog-admin.canopas.com",
      },
    ],
  },
};
