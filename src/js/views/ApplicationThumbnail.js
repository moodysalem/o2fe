var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;
var buttons = require('./ApplicationButtons');

module.exports = util.rf({
  displayName: "Application Thumbnail",

  mixins: [ rbs.mixins.Model ],

  getImage: function () {
    var m = this.state.model;
    if (m.logoUrl !== null) {
      return d.img({
        key: "logo",
        src: m.logoUrl,
        alt: m.name + " logo"
      });
    }
    return null;
  },

  render: function () {
    var m = this.state.model;

    return d.div({ className: "application-thumbnail thumbnail" }, [
      this.getImage(),
      d.div({ key: "cap", className: "caption" }, [
        d.h3({ key: "name" }, m.name),
        d.p({ key: "descrip" }, m.description),
        buttons({
          key: "btns",
          model: this.props.model
        })
      ])
    ]);
  }
});