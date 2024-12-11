const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: require.resolve("path-browserify"),
          os: require.resolve("os-browserify/browser"),
          crypto: require.resolve("crypto-browserify"),
          buffer: require.resolve("buffer/"),
          stream: require.resolve("stream-browserify"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      ],
    },
  },
};
