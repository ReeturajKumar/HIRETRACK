import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
    // Only apply this on the server side
    if (isServer) {
      config.externals.push('handlebars');
    }
    return config;
  },
  
  images: {
    domains: ['firebasestorage.googleapis.com', 'img.clerk.com'],
  },
};

export default nextConfig;
