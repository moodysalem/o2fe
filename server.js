/**
 * This is the HTTP server
 */
var express = require('express');
var path = require('path');
var app = express();

// SHORTCUT for system properties
var env = process.env;
var DEV_MODE = env.DEV_MODE === "true";

/**
 * GZIP content
 */
app.use(require('compression')({
  level: 4
}));

/**
 * Serve static assets
 */
var wbdm;
if (DEV_MODE) {
  var webpackDevMiddleware = require("webpack-dev-middleware");
  var webpack = require("webpack");

  var compiler = webpack(require('./webpack-base.config'));

  wbdm = webpackDevMiddleware(compiler, {
    // webpack dev middleware options
  });
  app.use(wbdm);
} else {
  // just serve the static assets from dist
  app.use('/', express.static('dist'));
}

/**
 * Use prerender.io for SEO
 */
if (typeof env.PRERENDER_TOKEN === "string") {
  app.use(require('prerender-node').set('prerenderToken', env.PRERENDER_TOKEN));
}

/**
 * Pass some client configuration stored in environment variables to the client via a script tag
 */
app.get('/config.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    API_URL: env.API_URL
  }));
});

/**
 * Send all requests for other files to index html
 */
app.get('*', function (req, res) {
  var indexPath = path.join(__dirname, 'dist/index.html');
  if (DEV_MODE) {
    res.end(wbdm.fileSystem.readFileSync(indexPath));
  } else {
    res.sendFile(indexPath);
  }
});

/**
 * Serve on 3000 or the passed in port
 */
var server = app.listen(env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening on http://%s:%s', host, port);
});