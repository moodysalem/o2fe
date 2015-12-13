/**
 * Production build configuration
 */
var webpack = require('webpack');
var base = require('./webpack-base.config.js');

var webpackConfig = Object.assign(base, {
  plugins: base.plugins.concat([
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    // build react for production
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]),
  // so we can debug production errors in the mapped source code
  devtool: "source-map"
});

module.exports = webpackConfig;