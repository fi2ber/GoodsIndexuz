/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      // Add your image hosting domains here
      // Example:
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      // },
    ],
  },
};

module.exports = nextConfig;

