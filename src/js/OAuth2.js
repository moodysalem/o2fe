'use strict';
var $ = require('jquery');
var Promise = require('promise-polyfill');

var ORIGIN = "https://api.oauth2cloud.com";
var getAuthorizeUrl = function () {
  return ORIGIN + "/oauth/authorize";
};
var getTokenInfoUrl = function () {
  return ORIGIN + "/oauth/token/info";
};
var getLoginStatusUrl = function () {
  return ORIGIN + "/oauth/loginstatus";
};
var getLogoutUrl = function () {
  return ORIGIN + "/oauth/authorize/logout";
};

var clientId;

/**
 * Construct a URL for logging in
 */
var getLoginUrl = function (redirectUri, logout) {
  var redirectTo = ((typeof redirectUri === "string") ? redirectUri : window.location.origin);
  return getAuthorizeUrl() + "?" + $.param({
      client_id: clientId,
      response_type: "token",
      redirect_uri: redirectTo,
      logout: (logout === true)
    });
};

/**
 * Tokens are cached using localStorage so we don't repeatedly make calls to the API unnecessarily
 */
var TOKEN_KEY = "_oauth2cloud_login_token";
var getCachedToken = function () {
  return window.localStorage.getItem(TOKEN_KEY);
};

/**
 * Save a token to localStorage
 */
var setCachedToken = function (token) {
  window.localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Save a token to localStorage
 */
var clearCachedToken = function () {
  window.localStorage.removeItem(TOKEN_KEY);
};

var INITIALIZE_ERROR = "Must initialize the oauth2 library before calling any other functions";

// gets info for a token
var getTokenInfo = function (token) {
  return new Promise(function (resolve, reject) {
    if (typeof clientId !== "string" && clientId.length === 0) {
      console.error(INITIALIZE_ERROR);
      reject(INITIALIZE_ERROR);
      return;
    }
    if (typeof token === "string" && token.length > 0) {
      $.ajax({
        url: getTokenInfoUrl(),
        method: "POST",
        data: $.param({
          client_id: clientId,
          token: token
        }),
        success: function (resp) {
          resolve(resp);
        },
        error: function () {
          reject("Invalid token");
        }
      });
    } else {
      reject("Invalid token format");
    }
  });
};

/**
 * What we use to listen to postMessage is different across browsers
 */
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[ eventMethod ];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

/**
 * Check to see if we're already logged in to the site, and resolve to a token if we are logged in
 */
var checkAlreadyLoggedIn = function () {
  return new Promise(function (resolve, reject) {
    if (typeof clientId !== "string" || clientId === null) {
      console.error(INITIALIZE_ERROR);
      reject(INITIALIZE_ERROR);
      return;
    }

    var ifr = document.createElement('iframe');
    ifr.style.visibility = "hidden";
    ifr.src = getLoginStatusUrl() + "?" + $.param({
        client_id: clientId
      });
    document.body.appendChild(ifr);

    // Listen to message from child window
    eventer(messageEvent, function (event) {
      if (event.origin !== ORIGIN) {
        return;
      }
      var d = event.data;
      if (d.status === "logged_out") {
        reject('Not logged in.');
      } else {
        resolve(d.token);
      }
      ifr.parentNode.removeChild(ifr);
    }, false);

  });
};

var getLoginStatus = function () {
  return new Promise(function (resolve, reject) {
    var tkn = getCachedToken();
    if (typeof tkn === "string" && tkn.length > 0) {
      getTokenInfo(tkn).then(function (obj) {
        resolve(obj);
      }, function () {
        clearCachedToken();
        checkAlreadyLoggedIn().then(function (token) {
          setCachedToken(token.access_token);
          resolve(token);
        }, function () {
          reject("Invalid cached token, not logged in");
        });
      });
    } else {
      checkAlreadyLoggedIn().then(function (token) {
        setCachedToken(token.access_token);
        resolve(token);
      }, function () {
        reject("No cached token, not logged in");
      });
    }
  });
};

var init = function (options) {
  if (typeof options.clientId === "string") {
    clientId = options.clientId;
  }
  if (typeof options.token === "string") {
    setCachedToken(options.token);
  }
  if (typeof options.origin === "string") {
    ORIGIN = options.origin;
  }
  if (typeof options.token === "string") {
    setCachedToken(options.token);
  }
};

var logout = function () {
  clearCachedToken();
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: getLogoutUrl() + "?" + $.param({ client_id: clientId }),
      xhrFields: {
        withCredentials: true
      },
      success: function () {
        resolve();
      },
      error: function () {
        reject("Failed to log out");
      }
    });
  });
};

var login = function () {
  window.location.href = getLoginUrl(window.location.href, false);
};

module.exports = {
  init: init,
  getLoginStatus: getLoginStatus,
  logout: logout,
  login: login
};