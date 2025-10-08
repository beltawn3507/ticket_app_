// ✅ This is the correct way
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Use a value that works for you
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;