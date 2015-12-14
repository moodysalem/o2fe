/**
 * Shared configuration
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

var webpackConfig = {
  entry: './src/js/App.js',

  output: {
    path: __dirname + '/dist',
    filename: 'App-[hash].js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "OAuth2 Cloud",
      template: './src/index.template.html',
      inject: 'body', // Inject all scripts into the body
      favicon: './favicon.ico'
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
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  },

  postcss: function () {
    return [ autoprefixer ];
  }
};

module.exports = webpackConfig;