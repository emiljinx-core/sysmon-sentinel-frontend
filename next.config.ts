import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",   // <-- REQUIRED FOR DOCKER
};

export default nextConfig;
