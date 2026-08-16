import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  // Performance: disable unused features
  poweredByHeader: false,
  // Compression
  compress: true,
  // Experimental: cache all dynamic routes with ISR-like revalidation
  experimental: {
    // Allow server actions to run without page re-render
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
