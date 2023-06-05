/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@frontend/components"
  ],
  async rewrites() {
    return [
      {
        source: "/trpc/:path*",
        destination: "http://localhost:4000/rpc/:path*"
      }
    ]
  }
}

module.exports = nextConfig
