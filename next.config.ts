import type { NextConfig } from "next";

const imageHostnames = ["res.cloudinary.com", "yt3.ggpht.com"];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageHostnames.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  poweredByHeader: false,
  compress: true,
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    exposeTestingApiInProductionBuild:
      process.env.EXPOSE_TESTING_API === "1",
  },
  allowedDevOrigins: ["192.168.29.251"],
};

export default nextConfig;
