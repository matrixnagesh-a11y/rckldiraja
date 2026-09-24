import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "iceberg-js": false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "iceberg-js": false,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
