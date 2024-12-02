import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.clevelanddentalhc.com',

      },
      {
        protocol: 'https',
        hostname:'cloud.appwrite.io',
        pathname: '/**', // Allow all paths on this domain

      },
    ]
  }
};

export default nextConfig;
