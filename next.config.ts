import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'redshark.blob.core.windows.net',
        pathname: '/user-profile/**',
      },
      {
        protocol: 'https',
        hostname: 'redshark.blob.core.windows.net',
        pathname: '/post-images/**',
      },
    ],
  },
};

export default nextConfig;
