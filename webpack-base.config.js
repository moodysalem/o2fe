/**
 * Shared configuration
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
      inject: 'body' // Inject all scripts into the body
    })
  ]
};

module.exports = webpackConfig;