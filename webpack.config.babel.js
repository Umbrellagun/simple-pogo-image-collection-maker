const webpack = require("webpack");
const path    = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

// path.resolve vs. path.join

const PORT = process.env.PORT || 1333;

// const DEVELOPMENT = (process.env.NODE_ENV === "dev");
const DEVELOPMENT = false;

const entryPath = path.resolve(__dirname + "/client/js/app.js");

const entry = (DEVELOPMENT) ? ([
  `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000`,
  entryPath
]) : ({
  "bundle.js": "./client/js/app.js",
  // "site.webmanifest": "./site.webmanifest",
  // "bg_image.png": "./bg_image.png"
});

const output = {
  // path: path.resolve(__dirname, '/dist'),
  // publicPath: "/",
  filename: (chunkData)=>{
    return "[name]";
  }
};

// const mode = (DEVELOPMENT) ? ("development") : ("production");
const mode = "development"

const plugins = (DEVELOPMENT) ? (
  [
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
    // new OfflinePlugin(),
  ]
) : (
  [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        "PORT": JSON.stringify(process.env.PORT),
      },
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'template.html'),
      // background: "/dist/bg_image.png",
      // selected: "/dist/selected.png",
      manifest: "/site.webmanifest",
      cache: false,
      // chunks: (wtf)=>{
      //   console.log(wtf)
      // }
    }),

    new SWPrecacheWebpackPlugin({
      cacheId: 'PoGo-Collector',
      // dontCacheBustUrlsMatching: /\.\w{8}\./,
      minify: true,
      // navigateFallback: "/index.html",
      mergeStaticsConfig: true,
      stripPrefix: "dist",
      replacePrefix: "",
      staticFileGlobs: [
        // "dist/site.webmanifest",
        // "dist/bg_image.png",
        // "dist/index.html",
        // "dist/bundle.js"
      ],
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
  ]
);

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
      },
      {
        test: /\.webmanifest$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        },
      },
      {
        exclude: /node_modules/,
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            // publicPath: path.join(__dirname, './dist'),
            // outputPath: "dist/",
            // emitFiles: false,
          }
        }
      }
    ]
  },
  devtool: "#source-map",
  plugins,
};
