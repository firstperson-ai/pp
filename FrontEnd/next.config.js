/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [],
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          child_process: false,
        };
      }
      return config;
    },
    experimental: {
      serverComponentsExternalPackages: ['@supabase/supabase-js'],
    },
    telemetry: {
      disabled: true, // Opt-out of telemetry
    },
    output: 'standalone', // Optimize for production deployment
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
          ],
        },
      ];
    },
    async redirects() {
      return [
        {
          source: '/old-home',
          destination: '/',
          permanent: true,
        },
      ];
    },
  };
  
  module.exports = nextConfig;