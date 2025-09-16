/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["openai"],

  experimental: {
    // 👇 This is the right way for Next.js 15.x
    legacyCss: true,
  },
};

module.exports = nextConfig;
