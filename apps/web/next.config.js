/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["openai"],

  compiler: {
    // Next.js 15.x uses swcMinify + built-in LightningCSS
    // For Tailwind/PostCSS compatibility, disable minifier entirely
    removeConsole: false,
  },

};

module.exports = nextConfig;
