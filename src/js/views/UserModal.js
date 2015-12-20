'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var modal = rbs.components.layout.Modal;
var form = rbs.components.layout.Form;
var row = rbs.components.model.GridRow;
var btn = rbs.components.controls.Button;
var alerts = rbs.components.collection.Alerts;
var model = rbs.mixins.Model;
var vp = require('./ViewablePassword');

var util = rbs.util;
var d = React.DOM;
var rpt = React.PropTypes;

var nameRow = [
  {
    attribute: "firstName",
    label: "First Name",
    required: true,
    placeholder: "First Name",
    tip: "Enter the user's first name.",
    component: "text",
    sm: 6
  },
  {
    attribute: "lastName",
    label: "Last Name",
    placeholder: "Last Name",
    required: true,
    tip: "Enter the user's last name.",
    component: "text",
    sm: 6
  }
];

module.exports = util.rf({
  displayName: "user modal",

  mixins: [ model ],

  propTypes: {
    onSave: rpt.func
  },

  render: function () {
    var existing = this.state.model.id > 0;

    return modal(_.extend({}, this.props), [
      d.div({ key: "mb", className: "modal-body" }, [
        form({
          key: "mb",
          ref: "f",
          autoComplete: false,
          onSubmit: _.bind(function () {
            this.props.model.save({}, {
              success: this.props.onSave
            });
          }, this)
        }, [
          row({
            key: "e-mail",
            model: this.props.model,
            attributes: [
              {
                attribute: "email",
                label: "E-mail address",
                tip: "Enter the e-mail address of the user.",
                placeholder: "E-mail address",
                component: "email",
                required: true,
                sm: 9,
                readOnly: existing
              },
              {
                attribute: "verified",
                label: "Verified",
                tip: "Whether the e-mail address has been verified.",
                component: require('./OnOffSwitch'),
                sm: 3
              }
            ]
          }),
          row({ key: "name", model: this.props.model, attributes: nameRow }),
          d.hr({ key: "sep" }),
          row({
            key: "password",
            model: this.props.model,
            attributes: [
              {
                attribute: "newPassword",
                label: existing ? "New Password" : "Password",
                placeholder: existing ? "New Password" : "Password",
                tip: "Enter a password to be assigned to the user." + (existing ? " Leave blank to leave password unchanged." : ""),
                component: vp,
                xs: 12,
                required: !existing
              }
            ]
          })
        ]),
        alerts({ key: "alts", watch: this.props.model, showSuccess: false })
      ]),
      d.div({ key: "mf", className: "modal-footer" }, [
        btn({
          key: "c",
          caption: "Cancel",
          onClick: this.props.onClose
        }),
        btn({
          key: "b",
          icon: "plus",
          type: "success",
          caption: "Save",
          onClick: _.bind(function () {
            this.refs.f.submit();
          }, this)
        })
      ])
    ]);
  }
});