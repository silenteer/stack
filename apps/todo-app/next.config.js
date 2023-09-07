const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@stack/prisma', '@stack/services'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
  typescript: {
    ignoreBuildErrors: true
  }
}
 
module.exports = nextConfig