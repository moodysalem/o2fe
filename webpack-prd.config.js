/**
 * Production build configuration
 */
var webpack = require('webpack');
var base = require('./webpack-base.config.js');

var webpackConfig = Object.assign(base, {
  plugins: base.plugins.concat([
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ]),
  // so we can see production errors in the source code
  devtool: "source-map"
});

module.exports = webpackConfig;