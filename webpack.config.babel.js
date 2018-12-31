const webpack = require("webpack");
const path    = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

// path.resolve vs. path.join?

const PORT = process.env.PORT || 1333;

const DEVELOPMENT = (process.env.NODE_ENV === "dev");

const entryPath = path.resolve(__dirname + "/client/js/app.js");

const entry = (DEVELOPMENT) ? ([
  `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr&timeout=20000`,
  "./client/js/app.js"
]) : ({
  "bundle.js": "./client/js/app.js"
});

// const output = {
//   filename: (chunkData)=>{
//     return "[name]";
//   }
// };

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

const plugins = (DEVELOPMENT) ? (
  [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        "PORT": JSON.stringify(process.env.PORT),
      },
    }),
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
      manifest: "/site.webmanifest",
      cache: false,
    }),

    new SWPrecacheWebpackPlugin({
      cacheId: 'PoGo-Collector',
      minify: true,
      mergeStaticsConfig: true,
      stripPrefix: "dist",
      replacePrefix: "",
      staticFileGlobs: [],
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
          }
        }
      }
    ]
  },
  devtool: "#source-map",
  plugins,
};
