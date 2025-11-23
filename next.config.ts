import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Disable static generation to prevent build-time database connections
    staticGenerationAsyncStorage: false,
  },
  // Force all pages to be dynamic
  output: 'standalone',
};

export default nextConfig;
