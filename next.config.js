const path = require("path");

module.exports = {
  async rewrites() {
    return [
      {
        source: "/resources",
        destination: "/",
      },
    ];
  },
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
