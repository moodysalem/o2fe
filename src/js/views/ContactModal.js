'use strict';
var $ = require('jquery');
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var form = rbs.components.model.Form;
var modal = rbs.components.layout.Modal;
var btn = rbs.components.controls.Button;
var alt = rbs.components.layout.Alert;

var util = rbs.util;
var Backbone = rbs.backbone;

var d = React.DOM;
var rpt = React.PropTypes;

var fa = [
  {
    attribute: "name",
    label: "Your Name",
    placeholder: "Your Name",
    tip: "Enter your name.",
    component: "text",
    required: true
  },
  {
    attribute: "email",
    label: "Your E-mail Address",
    placeholder: "Your E-mail Address",
    tip: "Enter your e-mail address if you would like to receive a reply.",
    component: "email",
    required: true
  },
  {
    attribute: "issue",
    label: "Inquiry",
    component: "textarea",
    placeholder: "Your inquiry...",
    tip: "Enter a description of your issue, or ask a question.",
    required: true
  }
];

module.exports = util.rf({
  displayName: "contact modal",

  getInitialState: function () {
    return {
      md: new Backbone.Model(),
      error: null
    };
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextProps.open && !this.props.open) {
      this.setState({
        error: null
      });
      this.state.md.clear();
    }
  },

  render: function () {
    return modal(_.extend({
      title: "Contact Us",
      body: [
        form({
          key: "F",
          ref: "f",
          attributes: fa,
          model: this.state.md,
          onSubmit: _.bind(function () {
            this.setState({
              error: null
            });
            $.ajax({
              url: util.path(config.API_URL, "support"),
              method: "POST",
              contentType: "application/json",
              data: JSON.stringify(this.state.md.toJSON())
            }).then(_.bind(function () {
              // success
              this.props.onClose();
            }, this), _.bind(function () {
              // fail
              this.setState({
                error: alt({
                  key: "alt",
                  level: "warning",
                  icon: "exclamation-triangle",
                  strong: "Error",
                  message: "Failed to send support message."
                })
              });
            }, this));
          }, this)
        }),
        this.state.error
      ],
      footer: [
        btn({
          ajax: true,
          key: "cancel",
          caption: "Cancel",
          onClick: this.props.onClose
        }),
        btn({
          ajax: true,
          key: "send",
          type: "success",
          caption: "Send",
          icon: "envelope",
          onClick: _.bind(function () {
            this.refs.f.submit();
          }, this)
        })
      ]
    }, this.props))
  }
});