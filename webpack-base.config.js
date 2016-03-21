/**
 * Shared configuration
 */
const HtmlWebpackPlugin = require('html-webpack-plugin'),
  autoprefixer = require('autoprefixer'),
  path = require('path'),
  webpack = require('webpack');

const webpackConfig = {
  entry: './src/js/main.js',

  output: {
    path: __dirname + '/dist',
    filename: 'main-[hash].js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "OAuth2 Cloud",
      template: './src/index.template.html',
      inject: 'body' // Inject all scripts into the body
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      request: 'superagent',
      Promise: 'bluebird'
    })
  ],

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?importLoaders=1!postcss-loader"
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
        test: /\.jsx?$/,

        // Options to configure babel with
        query: {
          plugins: [ 'transform-runtime' ],
          presets: [ 'es2015', 'react' ]
        }
      }
    ]
  },

  postcss: function () {
    return [ autoprefixer ];
  }
};

module.exports = webpackConfig;