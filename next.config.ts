import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['ik.imagekit.io'], 
  }, eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;