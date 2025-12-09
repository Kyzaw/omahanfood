import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ptmzndtlecspr11r.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

};

export default nextConfig;
