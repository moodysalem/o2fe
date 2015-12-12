'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var lw = rbs.components.controls.LoadingWrapper;
var _ = require('underscore');

var util = rbs.util;

var d = React.DOM;
module.exports = util.rf({
  render: function () {
    return lw(_.extend({
      icon: d.div({ className: "loader", style: { width: "30px", height: "30px" } })
    }, this.props), this.props.children);
  }
});