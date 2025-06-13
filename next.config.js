/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xhzurxmliuvexekfilfo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
  // Suppress webpack warning for Supabase realtime module
  webpack: (config, { isServer }) => {
    // Ignore critical dependency warnings from Supabase realtime
    config.ignoreWarnings = [
      {
        module: /RealtimeClient\.js/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    // Handle potential build issues with dynamic imports
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;