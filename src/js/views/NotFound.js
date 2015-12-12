define(function(require, exports, module){
  'use strict';
  var React = require('react');
  var rbs = require('react-backstrap');
    var util = rbs.util;

  var d = React.DOM;

  module.exports = util.rf({
    render: function () {
      return d.div({
        className: "container"
      }, [
        d.h3({
          key: "h1",
          className: "page-header"
        }, "404: Not Found"),
        d.p({
          key: "p",
          className: "lead"
        }, "The page you have requested is not found.")
      ])
    }
  });
});