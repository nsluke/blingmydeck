import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // No basePath needed — custom domain serves from root
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
