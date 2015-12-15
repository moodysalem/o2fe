"use strict";
require('../css/App.css');
var rbs = require('react-backstrap');
var oauth2 = require('./OAuth2');
var $ = require('jquery');
var _ = require('underscore');
var router = require('./Router');

var bb = rbs.backbone;
var util = rbs.util;

/**
 * Decode the hash in case they just logged in
 */
var hash = window.location.hash;
var hashObj = {};
var plus = /\+/g;
var decode = function (val) {
  return decodeURIComponent(val).replace(plus, " ");
};
if (typeof hash === 'string' && hash.length > 1) {
  var data = hash.substr(1);
  var pcs = data.split("&");
  _.each(pcs, function (pc) {
    var pcPcs = pc.split("=");
    if (pcPcs.length !== 2) {
      return;
    }
    var n = decode(pcPcs[ 0 ]);
    var v = decode(pcPcs[ 1 ]);
    hashObj[ n ] = (!isNaN(+v)) ? +v : v;
  });
}

/**
 * Now remove the hash object from the URL before anything else runs
 */
window.history.replaceState("", document.title, window.location.pathname);


/**
 * This model stores application state
 */
var m = new bb.Model();

// stores the instance of the router controlling the application
var rtr;

/**
 * On click of an internal link, use the router to navigate to that page
 */
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
      rtr.navigate(href, { trigger: true });
    }
  });
});

/**
 * This function is called when the application has retrieved all the data it needs via AJAX
 */
var start = function () {
  rtr = new router({
    model: m
  });

  bb.history.start({ pushState: true });
};

/**
 * AJAX calls to the API should include the token
 */
$(document).ajaxSend(function (event, jqXhr, ajaxOptions) {
  if (ajaxOptions.headers && ajaxOptions.headers.Authorization) {
    return;
  }
  var url = ajaxOptions.url;
  if (url.indexOf(config.API_URL) === 0) {
    if (m.has("token.access_token")) {
      jqXhr.setRequestHeader("Authorization", "bearer " + m.get("token.access_token"));
    }
  }
});


/**
 * Initialize the OAuth2 login code
 */
oauth2.init({
  clientId: "6a63c1f1f10df85df6f918d68cb8c13e1e44856f7d861b05cbdd63bf7ea009f4",
  token: hashObj.access_token,
  origin: config.API_URL
});

/**
 * Get the login status, and then start
 */
oauth2.getLoginStatus().then(function (token) {
  // this function returns the token
  m.set("token", token);
  start();
}, function (error) {
  console.log(error);
  start();
});