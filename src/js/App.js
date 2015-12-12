"use strict";
require('../css/App.css');
var rbs = require('react-backstrap');
var oauth2 = require('./OAuth2');
var $ = require('jquery');
var router = require('./Router');

var bb = rbs.backbone;
var util = rbs.util;

util.debug("defining model...");

// define the model that stores application state, e.g. who is logged in
var m = new (bb.Model.extend({
  isLoggedIn: function () {
    return this.has("token");
  }
}))();

util.debug("defining start function..");
var start = function () {
  util.debug("start function called...");
  var r = new router({
    model: m
  });

  // on click of internal links, use the router to navigate to that href
  $(function () {
    $(document).on("click", "[href]", function (e) {
      var href = $(e.target).closest("[href]").attr("href");
      if (typeof href !== "string") {
        return;
      }
      if (href.length > 0 && href[ 0 ] === "#") {
        e.preventDefault();
        if (href.length > 1) {
          var els = $(href);
          if (els.length == 1) {
            var st = els.offset().top;
            if (st > 0) {
              $("html, body").animate({ scrollTop: st + "px" });
            }
          }
        }
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        return;
      }
      var isInternal = util.internalLink(href);
      if (isInternal) {
        e.preventDefault();
      }
      if (isInternal) {
        r.navigate(href, { trigger: true });
      }
    });
  });

  // start the router
  bb.history.start({ pushState: true });
};


//configure ajax calls to the API to send our token in the authorization header whenever we are logged in
$(document).ajaxSend(function (event, jqXhr, ajaxOptions) {
  var url = ajaxOptions.url;
  if (url.indexOf("api") === 0) {
    if (m.has("token.access_token")) {
      jqXhr.setRequestHeader("Authorization", "bearer " + m.get("token.access_token"));
    }
  }
});

util.debug("initializing oauth2");
oauth2.init({
  clientId: "6a63c1f1f10df85df6f918d68cb8c13e1e44856f7d861b05cbdd63bf7ea009f4",
  token: null
});

util.debug("getting login status");
oauth2.getLoginStatus().then(function (token) {
  util.debug("logged in");
  m.set("token", token);
  start();
}, function (err) {
  util.debug("not logged in", err);
  start();
});