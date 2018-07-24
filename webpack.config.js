const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.tsx?$/,
      //   loader: 'tslint-loader',
      //   exclude: /node_modules/
      // },
      // {
      //   test: /\.worker.tsx?$/,
      //   loader: 'worker-loader?name=./[name][hash].js',
      //   exclude: /node_modules/
      // },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader?name=./images/[hash].[ext]'
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=./fonts/[hash].[ext]'
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './vendors', to: './vendors', },
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(pkg.version),
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebPackPlugin({
      // hash: true,
      template: 'index.html',
      pkg: pkg,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new UglifyJSPlugin({
      sourceMap: true,
      cache: true,
      parallel: true
    }),
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
        }
      }
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 5000,
  },
};
