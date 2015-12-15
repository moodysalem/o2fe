'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var btn = rbs.components.controls.Button;

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

module.exports = util.rf({
  mixins: [ rbs.mixins.Model ],

  getLogo: function () {
    if (this.state.model.logoUrl !== null) {
      return d.img({ key: "logo", src: this.state.model.logoUrl, alt: this.state.model.name + " Logo" });
    }
    return null;
  },

  render: function () {
    return d.div({ className: "thumbnail" }, [
      this.getLogo(),
      d.div({ className: "caption", key: "c" }, [
        d.h3({ key: "name" }, this.state.model.name),
        d.p({ key: "de" }, this.state.model.description),
        d.p({ key: "btns" }, [
          btn({
            key: "reg",
            icon: "plus",
            caption: "Client",
            type: "primary",
            href: util.path("registerclient", this.state.model.id),
            size: "sm"
          })
        ])
      ])
    ]);
  }
});