/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.fallback = {
      fs: false,
      os: require.resolve("os-browserify/browser"),
      buffer: require.resolve("buffer/"),
      process: false,
      http: false,
      https: false,
      path: require.resolve("path-browserify"),
    };

    // config.plugins.push(
    //   new webpack.ProvidePlugin({
    //     process: "process/browser",
    //   })
    // );

    return config;
  },

  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching
  },
});
