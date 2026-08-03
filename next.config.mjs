import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // The local app is usually opened as http://127.0.0.1:3000 inside Codex.
  // Allow that origin so Next dev/HMR resources do not show a blocking overlay.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  turbopack: {
    root: projectRoot,
  },

  // Remove typescript.ignoreBuildErrors - we want to catch errors!
  // If there are TypeScript errors, we'll fix them properly

  // Image optimization - keeping unoptimized for now but with proper config
  images: {
    unoptimized: true, // Can be removed later if using Next.js Image optimization
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
