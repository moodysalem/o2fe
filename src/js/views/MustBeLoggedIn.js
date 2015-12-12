'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var alert = rbs.components.layout.Alert;
var oauth2 = require('../OAuth2');
var util = rbs.util;

var d = React.DOM;

module.exports = util.rf({
  render: function () {
    return d.div({
      className: "container"
    }, [
      d.h1({ key: "h1", className: "page-header" }, "Uh oh..."),
      alert({
        key: "al",
        strong: "",
        message: [
          "You must be logged in to access this page. Click ",
          d.a({
            className: "alert-link",
            key: "link",
            href: "#",
            onClick: function () {
              oauth2.login();
            }
          }, "here"),
          " to log in"
        ],
        level: "warning",
        icon: "exclamation-triangle"
      })
    ]);
  }
});