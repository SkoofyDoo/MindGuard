import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Оптимизации для медиа-приложения
  images: {
    remotePatterns: [],
  },

  // Camera & microphone permissions for production (critical for iOS Safari + Android)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), display-capture=(self)',
          },
          // Legacy fallback for older browsers / stricter mobile clients
          {
            key: 'Feature-Policy',
            value: "camera 'self'; microphone 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
