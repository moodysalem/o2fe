/**
 * webpack-dev-server configuration
 */
var base = require('./webpack-base.config.js');

module.exports = Object.assign({}, base, {
  devServer: {
    historyApiFallback: true,
    hot: true
  }
});
