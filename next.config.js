/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable gzip compression
  productionBrowserSourceMaps: false, // Disable source maps in production for better performance
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Required for FFmpeg WASM to work
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // Additional security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
  
  // Image optimization
  images: {
    domains: ['bulkvidcropper.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Environment variables that will be available at build time
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://bulkvidcropper.com',
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV || 'development',
  },
  
  // Production source map configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize production builds
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
