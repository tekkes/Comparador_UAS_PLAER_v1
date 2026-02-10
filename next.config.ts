import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Required for GitHub Pages if not at root domain
  basePath: process.env.NODE_ENV === 'production' ? '/Comparador_UAS_PLAER_v1' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
