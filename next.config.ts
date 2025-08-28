import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    GITHUB_PROJECT_URL: process.env.GITHUB_PROJECT_URL,
  },
  images: {
    domains: [
      'redshark.blob.core.windows.net',
    ],
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
