/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['source.unsplash.com'],
    },
    async rewrites() {
      return [
        { source: '/favicon.ico', destination: '/favicon.svg' },
      ];
    },
  }
export default nextConfig;
