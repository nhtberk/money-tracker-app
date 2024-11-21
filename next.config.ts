import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath:"",
  assetPrefix:"",
  reactStrictMode: true,
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
