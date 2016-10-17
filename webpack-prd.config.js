/**
 * Production build configuration
 */
const webpack = require('webpack'),
  base = require('./webpack.config.js');

const webpackConfig = Object.assign(base, {
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