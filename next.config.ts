import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  // Disable static page generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
