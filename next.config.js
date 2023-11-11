const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.module.rules.push({
        test: /\.obj$/,
        use: 'raw-loader',
      });
    }

    return config;
  },
};

module.exports = withPlugins([withImages], nextConfig);
