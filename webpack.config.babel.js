const webpack = require("webpack");
const path    = require("path");

// const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
// const ServiceWorkerWebpackPlugin = require( 'serviceworker-webpack-plugin');

const PORT = process.env.PORT || 1333;

const DEVELOPMENT = (process.env.NODE_ENV === "dev");

const entryPath = path.resolve(__dirname + "/client/js/app.js");

const entry = (DEVELOPMENT) ? ([
  `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000`,
  entryPath
]) : ({
  "dist/js/bundle.js": entryPath
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
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        "PORT": JSON.stringify(process.env.PORT),
      },
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'template.html',
    // }),
    // new ServiceWorkerWebpackPlugin({
    //   entry: path.join(__dirname, 'client/js/service-worker.js'),
    // }),
    new OfflinePlugin(),
  ]
};
