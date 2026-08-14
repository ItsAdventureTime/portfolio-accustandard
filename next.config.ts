import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/accustandard/demo',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
