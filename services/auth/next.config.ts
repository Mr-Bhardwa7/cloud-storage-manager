import type { NextConfig } from "next";

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  reactStrictMode: true,
  transpilePackages: ["nextuiq"],
  experimental: {
    serverActions: {
      bodySizeLimit: 5 * 1024 * 1024,
      allowedOrigins: ["*"],
    },
  },
} satisfies NextConfig;

export default nextConfig;
