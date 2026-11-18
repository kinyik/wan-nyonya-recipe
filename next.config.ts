import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 封面图用 90 画质，其他图用默认 75
  images: { qualities: [75, 90] },
};

export default nextConfig;
