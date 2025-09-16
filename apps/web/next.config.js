const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["openai"],
  },
  compiler: {
    lightningcss: false,
  },
};
module.exports = nextConfig;
