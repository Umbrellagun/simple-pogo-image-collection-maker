const webpack = require("webpack");
const path    = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const OfflinePlugin = require('offline-plugin');
// const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
// const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
// const WorkboxPlugin = require('workbox-webpack-plugin');

const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const PORT = process.env.PORT || 1333;

const DEVELOPMENT = (process.env.NODE_ENV === "dev");

const entryPath = path.resolve(__dirname + "/client/js/app.js");

const entry = (DEVELOPMENT) ? ([
  `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000`,
  entryPath
]) : ({
  bundle: "./client/js/app.js"
});

const output = {
  path: path.resolve(__dirname, 'dist'),
  // publicPath: "/",
  filename: "[name].js"
};

const mode = (DEVELOPMENT) ? ("development") : ("production");

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
    new OfflinePlugin(),
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
      // filename: 'index.html',
      // template: path.join(__dirname, 'template.html'),
      // background: "dist/bg_image.png",
      // selected: "dist/selected.png",
      // manifest: "dist/site.webmanifest"
    }),

    // new WorkboxPlugin.GenerateSW({
    //   // these options encourage the ServiceWorkers to get in there fast
    //   // and not allow any straggling "old" SWs to hang around
    //   clientsClaim: true,
    //   skipWaiting: true
    // }),

    // new SWPrecacheWebpackPlugin({
    //   cacheId: 'my-project-name',
    //   // dontCacheBustUrlsMatching: /\.\w{8}\./,
    //   filename: 'service-worker.js',
    //   minify: true,
    //   navigateFallback: "/index.html",
    //   // staticFileGlobs: ['./index.html'],
    //   staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    // }),

    // new ServiceWorkerWebpackPlugin(),

    // new OfflinePlugin({
      // ServiceWorker: {
      //   events: true,
      //   // navigateFallbackURL: '/',
      //   // publicPath: '/sw.js'
      // },
      // safeToUseOptionalCaches: true,
      // caches: {
      //   main: ["bundle.js", "index.html"],
      //   additional: [':externals:'],
      //   optional: [":rest:"]
      // },
      // externals: ["/dist/bundle.js", "/dist/", "/dist/site.webmanifest"],
      // version: '[hash]',
      // // appShell: "/dist/hs"
      // name: "PoGo Collector Service Worker",
      // // AppCache: {
      // //   events: true,
      // //   publicPath: '/appcache',
      // //   FALLBACK: {
      // //     '/': '/'
      // //   },
      // // },
      //
      // safeToUseOptionalCaches: true,
      // // caches: {
      // //   main: [
      // //     'main.js',
      // //     'index.html'
      // //   ],
      // //   optional: [
      // //     ':rest:'
      // //   ]
      // // },
      // AppCache: {
      //   events: true
      // }
    // }),
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
      }
    ]
  },
  devtool: "#source-map",
  plugins,
};
