import type { NextConfig } from "next";

const basePath = process.env.ACCUSTANDARD_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  env: {
    NEXT_PUBLIC_ACCUSTANDARD_BASE_PATH: basePath,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
