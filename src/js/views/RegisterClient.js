'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var mdls = require('../Models');
var mbli = require('./MustBeLoggedIn');
var $ = require('jquery');

var d = React.DOM;
var rpt = React.PropTypes;

var util = rbs.util;
var alt = rbs.components.layout.Alert;
var form = rbs.components.model.Form;
var btn = rbs.components.controls.Button;
var bb = rbs.backbone;

var header = util.rf({
  displayName: "Public Application Header",

  mixins: [ rbs.mixins.Model ],

  render: function () {
    var dn = null;
    if (this.state.model.name) {
      dn = " for " + this.state.model.name;
    }

    return d.h2({ className: "page-header", key: "oph" }, [
      "Register a Client",
      d.small({ key: "name" }, dn)
    ]);
  }
});

module.exports = util.rf({
  displayName: "Register Clients",
  getInitialState: function () {
    return {
      pa: new mdls.PublicApplication({ id: this.props.applicationId }),
      newClient: new bb.Model()
    };
  },

  componentDidMount: function () {
    this.state.pa.fetch();
  },

  createClient: function () {
    $.ajax({
      method: "POST",
      url: util.path(config.API_URL, "publicclients"),
      data: JSON.stringify(this.state.newClient.toJSON())
    }).then(_.bind(function () {

    }, this), _.bind(function () {

    }, this));
  },

  render: function () {
    if (!this.props.model.token) {
      return mbli({});
    }

    return d.div({ className: "container" }, [
      // app header
      header({ key: "hdr", model: this.state.pa }),

      // form and info
      d.div({
        key: 'row',
        className: 'row'
      }, [
        // app info
        d.div({ className: 'col-sm-6', key: 'info' }, [
          d.p({ className: 'lead', key: 'info' }, 'Use this form to register a client for this application.')
        ]),

        // form
        d.div({ className: 'col-sm-6', key: 'form' }, form({
          key: "F",
          model: this.state.newClient,
          onSubmit: this.createClient,
          attributes: [
            {
              attribute: "name",
              component: "text",
              label: "Client Name",
              required: true,
              placeholder: "Client Name",
              tip: "Enter the name for your client."
            },
            {
              component: btn,
              caption: "Submit",
              submit: true,
              block: true,
              ajax: true,
              type: "primary",
              icon: "plus"
            }
          ]
        }))
      ])
    ]);
  }
});