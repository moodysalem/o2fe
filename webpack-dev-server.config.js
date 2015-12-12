/**
 * webpack-dev-server configuration
 */
var base = require('./webpack-base.config.js');

module.exports = Object.assign({}, base, {
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true
  }
});
