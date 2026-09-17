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
  // ponytail: cacheComponents enables Cache Components (Next.js 16.3+)
  // for instant navigation. Without it, there is no static shell to optimize.
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // ponytail: exposeTestingApiInProductionBuild gates the testing API
    // behind an env var so real prod builds never leak it.
    exposeTestingApiInProductionBuild:
      process.env.EXPOSE_TESTING_API === "1",
  },
  allowedDevOrigins: ["10.103.214.91"],
};

export default nextConfig;
