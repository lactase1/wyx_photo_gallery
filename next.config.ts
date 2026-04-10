import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    // 使用推荐的配置名项
    proxyClientMaxBodySize: '100mb',
  },
};

export default nextConfig;
