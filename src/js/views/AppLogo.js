'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var btn = rbs.components.controls.Button;

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

module.exports = util.rf({
  displayName: 'Application Logo',

  propTypes: {
    url: rpt.string
  },

  getDefaultProps: function () {
    return {
      url: null
    };
  },

  render: function () {
    var lu = this.props.url;
    if (lu !== null) {
      return d.img({
        key: "logo",
        src: lu,
        alt: m.name + " Logo"
      });
    }
    return d.img({ key: 'lp', src: require('./res/empty-logo.png'), className: 'some-padding quarter-opacity' });
  }
});