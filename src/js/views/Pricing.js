'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var btn = rbs.components.controls.Button;
var cm = require('./ContactModal');

var util = rbs.util;
var d = React.DOM;
var rpt = React.PropTypes;

module.exports = util.rf({
  displayName: "Pricing",

  getInitialState: function () {
    return {
      contactOpen: false
    };
  },

  openContact: function () {
    this.setState({
      contactOpen: true
    });
  },

  closeContact: function () {
    this.setState({
      contactOpen: false
    });
  },

  render: function () {
    return d.div({ className: "container" }, [
      d.h2({ key: "h2", className: "page-header" }, [
        btn({
          type: "success",
          key: "cu",
          caption: "Contact Us",
          icon: "question",
          size: "sm",
          className: "pull-right",
          onClick: this.openContact
        }),
        "Pricing"
      ]),
      d.p({ key: "lead", className: "lead" }, [
        "Billing is calculated at a flat rate of 1,000 OAuth2 API calls per dollar."
      ]),
      d.p({ key: "more" }, [
        "Calls to the administrative API to manage users, clients, scopes or tokens are excluded. " +
        "Each Application gets 10,000 free calls per month. Bills are calculated on the first of each month."
      ]),
      cm({ key: "cm", open: this.state.contactOpen, onClose: this.closeContact })
    ]);
  }
});