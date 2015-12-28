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

  render: function () {
    var m = this.state.model;

    return d.div({ className: "thumbnail" }, [
      require('./AppLogo')({
        key: 'log',
        url: m.logoUrl,
        alt: util.concatWS(' ', m.name, 'Logo')
      }),
      d.div({ className: "caption", key: "c" }, [
        d.h3({ key: "name" }, m.name),
        d.p({ key: "de" }, m.description),
        d.p({ key: "btns", className: 'btn-container' }, [
          btn({
            key: "con",
            icon: "envelope",
            caption: "Contact",
            size: 'sm',
            type: "success",
            href: 'mailto:' + m.supportEmail
          }),
          btn({
            key: "reg",
            icon: "plus",
            caption: "Client",
            type: "primary",
            href: util.path("registerclient", m.id),
            size: "sm"
          })
        ])
      ])
    ]);
  }
});