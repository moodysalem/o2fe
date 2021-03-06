/**
 * Shared configuration
 */
const HtmlWebpackPlugin = require('html-webpack-plugin'),
  autoprefixer = require('autoprefixer'),
  path = require('path'),
  webpack = require('webpack');

const env = process.env,
  version = env.GIT_VERSION || env.npm_package_version;

module.exports = {
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
    }),
    new webpack.DefinePlugin({
      __VERSION__: `"${version}"`
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
          // limit of 1mb
          'url?limit=2000000&hash=sha512&digest=hex&name=[hash].[ext]',
          // optimize images
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

  devServer: {
    historyApiFallback: true,

    host: '0.0.0.0',
    port: 3000,

    setup(app) {
      app.get('/config.json', (req, res) => {
        res.json({
          API_URL: env.API_URL,
          CLIENT_ID: env.CLIENT_ID
        });
      });
    }
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  postcss: function () {
    return [autoprefixer];
  }
};