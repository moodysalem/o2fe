var express = require('express');
var path = require('path');
var app = express();

var env = process.env;

/**
 * Serve all static files on the root
 */
app.use('/', express.static('dist'));

/**
 * Use prerender.io for SEO
 */
if (typeof env.PRERENDER_TOKEN === "string") {
  app.use(require('prerender-node').set('prerenderToken', env.PRERENDER_TOKEN));
}

/**
 * Pass the configuration stored in environment variables to the client via a script tag
 */
app.get('/config.js', function (req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.send('var config = ' + JSON.stringify({
      API_URL: env.API_URL,
      CLIENT_ID: env.CLIENT_ID
    }) + ';');
});

/**
 * Send all requests for other files to index html
 */
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Serve on 3000
 */
var server = app.listen(env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening on http://%s:%s', host, port);
});