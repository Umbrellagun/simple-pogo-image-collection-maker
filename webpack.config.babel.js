const webpack = require("webpack");
const path    = require("path");

const PORT = process.env.PORT || 1333;

module.exports = {
  context: __dirname,
  entry: [
    `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000`,
    "./client/js/app.js"
  ],
  mode: "development",
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js"
  },
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
