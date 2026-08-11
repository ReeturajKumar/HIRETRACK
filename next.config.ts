import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("handlebars");
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        // Cloudinary CDN
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Clerk user avatars
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
