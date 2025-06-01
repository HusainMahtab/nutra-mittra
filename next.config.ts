import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['claudinary.com', 'res.cloudinary.com'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  experimental: {
    serverComponentsExternalPackages: ['cloudinary'],
  },
};

export default nextConfig;
