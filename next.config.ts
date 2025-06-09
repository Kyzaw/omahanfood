import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  serverActions: {
    enabled: true
  }
};

export default nextConfig;
