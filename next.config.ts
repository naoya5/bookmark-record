import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ["app", "components", "hooks", "lib"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
