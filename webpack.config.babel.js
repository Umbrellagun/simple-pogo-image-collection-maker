const webpack = require("webpack");
const path    = require("path");

const PORT = process.env.PORT || 1333;

const DEVELOPMENT = (process.env.NODE_ENV === "dev");
console.log(DEVELOPMENT);
console.log(process.env.NODE_ENV);
const entryPath = "./client/js/app.js";
const entry = (DEVELOPMENT) ? ([
  `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000`,
  entryPath
]) : ({
  "dist/js/bundle.js": entryPath,
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
