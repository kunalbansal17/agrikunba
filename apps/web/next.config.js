/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["openai"],

  experimental: {
    legacyCss: true, // ✅ force PostCSS instead of oxide/lightningcss
  },
};

module.exports = nextConfig;
