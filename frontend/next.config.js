/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@calcom/embed-react"],
};

if (process.env.NODE_ENV === "development") {
  const apiUpstream = process.env.API_UPSTREAM || "http://127.0.0.1:10000";
  nextConfig.rewrites = async () => [
    { source: "/api/:path*", destination: `${apiUpstream}/api/:path*` },
  ];
}

module.exports = nextConfig;
