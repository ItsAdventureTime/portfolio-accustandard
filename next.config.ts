import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/accustanda/demo',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
