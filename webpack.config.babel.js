const webpack = require("webpack");
const path    = require("path");

const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const PORT = process.env.PORT || 1333;

const DEVELOPMENT = (process.env.NODE_ENV === "dev");

const PUBLIC_PATH = 'https://pogo-image-collection-maker.herokuapp.com/';

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
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          return;
        }
        console.log(message);
      },
      minify: true,
      navigateFallback: PUBLIC_PATH + '/index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    })
  ]
};
