import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Оптимизации для медиа-приложения
  images: {
    remotePatterns: [],
  },

  // Разрешаем доступ к камере/микрофону в production
  // (важно для iOS Safari и некоторых браузеров)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
