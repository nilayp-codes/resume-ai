/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.render.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
