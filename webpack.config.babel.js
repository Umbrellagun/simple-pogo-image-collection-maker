const webpack = require("webpack");
const path    = require("path");

const PORT = process.env.PORT || 1333;

const DEVELOPMENT = (process.env.NODE_ENV === "dev");

const entry = (DEVELOPMENT) ? ([
  `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000`,
  "./client/js/app.js"
]) : ({
  "dist/js/bundle.js": "./scripts/app.js",
});

const output = (DEVELOPMENT) ? ({
  path: __dirname,
  publicPath: "/",
  filename: "bundle.js"
}) : ({
  path: __dirname,
  publicPath: "/",
  filename: "[name]"
});

const mode = (DEVELOPMENT) ? ("development") : ("production");

module.exports = {
  context: __dirname,
  entry,
  mode,
  output,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: "babel-loader"
      }
    ]
  },
  devtool: "#source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
};
