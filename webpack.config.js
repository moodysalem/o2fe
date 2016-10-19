/**
 * Shared configuration
 */
const HtmlWebpackPlugin = require('html-webpack-plugin'),
  autoprefixer = require('autoprefixer'),
  path = require('path'),
  webpack = require('webpack');

const webpackConfig = {
  entry: ['whatwg-fetch', './src/js/main.jsx'],

  output: {
    path: __dirname + '/dist',
    filename: '[hash].js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.template.html',
      inject: 'body' // Inject all scripts into the body
    }),
    new webpack.ProvidePlugin({
      Promise: 'bluebird'
    })
  ],

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: "style!css?importLoaders=1!postcss!sass"
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        loader: "babel-loader",

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, "src")
        ],

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/
      }
    ]
  },

  resolve: {extensions: ['', '.js', '.jsx']},

  postcss: function () {
    return [autoprefixer];
  }
};

module.exports = webpackConfig;